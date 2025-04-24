(function (angular) {
	'use strict';

	/* globals globals */

	var qtoFormulaModule = angular.module('qto.formula');

	/* jshint -W072 */ // many parameters because of dependency injection
	qtoFormulaModule.factory('qtoFormulaUomDataService',
		['_','qtoFormulaDataService', 'platformDataServiceFactory', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService','platformRuntimeDataService','qtoMainFormulaType',
			function (_,parentService, dataServiceFactory, basicsLookupdataLookupFilterService, basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService,platformRuntimeDataService,qtoMainFormulaType) {

				var service = {};
				var serviceContainer = null,
					tmpServiceInfo = {
						flatLeafItem: {
							serviceName: 'qtoFormulaUomDataService',
							module: qtoFormulaModule,
							httpCRUD: { route: globals.webApiBaseUrl + 'qto/formula/uom/' },
							presenter: {
								list: {
									incorporateDataRead: function (readData, data) {
										basicsLookupdataLookupDescriptorService.attachData(readData);
										var items = readData.Main ? readData.Main : readData;
										service.updateColumnReadOnly(items);
										return serviceContainer.data.handleReadSucceeded(items, data);
									}
								},
								initCreationData: function initCreationData(creationData) {
									creationData.MainItemId = creationData.parentId;
									var itemList = service.getList();
									service.updateColumnReadOnly(itemList);
								},
								sortOptions: {
									initialSortColumn: {
										field: 'Code',
										id: 'code'
									}, isAsc: true
								}
							},
							entityRole: {
								leaf: {
									itemName: 'QtoFormulaUom',
									parentService: parentService
								}
							}
						}
					};

				serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo);
				service = serviceContainer.service;
				var data = serviceContainer.data;
				data.onCreateSucceeded = function onCreateSucceededInList(newItem, data) {
					var Items=[];
					Items.push(newItem);
					service.updateColumnReadOnly(Items);
					return data.handleOnCreateSucceeded(newItem, data);
				};

				service.updateColumnReadOnly = function updateColumnReadOnly(items){
					var parentItem = parentService.getSelected();
					if(items === null || items === undefined){
						items = service.getList();
					}
					var OperatorColumns = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];
					var modelScriptArray = ['Value1IsActive', 'Value2IsActive', 'Value3IsActive', 'Value4IsActive', 'Value5IsActive'];

					if(parentItem && parentItem.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput){
						_.forEach(items, function (item) {
							service.updateReadOnly(item, OperatorColumns, true);

							var _readOnly = parentItem.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput;
							service.updateReadOnly(item, modelScriptArray, _readOnly);
						});
					}else{
						_.forEach(items, function (item) {
							service.updateReadOnly(item, OperatorColumns, false);
							service.updateReadOnly(item, modelScriptArray, false);
						});
					}
				};

				service.updateReadOnly = function (item, modelArray, value) {
					_.forEach(modelArray, function (model) {
						platformRuntimeDataService.readonly(item, [
							{field: model, readonly: value}
						]);
					});
				};


				return service;
			}]);
})(angular);