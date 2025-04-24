/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken, Type } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { CompositeGridConfigurationToken, CompositeGridContainerComponent, EntityInfo } from '@libs/ui/business-base';
import { IPrcCommonAccountAssignmentEntity } from '../entities/procurement-common-account-assignment-entity.interface';
import { ProcurementCommonAccountAssignmentDataService } from '../../services/procurement-common-account-assignment-data.service';
import { ProcurementCommonAccountAssignmentLayoutService } from '../../services/procurement-common-account-assignment-layout.service';
import { ProcurementCommonAccountAssignmentHeaderComponent } from '../../components/account-assignment-header/account-assignment-header.component';
import { ProcurementCommonDataServiceToken } from '../../components/grid-composite-base/grid-composite-base.component';
import { ProcurementCommonAccountAssignmentValidationService } from '../../services/procurement-common-account-assignment-validation.service';
import { BasicsSharedAccountAssignmentAccountTypeLookupService } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';

/**
 * Procurement common account assignment entity info helper
 */
export class ProcurementCommonAccountAssignmentEntityInfo {
	/**
	 * Create a real procurement account assignment entity info configuration for different modules
	 */
	public static create<T extends IPrcCommonAccountAssignmentEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		/**
		 * Permission uuid in lower case
		 */
		permissionUuid: string,
		/**
		 * Form uuid in lower case
		 */
		formUuid: string,
		/**
		 * Data service
		 */
		dataServiceToken: ProviderToken<ProcurementCommonAccountAssignmentDataService<T, PT, PU>>,
		/**
		 * validation service
		 */
		validationServiceToken: ProviderToken<ProcurementCommonAccountAssignmentValidationService<T, PT, PU>>,
		/**
		 * module SubModule
		 */
		moduleSubModule: string,
		/**
		 * Type Name
		 */
		typeName: string,
		/**
		 * header Component
		 */
		headerComponent?: Type<unknown>,
		layoutServiceToken?: ProviderToken<ProcurementCommonAccountAssignmentLayoutService<T, PT, PU>>,
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: {key: 'procurement.common.accountAssignmentGridTitle'},
				//behavior: ctx => ctx.injector.get(config.behaviorToken),
				containerType: CompositeGridContainerComponent,
				providers: [
					{
						provide: CompositeGridConfigurationToken,
						useValue: {
							maxTopLeftLength: 250,
							topLeftContainerType: config.headerComponent ?? ProcurementCommonAccountAssignmentHeaderComponent,
							providers: [
								{
									provide: ProcurementCommonDataServiceToken,
									useValue: config.dataServiceToken,
								},
							],
						},
					},
				],
			},
			form: {
				containerUuid: config.formUuid,
				title: {key: 'procurement.common.accountAssignmentFormTitle'},
			},
			dataService: (context) => context.injector.get(config.dataServiceToken),
			validationService: (context) => context.injector.get(config.validationServiceToken),
			dtoSchemeId: {moduleSubModule: config.moduleSubModule, typeName: config.typeName},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(config.layoutServiceToken ?? ProcurementCommonAccountAssignmentLayoutService).generateLayout({
					dataServiceToken: config.dataServiceToken,
				});
			},
			prepareEntityContainer: async (context) => {
				await firstValueFrom(context.injector.get(BasicsSharedAccountAssignmentAccountTypeLookupService).getList());
			},
		});
	}
}
