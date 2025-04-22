/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesBillTypeLookupDataService
	 * @function
	 *
	 * @description
	 * salesBillTypeLookupDataService is the data service for bill type lookup
	 */
	angular.module('sales.billing').factory('salesBillTypeLookupDataService', ['_', '$injector', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (_, $injector, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesBillTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '7ecae6183c404ec99eeea138e5754e65'
			});

			var salesBillTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/customize/BillType/',
					endPointRead: 'list',
					usePostForRead: true
				}
			};

			var service = platformLookupDataServiceFactory.createInstance(salesBillTypeLookupDataServiceConfig).service;
			// methods we will overwrite for more convenient usage
			let internal = {
				getDefault: service.getDefault,
				getItemByIdAsync: service.getItemByIdAsync,
				getList: service.getList
			};

			/**
			 * Provides default billing type for a credit memo.
			 * @returns promise with default bill type for credit memo, otherwise returning null, if not available
			 */
			service.getDefaultCreditMemoBillType = function getDefaultCreditMemoType() {
				// we cannot use getDefault method here, because this will return the first entry with IsDeault = true
				// instead we filter first for "IsCreditMemo", then return the first default entry
				return service.getList().then(function (billTypes) {
					return _.first(_.filter(billTypes, (t) => {
						return t.IsDefault && t.IsCreditMemo;
					})) || null;
				});
			};

			service.getRelatedCreditMemoBillType = function getRelatedCreditMemoBillType(typeId) {
				return service.getItemByIdAsync(typeId).then(function (typeEntity) {
					return service.getList().then(function (billTypes) {
						return _.first(_.filter(billTypes, (t) => {
							return t.IsCreditMemo
								&& t.Isprogress === typeEntity.Isprogress
								&& t.IsCumulativeTransaction === typeEntity.IsCumulativeTransaction
								&& t.IsPaymentScheduleBalancing === typeEntity.IsPaymentScheduleBalancing
								&& t.IsProforma === typeEntity.IsProforma;
						})) || null;
					});
				});
			};

			service.getDefault = function getDefault() {
				return internal.getDefault({dataServiceName: 'salesBillTypeLookupDataService'});
			};

			service.getItemByIdAsync = function getItemByIdAsync(typeId) {
				return internal.getItemByIdAsync(typeId, {dataServiceName: 'salesBillTypeLookupDataService'});
			};

			service.getList = function getList() {
				return internal.getList({dataServiceName: 'salesBillTypeLookupDataService'});
			};

			service.getDefaultAsync = function getDefaultAsync() {
				return service.getList().then(function (billTypes) {
					var companyBillingType = $injector.get('salesBillingService').getCompanyCategoryList();
					return _.first(_.filter(billTypes, (t) => {
						var filterData = _.filter(companyBillingType, { 'RubricCategoryFk': t.RubricCategoryFk });
						return (companyBillingType !== null && companyBillingType.length > 0) ? (t.IsDefault && filterData.length > 0) : t.IsDefault;
					})) || null;
				});
			};

			return service;
		}]);
})();