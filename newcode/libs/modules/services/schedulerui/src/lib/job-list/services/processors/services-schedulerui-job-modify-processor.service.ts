/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';

import { IGridConfiguration } from '@libs/ui/common';

import { ServicesSchedulerUIJobDataService } from '../services-scheduler-uijob-data.service';

import { IJobEntity } from '../../model/entities/job-entity.interface';
import { IParameterEntity } from '../../model/entities/job-entity-generated.interface';
import { ISchedulerUITaskTypeLookup } from '../../model/entities/scheduler-ui-task-type-lookup.interface';

/**
 * Services schedulerui job modify processor.
 */
export class ServicesSchedulerUIJobModifyProcessorService<T extends IJobEntity> implements IEntityProcessor<T> {

    public constructor(protected dataService: ServicesSchedulerUIJobDataService) {
    }

    /**
     * grid configuration
     */
    public gridConfig: IGridConfiguration<IParameterEntity> = {
        uuid: 'ec4d55d3ebd94dcf941e536de78aff3c',
        columns: [],
        items: [],
        iconClass: null,
        skipPermissionCheck: true,
        enableColumnReorder: true,
        enableCopyPasteExcel: false
    };

    /**
     * Process job item common logic
     * @param {IJobEntity} job
     */
    public process(job: IJobEntity) {
        this.setEntityFieldsReadOnly(job);
        this.setEntityFieldsReadOnlyForNonZeroVersion(job);

    }

    /**
     * Used to set entity fields readonly.
     * @param {IJobEntity} job 
     */
    public setEntityFieldsReadOnly(job: IJobEntity) {
        const readonlyFields: IReadOnlyField<IJobEntity>[] = [
            {
                field: 'JobState',
                readOnly: true
            },
            {
                field: 'ExecutionStartTime',
                readOnly: true
            },
            {
                field: 'ExecutionEndTime',
                readOnly: true
            },
            {
                field: 'ExecutionMachine',
                readOnly: true
            }
        ];
        this.dataService.setEntityReadOnlyFields(job, readonlyFields);
    }


    /**
     * Used to set entity fields readonly for non-zero job version 
     * @param {IJobEntity} job 
     */
    public setEntityFieldsReadOnlyForNonZeroVersion(job: IJobEntity) {

        let task = {} as ISchedulerUITaskTypeLookup;

        if (job.TaskType) {
            task = this.dataService.getTask(job.TaskType) as ISchedulerUITaskTypeLookup;
        }

        if (job.Version !== 0) {
            const readonlyFields: IReadOnlyField<IJobEntity>[] = [
                {
                    field: 'Name',
                    readOnly: true
                },
                {
                    field: 'Description',
                    readOnly: true
                },
                {
                    field: 'StartTime',
                    readOnly: true
                },
                {
                    field: 'RepeatUnit',
                    readOnly: true
                },
                {
                    field: 'RepeatCount',
                    readOnly: true
                },
                {
                    field: 'LoggingLevel',
                    readOnly: true
                },
                {
                    field: 'Priority',
                    readOnly: true
                },
                {
                    field: 'RunInUserContext',
                    readOnly: true
                }
            ];
            this.dataService.setEntityReadOnlyFields(job, [
                {
                    field: 'TaskType',
                    readOnly: true
                },
                {
                    field: 'MachineName',
                    readOnly: true
                }
            ]);

            if (job.JobState === 5) {
                this.dataService.setEntityReadOnlyFields(job, [
                    {
                        field: 'RunInUserContext',
                        readOnly: (task) ? !task.AllowChangeContext : true
                    }
                ]);
                this.dataService.setEntityReadOnlyFields(job, readonlyFields);
            } else {
                readonlyFields.push({
                    field: 'KeepDuration',
                    readOnly: true
                },
                    {
                        field: 'KeepCount',
                        readOnly: true
                    });

                this.dataService.setEntityReadOnlyFields(job, readonlyFields);

            }
        }

        this.addParameterAndLog(job, task);
    }


    /**
     * Used to initialized parameter field and log dialog.
     * @param {IJobEntity} job 
     * @param {ISchedulerUITaskTypeLookup} task 
     */
    public addParameterAndLog(job: IJobEntity, task: ISchedulerUITaskTypeLookup) {
        if (job.Version === 0) {
            if (job.Parameter === undefined) {
                job.Parameter = [];
            }

            this.gridConfig = {
                ...this.gridConfig,
                items: job.Parameter as IParameterEntity[]
            };
        }

        if ((task && !task.UiChangeable) || (job.JobState !== 0 && job.JobState !== 5)) {

            job.Parameter?.forEach((param) => {
                param.ReadOnly = true;
            });
        }

        if (!job.RepeatUnit) {
            job.RepeatUnit = 0;
        }

        job.Log = {
            actionList: []
        };

        //TODO: Depends on Dev-6193 task.
        // this.provideActionSpecification(job.Log.actionList);
    }

    //TODO: Implementation will add once log dialog service is implemented.
    //Depends on Dev-6193 task.

    // public provideActionSpecification(actionList:any) {
    //     actionList.push({
    //         toolTip: 'Show log file - ',
    //         icon: 'control-icons ico-filetype-log',
    //         callbackFn: function (entity) {
    //             servicesSchedulerUIJobLogDialogService.showLogDialog(entity.Id);
    //         },
    //         readonly: false
    //     });
    // }



    /**
     * Revert process item
     * @param item
     */
    public revertProcess(item: IJobEntity) { }
}