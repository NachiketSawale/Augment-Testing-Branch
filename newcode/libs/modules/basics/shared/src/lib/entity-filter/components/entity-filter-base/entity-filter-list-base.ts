/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { BasicsSharedEntityFilterBase } from '../entity-filter-base/entity-filter-base';
import { IEntityFilterListItem } from '../../model';
import { IEntityIdentification, PlatformHttpService } from '@libs/platform/common';

/**
 * Base class for entity filter lists.
 */
export class BasicsSharedEntityFilterListBase<TEntity extends IEntityIdentification> extends BasicsSharedEntityFilterBase<number | string, TEntity> {
	/** Injected HTTP service for making API calls. */
	protected readonly httpService = inject(PlatformHttpService);
	/** Flag indicating whether the list is currently loading. */
	protected isLoading = false;

	/**
	 * Applies the selected filters to the definition.
	 * Overrides the apply method from the base class.
	 */
	protected override apply() {
		if (this.definition.List?.length) {
			this.definition.Factors = this.getFlatList()
				.filter((e) => e.IsSelected)
				.map((e) => e.Id);
		} else {
			this.definition.Factors = [];
		}

		if (this.definition.PredefinedList?.length) {
			this.definition.PredefinedFactors = this.definition.PredefinedList.filter((e) => e.IsSelected).map((e) => e.Id);
		} else {
			this.definition.PredefinedFactors = [];
		}

		super.apply();
	}

	/**
	 * Gets the flat list of items.
	 * @returns The flat list of items.
	 */
	protected getFlatList(): IEntityFilterListItem[] {
		return this.definition.List || [];
	}

	/**
	 * Gets the count of selected items in the list.
	 * @returns The count of selected items.
	 */
	protected getSelectedCount() {
		return this.getFlatList().filter((e) => e.IsSelected).length || 0;
	}

	/**
	 * Gets the total count of items in the list.
	 * @returns The total count of items.
	 */
	protected getTotalCount() {
		return this.getFlatList().length || 0;
	}

	/**
	 * Clears the selection of items in the list and applies the changes.
	 */
	protected clear() {
		this.getFlatList().forEach((e) => (e.IsSelected = false));
		this.apply();
	}

	/**
	 * Loads the predefined list of items if it exists.
	 * If the predefined list is available in the original definition, it sets the predefined list in the current definition.
	 */
	protected loadPredefinedList() {
		if (!this.originalDef.PredefinedList) {
			return;
		}

		this.setPredefinedList(this.originalDef.PredefinedList);
	}

	/**
	 * Loads the list of items from the endpoint defined in the component's definition.
	 * If the list is already defined, it sets the list directly.
	 * Otherwise, it makes an API call to fetch the list.
	 * @throws Error if the ListEndpoint is not defined.
	 */
	protected async loadList() {
		if (this.originalDef.List) {
			this.setList(this.originalDef.List);
			return;
		}

		let data;
		let list: IEntityFilterListItem[] = [];
		const endpoint = this.definition.ListEndpoint;
		this.isLoading = true;

		if (!endpoint) {
			throw new Error('ListEndpoint is not defined');
		}

		if (endpoint.UsePost) {
			data = await this.httpService.post(endpoint.Url, endpoint.Payload);
		} else {
			data = await this.httpService.get(endpoint.Url);
		}

		if (data && this.scope.listExtension?.mapData) {
			list = this.scope.listExtension?.mapData(this.definition, data);
		} else {
			list = data as IEntityFilterListItem[];
		}

		// Cache the original list
		this.originalDef.List = list;
		this.setList(list);
		this.isLoading = false;
	}

	/**
	 * Sets the predefined list of items in the definition.
	 * @param {IEntityFilterListItem[]} list - The list of predefined items to be set.
	 */
	protected setPredefinedList(list: IEntityFilterListItem[]) {
		this.definition.PredefinedList = this.originalDef.PredefinedList;
	}

	/**
	 * Sets the list of items in the definition and updates their selection status based on the definition's factors.
	 * @param {IEntityFilterListItem[]} list - The list of items to be set.
	 */
	protected setList(list: IEntityFilterListItem[]) {
		this.definition.List = list;
		const factors = this.definition.Factors || [];
		this.getFlatList().forEach((e) => {
			e.IsSelected = factors.includes(e.Id);
		});
	}

	/**
	 * Sets a predefined item in the list using the additional behaviors.
	 * @param predefinedItem - The predefined item to be set.
	 */
	protected setPredefine(predefinedItem: IEntityFilterListItem) {
		if (this.definition.List && this.scope.listExtension?.setPredefine) {
			this.scope.listExtension.setPredefine(this.definition, predefinedItem);
		}
	}

	/**
	 * Resets a predefined item in the list using the additional behaviors.
	 * @param item - The item to be reset.
	 */
	protected resetPredefine(item: IEntityFilterListItem) {
		if (this.definition.PredefinedList && this.scope.listExtension?.resetPredefine) {
			this.scope.listExtension.resetPredefine(this.definition, item);
		}
	}
}
