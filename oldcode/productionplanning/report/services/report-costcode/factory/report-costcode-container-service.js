/**
 * Created by anl on 3/30/2018.
 */

(function (angular) {
	'use strict';


	var module = 'productionplanning.report';

	/**
	 * @ngdoc service
	 * @name productionplanningReportCostCodeContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(module).service('productionplanningReportCostCodeContainerService', CostCodeContainerService);

	CostCodeContainerService.$inject = ['platformModuleInitialConfigurationService', 'productionplanningReportCostCodeLayoutServiceFactory'];

	function CostCodeContainerService(platformModuleInitialConfigurationService, costCodeLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, moduleCIS, initConf, parentService) {
			var config = costCodeLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, moduleCIS, initConf, parentService) {
			var config = costCodeLayoutServiceFactory.prepareConfig(containerUid, initConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);