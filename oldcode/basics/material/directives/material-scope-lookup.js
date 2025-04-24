/**
 * Created by wui on 10/25/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialScopeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'MaterialScope',
				idProperty: 'Id',
				valueMember: 'MatScope',
				displayMember: 'MatScope',
				uuid: '9243ddcf1b5f7b6473c37a2796f62385',
				isTextEditable: true,
				disableInput: true,
				columns: [
					{id: 'MatScope', field: 'MatScope', name: 'Material Scope', width: 100, name$tr$: 'basics.material.entityMatScope'},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 120,
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);

})(angular);