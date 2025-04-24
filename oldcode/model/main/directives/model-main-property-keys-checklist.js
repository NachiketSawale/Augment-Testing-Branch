/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.main.directive:modelMainPropertyKeysChecklist
	 * @require $compile, platformGridAPI, platformTranslateService
	 * @element div
	 * @restrict A
	 * @description A directive that displays a checklist for selecting one or more property keys.
	 */
	angular.module('model.main').directive('modelMainPropertyKeysChecklist', ['$compile', 'platformGridAPI',
		'platformTranslateService', '$timeout',
		function ($compile, platformGridAPI, platformTranslateService, $timeout) {
			return {
				restrict: 'A',
				scope: {
					model: '='
				},
				link: function ($scope, elem) {
					$scope.gridId = '0ccabb02f06a47778350a87fc21cfc8b';
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
							name$tr$: 'model.main.propUoMWizard.propKeyName',
							width: 180,
							formatter: 'description',
							sortable: true,
							searchable: true,
							resizeable: true
						}, {
							id: 'include',
							field: 'isIncluded',
							name$tr$: 'model.main.propUoMWizard.propKeySelected',
							width: 180,
							formatter: 'boolean',
							editor: 'boolean',
							headerChkbox: true,
							sortable: true,
							searchable: true,
							resizeable: true
						}],
						id: $scope.gridId,
						options: {
							skipPermissionCheck: true,
							tree: false,
							indicator: true,
							idProperty: 'id'
						}
					};
					platformTranslateService.translateObject(grid.columns, 'name');
					platformGridAPI.grids.config(grid);

					elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));

					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
					$scope.$on('wzdlgStepChanged', function () {
						platformGridAPI.grids.resize($scope.gridId);
					});

					$scope.$watch('model', function (newValue) {
						platformGridAPI.items.data($scope.gridId, newValue || []);
					});
				}
			};
		}]);
})();