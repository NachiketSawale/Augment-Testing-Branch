/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	'use strict';
	/* globals globals */
	/**
	 * @ngdoc service
	 * @name mtwoControlTowerconfigurationMainService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowersMainService is the data service for all dashboards related functionality
	 *
	 */

	var moduleName = 'mtwo.controltowerconfiguration';
	var ControlTowerModul = angular.module(moduleName);

	ControlTowerModul.factory('mtwoControlTowerConfigurationMainService', MtwoControlTowerConfigurationMainService);
	MtwoControlTowerConfigurationMainService.$inject = ['$translate', '$injector', '$http', 'platformRuntimeDataService', 'platformDataServiceFactory', 'PlatformMessenger', 'basicsCommonMandatoryProcessor', 'platformModalService'];

	function MtwoControlTowerConfigurationMainService($translate, $injector, $http, platformRuntimeDataService, platformDataServiceFactory, PlatformMessenger, basicsCommonMandatoryProcessor, platformModalService) {

		var MtwoControlTowerConfigurationMainServiceOptions = {
			flatRootItem: {
				module: ControlTowerModul,
				serviceName: 'mtwoControlTowerConfigurationMainService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbi/'
				},
				actions: {delete: true, create: 'flat', group: true},
				entityRole: {
					root: {
						codeField: 'Code',
						descField: 'Description',
						itemName: 'MtoPowerbi',
						moduleName: 'cloud.desktop.moduleDisplayNameControlTowerConfiguration',
						handleUpdateDone: function () {
							$injector.get('mtwoPermissionManagementService').refresh();
						}
					}
				},
				entitySelection: {},
				presenter: {
					list: {
						isInitialSorted: true,
						sortOptions: {
							initialSortColumn: {
								field: 'MtoPowerbi',
								id: 'MtoPowerbi'
							},
							isAsc: true
						},
						incorporateDataRead: function (readData, data) {

							angular.forEach(readData, function readonlyFn(item) {
								platformRuntimeDataService.readonly(item, [{
									field: 'Password',
									readonly: item.AzureadIntegrated
								}]);
							});

							return serviceContainer.data.handleReadSucceeded(readData, data);
						}
					}
				},
				translation: {
					uid: 'mtwoControlTowerConfigurationMainService',
					title: 'mtwo.controltowerconfiguration.moduleName',
					columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}]
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						containsGlobalData: true
					}
				}


			}
		};


		var serviceContainer = platformDataServiceFactory.createNewComplete(MtwoControlTowerConfigurationMainServiceOptions);

		var service = serviceContainer.service;

		service.usageObject = {
			'Token Percentage Used': 0,
			'Feature Name': '',
			'State': '',
			'Extended State': '',

		};

		service.additionalFeatures = {};

		serviceContainer.service.GetUsage = function () {
			var dialogOption = {
				headerText$tr$: 'mtwo.controltowerconfiguration.additionalFeatures',
				bodyTemplateUrl: globals.appBaseUrl + 'mtwo.controltowerconfiguration/templates/mtwo-controltower-configuration-usage-template.html',
				showOkButton: true,
				dataItem: service.additionalFeatures

			};

			var dialogService = $injector.get('platformDialogService');
			var selectedItem = serviceContainer.service.getSelected();
			if (selectedItem) {
				var postParam = {
					Id: selectedItem.Id,
					Logonname: selectedItem.Logonname,
					Password: selectedItem.Password,
					Apiurl: selectedItem.Apiurl,
					Authurl: selectedItem.Authurl,
					Clientid: selectedItem.Clientid,
					Resourceurl: selectedItem.Resourceurl,
					Accesslevel: selectedItem.Accesslevel

				};
				$http.post(globals.webApiBaseUrl + 'mtwo/controltower/powerbi/availableFeatures', postParam).then(function (response) {
					if (Object.prototype.hasOwnProperty.call(response.data, 'features') && response.data.features.length > 0) {
						var features = angular.copy(response.data.features);

						angular.forEach(features, function (items) {


							if (Object.prototype.hasOwnProperty.call(items, 'additionalInfo') && items.additionalInfo !== null) {
								items.Usage = items.additionalInfo.Usage.toString();
							} else {
								items.Usage = '0';
								items.additionalInfo = {Usage: 0};
							}

						});
						service.additionalFeatures = features;
						dialogOption.dataItem = features;

						dialogService.showDialog(dialogOption);
					}

				});
			}
		};

		serviceContainer.service.DownloadPowerBIItems = function (scope) {
			if (service.hasSelection()) {
				var selectedItem = service.getSelected();
				if (selectedItem.AzureadIntegrated) {
					var cloudDesktopPowerBIAdalService = $injector.get('cloudDesktopPowerBIAdalService');
					var powerBISettings = cloudDesktopPowerBIAdalService.getPowerBISettings(selectedItem);
					cloudDesktopPowerBIAdalService.acquireTokenAsync(powerBISettings, scope)
						.then(function (accessToken) {
							selectedItem.AzureadAccessToken = accessToken;
							downloadPowerBIItemsBySelectedAccount(selectedItem);
						});
				} else {
					downloadPowerBIItemsBySelectedAccount(selectedItem);
				}
			}
		};

		function downloadPowerBIItemsBySelectedAccount() {
			var seletedItem = serviceContainer.service.getSelected();
			if (seletedItem) {
				$http.post(globals.webApiBaseUrl + 'mtwo/controltower/powerbi/download', seletedItem).then(function (response) {

					var data = response.data;
					// 0 : work fine.
					// -1 : user not exist unknown_user_type
					// -2 : password is wrong invalid_grant
					// -3 : client id is wront unauthorized_client
					// -4 : time out, maybe network is not available.
					// -5 : another exception
					// -6 : argument exception
					// -7 : Unauthorized

					if (data === '0') {
						serviceContainer.service.onUpdateItems.fire(response.data);
					} else if (data === '-1') {
						platformModalService.showMsgBox('mtwo.controltowerconfiguration.errorDialog.ErrorInfo.UserNoFound', 'mtwo.controltowerconfiguration.errorDialog.ErrorInfo.header', 'error');
					} else if (data === '-2') {
						platformModalService.showMsgBox('mtwo.controltowerconfiguration.errorDialog.ErrorInfo.ErrPwd', 'mtwo.controltowerconfiguration.errorDialog.ErrorInfo.header', 'error');
					} else if (data === '-3') {
						platformModalService.showMsgBox('mtwo.controltowerconfiguration.errorDialog.ErrorInfo.ErrClientID', 'mtwo.controltowerconfiguration.errorDialog.ErrorInfo.header', 'error');
					} else if (data === '-4') {
						platformModalService.showMsgBox('mtwo.controltowerconfiguration.errorDialog.ErrorInfo.ErrNetwork', 'mtwo.controltowerconfiguration.errorDialog.ErrorInfo.header', 'error');
					}
					/* else  if(data === -5)
					{
						platformModalService.showMsgBox('mtwo.controltowerconfiguration.errorDialog.ErrorInfo.ErrOther', 'mtwo.controltowerconfiguration.errorDialog.ErrorInfo.header', 'error');
					} */
					else if (data === '-6') {
						platformModalService.showMsgBox('mtwo.controltowerconfiguration.errorDialog.ErrorInfo.ErrURL', 'mtwo.controltowerconfiguration.errorDialog.ErrorInfo.header', 'error');
					} else if (data === '-7') {
						platformModalService.showMsgBox('mtwo.controltowerconfiguration.errorDialog.ErrorInfo.ErrAuth', 'mtwo.controltowerconfiguration.errorDialog.ErrorInfo.header', 'warning');
						serviceContainer.service.onUpdateItems.fire(parseInt(response.data));
					} else {
						platformModalService.showMsgBox(response.data, 'mtwo.controltowerconfiguration.errorDialog.ErrorInfo.header', 'error');

						serviceContainer.service.onUpdateItems.fire(-5);
					}
				});
			}
		}

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'MtoPowerbiDto',
			moduleSubModule: 'Mtwo.ControlTower',
			validationService: 'mtwoControlTowerConfigurationValidationService'
		});

		serviceContainer.service.onUpdateItems = new PlatformMessenger();
		serviceContainer.service.load();

		return serviceContainer.service;
	}
})(angular);
