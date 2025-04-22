import { IQuoteHeaderEntity } from '@libs/procurement/interfaces';

  export interface Totals {
    itemSubTotal: number;
    boqSubTotal: number;
    subTotal: number;
    QtnId: number;
  }  
  
  export interface IExportMaterialEntity {
    Id?:number |null;
    IsChecked?:boolean;
    Totals: Totals[];
    Quote: IQuoteHeaderEntity[];
  }


export interface IExportMaterialData {
	FileExtension: string;
	FileName: string;
	Url: string;
	path: string
}