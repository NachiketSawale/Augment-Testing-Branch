/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ProviderToken } from '@angular/core';
import { IEntitySchemaId } from '@libs/platform/data-access';
import { ProcurementCommonTotalDataService, ProcurementCommonTotalLayoutService, ProcurementCommonTotalValidationService } from '../../services';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * Procurement common total entity info helper
 */
export class ProcurementCommonTotalEntityInfo {
	/**
	 * Create a real procurement total entity info configuration for different modules
	 */
	public static create<T extends IPrcCommonTotalEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
		dataServiceToken: ProviderToken<ProcurementCommonTotalDataService<T, PT, PU>>;
		/**
		 * Validation service
		 */
		validationServiceToken: ProviderToken<ProcurementCommonTotalValidationService<T, PT, PU>>;
		/**
		 * Dto Scheme Config
		 */
		dtoSchemeConfig: IEntitySchemaId;
		/**
		 * Container behavior
		 */
		behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>;
		/**
		 * Customize layout service by extending ProcurementCommonTotalLayoutService
		 * Default is ProcurementCommonTotalLayoutService
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonTotalLayoutService>;
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Total', key: 'procurement.common.total.totalContainerGridTitle' },
				behavior: config.behavior ? (context) => context.injector.get(config.behavior!) : undefined,
			},
			form: {
				containerUuid: config.formUuid,
				title: { text: 'Total Detail', key: 'procurement.common.total.totalContainerFormTitle' },
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			validationService: (context) => context.injector.get(config.validationServiceToken),
			dtoSchemeId: config.dtoSchemeConfig,
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(config.layoutServiceToken ?? ProcurementCommonTotalLayoutService).generateLayout({
					dataServiceToken: config.dataServiceToken,
				});
			},
		});
	}
}
