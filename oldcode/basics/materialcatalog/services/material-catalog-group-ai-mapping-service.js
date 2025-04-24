/**
 * Created by gaz on 04/05/2018.
 */

(function () {

	'use strict';

	var moduleName = 'basics.materialcatalog';

	/**
	 * @ngdoc service
	 * @name materialCatalogGroupAiMappingService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('materialCatalogGroupAiMappingService', [
		'_',
		'platformGridAPI',
		'basicsMaterialCatalogMaterialGroupService',
		'basicsMaterialCatalogService',
		'platformRuntimeDataService',
		'PlatformMessenger',
		function (_,
				  platformGridAPI,
				  groupService,
				  materialCatalogService,
				  platformRuntimeDataService,
				  PlatformMessenger
		) {

			var service = {
				listLoaded: new PlatformMessenger()
			};
			var _gridId = '2f5d48cf7c53422ea7a5da317c4c04e3';  // selected codes grid
			var _busyStatus = false;
			service.busyStatusChanged = new Platform.Messenger();
			var setBusyStatus = function (newStatus) {
				if (_busyStatus !== newStatus) {
					_busyStatus = newStatus;
					service.busyStatusChanged.fire(_busyStatus);
				}
			};

			service.updateReadOnly = function updateReadonly(items) {
				_.forEach(items, function (item) {
					if(item.PrcStructureFk === item.OrigPrcStructureFk) {
						platformRuntimeDataService.readonly(item, [
							{field: 'PrcStructureFk', readonly: true},
							{field: 'IsCheckAi', readonly: true}]
						);
					}
					updateReadonly(item.ChildItems);
				});
				return items;
			};

			service.validatePrcStructureFk = function (entity, value) {
				entity.IsCheckAi = entity.OrigPrcStructureFk !== value;
				platformRuntimeDataService.readonly(entity, [{field: 'IsCheckAi', readonly: !entity.IsCheckAi}]);
			};

			service.set = function (mappingItems) {
				setBusyStatus(true);
				groupService.load().then(function () {
					// Get latest material groups
					var oldItems = groupService.getList();
					modifiedCache(mappingItems, oldItems);
					materialCatalogService.update();
				});
				return true;
			};

			function modifiedCache(mappingItems, oldItems) {
				for (var i = 0; i < mappingItems.length; i++) {
					var aiItem = mappingItems[i];
					// Update PrcStructureFk in material group
					if(aiItem.IsCheckAi === true) {
						var oldItem = _.find(oldItems, {Id: aiItem.Id});
						oldItem.PrcStructureFk = aiItem.PrcStructureFk;
						groupService.markItemAsModified(oldItem);
					}
					var changeChild = aiItem.ChildItems;
					if(changeChild) {
						modifiedCache(changeChild, oldItems);
					}
				}
			}

			// needed for code lookup to get used codes
			service.getList = function () {
				return platformGridAPI.items.data(_gridId);
			};

			var selectedId = null;
			service.getSelectedId = function () {
				return selectedId;
			};
			service.setSelectedId = function (id) {
				selectedId = id;
			};

			service.gridRefresh = function () {
				platformGridAPI.grids.invalidate(_gridId);
			};

			service.init = function () {
				angular.noop();
			};

			return service;

		}
	]);
})(angular);
