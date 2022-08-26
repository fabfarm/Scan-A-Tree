const basicFetchService = {
  get: <T,>(url: string): Promise<T> => {
    return fetch(url).then((res) => res.json());
  },
  post: <T,>(url: string, body: Record<string, unknown>): Promise<T> => {
    return fetch(url, { method: 'POST', body: JSON.stringify(body) }).then(
      (res) => res.json(),
    );
  },
};
const ROUTES = {
  DATA: '/api/data',
  STATUSES: '/api/statuses',
  UPDATE_STATUS: '/api/update_status',
};

type Status = {
  name: string;
  icon: string;
};

export const API_SDK = {
  getData: () => {
    return basicFetchService.get<Array<Record<string, string>>>(ROUTES.DATA);
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
