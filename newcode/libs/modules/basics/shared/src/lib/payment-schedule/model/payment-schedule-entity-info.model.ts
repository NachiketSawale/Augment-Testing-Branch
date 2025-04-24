/*
 * Copyright(c) RIB Software GmbH
 */

import {
	EntityInfo,
	IGridContainerLink,
	IEntityContainerBehavior,
	IEntityTreeConfiguration,
	CompositeGridConfigurationToken,
	CompositeGridContainerComponent
} from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ProviderToken, StaticProvider, Type } from '@angular/core';
import { IPaymentScheduleBaseEntity } from '@libs/basics/interfaces';
import { BaseValidationService, IEntitySchemaId } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification, OptionallyAsyncResource, Translatable } from '@libs/platform/common';
import { IBasicsSharedPaymentScheduleDataServiceInterface } from '../services/interfaces/payment-schedule-data-service.interface';

/**
 * Create common payment schedule entity info
 */
export class BasicsSharedPaymentScheduleEntityInfo {
	public static create<
		T extends IPaymentScheduleBaseEntity,
		PT extends IEntityIdentification,
		PU extends CompleteIdentification<PT>>
	(config: {
		title: Translatable,
		formTitle: Translatable,
		permissionUuid: string,
		formUuid: string,
		dtoSchemeConfig: IEntitySchemaId,
		behaviorToken: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
		dataServiceToken: ProviderToken<IBasicsSharedPaymentScheduleDataServiceInterface<T, PT, PU>>,
		layoutServiceToken: ProviderToken<{ generateLayout(): Promise<ILayoutConfiguration<T>> }>,
		validationServiceToken?: ProviderToken<BaseValidationService<T>>,
		treeConfiguration?: OptionallyAsyncResource<IEntityTreeConfiguration<T>> | boolean,
		topLeftContainerType: Type<unknown>,
		topLeftContainerProviders: StaticProvider[]
	}) {
		return EntityInfo.create<T>({
			grid: {
				title: config.title,
				behavior: ctx => ctx.injector.get(config.behaviorToken),
				treeConfiguration: config.treeConfiguration,
				containerType: CompositeGridContainerComponent,
				providers: [{
					provide: CompositeGridConfigurationToken,
					useValue: {
						maxTopLeftLength: 120,
						topLeftContainerType: config.topLeftContainerType,
						providers: config.topLeftContainerProviders
					}
				}]
			},
			form: {
				containerUuid: config.formUuid,
				title: config.formTitle
			},
			dtoSchemeId: config.dtoSchemeConfig,
			permissionUuid: config.permissionUuid,
			dataService: ctx => ctx.injector.get(config.dataServiceToken),
			validationService: ctx => ctx.injector.get(config.validationServiceToken),
			layoutConfiguration: ctx => ctx.injector.get(config.layoutServiceToken).generateLayout()
		});
	}
}