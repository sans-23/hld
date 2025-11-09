# Two-Phase Locking (2PL) - Complete Guide

**Created:** November 4, 2025
**Topic:** Concurrency Control in Distributed Systems
**Level:** System Design - Advanced

---

## 1. The Fundamental Problem

### Scenario: Flight Booking System

**Components:**
* Booking Service
* Payment Service
* Inventory Service

**Problem:** Flight XYZ has only **1 seat left**. Alice and Bob try to book simultaneously.

| Time | Alice's Transaction | Bob's Transaction |
| :--- | :--- | :--- |
| T1 | Read: 1 seat available | |
| T2 | | Read: 1 seat available |
| T3 | Check payment: $500 OK | |
| T4 | | Check payment: $500 OK |
| T5 | Book seat (1 -> 0) | |
| T6 | | Book seat (0 -> -1) ❌ DISASTER! |
| T7 | Commit ✅ | |
| T8 | | Commit ✅ |

**Result: OVERBOOKED FLIGHT! 💥**

### Why This Happens: "Lost Update Problem"

Both transactions:
1.  Read the same data (1 seat available)
2.  Made decisions based on **stale data**
3.  Overwrote each other's changes
4.  **No coordination** between them

### Other Concurrency Problems

| Problem | Description | Example |
| :--- | :--- | :--- |
| **Dirty Read** | Reading uncommitted data | T1 writes qty=0, crashes before commit; T2 reads qty=0 (invalid!) |
| **Non-Repeatable Read** | Same query returns different results | T1 reads qty=5 twice, but T2 updated it to 3 in between |
| **Phantom Read** | New rows appear in range queries | T1 counts 10 orders, T2 inserts 1, T1 counts again -> 11 |
| **Lost Update** | Concurrent writes overwrite each other | Both Alice and Bob update balance, one update is lost |

---

## What is 2PL?

**Two-Phase Locking:** A concurrency control protocol that ensures transactions don't interfere with each other by acquiring and releasing locks in two distinct phases.

### The Two Phases

#### Phase 1: Growing Phase (Lock Acquisition) 🟩
* **Can:** Acquire locks (shared or exclusive)
* **Cannot:** Release any locks
* **Rule:** Once you release even ONE lock, this phase ends forever

#### Phase 2: Shrinking Phase (Lock Release) 🟥
* **Can:** Release locks
* **Cannot:** Acquire new locks
* **Rule:** Once you start releasing, no going back!

### Analogy: Library Books

**Growing Phase:**
"I need these 5 books for my research"
* Check out Book 1 ✅
* Check out Book 2 ✅
* Check out Book 3 ✅
* Check out Book 4 ✅
* Check out Book 5 ✅

Cannot return any book yet!

**Shrinking Phase:**
"I'm done with my research, returning books"
* Return Book 1 ✅
* Return Book 2 ✅
* Return Book 3 ✅
* Return Book 4 ✅
* Return Book 5 ✅

Cannot check out any new books now!

### Lock Types

#### 1. Shared Lock (S-Lock) / Read Lock
* Multiple transactions can hold S-Lock on same data
* Purpose: Reading data
* Symbol: `S(X)` = Shared lock on X
* **Example:**
    * `T1: S-Lock(balance) -> Read balance -> Others can also read`
    * `T2: S-Lock(balance) -> Read balance -> Allowed! ✅`
    * `T3: X-Lock(balance) -> Write balance -> BLOCKED! ❌ Must wait`

#### 2. Exclusive Lock (X-Lock) / Write Lock
* Only ONE transaction can hold X-Lock on data
* Purpose: Writing data
* Symbol: `X(X)` = Exclusive lock on X
* **Example:**
    * `T1: X-Lock(balance) -> Update balance -> Nobody else allowed`
    * `T2: S-Lock(balance) -> Read balance -> BLOCKED! ❌ Must wait`
    * `T3: X-Lock(balance) -> Write balance -> BLOCKED! ❌ Must wait`

### Lock Compatibility Matrix

| | **Requested Lock** | |
| :--- | :---: | :---: |
| **Existing** | **S-Lock** | **X-Lock** |
| **S-Lock** | ✅ | ❌ |
| **X-Lock** | ❌ | ❌ |

**Key Insights:**
* Multiple readers can coexist (S + S)
* Reader + Writer conflict (S + X)
* Writer + Writer conflict (X + X)

---

## How 2PL Works

### Example: Flight Booking Fixed with 2PL

| Time | Alice's Transaction | Bob's Transaction |
| :--- | :--- | :--- |
| T1 | `BEGIN TRANSACTION` | |
| T2 | `X-LOCK(seat_count) <- Growing` | |
| T3 | Read: 1 seat available | |
| T4 | | `BEGIN TRANSACTION` |
| T5 | | `X-LOCK(seat_count)` ⏳ WAITING! |
| T6 | Validate payment: $500 OK | Still waiting... |
| T7 | Update: seat_count = 0 | Still waiting... |
| T8 | `UNLOCK(seat_count) <- Shrinking` | Still waiting... |
| T9 | `COMMIT` ✅ | Still waiting... |
| T10 | | X-LOCK acquired! ✅ |
| T11 | | Read: 0 seats available |
| T12 | | Cannot book! Show error |
| T13 | | `UNLOCK(seat_count)` |
| T14 | | `COMMIT` |

**Result: Alice got the seat, Bob got proper error. ✅**

### Code Example: PostgreSQL

```sql
-- Alice's Transaction
BEGIN;

-- Growing Phase: Acquire exclusive lock
SELECT available_seats
FROM flights
WHERE flight_id = 'XYZ123'
FOR UPDATE; -- X-Lock acquired!

-- Still in Growing Phase: can acquire more locks
SELECT balance
FROM user_wallet
WHERE user_id = 'alice'
FOR UPDATE; -- Another X-Lock!

-- Perform business logic
UPDATE flights
SET available_seats = available_seats - 1
WHERE flight_id = 'XYZ123';

UPDATE user_wallet
SET balance = balance - 500
WHERE user_id = 'alice';

-- Shrinking Phase begins here
COMMIT; -- All locks released

-- Cannot acquire new locks after COMMIT!

Code Example: MySQL InnoDB

-- Bob's Transaction (runs simultaneously with Alice's)
START TRANSACTION;

-- Tries to acquire lock
SELECT available_seats
FROM flights
WHERE flight_id = 'XYZ123'
FOR UPDATE;

-- ⏳ WAITING... blocked by Alice's X-Lock
-- InnoDB waits for innodb_lock_wait_timeout (default: 50 seconds)

-- Once Alice commits, lock is released
-- Bob's query returns: available_seats = 0

-- Bob sees no seats available
IF available_seats = 0 THEN
  ROLLBACK; -- No booking possible
  RETURN 'Flight full';
END IF;

COMMIT;
```


