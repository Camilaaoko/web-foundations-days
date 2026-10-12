# SnapShare - System Scaling Plan

## 1. Assumptions & Core Statistics
- **Total Registered Users:** 10,000,000
- **Activity Rate:** 10% active daily
- **Daily Active Users (DAU):** 1,000,000 ($10,000,000 \times 0.10$)
- **Uploads per Active User:** 1 photo per day
- **Feed Views per Active User:** 50 feed pages per day
- **Photo Size:** 2 MB average
- **Thumbnail Size:** 50 KB

---

## 2. Back-of-the-Envelope Calculations

### Uploads (Writes) per Second
- Total daily uploads: $1,000,000 \text{ photos/day}$
- Seconds in a day: $86,400 \text{ seconds}$
- **Average Uploads/sec:** $1,000,000 / 86,400 \approx 11.57 \text{ writes/sec}$
- **Peak Uploads/sec ($5\times$):** $\approx 58 \text{ writes/sec}$

### Feed Views (Reads) per Second
- Total daily feed views: $1,000,000 \text{ users} \times 50 \text{ views} = 50,000,000 \text{ views/day}$
- **Average Feed Views/sec:** $50,000,000 / 86,400 \approx 578.7 \text{ reads/sec}$
- **Peak Feed Views/sec ($5\times$):** $\approx 2,893 \text{ reads/sec}$

### Storage per Year
- Daily photo storage: $1,000,000 \text{ photos} \times 2 \text{ MB} = 2,000,000 \text{ MB/day} = 2 \text{ TB/day}$
- Daily thumbnail storage: $1,000,000 \times 50 \text{ KB} \approx 50 \text{ GB/day}$
- **Total Annual Storage:** $(2 \text{ TB} + 0.05 \text{ TB}) \times 365 \text{ days} \approx 748.25 \text{ TB/year}$

---

## 3. System Load Characteristics
**The system is heavily read-heavy.** With nearly 2,900 peak reads per second compared to only 58 peak writes per second, the architecture prioritizes fast read performance, aggressive caching, and efficient media delivery via CDNs.

---

## 4. Why Photos Don't Belong in the Database
Relational databases are optimized for structured tabular data, indexing, and transactional integrity (ACID). Storing large binary blobs (like 2 MB photos) directly inside a database bloats table sizes, slows down queries, increases backup times, and exhausts storage memory. Instead, binary files are stored in **Object Storage**, while the database only stores lightweight metadata (image URLs, timestamps, and user IDs).

---

## 5. Architecture Diagram
```text
[Client / Mobile App]
         │
         ▼
     [  CDN  ] ─── (Caches static assets & thumbnails)
         │
         ▼
[ Load Balancer ] 
         │
         ├──► [ App Server 1 ] ◄──► [ Cache (Redis) ]
         │         │
         │         ├──► [ Primary DB (Writes) ]
         │         │         │
         │         │         ▼
         │         └──► [ Read Replica (Reads) ]
         │
         └──► [ Message Queue (RabbitMQ / SQS) ] ──► [ Background Worker ] ──► [ Thumbnail Generator ]
                                                                                       │
                                                                                       ▼
                                                                            [ Object Storage (S3) ]

6. Component Explanations
CDN (Content Delivery Network): Caches and delivers static photos and thumbnails from edge locations close to users to minimize latency.

Load Balancer: Distributes incoming client traffic evenly across multiple application servers to prevent single points of failure.

App Servers: Stateless backend servers that process API requests, authentication, and routing logic.

Cache (Redis): Stores frequently accessed data in memory to reduce database load.

Primary Database & Read Replica: Primary handles write operations, while read replicas handle heavy feed queries.

Message Queue & Worker: Decouples heavy tasks from the main request thread, enabling asynchronous background processing.

Object Storage: Specialized cloud storage designed to securely hold large binary photo and thumbnail files.

7. Step-by-Step Upload Walkthrough & Queue Integration
Client Request: The user selects an image and sends a POST request with the photo binary to the Load Balancer.

Routing: The Load Balancer forwards the request to an available App Server.

Object Storage Upload: The App Server uploads the raw, full-sized image directly into Object Storage and receives a storage URL.

Metadata Save: The App Server saves image metadata (caption, storage URL, user ID) into the Primary Database.

Queue Offloading: Rather than forcing the client to wait while generating thumbnails, the App Server pushes a background job payload (containing the photo ID and file path) to the Message Queue and immediately returns a 201 Created success response to the client.

Background Worker Processing: A background Worker pulls the job from the message queue, downloads the raw image from Object Storage, runs it through the Thumbnail Generator to create a compressed 50 KB version, and uploads the thumbnail back to Object Storage.

8. Architectural Trade-Offs
Consistency vs. Availability (Eventual Consistency for Feeds): Using background queues and read replicas means followers might experience a brief replication delay before seeing a newly uploaded photo, but it ensures high write availability and prevents application bottlenecks.

Storage Cost vs. User Experience (Dual Image Storage): Storing both original photos and compressed thumbnails increases cloud storage costs, but it drastically reduces mobile data consumption and page load times when browsing feeds.