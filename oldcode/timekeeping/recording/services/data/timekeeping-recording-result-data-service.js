/**
 * Created by baf on 28.12.2020
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingResultDataService
	 * @description pprovides methods to access, create and update timekeeping recording result entities
	 */
	myModule.service('timekeepingRecordingResultDataService', TimekeepingRecordingResultDataService);

	TimekeepingRecordingResultDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingRecordingConstantValues', 'timekeepingRecordingDataService', 'platformRuntimeDataService'];

	function TimekeepingRecordingResultDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingRecordingConstantValues, timekeepingRecordingDataService, platformRuntimeDataService) {
		var self = this;
		var timekeepingRecordingResultServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingRecordingResultDataService',
				entityNameTranslationID: 'timekeeping.recording.recordingResultEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/recording/result/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingRecordingDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canDelete },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingRecordingConstantValues.schemes.result),
				{processItem: setReadonly}
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingRecordingDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Results', parentService: timekeepingRecordingDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingRecordingResultServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			typeName: 'TimekeepingResultDto',
			moduleSubModule: 'Timekeeping.Recording',
			validationService: 'timekeepingRecordingResultValidationService'
		}, timekeepingRecordingConstantValues.schemes.result));

		let service = serviceContainer.service;

		function setReadonly(entity) {
			if(entity.UsedForTransaction){
				let transactionreadonly = entity.UsedForTransaction;
				let fields = [
					{ field: 'RecordingFk', readonly: transactionreadonly },
					{ field: 'ResultStatusFk', readonly: transactionreadonly},
					{ field: 'Hours', readonly: transactionreadonly},
					{ field: 'TimeSymbolFk', readonly: transactionreadonly},
					{ field: 'ProjectFk', readonly: transactionreadonly},
					{ field: 'ProjectActionFk', readonly: transactionreadonly},
					{ field: 'SheetFk', readonly: transactionreadonly},
					{ field: 'CommentText', readonly: transactionreadonly},
					{ field: 'PlantFk', readonly: transactionreadonly},
					{ field: 'Rate', readonly:  transactionreadonly},
					{ field: 'TimeAllocationHeaderFk', readonly:  transactionreadonly},
					{ field: 'DueDate', readonly: transactionreadonly},
					{ field: 'IsSuccessFinance', readonly: transactionreadonly },
					{ field: 'UsedForTransaction', readonly: transactionreadonly},
					{ field: 'FromTime', readonly: true},
					{ field: 'ToTime', readonly: true}
				];
				platformRuntimeDataService.readonly(entity, fields);
			}else{
				platformRuntimeDataService.readonly(entity, entity.IsReadOnly);
				if (!entity.IsReadOnly) {
					platformRuntimeDataService.readonly(entity, [{field: 'FromTime', readonly: true},
						{field: 'ToTime', readonly: true}]);
				}
			}

		}

		function canDelete() {
			let result = true;
			let selected = service.getSelected();
			if (selected && selected.IsReadOnly || selected && selected.UsedForTransaction) {
				result = false;
			}
			return result;
		}
	}
})(angular);