### 2PL in Distributed Systems
The Challenge
In microservices, each service has its own database:

[ Payment Service ] [ Inventory Service ] [ Order Service ] ( (Database 1) ) ( (Database 2) ) ( (Database 3) )

Problem: How do you coordinate locks across separate databases?

Solution 1: Distributed 2PL with 2PC (Two-Phase Commit)
Architecture


COORDINATOR (Order Service)
 /        |        \
/         |         \
/ |

Payment DB Inventory DB Order DB

### Two-Phase Commit Protocol
#### Phase 1: PREPARE (Voting Phase)

Time	Coordinator	Participants
T1	Write to log: "BEGIN 2PC"	
T2	Send PREPARE to all	
T3		Payment: LOCK(user_balance)
T4		Payment: Validate: OK ✅
T5		Payment: Write to log: "READY"
T6		Payment: Reply: VOTE_COMMIT
T7		Inventory: LOCK(product_stock)
T8		Inventory: Validate: OK ✅
T9		Inventory: Write to log: "READY"
T10		Inventory: Reply: VOTE_COMMIT
T11		Order: LOCK(order_id)
T12		Order: Write to log: "READY"
T13		Order: Reply: VOTE_COMMIT
T14	Collect all votes	
T15	All voted COMMIT? ✅	
T16	Write to log: "COMMIT"


#### Phase 2: COMMIT (Decision Phase)

| T17 | Send COMMIT to all | | | T18 | | Payment: Deduct $900 | | T19 | | Payment: UNLOCK(user_balance) | | T20 | | Payment: COMMIT | | T21 | | Payment: Reply: ACK | | T22 | | Inventory: Reduce stock | | T23 | | Inventory: UNLOCK(product_stock) | | T24 | | Inventory: COMMIT | | T25 | | Inventory: Reply: ACK | | T26 | | Order: Create order | | T27 | | Order: UNLOCK(order_id) | | T28 | | Order: COMMIT | | T29 | | Order: Reply: ACK | | T30 | Write to log: "COMPLETE" | | | T31 | Transaction SUCCESS! ✅ | |

#### Abort Scenario


TimeCoordinatorParticipantsT1Send PREPARE to allT2Payment: LOCK(user_balance)T3Payment: Check: balance = $100 ❌T4Payment: Insufficient funds!T5Payment: Reply: VOTE_ABORTT6Received ABORT voteT7Write to log: "ABORT"T8Send ROLLBACK to allT9Payment: UNLOCK(user_balance)T10Payment: ROLLBACKT11Inventory: UNLOCK(product_stock)T12Inventory: ROLLBACKT13Order: UNLOCK(order_id)T14Order: ROLLBACKT15Transaction FAILED ❌Critical Problem: Coordinator CrashScenario:Coordinator sends PREPAREAll participants lock resources and vote COMMITCOORDINATOR CRASHES before sending COMMIT/ROLLBACKPARTICIPANTS are stuck holding locks! -> BLOCKING PROBLEMSolution A: Timeout + AbortParticipants timeout after X secondsAssume coordinator crashedABORT and release locksSolution B: Write-Ahead LoggingCoordinator logs every step to diskOn restart, read logIf log shows "COMMIT" decision -> complete COMMITIf log incomplete -> ABORTSolution C: 3PC (Three-Phase Commit)Adds "PRE-COMMIT" phaseParticipants know coordinator decided COMMITCan complete without coordinator (non-blocking)2PC Pros & ConsPros:✅ Strong consistency (ACID across services)✅ All-or-nothing guarantee✅ No lost updatesCons:❌ Blocking: Participants hold locks during network delay❌ Slow: Multiple round-trips required❌ Single point of failure: Coordinator crash is problematic❌ Scalability: Doesn't scale well with many participants❌ Availability: One participant down = entire transaction failsWhen to Use:Banking (inter-bank transfers)Critical financial transactionsLegal/compliance requirementsRare in modern microservices!Solution 2: Saga PatternPhilosophy: Instead of distributed locks, use compensating transactions.Choreography SagaScenario: E-commerce order (Payment -> Inventory -> Shipping)Step 1: Payment ServiceReserve $900 from user walletPublish event: "PaymentReserved"COMMIT immediately (no waiting!) ✅Compensation: Refund $900 if later steps failStep 2: Inventory Service (listens to PaymentReserved)Reduce iPhone stock: 1 -> 0Publish event: "InventoryReserved"COMMIT immediately ✅Compensation: Restore stock if later steps failStep 3: Shipping Service (listens to InventoryReserved)Schedule deliveryPublish event: "ShippingScheduled"COMMIT immediately ✅Compensation: Cancel shipment if neededAll steps succeeded -> Order complete! 🎉Saga Rollback FlowIf Step 3 (Shipping) fails:TimeEventT1Shipping Service fails to scheduleT2Publish event: "ShippingFailed"T3Inventory Service receives eventT4Execute compensation: Restore stock (0 -> 1)T5Publish event: "InventoryRestored"T6Payment Service receives eventT7Execute compensation: Refund $900T8Publish event: "PaymentRefunded"T9Order Service marks order as "CANCELLED"T10Notify user: "Order failed, refund processed"Orchestration SagaCentral Orchestrator (Order Service) controls the flow:BEGIN SAGA|+--- Call Payment Service: Reserve $900|+--- Success? Continue : ABORT|+--- Call Inventory Service: Reserve iPhone|+--- Success? Continue : Compensate Payment + ABORT|+--- Call Shipping Service: Schedule delivery|+--- Success? Complete : Compensate Inventory + Payment + ABORT|END SAGASaga Pros & ConsPros:✅ No distributed locks (better performance)✅ Each service commits immediately✅ Services loosely coupled✅ Scales well✅ Failure of one service doesn't block othersCons:❌ Eventual consistency (not immediate)❌ Users might see intermediate states❌ Complex compensation logic❌ No rollback guarantee (compensation might fail!)❌ Ordering/timing issuesWhen to Use:Modern microservices architecturesLong-running workflowsWhen availability > consistencyE-commerce, social media, content platformsComparison: 2PC vs SagaAspect2PC (Distributed 2PL)SagaConsistencyStrong (ACID)EventualLocksYes (distributed)No locksPerformanceSlow (blocking)Fast (non-blocking)AvailabilityLow (one failure blocks all)High (failures isolated)ComplexityProtocol complexityBusiness logic complexityUse CaseBanking, critical financialE-commerce, social mediaIsolationFull isolationNo isolation (visible intermediate states)RollbackAutomaticManual compensationsReal Database ImplementationsPostgreSQLPostgreSQL uses MVCC (Multi-Version Concurrency Control) + 2PL.Lock TypesSQL-- Shared Lock (S-Lock)

