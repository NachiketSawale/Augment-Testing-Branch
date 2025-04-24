/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { ISearchResult } from '@libs/platform/common';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions } from '@libs/platform/data-access';
import { ProjectMainDataService } from '@libs/project/shared';
import { IEstConfidenceCheckEntity } from '@libs/estimate/interfaces';
import * as _ from 'lodash';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { EstimateMainFilterService } from '../../services/filter-structures/estimate-main-filter.service';

export const ESTIMATE_MAIN_CONFIDENCE_CHECK_DATA_TOKEN = new InjectionToken<EstimateMainConfidenceCheckDataService>('estimateMainLineItemQuantityDataToken');

@Injectable({
    providedIn: 'root'
})

/**
 * Estimate Main Confidence Check container data service
 */
export class EstimateMainConfidenceCheckDataService extends DataServiceHierarchicalRoot<IEstConfidenceCheckEntity,IEstConfidenceCheckEntity> {
    private readonly projectMainDataService = inject(ProjectMainDataService);
    private readonly contextService = inject(EstimateMainContextService);
    private filterService = inject(EstimateMainFilterService);
    private projectId = this.contextService.getSelectedProjectId();
    private estHeaderId = this.contextService.getSelectedEstHeaderId();
    private isReadData = false;
    private autoRefresh : boolean =false;
    private allFilterIds = [];
    // TODO filterEstConfidenceCheckItem = new Platform.Messenger();

    public constructor() {
        const options: IDataServiceOptions<IEstConfidenceCheckEntity> = {
            apiUrl: 'estimate/main/confidencecheck',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getconfidencechecklist',
                usePost: false,
            },
            roleInfo: <IDataServiceRoleOptions<IEstConfidenceCheckEntity>>{
                role: ServiceRole.Root,
                itemName: 'EstConfidenceCheck',
            },
            entityActions: {
                createSupported: false,
                deleteSupported: false
            }
        };

        super(options);

        this.filterService.addLeadingStructureFilterSupport(this, 'Id');
    }

    protected override provideLoadByFilterPayload(): object {
        const selection = this.projectMainDataService.getSelection()[0];
        return { projectId: selection.Id, estHeaderId: this.estHeaderId };
    }

    public override childrenOf(element: IEstConfidenceCheckEntity): IEstConfidenceCheckEntity[] {
        return element.EstConfidenceCheckChildrens ?? [];
    }

    protected override onLoadByFilterSucceeded(loaded: IEstConfidenceCheckEntity[]): ISearchResult<IEstConfidenceCheckEntity> {
        //TODO this.contextService.updateModuleHeaderInfo();
        this.processItem(loaded);
       //TODO return data.handleReadSucceeded(readData, data);

        return {
            FilterResult: {
                ExecutionInfo: '',
                RecordsFound: 0,
                RecordsRetrieved: 0,
                ResultIds: []
            },
            dtos: loaded
        };
    }

    //TODO register filter
    /*service.registerFilterConfidenceCheckItem = function (callBackFn) {
        service.filterEstConfidenceCheckItem.register(callBackFn);
    };
    service.unregisterFilterConfidenceCheckItem = function (callBackFn) {
        service.filterEstConfidenceCheckItem.unregister(callBackFn);
    };*/

    /**
     * @name markersChanged
     * @methodOf EstimateMainConfidenceCheckDataService
     * @description when any record selected in container using radio or checkbox this method will be called
     * @param {array of list} itemList
     */
   public markersChanged(itemList: IEstConfidenceCheckEntity[] ) {
       //const filterKey = 'EST_CONFIDENCE_CHECK';

        if (_.isArray(itemList) && _.size(itemList) > 0) {
            this.allFilterIds = [];

            // get all child locations (for each item)
            //TODO
           /* _.each(itemList, function (item) {
                let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'EstConfidenceCheckChildrens'), 'Id');
                this.allFilterIds = this.allFilterIds.concat(Ids);
            });
            estimateMainFilterService.setFilterIds(filterKey, this.allFilterIds);
            estimateMainFilterService.addFilter('estimateMainConfidenceCheckController', service, function () {
                return true;
            }, {id: filterKey, iconClass: 'tlb-icons ico-filter-confidence-check', captionId: 'filterConfidenceCheck'});
        } else {
            this.allFilterIds = [];
            estimateMainFilterService.setFilterIds(filterKey, []);
            estimateMainFilterService.removeFilter('estimateMainConfidenceCheckController');*/
        }

        //TODO service.filterEstConfidenceCheckItem.fire();
    }

    /**
     * @name loadConfidenceCheck
     * @methodOf EstimateMainConfidenceCheckDataService
     * @description Set auto refresh if toolbar item is enabled
     * @param {string} isFromNavigator
     */
    public loadConfidenceCheck(isFromNavigator: string) {
        const allList = this.getList();
        if (this.projectId !== this.contextService.getSelectedProjectId() || allList.length <= 0) {
            this.projectId = this.contextService.getSelectedProjectId();
            this.estHeaderId = this.contextService.getSelectedEstHeaderId();
            //TODO load
            /*  service.setFilter('projectId=' + projectId + 'estHeaderId=' + estHeaderId);
            if (this.projectId) {
                service.load().then(function () {
                    $injector.get('platformGridAPI').rows.expandAllNodes(gridId);
                });
            }*/
        } else{
            if(isFromNavigator === 'isForNagvitor'){
                //TODO service.load();
            }
        }
    }

    /**
     * @name setAutoRefresh
     * @methodOf EstimateMainConfidenceCheckDataService
     * @description Set auto refresh if toolbar item is enabled
     * @param {boolean} isAutoRefresh
     */
    public setAutoRefresh(isAutoRefresh: boolean){
        this.autoRefresh = isAutoRefresh;
    }

    /**
     * @name isAutoRefresh
     * @methodOf EstimateMainConfidenceCheckDataService
     * @description checks auto refresh if toolbar item is enabled
     */
    public isAutoRefresh(){
        return this.autoRefresh;
    }

    /**
     * @name processItem
     * @methodOf EstimateMainConfidenceCheckDataService
     * @description Process Confidence check items
     * @param {array of objects } items
     */
    private processItem(items: IEstConfidenceCheckEntity[]) {
        if(items){
            const childItems = items[0].EstConfidenceCheckChildrens;

            _.each(childItems,function (item){
                const allFieldsReadOnly = [];
                _.forOwn(item, function (value, key) {
                    const field = {field: key, readonly: true};
                    allFieldsReadOnly.push(field);
                });
                allFieldsReadOnly.push({field: 'IsMarked', readonly: true});
                allFieldsReadOnly.push({field: 'Filter', readonly: true});
              // this.setEntityReadOnlyFields(items, allFieldsReadOnly)    // TODO : need to check function implementation
            });
        }
    }

}
