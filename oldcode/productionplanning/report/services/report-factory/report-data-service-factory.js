/**
 * Created by anl on 3/28/2018.
 */

(function (angular) {
	'use strict';

	var module = 'productionplanning.report';

	angular.module(module).service('productionplanningReportReportDataServiceFactory', ReportDataService);

	ReportDataService.$inject = ['basicsLookupdataLookupDescriptorService', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'productionpalnningReportReportValidationFactory',
		'productionplanningReportReportProcessor'];

	function ReportDataService(basicsLookupdataLookupDescriptorService, platformDataServiceProcessDatesBySchemeExtension,
							   platformDataServiceFactory, basicsCommonMandatoryProcessor, reportValidationFactory,
							   reportProcessor) {

		var serviceCache = {};
		var self = this;

		//get service or create service by data-service name
		this.getService = function (templInfo, parentService) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = serviceCache[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo.moduleName, parentService);
				serviceCache[dsName] = srv;
			}
			return srv;
		};

		this.getDataServiceName = function (templInfo) {
			return _.camelCase(templInfo.moduleName) + 'ReportDataService';
		};

		this.doCreateDataService = function (serviceName, moduleName, parentService) {

			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: 'ReportDto',
				moduleSubModule: 'ProductionPlanning.Report'
			});

			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: serviceName,
					entityNameTranslationID: 'productionplanning.report.entityReport',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/report/report/',
						endRead: 'list',
						endDelete: 'multidelete'
					},
					entityRole: {
						node: {
							itemName: 'Report',
							parentService: parentService,
							parentFilter: 'ActivityFk',
							useIdentification: true
						}
					},
					entitySelection: {supportsMultiSelection: true},
					dataProcessor: [dateProcessor, reportProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {

								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = readData.Main ? {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								} : readData;

								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							initCreationData: function (creationData) {
								creationData.Pkey1 = parentService.getSelected().Id;
							}
						}
					},
					translation: {
						uid: serviceName,
						title: 'productionplanning.report.entityReport',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					}
				}
			};

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ReportDto',
				moduleSubModule: 'ProductionPlanning.Report',
				validationService: reportValidationFactory.createValidationService(serviceContainer.service)
			});

			serviceContainer.service.canCreate = function () {
				var hlp = parentService.getSelected();
				return !_.isNil(hlp);
			};

			serviceContainer.service.canDelete = function () {
				var selectedReport = serviceContainer.service.getSelected();
				var hlp = selectedReport && parentService.getSelected();
				return !_.isNil(hlp) && selectedReport.Deletable;
			};

			serviceContainer.service.onDataReaded = function () {
			};

			serviceContainer.service.isSelectedItemApproved = function () {
				if (!serviceContainer.service.getSelected()) {
					return false;
				}
				var status = basicsLookupdataLookupDescriptorService.getLookupItem('MntReportStatus', serviceContainer.service.getSelected().RepStatusFk);
				return status && status.IsApproved;
			};

			return serviceContainer.service;
		};
	}
})(angular);