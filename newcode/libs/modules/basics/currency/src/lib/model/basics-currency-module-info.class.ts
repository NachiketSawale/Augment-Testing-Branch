/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo, DataTranslationGridComponent } from '@libs/ui/business-base';
import { BasicsCurrencyRateEntity } from './basics-currency-rate-entity.class';
import { BasicsCurrencyRateDataService } from '../services/basics-currency-rate-data.service';
import { BasicsCurrencyConversionEntity } from './basics-currency-conversion-entity.class';
import { BasicsCurrencyConversionDataService } from '../services/basics-currency-conversion-data.service';
import { BasicsCurrencyEntity } from './basics-currency-entity.class';
import { BasicsCurrencyDataService } from '../services/basics-currency-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from "@libs/ui/common";
import { BasicsSharedCurrencyRateTypeLookupService, BasicsSharedLookupOverloadProvider } from "@libs/basics/shared";
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';

export class BasicsCurrencyModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsCurrencyModuleInfo();

	private constructor(){
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.currency';
	}

	private get moduleSubModule(): string {
		return 'Basics.Currency';
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageContainerConfiguration: IContainerDefinition = {
			uuid: '66ed1e3c6f2e11e4b116123b93f75cba',
			title: {key: 'basics.currency.CurrencyTranslation'},
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageContainerConfiguration)];
	}

	public override get entities(): EntityInfo[] {
		return [this.basicsCurrencyEntityInfo, this.basicsCurrencyConversionEntityInfo, this.basicsCurrencyRateEntityInfo];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	private readonly basicsCurrencyEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.internalModuleName + '.HomeCurrency'},
		},
		form: {
			title: {key:this.internalModuleName + '.CurrencyDetails' },
			containerUuid:'1151f532821247d1aeb031ae87df515c'
		},
		dataService: (ctx) => ctx.injector.get(BasicsCurrencyDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'CurrencyDto' },
		permissionUuid: '125895cc6f2e11e4b116123b93f75cba',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Currency', 'DescriptionInfo', 'ConversionPrecision', 'DisplayPrecision', 'IsDefault', 'SortBy','RoundlogicTypeFk'],
				},
			],
			overloads: {
				RoundlogicTypeFk: BasicsSharedLookupOverloadProvider.provideRoundingLogicTypeLookupOverload(false)
			},
			labels: {
				...prefixAllTranslationKeys('basics.currency.', {
					Currency: { key: 'Currency' },
					SortBy: { key: 'SortBy' },
					ConversionPrecision: { key: 'ConversionPrecision' },
					DisplayPrecision: { key: 'DisplayPrecision' },
					IsDefault: { key: 'IsDefault' },
					RoundlogicTypeFk: { key: 'RoundlogicTypeFk' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'descriptionInfo' },
				})
		}
	}} as IEntityInfo<BasicsCurrencyEntity>);

	private readonly basicsCurrencyConversionEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.internalModuleName + '.CurrencyConversion'},
		},
		dataService: (ctx) => ctx.injector.get(BasicsCurrencyConversionDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'CurrencyConversionDto' },
		permissionUuid: '674b21f399c4441f89c28ebc12995341',
		layoutConfiguration: async ctx => {
			const IBasicsCurrencyLookupProvider =  await (ctx.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN));
			return {
				groups: [
					{
						gid: 'Currency Conversion',
						attributes: ['CurrencyForeignFk', 'Basis', 'Comment'],
					},
				],
				overloads: {
					CurrencyForeignFk: IBasicsCurrencyLookupProvider.provideCurrencyLookupOverload({
						showClearButton: true,
					}),
				},
				labels: {
					...prefixAllTranslationKeys('basics.currency.', {
						CurrencyForeignFk: {key: 'ForeignCurrency'},
						Basis: {key: 'Basis'},
					}),
					...prefixAllTranslationKeys('cloud.common.', {
						Comment: { key: 'entityCommentText'},
					}),
				}
			}
		}}as IEntityInfo<BasicsCurrencyConversionEntity>)

	private readonly basicsCurrencyRateEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.internalModuleName + '.ExchangeRates'},
		},
		dataService: (ctx) => ctx.injector.get(BasicsCurrencyRateDataService),
		dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'CurrencyRateDto' },
		permissionUuid: '5ca9addb22d7457c877e4bc7ae38ee7c',
		layoutConfiguration: {
			groups: [
				{
					gid: 'basicData',
					attributes: ['CurrencyRateTypeFk','Rate','RateDate','CommentText'],
				},
			],
			overloads: {
				CurrencyRateTypeFk: {
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyRateTypeLookupService,
					}),
					type: FieldType.Lookup,
					visible: true,
				},
			},
			labels: {
				...prefixAllTranslationKeys('basics.currency.', {
					CurrencyRateTypeFk: {key: 'currencyRateTypeFk'},
					RateDate: {key: 'RateDate'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Rate: {key: 'entityRate'},
					CommentText: { key: 'entityCommentText'},
				}),
			},
		}} as IEntityInfo<BasicsCurrencyRateEntity>)
}
