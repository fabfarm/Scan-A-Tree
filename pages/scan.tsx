import { useRouter } from 'next/router';
import { QrReader } from 'react-qr-reader';

const ScanPage = () => {
  const router = useRouter();

  return (
    <QRBlock
      onChange={(itemId) => {
        console.warn({ itemId });
        router.push(`/check/${itemId}`);
      }}
    />
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

export default ScanPage;
