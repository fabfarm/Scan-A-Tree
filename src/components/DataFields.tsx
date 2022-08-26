export const DataFields = ({
  id,
  name,
  age,
  comingFrom,
  status,
}: Record<string, string>) => {
  return (
    <div key={id} className='data_container'>
      <span>Name: {name}</span>
      <span>Planted on: {age}</span>
      <span>Coming from: {comingFrom}</span>
      <span>Status: {status}</span>
    </div>
  );
};
