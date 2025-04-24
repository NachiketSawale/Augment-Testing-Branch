(function (angular) {
	'use strict';

	/* global globals,angular */
	globals.lookups.ResourceTypes = function ($injector){
		var ResourceQuantityTypeProvider = $injector.get('ppsPlannedQuantityResourceQuantityTypeProvider');
		return{
			lookupOptions: {
				lookupType: 'ResourceTypes',
				valueMember: 'Id',
				displayMember: 'Code'
			},
			dataProvider: {
				getList: function () {
					return ResourceQuantityTypeProvider.getResourceTypes();
				},
				getItemByKey: function (key) {
					return ResourceQuantityTypeProvider.getResourceTypeItemById(key);
				}
			}
		};
	};
	angular.module('productionplanning.formulaconfiguration').directive('ppsPlannedQuantityResourceTypeLookup', ['$injector', 'ppsPlannedQuantityResourceQuantityTypeProvider',  'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, ResourceQuantityTypeProvider,  BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.ResourceTypes($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {dataProvider:defaults.dataProvider});
		}
	]);
})(angular);