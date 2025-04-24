/**
 * Created by anl on 4/2/2018.
 */

(function (angular) {
	'use strict';


	var module = 'productionplanning.report';

	/**
	 * @ngdoc service
	 * @name productionplanningReportProductContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(module).service('productionplanningReportProductContainerService', ReportProductContainerService);

	ReportProductContainerService.$inject = ['platformModuleInitialConfigurationService', 'productionplanningReportProductLayoutServiceFactory'];

	function ReportProductContainerService(platformModuleInitialConfigurationService, productLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, moduleCIS, initConf, parentService, dialogConfig) {
			var config = productLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService, dialogConfig);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);