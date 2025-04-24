/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import { ICostGroupCatalogConfigCache } from '../model/interfaces/cost-group-catalog-config-cache.interface';
import { BasicsSharedCostGroupCatalogConfigService } from './basics-shared-cost-group-catalog-config.service';
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';

/**
 * from
 */
@Injectable({
	providedIn: 'root',
})
export class IBasicsSharedCostGroupCatalogConfigDataService {
	private cache: ICostGroupCatalogConfigCache[] = [];

	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly http = inject(HttpClient);

	private getCostGroupCatalogServiceByModule(moduleType: string, projectId: number) {
		const cacheKey = projectId ? moduleType + '_' + projectId : moduleType;
		let cache = _.find(this.cache, { key: cacheKey });

		if (!cache) {
			cache = {
				key: cacheKey,
				service: new BasicsSharedCostGroupCatalogConfigService(this.configService, this.http, moduleType, projectId),
			};

			this.cache.push(cache);
		}

		return cache.service;
	}

	public getProjectCostGroupCatalogService(projectId: number) {
		return this.getCostGroupCatalogServiceByModule('Project', projectId);
	}

	public getConstructionSystemCostGroupCatalogService(projectId: number) {
		return this.getCostGroupCatalogServiceByModule('ConstructionSystem', projectId);
	}

	public getMaterialCostGroupCatalogService(projectId: number) {
		return this.getCostGroupCatalogServiceByModule('Material', projectId);
	}

	public getActivityCriteriaCostGroupCatalogService(projectId: number) {
		return this.getCostGroupCatalogServiceByModule('ActivityCriteria', projectId);
	}

	public getEmployeeCostGroupCatalogService(projectId: number) {
		return this.getCostGroupCatalogServiceByModule('Employee', projectId);
	}

	public getCustomizeCostGroupCatalogService(projectId: number) {
		return this.getCostGroupCatalogServiceByModule('Customize', projectId);
	}
}
