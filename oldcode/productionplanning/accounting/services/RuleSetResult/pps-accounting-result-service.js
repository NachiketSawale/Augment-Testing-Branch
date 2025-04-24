/**
 * Created by anl on 4/25/2019.
 */

(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionplanningAccountingResultDataService', ResultDataService);

	ResultDataService.$inject = ['$q', '$http', '$injector', 'platformDataServiceFactory', '$translate',
		'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService',
		'productionplanningAccountingResultProcessor',
		'productionplanningAccountingRuleSetDataService',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupFilterService',
		'platformDataValidationService'];

	function ResultDataService($q, $http, $injector, platformDataServiceFactory, $translate,
							   basicsLookupdataLookupDescriptorService,
							   platformRuntimeDataService,
							   resultProcessor,
							   parentService,
							   basicsCommonMandatoryProcessor,
							   basicsLookupdataLookupFilterService,
							   platformDataValidationService) {

		function createService(config) {
			var oParentService = config.parentService || parentService;
			var serviceOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'productionplanningAccountingResultDataService',
					entityNameTranslationID: 'productionplanning.accounting.entityResult',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/accounting/result/',
						usePostForRead: true,
						endRead: 'getbyruleset',
						initReadData: function initReadData(readData) {
							var selected = oParentService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					entityRole: {
						leaf: {
							itemName: 'Results',
							parentService: oParentService,
							parentFilter: 'RuleSetFk'
						}
					},
					useItemFilter: true,
					dataProcessor: [resultProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								};

								return container.data.handleReadSucceeded(result, data);
							},
							handleCreateSucceeded: function (ruleset) { // jshint ignore:line
								ruleset.ComponentTypeFk = 3;
							},
							initCreationData: function (creationData) {
								creationData.Pkey1 = oParentService.getSelected().Id;
							}
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOptions); // jshint ignore:line

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ResultDto',
				moduleSubModule: 'ProductionPlanning.Accounting',
				validationService: 'productionpalnningAccountingResultValidationService',
				mustValidateFields: ['Result']
			});


			var service = container.service;

			function updateUom(entity, uomId) {
				if (uomId !== null) {
					entity.UomFk = entity.UomFk === null || entity.UomFk === 0 ? uomId : entity.UomFk;
					entity.Uom2Fk = entity.Uom2Fk === null || entity.Uom2Fk === 0 ? uomId : entity.Uom2Fk;
					entity.Uom3Fk = entity.Uom3Fk === null || entity.Uom3Fk === 0 ? uomId : entity.Uom3Fk;
					service.markItemAsModified(entity);
				}
			}

			service.handleFieldChanged = function (entity, field) {
				var validationService = $injector.get('productionpalnningAccountingResultValidationService');
				switch (field) {
					case 'ComponentTypeFk':
						if (entity.selectedComponentType) {
							//updateReadOnly(entity, entity.selectedComponentType.Id);

							entity.Result = null;
							if (entity.selectedComponentType.Id === 1) {
								entity.MaterialFk = null;
								entity.selectedMaterial = null;
								validationService.validateResult(entity, entity.Result, 'Result');
								service.gridRefresh();
							}
							else if (entity.selectedComponentType.Id === 2) {
								entity.CostCodeFk = null;
								entity.selectedCostCode = null;
								validationService.validateResult(entity, entity.Result, 'Result');
								service.gridRefresh();
							}
							else if (entity.selectedComponentType.Id === 3) {
								entity.Result = null;
								entity.MaterialFk = null;
								entity.CostCodeFk = null;
								platformDataValidationService.removeFromErrorList(entity, 'Result', validationService, service);
							}
						}
						break;
					case 'Result':
						if (entity.selectedMaterial) {
							updateUom(entity, entity.selectedMaterial.BasUomFk);
							entity.ResultDescription = entity.selectedMaterial.DescriptionInfo.Translated;
						}
						else if (entity.selectedCostCode) {
							updateUom(entity, entity.selectedCostCode.UomFk);
							entity.ResultDescription = entity.selectedCostCode.DescriptionInfo.Translated;
						}

						//For Result changed in Detail
						else if (_.isNil(entity.selectedMaterial) && _.isNil(entity.selectedCostCode) &&
						entity.ComponentTypeFk !== 3){
							if(entity.ComponentTypeFk === 1){
								var material =  basicsLookupdataLookupDescriptorService.getLookupItem('MaterialCommodity', entity.Result);
								updateUom(entity, material.BasUomFk);
								entity.ResultDescription = material.DescriptionInfo.Translated;
							}else{
								var costcode =  basicsLookupdataLookupDescriptorService.getLookupItem('costcode', entity.Result);
								updateUom(entity, costcode.UomFk);
								entity.ResultDescription = costcode.DescriptionInfo.Translated;
							}
						}
						else {
							entity.ResultDescription = null;
						}
						break;
					case 'UpdActive':
						resultProcessor.setColumnsReadOnly(entity, ['PpsEntityFk'], !entity.UpdActive);
						resultProcessor.setColumnsReadOnly(entity, ['Property'], !entity.UpdActive);
						resultProcessor.setColumnsReadOnly(entity, ['OverrideUom'], !entity.UpdActive);
						if (entity.UpdActive) {
							entity.ComponentTypeFk = 3;
							entity.Result = null;
							entity.MaterialFk = null;
							entity.CostCodeFk = null;
							platformDataValidationService.removeFromErrorList(entity, 'Result', validationService, service);
						}
						break;
				}
			};

			var filters = [{
				key: 'ruleset-result-drawing-componenttype-filter',
				fn: function (drawingComponentTypeEntity) {
					return _.includes([1, 2, 3, 6], drawingComponentTypeEntity.Id);
				}
			}];
			service.registerFilters = function () {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			service.unregisterFilters = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			service.getPropertySelections = () => {
				return [
					{Id: 1, Description: $translate.instant('productionplanning.common.product.length')},
					{Id: 2, Description: $translate.instant('productionplanning.common.product.width')},
					{Id: 3, Description: $translate.instant('productionplanning.common.product.height')},
					{Id: 4, Description: $translate.instant('productionplanning.common.product.weight')},
					{Id: 5, Description: $translate.instant('productionplanning.common.product.area')},
					{Id: 6, Description: $translate.instant('productionplanning.common.product.weight2')},
					{Id: 7, Description: $translate.instant('productionplanning.common.product.area2')},
					{Id: 8, Description: $translate.instant('productionplanning.common.product.weight3')},
					{Id: 9, Description: $translate.instant('productionplanning.common.product.area3')},
					{Id: 10, Description: $translate.instant('cloud.common.entityQuantity')},
					{Id: 11, Description: $translate.instant('productionplanning.common.product.billQuantity')}
				];
			};

			service.getPpsEntitySelections = () => {
				return [
					{Id: 14, Description: $translate.instant('productionplanning.accounting.result.productTemplate')},
					{Id: 1, Description: $translate.instant('productionplanning.accounting.result.productTemplateCharacteristic')},
					{Id: 2, Description: $translate.instant('productionplanning.accounting.result.productTemplateCharacteristic2')}
				];
			};

			service.hasClob = () => {
				const selected = service.getSelected();
				return selected !== null && selected.BasClobFormulaFk !== null;
			};

			service.addClob = () => {
				const deferred = $q.defer();
				const selected = service.getSelected();
				$http.post(globals.webApiBaseUrl + 'cloud/common/clob/create', {}).then(res => {
					if (res.data) {
						selected.BasClobFormulaFk = res.data.Id;
						selected.ClobToSave = res.data;
						service.markItemAsModified(selected);
						deferred.resolve(res.data);
					} else {
						deferred.resolve(null);
					}
				});
				return deferred.promise;
			};

			service.deleteClob = () => {
				const selected = service.getSelected();
				selected.BasClobFormulaFk = null;
				service.markItemAsModified(selected);
			};

			return service;
		}

		var serviceCache = {};

		function getService(config) {
			var serviceKey = config.serviceKey;
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createService(config);
			}
			return serviceCache[serviceKey];
		}

		var service = createService({});
		service.getService = getService;
		return service;
	}

})(angular);