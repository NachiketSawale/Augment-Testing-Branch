/**
 * Created by zos on 3/15/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).directive('boqMainParamStructureCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'structurelevel',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'boqMainParamStructureLookupDataService'
			});
		}
	]);
})(angular);
