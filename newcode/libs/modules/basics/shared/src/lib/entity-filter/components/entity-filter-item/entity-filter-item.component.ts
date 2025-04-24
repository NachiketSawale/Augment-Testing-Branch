/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription, firstValueFrom } from 'rxjs';
import { differenceBy } from 'lodash';
import { Component, ElementRef, EventEmitter, Input, Output, Type, ViewChild, inject, StaticProvider, OnInit, OnDestroy } from '@angular/core';
import { CollectionHelper, IEntityIdentification, PlatformDateService, PlatformTranslateService } from '@libs/platform/common';
import { ActivePopup, PopupService } from '@libs/ui/common';
import {
	IEntityFilterApplyValue,
	IEntityFilterDefinition,
	ENTITY_FILTER_DEFINITION,
	EntityFilterOperator,
	EntityFilterScope,
	EntityFilterSource,
	EntityFilterType,
	ENTITY_FILTER_CHAR,
	ENTITY_FILTER_DATE,
	ENTITY_FILTER_NUMERIC,
	ENTITY_FILTER_DOMAIN,
} from '../../model';
import { BasicsSharedEntityFilterBooleanComponent } from '../entity-filter-boolean/entity-filter-boolean.component';
import { BasicsSharedEntityFilterListComponent } from '../entity-filter-list/entity-filter-list.component';
import { BasicsSharedEntityFilterDomainComponent } from '../entity-filter-domain/entity-filter-domain.component';
import { BasicsSharedEntityFilterGridComponent } from '../entity-filter-grid/entity-filter-grid.component';

/**
 * Entity filter item component
 */
