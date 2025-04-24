(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementCommonConfigurationCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Configuration combobox.
	 *
	 */
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).directive('basicsProcurementStructurePrcConfigHeaderComboBox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'prcconfigheader',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);