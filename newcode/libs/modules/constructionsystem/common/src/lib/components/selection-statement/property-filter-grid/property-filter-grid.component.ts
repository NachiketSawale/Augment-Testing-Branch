/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { GridContainerBaseComponent, IGridContainerLink } from '@libs/ui/business-base';
import { IPropertyFilterEntity } from '../../../model/entities/selection-statement/property-filter-entity.interface';
import { GridComponent, ItemType, UiCommonModule } from '@libs/ui/common';
import { EntityDomainType, IEntitySchema } from '@libs/platform/data-access';
import { SELECTION_STATEMENT_SCOPE } from '../property-filter/property-filter.component';

@Component({
	selector: 'constructionsystem-common-property-filter-grid',
	templateUrl: './property-filter-grid.component.html',
	styleUrls: ['./property-filter-grid.component.scss'],
	standalone: true,
	imports: [GridComponent, UiCommonModule],
})
export class PropertyFilterGridComponent extends GridContainerBaseComponent<IPropertyFilterEntity, IGridContainerLink<IPropertyFilterEntity>> {
	protected scope = inject(SELECTION_STATEMENT_SCOPE);
	public constructor() {
		super();
		this.containerLink = this.createGridContainerLink();
		this.generateGridColumns();
		this.updateToolBar();
		this.attachToEntityServices();
	}

	private updateToolBar() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'create',
				caption: 'cloud.common.taskBarNewRecord',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-rec-new',
				hideItem: false,
				sort: 1,
				disabled: () => {
					return !this.scope.searchOptions.active;
				},
				fn: () => {
					this.entityCreate?.create().then();
				},
			},
			{
				id: 'delete',
				sort: 2,
				caption: 'cloud.common.taskBarDeleteRecord',
				iconClass: 'tlb-icons ico-rec-delete',
				type: ItemType.Item,
				fn: () => {
					this.entityDelete?.delete(this.entitySelection.getSelection());
				},
				disabled: () => {
					return !(this.scope.searchOptions.active && this.entitySelection?.hasSelection());
				},
			},
			{
				id: 'searchAll',
				sort: 3,
				caption: 'cloud.common.taskBarSearch',
				iconClass: 'tlb-icons ico-search-all',
				type: ItemType.Check,
				fn: () => {
					this.containerLink?.searchPanel();
				},
				value: false,
			},
			{
				id: 'searchColumn',
				sort: 4,
				caption: 'cloud.common.taskBarColumnFilter',
				iconClass: 'tlb-icons ico-search-column',
				fn: () => {
					this.containerLink?.columnSearch();
				},
				type: ItemType.Check,
				value: false,
			},
		]);
	}

	/**
	 * customize schema
	 * @protected
	 */
	protected override loadEntitySchema(): IEntitySchema<IPropertyFilterEntity> {
		return {
			schema: 'RIB.Visual.ConstructionSystem.Common.propertyFilter',
			mainModule: 'ConstructionSystem.Common',
			properties: {
				Id: {
					domain: EntityDomainType.Integer,
					mandatory: true,
				},
				PropertyId: {
					domain: EntityDomainType.Integer,
					mandatory: false,
				},
				PropertyValue: {
					domain: EntityDomainType.Code,
					mandatory: false,
				},
				ValueType: {
					domain: EntityDomainType.Code,
					mandatory: false,
				},
				Operation: {
					domain: EntityDomainType.Integer,
					mandatory: true,
				},
			},
		};
	}
}
