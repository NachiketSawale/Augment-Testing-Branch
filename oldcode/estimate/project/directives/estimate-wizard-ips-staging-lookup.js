/**
 * Created by ohiaguc on 2019/12/4.
 */
(function(angular){
	'use strict';

	// estimate-wizard-staging-lookup
	angular.module('estimate.project').directive('estimateWizardIpsStagingLookup',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version: 1,
				lookupType: 'estimatewizardipsstaging',
				uuid: 'd1378e26f807425db5e3325c39fcf273',

				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					let searchString = 'Project_BPID.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g, searchValue);
				},
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);
})(angular);
