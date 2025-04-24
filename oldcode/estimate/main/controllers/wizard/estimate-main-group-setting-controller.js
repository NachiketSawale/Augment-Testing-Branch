/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainGroupSettingController
	 * @function
	 *
	 * @description
	 * Controller for the group setting view.
	 */
	angular.module(moduleName).controller('estimateMainGroupSettingController', [
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'estimateMainGroupSettingUIConfigurationService', 'estimateMainGroupSettingService', 'platformGridControllerService',
		'estimateMainGroupSettingValidationService',
		function (
			$scope, $timeout, $injector, platformGridAPI, platformCreateUuid, groupSettingUIConfigService, estimateMainGroupSettingService, platformGridControllerService,
			estimateMainGroupSettingValidationService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false
			};

			$scope.gridId = platformCreateUuid();

			$scope.onContentResized = function () {
				resize();
			};

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			// Define standard toolbar Icons and their function on the scope
			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'create',
						sort: 1,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							estimateMainGroupSettingService.createItem();
						},
						disabled: false
					},
					{
						id: 'delete',
						sort: 2,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							let item = estimateMainGroupSettingService.getSelected();
							estimateMainGroupSettingService.deleteItem(item);
							updateTools(false);
							let itemList = estimateMainGroupSettingService.getList();
							if(itemList && itemList.length === 0){
								estimateMainGroupSettingService.onItemChange.fire(true);
							}
						},
						disabled: false
					}
				],
				update: function () {
				}
			};

			function resize() {
				$timeout(function () {
					updateTools();
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, groupSettingUIConfigService, estimateMainGroupSettingService, estimateMainGroupSettingValidationService, myGridConfig);
			}


			// set/reset toolbar items readonly
			function updateTools(value) {
				angular.forEach($scope.tools.items, function (item) {
					if(item.id === 'create'){
						item.disabled = value;
					}
				});
			}

			$scope.$on('$destroy', function () {
				estimateMainGroupSettingService.clear();
			});

			init();
		}
	]);
})();
