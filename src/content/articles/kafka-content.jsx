import React from 'react';
import CodeBlock from '../../components/ui/CodeBlock';
import Callout from '../../components/ui/Callout';

export default function KafkaContent() {
  return (
    <>

        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Kafka</span>
          </div>
          <h1>Kafka</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn about how you can use Kafka to solve a large number of problems in System Design.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              20 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Event Streaming
            </span>
            <span className="difficulty-badge difficulty-badge--intermediate">Intermediate</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Introduction
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <div className="video-walkthrough-banner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <div>
              <div className="video-walkthrough-title">Watch Video Walkthrough</div>
              <div className="video-walkthrough-desc">Watch the author walk through the problem step-by-step</div>
            </div>
          </div>

          <p>
            There is a good chance you've heard of Kafka. It's popular. In fact, according to their website, it's used by 80% of the Fortune 100. If it's good enough to help scale the largest companies in the world, it's probably good enough for your next system design interview.
          </p>
          <p>
            Apache Kafka is an open-source distributed event streaming platform that can be used either as a message queue or as a stream processing system. Kafka excels in delivering high performance, scalability, and durability. It's engineered to handle vast volumes of data in real-time, and when configured properly (with appropriate replication and acknowledgment settings), it can provide strong guarantees against message loss.
          </p>
          <p>
            In this deep dive, we're going to take a top down approach. Starting with a zoomed out view of Kafka and progressing into more and more detail. If you know the basics, feel free to skip ahead to the more advanced sections.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — A Motivating Example
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="a-motivating-example">A Motivating Example</h2>
          <p>
            It's the World Cup (my personal favorite competition). And we run a website that provides real-time statistics on the matches. Each time a goal is scored, a player is booked, or a substitution is made, we want to update our website with the latest information.
          </p>
          <p>
            Events are placed on a queue when they occur. We call the server or process responsible for putting these events on the queue the producer. Downstream, we have a server that reads events off the queue and updates the website. We call this the consumer.
          </p>

          {/* Diagram: Basic Queue */}
          <div className="diagram-container">
            <div className="diagram-title">Basic Producer-Consumer Queue</div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="diagram-box diagram-box--client">Producer<br /><small>(Match Server)</small></div>
              <div style={{ color: 'var(--primary)' }}>➔</div>
              <div className="diagram-box diagram-box--connection" style={{ width: '200px' }}>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <span style={{ padding: '4px', background: 'white', border: '1px solid #ccc' }}>Event</span>
                  <span style={{ padding: '4px', background: 'white', border: '1px solid #ccc' }}>Event</span>
                </div>
                <div style={{ fontSize: '0.7rem', marginTop: '8px' }}>Queue</div>
              </div>
              <div style={{ color: 'var(--primary)' }}>➔</div>
              <div className="diagram-box diagram-box--server">Consumer<br /><small>(Website Server)</small></div>
            </div>
          </div>

          <p>
            Now, imagine the World Cup expanded from just the top 48 teams to a hypothetical 1,000-team tournament, and all the games are now played at the same time. The number of events has increased significantly, and our single server hosting the queue is struggling to keep up. Similarly, our consumer feels like it has its mouth under a firehose and is crashing under the load.
          </p>
          <p>
            We need to scale the system by adding more servers to distribute our queue. But how do we ensure that the events are still processed in order?
          </p>
          <p>
            If we were to randomly distribute the events across the servers, we would have a mess on our hands. Goals would be scored before the match even started, and players would be booked for fouls they haven't committed yet.
          </p>
          <p>
            A logical solution is to distribute the items in the queue based on the game they are associated with. This way, all events for a single game are processed in order because they exist on the same queue. This is one of the fundamental ideas behind Kafka: messages sent and received through Kafka are distributed across partitions using a partitioning strategy (Kafka provides sensible defaults, but choosing the right key is critical for ordering guarantees).
          </p>

          {/* Diagram: Partitioning */}
          <div className="diagram-container">
            <div className="diagram-title">Key-based Partitioning for Order Preservation</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                <strong style={{ color: 'var(--accent)' }}>Random Distribution</strong>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '10px' }}>
                  Queue 1: [Game A Goal] → [Game B Card]<br /><br />
                  Queue 2: [Game A Kickoff]<br />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Events for Game A arrive out of order if Queue 1 is processed before Queue 2.</p>
              </div>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: 'var(--success)' }}>Key-based Partitioning</strong>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '10px' }}>
                  Queue 1 (Key: Game_A):<br />[Kickoff] → [Goal]<br /><br />
                  Queue 2 (Key: Game_B):<br />[Card]
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Events for a specific game stay in exact chronological order.</p>
              </div>
            </div>
          </div>

          <p>
            But what about our consumer, it's still overwhelmed. It is easy enough to add more, but how do we make sure that each event is only processed once? We can group consumers together into what Kafka calls a consumer group. With consumer groups, each partition is assigned to exactly one consumer in the group, so under normal operation each event is delivered to a single consumer. (In failure scenarios, Kafka's default at-least-once semantics mean a message could be reprocessed, but it won't be split across consumers.)
          </p>
          <p>
            Lastly, we've decided that we want to expand our hypothetical World Cup to more sports, like basketball. But we don't want our soccer website to cover basketball events, and we don't want our basketball website to cover soccer events. So we introduce the concept of topics. Each event is associated with a topic, and consumers can subscribe to specific topics. Therefore, our consumers who update the soccer website only subscribe to the soccer topic, and our consumers that update the basketball website only subscribe to basketball events.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Basic Terminology and Architecture
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="basic-terminology-and-architecture">Basic Terminology and Architecture</h2>
          <p>
            The example is great, but let's define Kafka a bit more concretely by formalizing some of the key terms and concepts introduced above.
          </p>
          <p>
            A Kafka cluster is made up of multiple brokers. These are just individual servers (they can be physical or virtual). Each broker is responsible for storing data and serving clients. The more brokers you have, the more data you can store and the more clients you can serve.
          </p>
          <p>
            Each broker has a number of partitions. Each partition is an ordered, immutable sequence of messages that is continually appended to -- think of like a log file. Partitions are the way Kafka scales as they allow for messages to be consumed in parallel.
          </p>
          <p>
            A topic is just a logical grouping of partitions. Topics are the way you publish and subscribe to data in Kafka. When you publish a message, you publish it to a topic, and when you consume a message, you consume it from a topic. Topics are always multi-producer; that is, a topic can have zero, one, or many producers that write data to it.
          </p>
          <p>
            So what is the difference between a topic and a partition?
          </p>
          <p>
            A topic is a logical grouping of messages. A partition is a physical grouping of messages. A topic can have multiple partitions, and each partition can be on a different broker. Topics are just a way to organize your data, while partitions are a way to scale your data.
          </p>
          <p>
            Last up we have our producers and consumers. Producers are the ones who write data to topics, and consumers are the ones who read data from topics. While Kafka exposes a simple API for both producers and consumers, the creation and processing of messages is on you, the developer. Kafka doesn't care what the data is, it just stores and serves it.
          </p>
          <p>
            Importantly, you can use Kafka as either a message queue or a stream. Frankly, the distinction here is minor. In both modes, consumers track their progress using offset commits. The key difference is in the consumption pattern: when used as a message queue, each message is processed by one consumer in a group and then effectively "consumed." When used as a stream, the log is retained and can be replayed, multiple consumer groups can independently read the same data, and consumers can process data continuously as it arrives.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — How Kafka Works
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="how-kafka-works">How Kafka Works</h2>
          <p>
            When an event occurs, the producer formats a message, also referred to as a record, and sends it to a Kafka topic. A message consists of four fields, all technically optional: a value (the payload), a key, a timestamp, and headers. The key is used to determine which partition the message is sent to. The timestamp records when the message was created or ingested (but ordering within a partition is determined by offsets, not timestamps). Headers, like HTTP headers, are key-value pairs that can be used to store metadata about the message.
          </p>

          {/* Diagram: Message Structure */}
          <div className="diagram-container">
            <div className="diagram-title">Kafka Message (Record) Structure</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center', flex: 1, minWidth: '100px' }}>
                <strong style={{ color: 'var(--text-color)' }}>Key</strong>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>(e.g. game_id)</div>
              </div>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center', flex: 2, minWidth: '150px' }}>
                <strong style={{ color: 'var(--success)' }}>Value</strong>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Payload (e.g. JSON)</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center', flex: 1, minWidth: '100px' }}>
                <strong style={{ color: 'var(--primary)' }}>Timestamp</strong>
              </div>
              <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', border: '1px solid #fcd34d', textAlign: 'center', flex: 1, minWidth: '100px' }}>
                <strong style={{ color: '#92400e' }}>Headers</strong>
              </div>
            </div>
          </div>

          <p>
            While not strictly required, the key is used to determine which partition the message is sent to. If you don't provide a key, Kafka will distribute messages across partitions using a default strategy (modern Kafka clients use a "sticky" partitioner that batches messages to the same partition for efficiency, then rotates). So when designing a large, distributed system like you're likely to be asked about in your interview, you'll want to use keys to ensure that related messages land on the same partition and are processed in order. The choice of that key is important. More on this later.
          </p>
          <p>
            As a quick example, here is how we might put a message on the topic my-topic using the Kafka command line tool kafka-console-producer:
          </p>
          <CodeBlock language="bash">{`kafka-console-producer --bootstrap-server localhost:9092 --topic my_topic --property "parse.key=true" --property "key.separator=:"
> key1: Hello, Kafka with key!
> key2: Another message with a different key`}</CodeBlock>

          <p>
            The --property "parse.key=true" and --property "key.separator=:" flags are used to specify that the key-value pairs are separated by a colon.
          </p>
          <p>
            We can see what the same would look like using kafkajs, a popular Node.js client for Kafka:
          </p>
          <CodeBlock language="javascript">{`// Initialize the Kafka client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

// Initialize the producer
const producer = kafka.producer()

const run = async () => {
  // Connecting the producer
  await producer.connect()

  // Sending messages to the topic 'my_topic' with keys
  await producer.send({
    topic: 'my_topic',
    messages: [
      { key: 'key1', value: 'Hello, Kafka with key!' },
      { key: 'key2', value: 'Another message with a different key' }
    ],
  })
}`}</CodeBlock>

          <p>
            When a message is published to a Kafka topic, Kafka first determines the appropriate partition for the message. This partition selection is critical because it influences the distribution of data across the cluster. This is a two-step process:
          </p>
          <ul>
            <li><strong>Partition Determination:</strong> Kafka uses a partitioning algorithm that hashes the message key to assign the message to a specific partition. If the message does not have a key, Kafka can either round-robin the message to partitions or follow another partitioning logic defined in the producer configuration. This ensures that messages with the same key always go to the same partition, preserving order at the partition level.</li>
            <li><strong>Broker Assignment:</strong> Once the partition is determined, Kafka then identifies which broker holds that particular partition. The mapping of partitions to specific brokers is managed by the Kafka cluster metadata, which is maintained by the Kafka controller (a role within the broker cluster). The producer uses this metadata to send the message directly to the broker that hosts the target partition.</li>
          </ul>

          <p>
            Each partition in Kafka functions essentially as an append-only log file. Messages are sequentially added to the end of this log, which is why Kafka is commonly described as a distributed commit log. This append-only design is central to Kafka's architecture, providing several important benefits:
          </p>
          <ul>
            <li><strong>Immutability:</strong> Once written, messages in a partition cannot be altered in-place. They are eventually removed through retention policies or log compaction, but they're never modified. This immutability is crucial for Kafka's performance and reliability. It simplifies replication, speeds up recovery processes, and avoids consistency issues common in systems where data can be changed.</li>
            <li><strong>Efficiency:</strong> By restricting operations to appending data at the end of the log, Kafka minimizes disk seek times, which are a major bottleneck in many storage systems.</li>
            <li><strong>Scalability:</strong> The simplicity of the append-only log mechanism facilitates horizontal scaling. More partitions can be added and distributed across a cluster of brokers to handle increasing loads, and each partition can be replicated across multiple brokers to enhance fault tolerance.</li>
          </ul>

          <p>
            Each message in a Kafka partition is assigned a unique offset, which is a sequential identifier indicating the message's position in the partition. This offset is used by consumers to track their progress in reading messages from the topic. As consumers read messages, they maintain their current offset and periodically commit this offset back to Kafka. This way, they can resume reading from where they left off in case of failure or restart. Note that Kafka provides at-least-once delivery by default: if a consumer crashes after processing a message but before committing its offset, the message will be reprocessed after restart. Exactly-once semantics are possible but require additional configuration (idempotent producers + transactional APIs).
          </p>

          <p>
            Once a message is published to the designated partition, Kafka ensures its durability and availability through a robust replication mechanism. Kafka employs a leader-follower model for replication, which works as follows:
          </p>
          <ul>
            <li><strong>Leader Replica Assignment:</strong> Each partition has a designated leader replica, which resides on a broker. This leader replica handles all write requests and, by default, read requests for the partition (though Kafka 2.4+ supports consumer reads from follower replicas for latency optimization). The assignment of the leader replica is managed centrally by the cluster controller, which ensures that each partition's leader replica is effectively distributed across the cluster to balance the load.</li>
            <li><strong>Follower Replication:</strong> Alongside the leader replica, several follower replicas exist for each partition, residing on different brokers. These followers do not handle direct client requests; instead, they passively replicate the data from the leader replica. By replicating the messages received by the leader replica, these followers act as backups, ready to take over should the leader replica fail.</li>
            <li><strong>Synchronization and Consistency:</strong> Followers continuously sync with the leader replica to ensure they have the latest set of messages appended to the partition log. This synchronization is crucial for maintaining consistency across the cluster. If the leader replica fails, one of the follower replicas that has been fully synced can be quickly promoted to be the new leader, minimizing downtime and data loss.</li>
            <li><strong>Controller's Role in Replication:</strong> The controller within the Kafka cluster manages this replication process. It monitors the health of all brokers and manages the leadership and replication dynamics. When a broker fails, the controller reassigns the leader role to one of the in-sync follower replicas to ensure continued availability of the partition.</li>
          </ul>

          <p>
            Last up, consumers read messages from Kafka topics using a pull-based model. Unlike some messaging systems that push data to consumers, Kafka consumers actively poll the broker for new messages at intervals they control. As explained by Apache Kafka's official documentation, this pull approach was a deliberate design choice that provides several advantages: it lets consumers control their consumption rate, simplifies failure handling, prevents overwhelming slow consumers, and enables efficient batching.
          </p>

          <p>
            To round out our earlier example, here is how we might consume messages from the my-topic topic using the Kafka command line tool kafka-console-consumer:
          </p>
          <CodeBlock language="bash">{`kafka-console-consumer --bootstrap-server localhost:9092 --topic my_topic --from-beginning --property print.key=true --property key.separator=": "

# Output
key1: Hello, Kafka with key!
key2: Another message with a different key`}</CodeBlock>

          <p>
            Similarly, with kafkajs, we can consume messages from the my_topic topic:
          </p>
          <CodeBlock language="javascript">{`// Initialize the Kafka client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

// Initialize the consumer
const consumer = kafka.consumer({ groupId: 'my-group' })

const run = async () => {
  // Connecting the consumer
  await consumer.connect()

  // Subscribing to the topic 'my_topic'
  await consumer.subscribe({ topic: 'my_topic' })

  // Consuming messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value?.toString(),
        key: message.key?.toString()
      })
    },
  })
}`}</CodeBlock>

          <p>
            Tying it all together, we get something like this:
          </p>

          {/* Diagram: Full Flow */}
          <div className="diagram-container">
            <div className="diagram-title">Kafka Full End-to-End Flow</div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="diagram-box diagram-box--client">Producer</div>
              <div style={{ color: 'var(--primary)' }}>➔</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="diagram-box diagram-box--server">
                  Broker (Leader)<br/>
                  <small>Topic: my_topic</small><br/>
                  <div style={{ background: 'white', padding: '4px', fontSize: '0.7rem', marginTop: '4px', border: '1px solid #ccc' }}>Partition 0 [ offset 0, 1, 2 ]</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="diagram-box diagram-box--server" style={{ fontSize: '0.7rem', padding: '4px' }}>Broker (Follower)</div>
                  <div className="diagram-box diagram-box--server" style={{ fontSize: '0.7rem', padding: '4px' }}>Broker (Follower)</div>
                </div>
              </div>
              <div style={{ color: 'var(--primary)' }}>➔</div>
              <div className="diagram-box diagram-box--client">
                Consumer<br/>
                <small>(Group: my-group)</small>
                <div style={{ background: '#f0fdf4', color: '#166534', padding: '4px', fontSize: '0.7rem', marginTop: '4px', border: '1px solid #bbf7d0' }}>Polls messages</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — When to Use Kafka
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="when-to-use-kafka">When to use Kafka in your interview</h2>
          <p>
            Kafka can be used as either a message queue or a stream.
          </p>
          <p>
            The key difference between the two lies in the consumption pattern. When used as a message queue, each message is processed by one consumer in a group and then effectively "consumed" (though Kafka still retains it based on retention policy). When used as a stream, consumers continuously process messages as they arrive in real-time, and the same data can be read by multiple independent consumer groups or replayed from any point in the log.
          </p>
          <p>
            Consider adding a message queue to your system when:
          </p>
          <ul>
            <li><strong>You have processing that can be done asynchronously.</strong> YouTube is a good example of this. When users upload a video we can make the standard definition video available immediately and then put the video (via link) a Kafka topic to be transcoded when the system has time.</li>
            <li><strong>You need to ensure that messages are processed in order.</strong> We could use Kafka for our virtual waiting queue in Design Ticketmaster which is meant to ensure that users are let into the booking page in the order they arrived.</li>
            <li><strong>You want to decouple the producer and consumer so that they can scale independently.</strong> Usually this means that the producer is producing messages faster than the consumer can consume them. This is a common pattern in microservices where you want to ensure that one service can't take down another.</li>
          </ul>
          <p>
            Streams are useful when:
          </p>
          <ul>
            <li><strong>You require continuous and immediate processing of incoming data, treating it as a real-time flow.</strong> See Design an Ad Click Aggregator for an example where we aggregate click data in real-time.</li>
            <li><strong>Messages need to be processed by multiple consumers simultaneously.</strong> In Design FB Live Comments we can use Kafka as a pub/sub system to send comments to multiple consumers.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — Kafka for System Design Interviews
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="kafka-for-system-design">What you should know about Kafka for System Design Interviews</h2>
          <p>
            There is a lot to know about Kafka. But we'll focus in on this bits that are most likely to be relevant to your system design interview.
          </p>
          <p>
            This deep dive is rather exhaustive, especially as it pertains to the knowledge needed for an interview. Don't feel overwhelmed. If you're a junior or mid-level engineer, you likely won't need to know anything below this point. If you're a senior engineer, you should be familiar with some of the topics we're about to cover. Staff engineers and above would do well to know the majority of the topics below, but by no means is this knowledge required to pass an interview.
          </p>

          <h3 id="scalability">Scalability</h3>
          <p>
            Let's start by understanding the constraints of a single Kafka broker. It's important in your interview to estimate the throughput and number of messages you'll be storing in order to determine whether we need to worry about scaling in the first place.
          </p>
          <p>
            First, there is no hard limit on the size of a Kafka message as this can be configured via <code>message.max.bytes</code>. However, it is recommended to keep messages under 1MB to ensure optimal performance via reduced memory pressure and better network utilization.
          </p>
          <p>
            It's a common anti-pattern in system design interviews to store large blobs of data in Kafka. Kafka is not a database, and it's not meant to store large files. It's meant to store small messages that can be processed quickly.
          </p>
          <p>
            For example, when designing YouTube, we need to perform post-processing on videos after uploading to chunk and transcode them. Naively, you might place the videos in Kafka so that the chunk/transcoding worker can pull them off the queue asynchronously and process them. This is not a good idea. Instead, you should store the videos in a distributed file system like S3 and place a message in Kafka with the location of the video in S3. This way, the Kafka message is small and serves as a pointer to the full video in S3.
          </p>
          <p>
            On good hardware, a single broker can store around 1TB of data and handle as many as 1M messages per second (this is very hand wavy as it depends on message size and hardware specs, but is a useful estimate). If your design does not require more than this, than scaling is likely not a relevant conversation.
          </p>
          <p>
            In the case that you do need to scale, you have a couple strategies at your disposal:
          </p>
          <ul>
            <li><strong>Horizontal Scaling With More Brokers:</strong> The simplest way to scale Kafka is by adding more brokers to the cluster. This helps distribute the load and offers greater fault tolerance. Each broker can handle a portion of the traffic, increasing the overall capacity of the system. It's really important that when adding brokers you ensure that your topics have sufficient partitions to take advantage of the additional brokers. More partitions allow more parallelism and better load distribution. If you are under partitioned, you won't be able to take advantage of these newly added brokers.</li>
            <li><strong>Partitioning Strategy:</strong> This should be the main focus of your scaling strategy in an interview and is the main decision you make when dealing with Kafka clusters (since much of the scaling happens dynamically in managed services nowadays). You need to decide how to partition your data across the brokers. This is done by choosing a key for your messages. The partition is determined by hashing the key using a hash function (murmur2 by default) and taking the modulo with the number of partitions: <code>partition = hash(key) % num_partitions</code>. If you choose a bad key, you can end up with hot partitions that are overwhelmed with traffic. Good keys are ones that are evenly distributed across the partition space.</li>
          </ul>
          <p>
            It's worth noting that outside of an interview, many scaling consideration are made easy via managed Kafka services like Confluent Cloud or AWS MSK. These services handle much of the scaling for you, but you should still understand the underlying concepts.
          </p>
          <p>
            When working with Kafka, you're usually thinking about scaling topics rather than the entire cluster. This is because different topics can have different requirements. For example, you may have a topic that is very high throughput and needs to be partitioned across many brokers, while another topic is low throughput and can be handled by a single broker. To scale a topic, you can increase the number of partitions, which will allow you to take advantage of more brokers.
          </p>

          <h3 id="handling-hot-partitions">How can we handle hot partitions?</h3>
          <p>
            Interviewers love to ask this question. Consider an Ad Click Aggregator where Kafka stores a stream of click events from when users click on ads. Naturally, you would start by partitioning by ad id. But when Nike launches their new Lebron James ad, you better believe that partition is going to be overwhelmed with traffic and you'll have a hot partition on your hands.
          </p>
          <p>
            There are a few strategies to handle hot partitions:
          </p>
          <ul>
            <li><strong>No key (default partitioning):</strong> If you don't provide a key, Kafka will distribute messages across partitions using its default partitioner (modern clients use a sticky strategy that batches to one partition then rotates, producing roughly even distribution over time). The downside is that you lose the ability to guarantee ordering of related messages. If ordering isn't important to your design, this is a good option.</li>
            <li><strong>Random salting:</strong> We can add a random number or timestamp to the ad ID when generating the partition key. This can help in distributing the load more evenly across multiple partitions, though it may complicate aggregation logic later on the consumer side. This is often referred to as "salting" the key.</li>
            <li><strong>Use a compound key:</strong> Instead of using just the ad ID, use a combination of ad ID and another attribute, such as geographical region or user ID segments, to form a compound key. This approach helps in distributing traffic more evenly and is particularly useful if you can identify attributes that vary independently of the ad ID.</li>
            <li><strong>Back pressure:</strong> Depending on your requirements, one easy solution is to just slow down the producer. If you're using a managed Kafka service, they may have built-in mechanisms to handle this. If you're running your own Kafka cluster, you can implement back pressure by having the producer check the lag on the partition and slow down if it's too high.</li>
          </ul>

          <h3 id="fault-tolerance">Fault Tolerance and Durability</h3>
          <p>
            If you chose Kafka, one reason may have been because of its strong durability guarantees. But how does Kafka ensure that your data is safe and that no messages are lost?
          </p>
          <p>
            Kafka ensures data durability through its replication mechanism. Each partition is replicated across multiple brokers, with one broker acting as the leader and others as followers. When a producer sends a message, it is written to the leader and then replicated to the followers. This ensures that even if a broker fails, the data remains available. Producer acknowledgments (acks setting) play a crucial role here. Setting <code>acks=all</code> ensures that the message is acknowledged only when all in-sync replicas (ISR) have received it, providing the strongest durability guarantee available.
          </p>
          <p>
            Depending on how much durability you need, you can configure the replication factor of your topics. The replication factor is the number of replicas that are maintained for each partition. A replication factor of 3 is common, meaning that each partition has 3 total replicas (1 leader + 2 followers). So if one broker fails, the data is still available on the other two and we can promote a follower to be the new leader.
          </p>
          <p>
            But what happens when a consumer goes down?
          </p>
          <p>
            Kafka is usually thought of as always available. You'll often hear people say, "Kafka is always available, sometimes consistent." This means that a question like, "what happens if Kafka goes down?" is not very realistic, and you may even want to gently push back on the interviewer if they ask this.
          </p>
          <p>
            What is far more relevant and likely is that a consumer goes down. When a consumer fails, Kafka's fault tolerance mechanisms help ensure continuity:
          </p>
          <ul>
            <li><strong>Offset Management:</strong> Remember that partitions are just append-only logs where each message is assigned a unique offset. Consumers commit their offsets to Kafka after they process a message. This is the consumers way of saying, "I've processed this message." When a consumer restarts, it reads its last committed offset from Kafka and resumes processing from there. This ensures no messages are missed, though some may be reprocessed if the consumer crashed before committing its latest offset (at-least-once delivery).</li>
            <li><strong>Rebalancing:</strong> When part of a consumer group, if one consumer goes down, Kafka will redistribute the partitions among the remaining consumers so that all partitions are still being processed.</li>
          </ul>
          <p>
            The trade-off you may need to consider in an interview is when to commit offsets. In Design a Web Crawler, for example, you want to be careful not to commit the offset until you're sure the raw HTML has been stored in your blob storage. The more work a consumer has to do, the more likely you are to have to redo work if the consumer fails. For this reason, keeping the work of the consumer as small as possible is a good strategy -- as was the case in Web Crawler where we broke the crawler into 2 phases: downloading the HTML and then parsing it.
          </p>

          <h3 id="handling-retries-and-errors">Handling Retries and Errors</h3>
          <p>
            While Kafka itself handles most of the reliability (as we saw above), our system may fail getting messages into and out of Kafka. We need to handle these scenarios gracefully.
          </p>
          
          <h4 id="producer-retries">Producer Retries</h4>
          <p>
            First up, we may fail to get a message to Kafka in the first place. Errors can occur due to network issues, broker unavailability, or transient failures. To handle these scenarios gracefully, Kafka producers support automatic retries. Here's a sneak peek of how you can configure them:
          </p>
          <CodeBlock language="javascript">{`const producer = kafka.producer({
  retry: {
    retries: 5, // Retry up to 5 times
    initialRetryTime: 100, // Wait 100ms between retries
  },
  idempotent: true,
});`}</CodeBlock>
          <p>
            You'll want to ensure that you enable idempotent producer mode to avoid duplicate messages when retries are enabled. This just ensures that messages are only sent once in the case we incorrectly think they weren't sent.
          </p>

          <h4 id="consumer-retries">Consumer Retries</h4>
          <p>
            On the consumer side, we may fail to process a message for any number of reasons. Kafka does not actually support retries for consumers out of the box (but AWS SQS does!) so we need to implement our own retry logic. One common pattern is to set up a custom topic that we can move failed messages to and then have a separate consumer that processes these messages. This way, we can retry messages as many times as we want without affecting the main consumer. If a given message is retried too many times, we can move it to a dead letter queue (DLQ). DLQs are just a place to store failed messages so that we can investigate them later.
          </p>

          {/* Diagram: DLQ */}
          <div className="diagram-container">
            <div className="diagram-title">Consumer Retries & DLQ Flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--server" style={{ minWidth: '140px' }}>Main Topic</div>
                </div>
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>
                <div className="diagram-box" style={{ background: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5', minWidth: '140px' }}>
                  <strong>Consumer</strong>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Processing fails</div>
                </div>
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--connection" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a', minWidth: '140px' }}>
                    Retry Topic
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Retry Consumer</div>
                </div>
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--server" style={{ background: '#f8fafc', color: 'var(--text-muted)', minWidth: '140px' }}>
                    Dead Letter Queue
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Max retries reached</div>
                </div>
              </div>
            </div>
          </div>

          <p>
            You'll see in our Web Crawler breakdown that we actually opt for SQS instead of Kafka so that we could take advantage of the built-in retry and dead letter queue functionality without having to implement it ourselves.
          </p>

          <h3 id="performance-optimizations">Performance Optimizations</h3>
          <p>
            Especially when using Kafka as an event stream, we need to be mindful of performance so that we can process messages as quickly as possible.
          </p>
          <p>
            The first thing we can do is batch messages by sending multiple messages in a single <code>send()</code> call. Kafka producers naturally batch messages before sending them over the network to reduce overhead. You can also use <code>sendBatch()</code> to send messages across multiple topics in one call.
          </p>
          <CodeBlock language="javascript">{`await producer.send({
  topic: 'my_topic',
  messages: [
    { key: 'key1', value: 'message1' },
    { key: 'key2', value: 'message2' },
    { key: 'key3', value: 'message3' },
  ],
});`}</CodeBlock>
          
          <p>
            Another common way to improve throughput is by compressing messages. This can be done by setting the compression option when sending messages. Kafka supports several compression algorithms, including GZIP, Snappy, and LZ4. Essentially, we're just making the messages smaller so that they can be sent faster.
          </p>
          <CodeBlock language="javascript">{`const { CompressionTypes } = require('kafkajs')

await producer.send({
  topic: 'my_topic',
  compression: CompressionTypes.GZIP,
  messages: [
    { key: 'key1', value: 'Hello, Kafka!' },
  ],
});`}</CodeBlock>

          <p>
            Arguably the biggest impact you can have to performance comes back to your choice of partition key. The goal is to maximize parallelism by ensuring that messages are evenly distributed across partitions. In your interview, discussing the partition strategy, as we go into above, should just about always be where you start.
          </p>

          <h3 id="retention-policies">Retention Policies</h3>
          <p>
            Kafka topics have a retention policy that determines how long messages are retained in the log. This is configured via the <code>retention.ms</code> and <code>retention.bytes</code> settings. The default retention policy is to keep messages for 7 days.
          </p>
          <p>
            In your interview, you may be asked to design a system that needs to store messages for a longer period of time. In this case, you can configure the retention policy to keep messages for a longer duration. Just be mindful of the impact on storage costs and performance.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 7 — Summary
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="summary">Summary</h2>
          <p>
            Congrats! You made it through. Let's recap quickly.
          </p>
          <p>
            Apache Kafka is an open-source, distributed event streaming platform engineered for high performance, scalability, and durability. It uses producers to send messages to topics, and consumers to read them, with messages being stored in ordered, immutable partitions across multiple brokers (servers). It is highly suited for real-time data processing and asynchronous message queuing in system design.
          </p>
          <p>
            When it comes to scale, make sure you start by discussing your partitioning strategy and how you'll handle hot partitions. And remember, Kafka is always available, sometimes consistent 😝
          </p>

          <div className="takeaway-card">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Takeaways
            </h3>
            <ul>
              <li><strong>Distributed Event Streaming:</strong> Kafka handles high performance, scalability, and durability, useful as both a message queue and a stream processing platform.</li>
              <li><strong>Partitions & Ordering:</strong> Keys determine partitions. Messages within the same partition are processed in exact chronological order.</li>
              <li><strong>Leader-Follower Replication:</strong> Partitions are replicated across brokers. The <code>acks=all</code> setting ensures maximum durability.</li>
              <li><strong>Scalability Considerations:</strong> Keep messages small (under 1MB). Partition strategies must carefully avoid "hot partitions."</li>
              <li><strong>Consumer Mechanics:</strong> Consumers use a pull-based model and track progress using offset commits.</li>
              <li><strong>Error Recovery:</strong> Producers use idempotency for safe retries; consumers use Retry Topics and DLQs to handle processing failures.</li>
            </ul>
          </div>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#elasticsearch" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Elasticsearch</div>
            </div>
          </a>
          <a href="#api-gateway" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">API Gateway</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
