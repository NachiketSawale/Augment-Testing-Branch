/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEstRuleEntity } from '@libs/estimate/interfaces';
import { Injectable } from '@angular/core';
@Injectable({
	providedIn: 'root',
})
export class EstimateMainRuleAssignRuleLookupService extends UiCommonLookupEndpointDataService<IEstRuleEntity>{
	public mdcLineItemContextFk:number=0;
	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'estimate/rule/estimaterule/', endPointRead: 'treeByLineItemContext', usePostForRead: true},
				filterParam: true,
				prepareListFilter: () => {
					return {MdcLineItemContextFk:  this.mdcLineItemContextFk};
				}
			},
			{
				uuid: 'c4f9c32e6cc149aa8f0ec7wd3c7e91e5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
			},
		);
	}
}