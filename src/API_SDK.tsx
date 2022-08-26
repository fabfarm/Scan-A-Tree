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
const ROUTES = {
  DATA: '/api/data',
  STATUSES: '/api/statuses',
  ONE_DATA: (dataId: string) => `/api/data/${dataId}`,
};

export const API_SDK = {
  getData: () => {
    return basicFetchService.get<Array<Record<string, string>>>(ROUTES.DATA);
  },
  getDataById: (dataId: string) => {
    return basicFetchService.get<Array<Record<string, string>>>(
      ROUTES.ONE_DATA(dataId),
    );
  },
  updateDataById: (dataId: string, body: Record<string, string>) => {
    return basicFetchService.post<Array<Record<string, string>>>(
      ROUTES.ONE_DATA(dataId),
      body,
    );
  },
  getStatuses: () => {
    return basicFetchService.get<Status[]>(ROUTES.STATUSES);
  },
  updateStatus: (itemId: string, newStatus: string) => {
    return basicFetchService.post(ROUTES.STATUSES, {
      id: itemId,
      newStatus: newStatus,
    });
  },
};
