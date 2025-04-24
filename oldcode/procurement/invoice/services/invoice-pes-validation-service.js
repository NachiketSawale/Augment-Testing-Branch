(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoicePESValidationService',
		['$http', 'validationService', 'procurementInvoicePESDataService', 'platformDataValidationService',
			'basicsLookupdataLookupDataService', 'procurementInvoiceHeaderDataService', 'procurementInvoiceCertificateDataService',
			'procurementInvoicePESDataFillFieldsProcessor',
			function ($http, validationService, dataService, platformDataValidationService, lookupDataService,
				headerDataService, procurementInvoiceCertificateDataService,
				procurementInvoicePESDataFillFieldsProcessor) {

				var service = {};

				service.validatePesHeaderFk = function (entity, value, model, apply) {

					var validateResult = platformDataValidationService.isUnique(dataService.getList(), 'PesHeaderFk', value, entity.Id);
					if (validateResult.valid && apply !== true) {
						// TODO  check INV_HEADER.MDC_BILLING_SCHEMA_FK.ISCHAINED = true
						var parentSelected = headerDataService.getSelected();
						if (parentSelected.BillingSchemaFk) {
							var BpdVatGroupFk = parentSelected.BpdVatGroupFk;
							lookupDataService.getItemByKey('billingschema', parentSelected.BillingSchemaFk).then(function (data) {
								$http.get(globals.webApiBaseUrl + 'procurement/invoice/pes/caculatefrominv?MainId=' + value +
									'&IsChained=' + data.IsChained + '&BpdVatGroupId=' + BpdVatGroupFk + '&IsChainedPes=' + data.IsChainedPes).then(function (pesLookupData) {
									if (pesLookupData && pesLookupData.data) {
										entity.PesValueOc = pesLookupData.data.PesValueOc;
										entity.PesVatOc = pesLookupData.data.PesVatOc;
										entity.PesValue = pesLookupData.data.PesValue;
										entity.PesVat = pesLookupData.data.PesVat;
										entity.ValueGross = entity.PesValue + entity.PesVat;
										entity.ValueOcGross = entity.PesValueOc + entity.PesVatOc;

										pesOldVersionValidation();
									}
								});
							});

						}
					}

					function pesOldVersionValidation() {
						// var data = _.find(basicsLookupdataLookupDescriptorService.getData('InvoicePes'), {Id: value});
						lookupDataService.getItemByKey('InvoicePes', value).then(function (data) {
							if (!angular.isObject(data)) {
								return;
							}
							if (data.PrcHeaderFk) {
								/** @namespace data.ConDescription */
								/** @namespace data.ConCode */
								headerDataService.onCopyInvGenerals.fire(null, {
									PrcHeaderId: data.PrcHeaderFk,
									Code: data.ConCode,
									Description: data.ConDescription
								});
								lookupDataService.getItemByKey('ConHeaderView', data.ConHeaderFk).then(function (response) {
									if (!angular.isObject(response)) {
										return;
									}

									procurementInvoiceCertificateDataService.copyAndUpdateCertificates(response, data.ConHeaderFk);
								});
							}

							procurementInvoicePESDataFillFieldsProcessor.processItem(entity);
							dataService.calculateFromPes();
							dataService.gridRefresh();
						},
						function (error) {
							window.console.error(error);
						}
						);
					}

					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);

					if (validateResult.valid === false) {
						validateResult.error$tr$param$.object = 'pes';
					}

					return validateResult;
				};

				function pesChanged() {
					var entities = dataService.getList();
					_.forEach(entities, function (item) {
						service.validatePesHeaderFk(item, item.PesHeaderFk, 'PesHeaderFk', false);
					});
				}

				headerDataService.BillingSchemaChanged.register(pesChanged);
				headerDataService.vatGroupChanged.register(pesChanged);
				return service;
			}
		]);

})(angular);
