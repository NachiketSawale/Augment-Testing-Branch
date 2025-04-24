/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import * as _ from 'lodash';
import {
    ServiceRole,
    IDataServiceOptions,
    IDataServiceEndPointOptions,
    IDataServiceRoleOptions, DataServiceFlatLeaf
} from '@libs/platform/data-access';
import { QtoFormulaRubricCategoryGridDataService } from './qto-formula-rubric-category-grid-data.service';
import {IRubricCategoryEntity} from '../model/entities/rubric-category-entity.interface';
import { QtoFormulaRubricCategoryGridComplete } from '../model/qto-formula-rubric-category-grid-complete.class';
import { IQtoFormulaScriptTransEntity } from '../model/entities/qto-formula-script-trans-entity.interface';
import { QtoFormulaScriptValidationDataProcessor } from './processors/qto-formula-script-validation-data-processor.service';


@Injectable({
    providedIn: 'root'
})

export class QtoFormulaScriptValidationDataService extends DataServiceFlatLeaf<IQtoFormulaScriptTransEntity, IRubricCategoryEntity, QtoFormulaRubricCategoryGridComplete> {

    private currentTranslationItems: IQtoFormulaScriptTransEntity[] = [];

    public constructor(parentDataService: QtoFormulaRubricCategoryGridDataService) {
        const options: IDataServiceOptions<IQtoFormulaScriptTransEntity> = {
            apiUrl: 'qto/formula/scripttranslation',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false
            },
            createInfo: {
                prepareParam: () => {
                    const parent = parentDataService.getSelection()[0];

                    const parentId = parent && parent.Id ? parent.Id : -1;

                    return {
                        mainItemId: parentId
                    };
                }
            },
            roleInfo: <IDataServiceRoleOptions<IQtoFormulaScriptTransEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'QtoFormulaScriptTrans',
                parent: parentDataService,
            }
        };

        super(options);

        this.processor.addProcessor([
            new QtoFormulaScriptValidationDataProcessor(this)
        ]);
    }

    // TODO: need to add translation container

    protected override onLoadSucceeded(loaded: object): IQtoFormulaScriptTransEntity[] {
        if (loaded && 'Main' in loaded) {
            const items = loaded.Main as IQtoFormulaScriptTransEntity[];
            this.refreshValidationScriptParmList(items);
            return items;
        }
        return [];
    }

    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                mainItemId: parent.Id
            };
        } else {
            throw new Error('should be a selected parent.');
        }
    }

    // TODO: onUpdateSucceeded not ready, refresh parameters for script editor： this.refreshValidationScriptParmList(items);
    /* let basMergeInUpdateData = service.mergeInUpdateData;
    service.mergeInUpdateData = function(updateData){
        let result = basMergeInUpdateData(updateData);
        processTranslationItem(service.getList());
        return result;
    }; */

    /**
     * get Description from item
     */
    public getTranslator() {
        const translator = {};

        _.forEach(this.getList(), function(trans){
            if(trans.Code) {
                _.set(translator, trans.Code, trans.Description);
            }
        });

        return translator;
    }


    /**
     * refresh parameters for script editor
     * @param items
     */
    private refreshValidationScriptParmList(items: IQtoFormulaScriptTransEntity[]){
        // TODO: the ScriptEditorService not ready
        /* const validateScriptId = 'qto.formula.script.validation';

        const list = this.getList();
        const parameterItems = (angular.isArray(list) ? list : []).map(function (item) {
            return {name: item.Code, type: 'string', description: item.Description};
        });

        basicsCommonScriptEditorService.addVariable(validateScriptId, parameterItems); */
    }

    //region set and get data

    public setCurrentTranslationItems(items: IQtoFormulaScriptTransEntity[]){
        this.currentTranslationItems = items || [];
    }

    public getCurrentTranslationItems(){
        return this.currentTranslationItems;
    }

    //endregion
}












