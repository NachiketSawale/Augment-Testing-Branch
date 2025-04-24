/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsCustomizeEstStructureEntity} from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class EstimateMainConfigStructureLookupService extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstStructureEntity>{
	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/customize/eststructure/', endPointRead: 'list', usePostForRead: true},
			},
			{
				uuid: 'c4f9c32e6cc149aa830ec7dd3c7291e5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
			},
		);
	}
}