
(function (angular) {
    /* global globals, _ */
    'use strict';

    let moduleName = 'estimate.parameter';
    angular.module(moduleName).factory('estimateParameterValueAssignmentGridService', ['_', '$http', '$translate', 'platformDataServiceFactory',
        '$injector', 'estimateRuleParameterConstant', '$rootScope', '$q', '$timeout',
        function (_, $http, $translate, platformDataServiceFactory, $injector, estimateRuleParameterConstant, $rootScope, $q, $timeout) {

            let service = {};
            let gridId = null,
                itemsToDelete = [],
                itemsToSave = [];
            let paramValueLookup = null;

            let estimateRuleParameterServiceOption = {
                flatRootItem: {
                    module: moduleName,
                    serviceName: 'estimateParameterValueAssignmentGridService',
                    httpRead: {
                        route: globals.webApiBaseUrl + 'basics/customize/estimationparametervalue/',
                        endRead: 'getListByEstParameter',
                        usePostForRead: true,
                        initReadData: initReadData
                    },
	                presenter: {
		                list: {
			                incorporateDataRead: function incorporateDataRead(resources, data) {
				                $injector.get('estimateMainCommonCalculationService').resetParameterDetailValueByCulture(resources);
				                return serviceContainer.data.handleReadSucceeded(resources, data);
			                }
		                }
	                },
                    entityRole: {
                        root: {
                            itemName: 'estimateParameterValue',
                            moduleName: 'estimate.parameter.EstimateParameterValue',
                            mainItemName: 'EstimateParameterValue'
                        }
                    },
                    actions: {
                        delete: true,
                        create: 'flat',
                    },
                    entitySelection: {supportsMultiSelection: true}
                }
            };

            let serviceContainer = platformDataServiceFactory.createNewComplete(estimateRuleParameterServiceOption);
            service = serviceContainer.service;
            serviceContainer.data.usesCache=false;
            service.showHeaderAfterSelectionChanged = null;
            serviceContainer.data.doUpdate = function () {
                $rootScope.$emit('updateRequested');
                return $q.when();
            }

            angular.extend(service, {
                setGridId:setGridId,
                getGridId:getGridId,
                addItem: addItem,
                getItemsToSave : getItemsToSave,
                getItemsToDelete : getItemsToDelete,
                clearData: clearData,
                fieldChange: fieldChange,
                setUniqueIsDefault: setUniqueIsDefault,
                hasError: hasError
            });

            function initReadData(readData) {
                let parameter = $injector.get('estimateParameterDialogDataService').getCurrentEstParameter();
                readData.ParameterFk = parameter.Id;
                return readData;
            }

            function addItem() {
                let currentEstParameter = $injector.get('estimateParameterDialogDataService').getCurrentEstParameter();
                let creationData = {
                    ParameterFk: currentEstParameter.Id,
                    ValueType: currentEstParameter.ParamvaluetypeFk,
                };
                $http.post(globals.webApiBaseUrl + 'basics/customize/estimationparametervalue/createParameterValue', creationData).then(function (response) {
                    if(response && response.data){
                        service.validateDescriptionInfo(response.data,response.data.DescriptionInfo.Translated,'DescriptionInfo');
                        serviceContainer.data.itemList.push(response.data);
                        serviceContainer.data.listLoaded.fire(null, serviceContainer.data.itemList);
                        addItemToSave(response.data);
                        service.setSelected(response.data);
                    }
                });
            }

            service.deleteEntities = deleteEntities;
            function deleteEntities(items) {
                addItemsToDelete(items);
                let currentEstParameter = $injector.get('estimateParameterDialogDataService').getCurrentEstParameter();
                if(currentEstParameter.Islookup){
                    _.forEach(items,function (item) {
                        if(currentEstParameter.ValueDetail === item.Id || currentEstParameter.ValueDetail === item.Id.toString()){
                            paramValueLookup.selectItem(null);
                        }
                    })
                }
                serviceContainer.data.listLoaded.fire(null, serviceContainer.data.itemList);
            }

            function addItemsToDelete(items){
                itemsToDelete = itemsToDelete ? itemsToDelete : [];
                itemsToDelete = itemsToDelete.concat(items);

                _.forEach(items,function (d1) {
                    itemsToSave = _.filter(itemsToSave,function (d2) {
                        return d2.Id !== d1.Id;
                    });

                    serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList,function (d2) {
                        return d2.Id !== d1.Id;
                    });
                });
            }

            service.refreshGrid = function refreshGrid() {
                service.listLoaded.fire();
            };

            function setGridId(value) {
                gridId = value;
            }
            function getGridId() {
                return gridId;
            }

            function addItemToSave(item) {
                itemsToSave.push(item);
            }

            function getItemsToSave(){
                return itemsToSave.length ? itemsToSave : null;
            }

            function getItemsToDelete(){
                return itemsToDelete.length ? itemsToDelete : null;
            }

            let baseSetSelected = service.setSelected;
            service.setSelected = function setSelected(entity) {
                if(entity){
                    serviceContainer.data.doClearModifications(entity,serviceContainer.data);
                }
                baseSetSelected(entity);
            };

            function clearData() {
                _.forEach(itemsToSave, function (item) {
                    serviceContainer.data.doClearModifications(item,serviceContainer.data);
                })
                serviceContainer.data.itemList = [];
                itemsToSave =[];
                itemsToDelete =[];
            }

            function fieldChange(item, field) {
                if(field === 'DescriptionInfo'){
                    let oldDescriptionInfoData = _.filter(service.getList(),function (d) {
                        return d.DescriptionInfo.Translated === item.DescriptionInfoTranslated;
                    });
                    if(oldDescriptionInfoData.length === 1){
                        removeError(oldDescriptionInfoData[0],'DescriptionInfo');
                    }

                    item.DescriptionInfoTranslated = item.DescriptionInfo.Translated;
                    service.validateDescriptionInfo(item,item.DescriptionInfo.Translated,field);
                    service.gridRefresh();
                }
	            if ((field === 'ValueDetail' ||field === 'Value') && Object.prototype.hasOwnProperty.call(item,'SValueDetail')) {
		            item.ValueDetail = item.SValueDetail;
		            service.gridRefresh();
	            }

                setModifyEntity(item);
                let currentEstParameter = $injector.get('estimateParameterDialogDataService').getCurrentEstParameter();
                if(currentEstParameter.Islookup && (currentEstParameter.ValueDetail === item.Id || currentEstParameter.ValueDetail === item.Id.toString())){
                    if(paramValueLookup && paramValueLookup.selectText){
                        paramValueLookup.selectText(item);
                    }
                }
            }

            function setModifyEntity(item) {
                if(!itemsToSave.length){
                    itemsToSave.push(item);
                    return;
                }

                let entityToSave = _.find(itemsToSave,{'Id': item.Id});
                if(!entityToSave){
                    itemsToSave.push(item);
                }else {
                    angular.extend(entityToSave,item);
                }
            }

            function setUniqueIsDefault(entity) {
                let items = service.getList();

                _.forEach(items, function (item) {
                    if(item.IsDefault){
                        setModifyEntity(item);
                    }
                    item.IsDefault = item.Id === entity.Id;
                });
                serviceContainer.data.itemList = items;
                service.gridRefresh();
            }

            service.validateDescriptionInfo = function validateDescriptionInfo(entity, value, model) {
                let result = false;
                if (value) {
                    let dataList = service.getList();
                    if(dataList){
                        let find = _.filter(dataList,function (item) {
                            return item.DescriptionInfo.Translated === value;
                        });
                        if(find.length > 1){
                            entity.__rt$data = entity.__rt$data || {};
                            entity.__rt$data.errors = entity.__rt$data.errors || {};
                            entity.__rt$data.errors.DescriptionInfo = {error: $translate.instant('cloud.common.uniqueValueErrorMessage', {fieldName: model})};
                        }else {
                            result = true;
                        }
                    }
                }else {
                    entity.__rt$data = entity.__rt$data || {};
                    entity.__rt$data.errors = entity.__rt$data.errors || {};
                    entity.__rt$data.errors.DescriptionInfo = {error: $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {object: 'DescriptionInfo'})};
                }

                if(result){
                    removeError(entity, model);
                }
                return result;
            };

            function removeError(item, model){
                if(item.__rt$data && item.__rt$data.errors && item.__rt$data.errors[model]){
                    delete  item.__rt$data.errors[model];
                }
            }

            function hasError() {
                let findErrorData = _.find(service.getList(),function (item) {
	                return item.__rt$data && item.__rt$data.errors && (item.__rt$data.errors.DescriptionInfo||item.__rt$data.errors.ValueDetail);
                });
                return !!findErrorData;
            }

            service.setCurrentEstParameterValue = function (item) {
                let estimateParameterDialogDataService = $injector.get('estimateParameterDialogDataService');
                let currentEstParameter = estimateParameterDialogDataService.getCurrentEstParameter();

                if(currentEstParameter.Islookup && (currentEstParameter.ValueDetail === item.Id || currentEstParameter.ValueDetail === item.Id.toString())){
                    if(item.ValueType === estimateRuleParameterConstant.Text){
                        currentEstParameter.ValueText = item.ValueText;
                        currentEstParameter.DefaultValue = null;
                    }else {
                        currentEstParameter.DefaultValue = item.Value;
                        currentEstParameter.ValueText = null;
                    }
                }
            }
            
            service.setParamValueLookup = function (cusParamValueLookup) {
                paramValueLookup = cusParamValueLookup;
            }

            return service;
        }
    ]);

})(angular);
