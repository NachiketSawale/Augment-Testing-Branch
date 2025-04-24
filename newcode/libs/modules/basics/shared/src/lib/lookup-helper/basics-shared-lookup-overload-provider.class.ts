/*
 * Copyright(c) RIB Software GmbH
 */

import {
	TypedConcreteFieldOverload,
	createLookup,
	FieldType,
	ILookupServerSideFilter,
	ILookupClientSideFilter,
	LookupSimpleEntity,
	UiCommonCountryLookupService,
	IDialogOptions,
	ICustomDialog,
	ILookupViewResult,
	ILookupDialogView,
	ILookupDialogOptions,
	ILookupFieldOverload,
} from '@libs/ui/common';
import {
	IBasicsClerkEntity,
	IBasicsCountryEntity,
	IBasicsCurrencyEntity,
	IMdcSalesTaxCodeEntity,
	IBasicsUomEntity,
	ICostCodeEntity,
	IMaterialCatalogLookupEntity,
	IMaterialSimpleLookupEntity,
	IMaterialGroupLookupEntity,
	IMaterialDiscountGroupLookupEntity,
	IMaterialPriceVersionLookupEntity,
	IBasicsConfigRfqReportsEntity,
	ICompanyEntity,
	IRubricCategoryEntity,
	IProcurementConfigurationToBillingSchemaLookupEntity,
	IBasicsAssetMasterEntity
} from '@libs/basics/interfaces';
import { BasicsSharedUomLookupService } from '../lookup-services/basics-uom-lookup.service';
import { BasicsSharedCountryLookupService } from '../lookup-services/basics-country-lookup.service';
import { BasicsSharedCustomizeLookupOverloadProvider } from './basics-shared-customize-lookup-overload-provider.class';
import { ITaxCodeEntity } from '../lookup-services/entities/tax-code-entity.interface';
import { BasicsSharedClerkLookupService } from '../lookup-services/basics-clerk-lookup.service';
import { BasicsSharedTelephoneDialogComponent, TelephoneEntity } from '../telephone-lookup';
import { createFormDialogLookupProvider } from '../form-dialog-lookup-base';
import { IBasicsCurrencyLookupService } from '../lookup-services/basics-currency-lookup.service';
import { BasicsSharedTaxCodeLookupService } from '../lookup-services/tax-code-lookup.service';
import { BasicsSharedPaymentTermLookupService, IPaymentTermEntity } from '../lookup-services/payment-term-lookup.service';
import { BasicsSharedAddressDialogComponent } from '../address-lookup';
import { BasicsSharedProcurementStructureLookupService } from '../lookup-services/procurement-structure-lookup.service';
import { BasicsShareBillingSchemaLookupService } from '../lookup-services/basics-billing-schema-lookup.service';
import { IBillingSchemaEntity } from '../lookup-services/entities/billing-schema-entity.interface';
import { BasicsSharedMaterialLookupService } from '../material-lookup';
import { IMaterialSearchEntity } from '../material-search';
import { BasicsSharedMaterialCatalogLookupService } from '../lookup-services/basics/material/basics-material-catalog-lookup.service';
import { BasicsSharedSalesTaxCodeLookupService } from '../lookup-services/sales-tax-code-lookup.service';
import { BasicsSharedCostCodeLookupService } from '../lookup-services/basics-cost-code-lookup.service';
import { BasicsSharedCommonLogLevelLookupService } from '../lookup-services/basics-common-log-level-lookup.service';
import { INamedItemEntity } from '@libs/platform/common';
import { BasicsCompanyLookupService } from '../lookup-services/company-lookup.service';
import { BasicsSharedPriceConditionLookupService } from '../lookup-services/price-condition-lookup.service';
import { PriceConditionEntity } from '../lookup-services/entities/price-condition-entity.class';
import { BasicsSharedMaterialSimpleLookupService } from '../lookup-services/basics/material/basics-material-simple-lookup.service';
import { BasicsSharedMaterialGroupLookupService } from '../lookup-services/basics/material/basics-material-group-lookup.service';
import { BasicsSharedMaterialDiscountGroupLookupService } from '../lookup-services/basics/material/basics-material-discount-group-lookup.service';
import { BasicsSharedRoundingLogicTypeLookupService } from '../lookup-services/common/rounding-logic-type-lookup.service';
import { BasicsGeneralsValueTypeLookupService } from '../lookup-services/basics-generals-value-type-lookup.service';
import { ProcurementConfigurationEntity } from '../lookup-services/entities/procurement-configuration-entity';
import { BasicsSharedProcurementConfigurationLookupService } from '../lookup-services/basics/procurement-configuration-lookup.service';
import { BasicsSharedModuleLookupService } from '../lookup-services/basic-module-lookup.service';
import { BasicsMaterialWeightNumberLookupService } from '../lookup-services/basics/material/basics-material-weight-number-lookup.service';
import { BasicsSharedMaterialPriceVersionViewLookupService } from '../lookup-services/basics/material/basics-material-price-version-view-lookup.service';
import { BasicsSharedPrcIncotermLookupService } from '../lookup-services/prcincoterm-lookup.service';
import { BasicsSharedProcurementStrategyLookupService } from '../lookup-services/procurement-strategy-lookup.service';
import { BasicsSharedProcurementConfigurationTotalKindLookupService } from '../lookup-services/basics/procurement-configuration-total-kind-lookup.service';
import { BasicsSharedRubricSimpleLookupService } from '../lookup-services/rubric-simple-lookup.service';
import { BasicsSharedProcurementConfigurationModuleTabLookupService } from '../lookup-services/basics/procurement-configuration-moduletab-lookup.service';
import { BasicsSharedProcurementConfigurationRfqReportsLookupService } from '../lookup-services/basics/procurement-configuration-rfq-reports-lookup.service';
import { BasicsShareBankLookupService } from '../lookup-services/basics-bank-lookup.service';
import { IControllingUnitEntity } from '../lookup-services/entities/controlling-unit-entity';
import { BasicsShareControllingUnitLookupService } from '../lookup-services/controlling-unit-lookup.service';
import { BasicsSharedRubricCategoryByRubricAndCompanyLookupService } from '../lookup-services/rubric-category-by-rubric-and-company-lookup.service';
import { ProviderToken } from '@angular/core';
import { BasicsSharedGuarantorTypeLookupService } from '../lookup-services/guarantor-type-lookup.service';
import { BasicsSharedCurrencyLookupService } from '../lookup-services/currency-lookup.service';
import { BasicsSharedProcurementStructureEventTypeLookupService } from '../lookup-services/procurement-structure-event-type-lookup.service';
import { BasicsSharedProcurementConfigurationHeaderLookupService } from '../lookup-services/basics/procurement-configuration-header-lookup.service';
import { BasicsSharedContractStatusLookupService } from '../lookup-services/contract-status-lookup.service';
import { BasicsShareProcurementConfigurationToBillingSchemaLookupService } from '../lookup-services/basics/procurement-configuration-to-billing-schema-lookup.service';
import { BasicsSharedBasCurrencyLookupService } from '../lookup-services/bas-currency-lookup.service';
import { CurrencyEntity } from '../lookup-services/entities/currency-entity.class';
import { BasicsSharedLedgerContextByCompanyLookupService } from '../lookup-services/basic-ledger-context-by-company-lookup.service';
import { BasicsShareCompanyYearLookupService } from '../lookup-services/basics-company-year-lookup.service';
import { BasicsCompanyPeriodLookupService } from '../lookup-services/basics-company-period-lookup.service';
import { BasicsSharedProcurementStructureTypeLookupService } from '../lookup-services/procurement-structure-type-lookup.service';
import { BasicsSharedUserFormFieldLookupService } from '../user-form';
import { IFormFieldEntity } from '../user-form/model/entities/form-field-entity.interface';
import { BasicsSharedAssetMasterLookupService } from '../lookup-services/basics/assetmaster/basics-asset-master-lookup.service';
import { createAdditionalLookupDescriptionField } from '../lookup-layout';

