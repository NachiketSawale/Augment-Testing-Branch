
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('productPhaseRequirementDataService', DataService);

	DataService.$inject = ['$injector','platformDataServiceFactory',
		'productionplanningProductMainService',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupFilterService',
		'upstreamGoodsTypes',
		'upstreamTypes',
		'PlatformMessenger',
		'platformRuntimeDataService',
		'phaseRequirementProcessor',
		'productionplanningPhaseDataServiceFactory'];

	function DataService($injector,platformDataServiceFactory,
		productionplanningProductMainService,
		basicsCommonMandatoryProcessor,
		basicsLookupdataLookupFilterService,
		upstreamGoodsTypes,
		upstreamTypes,
		PlatformMessenger,
		platformRuntimeDataService,
		phaseRequirementProcessor,
		phaseDataServiceFactory) {

		var container;
		let productPhaseDataService = phaseDataServiceFactory.getService(moduleName, productionplanningProductMainService);

		var serviceOptions = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'productPhaseRequirementDataService',
				entityNameTranslationID: 'productionplanning.processconfiguration.entityPhaseRequirement',
				addValidationAutomatically: true,
				dataProcessor: [phaseRequirementProcessor],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/processconfiguration/phaserequirement/',
					endRead: 'listbyphaseorprocess',
					initReadData: function (readData) {
						var selectedPhase = productPhaseDataService.getSelected();
						var selectedProduct = productionplanningProductMainService.getSelected();
						readData.filter = '?PhaseId=' + ( selectedPhase ? selectedPhase.Id : 0)  + '&ProcessId=' + ( selectedProduct ? selectedProduct.PpsProcessFk || 0 : 0)+ '&WithStatus=true';
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PhaseRequirement',
						parentService: productionplanningProductMainService,
						parentFilter: 'ProcessId',
						useIdentification: true
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var selectedPhase = productPhaseDataService.getSelected();
							var selectedProduct = productionplanningProductMainService.getSelected();
							creationData.PKey1 = selectedPhase ? selectedPhase.Id : 0;
							creationData.PKey2 = selectedProduct.PpsProcessFk || 0;
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat',
					canCreateCallBackFunc: function () {
						return !!productionplanningProductMainService.getSelected().PpsProcessFk;
					},
				},
			}
		};

		/* jshint -W003 */
		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsPhaseRequirementDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration',
			validationService: 'productPhaseRequirementValidationService',
			mustValidateFields: ['RequirementGoods']
		});

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'ppsphase-requirement-upstream-goodtype-filter',
				fn: function (item) {
					return item.Id === upstreamGoodsTypes.Material ||
						item.Id === upstreamGoodsTypes.Process ||
						item.Id === upstreamGoodsTypes.Formwork ||
						item.Id === upstreamGoodsTypes.CostCode ||
						item.Id === upstreamGoodsTypes.CostCodeTT;
				}
			},
			{
				key: 'ppsphase-requirement-result-type-filter',
				fn: function (item) {
					return item.Id === upstreamTypes.Production ||
						item.Id === upstreamTypes.Acquisition ||
						item.Id === upstreamTypes.SuppliedByCustomer ||
						item.Id === upstreamTypes.Process ||
						item.Id === upstreamTypes.Formwork;
				}
			},
		]);

		var service = container.service;

		service.onPropertyChangeEvent = new PlatformMessenger();
		service.onPropertyChanged = function onPropertyChanged(entity, field) {
			switch (field) {
				case 'PpsUpstreamGoodsTypeFk':
					entity.RequirementGoods = null;
					entity.Quantity = 1;
					phaseRequirementProcessor.processItem(entity);
					var ret = $injector.get('productPhaseRequirementValidationService').validateRequirementGoods(entity, entity.RequirementGoods, 'RequirementGoods');
					platformRuntimeDataService.applyValidationResult(ret, entity, 'RequirementGoods');
					break;
				case 'RequirementGoods':
					var option = upstreamGoodsTypes.lookupInfo[entity.PpsUpstreamGoodsTypeFk];
					if (option && option.uomFkPropertyName && entity.selectedUpstreamGoods) {
						entity.BasUomFk = entity.selectedUpstreamGoods[option.uomFkPropertyName];
						var result = $injector.get('productPhaseRequirementValidationService').validateBasUomFk(entity, entity.BasUomFk, 'BasUomFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'BasUomFk');
					}
					break;
			}
			service.markItemAsModified(entity);
			service.onPropertyChangeEvent.fire(null, {entity: entity, field: field});
		};

		return service;
	}
})(angular);
