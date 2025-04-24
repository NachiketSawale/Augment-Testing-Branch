/**
 * Created by gvj on 8/2/2018.
 */
(function () {
	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('materialNeutralMaterialAiMappingService', [
		'_',
		'$http',
		'platformGridAPI',
		'basicsMaterialMaterialCatalogService',
		'basicsMaterialRecordService',
		'platformRuntimeDataService',

		/**
		 * this function will be called from Sidebar Inquiry
		 * container when user presses the "Neutral Material Mapping" Button
		 * returns: array {itemInfo}:
		 * {OrigMdcMaterialFk": 10128, "IsCheckAi": false, "IsNeutral": false, "MatchedNeturalMaterialFks":[10128, 14835,…}
		 */

		function (_,
				  $http,
				  platformGridAPI,
				  materialCatalogService,
				  basicsMaterialRecordService,
				  platformRuntimeDataService

		) {

			var service = {};

			var _gridId = '2f5d48cf7c53422ea7a5da318c2c05e4';  //selected codes grid

			service.busyStatusChanged = new Platform.Messenger();

			service.updateReadOnly = function updateReadonly(items) {
				_.forEach(items, function (item) {
					if(item.MdcMaterialFk === item.OrigMdcMaterialFk) {
						platformRuntimeDataService.readonly(item, [
							{field: 'MdcMaterialFk', readonly: true},
							{field: 'IsCheckAi', readonly: true}]
						);
					}
				});
				return items;
			};

			service.validateMdcMaterialFk = function (entity, value) {
				entity.IsCheckAi = entity.OrigMdcMaterialFk !== value;
				platformRuntimeDataService.readonly(entity, [{field: 'IsCheckAi', readonly: !entity.IsCheckAi}]);
			};

			/**
			 * define set method.
			 * use post method to sent the update data to backend. then load the page with the newest data.
			 */
			service.set = function (params) {
				var mappingItems = {MaterialToSave: params.values};

				var str = angular.toJson(mappingItems);
				$http.post(globals.webApiBaseUrl +'basics/material/mtwoai/neutralmappingupdate', str).then(function () {
					basicsMaterialRecordService.load();//TODO: This method might cause bug at catalog filter check box, phase_0 of low priority.
				});

				//TODO: may have to do something about the respond,like raising errors.
				return true;
			};



			/**
			 * This function is deprecated.
			 * This function act like a filter, if user check the "Check AI" check box then the info of corresponding
			 * row will be sent to backend.
			 */
			/*function aiResultFilter(mappingItems){
				var updateItems = [];
				_.forEach(mappingItems, function (item) {
					if (item.IsCheckAi) {
						updateItems.push(item);
					}
				});
				return {MaterialToSave: updateItems};
			}*/

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


			return service;

		}
	]);
})(angular);
