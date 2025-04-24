
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonHeaderGroupLookup', ProductionplanningCommonHeaderGroupLookup);

	ProductionplanningCommonHeaderGroupLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function ProductionplanningCommonHeaderGroupLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'HeaderGroup',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '',
			columns: [
				{ id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
				{ id: 'Description', field: 'DescriptionInfo.Description', name: 'Description', name$tr$: 'cloud.common.descriptionInfo' }
			],
			width: 500,
			height: 200
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
	}
})(angular);