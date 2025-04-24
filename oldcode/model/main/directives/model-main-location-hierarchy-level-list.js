/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.main.directive:modelMainLocationHierarchyLevelList
	 * @require $compile, $timeout, platformGridAPI, platformTranslateService, basicsLookupdataConfigGenerator,
	 *          modelViewerModelSelectionService
	 * @element div
	 * @restrict A
	 * @description Shows a grid in which users can edit hierarchy levels for location generation.
	 */
	angular.module('model.main').directive('modelMainLocationHierarchyLevelList', ['$compile', '$timeout',
		'platformGridAPI', 'platformTranslateService', 'modelMainLocationHierarchyWizardService',
		function ($compile, $timeout, platformGridAPI, platformTranslateService, modelMainLocationHierarchyWizardService) {
			return {
				restrict: 'A',
				scope: {
					model: '='
				},
				link: function ($scope, elem) {
					$scope.gridId = 'd5e2d2baafed453898c0fa33ff6a2b80';
					$scope.gridData = {
						state: $scope.gridId
					};

					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					var hasToCreate = modelMainLocationHierarchyWizardService.getHasToCreate();
					var grid = {
						data: [],
						lazyInit: true,
						enableConfigSave: false,
						columns: [{
							id: 'index',
							field: 'level',
							name$tr$: 'model.main.locationHierarchy.level',
							width: 40,
							formatter: 'code',
							sortable: false
						}, {
							id: 'pk',
							field: 'PropertyKeyFk',
							name$tr$: 'model.main.entityPropertyKey',
							width: 200,
							sortable: false,
							editor: 'lookup',
							editorOptions: {
								directive: 'model-main-property-key-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PropertyKey',
								displayMember: 'PropertyName',
								version: 3
							}
						}, {
							id: 'code',
							field: 'CodePattern',
							name$tr$: 'model.main.locationHierarchy.codePattern',
							width: 150,
							formatter: 'comment',
							// editor should be null if `hasToCreate` is true,Use 'comment' when hasToCreate is false
							editor: hasToCreate == false ? 'comment' : null,
							// readOnly based on `hasToCreate`
							readOnly: hasToCreate,
							sortable: false
						}, {
							id: 'description',
							field: 'DescriptionPattern',
							name$tr$: 'model.main.locationHierarchy.descPattern',
							width: 300,
							formatter: 'comment',
							editor: 'comment',
							sortable: false
						}],
						id: $scope.gridId,
						options: {
							skipPermissionCheck: true,
							tree: false,
							indicator: false,
							idProperty: 'Id'
						}
					};
					platformTranslateService.translateObject(grid.columns, 'name');
					platformGridAPI.grids.config(grid);

					elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));

					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});

					platformGridAPI.items.data($scope.gridId, $scope.model);
				}
			};
		}]);
})();