/*
 * Created by alm on 17.20.2021.
 */

	(function (angular) {
		/* global globals */
		'use strict';

		var moduleName = 'basics.procurementstructure';
		angular.module(moduleName).factory('basicsProcurementStructureTaxCodeService', ['$injector', 'platformDataServiceFactory', 'basicsProcurementStructureService','basicsLookupdataLookupFilterService','basicsLookupdataLookupDescriptorService',

			function ($injector, platformDataServiceFactory, parentService,basicsLookupdataLookupFilterService,basicsLookupdataLookupDescriptorService) {
				var basicsTaxCodeServiceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsProcurementStructureTaxCodeService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/procurementstructure/taxcode/',
						},
						entityRole: {
							leaf: {
								itemName: 'PrcStructureTax',
								parentService: parentService
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function incorporateDataRead(readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									var dataRead = serviceContainer.data.handleReadSucceeded(readData.Main, data);
									return dataRead;
								},
								handleCreateSucceeded: function initCreationData(newData) {
									var selectedItem = parentService.getSelected();
									if (selectedItem) {
										newData.PrcStructureFk = selectedItem.Id;
									}
								},
								initCreationData: initCreationData
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(basicsTaxCodeServiceOption);
				var service = serviceContainer.service;
				var filters=[{
					key: 'taxCodeByLedgerContext-filter',
					fn: function taxCodeByLedgerContext(item, context) {
						return (item.LedgerContextFk=== context.MdcLedgerContextFk)&&item.IsLive;
					}
				   },
					{
					key: 'saleTaxCodeByLedgerContext-filter',
					fn: function (item, context) {
						return (item.LedgerContextFk === context.MdcLedgerContextFk)&&item.IsLive;
					}
				}];
				basicsLookupdataLookupFilterService.registerFilter(filters);
				return service;

				function initCreationData(creationData) {
					creationData.PKey1 = parentService.getSelected().Id;
				}
			}]);
	})(angular);
