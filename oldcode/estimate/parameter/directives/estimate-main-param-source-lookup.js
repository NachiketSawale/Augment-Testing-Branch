(function (angular) {
	'use strict';
	let moduleName = 'estimate.parameter';

	angular.module (moduleName).directive ('estimateMainParamSourceLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'structurelevel',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition ('combobox-edit', defaults, {
				dataProvider: 'estimateMainParamSourceLookupDataService'
			});
		}
	]);
}) (angular);
