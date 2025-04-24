/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IControllingStructureSchedulerJob} from '@libs/controlling/interfaces';
import {ControllingStructureSchedulerTask} from '../../model/entities/controlling-structure-scheduler-task.interface';
import {isNull, isUndefined} from 'lodash';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ControllingStructureCurrentSchedulerJobDataService{
    private dataList: IControllingStructureSchedulerJob[] = [];
    private selectEntity: IControllingStructureSchedulerJob | null = null;

    public afterSetSelectedEntities = new Subject<{entity: IControllingStructureSchedulerJob, isCreate: boolean}>();

    public initGridData(): IControllingStructureSchedulerJob[] {
        return this.getList();
    }

    public setList(jobs: ControllingStructureSchedulerTask[]){
        this.dataList = [];
        if(!jobs.length){
            return;
        }

        jobs.forEach(item => {
            const pushData = item.JobEntity;
            if(!isUndefined(pushData)){
                pushData.companyFk = item.CompanyFk;
                pushData.projectIds = item.ProjectIds;
                pushData.updatePlannedQty = item.updatePlannedQty;
                pushData.updateInstalledQty = item.updateInstalledQty;
                pushData.updateBillingQty = item.updateBillingQty;
                pushData.updateForecastingPlannedQty = item.updateForecastingPlannedQty;
                pushData.updateRevenue = item.updateRevenue;
                pushData.insQtyUpdateFrom = item.insQtyUpdateFrom;
                pushData.revenueUpdateFrom = item.revenueUpdateFrom;
                pushData.costGroupCats = item.costGroupCats;
                this.dataList.push(pushData);
            }
        });
    }

    public getList(){
        return this.dataList;
    }
    
    public createItem(){
        // service.setSelected(null);
        // let controllingStructureTransferSchedulerTaskService = $injector.get('controllingStructureTransferSchedulerTaskService');
        // controllingStructureTransferSchedulerTaskService.afterSetSelectedJobEntities.fire(null,true);
        // controllingStructureTransferSchedulerTaskService.setIsCreateDisabled.fire(true);
        // controllingStructureProjectDataService.setIsReadOnly(false);
        // controllingStructureProjectDataService.setList(null);
    }

    public setSelectedRow(){
        // let grid =  platformGridAPI.grids.element('id', gridId);
        // if(grid){
        //     grid.instance.resetActiveCell();
        //     grid.instance.setSelectedRows([]);
        // }
    }

    // service.afterSetSelectedEntities = new PlatformMessenger();
    // let baseSetSelected = service.setSelected;
    public setSelected(entity: IControllingStructureSchedulerJob[] | null) {
        this.selectEntity = isNull(entity) ? null : entity[0];
        if(!isNull(entity)){
            this.afterSetSelectedEntities.next({entity: entity[0], isCreate: false});
            // controllingStructureProjectDataService.setIsReadOnly(true);
            // controllingStructureProjectDataService.setList(entity.projectIds);
            // controllingStructureTransferSchedulerTaskService.setIsCreateDisabled.fire(false);
            // $injector.get('controllingStructureCostGroupAssignmentDataService').setList();
        }
    }

    public getSelected(){
        return this.selectEntity;
    }

    public refreshData(){
        this.setList([]);
        this.setSelected(null);
    }

    public stopJob(){
        // let selected = service.getSelected();
        // return $http({
        //     method: 'Post',
        //     url: globals.webApiBaseUrl + 'services/scheduler/job/stopjob',
        //     params: {jobId: selected.Id}
        // }).then(function (response) {
        //     selected.JobState = 6;
        //     service.setSelected(null);
        //     service.refreshGrid();
        //     service.setSelected(selected);
        //     return response.data;
        // });
    }
}