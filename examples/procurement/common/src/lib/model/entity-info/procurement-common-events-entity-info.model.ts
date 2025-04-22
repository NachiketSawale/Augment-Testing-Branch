/*
 * Copyright(c) RIB Software GmbH
 */

import {ProviderToken} from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {EntityInfo, IEntityContainerBehavior, IFormContainerLink, IGridContainerLink} from '@libs/ui/business-base';
import { IProcurementCommonEventsEntity } from '../entities/procurement-common-events-entity.interface';
import { ProcurementCommonEventsDataService } from '../../services/procurement-common-events-data.service';
import { ProcurementCommonEventsLayoutService } from '../../services/procurement-common-events-layout.service';
import { ProcurementCommonEventsGridBehavior } from '../../behaviors/procurement-common-events-grid-behavior.service';
import { ProcurementCommonEventsFormBehavior } from '../../behaviors/procurement-common-events-form-behavior.service';

/**
 * Procurement common Events entity info helper
 */
export class ProcurementCommonEventsEntityInfo {

	/**
	 * Create a real procurement Events entity info configuration for different modules
	 */
	public static create<T extends IProcurementCommonEventsEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * container uuid
		 */
		containerUuid:string,
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string,
		/**
		 * Form uuid in lower case
		 */
		formUuid: string;
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<ProcurementCommonEventsDataService<T,PT, PU>>,
		/**
		 * Gird Container behavior
		 */
		behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
		/**
		 * Form Container behavior
		 */
		behaviorForm?: ProviderToken<IEntityContainerBehavior<IFormContainerLink<T>, T>>,
		/**
		 * Customize layout service by extending ProcurementCommon Events LayoutService
		 * Default is ProcurementCommon Events LayoutService
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonEventsLayoutService>
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: {text: 'Procurement Events', key: 'cloud.common.event.eventGridTitle'},
				containerUuid: config.containerUuid,
				behavior:context => context.injector.get(config.behaviorGrid ?? ProcurementCommonEventsGridBehavior)
			},
			form: {
				containerUuid: config.formUuid,
				title: {text: 'Procurement Events Detail', key: 'cloud.common.event.eventFormTitle'},
				behavior:context => context.injector.get(config.behaviorForm ?? ProcurementCommonEventsFormBehavior)
			},
			dataService: context => context.injector.get(config.dataServiceToken),
			dtoSchemeId: {moduleSubModule: 'Procurement.Package', typeName: 'PrcPackageEventDto'},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(ProcurementCommonEventsLayoutService).generateConfig();
			}
		});
	}
}