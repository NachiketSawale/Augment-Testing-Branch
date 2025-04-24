/**
 * Created by sandu on 09.06.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.reporting';
	var configModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsReportingReportParameterValuesService
     * @function
     *
     * @description
     * data service for all ReportParameterValues related functionality.
     */
	angular.module(moduleName).factory('basicsReportingReportParameterValuesService', basicsReportingReportParameterValuesService);

	basicsReportingReportParameterValuesService.$inject = ['basicsReportingReportParameterService', 'platformDataServiceFactory'];

	function basicsReportingReportParameterValuesService(RPService, platformDataServiceFactory) {

		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'basicsReportingReportParameterValuesService',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/reporting/reportparametervalues/'},
				entityRole: {leaf: {itemName: 'ReportParameterValues', parentService: RPService}},
				entitySelection: {supportsMultiSelection: false },
				translation: {
					uid: 'basicsReportingReportParameterValuesService',
					title: 'basics.reporting.reportParameterValuesListTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: { typeName: 'ReportParameterValuesDto', moduleSubModule: 'Basics.Reporting' }
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = RPService.getSelected().Id;
						}

					}
				}

			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		serviceContainer.service.getSelectedReportParameterValuesId = function () {

			var selectedReportParaParameterValues = serviceContainer.service.getSelected();
			if (selectedReportParaParameterValues && selectedReportParaParameterValues.Id) {
				return selectedReportParaParameterValues.Id;
			}
			// return 0;
		};

		return serviceContainer.service;
	}
})(angular);