@Component({
	selector: 'basics-shared-entity-filter-item',
	templateUrl: './entity-filter-item.component.html',
	styleUrl: './entity-filter-item.component.scss',
})
export class BasicsSharedEntityFilterItemComponent<TEntity extends IEntityIdentification> implements OnInit, OnDestroy {
	private readonly subscriptions: Subscription[] = [];
	private readonly popupService = inject(PopupService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly dateService = inject(PlatformDateService);
	private readonly operatorKeys = ['equals', 'lessThan', 'greaterThan', 'range', 'contains', 'startsWith', 'endsWith'];
	private activePopup?: ActivePopup | null;

	@ViewChild('host')
	protected host!: ElementRef;

	/**
	 * Search scope
	 */
	@Input()
	public scope!: EntityFilterScope<TEntity>;

	/**
	 * Entity filter definition
	 */
	@Input()
	public definition!: IEntityFilterDefinition;

	/**
	 * Event emitter for removing a filter item
	 */
	@Output()
	public remove = new EventEmitter<void>();

	/**
	 * Initializes the component and subscribes to the open filter event.
	 */
	public ngOnInit(): void {
		this.subscriptions.push(
			this.scope.openFilterRequest$.subscribe(async (e) => {
				if (this.definition === e) {
					await this.openFilter();
				}
			}),
		);
	}

	/**
	 * Cleans up the component and unsubscribes from all subscriptions.
	 */
	public ngOnDestroy(): void {
		this.activePopup?.close();
		this.subscriptions.forEach((s) => s.unsubscribe());
	}

	private getDomainFilter() {
		switch (this.definition.Type) {
			case EntityFilterType.Char:
				return ENTITY_FILTER_CHAR;
			case EntityFilterType.Numeric:
				return ENTITY_FILTER_NUMERIC;
			case EntityFilterType.Date:
				return ENTITY_FILTER_DATE;
		}

		throw new Error('Invalid domain filter type');
	}

	/**
	 * Opens the filter
	 */
	public async openFilter() {
		let contentCmp: Type<unknown> | null = null;
		const providers: StaticProvider[] = [
			{
				provide: EntityFilterScope,
				useValue: this.scope,
			},
			{
				provide: ENTITY_FILTER_DEFINITION,
				useValue: this.definition,
			},
		];

		switch (this.definition.Type) {
			case EntityFilterType.Char:
			case EntityFilterType.Numeric:
			case EntityFilterType.Date:
				contentCmp = BasicsSharedEntityFilterDomainComponent;
				providers.push({
					provide: ENTITY_FILTER_DOMAIN,
					useValue: this.getDomainFilter(),
				});
				break;
			case EntityFilterType.Boolean:
				contentCmp = BasicsSharedEntityFilterBooleanComponent;
				break;
			case EntityFilterType.List:
				contentCmp = BasicsSharedEntityFilterListComponent;
				break;
			case EntityFilterType.Grid:
				contentCmp = BasicsSharedEntityFilterGridComponent;
				break;
		}

		if (!contentCmp) {
			return;
		}

		this.activePopup = this.popupService.toggle(this.host, contentCmp, {
			providers: providers,
		});

		if (!this.activePopup) {
			return;
		}

		const result = (await firstValueFrom(this.activePopup.closed)) as IEntityFilterApplyValue<IEntityFilterDefinition>;

		this.activePopup = null;

		if (!result?.apply) {
			return;
		}

		const def = result.value;
		this.definition.Operator = def.Operator;
		this.definition.Factors = def.Factors;
		this.definition.Descriptions = def.Descriptions;
		await this.scope.executeFilter();
	}

	/**
	 * Removes the filter and emits the remove event
	 */
	public removeFilter() {
		this.remove.emit();
	}

	/**
	 * Gets the condition for the filter
	 * @returns The condition string
	 */
	public getCondition(): string {
		if (!this.definition.Operator) {
			return '';
		}

		let key = this.operatorKeys[this.definition.Operator - 1];

		if (!key) {
			return '';
		}

		if ([EntityFilterType.Boolean, EntityFilterType.List].includes(this.definition.Type)) {
			key = 'is';
		} else if (this.definition.Type === EntityFilterType.Date) {
			switch (this.definition.Operator) {
				case EntityFilterOperator.Equals:
					key = 'on';
					break;
				case EntityFilterOperator.Range:
					return ':';
				case EntityFilterOperator.LessThan:
					key = 'upTo';
					break;
				case EntityFilterOperator.GreaterThan:
					key = 'from';
					break;
			}
		}

		return 'basics.material.lookup.condition.' + key;
	}

	/**
	 * Gets the value for the filter
	 * @returns The value string
	 */
	public getValue() {
		let value: unknown = '';

		if (!this.definition.Factors?.length) {
			return value;
		}

		switch (this.definition.Type) {
			case EntityFilterType.Numeric:
				{
					if (this.definition.Operator === EntityFilterOperator.Range) {
						value = `${this.definition.Factors[0]} - ${this.definition.Factors[1]}`;
					} else {
						value = this.definition.Factors[0];
					}
				}
				break;
			case EntityFilterType.Char:
				{
					value = this.definition.Factors[0];
				}
				break;
			case EntityFilterType.Boolean:
				{
					value = this.translateService.instant('basics.material.lookup.condition.' + (this.definition.Factors[0] ? 'yes' : 'no')).text;
				}
				break;
			case EntityFilterType.List:
			case EntityFilterType.Grid:
				{
					value = this.getListValue();
				}
				break;
			case EntityFilterType.Date:
				{
					if (this.definition.Operator === EntityFilterOperator.Range) {
						value = `${this.formatDate(this.definition.Factors[0])} - ${this.formatDate(this.definition.Factors[1])}`;
					} else {
						value = this.formatDate(this.definition.Factors[0]);
					}
				}
				break;
		}

		return value;
	}

	private formatDate(date: unknown) {
		// todo: try to reuse formatter of dateutc domain in future
		return this.dateService.formatLocal(date as Date | string | number, 'dd/MM/yyyy');
	}

	/**
	 * Retrieves a list of descriptions for the factors defined in the `definition` object.
	 * The method handles various scenarios, including:
	 *  - If descriptions are directly provided, they are returned.
	 *  - If the source is `EntityFilterSource.Attribute`, the factors are returned as a comma-separated list.
	 *  - If no descriptions are provided, it attempts to map the factors to descriptions from a flat list or display items.
	 *  - If some descriptions are missing, the method triggers the loading of missing display items asynchronously.
	 *
	 * @returns {string} A comma-separated string of descriptions for the factors, or an empty string if no factors are defined.
	 */
	private getListValue() {
		// If there are no factors defined, return an empty string
		if (!this.definition.Factors?.length) {
			return '';
		}

		// Initialize an array to store descriptions
		let descriptions: unknown[] = [];

		// Case when the source is Attribute: directly return the factors joined by commas
		if (this.definition.Source === EntityFilterSource.Attribute) {
			return this.definition.Factors?.join(', ');
		}

		// If descriptions are already defined, return them joined by commas
		if (this.definition.Descriptions) {
			descriptions = this.definition.Descriptions;
			return descriptions?.join(', ');
		}

		// Otherwise, attempt to retrieve descriptions from a flat list
		const list = this.getFlatList();

		// If the flat list is not empty, map each factor to its description from the list
		if (list.length > 0) {
			descriptions = this.definition.Factors.map((e) => {
				return list.find((i) => i.Id === e)?.Description;
			});

			// Return the descriptions joined by commas
			return descriptions?.join(', ');
		}

		// Track any missing factors that could not be found in the flat list
		let missingFactors: unknown[] = [];
		const displayItems = this.getDisplayItems();

		// Try to match each factor to a display item and get the description
		descriptions = this.definition.Factors.map((e) => {
			const displayItem = displayItems.find((i) => i.Id === e);

			// If the display item is found, return its description
			if (displayItem) {
				return displayItem.Description;
			} else {
				// If not, track this factor as missing
				missingFactors.push(e);
			}

			// Return the factor as is if no display item is found
			return e;
		});

		// If there are missing factors, handle them by loading the missing display items
		if (missingFactors.length > 0) {
			// Initialize an array for loading missing factors if not already defined
			if (!this.definition.LoadingFactors) {
				this.definition.LoadingFactors = [];
			}

			// Remove any factors that are already in the loading list to avoid duplication
			missingFactors = differenceBy(missingFactors, this.definition.LoadingFactors);

			// If there are still missing factors, add them to the loading list and trigger their loading
			if (missingFactors.length > 0) {
				this.definition.LoadingFactors.push(...missingFactors);
				this.loadDisplayItems(missingFactors);
			}
		}

		// Return the descriptions of the factors joined by commas
		return descriptions?.join(', ');
	}

	/**
	 * Gets the display items for the filter
	 * @returns The display items array
	 */
	private getDisplayItems() {
		if (!this.definition.DisplayItems) {
			this.definition.DisplayItems = [];
		}
		return this.definition.DisplayItems;
	}

	/**
	 * Gets the flat list of items for the filter
	 * @returns The flat list array
	 */
	private getFlatList() {
		if (this.definition.List) {
			return CollectionHelper.Flatten(this.definition.List, (e) => e.ChildItems || []);
		}
		return [];
	}

	/**
	 * Loads the display items for the filter
	 * @param missingFactors The missing factors array
	 */
	private async loadDisplayItems(missingFactors: unknown[]) {
		const items = await this.scope.loadDisplayItemsOfFilter(this.definition, missingFactors);

		if (items?.length > 0) {
			const displayItems = this.getDisplayItems();
			displayItems.push(...items);
		}
	}

	/**
	 * Gets the number of factors for the filter
	 * @returns The number of factors
	 */
	public getNumber(): number {
		if ([EntityFilterType.List, EntityFilterType.Grid].includes(this.definition.Type)) {
			return this.definition.Factors?.length || 0;
		}

		return 0;
	}
}
