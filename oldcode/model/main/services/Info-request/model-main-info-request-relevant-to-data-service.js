/**
 * Created by baf on 2016-08-24
 */
(function () {
	'use strict';
	var modName = 'model.main';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestRelevantToDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestRelevantToDataService is a data service for contribution to information requests
	 */
	module.factory('modelMainInfoRequestRelevantToDataService', ['projectInfoRequestRelevantToLeafDataService', 'modelMainInfoRequestDataService',

		function (projectInfoRequestRelevantToLeafDataService, modelMainInfoRequestDataService) {
			return projectInfoRequestRelevantToLeafDataService.createInfoRequestRelevantToService(modelMainInfoRequestDataService);
		}
	]);
})();