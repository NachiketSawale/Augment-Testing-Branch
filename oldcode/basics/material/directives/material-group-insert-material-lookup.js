/**
 * Created by ltn on 1/16/2017.
 */
/**
 * Created by wuj on 9/9/2014.
 */
(function (angular) {
	'use strict';

	angular.module('basics.material').directive('materialGroupInsertMaterialLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'MaterialGroupInsert',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'A28F36A09A9746A4A9E4862B5183AD22',
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
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
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

})(angular);