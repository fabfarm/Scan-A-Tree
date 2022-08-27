import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';
import { DataFields } from '../src/components/DataFields';
import { Layout } from '../src/components/Layout';
import { StatusList } from '../src/components/StatusItem';
import {
  MetadataProvider,
  useMetadataContext,
} from '../src/providers/metadataProvider';

const Home = () => {
  return (
    <MetadataProvider>
      <Layout>
        <HomeContent />
      </Layout>
    </MetadataProvider>
  );
};

const HomeContent: NextPage = () => {
  const { statuses: statusesByName } = useMetadataContext();
  const [dataState, fetchData] = useAsyncFn(API_SDK.getData, [], {
    value: [],
    loading: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  if (dataState.loading) {
    return <div>Loading</div>;
  }

  if (!statusesByName) {
    return <div>No status found</div>;
  }

  if (!dataState.value) {
    return null;
  }

  const statuses = Object.values(statusesByName);
  const data = dataState.value;

  return (
    <>
      <StatusList statuses={statuses as any[]} />
      <div style={{ padding: '2em' }}>
        {data.map(({ id, name, age, comingFrom, status }) => {
          return (
            <DataFields
              key={id}
              {...{
                id,
                name,
                age,
                comingFrom,
                status: statusesByName[status]?.icon || '⁉',
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default Home;
