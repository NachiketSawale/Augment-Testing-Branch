/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcPaymentScheduleEntity } from '../model/entities';
import { BasicsSharedPaymentScheduleLayoutService, BasicsSharedProcurementPaymentScheduleStatusLookupService } from '@libs/basics/shared';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IBasicsCustomizeProcurementPaymentScheduleStatusEntity } from '@libs/basics/interfaces';

/**
 * Procurement common payment schedule layout service token
 */
export const PROCUREMENT_COMMON_PAYMENT_SCHEDULE_LAYOUT_TOKEN = new InjectionToken<ProcurementCommonPaymentScheduleLayoutService>('ProcurementCommonPaymentScheduleLayoutService');

/**
 * Procurement common payment schedule layout service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonPaymentScheduleLayoutService extends BasicsSharedPaymentScheduleLayoutService<IPrcPaymentScheduleEntity> {
	protected constructor() {
		const customLayout = {
			groups: [{
				gid: 'basicData',
				title: {text: 'Basic Data', key: 'cloud.common.entityProperties'},
				attributes: [
					'Description',
					'PrcPsStatusFk'
				]
			}],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					'Description': {text: 'Description', key: 'paymentDescription'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					'PrcPsStatusFk': {text: 'Status', key: 'entityStatus'}
				})
			},
			overloads: {
				PrcPsStatusFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPrcPaymentScheduleEntity, IBasicsCustomizeProcurementPaymentScheduleStatusEntity>({
						dataServiceToken: BasicsSharedProcurementPaymentScheduleStatusLookupService
					})
				}
			}
		};
		super(customLayout as ILayoutConfiguration<IPrcPaymentScheduleEntity>);
	}
}