```sql
SELECT * FROM products WHERE id = 1 FOR SHARE;
-- Other transactions can read, but not write

-- Exclusive Lock (X-Lock)
SELECT * FROM products WHERE id = 1 FOR UPDATE;
-- Other transactions cannot read or write (must wait)
Isolation LevelsSQL-- 1. READ UNCOMMITTED (PostgreSQL treats as READ COMMITTED)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- 2. READ COMMITTED (Default)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- Each query sees snapshot at query start time

-- 3. REPEATABLE READ
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- Transaction sees snapshot at transaction start time

-- 4. SERIALIZABLE (Strictest - uses 2PL)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Transactions appear to run serially
Example: Ticket BookingSQL-- Session 1: Alice booking seat
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Growing Phase: Acquire X-Lock
SELECT seat_number, status
FROM seats
WHERE flight_id = 'XYZ123' AND seat_number = '12A'
FOR UPDATE;
-- Returns: { seat_number: '12A', status: 'AVAILABLE' }

-- Business logic
UPDATE seats
SET status = 'BOOKED', passenger_id = 'alice', booked_at = NOW()
WHERE flight_id = 'XYZ123' AND seat_number = '12A';

-- Shrinking Phase: Release locks
COMMIT;
SQL-- Session 2: Bob trying same seat (simultaneously)
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Tries to acquire X-Lock
SELECT seat_number, status
FROM seats
WHERE flight_id = 'XYZ123' AND seat_number = '12A'
FOR UPDATE;

-- BLOCKED! Waiting for Alice's transaction...
-- Once Alice commits, this query returns:
-- { seat_number: '12A', status: 'BOOKED', passenger_id: 'alice' }

-- Bob's application sees seat is booked
ROLLBACK;
-- Show user: "Seat already booked, please select another"
Deadlock DetectionSQL-- Session 1
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1; -- Lock row 1
-- Now tries to lock row 2...
UPDATE accounts SET balance = balance + 100 WHERE id = 2; -- ⏳ WAITING

-- Session 2 (simultaneously)
BEGIN;
UPDATE accounts SET balance = balance + 100 WHERE id = 2; -- Lock row 2
-- Now tries to lock row 1...
UPDATE accounts SET balance = balance - 100 WHERE id = 1; -- ⏳ WAITING

```

-- PostgreSQL's deadlock detector runs (every 1 second)
-- Detects cycle: T1 -> T2 -> T1
-- Aborts one transaction:

ERROR:  deadlock detected
DETAIL: Process 12345 waits for ShareLock on transaction 67890;
        blocked by process 12346.
        Process 12346 waits for ShareLock on transaction 67889;
        blocked by process 12345.
HINT:   See server log for query details.
PostgreSQL Lock ManagerLock Hierarchy:Table-level locksACCESS SHARE (least restrictive)ROW SHAREROW EXCLUSIVESHARE UPDATE EXCLUSIVESHARESHARE ROW EXCLUSIVEEXCLUSIVEACCESS EXCLUSIVE (most restrictive)Row-level locks (most common)FOR SHARE (S-Lock)FOR UPDATE (X-Lock)Advisory locks (application-controlled)pg_advisory_lock(key)pg_advisory_unlock(key)MySQL InnoDBInnoDB uses MVCC + 2PL.Lock TypesSQL-- Shared Lock
SELECT * FROM products WHERE id = 1 LOCK IN SHARE MODE;

-- Exclusive Lock
SELECT * FROM products WHERE id = 1 FOR UPDATE;

-- Gap Locks (prevent phantom reads)
SELECT * FROM products WHERE price > 100 FOR UPDATE;
-- Locks the range, not just existing rows
Example: Inventory ManagementSQL-- Transaction 1: Customer buying last iPhone
START TRANSACTION;
-- Tries to acquire X-Lock
SELECT quantity
FROM inventory
WHERE product_id = 'iPhone13'
FOR UPDATE;
-- Returns: { quantity: 1 }

-- Validate and update
UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = 'iPhone13';

COMMIT;
SQL-- Transaction 2: Another customer (simultaneous)
START TRANSACTION;
-- Tries to acquire X-Lock
SELECT quantity
FROM inventory
WHERE product_id = 'iPhone13'
FOR UPDATE;

-- BLOCKED! Waiting for Transaction 1...
-- InnoDB waits for innodb_lock_wait_timeout (default: 50s)

-- If T1 commits within timeout:
-- ... this query returns { quantity: 0 }
-- Application shows: "Out of stock"

-- If timeout expires:
ERROR 1205 (HY000): Lock wait timeout exceeded;
try restarting transaction
Deadlock DetectionSQL-- InnoDB has automatic deadlock detection

-- View recent deadlock
SHOW ENGINE INNODB STATUS\G
-- Example output:PlaintextLATEST DETECTED DEADLOCK
------------------------
2025-11-04 10:15:30
*** (1) TRANSACTION:
TRANSACTION 12345, ACTIVE 2 sec starting index read
mysql tables in use 1, locked 1
LOCK WAIT 2 lock struct(s), heap size 1136, 1 row lock(s)
MySQL thread id 10, OS thread handle 140123, query id 567
localhost root updating
UPDATE accounts SET balance = balance - 100 WHERE id = 2

*** (1) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 45 page no 3 n bits 72 index PRIMARY of table test.accounts
trx id 12345 lock_mode X locks rec but not gap waiting

*** (2) TRANSACTION:
TRANSACTION 12346, ACTIVE 2 sec starting index read
mysql tables in use 1, locked 1
2 lock struct(s), heap size 1136, 1 row lock(s)
MySQL thread id 11, OS thread handle 140124, query id 568
localhost root updating
UPDATE accounts SET balance = balance + 100 WHERE id = 1

*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 45 page no 3 n bits 72 index PRIMARY of table test.accounts
trx id 12346 lock_mode X locks rec but not gap

