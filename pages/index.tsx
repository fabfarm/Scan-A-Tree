import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';
import { DataFields } from '../src/components/DataFields';
import { StatusItem } from '../src/components/StatusItem';
import {
  MetadataProvider,
  useMetadataContext,
} from '../src/providers/metadataProvider';

const Home = () => {
  return (
    <MetadataProvider>
      <HomeContent />
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
    <div className='p2'>
      <div className='p0 flex'>
        {statuses.map((status: any) => (
          <StatusItem status={status} key={status.icon} />
        ))}
      </div>
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
    </div>
  );
};

export default Home;
