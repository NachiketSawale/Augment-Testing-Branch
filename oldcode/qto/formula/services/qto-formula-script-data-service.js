/**
 * Created by wui on 12/21/2015.
 */

(function (angular) {
	'use strict';
	/* globals globals, _ */

	let moduleName = 'qto.formula';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('qtoFormulaScriptDataService', ['platformDataServiceFactory',
		'$http',
		'qtoFormulaDataService',
		'PlatformMessenger',
		'qtoFormulaRubricCategoryDataService',
		function (platformDataServiceFactory,
			$http,
			qtoFormulaDataService,
			PlatformMessenger,
			qtoFormulaRubricCategoryDataService) {

			let serviceOption = {
				flatNodeItem: {
					serviceName: 'qtoFormulaScriptDataService',
					module: moduleName,
					entityRole: {
						leaf: {
							itemName: 'qtoFormulaScript',
							parentService: qtoFormulaRubricCategoryDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = serviceContainer.service;
			// var data = serviceContainer.data;

			var currentScriptItems = [];
			var initialScriptItems = [];

			service.mainItem = null;
			service.readonly = 'nocursor';
			service.currentItem = {
				ScriptData: '',
				ValidateScriptData: ''
			};

			service.mergeInUpdateData = function  doMergeInCustomizeTypeUpdateData(updateData) {
				if(updateData.QtoFormulaScriptToSave){
					angular.forEach(updateData.QtoFormulaScriptToSave, function(item){

						var temp1 = _.find(currentScriptItems, {Id:item.Id});
						if(temp1){
							currentScriptItems.splice(currentScriptItems.indexOf(temp1),1);
							currentScriptItems.push(item);
						}
						var temp2 = _.find(initialScriptItems, {Id:item.Id});
						if(temp2){
							initialScriptItems.splice(initialScriptItems.indexOf(temp2),1);
							initialScriptItems.push({
								Id:item.Id,
								QtoFormulaFk: item.QtoFormulaFk,
								ValidateScriptData: item.ValidateScriptData
							});
						}
					});
				}
			};

			service.provideUpdateData = function (updateData) {
				updateData.QtoFormulaScriptToSave = [];
				_.forEach(currentScriptItems, function (currentScriptItem) {

					if(currentScriptItem.Id === service.currentItem.Id && currentScriptItem.ValidateScriptData !== service.currentItem.ValidateScriptData){
						currentScriptItem.ValidateScriptData = service.currentItem.ValidateScriptData;
					}

					var initialScriptItem = _.find(initialScriptItems, {Id:currentScriptItem.Id});
					if (currentScriptItem.Id === initialScriptItem.Id && initialScriptItem.ValidateScriptData !== currentScriptItem.ValidateScriptData) {
						initialScriptItem.ValidateScriptData = currentScriptItem.ValidateScriptData;
						updateData.QtoFormulaScriptToSave.push(currentScriptItem);
						updateData.EntitiesCount += 1;
					}
				});
				return updateData;
			};

			service.doHttpListOrCreate = function (mainItemId) {
				return $http.post(globals.webApiBaseUrl + 'qto/formula/script/listorcreate', {
					mainItemId: mainItemId
				});
			};

			service.clear = function () {
				service.currentItem = {
					ScriptData: '',
					ValidateScriptData: ''
				};
				service.readonly = 'nocursor';
				currentScriptItems = [];
				initialScriptItems = [];
			};

			service.load = function () {
				service.mainItem = qtoFormulaDataService.getSelected();
				if (service.mainItem ) {
					service.readonly = false;
					service.currentItem = _.find(currentScriptItems, {QtoFormulaFk: qtoFormulaDataService.getSelected().Id});
					if (!service.currentItem) {
						return service.doHttpListOrCreate(service.mainItem.Id, service.mainItem.Version === 0).then(function (response) {
							service.currentItem = response.data;
							currentScriptItems.push(service.currentItem);
							initialScriptItems.push({
								Id: service.currentItem.Id,
								QtoFormulaFk: service.currentItem.QtoFormulaFk,
								ValidateScriptData: service.currentItem.ValidateScriptData
							});

							if(service.mainItem.Version === 0){
								service.currentItem.ValidateScriptData = 'validator.check("result", result !== "", "The result should not be empty"); \n';
								service.currentItem.ValidateScriptData += 'validator.check("result", result !== 0, "The result should not be 0"); ';
							}
						});
					}
					else {
						_.forEach(currentScriptItems, function (currentScriptItem) {
							if (currentScriptItem.Id === service.currentItem.Id) {
								currentScriptItem.ValidateScriptData = service.currentItem.ValidateScriptData;
							}
						});
					}
				}else{
					service.clear();
				}
			};
			return service;
		}
	]);

})(angular);