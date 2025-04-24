/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IMdcContrFormulaPropDefEntity } from '../model/entities/mdc-contr-formula-prop-def-entity.interface';
import {
    ControllingConfigurationFormulaDefinitionComplete
} from '../model/controlling-configuration-formula-definition-complete.class';
import { isArray, filter, forEach, find, map } from 'lodash';
import {ContrConfigFormulaTypeHelper} from './controlling-config-formula-type-helper.service';
import {ControllingConfigItemReadonlyProcessor} from './controlling-config-item-readonly-processor.service';
import {
    ControllingConfigurationFormulaDefinitionValidateService
} from './controlling-configuration-formula-definition-validate.service';
import {
    ControllingConfigurationColumnDefinitionDataService
} from './controlling-configuration-column-definition-data.service';


export const CONTROLLING_CONFIGURATION_FORMULA_DEFINITION_DATA_TOKEN = new InjectionToken<ControllingConfigurationFormulaDefinitionDataService<IMdcContrFormulaPropDefEntity>>('controllingConfigurationFormulaDefinitionDataToken');

@Injectable({
    providedIn: 'root'
})
export class ControllingConfigurationFormulaDefinitionDataService<T extends IMdcContrFormulaPropDefEntity> extends DataServiceFlatRoot<T, ControllingConfigurationFormulaDefinitionComplete> {

    private readonly contrConfigFormulaTypeHelper = inject(ContrConfigFormulaTypeHelper);
    private readonly readonlyProcessor:ControllingConfigItemReadonlyProcessor<T>;
    private readonly validateService = inject(ControllingConfigurationFormulaDefinitionValidateService);
    private readonly columnDataService = inject(ControllingConfigurationColumnDefinitionDataService);


    public constructor() {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'Controlling/Configuration/ContrFormulaPropDefController',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getFormulaPropDefList',
                usePost: true
            },
            roleInfo: <IDataServiceRoleOptions<IMdcContrFormulaPropDefEntity>>{
                role: ServiceRole.Root,
                itemName: 'ContrFormulaPropDefToSave',
            }
        };

        super(options);

        this.readonlyProcessor = this.createReadonlyProcessor();
        this.processor.addProcessor([this.readonlyProcessor]);
    }
    public override createUpdateEntity(modified: IMdcContrFormulaPropDefEntity | null): ControllingConfigurationFormulaDefinitionComplete {
        const complete = new ControllingConfigurationFormulaDefinitionComplete();
        if (modified !== null) {
            complete.Id = modified.Id;
            complete.ContrFormulaPropDefToSave = [modified];
        }

        return complete;
    }

    protected override checkDeleteIsAllowed(entities: IMdcContrFormulaPropDefEntity[] | IMdcContrFormulaPropDefEntity | null): boolean {
        if(!entities){
            return false;
        }

        let selectedItems: IMdcContrFormulaPropDefEntity[] = [];
        if(isArray(entities)){
            selectedItems = entities;
        }else{
            selectedItems.push(entities);
        }

        if(selectedItems.length === 0){
            return false;
        }

        if(filter(selectedItems, {IsBaseConfigData: true}).length > 0) {
            return false;
        }

        if(filter(selectedItems,  (item)=>{
            return this.contrConfigFormulaTypeHelper.isCac_m(item.BasContrColumnTypeFk || 0) && item.IsDefault;
         }).length > 0) {
            return false;
        }

        let isReferenced = false;
        const existList = this.getList() as IMdcContrFormulaPropDefEntity[];
        forEach(selectedItems, (item)=>{
            if(isReferenced) {
                return;
            }

            const reg = new RegExp('([a-zA-Z_]+[a-zA-Z0-9_]*)', 'g');
            let codes = [];
            forEach(existList, function (formula){
                if(isReferenced || formula.Id === item.Id || !formula.Formula || formula.Formula === '') {
                    return;
                }


                codes = formula && formula.Formula ? formula.Formula.match(reg) as string[] : [];
                if(codes && find(codes, function (c){
                    return c && c.toUpperCase() === item.Code;
                })){
                    isReferenced = true;
                }

            });

            if(isReferenced) {
                return;
            }
            if(item.Formula){
                codes = item && item.Formula ? item.Formula.match(reg) as string[] : [];
                if(codes){
                    forEach(codes, (code) => {
                        if(isReferenced) {
                            return;
                        }

                        const exist = find(existList, (e) =>{
                            return e.Code === code.toUpperCase() && e.Id !== item.Id;
                        });

                        if(exist && this.contrConfigFormulaTypeHelper.isWcfOrBcf(exist.BasContrColumnTypeFk || 0) && exist.IsDefault){
                            isReferenced = true;
                        }
                    });
                }
            }
        });

        return !isReferenced;
    }

    public  dataHandle(list: IMdcContrFormulaPropDefEntity[]): IMdcContrFormulaPropDefEntity[] {
        if(list && list.length > 0){
            forEach(list, function (item){
                item.IsBaseConfigData = (item.Id < 1000000);
                item.Code = item.Code || '';
            });
        }
        return list;
    }

    protected  createReadonlyProcessor(){

        return new ControllingConfigItemReadonlyProcessor(this);
    }

    protected override onCreateSucceeded(created: object): T {
        const entity = created as T;

        this.validateService.validateNewEntity(entity);
        this.readonlyProcessor.process(entity);

        return entity;
    }

    public setEntityFieldReadonly(entity: T){
        this.readonlyProcessor.process(entity);
    }

    public getParameters(entity?: IMdcContrFormulaPropDefEntity | null){
        let preList = this.columnDataService.getList();
        const selected = entity || this.getSelectedEntity();
        let list = this.getList() as IMdcContrFormulaPropDefEntity[];
        if(selected){
            list = filter(list, function (item){
                return item.Id !== selected.Id;
            });
        }

        if(!preList || preList.length <= 0){
            return this.columnDataService.refreshAll().then(() =>{
                preList = this.columnDataService.getList();
                return mergeList();
            });
        }

        return new Promise((resolve)=>{
            resolve(mergeList());
        });

        function mergeList(){
            const result: string[] = map(list, 'Code');
            forEach(preList, function (item){
                result.push(item.Code);
            });

            return result;
        }
    }
}

