/*
 * $Id: dialog-user-setting-service.js $
 * Copyright (c) RIB Software GmbH
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name dialogUserSettingService
	 * @function
	 * @description
	 */
	angular.module('platform').factory('dialogUserSettingService', dialogUserSettingService);

	dialogUserSettingService.$inject = ['$rootScope', 'platformContextService', 'platformLanguageService', '$translate', 'mainViewService', '_', '$'];

	function dialogUserSettingService($rootScope, platformContextService, platformLanguageService, $translate, mainViewService, _, $) { // jshint ignore:line

		const deactivatedDialogsId = '004a2d69d06449dc91406921a10759e0';

		var _dialogConfigs = [];
		var service = {};

		$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
			if (toState.name !== fromState.name) {
				_dialogConfigs = [];
			}
		});

		function element(key, value) {
			if (!key || !value) {
				throw new Error('Missing argument');
			}
			return _.find(_dialogConfigs, [key, value]);
		}

		/**
		 * @ngdoc function
		 * @name createNewConfigObject
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description returns a new  dialog config object with the given dialogId as id
		 * @param dialogId {string} dialog id
		 * @returns {object} dialogConfig or undefined
		 */
		function createNewConfigObject(dialogId) {
			/*
            DialogConfig
            id: DialogId,
            forms: {
            },
            grids: {
               821983479234 : {
                       columns: ...
                   },
               821983479291 : {
                       columns: ...
                   }
               },
            dialog: {
                  width: 123px,
                  height: 123px,
                  position:
            },
            custom: {
            }
        }
        */
			var config = {};
			config.id = dialogId;
			config.forms = {};
			config.grid = {};
			config.dialog = {};
			config.custom = {};

			return config;
		}

		/**
		 * @ngdoc function
		 * @name dialogConfigbyId
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description returns dialog config for given dialogId
		 * @param dialogId {string} dialog id
		 * @returns {object} dialogConfig or undefined
		 */
		function dialogConfigById(dialogId) {
			if (!dialogId) {
				throw new Error('Missing argument');
			}

			var dialog = element('id', dialogId);

			if (dialog) {
				return dialog;
			} else {
				return null;
			}
		}

		service.dialogConfigById = dialogConfigById;

		/**
		 * @ngdoc function
		 * @name saveDialogSettings
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description saves the configuration of a dialog which is retrieved using the provided dialog id
		 * @param dialogOptions {object} dialog options
		 * @param dialogSettings {object}
		 * @param multiPageDialogId {object}
		 */

		function checkForSaveSettings(dialogOptions, modalDialog) {
			//Not saving in maximum-status, if max/min btn is shown in dialog-header
			let isMaximized = modalDialog.hasClass('maximized');
			return dialogOptions?.showMinimizeMaximizeButton && isMaximized;
		}

		service.saveDialogSettings = function saveDialogSettings(dialogOptions, dialogSettings, multiPageDialogId) {
			let dialogId = dialogOptions.id;
			let config;
			let modalContent = angular.element('.' + dialogId + ' > .modal-content');
			let modalDialog = angular.element('.modal-dialog.' + dialogId);

			if(checkForSaveSettings(dialogOptions, modalDialog)) {
				return;
			}

			if(multiPageDialogId) {
				config = dialogConfigById(multiPageDialogId);
				if (!config) {
					config = createNewConfigObject(multiPageDialogId);
					_dialogConfigs.push(config);
				}
			}
			else {
				config = dialogConfigById(dialogId);
				if (!config) {
					config = createNewConfigObject(dialogId);
					_dialogConfigs.push(config);
				}
			}

			if (modalContent && modalDialog && modalContent.length > 0) {

				let modalContentDimensions = modalContent[0].getBoundingClientRect();

				if (modalContentDimensions) {
					var width = modalContentDimensions.width;
					var height = modalContentDimensions.height;

					if (dialogOptions.resizeable) {
						if (width) {
							config.dialog.width = Math.floor((width / window.innerWidth) * 100);
						}

						if (height) {
							config.dialog.height = Math.floor((height / window.innerHeight) * 100);
						}
					}

					var top = parseFloat(modalDialog.css('top'));
					var left = parseFloat(modalDialog.css('left'));

					if (top && top > 0) {
						config.dialog.top = Math.round((top / window.innerHeight) * 100);
					}

					if (left && left > 0) {
						config.dialog.left = Math.round((left / window.innerWidth) * 100);
					}

					if (width > 0 && height > 0) {
						var splitBox = $('.modal-dialog .splitBox.modal-wrapper');
						_.forEach(splitBox, function (el, index) {
							var splitBoxWidthPercentage = Math.floor((parseFloat(el.style.width) / width) * 100);
							var splitBoxHeightPercentage = Math.floor((parseFloat(el.style.height) / height) * 100);
							var splitBoxTopPercentage = Math.floor((parseFloat(el.style.top) / height) * 100);
							config.forms['splitbox' + index] = {
								width: splitBoxWidthPercentage,
								height: splitBoxHeightPercentage,
								top: splitBoxTopPercentage,
								isCollapsed: el.classList.contains('k-state-collapsed')
							};
						});

						var splitters = $('.modal-dialog .k-splitbar');
						_.forEach(splitters, function (el, index) {
							var splitterWidthPercentage = Math.floor((parseFloat(el.style.width) / width) * 100);
							var splitBoxTopPercentage = Math.floor((parseFloat(el.style.top) / height) * 100);
							config.forms['splitter' + index] = {
								width: splitterWidthPercentage,
								top: splitBoxTopPercentage,
								isDraggable: el.classList.contains('k-splitbar-draggable-vertical'),
								innerHtml: el.innerHTML
							};
						});
					}
				}
			}

			if (dialogSettings) {
				if (dialogSettings.forms) {
					config.forms = dialogSettings.forms;
				}
				if (dialogSettings.custom) {
					config.custom = dialogSettings.custom;
				}
			}

			delete config.Propertyconfig;

			var configToSave = {dialogConfig: config};

			if(multiPageDialogId) {
				mainViewService.setModuleConfig(multiPageDialogId, configToSave);
			}
			else {
				mainViewService.setModuleConfig(dialogId, configToSave);
			}
		};

		/**
		 * @ngdoc function
		 * @name deactivateDialog
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description saves the given dialogId in the deactivated dialog list
		 * @param dialogId
		 */
		service.deactivateDialog = function deactivateDialog(dialogId) {
			var config = mainViewService.getModuleConfig(deactivatedDialogsId);
			var propertyConfig;
			if (config && config.Propertyconfig) {
				propertyConfig = config.Propertyconfig;
				propertyConfig.push(dialogId);
			} else {
				propertyConfig = [dialogId];
			}
			mainViewService.setModuleConfig(deactivatedDialogsId, propertyConfig);
		};

		/**
		 * @ngdoc function
		 * @name resetDeactivatedDialogs
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description reset all saved deactivated dialogs
		 */
		service.resetDeactivatedDialogs = function resetDeactivatedDialogs() {
			mainViewService.resetModuleConfig(deactivatedDialogsId);
		};

		service.isDialogDeactivated = function isDialogDeactivated(dialogId) {
			var deactivatedIds = mainViewService.getModuleConfig(deactivatedDialogsId);
			return deactivatedIds && (deactivatedIds.Propertyconfig && deactivatedIds.Propertyconfig.indexOf(dialogId) >= 0);

		};

		/** configToSave
		 * @ngdoc function
		 * @name applyDialogSettings
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description applies the configuration of a dialog which is retrieved using the provided dialog id
		 * @param modalOptions
		 * @param multipageOptions
		 */
		service.applyDialogSettings = function applyDialogSettings(modalOptions, multipageOptions) {
			var savedConfig;
			var config;
			var modalId = multipageOptions ? multipageOptions.stepSettingsId : modalOptions.id;
			var modalContent = modalOptions.id ? angular.element('.' + modalOptions.id + ' > .modal-content') : angular.element('.modal-content');
			var modalDialog = modalOptions.id ? angular.element('.modal-dialog.' + modalOptions.id) : angular.element('.modal-dialog');

			savedConfig = mainViewService.getModuleConfig(modalId);
			if (savedConfig) {
				config = dialogConfigById(modalId);
				if (!config) {
					config = savedConfig.Propertyconfig.dialogConfig;
					_dialogConfigs.push(config);
				}
				else {
					config = savedConfig.Propertyconfig.dialogConfig;
				}

				if (config && config.dialog && !_.isEmpty(config.dialog)) {
					if (modalContent) {
						let maxLeft = 0;
						let maxTop = 0;
						let width = parseFloat(modalOptions.width);

						if (multipageOptions && multipageOptions.width && parseFloat(multipageOptions.width) > width) {
							width = parseFloat(multipageOptions.width);
						}

						if (config.dialog.width && config.dialog.width < 100 && config.dialog.width > 0) {
							let tempWidth = Math.floor((config.dialog.width * window.innerWidth) / 100);
							let minWidth = parseFloat(modalOptions.minWidth);
							width = tempWidth < minWidth ? minWidth : tempWidth;
						}

						modalContent.css('width', width + 'px');

						// Check the max left value
						maxLeft = window.innerWidth - width;

						let height = parseFloat(modalOptions.height);

						if (multipageOptions && multipageOptions.height && parseFloat(multipageOptions.height) > height) {
							height = parseFloat(multipageOptions.height);
						}

						if (config.dialog.height && config.dialog.height < 100 && config.dialog.height > 0) {
							let tempHeight = Math.floor((config.dialog.height * window.innerHeight) / 100);
							let minHeight = parseFloat(modalOptions.minHeight);
							height = tempHeight < minHeight ? minHeight : tempHeight;
						}

						modalContent.css('height', height + 'px');

						maxTop = window.innerHeight - height;

						if (config.dialog.top && config.dialog.top < 100 && config.dialog.top > 0) {
							let top = Math.floor((config.dialog.top * window.innerHeight) / 100);
							top = top > maxTop ? maxTop : top;
							modalContent.css('top', 0);
							modalDialog.css('top', top);
						}
						else {
							modalContent.css('top', 0);
							modalDialog.css('top', (window.innerHeight - height) / 2);
						}

						modalDialog.css('height', height + modalDialog.css('top') + 'px');

						if (config.dialog.left && config.dialog.left < 100 && config.dialog.left > 0) {

							let left = Math.floor((config.dialog.left * window.innerWidth) / 100);
							left = left > maxLeft ? maxLeft : left;
							modalContent.css('left', 0);
							modalDialog.css('left', left);
						}
						else {
							modalContent.css('left', 0);
							modalDialog.css('left', (window.innerWidth - width) / 2);
						}
					}
				}
			}
		};

		/**
		 * @ngdoc internal function
		 * @name saveDialogConfig
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description saves the provided configuration with the given dialog id
		 * @param dialogId {string} dialog id
		 * @param config {object} configuration.
		 * Structure of config object
		 * id: DialogId,
		 * forms: {},
		 * grids: { 821983479234 : { columns: ...}, 821983479291 : { columns: ...}},
		 * dialog: { width: 123px, height: 123px, top:.., left:..},
		 * custom: {}
		 */
		function saveDialogConfig(dialogId, config) {
			var propConfig = dialogConfigById(dialogId);
			if (!propConfig) {
				propConfig = createNewConfigObject(dialogId);
				_dialogConfigs.push(propConfig);
			}
			propConfig = config;

			var configToSave = {dialogConfig: propConfig};

			mainViewService.setModuleConfig(dialogId, configToSave);
		}

		/**
		 * @ngdoc function
		 * @name setCustomConfig
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description sets the provided custom configuration with the given dialog id
		 * @param dialogId {string} dialog id
		 * @param configKey {string} Key of the custom configuration
		 * @param configValue {object} Value of custom configuration
		 */
		service.setCustomConfig = function setCustomConfig(dialogId, configKey, configValue) {
			setGetConfig('custom', 'set', dialogId, configKey, configValue);
		};

		/**
		 * @ngdoc function
		 * @name setCustomConfig
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description sets the provided custom configuration with the given dialog id
		 * @param dialogId {string} dialog id
		 * @param configKey {string} Key of the custom configuration
		 * @param configValue {object} Value of custom configuration
		 */
		service.setFormConfig = function setFormConfig(dialogId, configKey, configValue) {
			setGetConfig('forms', 'set', dialogId, configKey, configValue);
		};

		function setGetConfig(type, action, dialogId, configKey, configValue) {
			var propConfig = dialogConfigById(dialogId);
			if (!propConfig) {
				var savedConfig = mainViewService.getModuleConfig(dialogId);
				if (savedConfig) {
					propConfig = savedConfig.Propertyconfig.dialogConfig;
				} else {
					propConfig = createNewConfigObject(dialogId);
				}
				_dialogConfigs.push(propConfig);
			}

			switch (type) {
				case 'custom':
					if (action === 'get') {
						return _.get(propConfig, 'custom.' + configKey);
					} else if (action === 'set') {
						_.set(propConfig, 'custom.' + configKey, configValue);
					}
					break;
				case 'forms':
					if (action === 'get') {
						return _.get(propConfig, 'forms.' + configKey);
					} else if (action === 'set') {
						_.set(propConfig, 'forms.' + configKey, configValue);
					}
					break;
				default:
					break;
			}
		}

		/**
		 * @ngdoc function
		 * @name getCustomConfig
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description gets the provided custom configuration with the given dialog id and config key
		 * @param dialogId {string} dialog id
		 * @param configKey {string} Key of the custom configuration
		 */
		service.getCustomConfig = function getCustomConfig(dialogId, configKey) {
			return setGetConfig('custom', 'get', dialogId, configKey);
		};

		/**
		 * @ngdoc function
		 * @name getDialogConfig
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description returns the saved configuration object of a dialog which is retrieved using the provided dialog id
		 * @param dialogId {string} dialog id
		 * @returns {object} Saved configuration object, when undefined, return new configuration object
		 */
		service.getDialogConfig = function getDialogConfig(dialogId) {
			var propConfig = dialogConfigById(dialogId);
			if (!propConfig) {
				var savedConfig = mainViewService.getModuleConfig(dialogId);
				if (savedConfig) {
					propConfig = savedConfig.Propertyconfig.dialogConfig;
				} else {
					propConfig = createNewConfigObject(dialogId);
				}
				_dialogConfigs.push(propConfig);
			}
			return propConfig;
		};

		/**
		 * @ngdoc function
		 * @name setModalOptions
		 * @function
		 * @methodOf DialogUserSettingService
		 * @description takes in a modalOptions object and sets the save config values in the object
		 * @param modalOptions {object}
		 * @param multipageOptions {object}
		 * @returns {object} updated modalOptions object
		 */
		service.setModalOptions = function setModalOptions(modalOptions, multipageOptions) {
			var modalId = multipageOptions ? multipageOptions.stepSettingsId : modalOptions.id;
			if (modalId) {
				var propConfig = dialogConfigById(modalId);
				if (!propConfig) {
					var savedConfig = mainViewService.getModuleConfig(modalId);
					if (savedConfig) {
						propConfig = savedConfig.Propertyconfig.dialogConfig;
						_dialogConfigs.push(propConfig);
					}
				}
				if (propConfig) {
					var maxLeft = 0;
					var maxTop = 0;

					//WIDTH
					let width = parseFloat(modalOptions.minWidth);
					if(multipageOptions && multipageOptions.width && parseFloat(multipageOptions.width) > width) {
						width = parseFloat(multipageOptions.width);
					}

					if (propConfig.dialog.width && propConfig.dialog.width < 100 && propConfig.dialog.width > 0) {
						let tempWidth = Math.floor((propConfig.dialog.width * window.innerWidth) / 100);
						if(tempWidth > width) {
							width = tempWidth;

						}
					}
					modalOptions.width = width;

					// Check the max left value
					maxLeft = window.innerWidth - width;

					//HEIGHT
					let height = parseFloat(modalOptions.minHeight);
					if(multipageOptions && multipageOptions.height && parseFloat(multipageOptions.height) > height) {
						height = parseFloat(multipageOptions.height);
					}

					if (propConfig.dialog.height && propConfig.dialog.height < 100 && propConfig.dialog.height > 0) {
						let tempHeight = Math.floor((propConfig.dialog.height * window.innerHeight) / 100);
						if(tempHeight > height) {
							height = tempHeight;

						}
					}

					if (_.get(modalOptions, 'dontShowAgain.showDeactivateOption')) {
						height += 62;
					}
					modalOptions.height = height;

					// Check the max top value
					maxTop = window.innerHeight - height;

					// TOP
					if (propConfig.dialog.top && propConfig.dialog.top < 100 && propConfig.dialog.top > 0) {
						let top = Math.floor((propConfig.dialog.top * window.innerHeight) / 100);
						top = top < maxTop ? top : maxTop;
						modalOptions.top = top;
					}
					else { //centralize dialog
						modalOptions.top = (window.innerHeight - modalOptions.height) / 2;
					}

					// LEFT
					if (propConfig.dialog.left && propConfig.dialog.left < 100 && propConfig.dialog.left > 0) {

						let left = Math.floor((propConfig.dialog.left * window.innerWidth) / 100);
						left = left < maxLeft ? left : maxLeft;
						modalOptions.left = left;
					}
					else {
						modalOptions.left = (window.innerWidth - modalOptions.width) / 2;
					}

					// For lookup dialogs
					if (_.has(modalOptions, 'scope.$parent.lookupOptions')) {
						_.set(modalOptions, 'scope.$parent.lookupOptions.width', width);
						_.set(modalOptions, 'scope.$parent.lookupOptions.height', height);
						_.set(modalOptions, 'scope.$parent.lookupOptions.top', modalOptions.top);
						_.set(modalOptions, 'scope.$parent.lookupOptions.left', modalOptions.left);
					}
				}
			}
			return modalOptions;
		};

		return service;
	}
})(angular);
