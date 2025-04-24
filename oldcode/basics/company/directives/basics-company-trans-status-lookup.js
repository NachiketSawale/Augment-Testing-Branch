

(function (angular, globals) {
	'use strict';

	globals.lookups.companyTransHeaderStatus = function conStatus() {
		return {
			lookupOptions: {
				lookupType: 'CompanyTransHeaderStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name basics.Company.directive:CompanyTransStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('basics.company').directive('basicsCompanyTransStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var options = angular.copy(globals.lookups.companyTransHeaderStatus().lookupOptions);
			var defaults = angular.extend(options, {
				imageSelector: 'platformStatusIconService'
			});

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular, globals);