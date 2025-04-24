/**
 * Created by reimer on 02.03.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicDataGroupServiceFactory
	 * @function
	 *
	 * @description
	 * service factory for all module specific characteristic data services
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicDataGroupServiceFactory', ['$http',
		function ($http) {

			var serviceCache = [];

			function createNewComplete(sectionId) {

				var service = {};
				service.sectionId = sectionId;

				service.listLoaded = new Platform.Messenger();
				service.selectionChanged = new Platform.Messenger();

				var data = null;
				var selectedItem = null;

				service.loadData = function(contextId, pKeysQueryString = '') {

					// data = null;
					if (contextId > 0) {
						$http.get(globals.webApiBaseUrl + 'basics/characteristic/group/treebydata?sectionId=' + service.sectionId + '&contextId=' + contextId + pKeysQueryString)
							.then(function (response) {
								data = response.data;
								service.listLoaded.fire();
							}
							);
					}
					else {
						data = null;
						service.listLoaded.fire();
					}
				};

				service.getTree = function() {
					return data;
				};

				service.setSelected = function(item) {
					selectedItem = item;
					service.selectionChanged.fire();
				};

				service.getSelected = function() {
					return selectedItem;
				};

				//service.refresh = function() {
				//	service.loadData();
				//};

				return service;

			}

			return {
				getService: function (sectionId, parentService) {
					var cacheKey = sectionId;
					var serviceName = parentService.getServiceName();
					if(serviceName) {
						cacheKey = serviceName + sectionId;
					}
					if (!serviceCache[cacheKey]) {
						serviceCache[cacheKey] = createNewComplete(sectionId);
					}
					return serviceCache[cacheKey];
				}
			};

		}]);
})();
