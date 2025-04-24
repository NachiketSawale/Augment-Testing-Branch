/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';
import { IConTransactionEntity } from '../model/entities/con-transaction-entity.interface';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';

/**
 * Transaction layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractTransactionLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateConfig(): Promise<ILayoutConfiguration<IConTransactionEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IConTransactionEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: [
						'TransactionId',
						'CompanyFk',
						'CompanyInvoiceFk',
						'ConHeaderFk',
						'PrcConfigurationFk',
						'Isconsolidated',
						'Ischange',
						'Currency',
						'ConStatusFk',
						'Code',
						'Description',
						'DateOrdered',
						'DateEffective',
						'DateReported',
						'BusinessPartnerFk',
						'SupplierFk',
						'ContactFk',
						'BankFk',
						'VatGroupFk',
						'PaymentTermFiFk',
						'PaymentTermPaFk',
						'PaymentTermAdFk',
						'Incoterm',
						'DateDelivery',
						'AddressFk',
						'ItemReference',
						'Amount',
						'VatAmount',
						'AmountOc',
						'VatAmountOc',
						'IncAmount',
						'IncVatAmount',
						'IncAmountOc',
						'IncVatAmountOc',
						'IncQuantity',
						'Quantity',
						'Price',
						'VatPrice',
						'PriceOc',
						'VatPriceOc',
						'NominalAccount',
						'NominalDimension1',
						'NominalDimension2',
						'NominalDimension3',
						'TaxCodeFk',
						'TaxCodeMatrixFk',
						'VatPercent',
						'VatCode',
						'ControllingUnitFk',
						'ControllingUnitCode',
						'ControllingUnitAssign01',
						'ControllingunitAssign01desc',
						'ControllingUnitAssign02',
						'ControllingunitAssign02desc',
						'ControllingUnitAssign03',
						'ControllingunitAssign03desc',
						'ControllingUnitAssign04',
						'ControllingunitAssign04desc',
						'ControllingUnitAssign05',
						'ControllingunitAssign05desc',
						'ControllingUnitAssign06',
						'ControllingunitAssign06desc',
						'ControllingUnitAssign07',
						'ControllingunitAssign07desc',
						'ControllingUnitAssign08',
						'ControllingunitAssign08desc',
						'ControllingUnitAssign09',
						'ControllingunitAssign09desc',
						'ControllingUnitAssign10',
						'ControllingunitAssign10desc',
						'PrcItemFk',
						'MaterialFk',
						'ItemDescription1',
						'ItemDescription2',
						'ItemSpecification',
						'ItemUomQuantity',
						'IsSuccess',
						'HandoverId',
						'Orderno',
						'Userdefined1',
						'Userdefined2',
						'Userdefined3',
						'ReturnValue',
						'IncotermCode',
						'TaxCodeMatrixCode',
						'AddressEntity',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					TransactionId: { key: 'transaction.transactionId', text: 'Transaction Id' },
					CompanyFk: {
						key: 'entityCompany',
						text: 'Company Code',
					},
					CompanyInvoiceFk: {
						key: 'transaction.conHeaderCompanyInvoicedCode',
						text: 'Invoiced Company Code',
					},
					ConHeaderFk: {
						key: 'entityConHeaderFk',
						text: 'Contract',
					},
					PrcConfigurationFk: {
						key: 'entityPrcConfigurationFk',
						text: 'Configuration',
					},
					Isconsolidated: {
						key: 'transaction.isConsolidated',
						text: 'Consolidated',
					},
					Ischange: {
						key: 'transaction.isChange',
						text: 'Change',
					},
					Currency: { key: 'transaction.currency', text: 'Currency' },
					ConStatusFk: {
						key: 'transaction.conStatus',
						text: 'Contract Status',
					},
					DateOrdered: {
						key: 'transaction.dateOrdered',
						text: 'Date Ordered',
					},
					DateEffective: {
						key: 'transaction.dateEffective',
						text: 'Date Effective',
					},
					DateReported: {
						key: 'transaction.dateReported',
						text: 'Date Reported',
					},
					ContactFk: {
						key: 'ConHeaderContact',
						text: 'Contact',
					},
					VatGroupFk: {
						key: 'entityVatGroup',
						text: 'Vat Group',
					},
					DateDelivery: {
						key: 'entityDateDelivered',
						text: 'Date Delivered',
					},
					ItemReference: {
						key: 'transaction.entityItemreference',
						text: 'Item reference',
					},
					Amount: { key: 'transaction.amount', text: 'Amount' },
					AmountOc: { key: 'transaction.amountOc', text: 'Amount Oc' },
					VatAmount: {
						key: 'transaction.vatAmount',
						text: 'Vat Amount',
					},
					VatAmountOc: {
						key: 'transaction.vatAmountOc',
						text: 'Vat Amount Oc',
					},
					IncAmount: {
						key: 'transaction.incAmount',
						text: 'Inc Amount',
					},
					IncAmountOc: {
						key: 'transaction.incAmountOc',
						text: 'Inc Amount Oc',
					},
					IncVatAmount: {
						key: 'transaction.incVatAmount',
						text: 'Inc Vat Amount',
					},
					IncVatAmountOc: {
						key: 'transaction.incVatAmountOC',
						text: 'Inc Vat Amount Oc',
					},
					IncQuantity: {
						key: 'transaction.incQuantity',
						text: 'Inc Quantity',
					},
					Quantity: { key: 'transaction.quantity', text: 'Quantity' },
					VatPrice: {
						key: 'transaction.vatPrice',
						text: 'Vat Price',
					},
					PriceOc: { key: 'entityPriceOc', text: 'Price(OC)' },
					VatPriceOc: {
						key: 'transaction.vatPriceOc',
						text: 'Vat Price OC',
					},
					NominalAccount: {
						key: 'transaction.nominalAccount',
						text: 'Nominal Account',
					},
					NominalDimension1: {
						key: 'transaction.nominaldimension1name',
						text: 'Nominal Dimension 1',
					},
					NominalDimension2: {
						key: 'transaction.nominaldimension2name',
						text: 'Nominal Dimension 2',
					},
					NominalDimension3: {
						key: 'transaction.nominaldimension3name',
						text: 'Nominal Dimension 3',
					},
					TaxCodeMatrixCode: {
						key: 'transaction.taxcodematrix',
						text: 'Tax Code Matrix',
					},
					VatCode: {
						key: 'transaction.vatCode',
						text: 'Vat Code',
					},
					ControllingUnitFk: {
						key: 'transaction.controllingUnitCode',
						text: 'Controlling Unit Code',
					},
					ControllingUnitAssign01: {
						key: 'transaction.controllingUnitAssign01',
						text: 'Controlling Unit Assign01',
					},
					ControllingunitAssign01desc: {
						key: 'transaction.controllingUnitAssign01Desc',
						text: 'Controlling Unit Assign01 Description',
					},
					ControllingUnitAssign02: {
						key: 'transaction.controllingUnitAssign02',
						text: 'Controlling Unit Assign02',
					},
					ControllingunitAssign02desc: {
						key: 'transaction.controllingUnitAssign02Desc',
						text: 'Controlling Unit Assign02 Description',
					},
					ControllingUnitAssign03: {
						key: 'transaction.controllingUnitAssign03',
						text: 'Controlling Unit Assign03',
					},
					ControllingunitAssign03desc: {
						key: 'transaction.controllingUnitAssign03Desc',
						text: 'Controlling Unit Assign03 Description',
					},
					ControllingUnitAssign04: {
						key: 'transaction.controllingUnitAssign04',
						text: 'Controlling Unit Assign04',
					},
					ControllingunitAssign04desc: {
						key: 'transaction.controllingUnitAssign04Desc',
						text: 'Controlling Unit Assign04 Description',
					},
					ControllingUnitAssign05: {
						key: 'transaction.controllingUnitAssign05',
						text: 'Controlling Unit Assign05',
					},
					ControllingunitAssign05desc: {
						key: 'transaction.controllingUnitAssign05Desc',
						text: 'Controlling Unit Assign05 Description',
					},
					ControllingUnitAssign06: {
						key: 'transaction.controllingUnitAssign06',
						text: 'Controlling Unit Assign06',
					},
					ControllingunitAssign06desc: {
						key: 'transaction.controllingUnitAssign06Desc',
						text: 'Controlling Unit Assign06 Description',
					},
					ControllingUnitAssign07: {
						key: 'transaction.controllingUnitAssign07',
						text: 'Controlling Unit Assign07',
					},
					ControllingunitAssign07desc: {
						key: 'transaction.controllingUnitAssign07Desc',
						text: 'Controlling Unit Assign07 Description',
					},
					ControllingUnitAssign08: {
						key: 'transaction.controllingUnitAssign08',
						text: 'Controlling Unit Assign08',
					},
					ControllingunitAssign08desc: {
						key: 'transaction.controllingUnitAssign08Desc',
						text: 'Controlling Unit Assign08 Description',
					},
					ControllingUnitAssign09: {
						key: 'transaction.controllingUnitAssign09',
						text: 'Controlling Unit Assign09',
					},
					ControllingunitAssign09desc: {
						key: 'transaction.controllingUnitAssign09Desc',
						text: 'Controlling Unit Assign09 Description',
					},
					ControllingUnitAssign10: {
						key: 'transaction.controllingUnitAssign10',
						text: 'Controlling Unit Assign10',
					},
					ControllingunitAssign10desc: {
						key: 'transaction.controllingUnitAssign10Desc',
						text: 'Controlling Unit Assign10 Description',
					},
					PrcItemFk: { key: 'entityPrcItemFk', text: 'Contract Item' },
					MaterialFk: { key: 'entityMaterialFk', text: 'Material No.' },
					ItemDescription1: {
						key: 'prcItemDescription1',
						text: 'Description 1',
					},
					ItemDescription2: {
						key: 'prcItemDescription2',
						text: 'Description 2',
					},
					ItemSpecification: {
						key: 'itemSpecification',
						text: 'Specification',
					},
					ItemUomQuantity: {
						key: 'transaction.itemUomQuantity',
						text: 'Item Uom Quantity',
					},
					IsSuccess: {
						key: 'transaction.issuccess',
						text: 'Is Success',
					},
					HandoverId: {
						key: 'transaction.handoverId',
						text: 'Handover Id',
					},
					Orderno: {
						key: 'transaction.orderNo',
						text: 'Order No',
					},
					Userdefined1: {
						key: 'userDefined1',
						text: 'User Defined 1',
					},
					Userdefined2: {
						key: 'userDefined2',
						text: 'User Defined 2',
					},
					Userdefined3: {
						key: 'userDefined3',
						text: 'User Defined 3',
					},
					ReturnValue: {
						key: 'transaction.returnValue',
						text: 'Return Value',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: 'Code' },
					Description: {
						key: 'entityDescription',
						text: 'Description',
					},
					BusinessPartnerFk: {
						key: 'entityBusinessPartner',
						text: 'Business Partner',
					},
					SupplierFk: {
						key: 'entitySupplierCode',
						text: 'Supplier Code',
					},
					BankFk: {
						key: 'entityBankName',
						text: 'Bank',
					},
					PaymentTermFiFk: {
						key: 'entityPaymentTermFI',
						text: 'Payment Term (FI)',
					},
					PaymentTermPaFk: {
						key: 'entityPaymentTermPA',
						text: 'Payment Term (PA)',
					},
					PaymentTermAdFk: {
						key: 'entityPaymentTermAD',
						text: 'Payment Term (AD)',
					},
					Incoterm: { key: 'entityIncoterms', text: 'Incoterm' },
					AddressFk: { key: 'address', text: 'Address' },
					Price: { key: 'entityPrice', text: 'Price' },
					TaxCodeFk: {
						key: 'entityTaxCode',
						text: 'Tax Code',
					},
					VatPercent: {
						key: 'entityVatPercent',
						text: 'Vat Percent',
					},
					IncotermCode: { key: 'entityIncotermCode', text: 'Incoterm Code' },
				}),
			},
			overloads: {
				TransactionId: { readonly: true },
				CompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload('CompanyName'),
				CompanyInvoiceFk: BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload('CompanyName'),
				ConHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'Description'),
				PrcConfigurationFk: BasicsSharedLookupOverloadProvider.provideProcurementConfigurationLookupOverload(),
				Isconsolidated: { readonly: true },
				Ischange: { readonly: true },
				ConStatusFk: BasicsSharedLookupOverloadProvider.provideConStatusReadonlyLookupOverload(),
				Code: { readonly: true },
				Description: { readonly: true },
				DateOrdered: { readonly: true },
				DateEffective: { readonly: true },
				DateReported: { readonly: true },
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({displayMember: 'BusinessPartnerName1'}),
				SupplierFk: bpRelatedLookupProvider.getSupplierLookupOverload({showClearButton: true}),
				ContactFk: bpRelatedLookupProvider.getContactLookupOverload({showClearButton: true, displayMember: 'FullName'}),
				BankFk: bpRelatedLookupProvider.getBankLookupOverload({showClearButton: true, displayMember: 'IbanNameOrBicAccountName'}),
				VatGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupReadonlyLookupOverload(),
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(false, 'Description'),
				PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(false, 'Description'),
				PaymentTermAdFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(false, 'Description'),
				Incoterm: { readonly: true },
				DateDelivery: { readonly: true },
				ItemReference: { readonly: true },
				Amount: { readonly: true },
				VatAmount: { readonly: true },
				AmountOc: { readonly: true },
				VatAmountOc: { readonly: true },
				IncAmount: { readonly: true },
				IncVatAmount: { readonly: true },
				IncAmountOc: { readonly: true },
				IncVatAmountOc: { readonly: true },
				IncQuantity: { readonly: true },
				Quantity: { readonly: true },
				Price: { readonly: true },
				VatPrice: { readonly: true },
				PriceOc: { readonly: true },
				VatPriceOc: { readonly: true },
				NominalAccount: { readonly: true },
				NominalDimension1: { readonly: true },
				NominalDimension2: { readonly: true },
				NominalDimension3: { readonly: true },
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(false),
				VatPercent: { readonly: true },
				VatCode: { readonly: true },
				ControllingUnitFk: BasicsSharedLookupOverloadProvider.provideControllingUnitFkLookupOverload('Code', true),
				ControllingUnitCode: { readonly: true },
				ControllingUnitAssign01: { readonly: true },
				ControllingunitAssign01desc: { readonly: true },
				ControllingUnitAssign02: { readonly: true },
				ControllingunitAssign02desc: { readonly: true },
				ControllingUnitAssign03: { readonly: true },
				ControllingUnitAssign03desc: { readonly: true },
				ControllingUnitAssign04: { readonly: true },
				ControllingUnitAssign04desc: { readonly: true },
				ControllingUnitAssign05: { readonly: true },
				ControllingUnitAssign05desc: { readonly: true },
				ControllingUnitAssign06: { readonly: true },
				ControllingUnitAssign06desc: { readonly: true },
				ControllingUnitAssign07: { readonly: true },
				ControllingUnitAssign07desc: { readonly: true },
				ControllingUnitAssign08: { readonly: true },
				ControllingUnitAssign08desc: { readonly: true },
				ControllingUnitAssign09: { readonly: true },
				ControllingUnitAssign09desc: { readonly: true },
				ControllingUnitAssign10: { readonly: true },
				ControllingUnitAssign10desc: { readonly: true },
				PrcItemFk: {
					type: FieldType.Lookup,
					//todo-need use prcitem lookup
				},
				MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(false),
				ItemDescription1: { readonly: true },
				ItemDescription2: { readonly: true },
				ItemSpecification: { readonly: true },
				ItemUomQuantity: { readonly: true },
				IsSuccess: { readonly: true },
				HandoverId: { readonly: true },
				Orderno: { readonly: true },
				Userdefined1: { readonly: true },
				Userdefined2: { readonly: true },
				Userdefined3: { readonly: true },
				ReturnValue: { readonly: true },
				IncotermCode: { readonly: true },
				AddressFk: BasicsSharedLookupOverloadProvider.providerAddressDialogComponentOverload(true),
			},
		};
	}
}
