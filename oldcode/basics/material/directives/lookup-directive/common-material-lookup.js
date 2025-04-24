/**
 * Created by chi on 29.07.2020.
 */
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.materialRecord = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'materialRecord',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'd1ad6aa0adb54bf3b4d642db17e2f984',
				columns: [
					{id: 'code', field: 'Code', name: 'Material Code', width: 100, name$tr$: 'basics.common.entityMaterialCode'},
					{id: 'desc', field: 'DescriptionInfo.Translated', name: 'Material Description', width: 150, name$tr$: 'basics.common.entityMaterialDescription'},
					{
						id: 'uom', field: 'BasUomFk', name: 'UoM', width: 150, name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'UoM',
							displayMember: 'Unit'
						}
					}
				],
				width: 500,
				height: 200,
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	angular.module( 'basics.material' ).directive( 'basicsMaterialCommonMaterialLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.materialRecord().lookupOptions);
		}
	]);
})(angular, globals);
