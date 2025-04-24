/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { IEntityFilterSearchField, IEntityFilterSearchFieldConfig, IEntityFilterSearchFieldExtension } from '../../../entity-filter';
import { MaterialFilterProfileService } from '../../services/material-filter-profile.service';
import { MaterialSearchFieldId } from '../enums';

/**
 * Extension for managing material filter search fields.
 * Implements the IEntityFilterSearchFieldExtension interface to provide search field configurations and operations.
 */
export class MaterialFilterSearchFieldExtension implements IEntityFilterSearchFieldExtension {
	/**
	 * Injected instance of MaterialFilterProfileService.
	 * @private
	 * @readonly
	 */
	private readonly svc = inject(MaterialFilterProfileService);

	/**
	 * Determines if search fields should be shown.
	 *
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if search fields should be shown.
	 */
	public async isShownSearchFields(): Promise<boolean> {
		const config = await this.svc.loadSearchConfig();
		return config?.ShowSearchIn;
	}

	/**
	 * Loads the search field configuration.
	 *
	 * @returns {Promise<IEntityFilterSearchFieldConfig>} A promise that resolves to the search field configuration.
	 */
	public async loadSearchFieldConfig(): Promise<IEntityFilterSearchFieldConfig> {
		const config = await this.svc.loadSearchFieldsConfig();
		return {
			ids: config?.SearchIn ?? [],
		};
	}

	/**
	 * Provides the list of search fields.
	 *
	 * @returns {Promise<IEntityFilterSearchField[]>} A promise that resolves to an array of search fields.
	 */
	public async provideSearchFields(): Promise<IEntityFilterSearchField[]> {
		return [
			{ id: MaterialSearchFieldId.All, description: 'basics.material.searchFields.all', selected: false, isAll: true },
			{ id: MaterialSearchFieldId.Basics, description: 'basics.material.searchFields.basics', selected: false },
			{ id: MaterialSearchFieldId.Specification, description: 'basics.material.searchFields.spec', selected: false },
		];
	}

	/**
	 * Saves the search field configuration.
	 *
	 * @param {IEntityFilterSearchFieldConfig} config - The search field configuration to save.
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the configuration was saved successfully.
	 */
	public async saveSearchFieldConfig(config: IEntityFilterSearchFieldConfig): Promise<boolean> {
		await this.svc.saveSearchFieldsConfig({
			SearchIn: config.ids as number[],
		});
		return true;
	}
}
