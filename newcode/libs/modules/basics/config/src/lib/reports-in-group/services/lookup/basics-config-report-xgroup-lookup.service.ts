/**
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

import { IReportXGroupLookupEntity } from '../../model/entities/report-xgroup-lookup-entity.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * Report x-group lookup service 
 */
export class BasicsConfigReportXGroupLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IReportXGroupLookupEntity, TEntity> {

    public constructor() {
        super('report', {
            uuid: '1c6d72a0bccd47d6809faa21f286feda',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Name.Translated',
            gridConfig: {
                uuid: 'd43a8a561f29488eb88bab980e5c55ac',
                columns: [
                    {
                        id: 'name',
                        model: 'Name.Translated',
                        type: FieldType.Description,
                        //TODO: basics.reporting.name
                        label: 'Name',
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'description',
                        model: 'Description.Translated',
                        type: FieldType.Description,
                        //TODO: basics.reporting.description
                        label: 'Description',
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'fileName',
                        model: 'FileName',
                        type: FieldType.Description,
                        //TODO: basics.reporting.reportFileName
                        label: 'File Name',
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'filePath',
                        model: 'FilePath',
                        type: FieldType.Description,
                        //TODO: basics.reporting.reportFilePath
                        label: 'File Path',
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                ]
            },

            dialogOptions: {
                //TODO: basics.reporting.dialogTitleReport
                headerText: 'Assign Report'

                //TODO: In report column lookup dialog when click on refresh 
                //button throws 400 error for getsearchlist api.
            },
            showDialog: true,

        });
    }
}