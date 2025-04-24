/*
 * Copyright(c) RIB Software GmbH
 */

import {
    DataServiceHierarchicalRoot,
    IDataServiceEndPointOptions,
    IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import {get, isNull, set, forEach, find} from 'lodash';
import {EstimateRuleBaseComplete, IEstRuleEntityGenerated} from '@libs/estimate/interfaces';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {IDialogResult, UiCommonMessageBoxService} from '@libs/ui/common';
import {firstValueFrom, Subject} from 'rxjs';

export class EstimateRuleBaseDataService<
    T extends IEstRuleEntityGenerated,
    U extends EstimateRuleBaseComplete,
> extends DataServiceHierarchicalRoot<T, U>{

    protected http = inject(HttpClient);
    protected configurationService = inject(PlatformConfigurationService);
    protected uiCommonMessageBoxService = inject(UiCommonMessageBoxService);

    protected gridId = '';
    protected serForEstimate = false;
    protected rulesOnCheckedUpdatePromise: Promise<[] | void> | null = null;
    protected isRuleOnCheckedUpdateInProcess = false;

    //event
    public onMultipleSelectionChanged = new Subject<boolean>();


    /**
     * Constructor
     *
     */
    protected constructor( options: {
        itemName: string,
        apiUrl: string,
        readEndPoint: string,
        canCreate?: boolean,
        canUpdate?: boolean,
        canDelete?: boolean,
        createEndPoint?: string,
        updateEndPoint?: string,
        deleteEndPoint?: string,
    }) {
        const dataServiceOptions:IDataServiceOptions<T> = {
            apiUrl: options.apiUrl,
            readInfo:<IDataServiceEndPointOptions> {
                endPoint: options.readEndPoint,
                usePost: true
            },
            createInfo:options.canCreate ? <IDataServiceEndPointOptions>{
                endPoint:'create',
                usePost: true
            } : undefined,
            updateInfo:options.canUpdate ? <IDataServiceEndPointOptions> {
                endPoint: 'update',
                usePost: true
            } : undefined,
            deleteInfo:options.canDelete ? <IDataServiceEndPointOptions>{
                endPoint: 'delete'
            } : undefined,
            roleInfo:<IDataServiceRoleOptions<T>> {
                role: ServiceRole.Root,
                itemName: options.itemName,
            }
        };

        super(dataServiceOptions);
    }

    public override childrenOf(element: T): T[] {
        if(element && element.EstRules){
            return element.EstRules as unknown as T[];
        }
        return [];
    }

    public override parentOf(element: T): T | null {
        if (element.EstRules == null) {
            return null;
        }

        const parentId = element.EstRuleFk;
        const parent = this.flatList().find(candidate => candidate.Id === parentId);
        return parent === undefined ? null : parent;
    }

    /**
     * Handles the loaded data after a successful load operation.
     * Extracts the resource entities from the loaded object and returns them as an array.
     *
     * @param loaded The loaded object containing the resource data.
     * @returns An array of IResourceBaseEntity extracted from the loaded object.
     */
    protected override onLoadSucceeded(loaded: object): T[] {
        if (loaded) {
            return get(loaded, 'dtos', []);
        }
        return [];
    }

    //TODO
    //if (option && option.isAssemblyRule){
    //estimateRuleServiceOption.hierarchicalRootItem.entityRole.root = {
    //    addToLastObject: true,
    //    lastObjectModuleName: 'estimate.main',
    //    itemName: 'EstimateRule',
    //    moduleName: 'cloud.desktop.moduleDisplayNameRuleDefinitionMaster'
    //};
    //
    //estimateRuleServiceOption.hierarchicalRootItem.translation = {};
    //}
    // if (option && option.isAssemblyRule) {
    //     data.showHeaderAfterSelectionChanged = null;
    // }
    //
    // data.newEntityValidator = estimateRuleMainValidationProcessService;
    // data.extendSearchFilter = function extendSearchFilter(filterRequest) {
    //     filterRequest.UseCurrentClient = true;
    // };
    //
    // service.getContainerData = function getContainerData() {
    //     return serviceContainer.data;
    // };

    public async createDeepCopy(){
        const selectedItems = this.getSelectedItems();
        const url = this.configurationService.webApiBaseUrl + 'estimate/rule/estimaterule/deepcopy';
        const response = await firstValueFrom(this.http.post(url, selectedItems));
        if(response){
            const copies = get(response,'EstimateRule') as unknown as T[];
            copies.forEach(estRule => {
                const creationData = {};
                if (!isNull(estRule) && !isNull(estRule.EstRuleFk)) {
                    const items = this.getList();
                    const parent = items.find((data) => {
                        return data.EstRuleFk === estRule.EstRuleFk;
                    });
                    set(creationData, 'parent', parent);
                    // creationData.parent = data.getItemById(estRule.EstRuleFk, data);
                }

                if(this.onCreateSucceeded && !isNull(estRule)){
                    // data.onCreateSucceeded(estRule, data, creationData);
                    this.onCreateSucceeded(estRule);
                }
            });
        }
    }

    public getSelectedItems(){
        return [] as T[];
        //TODO
        //let grid = platformGridAPI.grids.element('id', gridId).instance,
        //    rows = grid.getSelectedRows();
        //
        // return rows.map(function (row) {
        //     return grid.getDataItem(row);
        // });
    }

    public getGridId(itemId: string){
        this.gridId = itemId;
    }

    public override delete(entities: T[] | T) {
        if (entities) {
            const postData = {
                Id: Array.isArray(entities) ? entities[0].Id : entities.Id,
                MdcLineItemContextFk: Array.isArray(entities) ? entities[0].MdcLineItemContextFk : entities.MdcLineItemContextFk
            };
            this.http.post(this.configurationService.webApiBaseUrl + 'estimate/rule/estimaterule/getRelateEstRule', postData).subscribe(response => {
               const responseData = get(response, 'data', []);
                if (Array.isArray(responseData) && responseData.length > 0) {
                    const modalOptions = {
                        headerTextKey: 'cloud.common.errorMessage',
                        bodyTextKey: 'estimate.rule.dialog.allEstRulesAssignedMessage',
                        iconClass: 'ico-error',
                        height: '185px',
                        width: '700px'
                    };
                    // return platformModalService.showDialog(modalOptions);
                    return this.uiCommonMessageBoxService.showYesNoDialog(modalOptions)?.then((dialogResult:IDialogResult)=>{
                        if(dialogResult.closingButtonId==='yes'){
                            super.delete(entities);
                        }
                    });
                } else {
                    // return platformModalService.showYesNoDialog(message, 'estimate.rule.dialog.confirmRuleDelete', 'no');
                    const message = 'estimate.rule.dialog.deleteAllSelectedRulesMessage';
                    return this.uiCommonMessageBoxService.showYesNoDialog(message, 'estimate.rule.dialog.confirmRuleDelete')?.then((dialogResult:IDialogResult)=>{
                        if(dialogResult.closingButtonId==='yes'){
                            super.delete(entities);
                        }
                    });
                }
            });
        }
    }

    //Todo: handler
    //service.setInitReadData = function (pattern) {
    //    estimateRuleServiceOption.hierarchicalRootItem.httpRead.initReadData = function (readData) {
    //       if (pattern) {
    //            readData.Pattern = pattern;
    //        }
    //    };
    //};

    // service.removeInitReadData = function () {
    //     estimateRuleServiceOption.hierarchicalRootItem.httpRead.initReadData = {};
    // };

    public setIsForEstimate(forEstimate: boolean) {
        const original = this.serForEstimate;
        this.serForEstimate = forEstimate;
        if (original !== forEstimate) {
           this.refreshAllLoaded();
        }
    }

    public bulkUpdateOnRuleChecked(entity: T, value: unknown, field: string, isFromBulkEditor: boolean){
        if (!isNull(this.isRuleOnCheckedUpdateInProcess)) {
            return this.rulesOnCheckedUpdatePromise;
        } else {
            this.isRuleOnCheckedUpdateInProcess = true;

            // Lock container while it calculating
            this.onMultipleSelectionChanged.next(true);

            // Update fields and then send to server
            const currentSelectedRuleItems = this.getSelectedEntity();

            const postData = {
                EstRulesEntities: currentSelectedRuleItems
            };

            this.rulesOnCheckedUpdatePromise = this.updateCheckedForEstimateAndBoq(postData, isFromBulkEditor);
            return this.rulesOnCheckedUpdatePromise;
        }
    }

    // todo
    public updateCheckedForEstimateAndBoq(postData: object, isFromBulkEditor: boolean): Promise<[] | void> {
        const url = this.configurationService.webApiBaseUrl + 'estimate/rule/estimaterule/updateCheckboxChanges';
        return this.http.post(url, postData).toPromise().then(response => {
            const data = get(response, 'data', []);
            const temsResolved = get(data, 'EstRulesEntities', []);
            const allRulesItems = this.getList();

            const processList = function processList(items: T[], callBack?: (item: T) => void) {
                forEach(items, function (item) {
                    if (callBack) {
                        callBack(item);
                    }
                });
            };

            processList(temsResolved, function (item: T) {
                const itemToUpdate: T = find(allRulesItems, {'Id': item.Id}) as T;
                if (itemToUpdate) {
                    //itemToUpdate.Version = item.Version;
                }
            });

            // A: workaround to avoid save - Start
            // let markItemAsModifiedBase = service.markItemAsModified;
            // service.markItemAsModified = function () {
            // };

            setTimeout(() => {

                // Unlock container when update is done
                this.onMultipleSelectionChanged.next(false);

                // B: workaround to avoid save - End
                // set the markItemAsModified function back
               // service.markItemAsModified = markItemAsModifiedBase;

            }, 0);

            this.isRuleOnCheckedUpdateInProcess = false;
        }, err => {
            this.isRuleOnCheckedUpdateInProcess = false;
            // eslint-disable-next-line no-console
            console.error(err);
            return [];
        });
    }
}