/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.viewer.directive:modelViewerObjectSelectorList
	 * @element div
	 * @restrict A
	 * @description A directive that displays a list for selecting resources that can be used as the contents of a
	 *              wizard step.
	 */
	angular.module('model.viewer').directive('modelViewerObjectSelectorList', ['_', '$compile', 'platformGridAPI',
		'platformTranslateService', '$timeout', 'modelViewerSelectorService',
		function (_, $compile, platformGridAPI, platformTranslateService, $timeout, modelViewerSelectorService) {
			return {
				restrict: 'A',
				scope: {
					model: '='
				},
				link: function ($scope, elem) {
					$scope.gridId = 'c26548387790423089cd04e80f2deac0';
					$scope.gridData = {
						state: $scope.gridId
					};

					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					var grid = {
						data: [],
						lazyInit: true,
						enableConfigSave: false,
						columns: [{
							id: 'name',
							field: 'name',
							name$tr$: 'model.viewer.selectionWz.selectorName',
							width: 400,
							formatter: 'description',
							sortable: true,
							searchable: true,
							resizeable: true
						}],
						id: $scope.gridId,
						options: {
							skipPermissionCheck: true,
							tree: true,
							indicator: true,
							idProperty: 'id',
							childProp: 'selectors'
						}
					};
					platformTranslateService.translateObject(grid.columns, 'name');
					platformGridAPI.grids.config(grid);

					elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data-data="gridData"></div></div>')($scope));

					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
					$scope.$on('wzdlgStepChanged', function () {
						platformGridAPI.grids.resize($scope.gridId);
					});

					$timeout(function () {
						platformGridAPI.items.data($scope.gridId, modelViewerSelectorService.getSelectorTree());
					});

					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onActiveCellChanged);

					function onActiveCellChanged() {
						var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
						if (angular.isObject(selected) && selected.isSelector) {
							$scope.model.id = selected.id;
						} else {
							$scope.model.id = null;
						}
					}

					$scope.$on('$destroy', function () {
						platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onActiveCellChanged);
					});
				}
			};
		}]);
})(angular);
