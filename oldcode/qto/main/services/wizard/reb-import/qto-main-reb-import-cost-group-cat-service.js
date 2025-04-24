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
	 * @name qtoMainRebImportCostGroupCatService
	 * @description
	 */
	angular.module(moduleName).factory('qtoMainRebImportCostGroupCatService', ['$http', 'platformGridAPI',
		function ($http, platformGridAPI) {
			let service = {};

			let catIds = [];

			let selectedItem = null;

			service.setGridId = function (value) {
				service.gridId = value;
			};

			service.loadCostGroupCatItems = function (projectId) {
				if (service.gridId) {
					let postParam = {
						ProjectId: projectId,
						ConfigModuleName: 'quantitytakeoff',
						ConfigModuleType: 'project'
					};
					$http.post(globals.webApiBaseUrl + 'basics/costgroupcat/getcatassignmentbycatfilterinfo', postParam).then(function (response) {
						let catItems = [];
						if (response.data && response.data.length > 0) {
							catItems = response.data;
						}
						platformGridAPI.items.data(service.gridId, catItems);
					});
				}
			};

			service.setSelectedItem = function (value) {
				selectedItem = value;
			};

			service.getSelectedItem = function () {
				return selectedItem;
			};

			service.setSelectedItemAsMarked = function (value) {
				let item = service.getSelectedItem();
				item.IsMarked = value;
				if (value){
					service.addIsMarkedCatId(item.Id);
				} else {
					service.removeIsMarkedCatId(item.Id);
				}

				let items = platformGridAPI.items.data(service.gridId);
				platformGridAPI.items.data(service.gridId, items);
			};

			service.addIsMarkedCatId = function (value) {
				if (catIds.indexOf(value) === -1) {
					catIds.push(value);
				}
			};

			service.removeIsMarkedCatId = function (value) {
				let index = catIds.indexOf(value);
				if (index > -1) {
					catIds.splice(index, 1);
				}
			};

			service.getIsMarkedCatIds = function () {
				return catIds;
			};

			service.clear = function (){
				catIds = [];
			};

			return service;
		}
	]);
})(angular);