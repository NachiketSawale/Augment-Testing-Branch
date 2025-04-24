/**
 * Created by waz on 11/1/2017.
 */
(function (angular) {

	/**
	 * @ngdoc service
	 * @name basicsCommonContainerDialogService
	 * @description
	 *
	 * Container Dialog is used to select container items in dialog,this service is the enterance of container dialog,
	 * if you want to show container dialog,call 'showContainerDialog' with dialog option.
	 * eg:
	 * var config = {
                bodyDirective: 'basics-common-single-grid-container',
                handler: 'basicsCommonContainerDialogSingleGridContainerHandler',
                needSelectDataService: 'dialogContainerDataService',
                uiConfig: {
                    dialogTitle:  'module.submodule.dialogTitle',
                    selectEntityText: 'module.submodule.selectEntityText'
                },
                custom: {
                    container: {
                        dataService: 'dialogContainerDataService',
                        uiService: 'dialogContainerUiService',
                        gridId: '79b0cf159edd4b8993cf557ecbeb9689'
                    },
                    currentDataService: 'currentDataService',
                    foreignKey: 'foreignKey'
                }
            };
     basicsCommonContainerDialogService.showContainerDialog(config);
	 *
	 * config param:
	 * @param bodyTemplateUrl
	 * mandatory,use to define dialog body
	 * @param handler
	 * mandatory,use to define dialog behavior
	 * @param uiConfig
	 * mandatory,use to define dialog ui config
	 * @param custom
	 * optional,depend on your bodyDirective and handler.if you create your own bodyDirective and handler,you don't need it
	 */

	'use strict';

	const module = 'basics.common';
	angular
		.module(module)
		.factory('basicsCommonContainerDialogService', BasicsCommonContainerDialogService);
	BasicsCommonContainerDialogService.$inject = ['$injector', 'platformModalService', 'globals'];

	function BasicsCommonContainerDialogService($injector, platformModalService, globals) {

		let dialogConfig;
		const service = {
			'showContainerDialog': showContainerDialog,
			'getDialogConfig': getDialogConfig
		};

		function showContainerDialog(config) {
			initFromConfig(config);
			showDialog();
		}

		function getDialogConfig() {
			return dialogConfig;
		}

		function initFromConfig(config) {
			dialogConfig = config;
			if (dialogConfig.uiConfig.filterCheckbox) {
				dialogConfig.uiConfig.filterCheckbox.title = dialogConfig.uiConfig.filterCheckbox.title ?
					dialogConfig.uiConfig.filterCheckbox.title :
					'basics.common.containerDialog.filterCheckboxTitle';
			}
			const handler = getService(config.handler);
			handler.setConfig(config);
			angular.extend(service, {
				refresh: handler.refresh,
				close: handler.close,
				ok: handler.ok,
				search: handler.search,
				activeFilter: handler.activeFilter
			});
		}

		function showDialog() {
			const modalConfig = {
				templateUrl: globals.appBaseUrl + 'basics.common/templates/container-dialog/container-dialog.html',
				controller: 'basicsCommonContainerDialogMainController',
				resizeable: true
			};
			platformModalService.showDialog(modalConfig);
		}

		function getService(service) {
			return angular.isString(service) ? $injector.get(service) : service;
		}

		return service;
	}
})(angular);