(function (angular) {
	'use strict';

	angular.module('productionplanning.cadimportconfig').factory('ppsEngineeringCadFormatService',
		['$q', '$http', '$translate',
			function ($q, $http, $translate) {

				var service = {};

				var list = [];

				service.getList = function () {
					return list;
				};

				service.loadData = function () {
					list = [
						{Id: 0, Description: 'Auto-Detect importer'},
						{Id: 1, Description: 'KST importer'},
						{Id: 2, Description: 'xADS importer'},
						{Id: 3, Description: 'UNI-only importer'},
						{Id: 4, Description: 'CSV importer-Conewago'}
					];
					return $q.when(list);
				};

				return service;

			}]);

})(angular);