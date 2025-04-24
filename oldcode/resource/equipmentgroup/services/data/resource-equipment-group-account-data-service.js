/**
 * Created by baf on 12.04.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupAccountDataService
	 * @description pprovides methods to access, create and update resource equipmentGroup account entities
	 */
	myModule.service('resourceEquipmentGroupAccountDataService', ResourceEquipmentGroupAccountDataService);

	ResourceEquipmentGroupAccountDataService.$inject = ['_', '$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupDataService',
		'basicsLookupdataLookupFilterService', 'platformContextService', 'platformRuntimeDataService'];

	function ResourceEquipmentGroupAccountDataService(_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceEquipmentGroupConstantValues, resourceEquipmentGroupDataService,
		basicsLookupdataLookupFilterService, platformContextService, platformRuntimeDataService) {
		let self = this;

		let company = null;
		let companyId = platformContextService.getContext().clientId;
		$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId).then(response => company = response.data);

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'resource-equipment-group-account-filter',
				fn: function (accountItem) {
					return company && accountItem.LedgerContextFk === company.LedgerContextFk;
				}
			}
		]);

		let resourceEquipmentGroupAccountServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupAccountDataService',
				entityNameTranslationID: 'resource.equipmentgroup.accountEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentGroup/account/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canDeleteCallBackFunc: canDeleteSelectedAccount},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentGroupConstantValues.schemes.groupAccount), { processItem: processItem }],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Accounts', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceEquipmentGroupAccountServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentGroupAccountValidationService'
		}, resourceEquipmentGroupConstantValues.schemes.groupAccount));

		function processItem(item) {
			if(item.IsReadOnly){
				platformRuntimeDataService.readonly(item, true);
			}
		}

		function canDeleteSelectedAccount(selected) {
			let result = true;
			if(selected && selected.IsReadOnly){
				result = false;
			}
			return result;
		}

	}
})(angular);
