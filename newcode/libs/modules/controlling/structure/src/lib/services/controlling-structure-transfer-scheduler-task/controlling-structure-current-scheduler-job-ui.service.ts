/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {PlatformTranslateService} from '@libs/platform/common';
import {ColumnDef, FieldType} from '@libs/ui/common';
import {IControllingStructureSchedulerJob} from '@libs/controlling/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ControllingStructureCurrentSchedulerJobUiService {

    private readonly translateService = inject(PlatformTranslateService);

    private controllerStructureSchedulerUIJobStateValues = [
        {
            Id: 0,
            description: this.translateService.instant('controlling.structure.stateValues.waiting').text,
            iconClass: 'status-icons ico-status42'
        },
        {
            Id: 1,
            description: this.translateService.instant('controlling.structure.stateValues.starting').text,
            iconClass: 'status-icons ico-status21'
        },
        {
            Id: 2,
            description: this.translateService.instant('controlling.structure.stateValues.running').text,
            iconClass: 'status-icons ico-status11'
        },
        {
            Id: 3,
            description: this.translateService.instant('controlling.structure.stateValues.stopped').text,
            iconClass: 'status-icons ico-status197'
        },
        {
            Id: 4,
            description: this.translateService.instant('controlling.structure.stateValues.finished').text,
            iconClass: 'status-icons ico-status02'
        },
        {
            Id: 5,
            description: this.translateService.instant('controlling.structure.stateValues.repetitive').text,
            iconClass: 'status-icons ico-status41'
        },
        {
            Id: 6,
            description: this.translateService.instant('controlling.structure.stateValues.stopping').text,
            iconClass: 'status-icons ico-status198'
        },
        {
            Id: 7,
            description: this.translateService.instant('controlling.structure.stateValues.historized').text,
            iconClass: 'status-icons ico-status49'
        },
        {
            Id: 8,
            description: this.translateService.instant('controlling.structure.stateValues.aborted').text,
            iconClass: 'status-icons ico-status01'
        }
    ];

    private controllingStructurerepeatUnitValues = [
        {Id: 0, displayName: { key: 'controlling.structure.repeatUnit.none' }},
        {Id: 1, displayName: { key: 'controlling.structure.repeatUnit.everyMinute' }},
        {Id: 2, displayName: { key: 'controlling.structure.repeatUnit.hourly' } },
        {Id: 3, displayName: { key: 'controlling.structure.repeatUnit.daily' } },
        {Id: 4, displayName: { key: 'controlling.structure.repeatUnit.weekly' } },
        {Id: 5, displayName: { key: 'controlling.structure.repeatUnit.monthly' } }
    ];

    private jobStateOptions = {
        displayMember: 'description',
        valueMember: 'Id',
        items: this.controllerStructureSchedulerUIJobStateValues
    };

    public getGridColumns() {
        return [
            {
                id: 'name',
                model: 'Name',
                type: FieldType.Description,
                label: {
                    text: 'Name',
                    key: 'controlling.structure.job.name',
                },
                visible: true,
                readonly: true,
            },
            {
                id: 'description',
                model: 'Description',
                type: FieldType.Description,
                label: {
                    text: 'Description',
                    key: 'controlling.structure.job.description',
                },
                visible: true,
                readonly: true,
            },
            {
                id: 'jobstate',
                model: 'JobState',
                label: {
                    text: 'Job State',
                    key: 'controlling.structure.job.jobstate',
                },
                type: FieldType.Select,
                // TODO:
                // formatter: function (row, cell, value, columnDef, dataContext) {
                //   let displayValue = 'undefined';
                //   let iconClass = '';
                //   const item = controllerStructureSchedulerUIJobStateValues[dataContext.JobState];
                //   if(item){
                //     displayValue = item.description;
                //     iconClass = item.iconClass;
                //   }
                //
                //   return '<i class="block-image ' + iconClass + '"></i><span class="pane-r" title="'+displayValue+': '+value+'">' + displayValue + '</span>';
                // },
                visible: true,
                readonly: true,
            },
            {
                id: 'repeatunit',
                model: 'RepeatUnit',
                type: FieldType.Select,
                label: {
                    text: 'Repeat Unit',
                    key: 'controlling.structure.job.repeatunit',
                },
                itemsSource: {
                    items:this.controllingStructurerepeatUnitValues,
                },
                visible: true,
                readonly: true,
            },
            {
                id: 'starttime',
                model: 'StartTime',
                type: FieldType.DateTime,
                label: {
                    text: 'Start Time',
                    key: 'controlling.structure.job.starttime',
                },
                visible: true,
                readonly: true,
            },
            {
                id: 'executionstarttime',
                model: 'ExecutionStartTime',
                type: FieldType.DateTime,
                label: {
                    text: 'Execution Start Time',
                    key: 'controlling.structure.job.executionstarttime',
                },
                visible: true,
                readonly: true,
            },
            {
                id: 'executionendtime',
                model: 'ExecutionEndTime',
                type: FieldType.DateTime,
                label: {
                    text: 'Execution End Time',
                    key: 'controlling.structure.job.executionendtime',
                },
                visible: true,
                readonly: true,
            },
            {
                id: 'executionmachine',
                model: 'ExecutionMachine',
                type: FieldType.Text,
                label: {
                    text: 'Execution Machine',
                    key: 'controlling.structure.job.executionmachine',
                },
                visible: true,
                readonly: true,
            },
        ] as Array<ColumnDef<IControllingStructureSchedulerJob>>;
    }
}