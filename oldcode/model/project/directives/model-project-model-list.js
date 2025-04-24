/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.main.directive:modelProjectModelList
	 * @element div
	 * @restrict A
	 *
	 * @description Shows a grid in which users can edit hierarchy levels for location generation.
	 */
	angular.module('model.project').directive('modelProjectModelList', ['_', '$compile', '$timeout',
		'platformGridAPI', 'platformTranslateService', 'basicsLookupdataConfigGenerator',
		'projectMainService', '$http',
		function (_, $compile, $timeout, platformGridAPI, platformTranslateService, basicsLookupdataConfigGenerator,
		          projectMainService, $http) {
			return {
				restrict: 'A',
				scope: {
					compositeModel: ' = entity'
				},
				link: function ($scope, elem) {
					$scope.gridId = 'b465a447831c4092a2bbc82f721d35ce';
					$scope.gridData = {
						state: $scope.gridId,
						model: []
					};

					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					var mkLookup = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						filter: function provideModelPropertyKeyFilter() {
							return projectMainService.getSelected().Id;
						},
						gridLess: false
					});
					var compositeModelFk = $scope.compositeModel.ModelFk;
					$scope.compositeModel.subModelsData = [];
					if (compositeModelFk) {
						$http.get(globals.webApiBaseUrl + 'model/main/object/trees?modelId=' + compositeModelFk).then(function (response) {
							var subModels = response.data;
							for (var i = 0; i < subModels.length; i++) {
								var myData = {
									Id: subModels[i].subModelId
								};
								$scope.gridData.model.push(myData);
								$scope.compositeModel.subModelsData.push(subModels[i].subModelId);
							}
							platformGridAPI.items.data($scope.gridId, $scope.gridData.model);

						});

						var grid = {
							data: $scope.gridData.model,
							lazyInit: true,
							enableConfigSave: false,
							columns: [
								_.assign({
									id: 'model',
									name$tr$: 'model.project.translationDescModel',
									width: 300,
									field: 'Id',
									editor: 'Id',
									formatter: 'model',
									sortable: true,
									isSelector: true
								}, mkLookup)
							],
							id: $scope.gridId,
							options: {
								skipPermissionCheck: true,
								tree: false,
								indicator: true,
								idProperty: 'Id'
							}
						};
						platformTranslateService.translateObject(grid.columns, 'name');
						platformGridAPI.grids.config(grid);

						elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data-data="gridData"></div></div>')($scope));

						$timeout(function () {
							platformGridAPI.grids.resize($scope.gridId);
						});

						platformGridAPI.items.data($scope.gridId, $scope.gridData.model);

						$scope.$on('wzdlgStepChanged', function () {
							platformGridAPI.grids.resize($scope.gridId);
						});


						platformGridAPI.events.register($scope.gridId, 'onCellChange', function () {
							var gridData = platformGridAPI.items.data($scope.gridId);
							if (gridData) {
								$scope.compositeModel.subModelsData = [];
								for (var i = 0; i < gridData.length; i++) {
									$scope.compositeModel.subModelsData.push(gridData[i].Id);
								}
							}
						});

					}

				}
			};
		}]);
})(angular);
