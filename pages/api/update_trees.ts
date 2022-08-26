// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { keyBy } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import parser from 'xml2json';
import { dataDatabase } from '../../server/sheetDatabase';
import { ParsedData } from '../../transformGoogleMapsData/ParsedData';
import {
  areObjectsDifferent,
  transformDataToGoodSheetElements,
} from '../../transformGoogleMapsData/transformGeoJsonToGS';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const text2Parse = req.body.data;

  const result = parser.toJson(text2Parse);

  try {
    const parsedData: ParsedData.Result = JSON.parse(result);

    if (!parsedData?.kml?.Document?.Style) {
      console.log({ parsedData });
      throw new Error('This is not the expected parsing');
    }

    const { Style, Placemark, name } = parsedData.kml.Document;

    const stylesById = keyBy(Style, (style) => style.id);
    const placemarks = Placemark.map((item) =>
      transformDataToGoodSheetElements(item, stylesById),
    );

    const allItems = await dataDatabase.find();
    const allItemsByName = keyBy(allItems, (item) => item.name);
    const allPlacemarkByName = keyBy(placemarks, (item) => item.name);

    const allItemsNames = allItems.map((item) => item.name);
    const newItems = placemarks.filter(
      (placemark) => !allItemsNames.includes(placemark.name),
    );
    const existingItemNames = Object.keys(allItemsByName);

    const differentItems = [];
    for (const itemName of existingItemNames) {
      const differentValues = areObjectsDifferent(
        allPlacemarkByName[itemName],
        allItemsByName[itemName],
      );
      if (differentValues) {
        differentItems.push({ itemName, differentValues });
      }
    }

    let insertedDocuments = [];
    if (newItems) {
      const newInsertedDocuments = await dataDatabase.insert(newItems);
      insertedDocuments.push(...newInsertedDocuments);
    }

    let updatedDocuments = [];
    if (differentItems.length) {
      for (const differentItem of differentItems) {
        const itemName = differentItem.itemName;
        const result = await dataDatabase.updateOne(
          { name: itemName },
          allPlacemarkByName[itemName],
        );
        updatedDocuments.push(result);
      }
    }

    res.json({ newItems, differentItems, insertedDocuments, updatedDocuments });
  } catch (e) {
    //@ts-ignore
    res.status(400).json({ e, message: 'message' in e ? e.message : null });
  }
}
