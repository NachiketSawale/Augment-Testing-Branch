/**
 * Created by waldrop on 2019-06-06.
 */
(function (angular) {
	'use strict';

	/* globals globals */
	/**
	 * @ngdoc service
	 * @name mtwoControlTowerUserListDataService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerUserListDataService is the data service for all pro dashboards related functionality
	 *
	 */

	var moduleName = 'mtwo.controltower';
	var ControlTowerModule = angular.module(moduleName);

	ControlTowerModule.factory('mtwoControlTowerUserListDataService', MtwoControlTowerUserListDataService);
	MtwoControlTowerUserListDataService.$inject = [
		'$http',
		'$injector',
		'platformDataServiceFactory',
		'PlatformMessenger',
		'basicsCommonMandatoryProcessor',
		'platformModalService',
		'platformRuntimeDataService'];

	function MtwoControlTowerUserListDataService(
		$http,
		$injector,
		platformDataServiceFactory,
		PlatformMessenger,
		basicsCommonMandatoryProcessor,
		platformModalService,
		platformRuntimeDataService) {

		var userName = '';

		var MtwoControlTowerConfigurationMainServiceOptions = {
			flatRootItem: {
				module: ControlTowerModule,
				serviceName: 'mtwoControlTowerUserListDataService',
				/* httpCRUD: {
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbi/'
				}, */
				httpCreate: {route: globals.webApiBaseUrl + 'mtwo/controltower/powerbi/'},
				httpUpdate: {route: globals.webApiBaseUrl + 'mtwo/controltower/powerbi/', endUpdate: 'update'},
				httpDelete: {route: globals.webApiBaseUrl + 'mtwo/controltower/powerbi/', endDelete: 'delete'},
				httpRead: {
					extendSearchFilter: extendSearchFilter,
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbi/', endRead: 'listfiltered',
					usePostForRead: true
				},
				entityRole: {
					root: {
						codeField: 'Code',
						descField: 'Description',
						itemName: 'MtoPowerbi',
						moduleName: 'Control Tower'
					}
				},
				entitySelection: {},
				presenter: {
					list: {
						incorporateDataRead: function incorporateDataRead(readData, data) {

							angular.forEach(readData, function readonlyFn(item) {
								platformRuntimeDataService.readonly(item, [{
									field: 'Password',
									readonly: item.AzureadIntegrated
								}]);
							});

							var premium = $injector.get('mtwoControlTowerCommonService').getPremiumStatus();

							if (premium) {
								return null;
							} else {
								data.handleReadSucceeded(readData, data);
							}


						},
						isInitialSorted: true,
						sortOptions: {
							initialSortColumn: {
								field: 'MtoPowerbi',
								id: 'MtoPowerbi'
							},
							isAsc: true
						},
						initCreationData: function initCreationData() {
							// console.log(creationData);
						},
						handleCreateSucceeded: function (item) {
							item.Description = userName;
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

		function extendSearchFilter(filterRequest) {

			filterRequest.furtherFilters = [{Token: 'Description', Value: userName}];


		}

		serviceContainer.service.setUserInfo = function setUserInfo(userInfo) {

			userName = userInfo.LogonName;
		};

		serviceContainer.service.getUserInfo = function getUserInfo() {

			return userName;
		};

		serviceContainer.service.downloadPowerBIItems = function downloadPowerBIItems($scope) {
			var $q = $injector.get('$q');
			if (serviceContainer.service.hasSelection()) {
				var selectedItem = serviceContainer.service.getSelected();
				if (selectedItem.Version > 0 && selectedItem.Authorized && selectedItem.AzureadIntegrated) {
					var deferred = $q.defer();
					var cloudDesktopPowerBIAdalService = $injector.get('cloudDesktopPowerBIAdalService');
					var powerBISettings = cloudDesktopPowerBIAdalService.getPowerBISettings(selectedItem);
					cloudDesktopPowerBIAdalService.acquireTokenAsync(powerBISettings, $scope).then(function (accessToken) {
						selectedItem.AzureadAccessToken = accessToken;
						downloadPowerBIItemsBySelectedAccount(selectedItem).then(function () {
							deferred.resolve(true);
						}, function (err) {
							console.log(err);
							deferred.resolve(false);
						});
					}, function (err) {
						console.log(err);
						deferred.resolve(false);
					});
					return deferred.promise;
				}
			}
			return $q.when(false);
		};

		function downloadPowerBIItemsBySelectedAccount(selectedItem) {
			return $http.post(globals.webApiBaseUrl + 'mtwo/controltower/powerbi/download', selectedItem).then(function (response) {

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

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'MtoPowerbiDto',
			moduleSubModule: 'Mtwo.ControlTower',
			validationService: 'mtwoControlTowerConfigurationValidationService'
		});

		serviceContainer.service.onUpdateItems = new PlatformMessenger();

		serviceContainer.service.onRowChange = new PlatformMessenger();

		serviceContainer.service.load();

		return serviceContainer.service;
	}
})(angular);
