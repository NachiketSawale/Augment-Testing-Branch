/**
 * Created by sandu on 21.11.2017.
 */
(function (angular) {
	'use strict';
	angular.module('basics.config').directive('basicsConfigModuleDialog', ['BasicsLookupdataLookupDirectiveDefinition','$translate',
		function (BasicsLookupdataLookupDirectiveDefinition, $translate) {
			var defaults = {
				lookupType: 'module',
				valueMember: 'Id',
				version: 3,
				displayMember: 'DescriptionInfo.Translated',
				dialogUuid: '96ee6dbb37b349938dcedb46ae2e6dae',
				uuid: '94019ae7ac254a2e8c57cf36a29c9b67',
				columns: [
					{ id: 'description', field: 'DescriptionInfo.Translated', name: 'Description', name$tr$: 'basics.config.entityDescription' },
					{ id: 'internalName', field: 'InternalName', name: 'Internal Name', name$tr$: 'basics.config.entityInternalName' }
				],
				width: 500,
				height: 200,
				title: { name: $translate.instant('basics.config.dialogTitleModule')}

			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);