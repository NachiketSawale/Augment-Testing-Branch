/**
 * Created by zov on 4/24/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.product';
    angular.module(moduleName).factory('ppsProduct2ProdPlaceDataService', [
        'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
        'productionplanningProductMainService', 'ppsProduct2ProdPlaceProcessor',
        'platformDataServiceProcessDatesBySchemeExtension',
        function (platformDataServiceFactory, basicsCommonMandatoryProcessor,
                  productionplanningProductMainService, ppsProduct2ProdPlaceProcessor,
                  platformDataServiceProcessDatesBySchemeExtension) {
            var service;
            var serviceOption = {
                flatNodeItem: {
                    module: moduleName,
                    serviceName: 'Product2ProdPlaceDataService',
                    entityNameTranslationID: 'productionplanning.product.product2ProdcutionPlace.entityName',
                    httpCRUD: {
                        route: globals.webApiBaseUrl + 'productionplanning/product/product2prodplace/',
                        endRead: 'getbyproduct'
                    },
                    entityRole: {
                        node: {
                            itemName: 'ProductToProdPlace',
                            parentService: productionplanningProductMainService,
                            parentFilter: 'productId'
                        }
                    },
                    dataProcessor: [ppsProduct2ProdPlaceProcessor, platformDataServiceProcessDatesBySchemeExtension.createProcessor(
                        {typeName: 'PpsProductToProdPlaceDto', moduleSubModule: 'ProductionPlanning.Product'}
                    )],
                    presenter: {
                        list: {
                            initCreationData: function (creationData) {
                                creationData.Id = productionplanningProductMainService.getSelected().Id;
                            }
                        }
                    }
                }
            };
            var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
            service = serviceContainer.service;
            serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
                mustValidateFields: true,
                typeName: 'PpsProductToProdPlaceDto',
                moduleSubModule: 'ProductionPlanning.Product',
                validationService: 'ppsProduct2ProdPlaceValidationService'
            });
            return service;
        }
    ]);

})();