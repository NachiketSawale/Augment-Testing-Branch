/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class BasicsSiteProjectLookupService<IEntity extends object > extends UiCommonLookupTypeLegacyDataService <IEntity >{
	public constructor(){
	super('project', {
		idProperty: 'Id',
		valueMember: 'Id',
		displayMember: 'ProjectNo',
		showGrid: true,
		dialogOptions: {
			width: '680px'
		},
        showDialog: true,
		gridConfig:{
			columns: [
				{
					id: 'Status',
					type: FieldType.Description,
					label: {text: 'Status',key: 'cloud.common.entityStatus'},
					visible: true,
					readonly: true,
					sortable: true
				},
                {
					id: 'ProjectNo',
					type: FieldType.Code,
					label: {text: 'Project No',key: 'cloud.common.entityProjectNo'},
					visible: true,
					readonly: true,
					sortable: true
				},
                {
					id: 'ProjectName',
					type: FieldType.Description,
					label: {text: 'Project Name',key: 'cloud.common.entityProjectName'},
					visible: true,
					readonly: true,
					sortable: true
				},
                {
					id: 'Company',
					type: FieldType.Description,
					label: {text: 'Company',key: 'cloud.common.entityCompany'},
					visible: true,
					readonly: true,
					sortable: true
				},
                {
					id: 'AssetMaster',
					type: FieldType.Description,
					label: {text: 'Asset Master',key: 'cloud.common.entityAssetMaster'},
					visible: true,
					readonly: true,
					sortable: true
				}, 
                {
					id: 'AssetMasterDescription',
					type: FieldType.Description,
					label: {text: 'Asset Master Description',key: 'cloud.common.entityAssetMasterDescription'},
					visible: true,
					readonly: true,
					sortable: true
				},
                {
					id: 'ProjectName2',
					type: FieldType.Description,
					label: {text: 'Project Name2',key: 'cloud.common.entityProjectName2'},
					visible: true,
					readonly: true,
					sortable: true
				},
                {
					id: 'Group',
					type: FieldType.Description,
					label: {text: 'GroupDescription',key: 'cloud.common.entityGroup'},
					visible: true,
					readonly: true,
					sortable: true
				},
                {
					id: 'ProjectIndex',
					type: FieldType.Description,
					label: {text: 'Project Index',key: 'cloud.common.entityProjectIndex'},
					visible: true,
					readonly: true,
					sortable: true
				},
                
			]
		},
		uuid: '039b02f62e964148831ec77618c20f2f',
	});
}
}

