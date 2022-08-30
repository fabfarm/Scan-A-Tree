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
  COMPUTED_FIELDS: '/api/computed_fields',
  ONE_DATA: (dataId: string) => `/api/data/${dataId}`,
  UPDATE_TREES: '/api/update_trees',
  UPLOAD_IMAGE: '/api/images/upload',
};

export const API_SDK = {
  getData: (
    mappingFn: (
      item: Record<string, string>,
    ) => Record<string, string> = () => {
      return {};
    },
  ) => {
    return basicFetchService
      .get<Array<Record<string, string>>>(API_ROUTES.DATA)
      .then((datas) =>
        datas.map((item) => {
          return { ...item, ...mappingFn?.(item) };
        }),
      );
  },
  getDataById: (
    dataId: string,
    mappingFn: (
      item: Record<string, string>,
    ) => Record<string, string> = () => {
      return {};
    },
  ) => {
    return basicFetchService
      .get<Record<string, string>>(API_ROUTES.ONE_DATA(dataId))
      .then((item) => {
        return { ...item, ...mappingFn?.(item) };
      });
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
  getComputedFields: () => {
    return basicFetchService.get<Array<{ name: string; value: string }>>(
      API_ROUTES.COMPUTED_FIELDS,
    );
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
  uploadImage: (itemId: string, image: string) => {
    if (!image) {
      throw Error('No file received to upload');
    }
    return basicFetchService.post(API_ROUTES.UPLOAD_IMAGE, {
      image,
      itemId,
      fieldToUpdate: 'image',
    });
  },
};
