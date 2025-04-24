/**
 * $Id: boq-main-rounding-config-type-lookup.js 44255 2022-07-01 12:51:53Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainRoundingConfigTypeLookup
	 * @requires BasicsLookupdataLookupDirectiveDefinition
	 * @description
	 */
	angular.module('boq.main').directive('boqMainRoundingConfigTypeLookup', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'boqMainRoundingConfigTypeLookupService', '_',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition, boqMainRoundingConfigTypeLookupService, _) {

			let defaults = {
				lookupType: 'boqroundingconfigtype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : '',
				onDataRefresh: function ($scope) {
					boqMainRoundingConfigTypeLookupService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'boqMainRoundingConfigTypeLookupService',
				controller: ['$scope', function ($scope) {
					$scope.$watch('entity.boqRoundingConfigTypeFk', function (newValue) {
						if (_.isNumber(newValue)) {
							$injector.get('boqMainRoundingConfigDataService').load(newValue);
						}
						else {
							let boqMainRoundingConfigDataService = $injector.get('boqMainRoundingConfigDataService');
							let currentItem = boqMainRoundingConfigDataService.getCurrentItem();
							let isEditRoundingConfigType = false;
							if(_.isObject(currentItem)) {
								isEditRoundingConfigType = currentItem.isEditRoundingConfigType;
							}

							if(!isEditRoundingConfigType) {
								boqMainRoundingConfigDataService.setData({});
							}
						}
					});
				}]
			});
		}]);
})();
