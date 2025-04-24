/**
 * Created by chi on 7/5/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).directive('propertyFilterOperationCombobox',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'CosPropertyFilterOperation',
					valueMember: 'Id',
					displayMember: 'Description'
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: 'cosCommonPropertyOperationLookupService'
				});

			}]);
})(angular);