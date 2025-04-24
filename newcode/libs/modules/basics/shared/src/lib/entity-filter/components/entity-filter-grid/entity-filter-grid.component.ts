/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CollectionHelper, IEntityIdentification } from '@libs/platform/common';
import { FieldType, GridComponent, IGridConfiguration } from '@libs/ui/common';
import { IEntityFilterListItem } from '../../model';
import { BasicsSharedEntityFilterListBase } from '../entity-filter-base/entity-filter-list-base';

/**
 * Component for displaying and managing a entity filter list.
 * Extends the BasicsSharedEntityFilterBase class and implements OnInit.
 */
@Component({
	selector: 'basics-shared-entity-filter-grid',
	templateUrl: './entity-filter-grid.component.html',
	styleUrl: './entity-filter-grid.component.scss',
})
export class BasicsSharedEntityFilterGridComponent<TEntity extends IEntityIdentification> extends BasicsSharedEntityFilterListBase<TEntity> implements OnInit, AfterViewInit {
	/** The UUID of the component. */
	protected uuid = 'bfe51b8bc6227cb2a54f4fb9b7a027a9';

	/**
	 * The configuration for the grid.
	 * @protected
	 */
	protected gridConfig: IGridConfiguration<IEntityFilterListItem> = {
		uuid: this.uuid,
		globalEditorLock: false,
		skipPermissionCheck: true,
		indicator: false,
		columns: [
			{
				id: 'IsSelected',
				label: {
					text: 'Selected',
					key: 'basics.common.selected',
				},
				type: FieldType.Boolean,
				model: 'IsSelected',
				readonly: false,
				width: 40,
				visible: true,
				searchable: true,
				sortable: true,
				validator: (info) => {
					const selected = info.value as boolean;
					info.entity.IsSelected = selected;
					this.updateSelectionOfChildren(info.entity, selected);
					this.gridHost?.invalidate();
					return {
						apply: true,
						valid: true,
					};
				},
			},
		],
		treeConfiguration: {
			parent: (entity) => this.definition.List?.find((e) => e.Id === entity.ParentFk) ?? null,
			children: (entity) => entity.ChildItems ?? [],
			description: ['Description'],
			width: 360,
			collapsed: true,
			header: {
				text: 'Structure',
				key: 'cloud.common.entityStructure',
			},
		},
	};

	/**
	 * The grid component.
	 * @protected
	 */
	@ViewChild(GridComponent<IEntityFilterListItem>)
	protected gridHost: GridComponent<IEntityFilterListItem> | undefined;

	/**
	 * Initializes the component and loads the list of items.
	 * Sets the default operator to 'Equals'.
	 */
	public async ngOnInit() {
		this.initialize();
		this.definition.Operator = this.EntityFilterOperator.Equals;
		await this.loadList();
	}

	/**
	 * After the view has been initialized, it focuses the search panel.
	 */
	public ngAfterViewInit() {
		this.gridHost?.searchPanel();
	}

	/**
	 * Gets the flat list of items from the definition.
	 * @protected
	 */
	protected override getFlatList() {
		return CollectionHelper.Flatten(this.definition.List ?? [], (e) => e.ChildItems ?? []);
	}

	/**
	 * Sets the list of items in the definition and updates the visible list.
	 * @param {IEntityFilterListItem[]} list - The list of items to be set.
	 */
	protected override setList(list: IEntityFilterListItem[]) {
		super.setList(list);
		this.gridConfig = {
			...this.gridConfig,
			items: list,
		};
	}

	/**
	 * Updates the selection of the children of the specified entity.
	 * @param entity
	 * @param isSelected
	 * @private
	 */
	private updateSelectionOfChildren(entity: IEntityFilterListItem, isSelected: boolean) {
		entity.ChildItems?.forEach((child) => {
			child.IsSelected = isSelected;
			this.updateSelectionOfChildren(child, isSelected);
		});
	}
}
