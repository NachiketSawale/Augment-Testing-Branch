(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'controlling.revrecognition';
	globals.lookups.RevenueRecognitionAccrualType = function RevenueRecognitionAccrualType() {
		return {
			lookupOptions: {
				lookupType: 'RevenueRecognitionAccrualType',
				valueMember: 'Id',
				displayMember: 'Description',
				version: 3
			}
		};
	};

	angular.module(moduleName).directive( 'controllingRevenueRecognitionAccrualTypeCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.RevenueRecognitionAccrualType().lookupOptions);
		}
	]);

})(angular);
