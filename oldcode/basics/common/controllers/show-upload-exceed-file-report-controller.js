/**
 * Created by pel on 8/23/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	/* jshint -W072 */ // this function has too much parameters.
	angular.module(moduleName).controller('showUploadExceedFileReportController',
		['$scope', 'cloudDesktopSidebarService', '$http', '$injector', '$translate', 'platformGridAPI',
			'platformTranslateService', '_', '$', 'platformDialogService', '$element', '$timeout', 'platformModalService',
			function ($scope, cloudDesktopSidebarService, $http, $injector, $translate, platformGridAPI, platformTranslateService, _, $, platformDialogService, $element, $timeout, platformModalService) {

				$scope.modalOptions.title = $translate.instant('basics.common.alert.warning');
				$scope.modalOptions.okBtn = $translate.instant('basics.common.upload.continueUpload');
				$scope.modalOptions.copyBtn = $translate.instant('basics.common.upload.copyToClipboard');
				$scope.modalOptions.cancelBtn = $translate.instant('basics.common.cancel');
				$scope.modalOptions.headerText = $translate.instant('basics.common.upload.exceedTips');
				$scope.modalOptions.ok = function () {
					$scope.$close({ok: true});
				};
				$scope.modalOptions.copy = function () {
					navigator.clipboard.writeText($scope.modalOptions.exceedFileNames).then(function () {
						platformModalService.showMsgBox($translate.instant('cloud.common.copyToClipboardSucess'), 'Info', 'ico-info');
					}, () => {
						platformModalService.showMsgBox($translate.instant('cloud.common.copyToClipboardFailed'), 'Info', 'ico-info');
					});
				};
				$scope.modalOptions.cancel = function () {
					$scope.$close({ok: false});
				};

			}]);
})(angular);