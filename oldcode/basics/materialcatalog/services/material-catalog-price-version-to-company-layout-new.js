/**
 * Created by chi on 6/2/2017.
 */
(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'basics.materialcatalog',
		cloudCommonModule = 'cloud.common';

	/**
     * @ngdoc service
     * @name basicsMaterialCatalogPriceVersionToCompanyLayoutNew
     * @function
     *
     * @description
     * basicsMaterialCatalogPriceVersionToCompanyLayoutNew is the config service for material catalog views.
     */
	angular.module(moduleName).value('basicsMaterialCatalogPriceVersionToCompanyLayoutNew', {
		'fid': 'basics.materialcatalog.price.version.to.company.detail',
		'version': '1.0.0',
		'showGrouping': true,
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['code', 'companyname', 'checked'/*,'contextfk'*/]
			}
		],
		'translationInfos': {
			'extraModules': [cloudCommonModule],
			'extraWords': {
				Checked: {location: moduleName, identifier: 'checked', initial: 'Checked'},
				CompanyName: {location: cloudCommonModule, identifier: 'entityCompanyName', initial: 'Company Name'}
			}
		},
		'overloads': {
			'code': {
				readonly: true
			},
			'companyname': {
				readonly: true
			}
		}
	});
})();