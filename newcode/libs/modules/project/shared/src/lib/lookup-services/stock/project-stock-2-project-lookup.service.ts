/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupFieldOverload, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IProjectLookupEntity } from '@libs/project/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

/**
 * Project Stock 2 Project Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ProjectSharedStock2ProjectLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IProjectLookupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('ProjectStock2Project', {
			uuid: '2814cbf518954fef8193250ebee45e29',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'ProjectNo',
			showDialog: true,
			gridConfig: {
				columns: [
					{
						id: 'Status',
						type: FieldType.Lookup,
						label: {text: 'Status', key: 'cloud.common.entityStatus'},
						model: 'StatusFk',
						lookupOptions: (BasicsSharedLookupOverloadProvider.provideProjectStatusReadonlyLookupOverload() as ILookupFieldOverload<IProjectLookupEntity>).lookupOptions,
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
						lookupOptions: (BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload() as ILookupFieldOverload<IProjectLookupEntity>).lookupOptions,
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
						id: 'StartDate',
						type: FieldType.Date,
						label: {text: 'Start Date', key: 'basics.customize.startdate'},
						model: 'StartDate',
						visible: true,
						readonly: true,
						sortable: true
					},
					{
						id: 'GroupDescription',
						type: FieldType.Description,
						label: {text: 'GroupDescription', key: 'cloud.common.entityGroup'},
						model: 'GroupDescription',
						visible: true,
						readonly: true,
						sortable: true
					}
				]
			}
		});
	}
}