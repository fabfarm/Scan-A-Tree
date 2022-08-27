import { useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../../src/API_SDK';
import {
  AllItemStatuses,
  PlantItemDatas,
  PlantItemPicture,
} from '../../src/components/DataFields';
import { Layout } from '../../src/components/Layout';
import { useCustomRouter } from '../../src/customRouter';
import {
  MetadataProvider,
  useMetadataContext,
} from '../../src/providers/metadataProvider';

const CheckPage = () => {
  const router = useCustomRouter();
  const itemId = router.query?.id as string;
  if (!itemId) {
    return <div>No id received</div>;
  }
  return (
    <MetadataProvider>
      <Layout>
        <CheckPageContent itemId={itemId} />
      </Layout>
    </MetadataProvider>
  );
};

const CheckPageContent = ({ itemId }: { itemId: string }) => {
  const [dataState, getItemData] = useAsyncFn(() =>
    API_SDK.getDataById(itemId),
  );
  const { statuses: statusesByName } = useMetadataContext();

  useEffect(() => {
    if (itemId) {
      getItemData();
    }
  }, [itemId]);

  if (dataState.loading) {
    return <div>Loading</div>;
  }
  if (dataState.error) {
    return <div>{dataState.error.message}</div>;
  }

  if (!dataState.value) {
    return (
      <div>
        <div>No data found</div>
      </div>
    );
  }

  const dataItem = dataState.value as unknown as Record<string, string>;

  return (
    <div style={{ width: '100%' }}>
      <PlantItemPicture dataItem={dataItem} />
      <br />
      <div className='bold'>Click to update statuses</div>
      <AllItemStatuses
        dataItem={dataItem}
        showStatesNotTrue
        onStatusUpdate={() => {
          getItemData();
        }}
      />
      <br />
      <div className='flex flex-column gap1'>
        <PlantItemDatas dataItem={dataItem} />
        <span className='plant_list_item-id'>
          Last watered time: {dataItem.lastWateredTime}
        </span>
        {dataItem.coordinates ? (
          <a
            href={generateGoogleMapsUrlFromCoordinates(dataItem.coordinates)}
            target='_blank norefereer'
            style={{ fontSize: '1.2em', marginTop: '3em' }}
          >
            📍 Go to the plant
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default CheckPage;

const generateGoogleMapsUrlFromCoordinates = (coordinates: string) => {
  const [lat, lon] = coordinates.split(',');
  return `https://www.google.com/maps/preview?q=${lon},${lat}`;
};
