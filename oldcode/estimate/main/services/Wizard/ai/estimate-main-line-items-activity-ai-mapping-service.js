/**
 * Created by chd on 4/16/2020.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global globals, Platform */

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineItemsActivityAiMappingService', [
		'_',
		'$http',
		'platformGridAPI',
		'estimateMainService',
		'platformRuntimeDataService',
		'$injector',

		function (_,
			$http,
			platformGridAPI,
			estimateMainService,
			platformRuntimeDataService,
			$injector) {

			let service = {};
			let _gridId = '5F75BAA8D1CC48BA956BF0D9D3E1A68B';
			service.busyStatusChanged = new Platform.Messenger();

			service.updateReadOnly = function updateReadonly(items) {
				_.forEach(items, function (item) {
					if (item.PsdActivityFk === item.OrigPsdActivityFk) {
						platformRuntimeDataService.readonly(item, [
							{field: 'PsdActivityFk', readonly: true},
							{field: 'IsCheckAi', readonly: true}]
						);
					}
				});
				return items;
			};

			service.validateActivityFk = function (entity, value) {
				entity.IsCheckAi = entity.OrigPsdActivityFk !== value;
				platformRuntimeDataService.readonly(entity, [{field: 'IsCheckAi', readonly: !entity.IsCheckAi}]);
			};

			/**
			 * define set method.
			 * use post method to sent the update data to backend. then load the page with the newest data.
			 */
			service.set = function (items) {
				if (items.length >= 0) {
					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/mtwoai/aimapactivityfeedback', items);
				}
				let mappingItems = aiResultFilter(items);
				let updateData = {
					'EntitiesCount': mappingItems.length,
					'EstHeaderId': mappingItems[0].EstHeaderFk,
					'EstLineItems': mappingItems,
					'MainItemId': mappingItems[0].Id,
					'ProjectId': mappingItems[0].ProjectFk,
					'saveCharacteristicsOngoing': true
				};

				if (updateData.EntitiesCount > 0) {
					let complexLookupService = $injector.get('estimateParameterComplexInputgroupLookupService');
					if (complexLookupService.dataService.getEstLeadingStructureContext) {
						let leadingStructureInfo = complexLookupService.dataService.getEstLeadingStructureContext();
						updateData.EstLeadingStuctureContext = leadingStructureInfo.item;
					}
				}

				if (updateData.EntitiesCount > 0) {
					return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/update', updateData);
				}
				return null;
			};


			/**
			 * this function will be called from  mapping dialog when user presses the "Update" Button
			 * This function act like a filter, if user check the "Check AI" check box then the info of corresponding
			 * row will be sent to backend.
			 */
			function aiResultFilter(mappingItems) {
				let updateItems = [];
				for (let i = 0; i < mappingItems.length; i++) {
					let aiItem = mappingItems[i];
					if (aiItem.IsCheckAi === true) {
						updateItems.push(aiItem);
					}
				}

				return updateItems;

			}

			service.getList = function () {
				return platformGridAPI.items.data(_gridId);
			};

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

			return service;

		}
	]);
})(angular);

