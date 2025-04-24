/**
 * Created by baedeker on 2014-08-13
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:platformModalGridConfigService
	 * @description
	 * Creates a form container standard config from dto and high level description
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('platform').factory('platformModalGridConfigService', ['platformModalService',

		function (platformModalService) {

			var service = {};

			var usedConfig;

			service.setConfig = function setConfig(config) {
				usedConfig = config;
				prepareCustomButtons();
			};

			service.getDialogTitle = function getDialogTitle() {
				return usedConfig.title;
			};

			service.getDataItems = function getDataItems() {
				return usedConfig.getDataItems ? usedConfig.getDataItems() : usedConfig.dataItems;
			};

			service.relations = function relations() {
				return usedConfig.relations;
			};

			service.getGridConfiguration = function getGridConfiguration() {
				return usedConfig.gridConfiguration;
			};

			service.getUsedValidationService = function getUsedValidationService() {
				return usedConfig.validationService;
			};

			service.usesTree = function usesTree() {
				return (usedConfig.parentProp && usedConfig.parentProp.length > 0 && usedConfig.childProp && usedConfig.childProp.length > 0);
			};

			service.hasIconClass = function hasIconClass() {
				return (usedConfig.iconClass && usedConfig.iconClass.length > 0);
			};

			service.getIconClass = function getIconClass() {
				return usedConfig.iconClass;
			};

			service.getParentProp = function getParentProp() {
				return usedConfig.parentProp;
			};

			service.getChildProp = function getChildProp() {
				return usedConfig.childProp;
			};

			service.getGridUUID = function () {
				return usedConfig.gridConfiguration.uuid;
			};

			service.getTools = function () {
				return usedConfig.gridConfiguration.tools;
			};

			service.getEntityCreatedEvent = function getEntityCreatedEvent() {
				return usedConfig.gridConfiguration.tools ? usedConfig.gridConfiguration.tools.entityCreatedEvent : null;
			};

			service.getEntityDeletedEvent = function getEntityDeletedEvent() {
				return usedConfig.gridConfiguration.tools ? usedConfig.gridConfiguration.tools.entityDeletedEvent : null;
			};

			service.getSelectionAfterSortEvent = function getSelectionAfterSortEvent() {
				return usedConfig.gridConfiguration.tools ? usedConfig.gridConfiguration.tools.selectionAfterSortEvent : null;
			};

			service.supportsRowSelection = function supportsRowSelection() {
				return !!usedConfig.gridConfiguration.tools && !!usedConfig.gridConfiguration.tools.onSelectedRowChanged;
			};

			service.onSelectedRowChanged = function onSelectedRowChanged(rowItem) {
				if (!!usedConfig.gridConfiguration.tools && !!usedConfig.gridConfiguration.tools.onSelectedRowChanged) {
					usedConfig.gridConfiguration.tools.onSelectedRowChanged(rowItem);
				}
			};

			service.prepareMoveUpDown = function (up, down) {
				service.handleMoveUp = angular.noop;
				service.handleMoveDown = angular.noop;

				if (usedConfig && usedConfig.handleMoveUp) {
					_.find(usedConfig.tools.items, {id: 'moveUp'}).fn = up;
					service.handleMoveUp = usedConfig.handleMoveUp;
				}
				if (usedConfig && usedConfig.handleMoveDown) {
					_.find(usedConfig.tools.items, {id: 'moveDown'}).fn = down;
					service.handleMoveDown = usedConfig.handleMoveDown;
				}
			}

			service.disableOK = function disableOK() {
				if(usedConfig && usedConfig.dialogOptions && _.isFunction(usedConfig.dialogOptions.disableOkButton)) {
					return usedConfig.dialogOptions.disableOkButton();
				}

				if(usedConfig && usedConfig.dialogOptions && !_.isNil(usedConfig.dialogOptions.disableOkButton)) {
					return usedConfig.dialogOptions.disableOkButton;
				}

				return false;
			};

			function prepareCustomButtons() {
				if (usedConfig && usedConfig.btn1Enable && usedConfig.btn1Enable.show) {
					service.customBtn1Enable = true;
					service.customBtn1Label = usedConfig.btn1Enable.customBtn1Label;
					service.handleCustomBtn1 = usedConfig.btn1Enable.handleCustomBtn1;
				} else {
					service.customBtn1Enable = false;
					service.customBtn1Label = '';
					service.handleCustomBtn1 = null;
				}

				if (usedConfig && usedConfig.btn2Enable && usedConfig.btn2Enable.show) {
					service.customBtn2Enable = true;
					service.customBtn2Label = usedConfig.btn2Enable.customBtn2Label;
					service.handleCustomBtn2 = usedConfig.btn2Enable.handleCustomBtn2;
				} else {
					service.customBtn2Enable = false;
					service.customBtn2Label = '';
					service.handleCustomBtn2 = null;
				}
			}

			service.showDialog = function showDialog(config) {
				usedConfig = config;
				prepareCustomButtons();

				var dlgOptions = config.dialogOptions || {};
				dlgOptions.scope = (usedConfig.scope) ? usedConfig.scope.$new(true) : null;
				// dlgOptions.templateUrl = globals.appBaseUrl + 'app/components/modaldialog/modal-grid-template.html';
				dlgOptions.templateUrl = dlgOptions.customTemplate ? dlgOptions.customTemplate : globals.appBaseUrl + 'app/components/modaldialog/modal-grid-template.html';
				dlgOptions.backdrop = false;
				dlgOptions.height = '500px';
				dlgOptions.resizeable = true;

				platformModalService.showDialog(dlgOptions).then(function (result) {
					if (result.isOK) {
						if (config.handleOK) {
							config.handleOK(result);
						}
					} else {
						if (config.handleCancel) {
							config.handleCancel(result);
						}
					}
				});
			};

			return service;
		}
	]);
})(angular);
