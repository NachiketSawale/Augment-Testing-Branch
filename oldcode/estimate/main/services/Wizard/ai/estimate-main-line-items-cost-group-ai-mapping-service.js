/**
 * @author: chd
 * @date: 10/20/2020 11:27 AM
 * @description:
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global globals, Platform */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineItemsCostGroupAiMappingService', [
		'_', '$http', 'platformGridAPI',
		function (_, $http, platformGridAPI) {

			let service = {},
				changeDataCache = [],
				fieldTag = 'costgroup_',
				suggestedFieldTag = 'suggested_costgroup_';

			let _gridId = '5F75BAA8D1CC48BA956BF0D9D3E1A68B';
			service.busyStatusChanged = new Platform.Messenger();

			let selectedId = null;
			service.getSelectedId = function () {
				return selectedId;
			};

			service.setSelectedId = function (id) {
				selectedId = id;
			};

			service.gridRefresh = function () {
				platformGridAPI.grids.invalidate(_gridId);
			};

			let selectedLevel = null;
			service.getSelectedLevel = function () {
				return selectedLevel;
			};

			service.setSelectedLevel = function (level) {
				return selectedLevel = level;
			};

			service.getCostGroupDataChanged = function () {
				return changeDataCache;
			};

			service.addCostGroupDataChanged = function (group) {
				changeDataCache.push(group);
			};

			service.clearCacheDataChanged = function () {
				changeDataCache = [];
			};

			let lineItem2CostGroupsData = [];
			service.saveLineItem2CostGroupsData = function (data) {
				lineItem2CostGroupsData = data;
			};

			service.getLineItem2CostGroupsData = function () {
				return lineItem2CostGroupsData;
			};

			let allCostGroupCats = [];
			service.saveCostGroupCats = function (costGroupCats) {
				if (costGroupCats !== null && costGroupCats.LicCostGroupCats !== null && angular.isArray(costGroupCats.LicCostGroupCats)) {
					allCostGroupCats = allCostGroupCats.concat(costGroupCats.LicCostGroupCats);
				}
				else if (costGroupCats !== null && costGroupCats.PrjCostGroupCats !== null && angular.isArray(costGroupCats.PrjCostGroupCats)) {
					allCostGroupCats = allCostGroupCats.concat(costGroupCats.PrjCostGroupCats);
				}

				return allCostGroupCats;
			};

			service.getCostGroupCats = function () {
				return allCostGroupCats;
			};

			service.postData = function (items) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/mtwoai/aimapcostgroupfeedback', items);
			};

			service.getAllDynamicColumnField = function () {
				let allDynamicColumnField = [];
				let allCostGroupCats = service.getCostGroupCats;
				_.forEach(allCostGroupCats, function (costGroupCat) {
					allDynamicColumnField.push(fieldTag + costGroupCat.Id);
					allDynamicColumnField.push(suggestedFieldTag + costGroupCat.Id);
				});

				return allDynamicColumnField;
			};

			return service;

		}
	]);
})(angular);

