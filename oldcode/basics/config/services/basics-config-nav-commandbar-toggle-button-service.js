/**
 * Created by ong on 27.04.2022.
 */
(function () {
	'use strict';

	angular.module('basics.config').factory('basicsConfigNavCommandbarToggleButtonService', basicsConfigNavCommandbarToggleButtonService);

	basicsConfigNavCommandbarToggleButtonService.$inject = ['$http', '$q', 'basicsConfigMainService', 'basicsConfigNavCommandConstantTypes', 'basicsConfigNavCommandbarService'];

	function basicsConfigNavCommandbarToggleButtonService($http, $q, basicsConfigMainService, basicsConfigNavCommandConstantTypes, basicsConfigNavCommandbarService) {
		let service = {};
		service.moduleList = {};

		function saveEntityStatus(values) {
			let moduleName = values.InternalName, commandBar = values.CombarEnabled, navBar = values.NavbarEnabled, commandbarPortal = values.CombarPortalEnabled, navbarPortal = values.NavbarPortalEnabled;

			basicsConfigNavCommandbarService.saveModuleConfig(moduleName, commandBar, navBar, commandbarPortal, navbarPortal).then(function (result) {
				if(service.moduleList && service.moduleList.InternalName === result.InternalName) {
					service.moduleList.CombarEnabled = result.CombarEnabled;
					service.moduleList.NavbarEnabled = result.NavbarEnabled;
					service.moduleList.CombarPortalEnabled = result.CombarPortalEnabled;
					service.moduleList.NavbarPortalEnabled = result.NavbarPortalEnabled;
				} else {
					service.moduleList = result;
				}
			});
		}

		function processToggleButton(toggleOptions, model, info) {
			/* Use cases:
				Switch = AUS
				Text Overlay = The user configuration ... is disabled
				Switch = AN
				Keine Konfig vorhanden:
				Text Overlay  = There is no config...
				Konfig vorhanden
				Tabelle wird angezeigt
			 */

			//set key-variable
			service.moduleList[toggleOptions.key] = model;
			saveEntityStatus(service.moduleList);

			setSwitchToggleContainer(info.scope.containerScope, toggleOptions.key, false);
			if(!model) {
				info.scope.addOns.whiteboard.controller.setVisible(true);
			}
			else {
				let hasConfigKey = service.moduleList[basicsConfigNavCommandConstantTypes[toggleOptions.key].hasBarConfig];
				if(hasConfigKey) {
					info.scope.addOns.whiteboard.controller.setVisible(false);
				}
			}
		}

		function getCSSClass(cssType) {
			return cssType.toLowerCase().includes('nav') ? 'navbar-wrapper' : 'combar-wrapper';
		}

		function showWhiteboardOnContainer(isVariableEnabled, entityKeyName, overlay, uiAddOns) {
			let cssClass = getCSSClass(entityKeyName);

			let options = {
				directive: '<div data-basics-config-overflow-info-directive options="options.options" class="' + cssClass + '"></div>',
				options: overlay ? overlay : {}
			};

			if (!isVariableEnabled) {
				uiAddOns.getWhiteboard().showOptions(options, true);
			} else {
				uiAddOns.getWhiteboard().showOptions(options, false);
			}
		}

		function processForToggleAndWhiteboard(uiAddOns, toggleOptions, toggleKey, hasConfigKey, keyName) {

			function moduleLinkClick(event) {
				showWhiteboardOnContainer(false, keyName, getDirectiveOptions(3, keyName, null), uiAddOns);
			}

			let type = 2;
			if(toggleKey) {
				type = hasConfigKey ? 2 : 1;
			}
			let showWhiteboard = hasConfigKey ? toggleKey : false;
			uiAddOns.getToggleSwitch(toggleOptions).setVisible(true, toggleKey, false);
			toggleOptions.clickEvent = moduleLinkClick;
			//show text-container for config-overlay
			showWhiteboardOnContainer(showWhiteboard, keyName, getDirectiveOptions(type, keyName, toggleOptions), uiAddOns);
		}

		function getDirectiveOptions(type, name, options) {
			let overlayContent;
			if(type === 1) {
				//no Configuration - Overlay
				overlayContent = _.assign(angular.copy(basicsConfigNavCommandConstantTypes[name].overlay), angular.copy(basicsConfigNavCommandConstantTypes.noConfigurationItems));
				if(options.entityInternalName !== '' && !options.isPortal) {
					overlayContent.urls = [
						{
							label: 'Go to Module',
							url: '#/api?navigate&module=' + options.entityInternalName
						}
					];
					overlayContent.clickEvent = options.clickEvent;
				}
			} else if (type === 3) {
				overlayContent = _.assign(angular.copy(basicsConfigNavCommandConstantTypes[name].overlay), angular.copy(basicsConfigNavCommandConstantTypes.refreshItems));
			}
			else {
				overlayContent = basicsConfigNavCommandConstantTypes[name].overlay;
			}
			return overlayContent;
		}

		function setSwitchToggleContainer(scope, keyName, isSelectionChanged) {
			if(isSelectionChanged) {
				service.moduleList = basicsConfigMainService.getSelected();
			}
			let uiAddOns = scope.getUiAddOns();
			let toggleKey = service.moduleList[basicsConfigNavCommandConstantTypes[keyName].entityKeyName];
			let hasConfigKey = service.moduleList[basicsConfigNavCommandConstantTypes[keyName].hasBarConfig];

			let toggleOptions = {
				key: basicsConfigNavCommandConstantTypes[keyName].entityKeyName,
				entityId: service.moduleList.Id,
				entityInternalName: service.moduleList.IsHome ? service.moduleList.InternalName : '', //if isHome --> init navigation-button
				isPortal: basicsConfigNavCommandConstantTypes[keyName].isPortal,
				fn: function (toggleOptions, model, scope) {
					processToggleButton(toggleOptions, model, scope);
				}
			};

			processForToggleAndWhiteboard(uiAddOns, toggleOptions, toggleKey, hasConfigKey, keyName);
		}

		service.showToggleSwitchContainer = function (scope, keyName) {
			/* Deprecated:
				UseCases:
				hasNoConfiguration:
				- toggleSwitch is false and disabled
				- show overlay no-config

				hasConfig and toggle is false:
				- toggleswitch aktiv
				- show info-overlay

				hasConfig and toggle is true:
				- toggleswitch aktiv
				- show no overlay
			 */
			if (!basicsConfigMainService.getSelected()) {
				return;
			}

			setSwitchToggleContainer(scope, keyName, true);
		};

		return service;
	}
})(angular);