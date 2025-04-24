/**
 * Created by zov on 8/1/2019.
 */
(function () {
    'use strict';
    /*global angular*/
    var moduleName = 'productionplanning.product';
    var module = angular.module(moduleName);
    module.factory('ppsProductTransactionDataService', ppsProductTransactionDataService);
    ppsProductTransactionDataService.$inject = ['platformDataServiceProcessDatesBySchemeExtension',
    'ppsProductTransactionReadonlyProcessor',
    'platformDataServiceFactory',
    'basicsCommonMandatoryProcessor',
    'basicsLookupdataLookupDescriptorService',
    '$injector',
    'platformModalService',
    'procurementStockTransactionValidationServiceFactory'];
    function ppsProductTransactionDataService(platformDataServiceProcessDatesBySchemeExtension,
                                              ppsProductTransactionReadonlyProcessor,
                                              platformDataServiceFactory,
                                              basicsCommonMandatoryProcessor,
                                              basicsLookupdataLookupDescriptorService,
                                              $injector,
                                              platformModalService,
                                              procurementStockTransactionValidationServiceFactory) {
        var parentService = $injector.get('productionplanningProductMainService');
        var serviceInfo = {
            flatLeafItem: {
                module: module,
                serviceName: 'ppsProductTransactionDataService',
                httpCRUD: {
                    route: globals.webApiBaseUrl + 'procurement/stock/transaction/',
                    endRead: 'getbyproduct',
                    initReadData: function initReadData(readData) {
                        readData.filter = '?productId=' + parentService.getSelected().Id;
                    }
                },
                entityRole: {
                    leaf: {
                        itemName: 'Transaction',
                        parentService: parentService
                    }
                },
                presenter: {
                    list:{
                        incorporateDataRead: function (readData, data) {
                            basicsLookupdataLookupDescriptorService.attachData(readData);
                            return data.handleReadSucceeded(readData.Main, data);
                        },
                        handleCreateSucceeded: function (newItem) {
                            newItem.PpsProductFk = parentService.getSelected().Id;
                        }
                    }
                },
                dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
                    {
                        typeName: 'StockTransactionDto',
                        moduleSubModule: 'Procurement.Stock'
                    }), ppsProductTransactionReadonlyProcessor],
                actions: {
                    delete: true,
                    create: 'flat'
                },
                translation: {
                    uid: 'productionplanningProductMainService',
                    title: 'productionplanning.common.product.productTitle',
                    columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
                }
            }
        };

        var serviceContainer = platformDataServiceFactory.createNewComplete(serviceInfo);
        var service = serviceContainer.service;

        serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
            typeName: 'StockTransactionDto',
            moduleSubModule: 'Procurement.Stock',
            validationService: procurementStockTransactionValidationServiceFactory.getValidationService(service),
            mustValidateFields: ['PrjStocklocationFk', 'Lotno','PrcStocktransactiontypeFk','PrjStockFk','MdcMaterialFk','ProvisionTotal']
        });

        service.canDelete=function () {
            var item = service.getSelected();

            if(item!==null&&item!==undefined&&item.Version<1)
            {
                return true;
            }
            else if(item!==null&&item!==undefined)
            {
                var transactionType=basicsLookupdataLookupDescriptorService.getData('StockTransactionType');
                var type=_.find(transactionType, {Id: item.PrcStocktransactiontypeFk});
                /** @namespace type.IsAllowedManual */
                if(type!==undefined&&type.IsAllowedManual)
                {
                    return true;
                }
            }
            return false;
        };

        service.createItem = function () {
            var creationData = serviceContainer.data.doPrepareCreate(serviceContainer.data);
            var config = {
                width: '300px',
                height: '250px',
                resizeable: true,
                templateUrl: globals.appBaseUrl + 'productionplanning.common/templates/form-template-without-controller.html',
                controller: 'ppsProductTransactionCreationController',
                resolve: {
                    params: function () {
                        return {
                            serviceContainer: serviceContainer,
                            creationData: creationData
                        };
                    }
                }
            };

            platformModalService.showDialog(config).then(function (dialogResult) {
                if(dialogResult){
                    serviceContainer.data.doCallHTTPCreate(dialogResult, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
                }
            });
        };

        return service;
    }
})();