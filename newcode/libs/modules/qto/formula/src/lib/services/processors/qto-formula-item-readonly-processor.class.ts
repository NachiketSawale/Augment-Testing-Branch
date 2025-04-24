/*
 * Copyright(c) RIB Software GmbH
 */


import {EntityReadonlyProcessorBase, ReadonlyFunctions} from '@libs/basics/shared';
import {IQtoFormulaEntity} from '../../model/entities/qto-formula-entity.interface';
import {QtoFormulaGridDataService} from '../qto-formula-grid-data.service';
import {QtoShareFormulaType} from '@libs/qto/shared';

export class QtoFormulaItemReadonlyProcessor extends EntityReadonlyProcessorBase<IQtoFormulaEntity> {

    public constructor(protected dataService: QtoFormulaGridDataService) {
        super(dataService);
    }

    public override generateReadonlyFunctions(): ReadonlyFunctions<IQtoFormulaEntity> {
        return {
            IsMultiline: {
                shared: ['MaxLinenumber'],
                readonly: info => {
                    return !info.item.IsMultiline;
                }
            },
            Operator1:{
                shared: ['Operator2', 'Operator3', 'Operator4', 'Operator5','Value1IsActive', 'Value2IsActive', 'Value3IsActive', 'Value4IsActive', 'Value5IsActive'],
                readonly: info => {
                    return info.item.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput;
                }
            }
        };
    }
}