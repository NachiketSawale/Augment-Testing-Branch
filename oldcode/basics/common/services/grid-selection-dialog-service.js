/**
 * Created by wuj on 11/20/2015.
 */
/* jshint -W074 */
/* jshint -W072 */

(function (angular) {
	'use strict';

	angular.module('basics.common').factory('basicsCommonGridSelectionDialogService',
		['$injector', 'platformSchemaService', '$translate', 'platformTranslateService', 'platformModalService', 'PlatformMessenger', '_', 'globals',
			function ($injector, platformSchemaService, $translate, platformTranslateService, platformModalService, PlatformMessenger, _, globals) {
				/* platformTranslateService.registerModule('basics.common');
				 var service = {}, formConfiguration = {}, domains;
				 var self = this; */

				const service = {};

				service.refreshEntity = new PlatformMessenger();

				let usedConfig;

				service.getDialogTitle = function getDialogTitle() {
					return usedConfig.title;
				};

				service.getSelectedItems = function getDataItems() {
					return _.filter(usedConfig.dataItems, {IsChecked: true});
				};

				service.getDataItems = function getDataItems() {
					return usedConfig.dataItems;
				};

				service.getGridConfiguration = function getGridConfiguration() {
					return usedConfig.gridConfiguration;
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

				service.getAllowMultiple = function () {
					return !!usedConfig.allowMultiple;
				};

				service.isCheckedValueChange = function (item, newValue) {
					// item.IsChecked = newValue;

					if (!usedConfig.allowMultiple && newValue) {
						const currentCheckedItem = _.find(usedConfig.dataItems, {IsChecked: true});
						if (currentCheckedItem) {
							currentCheckedItem.IsChecked = false;
							service.refreshEntity.fire(null, currentCheckedItem);
						}
					}
					// item.IsChecked = newValue;
					return true;
				};

				service.checkAllItems = function (newValue) {
					angular.forEach(usedConfig.dataItems, function (item) {
						item.IsChecked = newValue;
					});
					return true;
				};

				service.isOnlyOneSelected = function () {
					let count = 0;
					for (let i = 0; i < usedConfig.dataItems.length; i++) {
						const item = usedConfig.dataItems[i];
						if (item && item.IsChecked === true) {
							count++;
							if (count > 1) {
								return false;
							}
						}
					}
					return count;
				};

				service.isOKBtnRequirement = function () {
					for (let i = 0; i < usedConfig.dataItems.length; i++) {
						const item = usedConfig.dataItems[i];
						if (item && item.IsChecked === true) {
							return true;
						}
					}
					return false;
				};

				service.showDialog = function showDialog(config) {
					usedConfig = config;
					const modalOptions = config.dialogOptions || {};
					usedConfig.allowMultiple = config.allowMultiple || false;
					modalOptions.scope = (usedConfig.scope) ? usedConfig.scope.$new(true) : null;
					modalOptions.templateUrl = globals.appBaseUrl + 'basics.common/partials/grid-selection-dialog.html';
					modalOptions.backdrop = false;
					modalOptions.bodyTextKey = config.bodyTextKey;
					modalOptions.OKBtnText = config.OKBtnText || 'cloud.common.ok';
					modalOptions.cancelBtnText = config.cancelBtnText || 'cloud.common.cancel';
					modalOptions.iconClass = 'ico-info';
					modalOptions.OKBtnRequirement = false;

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.isOK) {
							if (config.handleOK) {
								config.handleOK(result.data);
							}
						} else {
							if (config.handleCancel) {
								config.handleCancel(result);
							}
						}
					});
				};

				return service;
			}]
	);
})(angular);