/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainDialogDataService
	 * @function
	 *
	 * @description
	 * estimateMainDialogDataService is the data service for  Complete Estimate configuration functions.
	 */
	angular.module(moduleName).factory('estimateMainDialogDataService', ['$q', '$injector', '$http', '$translate', '$templateCache', 'platformUtilService', 'PlatformMessenger', 'platformModalService','estimateMainDialogProcessService',
		function ($q, $injector, $http, $translate, $templateCache, platformUtilService, PlatformMessenger, platformModalService, estimateMainDialogProcessService ) {

			let currentItem = {},
				completeData = {},
				currentObject = {},
				isCurrentItemChangeFire = false,
				loadCompleteDataPromise = null,
				estHeaderItem = {},
				currentContext = null;

			let service = {
				onCurrentItemChange : new  PlatformMessenger(),
				onEstStructureConfigDetailChange : new PlatformMessenger(),
				onDataLoaded : new PlatformMessenger()
			};

			let loadHeaderData = function loadHeaderData(){
				let selectedHeaderId = $injector.get('estimateMainService').getSelectedEstHeaderId();
				return $http.get(globals.webApiBaseUrl + 'estimate/main/header/getitembyid?headerId='+selectedHeaderId).then(function(response){
					return response.data;
				});
			};

			let loadCompleteData = function loadCompleteData(){
				if(loadCompleteDataPromise === null){
					loadCompleteDataPromise = $http.get(globals.webApiBaseUrl + 'estimate/main/completeconfig/list?estHeaderId='+currentItem.EstHeaderId);
				}
				return loadCompleteDataPromise.then(function(response){
					completeData = response.data;
					loadCompleteDataPromise = null;
					return currentItem;
				});
			};

			let loadCustomizationCompleteData = function loadCustomizationCompleteData(config){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/completeconfig/getbyconfigid?configId='+config.configFk+'&configTypeId='+config.configTypeId + '&contextId=' + config.contextId).then(function(response){
					completeData = response.data;
					return response.data;
				});
			};

			let getEstHeaderbyId = function getEstHeaderbyId(config){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/header/getitembyid?headerId='+config.headerId).then(function(response){
					estHeaderItem = response.data;
					return response.data;
				});
			};

			service.getCurrentItem = function (){
				return currentItem;
			};

			service.setCurrentItem = function (item){
				currentItem = item;
			};

			service.getCurrentObject = function (){
				return currentObject;
			};

			service.setCurrentObject = function (item){
				service.currentItemChangeFire();
				currentObject = item;
				let qDefer = $q.defer();
				qDefer.resolve(currentObject);
				return qDefer.promise;
			};

			service.showDialog = function showDialog(config) {
				// load template first, then open dialog
				platformUtilService.loadTemplates(['estimate.main/templates/config-dialog/estimate-main-config-dialog-templates.html']).then(function () {
					config = estimateMainDialogProcessService.setDialogConfig(config);

					let modalOptionsSelectRecord = {
						headerTextKey: $translate.instant('estimate.main.estConfigDialogTitle'),
						bodyTextKey: $translate.instant('estimate.main.estConfigDialogLoadEstimate'),
						iconClass: 'ico-warning'
					};

					let modalOptionsEstConfigType = {
						// templateUrl: globals.appBaseUrl + moduleName + '/templates/column-config/estimate-main-column-config-dialog-modal.html',
						template : $templateCache.get('estimate-main-column-config-dialog-modal.html'),
						controller: 'estimateMainDialogController',
						width: '950px',
						height: '750px',
						resizeable: true
					};

					function showConfigDialog(dialogOptions){
						platformModalService.showDialog(dialogOptions);
						let qDefer = $q.defer();
						qDefer.resolve(dialogOptions);
						return qDefer.promise;
					}

					function loadCurrentItem(headerItem) {
						currentItem.EstHeaderId = headerItem.Id;

						loadCompleteData().then(function () {
							service.setCurrentObject(completeData);
							showConfigDialog(modalOptionsEstConfigType);
						});
					}

					if(config && config.editType === 'estimate') {
						let estimateMainService = $injector.get('estimateMainService');
						if (estimateMainService.getSelectedEstHeaderId() > 0) {
							let headerItem = estimateMainService.getSelectedEstHeaderItem();
							// headerItem = {Id: 19};
							if (headerItem && headerItem.Id) {
								loadCurrentItem(headerItem);
							} else {
								loadHeaderData().then(function (headerItem) {
									loadCurrentItem(headerItem);
								});
							}
						} else {
							showConfigDialog(modalOptionsSelectRecord);
						}
					}
					else if(config && config.editType ==='assemblies'){
						getEstHeaderbyId(config).then(function(){
							if(angular.isDefined(estHeaderItem)){
								if (estHeaderItem && estHeaderItem.Id) {
									loadCurrentItem(estHeaderItem);
								} else {
									loadHeaderData().then(function (estHeaderItem) {
										loadCurrentItem(estHeaderItem);
									});
								}
							}
							else {
								showConfigDialog(modalOptionsSelectRecord);
							}
						});
					}
					else if(config && config.editType ==='customizeforall'){
						loadCustomizationCompleteData(config).then(function () {
							completeData.editType = config.editType;
							service.setCurrentObject(completeData);
							showConfigDialog(modalOptionsEstConfigType);
						});
					}
					else if(config && config.editType === 'estBoqUppConfig'){
						let estimateMainService = $injector.get('estimateMainService');
						if (estimateMainService.getSelectedEstHeaderId() > 0) {
							showConfigDialog(modalOptionsEstConfigType).then(function (){
								service.setCurrentObject(config);
							});
						} else {
							let noEstimateForUrpConfig = {
								headerTextKey: $translate.instant('estimate.main.estConfigEstBoqUppTitle'),
								bodyTextKey: $translate.instant('estimate.main.columnConfigurationDialogSelectEstimate'),
								iconClass: 'ico-warning'
							};
							showConfigDialog(noEstimateForUrpConfig);
						}
					}
					else {
						showConfigDialog(modalOptionsEstConfigType).then(function() {
							service.setCurrentObject(config);
						});
					}
				});
			};

			service.update = function update(updateData){
				updateData.EstHeaderId = currentItem.EstHeaderId || updateData.EstHeaderId;
				return $http.post(globals.webApiBaseUrl + 'estimate/main/completeconfig/update', updateData).then(function(response){
					return angular.extend(completeData, response.data);
				});
			};

			// by Tom.
			// todo: get the initial column config id for the first time.
			// can't get this data from estimateMainEstColumnConfigDataService.onItemChange event when the dialog is first loaded
			// try to improve this later if necessary
			service.getCompleteInitData = function() {
				return completeData;
			};

			service.currentItemChangeFire = function(){
				if(!isCurrentItemChangeFire && !(_.isEmpty(currentObject))) {
					service.onCurrentItemChange.fire(currentObject);
					isCurrentItemChangeFire = true;
				}
			};

			service.getUsageContext = function getUsageContext(){
				return currentContext;
			};

			service.setUsageContext = function setUsageContext(context){
				currentContext = context;
			};

			service.cleardata = function() {
				currentItem = {};
				completeData = {};
				currentObject = {};
				isCurrentItemChangeFire = false;
				currentContext = null;
			};

			return service;
		}
	]);
})();
