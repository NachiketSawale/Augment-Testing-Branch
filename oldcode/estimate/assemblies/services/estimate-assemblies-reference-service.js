/*
* $Id$
* Copyright(c) RIB Software GmbH
*/

(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.assemblies';
	let assemblyReferenceModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsCostCodesReferenceDataService
     * @function
     *
     * @description
     * basicsCostCodesReferenceDataService is the data service for all costcodes related functionality.
     */

	assemblyReferenceModule.factory('estimateAssembliesReferenceService',['$http','$injector','platformDataServiceFactory','estimateAssembliesService',
		function ($http,$injector,platformDataServiceFactory,estimateAssembliesService) {

			let serviceContainer = platformDataServiceFactory.createNewComplete({
				flatRootItem: {
					module: assemblyReferenceModule,
					serviceName: 'estimateAssembliesReferenceService',
					entityNameTranslationID: 'estimate.assemblies.reference',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/assemblies/',
						endRead: 'getmasterassemblyreferences',
						initReadData: function initReadData(readData) {
							let selectedItem = estimateAssembliesService.getSelected();
							readData.filter = '?assemblyId=' + selectedItem.Id;
						}
					},
					useItemFilter: true,
					entityRole: {
						node: {itemName: 'EstAssemblyReference', parentService: estimateAssembliesService}
					},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData,data) {
								_.forEach(readData, function(obj, index) {
									obj.Id = index + 1;
								});
								serviceContainer.data.sortByColumn(readData);
								return serviceContainer.data.handleReadSucceeded(readData, data);
							}
						}
					},
					actions: {delete: false, create: false}
				}
			});

			let service = serviceContainer.service;

			return service;
		}
	]);

})();