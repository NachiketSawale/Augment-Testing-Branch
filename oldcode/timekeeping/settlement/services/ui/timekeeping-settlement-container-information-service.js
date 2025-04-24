/*
 * $Id: timekeeping-settlement-container-information-service.js 2022-08-30  Sudarshan $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let timekeepingSettlementModule = angular.module('timekeeping.settlement');

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	timekeepingSettlementModule.service('timekeepingSettlementContainerInformationService', TimekeepingSettlementContainerInformationService);

	TimekeepingSettlementContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsCommonComplexFormatter', 'timekeepingCommonLayoutHelperService', 'timekeepingSettlementConstantValues','basicsLookupdataLookupFilterService','resourceCommonLayoutHelperService','basicsLookupdataConfigGeneratorExtension'];

	function TimekeepingSettlementContainerInformationService(_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator,
		basicsCommonComplexFormatter, timekeepingCommonLayoutHelperService, timekeepingSettlementConstantValues,basicsLookupdataLookupFilterService,resourceCommonLayoutHelperService,basicsLookupdataConfigGeneratorExtension) {
		let self = this;
		let guids = timekeepingSettlementConstantValues.uuid.container;
		let dynamicConfigurations = {};

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case guids.settlementList: // timekeepingSettlementListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSettlementServiceInfos(), self.getSettlementLayout);
					break;
				case guids.settlementDetails: // timekeepingSettlementDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSettlementServiceInfos(), self.getSettlementLayout);
					break;
				case guids.itemList: // timekeepingSettlementItemListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getItemServiceInfos(), self.getItemLayout);
					break;
				case guids.itemDetails: // timekeepingSettlementItemDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getItemServiceInfos(), self.getItemLayout);
					break;
				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}
			return config;
		};

		this.getSettlementServiceInfos = function getSettlementServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingSettlementLayoutService',
				dataServiceName: 'timekeepingSettlementDataService',
				validationServiceName: 'timekeepingSettlementValidationService'
			};
		};

		this.getSettlementLayout = function getSettlementLayout() {
			let res = platformLayoutHelperService.getFourGroupsBaseLayout('1.0.0', 'timekeeping.settlement',
				[ 'number', 'companyfk','companychargedfk', 'projectfk', 'languagefk','vouchertypefk','invoicetypefk','currencyfk','clerkfk',
					'taxcodefk','customerfk','businesspartnerfk','paymenttermfk','supplierfk','divisionfk','settlementdate','settlementno','settlementrecipientno',
					'subsidiaryfk','jobtypefk','performefrom','performeto','bookingtext','postingdate','iscanceled','exchangerate','periodfk','settlementstatusfk',
					'vatgroupfk']
			);
			res.overloads = platformLayoutHelperService.getOverloads([ 'companyfk', 'projectfk', 'languagefk', 'settlementstatusfk', 'companychargedfk', 'vouchertypefk', 'invoicetypefk',
				'currencyfk', 'clerkfk', 'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'taxcodefk', 'paymenttermfk',
				'jobtypefk','periodfk','divisionfk', 'vatgroupfk', 'supplierfk'], self);
			return res;
		};


		this.getItemServiceInfos = function getItemServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingSettlementItemLayoutService',
				dataServiceName: 'timekeepingSettlementItemDataService',
				validationServiceName: 'timekeepingSettlementItemValidationService'
			};
		};

		this.getItemLayout = function getItemLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.settlement.item',
				['quantity','uomfk','price','controllingunitfk',
					'controllingunitrevenuefk','taxcodefk','settledfrom','settledto']);
			res.overloads = platformLayoutHelperService.getOverloads(['uomfk', 'controllingunitfk', 'controllingunitrevenuefk','taxcodefk'], self);
			return res;
		};

		this.getOverload = function getOverload(overload) {
			let ovl = null;

			switch (overload) {
				case 'currencyfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
						platformLayoutHelperService.provideCurrencyLookupSpecification()
					);
					break;
				case 'periodfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingPeriodLookupDataService',
						cacheEnable: true
					});
					break;
				case 'divisionfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentdivision');
					break;
				case 'companychargedfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'invoicetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.customize.billinvoicetype'
					);
					break;
				case 'jobtypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.customize.jobtype'
					);
					break;

				case 'settlementstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig(
						'basics.customize.timekeepingsettlementstatus',
						null, {showIcon: true}
					);
					break;
				case 'taxcodefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.taxcode.taxcode'
					);
					break;
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
						platformLayoutHelperService.provideUoMLookupSpecification()
					);
					break;
				case 'vouchertypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.customize.vouchertype'
					);
					break;
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload();
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;

				case 'businesspartnerfk':
					ovl =
						platformLayoutHelperService.provideBusinessPartnerLookupOverload();
					break;
				case 'clerkfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'languagefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.lookup.language'
					);
					break;
				case 'paymenttermfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.lookup.paymentterm'
					);
					break;
				case 'subsidiaryfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-subsidiary-lookup',
							options: {
								initValueField: 'SubsidiaryAddress',
								filterKey: 'timekeeping-settlement-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine',
							},
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'timekeeping-settlement-subsidiary-filter',
									displayMember: 'AddressLine',
								},
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'AddressLine',
							},
						},
					};
					break;
				case 'customerfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-customer-lookup',
								lookupOptions: {
									filterKey: 'timekeeping-settlement-customer-filter',
									showClearButton: true,
								},
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'customer',
								displayMember: 'Code',
							},
							width: 125,
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'business-partner-main-customer-lookup',
								descriptionField: 'CustomerDescription',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'timekeeping-settlement-customer-filter',
									showClearButton: true,
								},
							},
						},
					};
					break;

				case 'controllingunitfk':
					ovl =
						resourceCommonLayoutHelperService.provideControllingUnitOverload(
							true,
							'lgm-settlement-controllingunit-project-context-filter'
						);
					break;
				case 'controllingunitrevenuefk':
					ovl =
						resourceCommonLayoutHelperService.provideControllingUnitOverload(
							true,
							'lgm-settlement-controllingunit-revenue-project-context-filter'
						);
					break;
				
				case 'vatgroupfk':
					ovl =
						basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig(
							'basics.customize.vatgroup',
							null,
							{ showClearButton: true }
						);
					break;
				case 'supplierfk':
					ovl =
						platformLayoutHelperService.provideBusinessPartnerSupplierLookupOverload();
					break;
			}
			return ovl;
		};

	}
})(angular);
