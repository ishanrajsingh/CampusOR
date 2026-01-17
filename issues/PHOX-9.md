# Queue Join Rate Limiting & Abuse Prevention
## Type
Security/Performance

## Description
Users can attempt to join queues or rejoin after leaving repeatedly without any cooldown or time limit. This can lead to:
Artificial queue inflation by repeatedly joining<br>
Accidental or intentional spamming<br>
higher backend load during crowded hours<br>

## Why this matters
Prevents accidental queue abuse<br>
Protects system stability under high concurrency<br>
Ensures fair access to time slots.
