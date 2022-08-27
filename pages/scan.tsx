import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useCustomRouter } from '../src/customRouter';

const ScanPage = () => {
  const router = useCustomRouter();

  return (
    <QRBlock
      onChange={(itemId) => {
        console.warn({ itemId });
        router.goToPlantState(itemId);
      }}
    />
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
