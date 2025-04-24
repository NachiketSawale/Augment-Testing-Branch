(function (angular) {
	'use strict';

	/* global globals,angular */
	globals.lookups.ProductDescriptionProperties = function ($injector){
		var provider = $injector.get('ppsPlannedQuantityQuantityPropertiesProvider');

		return{
			lookupOptions: {
				lookupType: 'ProductDescriptionProperties',
				valueMember: 'Id',
				displayMember: 'Translation'
			},
			dataProvider: {
				getList: function () {
					return provider.getProperties();
				},
				getItemByKey: function (key) {
					return provider.getPropertyById(key);
				}
			}
		};
	};
	angular.module('productionplanning.formulaconfiguration').directive('ppsPlannedQuantityPropertyLookup', ['$injector',  'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.ProductDescriptionProperties($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {dataProvider:defaults.dataProvider});
		}
	]);
})(angular);