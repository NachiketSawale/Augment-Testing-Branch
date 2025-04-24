/**
 * Created by leo on 10.02.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.paymentgroup');

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentgroupSurchargeDataService
	 * @description pprovides methods to access, create and update timekeeping paymentgroup surcharge entities
	 */
	myModule.service('timekeepingPaymentGroupSurchargeDataService', TimekeepingPaymentGroupSurchargeDataService);

	TimekeepingPaymentGroupSurchargeDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingPaymentGroupDataService',
		'timekeepingPaymentGroupConstantValues', 'basicsCommonMandatoryProcessor', 'platformContextService', 'cloudDesktopSidebarService','platformRuntimeDataService'];

	function TimekeepingPaymentGroupSurchargeDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingPaymentGroupDataService,
		timekeepingPaymentGroupConstantValues, basicsCommonMandatoryProcessor, platformContextService, cloudDesktopSidebarService,platformRuntimeDataService,) {
		let self = this;
		let timekeepingPaymentGroupSurchargeServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingPaymentGroupSurchargeDataService',
				entityNameTranslationID: 'timekeeping.paymentgroup.PaymentGroupSurchargeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/paymentgroup/surcharge/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingPaymentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingPaymentGroupConstantValues.schemes.surcharge),{ processItem: setReadonly },],

				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingPaymentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						incorporateDataRead: function(readItems, data){
							let request = cloudDesktopSidebarService.getFilterRequestParams();
							if (request.UseCurrentClient){
								let clientId = platformContextService.signedInClientId;
								readItems = _.filter(readItems, function(item){
									return (item.CompanyFk === clientId);
								});
							}
							return data.handleReadSucceeded(readItems, data);
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Surcharges', parentService: timekeepingPaymentGroupDataService}
				}
			}
		};
		function setReadonly(entity) {

			if(entity.IsReadOnly)
			{
				let fields = [
					{ field: 'PaymentGroupRateFk', readonly: true }
				];
				platformRuntimeDataService.readonly(entity, fields);
			}
		}
		let serviceContainer = platformDataServiceFactory.createService(timekeepingPaymentGroupSurchargeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingPaymentGroupSurchargeValidationService'
		}, timekeepingPaymentGroupConstantValues.schemes.surcharge));
	}
})(angular);
