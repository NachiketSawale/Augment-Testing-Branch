/**
* Created by chi on 9/6/2015.
*/
(function (angular, $) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsLookupdataConfigGeneratorExtension',
		['basicsLookupdataConfigGenerator','platformLayoutHelperService',
			function(basicsLookupdataConfigGenerator,platformLayoutHelperService){
				var service = {};

				service.provideGenericLookupConfig = function provideGenericLookupConfig(moduleQualifier, att2BDisplayed, configObj) {
					var config = basicsLookupdataConfigGenerator.provideGenericLookupConfig(moduleQualifier, att2BDisplayed);
					if (!config) {
						return config;
					}
					platformLayoutHelperService.addConfigObjToLookupConfig(config,configObj);
					return config;
				};
				return service;
			}
		]);
})(angular, jQuery);