export class BasicsSharedLookupOverloadProvider extends BasicsSharedCustomizeLookupOverloadProvider {
	public static provideUoMLookupOverload<T extends object>(showClearBtn: boolean, clientSideFilter?: ILookupClientSideFilter<IBasicsUomEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IBasicsUomEntity>({
				dataServiceToken: BasicsSharedUomLookupService,
				showClearButton: showClearBtn,
				clientSideFilter: clientSideFilter
			}),
		};
	}

	public static provideUoMReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IBasicsUomEntity>({
				dataServiceToken: BasicsSharedUomLookupService,
				showClearButton: false,
			}),
		};
	}

	public static provideRoundingLogicTypeLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, LookupSimpleEntity>({
				dataServiceToken: BasicsSharedRoundingLogicTypeLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	public static provideRoundingLogicTypeReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, LookupSimpleEntity>({
				dataServiceToken: BasicsSharedRoundingLogicTypeLookupService,
				showClearButton: false,
			}),
		};
	}


	public static provideCountryLookupOverload<T extends object>(showClearBtn: boolean, disableDataCaching?: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IBasicsCountryEntity>({
				dataServiceToken: BasicsSharedCountryLookupService,
				showClearButton: showClearBtn,
				showDescription: true,
				disableDataCaching: disableDataCaching,
				descriptionMember: 'DescriptionInfo.Translated',
			}),
		};
	}

	public static provideCountryReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IBasicsCountryEntity>({
				dataServiceToken: BasicsSharedCountryLookupService,
				showClearButton: false,
				showDescription: true,
				descriptionMember: 'DescriptionInfo.Translated',
			}),
		};
	}

	public static provideCostCodeLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, ICostCodeEntity>({
				dataServiceToken: BasicsSharedCostCodeLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	public static provideCostCodeReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, ICostCodeEntity>({
				dataServiceToken: BasicsSharedCostCodeLookupService,
				showClearButton: false,
			}),
		};
	}

	/*
	 *	Tax Code Lookup
	 */
	public static provideTaxCodeListLookupOverload<T extends object>(showClearBtn: boolean, clientSideFilter?: ILookupClientSideFilter<ITaxCodeEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, ITaxCodeEntity>({
				dataServiceToken: BasicsSharedTaxCodeLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: 'cloud.common.entityTaxCodeDescription',
					},
					column: true,
					singleRow: true,
				},
			],
		};
	}

	public static provideTaxCodeListReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, ITaxCodeEntity>({
				dataServiceToken: BasicsSharedTaxCodeLookupService,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: 'cloud.common.entityTaxCodeDescription',
					},
					column: true,
					singleRow: true,
				},
			],
		};
	}

	/*
	 *	Tax Code Lookup
	 */
	public static providePaymentTermListLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IPaymentTermEntity>({
				dataServiceToken: BasicsSharedPaymentTermLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	public static providerBasicsClerkLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string, column?: boolean, readOnly?: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readOnly ?? false,
			lookupOptions: createLookup<T, IBasicsClerkEntity>({
				dataServiceToken: BasicsSharedClerkLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityClerkName',
					},
					column: column ?? true,
					singleRow: true,
				},
			],
		};
	}

	public static providerTelephoneDialogComponentOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.CustomComponent,
			componentType: BasicsSharedTelephoneDialogComponent,
			providers: createFormDialogLookupProvider<T, TelephoneEntity>({
				showSearchButton: showClearBtn,
				showPopupButton: true,
			}),
		};
	}

	public static providerAddressDialogComponentOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.CustomComponent,
			componentType: BasicsSharedAddressDialogComponent,
			providers: createFormDialogLookupProvider({
				showSearchButton: showClearBtn,
				showPopupButton: true,
			}),
		};
	}

	public static providerBasicsProcurementStructureLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedProcurementStructureLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					id: 'structureDesc',
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: 'cloud.common.entityStructureDescription',
						text: 'Structure Description',
					},
					column: true,
					singleRow: true,
				},
			],
		};
	}

	public static providerBasicsProcurementStructureTypeLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedProcurementStructureTypeLookupService,
				showClearButton: showClearBtn,
			})
		};
	}

	/*
	 *	Billing Schema Lookup
	 */
	public static provideBillingSchemaLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IBillingSchemaEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IBillingSchemaEntity>({
				dataServiceToken: BasicsShareBillingSchemaLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	/**
	 * @deprecated will be removed later, use the new {@link IBasicsCurrencyLookupProvider.provideCurrencyLookupOverload} in basics\interfaces instead.
	 */
	public static provideCurrencyLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IBasicsCurrencyEntity>({
				dataServiceToken: IBasicsCurrencyLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	/**
	 * @deprecated will be removed later, use the new {@link IBasicsCurrencyLookupProvider.provideCurrencyReadonlyLookupOverload} in basics\interfaces instead.
	 */
	public static provideCurrencyReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IBasicsCurrencyEntity>({
				dataServiceToken: IBasicsCurrencyLookupService,
				showClearButton: false,
			}),
		};
	}

	/*
	 * Material lookups
	 */
	public static provideMaterialLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string, dialogOptions?: (Partial<IDialogOptions<ICustomDialog<ILookupViewResult<IMaterialSearchEntity>, ILookupDialogView<IMaterialSearchEntity>>>> & ILookupDialogOptions)): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IMaterialSearchEntity>({
				dataServiceToken: BasicsSharedMaterialLookupService,
				showClearButton: showClearBtn,
				dialogOptions: dialogOptions
			}),
			additionalFields: descriptionColumnKey ? [
				{
					displayMember: 'Code',
					label: {
						text: 'Code',
						key: descriptionColumnKey ?? 'cloud.common.entityCode',
					},
					column: true,
					singleRow: true,
				},
			] : [],
		};
	}

	public static provideSimpleMaterialLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string, serverSideFilter?: ILookupServerSideFilter<IMaterialSimpleLookupEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IMaterialSimpleLookupEntity>({
				dataServiceToken: BasicsSharedMaterialSimpleLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: descriptionColumnKey ?? 'basics.common.entityMaterialDescription',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static provideMaterialCatalogLookupOverload<T extends object>(
		showClearBtn: boolean,
		descriptionColumnKey?: string,
		serverSideFilter?: ILookupServerSideFilter<IMaterialCatalogLookupEntity, T>,
		dialogHeaderText?: string,
	): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IMaterialCatalogLookupEntity>({
				dataServiceToken: BasicsSharedMaterialCatalogLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
				dialogOptions: {
					headerText: {
						key: dialogHeaderText ?? 'basics.material.materialCatalog',
					},
				},
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityMaterialCatalogDescription',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	//TODO showClearBtn is not needed for readonly lookup over load.
	public static provideMaterialCatalogReadOnlyLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IMaterialCatalogLookupEntity>({
				dataServiceToken: BasicsSharedMaterialCatalogLookupService,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityMaterialCatalogDescription',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static provideMaterialGroupLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IMaterialGroupLookupEntity>({
				dataServiceToken: BasicsSharedMaterialGroupLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: descriptionColumnKey ?? 'basics.material.record.materialGroupDescription',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	// Lookup overlod for Material weight number
	public static provideMaterialWeightNumberLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsMaterialWeightNumberLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	// Lookup overlod for Material price version view
	public static provideMaterialPriceVersionLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IMaterialPriceVersionLookupEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialPriceVersionViewLookupService,
				showClearButton: showClearBtn,
				serverSideFilter
			}),
		};
	}

	// Lookup overlod for Prcincoterm
	public static providePrcIncotermLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedPrcIncotermLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: descriptionColumnKey ?? 'cloud.common.entityStructureDescription',
					column: true,
					singleRow: true,
				},
			],
		};
	}

	// Lookup overlod for Procurement structure
	public static provideProcurementStructureLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedProcurementStructureLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: 'cloud.common.entityStructureDescription',
					column: true,
					singleRow: true,
				},
			],
		};
	}

	public static provideMaterialDiscountGroupLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IMaterialDiscountGroupLookupEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IMaterialDiscountGroupLookupEntity>({
				dataServiceToken: BasicsSharedMaterialDiscountGroupLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: 'basics.material.record.discountGroupDescription',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static provideSalesTaxCodeLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IMdcSalesTaxCodeEntity>({
				dataServiceToken: BasicsSharedSalesTaxCodeLookupService,
				showDescription: true,
				descriptionMember: 'DescriptionInfo.Translated',
				showClearButton: showClearBtn,
			}),
		};
	}

	public static provideBasicCommonLogevelLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup<T, INamedItemEntity>({
				dataServiceToken: BasicsSharedCommonLogLevelLookupService,
				showDescription: true,
				descriptionMember: 'DescriptionInfo.Translated',
				showClearButton: showClearBtn,
			}),
		};
	}

	public static providePaymentTermLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedPaymentTermLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityPaymentTermDescription',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static provideCompanyReadOnlyLookupOverload<T extends object>(descriptionColumnKey?: string): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsCompanyLookupService,
				readonly: true,
			}),
			additionalFields: [
				{
					displayMember: 'CompanyName',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityCompanyName',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	// Common lookup for Company used in business partner's certificate wizard
	public static provideCertificateCompanyLookupOverload<T extends object>(readonly?: boolean, showDescription?: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsCompanyLookupService,
				readonly: readonly ?? true,
				showDescription: showDescription ?? false,
				descriptionMember: showDescription ? 'CompanyName' : undefined,
			}),
		};
	}

	public static providePriceConditionLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup<T, PriceConditionEntity>({
				dataServiceToken: BasicsSharedPriceConditionLookupService,
				showClearButton: showClearBtn,
				displayMember: 'DescriptionInfo.Translated',
			}),
		};
	}

	/*
	 *Procurement Configuration
	 */
	public static provideProcurementConfigurationLookupOverload<T extends object>(serverSideFilter?: ILookupServerSideFilter<ProcurementConfigurationEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, ProcurementConfigurationEntity>({
				dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	// Lookup provider for Procurement Event type
	public static providePrcEventTypeLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedProcurementStructureEventTypeLookupService,
			}),
		};
	}

	// Lookup provider for LedgerContext by company context
	public static provideLedgerContextByCompanyLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedLedgerContextByCompanyLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	// Lookup overload for Procurement Configuration Header
	public static provideProcurementConfigurationHeaderLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedProcurementConfigurationHeaderLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: descriptionColumnKey,
					},
					column: false,
					singleRow: true,
				},
			],
		};
	}


	/*
	 * all Modules Lookup
	 */
	public static provideModuleLookupOverload<T extends object>(showClearBtn: boolean, clientSideFilter?: ILookupClientSideFilter<LookupSimpleEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, LookupSimpleEntity>({
				dataServiceToken: BasicsSharedModuleLookupService,
				showClearButton: showClearBtn,
				displayMember: 'Description.Description',
				clientSideFilter: clientSideFilter,
			}),
		};
	}

	public static provideGeneralsValueTypeReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, LookupSimpleEntity>({
				dataServiceToken: BasicsGeneralsValueTypeLookupService,
			}),
		};
	}

	public static providePrcStrategyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, LookupSimpleEntity>({
				dataServiceToken: BasicsSharedProcurementStrategyLookupService,
				showClearButton: false,
			}),
		};
	}

	public static providePrcTotalKindLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, LookupSimpleEntity>({
				dataServiceToken: BasicsSharedProcurementConfigurationTotalKindLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	public static provideSimpleModuleLookupOverload<T extends object>(clientSideFilter?: ILookupClientSideFilter<LookupSimpleEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, LookupSimpleEntity>({
				dataServiceToken: BasicsSharedRubricSimpleLookupService,
				showClearButton: false,
				clientSideFilter: clientSideFilter,
			}),
		};
	}

	// Common lookup for Rubric category
	public static provideRubricCategoryByCompanyLookupOverload<T extends object>(readonly?: boolean, serverSideFilter?: ILookupServerSideFilter<IRubricCategoryEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readonly ?? false,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
				serverSideFilter,
			}),
		};
	}

	// Common lookup for Controlling unit
	public static provideControllingUnitFkLookupOverload<T extends object>(displayMember?: string, readonly?: boolean, serverSideFilter?: ILookupServerSideFilter<IControllingUnitEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readonly ?? false,
			lookupOptions: createLookup({
				dataServiceToken: BasicsShareControllingUnitLookupService,
				displayMember,
				serverSideFilter,
			}),
		};
	}

	public static provideTabNameLookupOverload<T extends object>(serverSideFilter?: ILookupServerSideFilter<LookupSimpleEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, LookupSimpleEntity>({
				dataServiceToken: BasicsSharedProcurementConfigurationModuleTabLookupService,
				showClearButton: false,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	public static provideReportNameLookupOverload<T extends object>(serverSideFilter?: ILookupServerSideFilter<IBasicsConfigRfqReportsEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IBasicsConfigRfqReportsEntity>({
				dataServiceToken: BasicsSharedProcurementConfigurationRfqReportsLookupService,
				showClearButton: false,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	/*
	 * Lookup provider for Incoterms
	 */
	public static provideIncotermsLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedPrcIncotermLookupService,
				showClearButton: showClearBtn,
				displayMember: 'DescriptionInfo.Translated',
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: descriptionColumnKey,
					},
					column: true,
					singleRow: true,
				},
			],
		};
	}

	public static provideCompanyLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string, serverSideFilter?: ILookupServerSideFilter<ICompanyEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsCompanyLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
			additionalFields: [
				{
					displayMember: 'CompanyName',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityCompanyName',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static provideBankLookupOverload<T extends object>(showClearBtn: boolean,): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsShareBankLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	public static provideCommonCountryLookupOverload<T extends object>(showClearBtn: boolean, readOnly?: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readOnly ?? false,
			lookupOptions: createLookup({
				dataServiceToken: UiCommonCountryLookupService,
				showClearButton: showClearBtn,
			}),

		};
	}

	public static provideControllingUnitLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string, readOnly?: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readOnly ?? false,
			lookupOptions: createLookup<T, IControllingUnitEntity>({
				dataServiceToken: BasicsShareControllingUnitLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'CompanyName',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityControllingUnitDesc',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static providerBasicsRubricCategoryByRubricAndCompanyLookupOverload<T extends object>(showClearBtn: boolean, disableDataCaching?: boolean, descriptionColumnKey?: string, serverSideFilterToken?: ProviderToken<ILookupServerSideFilter<IRubricCategoryEntity, T>>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
				showClearButton: showClearBtn,
				disableDataCaching: disableDataCaching,
				serverSideFilterToken: serverSideFilterToken
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityRubricCategoryDescription',
					},
					column: true,
					singleRow: true,
				},
			],
		};
	}

	public static provideGuarantorTypeLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedGuarantorTypeLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	public static provideCurrencyTypeLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCurrencyLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	// Provide lookup overload for Contract Status
	public static provideContractStatusLookupOverload<T extends object>(showClearBtn: boolean, readonly?: boolean, descriptionColumnKey?: string): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readonly ?? false,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedContractStatusLookupService,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: descriptionColumnKey ?? 'cloud.common.entityDescription',
					},
					column: true,
					singleRow: true,
				},
			],
		};
	}

	// Common lookup for Procurement Configuration to Billing schema
	public static providePrcBillingSchemaLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IProcurementConfigurationToBillingSchemaLookupEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsShareProcurementConfigurationToBillingSchemaLookupService,
				showClearButton: showClearBtn,
				serverSideFilter,
			}),
		};
	}

	public static provideCompanyYearLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsShareCompanyYearLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	public static provideCompanyPeriodLookupOverload<T extends object>(showClearBtn: boolean): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsCompanyPeriodLookupService,
				showClearButton: showClearBtn,
			}),
		};
	}

	// Common lookup for Shared Bas Currency
	public static provideBasCurrencyLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<CurrencyEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedBasCurrencyLookupService,
				showClearButton: showClearBtn,
				serverSideFilter,
			}),
		};
	}

	// Common lookup for Shared UserForm Field
	public static provideUserFormFieldLookupOverload<T extends object>(showClearBtn: boolean, clientSideFilter?: ILookupClientSideFilter<IFormFieldEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedUserFormFieldLookupService,
				showClearButton: showClearBtn,
				clientSideFilter,
			}),
		};
	}

	// Common lookup for Shared AssetMaster
	public static provideAssetMasterLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IBasicsAssetMasterEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedAssetMasterLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	/**
	 * Provides a lookup overload for the Sales Tax Group with additional description column.
	 * todo: not sure how customize lookup provider would handle additional lookup options currently, it will be removed once these additional options could be supported in customize lookup provider.
	 * @param showClearBtn
	 */
	public static provideAdditionalSalesTaxGroupLookupOverload<T extends object>(showClearBtn: boolean): ILookupFieldOverload<T> {
		return <ILookupFieldOverload<T>>{
			...BasicsSharedLookupOverloadProvider.provideSalesTaxGroupLookupOverload(showClearBtn),
			additionalFields: [createAdditionalLookupDescriptionField('procurement.common.entityMdcSalesTaxGroupFk')],
		};
	}

	/**
	 * Readonly material lookup provider
	 */
	public static provideMaterialReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IMaterialSearchEntity>({
				dataServiceToken: BasicsSharedMaterialLookupService,
				showClearButton: false,
			}),
			additionalFields: [createAdditionalLookupDescriptionField('procurement.common.prcItemMaterialStockFk')],
		};
	}
}