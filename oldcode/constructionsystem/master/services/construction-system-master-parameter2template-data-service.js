/**
 * Created by chi on 5/26/2016.
 */
/* global globals,_ */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterParameter2TemplateDataService', constructionSystemMasterParameter2TemplateDataService);
	constructionSystemMasterParameter2TemplateDataService.$inject = [
		'platformDataServiceFactory',
		// 'constructionSystemMasterParameterDataService',
		'basicsLookupdataLookupDescriptorService',
		'constructionSystemMasterParameterFormatterProcessor',
		'constructionSystemMasterTemplateDataService',
		'basicsLookupdataLookupFilterService',
		'constructionSystemMasterParameterReadOnlyProcessor',
		'basicsCommonReadDataInterceptor',
		'PlatformMessenger'
	];
	/* jshint -W072 */
	function constructionSystemMasterParameter2TemplateDataService(
		platformDataServiceFactory,
		// constructionSystemMasterParameterDataService,
		basicsLookupdataLookupDescriptorService,
		constructionSystemMasterParameterFormatterProcessor,
		constructionSystemMasterTemplateDataService,
		basicsLookupdataLookupFilterService,
		constructionSystemMasterParameterReadOnlyProcessor,
		basicsCommonReadDataInterceptor,
		PlatformMessenger) {
		var serviceOptions = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMasterParameter2TemplateDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'constructionsystem/master/parameter2template/'
				},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					leaf: {
						itemName: 'CosParameter2Template',
						parentService: constructionSystemMasterTemplateDataService,
						doesRequireLoadAlways: false
					}
				},
				dataProcessor: [constructionSystemMasterParameterFormatterProcessor, constructionSystemMasterParameterReadOnlyProcessor],
				actions: {delete: false, create: false}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;

		service.defaultTypeChanged=new PlatformMessenger();

		function registerDefaultTypeChanged(fn){
			service.defaultTypeChanged.register(fn);
		}

		service.registerDefaultTypeChanged=registerDefaultTypeChanged;

		service.fireDefaultTypeChanged=function (){
			service.defaultTypeChanged.fire();
		};

		serviceContainer.service.name = 'construction.system.master.parameter2template';
		constructionSystemMasterTemplateDataService.updatedDoneMessenger.register(serviceContainer.service.gridRefresh);
		constructionSystemMasterTemplateDataService.completeEntityCreated.register(createList);
		basicsCommonReadDataInterceptor.init(serviceContainer.service, serviceContainer.data);

		var lookupFilters = [
			{
				key: 'parameter2template-parameter-value-filter',
				serverSide: true,
				fn: function(item) {
					return 'CosParameterFk=' + item.CosParameterFk;
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

		return service;

		// ////////////////////////////
		function incorporateDataRead(readData, data) {
			if (readData && angular.isArray(readData.Main)) {
				basicsLookupdataLookupDescriptorService.attachData(readData);
				return data.handleReadSucceeded(readData.Main, data);
			} else {
				return data.handleReadSucceeded(readData, data);
			}
		}

		// noinspection JSUnusedLocalSymbols
		function createList(e, completeData) {
			if (!completeData) {
				return;
			}
			/** @namespace completeData.CosParameter2TemplateToSave */
			var newList = completeData.CosParameter2TemplateToSave;
			if (angular.isArray(newList) && newList.length > 0) {
				serviceContainer.service.setCreatedItems(newList, true);
				_.forEach(newList, function(item) {
					serviceContainer.service.markItemAsModified(item);
				});
			}
		}
	}
})(angular);