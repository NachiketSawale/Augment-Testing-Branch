/*
 * Copyright(c) RIB Software GmbH
 */


import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { forEach } from 'lodash';
import { IEstPriceAdjustmentTotalEntity } from '@libs/estimate/interfaces';
import { EstimatePriceAdjustmentTotalDataService } from './estimate-price-adjustment-total.data.service';

export class EstimatePriceAdjustmentTotalReadonlyProcessor extends EntityReadonlyProcessorBase<IEstPriceAdjustmentTotalEntity> {

    public constructor(protected dataService: EstimatePriceAdjustmentTotalDataService) {
        super(dataService);
    }
    public override process(entity: IEstPriceAdjustmentTotalEntity){
        if (entity) {
            const fields = ['AdjType', 'Quantity', 'EstimatedPrice', 'AdjustmentPrice', 'TenderPrice', 'DeltaA', 'DeltaB'];
            const specialFields = ['EstimatedPrice', 'AdjustmentPrice', 'TenderPrice'];
            const specialFields1 = ['DeltaA', 'DeltaB'];
            const readonlyEntityIds = ['EpNa','TotalWq','TotalAq'];
            const readonlyFields = [];

            if (this.dataService.hasReadOnlyAdjustment() || readonlyEntityIds.includes(entity.Id)) {
                this.dataService.setEntityReadOnly(entity,true);
            } else {
                const readOnlyURBFields = this.dataService.getAdjustmentReadOnlyURB();
                const isSpecialReadOnly = this.dataService.hasSpecialReadOnlyAdjustment();
                if (readOnlyURBFields && readOnlyURBFields.includes(entity.Id)) {
                    forEach(fields, function (filed) {
                        readonlyFields.push({field: filed, readOnly: true});
                    });
                } else if (entity.Id !== 'Aq') {
                    readonlyFields.push({field: 'Quantity', readOnly: true});
                }
                if (isSpecialReadOnly && ['Aq', 'Wq'].includes(entity.Id)) {
                    forEach(Object.keys(entity), ( key) =>{
                        if (specialFields.includes(key)) {
                            readonlyFields.push({field: key, readOnly: true});
                            //entity[key] = entity[key] !== null ? 0 : null;
                        }
                        if (specialFields1.includes(key)) {
                            //entity[key] = entity[key] !== null ? 0 : null;
                        }
                    });
                }
            }
            this.dataService.setEntityReadOnlyFields(entity, readonlyFields);
        }
    }

    public override generateReadonlyFunctions(): ReadonlyFunctions<IEstPriceAdjustmentTotalEntity> {
        return {};
    }
}