import React from 'react';
import NetworkingEssentials from './articles/NetworkingEssentials';
import DbIndexing from './articles/DbIndexing';
import Caching from './articles/Caching';
import Sharding from './articles/Sharding';
import ConsistentHashing from './articles/ConsistentHashing';
import CapTheorem from './articles/CapTheorem';
import DataModeling from './articles/DataModeling';
import ApiDesign from './articles/ApiDesign';
import NumbersToKnow from './articles/NumbersToKnow';
import Redis from './articles/Redis';
import Elasticsearch from './articles/Elasticsearch';
import Kafka from './articles/Kafka';
import ApiGateway from './articles/ApiGateway';
import Cassandra from './articles/Cassandra';
import DynamoDB from './articles/DynamoDB';
import PostgreSQL from './articles/PostgreSQL';
import Flink from './articles/Flink';
import ZooKeeper from './articles/ZooKeeper';
import TimeSeriesDatabases from './articles/TimeSeriesDatabases';

export default function MainContent({ activeArticleId }) {
  if (activeArticleId === 'db-indexing') {
    return <DbIndexing />;
  }

  if (activeArticleId === 'caching') {
    return <Caching />;
  }

  if (activeArticleId === 'sharding') {
    return <Sharding />;
  }

  if (activeArticleId === 'consistent-hashing') {
    return <ConsistentHashing />;
  }

  if (activeArticleId === 'cap-theorem') {
    return <CapTheorem />;
  }

  if (activeArticleId === 'data-modeling') {
    return <DataModeling />;
  }

  if (activeArticleId === 'api-design') {
    return <ApiDesign />;
  }

  if (activeArticleId === 'numbers-to-know') {
    return <NumbersToKnow />;
  }

  if (activeArticleId === 'redis') {
    return <Redis />;
  }

  if (activeArticleId === 'elasticsearch') {
    return <Elasticsearch />;
  }

  if (activeArticleId === 'kafka') {
    return <Kafka />;
  }

  if (activeArticleId === 'api-gateway') {
    return <ApiGateway />;
  }

  if (activeArticleId === 'cassandra') {
    return <Cassandra />;
  }

  if (activeArticleId === 'dynamodb') {
    return <DynamoDB />;
  }

  if (activeArticleId === 'postgresql') {
    return <PostgreSQL />;
  }

  if (activeArticleId === 'flink') {
    return <Flink />;
  }

  if (activeArticleId === 'zookeeper') {
    return <ZooKeeper />;
  }

  if (activeArticleId === 'time-series') {
    return <TimeSeriesDatabases />;
  }

  // Default to Networking Essentials
  return <NetworkingEssentials />;
}
