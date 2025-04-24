/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { IPrcGeneralsEntity } from '../entities/prc-generals-entity.interface';
import { ProcurementCommonGeneralsDataService } from '../../services/procurement-common-generals-data.service';
import { ProcurementCommonGeneralsLayoutService } from '../../services/procurement-common-generals-layout.service';
import { ProcurementCommonGeneralsValidationService } from '../../services';

/**
 * Procurement common Generals entity info helper
 */
export class ProcurementCommonGeneralsEntityInfo {
	/**
	 * Create a real procurement Generals entity info configuration for different modules
	 */
	public static create<T extends IPrcGeneralsEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
		dataServiceToken: ProviderToken<ProcurementCommonGeneralsDataService<T, PT, PU>>;
		/**
		 * module SubModule
		 */
		moduleSubModule?: string;
		/**
		 * Type Name
		 */
		typeName?: string;
		/**
		 * Layout
		 */
		layout?: object;
		/**
		 * Customize layout service by extending ProcurementCommonGeneralsLayoutService
		 * Default is ProcurementCommonGeneralsLayoutService
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonGeneralsLayoutService>;
		validationServiceToken: ProviderToken<ProcurementCommonGeneralsValidationService<T, PT, PU>>;
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: { text: 'Generals', key: 'procurement.common.general.generalsContainerGridTitle' },
			},
			form: {
				containerUuid: config.formUuid,
				title: { text: 'General Detail', key: 'procurement.common.general.generalsContainerFormTitle' },
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			validationService: (context) => context.injector.get(config.validationServiceToken),
			dtoSchemeId: { moduleSubModule: config.moduleSubModule ?? 'Procurement.Common', typeName: config.typeName ?? 'PrcGeneralsDto' },
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(config.layoutServiceToken ?? ProcurementCommonGeneralsLayoutService).generateLayout(context, {
					dataServiceToken: config.dataServiceToken,
				});
			},
		});
	}
}
