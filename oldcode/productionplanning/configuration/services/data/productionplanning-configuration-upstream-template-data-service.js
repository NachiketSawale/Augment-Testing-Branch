
(function (angular) {
	/* global _,globals, angular */
	'use strict';

	var moduleName = 'productionplanning.configuration';

	angular.module(moduleName).factory('ppsConfigurationUpstreamItemTemplateDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'$injector',
		'ppsUpstreamTemplateValidationService',
		'ppsItemUpstreamTemplateProcessor', 'platformRuntimeDataService',
		'upstreamGoodsTypes', 'PlatformMessenger', '$http', 'platformGridAPI', 'upstreamTypes',
		'basicsLookupdataLookupFilterService',
		'platformDataServiceProcessDatesBySchemeExtension'];

	function DataService(platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		$injector,
		validationService,
		ppsItemUpstreamTemplateProcessor, platformRuntimeDataService,
		upstreamGoodsTypes, PlatformMessenger, $http, platformGridAPI, upstreamTypes,
		basicsLookupdataLookupFilterService,
		platformDataServiceProcessDatesBySchemeExtension) {

		function enSureInvalidValue(newItem) {
			if (newItem) {
				Object.keys(newItem).forEach(function (prop) {
					if (prop.endsWith('Fk') && prop !== 'BasUomFk') {
						if (newItem[prop] <= 0) {
							newItem[prop] = null;
						}
					}
				});
			}
		}

		var defaultServiceOptions = {
			flatRootItem: {
				module: moduleName + '.upstream',
				serviceName: 'ppsConfigurationUpstreamItemTemplateDataService',
				entityNameTranslationID: 'productionplanning.configuration.upstreamItemTemplate.entity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/ppsupstreamitemtemplate/',
					endRead: 'filtered',
					endDelete: 'multidelete',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'PpsUpstreamItemTemplate',
						moduleName: 'productionplanning.configuration.moduleDisplayNameUpstreamItemTemplate'
					}
				},
				entitySelection: {supportsMultiSelection: true},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PpsUpstreamItemTemplateDto',
					moduleSubModule: 'ProductionPlanning.Configuration'
				}),ppsItemUpstreamTemplateProcessor],
				presenter: {
					list: {
						handleCreateSucceeded: function (newItem) {
							enSureInvalidValue(newItem);
							toggleFilterOfMaterialIsProduct(newItem);
						},
					}
				},
				translation: {
					uid: 'ppsConfigurationUpstreamItemTemplateDataService',
					title: 'productionplanning.configuration.upstreamItemTemplate.entity',
					dtoScheme: {
						typeName: 'PpsUpstreamItemTemplateDto',
						moduleSubModule: 'ProductionPlanning.Configuration',
					},
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(defaultServiceOptions);
		serviceContainer.data.usesCache = false;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: ['UpstreamResult', 'BasUomFk', 'UpstreamGoods'],
			typeName: 'PpsUpstreamItemTemplateDto',
			moduleSubModule: 'ProductionPlanning.Configuration',
			validationService: validationService.getService(serviceContainer.service)
		});

		var service = serviceContainer.service;
		service.onPropertyChangeEvent = new PlatformMessenger();
		service.onPropertyChanged = function onPropertyChanged(entity, field) {
			function cleanUpstreamGoods(entity) {
				entity.UpstreamGoods = null;
				let result = validationService.getService(serviceContainer.service).validateUpstreamGoods(entity, entity.UpstreamGoods, 'UpstreamGoods');
				platformRuntimeDataService.applyValidationResult(result, entity, 'UpstreamGoods');
			}
			switch (field) {
				case 'PpsUpstreamTypeFk':
				{
					entity.UpstreamResult = null;
					entity.UpstreamResultStatus = null;
					cleanUpstreamGoods(entity); // upstream goods should be clean up when upstream type changed.(#138556)
					toggleFilterOfMaterialIsProduct(entity);
				}
					break;
				case 'UpstreamResult':
				{
					if (entity.selectedUpstreamResult) {
						entity.UpstreamResultStatus = entity.selectedUpstreamResult.PPSItemStatusFk
							|| entity.selectedUpstreamResult.PackageStatusFk
							|| entity.selectedUpstreamResult.RequisitionStatusFk
							|| entity.selectedUpstreamResult.PesStatusFk;
					}
					platformRuntimeDataService.readonly(entity, [
						{field: 'PpsUpstreamTypeFk', readonly: (entity.UpstreamResult > 0 && entity.Version > 0)},
						{field: 'PpsUpstreamGoodsTypeFk', readonly: (entity.UpstreamResult > 0 && entity.UpstreamGoods > 0 && entity.Version > 0)}
					]);
				}
					break;
				case 'PpsUpstreamGoodsTypeFk':
				{
					cleanUpstreamGoods(entity);
					toggleFilterOfMaterialIsProduct(entity);
				}
					break;
				case 'UpstreamGoods':
				{
					let option = upstreamGoodsTypes.lookupInfo[entity.PpsUpstreamGoodsTypeFk];
					if (option && option.uomFkPropertyName && entity.selectedUpstreamGoods) {
						entity.BasUomFk = entity.selectedUpstreamGoods[option.uomFkPropertyName];
						let result = validationService.getService(serviceContainer.service).validateBasUomFk(entity, entity.BasUomFk, 'BasUomFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'BasUomFk');
					}
					platformRuntimeDataService.readonly(entity, [
						{field: 'PpsUpstreamGoodsTypeFk', readonly: (entity.UpstreamResult > 0 && entity.UpstreamGoods > 0 && entity.Version > 0)}
					]);
				}
					break;
			}
			service.markItemAsModified(entity);
			service.onPropertyChangeEvent.fire(null, {entity: entity, field: field});
		};

		function toggleFilterOfMaterialIsProduct(entity) {
			const filter = {
				key: 'pps-upstream-item-material-is-product-filter',
				serverSide: true,
				fn: function (dataItem, searchOptions) {
					searchOptions.MaterialFilter = {
						IsProduct: true
					};
				}
			};
			// if upstream type is Production and upstream good type is Material,
			// the upstream good lookup should show materials which IsProduct is true.
			if (isUpstreamTypeProduct(entity) && isUpstreamGoodTypeMaterial(entity)) {
				if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
					basicsLookupdataLookupFilterService.registerFilter(filter);
				}
			} else {
				if (basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
					basicsLookupdataLookupFilterService.unregisterFilter(filter);
				}
			}
		}

		function isUpstreamTypeProduct(entity) {
			return entity.PpsUpstreamTypeFk === upstreamTypes.Production;
		}

		function isUpstreamGoodTypeMaterial(entity) {
			return entity.PpsUpstreamGoodsTypeFk === upstreamGoodsTypes.Material;
		}

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'ppsitem-upstream-goodtype-filter',
				fn: function (item) {
					return !(item.Id === upstreamGoodsTypes.CostCode ||
						item.Id === upstreamGoodsTypes.CostCodeTT ||
						item.Id === upstreamGoodsTypes.Process ||
						item.Id === upstreamGoodsTypes.Formwork);
				}
			}
		]);

		return service;
	}

})(angular);
