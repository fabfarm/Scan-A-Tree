import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';
import { ListItem } from '../src/components/DataFields';
import { Layout } from '../src/components/Layout';
import { StatusFilter } from '../src/components/StatusItem';
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
      <div>Filter by status</div>
      <StatusFilter statuses={statuses as any[]} />
      <br />
      <div className='flex flex-column gap0'>
        {data.map((itemData) => {
          return <ListItem {...itemData} key={itemData.id} />;
        })}
      </div>
    </>
  );
};

export default Home;
