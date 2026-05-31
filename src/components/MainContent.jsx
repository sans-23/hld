import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { VALID_ARTICLE_IDS } from '../config/navigation';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProgress } from '../context/ProgressContext';
import './MainContent.css';

import NetworkingEssentials from '../content/articles/networking-essentials.mdx';
import DbIndexing from '../content/articles/db-indexing.mdx';
import Caching from '../content/articles/caching.mdx';
import Sharding from '../content/articles/sharding.mdx';
import ConsistentHashing from '../content/articles/consistent-hashing.mdx';
import CapTheorem from '../content/articles/cap-theorem.mdx';
import DataModeling from '../content/articles/data-modeling.mdx';
import ApiDesign from '../content/articles/api-design.mdx';
import NumbersToKnow from '../content/articles/numbers-to-know.mdx';
import Redis from '../content/articles/redis.mdx';
import Elasticsearch from '../content/articles/elasticsearch.mdx';
import Kafka from '../content/articles/kafka.mdx';
import ApiGateway from '../content/articles/api-gateway.mdx';
import Cassandra from '../content/articles/cassandra.mdx';
import DynamoDB from '../content/articles/dynamodb.mdx';
import PostgreSQL from '../content/articles/postgresql.mdx';
import Flink from '../content/articles/flink.mdx';
import ZooKeeper from '../content/articles/zookeeper.mdx';
import TimeSeriesDatabases from '../content/articles/time-series.mdx';
import RealTime from '../content/articles/real-time.mdx';
import Contention from '../content/articles/contention.mdx';
import MultiStep from '../content/articles/multi-step.mdx';
import ScalingReads from '../content/articles/scaling-reads.mdx';
import ScalingWrites from '../content/articles/scaling-writes.mdx';
import LargeBlobs from '../content/articles/large-blobs.mdx';
import LongRunning from '../content/articles/long-running.mdx';
import JavaMap from '../content/articles/java-map.mdx';
import JavaQueue from '../content/articles/java-queue.mdx';
import JavaStack from '../content/articles/java-stack.mdx';
import JavaList from '../content/articles/java-list.mdx';
import JavaSet from '../content/articles/java-set.mdx';
import JavaThreads from '../content/articles/java-threads.mdx';
import JavaLocks from '../content/articles/java-locks.mdx';
import JavaConcurrentCollections from '../content/articles/java-concurrent-collections.mdx';
import JavaVirtualThreads from '../content/articles/java-virtual-threads.mdx';
import JavaJVM from '../content/articles/java-jvm.mdx';
import JavaGC from '../content/articles/java-gc.mdx';
import NotFound from './NotFound';

export default function MainContent() {
  const { articleId } = useParams();
  usePageTitle(articleId);

  if (articleId && !VALID_ARTICLE_IDS.includes(articleId)) {
    return <NotFound />;
  }

  const renderArticle = () => {
    if (articleId === 'db-indexing') return <DbIndexing />;
    if (articleId === 'caching') return <Caching />;
    if (articleId === 'sharding') return <Sharding />;
    if (articleId === 'consistent-hashing') return <ConsistentHashing />;
    if (articleId === 'cap-theorem') return <CapTheorem />;
    if (articleId === 'data-modeling') return <DataModeling />;
    if (articleId === 'api-design') return <ApiDesign />;
    if (articleId === 'numbers-to-know') return <NumbersToKnow />;
    if (articleId === 'redis') return <Redis />;
    if (articleId === 'elasticsearch') return <Elasticsearch />;
    if (articleId === 'kafka') return <Kafka />;
    if (articleId === 'api-gateway') return <ApiGateway />;
    if (articleId === 'cassandra') return <Cassandra />;
    if (articleId === 'dynamodb') return <DynamoDB />;
    if (articleId === 'postgresql') return <PostgreSQL />;
    if (articleId === 'flink') return <Flink />;
    if (articleId === 'zookeeper') return <ZooKeeper />;
    if (articleId === 'time-series') return <TimeSeriesDatabases />;
    if (articleId === 'real-time') return <RealTime />;
    if (articleId === 'contention') return <Contention />;
    if (articleId === 'multi-step') return <MultiStep />;
    if (articleId === 'scaling-reads') return <ScalingReads />;
    if (articleId === 'scaling-writes') return <ScalingWrites />;
    if (articleId === 'large-blobs') return <LargeBlobs />;
    if (articleId === 'long-running') return <LongRunning />;
    if (articleId === 'java-map') return <JavaMap />;
    if (articleId === 'java-queue') return <JavaQueue />;
    if (articleId === 'java-stack') return <JavaStack />;
    if (articleId === 'java-list') return <JavaList />;
    if (articleId === 'java-set') return <JavaSet />;
    if (articleId === 'java-threads') return <JavaThreads />;
    if (articleId === 'java-locks') return <JavaLocks />;
    if (articleId === 'java-concurrent-collections') return <JavaConcurrentCollections />;
    if (articleId === 'java-virtual-threads') return <JavaVirtualThreads />;
    if (articleId === 'java-jvm') return <JavaJVM />;
    if (articleId === 'java-gc') return <JavaGC />;
    
    // Default to Networking Essentials
    return <NetworkingEssentials />;
  };

  const { completedArticles, toggleCompleted } = useProgress();
  const activeArticleId = articleId || 'networking';
  const isCompleted = completedArticles.includes(activeArticleId);

  return (
    <main className="content-scrollable">
      <article>
        {renderArticle()}
      </article>

      <div className="article-completion-footer">
        <button 
          className={`btn-completion ${isCompleted ? 'completed' : ''}`}
          onClick={() => toggleCompleted(activeArticleId)}
        >
          {isCompleted ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Topic Completed
            </>
          ) : (
            'Mark Topic as Completed'
          )}
        </button>
      </div>
    </main>
  );
}
