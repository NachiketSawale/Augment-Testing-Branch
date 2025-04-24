(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).directive('basicsConfigurationConfigurationCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 2,
				lookupType: 'prcconfiguration',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: 'eaa3fb99e37af8301cfef62ad7fce050',
				columns: [
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					},
					{
						id: 'RubricCategoryFk',
						field: 'RubricCategoryFk',
						name: 'Rubric Category',
						name$tr$: 'basics.lookup.rubriccategory',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'RubricCategory',
							displayMember: 'Description'
						},
						width: 100
					},
					{
						id: 'prcconfigheaderfk',
						field: 'PrcConfigHeaderFk',
						name: 'Configuration Header',
						name$tr$: 'project.main.entityConfigHeader',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'prcconfigheader',
							'displayMember': 'DescriptionInfo.Translated'
						},
						width: 150
					}
				],
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);