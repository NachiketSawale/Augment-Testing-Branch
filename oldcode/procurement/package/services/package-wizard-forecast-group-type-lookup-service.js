/**
 * Created by xai on 1/15/2018.
 */
// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {
	'use strict';
	angular.module('procurement.package').factory('procurementPackageGroupTypeList', ['$translate',function ($translate) {
		var service = {};
		var forecastGroupTypeList= [
			{
				Id: 0,
				Description: $translate.instant('procurement.package.wizard.GroupTypeWeek')
			}, {
				Id: 1,
				Description: $translate.instant('procurement.package.wizard.GroupTypeMonth')
			}/* , {
            Id: 2,
            Description: $translate.instant('procurement.package.wizard.GroupTypeYear')
            } */];
		service.getForecastTypeList=function getForecastTypeList() {
			return forecastGroupTypeList;
		};
		return service;
	}]);
	angular.module('procurement.package').factory('procurementPackageForecastGroupTypeLookupService',
		['$q','basicsLookupdataLookupDescriptorService','procurementPackageGroupTypeList',
			function ($q,lookupDescriptorService,dateGroupTypeList) {
				var service = {};

				var defaultList = dateGroupTypeList.getForecastTypeList();

				service.getList = function () {
					var list = defaultList;
					if(list.length>0)
					{
						return $q.when(list);
					}
				};

				service.getItemById = function getItemById(id) {
					return _.find(defaultList, function (item) {
						return item.Id === id;
					});
				};

				service.getItemByKey = function getItemByKey(key) {
					var item;
					var deferred = $q.defer();


					var list = defaultList;

					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}

					if (!item) {
						var targetData = lookupDescriptorService.getData('procurementPackageForecastGroupTypeLookup');
						if (angular.isObject(targetData)||(Array.isArray(targetData) && targetData.length > 0)) {
							item = targetData[key];
						}
					}
					deferred.resolve(item);
					return deferred.promise;
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					return service.getItemByKey(value);
				};

				service.getSearchList = function () {
					return service.getList();
				};

				return service;
			}]);
})(angular);