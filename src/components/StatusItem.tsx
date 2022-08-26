import { Status } from '../types/Status';

export const StatusItem = ({
  status,
  onClick,
  selected,
}: {
  status: Status;
  onClick?: (status: Status) => void;
  selected?: boolean;
}) => {
  return (
    <span
      key={status.name}
      className={`status_item ${selected ? 'border_selected' : ''}`}
      onClick={() => onClick?.(status)}
    >
      <span className='status_item-icon'>{status.icon}</span>
      <span className='status_item-name'>{status.name}</span>
    </span>
  );
};

export const StatusList = ({
  statuses,
  onItemClick,
  selected,
}: {
  statuses: Status[];
  onItemClick?: (status: Status) => void;
  selected?: string;
}) => {
  return (
    <div className='p0 flex'>
      {statuses.map((status) => (
        <StatusItem
          status={status}
          selected={selected === status.name}
          key={status.icon}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};
