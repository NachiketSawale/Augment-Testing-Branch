/**
 * Created by henkel
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name ControllingGroup
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers
	 */
	angular.module(moduleName).factory('basicsCompanyControllingGroupUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService','basicsLookupdataConfigGenerator' , 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {


				function createMainDetailLayout() {
					return {
						fid: 'basics.company.controllinggroupdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['controllinggroupfk','controllinggrpdetailfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							'controllinggroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupLookupDataService',
								enableCache: true
							}),
							'controllinggrpdetailfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupDetailLookupDataService',
								filter: function (item) {
									return item && item.ControllingGroupFk ? item.ControllingGroupFk : null;
								},
								enableCache: true
							})
						}
					};
				}
				var companyControllingGroupDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyControllingGroupAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'CompanyControllingGroupDto', moduleSubModule: 'Basics.Company'} );
				companyControllingGroupAttributeDomains = companyControllingGroupAttributeDomains.properties;

				return new BaseService(companyControllingGroupDetailLayout, companyControllingGroupAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
