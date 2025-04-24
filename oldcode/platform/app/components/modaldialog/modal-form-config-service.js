/**
 * Created by baedeker on 2014-08-13
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:platformModalFormConfigService
	 * @description
	 * Creates a form container standard config from dto and high level description
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('platform').factory('platformModalFormConfigService', ['platformModalService', 'platformDialogService',
		function (platformModalService, platformDialogService) {
			let service = {};
			let usedConfig, usedDialogConfig;

			service.getDialogTitle = function getDialogTitle() {
				return usedConfig.title;
			};

			service.getDialogMessage = function getDialogTitle() {
				return usedConfig.dialogOptions.message;
			};

			service.getDataItem = function getDataItem() {
				return usedConfig.dataItem;
			};

			service.getConfig = function getConfig() {
				return usedConfig;
			};

			service.setConfig = function setConfig(config) {
				usedConfig = config;
			};

			service.getFormConfiguration = function getFormConfiguration() {
				return usedConfig.formConfiguration;
			};

			service.getUsedValidationService = function getUsedValidationService() {
				return usedConfig.validationService;
			};

			service.getDialogConfig = function() {
				return usedDialogConfig;
			};

			service.setDialogConfig = function(dialogConfig) {
				usedDialogConfig = dialogConfig;
			};

			function getCustomBtn(customBtnLabel) {
				return {
					id: customBtnLabel,
					caption: usedConfig[customBtnLabel].label,
					fn: usedConfig[customBtnLabel].action
				};
			}

			function checkCustomButtons(usedConfig) {
				let customBtns = [];

				if(usedConfig.hasOwnProperty('customBtn1')) {
					customBtns.push(getCustomBtn('customBtn1'));
				}

				if(usedConfig.hasOwnProperty('customBtn2')) {
					customBtns.push(getCustomBtn('customBtn2'));
				}

				return customBtns;
			}

			service.showDialog = function(config, multi) {
				usedConfig = config;
				// multi entity form flag
				let templateFile = multi ? 'modal-multi-entity-form-template.html' : 'modal-form-template.html';

				let dlgConfig = {
					width: '700px',
					resizeable: usedConfig.resizeable ? usedConfig.resizeable : false,
					headerText: usedConfig.title,
					backdrop: usedConfig.backdrop ? usedConfig.backdrop : true,
					dataItem: usedConfig.dataItem,
					formConfiguration: usedConfig.formConfiguration,
					validationService: usedConfig.validationService,
					showOkButton: typeof (usedConfig.showOkButton) !== 'undefined' ? usedConfig.showOkButton : true,
					showCancelButton: usedConfig.showCancelButton || true,
					buttons: usedConfig.buttons,
					customButtons: []
				};

				if(multi) {
					dlgConfig.items = usedConfig.items;
					dlgConfig.headerText$tr$ = usedConfig.title;
					dlgConfig.message = usedConfig.dialogOptions.message;
					dlgConfig.rootService = usedConfig.dialogOptions.rootService;
					dlgConfig.templateUrl = globals.appBaseUrl + 'app/components/modaldialog/' + templateFile;
				}
				else {
					dlgConfig.bodyTemplateUrl = globals.appBaseUrl + 'app/components/modaldialog/' + templateFile;
				}

				dlgConfig.customButtons = checkCustomButtons(usedConfig);

				angular.extend(dlgConfig, (usedConfig.dialogOptions || {}));

				return platformDialogService.showDialog(dlgConfig).then(function (result) {
					if (result.ok) {
						if (_.isFunction(dlgConfig.handleOK)) {
							dlgConfig.handleOK(result);
						} else if (usedConfig && _.isFunction(usedConfig.handleOK)) {
							usedConfig.handleOK(result);
						}
						return result;
					} else if (result.custom1) {
						usedConfig.customBtn1.action(result);
						return result;
					} else if (result.custom2) {
						usedConfig.customBtn2.action(result);
						return result;
					} else { // default case equals cancel
						if (_.isFunction(usedConfig.handleCancel)) {// check if there is an optional cancel function
							usedConfig.handleCancel(result);
						}
						return false;
					}
				});
			};

			return service;
		}
	]);
})(angular);
