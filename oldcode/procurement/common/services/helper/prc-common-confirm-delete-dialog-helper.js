(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('prcCommonConfirmDeleteDialogHelperService', ['$injector','$translate','$http','procurementCommonOverviewDataHelperService',
		function ($injector,$translate,$http,procurementCommonOverviewDataHelperService) {
			var service = {};

			service.generateConfirmDeleteModelOption = function generateModelOption(extensionConfig){
				var targetModuleName = moduleName;
				if(extensionConfig && extensionConfig.targetModuleName ){
					targetModuleName = extensionConfig.targetModuleName;
				}

				var modalOptions = {
					headerTextKey: targetModuleName + '.confirmDeleteTitle',
					bodyTextKey: $translate.instant(targetModuleName + '.confirmDeleteHeader'),
					showDependantDataBtnText: $translate.instant(moduleName + '.showDependantDataBtnText'),
					showYesButton: true,
					showNoButton: true,
					showDependantDataButton:true,
					iconClass: 'warning',
					backdrop: false,
					resizeable: false,
					templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-common-confirm-cascade-delete-dialog.html',
					loadingInfo:'loading...'
				};

				modalOptions = angular.extend(modalOptions, extensionConfig || {});

				return modalOptions;
			};

			service.isDisableDependencyButton = procurementCommonOverviewDataHelperService.isDisableDependencyButton;

			function initContainerJson(){
				return procurementCommonOverviewDataHelperService.initContainerJson();
			}

			service.initContainerJson = initContainerJson;

			service.deleteEntities = deleteEntities;

			service.showDetail = function showDetail(){
				var requestData = procurementCommonOverviewDataHelperService.getMainItemInfo();
				procurementCommonOverviewDataHelperService.initContainerJson();

				return $http.post(globals.webApiBaseUrl + 'procurement/common/module/overview/data', requestData
				).then(function (response) {
					if (response.data) {
						var containerList = procurementCommonOverviewDataHelperService.processContainerData(response.data);
						return procurementCommonOverviewDataHelperService.processDataMakeTree(containerList);
					}
				});
			};

			function deleteEntities(func,entities,data,extensionConfig){
				var platformModalService = $injector.get('platformModalService');
				var modalOptions = service.generateConfirmDeleteModelOption(extensionConfig);
				return platformModalService.showDialog(modalOptions).then(function (result) {
					if (result.yes) {
						func(entities, data);
					}
				});
			}

			service.attachConfirmDeleteDialog = function(serviceContainer,dialogExtensionConfig){
				serviceContainer.service.deleteItem = function deleteItem(entity) {
					revertProcessItemsWhenDelete(serviceContainer,entity);
					service.deleteEntities(serviceContainer.data.deleteItem,entity,serviceContainer.data,dialogExtensionConfig);
				};

				serviceContainer.service.deleteEntities = function deleteEntities(entity) {
					revertProcessItemsWhenDelete(serviceContainer,entity);
					service.deleteEntities(serviceContainer.data.deleteEntities,entity,serviceContainer.data,dialogExtensionConfig);
				};
			};

			// framework doesn't do revertProcess when delete, which may cause issues(eg. deserialize TimeSpan field error in backend).
			function revertProcessItemsWhenDelete(serviceContainer,entity){
				if(serviceContainer?.service?.revertProcessItems && serviceContainer?.data?.itemName){
					const modState = {}
					modState[serviceContainer.data.itemName] = entity;
					serviceContainer.service.revertProcessItems(modState);
				}
			}

			return service;
		}]);
})(angular);