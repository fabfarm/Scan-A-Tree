import { useState } from 'react';
import { Status } from '../types/Status';

export const StatusItem = ({
  status,
  onClick,
  state,
}: {
  status: Status;
  onClick?: (status: Status) => void;
  state?: 'true' | 'false' | 'null';
}) => {
  const selected = state && state !== 'null';
  return (
    <span
      key={status.name}
      className={`status_item pointer position-relative ${
        selected ? 'border_selected' : 'border_invisible'
      }`}
      onClick={() => onClick?.(status)}
    >
      <span className='status_item-icon'>{status.icon}</span>
      <span className='status_item-name'>{status.name}</span>
      {selected ? (
        <span style={{ position: 'absolute', bottom: 0, right: 0 }}>
          {state === 'true' ? '✅' : '❌'}{' '}
        </span>
      ) : null}
    </span>
  );
};

type StatusSelectedValue = 'true' | 'false' | 'null';
const nextStatusToHave: Record<StatusSelectedValue, StatusSelectedValue> = {
  true: 'false',
  false: 'null',
  null: 'true',
};

export type StatusesFilterValue = Record<string, StatusSelectedValue>;

export const StatusFilter = ({
  statuses,
  onUpdateStatusFilter,
}: {
  statuses: Status[];
  onUpdateStatusFilter?: (statusSelected: StatusesFilterValue) => void;
}) => {
  const [statusesSelected, updateStatuses] = useState<StatusesFilterValue>({});
  const onSelectStatus = (statusSelected: Status) => {
    let currentStatusState = statusesSelected[statusSelected.name] || 'null';
    const newStatusState = nextStatusToHave[currentStatusState];
    const newStatusesSelected = {
      ...statusesSelected,
      [statusSelected.name]: newStatusState,
    };
    updateStatuses(newStatusesSelected);
    onUpdateStatusFilter?.(newStatusesSelected);
  };
  return (
    <div className='p0 flex gap0'>
      {statuses.map((status) => (
        <StatusItem
          status={status}
          state={statusesSelected[status.name]}
          key={status.icon}
          onClick={onSelectStatus}
        />
      ))}
    </div>
  );
};
