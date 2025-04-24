/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, runInInjectionContext } from '@angular/core';
import { BasicsSharedRoundingService } from '../services/basics-shared-rounding.service';
import { ServiceLocator } from '@libs/platform/common';
import { IConfigDetail } from '../model/interfaces/round-config.interface';

@Injectable({providedIn: 'root'})
export class BasicsSharedRoundingFactoryService {
	private static serviceMap: Map<string, BasicsSharedRoundingService<IConfigDetail>> = new Map();


	public static getService(moduleName: string, configId?: number): BasicsSharedRoundingService<IConfigDetail> {
		const cacheKey = configId ? `rounding.${moduleName}.${configId}` : `rounding.${moduleName}`;
		let instance = this.serviceMap.get(cacheKey);
		if (!instance) {
			instance = runInInjectionContext(ServiceLocator.injector,
				() => new BasicsSharedRoundingService(moduleName, configId));

			this.serviceMap.set(cacheKey, instance);
		}
		return instance;
	}

}