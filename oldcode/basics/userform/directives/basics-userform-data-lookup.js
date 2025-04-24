(function (angular) {
	'use strict';

	var moduleName = 'basics.userform';
	angular.module(moduleName).directive('basicsUserFormDataLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'UserFormData',
				valueMember: 'Id',
				displayMember: 'FormDataIntersection.DescriptionInfo.Description',
				uuid: '8594e4403ab646e295c8e2c12a833d40',
				columns: [
					{ id: 'FormFk', field: 'FormFk', name: 'FormId', width: 100,name$tr$: 'FormId' },
					{ id: 'ContextFk', field: 'FormDataIntersection.ContextFk', name: 'ContextId', width: 150,name$tr$: 'ContextId' },
					{ id: 'Description', field: 'FormDataIntersection.DescriptionInfo.Description', name: 'Description', width: 150,name$tr$: 'Description' }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);