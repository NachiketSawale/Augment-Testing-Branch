/*
global: app
 */
(function (angular) {
	'use strict';

	/**
	 @jsdoc controller
	 * @name cloudDesktopAboutDialogController
	 * @function
	 *
	 * @description
	 * Controller for the About dialog.
	 */
	angular.module('cloud.desktop').controller('cloudDesktopAboutDialogController', ['_', 'moment', '$scope', 'globals', '$translate', 'platformUtilService','platformContextService',
		function (_, moment, $scope, globals, $translate, platformUtilService, platformContextService) {
			$scope.data = globals;
			$scope.test = 'test';

			platformUtilService.getSystemInfo().then(function (result) {
				if (result) {
					$scope.systemInfo = result;

					// globals.serverUrl
					$scope.systemInfo.serverUrl = globals.serverUrl;
					$scope.systemInfo.clientUrl = globals.clientUrl;

					if ($scope.systemInfo.productVersion) {
						$scope.productVersion = $translate.instant('cloud.desktop.formAboutVersion', {p1: $scope.systemInfo.productVersion});
					}
					if ($scope.systemInfo.buildVersion) {
						$scope.productBuildNo = $translate.instant('cloud.desktop.formAboutBuildNo', {p1: $scope.systemInfo.buildVersion});// jshint ignore:line
					}
					let theDate;
					if ($scope.systemInfo.productDate) {
						theDate = $scope.systemInfo.productDate ? moment(Date.parse($scope.systemInfo.productDate)).format('L LTS') : 'n/a';
						$scope.productDate = $translate.instant('cloud.desktop.formAboutDate', {p1: theDate});
					}
					if ($scope.systemInfo.installationDate) {
						theDate = $scope.systemInfo.installationDate ? moment(Date.parse($scope.systemInfo.installationDate)).format('L LTS') : 'n/a';
						$scope.productInstallationDate = $translate.instant('cloud.desktop.formAboutInstallationDate', {p1: theDate});
					}
					if ($scope.systemInfo.buildRecords) {
						_.forEach($scope.systemInfo.buildRecords, function (item) {
							item.insertedfmt = moment(item.inserted).format('L LTS');
						});
					}
					if ($scope.systemInfo.otherComponentsRecords) {
						$scope.systemInfo.otherComponentsRecords.forEach((item) => {
							item.buildDate = item.buildDate ? moment(item.buildDate).format('L LTS') : 'n/a';
						});
					}
					const uILanguageInfo = $translate.instant('cloud.desktop.formAboutUiLanguage', {p1: platformContextService.getLanguage()});// jshint ignore:line
					const dataLanguageInfo = $translate.instant('cloud.desktop.formAboutDataLanguage', {p1: platformContextService.getDataLanguageId()});// jshint ignore:line
					$scope.languageInfo = uILanguageInfo + '  ' +dataLanguageInfo;
				}
			}, function () {
				$scope.systemInfo = {};
			});


			if (app) {// jshint ignore:line
				$scope.additionalInfo = app.additionalInfo; // jshint ignore:line
				$scope.productVersion = $translate.instant('cloud.desktop.formAboutVersion', {p1: app.productVersion}); // jshint ignore:line
				$scope.productBuildNo = $translate.instant('cloud.desktop.formAboutBuildNo', {p1: app.buildVersion}); // jshint ignore:line
				$scope.productDate = $translate.instant('cloud.desktop.formAboutDate', {p1: app.productDateLocal}); // jshint ignore:line
				$scope.productInstallationDate = $translate.instant('cloud.desktop.formAboutInstallationDate', {p1: app.productInstallationDateLocal}); // jshint ignore:line
			}

		}]);
})(angular);
