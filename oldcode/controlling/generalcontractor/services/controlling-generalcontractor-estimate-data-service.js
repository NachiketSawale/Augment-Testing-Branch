/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
    'use strict';
    let moduleName = 'controlling.generalcontractor';
    let module = angular.module(moduleName);


    /**
     * @ngdoc service
     * @name controllingGeneralContractorEstimateDataService
     * @function
     *
     * @description
     * controllingGeneralContractorEstimateDataService is the data service for project estimate Header functionality.
     */
    /* jshint -W072 */ // many parameters because of dependency injection
    module.factory('controllingGeneralContractorEstimateDataService', ['_', '$timeout', 'platformGridAPI', 'platformDataServiceFactory','cloudDesktopPinningContextService','platformRuntimeDataService',
        function (_, $timeout, platformGridAPI, platformDataServiceFactory, cloudDesktopPinningContextService, platformRuntimeDataService) {

            // The instance of the main service - to be filled with functionality below
            let estimateMainHeaderServiceOptions = {
                flatNodeItem: {
                    module: module,
                    serviceName: 'controllingGeneralContractorEstimateDataService',
                    httpCreate: {route: globals.webApiBaseUrl + 'estimate/project/'},
                    httpRead: {
                        route: globals.webApiBaseUrl + 'controlling/ceneralContractor/',
                        endRead: 'gccestlist',
                        initReadData: function initReadData(readData) {
                            let context = cloudDesktopPinningContextService.getContext();
                            let item =_.find(context, {'token': 'project.main'});
                            readData.ProjectId = item? item.id:-1;
                        },
                        usePostForRead: true
                    },
                    actions: {delete: false, create: false},
                    entityRole: {
                        root: {
                            itemName: 'EstimateComplete',
                            moduleName: 'Estimate Project',
                        }
                    },
                    entitySelection: {},
                    presenter: {
                        list: {
                            incorporateDataRead: function (readData, data) {
                                if(readData){
                                    _.forEach(readData, function (item){
													item.PrjEstimate = {
														PrjProjectFk: item.ProjectId
													};
                                        platformRuntimeDataService.readonly(item, true);
                                    });
                                }
                                return serviceContainer.data.handleReadSucceeded (readData, data);
                            }
                        }
                    },
                    translation: {
                        uid: 'controllingGeneralContractorEstimateDataService',
                        title: 'project.main.estimate',
                        columns: [{header: 'cloud.common.entityDescription', field: 'EstHeader.DescriptionInfo'}],
                        dtoScheme: {
                            typeName: 'EstHeaderDto',
                            moduleSubModule: 'Estimate.Project'
                        }
                    }
                }
            };

            /* jshint -W003 */
            let serviceContainer = platformDataServiceFactory.createNewComplete (estimateMainHeaderServiceOptions);

            let service = serviceContainer.service;

            let gridId = '';
            service.setGridId = function setGridId(value) {
                gridId = value;
            };

            service.refreshData = function () {
                if(gridId) {
                    let grid = platformGridAPI.grids.element('id', gridId);
                    if (grid && grid.instance) {
                        service.load();
                    }
                }
            };

            service.loadData =function (){
                service.setList([]);
                serviceContainer.data.itemList =[];

                $timeout(function () {
                    service.load().then(
                        function () {
                            service.gridRefresh();
                        }
                    );
                });
            };


            return serviceContainer.service;
        }]);
})();
