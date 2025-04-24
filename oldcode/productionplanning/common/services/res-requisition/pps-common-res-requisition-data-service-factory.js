/*global angular, globals*/
(function (angular) {
	'use strict';

	var module = 'productionplanning.common';
	var serviceFactoryName = 'productionplanningCommonResRequisitionDataServiceFactory';
	angular.module(module).factory(serviceFactoryName, DataService);

	DataService.$inject = [
		'$injector',
		'basicsCommonContainerDialogService',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor',
		'productionplanningMountingResRequisitionProcessor',
		'productionplanningResourceRequisitionValidationServiceBase',
		'basicsCommonBaseDataServiceReferenceActionExtension',
	    'resourceRequisitionModifyProcessor',
		'productionplanningCommonRequisitionProcessor'];
	function DataService($injector,
						 dialogDataService,
						 basicsLookupdataLookupDescriptorService,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 basicsCommonMandatoryProcessor,
						 resRequisitionProcessor,
						 validationServiceBase,
						 referenceActionExtension,
                         resourceRequisitionModifyProcessor,
		productionplanningCommonRequisitionProcessor) {

		var serviceFactory = {};
		var serviceCache = {};

		serviceFactory.createNewComplete = function (options) {
			var parentService = options.parentServiceName ? $injector.get(options.parentServiceName) : undefined;

			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
				{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'}
			);
			var serviceContainer;
			var serviceOption = {
				flatLeafItem: {
					module: options.module,
					serviceName: options.serviceName,
					entityNameTranslationID: options.entityNameTranslationID,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/requisition/',
						endRead: 'listForMntActivity', //at the moment,in the server side,'listForMntActivity' also equals to 'list By PpsEvent'
						usePostForRead: options.usePostForRead
					},
					dataProcessor: [resRequisitionProcessor, dateProcessor, resourceRequisitionModifyProcessor,productionplanningCommonRequisitionProcessor],
					entityRole: (function () {
						if(parentService){
							if (options.isNode && options.isNode === true) {
								return {
									node: {
										itemName: 'ResRequisition',
										parentService: parentService,
										parentFilter: 'PpsEventId'
									}
								};
							} else {
								return {
									leaf: {
										itemName: 'ResRequisition',
										parentService: parentService,
										parentFilter: 'PpsEventId'
									}
								};
							}
						} else {
							return {
								root: {
									itemName: 'ResRequisition',
									moduleName: 'cloud.desktop.moduleDisplayNameTransport',
									descField: 'DescriptionInfo.Translated',
									useIdentification: true,//will set each pinningItem -> pItem.id = {Id: pItem.id}
									addToLastObject: true,
									lastObjectModuleName: options.moduleName
								}
							};
						}
					})(),
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData || []
								};
								basicsLookupdataLookupDescriptorService.attachData(readData);
								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							handleCreateSucceeded: function (item) {
								var parentItem = parentService.getSelected();
								item.PpsEventFk = parentItem.PpsEventFk;
								if (item.Version === 0) {//only set this when create item
									//set ProjectFk
									if(parentItem.ProjectFk){
										item.ProjectFk = parentItem.ProjectFk;
									}
									else if(parentItem.ProjectId){
										item.ProjectFk = parentItem.ProjectId;
									}

									item.JobFk = parentItem.LgmJobFk;
									item.RequestedFrom = parentItem.PlannedStart;
									item.RequestedTo = parentItem.PlannedFinish;
								}
							}
						}
					},
					actions: {
						create: 'flat',
						delete: {}
					}

				}
			};

			if(parentService && parentService.ChildServiceOptions){
				if(parentService.ChildServiceOptions.canCreateCallBackFunc){
					serviceOption.flatLeafItem.actions.canCreateCallBackFunc = parentService.ChildServiceOptions.canCreateCallBackFunc;
				}
				if(parentService.ChildServiceOptions.canDeleteCallBackFunc){
					serviceOption.flatLeafItem.actions.canDeleteCallBackFunc = parentService.ChildServiceOptions.canDeleteCallBackFunc;
				}
			}
			if(options.dataProcessorName){
				serviceOption.flatLeafItem.dataProcessor.push($injector.get(options.dataProcessorName));
			}

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			serviceContainer.data.setFilter = function (filter) {
				var parentItem = parentService.getSelected();
				if (parentItem && angular.isDefined(parentItem.PpsEventFk)) {
					serviceContainer.data.filter = 'PpsEventId=' + parentItem.PpsEventFk;
				} else {
					serviceContainer.data.filter = filter;
				}
			};

			var actions = {
				createReference: true,
				deleteReference: true,
				referenceForeignKeyProperty: 'PpsEventFk'
			};
			if(parentService && parentService.ChildServiceOptions) {
				actions.canCreateReference = parentService.ChildServiceOptions.canCreateReferenceCallBackFunc;
				actions.canDeleteReference = parentService.ChildServiceOptions.canDeleteReferenceCallBackFunc;
			}
			referenceActionExtension.addReferenceActions(serviceContainer, actions);

			if(parentService){
				var dialogService = $injector.get(options.dialogResRequisitionServiceName).createService(parentService);
				var config = {
					bodyTemplateUrl: globals.appBaseUrl + 'basics.common/templates/container-dialog/single-grid-container.html',
					handler: 'basicsCommonContainerDialogSingleGridContainerHandler',
					mainDataService: dialogService,
					serviceContainer: serviceContainer,
					uiConfig: {
						dialogTitle: 'productionplanning.common.resRequisitionDialogTitle',
						selectEntityText: 'productionplanning.common.entityResRequisition'
					},
					custom: {
						container: {
							dataService: dialogService,
							uiService: 'activityDialogResRequisitionListUIService',
							gridId: '2e3d02ff2b8448268258f966f85d7ec5'
						},
						currentDataService: serviceContainer.service,
						foreignKey: 'PpsEventFk'
					}
				};
				serviceContainer.service.showReferencesSelectionDialog = function () {
					dialogService.load();//refresh to avoid the dirty data
					$injector.get('basicsCommonContainerDialogService').showContainerDialog(config);
				};
			}

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'RequisitionDto',
				moduleSubModule: 'Resource.Requisition',
				validationService: validationServiceBase.getRequisitionValidationService(serviceContainer.service),
				mustValidateFields: ['UomFk', 'JobFk']
			});

			serviceContainer.service.loadResRequisition = function () {
				var parentItem = serviceContainer.service.parentService().getSelected();
				var ppsEventId = parentItem.PpsEventFk;
				serviceContainer.service.setFilter('PpsEventId=' + ppsEventId);
				serviceContainer.service.load();
			};

			serviceContainer.service.clearModifications = (entities) => {
				serviceContainer.data.doClearModifications(entities, serviceContainer.data);
			};

			return serviceContainer.service;
		};

		serviceFactory.getOrCreateService = function (options) {
			if(!serviceCache[options.serviceName]){
				serviceCache[options.serviceName] = serviceFactory.createNewComplete(options);
			}
			return serviceCache[options.serviceName];
		};

		serviceFactory.getServiceByName = function (serviceName) {
			if(serviceCache[serviceName]){
				return serviceCache[serviceName];
			}
			return null;
		};
		return serviceFactory;
	}
})(angular);