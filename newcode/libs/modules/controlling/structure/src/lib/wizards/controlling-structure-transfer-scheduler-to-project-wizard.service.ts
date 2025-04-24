/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {IControllingStructureSchedulerJob} from '@libs/controlling/interfaces';
import {ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService} from '@libs/ui/common';
import {
    ControllingStructureTransferSchedulerTaskComponent
} from '../components/controlling-structure-transfer-scheduler-task/controlling-structure-transfer-scheduler-task.component';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {ControllingStructureSchedulerTask} from '../model/entities/controlling-structure-scheduler-task.interface';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
    ControllingStructureCurrentSchedulerJobDataService
} from '../services/controlling-structure-transfer-scheduler-task/controlling-structure-current-scheduler-job-data.service';

export const TRANSFER_SCHEDULER_TASK_TOKEN = new InjectionToken<ControllingStructureSchedulerTask>('TRANSFER_SCHEDULER_TASK_TOKEN');

@Injectable({
    providedIn: 'root'
})
export class ControllingStructureTransferSchedulerToProjectWizardService{
    private readonly http = inject(HttpClient);
    private readonly translateService = inject(PlatformTranslateService);
    private readonly modalDialogService = inject(UiCommonDialogService);
    private readonly platformConfigurationService = inject(PlatformConfigurationService);
    private readonly configurationService = inject(PlatformConfigurationService);
    private readonly controllingStructureCurrentSchedulerJobDataService = inject(ControllingStructureCurrentSchedulerJobDataService);

    public async onStartWizard() {
        const dialogOption: ICustomDialogOptions<ControllingStructureSchedulerTask, ControllingStructureTransferSchedulerTaskComponent> = {
            headerText: this.translateService.instant({ key: 'estimate.main.backwardCalculation.title' }),
            minWidth: '600px',
            width: '940px',
            buttons: [
                {
                    id: 'importBtn',
                    caption: { key: 'controlling.structure.ActiveButton' },
                    isDisabled: (info) => {
                        return info.dialog.body.getSchedulerTaskEntity().isCreateDisabled;
                    },
                    fn: (evt, info) => {
                        info.dialog.body.onCreate();
                    }
                },
                {
                    id: StandardDialogButtonId.Ok,
                    isDisabled: (info) =>{
                        return info.dialog.body.hasErrors();
                    },
                    fn: (evt, info) => {
                        if(info.dialog.value){
                            this.createSchedulerTask(info.dialog.body.getSchedulerTaskEntity(), info.dialog.body.items);
                        }
                        info.dialog.close(StandardDialogButtonId.Ok);
                    },
                },
                {
                    id: StandardDialogButtonId.Cancel,
                    fn: (evt, info) => {
                        info.dialog.close(StandardDialogButtonId.Cancel);
                    },
                }
            ],
            resizeable: true,
            showCloseButton: true,
            bodyComponent: ControllingStructureTransferSchedulerTaskComponent,
            bodyProviders: [{ provide: TRANSFER_SCHEDULER_TASK_TOKEN, useValue: this.getInitEntity() }],
        };
        const url = this.configurationService.webApiBaseUrl + 'controlling/structure/schedulerTask/getTransferSchedulerByCompany';
        const response = await firstValueFrom(this.http.get(url)) as ControllingStructureSchedulerTask[];
        if(response){
            this.controllingStructureCurrentSchedulerJobDataService.setList(response);
            await this.modalDialogService.show(dialogOption);
        }
    }

    private getInitEntity(): ControllingStructureSchedulerTask {
        return {
            companyFk: this.platformConfigurationService.clientId,
            Name : null,
            Description : null,
            StartTime : null,
            Priority : null,
            RepeatUnit : null,
            RepeatCount : null,
            LoggingLevel : null,
            KeepDuration : null,
            KeepCount : null,
            TargetGroup : null,
            insQtyUpdateFrom : -1,
            revenueUpdateFrom : -1,
            isUpdateLineItemQuantityDisabled : true,
            isUpdateRevenueDisabled : true,
            isCreateDisabled : true,
            isActive : false,
            versionType: true
        };
    }

    private createSchedulerTask(entity: ControllingStructureSchedulerTask, list: IControllingStructureSchedulerJob[]) {
        console.log(entity);
        // TODO: create Logic
        // let projects = $injector.get('controllingStructureProjectDataService').getList();
        // if(projects.length){
        //     let projectIds = [];
        //     _.forEach(projects,function (item) {
        //         projectIds.push(item.Id);
        //     });
        //     result.projectIds = projectIds;
        // }
        // result.companyFk = platformContextService.clientCode;
        // result.costGroupCats = $injector.get('controllingStructureCostGroupAssignmentDataService').getList();
        // $http.post(globals.webApiBaseUrl + 'controlling/structure/schedulerTask/createSchedulerTask', result)
        //     .then(function (response) {
        //         if(response && !response.data){
        //             console.log(response);
        //         }
        //     });
    }
}