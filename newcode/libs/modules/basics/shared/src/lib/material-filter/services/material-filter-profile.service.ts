/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IMaterialFilterProfile, IMaterialSearchConfig, IMaterialSearchFieldsConfig } from '../model';

/**
 * Service for managing material filter profiles.
 * Provides methods to load and save search field configurations and search settings.
 */
@Injectable({
	providedIn: 'root',
})
export class MaterialFilterProfileService {
	/**
	 * Base URL for material filter profile API endpoints.
	 * @private
	 * @readonly
	 */
	private readonly baseUrl = 'basics/material/';

	/**
	 * Name of the filter used in API requests.
	 * @private
	 * @readonly
	 */
	private readonly filterName = 'searchProfile';

	/**
	 * Injected instance of PlatformHttpService for making HTTP requests.
	 * @private
	 * @readonly
	 */
	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Loads the search fields configuration from the server.
	 *
	 * @returns {Promise<IMaterialSearchFieldsConfig | undefined>} The search fields configuration, or undefined if not found.
	 */
	public async loadSearchFieldsConfig() {
		const data = await this.httpService.get<IMaterialFilterProfile>(`${this.baseUrl}getmaterialdefinitions`, {
			params: {
				filterName: this.filterName,
			},
		});

		if (!data) {
			return;
		}

		return JSON.parse(data.FilterDef) as IMaterialSearchFieldsConfig;
	}

	/**
	 * Saves the search fields configuration to the server.
	 *
	 * @param {IMaterialSearchFieldsConfig} config - The search fields configuration to save.
	 * @returns {Promise<void>} A promise that resolves when the configuration is saved.
	 */
	public async saveSearchFieldsConfig(config: IMaterialSearchFieldsConfig) {
		return this.httpService.post(`${this.baseUrl}savematerialdefinition`, {
			FilterName: this.filterName,
			AccessLevel: 'User',
			FilterDef: JSON.stringify(config),
		});
	}

	/**
	 * Loads the search configuration from the server.
	 *
	 * @returns {Promise<IMaterialSearchConfig>} The search configuration.
	 */
	public async loadSearchConfig() {
		return this.httpService.get<IMaterialSearchConfig>(`${this.baseUrl}searchsetting`);
	}
}
