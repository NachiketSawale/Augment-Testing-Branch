/**
 * Created by waz on 7/27/2017.
 */

(function (angular) {
    'use strict';
	/* global globals */

    const module = 'productionplanning.common';

    angular.module(module).service('ppsCommonBundleDialogProductUiService', PpsCommonBundleDialogProductUiService);
    PpsCommonBundleDialogProductUiService.$inject = ['basicsCommonContainerDialogUiServiceFactory', 'productionplanningCommonProductUIStandardService'];
    function PpsCommonBundleDialogProductUiService(uiServiceFactory, uiService) {
        return uiServiceFactory.createStaticUiService(
            uiService,
            [
                'code', 'descriptioninfo', 'productionsetfk',
                'productionsetDesc', 'productstatusfk', 'length',
                'width', 'height', 'weight',
                'area', 'prjlocationfk', 'prjlocationfkdescription',
                'userdefined1', 'userdefined2', 'userdefined3',
                'userdefined4', 'userdefined5'
            ]
        );
    }

    angular.module(module).factory('ppsCommonBundleDialogProductDataService', PpsCommonBundleDialogProductDataService);
    PpsCommonBundleDialogProductDataService.$inject = ['platformDataServiceFactory', 'transportplanningBundleMainService'];
    function PpsCommonBundleDialogProductDataService(dataServiceFactory, parentService) {
        let serviceContainer;
        let serviceOptions = {
            flatNodeItem: {
                module: angular.module(module),
                serviceName: 'ppsCommonBundleDialogProductDataService',
                httpRead: {
                    route: globals.webApiBaseUrl + 'productionplanning/common/product/',
                    endRead: 'listbyforeignkey',
                    initReadData: function (readData) {
                        readData.filter = `?foreignKey=ProjectFk&mainItemId=${parentService.getSelected().ProjectFk}`;
                    }
                },
                actions: {},
                entityRole: {
                    node: {
                        itemName: 'Product',
                        parentService: parentService
                    }
                },
                presenter: {
                    list: {
                        incorporateDataRead: function (readData, data) {
                            let result = {
                                FilterResult: readData.FilterResult,
                                dtos: readData.Main || []
                            };

                            return serviceContainer.data.handleReadSucceeded(result, data);
                        }
                    }
                }
            }
        };
        serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
        serviceContainer.data.doNotLoadOnSelectionChange = true;
        return serviceContainer.service;
    }
})(angular);
