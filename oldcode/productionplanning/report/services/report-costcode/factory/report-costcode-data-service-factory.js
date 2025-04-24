/**
 * Created by anl on 3/30/2018.
 */

(function (angular) {
	'use strict';

	var module = 'productionplanning.report';

	angular.module(module).service('productionplanningReportCostCodeDataServiceFactory', CostCodeDataService);

	CostCodeDataService.$inject = ['basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'platformDataServiceModificationTrackingExtension',
		'basicsCommonMandatoryProcessor',
		'productionplanningReport2CostCodeValidationFactory',
		'$q', '$http',
		'productionplanningReportCostCodeProcessor',
		'basicsLookupdataLookupFilterService',
		'platformRuntimeDataService'];

	function CostCodeDataService(basicsLookupdataLookupDescriptorService,
								 platformDataServiceFactory,
								 platformDataServiceModificationTrackingExtension,
								 basicsCommonMandatoryProcessor,
								 report2CostCodeValidationFactory,
								 $q, $http,
								 reportCostCodeProcessor,
								 basicsLookupdataLookupFilterService,
								 platformRuntimeDataService) {

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
			return _.camelCase(templInfo.moduleName) + 'ReportCostCodeDataService';
		};

		this.doCreateDataService = function (serviceName, moduleName, parentService) {

			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: serviceName,
					entityNameTranslationID: 'productionplanning.report.entityReport2CostCode',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/report/report2costcode/',
						endRead: 'list'
					},
					entityRole: {
						leaf: {
							itemName: 'Report2CostCode',
							parentService: parentService,
							parentFilter: 'ReportFk'
						}
					},
					dataProcessor: [reportCostCodeProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {

								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = readData.Main ? {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								} : readData;

								var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
								return dataRead;
							},
							initCreationData: function (creationData) {
								creationData.Pkey1 = parentService.getSelected().Id;
							}
						}
					}
				}
			};

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;

			service.updateUom = function updateUom(item, validationService) {
				var report2CostCode = item;
				$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('CostCode', item.CostCodeFk)).then(function (costCode) {
					if (angular.isNumber(costCode.UomFk)) {
						report2CostCode.UomFk = costCode.UomFk;
						var result = validationService.validateUomFk(report2CostCode, report2CostCode.UomFk, 'UomFk');
						platformRuntimeDataService.applyValidationResult(result, report2CostCode, 'UomFk');
						platformDataServiceModificationTrackingExtension.markAsModified(service, report2CostCode, serviceContainer.data);
					}
				});
			};

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Report2CostCodeDto',
				moduleSubModule: 'ProductionPlanning.Report',
				validationService: report2CostCodeValidationFactory.createValidationService(serviceContainer.service)
			});

			service.canCreate = function () {
				var hlp = parentService.getSelected() && !parentService.isSelectedItemApproved();
				return _.isNil(hlp) ? false : hlp;
			};

			service.canDelete = function () {
				var hlp = serviceContainer.service.getSelected() && parentService.getSelected() && !parentService.isSelectedItemApproved();
				return _.isNil(hlp) ? false : hlp;
			};

			parentService.registerSelectionChanged(function () {
				reportCostCodeProcessor.updateStatus(parentService.isSelectedItemApproved());
			});

			function setAvailableCostCode() {
				var defer = $q.defer();
				var ccTypes = basicsLookupdataLookupDescriptorService.getData('CostCodeType');
				if(ccTypes) {
					defer.resolve(ccTypes);
				}
				else{
					$http.post(globals.webApiBaseUrl + 'basics/customize/costcodetype/list').then(function (response) {
						if(response.data) {
							basicsLookupdataLookupDescriptorService.updateData('CostCodeType', response.data);
							defer.resolve(response.data);
						}
					});
				}
				return defer.promise;
			}

			var filters = [{
					key: 'productionplanning-report-costcode-filter',
					serverKey: 'productionplanning-report-costcode-filter',
					serverSide: true,
					fn: function (item) {
						return {IsMounting: true};
					}
				}];

			setAvailableCostCode();

			serviceContainer.service.registerFilter = function () {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			serviceContainer.service.unregisterFilter = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			return serviceContainer.service;
		};
	}
})(angular);