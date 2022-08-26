import { useState } from 'react';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';

const UpdateTreesPage = () => {
  const [inputValue, setValue] = useState('');
  const [updateTreesDataState, updateTreesData] = useAsyncFn(
    API_SDK.updateTreesData,
  );
  return (
    <div>
      <div>
        <button
          onClick={() => {
            updateTreesData(inputValue);
          }}
        >
          Go
        </button>
      </div>
      <textarea
        value={inputValue}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      ></textarea>
      <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Result</div>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(updateTreesDataState?.value, null, 12)}
      </div>
    </div>
  );
};

export default UpdateTreesPage;
