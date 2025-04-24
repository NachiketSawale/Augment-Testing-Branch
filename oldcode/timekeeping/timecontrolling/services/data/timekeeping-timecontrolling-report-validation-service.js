(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeControllingReportValidationService
	 * @description provides validation methods for timecontrolling
	 */
	const moduleName='timekeeping.timecontrolling';
	angular.module(moduleName).service('timekeepingTimeControllingReportValidationService', timekeepingTimeControllingValidationService);

	timekeepingTimeControllingValidationService.$inject = [
		'timekeepingRecordingReportValidationServiceFactory', 'timekeepingTimecontrollingReportDataService','platformValidationServiceFactory',
		'$http', '$q', '$injector', 'platformDataValidationService', 'platformDialogService'];

	function timekeepingTimeControllingValidationService(
		timekeepingRecordingReportValidationServiceFactory, timekeepingTimecontrollingReportDataService,platformValidationServiceFactory,
		$http, $q, $injector, platformDataValidationService, platformDialogService) {

		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'ReportDto',
			moduleSubModule: 'Timekeeping.Recording'
		},
		{
			mandatory: ['TKS_RECORDING_FK','TKS_SHEET_FK','TKS_REPORTSTATUS_FK','DUE_DATE', 'TKS_EMPLOYEE_FK']
		},
		self, timekeepingTimecontrollingReportDataService);

		timekeepingRecordingReportValidationServiceFactory.createTimekeepingReportValidationService(self, timekeepingTimecontrollingReportDataService);
		self.validateEmployeeFk = function validateEmployeeFk(entity, value, model){
			return platformValidationServiceFactory.validateMandatoryEntityLookupProperty(entity, value, model, self, timekeepingTimecontrollingReportDataService);
		};
		self.validateDueDate = function validateDueDate(entity, value, model){
			return platformValidationServiceFactory.validateMandatoryEntityProperty(entity, value, model, self, timekeepingTimecontrollingReportDataService);
		};
		self.asyncValidateEmployeeFk = function asyncValidateEmployeeFk(entity, value, model) {
			if (value === null){
				return $q.when(false);
			}
			return doValidateReport(entity, value, model);
		};
		self.asyncValidateDueDate = function asyncValidateDueDate(entity, value, model) {
			if (value === null){
				return $q.when(false);
			}
			return doValidateReport(entity, value, model).then(function(response) {
				// if (response === true || response && response.valid) {
					return response;
				// }
			});
		};

		function doValidateReport(entity, value, model){
			let item = _.cloneDeep(entity);
			item[model] = value;
			if (item.EmployeeFk > 0 && !_.isNil(item.DueDate)) {
				timekeepingTimecontrollingReportDataService.revertProcessItem(item);
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingTimecontrollingReportDataService);
				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/controlling/report/validateReport', item).then(function (response) {
					if (response.data) {
						if (!response.data.IsValid) {
							platformDialogService.showYesNoDialog(response.data.ErrorMsg, 'cloud.common.errorDialogTitle', 'yes', false).then(function (result) {
								if (result.yes) {
									if (response.data.Report) {
										item = response.data.Report;
										$http.post(globals.webApiBaseUrl + 'timekeeping/controlling/report/createrecordingorsheet', item).then(function (response){
											if (response.data && response.data.ErrorMsg.length == 0){
												entity.RecordingFk = response.data.Report.RecordingFk;
												entity.SheetFk = response.data.Report.SheetFk;
												platformDataValidationService.ensureNoRelatedError(entity, model, ['EmployeeFk', 'DueDate'], self, timekeepingTimecontrollingReportDataService);
												return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, timekeepingTimecontrollingReportDataService);
											} else {
												let errObj = {
													apply: true,
													valid: false,
													error: response.data.ErrorMsg,
													invalidFields: [model]
												};
												return platformDataValidationService.finishAsyncValidation(errObj, entity, value, model, asyncMarker, self, timekeepingTimecontrollingReportDataService);
											}
										});
									}
								} else {
									let errObj = {
										apply: true,
										valid: false,
										error: response.data.ErrorMsg,
										invalidFields: [model]
									};
									return platformDataValidationService.finishAsyncValidation(errObj, entity, value, model, asyncMarker, self, timekeepingTimecontrollingReportDataService);
								}
							})
						} else {
							platformDataValidationService.ensureNoRelatedError(entity, model, ['EmployeeFk', 'DueDate'], self, timekeepingTimecontrollingReportDataService);
							entity.RecordingFk = response.data.Report.RecordingFk;
							entity.SheetFk = response.data.Report.SheetFk;
							return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, timekeepingTimecontrollingReportDataService);
						}
					}
				});
				return asyncMarker.myPromise;
			} else {
				return $q.when(false);
			}
		}
	}
})(angular);