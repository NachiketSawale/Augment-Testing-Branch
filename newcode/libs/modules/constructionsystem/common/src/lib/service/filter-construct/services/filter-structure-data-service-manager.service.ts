import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { IfilterStructureDataServiceCreateContext } from '../model/filter-structure-interface';
import { Injectable, runInInjectionContext } from '@angular/core';
import { BasicsSharedFilterStructureDataService } from './basics-shared-filter-structure-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedFilterStructureDataServiceManager<T extends IEntityIdentification> {
	private _dataServiceCache = new Map<string, IEntitySelection<T>>();

	public createDataServiceInstance(createContext: IfilterStructureDataServiceCreateContext<T>, context: IInitializationContext) {
		const serviceInstanceId = createContext.qualifier + createContext.instanceId ?? '';
		let instance = this._dataServiceCache.get(serviceInstanceId);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new BasicsSharedFilterStructureDataService(createContext));

			this._dataServiceCache.set(serviceInstanceId, instance);
		}

		return instance;
	}
}