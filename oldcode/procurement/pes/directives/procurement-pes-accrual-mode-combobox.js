/**
 * Created by wui on 2/1/2018.
 */

(function (angular, globals) { // jshint ignore:line
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.pes';

	globals.lookups.pesAccrualMode = function pesAccrualMode() {
		return {
			lookupOptions: {
				lookupType: 'PesAccrualMode',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				version:3
			}
		};
	};

	angular.module(moduleName).directive('procurementPesAccrualModeCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.pesAccrualMode().lookupOptions);
		}]);

})(angular, globals);