/**
 * @author: chd
 * @date: 5/25/2021 10:51 AM
 * @description:
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name mtwo.aiconfiguration.directive:mtwoAiConfigurationInputParameterWizardGrid
	 * @element div
	 * @restrict A
	 * @description Shows a grid in which users can select alias for input parameters.
	 */
	angular.module('mtwo.aiconfiguration').directive('mtwoAiConfigurationInputParameterWizardGrid', ['$compile', '$timeout',
		'platformGridAPI', 'platformTranslateService',
		function ($compile, $timeout, platformGridAPI, platformTranslateService) {
			return {
				restrict: 'A',
				scope: {
					model: '=',
					entity: '='
				},
				link: function ($scope, elem) {

					$scope.gridId = 'd9f752c1e64048e452b1059e8569b1fb';
					$scope.gridData = {
						state: $scope.gridId
					};

					let gridPredictSenseColumn = [
						{
							id: 'name',
							name: 'Name',
							name$tr$: 'cloud.common.entityName',
							formatter: 'description',
							field: 'Name',
							width: 150,
							readonly: true
						}, {
							id: 'valuetype',
							name: 'Value Type',
							name$tr$: 'model.main.propertyValueType',
							formatter: 'description',
							field: 'ValueType',
							width: 100,
							readOnly: true
						}, {
							id: 'alias',
							name: 'Alias',
							name$tr$: 'mtwo.aiconfiguration.alias',
							field: 'Alias',
							mandatory: true,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'mtwo-ai-configuration-parameter-alias-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ParameterAlias',
								displayMember: 'Alias',
								dataServiceName: 'mtwoAiConfigurationParameterAliasService'
							},
							width: 150
						}
					];

					let gridOtherColumn = [
						{
							id: 'name',
							name: 'Name',
							name$tr$: 'cloud.common.entityName',
							formatter: 'description',
							field: 'Name',
							width: 150,
							readonly: true
						}, {
							id: 'valuetype',
							name: 'Value Type',
							name$tr$: 'model.main.propertyValueType',
							formatter: 'description',
							field: 'ValueType',
							width: 100,
							readOnly: true
						}, {
							id: 'alias',
							name: 'Alias',
							name$tr$: 'mtwo.aiconfiguration.alias',
							editor: 'description',
							field: 'Alias',
							width: 150
						}
					];

					initGrid();

					function initGrid() {
						if (!platformGridAPI.grids.exist($scope.gridId)) {
							if ($scope.entity.ModelType === 0) {
								setupOtherGrid();
							} else {
								setupPredictSenseGrid();
							}
						} else {
							if ($scope.entity.ModelType === 0) {
								platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridOtherColumn));
							} else {
								platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridPredictSenseColumn));
							}
						}
					}

					function setupOtherGrid() {
						let otherGridConfig = {
							columns: angular.copy(gridOtherColumn),
							data: [],
							id: $scope.gridId,
							lazyInit: false,
							options: {
								skipPermissionCheck: true,
								tree: true,
								indicator: false,
								parentProp: 'MtoModelParameterFk',
								childProp: 'ChildItems',
								collapsed: false,
								idProperty: 'Guid'
							}
						};

						if (!platformGridAPI.grids.exist($scope.gridId)) {
							platformGridAPI.grids.config(otherGridConfig);
							platformTranslateService.translateGridConfig(otherGridConfig.columns);
						} else {
							platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridOtherColumn));
							platformTranslateService.translateGridConfig(otherGridConfig.columns);
						}
					}

					function setupPredictSenseGrid() {
						let predictSenseGridConfig = {
							columns: angular.copy(gridPredictSenseColumn),
							data: [],
							id: $scope.gridId,
							lazyInit: false,
							options: {
								skipPermissionCheck: true,
								tree: false,
								parentProp: 'MtoModelParameterFk',
								childProp: 'ChildItems',
								collapsed: false,
								indicator: false,
								idProperty: 'Guid'
							}
						};

						if (!platformGridAPI.grids.exist($scope.gridId)) {
							platformGridAPI.grids.config(predictSenseGridConfig);
							platformTranslateService.translateGridConfig(predictSenseGridConfig.columns);
						} else {
							platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridPredictSenseColumn));
							platformTranslateService.translateGridConfig(predictSenseGridConfig.columns);
						}
					}

					elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));

					platformGridAPI.events.register($scope.gridId, 'onInitialized', function () {
						platformGridAPI.grids.resize($scope.gridId);
					});

					$scope.$watch('model', function (newValue) {
						if ($scope.entity.ModelType === 0) {
							setupOtherGrid();
						} else {
							setupPredictSenseGrid();
						}
						platformGridAPI.items.data($scope.gridId, newValue);
					});

					$scope.$on('$destroy', function () {
						if (platformGridAPI.grids.exist($scope.gridId)) {
							platformGridAPI.grids.unregister($scope.gridId);
						}
					});
				}
			};
		}]);
})(angular);
