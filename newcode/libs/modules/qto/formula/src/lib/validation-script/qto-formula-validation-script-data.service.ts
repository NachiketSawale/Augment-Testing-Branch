/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
    DataServiceFlatLeaf,
    IDataServiceOptions,
    IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import { IQtoFormulaScriptEntity } from '../model/entities/qto-formula-script-entity.interface';
import { IRubricCategoryEntity } from '../model/entities/rubric-category-entity.interface';
import { QtoFormulaRubricCategoryGridComplete } from '../model/qto-formula-rubric-category-grid-complete.class';
import { QtoFormulaRubricCategoryGridDataService } from '../services/qto-formula-rubric-category-grid-data.service';
import { IQtoFormulaEntity } from '../model/entities/qto-formula-entity.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * QtoFormulaValidationScriptDataService: to save QtoFormulaScriptToSave
 */
export class QtoFormulaValidationScriptDataService extends DataServiceFlatLeaf<IQtoFormulaScriptEntity, IRubricCategoryEntity, QtoFormulaRubricCategoryGridComplete> {
    public constructor(private parentDataService: QtoFormulaRubricCategoryGridDataService) {
        const options: IDataServiceOptions<IQtoFormulaScriptEntity> = {
            apiUrl: '',
            roleInfo: <IDataServiceRoleOptions<IQtoFormulaEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'QtoFormulaScript',
                parent: parentDataService,
            }
        };

        super(options);
    }

    /**
     * to set QtoFormulaScriptEntity to save
     * @param item
     */
    public setItemAsModified(item: IQtoFormulaScriptEntity){
        this.setModified(item);
    }


}