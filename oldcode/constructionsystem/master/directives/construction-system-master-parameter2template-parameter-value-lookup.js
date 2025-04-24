/**
 * Created by chi on 6/12/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterParameter2templateParameterValueLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'CosMasterParameter2TemplateParameterValueLookup',
				valueMember: 'Id',
				displayMember: 'Description',
				filterKey: 'parameter2template-parameter-value-filter',
				showClearButton: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);