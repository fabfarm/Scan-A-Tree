import { keyBy } from 'lodash';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';

const Home: NextPage = () => {
  const statusesState = useAsync(API_SDK.getStatuses);
  const [dataState, fetchData] = useAsyncFn(API_SDK.getData, [], {
    value: [],
    loading: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  console.log(statusesState);
  if (statusesState.loading || dataState.loading) {
    return <div>Loading</div>;
  }

  if (!statusesState.value) {
    return <div>No status found</div>;
  }

  if (!dataState.value) {
    return null;
  }

  const statuses = statusesState.value;
  const statusByName = keyBy(statuses, (status) => status.name);

  const data = dataState.value;

  return (
    <div className='p2'>
      <div className='p0 flex'>
        {statusesState.value.map((status) => (
          <span key={status.name} className='status_item'>
            <span className='status_item-icon'>{status.icon}</span>
            <span className='status_item-name'>{status.name}</span>
          </span>
        ))}
      </div>
      <div style={{ padding: '2em' }}>
        {data.map(({ id, name, age, comingFrom, status }) => {
          const itemStatus = statusByName[status];
          return (
            <div key={id} className='data_container'>
              <span>Name: {name}</span>
              <span>Planted on: {age}</span>
              <span>Coming from: {comingFrom}</span>
              <span>Status: {itemStatus ? itemStatus.icon : '⁉'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
