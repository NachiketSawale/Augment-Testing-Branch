(function (angular) {
	/* global globals */
	'use strict';
	var module = angular.module('timekeeping.recording');
	module.service('timekeepingRecordingBoardAssignmentServiceFactory', TimekeepingRecordingBoardAssignmentService);

	TimekeepingRecordingBoardAssignmentService.$inject = ['_', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'resourceReservationValidationProcessor'];

	function TimekeepingRecordingBoardAssignmentService(_, platformDataServiceFactory, ServiceDataProcessDatesExtension, resourceReservationValidationProcessor) {

		this.createAssignmentService = function createAssignmentService(options) {
			var serviceOption = {
				flatRootItem: {
					module: module,
					serviceName: options.serviceName,
					entityNameTranslationID: 'timekeeping.recording.entityRecord',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'timekeeping/recording/report/',
						endRead: 'getForTimeboard',
						endDelete: 'multidelete',
						usePostForRead: true,
						initReadData: options.initReadData
					},
					actions: {delete: true, create: 'flat'},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData, ServiceData, creationOption) {
								creationData.PKey2 = creationOption.EmployeeFk;
								creationData.PKey3 = creationOption.ShiftWorkingTime.ShiftFk;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: options.itemName || 'Reports',
							moduleName: 'cloud.desktop.moduleDescriptionTimekeepingRecording',
							useIdentification: true,
							parentService: options.parentService
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['From', 'To', 'DueDate', 'FromCalculated', 'ToCalculated'])]
				}
			};

			if (options.dataProcessor) {
				serviceOption.flatLeafItem.dataProcessor = serviceOption.flatLeafItem.dataProcessor.concat(options.dataProcessor);
			}
			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			if (options.parentService && options.parentService.isRoot) {
				container.service.canForceUpdate = function canForceUpdate() {
					return true;
				};
			}

			container.service.validateReservation = function validateReservation(items) {
				resourceReservationValidationProcessor.validate(items);
			};

			var originLoad = container.service.load;

			function loadAndRestoreSelection() {
				var selected = container.service.getSelected();
				return originLoad().then(function () {
					if (_.isObject(selected)) {
						container.service.setSelected(selected);
					}
				});
			}

			container.service.getReservationStatus = function getReservationStatus() {
				// return resourceReservationTypeAndStatusService.getReservationStatus();
				return [];
			};

			container.service.getReservationType = function getReservationType() { //
				// return resourceReservationTypeAndStatusService.getReservationType();
				return [];
			};

			// override original fn
			container.service.load = loadAndRestoreSelection;

			return container;
		};
	}
})(angular);
