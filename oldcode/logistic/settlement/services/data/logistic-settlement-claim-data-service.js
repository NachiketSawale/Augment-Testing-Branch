/**
 * Created by chin-han.lai on 01/09/2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementClaimDataService
	 * @description pprovides methods to access, create and update logistic settlement claim entities
	 */
	myModule.service('logisticSettlementClaimDataService', LogisticSettlementClaimDataService);

	LogisticSettlementClaimDataService.$inject = ['_', '$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementConstantValues', 'logisticSettlementDataService', 'platformRuntimeDataService'];

	function LogisticSettlementClaimDataService(_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSettlementConstantValues, logisticSettlementDataService, platformRuntimeDataService) {
		let self = this;
		let showInactive = false;
		let logisticSettlementClaimServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSettlementClaimDataService',
				entityNameTranslationID: 'logistic.settlement.settlementclaim',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/settlement/settlementclaim/',
					endRead: 'getactive',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						readData.PKey1 = +showInactive;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticSettlementConstantValues.schemes.settlementClaim),
					{processItem: processItem}
				],
				presenter: {list: {}},
				entityRole: {
					leaf: {itemName: 'SettlementClaims', parentService: logisticSettlementDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(logisticSettlementClaimServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSettlementClaimValidationService'
		}, logisticSettlementConstantValues.schemes.settlementClaim));

		// Settings to stop reload claim list when parent data service selection change
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		serviceContainer.data.doNotUnloadOwnOnSelectionChange = true;

		let claimId = null;
		serviceContainer.service.registerItemModified (function (e, item){
			if(item.Id !== claimId && item.__rt$data.readonly.length > 0 &&
				!platformRuntimeDataService.isReadonly(item, 'ExpectedWorkOperationTypeFk')){

				claimId = item.Id;
				let data = {
					Id: item.ExpectedWorkOperationTypeFk
				};

				$http.post(globals.webApiBaseUrl + 'resource/wot/workoperationtype/instance', data).then(function (result) {

					if (result && result.data) {

						item.ExpectedIsHire = result.data.IsHire;
					}

					return item;

				}).then(serviceContainer.service.fireItemModified(item));
			}
		});


		this.refresh = function refresh() {
			return serviceContainer.data.doReadData(serviceContainer.data, true);
		};

		this.showInactiveClaims = function showInactiveClaims(value) {
			showInactive = value;
			serviceContainer.service.load();
		};

		function processItem(item) {
			let claimReasonId = item.ClaimReasonFk;
			let data = {Id : claimReasonId};
			$http.post(globals.webApiBaseUrl + 'basics/customize/logisticsclaimreason/instance', data).then(function (result){
				if (result && result.data) {

					let requiredFields = null;

					if(item.IsLive){
						requiredFields = {
							dateRequested: result.data.DateRequested,
							quantityRequested: result.data.QuantityRequested,
							wotRequested: result.data.WotRequested,
							uomRequested: result.data.UomRequested
						};
					}
					else{
						requiredFields = {
							dateRequested: false,
							quantityRequested: false,
							wotRequested: false,
							uomRequested: false
						};
					}

					let options = [
						{
							field: 'ExpectedEffectiveDate',
							readonly: !requiredFields.dateRequested
						},
						{
							field: 'ExpectedQuantity',
							readonly: !requiredFields.quantityRequested
						},
						{
							field: 'ExpectedWorkOperationTypeFk',
							readonly: !requiredFields.wotRequested
						},
						{
							field: 'ExpectedUomFk',
							readonly: !requiredFields.uomRequested
						}
					];


					serviceContainer.service.fireItemModified(item);
					platformRuntimeDataService.readonly(item, options);
				}
			});
		}
	}
})(angular);
