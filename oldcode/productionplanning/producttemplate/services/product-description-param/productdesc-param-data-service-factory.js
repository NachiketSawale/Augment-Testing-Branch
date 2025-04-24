/**
 * Created by zov on 7/15/2019.
 */
(function () {
    'use strict';
    /*global globals, angular, _*/
    var moduleName = 'productionplanning.producttemplate';
    var module = angular.module(moduleName);
    module.factory('ppsProducttemplateParamDataServiceFactory', DataService);

    DataService.$inject = ['$injector',
        'basicsCommonMandatoryProcessor',
        'basicsLookupdataLookupDescriptorService',
        'platformDataServiceFactory',
        'platformDataServiceProcessDatesBySchemeExtension',
        'platformRuntimeDataService'];

    function DataService($injector,
                         basicsCommonMandatoryProcessor,
                         basicsLookupdataLookupDescriptorService,
                         platformDataServiceFactory,
                         platformDataServiceProcessDatesBySchemeExtension,
                         platformRuntimeDataService) {

        var factory = {};
        var serviceCache = {};
        factory.getService = function getService(serviceOptions) {
            var serviceKey = serviceOptions.parentServiceName;
            if (!serviceCache[serviceKey]) {
                serviceCache[serviceKey] = createNewComplete(serviceOptions);
            }
            return serviceCache[serviceKey];
        };

        function getDataProcessors(serviceName, serviceOptions) {
            var processors = [];
            if (serviceOptions.readOnly === true) {
                processors.push({
                    processItem: function (item) {
                        var fileds = Object.getOwnPropertyNames(item).map(function (prop) {
                            return {field: prop, readonly: true};
                        });
                        platformRuntimeDataService.readonly(item, fileds);
                    }
                });
            }
            return processors;
        }

        function createNewComplete(serviceOptions) {
            var service;
            var serviceName = serviceOptions.parentServiceName + '_ProductdescDataService';
            var serviceInfo = {
                flatLeafItem: {
                    module: module,
                    serviceName: serviceName,
                    entityNameTranslationID: 'productionplanning.producttemplate.entityProductDescParam',
                    dataProcessor: getDataProcessors(serviceName, serviceOptions),
                    httpCRUD: {
                        route: globals.webApiBaseUrl + serviceOptions.route,
                        endRead: serviceOptions.endRead,
                        usePostForRead: true,
                        initReadData: function (readData) {
                            var parentService = serviceOptions.parentService || $injector.get(serviceOptions.parentServiceName);
                            var selected = parentService.getSelected();
                            if (!_.isNil(serviceOptions.parentField)) {
                                readData.PKey1 = _.get(selected, serviceOptions.parentField);
                                readData.PKey1 = _.isNil(readData.PKey1) ? -1 : readData.PKey1;
                            } else {
                                readData.PKey1 = selected.Id;
                            }
                        }
                    },
                    presenter: {
                        list: {
                            initCreationData: function initCreationData(creationData) {
                                var parentService = serviceOptions.parentService || $injector.get(serviceOptions.parentServiceName);
                                var selected = parentService.getSelected();
                                if (!_.isNil(serviceOptions.parentField)) {
                                    creationData.PKey1 = _.get(selected, serviceOptions.parentField);
                                } else {
                                    creationData.PKey1= selected.Id;
                                }
                            },
                            handleCreateSucceeded: function (newItem) {
                                var list = service.getList();
                                if (list.length > 0) {
                                    newItem.Sorting = _.max(_.map(list, 'Sorting')) + 1;
                                } else {
                                    newItem.Sorting = 1;
                                }
                            }
                        }
                    },
                    entityRole: {
                        leaf: {
                            itemName: 'ProductDescParam',
                            parentService: serviceOptions.parentService || $injector.get(serviceOptions.parentServiceName)
                        }
                    },
                    translation: {
                        uid: serviceName,
                        title: 'productionplanning.producttemplate.productDescParamListTitle',
                        columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
                        dtoScheme: {
                            typeName: 'ProductDescParamDto',
                            moduleSubModule: 'ProductionPlanning.ProductTemplate'
                        }
                    },
                    actions: serviceOptions.readOnly === true ? {
                        delete: false,
                        create: {}
                    } : undefined
                }
            };

            var container = platformDataServiceFactory.createNewComplete(serviceInfo);
            service = container.service;
            container.data.usesCache = false;
            service.setNewEntityValidator = function (validator) {
                container.data.newEntityValidator = validator;
            };

            return service;
        }

        return factory;
    }
})();