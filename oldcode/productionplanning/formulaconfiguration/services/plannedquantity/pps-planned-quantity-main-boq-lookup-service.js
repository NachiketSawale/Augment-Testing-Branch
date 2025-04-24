(function () {
	'use strict';
	/* global angular,globals */

	var moduleName = 'productionplanning.formulaconfiguration';

	/* jshint -W072 */
	angular.module(moduleName).factory('ppsPlannedQuantityMainBoqLookupService',
		['$http', '$q', '$injector','cloudCommonGridService', 'ppsPlannedQuantityDataServiceFactory',
			function ($http, $q, $injector, cloudCommonGridService, ppsPlannedQuantityDataServiceFactory) {

				var service = {};
				var lookupData = {
					boqItems:[]
				};
				var getBoqItemsByHttp = function() {
					var parentService = $injector.get('productionplanningHeaderDataService');
					var currentProjectId = parentService && parentService.getSelected() ? parentService.getSelected().ProjectFk: null;
					var currentParent = ppsPlannedQuantityDataServiceFactory.getService({serviceName:'productionplanning.header.plannedQuantity', parentService: 'productionplanningHeaderDataService', parentFilter:'PpsHeaderFk'});
					var relatedBoqHeaderId = parentService?.getSelected()?.BoqHeaderIds || [];
					var currentBoqHeaderId = currentParent && currentParent.getSelected()? currentParent.getSelected().BoqHeaderFk : null;

					lookupData.projectId = currentProjectId;
					lookupData.boqHeaderId = currentBoqHeaderId;

					if (currentBoqHeaderId) {
						relatedBoqHeaderId = [currentBoqHeaderId];
					}

					if(relatedBoqHeaderId.length >= 1){
						return $http.post(globals.webApiBaseUrl + 'boq/main/getboqitemsearchlist', {
							BoqHeaderIds: relatedBoqHeaderId,
							FilterValue: ''
						});
					}
					else if (currentProjectId) {
						return $http.get(globals.webApiBaseUrl + 'boq/project/getboqsearchlist?projectId=' + currentProjectId + '&filterValue');
					}
				};

				service.getListAsync = function getListAsync() {
					return getBoqItemsByHttp().then(function (response) {
						lookupData.boqItems = response.data;
						return lookupData.boqItems;
					});
				};

				service.getItemById = function getItemById(value) {
					var item = {};
					var list = lookupData.boqItems;
					if(list && list.length>0){
						var output = [];
						list = cloudCommonGridService.flatten(list, output, 'BoqItems');
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
					if(lookupData.boqItems.length) {
						return $q.when(service.getItemById(value));
					} else {
						if(!lookupData.boqItemsPromise) {
							lookupData.boqItemsPromise = service.getListAsync();
						}

						return lookupData.boqItemsPromise.then(function(data){
							lookupData.boqItemsPromise = null;
							lookupData.boqItems= data;

							return service.getItemById(value);
						});
					}
				};

				return service;
			}]);
})();