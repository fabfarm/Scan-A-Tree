import { isEqual, keyBy, reduce } from 'lodash';
import { ParsedData } from './ParsedData';

type GoogleSheetTreeData = {
  name: string;
  description: string;
  areaName: string;
  areaCode: string;
  treeId: string;
  planted: string;
  coordinates: string;
  color: string;
};

export const transformDataToGoodSheetElements = (
  treeDataElement: ParsedData.Placemark,
  stylesById: Record<string, ParsedData.Style>,
): GoogleSheetTreeData => {
  const propertiesByName = keyBy(
    treeDataElement.ExtendedData.Data,
    (extendedData) => extendedData.name,
  );
  const styleIdWithHashtag = treeDataElement.styleUrl;
  const styleWithoutHashtag = styleIdWithHashtag.replace('#', '');
  const styleGoogle = stylesById[styleWithoutHashtag];

  return {
    name: treeDataElement.name,
    description: propertiesByName['descrição']?.value,
    areaName: propertiesByName['Area Name']?.value,
    areaCode: propertiesByName['Area Code']?.value,
    treeId: propertiesByName['Tree ID_2']?.value,
    planted: propertiesByName['planted']?.value,
    coordinates: treeDataElement.Point.coordinates,
    color: styleGoogle?.IconStyle?.color,
  };
};

// this is more check that referenceObject is included in objectToCompare
export const areObjectsDifferent = (
  referenceObject: Record<string, unknown>,
  objectToCompare: Record<string, unknown>,
) => {
  const objectWithSameKeys = Object.fromEntries(
    Object.entries(referenceObject).map(([key, value]) => {
      return [key, objectToCompare[key]];
    }),
  );
  const areSameObject = isEqual(referenceObject, objectWithSameKeys);
  if (areSameObject) {
    return false;
  }
  return getDifferentPropsBetweenObjects(referenceObject, objectWithSameKeys);
};

const getDifferentPropsBetweenObjects = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
) => {
  return reduce(
    a,
    function (result: any, value, key) {
      return isEqual(value, b[key])
        ? result
        : result.concat({ [key]: `${value} vs ${b[key]}` });
    },
    [],
  );
};
