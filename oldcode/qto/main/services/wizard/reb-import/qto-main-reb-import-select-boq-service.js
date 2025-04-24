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
	 * @name qtoMainRebImportSelectBoqService
	 * @description
	 */
	angular.module(moduleName).factory('qtoMainRebImportSelectBoqService', ['$http', 'platformGridAPI', 'cloudCommonGridService',
		function ($http, platformGridAPI, cloudCommonGridService) {
			let service = {};

			service.setGridId = function (value) {
				service.gridId = value;
			};

			service.loadBoqItems = function (boqHeaderId) {
				if(service.gridId) {
					$http.get(globals.webApiBaseUrl + 'boq/main/tree?headerId=' + boqHeaderId).then(function (response) {
						let boqItems = [];
						if (response.data) {
							boqItems = response.data;
						}
						platformGridAPI.items.data(service.gridId, boqItems);
					});
				}
			};

			function setIsMarked(boqItems) {
				boqItems.forEach(function (item) {
					item.IsMarked = true;
					if (item.BoqItems && item.BoqItems.length > 0) {
						setIsMarked(item.BoqItems);
					}
				});
			}

			service.getPositionAndIsMarkedIdList = function () {
				if (service.gridId) {
					let boqItemList = [];
					let boqItems = platformGridAPI.items.data(service.gridId);
					cloudCommonGridService.flatten(boqItems, boqItemList, 'BoqItems');
					if (boqItemList && boqItemList.length > 0) {
						return boqItemList.filter(function (item) {
							return item.IsMarked && (item.BoqLineTypeFk === 0 || item.BoqLineTypeFk === 11);
						}).map(function (item) {
							return item.Id;
						});
					}
				}
				return [];
			};

			return service;
		}
	]);
})(angular);