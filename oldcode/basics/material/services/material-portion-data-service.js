(function () {
	'use strict';
	/* global angular, globals, _ */
	let moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialPortionDataService', [
		'platformDataServiceFactory',
		'basicsMaterialRecordService',
		'basicsCommonMandatoryProcessor',
		'PlatformMessenger',
		'$injector',
		'platformModalService',
		'$http',
		'basicsCommonReadOnlyProcessor',
		'basicsMaterialCalculationHelper',
		function (
			dataServiceFactory,
			parentService,
			mandatoryProcessor,
			PlatformMessenger,
			$injector,
			platformModalService,
			$http,
			basicsCommonReadOnlyProcessor,
			basicsMaterialCalculationHelper
		) {
			let serviceContainer = null;

			let serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					httpCreate: {route: globals.webApiBaseUrl + 'basics/material/portion/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/material/portion/'
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								return serviceContainer.data.handleReadSucceeded(readData, data);
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'MaterialPortion',
							parentService: parentService
						}
					},
					dataProcessor: [{processItem: readonlyProcessItem}],
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return !parentService.isReadonlyMaterial();
						},
						canDeleteCallBackFunc: function () {
							return !parentService.isReadonlyMaterial();
						}
					}
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

			let onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (newData, data){
				if (newData && newData.CostPerUnit === -1){
					newData.CostPerUnit = 0;
				}
				return onCreateSucceeded(newData, data);
			};

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'MaterialPortionDto',
				moduleSubModule: 'Basics.Material',
				validationService: 'basicsMaterialPortionValidationService',
				mustValidateFields: ['Code']
			});

			let deleteEntities = serviceContainer.service.deleteEntities;
			serviceContainer.service.deleteEntities = deleteEntitiesFunc;

			function deleteEntitiesFunc(entities) {
				let errorMsg = 'basics.material.cannotDeleteMaterialPortions';
				let ids= _.map(entities,'Id');
				let postParam ={
					MasterMaterialPortionIds :ids
				};
				$http.post(globals.webApiBaseUrl + 'project/materialPortion/canDeleteMaterialPortion', postParam).then(function (response) {
					if(response && response.data){
						platformModalService.showErrorBox(errorMsg,  'cloud.common.errorMessage');
						return;
					}
					deleteEntities(entities);
				}
				);
			}

			let originalOnDeleteDone = serviceContainer.data.onDeleteDone;
			serviceContainer.data.onDeleteDone = function(deleteParams, data, response){

				let entities = angular.copy(deleteParams.entities);

				originalOnDeleteDone(deleteParams, data, response);

				let isEstimatePrices =  _.filter(entities,{'IsEstimatePrice':true});
				let isDayWorkRates =  _.filter(entities,{'IsDayworkRate':true});

				if(isEstimatePrices.length && !isDayWorkRates.length){
					serviceContainer.service.fieldChanged('IsEstimatePrice');
				}else if(!isEstimatePrices.length && isDayWorkRates.length) {
					serviceContainer.service.fieldChanged('IsDayworkRate');
				}else if(isEstimatePrices.length && isDayWorkRates.length){
					serviceContainer.service.fieldChanged('all');
				}

			};

			let roundType=basicsMaterialCalculationHelper.roundingType;
			serviceContainer.service.getEstimatePrice = function getEstimatePrice() {
				let list = serviceContainer.service.getList();
				let list4IsEstimatePrice = _.filter(list,{'IsEstimatePrice':true});
				let result = 0;
				_.forEach(list4IsEstimatePrice,function (d) {
					result = result +(basicsMaterialCalculationHelper.round(roundType.EstimatePrice,(d.Quantity*d.CostPerUnit))+d.PriceExtra);
				});
				return result;
			};

			serviceContainer.service.getDayWorkRate = function getDayWorkRate() {
				let list = serviceContainer.service.getList();
				let list4IsDayWorkRate = _.filter(list,{'IsDayworkRate':true});
				let result = 0;
				_.forEach(list4IsDayWorkRate,function (d) {
					result = result +(basicsMaterialCalculationHelper.round(roundType.DayWorkRate,d.Quantity*d.CostPerUnit)+d.PriceExtra);
				});
				return result;
			};


			serviceContainer.service.getPriceExtraDWRate = function getPriceExtraDWRate() {
				let list = serviceContainer.service.getList();
				let list2 = _.filter(list,{'IsDayworkRate':true});
				let result = 0;
				_.forEach(list2,function (d) {
					result = result + d.PriceExtra;
				});
				return result;
			};

			serviceContainer.service.getPriceExtraEstPrice = function getPriceExtraEstPrice() {
				let list = serviceContainer.service.getList();
				let list2 = _.filter(list,{'IsEstimatePrice':true});
				let result = 0;
				_.forEach(list2,function (d) {
					result = result + d.PriceExtra;
				});
				return result;
			};

			serviceContainer.service.fieldChanged = function fieldChanged(field,currentItem) {
				let basicsMaterialPriceConditionDataServiceNew =  $injector.get('basicsMaterialPriceConditionDataServiceNew');
				let selectedMaterial = parentService.getSelected();
				let loadedData ={
					ErrorMessages :[],
					ExchangeRate: 0,
					HeaderId: 0,
					HeaderName: null,
					IsSuccess: true,
					PriceConditions: basicsMaterialPriceConditionDataServiceNew.getList()
				};

				if(field ==='all'){
					basicsMaterialPriceConditionDataServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,field);
				}else if(field ==='CostPerUnit' || field ==='MdcCostCodeFk' ||  field ==='Quantity'){
					if(currentItem.IsEstimatePrice && !currentItem.IsDayworkRate){
						basicsMaterialPriceConditionDataServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,'IsEstimatePrice');
					}else if(!currentItem.IsEstimatePrice && currentItem.IsDayworkRate) {
						basicsMaterialPriceConditionDataServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk,'IsDayworkRate');
					} if(currentItem.IsEstimatePrice && currentItem.IsDayworkRate){
						basicsMaterialPriceConditionDataServiceNew.handleRecalcuateDone(selectedMaterial,loadedData, selectedMaterial.PrcPriceConditionFk);
					}
				}else {
					basicsMaterialPriceConditionDataServiceNew.handleRecalcuateDone(selectedMaterial, loadedData, selectedMaterial.PrcPriceConditionFk, field);
				}
			};

			var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
				uiStandardService: 'basicsMaterialPortionStandardConfigurationService',
				readOnlyFields: []
			});
			function readonlyProcessItem(item) {
				if (!item) {
					return;
				}
				if (parentService.isReadonlyMaterial()) {
					readonlyProcessorService.setRowReadonlyFromLayout(item, true);
				}
			}

			return serviceContainer.service;
		}]);
})();