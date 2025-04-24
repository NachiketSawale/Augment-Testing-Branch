/**
 * Created by baf on 2016-08-24
 */
(function () {
	'use strict';
	var modName = 'model.main';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestContributionDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestContributionDataService is a data service for contribution to information requests
	 */
	module.factory('modelMainInfoRequestContributionDataService', ['projectInfoRequestContributionLeafDataService', 'modelMainInfoRequestDataService', 

		function (projectInfoRequestContributionLeafDataService, modelMainInfoRequestDataService) {
			return projectInfoRequestContributionLeafDataService.createInfoRequestContributionService(modelMainInfoRequestDataService);
		}
	]);
})();