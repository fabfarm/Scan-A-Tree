import { Status } from './types/Status';

const answerParser = (data: { error?: string }) => {
  if (data.error) {
    throw Error(data.error);
  }
  return data;
};

const responseParser = <T,>(response: Promise<Response>): Promise<T> => {
  return response.then((res) => res.json()).then(answerParser) as Promise<T>;
};

const basicFetchService = {
  get: <T,>(url: string): Promise<T> => {
    return responseParser(fetch(url));
  },
  post: <T,>(url: string, body: Record<string, unknown>): Promise<T> => {
    return responseParser(
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  },
};
const API_ROUTES = {
  DATA: '/api/data',
  STATUSES: '/api/statuses',
  ONE_DATA: (dataId: string) => `/api/data/${dataId}`,
  UPDATE_TREES: '/api/update_trees',
};

export const API_SDK = {
  getData: () => {
    return basicFetchService.get<Array<Record<string, string>>>(
      API_ROUTES.DATA,
    );
  },
  getDataById: (dataId: string) => {
    return basicFetchService.get<Array<Record<string, string>>>(
      API_ROUTES.ONE_DATA(dataId),
    );
  },
  updateDataById: (dataId: string, body: Record<string, string>) => {
    return basicFetchService.post<Array<Record<string, string>>>(
      API_ROUTES.ONE_DATA(dataId),
      body,
    );
  },
  getStatuses: () => {
    return basicFetchService.get<Status[]>(API_ROUTES.STATUSES);
  },
  updateStatus: (itemId: string, newStatus: string) => {
    return basicFetchService.post(API_ROUTES.STATUSES, {
      id: itemId,
      newStatus: newStatus,
    });
  },
  updateTreesData: (data: string) => {
    return basicFetchService.post(API_ROUTES.UPDATE_TREES, { data });
  },
};
