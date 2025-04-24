/**
 * Created by lsi on 7/1/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	angular.module(moduleName).factory('procurementPesSelfbillingDataService', procurementPesSelfbillingDataService);
	procurementPesSelfbillingDataService.$inject = ['globals', 'procurementPesHeaderService', 'ServiceDataProcessDatesExtension', 'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupDescriptorService', 'platformDataServiceFactory', 'procurementPesSelfBillingValidationService',
		'platformDataValidationService', 'platformModuleStateService', 'procurementPesSelfbillingReadonlyStatusProcessor','procurementContextService'];

	function procurementPesSelfbillingDataService(globals, procurementPesHeaderService, ServiceDataProcessDatesExtension, basicsCommonMandatoryProcessor,
		basicsLookupdataLookupDescriptorService, platformDataServiceFactory, procurementPesSelfBillingValidationService,
		platformDataValidationService, platformModuleStateService, SelfbillingReadonlyStatusProcessor, procurementContextService) {
		var serviceOptions = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'procurementPesSelfbillingDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'procurement/pes/selfbilling/',
					endRead: 'list'
				},
				presenter: {
					list: {
						initCreationData: initCreationData,
						incorporateDataRead: incorporateDataRead,
						handleCreateSucceeded: handleCreateSucceeded
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PesSelfBilling',
						parentService: procurementPesHeaderService
					}
				},
				dataProcessor: [
					new ServiceDataProcessDatesExtension(['BillDate', 'DeliveredFromDate', 'DeliveredDate', 'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5']),
					new SelfbillingReadonlyStatusProcessor({
						typeName: 'PesSelfBillingDto',
						moduleSubModule: 'Procurement.Pes',
						uiStandardService: 'procurementPesSelfbillingDetailLayout',
						statusField: 'SbhStatusFk'
					})
				],
				actions: {
					create: 'flat',
					canCreateCallBackFunc: function canCreateCallBackFunc() {
						var headerSelectedItem = procurementPesHeaderService.getSelected();
						var selfbillingList = service.getList();
						return !procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem) && selfbillingList.length === 0;
					},
					delete: true,
					canDeleteCallBackFunc: function canDeleteCallBackFunc() {
						var headerSelectedItem = procurementPesHeaderService.getSelected();
						return !procurementPesHeaderService.validateItemIsReadOnly(headerSelectedItem);
					}
				}
			}
		};
		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		service.name = 'procurementPesSelfbillingDataService';

		function initCreationData(creationData) {
			var selectedItem = procurementPesHeaderService.getSelected();
			creationData.MainItemId = selectedItem.Id;
			creationData.BusinessPartnerId = selectedItem.BusinessPartnerFk;
		}

		var validator = procurementPesSelfBillingValidationService(service);
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PesSelfBillingDto',
			moduleSubModule: 'Procurement.Pes',
			validationService: validator,
			mustValidateFields: ['Code', 'DeliveredFromDate', 'DeliveredDate']
		});

		procurementPesHeaderService.registerValidationIssuesClearUp(onClearUpValidationIssues);
		procurementPesHeaderService.registerValidationIssuesRemove(onRemoveValidationIssues);

		function onClearUpValidationIssues() {
			if (platformDataValidationService.hasErrors(serviceContainer.service)) {
				var modState = platformModuleStateService.state(serviceContainer.service.getModule());
				modState.validation.issues = [];
			}
		}

		function onRemoveValidationIssues(e, id) {
			if (platformDataValidationService.hasErrors(serviceContainer.service)) {
				var modState = platformModuleStateService.state(serviceContainer.service.getModule());
				modState.validation.issues = _.filter(modState.validation.issues, function (err) {
					return err.entity.PesHeaderFk !== id;
				});
			}
		}

		function incorporateDataRead(readItems, data) {
			basicsLookupdataLookupDescriptorService.attachData(readItems);
			var ret = data.handleReadSucceeded(readItems.Main, data, true);
			serviceContainer.service.goToFirst();
			return ret;
		}

		function handleCreateSucceeded(item) {
			var pesHeader = procurementPesHeaderService.getSelected();
			if (pesHeader && item) {
				item.BillDate = pesHeader.DateDelivered;
				item.DeliveredDate = pesHeader.DateDelivered;
			}
		}

		return service;
	}
})(angular);