*** WE ROLL BACK TRANSACTION (2)
MongoDB (Document Database)MongoDB 4.0+ supports multi-document transactions with 2PL.Java@Service

```java
public class MongoOrderService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void createOrder(String userId, String productId) {
        // Start session
        MongoTransactionManager transactionManager =
            new MongoTransactionManager(mongoTemplate.getMongoDbFactory());
        
        TransactionTemplate transactionTemplate =
            new TransactionTemplate(transactionManager);

        transactionTemplate.execute(status -> {
            try {
                // Growing Phase: Acquire locks implicitly
                Query query = new Query(
                    Criteria.where("productId").is(productId)
                            .and("quantity").gte(1)
                );

                Inventory inventory = mongoTemplate.findOne(
                    query,
                    Inventory.class
                );

                if (inventory == null) {
                    throw new OutOfStockException("Out of stock");
                }

                // Update inventory
                Update update = new Update().inc("quantity", -1);
                mongoTemplate.updateFirst(
                    Query.query(Criteria.where("productId").is(productId)),
                    update,
                    Inventory.class
                );

                // Create order
                Order order = new Order();
                order.setOrderId("12345");
                order.setProductId(productId);
                order.setUserId(userId);
                order.setStatus("CONFIRMED");
                order.setCreatedAt(LocalDateTime.now());

                mongoTemplate.insert(order);

                // Shrinking Phase: Commit and release locks (automatic)
                log.info("Order successful!");
                return null;

            } catch (Exception e) {
                // Abort transaction (automatic rollback)
                log.error("Order failed: {}", e.getMessage());
                throw e;
            }
        });
    }
}
```
Alternative Approaches1. Optimistic Locking (Optimistic Concurrency Control)Philosophy: "Hope for the best, check at commit time"How It WorksRead data WITHOUT locksPerform operations locallyAt commit time, check if data changedIf changed -> ABORT and retryIf unchanged -> COMMITImplementation: Version NumbersJava// E-commerce: Multiple users editing product details

```java
// Spring Boot with JPA

@Entity
@Table(name = "products")
public class Product {

    @Id
    private String id;
    private String name;
    private BigDecimal price;

    @Version // JPA Optimistic Locking
    private Long version;

    // Getters and setters
}

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public void updateProductPrice(String productId, BigDecimal newPrice) {
        try {
            // Step 1: Read data with version (automatic)
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException());
            // Product: { id: 'iphone13', price: 999, version: 42 }

            // Step 2: User edits locally (no locks held!)
            // Sale price: 899
            product.setPrice(newPrice);

            // Step 3: Try to update with version check (automatic)
            productRepository.save(product);
            // JPA automatically checks:
            // WHERE id = 'iphone13' AND version = 42
            // And increments: SET price = 899, version = 43
            
            // Success! Updated: version 42 -> 43

        } catch (OptimisticLockException e) {
            // Version mismatch! Someone else updated it!
            // Show user: "Product was updated by another user. Reload and try again."
            throw new ConcurrentModificationException(
                "Product was updated by another user. Please reload and try again."
            );
        }
    }
}

```

Implementation: TimestampsSQL-- PostgreSQL example

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Read data
SELECT id, name, price, updated_at FROM products WHERE id = 123;
-- { id: 123, name: 'iPhone', price: 999, updated_at: '2025-11-04 10:00:00' }

-- Update with timestamp check
UPDATE products
SET
    price = 899,
    updated_at = NOW()
WHERE
    id = 123
    AND updated_at = '2025-11-04 10:00:00'; -- Check timestamp

