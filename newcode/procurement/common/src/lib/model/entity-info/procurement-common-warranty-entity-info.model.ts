/*
 * Copyright(c) RIB Software GmbH
 */

import {ProviderToken} from '@angular/core';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {EntityInfo} from '@libs/ui/business-base';
import { ProcurementCommonWarrantyLayoutService } from '../../services/procurement-common-warranty-layout.service';
import { ProcurementCommonWarrantyDataService } from '../../services/procurement-common-warranty-data.service';
import { ProcurementCommonWarrantyValidationService } from '../../services/procurement-common-warranty-validation.service';
import { IPrcWarrantyEntity } from '../entities';

/**
 * Procurement common Warranty entity info helper
 */
export class ProcurementCommonWarrantyEntityInfo {

	/**
	 * Create a real procurement Warranty entity info configuration for different modules
	 */
	public static create<T extends IPrcWarrantyEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
		dataServiceToken: ProviderToken<ProcurementCommonWarrantyDataService<T, PT, PU>>,
		/**
		 * Validation service
		 */
		validationServiceToken: ProviderToken<ProcurementCommonWarrantyValidationService<T, PT, PU>>
		/**
		 * Customize layout service by extending ProcurementCommon Warranty LayoutService
		 * Default is ProcurementCommon Warranty LayoutService
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonWarrantyLayoutService>
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: {text: 'Warranty', key: 'procurement.common.warranty.warrantyContainerGridTitle'},
			},
			form: {
				containerUuid: config.formUuid,
				title: {text: 'Warranty Detail', key: 'procurement.common.warranty.warrantyContainerDetailTitle'},
			},
			dataService: context => context.injector.get(config.dataServiceToken),
			validationService: context => context.injector.get(config.validationServiceToken),
			dtoSchemeId: {moduleSubModule: 'Procurement.Common', typeName: 'PrcWarrantyDto'},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(ProcurementCommonWarrantyLayoutService).generateLayout();
			}
		});
	}
}