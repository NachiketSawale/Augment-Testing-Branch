/**
 * Created by clv on 10/9/2017.
 */
(function(angular, globals){

	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.package';

	globals.lookups.boqCreateCriteriaType = function boqCreateCriteriaType() {
		return {
			lookupOptions: {
				lookupType : 'BoqCreateCriteriaType',
				valueMember : 'Id',
				displayMember : 'Description',
				uuid: '7aac1ed478854a1aa5308e28cdd94158'
			},
			dataProvider : 'packageBoqCreateCriteriaTypeService'
		};
	};

	angular.module(moduleName).directive('generateBoqItemCriteriaTypeCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = globals.lookups.boqCreateCriteriaType();
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}]);

})(angular, globals);
