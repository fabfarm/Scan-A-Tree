import { keyBy } from 'lodash';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { API_SDK } from '../API_SDK';

const METADATA_LOCALSTORAGE_KEY = '_METADATAS_LOCALSTORAGE_KEY_';
const REFRESH_DIFF_IN_MS = 5 * 60 * 1000; // 5mins

type MetaDataContextType = {
  [key: string]: any;
  lastRefresh: string;
};

const initialMetaDataContextValue: MetaDataContextType = {
  lastRefresh: '',
};

type MetaDataStorageType = MetaDataContextType;
const MetaDataContext = createContext<MetaDataContextType>(
  initialMetaDataContextValue,
);
export const MetadataProvider = ({ children }: { children: ReactNode }) => {
  const [metadata, setMetaData] = useLocalStorage<MetaDataStorageType>(
    METADATA_LOCALSTORAGE_KEY,
    initialMetaDataContextValue,
  );

  useEffect(() => {
    if (
      !metadata?.lastRefresh ||
      new Date().getTime() - new Date(metadata?.lastRefresh).getTime() >
        REFRESH_DIFF_IN_MS
    ) {
      const refreshDate = new Date().toISOString();
      API_SDK.getStatuses().then((statuses) => {
        const statusesByName = keyBy(statuses, (status) => status.name);
        setMetaData({ statuses: statusesByName, lastRefresh: refreshDate });
      });
    }
  }, []);

  return (
    <MetaDataContext.Provider value={metadata || initialMetaDataContextValue}>
      {children}
    </MetaDataContext.Provider>
  );
};

export const useMetadataContext = () => {
  const metadatas = useContext(MetaDataContext);
  return metadatas;
};
