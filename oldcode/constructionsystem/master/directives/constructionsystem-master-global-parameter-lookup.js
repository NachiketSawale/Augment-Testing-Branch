/**
 * Created by lvy on 4/25/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterGlobalParameterLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'CosGlobalParameter',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: '61bb59c068f54c0ebec7ef8c15fcc1a3',
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
					},
					{
						id: 'propertyname',
						field: 'PropertyName',
						name: 'Property Name',
						name$tr$: 'constructionsystem.master.entityPropertyName',
						width: 100
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular);