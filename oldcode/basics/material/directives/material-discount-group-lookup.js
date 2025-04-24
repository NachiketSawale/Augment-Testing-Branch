/**
 * Created by wuj on 9/11/2014.
 */
(function (angular) {
	'use strict';

	angular.module('basics.material').directive('basicsMaterialMaterialDiscountGroupLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'materialdiscountgroup',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogUuid: '76b00487ab84489c8501d4fc623a1398',
				uuid: '99b28b2d4b68456ab98c3cc2f719d696',
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
					parentProp: 'MaterialDiscountGroupFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);

