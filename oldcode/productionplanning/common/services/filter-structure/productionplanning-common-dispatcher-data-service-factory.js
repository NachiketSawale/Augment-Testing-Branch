/**
 * Created by las on 6/13/2018.
 */



(function (angular) {
    'use strict';
    /*global angular*/

    var module = angular.module('productionplanning.common');
    module.factory('productionplanningCommonDispatcherDataServiceFactory', productionplanningCommonDispatcherDataServiceFactory);

    productionplanningCommonDispatcherDataServiceFactory.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension'];

    function productionplanningCommonDispatcherDataServiceFactory(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

        var service2ModuleName = {};
        function createDispatcherDataService(moduleName) {
            var service = service2ModuleName[moduleName];
            if( service === null || service === undefined){

                var serviceOption = {
                    flatRootItem: {
                        module: module,
                        serviceName: 'productionplanningCommonDispatcherDataServiceFactory',
                        entityNameTranslationID: 'productionplanningCommonDispatcherEntity',
                        httpCRUD: {
                            route: globals.webApiBaseUrl + 'resource/enterprise/dispatcher/',
                            usePostForRead: true,
                            endRead: 'filtered'
                        },
                        actions: { create: false, delete: false },
                        dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                            typeName: 'BasicsCustomizeLogisticsDispatcherGroupDTO',
                            moduleSubModule: 'Basics.Customize'
                        })],
                        entityRole: {root: {itemName: 'Dispatcher'}},

                        presenter: {list: {}}
                    }
                };

                var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
                service = serviceContainer.service;
                service.setShowHeaderAfterSelectionChanged(null);
                service2ModuleName[moduleName] = service;
                service.load();
            }

            return service;
        }

       return {
           createDispatcherDataService : createDispatcherDataService
       };
    }

})(angular);
