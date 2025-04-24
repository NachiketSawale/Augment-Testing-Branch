/*
 * $Id: timekeeping-paymentgroup-container-information-service.js 623094 2021-02-08 11:24:09Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var timekeepingPaymentgroupModule = angular.module('timekeeping.paymentgroup');

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentgroupContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	timekeepingPaymentgroupModule.service('timekeepingPaymentgroupContainerInformationService', ['$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		function ($injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {
			var self = this;

			basicsLookupdataLookupFilterService.registerFilter(
				[{
					key: 'surcharge-standard-rate-filter',
					fn: function (item) {
						return item.Isstandardrate;
					}
				},
				{
					key: 'surcharge-not-standard-rate-filter',
					fn: function (item) {
						return !item.Isstandardrate;
					}
				}]);
			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case 'efae4d9755834726b31ad7cbdf09d41f': // timekeepingPaymentGroupListController
						config = platformLayoutHelperService.getStandardGridConfig(self.getPaymentGroupServiceInfos(), self.getPaymentGroupLayout);
						break;
					case 'c800ef2747434e7199b5b59c5f0a5057': // timekeepingPaymentGroupDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(self.getPaymentGroupServiceInfos(), self.getPaymentGroupLayout);
						break;
					case 'faadbbc815c7406ca8c1032a1998b36a': // timekeepingPaymentGroupRateListController
						config = platformLayoutHelperService.getStandardGridConfig(self.getPaymentGroupRateServiceInfos(), self.getPaymentGroupRateLayout);
						break;
					case '33b18a1eea52466d9bfb81c335671a6a': // timekeepingPaymentGroupRateDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(self.getPaymentGroupRateServiceInfos(), self.getPaymentGroupRateLayout);
						break;
					case 'b02e6c0517ba4d548e8cadcf1e322353': // timekeepingPaymentGroupSurchargeListController
						config = platformLayoutHelperService.getStandardGridConfig(self.getPaymentGroupSurchargeServiceInfos(), self.getPaymentGroupSurchargeLayout);
						break;
					case '6f04b27dea9244759d2bbbff88bd13a2': // timekeepingPaymentGroupDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(self.getPaymentGroupSurchargeServiceInfos(), self.getPaymentGroupSurchargeLayout);
						break;
				}

				return config;
			};
			this.getPaymentGroupServiceInfos = function getPaymentGroupServiceInfos() {
				return {
					standardConfigurationService: 'timekeepingPaymentGroupLayoutService',
					dataServiceName: 'timekeepingPaymentGroupDataService',
					validationServiceName: 'timekeepingPaymentGroupValidationService'
				};
			};

			this.getPaymentGroupLayout = function getPaymentGroupLayout() {
				var res = platformLayoutHelperService.getBasisLayoutConfigObject('1.0.0', 'timekeeping.payment',
					['descriptioninfo','code', 'isdefault', 'islive']);
				res.overloads = platformLayoutHelperService.getOverloads(['islive'], self);
				return res;
			};

			this.getPaymentGroupRateServiceInfos = function getPaymentGroupRateServiceInfos() {
				return {
					standardConfigurationService: 'timekeepingPaymentGroupRateLayoutService',
					dataServiceName: 'timekeepingPaymentGroupRateDataService',
					validationServiceName: 'timekeepingPaymentGroupRateValidationService'
				};
			};

			this.getPaymentGroupRateLayout = function getPaymentGroupRateLayout() {
				var res = platformLayoutHelperService.getBasisLayoutConfigObject('1.0.0', 'timekeeping.payment.rate',
					['validfrom', 'controllingunitfk', 'rate', 'surchargetypefk', 'commenttext']);
				// res.overloads = platformLayoutHelperService.getOverloads(['controllingunitfk'], self);
				res.overloads = platformLayoutHelperService.getOverloads(['controllingunitfk', 'surchargetypefk'], self);
				res.overloads.surchargetypefk.detail.options.filterKey = 'surcharge-standard-rate-filter';
				res.overloads.surchargetypefk.grid.editorOptions.lookupOptions.filterKey = 'surcharge-standard-rate-filter';
				return res;
			};

			this.getPaymentGroupSurchargeServiceInfos = function getPaymentGroupSurchargeServiceInfos() {
				return {
					standardConfigurationService: 'timekeepingPaymentGroupSurchargeLayoutService',
					dataServiceName: 'timekeepingPaymentGroupSurchargeDataService',
					validationServiceName: 'timekeepingPaymentGroupSurchargeValidationService'
				};
			};

			this.getPaymentGroupSurchargeLayout = function getPaymentGroupSurchargeLayout() {
				var res = platformLayoutHelperService.getFourGroupsBaseLayout('1.0.0', 'timekeeping.payment.surcharge',
					['surchargetypefk', 'validfrom', 'controllingunitfk', 'rate', 'commenttext','paymentgroupratefk'],
					platformLayoutHelperService.getUserDefinedTextGroup(10, 'userDefTextGroup', 'userdefinedtext', '0'),
					platformLayoutHelperService.getUserDefinedNumberGroup(10, 'userDefNumberGroup', 'userdefinednumber', '0'),
					platformLayoutHelperService.getUserDefinedDateGroup(10, 'userDefDateGroup', 'userdefineddate', '0'));
				res.overloads = platformLayoutHelperService.getOverloads(['controllingunitfk', 'surchargetypefk','paymentgroupratefk'], self);
				return res;
			};

			this.getOverload = function getOverload(overload) {
				var ovl = null;
				var filter = function (item) {
					var company;
					if (item) {
						company = item.CompanyFk;
					}

					return company;
				};

				switch (overload) {
					case 'islive':
						ovl = {readonly: true};
						break;
					case 'surchargetypefk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingsurchargetype', 'Description', {
							customBoolProperty: 'ISSTANDARDRATE',
							filterKey: 'surcharge-not-standard-rate-filter'
						});
						break;

					case 'paymentgroupratefk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingEmployeePaymentRateLookupDataService',
							filter: function (entity) {
								return entity.PaymentGroupFk;
							}
						});
						break;

					case 'controllingunitfk':
						ovl = {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'controlling-structure-dialog-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filter: filter,
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filter: filter,
										showClearButton: true
									},
									directive: 'controlling-structure-dialog-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Controllingunit',
									displayMember: 'Code'
								},
								width: 130
							}
						};
						break;
				}

				return ovl;
			};

		}
	]);
})(angular);
