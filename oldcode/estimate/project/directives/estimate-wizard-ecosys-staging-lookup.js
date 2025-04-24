/**
 * Created by ohiaguc on 2019/12/4.
 */
(function(angular){
	'use strict';

	// estimate-wizard-staging-lookup
	angular.module('estimate.project').directive('estimateWizardEcosysStagingLookup',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version: 1,
				lookupType: 'estimatewizardecosysstaging',
				uuid: '38fe587393ad4e6ba6f0ad393eb78d09',

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
