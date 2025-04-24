/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { ISchedulerUITaskTypeLookup } from '../../model/entities/scheduler-ui-task-type-lookup.interface';


@Injectable({
    providedIn: 'root'
})


/**
 * Lookup Service for ServicesSchedulerUITaskTypeLookupService from customize 
 * module
 */
export class ServicesSchedulerUITaskTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<ISchedulerUITaskTypeLookup, T> {

    public constructor() {
        super(
            {
                httpRead: {
                    route: 'services/schedulerui/job/',
                    endPointRead: 'tasktypes',
                    usePostForRead: false,
                },

            },
            {
                uuid: '77f863ec4d5748d2a534addd53ecfc50',
                idProperty: 'Id',
                valueMember: 'Id',
                displayMember: 'Description',
                gridConfig: {
                    columns: [
                        {
                            id: 'Description',
                            model: 'Description',
                            width: 300,
                            type: FieldType.Description,
                            label: {
                                text: 'Task name',
                                key: 'services.schedulerui.taskTypeName'
                            },
                            sortable: true,
                            visible: true,

                        },

                    ]
                },
                showDialog: false,
                showGrid: true
            });
    }
}
