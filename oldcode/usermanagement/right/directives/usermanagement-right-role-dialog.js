/**
 * Created by sandu on 29.09.2017.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.right').directive('usermanagementRightRoleDialog', ['BasicsLookupdataLookupDirectiveDefinition','$translate',
		function (BasicsLookupdataLookupDirectiveDefinition, $translate) {
			var defaults = {
				version: 3,
				lookupType: 'accessrole',
				valueMember: 'Id',
				displayMember: 'Name',
				uuid: '3e81897650174fc7b320c0265c6c4dac',
				columns: [
					{ id: 'name', field: 'Name', name: 'Role Name', name$tr$: 'usermanagement.right.roleName'},
					{ id: 'description', field: 'Description', name: 'Role Description', name$tr$: 'usermanagement.right.roleDescription'}
				],
				width: 500,
				height: 200,
				title: { name: $translate.instant('usermanagement.right.dialogTitleRole')}
			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);