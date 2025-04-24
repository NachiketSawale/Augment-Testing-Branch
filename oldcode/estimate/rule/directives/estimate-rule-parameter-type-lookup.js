/**
 * Created by spr on 2017-05-08.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';
	angular.module(moduleName).directive('estimateRuleParameterTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults={
				lookupType: 'ParameterValueType',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'estimateRuleParameterTypeDataService'
			});

		}]);
})(angular);
