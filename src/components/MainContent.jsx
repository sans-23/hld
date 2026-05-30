import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { VALID_ARTICLE_IDS } from '../config/navigation';
import { usePageTitle } from '../hooks/usePageTitle';
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
    
    // Default to Networking Essentials
    return <NetworkingEssentials />;
  };

  return (
    <main className="content-scrollable">
      <article>
        {renderArticle()}
      </article>
    </main>
  );
}
