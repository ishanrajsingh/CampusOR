import { getRedisClient, isRedisReady } from "../../../config/redis.js";
import { env } from "../../../config/env.js";

/**
 * Redis Key Structure:
 * - user:{userId}:queue:{queueId}:lastJoin -> timestamp (TTL: COOLDOWN_SECONDS)
 * - user:{userId}:joinCount:minute -> count (TTL: 60s)
 * - user:{userId}:joinCount:hour -> count (TTL: 3600s)
 */

// Redis key generators
const lastJoinKey = (userId: string, queueId: string) =>
    `user:${userId}:queue:${queueId}:lastJoin`;
const minuteCountKey = (userId: string) => `user:${userId}:joinCount:minute`;
const hourCountKey = (userId: string) => `user:${userId}:joinCount:hour`;

export interface RateLimitResult {
    allowed: boolean;
    message?: string;
    retryAfterSeconds?: number;
}

const isAvailable = (): boolean => {
    return !!getRedisClient() && isRedisReady();
};

/**
 * Check all rate limits for a user attempting to join a queue.
 * Returns allowed: true if Redis is unavailable (fail-open design).
 */
export async function checkRateLimits(
    userId: string,
    queueId: string
): Promise<RateLimitResult> {
    // Fail-open: if Redis unavailable, allow the join
    if (!isAvailable()) {
        console.warn("[RateLimit] Redis unavailable, allowing join (fail-open)");
        return { allowed: true };
    }

    try {
        const redis = getRedisClient();
        if (!redis) {
            return { allowed: true };
        }

        // 1. Check per-queue cooldown
        const lastJoinTimestamp = await redis.get(lastJoinKey(userId, queueId));
        if (lastJoinTimestamp) {
            const lastJoinTime = parseInt(lastJoinTimestamp, 10);
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - lastJoinTime) / 1000);
            const remainingSeconds = env.QUEUE_JOIN_COOLDOWN_SECONDS - elapsedSeconds;

            if (remainingSeconds > 0) {
                console.info(
                    `[RateLimit] User ${userId} blocked: cooldown for queue ${queueId}, ${remainingSeconds}s remaining`
                );
                return {
                    allowed: false,
                    message: `Please wait ${remainingSeconds} seconds before rejoining this queue.`,
                    retryAfterSeconds: remainingSeconds,
                };
            }
        }

        // 2. Check per-minute rate limit
        const minuteCountStr = await redis.get(minuteCountKey(userId));
        const minuteCount = minuteCountStr ? parseInt(minuteCountStr, 10) : 0;

        if (minuteCount >= env.QUEUE_JOIN_RATE_LIMIT_PER_MIN) {
            const ttl = await redis.ttl(minuteCountKey(userId));
            const retryAfter = ttl > 0 ? ttl : 60;
            console.info(
                `[RateLimit] User ${userId} blocked: per-minute limit reached (${minuteCount}/${env.QUEUE_JOIN_RATE_LIMIT_PER_MIN})`
            );
            return {
                allowed: false,
                message: `You've joined too many queues. Please wait ${retryAfter} seconds.`,
                retryAfterSeconds: retryAfter,
            };
        }

        // 3. Check per-hour rate limit
        const hourCountStr = await redis.get(hourCountKey(userId));
        const hourCount = hourCountStr ? parseInt(hourCountStr, 10) : 0;

        if (hourCount >= env.QUEUE_JOIN_RATE_LIMIT_PER_HOUR) {
            const ttl = await redis.ttl(hourCountKey(userId));
            const retryAfterMinutes = Math.ceil((ttl > 0 ? ttl : 3600) / 60);
            console.info(
                `[RateLimit] User ${userId} blocked: per-hour limit reached (${hourCount}/${env.QUEUE_JOIN_RATE_LIMIT_PER_HOUR})`
            );
            return {
                allowed: false,
                message: `Hourly queue join limit reached. Please try again in ${retryAfterMinutes} minutes.`,
                retryAfterSeconds: ttl > 0 ? ttl : 3600,
            };
        }

        // All checks passed
        return { allowed: true };
    } catch (error) {
        // On error, fail-open to not block legitimate users
        console.warn("[RateLimit] Error checking rate limits, allowing join:", error);
        return { allowed: true };
    }
}

/**
 * Record a successful queue join for rate limiting purposes.
 */
export async function recordJoin(
    userId: string,
    queueId: string
): Promise<void> {
    if (!isAvailable()) {
        return;
    }

    try {
        const redis = getRedisClient();
        if (!redis) {
            return;
        }

        const now = Date.now();
        const pipeline = redis.pipeline();

        // Set per-queue cooldown
        pipeline.set(
            lastJoinKey(userId, queueId),
            now.toString(),
            "EX",
            env.QUEUE_JOIN_COOLDOWN_SECONDS
        );

        // Increment per-minute counter
        pipeline.incr(minuteCountKey(userId));
        pipeline.expire(minuteCountKey(userId), 60);

        // Increment per-hour counter
        pipeline.incr(hourCountKey(userId));
        pipeline.expire(hourCountKey(userId), 3600);

        await pipeline.exec();
        console.info(
            `[RateLimit] Recorded join for user ${userId} in queue ${queueId}`
        );
    } catch (error) {
        // Non-critical: log and continue
        console.warn("[RateLimit] Error recording join:", error);
    }
}
