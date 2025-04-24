/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    DataServiceHierarchicalLeaf,
    IDataServiceEndPointOptions,
    IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import {IProjectLocationEntity} from '@libs/project/interfaces';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';
import {QtoMainHeaderGridComplete} from '../model/qto-main-header-grid-complete.class';
import {QtoMainHeaderGridDataService} from '../header/qto-main-header-grid-data.service';
import {forEach, set} from 'lodash';
import {BasicsSharedTreeDataHelperService} from '@libs/basics/shared';
import {QtoMainLocationValidationService} from './qto-main-location-validation.service';
import {QtoMainLocationComplete} from './qto-main-location-complete.class';
import {QtoMainDetailGridDataService} from '../services/qto-main-detail-grid-data.service';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';



@Injectable({
    providedIn: 'root',
})
/**
 * @brief Service to manage project locations.
 */
export class QtoMainLocationDataService extends DataServiceHierarchicalLeaf<IProjectLocationEntity, IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {
    public readonly parentService: QtoMainHeaderGridDataService;
    public projectId = -1 ;
    private isReadOnly :boolean =false;
    public  dataValidationService ? : QtoMainLocationValidationService;
    private treeDataHelper = inject(BasicsSharedTreeDataHelperService);
    public qtoMainDetailService = inject(QtoMainDetailGridDataService);
    private readonly http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    public constructor(qtoMainHeaderGridDataService: QtoMainHeaderGridDataService) {
        const options: IDataServiceOptions<IProjectLocationEntity> = {
            apiUrl: 'project/location',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'tree',
                usePost: false,
                prepareParam: ident => {
                    return { projectId: qtoMainHeaderGridDataService.getSelectedEntity()?.ProjectFk};
                }
            },
            createInfo:{
                endPoint: 'create',
                usePost: true,
                prepareParam: ident => {
                    const param = {
                        Id: this.projectId
                    };
                    if (this.projectId === -1 && this.parentService){
                        set(param, 'Id', this.parentService.getSelectedEntity()?.ProjectFk);
                    }
                    if(this.projectId !== -1 && this.projectId !== param.Id) {
                        set(param, 'PKey1', this.projectId);
                    }


                    return param;
                }
            },
            updateInfo: {},
            roleInfo: <IDataServiceRoleOptions<IProjectLocationEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'Locations',
                parent: qtoMainHeaderGridDataService,
            },
        };

        super(options);
        this.parentService = qtoMainHeaderGridDataService;

    }
    protected override provideLoadPayload(): object {
        // set qto Project Id
        this.setProjectId();

        return {
            projectId: this.projectId,
        };
    }
    private setProjectId(){
        const qtoHeader = this.parentService.getSelectedEntity();
        if (qtoHeader){
            this.projectId = qtoHeader.ProjectFk;
        }
    }
    protected override onLoadSucceeded(loaded: object): IProjectLocationEntity[] {
        let entities = loaded as IProjectLocationEntity[];

        entities = this.treeDataHelper.flatTreeArray(entities, e => e.Locations);
        const qtoHeader = this.parentService.getSelectedEntity();
        if(qtoHeader){
            const qtoStatusItem = this.parentService.getItemStatus(qtoHeader);
            if (qtoStatusItem) {
                this.isReadOnly = qtoStatusItem.IsReadOnly;
            }
        }
        return entities;
    }
  
    public  override canCreateChild(){
        if(this.isReadOnly){
            return false;
        }
        return true;
    }
    public  override canCreate(){
        if(this.isReadOnly){
            return false;
        }
        return true;
    }
    public  override canDelete(){
        if(this.isReadOnly){
            return false;
        }
        return  true;
    }
    public override getSavedEntitiesFromUpdate(complete: QtoMainLocationComplete): IProjectLocationEntity[] {
        if (complete && complete.LocationsToSave) {
            return complete.LocationsToSave;
        }
        if (complete && complete.LocationsToDelete) {
            return complete.LocationsToDelete;
        }
        return [];
    }
    public override childrenOf(element: IProjectLocationEntity): IProjectLocationEntity[] {
        return element.Locations ?? [];
    }
    protected createDataValidationService() {
        return new QtoMainLocationValidationService(this);
    }
    public override parentOf(element: IProjectLocationEntity): IProjectLocationEntity | null {
        if (element.LocationParentFk == null) {
            return null;
        }

        const parentId = element.LocationParentFk;
        const parent = this.flatList().find(candidate => candidate.Id === parentId);
        return parent === undefined ? null : parent;
    }

    public override onTreeParentChanged(entity: IProjectLocationEntity, newParent: IProjectLocationEntity | null): void {
        entity.LocationParentFk = newParent?.Id;
    }
    /**
     * Set locaton parent filters
     * @protected
     */
    public setParentFilters(entity : IProjectLocationEntity, items :IProjectLocationEntity[]){
        const parent = items.find(e => e.Id === entity.LocationParentFk);
        if(parent && parent.Locations){
            this.setParentFilters(parent, items);
            //dataServiceDataProcessor.doProcessItem(parent, container.data); //TODD : Wait for framework support
        }
    }
    /**
     * Set child filters
     * @protected
     */
    public setChildFilters(entity : IProjectLocationEntity){
        let index = 0;
        for (index; index < entity.Locations.length; index++) {
            const child = entity.Locations[index];
            //child.isFilter = entity.isFilter;
            this.setChildFilters(child);
            //dataServiceDataProcessor.doProcessItem(child, container.data); //TODD : Wait for framework support
        }
    }
    /**
     * Copy location
     * @protected
     */
    public copyLocation(options : object, entity : IProjectLocationEntity){
        const qtoMainDetailEntity = this.qtoMainDetailService.getSelectedEntity();
        if (qtoMainDetailEntity && qtoMainDetailEntity!= null) {
            qtoMainDetailEntity.PrjLocationFk = entity.Id;
            //TODD : Wait for framework support
            //this.qtoMainDetailService.markCurrentItemAsModified(qtoMainDetailService.getSelected());
            //TODD : Wait for LocationLookup support
            //basicsLookupdataLookupDescriptorService.attachData({'qtoProjectLocationLookupDataService': [entity]});
            //TODD : Wait for framework support
            //this.qtoMainDetailService.gridRefresh();
        }
    }
    /**
     * Filter data according to criteria
     * @protected
     */
    private filterLocation(options : object, entity : IProjectLocationEntity){
        //container.data.disableWatchSelected(container.data); //TODD : Wait for framework support
        //entity.isFilter = !entity.isFilter;
        const items = this.getList();

        this.setParentFilters(entity, items);
        this.setChildFilters(entity);

        //TODD : Wait for framework support
        //dataServiceDataProcessor.doProcessItem(entity, container.data);
        //service.gridRefresh();
        //container.data.enableWatchSelected(entity, container.data);
        // TODO: Temporarily commenting out to resolve eslint the error because it never used.
        // let filterKeys = items.filter(e => {
        //     return e.Id;
        // });

        // set filter keys and call update.
        // qtoMainDetailService.setFilterLocations(filterKeys);
        // let promise = qtoMainHeaderDataService.update();
        // if (promise) {
        //     promise.then(function () {
        //         qtoMainDetailService.load();// reload items in qto detail
        //     });
        // } else {
        //     qtoMainDetailService.load();// reload items in qto detail
        // }
    }
    public allChildIds :number[] = [];
    /**
     * Gets All Child Items
     * @protected
     */
    private getAllChildItems(parentLocationItems : IProjectLocationEntity[]){
        let allChildIds = this.allChildIds;
        const getAllChildItems = this.getAllChildItems;
        forEach(parentLocationItems,function (parentLocationItem) {
            allChildIds = allChildIds.concat(parentLocationItem.Id);
            forEach(parentLocationItem.Locations,function (item) {
                allChildIds = allChildIds.concat(item.Id);
                if (item.Locations && item.Locations.length > 0) {
                    getAllChildItems(item.Locations);
                }
            });
        });
    }
    public override delete(entities: IProjectLocationEntity[] | IProjectLocationEntity) {
        const deleteItem :IProjectLocationEntity | null = this.getSelectedEntity();
        let parentItem :IProjectLocationEntity[]  = [];
        if(deleteItem && deleteItem != null){
            parentItem =  parentItem.concat(deleteItem);
            if (deleteItem && Object.prototype.hasOwnProperty.call(deleteItem, 'Id')){
                // TODO: Temporarily commenting out to resolve eslint the error because it never used.
                // const modalOptions = {
                //     headerTextKey: 'qto.main.locations.deleteLocationHeaderTitle',
                //     bodyTextKey: 'qto.main.locations.deleteLocationErrorTitle',
                //     showOkButton: true,
                //     iconClass: 'ico-info'
                // };
                // const allChildIds : number[]= [];
                this.getAllChildItems(parentItem);
                // const  reponse = this.getResult(allChildIds);
                // if (reponse) {
                //     platformModalService.showDialog(modalOptions);
                // }
                // else {
                //     baseOnDeleteDone(deleteParams, data); //TODD : Wait for framework support
                //     // baseOnDeleteDone.apply(container.data, arguments);
                // }
            }
        }
        super.delete(entities);
    }
    private async getResult(allChildIds : number[]){
        const resp = await firstValueFrom(this.http.post(
            `${this.configService.webApiBaseUrl}qto/main/detail/isExistLocationUse`,
            allChildIds));
        return resp;
    }
    private async getLocationReadonlySystemOption(){
        const locations = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl+'basics/common/systemoption/islocationinqtoreadonly')) as IProjectLocationEntity[];
        return locations;
    }
}
