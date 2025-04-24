/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	FieldType,
	ILookupConfig,
	ILookupEndpointConfig,
	LookupSearchResponse,
	UiCommonLookupEndpointDataService
} from '@libs/ui/common';
import {Injectable, runInInjectionContext} from '@angular/core';
import {ServiceLocator} from '@libs/platform/common';
import {IBoqHeaderLookupEntity} from '@libs/boq/main';

export interface IBoqHeaderLookupFilter {
	boqType: number;
	projectId?: number;
	boqGroupId?: number;
	boqFilterWicGroupIds?: number[],
	prcStructureId?: number;
	packageIds?: number[];
	selectedProject?: {
		ProjectName: string;
	},
	selectedWicGroup?: {
		DescriptionInfo: {
			Translated: string;
		}
	},
	selectedPrcStructure?: {
		DescriptionInfo: {
			Translated: string;
		}
	},
	filterDisabled?: boolean;
	prcBoqsReference?: string[];
	prcHeaderFk?: number;
	filterCrbBoqs?: boolean;
	contractIds?: number[];
}

@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonMasterRestrictionBoqHeaderLookupServiceProvider<TEntity extends object> {

	private cache: Map<string, UiCommonLookupEndpointDataService<IBoqHeaderLookupEntity, TEntity>> = new Map<string, UiCommonLookupEndpointDataService<IBoqHeaderLookupEntity, TEntity>>();

	public get defaultFilter(): IBoqHeaderLookupFilter {
		return {
			boqType: 0,
			projectId: 0,
			boqGroupId: 0,
			boqFilterWicGroupIds: [],
			prcStructureId: 0,
			packageIds: [],
			selectedProject: {
				ProjectName: ''
			},
			selectedWicGroup: {
				DescriptionInfo: {Translated: ''}
			},
			selectedPrcStructure: {
				DescriptionInfo: {Translated: ''}
			},
			filterDisabled: false,
			prcBoqsReference: [],
			prcHeaderFk: 0,
			filterCrbBoqs: false,
			contractIds: []
		};
	}

	private get defaultEndpoint(): ILookupEndpointConfig<IBoqHeaderLookupEntity, TEntity> {
		return {
			httpRead: {
				route: 'boq/main/',
				endPointRead: 'getboqheaderlookup',
			},
		};
	}

	private get defaultConfig(): ILookupConfig<IBoqHeaderLookupEntity, TEntity> {
		return {
			uuid: 'd3dd6cab154c474d85c562b18c63fd95',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'BoqNumber',
			gridConfig: {
				uuid: 'd3dd6cab154c474d85c562b18c63fd95',
				columns: [
					{
						id: 'BoqNumber',
						model: 'BoqNumber',
						type: FieldType.Code,
						label: 'boq.main.boqNumber',
						sortable: true,
					},
					{
						id: 'description',
						model: 'Description',
						type: FieldType.Description,
						label: 'cloud.common.entityDescription',
						sortable: true,
					},
				],
			},
		};
	}

	public createLookup(qualifier: string, defaultSearchFilterKey?: object, customConfig?: Omit<ILookupEndpointConfig<IBoqHeaderLookupEntity, TEntity>, 'httpRead'>):
		UiCommonLookupEndpointDataService<IBoqHeaderLookupEntity, TEntity> {
		if (this.cache.has(qualifier)) {
			return this.cache.get(qualifier)!;
		}
		let endpoint = this.defaultEndpoint;
		const config = this.defaultConfig;
		if (customConfig) {
			endpoint = {
				...endpoint,
				...customConfig
			};
		}
		const lookupService = runInInjectionContext(ServiceLocator.injector, () => {
			return new UiCommonLookupEndpointDataService(endpoint, config);
		});

		if (defaultSearchFilterKey) {
			const key = JSON.stringify(defaultSearchFilterKey);
			const response = new LookupSearchResponse([]);
			lookupService.cache.setSearchList(key, response);
			this.cache.set(qualifier, lookupService);
		}

		lookupService.dataProcessors.push({
			processItem: (item: IBoqHeaderLookupEntity) => {
				item.Id = item.BoqHeaderFk;
				item.BoqHeaderFk = null;
			}
		});
		return lookupService;
	}
}