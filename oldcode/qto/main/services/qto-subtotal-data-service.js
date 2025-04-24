(function (angular) {
	/* global  globals, _ */
	'use strict';
	var qtoMainModule = angular.module('qto.main');

	/* jshint -W072 */ // many parameters because of dependency injection
	qtoMainModule.factory('qtoMainSubTotalService',
		['platformDataServiceFactory', 'qtoMainHeaderDataService',
			'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'qtoMainDetailService',
			function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService, runtimeDataService, qtoMainDetailService) {

				var service = {};
				var serviceContainer ={};
				var filterLocations, filterBoqs, filterStructures,filterBillTos;
				var serviceOption = {
					flatLeafItem: {
						module: qtoMainModule,
						httpRead: {
							route: globals.webApiBaseUrl + 'qto/main/detail/',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								var qtoHeader = parentService.getSelected();
								readData.MainItemId = qtoHeader.Id;
								readData.Locations = filterLocations || [];
								readData.Boqs = filterBoqs || [];
								readData.Structures = filterStructures || [];
								readData.BillTos = filterBillTos || [];
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									var items = readData.Main || [];
									if (items && items.length > 0) {
										items = _.filter(items, function (k) {
											return (k.QtoLineTypeFk === 3 || k.QtoLineTypeFk === 4);
										});
									}
									var dataRead = serviceContainer.data.handleReadSucceeded(items, data);
									angular.forEach(items, function (item) {
										service.updateReadOnly(item, ['PrjLocationFk', 'BoqItemFk', 'BasUomFk', 'SubTotal', 'RemarkText']);
									});

									return dataRead;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'SubTotal',
								parentService: parentService
							}
						},
						modification: {simple: true},
						actions: {}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				serviceContainer.data.doClearModifications = function () {
				};
				service.updateReadOnly = function (item, modelArray) {
					_.forEach(modelArray, function (model) {
						runtimeDataService.readonly(item, [
							{field: model, readonly: true}
						]);
					});
					service.gridRefresh();
				};
				service.setFilterLocations = function setFilterLocations(locations) {
					filterLocations = locations;
				};

				service.setFilterBoqs = function setFilterBoqs(boqs) {
					filterBoqs = boqs;
				};

				service.setFilterBillTos = function setFilterBillTos(billTos) {
					service.filterBillTos = billTos;
				};

				service.setFilterStructures = function setFilterStructures(structures) {
					filterStructures = structures;
				};
				service.setQtoDetailSelectItem = function (item) {
					qtoMainDetailService.setSelected(item);
				};

				parentService.refreshSubTotal.register(service.load);

				return service;
			}
		]);
})(angular);