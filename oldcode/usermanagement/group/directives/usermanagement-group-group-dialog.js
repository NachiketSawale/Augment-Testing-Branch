/**
 * Created by sandu on 29.09.2017.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.group').directive('usermanagementGroupGroupDialog', ['BasicsLookupdataLookupDirectiveDefinition','$translate',
		function (BasicsLookupdataLookupDirectiveDefinition, $translate) {
			var defaults = {
				lookupType: 'accessgroup',
				valueMember: 'Id',
				displayMember: 'Name',
				uuid: 'd7d15f594e5847eab1cb7eacc7712eb1',
				columns: [
					{ id: 'name', field: 'Name', name: 'Group Name', name$tr$: 'usermanagement.group.groupName' },
					{ id: 'description', field: 'Description', name: 'Description', name$tr$: 'usermanagement.group.groupDescription' }
				],
				width: 500,
				height: 200,
				title: { name: $translate.instant('usermanagement.group.dialogTitleGroup')}
			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);