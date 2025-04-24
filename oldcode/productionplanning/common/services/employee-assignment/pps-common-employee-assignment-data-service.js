(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);
	module.factory('ppsCommonEmployeeAssignmentDataService', ppsCommonEmployeeAssignmentDataService);

	ppsCommonEmployeeAssignmentDataService.$inject = [
		'$injector',
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupFilterService'
	];

	function ppsCommonEmployeeAssignmentDataService (
		$injector,
		platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		platformDataServiceProcessDatesBySchemeExtension,
		basicsLookupdataLookupFilterService
	) {
		var filters = [
			{
				key: 'pps-common-employee-assignment-site-filter',
				fn: function (site) {
					return site.SiteTypeFk === 8;
				}
			}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		var serviceOptions = {
			flatLeafItem: {
				module: module,
				serviceName: 'ppsCommonEmployeeAssignmentDataService',
				entityNameTranslationID: 'productionplanning.common.empolyeeAssignment.entityPpsEmployeeAssignment',
				addValidationAutomatically: true,
				httpCRUD: {route: globals.webApiBaseUrl + 'productionplanning/common/employeeassign/', endRead: 'list'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PpsEmployeeAssignmentDto',
					moduleSubModule: 'ProductionPlanning.Common'
				})],
				entityRole: {
					leaf: {
						itemName: 'PpsEmployeeAssignment',
						parentService: $injector.get('timekeepingEmployeeDataService')
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData || []
							};
							return container.data.handleReadSucceeded(result, data);
						},
						initCreationData : function (creationData){
							var parentService = $injector.get('timekeepingEmployeeDataService');
							if(parentService !== null && parentService.getSelected() !== null){
								var selected = parentService.getSelected();
								creationData.Id = selected.Id;
							}
						}
					}
				}
			}
		};
		var container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			//	mustValidateFields: ['MdcCostCodeFk', 'BasSiteProdAreaFk', 'TksEmployeeFk','Percentage'],
			typeName: 'PpsEmployeeAssignmentDto',
			moduleSubModule: 'ProductionPlanning.Common',
			validationService: 'ppsCommonEmployeeAssignmentValidationService'
		});

		return  container.service;
	}
})(angular);