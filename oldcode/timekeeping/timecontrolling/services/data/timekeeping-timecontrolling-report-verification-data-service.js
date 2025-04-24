/**
 * Created by Mohit on 29.04.2024
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.timecontrolling');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeControllingReportVerificationDataService
	 * @description pprovides methods to access, create and update timekeeping time symbol account entities
	 */
	myModule.service('timekeepingTimeControllingReportVerificationDataService', TimekeepingTimeControllingReportVerificationDataService);

	TimekeepingTimeControllingReportVerificationDataService.$inject = ['platformDataServiceFactory', 'platformRuntimeDataService', 'timekeepingTimecontrollingReportDataService','timekeepingTimeControllingConstantValues','basicsCommonMandatoryProcessor','TimekeepingRecordingDataProcessTimesExtension','ServiceDataProcessDatesExtension'];

	function TimekeepingTimeControllingReportVerificationDataService(platformDataServiceFactory, platformRuntimeDataService, timekeepingTimecontrollingReportDataService,timekeepingTimeControllingConstantValues,basicsCommonMandatoryProcessor,TimekeepingRecordingDataProcessTimesExtension,ServiceDataProcessDatesExtension) {
		let self = this;
		let timekeepingTimeControllingReportVerificationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingTimeControllingReportVerificationDataService',
				entityNameTranslationID: 'timekeeping.timecontrolling.entityReportVerification',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/recording/verification/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingTimecontrollingReportDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [
					new TimekeepingRecordingDataProcessTimesExtension(['TimeRecorded']),
					new ServiceDataProcessDatesExtension(['InsertedAtOriginal', 'UpdatedAt', 'InsertedAt']),
					{ processItem: setReadonly },
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingTimecontrollingReportDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},

				entityRole: {
					leaf: {itemName: 'Verification', parentService: timekeepingTimecontrollingReportDataService}
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

		let serviceContainer = platformDataServiceFactory.createService(timekeepingTimeControllingReportVerificationServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingTimeControllingReportVerificationValidationService'
		}, timekeepingTimeControllingConstantValues.schemes.verification));
	}
})(angular);
