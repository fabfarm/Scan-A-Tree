import { ReactNode, useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import Webcam from 'react-webcam';
import { API_SDK } from '../../src/API_SDK';
import { Layout } from '../../src/components/Layout';
import { useCustomRouter } from '../../src/customRouter';
import {
  MetadataProvider,
  useMetadataContext,
} from '../../src/providers/metadataProvider';

const AddImagePage = () => {
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
  const router = useCustomRouter();
  const [dataState, getItemData] = useAsyncFn(() =>
    API_SDK.getDataById(itemId),
  );
  const [uploadImageState, uploadImage] = useAsyncFn(API_SDK.uploadImage);
  const { statuses: statusesByName } = useMetadataContext();

  useEffect(() => {
    if (itemId) {
      getItemData();
    }
  }, [itemId]);

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
        <Webcam
          audio={false}
          height={400}
          screenshotFormat='image/jpeg'
          width={300}
          videoConstraints={{ facingMode: 'environment' }}
        >
          {/* @ts-ignore */}
          {({ getScreenshot }) => (
            <button
              disabled={uploadImageState.loading}
              onClick={async () => {
                if (uploadImageState.loading) {
                  return;
                }
                const imageSrc = getScreenshot();
                if (imageSrc) {
                  await uploadImage(itemId, imageSrc);
                  router.goToPlantState(itemId);
                } else {
                  window.alert('No image found');
                }
              }}
            >
              {uploadImageState.loading ? 'Uploading...' : 'Capture photo'}
            </button>
          )}
        </Webcam>
      </div>
    </Layout>
  );
};

export default AddImagePage;

const generateGoogleMapsUrlFromCoordinates = (coordinates: string) => {
  const [lat, lon] = coordinates.split(',');
  return `https://www.google.com/maps/preview?q=${lon},${lat}`;
};
