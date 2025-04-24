/**
 * Created by xai on 1/15/2018.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.procurementPackageForecastGroupTypeLookup = function procurementPackageForecastGroupTypeLookup($injector) {
		var procurementPackageForecastGroupTypeLookupService = $injector.get('procurementPackageForecastGroupTypeLookupService');
		return {
			lookupOptions: {
				lookupType: 'procurementPackageForecastGroupTypeLookup',
				valueMember: 'Id',
				displayMember: 'Description'
			},
			dataProvider: {
				getList: function () {
					return procurementPackageForecastGroupTypeLookupService.getList();
				},
				getItemByKey: function (key) {
					return procurementPackageForecastGroupTypeLookupService.getItemByIdAsync(key);
				},
				getSearchList: function () {
					return procurementPackageForecastGroupTypeLookupService.getSearchList();
				},
				getDisplayItem: function (value) {
					return procurementPackageForecastGroupTypeLookupService.getItemByIdAsync(value);
				}
			}
		};
	};

	angular.module('procurement.package').directive('procurementPackageForecastGroupTypeLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = globals.lookups.procurementPackageForecastGroupTypeLookup($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',
				defaults.lookupOptions, {
					dataProvider: defaults.dataProvider
				});
		}]);
})(angular, globals);