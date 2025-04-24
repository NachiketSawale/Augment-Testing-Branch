(function (angular) {
	/* global moment */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.material.basicsMaterialSimilarService
	 * @function
	 * @requireds
	 *
	 * @description Provide CommoditySearchSimilar data
	 */
	angular.module('basics.material').factory('basicsMaterialSimilarService',
		['_','$http','$translate','$injector','platformTranslateService','platformModalFormConfigService','basicsLookupdataLookupDataService',
			'basicsLookupdataLookupFilterService','basicsMaterialPriceConditionDataServiceNew','prcCommonCalculationHelper','basicsLookupdataLookupDescriptorService', 'platformDialogService', 'platformRuntimeDataService',
			function(_,$http,$translate,$injector,platformTranslateService,platformModalFormConfigService,basicsLookupdataLookupDataService,
				lookupFilterService,priceConditionService,prcCommonCalculationHelper,basicsLookupdataLookupDescriptorService, platformDialogService, platformRuntimeDataService) {
				var service={};
				function validateMaterialCatalog(entity, value) {
					$http.get(globals.webApiBaseUrl + 'basics/material/getMaterialGroupByCatalog?id=' +value).then(function(res){
						if (res.data) {
							entity.MaterialGroupFk=res.data;
							//asyncValidateCode(entity);
						}
						else{
							entity.MaterialGroupFk=null;
						}
						validateMaterialGroup(entity, entity.MaterialGroupFk,'MaterialGroupFk');
						reGenerateCode(entity,value);
					});
				}

				function reGenerateCode(entity,id){
					$http.get(globals.webApiBaseUrl + 'basics/material/reGenerateCodeByCatalog?id=' +id).then(function(res){
						if (res.data) {
							entity.Code=res.data;
							validateCode(entity,entity.Code,'Code');
							asyncValidateCode(entity,entity.Code);
						}
					});
				}

				function validateMaterialGroup(entity, value,model){
					var result = {apply: true, valid: true};
					if(_.isNull(value)){
						result={apply: true, valid: false, error: $translate.instant('cloud.common.emptyOrNullValueErrorMessage')};
					}
					if (value < 0) {
						result={apply: true, valid: false, error: $translate.instant('basics.material.error.materialGroupSelectError')};
					}
					//if (!result.valid) {
					$injector.get('platformRuntimeDataService').applyValidationResult(result, entity, model);
					//}
					return result;
				}

				function validateCode(entity,value,model){
					var validateResult = {
						apply: true,
						valid: true
					};
					if (!value) {
						validateResult.apply = false;
						validateResult.valid = false;
						validateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model.toLowerCase()});
						return validateResult;
					}
					return validateResult;
				}

				function asyncValidateCode(entity, value) {
					if(!_.isNil(entity.MaterialGroupFk)&&entity.MaterialGroupFk>0){
						return $injector.get('basicsMaterialRecordValidationService').asyncValidateCode(entity, value, 'Code');
					}
				}

				function recalculateCost(item, value, model){
					if(model === 'ListPrice') {
						item.Cost = prcCommonCalculationHelper.round(value * ( 100 - item.Discount ) / 100 + (item.Charges) + (item.PriceExtra));
					}
					else if(model === 'Discount'){
						item.Cost = prcCommonCalculationHelper.round(item.ListPrice * ( 100 - value ) / 100 + (item.Charges) + (item.PriceExtra));

					}else if(model === 'Charges'){
						item.Cost = prcCommonCalculationHelper.round(item.ListPrice * ( 100 - item.Discount ) / 100 + value + (item.PriceExtra));

					}else if(model === 'PriceExtra'){
						item.Cost = prcCommonCalculationHelper.round(item.ListPrice * ( 100 - item.Discount ) / 100 + (item.Charges)  + value);
					}
					else{
						item.Cost = prcCommonCalculationHelper.round(item.ListPrice * ( 100 - item.Discount ) / 100 + (item.Charges)  + (item.PriceExtra));
					}
					item.EstimatePrice = item.Cost;

					setCostPriceGross(item);
				}


				function setCostPriceGross(item){
					var taxCode = _.find(basicsLookupdataLookupDescriptorService.getData('TaxCode'), {Id: item.MdcTaxCodeFk });
					var vatPercent = taxCode ? taxCode.VatPercent : 0;
					item.CostPriceGross = item.Cost * (100 + vatPercent) / 100;
				}

				function costPriceValidator(entity, value, model) {
					recalculateCost(entity, value, model);
					recalculatePriceConditions(entity);
				}

				function validateCostPriceGross(entity,value){
					var TaxCodes = basicsLookupdataLookupDescriptorService.getData('TaxCode');
					var taxCode = _.find(TaxCodes, {Id: entity.MdcTaxCodeFk });
					var vatPercent = taxCode?taxCode.VatPercent: 0;
					if (!entity.PrcPriceconditionFk) {
						entity.ListPrice = (value * 100/(100 + vatPercent)- entity.Charges - entity.PriceExtra) * 100 / (100 - entity.Discount);
						entity.Cost = prcCommonCalculationHelper.round(entity.ListPrice * ( 100 - entity.Discount ) / 100 + (entity.Charges) + (entity.PriceExtra));
						entity.EstimatePrice = entity.Cost;
						entity.ListPrice = prcCommonCalculationHelper.round(entity.ListPrice);
					}
					else {
						entity.Cost = value * 100 / (100 + vatPercent);
						entity.ListPrice = prcCommonCalculationHelper.round((entity.Cost - entity.PriceExtra - entity.Charges) * 100 / ( 100 - entity.Discount ));
						entity.Cost = prcCommonCalculationHelper.round(entity.Cost);
						entity.EstimatePrice = entity.Cost;
					}
				}

				function validateMdcTaxCodeFk(entity,value){
					entity.MdcTaxCodeFk = value;
					setCostPriceGross (entity);
				}

				var materialComplete=null;
				function handleRecalcuateDone(entity,resData){
					var priceConditions=resData.PriceConditions;
					if(materialComplete){
						materialComplete.MaterialPriceConditionToSave=priceConditions;
					}
					var total = _.sumBy(priceConditions, function (item) {
						return item.PriceConditionType.IsPriceComponent && item.IsActivated ? item.Total : 0;
					});
					entity.PriceExtra = total;
					recalculateCost(entity);
				}

				function validatePrcPriceConditionFk(entity, value){
					var url = globals.webApiBaseUrl + 'basics/material/pricecondition/reload';
					$http.post(url, {
						PrcPriceConditionId: value,
						MainItem: entity,
						ExchangeRate: 1
					}).then(function (result) {
						var resData = result.data;
						handleRecalcuateDone(entity,resData);
					});
				}

				function recalculatePriceConditions(parentItem){
					var priceConditions=materialComplete.MaterialPriceConditionToSave;
					var url = globals.webApiBaseUrl + 'basics/material/pricecondition/recalculate';
					$http.post(url, {
						PriceConditions: priceConditions,
						MainItem: parentItem,
						ExchangeRate: 1
					}).then(function (result) {
						var resData = result.data;
						handleRecalcuateDone(parentItem,resData);
					});
				}

				function openDialogForCode(dataItem) {
					const materialConfigRows = $injector.get('materialUiConfigurationService').layout.filter(e => {
						return ['Code'].includes(e.model);
					});
					_.forEach(materialConfigRows,function(item){
						if ('Code' === item.model) {
							item.validator = validateCode;
							item.asyncValidator = asyncValidateCode;
						}
					});

					const layout = {
						title: $translate.instant('basics.material.lookup.clone'),
						dataItem: dataItem,
						dialogOptions: {
							width: '250px',
							disableOkButton: function disableOkButton() {
								const hasError = (dataItem.__rt$data && dataItem.__rt$data.errors);
								return ((hasError && dataItem.__rt$data.errors.Code) || _.isNil(dataItem.Code));
							},
							defaultButton: 'ok',
						},
						showOkButton: true,
						resizeable: true,
						formConfiguration: {
							fid: 'material.similar.code.form',
							version: '1.0.0',
							showGrouping: false,
							groups: [{gid: 'basicData'}],
							rows: materialConfigRows
						},
						handleOK: function handleOK(result) {
							if (result && result.ok && result.data) {
								result.materialComplete = materialComplete;
							}
						}
					};

					platformTranslateService.translateFormConfig(layout.formConfiguration);
					return platformModalFormConfigService.showDialog(layout);
				}

				var selectDataItem=null;
				var filters = [
					{
						key: 'basics-material-records-neutral-materialCatalog-filter',
						fn: function (dateItem) {
							return ( dateItem.IsNeutral && dateItem.Islive );
						}
					},
					{
						key: 'basics-material-records-prc-neutral-material-filter',
						serverSide: true,
						serverKey: 'basics-material-records-neutral-material-filter',
						fn: function () {
							var neutralMaterialCatalogFk = selectDataItem?selectDataItem.NeutralMaterialCatalogFk:null;
							return {
								materialCatalogFk: neutralMaterialCatalogFk
							};
						}
					},
					{
						key: 'basics-material-group-filter',
						serverSide: true,
						fn: function () {
							if (selectDataItem) {
								return {
									MaterialCatalogFk: selectDataItem.MaterialCatalogFk
								};
							}
							return {};
						}
					}
				];
				lookupFilterService.registerFilter(filters);

				service.create=function(materialId){
					/*
               var materialConfigurationService= $injector.get('materialUiConfigurationService');
               var materialConfig=materialConfigurationService.createUIService().getStandardConfigForDetailView();
               var materialConfigRows=materialConfig.rows;
               */

					var materialConfigRows=$injector.get('materialUiConfigurationService').layout.filter(e => {
						return ['MaterialCatalogFk', 'MaterialGroupFk', 'Code', 'MatchCode', 'DescriptionInfo1', 'DescriptionInfo2', 'BasCurrencyFk', 'UomFk', 'RetailPrice', 'ListPrice', 'EstimatePrice', 'ExternalCode'].includes(e.model);
					}).map(function(i){
						const row = _.cloneDeep(i);
						return addReadFilterNUpdateGid(row);
					});

					_.forEach(materialConfigRows,function(item){
						if('MaterialCatalogFk'===item.model) {
							item.readonly = false;
							item.validator=validateMaterialCatalog;
						}
						else if('MaterialGroupFk'===item.model){
							item.validator=validateMaterialGroup;
						}
						else if('Code'===item.model){
							item.validator=validateCode;
							item.asyncValidator=asyncValidateCode;
						}
						else if('MdcTaxCodeFk'===item.model){
							item.validator=validateMdcTaxCodeFk;
						}
						else if('ListPrice'===item.model||'Discount'===item.model||'Charges'===item.model||'PriceExtra'===item.model){
							item.validator=costPriceValidator;
						}
						else if('CostPriceGross'===item.model){
							item.validator=validateCostPriceGross;
						}
						else if('PrcPriceconditionFk'===item.model){
							item.validator=validatePrcPriceConditionFk;
						}
					});
					materialComplete=null;
					return $http.get(globals.webApiBaseUrl + 'basics/material/createMaterial?id=' + materialId)
						.then(function (response) {
							materialComplete=response.data;
							var dataItem=materialComplete.Material;
							validateAfterCreateSimilar(dataItem);
							selectDataItem=dataItem;
							if(dataItem.UserDefinedDate1) {
								dataItem.UserDefinedDate1 = moment.utc(dataItem.UserDefinedDate1);
							}
							if(dataItem.UserDefinedDate2) {
								dataItem.UserDefinedDate2 = moment.utc(dataItem.UserDefinedDate2);
							}
							if(dataItem.UserDefinedDate3) {
								dataItem.UserDefinedDate3 = moment.utc(dataItem.UserDefinedDate3);
							}
							if(dataItem.UserDefinedDate4) {
								dataItem.UserDefinedDate4 = moment.utc(dataItem.UserDefinedDate4);
							}
							if(dataItem.UserDefinedDate5) {
								dataItem.UserDefinedDate5 = moment.utc(dataItem.UserDefinedDate5);
							}
							var layout = {
								headerText: $translate.instant('basics.material.lookup.copyMaterial'),
								dataItem: dataItem,
								top: 'calc(50% - 288px)',
								height: 'auto',
								width: '650px',
								maxHeight: '580px',
								showOkButton: false,
								showCancelButton: true,
								resizeable: true,
								formConfiguration: {
									uuid: '49bc3540ba114530b45bb99cd20ea344',
									fid: 'material.similar.form',
									version: '1.0.4',
									showGrouping: false,
									groups: [{
										gid: 'basicData',
										header$tr$: 'cloud.common.entityProperties',
										readFilter: {readonly: [{field: 'visible', readonly: true}]}
									}],
									rootReadFilter: {readonly: [{field: 'visible', readonly: true}]},
									rows:materialConfigRows
								},
								buttons: [{
									id: 'similarOkBtn',
									caption$tr$: 'platform.okBtn',
									fn: function(e, info) {
										const material = info.modalOptions.dataItem;
										material.InsertedAt = 0;
										material.InsertedBy = 0;
										material.SearchPattern = '';
										material.BasBlobsFk = null;
										material.BasBlobsSpecificationFk = null;
										material.Uuid = null;
										info.$close({ ok: true, data: material });
									},
									disabled: function disableOkButton() {
										return (dataItem.__rt$data && dataItem.__rt$data.errors && _.find(dataItem.__rt$data.errors, err => !!err));
									}
								}],
								defaultButtonId: 'similarOkBtn',
								bodyTemplateUrl: globals.appBaseUrl + 'basics.material/templates/material-lookup/material-similar-form.html'
							};
							platformTranslateService.translateFormConfig(layout.formConfiguration);
							return showSimilarFormDialog(layout);
						});
				};

				service.clone = function(materialId) {
					materialComplete = null;
					return $http.get(globals.webApiBaseUrl + 'basics/material/createMaterial?id=' + materialId)
						.then(function (response) {
							const dataItem = response.data.Material;
							materialComplete = response.data;
							selectDataItem = dataItem;

							dataItem.InsertedAt = 0;
							dataItem.InsertedBy = 0;
							dataItem.SearchPattern = '';
							dataItem.BasBlobsFk = null;
							dataItem.BasBlobsSpecificationFk = null;
							dataItem.Uuid = null;

							if (dataItem.Code) {
								return {ok: true,data: dataItem,materialComplete: materialComplete};
							}
							else {
								return openDialogForCode(dataItem);
							}
						});
				};

				service.save = function(materialComplete) {
					return $http.post(globals.webApiBaseUrl + 'basics/material/saveSimilarMaterial', materialComplete);
				}

				function addReadFilterNUpdateGid(row) {
					row.gid = 'basicData';

					const requiredRows = ['MaterialGroupFk', 'Code', 'UomFk', 'RetailPrice', 'ListPrice', 'EstimatePrice'];
					if (requiredRows.includes(row.model)) {
						row.readFilter = {readonly: [{field: 'visible', readonly: true}]}
					}
					return row;
				}

				function validateAfterCreateSimilar(dataItem) {
					const codeValidateResult = validateCode(dataItem, dataItem.Code, 'Code');
					platformRuntimeDataService.applyValidationResult(codeValidateResult, dataItem, 'Code');
				}

				function showSimilarFormDialog(dialogOption) {
					return platformDialogService.showDialog(dialogOption).then(function (result) {
						if (result && result.ok && result.data) {
							result.materialComplete = {material: result.data};
							return result;
						}
					});
				}

				return service;
			}]);
})(angular);