```

-- If 0 rows affected -> conflict!
-- If 1 row affected -> success!
Race Condition ExampleTimeAlice (Thread 1)Bob (Thread 2)T1Read: price=999, version=42T2Read: price=999, version=42T3Calculate: newPrice=899T4Calculate: newPrice=879T5save() -> version=42 ✅T6New state: price=899, version=43T7save() -> version=42 ❌T8OptimisticLockException thrown!T9Retry: Read version=43T10Show merge conflict UIOptimistic Locking Pros & ConsPros:✅ No locks = better performance✅ No deadlocks possible✅ Great for low-contention scenarios✅ Simple implementation✅ No blockingCons:❌ High contention = many retries (bad UX)❌ Wasted work (compute, then discard)❌ Not suitable for critical operations (booking, payments)❌ ABA problem possibleWhen to Use:Low-contention scenariosUser profile editsDocument editing (Google Docs style)Shopping cart updatesSettings/preferencesNon-critical dataWhen Not to Use:High contention (ticket booking, flash sales)Financial transactionsInventory managementCritical business operations2. MVCC (Multi-Version Concurrency Control)Philosophy: "Everyone gets their own snapshot of data!"How It WorksInstead of locking, keep multiple versions of each row.Timeline of iPhone inventory:T1: qty = 5 (version 1) -> Transaction A sees thisT2: qty = 4 (version 2) -> Transaction B updatesT3: qty = 3 (version 3) -> Transaction C updatesT4: qty = 2 (version 4) -> Current versionTransaction A started at T1, so it sees version 1 throughout!Transaction D starting now sees version 4.Implementation DetailsEach row has hidden metadata:Logical View:| id | name | qty || :--- | :--- | :--- || 1 | iPhone | 5 |Physical Storage (PostgreSQL):| id | name | qty | txn_min | txn_max | visible? || :--- | :--- | :--- | :--- | :--- | :--- || 1 | iPhone | 5 | txn_100 | txn_102 | old | <- Version 1| 1 | iPhone | 4 | txn_102 | txn_105 | old | <- Version 2| 1 | iPhone | 3 | txn_105 | NULL | current | <- Version 3xmin: Transaction that created this versionxmax: Transaction that deleted this version (NULL = current)Example: Read-Write ConcurrencySQL-- Transaction A (Reader)
-- Snapshot at T1
BEGIN;
SELECT qty FROM inventory WHERE id = 1;
-- Returns: 5 (Version 1)

-- Wait for 5 seconds... (simulating long-running query)

-- Transaction B (Writer) - runs during A's wait
BEGIN;
UPDATE inventory SET qty = 4 WHERE id = 1; -- Creates Version 2
COMMIT;

-- Transaction C (Writer) - also runs during A's wait
BEGIN;
UPDATE inventory SET qty = 3 WHERE id = 1; -- Creates Version 3
COMMIT;

-- Transaction A (Reader) - continues
SELECT qty FROM inventory WHERE id = 1;
-- Still returns: 5 (same snapshot!)
COMMIT;

-- NEW Transaction D
-- Snapshot at current time
BEGIN;
SELECT qty FROM inventory WHERE id = 1;
-- Returns: 3 (latest version) ✅
COMMIT;
Key Insight: Readers never block writers, writers never block readers!Write-Write ConflictsSQL-- Transaction 1
BEGIN;
UPDATE inventory SET qty = 0 WHERE id = 1; -- Don't commit yet

-- Transaction 2 (simultaneously)
BEGIN;
UPDATE inventory SET qty = 0 WHERE id = 1; -- Tries to update same row

-- ⏳ BLOCKED! Must wait for Transaction 1

-- If T1 commits:
-- T2 proceeds with update (based on T1's result)

-- If T1 aborts:
-- T2 proceeds with update (based on original value)
MVCC doesn't prevent write-write conflicts! Uses 2PL for writes.Garbage Collection (VACUUM)SQL-- Old versions accumulate over time
-- PostgreSQL VACUUM removes dead tuples

-- Manual vacuum
VACUUM inventory;

-- Auto-vacuum (default: enabled)
-- Runs automatically in background
MVCC Pros & ConsPros:✅ Readers don't block writers✅ Writers don't block readers✅ Excellent for read-heavy workloads✅ Time-travel queries possible (see data as of time T)✅ No lock contention for readsCons:❌ More storage (multiple versions)❌ Vacuum/cleanup needed❌ Write-write conflicts still need locking❌ Long-running transactions can bloat storageWhen to Use:Read-heavy applications (blogs, news sites)Analytics and reportingDefault in most modern databases (PostgreSQL, MySQL InnoDB)3. Timestamp Ordering (TO)Philosophy: "Order transactions by timestamp, not locks"How It WorksEach transaction gets a unique timestamp when it starts:T1: timestamp = 100T2: timestamp = 101T3: timestamp = 102Rule: Transactions must appear to execute in timestamp orderExampleTransaction T1 (timestamp: 100):Read X -> Timestamp: 95 (data is older, OK) ✅Write X -> Timestamp becomes: 100CommitTransaction T2 (timestamp: 99): <- Started late but has older timestampRead X -> Timestamp: 100 (data is newer!) ❌ABORT! (violates timestamp order)Restart with new timestampPros:✅ No deadlocks (no cyclic waiting)✅ No locks needed✅ Good for distributed systems with synchronized clocksCons:❌ Many aborts/restarts❌ Requires synchronized clocks❌ Starvation possible (old transactions keep aborting)When to Use:Distributed databases with atomic clocks (Google Spanner)Research systemsRarely used in practiceDecision FrameworkChoosing the Right ApproachPlaintext                  Is it distributed (microservices)?
                 /                            \
               YES                            NO
                |                              |
        Consistency critical?            Single Database
       /                   \                     |
     YES                   NO              What's the contention?
      |                     |              /       |       \
Use 2PC (rare!)    Use Saga (common)    HIGH    MEDIUM     LOW
                                         |       |          |
                                        2PL   MVCC+2PL  Optimistic
Detailed Decision MatrixScenarioApproachReasonTicket booking (high contention)2PL + SERIALIZABLEPrevent double-booking, high contention needs pessimistic lockingBank transfers (distributed)2PC or HybridStrong consistency required for moneyE-commerce order (distributed)Saga with compensationsBalance consistency and performanceBlog platform (read-heavy)MVCCReaders don't block writersUser profile edits (low contention)Optimistic LockingLow conflict rate, better performanceAnalytics dashboard (read-only)MVCC + READ COMMITTEDNo writes, eventual consistency OKFlash sale (extreme contention)Queue + 2PLSerialize access, prevent thundering herdSocial media feedEventual consistency (no locking)Availability > ConsistencyCritical Path vs Non-Critical PathCritical Path (Use Strong Consistency):Money movementInventory that can sell outSeat/ticket bookingLegal/compliance dataSecurity credentialsMedical recordsNon-Critical Path (Use Eventual Consistency):NotificationsAnalytics/metricsCachingRecommendationsSocial features (likes, shares)Audit logsReal-World ExamplesExample 1: Airline Ticket Booking (BookMyShow, Ticketmaster)Architecture:Single Database (PostgreSQL)seats tablebookings tablepayments tableusers tableImplementation:-- Strategy: 2PL with temporary reservations + timeouts-- Step 1: User selects seatSQLBEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Growing Phase: Acquire X-Lock
SELECT seat_id, status, reserved_until
FROM seats
WHERE flight_id = 'XYZ123'
  AND seat_number = '12A'
FOR UPDATE;

-- Check availability
IF status = 'AVAILABLE' OR (status = 'RESERVED' AND reserved_until < NOW()) THEN
    
    -- Mark as temporarily reserved
    UPDATE seats
    SET
        status = 'RESERVED',
        reserved_by = 'alice',
        reserved_until = NOW() + INTERVAL '10 minutes'
    WHERE seat_id = 123; -- (Assuming seat_id for '12A' is 123)

    -- Release lock
    COMMIT;
    -- Return to user: "Seat reserved for 10 minutes. Complete payment."

ELSE
    ROLLBACK;
    -- Return: "Seat unavailable"
END IF;
SQL-- Step 2: User completes payment (within 10 minutes)
BEGIN;

-- Acquire lock again
SELECT seat_id, status, reserved_by
FROM seats
WHERE seat_id = 123
FOR UPDATE;

-- Verify still reserved by this user
IF status = 'RESERVED' AND reserved_by = 'alice' THEN
    
    -- Process payment...
    INSERT INTO payments (user_id, amount, status)
    VALUES ('alice', 500, 'SUCCESS');

    -- Confirm booking
    UPDATE seats
    SET status = 'BOOKED', booked_by = 'alice', reserved_until = NULL
    WHERE seat_id = 123;

    INSERT INTO bookings (user_id, seat_id, flight_id, status)
    VALUES ('alice', 123, 'XYZ123', 'CONFIRMED');

    COMMIT; ✅

ELSE
    ROLLBACK;
    -- Reservation expired or taken by someone else
END IF;
SQL-- Background job: Release expired reservations
-- Runs every minute
UPDATE seats
SET
    status = 'AVAILABLE',
    reserved_by = NULL,
    reserved_until = NULL
WHERE
    status = 'RESERVED'
    AND reserved_until < NOW();
Why This Works:✅ Prevents double-booking (2PL)✅ User has time to pay (10-minute window)✅ Seats don't get stuck forever (timeout)✅ Simple (single database, no distributed transactions)✅ Fast (locks held only during updates, not during payment processing)Example 2: E-Commerce Order (Amazon, Flipkart)Architecture:Microservices (loosely coupled)Order Service (owns orders DB)Payment Service (owns payments DB)Inventory Service (owns inventory DB)Shipping Service (owns shipping DB)Notification ServiceImplementation: Hybrid (2PL + Saga)Java// Order Service: Orchestrator
@Service
public class OrderService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public OrderResult createOrder(String userId, String productId, int quantity) {
    
        // CRITICAL PATH: Use 2PL in single transaction
        // (Assuming Order Service has direct access to Payment & Inventory DBs
        // or is using a 2PC-like coordinator, but here simplified with TransactionTemplate)

        try {
            Order order = transactionTemplate.execute(status -> {
                // Growing Phase: Acquire locks

                // Lock user wallet
                BigDecimal balance = jdbcTemplate.queryForObject(
                    "SELECT balance FROM wallets WHERE user_id = ? FOR UPDATE",
                    BigDecimal.class,
                    userId
                );

                // Lock product inventory
                Integer stockQuantity = jdbcTemplate.queryForObject(
                    "SELECT quantity FROM inventory WHERE product_id = ? FOR UPDATE",
                    Integer.class,
                    productId
                );

                // Validate
                BigDecimal price = new BigDecimal("900.00"); // Example price
                if (balance.compareTo(price) < 0) {
                    throw new InsufficientFundsException("Insufficient funds");
                }
                if (stockQuantity < quantity) {
                    throw new OutOfStockException("Out of stock");
                }

                // Perform updates
                jdbcTemplate.update(
                    "UPDATE wallets SET balance = balance - ? WHERE user_id = ?",
                    price, userId
                );

                jdbcTemplate.update(
                    "UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?",
                    quantity, productId
                );

                // Create order
                KeyHolder keyHolder = new GeneratedKeyHolder();
                jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(
                        "INSERT INTO orders (user_id, product_id, status, total) VALUES (?, ?, ?, ?)",
                        Statement.RETURN_GENERATED_KEYS
                    );
                    ps.setString(1, userId);
                    ps.setString(2, productId);
                    ps.setString(3, "CONFIRMED");
                    ps.setBigDecimal(4, price);
                    return ps;
                }, keyHolder);

                Long orderId = keyHolder.getKey().longValue();

                // Shrinking Phase: Commit and release locks (automatic on return)
                return new Order(orderId, userId, productId, "CONFIRMED", price);
            });

            // NON-CRITICAL PATH: Use async Saga (eventual consistency)

            // Publish event for shipping
            eventPublisher.publishEvent(new OrderCreatedEvent(
                order.getId(), userId, productId, quantity
            ));
            // Shipping Service (separate microservice) listens and schedules delivery
            // If shipping fails -> Compensation: Refund + Restore Inventory

            // Notification Service sends email (async, eventually)
            eventPublisher.publishEvent(new SendOrderConfirmationEvent(
                userId, order.getId()
            ));

            return new OrderResult(true, order.getId(), null);

        } catch (Exception e) {
            // Transaction automatically rolled back
            return new OrderResult(false, null, e.getMessage());
        }
    }
}
Shipping Service (Saga participant):Java@Service
public class ShippingService {

    @Autowired
    private ShippingApiClient shippingAPI;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    // Listen for OrderCreated event
    @EventListener
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        try {
            // Schedule delivery
            ShipmentResponse shipment = shippingAPI.schedule(
                event.getOrderId(),
                event.getShippingAddress() // (Assuming address is part of event)
            );

            // Update shipment DB
            Shipment newShipment = new Shipment();
            newShipment.setOrderId(event.getOrderId());
            newShipment.setTrackingId(shipment.getTrackingId());
            newShipment.setStatus("SCHEDULED");
            shipmentRepository.save(newShipment);

            // Publish success event
            eventPublisher.publishEvent(new ShippingScheduledEvent(
                event.getOrderId(),
                shipment.getTrackingId()
            ));

        } catch (Exception e) {
            // COMPENSATION: Shipping failed!
            eventPublisher.publishEvent(new ShippingFailedEvent(
                event.getOrderId(),
                e.getMessage()
            ));
        }
    }
    
    // Listen for ShippingFailed event (if compensation was needed from *this* service)
    @EventListener
    public void handleShippingFailed(ShippingFailedEvent event) {
        // Order Service will handle refund + inventory restoration
        log.error("Shipping failed for order: {}", event.getOrderId());
    }
}
Order Service (Compensation handler):Java@Service
public class OrderCompensationService {

    @Autowired
    private TransactionTemplate transactionTemplate;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @EventListener
    @Async
    public void handleShippingFailed(ShippingFailedEvent event) {
        try {
            transactionTemplate.execute(status -> {
                // Get order details
                Map<String, Object> order = jdbcTemplate.queryForMap(
                    "SELECT * FROM orders WHERE id = ? FOR UPDATE",
                    event.getOrderId()
                );

                String userId = (String) order.get("user_id");
                String productId = (String) order.get("product_id");
                BigDecimal total = (BigDecimal) order.get("total");
                Integer quantity = (Integer) order.get("quantity"); // (Assuming qty is stored)

                // Refund money
                jdbcTemplate.update(
                    "UPDATE wallets SET balance = balance + ? WHERE user_id = ?",
                    total, userId
                );

                // Restore inventory
                jdbcTemplate.update(
                    "UPDATE inventory SET quantity = quantity + ? WHERE product_id = ?",
                    quantity, productId
                );

                // Cancel order
                jdbcTemplate.update(
                    "UPDATE orders SET status = ? WHERE id = ?",
                    "CANCELLED", event.getOrderId()
                );

                // Notify user
                eventPublisher.publishEvent(new SendOrderCancellationEvent(
                    userId,
                    event.getOrderId(),
                    "Shipping unavailable. Full refund processed."
                ));

                return null;
            });
        
        } catch (Exception e) {
            // Transaction automatically rolled back
            // Log critical error -> manual intervention needed!
            log.error("COMPENSATION FAILED for order: {}", event.getOrderId(), e);
        }
    }
}
Why This Works:✅ Money protected (2PL for payment + inventory)✅ Fast user response (don't wait for shipping)✅ Graceful failure handling (compensation)✅ Services loosely coupled✅ ScalableExample 3: Google Spanner (Globally Distributed)Architecture:Global DistributionData Center: US-West (California)Data Center: US-East (Virginia)Data Center: Europe (Belgium)Data Center: Asia (Taiwan)Uses TrueTime API (atomic clocks + GPS)Implementation: 2PL + TrueTimeTrueTime API provides:TT.now() -> [earliest, latest] (uncertainty interval)Guarantees: actual time $\in$ [earliest, latest]Typical uncertainty: 1-7 millisecondsTransaction Commit Protocol:Acquire locks (2PL Growing Phase)Assign commit timestamp: t_commitWait until: TT.now().earliest > t_commitRelease locks (2PL Shrinking Phase)Commit is now globally ordered!Why This Is Revolutionary:✅ Globally consistent transactions✅ No need for 2PC coordinator (atomic clocks provide ordering)✅ External consistency guaranteed✅ Read-only transactions don't need locks⚠️ Common Pitfalls & SolutionsPitfall 1: DeadlocksProblem:Transaction 1:Lock row ATries to lock row B -> ⏳ WAITINGTransaction 2:Lock row BTries to lock row A -> ⏳ WAITING❌ DEADLOCK! Both waiting forever.Solutions:A. Lock OrderingJava// ❌ BAD: Inconsistent lock order
@Transactional
public void transferMoney(Long fromId, Long toId, BigDecimal amount) {
    jdbcTemplate.update(
        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        amount, fromId
    );
    jdbcTemplate.update(
        "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        amount, toId
    );
} // Risk of deadlock!
Java// ✅ GOOD: Always lock in same order (by ID)
@Transactional
public void transferMoney(Long fromId, Long toId, BigDecimal amount) {
    // Determine lock order
    Long firstId = fromId < toId ? fromId : toId;
    Long secondId = fromId < toId ? toId : fromId;
    boolean isNormalOrder = fromId < toId;

    // Lock in consistent order
    jdbcTemplate.update(
        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        isNormalOrder ? amount.negate() : amount, firstId
    );
    jdbcTemplate.update(
        "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        isNormalOrder ? amount : amount.negate(), secondId
    );
}
B. Timeout + RetrySQL-- PostgreSQL: Set lock timeout
SET lock_timeout = '5s';

BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- If lock not acquired in 5 seconds -> ERROR
C. Deadlock DetectionJava@Service
public class AccountService {

    @Autowired
    private TransactionTemplate transactionTemplate;

    private static final int MAX_RETRIES = 3;

    public void transferWithRetry(Long fromId, Long toId, BigDecimal amount) {
        int attempts = 0;
        
        while (attempts < MAX_RETRIES) {
            try {
                transactionTemplate.execute(status -> {
                    // Operations that might deadlock
                    // (Using the "GOOD" lock ordering logic from above)
                    
                    Long firstId = fromId < toId ? fromId : toId;
                    Long secondId = fromId < toId ? toId : fromId;
                    // ... (logic to update accounts in order) ...

                    jdbcTemplate.update(
                        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
                        amount, fromId
                    );
                    jdbcTemplate.update(
                        "UPDATE accounts SET balance = balance + ? WHERE id = ?",
                        amount, toId
                    );

                    return null;
                });
                
                // Success - exit retry loop
                return;

            } catch (CannotAcquireLockException | DeadlockLoserDataAccessException e) {
                attempts++;
                if (attempts >= MAX_RETRIES) {
                    throw new MaxRetriesExceededException(
                        "Failed after " + MAX_RETRIES + " attempts", e
                    );
                }
                
                // Exponential backoff
                try {
                    Thread.sleep((long) (Math.random() * 1000 + Math.pow(2, attempts)));
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException(ie);
                }
            }
        }
    }
}
Pitfall 2: Long-Lived LocksProblem:JavaScript// ❌ BAD: Lock held during external API call
BEGIN;
SELECT * FROM inventory WHERE id = 1 FOR UPDATE; -- Lock acquired
await fetch('[https://payment-api.com/process](https://payment-api.com/process)'); // 5 seconds! 
// Lock held during entire API call -> blocks other transactions
UPDATE inventory SET quantity = quantity - 1 WHERE id = 1;
COMMIT;
Solution:Java// ✅ GOOD: Minimize lock duration
@Service
public class InventoryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TransactionTemplate transactionTemplate;
    
    @Autowired
    private PaymentApiClient paymentAPI;

    public void processOrderWithPayment(Long inventoryId, BigDecimal amount) {
        
        // Step 1: Read data without lock
        Integer originalQty = jdbcTemplate.queryForObject(
            "SELECT quantity FROM inventory WHERE id = ?",
            Integer.class,
            inventoryId
        );

        // Step 2: External API call (no locks held)
        PaymentResult paymentResult = paymentAPI.process(amount); // 5 seconds!

        if (!paymentResult.isSuccess()) {
            throw new PaymentFailedException("Payment failed");
        }

        // Step 3: Quick update with lock
        transactionTemplate.execute(status -> {
            // Lock acquired
            Integer currentQty = jdbcTemplate.queryForObject(
                "SELECT quantity FROM inventory WHERE id = ? FOR UPDATE",
                Integer.class,
                inventoryId
            );

            // Verify quantity didn't change (Optimistic check)
            if (!currentQty.equals(originalQty)) {
                throw new InventoryChangedException(
                    "Inventory changed during payment processing, retry"
                );
            }

            // Update inventory
            jdbcTemplate.update(
                "UPDATE inventory SET quantity = quantity - 1 WHERE id = ?",
                inventoryId
            );

            return null;
        });
        // Lock released immediately after transaction
    }
}
Pitfall 3: Lock EscalationProblem:SQL-- ❌ BAD: Locking too many rows
BEGIN;
SELECT * FROM products FOR UPDATE; -- Locks entire table!
-- Only needed to update 1 product
UPDATE products SET price = 999 WHERE id = 123;
COMMIT;
Solution:SQL-- ✅ GOOD: Lock only what you need
BEGIN;
SELECT * FROM products WHERE id = 123 FOR UPDATE; -- Lock on 1 row
UPDATE products SET price = 999 WHERE id = 123;
COMMIT;
Pitfall 4: Read-Modify-Write Race ConditionProblem:Java// ❌ BAD: Classic race condition
@Transactional
public void updateInventory(Long productId) {
    Integer quantity = jdbcTemplate.queryForObject(
        "SELECT quantity FROM inventory WHERE id = ?",
        Integer.class,
        productId
    );

    // Another transaction might update here! 
    Integer newQty = quantity - 1;
    
    jdbcTemplate.update(
        "UPDATE inventory SET quantity = ? WHERE id = ?",
        newQty, productId
    );
}
Solution:Java// ✅ GOOD: Atomic update
@Transactional
public void updateInventory(Long productId) {
    jdbcTemplate.update(
        "UPDATE inventory SET quantity = quantity - 1 WHERE id = ?",
        productId
    );
}

// Or with explicit lock:
@Transactional
public void updateInventoryWithLock(Long productId) {
    Integer quantity = jdbcTemplate.queryForObject(
        "SELECT quantity FROM inventory WHERE id = ? FOR UPDATE",
        Integer.class,
        productId
    );

    Integer newQty = quantity - 1;

    jdbcTemplate.update(
        "UPDATE inventory SET quantity = ? WHERE id = ?",
        newQty, productId
    );
}
Pitfall 5: Phantom ReadsProblem:SQL-- Transaction 1
BEGIN;
SELECT COUNT(*) FROM orders WHERE status = 'PENDING';
-- Returns: 10

-- Transaction 2 (simultaneously)
BEGIN;
INSERT INTO orders (status) VALUES ('PENDING');
COMMIT;

-- Transaction 1 (continues)
SELECT COUNT(*) FROM orders WHERE status = 'PENDING';
-- Returns: 11 (different result!) 
COMMIT;
Solution:SQL-- ✅ Use SERIALIZABLE isolation
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT COUNT(*) FROM orders WHERE status = 'PENDING';
-- Locks the range, not just existing rows
-- Other transactions cannot insert new PENDING orders
COMMIT;
Quick ReferenceTransaction Isolation LevelsLevelDirty ReadNon-Repeatable ReadPhantom ReadImplementationREAD UNCOMMITTED✅ Possible✅ Possible✅ PossibleNo locksREAD COMMITTED❌ Prevented✅ Possible✅ PossibleS-Locks released after readREPEATABLE READ❌ Prevented❌ Prevented✅ PossibleS-Locks held until commitSERIALIZABLE❌ Prevented❌ Prevented❌ PreventedFull 2PL + range locksLock Compatibility Quick ReferenceRequest →  Current ↓No LockS-LockX-LockNo Lock✅✅✅S-Lock✅✅❌X-Lock✅❌❌SQL Lock SyntaxSQL-- PostgreSQL
SELECT * FROM table WHERE id = 1 FOR UPDATE;        -- X-Lock
SELECT * FROM table WHERE id = 1 FOR SHARE;         -- S-Lock
SELECT * FROM table WHERE id = 1 FOR UPDATE NOWAIT; -- Fail immediately if locked
SELECT * FROM table WHERE id = 1 FOR UPDATE SKIP LOCKED; -- Skip locked rows

-- MySQL
SELECT * FROM table WHERE id = 1 FOR UPDATE;        -- X-Lock
SELECT * FROM table WHERE id = 1 LOCK IN SHARE MODE;-- S-Lock
SELECT * FROM table WHERE id = 1 FOR UPDATE NOWAIT; -- Fail immediately if locked
SELECT * FROM table WHERE id = 1 FOR UPDATE SKIP LOCKED; -- Skip locked rows
Deadlock Prevention Checklist✅ Lock resources in consistent order (by ID, alphabetically, etc.)✅ Keep transactions short✅ Minimize lock scope (lock only what you need)✅ Use appropriate isolation level (don't use SERIALIZABLE unless necessary)✅ Set lock timeouts✅ Implement retry logic with exponential backoff✅ Monitor for deadlocks in productionPerformance Optimization TipsMinimize lock duration:Do expensive operations before acquiring locksRelease locks as soon as possibleUse appropriate lock granularity:Row-level locks > Page-level locks > Table-level locksChoose right isolation level:READ COMMITTED for most operationsSERIALIZABLE only when necessaryConsider optimistic locking for low contention:Version numbers or timestampsBetter performance when conflicts are rareUse MVCC when available:Default in PostgreSQL, MySQL InnoDBReaders don't block writersPartition hot data:Split high-contention rows across multiple recordsExample: Split wallet balance into multiple sub-accountsKey TakeawaysThe Golden Rules2PL guarantees serializability - transactions appear to run one-at-a-timeGrowing phase + Shrinking phase - no going back!Deadlocks are possible - need detection or preventionContext matters - choose based on contention and consistency needsTrade-offs are everywhere - consistency vs performance vs availabilityWhen to Use WhatHigh Contention + Critical Data (money, inventory, bookings):Use 2PL with SERIALIZABLE isolationRead-Heavy Workload:Use MVCC (default in modern databases)Low Contention + Non-Critical:Use Optimistic LockingDistributed Services + Strong Consistency:Use 2PC (rare) or Hybrid (2PL for critical, Saga for non-critical)Distributed Services + Availability Preferred:Use Saga with compensationsMental ModelConsistency Spectrum:STRONG $\leftarrow\text{---------------------------------------------------------------------}\rightarrow$ WEAK| | | | | |2PL+2PC | 2PL (Single) | MVCC | Optimistic | Eventual(Distributed) | (Serializable) | | Locking | (No locks)| | | | | |Use Case: | | | | |Bank | Ticket | Blog | Profile | SocialTransfer | Booking | Platform | Edits | FeedFurther ReadingAcademic Papers"Concurrency Control and Recovery in Database Systems" - Philip A. Bernstein, Nathan Goodman"Granularity of Locks and Degrees of Consistency" - Jim Gray et al."A Theory of Concurrency Control for Databases" - H.T. Kung, John T. RobinsonReal-World SystemsPostgreSQL: MVCC + 2PL implementationGoogle Spanner: TrueTime + 2PL for global consistencyMySQL InnoDB: Deadlock detection algorithmsMongoDB: WiredTiger storage engine with MVCCBest Practices"Designing Data-Intensive Applications" - Martin KleppmannDatabase reliability engineering patternsMicroservices transaction patterns (Saga, 2PC)Final ExerciseTest your understanding by designing concurrency control for these scenarios:Scenario 1: Concert Ticket Sales50,000 tickets500,000 concurrent usersHigh contention for front-row seatsPayment processing takes 3-5 secondsYour Design:Which approach? ________________Why? ________________Potential issues? ________________Scenario 2: Wikipedia Article EditsMillions of articlesRare: 2 people edit same article simultaneouslyNeed to preserve edit historyRead-heavy (1000:1 read:write ratio)Your Design:Which approach? ________________Why? ________________Potential issues? ________________
