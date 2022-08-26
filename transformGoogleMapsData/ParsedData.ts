export declare module ParsedData {
  export interface Icon {
    href: string;
  }

  export interface HotSpot {
    x: string;
    xunits: string;
    y: string;
    yunits: string;
  }

  export interface IconStyle {
    color: string;
    scale: string;
    Icon: Icon;
    hotSpot: HotSpot;
  }

  export interface Style {
    id: string;
    IconStyle: IconStyle;
  }

  export interface Datum {
    name: string;
    value: string;
  }

  export interface ExtendedData {
    Data: Datum[];
  }

  export interface Point {
    coordinates: string;
  }

  export interface Placemark {
    name: string;
    description: string;
    styleUrl: string;
    ExtendedData: ExtendedData;
    Point: Point;
  }

  export interface Document {
    name: string;
    Style: Style[];
    Placemark: Placemark[];
  }

  export interface Kml {
    xmlns: string;
    Document: Document;
  }

  export interface Result {
    kml: Kml;
  }

  export interface RootObject {
    result: Result;
  }
}
