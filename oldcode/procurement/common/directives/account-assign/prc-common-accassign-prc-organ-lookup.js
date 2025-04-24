(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).directive('prcCommonAccassignPrcOrganLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'BasAccassignPrcOrgan',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '55fa333309694f728de8add0fc302c68',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);