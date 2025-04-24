(function (angular) {
	/*global angular,globals*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).service('basicsRiskRegisterImpactService', [
		'PlatformMessenger', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension',
		'basicsRiskRegisterDataService','basicsLookupdataLookupDescriptorService',
		'$injector',

		function (PlatformMessenger, platformDataServiceFactory, ServiceDataProcessArraysExtension,
		          basicsRiskRegisterDataService,basicsLookupdataLookupDescriptorService,
		          $injector) {

			var impactModel = {};

			var serviceOptions = {
				flatNodeItem:{
					module: angular.module(moduleName),
					serviceName: 'basicsRiskRegisterImpactService',
					httpRead:{
						route: globals.webApiBaseUrl + 'basics/riskregister/impact/',
						endRead: 'getImpact',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsRiskRegisterDataService.getSelected();
							var selectedId;
							if(selected){
								selectedId = selected.Id;
							}
							angular.extend(readData, {
								eventId: selectedId || -1
							});
						}
					},
					entitySelection: {},
					presenter:{
						list:{
							incorporateDataRead: function (readData,data) {
								if(readData.dto) {

									basicsLookupdataLookupDescriptorService.updateData('RiskImpact', readData.dto);
									setImpactModel(readData.dto);
									serviceContainer.data.handleReadSucceeded(readData, data);
									service.setSelected(readData.dto);
								}

							}
						}
					},
					entityRole:{
						node:{
							codeField:'Id',
							itemName:'RiskImpact',
							moduleName:' Impact',
							parentService: basicsRiskRegisterDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			//Do not download data when container is not displayed
			serviceContainer.data.doesRequireLoadAlways = false;

			var service = serviceContainer.service;

			service.toolHasAdded = false;

			service.refreshData = new PlatformMessenger();

			service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			function setImpactModel(model) {
				impactModel = model;
			}

			service.getImpactModel = function getImpactModel() {

				var selected = basicsRiskRegisterDataService.getSelected();
				if(!selected){
					return;
				}
				if(selected.Id === impactModel.RiskEventFk){
					return impactModel;
				}

			};
			service.getModelFromParent = function getModelFromParent(){
				var selected = basicsRiskRegisterDataService.getSelected();
				if(selected && selected.hasOwnProperty('RiskRegisterImpactEntities')){
					if(selected.RiskRegisterImpactEntities !== null && selected.RiskRegisterImpactEntities.length > 0 ){
						return selected.RiskRegisterImpactEntities[0];
					}

				}
			};
			service.getImpactForWizard = function getImpactForWizard(){

				return impactModel;


			};


			serviceContainer.data.provideUpdateData = function (updateData) {
				$injector.get('basicsRiskRegisterDependencyUpdateService').updateDepenToSave(updateData);
				return updateData;
			};

			return service;
		}
	]);
})(angular);
