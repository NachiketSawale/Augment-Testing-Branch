/**
 * Created by pel on 9/5/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';
	angular.module(moduleName).directive('projectInfoRequestDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 2,
				lookupType: 'ProjectInfoRequest',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '4c4a01cb77df4367abacc60d9ad80fce',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription'}
				],
				title: {name: 'Assign RFI', name$tr$: 'project.inforequest.assigRfi'}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);
