(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.material.directive:basicsMaterialPriceConditionLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Configuration combobox.
	 *
	 */
	angular.module('basics.material').directive('basicsMaterialPriceConditionSimpleCombobox', ['platformModalService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (platformModalService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'prcpricecondition',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: true
			};

			return  new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

		}]);

})(angular);