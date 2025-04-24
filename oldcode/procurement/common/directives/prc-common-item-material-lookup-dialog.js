/**
 * Created by alm on 5/7/2019.
 */
(function(angular, globals){
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcItem = function itemMaterialLookup() {
		return {
			lookupOptions: {
				version: 2,
				lookupType: 'PrcItem',
				uuid: '19C1FB4964374BA99F621385506240FE',
				valueMember: 'Id',
				displayMember: 'MaterialCode',
				width: 500,
				height: 200,
				columns: [
					{ id: 'itemNo', field: 'ItemNO', name: 'Item no', name$tr$: 'procurement.common.prcItemItemNo' },
					{ id: 'desc', field: 'PrcItemDescription', name: 'Description',width:200, name$tr$: 'cloud.common.entityDescription' },
					{ id: 'mdcMaterialFk',
						field: 'MdcMaterialFk',
						name: 'Material',
						name$tr$: 'cloud.common.prcItemMaterialNo',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},
						width:120,
						searchable: false
					},
					{
						id: 'MaterialDescription',
						field: 'MdcMaterialFk',
						width: 200,
						name: 'Material Description',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'DescriptionInfo.Translated'
						},
						name$tr$: 'procurement.common.entityMaterialDescription',
						readonly: true,
						searchable: false
					}
				],
				title: { name: 'item', name$tr$: 'procurement.common.dialogTitleItem' }
			}
		};
	};

	angular.module('procurement.common').directive('prcCommonItemMaterialLookupDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.prcItem().lookupOptions);
		}
	]);
})(angular, globals);
