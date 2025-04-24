/*
 * Copyright(c) RIB Software GmbH
 */

import {createLookup, FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';
import { Injectable } from '@angular/core';
import {
	BasicsCompanyLookupService,
	BasicsSharedAssetMasterLookupService,
	BasicsSharedProjectStatusLookupService, BasicsSharedStatusIconService
} from '@libs/basics/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { IBasicsCustomizeProjectStatusEntity } from '@libs/basics/interfaces';
import { ServiceLocator } from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectSharedLookupService<TEntity extends object> extends UiCommonLookupTypeDataService <IProjectEntity, TEntity> {
    public constructor() {
        super('project', {
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'ProjectNo',
            showGrid: true,
            showDialog: true,
            gridConfig: {
                columns: [
                    {
                        id: 'Status',
                        type: FieldType.Lookup,
                        label: {text: 'Status', key: 'cloud.common.entityStatus'},
                        model: 'StatusFk',
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedProjectStatusLookupService,
                            displayMember: 'DescriptionInfo.Translated',
                            valueMember: 'Id',
	                         imageSelector: ServiceLocator.injector.get(BasicsSharedStatusIconService<IBasicsCustomizeProjectStatusEntity, IProjectEntity>)
                        }),
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
                    {
                        id: 'ProjectNo',
                        type: FieldType.Code,
                        label: {text: 'Project No', key: 'cloud.common.entityProjectNo'},
                        model: 'ProjectNo',
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
                    {
                        id: 'ProjectName',
                        type: FieldType.Description,
                        label: {text: 'Project Name', key: 'cloud.common.entityProjectName'},
                        model: 'ProjectName',
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
                    {
                        id: 'Company',
                        type: FieldType.Lookup,
                        label: {text: 'Company', key: 'cloud.common.entityCompany'},
                        model: 'CompanyFk',
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsCompanyLookupService,
                            displayMember: 'Code',

                        }),
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
	                 {
		                id: 'StartDate',
		                type: FieldType.Date,
		                label: {key: 'cloud.common.entityStartDate'},
		                model: 'StartDate',
		                visible: true,
		                readonly: true,
		                sortable: true
	                 },
	                 {
		                id: 'Group',
		                type: FieldType.Description,
		                label: {key: 'cloud.common.entityGroup'},
		                model: 'Group',
		                visible: true,
		                readonly: true,
		                sortable: true
	                 },
                    {
                        id: 'AssetMaster',
                        type: FieldType.Lookup,
                        model: 'AssetMasterFk',
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedAssetMasterLookupService,
                            displayMember: 'Code',
                        }),
                        label: {text: 'Asset Master', key: 'basics.common.entityAssetMaster'},
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
                    {
                        id: 'AssetMasterDescription',
                        type: FieldType.Lookup,
                        label: {text: 'Asset Master Description', key: 'basics.common.entityAssetMasterDescription'},
                        model: 'AssetMasterFk',
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedAssetMasterLookupService,
                            displayMember: 'DescriptionInfo.Translated',
                        }),
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
                    {
                        id: 'ProjectName2',
                        type: FieldType.Description,
                        label: {text: 'Project Name2', key: 'cloud.common.entityProjectName2'},
                        model: 'ProjectName2',
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
                    {
                        id: 'Group',
                        type: FieldType.Description,
                        label: {text: 'GroupDescription', key: 'cloud.common.entityGroup'},
                        model: 'Group',
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
                    {
                        id: 'ProjectIndex',
                        type: FieldType.Description,
                        label: {text: 'Project Index', key: 'cloud.common.entityProjectIndex'},
                        model: 'ProjectIndex',
                        visible: true,
                        readonly: true,
                        sortable: true
                    },
	                {
		                id: 'ProjectLongNo',
		                type: FieldType.Description,
		                label: {text: 'Long Number', key: 'project.main.projectLongNo'},
		                model: 'ProjectLongNo',
		                visible: true,
		                readonly: true,
		                sortable: true
	                }

                ]
            },
            uuid: '039b02f62e964148831ec77618c20f2f',
            dialogOptions: {
				headerText: {
					text: 'Assign Project',
                    key:'cloud.common.dialogTitleProject'
				}
			},
        });
        this.paging.enabled = true;
        this.paging.pageCount = 200;
    }
}

