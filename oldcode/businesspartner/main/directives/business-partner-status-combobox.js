// eslint-disable-next-line func-names
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.businessPartnerStatus = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'BusinessPartnerStatus',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	globals.lookups.businessPartnerStatus2 = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'BusinessPartnerStatus2',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	globals.lookups.customerStatus = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'CustomerStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	globals.lookups.supplierStatus = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'SupplierStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};
	globals.lookups.subsidiaryStatus = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'SubsidiaryStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};
	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementRequisitionHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('businesspartner.main').directive('businessPartnerSubsidiaryStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.subsidiaryStatus().lookupOptions);
		}]);
	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementRequisitionHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('businesspartner.main').directive('businessPartnerStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.businessPartnerStatus().lookupOptions);
		}]);

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementRequisitionHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('businesspartner.main').directive('businessPartnerStatus2Combobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.businessPartnerStatus2().lookupOptions);
		}]);

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementRequisitionHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('businesspartner.main').directive('businessPartnerCustomerStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.customerStatus().lookupOptions);
		}]);

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementRequisitionHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('businesspartner.main').directive('businessPartnerSupplierStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.supplierStatus().lookupOptions);
		}]);

})(angular, globals);

