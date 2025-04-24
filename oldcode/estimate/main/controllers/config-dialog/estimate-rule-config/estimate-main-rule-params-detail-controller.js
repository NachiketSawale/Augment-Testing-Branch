/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainCostCodeAssignmentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the cost code assignment details view.
	 */
	angular.module(moduleName).controller('estimateMainRuleParamsDetailController', [
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'estimateMainRuleAssignmentParamsUIConfigurationService', 'estimateMainEstRuleAssignmentParamDataService', 'platformGridControllerService', 'estimateMainDialogProcessService', 'estimateMainEstTotalsConfigDetailValidationService',
		'estimateMainRuleConfigDetailDataService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, assginmentDetailUIConfigService, assignmentParamDataService, platformGridControllerService, estimateMainDialogProcessService, configDetailValidationService,
			estimateMainRuleConfigDetailDataService) {

			let readOnly = false;
			let config = $injector.get('estimateMainDialogProcessService').getDialogConfig();

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				enableConfigSave: false,
				// skipPermissionCheck: true, //Set grid as 'Read only'
				cellChangeCallBack: function (arg) {
					assignmentParamDataService.setItemToSave(arg.item);
					assignmentParamDataService.refreshGrid();
				}
			};

			$scope.gridId = platformCreateUuid();
			assignmentParamDataService.gridId = $scope.gridId;
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
				items: [],
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
				platformGridControllerService.initListController($scope, assginmentDetailUIConfigService, assignmentParamDataService, configDetailValidationService, myGridConfig);
				estimateMainRuleConfigDetailDataService.selectToLoad.fire();
			}

			function setDataSource(data) {
				$scope.data = data;
				assignmentParamDataService.setDataList(data);
				assignmentParamDataService.refreshGrid();
				$scope.onContentResized();
			}

			function updateData(currentItem) {
				setDataSource(currentItem);
				if((config && config.editType && config.editType === 'customizeforall') || readOnly){
					readOnly = true;
				}
				else {
					readOnly = false;
				}
			}

			// set/reset toolbar items readonly
			function updateTools() {
				readOnly = true; // estimateMainDialogProcessService.isRootAssignTypeParamDetailReadOnly();
				angular.forEach($scope.tools.items, function (item) {
					item.disabled = readOnly;
					if (!readOnly && item.id === 'create') {
						item.disabled = !estimateMainRuleConfigDetailDataService.getSelected();
					}

					if (!readOnly && item.id === 'delete') {
						item.disabled = !assignmentParamDataService.getSelected();
					}
				});
			}

			estimateMainRuleConfigDetailDataService.selectToLoad.register(updateData);

			function onSelectedRowsChanged() {
				updateTools();
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);


			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainRuleConfigDetailDataService.selectToLoad.unregister(updateData);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

			init();
		}
	]);
})();
