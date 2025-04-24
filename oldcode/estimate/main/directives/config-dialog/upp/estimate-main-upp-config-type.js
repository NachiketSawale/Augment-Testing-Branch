/**
 * Created by bel on 8/28/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
     * @ngdoc directive
     * @name estimateMainUppConfigType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainUppConfigType', [
		'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainEstUppConfigTypeService',
		function (BasicsLookupdataLookupDirectiveDefinition, estimateMainEstUppConfigTypeService) {

			let defaults = {
				lookupType: 'estuppconfigtype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'a2c1d73d16e24963a026be4f5070bc82',
				onDataRefresh: function ($scope) {
					estimateMainEstUppConfigTypeService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainEstUppConfigTypeService'
			});
		}]);
})();
