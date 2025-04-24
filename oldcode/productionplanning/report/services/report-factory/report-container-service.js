/**
 * Created by anl on 3/28/2018.
 */

(function (angular) {
	'use strict';


	var module = 'productionplanning.report';

	/**
	 * @ngdoc service
	 * @name productionplanningReportReportContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(module).service('productionplanningReportReportContainerService', ReportContainerService);

	ReportContainerService.$inject = ['platformModuleInitialConfigurationService', 'productionplanningReportReportLayoutServiceFactory'];

	function ReportContainerService(platformModuleInitialConfigurationService, reportLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, moduleCIS, initConf, parentService) {
			var config = reportLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, moduleCIS, initConf, parentService) {
			var config = reportLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);