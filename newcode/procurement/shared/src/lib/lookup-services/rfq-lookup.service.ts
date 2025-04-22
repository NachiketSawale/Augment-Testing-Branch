/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { PrcRfqStatusLookupService } from '../lookup-services/rfq-status-lookup.service';
import { BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';

/**
 * Rfq lookup entity interface
 */
export interface IRfqLookupEntity {
    Id: number;
    Code: string;
    StatusFk: number;
    ProjectNo?:string|null,
    ProjectName?:string|null,
    ProjectName2?:string|null,
    ClerkPrcCode?:string|null,
    ClerkPrcDescription?:string|null,
    ClerkReqCode?:string|null,
    ClerkReqDescription?:string|null
}

/**
 * Rfq lookup data service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementShareRfqLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IRfqLookupEntity, TEntity> {
    public constructor() {
        super('RfqHeaderLookup', {
            uuid: '041033c2ed5c4af192edf95647e762fd',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            showDialog: true,
            mergeConfig: true,
            gridConfig: {
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        type: FieldType.Code,
                        label: { text: 'Code', key: 'cloud.common.entityCode' },
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'description',
                        model: 'Description',
                        type: FieldType.Translation,
                        label: { text: 'Description', key: 'cloud.common.entityDescription' },
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'rfqstatusfk',
                        model: 'StatusFk',
                        type: FieldType.Lookup,
                        label: { text: 'Description', key: 'cloud.common.entityStatus' },
                        sortable: true,
                        visible: true,
                        readonly: true,
                        lookupOptions: createLookup({
                            dataServiceToken: PrcRfqStatusLookupService
                        })
                    },
                    {
                        id: 'projectno',
                        model: 'ProjectNo',
                        type: FieldType.Code,
                        label: { text: 'ProjectNo', key: 'cloud.common.entityProjectNo' },
                        sortable: true,
                        visible: true,
                        readonly: true,
                    },
                    {
                        id: 'projectname',
                        model: 'ProjectName',
                        type: FieldType.Description,
                        label: { text: 'ProjectName', key: 'cloud.common.entityProjectName' },
                        sortable: true,
                        visible: true,
                        readonly: true,
                    },
                    {
                        id: 'projectname2',
                        model: 'ProjectName2',
                        type: FieldType.Description,
                        label: { text: 'ProjectName2', key: 'cloud.common.entityProjectName2' },
                        sortable: true,
                        visible: true,
                        readonly: true,
                    },
                    {
                        id: 'clerkprccode',
                        model: 'ClerkPrcCode',
                        type: FieldType.Code,
                        label: { text: 'ClerkPrcOwner', key: 'cloud.common.entityResponsible' },
                        sortable: true,
                        visible: true,
                        readonly: true,
                    },
                    {
                        id: 'clerkprcdescription',
                        model: 'ClerkPrcDescription',
                        type: FieldType.Description,
                        label: { text: 'ClerkPrcDescription', key: 'cloud.common.entityResponsibleDescription' },
                        sortable: true,
                        visible: true,
                        readonly: true,
                    },
                    {
                        id: 'clerkreqfk',
                        model: 'ClerkReqCode',
                        type: FieldType.Code,
                        label: { text: 'ClerkReqOwner', key: 'cloud.common.entityRequisitionOwner' },
                        sortable: true,
                        visible: true,
                        readonly: true,
                    },
                    {
                        id: 'clerkreqdescription',
                        model: 'ClerkReqDescription',
                        type: FieldType.Description,
                        label: { text: 'ClerkReqDescription', key: 'businesspartner.main.entityClerkReqDescription' },
                        sortable: true,
                        visible: true,
                        readonly: true,
                    }
                ]
            },
            dialogOptions: {
                headerText: {
                    text: 'Assign RfQ Header',
                    key: 'cloud.common.dialogTitleRfQHeader'
                }
            },
            dialogSearchForm: {
                visible: false,
                form: {
                    config: {
                        rows: [{
                            id: 'Project',
                            label: {
                                text: 'Project',
                                key: 'cloud.common.entityProject'
                            },
                            type: FieldType.Lookup,
                            lookupOptions: createLookup({
                                dataServiceToken: ProjectSharedLookupService,
                                displayMember: 'Code',
                            }),
                            model: 'ProjectFk',
                            sortOrder: 1,
                            readonly: false
                        }, {
                            id: 'StructureCode',
                            label: {
                                text: 'Structure Code',
                                key: 'estimate.main.createMaterialPackageWizard.structureCode'},
                            type: FieldType.Lookup,
                            lookupOptions: createLookup({
                                dataServiceToken: BasicsSharedProcurementStructureLookupService,
                                displayMember: 'Code',
                            }),
                            model: 'StructureCodeFk',
                            sortOrder: 2,
                            readonly: false
                        }, {
                            id: 'businesspartner',
                            label: {
                                text: 'Business Partner',
                                key: 'cloud.common.entityBusinesspartner'
                            },
                            type: FieldType.Integer, // TODO: Circular dependency
                            /*lookupOptions: createLookup({
                                dataServiceToken: BusinessPartnerLookupService,
                                displayMember: 'BusinessPartnerName1'
                            }),*/
                            model: 'BusinessPartnerFk',
                            sortOrder: 3,
                            readonly: false
                        }]
                    }
                }
            }
        });
    }
}