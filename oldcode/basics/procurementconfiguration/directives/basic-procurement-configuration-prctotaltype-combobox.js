/**
 * Created by wuj on 9/6/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).directive('basicsProcurementConfigurationTotalTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PrcTotalType',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'b5c072562f52476bb597d159c91c3e2b',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 120, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription' }
				],
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);