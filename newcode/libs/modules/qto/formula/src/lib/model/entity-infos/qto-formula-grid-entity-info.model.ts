/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { QtoFormulaGridDataService } from '../../services/qto-formula-grid-data.service';
import { QtoFormulaGridLayoutService } from '../../services/layout-config/qto-formula-grid-layout.service';
import { IQtoFormulaEntity } from '../entities/qto-formula-entity.interface';
import { QtoFormulaItemGridBehavior } from '../../behaviors/qto-formula-item-grid-behavior.service';
import { QtoFormulaGridValidationService } from '../../services/validations/qto-formula-grid-validation.service';


export const QTO_FORMULA_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<IQtoFormulaEntity> ({
    grid: {
        title: {key: 'qto.formula.gridViewTitle',}
    },
    form: {
        title: {key: 'qto.formula.FormViewTitle'},
        containerUuid: 'f9f9dd20c26b4dfba11b1d863006e34b',
    },
    dataService: ctx => ctx.injector.get(QtoFormulaGridDataService),
    validationService: ctx => ctx.injector.get(QtoFormulaGridValidationService),
    dtoSchemeId: { moduleSubModule: 'Qto.Formula', typeName: 'QtoFormulaDto' },
    permissionUuid: '0a38c749abe04233aa0704f7d6c27088',
    layoutConfiguration: context=>{
        return context.injector.get(QtoFormulaGridLayoutService).generateLayout();
    },
    containerBehavior: ctx=> ctx.injector.get(QtoFormulaItemGridBehavior)
});