(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.characteristic.directive:characteristicGrpLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Structure lookup.
	 *
	 */
	angular.module('basics.characteristic').directive('basicsCharacteristicGrpLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'basicsCharacteristicGrpLookup',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogUuid: '2d256204519b41ac8d71d8eaa9651c91',
				uuid: '23a90da4d9514c1fb1980f99d49e354f',
				columns: [
				// { id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'id', field: 'ID', name: 'Id' },
					{ id: 'Description', field: 'DescriptionInfo.Translated', name: 'Description' }
				],
				treeOptions: {
					parentProp: 'CharacteristicGroupFk',
					childProp: 'Children',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				processData: function (dataList) {
					for (var i = 0; i < dataList.length; ++i) {
						var data = dataList[i];
						if (data.CompanyTypeFk === 1) {
							data.image = 'control-icons ico-comp-businessunit';
						} else if (data.CompanyTypeFk === 2) {
							data.image = 'control-icons ico-comp-root';
						} else {
							data.image = 'control-icons ico-comp-profitcenter';
						}
					}
					return dataList;
				}
			});
		}]);

})(angular);