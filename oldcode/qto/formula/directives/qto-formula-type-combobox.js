/**
 * Created by lvi on 12/10/2014.
 */
(function (angular, globals) {

	/* globals globals */

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
	globals.lookups.QtoFormulaType = function QtoFormulaType(){
		return {
			lookupOptions:{
				lookupType: 'QtoFormulaType',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module('qto.formula').directive('qtoFormulaTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.QtoFormulaType();

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions);
		}]);

})(angular, globals);