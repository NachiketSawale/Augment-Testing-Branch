(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).factory('projectMainPriceListTypeLookupService',
		['$q', '$translate',
			function ($q, $translate) {
				var service = {};

				var options = [
					{id: 1, description: $translate.instant('project.main.priceListTypePriceList')},
					{id: 2, description: $translate.instant('project.main.priceListTypePriceVersion')}
				];

				service.getList = function () {
					return $q.when(options);
				};
				service.getItemByKey = function (key) {
					return _.find(options, {id: key});
				};
				service.getItemById = function (id) {
					return _.find(options, {id: id});
				};
				return service;

			}]);

})(angular);
