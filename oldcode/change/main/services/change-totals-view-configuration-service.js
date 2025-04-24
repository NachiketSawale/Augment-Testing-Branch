(function () {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeTotalsViewConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers
	 */
	angular.module(moduleName).factory('changeTotalsViewConfigurationService',
		['platformUIStandardConfigService', '$injector', 'changeMainTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, changeMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						'fid': 'object.main.changetotalsviewdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': [ 'code','description','changetypefk', 'rubriccategoryfk', 'changereasonfk', 'deltaslsordresultestcosttotal', 'deltaestbudgetestcosttotal', 'deltaestbudgetslsordresult','changestatusfk', 'estdircosttotal', 'estindcosttotal', 'estcosttotal', 'estbudget', 'slsbidresult', 'slsordresult', 'slsbilresult', 'prcreqnettotal', 'prcreqbudget', 'prcconnettotal', 'prcconbudget']
							}
						],
						'overloads': {
							changestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('project.main.changestatus', null, {
								showIcon: true
							}),
							changetypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.changetype', null),
							changereasonfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.changereason', null),
							rubriccategoryfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.rubriccategory',null)
						}
					};
				}

				var changeTotalsViewDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var changeTotalsViewAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ChangeTotalsVDto',
					moduleSubModule: 'Change.Main'
				});
				changeTotalsViewAttributeDomains = changeTotalsViewAttributeDomains.properties;


				function ChangeTotalsViewUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ChangeTotalsViewUIStandardService.prototype = Object.create(BaseService.prototype);
				ChangeTotalsViewUIStandardService.prototype.constructor = ChangeTotalsViewUIStandardService;

				return new BaseService(changeTotalsViewDetailLayout, changeTotalsViewAttributeDomains, changeMainTranslationService);
			}
		]);
})();
