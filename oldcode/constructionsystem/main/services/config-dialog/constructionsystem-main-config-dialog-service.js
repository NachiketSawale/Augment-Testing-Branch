(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* globals angular, globals,_ */
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainConfigDialogService',[
		'PlatformMessenger','platformUtilService','$translate','$templateCache',
		'platformModalService','$q','$injector','$http','estimateMainDialogProcessService',// TODO:Remove if alternative needed
		function (PlatformMessenger,platformUtilService,$translate,$templateCache,
			platformModalService,$q,$injector,$http,estimateMainDialogProcessService) {

			var currentItem = {},
				completeData = {},
				currentObject = {},
				isCurrentItemChangeFire = false,
				loadCompleteDataPromise = null,
				// eslint-disable-next-line no-unused-vars
				estHeaderItem = {},
				currentContext = null;

			var service = {
				onCurrentItemChange : new  PlatformMessenger(),
				onEstStructureConfigDetailChange : new PlatformMessenger(),
				onDataLoaded : new PlatformMessenger()
			};

			// eslint-disable-next-line no-unused-vars
			var loadHeaderData = function loadHeaderData(){
				return $injector.get('constructionSystemMainHeaderService').getAllData();

			};


			var loadCompleteData = function loadCompleteData(){
				if(loadCompleteDataPromise === null){
					loadCompleteDataPromise = $http.get(globals.webApiBaseUrl + 'estimate/main/completeconfig/list?estHeaderId='+currentItem.EstHeaderId);
				}
				return loadCompleteDataPromise.then(function(response){
					completeData = response.data;
					loadCompleteDataPromise = null;
					return currentItem;
				});
			};
			// eslint-disable-next-line no-unused-vars
			var loadCustomizationCompleteData = function loadCustomizationCompleteData(config){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/completeconfig/getbyconfigid?configId='+config.configFk+'&configTypeId='+config.configTypeId + '&contextId=' + config.contextId).then(function(response){
					completeData = response.data;
					return response.data;
				});
			};

			// eslint-disable-next-line no-unused-vars
			var getEstHeaderbyId = function getEstHeaderbyId(config){
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
				var qDefer = $q.defer();
				qDefer.resolve(currentObject);
				return qDefer.promise;
			};

			service.showDialog = function showDialog(config) {
				// load template first, then open dialog
				platformUtilService.loadTemplates(['constructionsystem.main/templates/constructionsystem-main-config-dialog-templates.html']).then(function () {
					config = estimateMainDialogProcessService.setDialogConfig(config);

					config.editType = 'estimate';

					var modalOptionsSelectRecord = {
						headerTextKey: $translate.instant('constructionsystem.main.column.title'),
						bodyTextKey: $translate.instant('constructionsystem.main.inheritCosInstance.selectInstanceHint'),
						iconClass: 'ico-warning'
					};

					var modalOptionsEstConfigType = {
						// templateUrl: globals.appBaseUrl + moduleName + '/templates/column-config/estimate-main-column-config-dialog-modal.html',
						template : $templateCache.get('constructionsystem-main-column-config-dialog-modal.html'),
						controller: 'constructionsystemMainColumnConfigController',
						width: '900px',
						height: '750px',
						resizeable: true
					};



					function showConfigDialog(dialogOptions){
						platformModalService.showDialog(dialogOptions);
						var qDefer = $q.defer();
						qDefer.resolve(dialogOptions);
						return qDefer.promise;
					}

					// eslint-disable-next-line no-unused-vars
					var loadCustomizationCompleteData = function loadCustomizationCompleteData(config){
						return $http.get(globals.webApiBaseUrl + 'estimate/main/completeconfig/getbyconfigid?configId='+config.configFk+'&configTypeId='+config.configTypeId + '&contextId=' + config.contextId).then(function(response){
							completeData = response.data;
							return response.data;
						});
					};

					// eslint-disable-next-line no-unused-vars
					var getEstHeaderbyId = function getEstHeaderbyId(config){
						return $http.get(globals.webApiBaseUrl + 'estimate/main/header/getitembyid?headerId='+config.headerId).then(function(response){
							estHeaderItem = response.data;
							return response.data;
						});
					};

					function loadCurrentItem(headerItem) {
						currentItem.EstHeaderId = headerItem.Id;

						loadCompleteData().then(function () {
							service.setCurrentObject(completeData);
							showConfigDialog(modalOptionsEstConfigType);
						});
					}

					function loadConfigDialog(config){
						if(config ) {
							var constructionSystemMainInstanceService = $injector.get('constructionSystemMainInstanceService');
							var selected = constructionSystemMainInstanceService.getSelected();
							if (selected && selected.Id) {
								loadCurrentItem(selected);

							} else {
								showConfigDialog(modalOptionsSelectRecord);
							}
						}
					}

					loadConfigDialog(config);
				});
			};


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
		}]);
})(angular);
