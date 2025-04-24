/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IBasicsCostGroupCache, IBasicsCustomizeProjectCatalogConfigurationInterface } from '../model/interfaces/basics-cost-group-catalog-configuration.interface';
import { CostGroupCompleteEntity } from '../model/entities/cost-group-complete-entity.class';

export class BasicsSharedCostGroupCatalogConfigService {
	protected readonly configService: PlatformConfigurationService;
	protected readonly http: HttpClient;

	private projectId = -1;
	private moduleType = '';
	private hasLoadCostGroupCats = false;

	private configCacheOfModule: IBasicsCostGroupCache[] = [];
	private configCacheOfProject: IBasicsCostGroupCache[] = [];
	private configCacheOfCustomize: IBasicsCostGroupCache[] = [];

	public constructor(configService: PlatformConfigurationService, http: HttpClient, moduleType: string, projectId: number) {
		this.http = http;
		this.configService = configService;
		this.moduleType = moduleType;
		this.projectId = projectId;
	}

	private getConfigCache(): IBasicsCostGroupCache | undefined {
		let cache: IBasicsCostGroupCache | undefined;

		if (this.moduleType === 'Project') {
			cache = _.find(this.configCacheOfProject, { key: this.projectId.toString() });
		} else if (this.moduleType === 'Customize') {
			cache = _.find(this.configCacheOfCustomize, { key: this.projectId.toString() });
		} else {
			cache = _.find(this.configCacheOfModule, { key: this.moduleType });
		}

		return cache;
	}

	private async getConfiguration(ConfigModuleName: string) {
		let target: IBasicsCostGroupCache | undefined = this.getConfigCache();

		if (!target) {
			target = {
				key: this.moduleType === 'Project' || this.moduleType === 'Customize' ? this.projectId.toString() : this.moduleType,
			};
		}

		// todo: implement basicCostGroupCatalogByLineItemContextLookupDataService
		// if (this.moduleType === 'Customize') {
		// 	$injector.get('basicCostGroupCatalogByLineItemContextLookupDataService').setLineItemContextId(lineitemcontextFk);
		// }

		const config = (await firstValueFrom(
			this.http.post(this.configService.webApiBaseUrl + 'basics/customize/projectcatalogconfiguration/getconfiguration', {
				ModuleType: this.moduleType,
				ProjectId: this.projectId,
			}),
		)) as IBasicsCustomizeProjectCatalogConfigurationInterface;

		const costGroupCats = (await firstValueFrom(
			this.http.post(this.configService.webApiBaseUrl + 'basics/costgroupcat/listbyconfig', {
				ConfigModuleName: ConfigModuleName,
				ConfigModuleType: this.moduleType,
				ProjectId: this.projectId,
			}),
		)) as CostGroupCompleteEntity;

		target.configuration = config.Configuration;
		target.configurationType = config.Type;
		target.configurationAssign = config.Assignments;
		target.licCostGroupCats = costGroupCats.LicCostGroupCats;
		target.prjCostGroupCats = costGroupCats.PrjCostGroupCats;

		return target;
	}

	private resetConfigCache() {
		this.configCacheOfProject = [];
		this.configCacheOfCustomize = [];
		this.configCacheOfModule = [];
	}

	public clear() {
		this.resetConfigCache();
		this.hasLoadCostGroupCats = false;
	}

	public async loadConfig(configModuleName: string) {
		const cache: IBasicsCostGroupCache | undefined = this.getConfigCache();

		if (cache) {
			return cache;
		}

		const newCache = await this.getConfiguration(configModuleName);
		if (this.moduleType === 'Project') {
			this.configCacheOfProject.push(newCache);
		} else if (this.moduleType === 'Customize') {
			this.configCacheOfCustomize.push(newCache);
		} else {
			this.configCacheOfModule.push(newCache);
		}

		return newCache;
	}

	public async initialize(projectFk: number, ConfigModuleName: string) {
		this.clear();
		if (projectFk) {
			this.projectId = projectFk;
		}
		await this.loadConfig(ConfigModuleName);
	}

	public setProjectId(value: number) {
		this.projectId = value;
	}
}
