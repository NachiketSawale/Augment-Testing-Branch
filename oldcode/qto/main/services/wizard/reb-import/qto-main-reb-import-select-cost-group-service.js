/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals */

	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainRebImportSelectCostGroupService
	 * @description
	 */
	angular.module(moduleName).factory('qtoMainRebImportSelectCostGroupService', ['$http', 'platformGridAPI', 'cloudCommonGridService', 'qtoMainRebImportCostGroupCatService',
		function ($http, platformGridAPI, cloudCommonGridService, qtoMainRebImportCostGroupCatService) {
			let service = {};

			let hashCostGroup = {};

			service.setGridId = function (value) {
				service.gridId = value;
			};

			service.loadCostGrouupItems = function (catIds, catCode) {
				if (service.gridId) {
					if (catIds.length > 0) {
						if (hashCostGroup[catCode]){
							platformGridAPI.items.data(service.gridId, hashCostGroup[catCode]);
							return;
						}

						$http.post(globals.webApiBaseUrl + 'project/main/costgroup/GetCostGroupStructureTree', catIds).then(function (response) {
							let costGroups = [];
							if (response.data && response.data.length > 0) {
								costGroups = response.data;
								setIsMarked(costGroups);
							}
							platformGridAPI.items.data(service.gridId, costGroups);

							if (!hashCostGroup[catCode]){
								hashCostGroup[catCode] = costGroups;
							}
						});
					} else {
						platformGridAPI.items.data(service.gridId, []);
					}
				}
			};

			service.setItems = function (catItem) {
				if (hashCostGroup[catItem.Code]){
					setIsMarked(hashCostGroup[catItem.Code]);

					platformGridAPI.items.data(service.gridId, hashCostGroup[catItem.Code]);
				}
			};

			function setIsMarked(costGroups) {
				let markedIds = qtoMainRebImportCostGroupCatService.getIsMarkedCatIds();
				costGroups.forEach(function (item) {
					item.IsMarked = markedIds.indexOf(item.CostGroupCatalogFk) > -1;

					if (item.CostGroupChildren && item.CostGroupChildren.length > 0) {
						setIsMarked(item.CostGroupChildren);
					}
				});
			}

			service.getIsMarkedIdList = function () {
				if (service.gridId) {
					let costGroupList = [];
					let costGroups = Object.values(hashCostGroup).reduce(function(accumulator, currentValue) {
						return accumulator.concat(currentValue);
					}, []);
					cloudCommonGridService.flatten(costGroups, costGroupList, 'CostGroupChildren');
					if (costGroupList && costGroupList.length > 0) {
						return costGroupList.filter(function (item) {
							return item.IsMarked;
						}).map(function (item) {
							return item.Id;
						});
					}
				}
				return [];
			};

			service.clearHashCostGroup = function (){
				hashCostGroup = {};
			};

			return service;
		}
	]);
})(angular);