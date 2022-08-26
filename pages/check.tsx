import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';
import { DataFields } from '../src/components/DataFields';
import { StatusList } from '../src/components/StatusItem';
import {
  MetadataProvider,
  useMetadataContext,
} from '../src/providers/metadataProvider';

const CheckPage = () => {
  return (
    <MetadataProvider>
      <div style={{ padding: '0 1em' }}>
        <CheckPageContent />
      </div>
    </MetadataProvider>
  );
};

const CheckPageContent = () => {
  const [qrCodeValue, setQrCodeValue] = useState<string>();
  const [dataState, getDataState] = useAsyncFn(API_SDK.getDataById);
  const { statuses: statusesByName } = useMetadataContext();

  useEffect(() => {
    if (qrCodeValue) {
      getDataState(qrCodeValue);
    }
  }, [qrCodeValue]);

  const RedoComponent = (
    <div className='pointer p0' onClick={() => setQrCodeValue('')}>
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
  if (!qrCodeValue) {
    // return <div>Voluntarily off</div>;
    return <QRBlock onChange={setQrCodeValue} />;
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
        itemId={qrCodeValue}
        selected={dataItem?.status}
        onSuccess={(data) => {
          console.log(data);
          getDataState(qrCodeValue);
        }}
      />
    </div>
  );
};

const QRBlock = ({ onChange }: { onChange: (textValue: string) => void }) => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            onChange(result?.getText());
          }

          if (!!error) {
            console.info(error);
          }
        }}
        constraints={{}}
        // style={{ width: '100%' }}
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
