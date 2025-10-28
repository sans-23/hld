
# System Design: Handling Duplicate Requests with Idempotency Handler

## 1. Idempotency vs Concurrency

- **Idempotency:** Ensures that repeated execution of the same operation (e.g., due to retry or network failure) has exactly one effect and does not create unintended side effects.
- **Concurrency:** Manages access to shared resources by multiple users or threads at the same time.

## 2. Idempotency Across HTTP Methods

- **GET/PUT/DELETE:** Naturally idempotent (repeated requests do not change the state further).
- **POST:** Not inherently idempotent. Needs special mechanisms to ensure that repeated POSTs (like payment or resource creation) do not result in duplicate side effects.

## 3. Causes of Duplicate Requests

- **Network timeout:** Client retries after server times out, possibly causing repeated processing.
- **Multiple client submissions:** Double-clicks, resubmissions.
- **Parallel requests:** Same operation sent from different clients or threads, possibly landing on different server instances.

## 4. Core Design Pattern: Idempotency Key

**Client:**
- Generates a unique idempotency key (UUID, hash of operation parameters)
- Adds key to headers in POST request

**Server:**
1. Checks for idempotency key in incoming request
        - If key missing: return error (`400 Bad Request`)
        - If key present:
                - Query data store for transaction/results with this key
                        - If not found:
                                - Process request, store idempotency key and result/status
                                - Return success (`201 Created`)
                        - If found:
                                - If status = completed: return stored result (`200 OK`)
                                - If status = pending: return conflict (`409 Conflict`), ask client to retry later

## 5. Example: Add Item to Cart

```python
def add_item_to_cart(user_id, item_id, idempotency_key):
        existing = db.query(
                "SELECT status, result FROM idempotency WHERE key = ?", (idempotency_key,)
        )

    if existing:
        status, result = existing
        if status == "completed":
            return result  # Item successfully added, prevent duplicate
        elif status == "pending":
            return {"error": "Request is being processed"}, 409
    else:
        try:
            db.execute(
                "INSERT INTO idempotency (key, status) VALUES (?, 'pending')",
                (idempotency_key,)
            )
            cart_add_result = add_to_cart(user_id, item_id)
            db.execute(
                "UPDATE idempotency SET status='completed', result=? WHERE key=?",
                (cart_add_result, idempotency_key)
            )
            return cart_add_result
        except Exception as e:
            db.execute(
                "UPDATE idempotency SET status='error', result=? WHERE key=?",
                (str(e), idempotency_key)
            )
            raise
```

## 6. Parallel Requests & Critical Section

- Use mutexes/distributed locks on idempotency key to prevent concurrent duplicate processing.
- Cache can be leveraged for faster lookup and synchronization across multiple server instances (reduces DB latency).

## 7. Response Codes

- `200 OK`: Idempotent request already completed; return prior result.
- `201 Created`: Successful creation on first execution.
- `409 Conflict`: Request is currently being processed (parallel execution).
- `400 Bad Request`: Missing idempotency header.

## 8. High Availability / Distributed Servers

- Use distributed cache (Redis/Memcached) and consistent hashing so all server instances validate and synchronize on idempotency keys—enabling correct behavior even in multi-server deployments.

## 9. Key Concepts to Remember

- Client-generated keys must be unique per logical operation.
- Result and status must be persisted and queried before execution.
- Concurrency and parallel requests require robust sectioning/locking around idempotency key handling.
- Always simulate duplicate requests and concurrent scenarios in tests.

## 10. Interview-Ready Summary Table

| Concept           | Mechanism                        | Example Implementation           |
|-------------------|----------------------------------|----------------------------------|
| Idempotency Key   | Client-generated + request header| UUID attached to POST            |
| Status Persistence| DB or cache mapping key to status| SQL/Redis                        |
| Duplicate Handling| Lookup before mutation           | Return cached result if duplicate |
| Parallel Requests | Mutex/locking around the key     | Lock, then process, then release |
| Error Handling    | Proper response codes on issues  | 200, 201, 409, 400               |

---

This succinct breakdown encapsulates both the theory and practical system design flow for idempotency handlers as described in your referenced video.
