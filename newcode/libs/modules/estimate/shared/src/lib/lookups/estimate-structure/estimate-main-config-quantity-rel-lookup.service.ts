/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
@Injectable({
	providedIn: 'root',
})
export class EstimateMainConfigQuantityRelLookupService extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstQuantityRelEntity>{

	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/customize/estquantityrel/', endPointRead: 'list', usePostForRead: true},
			},
			{
				uuid: 'c4f9c32e6cc149aa830ec7dd3c7291e5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
			},
		);
	}
}

export interface IBasicsCustomizeEstQuantityRelEntity extends IEntityBase, IEntityIdentification{
	Id:number;
	DescriptionInfo: IDescriptionInfo;
	Icon: number;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}