/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainLineItemUIService
	 * @function
	 *
	 * @description
	 * qtoMainLineItemUIService is the config service for all estimate line item views.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('qtoMainLineItemUIService',
		['platformUIStandardConfigService', 'platformSchemaService', 'platformUIStandardExtentService', 'qtoMainLineItemHelperService', 'estimateMainTranslationService', 'qtoMainHeaderDataService',
			function (platformUIStandardConfigService, platformSchemaService, platformUIStandardExtentService, qtoMainLineItemHelperService, translationService, qtoMainHeaderDataService) {

				let BaseService = platformUIStandardConfigService;

				let lineItemDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'EstLineItemDto',
					moduleSubModule: 'Estimate.Main'
				});

				if (lineItemDomainSchema) {
					lineItemDomainSchema = lineItemDomainSchema.properties;
					lineItemDomainSchema.Info = {domain: 'image'};
					lineItemDomainSchema.Rule = {domain: 'imageselect'};
					lineItemDomainSchema.Param = {domain: 'imageselect'};
					lineItemDomainSchema.BoqRootRef = {domain: 'integer'};
					lineItemDomainSchema.PsdActivitySchedule = {domain: 'code'};

					// IQ quantity
					lineItemDomainSchema.IqPreviousQuantity = {domain: 'quantity'};
					lineItemDomainSchema.IqQuantity = {domain: 'quantity'};
					lineItemDomainSchema.IqTotalQuantity = {domain: 'quantity'};
					lineItemDomainSchema.IqPercentageQuantity = {domain: 'quantity'};
					lineItemDomainSchema.IqCumulativePercentage = {domain: 'quantity'};

					// BQ quantity
					lineItemDomainSchema.BqPreviousQuantity = {domain: 'quantity'};
					lineItemDomainSchema.BqQuantity = {domain: 'quantity'};
					lineItemDomainSchema.BqTotalQuantity = {domain: 'quantity'};
					lineItemDomainSchema.BqPercentageQuantity = {domain: 'quantity'};
					lineItemDomainSchema.BqCumulativePercentage = {domain: 'quantity'};
				}

				function EstimateUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

				let getProjectChangeLookupOptions = function () {
					return {
						showClearButton: true,
						filterOptions: {
							serverKey: 'qto-main-project-change-common-filter',
							serverSide: true,
							fn: function () {
								return {
									ProjectFk: qtoMainHeaderDataService.getSelected() ?
										qtoMainHeaderDataService.getSelected().ProjectFk : 0
								};
							}
						}
					};
				};

				let options = {
					extendColumns: ['iqpreviousquantity', 'iqquantity', 'iqtotalquantity', 'iqpercentagequantity', 'iqcumulativepercentage',
						'bqpreviousquantity', 'bqquantity', 'bqtotalquantity', 'bqpercentagequantity', 'bqcumulativepercentage'],
					moduleName: moduleName,
					boqLookupDataService: 'salesWipBoqLookupDataService',
					boqRootLookupDataService: 'salesWipBoqRootLookupDataService',
					getProjectChangeLookupOptions: getProjectChangeLookupOptions,
					headerService: qtoMainHeaderDataService
				};
				let lineItemLayout = qtoMainLineItemHelperService.getEstLineItemLayout(options);

				let service = new BaseService(lineItemLayout, lineItemDomainSchema, translationService);
				platformUIStandardExtentService.extend(service, lineItemLayout.addition, lineItemDomainSchema);
				return service;
			}
		]);
})();
