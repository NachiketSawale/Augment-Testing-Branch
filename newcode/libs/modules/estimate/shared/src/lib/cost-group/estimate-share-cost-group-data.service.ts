/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { ICostGroupEntity,BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
import {CompleteIdentification} from '@libs/platform/common';
import {
    DataServiceFlatRoot, DataServiceHierarchicalLeaf,
    IDataServiceEndPointOptions,
    IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import * as _ from 'lodash';
@Injectable({
    providedIn: 'root',
})
export class EstimateShareCostGroupDataService<T extends ICostGroupEntity,PT extends BasicsCostGroupCatalogEntity,PU extends CompleteIdentification<PT>>extends DataServiceHierarchicalLeaf<T, PT, PU>{
    public readonly selectService : DataServiceFlatRoot<PT,PU>;
    protected constructor (protected parentService: DataServiceFlatRoot<PT,PU>) {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'project/main/costgroup',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'GetCostGroupStructureTree',
                usePost: true,
            },
            roleInfo: <IDataServiceRoleOptions<T>>{
                role: ServiceRole.Leaf,
                itemName: 'costGroups',
                parent: parentService,
            },
            entityActions: {
                createSupported: false,
                deleteSupported: false
            },
        };

        super(options);
        this.selectService = parentService;

        //TODO: Wait frameworks support the configuration of filtering more and the corresponding method
        // let gridConfig = angular.extend({
        //         marker : {
        //             filterService: filterService,
        //             filterId: controllerName,
        //             dataService: dataService,
        //             serviceName: groupStructureServiceName
        //         },
        //         parentProp: 'CostGroupFk', childProp: 'CostGroupChildren', childSort: true, propagateCheckboxSelection: true,type: clipboardService ? type : undefined,
        //         dragDropService: clipboardService ? clipboardService : undefined,
        //         skipPermissionCheck:true,
        //         cellChangeCallBack: function (arg) {
        //             let field = arg.grid.getColumns ()[arg.cell].field;
        //
        //             if (field === 'Rule') {
        //                 let ruleToDelete = dataService.getRuleToDelete ();
        //                 if (!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {
        //
        //                     let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
        //                     platformDeleteSelectionDialogService.showDialog ({
        //                         dontShowAgain: true,
        //                         id: '7a9f7da5c9b44e339d49ba149a905987'
        //                     }).then (result => {
        //                         if (result.yes || result.ok) {
        //                             $injector.get('estimateMainService').deleteParamByPrjRule (arg.item, ruleToDelete, 'EstCostGrp');
        //                         }
        //                     });
        //                 }
        //             }
        //         }
        //
        //     }, estimateDefaultGridConfig),
    }
    protected override provideLoadPayload(): object {
        const selectedGroupIds: number[] = [];
        const parentEntity = this.parentService.getSelectedEntity();
        if(parentEntity){
            selectedGroupIds.push(parentEntity.Id);
        }
        return selectedGroupIds!;
    }
    protected override onLoadSucceeded(loaded: object): T[] {
        const entities = loaded as T[];
        return entities;
    }
    public override childrenOf(element: T): T[] {
        return element.CostGroupChildren as T[] ?? [];
    }
    public override parentOf(element: T): T | null {
        if (element.CostGroupFk == null) {
            return null;
        }

        const parentId = element.CostGroupFk;
        const parent = this.flatList().find(candidate => candidate.Id === parentId);
        return parent === undefined ? null : parent;
    }

    public override onTreeParentChanged(entity: T, newParent: T | null): void {
        entity.CostGroupFk = newParent?.Id;
    }

    public changeFilter(costGroupCatNode: T){
        const filterDatas =this.parentService.getSelection();
        this.parentService.setModified(filterDatas);
    }

    public async groupChanged(selectedGroup: T){
        this.getNavgCategoryList();
        if(selectedGroup){
            this.parentService.refreshAll();
        }
    }
    public isShowInfo:boolean = false;
    public mainCategoryList:T[]=[];
    public getNavgCategoryList(){
        this.mainCategoryList =  this.getHightLightCostGrpStrus();// basicsLookupdataLookupDescriptorService.getData('mainCategoryList');

        // scope.mainCategoryList = mainCategoryList;
        this.isShowInfo = this.mainCategoryList.length>0;
    }

    public clearCostGrpNavgCategoryList(){
        this.hightLightCostGrpStrus = [];
    }

    //TODO: Wait frameworks support the configuration of filtering more and the corresponding method
    // public showIcon(value) {
    //     let selectedGroupCatalog = costGroupCatalogService.getSelected();
    //     if (selectedGroupCatalog) {
    //         let treeList = costGroupCatalogService.getTree();
    //         _.forEach(treeList, function (item) {
    //             if (item.Id === selectedGroupCatalog.Id) {
    //                 item.Image = selectedGroupCatalog.Image = value;
    //             }
    //         });
    //
    //
    //         // set the cost group structrue filter ismarkd = false
    //         if(!value) {
    //             let getGridObject = getGrid();
    //             if (getGridObject.dataView && getGridObject.dataView.getItems() && getGridObject.dataView.getItems().length) {
    //
    //                 let costGroupStructureList = [];
    //                 cloudCommonGridService.flatten(getGridObject.dataView.getItems(), costGroupStructureList, 'CostGroupChildren');
    //
    //                 _.forEach(costGroupStructureList, function (cgs) {
    //                     if(cgs.CostGroupCatalogFk === selectedGroupCatalog.Id ) {
    //                         cgs.IsMarked = false;
    //                     }
    //                 });
    //             }
    //         }
    //
    //         if(treeList && treeList.length){
    //             costGroupCatalogService.setTree(treeList);
    //         }
    //     }
    // }

    public markedCostGrpStructurList:T[]=[];
    public onSelectedRowsChanged(){

        const selectedItem = this.getSelectedEntity();
        const selectedGroup = this.parentService.getSelectedEntity();
        this.getNavgCategoryList();
        if(selectedItem && selectedGroup) {
            //selectedItem.CostGroupCode = selectedGroup.Code;
                if (this.mainCategoryList && this.mainCategoryList.length > 0) {
                    const existItemCostGroupCatalog = _.filter(this.mainCategoryList, {'CostGroupCatFk': selectedItem.CostGroupCatalogFk});
                    if (existItemCostGroupCatalog) {
                        const dex =  _.findIndex(this.mainCategoryList, item => {
                            return item.CostGroupCatalogFk !== null && item.CostGroupCatalogFk === selectedItem.CostGroupCatalogFk;
                        });
                        if(dex>-1){
                            this.mainCategoryList.splice(dex,1,selectedItem);
                        }else{
                            this.mainCategoryList.push(selectedItem);
                        }

                    }else{
                        this.mainCategoryList.push(selectedItem);
                    }

                } else {
                    this.mainCategoryList.push(selectedItem);
                }
            }
            this.setHightLightCostGrpStrus();
            this.getNavgCategoryList();
            this.isShowInfo = this.mainCategoryList.length>0;
        }

    //TODO: Wait support --JUn
    // let ruleToDelete =[];
    //
    // serviceContainer.service.setRuleToDelete =  function setRuleToDelete(value) {
    //     ruleToDelete = value;
    // };
    //
    // serviceContainer.service.getRuleToDelete =  function getRuleToDelete() {
    //     return ruleToDelete;
    // };
    //
    // let lookupData = {};
    // let costGrpStrFilters = [];
    // let hightLightCostGrpStrus = [];  // collect the hight light cost group structure
    //
    // service = serviceContainer.service;
    //
    //TODO: Wait support --JUn
    //
    //
    // service.loadCostGroup = function (selectedGroupId) {
    //
    //     if (!lookupData.loadCostGroupPromise) {
    //         lookupData.loadCostGroupPromise = serviceContainer.service.getCostGroup([selectedGroupId]);
    //     }
    //     lookupData.loadCostGroupPromise.then(function () {
    //         lookupData.loadCostGroupPromise = null;
    //     });
    // };

    public hightLightCostGrpStrus:T[] =[];

    public setHightLightCostGrpStrus(){
        this.hightLightCostGrpStrus = this.getSelection() as T[];
    }

    public getHightLightCostGrpStrus(){
        return this.hightLightCostGrpStrus;
    }

    public costGrpStrFilters:T[]=[];

    public setFilters(costGrpStructureDatas:T[]){
        if (costGrpStructureDatas.length > 1) {
            this.costGrpStrFilters = this.costGrpStrFilters.concat(costGrpStructureDatas);
        } else {
            const costGroupCatalogFks = _.filter(this.costGrpStrFilters, {'CostGroupCatalogFk': costGrpStructureDatas[0].CostGroupCatalogFk});
            if (costGroupCatalogFks && costGroupCatalogFks.length) {
               // let tempList = angular.copy(costGrpStrFilters);

                // avoid same costgroup has many costgroupstructure when filter single costgroupstructure
                _.forEach(this.costGrpStrFilters, function (item) {
                    if (item.CostGroupCatalogFk !== costGrpStructureDatas[0].CostGroupCatalogFk) {
                        //costGrpStrFilters.push(item);
                    }
                });
                this.costGrpStrFilters = this.costGrpStrFilters.concat(costGrpStructureDatas);
            } else {
                this.costGrpStrFilters = this.costGrpStrFilters.concat(costGrpStructureDatas);
            }
        }

        this.costGrpStrFilters =  _.uniq(this.costGrpStrFilters);
    }

    public getFilters() {
        return _.uniq(this.costGrpStrFilters);
    }

    public clearFilters() {
        this.costGrpStrFilters = [];
    }

}