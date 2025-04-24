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
	angular.module('estimate.main').directive('estimateMainEstRuleLevel', [
		'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainEstRuleLevelService',
		function (BasicsLookupdataLookupDirectiveDefinition, estimateMainEstRuleLevelService) {

			let defaults = {
				lookupType: 'estruleassignlevellookup',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'a6093d5ff4464aeebe77bcbc17f6c1da',
				onDataRefresh: function ($scope) {
					estimateMainEstRuleLevelService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainEstRuleLevelService'
			});
		}]);
})();
