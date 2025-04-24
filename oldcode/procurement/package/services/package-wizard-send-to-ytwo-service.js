/**
 * Created by xai on 1/12/2018.
 */

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageWizardSendtoYtwoService',
		['$translate','$q', '$http','procurementContextService', 'procurementPackageDataService', 'platformModalService',
			function ($translate,$q, $http,moduleContext, packageDataService, platformModalService) {

				var service = {},self = this;

				self.handleOk = function(result) {
					var modalOptionsInfo={
						headerTextKey: $translate.instant('procurement.package.wizard.selectpackagedialogInfo'),
						showOkButton: true,
						iconClass: 'ico-info',
						bodyTextKey:  $translate.instant('procurement.package.wizard.sendpackageSuccessfulMsg')
					};
					var param = {
						PrcPackageIds : result.PrcPackageIds,
						GroupType:result.GroupType
					};
					var config = {
						route: globals.webApiBaseUrl + 'procurement/package/wizard/sendpackagelist'
					};
					$http({method: 'post', url: config.route, data: param}).then(function (/* reloadData */) {
						platformModalService.showDialog(modalOptionsInfo);
					});
					//                   return true;
				};
				self.validationForecastData=function (result) {
					var param = {
						PrcPackageIds : result.PrcPackageIds,
						GroupType:result.GroupType
					};
					var config = {
						route: globals.webApiBaseUrl + 'procurement/package/wizard/validationforecastData'
					};
					$http({method: 'post', url: config.route, data: param}).then(function (reloadData) {
						if(reloadData.data!==null){
							var validationResult=reloadData.data;
							if(_.isArray(validationResult) && validationResult.length>0){
								var modalOptionsInfo={
									headerTextKey: $translate.instant('procurement.package.wizard.import.errorMessage'),
									iconClass: 'ico-error',
									templateUrl: globals.appBaseUrl + 'procurement.package/partials/procurement-package-forecast-validation-dialog.html',
									resizeable: true,
									validationResultData:validationResult
								};
								platformModalService.showDialog(modalOptionsInfo);
							}
						}
						else{
							self.handleOk(result);
						}
					});
				};
				service.execute = function () {
					var groupType = 0; // default 1 match month
					var loginProject=null;
					var selected = packageDataService.getSelected();
					if (selected && selected.ProjectFk) {
						loginProject=selected.ProjectFk;
					}
					$http
						.get(globals.webApiBaseUrl + 'procurement/package/wizard/getpackagelistbyprj?ProjectId=' + loginProject)
						.then(function (response) {
							var modalOptions = {
								ProjectFk: loginProject || null,
								templateUrl: globals.appBaseUrl + 'procurement.package/templates/send-packages-to-ytwo.html',
								resizeable: false,
								PackageList: response.data || null,
								GroupType:groupType
							};
							platformModalService.showDialog(modalOptions).then(function (result) {
								if(result){
									self.validationForecastData(result);
								}
							});
						});
				};
				return service;
			}]);
})(angular);
