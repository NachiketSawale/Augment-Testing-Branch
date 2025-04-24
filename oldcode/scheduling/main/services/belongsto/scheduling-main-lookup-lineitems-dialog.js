/* global globals */
/**
 * Created by leo on 20.04.2017.
 */
(function (angular) {
	'use strict';

	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityBelongsToDataServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('schedulingMainLookupLineItemsDialogService', SchedulingMainLookupLineItemsDialog);

	SchedulingMainLookupLineItemsDialog.$inject = ['_', '$http', '$injector', 'schedulingMainService',
		'platformModalService'];

	function SchedulingMainLookupLineItemsDialog(_, $http, $injector, schedulingMainService, platformModalService) {

		let service = {};
		let usedConfig;
		let itemFilterEnabled = false;
		let itemFilter;

		service.setConfig = function setConfig(config) {
			usedConfig = config;
		};

		service.getDialogTitle = function getDialogTitle() {
			return usedConfig.title;
		};

		service.getDataItems = function getDataItems() {
			return usedConfig.dataItems;
		};

		service.getGridConfiguration = function getGridConfiguration() {
			return usedConfig.gridConfiguration;
		};

		service.hasIconClass = function hasIconClass() {
			return (usedConfig.iconClass && usedConfig.iconClass.length > 0);
		};

		service.getIconClass = function getIconClass() {
			return usedConfig.iconClass;
		};

		service.getGridUUID = function () {
			return usedConfig.gridConfiguration.uuid;
		};

		service.enableItemFilter = function(enabled) {
			enabled = angular.isUndefined(enabled) ? true : enabled; // call func without param
			// var doListReload = itemFilterEnabled !== enabled;
			itemFilterEnabled = enabled;
		};

		service.setItemFilter = function(predicate) {
			// var doListReload = itemFilter !== predicate;
			itemFilterEnabled = true;
			itemFilter = predicate;
			if (predicate === null) {
				itemFilterEnabled = false;
			}
		};

		service.setApplySplitResultTo = function setApplySplitResultTo(value){
			usedConfig.applySplitResultTo = value;
		};

		service.getApplySplitResultTo = function getApplySplitResultTo(){
			if (usedConfig && usedConfig.applySplitResultTo) {
				return usedConfig.applySplitResultTo;
			} else {
				return 'QuantityTarget';
			}
		};

		service.setNoRelation = function setNoRelation(value){
			usedConfig.noRelation = value;
		};

		service.getNoRelation = function getNoRelation(){
			if (usedConfig) {
				return usedConfig.noRelation;
			} else {
				return usedConfig.applySplitResultTo === 'QuantityTarget';
			}
		};

		service.getList = function(){
			return service.load();
		};

		service.getHeaders = function getHeader(){
			return usedConfig.headers;
		};
		service.load = function(){
			if (usedConfig.roundingConfigs) {
				let estRoundingConfigDetails = usedConfig.roundingConfigs[itemFilter.EstHeaderFk];
				$injector.get('estimateMainRoundingDataService').setEstRoundingConfigData(estRoundingConfigDetails);
			}

			if(itemFilterEnabled) {
				// extend filter to show also version 0 items
				// (e.g. new items should be visible despite filtering)
				if (typeof itemFilter === 'function') {
					return _.filter(usedConfig.dataItems, function (item) {
						return itemFilter(item);
					});
				}

				return _.filter(usedConfig.dataItems, itemFilter);
			} else {
				return usedConfig.dataItems;
			}

		};
		service.disableOkButton = function(){
			return usedConfig.dialogOptions.disableOkButton();
		};

		service.showLookup = function showLookup(config) {
			usedConfig = config;

			let dlgOptions = config.dialogOptions || {};
			dlgOptions.scope = (usedConfig.scope) ? usedConfig.scope.$new(true) : null;
			dlgOptions.templateUrl = globals.appBaseUrl + 'scheduling.main/templates/scheduling-main-lookup-lineitems-dialog.html';
			dlgOptions.controller = 'schedulingMainLookupLineItemsDialogController';
			dlgOptions.backdrop = false;
			dlgOptions.height = '75%';
			dlgOptions.width = '75%';
			dlgOptions.resizeable = true;

			platformModalService.showDialog(dlgOptions).then(function (result) {
				if (result.isOK) {
					if (config.handleOK) {
						config.handleOK(result);
					}
				}
				else {
					if (config.handleCancel) {
						config.handleCancel(result);
					}
				}
			});
		};

		service.recalculate = function () {
			if (usedConfig.recalculate) {
				usedConfig.recalculate();
			}
		};
		return service;
	}
})(angular);
