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
**The system is heavily read-heavy.** With nearly 2,900 peak reads per second compared to only 58 peak writes per second, the architecture must prioritize fast read performance, aggressive caching, and efficient media delivery (CDNs) rather than complex write scaling.

---

## 4. Why Photos Don't Belong in the Database
Relational databases are optimized for structured tabular data, fast indexing, and transactional integrity (ACID). Storing large binary blobs (like 2 MB photos) directly inside a database bloats table sizes, slows down queries, increases backup times, and rapidly exhausts storage memory. Instead, binary files are stored in **Object Storage**, while the database only stores lightweight metadata (image URLs, upload timestamps, and user IDs).

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
         └──► [ Message Queue (RabbitMQ / SQS) ] ──► [ Worker ] ──► [ Thumbnail Generator ]
                                                                             │
                                                                             ▼
                                                                  [ Object Storage (S3) ]