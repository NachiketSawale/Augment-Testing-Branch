(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterTestInputParameterValueCombobox',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'ParameterValue',
					valueMember: 'Id',
					disableDataCaching: false,
					displayMember: 'DescriptionInfo.Translated',
					isClientSearch: true
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: 'constructionSystemMasterParamterValueDataProvider'
				});
			}
		]);
})(angular);