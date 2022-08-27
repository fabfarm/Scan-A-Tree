import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Layout } from '../src/components/Layout';
import { useCustomRouter } from '../src/customRouter';

const ScanPage = () => {
  const router = useCustomRouter();

  return (
    <Layout>
      <QRBlock
        onChange={(itemId) => {
          console.warn({ itemId });
          router.goToPlantState(itemId);
        }}
      />
      <div className='text-center'>
        <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
          Scan plan QR Code
        </div>
        <div>Thank you 🙂</div>
      </div>
    </Layout>
  );
};

const QRBlock = ({ onChange }: { onChange: (textValue: string) => void }) => {
  const [valueFound, setValueFound] = useState('');
  useEffect(() => {
    if (valueFound) {
      onChange(valueFound);
    }
  }, [valueFound]);
  return (
    <div style={{ width: 300, height: 300 }}>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            const resultText = result?.getText();
            if (resultText && resultText !== valueFound) {
              setValueFound(resultText);
            }
          }

          if (!!error) {
            setValueFound(valueFound);
          }
        }}
        constraints={{}}
      />
    </div>
  );
};

export default ScanPage;
