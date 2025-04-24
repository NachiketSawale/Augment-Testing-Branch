(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataPaymentTermLookup',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PaymentTerm',
				valueMember: 'Id',
				uuid: '365363e7f182484b8bc2869f9ceeee5b',
				displayMember: 'Code',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode', width: 100 },
					{ id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 200 }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);