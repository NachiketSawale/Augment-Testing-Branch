/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo, CompositeGridConfigurationToken, CompositeGridContainerComponent } from '@libs/ui/business-base';
import { IMaterialPriceConditionEntity, IPriceConditionHeaderParamEntity } from '@libs/basics/interfaces';
import { BasicsSharedPriceConditionLayoutService } from '../services/price-condition-layout.service';
import { ProviderToken } from '@angular/core';
import { IBasicsSharedPriceConditionService } from '../services/interfaces/price-condition-service.interface';
import { BasicsSharedPriceConditionHeaderComponent } from '../components/price-condition-header/price-condition-header.component';
import { BasicsSharedPriceConditionHeaderGridFooterInfoToken } from './interfaces/pricecondition-header-footer-info.interface';
import { BasicsSharedPriceConditionFooterComponent } from '../components/price-condition-footer/price-condition-footer.component';
import { CompleteIdentification, IEntityIdentification, isResourceFactory, Translatable } from '@libs/platform/common';
import { BaseValidationService, IEntitySchemaId } from '@libs/platform/data-access';
import { OptionallyAsyncResource, IInitializationContext } from '@libs/platform/common';
import { BasicsSharedPriceConditionParamLayoutService } from '../param/price-condition-param-layout.service';
import { BasicsSharedPriceConditionParamDataService } from '../param/price-condition-param-data.service';

interface IPriceConditionParam {
	/**
	 * grid container uuid (use to config grid layout)
	 */
	gridContainerUuid: string;
	/**
	 * permission  uuid (use to determine whether there is permission to access this container)
	 */
	permissionUuid?: string;
	/**
	 * grid title
	 */
	gridTitle: Translatable;
	/**
	 * Data service instance or Date service token (inject token)
	 */
	dataService: OptionallyAsyncResource<IBasicsSharedPriceConditionService<IMaterialPriceConditionEntity, IEntityIdentification>>;
	validationService: OptionallyAsyncResource<BaseValidationService<IMaterialPriceConditionEntity>>;
	dtoSchemeConfig: IEntitySchemaId;
	customLayout?: ProviderToken<IBasicsSharedPriceConditionService<IMaterialPriceConditionEntity, IEntityIdentification>>;
	/**
	 * for param container config
	 */
	paramConfig?: {
		gridContainerUuid: string;
		permissionUuid: string;
		dataServiceToken: ProviderToken<BasicsSharedPriceConditionParamDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>>>;
	};
}

/**
 * create price condition entity infos.
 */
export class BasicsSharedPriceConditionEntityInfo {
	public static create(param: IPriceConditionParam): EntityInfo[] {
		const priceConditionInfo = this.createPriceConditionEntityInfo(param);
		return param.paramConfig ? [priceConditionInfo, this.createPriceConditionParamEntityInfo(param.paramConfig)] : [priceConditionInfo];
	}

	public static createPriceConditionEntityInfo(param: IPriceConditionParam) {
		return EntityInfo.create<IMaterialPriceConditionEntity>({
			grid: {
				title: param.gridTitle,
				containerUuid: param.gridContainerUuid,
				containerType: CompositeGridContainerComponent,
				providers: (ctx) => [
					{
						provide: CompositeGridConfigurationToken,
						useValue: {
							maxTopLeftLength: 50,
							topLeftContainerType: BasicsSharedPriceConditionHeaderComponent,
							maxBottomRightLength: 30,
							bottomRightContainerType: BasicsSharedPriceConditionFooterComponent,
							providers: [
								{
									provide: BasicsSharedPriceConditionHeaderGridFooterInfoToken,
									useValue: {
										dataService: this.getDataServiceInstance(ctx, param.dataService),
									},
								},
							],
						},
					},
				],
			},
			dataService: (ctx) => {
				return this.getDataServiceInstance(ctx, param.dataService);
			},
			validationService: (ctx) => {
				return isResourceFactory(param.validationService) ? param.validationService(ctx) : ctx.injector.get(param.validationService);
			},
			dtoSchemeId: param.dtoSchemeConfig,
			permissionUuid: param.permissionUuid ? param.permissionUuid : param.gridContainerUuid,
			layoutConfiguration: (context) => {
				const layoutService = param.customLayout ? param.customLayout : BasicsSharedPriceConditionLayoutService;
				return context.injector.get(layoutService).generateLayout();
			},
		});
	}

	public static createPriceConditionParamEntityInfo(paramConfig: {
		gridContainerUuid: string;
		permissionUuid: string;
		dataServiceToken: ProviderToken<BasicsSharedPriceConditionParamDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>>>;
	}) {
		return EntityInfo.create<IPriceConditionHeaderParamEntity>({
			grid: {
				title: { text: 'Price Condition Parameter', key: 'basics.priceCondition.headerParamTitle' },
				containerUuid: paramConfig.gridContainerUuid,
			},
			dataService: (ctx) => ctx.injector.get(paramConfig.dataServiceToken),
			dtoSchemeId: { moduleSubModule: 'Basics.PriceCondition', typeName: 'HeaderPparamDto' },
			permissionUuid: paramConfig.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(BasicsSharedPriceConditionParamLayoutService).generateLayout();
			},
		});
	}

	private static getDataServiceInstance(ctx: IInitializationContext, dataService: OptionallyAsyncResource<IBasicsSharedPriceConditionService<IMaterialPriceConditionEntity, IEntityIdentification>>) {
		return isResourceFactory(dataService) ? dataService(ctx) : ctx.injector.get(dataService);
	}
}
