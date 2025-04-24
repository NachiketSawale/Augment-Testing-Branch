(function (angular) {
	'use strict';
	let defaults = {
		version:2,
		type:2,
		lookupType: 'GccCommonProjectChange',
		valueMember: 'Id',
		displayMember: 'Code'
	};
	
	angular.module('controlling.common').directive('controllingCommonProjectChangeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',defaults,{
				dataProvider: {
					myUniqueIdentifier: 'GccCommonProjectChangeHandler'
				}
			});
		}
	]);
	
})(angular);
