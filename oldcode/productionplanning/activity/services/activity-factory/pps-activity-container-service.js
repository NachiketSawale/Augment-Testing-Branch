/**
 * Created by anl on 4/11/2018.
 */

(function (angular) {
	'use strict';

	var module = 'productionplanning.activity';

	/**
	 * @ngdoc service
	 * @name productionplanningActivityActivityContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(module).service('productionplanningActivityActivityContainerService', ActivityContainerService);

	ActivityContainerService.$inject = ['platformModuleInitialConfigurationService', 'productionplanningActivityActivityLayoutServiceFactory'];

	function ActivityContainerService(platformModuleInitialConfigurationService, activityLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, moduleCIS, initConf, parentService) {

			var config = activityLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, moduleCIS, initConf, parentService) {

			var config = activityLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);