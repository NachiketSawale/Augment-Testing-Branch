import { Injectable, runInInjectionContext } from '@angular/core';
import { IEntitySelection } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsSharedLink2MeetingDataService } from './basics-shared-meeting-data.service';
import { ILink2MeetingEntityInfoBehaviorOptions, ILink2MeetingEntityInfoOptions } from '../model/link2meeting-options.interface';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsSharedMeetingBehavior } from './basics-shared-meeting-behavior.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedLink2MeetingDataServiceManager {
	private static _dataServiceCache = new Map<string, IEntitySelection<IMtgHeaderEntity>>();
	private static _behaviorCache = new Map<string, IEntityContainerBehavior<IGridContainerLink<IMtgHeaderEntity>, IMtgHeaderEntity>>();

	/**
	 * Retrieve the data service from cache first, if not found, create the data service.
	 * @param createContext Entity Info Options
	 * @param context IInitializationContext
	 * @return data service.
	 */
	public static getDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(createContext: ILink2MeetingEntityInfoOptions<PT>, context: IInitializationContext) {
		const uuid = createContext.containerUuid || createContext.permissionUuid;
		let instance = BasicsSharedLink2MeetingDataServiceManager.getDataServiceFromCache(uuid);
		if (!instance) {
			instance = runInInjectionContext(
				context.injector,
				() =>
					new BasicsSharedLink2MeetingDataService<PT, PU>({
						sectionId: createContext.sectionId,
						parentService: createContext.parentServiceFn(context),
						isParentFnOverride: createContext.isParentFn,
						isParentReadonlyFn: (parentService) => {
							return !!(createContext.isParentReadonlyFn && createContext.isParentReadonlyFn(parentService, context));
						},
					}),
			);

			this._dataServiceCache.set(uuid, instance);
		}

		return instance as BasicsSharedLink2MeetingDataService<PT, PU>;
	}

	/**
	 * Retrieve the behavior service from cache first, if not found, create the behavior service.
	 * @param options Entity Info Options
	 * @param context IInitializationContext
	 * @return data service.
	 */
	public static getBehavior<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(
		options: ILink2MeetingEntityInfoOptions<PT>,
		context: IInitializationContext,
	) {
		const uuid = options.containerUuid || options.permissionUuid;
		let instance = BasicsSharedLink2MeetingDataServiceManager.getBehaviorFromCache(uuid);

		if (!instance) {
			const dataService = BasicsSharedLink2MeetingDataServiceManager.getDataService<PT, PU>(options, context);
			const behaviorOptions: ILink2MeetingEntityInfoBehaviorOptions<PT> = {
				sectionId: options.sectionId,
				dataService: dataService,
				parentService: options.parentServiceFn(context),
				isParentReadonlyFn: (parentService) => {
					return !!(options.isParentReadonlyFn && options.isParentReadonlyFn(parentService, context));
				},
			};
			instance = runInInjectionContext(context.injector, () => new BasicsSharedMeetingBehavior<PT>(behaviorOptions));
			BasicsSharedLink2MeetingDataServiceManager._behaviorCache.set(uuid, instance);
		}
		return instance;
	}

	/**
	 * Retrieve the data service from cache according to the container uuid.
	 * @param uuid containerUuid
	 * @return data service.
	 */
	public static getDataServiceFromCache(uuid: string) {
		return BasicsSharedLink2MeetingDataServiceManager._dataServiceCache.get(uuid);
	}

	/**
	 * Retrieve the behavior service from cache according to the container uuid.
	 * @param uuid containerUuid
	 */
	public static getBehaviorFromCache(uuid: string) {
		return BasicsSharedLink2MeetingDataServiceManager._behaviorCache.get(uuid);
	}

}
