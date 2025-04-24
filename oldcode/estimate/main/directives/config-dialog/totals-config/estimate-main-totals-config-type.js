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
     * @name estimateMainTotalsConfigType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	angular.module('estimate.main').directive('estimateMainTotalsConfigType', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainTotalsConfigTypeService',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition, estimateMainTotalsConfigTypeService) {

			let defaults = {
				lookupType: 'esttotalsconfigtype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'ad1caa33bb954dfe934afbf2e78f30f5',
				onDataRefresh: function ($scope) {
					estimateMainTotalsConfigTypeService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainTotalsConfigTypeService',
				controller: ['$scope', function ($scope) {
					$scope.$watch('entity.estTolConfigTypeFk', function (newValue) {
						if (newValue === null){
							$injector.get('estimateMainEstTotalsConfigDataService').setData({});
						}
					});
				}]
			});
		}]);
})();
