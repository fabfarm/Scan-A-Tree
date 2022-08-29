import { keyBy } from 'lodash';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { API_SDK } from '../API_SDK';
import { scopeEval } from '../shared/scopeEval';

const METADATA_LOCALSTORAGE_KEY = '_METADATAS_LOCALSTORAGE_KEY_';
const REFRESH_DIFF_IN_MS = 5 * 60 * 1000; // 5mins

type MetaDataContextType = {
  [key: string]: any;
  lastRefresh: string;
};

const initialMetaDataContextValue: MetaDataContextType = {
  lastRefresh: '',
};

const initialMetaDataContextValueWithActions: MetaDataContextType &
  MetaDataContextActions = {
  ...initialMetaDataContextValue,
  updateItemFields: () => {
    return {};
  },
};

type MetaDataContextActions = {
  updateItemFields: (item: Record<string, string>) => Record<string, string>;
};

type MetaDataStorageType = MetaDataContextType;
const MetaDataContext = createContext<
  MetaDataContextType & MetaDataContextActions
>(initialMetaDataContextValueWithActions);
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
      API_SDK.getComputedFields().then((computedFields) => {
        setMetaData((metadataState) => {
          return {
            ...metadataState,
            computedFields,
            lastRefresh: refreshDate,
          };
        });
      });
      API_SDK.getStatuses().then((statuses) => {
        const statusesByName = keyBy(statuses, (status) => status.name);
        setMetaData((metadataState) => {
          return {
            ...metadataState,
            statuses: statusesByName,
            lastRefresh: refreshDate,
          };
        });
      });
    }
  }, []);

  return (
    <MetaDataContext.Provider
      value={
        metadata
          ? {
              ...metadata,
              updateItemFields: (item) => {
                const computedFields: Array<{ name: string; value: string }> =
                  metadata.computedFields;
                if (computedFields) {
                  const addedFields = Object.fromEntries(
                    computedFields.map((field) => {
                      return [field.name, scopeEval({ item }, field.value)];
                    }),
                  );
                  console.log({ addedFields });
                  return addedFields;
                }
                return {};
              },
            }
          : initialMetaDataContextValueWithActions
      }
    >
      {children}
    </MetaDataContext.Provider>
  );
};

export const useMetadataContext = () => {
  const metadatas = useContext(MetaDataContext);
  return metadatas;
};
