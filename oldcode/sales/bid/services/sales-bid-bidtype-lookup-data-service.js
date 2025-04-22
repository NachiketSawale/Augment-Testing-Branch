/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesBidTypeLookupDataService
	 * @function
	 *
	 * @description
	 * salesBidTypeLookupDataService is the data service for bid type lookup
	*/
	angular.module('sales.bid').factory('salesBidTypeLookupDataService', ['_', '$injector', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (_, $injector, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesBidTypeLookupDataService', {
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
				uuid: '405b5ae961e745e7b80c8ae0850759e8'
			});

			var salesBidTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/customize/BidType/',
					endPointRead: 'list',
					usePostForRead: true
				}
			};

			var service = platformLookupDataServiceFactory.createInstance(salesBidTypeLookupDataServiceConfig).service;
			// methods we will overwrite for more convenient usage
			let internal = {
				getDefault: service.getDefault,
				getItemByIdAsync: service.getItemByIdAsync,
				getItemById: service.getItemById,
				getList: service.getList
			};

			service.getDefault = function getDefault() {
				return internal.getDefault({dataServiceName: 'salesBidTypeLookupDataService'});
			};

			service.getItemByIdAsync = function getItemByIdAsync(typeId) {
				return internal.getItemByIdAsync(typeId, {dataServiceName: 'salesBidTypeLookupDataService'});
			};

			service.getItemById = function getItemById(typeId) {
				return internal.getItemById(typeId, {dataServiceName: 'salesBidTypeLookupDataService'});
			};

			service.getList = function getList() {
				return internal.getList({dataServiceName: 'salesBidTypeLookupDataService'});
			};

			service.getDefaultAsync = function getDefaultAsync() {
				return service.getList().then(function (bidTypes) {
					var companyBidType = $injector.get('salesBidService').getCompanyCategoryList();
					return _.first(_.filter(bidTypes, (t) => {
						var filterData = _.filter(companyBidType, { 'RubricCategoryFk': t.RubricCategoryFk });
						return (companyBidType !== null && companyBidType.length > 0) ? (t.IsDefault && filterData.length > 0) : t.IsDefault;
					})) || null;
				});
			};

			service.getMainType = function getMainType() {
				return service.getList().then(function (bidTypes) {
					return _.first(_.filter(bidTypes, (t) => {
						return t.IsLive && t.IsMain === true;
					})) || null;
				});
			};

			service.getChangeType = function getChangeType() {
				return service.getList().then(function (bidTypes) {
					return _.first(_.filter(bidTypes, (t) => {
						return t.IsLive && t.IsChange === true;
					})) || null;
				});
			};

			service.getSideType = function getSideType() {
				return service.getList().then(function (bidTypes) {
					return _.first(_.filter(bidTypes, (t) => {
						return t.IsLive && t.IsSide === true;
					})) || null;
				});
			};

			return service;
		}]);
})();