/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    ServiceRole,
    IDataServiceOptions,
    IDataServiceEndPointOptions,
    IDataServiceRoleOptions, DataServiceFlatNode
} from '@libs/platform/data-access';
import { IQtoFormulaEntity } from '../model/entities/qto-formula-entity.interface';
import { QtoFormulaRubricCategoryGridDataService } from './qto-formula-rubric-category-grid-data.service';
import {IRubricCategoryEntity} from '../model/entities/rubric-category-entity.interface';
import * as _ from 'lodash';
import {
    IIdentificationData, 
    PlatformConfigurationService,
    PlatformPermissionService, PlatformReportLanguageItemService,
} from '@libs/platform/common';
import { QtoFormulaItemComplete } from '../model/qto-formula-item-complete.class';
import { QtoFormulaRubricCategoryGridComplete } from '../model/qto-formula-rubric-category-grid-complete.class';
import {BlobsEntity} from '@libs/basics/shared';
import {QtoShareFormulaType} from '@libs/qto/shared';
import {QtoFormulaItemReadonlyProcessor} from './processors/qto-formula-item-readonly-processor.class';

@Injectable({
    providedIn: 'root'
})

export class QtoFormulaGridDataService extends DataServiceFlatNode<IQtoFormulaEntity, QtoFormulaItemComplete, IRubricCategoryEntity, QtoFormulaRubricCategoryGridComplete> {
    private readonly http = inject(HttpClient);
    private readonly configurationService = inject(PlatformConfigurationService);
    private readonly  platformPermissionService = inject(PlatformPermissionService);
    private readonly languageItemService = inject(PlatformReportLanguageItemService);
   
    public constructor(private parentDataService: QtoFormulaRubricCategoryGridDataService) {
        const options: IDataServiceOptions<IQtoFormulaEntity> = {
            apiUrl: 'qto/formula',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false
            },
            createInfo: <IDataServiceEndPointOptions>{
                endPoint: 'create',
                prepareParam: (ident: IIdentificationData) => {
                    const parent = this.getSelectedParent();
                    if (parent) {
                        return {
                            mainItemId: parent.Id,
                            maxCode: this.getMaxCode()
                        };
                    }
                    return {};
                }
            },
            roleInfo: <IDataServiceRoleOptions<IQtoFormulaEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'QtoFormula',
                parent: parentDataService,
            }
        };

        super(options);

        this.processor.addProcessor([
            // TODO - date processor
            new QtoFormulaItemReadonlyProcessor(this)
        ]);
        this.selectionChanged$.subscribe((entities) =>{
            if(entities.length){
                this.masterSelectionChanged();
            }
        });
    }

    protected override onLoadSucceeded(loaded: object): IQtoFormulaEntity[] {
        const items = _.get(loaded, 'Main');
        if (items) {
            return items as IQtoFormulaEntity[];
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
            throw new Error('There should be a selected parent qto header record to load the Formula data');
        }
    }

    protected override onCreateSucceeded(created: IQtoFormulaEntity): IQtoFormulaEntity {
        return created;
    }

    protected override provideCreatePayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                mainItemId: parent.Id,
                maxCode: this.getMaxCode()
            };
        }
        return {};
    }

    public override registerByMethod(): boolean {
        return true;
    }

    public override registerNodeModificationsToParentUpdate(complete: QtoFormulaRubricCategoryGridComplete, modified: QtoFormulaItemComplete[], deleted: IQtoFormulaEntity[]) {
        if (modified && modified.length > 0) {
            complete.QtoFormulaToSave = modified;
        }
        if (deleted && deleted.length > 0) {
            complete.QtoFormulaToDelete = deleted;
        }
    }

    public override createUpdateEntity(modified: IQtoFormulaEntity | null): QtoFormulaItemComplete {
        const complete =  new QtoFormulaItemComplete();
        if (modified){
            complete.MainItemId = modified.Id;
            complete.QtoFormula = modified;
        }

        return complete;
    }

    private getMaxCode(): number | undefined {
        const Codes: number[] = _.map(this.getList(), function (k) {
            return parseInt(k.Code || '0');
        });
        if (Codes.length > 0) {
            return _.max(Codes)?.valueOf();
        }
        return 0;
    }

    /**
     * formula selected change, set the blobs
     */
    public setBlobsToFormulaItem(){
        const itemSelected = this.getSelectedEntity();
        if (itemSelected && itemSelected.BasBlobsFk && !itemSelected.Blob){
            this.http.get(this.configurationService.webApiBaseUrl + 'cloud/common/blob/getblobbyid?id=' + itemSelected.BasBlobsFk).subscribe((response) => {
                const blob = response as BlobsEntity;
                if (blob) {
                    itemSelected.Blob = blob;
                }
            });
        }
    }
    
    public async parseScript(script:never):Promise<object> {
        return this.http.post(this.configurationService.webApiBaseUrl + 'qto/formula/parse', {script: script}).subscribe((response) => {
                return response;
            }
        );
    }
    public async getKeywords() {
        return this.http.get(this.configurationService.webApiBaseUrl + 'qto/formula/keywords').subscribe((response) => {
                return response;
            }
        );
    }

    public updateColumnReadOnly(items:Array<IQtoFormulaEntity>){
        const OperatorColumns = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];
        const modelScriptArray = ['Value1IsActive', 'Value2IsActive', 'Value3IsActive', 'Value4IsActive', 'Value5IsActive'];
        const multSettingArray = ['MaxLinenumber'];

        _.forEach(items, (item)=> {
            if(item.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput){
                this.updateReadOnly(item, OperatorColumns, true);
            }

            if(!item.IsMultiline){
                this.updateReadOnly(item, multSettingArray, true);
            }

            const _readOnly = item.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput;
            this.updateReadOnly(item, modelScriptArray, _readOnly);
        });
    }

    public updateReadOnly (item:IQtoFormulaEntity, modelArray:Array<string>, value:boolean) {
        _.forEach(modelArray, (model) => {
            this.setEntityReadOnlyFields(item, [
                {field: model, readOnly: value}
            ]);
        });
    }
    private readonly permissionUuid = '0a38c749abe04233aa0704f7d6c27088';
    public previewSelectedFormula() {
        const selectedFormula = this.getSelectedEntity();
        // const hasCreate = this.platformPermissionService.hasCreate(this.permissionUuid);
        // const hasWrite =  this.platformPermissionService.hasWrite(this.permissionUuid);
        // const hasDelete = this.platformPermissionService.hasDelete(this.permissionUuid);
        if (selectedFormula && selectedFormula.BasFormFk) {
            // todo depend on 'cloudCommonLanguageService'
        }
    }

    private masterSelectionChanged(){
        // todo: load Srcipt Data serivce
        // $injector.get('qtoFormulaScriptDataService').load();
    }

    /**
     *  get contianer ScriptDefinition Readonly: only the script type can be edited.
     * @constructor
     */
    public IsScriptDefinitionReadonly(){
        const itemSelected = this.getSelectedEntity();

        return !(itemSelected && itemSelected.QtoFormulaTypeFk === QtoShareFormulaType.Script);
    }
}











