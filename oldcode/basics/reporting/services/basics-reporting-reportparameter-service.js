/**
 * Created by sandu on 09.06.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.reporting';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsReportingReportParameterService
	 * @function
	 *
	 * @description
	 * data service for all ReportParameter related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsReportingReportParameterService', basicsReportingReportParameterService);

	basicsReportingReportParameterService.$inject = ['basicsReportingMainReportService', 'platformDataServiceFactory', 'basicsReportingSysContextItems', 'reportingPlatformService', '$q', '$http', '_', 'platformModuleStateService'];

	function basicsReportingReportParameterService(basicsReportingMainReportService, platformDataServiceFactory, basicsReportingSysContextItems, reportingPlatformService, $q, $http, _, platformModuleStateService) {
		var serviceFactoryOptions = {
			flatNodeItem: {
				module: configModule,
				serviceName: 'basicsReportingReportParameterService',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/reporting/reportparameter/'},
				actions: {},
				entityRole: {node: {itemName: 'ReportParameter', parentService: basicsReportingMainReportService}},
				entitySelection: {supportsMultiSelection: false},
				translation: {
					uid: 'basicsReportingReportParameterService',
					title: 'basics.reporting.reportParameterListTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: { typeName: 'ReportParameterDto', moduleSubModule: 'Basics.Reporting' }
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = basicsReportingMainReportService.getSelected().Id;
						}

					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		serviceContainer.service.getSysContextOptions = function () {
			return basicsReportingSysContextItems;
		};

		serviceContainer.service.getSelectedReportParameterId = function () {
			var selectedReportParameter = serviceContainer.service.getSelected();

			if (selectedReportParameter && selectedReportParameter.Id) {
				return selectedReportParameter.Id;
			}
		};

		serviceContainer.service.processParameter = function (data) {

			var responseParameter = data;
			var parameterOnHand = serviceContainer.service.getList();
			var parameterToCreate = [];
			var parameterToDelete = [];
			var deferred = $q.defer();
			var serviceContainerData = serviceContainer.data;

			// parameters to remove
			_.forEach(parameterOnHand, function (item) {
				if (!_.find(responseParameter, {'Name': item.ParameterName})) {
					var paramToDelete = serviceContainer.data.itemList.find(({ParameterName}) => ParameterName === item.ParameterName);
					parameterToDelete.push(paramToDelete);
					var modState = platformModuleStateService.state(basicsReportingMainReportService.getModule());
					var elemState = basicsReportingMainReportService.assertPath(modState.modifications);
					serviceContainer.service.addEntityToDeleted(elemState, paramToDelete, serviceContainerData, modState);
				}
			});

			_.forEach(parameterToDelete, function (item) {
				var index = parameterOnHand.indexOf(item);
				if (index !== -1) {
					parameterOnHand.splice(index, 1);
				}
			});

			//parameters to update
			_.forEach(responseParameter, function (item) {
				if (_.find(parameterOnHand, {'ParameterName': item.Name})) {
					var param = serviceContainer.data.itemList.find(({ParameterName}) => ParameterName === item.Name);
					param.ParameterName = item.Name;

					if (param.Default === null && item.ParamValue !== null) {
						param.Default = item.ParamValue;
					}

					param.DataType = item.ParamValueType;

					if (param.DescriptionInfo.Translated === null && item.Description !== null) {
						param.DescriptionInfo = {
							Description: item.Description,
							Translated: item.Description,
							Modified: true,
						};
					}
				}
			});

			// parameters to create
			_.forEach(responseParameter, function (item) {
				if (!_.find(parameterOnHand, {'ParameterName': item.Name})) {
					parameterToCreate.push({
						ReportFK: basicsReportingMainReportService.getSelected().Id,
						ParameterName: item.Name,
						DescriptionInfo: {
							Description: item.Description,
							Translated: item.Description,
							Modified: true,
							DescriptionTr: null
						},
						Default: item.ParamValue,
						DataType: item.ParamValueType
					});
				}
			});

			_.each(serviceContainer.data.itemList, serviceContainer.service.markItemAsModified);

			if (parameterToCreate.length > 0) {
				$http.post(globals.webApiBaseUrl + 'basics/reporting/reportparameter/processParameter', parameterToCreate).then(function (response) {
					deferred.resolve(response.data);
				}, function () {
					deferred.reject();
				});
			}

			return deferred.promise;
		};

		serviceContainer.service.callParameter = function () {

			var reportName = basicsReportingMainReportService.getSelectedReportReportName();
			var fileName = basicsReportingMainReportService.getSelectedReportFileName();
			var filePath = basicsReportingMainReportService.getSelectedReportFilePath();

			var report = {
				Name: reportName,
				TemplateName: fileName,
				Path: filePath
			};

			reportingPlatformService.getParameters(report, null)
				.then(function (data) {
					serviceContainer.service.processParameter(data)
						.then(function (data) {
							if (!data) {
								var mainItemId = basicsReportingMainReportService.getSelected().Id;
								serviceContainer.service.getParameterList(mainItemId).then(function (response) {
									data = response.data;
									serviceContainer.service.setList(data);
									_.each(data, serviceContainer.service.markItemAsModified);
								});
							} else {
								serviceContainer.service.setList(serviceContainer.service.getList().concat(data));
								_.each(data, serviceContainer.service.markItemAsModified);
							}
						}
						);
				}
				);
		};

		serviceContainer.service.getParameterList = function (mainItemId) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/reporting/reportparameter/listbyid',
				params: {id: mainItemId}
			}).then(function (response) {
				return response;
			}, function (error) {
				$log.error(error);
			});
		};

		return serviceContainer.service;
	}
})(angular);
