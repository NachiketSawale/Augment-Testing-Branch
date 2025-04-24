/**
 * Created by wuj on 9/9/2014.
 */

/* globals  globals */
(function (angular, globals) {
	'use strict';

	globals.lookups.MaterialGroup = function MaterialGroup(){
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'MaterialGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '851543aa3bd24948badc4206924f768c',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 120,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				treeOptions: {
					parentProp: 'MaterialGroupFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				pageOptions: {
					enabled: true,
					size: 1000
				},
				selectableCallback: function (dataItem) {
					// the item which id < 0 is material catalog.
					return dataItem.Id > 0;
				},
				dialogOptions: {
					alerts: [{
						theme: 'info',
						message$tr$: 'basics.material.error.materialGroupSelectError'
					}]
				}
			}
		};
	};

	angular.module('basics.material').directive('basicsMaterialMaterialGroupLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.MaterialGroup();

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, {
				processData: function (dataList) {
					for (var i = 0; i < dataList.length; ++i) {
						var data = dataList[i];
						if (!data.MaterialGroupFk) {
							data.image = 'cloud.style/content/images/control-icons.svg#ico-comp-root';
						} else {
							data.image = 'cloud.style/content/images/control-icons.svg#ico-folder-empty';
						}
					}
					return dataList;
				}
			});
		}]);

})(angular, globals);
