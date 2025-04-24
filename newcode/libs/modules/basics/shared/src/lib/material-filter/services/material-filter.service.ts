/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { Injectable, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IMaterialFilterInput, IMaterialFilterOutput } from '../model';
import { IMaterialSearchEntity } from '../../material-search';
import { IEntityFilterDefinition, IEntityFilterListItem, IEntityFilterProfileEntity } from '../../entity-filter';

/**
 * Service to handle material filter
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedMaterialFilterService {
	private readonly urlBase = 'basics/material/filter/';
	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Get filter definitions
	 */
	public async getFilterDefs(): Promise<IEntityFilterDefinition[]> {
		return this.httpService.get(this.urlBase + 'definitions');
	}

	/**
	 * Execute filter
	 * @param payload
	 */
	public async executeFilter(payload: IMaterialFilterInput): Promise<IMaterialFilterOutput> {
		return await this.httpService.post<IMaterialFilterOutput>(this.urlBase + 'execute', payload);
	}

	/**
	 * Loads display items for a given filter definition.
	 *
	 * @param definition - The material filter definition.
	 * @param missingFactors - The factors that are missing for the filter.
	 * @returns A promise that resolves with the display items.
	 */
	public async loadDisplayItems(definition: IEntityFilterDefinition, missingFactors: unknown[]): Promise<IEntityFilterListItem[]> {
		return this.httpService.post(this.urlBase + 'filterItems', {
			FilterId: definition.Id,
			FilterFactors: missingFactors,
			FilterTableName: get(definition.ListEndpoint?.Payload, 'TableName'),
		});
	}

	/**
	 * Loads saved filters.
	 *
	 * @returns {Promise<IEntityFilterProfileEntity[]>} A promise that resolves with the saved filter profiles.
	 */
	public async loadSavedFilters(): Promise<IEntityFilterProfileEntity[]> {
		return this.httpService.get(this.urlBase + 'load');
	}

	/**
	 * Get initialization material
	 * @param materialId
	 */
	public async getInitialData(materialId: number) {
		return this.httpService.post<{ Materials: IMaterialSearchEntity[] }>('basics/material/commoditysearch/initialnew', {
			MaterialId: materialId,
		});
	}

	/**
	 * Save filter profile
	 * @param profile
	 */
	public async saveFilterProfile(profile: IEntityFilterProfileEntity): Promise<boolean> {
		return this.httpService.post(this.urlBase + 'save', profile);
	}
}
