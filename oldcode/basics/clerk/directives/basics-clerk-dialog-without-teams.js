(function cloudClerkClerkDialogDefinition(angular) {
	'use strict';

	angular.module('basics.clerk').directive('cloudClerkClerkDialogWithoutTeams', [
		'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupFilterService',
		function cloudClerkClerkDialog(BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupFilterService) {
			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'basics-clerk-only-group-filter',
				serverSide: true,
				serverKey: 'basics-clerk-only-group-filter',
				fn: function (entity) {
					return entity.IsClerkGroup;
				}
			}]);

			var defaults = {
				lookupType: 'clerk',
				valueMember: 'Id',
				displayMember: 'Code',
				version: 3,
				uuid: '43683f5e7d484ff1bf274762205f0e1b',
				dialogUuid: '6df7ca744ab64644b2f791b1ee3dc831',
				width: 500,
				height: 200,
				title: {
					name: 'cloud.common.dialogTitleClerk'
				},
				layoutOptions: {
					uiStandardServiceName: 'basicsClerkUIStandardService',
					schemas: [
						{
							typeName: 'ClerkDto',
							moduleSubModule: 'Basics.Clerk'
						}
					]
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);