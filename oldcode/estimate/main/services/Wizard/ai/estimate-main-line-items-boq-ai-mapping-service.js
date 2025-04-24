/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals, Platform */
	let moduleName = 'estimate.main';
	/**
	 * this module will be called when using material-neutral-material-ai-mapping-lookup.js
	 */
	angular.module(moduleName).factory('estimateMainLineItemsBoqAiMappingService', [
		'_',
		'$http',
		'platformGridAPI',
		'estimateMainService',
		'platformRuntimeDataService',
		'$injector',

		/**
		 * this function will be called from Sidebar Inquiry
		 * container when user presses the "Line Item Boq Ai Mapping" Button
		 * */
		function (_,
			$http,
			platformGridAPI,
			estimateMainService,
			platformRuntimeDataService,
			$injector) {
			let service = {};
			let _gridId = 'CA4AC6DC41A54D6C97194BE60679FCEE';
			service.busyStatusChanged = new Platform.Messenger();

			service.updateReadOnly = function updateReadonly(items) {
				_.forEach(items, function (item) {
					if (item.BoqItemFk === item.OrigBoqItemFk) {
						platformRuntimeDataService.readonly(item, [
							{field: 'BoqItemFk', readonly: true},
							{field: 'IsCheckAi', readonly: true}]
						);
					}
				});
				return items;
			};

			service.validateBoqItemFk = function (entity, value) {
				entity.IsCheckAi = entity.OrigBoqItemFk !== value;
				platformRuntimeDataService.readonly(entity, [{field: 'IsCheckAi', readonly: !entity.IsCheckAi}]);
			};

			/**
			 * define set method.
			 * use post method to sent the update data to backend. then load the page with the newest data.
			 */
			service.set = function (items) {
				if (items.length >= 0) {
					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/mtwoai/aimapboqfeedback', items);
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
				// let update_values = {};
				// update_values.MaterialToSave = updateItems;
				// return update_values;
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

