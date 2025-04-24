/**
 * Created by wui on 2/1/2018.
 */

(function (angular) { // jshint ignore:line
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataTransactionTypeCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'TransactionType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);