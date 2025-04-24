/**
 * $Id: estimate-main-replace-resource-plant-lookup.js  2025-02-24 15:47:59Z long.wu $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _, globals */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainReplaceResourcePlantLookupService', ['estimateMainPlantDialogService', '$http',
		function (estimateMainPlantDialogService, $http) {
			let service = {},
				usingPlantIds = [],
				cacheData=[];


			service.getList = function getList(replaceTo){
				return estimateMainPlantDialogService.loadAllPlantGroup().then(function(data){
					cacheData = data;
					return !replaceTo ? filterByPlantId(data) : data;
				});
			};

			service.reloadData = function (replaceTo){
				estimateMainPlantDialogService.clearGroupsCache();
				return estimateMainPlantDialogService.loadAllPlantGroup().then(function(data){
					cacheData = data;
					return !replaceTo ? filterByPlantId(data) :data;
				});
			};

			service.getItemByKey = function getItemByKey(key){
				return _.find(cacheData, {Id: key});
			};

			service.getSearchList = function (value, replaceTo) {
				return !replaceTo ? filterByPlantId(cacheData, value) : filterByKey(cacheData, value);

			};

			service.loadUsingPlantIds = function loadUsingPlantIds(estimateId){

				$http.get(globals.webApiBaseUrl + 'estimate/main/resource/getusingplantids?estHeaderId=' + estimateId).then(function(response){
					usingPlantIds = response && response.data ? response.data : [];
				});
			};

			function filterByPlantId(items, filterKey){
				return _.filter(items, function(item){
					let result = usingPlantIds.indexOf(item.Id) > -1;
					if(!filterKey){
						return result;
					}
					return result && filterByKey([item], filterKey).length > 0;
				});
			}

			function filterByKey(items, key){
				if(!key) {
					return items;
				}
				key = key.toLowerCase();
				return _.filter(items, function(item){
					return item.Code.toLowerCase().indexOf(key)>=0 ||
						(item.DescriptionInfo && item.DescriptionInfo.Translated && item.DescriptionInfo.Translated.toLowerCase().indexOf(key)>=0);
				});
			}


			return service;
		}]);
})();
