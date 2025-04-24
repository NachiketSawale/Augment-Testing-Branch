/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsCustomizeEstTotalsConfigTypeEntity } from '@libs/basics/interfaces';
import { Injectable } from '@angular/core';

/**
 * Service for totals config type lookup.
 */
@Injectable({
	providedIn: 'root',
})
export class TotalsConfigTypeLookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstTotalsConfigTypeEntity, TEntity> {

	private mdcContextId: number | null = null;
	private selectedItemId: number | null = null;

	 /**
	  * Constructor
	  */
	 public constructor() {
		  super(
				{
					 httpRead: { route: 'basics/customize/esttotalsconfigtype/', endPointRead: 'list', usePostForRead: true },
				},
				{
					 uuid: 'ad1caa33bb954dfe934afbf2e78f30f5',
					 valueMember: 'Id',
					 displayMember: 'DescriptionInfo.Description',
				},
		  );
	 }

	/**
	 * Converts the list of column config types.
	 * @param list
	 */
	public override filterList(list: IBasicsCustomizeEstTotalsConfigTypeEntity[]): IBasicsCustomizeEstTotalsConfigTypeEntity[] {
		let data = list;
		if (this.mdcContextId) {
			data = data.filter((d) => d.ContextFk === this.mdcContextId);
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

	/**
	 * Sets the MDC context ID for further filtering.
	 * @param id
	 */
	public setMdcContextId(id: number): void {
		if (id !== 0) {
			this.mdcContextId = id;
		}
	}

	/**
	 * Clears the MDC context ID.
	 */
	public clearMdcContextId(): void {
		this.mdcContextId = null;
	}
}