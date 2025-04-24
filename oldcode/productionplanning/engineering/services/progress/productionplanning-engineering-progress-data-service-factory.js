/**
 * Created by zov on 27/06/2019.
 */
(function () {
	'use strict';
	/*global angular, _*/
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('ppsEngineeringProgressDataServiceFactory', ppsEngineeringProgressDataServiceFactory);
	ppsEngineeringProgressDataServiceFactory.$inject = ['$injector', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'ppsEngineeringProgressProcessor'];
	function ppsEngineeringProgressDataServiceFactory($injector, platformDataServiceFactory,
													  platformDataServiceProcessDatesBySchemeExtension, progressProcessor) {
		var serviceCache = {};
		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'EngDrwProgReportDto',
			moduleSubModule: 'ProductionPlanning.Engineering'
		});

		function injectService(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function createNewComplete(options) {
			var parentService = injectService(options.parentService);
			var serviceOption = {
				flatLeafItem: {
					module: moduleName,
					serviceName: parentService.getServiceName() + '_ProgressDataService',
					entityNameTranslationID: 'productionplanning.engineering.progressListTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/engineering/progress/',
						endRead: options.endRead
					},
					entityRole: {
						leaf: {
							itemName: 'ProgressReport',
							parentService: parentService,
							parentFilter: options.parentFilter
						}
					},
					dataProcessor: [dateProcessor, progressProcessor],
					presenter: {
						list: {
							initCreationData: function (creationData) {
								var parentSelected = parentService.getSelected();
								// PKey1 means drawing Id
								// PKey2 means task Id
								if (parentSelected) {
									if (options.parentFilter === 'engDrawingId') {
										creationData.PKey1 = parentSelected.Id;
										creationData.PKey2 = null;
									}
									else if (options.parentFilter === 'engTaskId') {
										creationData.PKey1 = parentSelected.EngDrawingFk;
										creationData.PKey2 = parentSelected.Id;
									}
								}
							},
							handleCreateSucceeded: function (newItem) {
								if (newItem) {
									Object.keys(newItem).forEach(function (prop) {
										if (prop.endsWith('Fk')) {
											if (newItem[prop] === 0) {
												newItem[prop] = null;
											}
										}
									});

									//newItem.PlannedQuantity = null;
									//newItem.Quantity = null;
									//newItem.RemainingQuantity = null;
								}
							},
							incorporateDataRead: function (readData, data) {
								var getPrjFn = options.getParentProjectIdFn;
								if(getPrjFn && parentService[getPrjFn]) {
									var prjId = parentService[getPrjFn].call(null);
									readData.forEach(function (item) {
										item.ProjectId = prjId;
									});
								}
								return serviceContainer.data.handleReadSucceeded(readData, data);
							}
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							if (options.parentFilter === 'engTaskId') {
								var parentService = injectService(options.parentService);
								var parentItem = parentService.getSelected();
								return !!parentItem && !!parentItem.EngDrawingFk;
							} else {
								return true;
							}

						}
					}
				}

			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			serviceContainer.service.setNewEntityValidator = function (validator) {
				serviceContainer.data.newEntityValidator = validator;
			};
			return serviceContainer.service;
		}

		function getService(options) {
			if (!serviceCache[options.parentService]) {
				serviceCache[options.parentService] = createNewComplete(options);
			}
			return serviceCache[options.parentService];
		}

		return {
			getService: getService
		};
	}
})();