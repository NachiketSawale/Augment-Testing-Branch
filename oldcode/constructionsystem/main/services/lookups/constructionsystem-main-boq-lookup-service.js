/**
 * Created by xsi on 2016-05-18.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */
	angular.module(moduleName).factory('constructionSystemMainBoqLookupService',
		['$http', '$q', 'cloudCommonGridService', 'constructionSystemMainInstanceService',
			function ($http, $q, cloudCommonGridService, constructionSystemMainInstanceService) {

				var service = {};
				var lookupData = {
					boqItems:[]
				}; // scope.$parent.$parent.entity.PrcBoq.BoqHeaderFk
				var getBoqItemsByHttp = function(/* scope */) {
					var currentProjectId = constructionSystemMainInstanceService.getCurrentSelectedProjectId();
					var currentBoqHeaderId = constructionSystemMainInstanceService.getCurrentBoqHeaderId();
					lookupData.projectId = currentProjectId;
					lookupData.boqHeaderId = currentBoqHeaderId;

					if (currentBoqHeaderId) {
						return $http.post(globals.webApiBaseUrl + 'boq/main/getboqitemsearchlist', {
							BoqHeaderIds: [currentBoqHeaderId],
							FilterValue: ''
						});
					}
					if (currentProjectId) {
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