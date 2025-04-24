/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
     * @ngdoc directive
     * @name estimateMainCostBudgetConfigType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	angular.module('estimate.main').directive('estimateMainCostBudgetConfigType', [
		'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainCostBudgetConfigTypeService',
		function (BasicsLookupdataLookupDirectiveDefinition, estimateMainCostBudgetConfigTypeService) {

			let defaults = {
				lookupType: 'estcostbudgetconfigtype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : '3183fad55a494ddc9df9ba3c9841897c',
				onDataRefresh: function ($scope) {
					estimateMainCostBudgetConfigTypeService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainCostBudgetConfigTypeService'
			});
		}]);
})();
