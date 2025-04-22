/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesContractTypeLookupDataService
	 * @function
	 *
	 * @description
	 * salesContractTypeLookupDataService is the data service for contract type lookup
	 */
	angular.module('sales.contract').factory('salesContractTypeLookupDataService', ['_', 'globals', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (_, globals, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesContractTypeLookupDataService', {
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
				uuid: '4eb2852a81094ace944162e2377b79fd'
			});

			var salesContractTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/customize/OrderType/',
					endPointRead: 'list',
					usePostForRead: true
				}
			};

			var service = platformLookupDataServiceFactory.createInstance(salesContractTypeLookupDataServiceConfig).service;
			// methods we will overwrite for more convenient usage
			let internal = {
				getDefault: service.getDefault,
				getItemByIdAsync: service.getItemByIdAsync,
				getItemById: service.getItemById,
				getList: service.getList
			};

			service.getDefault = function getDefault() {
				return internal.getDefault({dataServiceName: 'salesContractTypeLookupDataService'});
			};

			service.getItemByIdAsync = function getItemByIdAsync(typeId) {
				return internal.getItemByIdAsync(typeId, {dataServiceName: 'salesContractTypeLookupDataService'});
			};

			service.getItemById = function getItemById(typeId) {
				return internal.getItemById(typeId, {dataServiceName: 'salesContractTypeLookupDataService'});
			};

			service.getList = function getList() {
				return internal.getList({dataServiceName: 'salesContractTypeLookupDataService'});
			};

			service.getDefaultAsync = function getDefaultAsync() {
				return service.getList().then(function (contractTypes) {
					var companyOrdType = $injector.get('salesContractService').getCompanyCategoryList();
					return _.first(_.filter(contractTypes, (t) => {
						var filterData = _.filter(companyOrdType, { 'RubricCategoryFk': t.RubricCategoryFk });
						return (companyOrdType !== null && companyOrdType.length > 0) ? (t.IsDefault && filterData.length > 0) : t.IsDefault;
					})) || null;
				});
			};

			service.getRelatedTypeByBidType = function getRelatedTypeByBidType(bidTypeId) {
				var salesBidTypeLookupDataService = $injector.get('salesBidTypeLookupDataService');
				return salesBidTypeLookupDataService.getItemByIdAsync(bidTypeId).then(function (bidTypeEntity) {
					if (bidTypeEntity === null || bidTypeEntity === undefined) {
						return null;
					}
					return service.getList().then(function (contractTypes) {
						return _.first(_.filter(contractTypes, (t) => {
							return t.IsLive === bidTypeEntity.IsLive
								&& t.IsMain === bidTypeEntity.IsMain
								&& t.IsChange === bidTypeEntity.IsChange
								&& t.IsSide === bidTypeEntity.IsSide;
						})) || null;
					});
				});
			};

			return service;
		}]);
})();