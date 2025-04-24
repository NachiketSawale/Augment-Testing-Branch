/**
 * Created by janas on 25.01.2016.
 */

(function () {

	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name controllingStructureGenerateWizardTabPreviewController
	 * @function
	 *
	 * @description
	 * Controller for generate controlling units wizard.
	 **/
	controllingStructureModule.controller('controllingStructureGenerateWizardTabPreviewController',
		['_', '$scope', 'platformGridAPI', 'platformTranslateService', 'controllingStructureUIStandardService', 'controllingStructureImageProcessor', 'controllingStructureWizardGeneratePreviewService',
			function Controller(_, $scope, platformGridAPI, platformTranslateService, UIStandardService, imageProcessor, generatePreviewService) {

				$scope.alerts = generatePreviewService.getAlerts();
				$scope.gridId = '0e8aeced00b2409cbd88df61e5bed247';
				$scope.gridData = {
					state: $scope.gridId
				};

				var columns = _.cloneDeep(UIStandardService.getStandardConfigForListView().columns);

				columns = _.filter(columns, function (c) {
					return [
						// only specific columns
						'code', 'descriptioninfo',
						'assignment01', 'assignment02', 'assignment03', 'assignment04', 'assignment05',
						'assignment06', 'assignment07', 'assignment08', 'assignment09', 'assignment10'
					].indexOf(c.id) >= 0;
				});

				// ensure formatter and editor are 'code'
				_.each(columns, function (col) {
					if (_.includes(col.id, 'assignment')) {
						delete col.editorOptions;
						delete col.formatterOptions;
						col.editor = col.formatter = 'code';
					}
				});

				if (!columns.isTranslated) {
					platformTranslateService.translateGridConfig(columns);
					columns.isTranslated = true;
				}

				// make full readonly
				_.each(columns, function (item) {
					if (item && item.editor) {
						item.editor = null;
					}
				});

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: angular.copy(columns),
						data: generatePreviewService.getTree(),
						id: $scope.gridId,
						lazyInit: false,
						enableConfigSave: true,
						options: {
							tree: true,
							indicator: true,
							idProperty: 'Id',
							parentProp: 'ControllingunitFk',
							childProp: 'ControllingUnits',
							collapsed: true
						}
					};

					platformGridAPI.grids.config(grid);
				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(columns));
				}

				function updateItemList() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						_.each(generatePreviewService.getList(), function (cu) {
							cu.HasChildren = _.size(cu.ControllingUnits) > 0;
						});
						_.each(generatePreviewService.getList(), imageProcessor.processItem);
						platformGridAPI.items.data($scope.gridId, generatePreviewService.getTree());
					}
				}

				generatePreviewService.registerListLoaded(updateItemList);

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					generatePreviewService.unregisterListLoaded(updateItemList);
				});
			}]);

})();
