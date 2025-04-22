/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ProcurementCommonSubcontractorDataService } from '../../services/procurement-common-subcontractor-data.service';
import { ProcurementCommonSubcontractorLayoutService } from '../../services/procurement-common-subcontractor-layout.service';
import { IPrcSubreferenceEntity } from '../entities';
import { ProcurementCommonSubcontractorValidationService } from '../../services/procurement-common-subcontractor-validation.service';

/**
 * Procurement common subcontractor entity info helper
 */
export class ProcurementCommonSubcontractorEntityInfo {

	/**
	 * Create a real procurement subcontractor entity info configuration for different modules
	 */
	public static create<T extends IPrcSubreferenceEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
		dataServiceToken: ProviderToken<ProcurementCommonSubcontractorDataService<T, PT, PU>>,
		/**
		 * Customize layout service by extending ProcurementCommon subcontractor LayoutService
		 * Default is ProcurementCommon subcontractor LayoutService
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonSubcontractorLayoutService>,

		/**
		 * Validation service
		 */
		validationServiceToken: ProviderToken<ProcurementCommonSubcontractorValidationService<T, PT, PU>>

		/**
		 * Container behavior
		 */
		behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: {text: 'Subcontractors', key: 'procurement.common.subcontractor.subcontractorContainerGridTitle'},
				behavior: config.behavior ? context => context.injector.get(config.behavior!) : undefined
			},
			form: {
				containerUuid: config.formUuid,
				title: {text: 'Subcontractor Detail', key: 'procurement.common.subcontractor.subcontractorContainerFormTitle'},
			},
			dataService: context => context.injector.get(config.dataServiceToken),
			dtoSchemeId: {moduleSubModule: 'Procurement.Common', typeName: 'PrcSubreferenceDto'},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(ProcurementCommonSubcontractorLayoutService).generateLayout();
			}
		});
	}
}