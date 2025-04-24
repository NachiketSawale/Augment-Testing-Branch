import { CompleteIdentification } from '@libs/platform/common';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

export class EstPriceAdjustmentComplete implements CompleteIdentification<IEstPriceAdjustmentItemData>{
    public MainItemId?: number = 0;
    public EstHeaderId?: number = 0;
    public ProjectId?:number = 0;
    public EstimatePriceAdjustmentToSave?:IEstPriceAdjustmentItemData[] = [];
}