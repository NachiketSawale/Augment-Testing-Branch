
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageWizardCreatePackageFromTemplateService',
		['$q', '$http','procurementContextService', 'procurementPackageDataService', 'platformModalService','platformUserInfoService',
			function ($q, $http,moduleContext, packageDataService, platformModalService/* ,platformUserInfoService */) {

				var service = {},self = this;


				self.handleOk = function(result) {

					var param = {
						PrjProjectFk : result.ProjectFk,
						PrcPackageTemplateFk : result.PrcPackageTemplateFk,
						ClerkReqFk : result.ClerkReqFk,
						ClerkPrcFk : result.ClerkPrcFk,
						AssetMasterFk : result.AssetMasterFk

					};
					var config = {
						route: globals.webApiBaseUrl + 'procurement/package/package/createfromtemplate'
					};
					$http({method: 'post', url: config.route, data: param}).then(function (reloadData) {
						if(reloadData.data)
						{
							if(angular.isArray(reloadData.data) && reloadData.data.length >0)
							{
								packageDataService.onCreateFromTemplateSucceeded(reloadData.data);
							}

							return true;
						}

					});
					return true;
				};

				service.execute = function () {

					$http.get(globals.webApiBaseUrl + 'procurement/package/package/getloginclerk')
						.then(function (response) {
							$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/showassetmasterinprocurement').then(function (res) {
								var loginProject = moduleContext.loginProject;
								var modalOptions = {
									ProjectFk: loginProject || null,
									headerTextKey: 'procurement.package.wizard.createPackageFromTemplate.caption',
									templateUrl: globals.appBaseUrl + 'procurement.package/partials/create-package-from-template.html',
									iconClass: 'ico-warning',
									ClerkPrcFk: response.data || null,
									packageCreationShowAssetMaster: res.data
								};

								platformModalService.showDialog(modalOptions).then(function (result) {
									if(result){
										self.handleOk(result);
									}
								});
							});
						});

				};

				return service;
			}]);
})(angular);
