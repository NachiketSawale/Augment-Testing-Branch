/**
 * Created by anl on 2/6/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var module = angular.module(moduleName);
	module.factory('productionplanningActivityUnassignedBundleDataService', PpsActivityUnassignedBundleDataService);

	PpsActivityUnassignedBundleDataService.$inject = [
		'productionplanningActivityActivityDataService',
		'transportplanningBundleUnassignedDataServiceBuilder'];

	function PpsActivityUnassignedBundleDataService(parentService,
	                                                ServiceBuilder) {

		var mainOptionsType = 'flatNodeItem';
		var serviceInfo = {
			module: module,
			serviceName: 'productionplanningActivityUnassignedBundleDataService'
		};
		var parentFilter = 'ProjectId';
		var entityRole = {
			node: {
				itemName: 'Bundle',
				parentService: parentService
			}
		};
		var actions = {
			createReference: true
		};

		var builder = new ServiceBuilder(mainOptionsType);
		var serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setParentFilter(parentFilter)
			.setEntityRole(entityRole)
			.setActions(actions)
			.enablePpsItemFilter(true)
			.setNeedAssignDataService('productionplanningActivityTrsRequisitionBundleDataService')
			.build();

		return serviceContainer.service;
	}

})(angular);