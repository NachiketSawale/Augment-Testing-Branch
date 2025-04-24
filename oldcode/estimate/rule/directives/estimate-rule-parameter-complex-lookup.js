
( function (angular) {
	'use strict';
	let moduleName = 'estimate.rule';

	angular.module(moduleName).directive('estimateRuleParameterComplexLookup', [
		'BasicsLookupdataLookupDirectiveDefinition', 'estimateRuleParameterComplexLookupCommonService',
		function (BasicsLookupdataLookupDirectiveDefinition, estimateRuleParameterComplexLookupCommonService) {

			let defaults = {
				lookupType: 'estimateRuleParameterComplexLookup',
				valueMember: 'Code',
				isClientSearch: true,
				isExactSearch: true,
				showCustomInputContent: true,
				formatter:estimateRuleParameterComplexLookupCommonService.displayFormatter,
				uuid: '872679239E974E4A81E08F36AB9CB19F',
				columns: estimateRuleParameterComplexLookupCommonService.getAllColumns(),
				title: {
					name: 'estimate.rule.rules'
				},events: [
					{
						name: 'onInputGroupClick',
						handler: function (e,arg) {
							if (!arg.entity.IsUnique) {
								estimateRuleParameterComplexLookupCommonService.openPopup(e, this);
							}
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					$scope.lookupOptions.showClearButton=false;
				}]
			});
		}
	]);
})(angular);
