/**
 * Created by wui on 6/24/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogLookUpItems',
		['platformTranslateService',
			function (platformTranslateService) {
				var discountType = [
					{Id: 1, Description: 'Annual Turnover', Description$tr$: 'basics.materialcatalog.lookup.annualTurnover' },
					{Id: 2, Description: 'Cash Back', Description$tr$: 'basics.materialcatalog.lookup.cashBack' }
				];

				// reloading translation tables
				platformTranslateService.translationChanged.register(function() {
					platformTranslateService.translateObject(discountType);
				});

				return {
					'discountType': discountType
				};
			}]);

	angular.module(moduleName).factory('basicsMaterialCatalogDiscountTypeDataService', ['$q', 'basicsMaterialCatalogLookUpItems',
		function($q, lookUpItems){
			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(lookUpItems.discountType);
					return deferred.promise;
				},
				getItemByKey: function (value) {
					var item = _.find(lookUpItems.discountType, {Id: value});
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);