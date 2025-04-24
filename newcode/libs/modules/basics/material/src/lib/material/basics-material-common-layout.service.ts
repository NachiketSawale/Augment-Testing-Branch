/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef, FieldOverloadSpec, FieldType, IFormConfig, ILayoutConfiguration, ILayoutGroup, ILookupContext } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { LazyInjectable, PlatformLazyInjectorService, prefixAllTranslationKeys, Translatable } from '@libs/platform/common';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN, BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY, IBasicsMaterialLayoutService, IMaterialEntity } from '@libs/basics/interfaces';
import { IBasicsUomEntity, IMaterialDiscountGroupLookupEntity, IMaterialSimpleLookupEntity } from '@libs/basics/interfaces';
import { union, set, get, isNil } from 'lodash';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';

/**
 * Material common layout service
 */
@Injectable({
	providedIn: 'root',
})
@LazyInjectable({
	token: BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY,
	useAngularInjection: true,
})
export class BasicsMaterialCommonLayoutService implements IBasicsMaterialLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	/**
	 * Defines material UI representations of individual fields in the entity type
	 */
	private async getCommonOverLoad() {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		const currencyLookupProvider = await this.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);

		return {
			MaterialCatalogFk: BasicsSharedLookupOverloadProvider.provideMaterialCatalogReadOnlyLookupOverload(false),
			NeutralMaterialCatalogFk: BasicsSharedLookupOverloadProvider.provideMaterialCatalogLookupOverload(
				true,
				'basics.material.record.neutralMaterialCatalogDescription',
				{
					key: '',
					execute: (context) => {
						return 'IsNeutral=true AND Islive=true';
					},
				},
				'basics.material.record.neutralMaterialCatalogSearchDialog',
			),
			StockMaterialCatalogFk: BasicsSharedLookupOverloadProvider.provideMaterialCatalogLookupOverload(
				true,
				'basics.material.record.stockMaterialCatalogDescription',
				{
					key: '',
					execute: (context) => {
						return 'Islive=true';
					},
				},
				'basics.material.record.stockMaterialCatalogSearchDialog',
			),
			BasCurrencyFk: currencyLookupProvider.provideCurrencyLookupOverload({
				showClearButton: false
			}),
			Cost: {
				readonly: true,
				type: FieldType.Money,
			},
			BasUomPriceUnitFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
			PriceExtra: {
				readonly: true,
				type: FieldType.Money,
			},
			MaterialDiscountGroupFk: BasicsSharedLookupOverloadProvider.provideMaterialDiscountGroupLookupOverload(true, {
				key: '',
				execute(context: ILookupContext<IMaterialDiscountGroupLookupEntity, IMaterialEntity>) {
					return 'MaterialCatalogFk=' + context.entity?.MaterialCatalogFk;
				},
			}),
			WeightType: BasicsSharedLookupOverloadProvider.provideMaterialTypeLookupOverload(false),
			WeightNumber: BasicsSharedLookupOverloadProvider.provideMaterialWeightNumberLookupOverload(false),
			MdcTaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
			MaterialGroupFk: BasicsSharedLookupOverloadProvider.provideMaterialGroupLookupOverload(false),
			PrcPriceconditionFk: BasicsSharedLookupOverloadProvider.providePriceConditionLookupOverload(true),
			AgreementFk: bpRelatedLookupProvider.getBusinessPartnerAgreementLookupOverload({
				showClearButton: true,
				customServerSideFilter: {
					//TODO:Rename the filter name to make it more general
					key: 'procurement-common-item-agreement-filter',
					execute: (context) => {
						return {
							filterDate: new Date(),
						};
					},
				},
			}),
			MdcMaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
			MdcMaterialabcFk: BasicsSharedLookupOverloadProvider.provideMaterialAbcLookupOverload(false),
			EstCostTypeFk: BasicsSharedLookupOverloadProvider.provideCostTypeLookupOverload(true),
			MdcBrandFk: BasicsSharedLookupOverloadProvider.provideBrandLookupOverload(true),
			MaterialTempFk: BasicsSharedLookupOverloadProvider.provideSimpleMaterialLookupOverload(true, 'basics.material.record.materialTemplateDescription', {
				key: 'basics-material-records-material-template-filter',
				execute: () => {
					return {};
				},
			}),
			MaterialTempTypeFk: BasicsSharedLookupOverloadProvider.provideMaterialTemplateTypeLookupOverload(false),
			BasUomWeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true, {
				execute(item: IBasicsUomEntity): boolean {
					return item.MassDimension != undefined && item.MassDimension === 1 && item?.IsLive === true;
				},
			}),
			MdcMaterialStockFk: BasicsSharedLookupOverloadProvider.provideSimpleMaterialLookupOverload(true, 'basics.material.record.stockMaterialDescription', {
				key: 'basics-material-records-stock-material-filter',
				execute: (context: ILookupContext<IMaterialSimpleLookupEntity, IMaterialEntity>) => {
					return {
						materialCatalogFk: context.entity?.StockMaterialCatalogFk ?? -1,
					};
				},
			}),
			PriceExtraEstPrice: {
				readonly: true,
				type: FieldType.Money,
			},
			PriceExtraDwRate: {
				readonly: true,
				type: FieldType.Money,
			},
			Co2Source: {
				readonly: true,
			},
			BasCo2SourceFk: BasicsSharedLookupOverloadProvider.provideCo2SourceReadonlyLookupOverload(),
			MaterialStatusFk: BasicsSharedLookupOverloadProvider.provideMaterialStatusReadonlyLookupOverload(),
			DangerClassFk: BasicsSharedLookupOverloadProvider.provideDangerClassLookupOverload(true),
			PackageTypeFk: BasicsSharedLookupOverloadProvider.providePackagingTypesLookupOverload(true),
			//TODO: seems we do not filter the correct UOM according to the dimension which may not correct
			UomVolumeFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			MaterialTypeFk: BasicsSharedLookupOverloadProvider.provideMaterialTypeLookupOverload(false),
		} as { [key in keyof Partial<IMaterialEntity>]: FieldOverloadSpec<IMaterialEntity> };
	}

	/**
	 * A collection of labels
	 */
	private readonly commonLabel: { [key: string]: Translatable } = {
		...prefixAllTranslationKeys('basics.material.', {
			MaterialCatalogFk: {
				key: 'record.materialCatalog',
				text: 'Material Catalog',
			},
			NeutralMaterialCatalogFk: {
				key: 'record.neutralMaterialCatalog',
				text: 'Neutral Material Catalog',
			},
			StockMaterialCatalogFk: {
				key: 'record.stockMaterialCatalog',
				text: 'Stock Material Catalog',
			},
			MatchCode: {
				key: 'record.matchCode',
				text: 'Match Code',
			},
			DescriptionInfo2: {
				key: 'record.furtherDescription',
				text: 'Further Description',
			},
			RetailPrice: {
				key: 'record.retailPrice',
				text: 'Retail Price',
			},
			ListPrice: {
				key: 'record.listPrice',
				text: 'List Price',
			},
			Discount: {
				key: 'record.discount',
				text: 'Discount %',
			},
			Charges: {
				key: 'record.charges',
				text: 'Charges',
			},
			Cost: {
				key: 'record.costPrice',
				text: 'Cost Price',
			},
			EstimatePrice: {
				key: 'record.estimatePrice',
				text: 'Estimate Price',
			},
			CostPriceGross: {
				key: 'record.costPriceGross',
				text: 'Cost Price (Gross)',
			},
			PriceExtra: {
				key: 'portion.priceExtras',
				text: 'Price Extras',
			},
			SellUnit: {
				key: 'record.sellUnit',
				text: 'Sell Unit',
			},
			MaterialDiscountGroupFk: {
				key: 'record.discountGroup',
				text: 'Discount Group',
			},
			WeightType: {
				key: 'record.weightType',
				text: 'Weight Type',
			},
			WeightNumber: {
				key: 'record.weightNumber',
				text: 'Weight Number',
			},
			Weight: {
				key: 'record.weight',
				text: 'Weight',
			},
			MaterialGroupFk: {
				key: 'record.materialGroup',
				text: 'Material Group',
			},
			AgreementFk: {
				key: 'record.partnerAgreement',
				text: 'Partner Agreement',
			},
			MdcMaterialFk: {
				key: 'record.neutralMaterial',
				text: 'Neutral Material',
			},
			ExternalCode: {
				key: 'record.externalCode',
				text: 'External Code',
			},
			MdcMaterialabcFk: {
				key: 'record.aBCGroup',
				text: 'ABC Group',
			},
			LeadTime: {
				key: 'materialSearchLookup.htmlTranslate.leadTimes',
				text: 'Lead Time (Days)',
			},
			EstCostTypeFk: {
				key: 'record.estCostTypeFk',
				text: 'Cost Type',
			},
			LeadTimeExtra: {
				key: 'leadTimeExtra',
				text: 'Express Lead Time',
			},
			FactorHour: {
				key: 'record.factorHour',
				text: 'Hour Factor',
			},
			IsProduct: {
				key: 'record.isProduct',
				text: 'Is Product',
			},
			MaterialTempFk: {
				key: 'record.materialTemplate',
				text: 'Template',
			},
			MaterialTempTypeFk: {
				key: 'record.materialTemplateType',
				text: 'Template Type',
			},
			BasUomWeightFk: {
				key: 'record.uomWeight',
				text: 'Uom Weight',
			},
			MaterialTypeFk: {
				key: 'record.materialType',
				text: 'Material Type',
			},
			DayworkRate: {
				key: 'record.dayworkRate',
				text: 'Daywork Rate',
			},
			MdcMaterialStockFk: {
				key: 'record.stockMaterial',
				text: 'Stock Material',
			},
			PriceExtraEstPrice: {
				key: 'record.PriceExtraEstPrices',
				text: 'Price Extra(Estimate Price)',
			},
			PriceExtraDwRate: {
				key: 'record.PriceExtraDwRates',
				text: 'Price Extra(Daywork Rate)',
			},
			EanGtin: {
				key: 'record.eanGtin',
				text: 'EAN/GTIN',
			},
			Supplier: {
				key: 'record.supplier',
				text: 'Supplier',
			},
			Co2Source: {
				key: 'record.entityCo2Source',
				text: 'CO2/kg (Source)',
			},
			BasCo2SourceFk: {
				key: 'record.entityBasCo2SourceFk',
				text: 'CO2/kg (Source Name)',
			},
			Co2Project: {
				key: 'record.entityCo2Project',
				text: 'CO2/kg (Project)',
			},
			MaterialStatusFk: {
				key: 'record.materialStatus',
				text: 'Material Status',
			},
			MdcBrandFk: {
				key: 'entityMdcBrandFk',
				text: 'Material Brand',
			},
			ModelName: {
				key: 'entityModelName',
				text: 'Model Name',
			},
		}),
		...prefixAllTranslationKeys('cloud.common.', {
			Code: {
				key: 'entityCode',
				text: 'Code',
			},
			DescriptionInfo1: {
				key: 'entityDescription',
				text: 'Description',
			},
			BasCurrencyFk: {
				key: 'entityCurrency',
				text: 'Currency',
			},
			PriceUnit: {
				key: 'entityPriceUnit',
				text: 'Price Unit',
			},
			BasUomPriceUnitFk: {
				key: 'entityPriceUnitUoM',
				text: 'Price Unit UoM',
			},
			FactorPriceUnit: {
				key: 'entityFactor',
				text: 'Factor',
			},
			MdcTaxCodeFk: {
				key: 'entityTaxCode',
				text: 'Tax Code',
			},
			UomFk: {
				key: 'entityUoM',
				text: 'UoM',
			},
			PrcPriceconditionFk: {
				key: 'entityPriceCondition',
				text: 'Price Condition',
			},
			Userdefined1: {
				key: 'entityUserDefined',
				text: 'User-Defined 1',
				params: {
					p_0: '1',
				},
			},
			Userdefined2: {
				key: 'entityUserDefined',
				text: 'User-Defined 2',
				params: {
					p_0: '2',
				},
			},
			Userdefined3: {
				key: 'entityUserDefined',
				text: 'User-Defined 3',
				params: {
					p_0: '3',
				},
			},
			Userdefined4: {
				key: 'entityUserDefined',
				text: 'User-Defined 4',
				params: {
					p_0: '4',
				},
			},
			Userdefined5: {
				key: 'entityUserDefined',
				text: 'User-Defined 5',
				params: {
					p_0: '5',
				},
			},
			SpecificationInfo: {
				key: 'EntitySpec',
				text: 'Specification',
			},
			IsLive: {
				key: 'entityIsLive',
				text: 'Active',
			},
			UserDefinedText1: {
				key: 'entityUserDefinedText',
				text: 'User Defined Text 1',
				params: {
					p_0: '1',
				},
			},
			UserDefinedText2: {
				key: 'entityUserDefinedText',
				text: 'User Defined Text 2',
				params: {
					p_0: '2',
				},
			},
			UserDefinedText3: {
				key: 'entityUserDefinedText',
				text: 'User Defined Text 3',
				params: {
					p_0: '3',
				},
			},
			UserDefinedText4: {
				key: 'entityUserDefinedText',
				text: 'User Defined Text 4',
				params: {
					p_0: '4',
				},
			},
			UserDefinedText5: {
				key: 'entityUserDefinedText',
				text: 'User Defined Text 5',
				params: {
					p_0: '5',
				},
			},
			UserDefinedDate1: {
				key: 'entityUserDefinedDate',
				text: 'User Defined Date 1',
				params: {
					p_0: '1',
				},
			},
			UserDefinedDate2: {
				key: 'entityUserDefinedDate',
				text: 'User Defined Date 2',
				params: {
					p_0: '2',
				},
			},
			UserDefinedDate3: {
				key: 'entityUserDefinedDate',
				text: 'User Defined Date 3',
				params: {
					p_0: '3',
				},
			},
			UserDefinedDate4: {
				key: 'entityUserDefinedDate',
				text: 'User Defined Date 4',
				params: {
					p_0: '4',
				},
			},
			UserDefinedDate5: {
				key: 'entityUserDefinedDate',
				text: 'User Defined Date 5',
				params: {
					p_0: '5',
				},
			},
			UserDefinedNumber1: {
				key: 'entityUserDefinedNumber',
				text: 'User Defined Number 1',
				params: {
					p_0: '1',
				},
			},
			UserDefinedNumber2: {
				key: 'entityUserDefinedNumber',
				text: 'User Defined Number 2',
				params: {
					p_0: '2',
				},
			},
			UserDefinedNumber3: {
				key: 'entityUserDefinedNumber',
				text: 'User Defined Number 3',
				params: {
					p_0: '3',
				},
			},
			UserDefinedNumber4: {
				key: 'entityUserDefinedNumber',
				text: 'User Defined Number 4',
				params: {
					p_0: '4',
				},
			},
			UserDefinedNumber5: {
				key: 'entityUserDefinedNumber',
				text: 'User Defined Number 5',
				params: {
					p_0: '5',
				},
			},
			DangerClassFk: {
				key: 'entityDangerClass',
				text: 'Dangerous Goods Class',
			},
			PackageTypeFk: {
				key: 'entityPackagingType',
				text: 'Packaging Type',
			},
			UomVolumeFk: {
				key: 'entityUomVolume',
				text: 'Uom Volume',
			},
			Volume: {
				key: 'entityVolume',
				text: 'Volume',
			},
		}),
		//TODO: should not use the text string from procurement. Please add the text into material instead. And in the future procurement will reuse the text string here.
		...prefixAllTranslationKeys('procurement.stock.', {
			MinQuantity: {
				key: 'stocktotal.MinQuantity',
				text: 'Min Quantity',
			},
		}),
	};

	/*
	 * get the layout labels for material record
	 */
	public getCommonLabel(): { [key: string]: Translatable } {
		return this.commonLabel;
	}

	/**
	 * Generate layout config
	 */
	public async generateLayout(customLayoutConfig: ILayoutConfiguration<IMaterialEntity>): Promise<ILayoutConfiguration<IMaterialEntity>> {
		const labelsResult: { [key: string]: Translatable } = {};
		const overloadsResult = {} as { [key in keyof Partial<IMaterialEntity>]: FieldOverloadSpec<IMaterialEntity> };

		if (customLayoutConfig.groups) {
			const attributes: (keyof IMaterialEntity | string)[] = this.getAllAttributesFromGroups(customLayoutConfig.groups);
			const customOverloads = customLayoutConfig.overloads;
			const commonOverLoad = await this.getCommonOverLoad();
			attributes.forEach((attr) => {
				let overload = get(commonOverLoad, attr);
				if (!isNil(overload)) {
					const customOverload = get(customOverloads, attr, null);
					overload = customOverload ? { ...(overload as object), ...(customOverload as object) } : overload;
					set(overloadsResult, attr, overload);
				}
				const label = get(this.commonLabel, attr);
				if (!isNil(label)) {
					set(labelsResult, attr, label);
				}
			});

			customLayoutConfig.overloads = overloadsResult;
			customLayoutConfig.labels = labelsResult;
		} else {
			throw new Error('Groups are not defined in the layout configuration');
		}

		return customLayoutConfig;
	}

	/**
	 * Generate grid config
	 */
	public async generateGridConfig(customLayoutConfig: ILayoutConfiguration<IMaterialEntity>): Promise<ColumnDef<IMaterialEntity>[]> {
		//const layout = this.generateLayout();
		//const schema = await this.schemaService.getSchema(this.entitySchemaId);
		// TODO need generateGridConfig as public
		//return this.entityGridService.generateGridConfig(schema, layout);
		return [];
	}

	/**
	 * Generate form config
	 */
	public async generateFormConfig(customLayoutConfig: ILayoutConfiguration<IMaterialEntity>): Promise<IFormConfig<IMaterialEntity>> {
		const formConfig = { rows: [] };
		//const validationService = ServiceLocator.injector.get(BasicsMaterialCreateMaterialValidationService);
		//TODO should have common function to bind validator
		formConfig.rows.forEach((r) => {
			// TODO: fix this
			//r.validator = validationService.getValidationFunc(r.model as string);
		});
		return { ...formConfig, ...{ showGrouping: false } };
	}

	private getAllAttributesFromGroups(groups: ILayoutGroup<IMaterialEntity>[]): (keyof IMaterialEntity | string)[] {
		let attributes: (keyof IMaterialEntity | string)[] = [];
		groups.forEach((g) => {
			attributes = union(attributes, g.attributes);
		});
		return attributes;
	}
}
