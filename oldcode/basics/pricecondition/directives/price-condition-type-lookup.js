( function (angular) {
	'use strict';

	angular.module('basics.pricecondition').directive('basicsPriceConditionTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PrcPriceConditionType',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'cc38218fef1c4b4b927f78a64bf00af9',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 120, name$tr$: 'cloud.common.entityDescription' },
					{ id: 'vatPercent', formatter: 'money', field: 'Value', name: 'Value', width: 80, name$tr$: 'cloud.common.entityValue' },
					{ id: 'Sorting', field: 'Sorting', name: 'Sorting', width: 80, name$tr$: 'cloud.common.entitySorting' }
				],
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular);