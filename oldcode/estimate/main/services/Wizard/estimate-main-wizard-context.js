/**
 * Created by wul on 1/29/2018.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	angular.module('estimate.main').constant('estimateMainResourceFrom', {
		EstimateMainResource: 1,
		EstimateAssemblyResource: 2,
		ProjectAssemblyResource:3
	});

	angular.module('estimate.main').factory('estimateMainWizardContext',
		['estimateMainResourceFrom', function (estimateMainResourceFrom) {

			// may remove to data service
			let curModuleName;

			function getConfig() {
				switch (curModuleName){
					case 'estimate.assemblies':
						return estimateMainResourceFrom.EstimateAssemblyResource;
					case 'estimate.main':
						return estimateMainResourceFrom.EstimateMainResource;
					case 'project.assemblies':
						return estimateMainResourceFrom.ProjectAssemblyResource;
					default:
						return estimateMainResourceFrom.EstimateMainResource;
				}
			}

			function setConfig(moduleName) {
				curModuleName = moduleName;
			}

			return {
				getConfig: getConfig,
				setConfig: setConfig
			};
		}]);
})(angular);
