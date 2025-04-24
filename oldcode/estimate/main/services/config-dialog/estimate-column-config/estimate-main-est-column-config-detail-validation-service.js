/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainEstColumnConfigDetailValidationService
	 * @description provides validation methods for controlling column config detail instances
	 */
	angular.module(moduleName).factory('estimateMainEstColumnConfigDetailValidationService',
		['_', '$injector', 'platformDataValidationService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'estimateMainEstColumnConfigDetailDataService', 'estimateMainEstColumnConfigDetailProcessService',
			function (_, $injector, platformDataValidationService, runtimeDataService, lookupDescriptorService, configDetailDataService, configDetailProcessService) {

				let service = {};

				angular.extend(service, {
					validateColumnId: validateColumnId,
					validateLineType: validateLineType,
					validateMdcCostCodeFk: validateMdcCostCodeFk,
					validateMaterialLineId: validateMaterialLineId,
					validateDescriptionInfo: validateDescriptionInfo,
					validGridItems : validGridItems
				});

				function validateColumnId(entity, value, model) {
					entity[model] = value;
					let validateResult = platformDataValidationService.createSuccessObject();

					if (value) {
						if (value === 1) {
							entity.LineType = 2;
						}

						let isConflict = false;
						let configDetailList = configDetailDataService.getList();
						if (entity.LineType === 2) {
							let configMaterailList = _.filter(configDetailList, function (configDetail) {
								return configDetail.LineType === 2 && configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id;
							});
							let configMetailMax = _.maxBy(configMaterailList, 'MaterialLineId');
							if (configMetailMax) {
								entity.MaterialLineId = configMetailMax.MaterialLineId > configMaterailList.length ? configMetailMax.MaterialLineId + 1 : configMaterailList.length + 1;
							} else {
								entity.MaterialLineId = 1;
							}
							validateResult = platformDataValidationService.isMandatory(value, model, {field: 'Column ID'});
						}
						else {
							let configCostCodeList = _.filter(configDetailList, function (configDetail) {
								return configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id && configDetail.MdcCostCodeFk === entity.MdcCostCodeFk && configDetail.LineType === entity.LineType;
							});
							if (configCostCodeList && configCostCodeList.length > 0) {
								validateResult = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, configCostCodeList, service, configDetailDataService);
								isConflict = true;
							}
						}

						lineTypeChange(entity, entity.LineType);
						removeValidationErrors(entity);
						configDetailProcessService.processItem(entity);
						configDetailDataService.verifyColumnConfigListStatus(isConflict);
					}

					return validateResult;
				}

				function validateLineType(entity, value, model) {
					entity[model] = value;
					lineTypeChange(entity, value);
					configDetailProcessService.processItem(entity);

					return platformDataValidationService.isMandatory(value, model, 'Line Type');
				}

				function validateMdcCostCodeFk(entity, value, model) {
					entity[model] = entity[model + 'Description'] = value;
					let validateResult = platformDataValidationService.createSuccessObject();

					if (!platformDataValidationService.isEmptyProp(value)) {
						if (entity.LineType === 1) {
							setColumnHeaderDescription(entity);
						}
					}

					let configDetailList = configDetailDataService.getList();
					let configCostCodeList = _.filter(configDetailList, function (configDetail) {
						return configDetail.LineType === 1 && configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id && configDetail.MdcCostCodeFk === entity.MdcCostCodeFk;
					});
					let isConflict = false;
					if (configCostCodeList && configCostCodeList.length > 0) {
						validateResult = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, configCostCodeList, service, configDetailDataService);
						if(validateResult.error$tr$ !== null && validateResult.error$tr$param$ !== null){
							validateResult.error$tr$ = 'cloud.common.uniqueCostCodeErrorMessage';
							validateResult.error$tr$param$ = {object : 'cost code'};
						}
						isConflict = true;
					}
					else {
						validateResult = platformDataValidationService.isMandatory(value, model, 'Code');
					}
					removeValidationErrors(entity);
					configDetailProcessService.processItem(entity);
					configDetailDataService.verifyColumnConfigListStatus(isConflict);
					return validateResult;
				}

				function validateMaterialLineId(entity, value, model) {
					entity[model] = value;
					let validateResult = platformDataValidationService.createSuccessObject();

					if (!platformDataValidationService.isEmptyProp(value)){
						if (entity.LineType === 2){
							let configDetailList = configDetailDataService.getList();
							let configMaterailList = _.filter(configDetailList, function (configDetail) {
								return configDetail.LineType === 2 && configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id;
							});
							if (configMaterailList){
								validateResult = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, configMaterailList, service, configDetailDataService);
								setColumnHeaderDescription(entity);
							}
						}
					}else{
						validateResult = platformDataValidationService.isMandatory(value, model, {fieldName: 'Material ID'});
					}

					removeValidationErrors(entity);
					configDetailDataService.verifyColumnConfigListStatus();

					return validateResult;
				}

				function validateDescriptionInfo(entity, value, model) {
					entity.DescriptionInfo.Description = value;
					configDetailDataService.verifyColumnConfigListStatus();

					let result = platformDataValidationService.isMandatory(value, model, 'Column Header');
					runtimeDataService.applyValidationResult(result, entity, 'DescriptionInfo');
				}

				function lineTypeChange(entity, value){
					if (value){
						if (value === 1){
							entity.MdcCostCodeFk = entity.MdcCostCodeFk ? entity.MdcCostCodeFk: null;
							entity.MaterialLineId = 0;
						}else if (value === 2){
							let configDetailList = configDetailDataService.getList();
							let configMaterailList = _.filter(configDetailList, function (configDetail) {
								return configDetail.LineType === 2 && configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id;
							});

							entity.MdcCostCodeFk = null;
							let configMetailMax =  _.maxBy(configMaterailList, 'MaterialLineId');
							if(configMetailMax){
								entity.MaterialLineId = configMetailMax.MaterialLineId > configMaterailList.length ? configMetailMax.MaterialLineId + 1 : configMaterailList.length + 1;
							}
							else {
								entity.MaterialLineId = entity.MaterialLineId ? entity.MaterialLineId: 1;
							}
						}
						removeValidationErrors(entity);
						setColumnHeaderDescription(entity);
					}

					configDetailDataService.verifyColumnConfigListStatus();
				}

				function setColumnHeaderDescription(item){
					let colId = lookupDescriptorService.getLookupItem('dynamiccolumns', item.ColumnId);
					let lineTypeInfo = lookupDescriptorService.getLookupItem('getlinetypes', item.LineType).DescriptionInfo;

					if (colId && lineTypeInfo){
						let description = '';
						if (item.LineType === 1){ // CostCodes
							let editType = $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService').getEditType();
							let lookupType = editType === 'estimate' ? 'estmasterprojectcostcode' : 'costcode';

							let costLookup = lookupDescriptorService.getLookupItem(lookupType, item.MdcCostCodeFk);
							description = costLookup ? costLookup.Code: '';
						}else if (item.LineType === 2){ // Material
							description= item.MaterialLineId;
						}

						let columnHeaderDescription = colId.Description + ' ('  + description + '-' + lineTypeInfo.Description + ')';
						if (columnHeaderDescription.length > 42){
							columnHeaderDescription = columnHeaderDescription.substring(0, 41) + ')';
						}
						item.DescriptionInfo.Description = item.DescriptionInfo.Translated = columnHeaderDescription;
					}
				}

				function removeValidationErrors(item){
					let fields = ['ColumnId', 'MaterialLineId', 'MdcCostCodeFk', 'DescriptionInfo'];
					angular.forEach(fields, function (field) {
						if (runtimeDataService.hasError(item, field)/* && !platformDataValidationService.isEmptyProp(item[field]) */){
							delete item.__rt$data.errors[field];
						}
					});
				}

				function validGridItems(selectedItem){
					let fields = ['ColumnId', 'MaterialLineId', 'MdcCostCodeFk', 'DescriptionInfo'];
					let configDetailList = configDetailDataService.getList();

					if(configDetailList.length > 0){
						angular.forEach(configDetailList, function (item) {
							if(item !== selectedItem){
								angular.forEach(fields, function (field) {
									if (runtimeDataService.hasError(item, field) && !platformDataValidationService.isEmptyProp(item[field])){
										switch(fields.indexOf(field)){
											case 0 : {
												let configColumnIdList = _.filter(configDetailList, function (configDetail) {
													return configDetail.ColumnId === item.ColumnId && configDetail.Id !== item.Id && configDetail.MdcCostCodeFk === item.MdcCostCodeFk && configDetail.LineType === item.LineType;
												});
												if (configColumnIdList && configColumnIdList.length === 0) {
													validateColumnId(item, item.ColumnId, field);
												}
											}
												break;
											case 1 : {
												let configMaterailList = _.filter(configDetailList, function (configDetail) {
													return configDetail.LineType === 2 && configDetail.ColumnId === item.ColumnId && configDetail.Id !== item.Id && configDetail.MaterialLineId === item.MaterialLineId;
												});
												if (configMaterailList && configMaterailList.length === 0){
													validateMaterialLineId(item, item.MaterialLineId, field);
												}
											}
												break;
											case 2 : {
												let configCostCodeList = _.filter(configDetailList, function (configDetail) {
													return configDetail.LineType === 1 && configDetail.ColumnId === item.ColumnId && configDetail.Id !== item.Id && configDetail.MdcCostCodeFk === item.MdcCostCodeFk;
												});
												if (configCostCodeList && configCostCodeList.length === 0) {
													validateMdcCostCodeFk(item, item.MdcCostCodeFk, field);
												}
											}
												break;
										}
										configDetailDataService.refreshGrid();
									}
								});
							}
						});
					}
				}

				return service;
			}]);

})(angular);
