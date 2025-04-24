/**
 * Created by leo on 26.09.2016.
 */
(function () {
	'use strict';
	var modName = 'model.main';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardStepDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardStepDataService is a data service for managing steps of generic wizard instances.
	 */
	module.factory('modelMainInfoRequestDataService', ['projectInfoRequestNodeDataService', 'modelMainObjectDataService',
		function (projectInfoRequestNodeDataService, modelMainObjectDataService) {

			return projectInfoRequestNodeDataService.createInforRequestNodeDataService(modelMainObjectDataService, module);
		}]);
})();