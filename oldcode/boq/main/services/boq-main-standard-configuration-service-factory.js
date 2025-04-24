/**
 * Created by bh on 28.11.2015.
 */
(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainStandardConfigurationServiceFactory
	 * @function
	 *
	 * @description
	 * boqMainStandardConfigurationServiceFactory is the factory for creation the configuration service for creating a form container standard config from dto and high level description.
	 */
	angular.module(moduleName).factory('boqMainStandardConfigurationServiceFactory',
		['platformUIStandardConfigService', 'boqMainTranslationService', 'platformSchemaService', 'boqMainDetailFormConfigService', 'platformObjectHelper', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, boqMainTranslationService, platformSchemaService, boqMainDetailFormConfigService, platformObjectHelper, platformUIStandardExtentService) {

				var factory = {};

				factory.createBoqMainStandardConfigurationService = function createBoqMainStandardConfigurationService(option) {
					var BaseService = platformUIStandardConfigService;
					var internalOption = {};
					if (angular.isDefined(option) && _.isObject(option)) {
						angular.extend(internalOption, option);
					}

					if (!Object.prototype.hasOwnProperty.call(internalOption, 'currentBoqMainService')) {
						// Now add the currentBoqMainService property to the option object
						internalOption.currentBoqMainService = null;
					}

					var boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'BoqItemDto',
						moduleSubModule: 'Boq.Main'
					});

					if (boqItemAttributeDomains && boqItemAttributeDomains.properties) {
						boqItemAttributeDomains.properties.Rule = {'domain': 'imageselect'};
						boqItemAttributeDomains.properties.Param = {'domain': 'imageselect'};
						boqItemAttributeDomains.properties.DivisionTypeAssignment = {'domain': 'directive'};
					}

					if (boqItemAttributeDomains) {
						boqItemAttributeDomains = boqItemAttributeDomains.properties;
					}

					function BoqMainUIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					function extendBoqMainConfig() {
						var extendedColumns = [
							{
								'afterId': 'prcstructurefk',
								'id': 'prcstructureDescription',
								'lookupDisplayColumn': true,
								'field': 'PrcStructureFk',
								'name': 'Procurement Structure Description',
								'name$tr$': 'boq.main.PrcStructureDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'prcstructure',
									displayMember: 'DescriptionInfo.Translated'
								},
								'width': 145
							}];

						extendedColumns.push(
							{
								'afterId': 'mdctaxcodefk',
								'id': 'taxCodeDescription',
								'lookupDisplayColumn': true,
								'field': 'MdcTaxCodeFk',
								'name': 'Tax Code Description',
								'name$tr$': 'cloud.common.entityTaxCodeDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'TaxCode',
									displayMember: 'DescriptionInfo.Translated'
								},
								'width': 145
							}
						);

						return {
							'addition': {
								'grid': platformObjectHelper.extendGrouping(extendedColumns)
							}
						};
					}

					BoqMainUIStandardService.prototype = Object.create(BaseService.prototype);
					BoqMainUIStandardService.prototype.constructor = BoqMainUIStandardService;

					var service = new BaseService(boqMainDetailFormConfigService.getFormConfig(internalOption), boqItemAttributeDomains, boqMainTranslationService);
					platformUIStandardExtentService.extend(service, extendBoqMainConfig().addition, boqItemAttributeDomains);

					service.setCurrentBoqMainService = function currentBoqMainService(boqMainService) {
						internalOption.currentBoqMainService = boqMainService;
					};

					return service;
				};

				return factory;
			}
		]);
})();
