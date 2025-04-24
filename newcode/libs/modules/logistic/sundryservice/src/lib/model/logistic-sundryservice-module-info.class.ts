/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { LogisticSundryServiceDataService } from '@libs/logistic/sundryservice';
import { ILogisticSundryServiceEntity, ILogisticSundryServicePriceListEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServicePriceListDataService } from '../services/logistic-sundry-service-price-list-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCurrencyLookupService, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { LogisticSundryServiceGridBehavior } from '../behaviors/logistic-sundry-service-grid-behavior.service';
import { LogisticSundryServicePriceListGridBehavior } from '../behaviors/logistic-sundry-service-price-list-grid-behavior.service';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from "@libs/ui/container-system";
import { SidebarTab } from "@libs/ui/sidebar";
import { LogisticSharedLookupOverloadProvider } from '@libs/logistic/shared';

/**
 * Exports information about containers that will be rendered by this module.
 */
export class LogisticSundryServiceModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new LogisticSundryServiceModuleInfo();

	/**
	 * Initializes the module information of logistic sundry service module
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module
	 * @returns {string}
	 */
	public override get internalModuleName(): string {
		return 'logistic.sundryservice';
	}

	/**
	 * Returns the module identifier in PascalCase.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Logistic.SundryService';
	}

	/**
	 * Returns the entities used by the module.
	 * @returns The list of entities.
	 */
	public override get entities(): EntityInfo[] {
		return [
			this.sundryServiceEntityInfo,
			this.sundryServicePriceListEntityInfo
		];
	}

	protected override get sidebarTabs(): SidebarTab[]{
		return [];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : '7c1e6b7291304cd3a95630b39c4a7f6d',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}

	/**
	 * Loads the translation file used for logistic sundryservice
	 */
	public override get preloadedTranslations(): string[] {
		return [
			this.internalModuleName, 'cloud.common', 'basics.customize', 'ui.business-base'
		];
	}

	private readonly sundryServiceEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.listSundryServiceTitle' },
			behavior: ctx => ctx.injector.get(LogisticSundryServiceGridBehavior),
		},
		form: {
			title: { key: this.internalModuleName + '.detailSundryServiceTitle' },
			containerUuid: '3e8ef5f3b7c741f486e60dd2bb1c564c'
		},
		dataService: (ctx) => ctx.injector.get(LogisticSundryServiceDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'SundryServiceDto'},
		permissionUuid: '3c3df5cc678f4ee4a2184555c39854c3',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Code', 'DescriptionInfo', 'SundryServiceGroupFk', 'Specification', 'UoMFk'],
				}
			],
			overloads: {
				UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				SundryServiceGroupFk: LogisticSharedLookupOverloadProvider.provideLogisticSundryGroupReadonlyLookupOverload(),
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: {key: 'entityDescription'},
					Specification: {key: 'EntitySpec'},
					UoMFk: {key: 'entityUoM'},
					SundryServiceGroupFk: {key: 'entityGroup'}
				})
			}
		},
	} as IEntityInfo<ILogisticSundryServiceEntity>);

	private readonly sundryServicePriceListEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: { key: this.internalModuleName + '.listSundryServicePriceListTitle' },
			behavior: ctx => ctx.injector.get(LogisticSundryServicePriceListGridBehavior),
		},
		form: {
			title: { key: this.internalModuleName + '.detailSundryServicePriceListTitle' },
			containerUuid:'1f0839eeedb741cc9cbeb6f00266c6f8'
		},
		dataService: (ctx) => ctx.injector.get(LogisticSundryServicePriceListDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'SundryServicePriceListDto' },
		permissionUuid: '014f9eb6e9cc4d8089bf7b7e1173d677',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'CommentText', 'CurrencyFk', 'PricePortion1', 'PricePortion2', 'PricePortion3',
						'PricePortion4', 'PricePortion5', 'PricePortion6', 'PricePortionSum', 'ValidFrom', 'ValidTo', 'IsManual']
				}],
			overloads: {
				CurrencyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyLookupService,
						showDescription: true,
						descriptionMember: 'Currency'
					})
				},
			},
			labels: {
				...prefixAllTranslationKeys('logistic.sundryservice.', {
					IsManual: {key: 'isManual'},
					PricePortion1: {key: 'pricePortion01'},
					PricePortion2: {key: 'pricePortion02'},
					PricePortion3: {key: 'pricePortion03'},
					PricePortion4: {key: 'pricePortion04'},
					PricePortion5: {key: 'pricePortion05'},
					PricePortion6: {key: 'pricePortion06'},
					PricePortionSum: {key: 'pricePortionSum'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Specification: {key: 'EntitySpec'},
					ValidFrom: {key: 'entityValidFrom'},
					ValidTo: {key: 'entityValidTo'},
					CommentText: {key: 'entityComment'},
					CurrencyFk: {key: 'entityCurrency'}
				})
			}
		},
	} as IEntityInfo<ILogisticSundryServicePriceListEntity>);


}
