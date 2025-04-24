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
	angular.module('estimate.main').directive('estimateMainStructConfigType', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainEstStructureTypeService',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition, estimateMainEstStructureTypeService) {

			let defaults = {
				lookupType: 'eststructconfigtype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'ff692d37468c49eba80bcedca0f67b4f',
				onDataRefresh: function ($scope) {
					estimateMainEstStructureTypeService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainEstStructureTypeService',
				controller: ['$scope', function ($scope) {
					$scope.$watch('entity.estStructTypeFk', function (newValue) {
						if (newValue === null){
							$injector.get('estimateMainEstStructureDataService').setData({});
						}
					});
				}]
			});
		}]);
})();
