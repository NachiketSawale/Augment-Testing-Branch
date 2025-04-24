/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.main.directive:modelMainUpdateWizardGrid
	 * @element div
	 * @restrict A
	 * @description Shows a grid in which users can select model reference types.
	 */
	angular.module('model.main').directive('modelMainUpdateWizardGrid', ['$compile', '$timeout',
		'platformGridAPI', 'platformTranslateService',
		function ($compile, $timeout, platformGridAPI, platformTranslateService) {
			return {
				restrict: 'A',
				scope: {
					model: '='
				},
				link: function ($scope, elem) {
					$scope.gridId = 'f9d752c1e65047e482b1959e8563b8fb';
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
							id: 'type',
							name$tr$: 'model.main.modelUpdateWizard.type',
							formatter: 'description',
							field: 'Description',
							width: 200,
							readonly: true
						}, {
							id: 'number',
							name$tr$: 'model.main.modelUpdateWizard.number',
							formatter: 'integer',
							field: 'ExistingReferenceCount',
							width: 100,
							readonly: true
						}, {
							id: 'update',
							name$tr$: 'model.main.modelUpdateWizard.update',
							formatter: 'boolean',
							editor: 'boolean',
							field: 'CreateNewReferences',
							width: 100
						}, {
							id: 'keepExisting',
							name$tr$: 'model.main.modelUpdateWizard.keepExisting',
							formatter: 'boolean',
							editor: 'boolean',
							field: 'KeepExistingReferences',
							width: 100
						}, {
							id: 'deleteOrphaned',
							name$tr$: 'model.main.modelUpdateWizard.deleteOrphaned',
							formatter: 'boolean',
							editor: 'boolean',
							field: 'DeleteOrphanedItems',
							width: 100
						}, {
							id: 'remarks',
							name$tr$: 'model.main.modelUpdateWizard.remarks',
							formatter: 'description',
							field: 'Remarks',
							width: 100,
							readonly: true
						}],
						id: $scope.gridId,
						options: {
							skipPermissionCheck: true,
							tree: false,
							indicator: false,
							idProperty: 'ReferenceTypeId'
						}
					};
					platformTranslateService.translateObject(grid.columns, 'name');
					platformGridAPI.grids.config(grid);

					elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));

					platformGridAPI.events.register($scope.gridId, 'onInitialized', function () {
						platformGridAPI.grids.resize($scope.gridId);
						platformGridAPI.grids.markReadOnly($scope.gridId, true);
					});

					platformGridAPI.items.data($scope.gridId, $scope.model);
					$scope.$watch('model', function (newValue) {
						platformGridAPI.items.data($scope.gridId, newValue);
						platformGridAPI.grids.markReadOnly($scope.gridId, true);
					});
				}
			};
		}]);
})();
