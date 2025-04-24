/**
 * Created by Mohit on 29.04.2024
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name timekeepingReportVerificationDataService
	 * @description pprovides methods to access, create and update timekeeping time symbol account entities
	 */
	myModule.service('timekeepingReportVerificationDataService', TimekeepingReportVerificationDataService);

	TimekeepingReportVerificationDataService.$inject = ['_','platformDataServiceFactory', 'platformRuntimeDataService', 'timekeepingRecordingReportDataService', 'basicsCommonMandatoryProcessor', 'ServiceDataProcessDatesExtension', 'timekeepingRecordingConstantValues', 'TimekeepingRecordingDataProcessTimesExtension'];

	function TimekeepingReportVerificationDataService(_,platformDataServiceFactory, platformRuntimeDataService, timekeepingRecordingReportDataService, mandatoryProcessor, ServiceDataProcessDatesExtension, timekeepingRecordingConstantValues, TimekeepingRecordingDataProcessTimesExtension) {
		let self = this;
		let timekeepingEmployeeReportVerificationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingReportVerificationDataService',
				entityNameTranslationID: 'timekeeping.recording.recordingReportVerificationEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/recording/verification/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingRecordingReportDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [
					new TimekeepingRecordingDataProcessTimesExtension(['TimeRecorded']),
					new ServiceDataProcessDatesExtension(['InsertedAtOriginal', 'UpdatedAt', 'InsertedAt']),
					// platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingRecordingConstantValues.schemes.verification),
					{ processItem: setReadonly },
				],
				presenter: {
					list: {}
				},

				entityRole: {
					leaf: {itemName: 'Verification', parentService: timekeepingRecordingReportDataService}
				}
			}
		};
		function setReadonly(entity) {
			let fields = [
				{ field: 'TimeRecorded', readonly: entity.IsReadOnly },
				{ field: 'ReportVerificationTypeFk', readonly: entity.IsReadOnly},
				{ field: 'ReportStatusFk', readonly: entity.IsReadOnly },
				{ field: 'Longitude', readonly: entity.IsReadOnly },
				{ field: 'Latitude', readonly: entity.IsReadOnly},
				{ field: 'InsertedByOriginal', readonly: entity.IsReadOnly},
				{ field: 'InsertedAtOriginal', readonly: entity.IsReadOnly},
				{ field: 'CommentText', readonly: false },]
			platformRuntimeDataService.readonly(entity, fields);
		}

		let serviceContainer = platformDataServiceFactory.createService(timekeepingEmployeeReportVerificationServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'EmpReportVerificationDto',
			moduleSubModule: 'Timekeeping.Recording',
			validationService: 'timekeepingRecordingReportVerificationValidationService'
		});
	}
})(angular);
