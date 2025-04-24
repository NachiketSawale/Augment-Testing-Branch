/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IReportLookup } from '../../model/entities/report-lookup.interface';

@Injectable({
    providedIn: 'root'
})


/**
 * Lookup Service for BasicsConfigReportLookupService from customize module
 */
export class BasicsConfigReportLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IReportLookup, T> {

    public constructor() {
        super(
            {
                httpRead: {
                    route: 'basics/reporting/report/',
                    endPointRead: 'list',
                    usePostForRead: false,
                },

            },
            {
                uuid: '441f33da58f74fc2970e0519906ff8ae',
                idProperty: 'Id',
                valueMember: 'Id',
                displayMember: 'ReportName',
                gridConfig: {
                    columns: [
                        {
                            id: 'reportName',
                            model: 'reportName',
                            width: 300,
                            type: FieldType.Description,
                            label: {
                                text: 'Report Name',
                                key: 'basics.config.entityReportName'
                            },
                            sortable: true,
                            visible: true,
                            readonly: true
                        },
                        {
                            id: 'fileName',
                            model: 'fileName',
                            width: 300,
                            type: FieldType.Description,
                            label: {
                                text: 'File Name',
                                key: 'basics.config.entityFileName'
                            },
                            sortable: true,
                            visible: true,
                            readonly: true
                        },
                    ]
                },
                showDialog: false,
                showGrid: true
            });
    }
}
