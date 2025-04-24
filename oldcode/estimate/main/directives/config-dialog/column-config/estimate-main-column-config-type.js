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
     * @name estimateMainColumnConfigType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	angular.module('estimate.main').directive('estimateMainColumnConfigType', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition','estimateMainColumnConfigTypeService',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition, estimateMainColumnConfigTypeService) {

			let defaults = {
				lookupType: 'estcolconfigtype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'c4f9c32e6cc149aa830ec7dddc7391e5',
				onDataRefresh: function ($scope) {
					estimateMainColumnConfigTypeService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainColumnConfigTypeService',
				controller: ['$scope', function ($scope) {
					$scope.$watch('entity.estColConfigTypeFk', function (newValue) {
						if (newValue === null){
							$injector.get('estimateMainEstColumnConfigDataService').setData({});
						}
					});
				}]
			});
		}]);
})();
