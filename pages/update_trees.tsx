import { useState } from 'react';
import { useAsyncFn } from 'react-use';
import { API_SDK } from '../src/API_SDK';
import { Layout } from '../src/components/Layout';

const UpdateTreesPage = () => {
  const [inputValue, setValue] = useState('');
  const [updateTreesDataState, updateTreesData] = useAsyncFn(
    API_SDK.updateTreesData,
  );
  return (
    <Layout>
      <div>
        1. Paste the Trees.kml exported from google maps in the text area below
        then click on go
      </div>
      <div>
        2. Check the result printed below is not error and match the updates you
        made :)
      </div>
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
        style={{ width: '100%', minHeight: 300 }}
      ></textarea>
      <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Result</div>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(updateTreesDataState?.value, null, 12)}
      </div>
    </Layout>
  );
};

export default UpdateTreesPage;
