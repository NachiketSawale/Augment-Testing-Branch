/**
 * Created by xsi on 2016-05-18.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqPrintLookupService', [
		'$http', '$q', '$injector', 'cloudCommonGridService',
		function ($http, $q, $injector, cloudCommonGridService) {

			var service = {};
			var lookupData = {
				boqItems: []
			};
			service.getItemById = function getItemById(value) {
				var item = {};
				var list = lookupData.boqItems;
				if (list && list.length > 0) {
					var output = [];
					list = cloudCommonGridService.flatten(list, output, 'BoqItemChildren');
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}
				return item;
			};

			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if (lookupData.boqItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if (!lookupData.boqItemsPromise) {
						lookupData.boqItemsPromise = service.getListAsync();
					}

					return lookupData.boqItemsPromise.then(function (data) {
						lookupData.boqItemsPromise = null;
						lookupData.boqItems = data;

						return service.getItemById(value);
					});
				}
			};

			service.getListAsync = function getListAsync(scope) {
				lookupData.boqItems = scope.$parent.$parent.entity.boqItems;
				return $q.when(lookupData.boqItems);
			};

			return service;
		}]);
})(angular);