/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntitySelection, IParentRole } from '@libs/platform/data-access';
import { IPPSEventEntity, IPpsEventParentComplete, IPpsEventParentEntity, IPpsEventParentService } from '@libs/productionplanning/shared';
import { PpsCommonEventDataService } from './pps-common-event-data.service';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { PpsCommonEventBehavior } from '../../behaviors/pps-common-event-behavior.service';

export abstract class PpsCommonEventDataServiceFactory {
	private static DataServiceCache = new Map<IPpsEventParentService, IEntitySelection<IPPSEventEntity>>();

	private static BehaviorCache = new Map<IPpsEventParentService, IEntityContainerBehavior<IGridContainerLink<IPPSEventEntity>, IPPSEventEntity>>();

	public static GetDataService<PT extends IPpsEventParentEntity, PU extends IPpsEventParentComplete<PT>>(parentService: IParentRole<PT, PU> & IEntitySelection<PT> & IPpsEventParentService): IEntitySelection<IPPSEventEntity> {
		let targetService = this.DataServiceCache.get(parentService);
		if (!targetService) {
			targetService = new PpsCommonEventDataService(parentService);
			this.DataServiceCache.set(parentService, targetService);
		}
		return targetService;
	}

	public static GetBehavior<PT extends IPpsEventParentEntity, PU extends IPpsEventParentComplete<PT>>(
		parentService: IParentRole<PT, PU> & IEntitySelection<PT> & IPpsEventParentService,
	): IEntityContainerBehavior<IGridContainerLink<IPPSEventEntity>, IPPSEventEntity> {
		let targetBehavior = this.BehaviorCache.get(parentService);
		if (!targetBehavior) {
			targetBehavior = new PpsCommonEventBehavior();
			this.BehaviorCache.set(parentService, targetBehavior);
		}
		return targetBehavior;
	}
}
