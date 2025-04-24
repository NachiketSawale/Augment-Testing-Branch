/**
 * Created by chi on 2018/2/27.
 */
(function(angular){
	'use strict';
	var moduleName = 'basics.characteristic';
	angular.module(moduleName).directive('basicsCharacteristicGroupDataCombineLookup', basicsCharacteristicGroupAndDataLookup);

	basicsCharacteristicGroupAndDataLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsCharacteristicGroupDataCombineLookupService'];

	function basicsCharacteristicGroupAndDataLookup(BasicsLookupdataLookupDirectiveDefinition, basicsCharacteristicGroupDataCombineLookupService){
		var defaults = {
			lookupType: basicsCharacteristicGroupDataCombineLookupService.getlookupType(),
			valueMember: 'Id',
			displayMember: 'Code',
			dialogUuid: '3ea554c2356945a39da8ebe82c648709',
			uuid: '4a0687aa3b1544c3a6ab6113188b9fd9',
			columns: [
				{ id: 'code', field: 'Code', name: 'Code', formatter: 'code', width: 80, name$tr$: 'cloud.common.entityCode' },
				{ id: 'desc', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', width: 150, name$tr$: 'cloud.common.entityDescription' }
			],
			treeOptions: {
				parentProp: 'CharacteristicGroupFk',
				childProp: 'Children',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true
			},
			width: 500,
			height: 200,
			disableDataCaching : true,
			selectableCallback: function(dataItem){
				return !dataItem.IsGroup;
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
			dataProvider: {
				getList: basicsCharacteristicGroupDataCombineLookupService.getList,
				getItemByKey: basicsCharacteristicGroupDataCombineLookupService.getItemById,
				getSearchList: basicsCharacteristicGroupDataCombineLookupService.getSearchList,
			}
		});
	}
})(angular);