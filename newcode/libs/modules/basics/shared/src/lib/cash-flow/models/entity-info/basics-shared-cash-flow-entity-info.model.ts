/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken, runInInjectionContext } from '@angular/core';
import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BaseValidationService, IEntitySelection } from '@libs/platform/data-access';
import { BasicsSharedCashFlowProjectionChartComponent } from '../../components/basics-shared-cash-flow-projection-chart/basics-shared-cash-flow-projection-chart.component';
import { BasicsSharedCashFlowLayoutService } from '../../services/basics-shared-cash-flow-layout.service';
import { ICashProjectionDetailEntity } from '../entities/cash-projection-detail-entity.interface';
import { BasicsSharedCashFlowBehavior } from '../../behaviors/basics-shared-cash-flow-behavior.service';
import { BasicsSharedCashFlowDataService } from '../../services/basics-shared-cash-flow-data.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IInitializationContext, OptionallyAsyncResource } from '@libs/platform/common';
import { BasicsSharedCashFlowDataValidationService } from '../../services/basics-shared-cash-flow-data-validation.service';

export interface IDataService<T extends object> {
	/**
	 * Data service
	 */
	dataServiceToken: ProviderToken<IEntitySelection<T>>;
	/**
	 * Data validation service
	 */
	dataValidationServiceToken: ProviderToken<BaseValidationService<T>>;
}

export interface IParentDataService<T extends ICashProjectionDetailEntity, PT extends object> {
	/**
	 * Parent data service
	 */
	parentDataServiceToken: ProviderToken<IEntitySelection<PT>>;
	/**
	 * Defined the CashProjectionId
	 * @param obj
	 */
	getCashProjectionId: (obj?: PT) => number | null;
	/**
	 * Override the isParentFn
	 * @param parentKey
	 * @param entity
	 */
	isParentFn: (parentKey: PT, entity: T) => boolean;
}

export type Without<T, U> = {
	[P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR type, provide a dataService directly or a configuration of the dataService.
 */
export type DataServiceConfig<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

/**
 * cash flow entity info helper
 */
export class BasicsSharedCashFlowEntityInfo {
	/**
	 * Create a real cash flow projection chart entity info configuration for different modules
	 */
	public static create<PT extends object, T extends ICashProjectionDetailEntity = ICashProjectionDetailEntity>(
		config: {
			/**
			 * Permission uuid in lower case
			 */
			permissionUuid: string;
			/**
			 * module SubModule
			 */
			moduleSubModule?: string;
			/**
			 * Dto Name
			 */
			typeName?: string;
			behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>;
			layout?: (context: IInitializationContext) => ILayoutConfiguration<T>;
		} & DataServiceConfig<IDataService<T>, IParentDataService<T, PT>>,
	) {
		let cashFlowDataValidationService: BaseValidationService<T>;

		const injectCashFlowDataService: OptionallyAsyncResource<IEntitySelection<T>> = (context) => {
			if (config.dataServiceToken) {
				cashFlowDataValidationService = context.injector.get(config.dataValidationServiceToken);
				return context.injector.get(config.dataServiceToken);
			} else {
				return runInInjectionContext(context.injector, () => {
					const cashFlowDataService = new BasicsSharedCashFlowDataService<T, PT>(context.injector.get(config.parentDataServiceToken), config.getCashProjectionId, config.isParentFn);
					cashFlowDataValidationService = new BasicsSharedCashFlowDataValidationService(cashFlowDataService);
					return cashFlowDataService;
				});
			}
		};

		const injectCashFlowDataValidationService: OptionallyAsyncResource<BaseValidationService<T>> = (context) => cashFlowDataValidationService;

		return EntityInfo.create<T>({
			dataService: injectCashFlowDataService,
			validationService: injectCashFlowDataValidationService,
			grid: {
				containerType: BasicsSharedCashFlowProjectionChartComponent,
				title: { text: 'Cash Flow Forecast', key: 'basics.common.cashFlowForecastGridTitle' },
				behavior: (ctx) => {
					if (config.behavior) {
						return ctx.injector.get(config.behavior);
					}
					return ctx.injector.get(BasicsSharedCashFlowBehavior<T>);
				},
			},
			dtoSchemeId: { moduleSubModule: config.moduleSubModule ?? 'Basics.Common', typeName: config.typeName ?? 'CashProjectionDetailDto' },
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return config.layout ? config.layout(context) : (BasicsSharedCashFlowLayoutService.generateLayout() as ILayoutConfiguration<T>);
			},
		});
	}
}
