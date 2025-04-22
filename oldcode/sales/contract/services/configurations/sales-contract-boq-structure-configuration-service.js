/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractBoqStructureConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides layouts for containers of boq used in context of contracts
	 */
	angular.module(moduleName).factory('salesContractBoqStructureConfigurationService', ['_', 'platformUIStandardConfigService', 'boqMainTranslationService', 'platformSchemaService', 'boqMainDetailFormConfigService',
		function (_, platformUIStandardConfigService, boqMainTranslationService, platformSchemaService, boqMainDetailFormConfigService) {
			var factory = {};

			factory.createService = function createService(currentBoqMainService) {
				var currentBoqMainServiceHolder = {currentBoqMainService: currentBoqMainService};
				var BaseService = platformUIStandardConfigService,
					formConfig = angular.copy(boqMainDetailFormConfigService.getFormConfig(currentBoqMainServiceHolder));

				var boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'}).properties;

				// extend attributes and overloads
				var additionsBoqGroup = _.find(formConfig.groups, {gid: 'QuantityPrice'});
				additionsBoqGroup.attributes.push('exwipisfinalquantity','exwipquantity','exwipexpectedrevenue');
				formConfig.overloads.exwipisfinalquantity = {};
				formConfig.overloads.exwipquantity = {};
				formConfig.overloads.exwipexpectedrevenue = {};
				boqItemAttributeDomains.ExWipIsFinalQuantity = {domain: 'boolean'};
				boqItemAttributeDomains.ExWipQuantity = {domain: 'quantity'};
				boqItemAttributeDomains.ExWipExpectedRevenue = {domain: 'money'};

				// bre: copied from 'salesWipBoqStructureConfigurationService' to prevent an exception --- temporary solution until code will be refactored
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
