import { Injectable } from '@angular/core';
import {
    DataServiceHierarchicalLeaf,
    IDataServiceOptions,
    IDataServiceRoleOptions,
    ServiceRole, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {
    IEstPriceAdjustmentItemData,
    IEstPriceAdjustmentTotalEntity
} from '@libs/estimate/interfaces';
import { EstimatePriceAdjustmentDataService } from '../price-adjustment/estimate-price-adjustment.data.service';
import { EstPriceAdjustmentComplete } from '../../model/complete/est-price-adjustment-complete.class';
import { IIdentificationData } from '@libs/platform/common';
import { EstimatePriceAdjustmentTotalReadonlyProcessor } from './estimate-price-adjustment-total-readonly-processor.service';
import { EstimatePriceAdjustmentTotalMapService } from './estimate-price-adjustment-total-map.service';

// eslint-disable-next-line angular-file-naming/service-filename-suffix
@Injectable({ providedIn: 'root' })
export class EstimatePriceAdjustmentTotalDataService extends DataServiceHierarchicalLeaf<IEstPriceAdjustmentTotalEntity,IEstPriceAdjustmentItemData,EstPriceAdjustmentComplete> {

    private _adjustmentInstance?:EstimatePriceAdjustmentTotalMapService;
    
    public constructor(private parentService:EstimatePriceAdjustmentDataService) {
        const options: IDataServiceOptions<IEstPriceAdjustmentTotalEntity> = {
            apiUrl: 'estimate/main/priceadjustment',
            roleInfo: <IDataServiceRoleOptions<IEstPriceAdjustmentTotalEntity>>{
                role: ServiceRole.Root,
                itemName: 'EstimatePriceAdjustmentToSave',
                parent:parentService
            },
            provider: {
                load(ident:IIdentificationData): Promise<IEstPriceAdjustmentTotalEntity[]> {
                    const parentSelected = parentService.getSelectedEntity();
                    if(parentSelected) {
                        _this._adjustmentInstance = new EstimatePriceAdjustmentTotalMapService(parentService, parentSelected);
                        return Promise.resolve(_this._adjustmentInstance.getGridData());
                    }
                    return Promise.resolve([] as IEstPriceAdjustmentTotalEntity[]);
                },
                create(): Promise<IEstPriceAdjustmentTotalEntity> {
                    return Promise.resolve({} as IEstPriceAdjustmentTotalEntity);
                }
            }
        };
        super(options);
        this.processor.addProcessor([new EstimatePriceAdjustmentTotalReadonlyProcessor(this)]);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
    }

    public getAdjustmentTotalEntity() {
        return this._adjustmentInstance;
    }

    public isPosition() {
        // todo: cheni DEV-12722 depended on 'boqMainCommonService'
        return true;//_adjustmentInstance && _adjustmentInstance.entity ? boqMainCommonService.isItem(_adjustmentInstance.entity) : false;
    }

    public IsAssignedLineItem() {
        return this._adjustmentInstance && this._adjustmentInstance.entity ? !!this._adjustmentInstance.entity.IsAssignedLineItem : false;
    }

    public isReadOnlyAdjustment() {
        return !(this.isPosition() && this.IsAssignedLineItem());
    }

    public getAdjustmentReadOnlyURB() {
        return this._adjustmentInstance && this._adjustmentInstance.entity ? this.parentService.getReadOnlyURBFiledName(this._adjustmentInstance.entity) : null;
    }

    public hasUpdatePermission() {
        return this.parentService.hasUpdatePermission();
    }

    public hasReadOnlyAdjustment() {
        return this._adjustmentInstance && this._adjustmentInstance.entity && this.parentService.hasReadOnlyItem(this._adjustmentInstance.entity) || this.isReadOnlyAdjustment();
    }

    public hasSpecialReadOnlyAdjustment() {
        return this._adjustmentInstance && this._adjustmentInstance.entity && this.parentService.hasSpecialReadOnly(this._adjustmentInstance.entity);
    }

    public recalculate(info: ValidationInfo<IEstPriceAdjustmentItemData>):Promise<ValidationResult> {
        return this.parentService.recalculate(info);
    }
}