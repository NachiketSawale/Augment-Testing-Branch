
(function (angular) {
	/* global globals, _  */
	'use strict';
	let moduleName ='estimate.main';
	let materialModule = angular.module(moduleName);

	materialModule.factory('estimateMainMaterialPortionService', ['$http', '$q', '$log', '$injector', 'platformDataServiceFactory','platformRuntimeDataService','platformModuleStateService',

		function ($http, $q, $log, $injector, platformDataServiceFactory,runtimeDataService,platformModuleStateService) {

			let resourceDataService = $injector.get('estimateMainResourceService');
			let entity = resourceDataService.getSelected();
			let dataOpt = {
				entity:entity,
				onlyShowSelected:true,
				uuid:'e2661f71d1e24b07958b84ad026023d9'
			};

			let parentService = $injector.get('estimateMainCostUnitDataService').getDataService(dataOpt);

			let info = {
				flatLeafItem: {
					module: materialModule,
					serviceName: 'projectMaterialPortionMainService',
					entityNameTranslationID: 'project.main.materialPortion',
					httpRead: {
						route: globals.webApiBaseUrl + 'project/materialPortion/',
						endRead: 'listByMaterialParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							readData.MaterialId =  service.getMaterialId();
							readData.ProjectId = parentService &&  parentService.getSelected() ? parentService.getSelected().ProjectFk:-1;
						}},
					actions: {delete: true},
					entityRole: {
						leaf: {
							itemName: 'estimateMainMaterialPortion',
							parentService: parentService
						}
					},
					entitySelection: {},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								console.log(readItems.timeStr);
								return data.handleReadSucceeded(readItems.dtos, data);
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(info);
			serviceContainer.data.usesCache = false;
			serviceContainer.data.doUpdate = null;

			let service = serviceContainer.service;
			let materialId = 0;
			let material = null;

			service.getParentSelected = function getParentSelected() {
				return material;
			};
			service.setParentSelected = function setParentSelected (value) {
				material = value;
			};

			service.setParentService = function setParentService(value){
				parentService = value;
			};


			service.getParentService = function getParentService() {
				return parentService;
			};

			service.getMaterialPortion2Save = function getMaterialPortion2Save() {
				let modState = platformModuleStateService.state(service.getModule());
				let updateData = angular.copy(modState.modifications);
				let materialPortion2Save = [];
				if(updateData && updateData.estimateMainMaterialPortionToSave && updateData.estimateMainMaterialPortionToSave.length){
					materialPortion2Save =  updateData.estimateMainMaterialPortionToSave;
				}
				return  materialPortion2Save;
			};

			service.getMaterialId = function getMaterialId(){
				return materialId;
			};

			service.setMaterialId = function setMaterialId(value){
				materialId = value;
			};

			service.getEstimatePrice = function getEstimatePrice() {
				let list = serviceContainer.service.getList();
				let list4IsEstimatePrice = _.filter(list,{'IsEstimatePrice':true});
				let result = 0;
				_.forEach(list4IsEstimatePrice,function (d) {
					result = result +(d.Quantity*d.CostPerUnit+d.PriceExtra);
				});
				return result;
			};

			service.getDayWorkRate = function getDayWorkRate() {
				let list = serviceContainer.service.getList();
				let list4IsDayWorkRate = _.filter(list,{'IsDayWorkRate':true});
				let result = 0;
				_.forEach(list4IsDayWorkRate,function (d) {
					result = result +(d.Quantity*d.CostPerUnit+d.PriceExtra);
				});
				return result;
			};


			service.fieldChanged = function fieldChanged(field,currentItem) {
				// service.markItemAsModified (currentItem);
				let projectMaterialPriceConditionServiceNew =  $injector.get('projectMaterialPriceConditionServiceNew');
				let selectedMaterial = service.getParentSelected();
				let loadedData ={
					ErrorMessages :[],
					ExchangeRate: 0,
					HeaderId: 0,
					HeaderName: null,
					IsSuccess: true,
					PriceConditions:[]
				};

				if(field ==='all'){
					projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,null,'estimate');
				}else if(field ==='CostPerUnit' || field ==='Project2MdcCostCodeFk' ||  field ==='Quantity'){
					if(currentItem.IsEstimatePrice && !currentItem.IsDayWorkRate){
						projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,'IsEstimatePrice','estimate');
					}else if(!currentItem.IsEstimatePrice && currentItem.IsDayWorkRate) {
						projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,'IsDayWorkRate','estimate');
					} if(currentItem.IsEstimatePrice && currentItem.IsDayWorkRate){
						projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,null,'estimate');
					}
				}else {
					projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial, loadedData, selectedMaterial.PrcPriceConditionFk, field,'estimate');
				}
				parentService.gridRefresh();
			};
			return service;

		}]);
})(angular);
