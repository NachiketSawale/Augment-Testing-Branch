/**
 * Created by ysl on 12/13/2017.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyImportContentResultService
	 * @function
	 *
	 * @description
	 * basicsCompanyImportContentResultService is the data service for all import content settings celection result data.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCompanyImportContentResultService',
		['$document', '$http', '$translate', 'globals', 'platformModalService','basicsCommonFileDownloadService',
			function ($document, $http, $translate, globals, platformModalService,basicsCommonFileDownloadService) {
				var service = {};

				service.getStatus = function (importJobId) {
					return $http.get(globals.webApiBaseUrl + 'basics/company/importcontent/status?importJobId=' + importJobId);
				};

				service.ShowLog = function ShowLog(entity) {
					var modalOptions = {
						headerTextKey: $translate.instant('basics.company.importContent.importContentLog'),
						showOkButton: true,
						bodyTemplateUrl: globals.appBaseUrl + 'basics.company/partials/import-content-log-message.html',
						resizeable: true,
						taskEntity: entity,
						width: '800px',
						height: '600px'
					};

					platformModalService.showDialog(modalOptions);
				};

				service.getLogMessage = function GetLogMessage(taskId, importJobId) {
					return $http.get(globals.webApiBaseUrl + 'basics/company/importcontent/logmessage?taskId=' + taskId + '&importJobId=' + importJobId);
				};

				service.getLastLogMessage = function getLastLogMessage() {
					return $http.get(globals.webApiBaseUrl + 'basics/company/importcontent/lastjoblogmessage');
				};

				service.downloadLog = function (importJobId) {
					service.getLastLogMessage();
					$http.post(globals.webApiBaseUrl + 'basics/company/importcontent/downloadlog?importJobId=' + importJobId)
						.then(function(response){
							if (response.data && response.data.FileName) {
								basicsCommonFileDownloadService.download(null, {
									FileName: response.data.FileName,
									Path: response.data.Path
								});
							}
						});
				};

				return service;
			}]);
})(angular);
