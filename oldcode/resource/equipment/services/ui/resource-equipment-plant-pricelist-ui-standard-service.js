(function () {
    'use strict';
    var moduleName = 'resource.equipment';
    /**
     * @ngdoc service
     * @name resourceEquipmentPlantPricelistUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of plant eurolist entities
     */
    angular.module(moduleName).factory('resourceEquipmentPlantPricelistUIStandardService',
        ['platformUIStandardConfigService', '$injector', 'resourceEquipmentTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService',
            function (platformUIStandardConfigService, $injector, resourceEquipmentTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, platformLayoutHelperService) {
                function createMainDetailLayout() {
                    return {
                        fid: 'object.main.resourceequipmentpricelistdetailform',
                        version: '1.0.0',
                        addValidationAutomatically: true,
                        showGrouping: true,
                        groups: [
                            {
                                'gid': 'basicData',
                                'attributes': ['pricelistfk', 'ismanual','commenttext', 'validfrom', 'validto', 'uomfk', 'qualityfactor',
	                                 'priceportion1', 'priceportion2', 'priceportion3', 'priceportion4', 'priceportion5', 'priceportion6', 'priceportionsum']
                            },
                            {
                                'gid': 'entityHistory',
                                'isHistory': true
                            }
                        ],
                        overloads: {
									pricelistfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig			          ('basics.customize.equipmentpricelist',null, {
										field: 'UomFk',
										customIntegerProperty: 'BAS_UOM_FK'
									}),
                            uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification())
                        }
                    };
                }
                var resourceEquipmentPricelistDetailLayout = createMainDetailLayout();
                var BaseService = platformUIStandardConfigService;
                var resourceEquipmentPricelistAttributeDomains = platformSchemaService.getSchemaFromCache({
                    typeName: 'PlantPricelistDto',
                    moduleSubModule: 'Resource.Equipment'
                });
                resourceEquipmentPricelistAttributeDomains = resourceEquipmentPricelistAttributeDomains.properties;
                function ResourceEquipmentPricelistUIStandardService(layout, scheme, translateService) {
                    BaseService.call(this, layout, scheme, translateService);
                }
                ResourceEquipmentPricelistUIStandardService.prototype = Object.create(BaseService.prototype);
                ResourceEquipmentPricelistUIStandardService.prototype.constructor = ResourceEquipmentPricelistUIStandardService;
                return new BaseService(resourceEquipmentPricelistDetailLayout, resourceEquipmentPricelistAttributeDomains, resourceEquipmentTranslationService);
            }
        ]);
})();