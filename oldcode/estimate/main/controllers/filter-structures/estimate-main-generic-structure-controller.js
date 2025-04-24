/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainControllingListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Controlling Unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainGenericStructureParentController',
		['_', '$rootScope', '$scope', 'platformGridAPI', '$timeout', 'estimateMainLineitemStructureConfigService', 'estimateMainDynamicConfigurationService', 'platformGenericStructureService', 'estimateMainService',
			function (_, $rootScope, $scope, platformGridAPI, $timeout, estimateMainLineitemStructureConfigService, estimateMainDynamicConfigurationService, platformGenericStructureService, mainService) {

				$scope.changed = false;

				function setDynamicCostGroupsToGenericStructure() {
					let scopeParent = $scope.$parent;
					scopeParent.config = estimateMainDynamicConfigurationService.getStandardConfigForLineItemStructure();
					scopeParent.scheme = estimateMainDynamicConfigurationService.getDtoScheme();
					scopeParent.options = scopeParent.options || {};
					scopeParent.options.columns = estimateMainDynamicConfigurationService.getStandardConfigForLineItemStructure().columns;
					scopeParent.state = [];

					$scope.changed = false;

					apply(function () {
						$scope.changed = true;
						scopeParent.$apply();
					});
				}

				function apply(fn) {
					let phase = $rootScope.$$phase;
					if (phase === '$apply' || phase === '$digest') {
						$timeout(fn);
					} else {
						fn();
					}
				}

				let removeItems = ['t7', 't8', 't11', 't15'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});

				let refreshBtn = {
					id: 'toolbarRefresh',
					sort: 200,
					caption: 'cloud.common.toolbarRefresh',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					disabled: function () {
						return !$scope.state.length;
					},
					fn: function refresh() {
						platformGenericStructureService.executeRequest($scope.state, $scope.getContainerUUID())
							.then(function (data) {
								$scope.$parent.containerItems = data;
							});
					}
				};

				let toolBarFilter = {
					id: 't15',
					sort: 110,
					caption: 'cloud.common.toolbarFilter',
					type: 'item',
					iconClass: 'tlb-icons ico-filter-off',
					disabled: () => !platformGenericStructureService.isFilterEnabled(),
					fn: function filterOff() {
						removeMarkers();
						platformGridAPI.grids.refresh($scope.getContainerUUID());
						platformGenericStructureService.clearFilteredItems();
						platformGenericStructureService.enableFilter(false);
						$rootScope.$emit('filterIsActive', false);
						$scope.tools.update();
						platformGenericStructureService.dataService.refresh(); // ALM # 93005 force refresh after filter is switch off rei@4.10.19
					}
				};

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'collapsenode',
							sort: 60,
							caption: 'cloud.common.toolbarCollapse',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function collapseSelected() {
								platformGridAPI.rows.collapseNextNode($scope.getContainerUUID());
							}
						},
						{
							id: 'expandnode',
							sort: 70,
							caption: 'cloud.common.toolbarExpand',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function expandSelected() {
								platformGridAPI.rows.expandNextNode($scope.getContainerUUID());
							}
						},
						refreshBtn,
						toolBarFilter
					]
				});

				function removeMarkers() {
					let _containerItems = platformGridAPI.rows.getRows($scope.getContainerUUID());

					const list = _.filter(_containerItems, {'IsMarked': true});
					list.forEach(function (item) {
						_.set(item, 'IsMarked', false);
					});
				}

				function updateTools() {
					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 'toolbarRefresh') {
							item.disabled = refreshBtn.disabled;
							item.fn = refreshBtn.fn;
						}
					});
				}

				estimateMainLineitemStructureConfigService.registerSetConfigLayout(setDynamicCostGroupsToGenericStructure);
				mainService.updateToolsAfterUpdated.register(updateTools);

				$scope.$on('$destroy', function () {
					estimateMainLineitemStructureConfigService.unregisterSetConfigLayout(setDynamicCostGroupsToGenericStructure);
					mainService.updateToolsAfterUpdated.unregister(updateTools);
				});

			}]);

})();
