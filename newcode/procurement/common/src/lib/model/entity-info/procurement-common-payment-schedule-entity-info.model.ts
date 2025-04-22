/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { IPrcPaymentScheduleEntity } from '../entities';
import { BaseValidationService } from '@libs/platform/data-access';
import { PrcCommonPaymentScheduleHeaderInfoToken } from '../interfaces';
import { PROCUREMENT_COMMON_PAYMENT_SCHEDULE_LAYOUT_TOKEN } from '../../services';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedPaymentScheduleEntityInfo, IBasicsSharedPaymentScheduleDataServiceInterface } from '@libs/basics/shared';
import { ProcurementCommonPaymentScheduleHeaderComponent } from '../../components/payment-schedule-header/payment-schedule-header.component';

/**
 * Create procurement common payment schedule entity info
 */
export class ProcurementCommonPaymentScheduleEntityInfo {
	public static create<
		T extends IPrcPaymentScheduleEntity,
		PT extends IEntityIdentification,
		PU extends CompleteIdentification<PT>>
	(config: {
		permissionUuid: string,
		formUuid: string,
		behaviorToken: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>
		dataServiceToken: ProviderToken<IBasicsSharedPaymentScheduleDataServiceInterface<T, PT, PU>>
		validationServiceToken?: ProviderToken<BaseValidationService<T>>,
	}) {
		return BasicsSharedPaymentScheduleEntityInfo.create<T, PT, PU>({
			title: {text: 'Payment Schedule', key: 'procurement.common.paymentSchedule.paymentScheduleContainerGridTitle'},
			formTitle: {text: 'Payment Schedule Detail', key: 'procurement.common.paymentSchedule.paymentScheduleContainerFormTitle'},
			permissionUuid: config.permissionUuid,
			formUuid: config.formUuid,
			dtoSchemeConfig: {moduleSubModule: 'Procurement.Common', typeName: 'PrcPaymentScheduleDto'},
			behaviorToken: config.behaviorToken,
			dataServiceToken: config.dataServiceToken,
			validationServiceToken: config.validationServiceToken,
			layoutServiceToken: PROCUREMENT_COMMON_PAYMENT_SCHEDULE_LAYOUT_TOKEN,
			topLeftContainerType: ProcurementCommonPaymentScheduleHeaderComponent,
			topLeftContainerProviders: [{
				provide: PrcCommonPaymentScheduleHeaderInfoToken,
				useValue: {
					dataServiceToken: config.dataServiceToken
				}
			}]
		});
	}
}