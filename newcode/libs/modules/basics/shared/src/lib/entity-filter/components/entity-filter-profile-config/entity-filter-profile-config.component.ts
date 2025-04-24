/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, ViewEncapsulation } from '@angular/core';
import { EntityFilterAccessLevel, EntityFilterScope } from '../../model';
import { ActivePopup, FieldType, IAdditionalSelectOptions, IAdditionalStringOptions } from '@libs/ui/common';
import { IEntityIdentification } from '@libs/platform/common';

/**
 * Component for displaying and managing saved entity filters.
 */
@Component({
	selector: 'basics-shared-entity-filter-profile-config',
	templateUrl: './entity-filter-profile-config.component.html',
	styleUrl: './entity-filter-profile-config.component.scss',
	encapsulation: ViewEncapsulation.None,
})
export class BasicsSharedEntityFilterProfileConfigComponent<TEntity extends IEntityIdentification> {
	protected readonly activePopup = inject(ActivePopup);
	/** Injected EntityFilterScope service */
	protected readonly scope = inject(EntityFilterScope<TEntity>);

	protected readonly currentProfile = {
		...this.scope.currentProfile,
	};

	protected filterNameOptions: IAdditionalStringOptions = {
		placeholder: {
			key: 'basics.material.lookup.filter.name',
		},
	};

	protected accessLevelOptions: IAdditionalSelectOptions = {
		itemsSource: {
			items: [
				{
					id: EntityFilterAccessLevel.User,
					displayName: 'basics.material.lookup.filter.user',
				},
				{
					id: EntityFilterAccessLevel.Role,
					displayName: 'basics.material.lookup.filter.role',
				},
				{
					id: EntityFilterAccessLevel.System,
					displayName: 'basics.material.lookup.filter.system',
				},
			],
		},
	};

	protected async save() {
		this.scope.currentProfile = this.currentProfile;
		const success = await this.scope.saveFilters();
		this.scope.currentProfile.IsNew = !success;

		this.activePopup.close({
			apply: true,
			value: success,
		});
	}

	protected readonly FieldType = FieldType;
}
