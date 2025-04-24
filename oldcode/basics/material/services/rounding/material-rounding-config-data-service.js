(function () {
    /* global globals */
    'use strict';

    let moduleName = 'basics.material';
    angular.module(moduleName).factory('materialRoundingConfigDataService', ['$http', '$injector', '_', 'PlatformMessenger', 'materialRoundingConfigTypeLookupService', 'materialRoundingConfigDetailDataService', 'platformDataServiceFactory',
        function ($http, $injector, _, PlatformMessenger, roundingConfigTypeLookupService, roundingConfigDetailDataService, platformDataServiceFactory) {

            let currentItem = {},
                completeData = {},
                dialogMode = '',
                mdcContext = null,
                modified = false;

            let service = {
                load: load,
                setData: setData,
                clear: clear,
                updateRoundingConfigDetails: updateRoundingConfigDetail,
                getRoundingConfig: getRoundingConfig,
                getRoundingConfigDetail: getRoundingConfigDetail,
                provideUpdateData: provideUpdateData,
                getDialogMode: getDialogMode,
                getCurrentItem: getCurrentItem,
                isModified: isModified,
                setModified: setModified,
                onItemChange: new PlatformMessenger()
            };

            let serviceOption = {
                module: angular.module(moduleName),
                entitySelection: {},
                modification: {multi: {}},
                translation: {
                    uid: 'materialRoundingConfigDetailDataService',
                    title: 'Title',
                    columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
                    dtoScheme: {moduleSubModule: 'Basics.Material', typeName: 'MaterialRoundingConfigDto'}
                }
            };

            let container = platformDataServiceFactory.createNewComplete(serviceOption);
            container.data.itemList = [];
            angular.extend(service, container.service);
            return service;

            // load complete  Rounding Config by typeId
            function load(typeId) {
                roundingConfigTypeLookupService.setSelectedItemId(typeId);
                return roundingConfigTypeLookupService.getItemByIdAsync(typeId).then(function (item) {
                    if (item && item.Id) {
                        return $http.get(globals.webApiBaseUrl + 'basics/material/roundingconfig/getmaterialroundingconfigbyid?id=' + item.MaterialRoundingConfigFk).then(function (response) {
                            response.data.MaterialRoundingConfigType = item;
                            setData(response.data, dialogMode);
                            return currentItem;
                        });
                    }
                });
            }

            function resetCurrentItem(item) {
                if (_.isObject(item)) {
                    Object.keys(item).forEach(key => delete item[key]);
                    item.roundingConfigTypeFk = null;
                    item.roundingConfigDesc = null;
                    item.roundingConfigDetail = [];
                }
            }

            // set config type, config data
            function setData(data, dlgMode, contextFk) {

                if (!_.isObject(data) || _.isEmpty(data)) {
                    completeData = {};

                    // !! Attention !!
                    // For the current item is potentially already delivered as "dataItem" to the corresponding rounding dialog config
                    // we cannot set a new empty currentItem object here for this would break the connection to the dialog form.
                    // So we simply reset the properties to an initial state.
                    resetCurrentItem(currentItem);


                    if (_.isNumber(contextFk) && contextFk > 0) {
                        mdcContext = contextFk;

                        roundingConfigTypeLookupService.setMdcContextId(mdcContext);
                        roundingConfigTypeLookupService.setSelectedItemId(currentItem.roundingConfigTypeFk);

                        roundingConfigTypeLookupService.loadData();
                    }


                    service.onItemChange.fire(currentItem);

                    return currentItem;
                }

                dialogMode = dlgMode;

                completeData = {
                    MaterialRoundingConfigType: data.MaterialRoundingConfigType,
                    MaterialRoundingConfig: data.MaterialRoundingConfig,
                    MaterialRoundingConfigDetail: data.MaterialRoundingConfigDetails
                };
                currentItem.roundingConfigTypeFk = _.isObject(completeData.MaterialRoundingConfigType) ? completeData.MaterialRoundingConfigType.Id : null;
                roundingConfigTypeLookupService.setSelectedItemId(currentItem.roundingConfigTypeFk);
                currentItem.roundingConfigDesc = !_.isEmpty(completeData.MaterialRoundingConfig) ? completeData.MaterialRoundingConfig.DescriptionInfo.Translated : null;
                currentItem.roundingConfigDetail = completeData.MaterialRoundingConfigDetail ? completeData.MaterialRoundingConfigDetail : [];
                //let roundingConfigFk = data.Id;
                // currentItem.isEditRoundingConfigType = (_.isNumber(roundingConfigFk) && roundingConfigFk > 0) && !_.isNumber(currentItem.roundingConfigTypeFk);

                if (contextFk > 0) {
                    mdcContext = contextFk;
                } else if (data.MaterialRoundingConfigType) {
                    mdcContext = data.MaterialRoundingConfigType.ContextFk;
                }
                currentItem.ContextFk = mdcContext;

                roundingConfigTypeLookupService.setMdcContextId(mdcContext);
                roundingConfigTypeLookupService.setSelectedItemId(currentItem.roundingConfigTypeFk);

                roundingConfigTypeLookupService.loadData();

                service.onItemChange.fire(currentItem);

                return currentItem;
            }

            // provide current  config type, config updateData
            function provideUpdateData(data) {
                //angular.extend(data, completeData);
                data.ContextFk = currentItem.ContextFk;
                data.MaterialRoundingConfig = completeData.MaterialRoundingConfig;
                data.MaterialRoundingConfig.DescriptionInfo.Description = currentItem.roundingConfigDesc;
                data.MaterialRoundingConfig.DescriptionInfo.Translated = currentItem.roundingConfigDesc;
                data.materialRoundingConfigDetails = currentItem.roundingConfigDetail;
            }

            function getRoundingConfig() {
                return completeData.MaterialRoundingConfig;
            }

            function getRoundingConfigDetail() {
                return completeData.MaterialRoundingConfigDetail;
            }

            function getDialogMode() {
                return dialogMode;
            }

            function updateRoundingConfigDetail(items) {
                completeData.MaterialRoundingConfigDetail = items;
                currentItem.roundingConfigDetail = items;
                // service.onItemChange.fire(currentItem);
            }


            function getCurrentItem() {
                return currentItem;
            }

            function setModified(ismodified) {
                modified = ismodified;
            }

            function isModified() {
                return modified;
            }

            function clear() {
                // The following approach is taken for the sake of keeping the according object reference alive, but deleting its properties
                Object.keys(currentItem).forEach(key => delete currentItem[key]);
                Object.keys(completeData).forEach(key => delete completeData[key]);
            }
        }
    ]);
})();
