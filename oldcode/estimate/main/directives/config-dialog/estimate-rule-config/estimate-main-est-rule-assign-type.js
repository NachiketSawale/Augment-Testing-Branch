/**
 * Created by wri on 5/9/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
     * @ngdoc directive
     * @name estimateMainStructConfigType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	angular.module('estimate.main').directive('estimateMainEstRuleAssignType', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainEstRuleAssignTypeService',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition, estimateMainEstRuleAssignTypeService) {

			let defaults = {
				lookupType: 'estruleassigntypelookup',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : '1af75d1161324d539c28dccd10e6e5f4',
				onDataRefresh: function ($scope) {
					estimateMainEstRuleAssignTypeService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainEstRuleAssignTypeService',
				controller: ['$scope', function ($scope) {

					$scope.$watch('entity.estRuleAssignTypeFk', function (newValue) {
						if (newValue === null){
							$injector.get('estimateMainEstRuleDataService').setData({});
						}
					});
				}]
			});
		}]);
})();
