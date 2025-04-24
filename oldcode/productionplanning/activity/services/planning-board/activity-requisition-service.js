/**
 * Created by anl on 3/12/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var masterModule = angular.module(moduleName);
	var serviceName = 'activityRequisitionService';
	masterModule.factory(serviceName, AcivityRequisitionService);
	AcivityRequisitionService.$inject = ['resourceRequisitionPlanningBoardServiceFactory', 'activityResourceService', 'productionplanningCommonRequisitionProcessor'];

	function AcivityRequisitionService(resourceRequisitionPlanningBoardServiceFactory, activityResourceService, productionplanningCommonRequisitionProcessor) {

		var container = resourceRequisitionPlanningBoardServiceFactory.createRequisitionService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = activityResourceService.getIdList();
				readData.ModuleName = moduleName;
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName
		});

		container.service.getDataProcessor().push(productionplanningCommonRequisitionProcessor);

		return container.service;

	}

})(angular);