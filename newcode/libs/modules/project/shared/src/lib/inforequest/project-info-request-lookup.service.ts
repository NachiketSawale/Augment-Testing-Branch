/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IProjectInfoRequestEntity } from '@libs/project/interfaces';
import { Injectable } from '@angular/core';
@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequestLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IProjectInfoRequestEntity, TEntity> {
	public constructor() {
		const endpoint =
			{
				httpRead:
					{
						route: 'basics/lookupdata/masternew/',
						endPointRead: 'getsearchlist?lookup=projectinforequest',
						usePostForRead: false,
					},
				 filterParam: true,
				prepareListFilter :()=>{
					return {};
				}
			};


		super(endpoint, {
		//super('ProjectInfoRequest', {
			uuid: '4c4a01cb77df4367abacc60d9ad80fce',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '6df7ca744ab64644b2f791b1ee3dc831',
				columns: [
					{id: 'code', model: 'Code', type: FieldType.Code, label: {text: 'Code', key: 'cloud.common.entityCode'}, sortable: true, visible: true, readonly: true},
					{id: 'description', model: 'Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true}
				]
			},
			dialogOptions: {
				headerText: {
					text: 'Info Request',
					key: 'cloud.common.dialogInfoRequest'
				}
			},
			// buildSearchString: (searchText: string) => {
			// 	if(!searchText) {
			// 		return '';
			// 	} else {
			// 		const searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
			// 		return searchString.replace(/%SEARCH%/g, searchText);
			// 	}
			// },
			showDialog: true
		});
	}
}