/**
 * Created by anl on 3/29/2018.
 */

(function (angular) {
	'use strict';


	var module = 'productionplanning.report';

	/**
	 * @ngdoc service
	 * @name productionplanningReportTimeSheetContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(module).service('productionplanningReportTimeSheetContainerService', TimeSheetContainerService);

	TimeSheetContainerService.$inject = ['platformModuleInitialConfigurationService', 'productionplanningReportTimeSheetLayoutServiceFactory'];

	function TimeSheetContainerService(platformModuleInitialConfigurationService, timeSheetLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, moduleCIS, initConf, parentService, dialogConfig) {
			var config = timeSheetLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService, dialogConfig);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, moduleCIS, initConf, parentService, dialogConfig) {
			var config = timeSheetLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService, dialogConfig);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);