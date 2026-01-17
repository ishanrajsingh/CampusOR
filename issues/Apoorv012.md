# Following are the bugs and enhancements needed in the project

## Issue 1: User Queue History — Review & Corrections
Currently, the user queue history endpoint `/api/user-status/history` only stores the queueId, but it should actually store multiple other information.

### Type
Bug

### Description
Currently it only stores `queueId`, but the frontend needs:
- `id`
- `queueId`
- `queueName`
- `location`
- `tokenNumber`
- `joinedAt`
- `cancelledAt`
- `status`
- `waitTime` (computed or persisted)

### Why this matters
For the users, they would not be able to see the actual history, rather they are just able to see what all queues they have been... only the id's of them.
So, actually being able to see, how much time we spent waiting in that particular queue. Did we later decide to skip it, or were we served.

### Suggested Scope (optional)
Backend / DB

### Notes (optional)
We could derive some of this information using runtime aggregations (e.g., `$lookup`),
but relying on cross-collection joins at read time increases query complexity,
hurts performance at scale, and weakens horizontal scalability.

For user-facing history, this data should be denormalized and stored
at the time of the event.


## Issue 2: Backend Routing Refactoring
The routing in backend, is not done properly, and is not very modular. There is a need to refactor the code into more diverse files, resulting in smaller files, with better focused information...

### Type
Enhacement (Developer Experience)

### Description
Currently the backend is quite cluttered.
There are 2 files in routes:
- `index.ts` # this should remain here
- `health.ts` — this should be routed via `index.ts` and either:
  - live inside a dedicated `health` module, or
  - be an inline handler, since it is a trivial endpoint

Other than that, there are modules like `fetchQueueData`, `operator`, `queue`, `updateUserStatus`.
These module names do not clearly communicate responsibility or ownership of routes.
Getting the `history` might be present anywhere. It could be in `queue`, it could be in `fetchQueueData`.
But, user history endpoints being located inside `updateUserStatus` is non-intuitive and increases cognitive load.

This, and many other endpoints needs to be refactored into better named files and folders.

Also, currently the `backend/src/modules/updateUserStatus/userStatus.service.ts` is like `373 lines`.
So making this modular is very needed, for better developer experience.

### Why this matters
For the developers, to write integrations from backend to frontend. It is really hard to find the endpoind just by looking, instead the need to follow the trail of imports.
It would be really good if we could just look at the name, and make an educated guess on where that endpoint must be residing.

### Suggested Scope (optional)
Backend

### Proposed Solution
A domain-based folder structure (e.g. `user`, `queue`, `operator`, `health`) with clearly named `controller`, `service`, and `repository` layers would significantly improve discoverability and maintainability.

