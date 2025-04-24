/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals */

	let moduleName = 'qto.main';

	/**
	 * @ngdoc factory
	 * @name qtoMainRebImportSelectBillToService
	 * @description
	 */
	angular.module(moduleName).factory('qtoMainRebImportSelectBillToService', ['$http', 'platformGridAPI',
		function ($http, platformGridAPI) {
			let service = {};

			service.setGridId = function (value) {
				service.gridId = value;
			};

			service.loadBillToItems = function (projectId) {
				if (service.gridId) {
					let postParam = {
						PKey1: projectId,
						filter: ''
					};
					$http.post(globals.webApiBaseUrl + 'project/main/billto/listByParent', postParam).then(function (response) {
						let billTos = [];
						if (response.data && response.data.length > 0) {
							billTos = response.data;
						}
						platformGridAPI.items.data(service.gridId, billTos);
					});
				}
			};

			function setIsMarked(locations) {
				locations.forEach(function (item) {
					item.IsMarked = true;
				});
			}

			service.getIsMarkedIdList = function () {
				if (service.gridId) {
					let billToList = platformGridAPI.items.data(service.gridId);
					if (billToList && billToList.length > 0) {
						return billToList.filter(function (item) {
							return item.IsMarked;
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