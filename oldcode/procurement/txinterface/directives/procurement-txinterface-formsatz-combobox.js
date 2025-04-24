/**
 * Created by reimer on 20.09.2016.
 */

(function (angular, globals) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc directive
	 * @name
	 * @requires
	 * @description ComboBox to select a section
	 */

	var moduleName = 'procurement.txinterface';

	globals.lookups.procurementTxInterfaceFormSatzLookup = function procurementTxInterfaceFormSatzLookup() {
		return {
			lookupOptions: {
				lookupType: 'procurementTxInterfaceFormSatzLookup',
				valueMember: 'FormSatzId',
				displayMember: 'FormSatzBez'
			}
		};
	};

	angular.module(moduleName).directive('procurementTxInterfaceFormSatzCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',
				globals.lookups.procurementTxInterfaceFormSatzLookup().lookupOptions, {
					url: {
						getList: 'procurement/txinterface/formsatz/list',
						getItemByKey: 'procurement/txinterface/formsatz/getitembykey'
					}
				});
		}
	]);

})(angular, globals);

