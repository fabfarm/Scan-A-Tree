import { ReactNode, useEffect } from 'react';
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
      <CheckPageContent itemId={itemId} />
    </MetadataProvider>
  );
};

const CheckPageContent = ({ itemId }: { itemId: string }) => {
  const { updateItemFields } = useMetadataContext();
  const [dataState, getItemData] = useAsyncFn(() =>
    API_SDK.getDataById(itemId, updateItemFields),
  );

  useEffect(() => {
    if (itemId) {
      getItemData();
    }
  }, [itemId, updateItemFields]);

  let ContentComponent: ReactNode = null;
  if (dataState.error) {
    ContentComponent = <div>{dataState.error.message}</div>;
  } else if (dataState.loading) {
    ContentComponent = <div>Loading</div>;
  } else if (!dataState.value) {
    ContentComponent = (
      <div>
        <div>No data found</div>
      </div>
    );
  }

  if (ContentComponent) {
    return <Layout>{ContentComponent}</Layout>;
  }

  const dataItem = dataState.value as unknown as Record<string, string>;

  return (
    <Layout
      bottomBarActions={
        dataItem.coordinates
          ? [
              {
                emoji: '🧭',
                action: () => {
                  window.open(
                    generateGoogleMapsUrlFromCoordinates(dataItem.coordinates),
                    '_blank norefereer',
                  );
                },
              },
            ]
          : undefined
      }
    >
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
        </div>
      </div>
    </Layout>
  );
};

export default CheckPage;

const generateGoogleMapsUrlFromCoordinates = (coordinates: string) => {
  const [lat, lon] = coordinates.split(',');
  return `https://www.google.com/maps/preview?q=${lon},${lat}`;
};
