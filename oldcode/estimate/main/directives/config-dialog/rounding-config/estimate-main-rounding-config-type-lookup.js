/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimateMainRoundingConfigTypeLookup
	 * @requires BasicsLookupdataLookupDirectiveDefinition
	 * @description
	 */
	angular.module('estimate.main').directive('estimateMainRoundingConfigTypeLookup', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainRoundingConfigTypeLookupService',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition, estimateMainRoundingConfigTypeLookupService) {

			let defaults = {
				lookupType: 'estroundingconfigtype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : '',
				onDataRefresh: function ($scope) {
					estimateMainRoundingConfigTypeLookupService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainRoundingConfigTypeLookupService',
				controller: ['$scope', function ($scope) {
					$scope.$watch('entity.estRoundingConfigTypeFk', function (newValue) {
						if (newValue === null){
							$injector.get('estimateMainRoundingConfigDataService').setData({});
						}
					});
				}]
			});
		}]);
})();
