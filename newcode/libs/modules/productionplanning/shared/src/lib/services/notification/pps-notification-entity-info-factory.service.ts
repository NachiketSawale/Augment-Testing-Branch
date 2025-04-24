import { EntityInfo } from '@libs/ui/business-base';

import { IEntitySelection } from '@libs/platform/data-access';
import { IPpsNotificationEntityInfoOptions } from '../../model/notification/pps-notification-entity-info-options.interface';
import { runInInjectionContext } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { ProductionplanningSharedNotificationDataService } from './pps-notification-data-service';
import { PpsNotificationLayoutService } from './pps-notification-layout.service';
import { PpsNotificationGridBehavior } from './pps-notification-grid-behavior.service';
import { IPpsNotificationEntity } from '../../model/notification/pps-notification-entity.interface';

export class ProductionplanningShareNotificationEntityInfoFactory {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsNotificationEntity>>();

	public static getDataService<PT extends object, PU extends object>(
		options: IPpsNotificationEntityInfoOptions<PT>,
		context: IInitializationContext,
	) {
		const key = options.containerUuid;
		let instance = ProductionplanningShareNotificationEntityInfoFactory._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProductionplanningSharedNotificationDataService<PT, PU>({ apiUrl: options.apiUrl, parentService: options.parentServiceFn(context) }));
			ProductionplanningShareNotificationEntityInfoFactory._dataServiceCache.set(key, instance);
		}
		return instance;
	}

	public static create<PT extends object, PU extends object>(options: IPpsNotificationEntityInfoOptions<PT>): EntityInfo {
		return EntityInfo.create<IPpsNotificationEntity>({
			grid: {
				title: options.gridTitle,
				behavior: ctx => ctx.injector.get(PpsNotificationGridBehavior)
			},
			dataService: (ctx) => {
				return ProductionplanningShareNotificationEntityInfoFactory.getDataService<PT, PU>(options, ctx);
			},
			dtoSchemeId: { moduleSubModule: 'Basics.Common', typeName: 'PpsNotificationDto' },
			layoutConfiguration: ctx => ctx.injector.get(PpsNotificationLayoutService).generateLayout(),
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['productionplanning.common']),
					// other promises...
				]);
			},

		});
	}

}

/* to be added into Transport module
transportplanning-transport-notification-entity-info.model.ts

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareNotificationEntityInfoFactory } from '@libs/productionplanning/shared';
import { TransportplanningTransportDataService } from '../services/transportplanning-transport-data.service';
import { ITrsRouteEntity } from './entities/trs-route-entity.interface';
import { TrsRouteComplete } from './entities/trs-route-complete.class';

export const TRANSPORTPLANNING_TRANSPORT_NOTIFICATION_ENTITY_INFO: EntityInfo = ProductionplanningShareNotificationEntityInfoFactory.create<ITrsRouteEntity, TrsRouteComplete>({
	apiUrl: 'transportplanning/transport/route/',
	permissionUuid: 'a78a23e2b050418cb19df541ab9bf028',
	containerUuid: '2293102b42284cb5bd1b538fdf2ae90a',
	gridTitle: { key: 'transportplanning.transport.notificationListTitle', text: '*Transport Route: Notifications' },
	parentServiceFn: (ctx) => {
		return ctx.injector.get(TransportplanningTransportDataService);
	},
});

*/