/**
 * Created by pel on 3/25/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';
	/**
     * @ngdoc directive
     * @name procurement.common.directive:procurementCommonDocumentTypeCombobox
     * @element div
     * @restrict A
     * @description
     * Configuration combobox.
     *
     */
	angular.module(moduleName).directive('basicsProcurementConfigurationRubricCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'Rubric',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);
