
(function (angular) {
	/* global _ globals */
	'use strict';
	let moduleName = 'project.material';
	let projectMaterialModule = angular.module(moduleName);

	projectMaterialModule.factory('projectMaterialPortionMainService', ['$http', '$q', '$log', '$injector', 'projectMaterialMainService', 'platformDataServiceFactory',

		function ($http, $q, $log, $injector, projectMaterialMainService, platformDataServiceFactory) {

			let info = {
				flatLeafItem: {
					module: projectMaterialModule,
					serviceName: 'projectMaterialPortionMainService',
					entityNameTranslationID: 'project.main.materialPortion',
					httpRead: {
						route: globals.webApiBaseUrl + 'project/materialPortion/',
						endRead: 'listByMaterialParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selectedItem = projectMaterialMainService.getSelected();
							if(selectedItem){
								if(selectedItem.LgmJobFk){
									$injector.get('projectCostCodeLookupDataService').setJobId(selectedItem.LgmJobFk);
								}
								$injector.get('projectCostCodeLookupDataService').setProjectId(selectedItem.ProjectFk);
							}
							readData.MaterialId = selectedItem ? selectedItem.Id:0;
							readData.ProjectId = selectedItem ? selectedItem.ProjectFk:-1;
						}},
					actions: {delete: true},
					entityRole: {
						leaf: {
							itemName: 'PrjMaterialPortion',
							parentService: projectMaterialMainService,
							parentFilter: 'projectId'
						}
					},
					entitySelection: {},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								console.log(readData.timeStr);
								return serviceContainer.data.handleReadSucceeded(readData.dtos, data);
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(info);
			serviceContainer.data.usesCache = false;

			let service = serviceContainer.service;

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
				let projectMaterialPriceConditionServiceNew =  $injector.get('projectMaterialPriceConditionServiceNew');
				let selectedMaterial = projectMaterialMainService.getSelected();
				let loadedData ={
					ErrorMessages :[],
					ExchangeRate: 0,
					HeaderId: 0,
					HeaderName: null,
					IsSuccess: true,
					PriceConditions: projectMaterialPriceConditionServiceNew.getList()
				};

				if(field ==='all'){
					projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk);
				}else if(field ==='CostPerUnit' || field ==='CostCode' ||  field ==='Quantity'){
					if(currentItem.IsEstimatePrice && !currentItem.IsDayWorkRate){
						projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,'IsEstimatePrice');
					}else if(!currentItem.IsEstimatePrice && currentItem.IsDayWorkRate) {
						projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,'IsDayWorkRate');
					} if(currentItem.IsEstimatePrice && currentItem.IsDayWorkRate){
						projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk);
					}
				}else {
					projectMaterialPriceConditionServiceNew.handleRecalcuateDone(selectedMaterial, loadedData, selectedMaterial.PrcPriceConditionFk, field);
				}
			};
			return service;

		}]);
})(angular);
