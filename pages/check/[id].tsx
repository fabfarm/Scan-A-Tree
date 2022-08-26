import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../../src/API_SDK';
import { DataFields } from '../../src/components/DataFields';
import { StatusList } from '../../src/components/StatusItem';
import {
  MetadataProvider,
  useMetadataContext,
} from '../../src/providers/metadataProvider';

const CheckPage = () => {
  const router = useRouter();
  const itemId = router.query?.id as string;
  if (!itemId) {
    return <div>No id received</div>;
  }
  return (
    <MetadataProvider>
      <div style={{ padding: '0 1em' }}>
        <CheckPageContent itemId={itemId} />
      </div>
    </MetadataProvider>
  );
};

const CheckPageContent = ({ itemId }: { itemId: string }) => {
  const [dataState, getItemData] = useAsyncFn(() =>
    API_SDK.getDataById(itemId),
  );
  const { statuses: statusesByName } = useMetadataContext();
  const router = useRouter();

  useEffect(() => {
    if (itemId) {
      getItemData();
    }
  }, [itemId]);

  const RedoComponent = (
    <div className='pointer p0' onClick={() => router.push('/scan')}>
      Scan again 🔄
    </div>
  );

  if (dataState.loading) {
    return <div>Loading</div>;
  }
  if (dataState.error) {
    return (
      <div>
        {RedoComponent}
        {dataState.error.message}
      </div>
    );
  }

  if (!dataState.value) {
    return (
      <div>
        {RedoComponent}
        <div>No data found</div>
      </div>
    );
  }

  const dataItem = dataState.value as unknown as Record<string, string>;

  return (
    <div>
      {RedoComponent}
      <DataFields
        {...{
          ...(dataItem as Record<string, string>),
          status:
            (statusesByName?.[dataItem?.status]?.icon as string) ||
            dataItem?.status,
        }}
        column={'true'}
      />
      <ChangeStatusBlock
        itemId={itemId}
        selected={dataItem?.status}
        onSuccess={(data) => {
          console.log(data);
          getItemData();
        }}
      />
    </div>
  );
};

const ChangeStatusBlock = ({
  itemId,
  onSuccess,
  selected,
}: {
  itemId: string;
  onSuccess: (data: any) => void;
  selected?: string;
}) => {
  //   const [inputValue, setInputValue] = useState('');
  const [updateItemState, updateItem] = useAsyncFn(API_SDK.updateDataById);
  const { statuses } = useMetadataContext();
  const allStatuses = Object.values(statuses || {});

  return (
    <StatusList
      statuses={allStatuses as any[]}
      selected={selected}
      onItemClick={(status) =>
        updateItem(itemId, { status: status.name }).then((data) =>
          onSuccess(data),
        )
      }
    />
  );
};

export default CheckPage;
