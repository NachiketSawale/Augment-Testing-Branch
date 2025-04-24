(function () {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeTotalsGroupedViewConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers
	 */
	angular.module(moduleName).factory('changeTotalsGroupedViewConfigurationService',
		['platformUIStandardConfigService', '$injector', 'changeMainTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, changeMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						'fid': 'object.main.changetotalsgroupedviewdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': [ 'changestatusfk', 'estdircosttotal', 'estindcosttotal', 'estcosttotal', 'estbudget', 'slsbidresult', 'slsordresult', 'slsbilresult', 'prcreqnettotal', 'prcreqbudget', 'prcconnettotal', 'prcconbudget', 'deltaslsordresultestcosttotal', 'deltaestbudgetestcosttotal', 'deltaestbudgetslsordresult']
							}
						],
						'overloads': {
							changestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('project.main.changestatus', null, {
								showIcon: true
							})
						}
					};
				}

				var changeTotalsGroupedViewDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var changeTotalsGroupedViewAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ChangeTotalsGroupedVDto',
					moduleSubModule: 'Change.Main'
				});
				changeTotalsGroupedViewAttributeDomains = changeTotalsGroupedViewAttributeDomains.properties;


				function ChangeTotalsGroupedViewUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ChangeTotalsGroupedViewUIStandardService.prototype = Object.create(BaseService.prototype);
				ChangeTotalsGroupedViewUIStandardService.prototype.constructor = ChangeTotalsGroupedViewUIStandardService;

				return new BaseService(changeTotalsGroupedViewDetailLayout, changeTotalsGroupedViewAttributeDomains, changeMainTranslationService);
			}
		]);
})();
