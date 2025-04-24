/**
 * Created by anl on 1/23/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.report';

    angular.module(moduleName).value('productionplanningReoprt2ProductDialogListColumns', {
        getStandardConfigForListView: function () {
            return {
                columns: [
                    {
                        id: 'code',
                        field: 'Code',
                        name: 'Code',
                        name$tr$: 'cloud.common.entityCode',
                        readonly: true,
                        sortable: true,
                        editor: null

                    },
                    {
                        id: 'description',
                        field: 'DescriptionInfo',
                        name: 'Description',
                        name$tr$: 'cloud.common.entityDescription',
                        formatter: 'translation',
                        editor: null,
                        sortable: true,
                        readonly: true
                    }
                ]
            };
        }
    });

    angular.module(moduleName).factory('productionplanningReoprt2ProductDialogListService', Report2ProductDialogListService);
    Report2ProductDialogListService.$inject = ['$http', '$log', '$q', '$injector', 'PlatformMessenger',
        'treeviewListDialogListFactoryService'
    ];
    function Report2ProductDialogListService($http, $log, $q, $injector, PlatformMessenger,
                                              treeviewListDialogListFactoryService) {

        var moduleId = '889ba8a32ba94819a714d20ede7eaf95';
        var serviceOptions = {
            flatRootItem: {
                module: angular.module(moduleName),
                serviceName: 'productionplanningReoprt2ProductDialogListService',
                httpCRUD: {
                    route: globals.webApiBaseUrl + 'productionplanning/common/product/',
                    endRead: 'listForMounting'
                },
                actions: {},
                entityRole: {
                    root: {
                        itemName: 'ProductDto',
                        descField: 'DescriptionInfo.Translated'
                    }
                }
            }
        };
        serviceOptions.getUrlFilter = function getUrlFilter() {
//            var activityEntity = $injector.get('productionplanningMountingActivityDataService').getSelected();
//            return 'activityFk=' + activityEntity.Id;
            var report = $injector.get('productionplanningReportReportDataService').getSelected();
            return 'activityFk=' + report.ActivityFk;
        };
        var serviceContainer = treeviewListDialogListFactoryService.getService(moduleId, serviceOptions, undefined, true);

        var service = serviceContainer.service;

        angular.extend(service, {
            refresh: refresh,
            search: search
        });

        function refresh() {
            var defer = $q.defer();
            var index = 0;
            service.setAllItems([]);
            service.loadAllItems().then(function(productList){
                var report2ProductService = $injector.get('productionplanningReport2ProductDataService');
                var addedProducts = report2ProductService.getAddedProduct();
                if(addedProducts !== null) {
                    var ids = [];
                    _.forEach(productList, function (product) {
                        _.forEach(addedProducts, function (added) {
                            if (added.Id === product.Id) {
                               ids.push(index);
                            }
                        });
                        index++;
                    });

                    //remove added product
                    _.forEach(ids.reverse(), function(id){
                        productList.splice(id,1);
                    });
                }
                service.setAllItems(productList);
                service.setList(productList);
                defer.resolve(productList);
            });
            return defer.promise;
        }

        function search(searchString){
            var options = service.getOptions();
            options.searchString = searchString && searchString.length > 0 ? searchString.toLowerCase() : '';
            refresh().then(function (listE){
            var listSearchByCodeDescriptionE = service.getItemsByCodeDescription(options.searchString, listE);
                service.setList(listSearchByCodeDescriptionE);
            });
        }

        return service;
    }
})(angular);