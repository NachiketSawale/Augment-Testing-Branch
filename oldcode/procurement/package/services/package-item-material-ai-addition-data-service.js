/**
 * Created by gaz on 9/7/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageItemMaterialAiAdditionDataService', [
		'platformDataServiceFactory',
		function (platformDataServiceFactory) {

			var localData = [];
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPackageItemMaterialAiAdditionDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						return localData;
					}
				},
				presenter: {list: {}},
				entitySelection: {},
				modification: {}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = container.service;

			container.data.markItemAsModified = function () {};
			service.markItemAsModified = function () {};


			service.initData = function (data){
				localData = data;
			};

			return service;
		}
	]);



})(angular);