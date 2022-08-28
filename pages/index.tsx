import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';
import { isDataItemStatusTrue, ListItem } from '../src/components/DataFields';
import { Layout } from '../src/components/Layout';
import {
  StatusesFilterValue,
  StatusFilter,
} from '../src/components/StatusItem';
import {
  MetadataProvider,
  useMetadataContext,
} from '../src/providers/metadataProvider';
import { Status } from '../src/types/Status';

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
  const [statusesFilter, setStatusesFilter] = useState<StatusesFilterValue>({});

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

  const dataToShow = filerDataDependingOnStatusFilter(
    data,
    statusesByName,
    statusesFilter,
  );

  return (
    <>
      <div>Filter by status</div>
      <StatusFilter
        statuses={statuses as any[]}
        onUpdateStatusFilter={setStatusesFilter}
      />
      <br />
      <div
        className='flex flex-column gap0 overflow-scroll'
        style={{ paddingRight: 10 }}
      >
        {dataToShow.map((itemData) => {
          return <ListItem {...itemData} key={itemData.id} />;
        })}
      </div>
    </>
  );
};

export default Home;

const filerDataDependingOnStatusFilter = (
  data: Record<string, string>[],
  statusesByName: Record<string, Status>,
  statusesFilter: StatusesFilterValue,
) => {
  const statusAndStateWanted = Object.entries(statusesFilter).filter(
    ([key, value]) => {
      return value && value !== 'null';
    },
  );
  if (statusAndStateWanted.length === 0) {
    return data;
  }
  const shouldThrowThisElement = (dataItem: Record<string, string>) => {
    return statusAndStateWanted.some(([key, statusValue]) => {
      const statusField = statusesByName[key]?.field;
      const dataItemValueExists = isDataItemStatusTrue(dataItem, statusField);
      // cosnt h
      if (statusValue === 'true' && dataItemValueExists) {
        return false;
      }
      if (statusValue === 'false' && !dataItemValueExists) {
        return false;
      }
      return true;
    });
  };
  return data.filter((data) => !shouldThrowThisElement(data));
};
