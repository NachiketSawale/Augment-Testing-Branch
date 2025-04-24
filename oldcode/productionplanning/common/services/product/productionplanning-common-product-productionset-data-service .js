(function (angular) {
    'use strict';
    /**
     * @ngdoc service
     * @name productionplanningCommonProductIProductionSetDataService
     * @function
     *
     * @description
     * productionplanningCommonProductProductionSetDataService is the data service for all entities related functionality.
     */
    const moduleName = 'productionplanning.common';
    let masterModule = angular.module(moduleName);

    masterModule.factory('productionplanningCommonProductProductionSetDataService', ProductionplanningCommonProductProductionSetDataService);

    ProductionplanningCommonProductProductionSetDataService.$inject = [
        '$injector',
        'productionplanningCommonProductDataServiceFactory',
        'productionplanningProductionsetMainService',
        'basicsCommonBaseDataServiceReferenceActionExtension'];
    function ProductionplanningCommonProductProductionSetDataService($injector,
                                                                     productionplanningCommonProductDataServiceFactory,
                                                                     customerDataService,
                                                                     referenceActionExtension) {
        var serviceOption = {
            flatNodeItem: {
                serviceName: 'productionplanningCommonProductProductionSetDataService',
                httpCRUD : {
                    route: globals.webApiBaseUrl + 'productionplanning/common/product/',
                    endCreate: 'productionSetCreate',
                    endRead: 'customlistbyforeignkey',
                    initReadData: function initReadData(readData) {
                        let mainItemId = customerDataService.getSelected().Id || -1;
                        readData.filter = `?foreignKey=ProductionSetFk&mainItemId=${mainItemId}`;
                    }
                },
                entityRole: {
                    node: {
                        itemName: 'Product',
                        parentService: customerDataService,
                        parentFilter: 'productionSetFk'
                    }
                },
                actions: {}
            },
            isNotRoot: true
        };

        /* jshint -W003 */
        var serviceContainer = productionplanningCommonProductDataServiceFactory.createService(serviceOption);

        referenceActionExtension.addReferenceActions(serviceContainer, {
            createReference: true,
            deleteReference: true,
            referenceForeignKeyProperty: 'ProductionSetFk'
        });

        function onReferenceChanged() {
            var parentItem = customerDataService.getSelected();
            if(parentItem)
            {
                parentItem.ActualQuantity = _.sumBy(serviceContainer.data.itemList, function (item) {
                    return item.ProductionSetFk === parentItem.Id ? item.PlanQuantity : 0;
                });
                parentItem.RemainingQuantity = parentItem.Quantity - parentItem.ActualQuantity;
               // customerDataService.markItemAsModified(parentItem);
                customerDataService.gridRefresh();
            }
        }

        serviceContainer.service.registerReferenceCreated(onReferenceChanged);
        serviceContainer.service.registerReferenceDeleted(onReferenceChanged);
        serviceContainer.service.registerItemModified(onReferenceChanged);

        // when update done, it will merge the response data to dataservice
        // after merge done, it will fire "itemModified" event
        // so unregister this event before morge and add back after merge
        var orgMergeInUpdateData = serviceContainer.service.mergeInUpdateData;
        serviceContainer.service.mergeInUpdateData = function () {
            serviceContainer.service.unregisterItemModified(onReferenceChanged);
            orgMergeInUpdateData.apply(this, arguments);
            serviceContainer.service.registerItemModified(onReferenceChanged);
        };

        serviceContainer.service.dialogConfig = {
            headerText: moduleName + '.product.listTitle',
            listGridID:'e76a78ec58614a82af2c4dbd07e981c8',
            listServiceName:'ppsCommonDialogProductListService',
            listColumnsServiceName:'ppsCommonDialogProductListColumns',

            isShowTreeview: true,
            treeviewGridID:'a037f62267e14a8584005f1e89e5122c',
            treeviewServiceName:'ppsCommonDialogHeaderStructureTreeviewService',
            treeviewColumnsServiceName:'ppsCommonDialogHeaderStructureTreeviewColumns',
            treeviewParentProp:'ParentFk',
            treeviewChildProp: 'ChildItems'
        };

        serviceContainer.service.showReferencesSelectionDialog = function createProductRelation() {
            $injector.get('treeviewListDialogDataService').showTreeview(serviceContainer);
        };

        serviceContainer.service.ok = function ok(selectedItems) {

            if (!_.isEmpty(selectedItems)) {
                var items = _.sortBy(selectedItems, 'Id');
                _.forEach(serviceContainer.service.getList(), function (item) {
                    _.remove(items, {'Id': item.Id});
                });
                var foreignKeyValue = serviceContainer.data.parentService.getSelected().Id;
                serviceContainer.service.createReferences(selectedItems, 'ProductionSetFk', foreignKeyValue);

            }
        };
        return serviceContainer.service;

    }
})(angular);

