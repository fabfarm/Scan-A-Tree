import { CSSProperties } from 'react';
import { API_SDK } from '../API_SDK';
import { useCustomRouter } from '../customRouter';
import { useMetadataContext } from '../providers/metadataProvider';
import { Status } from '../types/Status';

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

export const ListItem = (dataItem: Record<string, string>) => {
  const router = useCustomRouter();
  const { id, areaName, planted } = dataItem;
  return (
    <div className='plant_list_item'>
      <PlantItemPicture className='plant_list_item-left' dataItem={dataItem} />
      <div className='flex flex-column gap1 justify-center plant_list_item-right'>
        <AllItemStatuses dataItem={dataItem} />
        <PlantItemDatas dataItem={dataItem} />
        <span style={{ position: 'absolute', right: 10, bottom: 10 }}>
          <span className='pointer' onClick={() => router.goToPlantState(id)}>
            👁
          </span>
        </span>
      </div>
    </div>
  );
};

export const PlantItemPicture = ({
  dataItem: { image, description, name },
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  dataItem: Record<string, string>;
}) => {
  return (
    <div className={`position-relative ${className}`} {...props}>
      <img className='plant_list_item-picture' src={image} alt={name} />
      <span className='plant_list_item-name'>{description}</span>
    </div>
  );
};
export const PlantItemDatas = ({
  dataItem,
}: {
  dataItem: Record<string, string>;
}) => {
  const { id, areaName, planted } = dataItem;
  return (
    <>
      <span className='plant_list_item-area'>{areaName}</span>
      <span className='plant_list_item-id'>{id}</span>
      <span className='plant_list_item-planted'>🌱 {planted}</span>
    </>
  );
};

type AllItemStatusesProps = {
  dataItem: Record<string, string>;
  showStatesNotTrue?: boolean;
  onStatusClick?: (status: Status, isTrue: boolean) => void;
  onStatusUpdate?: () => void;
};

export const AllItemStatuses = ({
  dataItem,
  showStatesNotTrue,
  onStatusUpdate,
}: AllItemStatusesProps) => {
  const { statuses } = useMetadataContext();
  const allStatuses = Object.values(statuses || {}) as Status[];

  return (
    <div style={{ display: 'flex', gap: '1em' }}>
      {allStatuses.map((status) => {
        const { field, ...otherStatusFields } = status;
        const isStatusTrue = dataItem[field] && dataItem[field] !== 'FALSE';
        if (!isStatusTrue && !showStatesNotTrue) {
          return null;
        }
        const styleToCheckMark: CSSProperties = isStatusTrue
          ? { position: 'absolute', bottom: 0, right: 0, fontSize: '.3em' }
          : {
              position: 'absolute',
              inset: 0,
            };
        return (
          <span
            key={otherStatusFields.name}
            style={{
              position: 'relative',
              fontSize: '2em',
              cursor: onStatusUpdate ? 'pointer' : '',
            }}
            onClick={() => {
              if (!onStatusUpdate) {
                return;
              }
              updateStatus(dataItem, status, !!isStatusTrue).then(() => {
                onStatusUpdate();
              });
            }}
          >
            {otherStatusFields.icon}
            <span style={styleToCheckMark}>{isStatusTrue ? '✅' : '❌'} </span>
          </span>
        );
      })}
    </div>
  );
};

const updateStatus = (
  dataItem: Record<string, string>,
  status: Status,
  currentValue: boolean,
) => {
  const updateBody = status.updateAction
    ? scopeEval({}, status.updateAction)
    : { [status.field]: currentValue ? 'FALSE' : 'TRUE' };
  console.log({ updateBody });
  return API_SDK.updateDataById(dataItem.id, updateBody);
};

const scopeEval = (scope: Record<string, any>, script: string) => {
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict";return (${script || null})`).bind(scope)();
  } catch (e) {
    console.log({ script, scope });
    throw e;
  }
};
