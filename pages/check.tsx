import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';
import { DataFields } from '../src/components/DataFields';

const CheckPage = () => {
  const [qrCodeValue, setQrCodeValue] = useState<string>('2');
  const [dataState, getDataState] = useAsyncFn(API_SDK.getDataById);

  useEffect(() => {
    if (qrCodeValue) {
      getDataState(qrCodeValue);
    }
  }, [qrCodeValue]);

  if (dataState.loading) {
    return <div>Loading</div>;
  }
  if (dataState.error) {
    return <div>{dataState.error.message}</div>;
  }
  if (!qrCodeValue) {
    return <div>Voluntarily off</div>;
    return <QRBlock onChange={setQrCodeValue} />;
  }

  if (!dataState.value) {
    return <div>No data found</div>;
  }

  const dataItem = dataState.value;

  return (
    <div>
      <DataFields
        {...(dataItem as unknown as Record<string, string>)}
        column={'true'}
      />
      <ChangeStatusBlock
        itemId={qrCodeValue}
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
}: {
  itemId: string;
  onSuccess: (data: any) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [updateItemState, updateItem] = useAsyncFn(API_SDK.updateDataById);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateItem(itemId, { status: inputValue }).then((data) =>
          onSuccess(data),
        );
      }}
    >
      <input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <button type='submit'>Change status</button>
    </form>
  );
};

export default CheckPage;
