/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {ColumnDef, ConcreteFieldOverload, FieldType} from '@libs/ui/common';
import {BehaviorSubject} from 'rxjs';
import {IEstModifyFieldsEntity} from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root'
})
export class EstimateSharedReplaceResourceFieldsUiService{
    private readonly defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<IEstModifyFieldsEntity>>({
        type: FieldType.Description
    });
    
    public getGridColumns() {
        return [
            {
                id: 'f1',
                model: 'Description',
                type: FieldType.Description,
                label: {
                    text: 'Fields',
                    key: 'estimate.main.replaceResourceWizard.fields.description',
                },
                visible: true,
                readonly: true,
                width: 200
            },
            {
                id: 'f2',
                model: 'IsChange',
                type: FieldType.Boolean,
                label: {
                    text: 'Is Change',
                    key: 'estimate.main.replaceResourceWizard.fields.isChange',
                },
                headerChkbox: true,
                visible: true,
                readonly: true,
                width: 75,
                // TODO:
                // validator: function (entity, value) {
                //     let estResourceCommonService = $injector.get('estimateMainReplaceResourceCommonService');
                //     entity.IsChange = value;
                //     if(value) {
                //         // get replace element value
                //         let replaceElement = estResourceCommonService.getReplaceElement();
                //         if (replaceElement && entity.ColumnId === 42 && replaceElement.EstCostTypeFk) {
                //             entity.ChangeFieldValue = replaceElement.EstCostTypeFk;
                //         }
                //         else if (replaceElement && entity.ColumnId === 23 && (replaceElement.Rate || (replaceElement.EstimatePrice && replaceElement.PriceUnit > 0))) {
                //             // ALM 101673
                //             let factorPriceUnit = replaceElement.FactorPriceUnit ? replaceElement.FactorPriceUnit : 1;
                //             let priceUnit = replaceElement.PriceUnit ? replaceElement.PriceUnit : 1;
                //             let costUnit = replaceElement.EstimatePrice * factorPriceUnit / priceUnit;
                //
                //             entity.ChangeFieldValue = replaceElement.Rate || costUnit;
                //         }
                //     }
                //     else{
                //         entity.ChangeFieldValue = null;
                //     }
                //     estResourceCommonService.setReplacedGridReadOnly([entity], false);
                // }
            },
            {
                id: 'f3',
                model: 'ChangeFieldValue',
                type: FieldType.Dynamic,
                overload:  ctx => {
                    this.updateDefaultValueOverload(ctx.entity);
                    return this.defaultValueOverloadSubject;
                },
                label: {
                    text: 'Change Value',
                    key: 'estimate.main.replaceResourceWizard.fields.changeFieldValue',
                },
                visible: true,
                readonly: true,
                width: 125
            },
        ] as Array<ColumnDef<IEstModifyFieldsEntity>>;
    }

    /**
     * Update overload when entity or type are changed
     * @param entity
     */
    public updateDefaultValueOverload(entity?: IEstModifyFieldsEntity) {
        let value: ConcreteFieldOverload<IEstModifyFieldsEntity> = {
            type: FieldType.Boolean
        };
        switch (entity?.Id) {
            case 23:// cost unit
            case 46:// Budget
            case 10:// QuantityFactor3
            case 11:// QuantityFactor4
                value = {
                    type: FieldType.Decimal
                };
                break;
            case 39:// lump sum
            case 40:// disabled
                value = {
                    type: FieldType.Boolean
                };
                break;
            default:
                break;
        }
        this.defaultValueOverloadSubject.next(value);
    }
}