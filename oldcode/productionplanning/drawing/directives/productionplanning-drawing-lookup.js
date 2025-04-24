/**
 * Created by zwz on 24/04/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).directive('productionplanningDrawingLookup', Lookup);

	Lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			version: 3,
			lookupType: 'EngDrawing',
			valueMember: 'Id',
			displayMember: 'Code',
			columns: [
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					width: 150,
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					width: 250,
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			disableDataCaching: true,
			pageOptions: {
				enabled: true,
				size: 100
			},
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);

	}
})(angular);
