(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).directive('prcCommonAccassignPrcGroupLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'BasAccassignPrcGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '997428f8edda4ef9b967a06884b80f53',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 130, name$tr$: 'cloud.common.entityDescription' }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);