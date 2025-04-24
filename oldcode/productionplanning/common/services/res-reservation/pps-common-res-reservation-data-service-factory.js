/**
 * Created by zwz on 5/21/2018.
 */

/* global angular, globals */
(function (angular) {
	'use strict';

	var module = 'productionplanning.common';
	var serviceFactoryName = 'productionplanningCommonResReservationDataServiceFactory';
	angular.module(module).factory(serviceFactoryName, DataService);

	DataService.$inject = [
		'$injector',
		'basicsCommonContainerDialogService',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'productionplanningActivityResReservationValidationService',
		'ServiceDataProcessDatesExtension',
	'productionplanningCommonResReservationProcessor'];
	function DataService($injector, dialogDataService,
						 basicsLookupdataLookupDescriptorService,
						 platformDataServiceFactory,
						 basicsCommonMandatoryProcessor,
						 validationService,
						 ServiceDataProcessDatesExtension,
		productionplanningCommonResReservationProcessor) {

		var serviceFactory = {};
		var serviceCache = {};

		serviceFactory.createNewComplete = function (options) {
			var parentService = $injector.get(options.parentServiceName);
			var serviceContainer;
			var serviceOption = {
				flatLeafItem: {
					serviceName: options.serviceName,
					entityNameTranslationID: options.entityNameTranslationID,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/reservation/',
						endRead: 'getForMntActivity',//at the moment,in the server side,'getForMntActivity' also equals to 'get By PpsEvent'
						usePostForRead: true,
						initReadData: function (readData) {
							readData.PKey1 = parentService.getSelected().PpsEventFk;
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['ReservedFrom', 'ReservedTo']),productionplanningCommonResReservationProcessor],
					entityRole: {
						leaf: {
							itemName: 'ResReservation',
							parentService: parentService,
							parentFilter: 'resRequisitionId'
						}
					},
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
							handleCreateSucceeded: function (newItem) {
								if (newItem.Version === 0) {
									var selectedParent = parentService.getSelected();
									newItem.ReservedFrom = selectedParent.PlannedStart;
									newItem.ReservedTo = selectedParent.PlannedFinish;
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

			if(parentService.ChildServiceOptions){
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

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ReservationDto',
				moduleSubModule: 'Resource.Reservation',
				validationService: validationService.getReservationValidationService(serviceContainer.service)
			});

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
