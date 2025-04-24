/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainCostGroupAdaptorService', [
		'_',
		'cloudDesktopPinningContextService',
		'basicsCostGroupFilterCatalogFilterTypes',
		'constructionSystemMainInstanceService',
		'constructionSystemMainFilterService',
		function (_,
			cloudDesktopPinningContextService,
			catalogFilterTypes,
			instanceService,
			constructionSystemMainFilterService) {


			return {
				getMainService: function () {
					return instanceService;
				},
				getConfigModuleType: function () {
					return catalogFilterTypes.moduleType.CONSTRUCTION_SYSTEM;
				},
				getConfigModuleName: function () {
					return catalogFilterTypes.moduleName.CONSTRUCTURE_SYSTEM;
				},
				getProject: function () {
					var project = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
					return project ? project.id : null;
				},
				onCostGroupFilterChanged: function (checkedItems) {
					var filterItems = _.map(checkedItems, function (item) {
						return item.CostGroupCatFk + ':' + item.Id + ':' + (item.IsMarked ? 1 : 0);
					});
					instanceService.extendCustomFurtherFilters('COST_GROUP_FILTER', filterItems.join(','));
					instanceService.load();

					if (checkedItems.length > 0) {
						this._clearToolbar.value = true;
						constructionSystemMainFilterService.addFilterItem(this._clearToolbar);
					} else {
						constructionSystemMainFilterService.removeFilterItem(this._clearToolbar);
					}
				},
				onControllerCreated: function (scope, serviceContainer) {

					this._clearToolbar = {
						id: 'constructionsystem.main.costgroup.filter',
						iconClass: 'tlb-icons ico-filter-cost-group',
						fn: function () {
							serviceContainer.filterService.removeFilter();
						},
						caption: 'basics.costgroups.filteringByCostGroup',
						type: 'check',
						value: true
					};

					this._refreshCatalog = function () {
						serviceContainer.catalogService.refresh();
					};
					instanceService.registerRefreshRequested(this._refreshCatalog);
				},
				onControllerDestroyed: function (/* scope, serviceContainer */) {
					instanceService.unregisterRefreshRequested(this._refreshCatalog);
					this._refreshCatalog = null;
				}
			};

		}]);

})(angular);