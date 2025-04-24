/**
 * Created by clv on 8/13/2018.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).directive('basicsMaterialUpdateMaterialPriceMaterialDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function(BasicsLookupdataLookupDirectiveDefinition){

			var defaults = {
				lookupType: 'MaterialLookup',
				valueMember: 'Id',
				displayMember: 'Code',
				showClearButton: true,
				uuid: '9ef1ebb41a78430d8bed5f761a6a1a7a',
				version: 3,
				formatter: function(id, item, value,lookupConfig){

					if(item){
						lookupConfig.dataView.scope.$parent.$parent.currentItem.materialDescription = item.DescriptionInfo.Description;
						return item.Code;
					}
					lookupConfig.dataView.scope.$parent.$parent.currentItem.materialDescription = null;
					return '';
				},
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 100,
						formatter: 'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'listprice',
						field: 'ListPrice',
						name: 'List Price',
						width: 80,
						formatter: 'money',
						name$tr$: 'basics.material.record.listprice'
					},
					{
						id: 'cost',
						field: 'Cost',
						name: 'Cost',
						width: 80,
						formatter: 'money',
						name$tr$: 'basics.material.record.cost'
					},
					{
						id: 'uom',
						field: 'BasUomFk',
						name: 'UoM',
						width: 80,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}
				],
				filterOptions:{
					serverKey: 'update-material-price-material-group-filter',
					serverSide: true,
					fn: function(entity){
						if(entity.materialGroupIds && entity.materialGroupIds.length > 0){
							var ids = entity.materialGroupIds;
							return {MdcMaterialGroupFk:ids};
						}
						return {Id: 0};
					}
				},
				pageOptions: {
					enabled: true
				}
			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);

		}]);
})(angular);
