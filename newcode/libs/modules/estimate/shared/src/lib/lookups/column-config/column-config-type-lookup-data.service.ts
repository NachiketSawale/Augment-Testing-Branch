/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBasicsCustomizeEstColumnConfigTypeEntity } from '@libs/basics/interfaces';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';

/**
 * Service for fetching the list of available column config types.
 */
@Injectable({
	providedIn: 'root',
})
export class ColumnConfigTypeLookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstColumnConfigTypeEntity, TEntity> {

	private selectedItemId: number | null = null;
	private mdcContextId: number | null = null;

	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/customize/EstColumnConfigType/', endPointRead: 'list', usePostForRead: true},
			},
			{
				uuid: 'c4f9c32e6cc149aa830ec7dddc7391e5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
			},
		);
	}

	/**
	 * Converts the list of column config types.
	 * @param list
	 */
	public override convertList(list: IBasicsCustomizeEstColumnConfigTypeEntity[]): IBasicsCustomizeEstColumnConfigTypeEntity[] {
		let data = list;
		if (this.mdcContextId) {
			data = data.filter((d) => d.ContextFk === this.mdcContextId);
		}
		// this.data.forEach(d => {
		// 	d.Description = d.DescriptionInfo?.Translated ?? '';
		// });
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