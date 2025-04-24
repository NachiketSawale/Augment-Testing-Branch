(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingReportValidationService
	 * @description provides validation methods for requisition
	 */
	const moduleName='resource.requisition';
	angular.module(moduleName).service('timekeepingRecordingReportValidationService', timekeepingRecordingReportValidationService);

	timekeepingRecordingReportValidationService.$inject = [
		'timekeepingRecordingReportValidationServiceFactory', 'timekeepingRecordingReportDataService','platformValidationServiceFactory'];

	function timekeepingRecordingReportValidationService(
		timekeepingRecordingReportValidationServiceFactory, timekeepingRecordingReportDataService,platformValidationServiceFactory) {

		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'ReportDto',
			moduleSubModule: 'Timekeeping.Recording'
		},
		{
			mandatory: ['TKS_RECORDING_FK','TKS_SHEET_FK','TKS_REPORTSTATUS_FK','DUE_DATE']
		},
		self,
		timekeepingRecordingReportDataService);

		timekeepingRecordingReportValidationServiceFactory.createTimekeepingReportValidationService(this, timekeepingRecordingReportDataService);
	}
})(angular);
