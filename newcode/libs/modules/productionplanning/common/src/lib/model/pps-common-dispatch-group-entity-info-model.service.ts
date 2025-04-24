/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { Injectable, runInInjectionContext } from '@angular/core';
import { IPpsCommonDispatchGroupEntity } from './entities/pps-common-dispatch-group-entity.interface';
import { PpsCommonDispatchGroupDataFactory } from '../services/pps-common-dispatch-group-factory.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class PpsCommonDispatchGroupEntityInfoModelFactory {

	private cacheMap: Map<string, EntityInfo> = new Map();

	public getInstance(moduleName: string, listUuid: string): EntityInfo {
		let instance = this.cacheMap.get(moduleName);
		if (!instance) {
			instance = this.getEntityInfoModel();
			this.cacheMap.set(moduleName, instance);
		}
		return instance;
	}

	public constructor(
		private _moduleName: string,
		private _listUuid: string
	) {
	}

	private getEntityInfoModel(): EntityInfo {
		return EntityInfo.create<IPpsCommonDispatchGroupEntity>({
			grid: {
				title: { key: 'productionplanning.fabricationunit.listTitle' },
				containerUuid: this._listUuid,
			},
			dataService: ctx => runInInjectionContext(ctx.injector, () => {
				return PpsCommonDispatchGroupDataFactory.getInstance(this._moduleName);
			}),
			dtoSchemeId: { moduleSubModule: this._moduleName, typeName: 'BasicsCustomizeLogisticsDispatcherGroupDTO' },
			permissionUuid: '73689e2842f6436b9465ff71d79aea80',
			layoutConfiguration: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['DescriptionInfo']
					}
				],
				overloads: {},
				labels: {
					...prefixAllTranslationKeys('cloud.common.', {
						DescriptionInfo: {key: 'entityDescription', text: 'Description'},
					}),}
			}
		});
	}
}