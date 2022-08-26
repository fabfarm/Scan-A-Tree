export const StatusItem = ({
  status,
}: {
  status: { icon: string; name: string };
}) => {
  return (
    <span key={status.name} className='status_item'>
      <span className='status_item-icon'>{status.icon}</span>
      <span className='status_item-name'>{status.name}</span>
    </span>
  );
};
