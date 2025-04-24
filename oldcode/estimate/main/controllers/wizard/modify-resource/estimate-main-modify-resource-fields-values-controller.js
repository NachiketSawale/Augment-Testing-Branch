/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainModifyResourceFieldsValuesController
	 * @requires $scope
	 * @description Replaced Value Configuration : used for modify estimate
	 */
	angular.module(moduleName).controller('estimateMainModifyResourceFieldsValuesController', ['$scope', '$timeout', 'platformCreateUuid', 'platformGridAPI', 'platformGridControllerService', 'estimateMainModifyResourceFieldsValuesUIConfigService', 'estimateMainModifyResourceFieldsValuesDataService', 'estimateMainReplaceResourceCommonService', 'basicsCommonHeaderColumnCheckboxControllerService',
		function ($scope, $timeout, platformCreateUuid, platformGridAPI, platformGridControllerService, gridUIConfigService, gridDataService, estimateMainReplaceResourceCommonService, basicsCommonHeaderColumnCheckboxControllerService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				collapsed: false,
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				multiSelect: false,
				cellChangeCallBack: function (e) {
					let column = e.grid.getColumns()[e.cell].field;
					let grid = platformGridAPI.grids.element('id', $scope.gridId);
					let rows = [];
					if(grid) {
						rows = grid.dataView.getItems();
					}
					if (column === 'isFilter') {
						// push this fields value into array
						if(e && e.item && e.item.Id)
						{
							let itemId = e.item.Id;
							if(e.item.isFilter)
							{
								estimateMainReplaceResourceCommonService.updateResourceFieldValues(itemId, e.item.isFilter);
							}
							else{
								if(rows.filter(s=>s.isFilter !==e.item.isFilter && s.isFilter).length===0)
								{
									estimateMainReplaceResourceCommonService.updateResourceFieldValues(itemId, e.item.isFilter);
								}
								else
								{
									estimateMainReplaceResourceCommonService.updateResourceFieldValues(itemId, !e.item.isFilter);
								}
							}
						}
					}
				}
			};


			$scope.gridId = '85082e3b42434ceda6d2708a30951096';

			$scope.setTools = function () {};
			$scope.tools = {
				update:function () {}
			};

			// let isLoaded = false;
			let headerCheckBoxFields = ['isFilter'];
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn:  function (e){
						// will set the correct fields value
						let isSelected =(e.target.checked);
						let grid = platformGridAPI.grids.element('id', $scope.gridId);
						if(grid) {
							let rows = grid.dataView.getItems();
							_.each(rows, function (item) {
								estimateMainReplaceResourceCommonService.updateResourceFieldValues(item.Id, isSelected);
							});
						}
					}
				}
			];

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, myGridConfig);
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, gridDataService, headerCheckBoxFields, headerCheckBoxEvents);
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				gridDataService.clear();
			});

			init();
		}]);
})();
