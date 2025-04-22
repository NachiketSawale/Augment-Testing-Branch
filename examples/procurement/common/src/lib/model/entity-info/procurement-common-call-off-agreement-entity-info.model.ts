/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { IPrcCallOffAgreementEntity } from '../entities/prc-call-off-agreement-entity.interface';
import { ProcurementCommonCallOffAgreementLayoutService } from '../../services/procurement-common-call-off-agreement-layout.service';
import { ProcurementCommonCallOffAgreementDataService } from '../../services/procurement-common-call-off-agreement-data.service';

/**
 * Procurement common CallOffAgreement entity info helper
 */
export class ProcurementCommonCallOffAgreementEntityInfo {

	/**
	 * Create a real procurement CallOffAgreement entity info configuration for different modules
	 */
	public static create<T extends IPrcCallOffAgreementEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
		dataServiceToken: ProviderToken<ProcurementCommonCallOffAgreementDataService<T, PT, PU>>,
		/**
		 * module SubModule
		 */
		moduleSubModule?: string,
		/**
		 * Type Name
		 */
		typeName?: string,
		/**
		 * Layout
		 */
		layout?: object,
		/**
		 * Customize layout service by extending ProcurementCommonCallOffAgreementLayoutService
		 * Default is ProcurementCommonCallOffAgreementLayoutService
		 */
		layoutServiceToken?: ProviderToken<ProcurementCommonCallOffAgreementLayoutService>,
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: {text: 'Call Off Agreements', key: 'procurement.common.listCallOffAgreementTitle'},
			},
			form: {
				containerUuid: config.formUuid,
				title: {text: 'Call Off Agreement Details', key: 'procurement.common.detailCallOffAgreementTitle'},
			},
			dataService: context => context.injector.get(config.dataServiceToken),
			dtoSchemeId: {moduleSubModule: config.moduleSubModule ?? 'Procurement.Common', typeName: config.typeName ?? 'PrcCallOffAgreementDto'},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: context => {
				return context.injector.get(config.layoutServiceToken ?? ProcurementCommonCallOffAgreementLayoutService).generateLayout({
					dataServiceToken: config.dataServiceToken
				});
			}
		});
	}


}