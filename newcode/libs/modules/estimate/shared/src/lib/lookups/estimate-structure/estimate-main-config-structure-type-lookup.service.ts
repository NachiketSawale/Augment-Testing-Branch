/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService} from '@libs/ui/common';
import { IBasicsCustomizeEstStructureTypeEntity } from '@libs/basics/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class EstimateMainConfigStructureTypeLookupService extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstStructureTypeEntity>{
	private selectedItemId?: number | null = null;
	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/customize/eststructuretype/', endPointRead: 'list', usePostForRead: true},
			},
			{
				uuid: 'c4f9c32e6cc149aa830ec7dd3c7291e5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
			},
		);
	}
	public setSelectedItemId(typeId:number){
			this.selectedItemId = typeId;
	}

	public getSelectId(){
		return this.selectedItemId;
	}
}