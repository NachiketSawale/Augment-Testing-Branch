(function (angular) {

	'use strict';

	angular.module('resource.equipment').directive('resourceEquipmentPlantDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'ResourceEquipmentPlant',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '95afe50f99984f72b501338db6e93026',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'descriptioninfo', field: 'DescriptionInfo.Description', name: 'DescriptionInfo', name$tr$: 'cloud.common.entityDescription' },
					{ id: 'matchcode', field: 'Matchcode', name: 'Matchcode', name$tr$: 'resource.equipment.entityMatchCode' }


				],
				title: { name: 'resource.equipment.entityPlant' }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);

		}
	]);

})(angular);
