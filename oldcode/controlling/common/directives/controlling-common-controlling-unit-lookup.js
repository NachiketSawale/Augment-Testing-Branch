(function (angular) {
	'use strict';
	let defaults = {
		version:2,
		type:2,
		lookupType: 'GccCommonControllingUnit',
		valueMember: 'Id',
		displayMember: 'Code'
	};
	
	angular.module('controlling.common').directive('controllingCommonControllingUnitLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',defaults,{
				dataProvider: {
					myUniqueIdentifier: 'GccCommonControllingUnitHandler'
				}
			});
		}
	]);
	
})(angular);
