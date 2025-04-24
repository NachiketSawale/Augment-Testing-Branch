
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerReportingPeriodDialogService
	 * @function
	 *
	 * @description Provides a dialog box that allows to add start and finish date for ReportingPeriod
	 */
	angular.module('model.viewer').factory('modelViewerReportingPeriodDialogService', ['_', 'platformTranslateService',
		'platformModalFormConfigService', '$translate','modelViewerReportingPeriodService',
		function (_, platformTranslateService, platformModalFormConfigService, $translate, modelViewerReportingPeriodService) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name showDialog
			 * @function
			 * @methodOf modelViewerReportingPeriodDialogService
			 * @description Shows a dialog that allows the user to  add start and finish date for ReportingPeriod
			 * @returns Promise<Object> A promise that will be resolved when the dialog is closed. The `ok` property
			 *                          of the passed data object will indicated whether the settings in the dialog were
			 *                          confirmed, and the `data` property will hold the input data.
			 */
			service.showDialog = function () {
				var data = modelViewerReportingPeriodService.getReportingPeriod();
				var options = {
					title: $translate.instant('model.viewer.reportingPeriod.reportingPeriodPopupTitle'),
					dataItem: data,
					formConfiguration: {
						fid: 'model.viewer.newCameraPosition',
						showGrouping: false,
						groups: [
							{
								gid: '1'
							}
						],
						rows: [
							{
								gid: '1',
								label$tr$: 'model.viewer.reportingPeriod.startDate',
								type: 'date',
								model: 'start',
								visible: true,
								sortOrder: 1
							}, {
								gid: '1',
								label$tr$: 'model.viewer.reportingPeriod.finishDate',
								type: 'date',
								model: 'end',
								visible: true,
								sortOrder: 2
							}
						]
					},
					handleOK: function () {
						var newdata = options.dataItem;
						modelViewerReportingPeriodService.setReportingPeriod(newdata.start, newdata.end);
					},
				};
				platformTranslateService.translateFormConfig(options.formConfiguration);
				return platformModalFormConfigService.showDialog(options);
			};

			return service;
		}]);
})(angular);
