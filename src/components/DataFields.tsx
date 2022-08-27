import { useCustomRouter } from '../customRouter';

export const DataFields = ({
  id,
  name,
  age,
  comingFrom,
  status,
  column,
}: Record<string, string>) => {
  return (
    <div
      key={id}
      className='data_container'
      style={column ? { gridTemplateColumns: 'auto' } : {}}
    >
      <span>Name: {name}</span>
      <span>Planted on: {age}</span>
      <span>Coming from: {comingFrom}</span>
      <span>Status: {status}</span>
    </div>
  );
};

export const ListItem = ({
  id,
  name,
  areaName,
  description,
  planted,
  image,
}: Record<string, string>) => {
  const router = useCustomRouter();
  return (
    <div className='plant_list_item'>
      <div className='plant_list_item-left'>
        <img className='plant_list_item-picture' src={image} alt={name} />
        <span className='plant_list_item-name'>{description}</span>
      </div>
      <div className='flex flex-column gap1 justify-center plant_list_item-right'>
        <span className='plant_list_item-area'>{areaName}</span>
        <span className='plant_list_item-id'>{id}</span>
        <span className='plant_list_item-planted'>🌱 {planted}</span>
        <span style={{ position: 'absolute', right: 10, bottom: 10 }}>
          <span className='pointer' onClick={() => router.goToPlantState(id)}>
            👁
          </span>
        </span>
      </div>
    </div>
  );
};
