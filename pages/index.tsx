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
    <div style={{ padding: '2em' }}>
      <div style={{ display: 'flex', gap: '.5em' }}>
        {statusesState.value.map((status) => (
          <span
            key={status.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              padding: '0.5em',
              aspectRatio: '1',
            }}
          >
            <span style={{ fontSize: '3em' }}>{status.icon}</span>
            <span>{status.name}</span>
          </span>
        ))}
      </div>
      <div style={{ padding: '2em' }}>
        {data.map(({ id, name, age, comingFrom, status }) => {
          const itemStatus = statusByName[status];
          return (
            <div
              key={id}
              style={{
                padding: '.5em',
                border: '1px solid #eee',
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                gap: '.2em',
              }}
            >
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
