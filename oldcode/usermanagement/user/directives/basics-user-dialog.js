/**
 * Created by sandu on 03.07.2017.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.user').directive('usermanagementUserUserDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$translate',
		function (BasicsLookupdataLookupDirectiveDefinition, $translate) {
			var defaults = {
				version: 3,
				lookupType: 'user',
				valueMember: 'Id',
				displayMember: 'Name',
				uuid: 'cb1355be5ffb11e7907ba6006ad3dba0',
				columns: [
					{id: 'name', field: 'Name', name: 'Name', name$tr$: 'usermanagement.user.userName'},
					{id: 'description', field: 'Description', name: 'Description', name$tr$: 'usermanagement.user.userDescription'},
					{id: 'logonName', field: 'LogonName', name: 'Logon Name', name$tr$: 'usermanagement.user.userLogonName'},
					{id: 'email', field: 'Email', name: 'E-Mail', name$tr$: 'usermanagement.user.userEmail'}
				],
				width: 500,
				height: 200,
				title: {name: $translate.instant('usermanagement.user.dialogTitleUser')}
			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);
