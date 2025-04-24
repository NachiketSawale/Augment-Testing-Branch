/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { IEntityFilterProfileEntity, EntityFilterAccessLevel, EntityFilterScope } from '../../model';
import { forEach, groupBy } from 'lodash';
import { ActivePopup } from '@libs/ui/common';
import { IEntityIdentification } from '@libs/platform/common';

/**
 * Component for displaying and managing saved entity filters.
 */
@Component({
	selector: 'basics-shared-entity-filter-saved',
	templateUrl: './entity-filter-saved.component.html',
	styleUrl: './entity-filter-saved.component.scss',
})
export class BasicsSharedEntityFilterSavedComponent<TEntity extends IEntityIdentification> implements OnInit {
	/** Injected EntityFilterScope service */
	protected readonly scope = inject(EntityFilterScope<TEntity>);
	/** Injected ActivePopup service */
	protected readonly activePopup = inject(ActivePopup);

	/** Array of filter groups, each containing a header and profiles */
	public filterGroups: IFilterGroup[] = [];

	/**
	 * Initializes the component and loads saved filters.
	 * Groups the filters by access level and sets the filterGroups property.
	 */
	public async ngOnInit(): Promise<void> {
		const data = await this.scope.loadSavedFilters();

		// Group data by AccessLevel
		forEach(groupBy(data, 'AccessLevel'), (value, key) => {
			const level = Number.parseInt(key);
			let header = '';

			switch (level) {
				case EntityFilterAccessLevel.User:
					header = 'basics.material.lookup.filter.user';
					break;
				case EntityFilterAccessLevel.Role:
					header = 'basics.material.lookup.filter.role';
					break;
				case EntityFilterAccessLevel.System:
					header = 'basics.material.lookup.filter.system';
					break;
				default:
					header = 'Unknown Access Level';
			}

			this.filterGroups.push({
				header: header,
				profiles: value,
			});
		});
	}

	/**
	 * Selects a filter profile and closes the active popup.
	 *
	 * @param profile The selected filter profile.
	 */
	public select(profile: IEntityFilterProfileEntity) {
		this.activePopup.close({
			apply: true,
			value: profile
		});
	}

	/**
	 * Toggles the collapsed state of a filter group.
	 * @param filterGroup
	 */
	public toggle(filterGroup: IFilterGroup) {
		filterGroup.collapsed = !filterGroup.collapsed;
	}
}

interface IFilterGroup {
	header: string;
	profiles: IEntityFilterProfileEntity[];
	collapsed?: boolean;
}
