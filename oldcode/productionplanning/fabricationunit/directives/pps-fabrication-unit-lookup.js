(function () {
	'use strict';
	/*globals angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).directive('ppsFabricationUnitLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PpsFabricationUnit',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '261e1b67d8914e26a58689870f3b9e6f',
				columns: [
					{ id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'ExternalCode', field: 'ExternalCode', name: 'ExternalCode', name$tr$: 'productionplanning.common.product.externalCode' },
					{ id: 'Description', field: 'DescriptionInfo.Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' }
				],
				width: 500,
				height: 200,
				version: 3
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})();