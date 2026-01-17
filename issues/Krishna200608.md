# Following are the bugs and enhancements needed in the project

## Issue 1: Improve Queue Status Visibility

### Type
UX / Enhancement

### Description
Users currently lack clear, real-time feedback about their queue position and expected wait. Enhance the dashboard and kiosk views with a dynamic queue status component that displays:
- User's current position in the queue
- Estimated wait time (leveraging ML predictions)
- Live updates as the queue advances or changes
- Visual cues (progress bar, color changes) for approaching turn
This should be highly visible and update automatically without page refresh.

### Why this matters
Clear, real-time status reduces user anxiety, increases trust, and improves satisfaction. Operators also benefit from fewer status queries and smoother queue management.

### Suggested Scope
Frontend / Backend / ML

---


## Issue 2: Operator Notification for Idle Counters

### Type
Feature / UX

### Description
Implement a system to detect when an operator's counter has been idle (no tokens served) for a configurable duration. Trigger a notification (dashboard alert, email, or push notification) to prompt the operator to resume service or mark the counter as unavailable. Include a summary of idle counters in the admin dashboard for oversight.

### Why this matters
Reduces service bottlenecks, ensures counters are attended, and helps maintain optimal throughput. Proactive alerts prevent unnoticed downtime and improve user experience.

### Suggested Scope
Backend / Frontend

---


## Issue 3: Add API Rate Limiting

### Type
Enhancement / Performance / Security

### Description
Introduce API rate limiting middleware to restrict the number of requests per user/IP for sensitive and public endpoints (e.g., queue join, login, registration). Provide clear error messages when limits are exceeded. Make rate limits configurable for different environments (dev, prod).

### Why this matters
Prevents abuse, accidental overload, and denial-of-service attacks. Ensures fair usage and keeps backend services stable and responsive for all users.

### Suggested Scope
Backend

---


## Issue 4: Improve Error Feedback for Users

### Type
UX / Enhancement

### Description
Replace generic or technical error messages with clear, actionable feedback for common user-facing issues (e.g., queue full, invalid/expired token, network problems, server errors). Use toast notifications or inline alerts, and provide suggestions for next steps or recovery where possible.

### Why this matters
Reduces user frustration, increases usability, and helps users resolve issues independently, leading to higher retention and satisfaction.

### Suggested Scope
Frontend

---


## Issue 5: Add Contributor Recognition Page

### Type
Feature / Docs

### Description
Develop a dedicated page or section in the app to highlight project contributors. Display names, GitHub profiles, and optionally their specific contributions or roles. Pull data from contributors.md or GitHub API for automation. Encourage new contributors by making recognition visible and accessible.

### Why this matters
Fosters a positive open-source culture, motivates ongoing contributions, and publicly acknowledges community effort.

### Suggested Scope
Frontend / Docs

---


## Notes
- Prioritize issues that improve user trust, transparency, and system reliability.
- Some enhancements may require coordination between frontend, backend, and ML teams.
- Consider adding automated tests and documentation as part of each enhancement.
