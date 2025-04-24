(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainStandardAllowanceLookup',
		['$q', '_', '$injector', 'platformGridAPI', 'BasicsLookupdataLookupDirectiveDefinition','estimateMainStandardAllowanceLookupService',
			function ($q, _, $injector, platformGridAPI, BasicsLookupdataLookupDirectiveDefinition,estimateMainStandardAllowanceLookupService) {

				var defaults = {
					lookupType: 'EstStandardAllowanceLookup',
					valueMember: 'Id',
					displayMember: 'Code'
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: estimateMainStandardAllowanceLookupService
				});
			}]);
})(angular);
