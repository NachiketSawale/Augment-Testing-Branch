/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IBasicsCustomizeEstRootAssignmentTypeEntity } from '@libs/basics/interfaces';
@Injectable({
	providedIn: 'root',
})
export class EstimateMainRuleAssignTypeLookupService extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstRootAssignmentTypeEntity>{

	private selectedItemId: number | null = null;
	private mdcContextId: number | null = null;
	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/customize/lineitemcontext/', endPointRead: 'list', usePostForRead: true},
			},
			{
				uuid: 'c4f9c32e6cc149aa830ec7dd3c7291e5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
			},
		);
	}
	public override convertList(list: IBasicsCustomizeEstRootAssignmentTypeEntity[]): IBasicsCustomizeEstRootAssignmentTypeEntity[] {
		let data = list;
		if (this.mdcContextId) {
			data = data.filter((d) => d.LineitemcontextFk === this.mdcContextId);
		}
		data = data.filter((item) => item.IsLive || item.Id === this.selectedItemId);
		return data;
	}

	/**
	 * Sets the selected item ID for filtering.
	 * @param itemId
	 */
	public setSelectedItemId(itemId: number | null): void {
		this.selectedItemId = itemId;
	}

	public getSelectItemId(){
		return this.selectedItemId;
	}
	/**
	 * Sets the MDC context ID for further filtering.
	 * @param id
	 */
	public setMdcContextId(id: number): void {
		if (id !== 0) {
			this.mdcContextId = id;
		}
	}

}