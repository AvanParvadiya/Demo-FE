# System Design: Scaling the Audit FIS Platform Guideline

## Current State & Bottlenecks
Right now, Code is running as a classic **monolith**. We've got a single NestJS backend handling everything: registration flow, OTP generation, and the auditor directory. It's backed by a single PostgreSQL instance. 

While this works great for the MVP, we’ll hit some walls as we move past a few hundred concurrent users:
*   **The In-Memory Trap**: Our OTPs are currently stored in a simple JS `Map`. If the server restarts, everyone's active OTPs vanish. More importantly, we can't spin up a second server instance because they won't share that Map.
*   **Blocking Mail Operations**: We're simulating email sends right now, but once we hook up a real provider (like SendGrid), those network calls will add latency to our main API response.
*   **DB Saturation**: The `/users` directory is basically just a big read operation. As traffic grows, hitting the primary database for every single page load will slow down the registration writes.

---

## The Roadmap: Thousands to Millions

Here’s how I’d evolve the infrastructure without needing to throw away the current code.

### 1. The "Quick Win": Moving to Stateless
First thing is getting out of the in-memory state. I’d drop **Redis** into the stack. 
*   **Why**: It handles the OTP storage with automatic TTL (expiry). 
*   **Impact**: This makes our NestJS processes "stateless." We can then stick a **Load Balancer** (like Nginx or an AWS ALB) in front and spin up 3, 5, or 10 backend instances without worrying about which server a user "belongs" to.

### 2. Offloading the Heavy Lifting (Queues)
Once we have Redis, we should stop sending emails "inline." Instead, the API should just drop a "SendEmail" job into a queue and return `202 Accepted` to the user immediately.

**The Choice**: 
*   For our current scale, **BullMQ** is the obvious choice. It runs on the Redis instance we already have, so there's no new infra to manage. 
*   I’d avoid **Kafka** for this. It’s a beast to manage and complete overkill for sending 6-digit codes. Kafka is for event streams; we just need a reliable job queue.

### 3. Protecting the Database
As the auditor directory grows, we need to stop the "Read vs Write" fight in PostgreSQL.
*   **Read Replicas**: I’d set up a follower database. 90% of our traffic (viewing auditors) goes to the replica. Our 10% (registration) goes to the primary. 
*   **Edge Caching**: For the landing page and the directory, we can use a **CDN** (CloudFront/Vercel) to cache those JSON responses at the edge for 30-60 seconds. This means thousands of users can "View Auditors" without our database even waking up.

### 4. Moving to Millions (The "Big League" Move)
At this scale, the "Users" module starts becoming its own world.
*   **Microservice Split**: I’d eventually pull the "Notification/OTP" logic out into its own service. It scales differently than the registration logic.
*   **Managed DBs**: I’d move to something like **AWS Aurora** or **Google Cloud Spanner**. They handle the auto-scaling of storage and replicas far better than a hand-rolled Postgres setup.
*   **API Gateway**: Stick something like **Kong** or **AWS Gateway** in front to handle rate limiting. We don't want one script-kiddie spamming our OTP endpoint and running up our SMS/Email bill.

---

## Summary of Evolution

| Traffic Scale | Technical Focus | Rationale |
| :--- | :--- | :--- |
| **Early Days (~1k)** | Redis + Load Balancer | High Availability & Statelessness. |
| **Growth (~100k)** | Read Replicas + BullMQ | Decoupling slow I/O and protecting DB performance. |
| **Massive (~1M+)** | Microservices + API Gateway | Organizational scaling and cost/abuse control. |

**Final Architect Note**: The beauty of using NestJS's modular structure (`UsersModule`) is that we don't have to rewrite the logic. We just change the **Repository** implementation to hit a replica, or update the **Service** to push to a queue instead of a Map. The "business" code stays clean.
