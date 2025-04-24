/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular){
	'use strict';

	let moduleName = 'controlling.configuration';
	angular.module(moduleName).directive('controllingConfigColumnFormulaLookup', ['$q', 'BasicsLookupdataLookupDirectiveDefinition',
		'controllingConfigColumnFormulaLookupService','definitionType',
		function ($q, BasicsLookupdataLookupDirectiveDefinition,
			controllingConfigColumnFormulaLookupService, definitionType) {
			let defaults = {
				version: 2,
				lookupType: 'columnFormulaLookupType',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'eaa3fb99e37af8301cfef62ad7fce051',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 80, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.code'},
					{ id: 'description', field: 'Description', name: 'Description', width: 180, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription'},
					{ id: 'columnType', field: 'ColumnType', name: 'ColumnType', width: 160, toolTip: 'Column Type', formatter: 'description', name$tr$: 'basics.common.chartConfig.columnType'}
				],
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							let entity = args ? args.entity : null;
							if (args && entity && args.selectedItem) {
								let selected = args.selectedItem;
								if(selected.Type === definitionType.COLUMN ){
									entity.MdcContrFormulaPropdefFk = null;
									entity.MdcContrColumnPropdefFk = selected.itemId;
								}else{
									entity.MdcContrFormulaPropdefFk = selected.itemId;
									entity.MdcContrColumnPropdefFk = null;
								}
								if(entity.__rt$data && entity.__rt$data.errors && entity.__rt$data.errors.ReferenceColumn){
									delete entity.__rt$data.errors.ReferenceColumn;
								}
							}
						}
					}
				],
				filterKey: 'formula-definition-un-using-list-filter',

			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				dataProvider: {
					myUniqueIdentifier: 'EstimateLineType',

					getList: function getList() {
						return controllingConfigColumnFormulaLookupService.getList();
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value) {
						return controllingConfigColumnFormulaLookupService.getItemByKey(value);
					},

					getSearchList: function getSearchList() {
						return controllingConfigColumnFormulaLookupService.getSearchList();
					}
				}
			});
		}]);

})(angular);