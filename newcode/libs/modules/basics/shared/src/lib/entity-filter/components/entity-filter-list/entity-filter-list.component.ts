/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { IEntityFilterListItem } from '../../model';
import { IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedEntityFilterListBase } from '../entity-filter-base/entity-filter-list-base';

/**
 * Component for displaying and managing a entity filter list.
 * Extends the BasicsSharedEntityFilterBase class and implements OnInit.
 */
@Component({
	selector: 'basics-shared-entity-filter-list',
	templateUrl: './entity-filter-list.component.html',
	styleUrl: './entity-filter-list.component.scss',
})
export class BasicsSharedEntityFilterListComponent<TEntity extends IEntityIdentification> extends BasicsSharedEntityFilterListBase<TEntity> implements OnInit {
	/** List of entity filter items. */
	protected visibleList?: IEntityFilterListItem[] = [];
	/** User input for searching the list. */
	protected userInput = '';

	/** Threshold for showing the search input field. */
	private readonly accountToShowSearchInput = 10;

	/**
	 * Initializes the component and loads the list of items.
	 * Sets the default operator to 'Equals'.
	 */
	public async ngOnInit() {
		this.initialize();
		this.definition.Operator = this.EntityFilterOperator.Equals;
		this.loadPredefinedList();
		await this.loadList();
	}

	/**
	 * Filters the list based on user input.
	 * @param userInput - The input entered by the user for searching the list.
	 */
	protected search(userInput: string) {
		if (!this.definition.List) {
			return;
		}

		if (!userInput) {
			this.visibleList = this.definition.List;
		} else {
			this.visibleList = this.definition.List.filter((e) => e.Description?.toLowerCase().includes(userInput.toLowerCase()));
		}
	}

	/**
	 * Determines whether the search input field should be shown.
	 * @returns True if the search input field should be shown, false otherwise.
	 */
	protected canShowSearchInput() {
		const length = this.definition.List?.length;
		return length && length > this.accountToShowSearchInput;
	}

	/**
	 * Sets the list of items in the definition and updates the visible list.
	 * @param {IEntityFilterListItem[]} list - The list of items to be set.
	 */
	protected override setList(list: IEntityFilterListItem[]) {
		super.setList(list);
		this.visibleList = list;
	}
}
