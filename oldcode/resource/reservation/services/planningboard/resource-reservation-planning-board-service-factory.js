(function (angular) {

	'use strict';
	var module = angular.module('resource.reservation');
	module.service('resourceReservationPlanningBoardServiceFactory', ResourceReservationPlanningBoardServiceFactory);

	ResourceReservationPlanningBoardServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension',
		'resourceReservationValidationProcessor', 'basicsUnitQuantityProcessorFactoryService', 'resourceReservationTypeAndStatusService', 'resourceReservationReadonlyProcessorService'];

	function ResourceReservationPlanningBoardServiceFactory(_, platformDataServiceFactory, ServiceDataProcessDatesExtension,
	  resourceReservationValidationProcessor, basicsUnitQuantityProcessorFactoryService, resourceReservationTypeAndStatusService, resourceReservationReadonlyProcessorService) {

		this.createReservationService = function createReservationService(options) {
			var serviceOption = {
				flatLeafItem: {
					module: module,
					serviceName: options.serviceName,
					entityNameTranslationID: 'resource.reservation.entityReservation',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/reservation/',
						endRead: 'getForPlanningBoard',
						endDelete: 'multidelete',
						usePostForRead: true,
						initReadData: options.initReadData
					},
					actions: {delete: true, create: 'flat'},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							initCreationData: function initReservationCreationData(/* creationData, data, creationOptions */) {
								// Todo: Move client side business logic from PlatformPlanningBoardDataService into server side business logic.
							},
							incorporateDataRead: (options.incorporateDataRead && _.isFunction(options.incorporateDataRead)) ? options.incorporateDataRead : false
						}
					},
					entityRole: {
						leaf: {
							itemName: options.itemName || 'Reservations',
							moduleName: 'cloud.desktop.moduleDisplayNameResourceReservation',
							useIdentification: true,
							parentService: options.parentService
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['ReservedFrom', 'ReservedTo','Requisition.RequestedFrom', 'Requisition.RequestedTo']),
						resourceReservationReadonlyProcessorService,
						basicsUnitQuantityProcessorFactoryService.createProcessor({
							deepObjectPrefix: '',
							valueProp: 'Quantity',
							uoMProp: 'UomFk',
							quantityUoMProp: 'QuantityWithUom',
							schemeRef: {
								typeName: 'ReservationDto',
								moduleSubModule: 'Resource.Reservation'
							}
						}),
						basicsUnitQuantityProcessorFactoryService.createProcessor({
							deepObjectPrefix: '',
							valueProp: 'Quantity',
							uoMProp: 'UomFk',
							quantityUoMProp: 'QuantityWithUom',
							schemeRef: {
								typeName: 'RequisitionDto',
								moduleSubModule: 'Resource.Requisition'
							}
						}),
						{
							processItem: function processItem(/* item */) {
								// optionally set additional info fields 1-3 here by extending json object
								// item.InfoField2 = item.QuantityWithUom;
							}
						}
					]
				}
			};

			if (options.dataProcessor) {
				serviceOption.flatLeafItem.dataProcessor = serviceOption.flatLeafItem.dataProcessor.concat(options.dataProcessor);
			}
			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			if (options.parentService && options.parentService.isRoot) {
				container.service.canForceUpdate = function canForceUpdateAsReservation() {
					return true;
				};
			}

			container.service.validateReservation = function validateReservation(items) {
				resourceReservationValidationProcessor.validate(items);
			};

			var originLoad = container.service.load;
			let selectedAssignmentChangedCallback = null;

			function loadAndRestoreSelection() {
				let selected = container.service.getSelected();
				return originLoad().then(function () {
					if (_.isObject(selected)) {
						container.service.setSelected(selected);
					}
				});
			}

			container.service.getReservationStatus = function getReservationStatus() {
				return resourceReservationTypeAndStatusService.getReservationStatus();
			};

			container.service.getReservationType = function getReservationType() {
				return resourceReservationTypeAndStatusService.getReservationType();
			};

			container.service.setSelectedAssignment = function setSelectedAssignment(selection) {
				_.forEach(container.data.itemList, function(item) {
					item.activeFlag = false;
					item.selectedFlag = false;
				});

				container.service.setSelected(selection);

				if(selection) {
					selection.activeFlag = true;
					selection.selectedFlag = true;
				}

				if(selectedAssignmentChangedCallback) {
					selectedAssignmentChangedCallback();
				}
			};

			container.service.registerSelectedAssignmentChanged = function registerSelectedAssignmentChanged(callbackFn) {
				selectedAssignmentChangedCallback = callbackFn;
			};

			container.service.unregisterSelectedAssignmentChanged = function unregisterSelectedAssignmentChanged(callbackFn) {
				if(selectedAssignmentChangedCallback === callbackFn) {
					selectedAssignmentChangedCallback = null;
				}
			};

			// override original fn
			container.service.load = loadAndRestoreSelection;

			return container;
		};

		this.createReservationNodeService = function createReservationNodeService(options) {
			var serviceOption = {
				flatNodeItem: {
					module: module,
					serviceName: options.serviceName,
					entityNameTranslationID: 'resource.reservation.entityReservation',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/reservation/',
						endRead: 'getForPlanningBoard',
						endDelete: 'multidelete',
						usePostForRead: true,
						initReadData: options.initReadData
					},
					actions: {delete: true, create: 'flat'},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							initCreationData: function initReservationCreationData(/* creationData, data, creationOptions */) {
								// Todo: Move client side business logic from PlatformPlanningBoardDataService into server side business logic.
							},
							incorporateDataRead: (options.incorporateDataRead && _.isFunction(options.incorporateDataRead)) ? options.incorporateDataRead : false
						}
					},
					entityRole: {
						node: {
							itemName: options.itemName || 'Reservations',
							moduleName: 'cloud.desktop.moduleDisplayNameResourceReservation',
							useIdentification: true,
							parentService: options.parentService
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['ReservedFrom', 'ReservedTo','Requisition.RequestedFrom', 'Requisition.RequestedTo']),
						resourceReservationReadonlyProcessorService,
						basicsUnitQuantityProcessorFactoryService.createProcessor({
							deepObjectPrefix: '',
							valueProp: 'Quantity',
							uoMProp: 'UomFk',
							quantityUoMProp: 'QuantityWithUom',
							schemeRef: {
								typeName: 'ReservationDto',
								moduleSubModule: 'Resource.Reservation'
							}
						}),
						basicsUnitQuantityProcessorFactoryService.createProcessor({
							deepObjectPrefix: '',
							valueProp: 'Quantity',
							uoMProp: 'UomFk',
							quantityUoMProp: 'QuantityWithUom',
							schemeRef: {
								typeName: 'RequisitionDto',
								moduleSubModule: 'Resource.Requisition'
							}
						}),
						{
							processItem: function processItem(/* item */) {
								// optionally set additional info fields 1-3 here by extending json object
								// item.InfoField2 = item.QuantityWithUom;
							}
						}
					]
				}
			};

			if (options.dataProcessor) {
				serviceOption.flatNodeItem.dataProcessor = serviceOption.flatNodeItem.dataProcessor.concat(options.dataProcessor);
			}
			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			if (options.parentService && options.parentService.isRoot) {
				container.service.canForceUpdate = function canForceUpdateAsReservation() {
					return true;
				};
			}

			container.service.validateReservation = function validateReservation(items) {
				resourceReservationValidationProcessor.validate(items);
			};

			var originLoad = container.service.load;
			let selectedAssignmentChangedCallback = null;

			function loadAndRestoreSelection() {
				let selected = container.service.getSelected();
				return originLoad().then(function () {
					if (_.isObject(selected)) {
						container.service.setSelected(selected);
					}
				});
			}

			container.service.getReservationStatus = function getReservationStatus() {
				return resourceReservationTypeAndStatusService.getReservationStatus();
			};

			container.service.getReservationType = function getReservationType() {
				return resourceReservationTypeAndStatusService.getReservationType();
			};

			container.service.setSelectedAssignment = function setSelectedAssignment(selection) {
				_.forEach(container.data.itemList, function(item) {
					item.activeFlag = false;
					item.selectedFlag = false;
				});

				container.service.setSelected(selection);

				if(selection) {
					selection.activeFlag = true;
					selection.selectedFlag = true;
				}

				if(selectedAssignmentChangedCallback) {
					selectedAssignmentChangedCallback();
				}
			};

			container.service.registerSelectedAssignmentChanged = function registerSelectedAssignmentChanged(callbackFn) {
				selectedAssignmentChangedCallback = callbackFn;
			};

			container.service.unregisterSelectedAssignmentChanged = function unregisterSelectedAssignmentChanged(callbackFn) {
				if(selectedAssignmentChangedCallback === callbackFn) {
					selectedAssignmentChangedCallback = null;
				}
			};

			// override original fn
			container.service.load = loadAndRestoreSelection;

			return container;
		};
	}
})(angular);
