(function (angular) {
	'use strict';

	angular.module('productionplanning.drawing').factory('ppsDrawingImportTypeService',
		['$q', '$http', '$translate',
			function ($q, $http, $translate) {

				var service = {};

				var list = [];

				service.getList = function () {
					return list;
				};

				service.loadData = function () {
					list = [
						{
							Id: 1,
							Description: $translate.instant('productionplanning.drawing.wizard.default')
						},
						{
							Id: 2,
							Description: $translate.instant('productionplanning.drawing.wizard.withoutNCData')
						}
					];
					return $q.when(list);
				};

				return service;

			}]);

})(angular);