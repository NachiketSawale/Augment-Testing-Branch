/**
 * Created by lid on 8/2/2017.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name TreeviewListDialogDataService
	 * @function
	 *
	 * @description
	 * TreeviewListDialogDataService is the data service for all entities related functionality.
	 */
	const moduleName = 'basics.common';
	const masterModule = angular.module(moduleName);

	masterModule.factory('treeviewListDialogDataService', TreeviewListDialogDataService);
	TreeviewListDialogDataService.$inject = ['$translate', 'platformModalService', '_', 'globals'];

	function TreeviewListDialogDataService($translate, platformModalService, _, globals) {
		const service = {};
		let dialogParentService;
		let dialogParentContainer;
		const dialogDefaultConfig = {
			width: '900px',
			isShowTreeview: true,
			needReloadData: false
		};
		/*
         service.setDialogParentService = function setDialogParentService(parentService) {
         dialogParentService = parentService;
         };
         service.getDialogParentService = function getDialogParentService() {
         return dialogParentService;
         };
         */
		service.getDialogConfig = function getConfig() {
			angular.extend(dialogDefaultConfig, dialogParentService.dialogConfig);
			dialogDefaultConfig.headerText = $translate.instant(dialogDefaultConfig.headerText);
			return dialogDefaultConfig;
		};

		service.ok = function ok(selectedItems) {
			if (dialogParentService.ok) {
				dialogParentService.ok(selectedItems);
			} else {
				if (!_.isEmpty(selectedItems)) {
					const items = _.sortBy(selectedItems, 'Id');
					_.forEach(dialogParentService.getList(), function (item) {
						_.remove(items, {'Id': item.Id});
					});
					_.each(items, function (item) {
						dialogParentContainer.data.doCallHTTPCreate(item, dialogParentContainer.data, dialogParentContainer.data.onCreateSucceeded);
					});

				}
			}
		};

		service.showTreeview = function showTreeview(parentContainer) {
			dialogParentContainer = parentContainer;
			dialogParentService = parentContainer.service;

			const modalCreateConfig = {
				templateUrl: globals.appBaseUrl + 'basics.common/templates/treeview-list-dialog.html',
				controller: 'treeviewListDialogMainController',
				resizeable: true,
				height: '500px'
			};

			return platformModalService.showDialog(modalCreateConfig);
		};
		return service;

	}
})(angular);