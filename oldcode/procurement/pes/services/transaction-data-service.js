/**
 * Created by lcn on 06.22.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPesTransactionDataService',
		['$translate', 'platformDataServiceFactory', 'procurementPesHeaderService', 'platformDataServiceProcessDatesBySchemeExtension', 'ServiceDataProcessDatesExtension','procurementContextService',
			function ($translate, dataServiceFactory, parentService, platformDataServiceProcessDatesBySchemeExtension, ServiceDataProcessDatesExtension, procurementContextService) {
				var serviceContainer;
				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'PesTransactionDto',
						moduleSubModule: 'Procurement.Pes'
					}
				);

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementPesTransactionDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/pes/transaction/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						dataProcessor: [dateProcessor, new ServiceDataProcessDatesExtension(['DateDocument', 'DateDeliveredFrom', 'DateDelivered'])],
						actions: {delete: false, create: false, bulk: false},
						entityRole: {
							node: {
								itemName: 'PesTransaction',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						transaction:{
							uid: 'procurementPesTransactionDataService',
							columns: [
								{ header: 'procurement.pes.transaction.currency', field: 'Currency' },
								{ header: 'cloud.common.entityCode', field: 'Code' },
								{ header: 'cloud.common.entityDescription', field: 'Description' },
								{ header: 'cloud.common.entityIncoterms', field: 'Incoterm' },
								{ header: 'procurement.common.transaction.nominalAccount', field: 'NominalAccount' },
								{ header: 'procurement.common.transaction.nominaldimension1name', field: 'NominalDimension1' },
								{ header: 'procurement.common.transaction.nominaldimension2name', field: 'NominalDimension2' },
								{ header: 'procurement.common.transaction.nominaldimension3name', field: 'NominalDimension3' },
								{ header: 'procurement.common.transaction.vatCode', field: 'VatCode' },
								{ header: 'procurement.common.transaction.controllingUnitCode', field: 'ControllingUnitCode' },
								{ header: 'procurement.common.transaction.controllingUnitAssign01', field: 'ControllingUnitAssign01' },
								{ header: 'procurement.common.transaction.controllingUnitAssign01Desc', field: 'ControllingunitAssign01desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign02', field: 'ControllingUnitAssign02' },
								{ header: 'procurement.common.transaction.controllingUnitAssign02Desc', field: 'ControllingunitAssign02desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign03', field: 'ControllingUnitAssign03' },
								{ header: 'procurement.common.transaction.controllingUnitAssign03Desc', field: 'ControllingunitAssign03desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign04', field: 'ControllingUnitAssign04' },
								{ header: 'procurement.common.transaction.controllingUnitAssign04Desc', field: 'ControllingunitAssign04desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign05', field: 'ControllingUnitAssign05' },
								{ header: 'procurement.common.transaction.controllingUnitAssign05Desc', field: 'ControllingunitAssign05desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign06', field: 'ControllingUnitAssign06' },
								{ header: 'procurement.common.transaction.controllingUnitAssign06Desc', field: 'ControllingunitAssign06desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign07', field: 'ControllingUnitAssign07' },
								{ header: 'procurement.common.transaction.controllingUnitAssign07Desc', field: 'ControllingunitAssign07desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign08', field: 'ControllingUnitAssign08' },
								{ header: 'procurement.common.transaction.controllingUnitAssign08Desc', field: 'ControllingunitAssign08desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign09', field: 'ControllingUnitAssign09' },
								{ header: 'procurement.common.transaction.controllingUnitAssign09Desc', field: 'ControllingunitAssign09desc' },
								{ header: 'procurement.common.transaction.controllingUnitAssign10', field: 'ControllingUnitAssign10' },
								{ header: 'procurement.common.transaction.ControllingunitAssign10desc', field: 'ControllingunitAssign10desc' },
								{ header: 'procurement.common.prcItemDescription1', field: 'ItemDescription1' },
								{ header: 'procurement.common.prcItemDescription2', field: 'ItemDescription2' },
								{ header: 'procurement.common.transaction.itemUomQuantity', field: 'ItemUomQuantity' },
								{ header: 'procurement.common.transaction.PesNo', field: 'PesNo' },
								{ header: 'procurement.common.Userdefined1', field: 'Userdefined1' },
								{ header: 'procurement.common.Userdefined2', field: 'Userdefined2' },
								{ header: 'procurement.common.Userdefined3', field: 'Userdefined3' }
							],
							dtoScheme: {
								typeName: 'PesTransactionDto', moduleSubModule: 'Procurement.Pes'
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				service.PisReadonly = function () {
					return parentService.getItemStatus().IsReadOnly;
				};

				return service;
			}]);
})(angular);