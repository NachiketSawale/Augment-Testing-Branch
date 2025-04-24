/*
* Created by aljami on 29.05.2022
* */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name services.schedulerui.servicesSchedulerUIJobLogDialogService
	 * @function
	 *
	 * @description Displays a dialog box that shows the log messages of a scheduler job.
	 */
	angular.module('services.schedulerui').factory('servicesSchedulerUIJobLogDialogService', ['_', '$http','platformLongTextDialogService',
		function (_, $http, platformLongTextDialogService) {
			var service = {};
			const pageLength = 500;  // make it larger for not have to page to often.

			function loadPage(jobId, pageIndex, determineTotalPageCount) {
				return $http.get(globals.webApiBaseUrl + 'services/scheduler/job/logmessages', {
					params: {
						jobId: jobId,
						firstLineIndex: pageIndex * pageLength,
						maxLineCount: pageLength,
						determineTotalLineCount: !!determineTotalPageCount
					}
				}).then(function (response) {
					return {
						text: _.isArray(response.data.Messages) ? response.data.Messages.join('<br>') : '',
						totalPageCount: determineTotalPageCount ? Math.ceil(response.data.TotalCount / pageLength) : null
					};
				});
			}

			function JobLogDataSource(jobId, initialData) {
				platformLongTextDialogService.LongTextDataSource.call(this);

				this.jobId = jobId;
				this.current = initialData.text;
				this.totalPageCount = initialData.totalPageCount;
			}
			JobLogDataSource.prototype = Object.create(platformLongTextDialogService.LongTextDataSource.prototype);
			JobLogDataSource.prototype.constructor = JobLogDataSource;

			JobLogDataSource.prototype.loadPage = function (index) {
				var that = this;
				var thatArgs = arguments;
				return loadPage(that.jobId, index, false).then(function (data) {
					that.current = data.text;
					return platformLongTextDialogService.LongTextDataSource.prototype.loadPage.apply(that, thatArgs);
				});
			};

			service.showLogDialog = function (jobId, config) {
				return loadPage(jobId, 0, true).then(function (data) {
					var ds = new JobLogDataSource(jobId, data);

					var dlgConfig = _.assign({
						headerText$tr$: 'services.schedulerui.showLogFileTitle'
					}, _.isObject(config) ? config : {}, {
						dataSource: ds
					});

					return platformLongTextDialogService.showDialog(dlgConfig);
				});
			};

			return service;
		}]);
})();