/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc service
	 * @name salesWipBoqStructureConfigurationService
	 * @function
	 *
	 * @description
	 * salesWipBoqStructureConfigurationService is the configuration service for creating a form container standard config from dto and high level description.
	 */
	angular.module(moduleName).factory('salesWipBoqStructureConfigurationService',
		['_', 'platformUIStandardConfigService', 'boqMainTranslationService', 'platformSchemaService', 'boqMainDetailFormConfigService',
			function (_, platformUIStandardConfigService, boqMainTranslationService, platformSchemaService, boqMainDetailFormConfigService) {
				var factory = {};

				factory.createService = function createService(currentBoqMainService) {
					var currentBoqMainServiceHolder = {currentBoqMainService: currentBoqMainService};
					var BaseService = platformUIStandardConfigService,
						formConfig = angular.copy(boqMainDetailFormConfigService.getFormConfig(currentBoqMainServiceHolder));

					var boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'BoqItemDto',
						moduleSubModule: 'Boq.Main'
					});

					if (boqItemAttributeDomains) {
						boqItemAttributeDomains = boqItemAttributeDomains.properties;
					}

					// extend attributes and overloads
					var additionsBoqGroup = _.find(formConfig.groups, {gid: 'QuantityPrice'});
					additionsBoqGroup.attributes.push('prevquantity', 'ordquantity', 'remquantity', 'exsalesrejectedquantity', 'totalquantity', 'totalquantityaccepted', 'prevrejectedquantity', 'totalrejectedquantity', 'preescalationtotal', 'extraprevious', 'extratotal', 'totalprice', 'totalpriceoc', 'totalhours', 'performance', 'percentagequantity', 'quantitytarget', 'exwipisfinalquantity', 'cumulativepercentage', 'itemtotaleditable', 'itemtotaleditableoc');
					formConfig.overloads.prevquantity = angular.extend(formConfig.overloads.prevquantity ?? {}, {readonly: true});
					formConfig.overloads.ordquantity = angular.extend(formConfig.overloads.ordquantity ?? {}, {readonly: true});
					formConfig.overloads.remquantity = angular.extend(formConfig.overloads.remquantity ?? {}, {readonly: true});
					formConfig.overloads.preescalationtotal = {readonly: true};
					formConfig.overloads.extraprevious = {readonly: true};
					formConfig.overloads.extratotal = {readonly: true};
					// formConfig.overloads.totalprice = {readonly: true};
					formConfig.overloads.totalhours = {readonly: true};
					formConfig.overloads.performance = {readonly: true};

					formConfig.overloads.totalquantity = angular.extend(formConfig.overloads.totalquantity ?? {}, {formatter: boqMainDetailFormConfigService.totalQuantityFormatter});
					formConfig.overloads.totalquantityaccepted = angular.extend(formConfig.overloads.totalquantityaccepted ?? {}, {readonly: true});
					formConfig.overloads.prevrejectedquantity = angular.extend(formConfig.overloads.prevrejectedquantity ?? {}, {readonly: true});
					formConfig.overloads.totalrejectedquantity = angular.extend(formConfig.overloads.totalrejectedquantity ?? {}, {});;
					formConfig.overloads.percentagequantity = _.isObject(formConfig.overloads.percentagequantity) ? formConfig.overloads.percentagequantity : {};
					formConfig.overloads.quantitytarget = _.isObject(formConfig.overloads.quantitytarget) ? formConfig.overloads.quantitytarget : {};
					formConfig.overloads.exwipisfinalquantity = {};
					formConfig.overloads.cumulativepercentage = _.isObject(formConfig.overloads.cumulativepercentage) ? formConfig.overloads.cumulativepercentage : {};
					formConfig.overloads.itemtotaleditable = {};
					formConfig.overloads.itemtotaleditableoc = {};

					// extend scheme for additional attributes
					boqItemAttributeDomains.PrevQuantity = {domain: 'quantity'};
					boqItemAttributeDomains.TotalQuantity = {domain: 'quantity'};
					boqItemAttributeDomains.TotalQuantityAccepted = {domain: 'quantity'};
					boqItemAttributeDomains.PrevRejectedQuantity = {domain: 'quantity'};
					boqItemAttributeDomains.TotalRejectedQuantity = {domain: 'quantity'};
					boqItemAttributeDomains.OrdQuantity = {domain: 'quantity'};
					boqItemAttributeDomains.RemQuantity = {domain: 'quantity'};
					boqItemAttributeDomains.PreEscalationTotal = {domain: 'money'};
					boqItemAttributeDomains.ExtraPrevious = {domain: 'money'};
					boqItemAttributeDomains.ExtraTotal = {domain: 'money'};
					boqItemAttributeDomains.TotalPrice = {domain: 'money'};
					boqItemAttributeDomains.TotalPriceOc = {domain: 'money'};
					boqItemAttributeDomains.TotalHours = {domain: 'quantity'};
					boqItemAttributeDomains.Performance = {domain: 'money'};
					boqItemAttributeDomains.PercentageQuantity = {domain: 'quantity'};
					boqItemAttributeDomains.QuantityTarget = {domain: 'quantity'};
					boqItemAttributeDomains.ExWipIsFinalQuantity = {domain: 'boolean'};
					boqItemAttributeDomains.CumulativePercentage = {domain: 'quantity'};
					boqItemAttributeDomains.ItemTotalEditable = {domain: 'money'};
					boqItemAttributeDomains.ItemTotalEditableOc = {domain: 'money'};

					// temporary solution until code will be refactored
					if (boqItemAttributeDomains) {
						boqItemAttributeDomains.Rule = {'domain': 'imageselect'};
						boqItemAttributeDomains.Param = {'domain': 'imageselect'};
						boqItemAttributeDomains.DivisionTypeAssignment = {'domain': 'directive'};
						boqItemAttributeDomains.PrjChangeId = {'domain': 'integer'};
						boqItemAttributeDomains.PrjChangeStatusId = {'domain': 'integer'};
					}

					function BoqMainUIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					BoqMainUIStandardService.prototype = Object.create(BaseService.prototype);
					BoqMainUIStandardService.prototype.constructor = BoqMainUIStandardService;

					var service = new BaseService(formConfig, boqItemAttributeDomains, boqMainTranslationService);

					service.setCurrentBoqMainService = function setCurrentBoqMainService(boqMainService) {
						currentBoqMainServiceHolder.currentBoqMainService = boqMainService;
					};

					return service;
				};

				return factory;
			}
		]);
})();
