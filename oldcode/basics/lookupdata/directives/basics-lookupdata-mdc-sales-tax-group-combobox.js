(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataMdcSalesTaxGroupCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'mdcsalestaxgroup',
				valueMember: 'Id',
				displayMember: 'Code',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode', width: 100 },
					{ id: 'desc', field: 'DescriptionInfo.Description', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 200 }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);