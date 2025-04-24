/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
    'use strict';
    /* global globals, _ */
    let moduleName = 'estimate.main';
    let estimateMainModule = angular.module(moduleName);
    /**
     * @ngdoc service
     * @name estimateMainDissolvePlantAssemblyService
     * @function
     *
     * @description
     * estimateMainDissolvePlantAssemblyService is the data service for Dissolve Assembly wizard to handle plant assembly resources
     */
    estimateMainModule.factory('estimateMainDissolvePlantAssemblyService', ['$http', 'estimateMainService', 'platformTranslateService', 'PlatformMessenger', 'platformDataServiceFactory',
        function ($http, estimateMainService, platformTranslateService, PlatformMessenger, platformDataServiceFactory) {

            let service = {};
            let dataList = [];

            angular.extend(service, {
                listLoaded: new PlatformMessenger(),
                onSelectionChanged: new PlatformMessenger(),
                registerListLoaded: registerListLoaded,
                unregisterListLoaded: unregisterListLoaded,
                getList: getList,
                addItems: addItems,
                getDissolvePlantAssemblies:getDissolvePlantAssemblies
            });

            service.getColumnsReadOnly = function getColumnsReadOnly() {
                let columns = [
                    {
                        id: 'Selected',
                        field: 'IsChecked',
                        headerChkbox: true,
                        toolTip: 'Select',
                        name$tr$: 'estimate.main.dissolveAssemblyWizard.select',
                        formatter: 'boolean',
                        editor: 'boolean',
                        width: 65,
                        validator: 'isCheckedValueChange',
                        isTransient: true
                    },
                    {
                        id: 'code',
                        field: 'Code',
                        name: 'Code',
                        width: 150,
                        toolTip: 'Code',
                        formatter: 'code',
                        name$tr$: 'cloud.common.entityCode',
                        grouping: {
                            title: 'cloud.common.entityCode',
                            getter: 'Code',
                            aggregators: [],
                            aggregateCollapsed: true
                        }
                    },
                    {
                        id: 'Description',
                        field: 'DescriptionInfo.Description',
                        name: 'Description',
                        width: 300,
                        toolTip: 'Description',
                        formatter: 'description',
                        name$tr$: 'cloud.common.entityDescription'
                    }
                ];
                return columns;
            };

            platformTranslateService.translateGridConfig(service.getColumnsReadOnly());

            let serviceOption;
            serviceOption = {
                module: angular.module(moduleName),
                entitySelection: {},
                modification: {multi: {}},
                translation: {
                    uid: 'estimateMainDissolvePlantAssemblyService',
                    title: 'Title',
                    columns: [
                        {
                            header: 'cloud.common.entityDescription',
                            field: 'Description'
                        }]
                }
            };

            let container = platformDataServiceFactory.createNewComplete(serviceOption);

            service.setDataList = function (isWizardOpen,isScopeChanged) {
                if (!isWizardOpen || isScopeChanged) {
                    dataList = null;
                }
            };

            angular.extend(service, container.service);

            service.getStandardConfigForListView = function () {
                return {
                    columns: service.getColumnsReadOnly()
                };
            };

            function registerListLoaded(callBackFn) {
                service.listLoaded.register(callBackFn);
            }

            function unregisterListLoaded(callBackFn) {
                service.listLoaded.unregister(callBackFn);
            }

            function getList() {
                return dataList;
            }
            
            function addItems(items) {
                if (items === null) {
                    dataList = null;
                    return;
                }
                dataList = dataList ? dataList : [];
                angular.forEach(items, function (item) {
                    let matchItem = _.find(dataList, {Code: item.Code});
                    if (!matchItem) {
                        dataList.push(item);
                    }
                });
                container.data.itemList = dataList;
                service.refreshGrid();
            }

            function getDissolvePlantAssemblies() {
                let filteredList = [];

                if (dataList && dataList.length) {
                    filteredList = _.filter(dataList, function (item) {
                        return item.IsChecked;
                    });
                }
                container.data.itemList = dataList;
                return filteredList;
            }

            service.refreshGrid = function refreshGrid() {
                service.listLoaded.fire();
            };

            service.getSelectedPackages = function getSelectedItems() {
                let resultSet = service.getSelectedEntities();
                return resultSet;
            };

            service.parentService = function parentService() {
                return estimateMainService;
            };
            return service;
        }]
    );
})();
