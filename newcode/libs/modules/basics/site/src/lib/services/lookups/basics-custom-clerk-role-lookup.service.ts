/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import {  ICompany2BasClerkEntityGenerated } from '../../model/schema/models';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class BasicsCustomClerkRoleLookupService<IEntity extends object > extends UiCommonLookupEndpointDataService <ICompany2BasClerkEntityGenerated, IEntity >{
	public constructor(){
	super({
		httpRead: { route: 'basics/customize/lookup/clerkrole/', endPointRead: 'list', usePostForRead:true },
		filterParam:true,
		prepareListFilter:()  => {
			return {};
		},
	}, 
		{
		
		idProperty: 'Id',
		valueMember: 'Id',
		displayMember: 'DescriptionInfo.Translated',
		showGrid: true,
		gridConfig:{
			columns: [
				{
					id: 'Description',
					type: FieldType.Description,
					label: {text: 'Description',key: 'cloud.common.entityDescription'},
                    width:300,
					visible: true,
					readonly: true,
					sortable: true
				},
			]
		},
		uuid: 'b192fdd6e0764900be28b1c8f1908fa1',
	});
}
}

