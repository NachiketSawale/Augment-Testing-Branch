(function (angular) {
	'use strict';
	/* global angular, globals */
	var moduleName = 'productionplanning.processconfiguration';
	var masterModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name phaseReqTemplateDataService
     * @function
     *
     * @description
     *
     */

	masterModule.factory('phaseReqTemplateDataService', phaseReqTemplateDataService);
	phaseReqTemplateDataService.$inject = ['$injector', 'ppsProcessConfigurationPhaseTemplateDataService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupDescriptorService','basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupFilterService', 'upstreamGoodsTypes', 'platformRuntimeDataService', 'phaseRequirementTemplateProcessor', 'basicsLookupdataSimpleLookupService'];

	function phaseReqTemplateDataService($injector, parentService, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, basicsLookupdataLookupDescriptorService,basicsCommonMandatoryProcessor,
		basicsLookupdataLookupFilterService, upstreamGoodsTypes, platformRuntimeDataService, processor, baseLookupSimple) {

		var serviceInfo = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'phaseReqTemplateDataService',
				entityNameTranslationID: 'productionplanning.processconfiguration.entityPhaseReqTemplate',
				addValidationAutomatically: true,
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PhaseReqTemplateDto',
					moduleSubModule: 'Productionplanning.ProcessConfiguration'
				}), processor],
				httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/processconfiguration/phasereqtemplate/'},
				httpRead: {route: globals.webApiBaseUrl + 'productionplanning/processconfiguration/phasereqtemplate/'},
				entityRole: {
					leaf: {
						itemName: 'PhaseReqTemplate',
						parentService: parentService,
						parentFilter: 'mainItemId'
					}
				},
				actions: {
					delete: true,
					create: 'flat'
				},

				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData || []
							};
							return container.data.handleReadSucceeded(result, data);
						},
						initCreationData: function (creationData) {
							if (parentService.getSelected()) {
								creationData.Id = parentService.getSelected().Id; // phase template id
							}
						}
					}
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PhaseReqTemplateDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration',
			validationService: 'phaseReqTemplateValidationService',
			mustValidateFields: ['UpstreamGoods']
		});

		var service = container.service;

		service.onPropertyChanged = function onPropertyChanged(entity, field) {
			switch (field) {
				case 'UpstreamGoodsTypeFk':
					entity.UpstreamGoods = null;
					entity.Quantity = 1;
					processor.processItem(entity);
					var validateService = $injector.get('phaseReqTemplateValidationService');
					var ret = validateService.validateUpstreamGoods(entity, entity.UpstreamGoods, 'UpstreamGoods');
					platformRuntimeDataService.applyValidationResult(ret, entity, 'UpstreamGoods');
					break;
				case 'UpstreamGoods':
					var option = upstreamGoodsTypes.lookupInfo[entity.UpstreamGoodsTypeFk];
					if (option && option.uomFkPropertyName && entity.selectedUpstreamGoods) {
						entity.BasUomFk = entity.selectedUpstreamGoods[option.uomFkPropertyName];
						var result = $injector.get('phaseReqTemplateValidationService').validateBasUomFk(entity, entity.BasUomFk, 'BasUomFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'BasUomFk');
					}
					break;
			}
			service.markItemAsModified(entity);
		};

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'ppsreqtemplate-upstream-goodtype-filter',
				fn: function (item) {
					if(item.Id === upstreamGoodsTypes.Material ||
					   item.Id === upstreamGoodsTypes.Process ||
					   item.Id === upstreamGoodsTypes.Formwork ||
						item.Id === upstreamGoodsTypes.CostCode ||
						item.Id === upstreamGoodsTypes.CostCodeTT){
						return true;
					}
					return  false;
				}
			}
		]);

		//load pps formwork type first
		if (_.isNil(basicsLookupdataLookupDescriptorService.getData('FormworkType'))) {
			basicsLookupdataLookupDescriptorService.loadData('FormworkType');
		}

		return service;
	}

})(angular);
