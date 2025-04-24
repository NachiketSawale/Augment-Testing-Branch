/**
 * Created by lvy on 5/14/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).directive('constructionSystemMainHeaderParameterLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (
			BasicsLookupdataLookupDirectiveDefinition
		) {
			var defaults = {
				lookupType: 'cosglobalparam',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: '0aa9c3be085d466d974f6a526851b908',
				columns: [
					{
						id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 100
					},
					{
						id: 'variablename',
						field: 'VariableName',
						name: 'Variable Name',
						name$tr$: 'constructionsystem.master.entityVariableName',
						width: 100
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular);