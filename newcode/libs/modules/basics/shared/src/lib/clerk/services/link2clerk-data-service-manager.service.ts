import { Injectable, runInInjectionContext } from '@angular/core';
import { IEntitySelection } from '@libs/platform/data-access';
import { BasicsSharedLink2ClerkDataService } from './basics-shared-clerk-data.service';
import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IBasicsClerkEntity } from '../model/basics-clerk-entity.interface';
import { ILink2ClerkDataServiceCreateContext } from '../model/link2clerk-interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedLink2clerkDataServiceManager {
	private _dataServiceCache = new Map<string, IEntitySelection<IBasicsClerkEntity>>();

	public createDataServiceInstance<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(createContext: ILink2ClerkDataServiceCreateContext<PT>, context: IInitializationContext): BasicsSharedLink2ClerkDataService<PT, PU> {
		const serviceInstanceId = createContext.qualifier + createContext.instanceId ?? '';
		let instance = this._dataServiceCache.get(serviceInstanceId);
		if (!instance) {
			instance = runInInjectionContext(
				context.injector,
				() =>
					new BasicsSharedLink2ClerkDataService<PT, PU>({
						parentService: createContext.parentServiceFn(context),
						Qualifier: createContext.qualifier,
						isParentReadonlyFn: (parentService) => {
							return !!(createContext.isParentReadonlyFn && createContext.isParentReadonlyFn(parentService, context));
						},
					}),
			);

			this._dataServiceCache.set(serviceInstanceId, instance);
		}

		return instance as BasicsSharedLink2ClerkDataService<PT, PU>;
	}

	public getDataServiceInstance<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(qualifier: string, instanceId?: string | null): BasicsSharedLink2ClerkDataService<PT, PU> {
		return this._dataServiceCache.get(qualifier + instanceId ?? '') as BasicsSharedLink2ClerkDataService<PT, PU>;
	}
}
