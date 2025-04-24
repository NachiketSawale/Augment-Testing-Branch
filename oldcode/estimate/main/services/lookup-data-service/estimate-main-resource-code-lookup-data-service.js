(function (angular) {
	'use strict';
	angular.module('estimate.main').factory('EstimateMainResourceCodeLookupDataService', [
		'_',
		'$q',
		'$injector',
		'$translate',
		'cloudCommonGridService',
		'estimateMainResourceType',
		'estimateMainCommonService',
		'estimateMainCostCodesLookupDataService',
		'estimateMainMaterialFastInputDataService',
		'estimateMainPlantAssemblyFastInputDataService',
		'estimateMainAssemblyTemplateService',
		'estimateMainPlantAssemblyDialogService',
		function (_, $q, $injector,$translate, cloudCommonGridService, estimateMainResourceType, estimateMainCommonService, estimateMainCostCodesLookupDataService, estimateMainMaterialFastInputDataService,
			estimateMainPlantAssemblyFastInputDataService, estimateMainAssemblyTemplateService, estimateMainPlantAssemblyDialogService) {
			const service = {};

			function getStringBeforeOrAfterHash(value, before,isPlant) {
				const hashIndex = value.indexOf('#');
				if (hashIndex === -1) {
					return isPlant ? "IsPlantFastCode" : value;
				}
				return before ? value.substring(0, hashIndex) : value.substring(hashIndex + 1);
			}

			service.resolveStringValueCallback = function (formatterOptions) {
				return function (value, options, item, column) {
					// if lookup is selected from dialog, return the value as it is
					if(estimateMainCommonService.isLookupSelected()){
						return {
							apply: true,
							valid: true,
							value: value,
						};
					}
					switch (item.EstResourceTypeFk) {
						case estimateMainResourceType.CostCode:{
							return estimateMainCostCodesLookupDataService.getSearchList(value, 'Code', item, true).then(function (returnValues) {
								if (value && returnValues && returnValues.length) {
									let output = [];
									cloudCommonGridService.flatten(returnValues, output, 'CostCodes');
									const result = output.filter(function (costCode) {
										return costCode.Code.toUpperCase() === value.toUpperCase();
									});
									let assemblyEntity =$injector.get('estimateAssembliesService').getSelected();
									if (result && result.length > 0 && assemblyEntity && assemblyEntity.TransferMdcCostCodeFk) {
										if(assemblyEntity.TransferMdcCostCodeFk === result[0].Id){
											return createError(value,$translate.instant('estimate.main.assemblyResourceCostCodeValidateTransfer'));
										}
									}
									if(result && result.length){
										estimateMainCostCodesLookupDataService.selectedItemChanged(angular.copy(result[0]));
										return createFound(result[0].Code);
									}
								}
								return createNotFound(value);
							});
						}
						case estimateMainResourceType.Material:{
							return estimateMainMaterialFastInputDataService.getSearchList(value, 'Code', item, column).then(function (returnValues) {
								let assemblyEntity =$injector.get('estimateAssembliesService').getSelected();
								if (returnValues && returnValues.length > 0 && assemblyEntity && assemblyEntity.TransferMdcMaterialFk) {
									if(assemblyEntity.TransferMdcMaterialFk === returnValues[0].Id){
										return createError(value,$translate.instant('estimate.main.assemblyResourceMaterialValidateTransfer'));
									}
								}
								if (returnValues && returnValues.length) {
									return createFound(returnValues[0].Code);
								}
								return createNotFound(value);
							});
						}
						case estimateMainResourceType.Plant:{
							const options = column && column.editorOptions ? column.editorOptions.lookupOptions :{
								usageContext:'estimateMainService'
							};
							options.splitSearchString = true;
							let currentModuleName =  $injector.get('mainViewService').getCurrentModuleName();
							if (currentModuleName === 'estimate.main' || currentModuleName === 'project.main'){
								$injector.get('estimateMainPlantAssemblyDialogService').setOptions(options);
							}
							return estimateMainPlantAssemblyFastInputDataService.getSearchList(value, options, item, column).then(function(returnValues){
								if (returnValues && returnValues.length > 0){
									const code = getStringBeforeOrAfterHash(value, false, true);
									if(code === 'IsPlantFastCode'){
										setAssemblyLookupItem(returnValues[0], item, options);
										return createFound(returnValues[0].Code);
									}else{
										const result = returnValues.length === 1 ? returnValues : returnValues.filter(function (assemblyItem) {
											return assemblyItem.Code === code;
										});
										if(result && result.length){
											setAssemblyLookupItem(result[0], item, options);
										}
										return createFound(result[0].Code);
									}
								}
								return createNotFound(value);
							});
						}
						case estimateMainResourceType.Assembly:{
							const options = column && column.editorOptions ? column.editorOptions.lookupOptions :{
								usageContext:'estimateMainService'
							};
							options.splitSearchString = true;
							return estimateMainAssemblyTemplateService.getSearchList(value, 'Code', item, null, false, options).then(function(returnValues){
								if (returnValues && returnValues.length > 0){
									const code = getStringBeforeOrAfterHash(value, false);
									const result = returnValues.length === 1 ? returnValues : returnValues.filter(function (assemblyItem) {
										return assemblyItem.Code === code;
									});
									let assemblyEntity = $injector.get('estimateAssembliesService').getSelected();
									let transferAssemblyIds = estimateMainAssemblyTemplateService.transferAssemblyIds;
									if(assemblyEntity && (assemblyEntity.TransferMdcCostCodeFk || assemblyEntity.TransferMdcMaterialFk)){
										if(transferAssemblyIds && transferAssemblyIds.length > 0 && result && result.length > 0){
											if(transferAssemblyIds.indexOf(result[0].Id) !== -1){
												return createError(value,$translate.instant('estimate.main.assemblyResourceAssemblyValidateTransfer'));
											}
										}
									}
									if(result && result.length){
										setAssemblyLookupItem(result[0], item, options);
									}
									return createFound(result[0].Code);
								}
								return createNotFound(value);
							});
						}
						default:{
							return {
								apply: true,
								valid: true,
								value: value,
							};
						}
					}
				};
			};

			function setAssemblyLookupItem(selectedItem, entity, lookupOptions){
				if(selectedItem){
					entity.EstHeaderAssemblyFk = selectedItem.EstHeaderFk;
					let usageContextService = lookupOptions.usageContext ? $injector.get(lookupOptions.usageContext) : null;
					if(usageContextService && angular.isFunction(usageContextService.setSelectedAssemblyLookupItem)){
						usageContextService.setSelectedAssemblyLookupItem(selectedItem);
					}else{
						estimateMainCommonService.setSelectedLookupItem(selectedItem);
					}
				}
			}
			function createError(value,error){
				return {
					apply: true,
					valid: false,
					value: value,
					error: error,
				};

			}
			function createNotFound(value){
				return {
					apply: true,
					valid: false,
					value: value,
					error: 'not found!',
				};
			}

			function createFound(value){
				return {
					apply: true,
					valid: true,
					value: value,
				};
			}

			return service;
		},
	]);
})(angular);
