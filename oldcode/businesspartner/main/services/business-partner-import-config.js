/**
 * Created by wed on 9/29/2017.
 */
(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerImportFields', ['$translate', function ($translate) {
		return [
			{
				PropertyName: 'TitleFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.lookup.title',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.title'
			},
			{
				PropertyName: 'BusinessPartnerName1',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.businessPartnerName1'
			},
			{
				PropertyName: 'BusinessPartnerName2',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.businessPartnerName2'
			},
			{
				PropertyName: 'BusinessPartnerName3',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.businessPartnerName3'
			},
			{
				PropertyName: 'BusinessPartnerName4',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.businessPartnerName4'
			},
			{
				PropertyName: 'MatchCode',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.matchCode'
			},
			{
				PropertyName: 'CompanyFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.company',
				DisplayMember: 'Company_Name',
				DisplayName: 'businesspartner.main.import.companyName'
			},
			{
				PropertyName: 'Internet',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.internet'
			},
			{
				PropertyName: 'Email',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.email'
			},
			{
				PropertyName: 'Avaid',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.avaid'
			},
			{
				PropertyName: 'TradeRegister',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.tradeRegister'
			},
			{
				PropertyName: 'TradeRegisterNo',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.tradeRegisterNo'
			},
			{
				PropertyName: 'TradeRegisterDate',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'date',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.tradeRegisterDate'
			},
			{
				PropertyName: 'CraftCooperative',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.craftCooperative'
			},
			{
				PropertyName: 'CraftCooperativeType',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.craftCooperativeType'
			},
			{
				PropertyName: 'CraftCooperativeDate',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'date',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.craftCooperativeDate'
			},
			{
				PropertyName: 'IsNationwide',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.isNationwide'
			},
			{
				PropertyName: 'ClerkFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.clerk',
				NotUseDefaultValue: true,
				DisplayMember: 'Code',
				DisplayName: 'cloud.common.entityResponsible'
			},
			{
				PropertyName: 'CustomerAbcFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'businesspartner.customerabc',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.customerAbc'
			},
			{
				PropertyName: 'CustomerSectorFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'businesspartner.customersector',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.customerSector'
			},
			{
				PropertyName: 'CustomerStatusFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'businesspartner.customerstatus',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.customerStatus'
			},
			{
				PropertyName: 'CustomerGroupFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'businesspartner.customergroup',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.customerGroup'
			},
			{
				PropertyName: 'HeaderCustomerBranch',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'businesspartner.customerbranch',
				DisplayMember: 'Code',
				DisplayName: 'businesspartner.main.import.headerCustomerBranch'
			},
			{
				PropertyName: 'LegalFormFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'businesspartner.legal.form',
				DisplayName: 'businesspartner.main.import.legalForm'
			},
			{
				PropertyName: 'CreditstandingFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.creditstanding',
				DisplayMember: 'Code',
				DisplayName: 'businesspartner.main.import.creditStanding'
			},
			{
				PropertyName: 'LanguageFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.language',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.language'
			},
			{
				PropertyName: 'CommunicationChannelFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.communicationchannel',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.communicationChannel'
			},
			{
				PropertyName: 'Salutation',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.salutation'
			},
			{
				PropertyName: 'CrefoNo',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.crefoNo'
			},
			{
				PropertyName: 'BedirektNo',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.bedirektNo'
			},
			{
				PropertyName: 'DunsNo',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.dunsNo'
			},
			{
				PropertyName: 'VatNo',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.vatNo'
			},
			{
				PropertyName: 'TaxNo',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.taxNo'
			},
			{
				PropertyName: 'UserDefined1',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.entityUserDefined1'
			},
			{
				PropertyName: 'UserDefined2',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.entityUserDefined2'
			},
			{
				PropertyName: 'UserDefined3',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.entityUserDefined3'
			},
			{
				PropertyName: 'UserDefined4',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.entityUserDefined4'
			},
			{
				PropertyName: 'UserDefined5',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.entityUserDefined5'
			},
			{
				PropertyName: 'RemarkMarketing',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.remarkMarketing'
			},
			{
				PropertyName: 'Remark1',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.remark1'
			},
			{
				PropertyName: 'Remark2',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.remark2'
			},
			{
				PropertyName: 'PrcIncotermFk',
				EntityName: 'BusinessPartner',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.incoterm',
				DisplayName: 'businesspartner.main.import.prcIncotermFk'
			},
			{
				PropertyName: 'BusinessPartnerImage',
				EntityName: 'Photo',
				GroupName: $translate.instant('businesspartner.main.import.bpGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.businessPartnerImage'
			},
			{
				PropertyName: 'SubsidiaryDescription',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.subsidiaryDescription'
			},
			{
				PropertyName: 'SubsidiaryTelephoneNumber',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.subsidiaryTelephoneNumber'
			},
			{
				PropertyName: 'SubsidiaryTelephoneNumber2',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.subsidiaryTelephoneNumber2'
			},
			{
				PropertyName: 'SubsidiaryTelefax',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.subsidiaryTelefax'
			},
			{
				PropertyName: 'SubsidiaryMobile',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.subsidiaryMobile'
			},
			{
				PropertyName: 'AddressStreet',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.addressStreet'
			},
			{
				PropertyName: 'AddressCity',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.addressCity'
			},
			{
				PropertyName: 'AddressState',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.state',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.addressState'
			},
			{
				PropertyName: 'AddressCountryFk',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.lookup.country',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.addressCountryFk'
			},
			{
				PropertyName: 'SubsidiaryAddressTypeFk',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.lookup.addresstype',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.addressType'
			},
			{
				PropertyName: 'AddressZipCode',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.addressZipCode'
			},
			{
				PropertyName: 'AddressCounty',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.addressCounty'
			},
			{
				PropertyName: 'SubsidiaryEmail',
				EntityName: 'Subsidiary',
				GroupName: $translate.instant('businesspartner.main.import.subsidiaryGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.subsidiaryEmail'
			},
			{
				PropertyName: 'SupplierCode',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.supplierCode'
			},
			{
				PropertyName: 'SupplierDescription',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.supplierDescription'
			},
			{
				PropertyName: 'SupplierDescription2',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.supplierDescription2'
			},
			{
				PropertyName: 'SupplierPaymentTermPA',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.lookup.paymentterm',
				DisplayName: 'businesspartner.main.import.supplierPaymentTermPA',
				DisplayMember: 'Code'
			},
			{
				PropertyName: 'SupplierPaymentTermFI',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.lookup.paymentterm',
				DisplayName: 'businesspartner.main.import.supplierPaymentTermFI',
				DisplayMember: 'Code'
			},
			{
				PropertyName: 'SupplierLegerGroup',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.supplierledgergroup',
				DisplayMember: 'Description',
				FilterKey: 'businesspartner-import-filter-by-context',
				DisplayName: 'businesspartner.main.import.supplierLegerGroup'
			},
			{
				PropertyName: 'SupplierBillingSchema',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.company.internal.lookup.billingschema',
				DisplayMember: 'Description',
				FilterKey: 'businesspartner-import-filter-by-context',
				DisplayName: 'businesspartner.main.import.supplierBillingSchema'
			},
			{
				PropertyName: 'SupplierCustomerNo',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.supplierCustomerNo'
			},
			{
				PropertyName: 'SupplierVatGroup',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.vatgroup',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.supplierVatGroup'
			},
			{
				PropertyName: 'SupplierSubsidiary',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.supplierSubsidiary'
			},
			{
				PropertyName: 'SupplierBusinessPostingGroup',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.postinggroup',
				DisplayMember: 'Description',
				FilterKey: 'businesspartner-import-filter-by-context',
				DisplayName: 'businesspartner.main.import.supplierBusinessPostingGroup'
			},
			{
				PropertyName: 'SupplierBank',
				EntityName: 'Supplier',
				GroupName: $translate.instant('businesspartner.main.import.supplierGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.supplierBank'
			},
			{
				PropertyName: 'CustomerCode',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.customerCode'
			},
			{
				PropertyName: 'CustomerPaymentTermPA',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.lookup.paymentterm',
				DisplayName: 'businesspartner.main.import.customerPaymentTermPA',
				DisplayMember: 'Code'
			},
			{
				PropertyName: 'CustomerPaymentTermFI',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.lookup.paymentterm',
				DisplayName: 'businesspartner.main.import.customerPaymentTermFI',
				DisplayMember: 'Code'
			},
			{
				PropertyName: 'CustomerLedgerGroup',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.customerledgergroup',
				DisplayMember: 'Description',
				FilterKey: 'businesspartner-import-filter-by-context',
				DisplayName: 'businesspartner.main.import.customerLedgerGroup'
			},
			{
				PropertyName: 'CustomerBillingSchema',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.company.internal.lookup.billingschema',
				DisplayMember: 'Description',
				FilterKey: 'businesspartner-import-filter-by-context',
				DisplayName: 'businesspartner.main.import.customerBillingSchema'
			},
			{
				PropertyName: 'CustomerSupplierNo',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.customerSupplierNo'
			},
			{
				PropertyName: 'CustomerBusinessUnit',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.businessunit',
				DisplayMember: 'Code',
				DisplayName: 'businesspartner.main.import.customerBusinessUnit'
			},
			{
				PropertyName: 'CustomerBranch',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'businesspartner.customerbranch',
				DisplayName: 'businesspartner.main.import.customerBranch',
				DisplayMember: 'Code'
			},
			{
				PropertyName: 'CustomerVatGroup',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.vatgroup',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.customerVatGroup'
			},
			{
				PropertyName: 'CustomerSubsidiary',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.customerSubsidiary'
			},
			{
				PropertyName: 'CustomerBusinessPostingGroup',
				EntityName: 'Customer',
				GroupName: $translate.instant('businesspartner.main.import.customerGroupName'),
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.postinggroup',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.customerBusinessPostingGroup'
			},
			{
				PropertyName: 'ContactFirstName',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.contactFirstName'
			},
			{
				PropertyName: 'ContactFamilyName',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.contactFamilyName'
			},
			{
				PropertyName: 'ContactInitial',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.contactInitial'
			},
			{
				PropertyName: 'ContactTelephone',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.contactTelephone'
			},
			{
				PropertyName: 'ContactMobile',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.contactMobile'
			},
			{
				PropertyName: 'ContactEmail',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.contactEmail'
			},
			{
				PropertyName: 'ContactFax',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.contactFax'
			},
			{
				PropertyName: 'ContactTitle',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.contactTitle'
			},
			{
				PropertyName: 'ContactTimeliness',
				EntityName: 'Contact',
				GroupName: $translate.instant('businesspartner.main.import.contactGroupName'),
				DomainName: 'description',
				Editor: 'simplelookup',
				LookupQualifier: 'businesspartner.contact.timeliness',
				DisplayMember: 'Description',
				DisplayName: 'businesspartner.main.import.contactTimeliness'
			},
			{
				PropertyName: 'BusinessPartnerBankName',
				EntityName: 'BusinessPartnerBank',
				GroupName: $translate.instant('businesspartner.main.import.bankGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.businessPartnerBankName'
			},
			{
				PropertyName: 'BusinessPartnerBankIBAN',
				EntityName: 'BusinessPartnerBank',
				GroupName: $translate.instant('businesspartner.main.import.bankGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.businessPartnerBankIBAN'
			},
			{
				PropertyName: 'BusinessPartnerBankAccount',
				EntityName: 'BusinessPartnerBank',
				GroupName: $translate.instant('businesspartner.main.import.bankGroupName'),
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'businesspartner.main.import.businessPartnerBankAccount'
			}
		];
	}]);
})(angular);
