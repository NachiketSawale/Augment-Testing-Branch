/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { CompositeGridConfigurationToken, CompositeGridContainerComponent, EntityInfo, IEntityContainerBehavior, IFormContainerLink, IGridContainerLink } from '@libs/ui/business-base';
import { IProcurementCommonDeliveryScheduleEntity } from '../entities/procurement-common-deliveryschedule-entity.interface';
import { ProcurementCommonDeliveryScheduleDataService } from '../../services/procurement-common-deliveryschedule-data.service';
import { ProcurementCommonDeliveryscheduleLayoutService } from '../../services/procurement-common-deliveryschedule-layout.service';
import { ProcurementCommonDeliveryScheduleContainerComponent } from '../../components/procurement-common-delivery-schedule-container/procurement-common-delivery-schema-container.component';
import { ProcurementCommonDataServiceToken } from '../../components/grid-composite-base/grid-composite-base.component';
import { ProcurementCommonDeliveryScheduleFormBehavior } from '../../behaviors/procurement-common-delivery-schedule-form-behavior.service';
import { ProcurementCommonDeliveryScheduleGridBehavior } from '../../behaviors/procurement-common-delivery-schedule-grid-behavior.service';

/**
 * Procurement common DeliverySchedule entity info helper
 */
export class ProcurementCommonDeliveryscheduleEntityInfo {
	/**
	 * Create a real procurement DeliverySchedule entity info configuration for different modules
	 */
	public static create<T extends IProcurementCommonDeliveryScheduleEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string;
		/**
		 * Form uuid in lower case
		 */
		formUuid: string;
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<ProcurementCommonDeliveryScheduleDataService<T, PT, PU>>;
		/**
		 * Customize layout service by extending ProcurementCommon DeliverySchedule LayoutService
		 * Default is ProcurementCommon DeliverySchedule LayoutService
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonDeliveryscheduleLayoutService>;
		/**
		 * Gird Container behavior
		 */
		behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
		/**
		 * Form Container behavior
		 */
		behaviorForm?: ProviderToken<IEntityContainerBehavior<IFormContainerLink<T>, T>>,
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Delivery Schedules', key: 'procurement.common.delivery.deliveryScheduleContainerGridTitle' },
				containerType: CompositeGridContainerComponent,
				providers: (ctx) => [
					{
						provide: CompositeGridConfigurationToken,
						useValue: {
							maxTopLeftLength: 150,
							topLeftContainerType: ProcurementCommonDeliveryScheduleContainerComponent,
							providers: [
								{
									provide: ProcurementCommonDataServiceToken,
									useValue: config.dataServiceToken,
								},
							],
						},
					},
				],
				behavior:context => context.injector.get(config.behaviorGrid ?? ProcurementCommonDeliveryScheduleGridBehavior)
			},
			form: {
				containerUuid: config.formUuid,
				title: { text: 'Delivery Schedule Detail', key: 'procurement.common.delivery.deliveryScheduleContainerFormTitle' },
				behavior:context => context.injector.get(config.behaviorForm ?? ProcurementCommonDeliveryScheduleFormBehavior)
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'PrcItemdeliveryDto' },
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(ProcurementCommonDeliveryscheduleLayoutService).generateConfig();
			},
		});
	}
}
