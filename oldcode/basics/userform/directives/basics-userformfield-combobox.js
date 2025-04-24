(function (angular) {
	'use strict';

	var moduleName = 'basics.userform';
	angular.module(moduleName).directive('basicsUserFormFieldCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'UserFormField',
				valueMember: 'Id',
				displayMember: 'FieldName'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);


		}
	]);

})(angular);