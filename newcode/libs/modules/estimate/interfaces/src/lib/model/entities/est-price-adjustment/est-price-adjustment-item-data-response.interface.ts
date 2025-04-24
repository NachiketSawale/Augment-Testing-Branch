import { IEstPriceAdjustmentUrbData } from './est-price-adjustment-urb-data.interface';
import { IEstPriceAdjustmentItemData } from './est-price-adjustment-item-data.interface';

export interface IEstPriceAdjustmentItemDataResponse {
    boqStructure?:IEstPriceAdjustmentUrbData;
    priceAdjustments?:IEstPriceAdjustmentItemData[] | null;
    boqTree?:IEstPriceAdjustmentItemData[] | null;
}