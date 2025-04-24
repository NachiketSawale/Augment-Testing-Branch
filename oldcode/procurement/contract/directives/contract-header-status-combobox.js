/**
 * Created by lnb on 9/5/2014.
 */
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.conStatus = function conStatus() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'ConStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.contract.directive:procurementContractHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('procurement.common').directive('procurementContractHeaderStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var options = angular.copy(globals.lookups.conStatus().lookupOptions);
			var defaults = angular.extend(options, {
				imageSelector: 'platformStatusIconService'
			});

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular, globals);
