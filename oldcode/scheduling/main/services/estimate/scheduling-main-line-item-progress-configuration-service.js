(function () {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainLineItemProgressConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in schedule main module
	 */
	angular.module(moduleName).factory('schedulingMainLineItemProgressConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, schedulingMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				var BaseService = platformUIStandardConfigService;

				function provideLineItemProgressLayout() {
					return {
						fid: 'scheduling.main.lineitemprogress.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['activitycode', 'activitydescription', 'lineitemcode', 'lineitemdescription', 'externalcode', 'estimationcode', 'estimationdescription', 'uomfk', 'quantity', 'work', 'costtotal', 'plannedstart', 'plannedfinish', 'plannedduration',
									'progressreportmethodfk', 'pco', 'periodquantityperformance', 'duedatequantityperformance', 'remaininglineitemquantity', 'periodworkperformance', 'duedateworkperformance', 'remaininglineitemwork']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							activitycode: {
								readonly: true
							},
							activitydescription: {
								readonly: true
							},
							lineitemcode: {
								readonly: true
							},
							externalcode: {
								readonly: true
							},
							lineitemdescription: {
								readonly: true
							},
							estimationcode: {
								readonly: true
							},
							estimationdescription: {
								readonly: true
							},
							quantity: {
								readonly: true
							},
							work: {
								readonly: true
							},
							costtotal: {
								readonly: true
							},
							plannedstart: {
								readonly: true
							},
							plannedfinish: {
								readonly: true
							},
							plannedduration: {
								readonly: true
							},
							progressreportmethodfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.progressreportmethod', 'Description'),
							// uomfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.uom', 'Uom')
							uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true,
								readonl: true
							}),
							pco: {
								disallowNegative: true
							},
							periodquantityperformance: {
								disallowNegative: true
							},
							duedatequantityperformance: {
								disallowNegative: true
							},
							remaininglineitemquantity: {
								disallowNegative: true
							},
							periodworkperformance: {
								disallowNegative: true
							},
							duedateworkperformance: {
								disallowNegative: true
							},
							remaininglineitemwork: {
								disallowNegative: true
							}
						}
					};
				}

				var scheduleMainLineItemProgressDetailLayout = provideLineItemProgressLayout();

				var scheduleMainLineItemProgressAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'LineItemProgressDto',
					moduleSubModule: 'Scheduling.Main'
				});
				if (scheduleMainLineItemProgressAttributeDomains) {
					scheduleMainLineItemProgressAttributeDomains = scheduleMainLineItemProgressAttributeDomains.properties;
				}

				function LineItemProgressUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				LineItemProgressUIStandardService.prototype = Object.create(BaseService.prototype);
				LineItemProgressUIStandardService.prototype.constructor = LineItemProgressUIStandardService;

				return new BaseService(scheduleMainLineItemProgressDetailLayout, scheduleMainLineItemProgressAttributeDomains, schedulingMainTranslationService);
			}
		]);
})();
