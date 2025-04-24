/**
 * $Id: package-resource-for-item-assignment-lookup.js  2022-12-20
 */

(function(angular){
	'use strict';
	let moduleName = 'procurement.package';

	angular.module(moduleName).directive('packageResourceForItemAssignmentLookup', estimateMainResourceForItemAssignmentLookup);

	estimateMainResourceForItemAssignmentLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function estimateMainResourceForItemAssignmentLookup(BasicsLookupdataLookupDirectiveDefinition) {
		let defaults = {
			version: 2,
			lookupType: 'estresource4itemassignment',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '07e8e13e1f1c4c65ba6ef2e9e4cf7846',
			columns: [
				{ id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode', formatter: 'code' },
				{ id: 'Desc', field: 'DescriptionInfo.Translated', name: 'Description', name$tr$: 'cloud.common.entityName', formatter: 'description' }
			],
			treeOptions: {
				parentProp: 'EstResourceFk',
				childProp: 'Children',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true
			},
			width: 500,
			height: 200,
			disableCache: true,
			selectableCallback: function(dataItem){
				return dataItem.EstResourceTypeFk !== 5 && !dataItem.IsReadOnlyByPrcPackage; // sub item and protected assembly item can not be selected
			}
		};

		let imageMap = { // EstResourceTypeFk
			1: 'ico-res-type-c',
			2: 'ico-res-type-m',
			3: 'ico-res-type-p',
			4: 'ico-res-type-a',
			5: 'ico-res-type-s',
			6: 'ico-res-type-p'
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
			processData: function (dataList) {
				let route = 'control-icons ';
				for (let i = 0; i < dataList.length; ++i) {
					let data = dataList[i];
					if (data.EstResourceTypeFk === 5 && data.EstAssemblyFk !== null) {
						data.image = route + 'ico-res-type-as';
					} else {
						data.image = route + imageMap[data.EstResourceTypeFk];
					}
				}
				return dataList;
			}
		});
	}
})(angular);
