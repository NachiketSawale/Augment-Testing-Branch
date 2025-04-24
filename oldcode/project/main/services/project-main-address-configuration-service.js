(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainKeyFigureConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('projectMainAddressConfigurationService',

		['projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'basicsCommonComplexFormatter',
			function (projectMainTranslationService, basicsLookupdataConfigGenerator, basicsCommonComplexFormatter) {

				function getLayout() {
					return {
						fid: 'project.address.address',
						version: '0.0.1',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['description', 'commenttext', 'addressfk', 'addresstypefk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							addresstypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.addresstype'),
							addressfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-address-dialog',
									model: 'AddressEntity',
									options: {
										titleField: 'cloud.common.entityAddress',
										foreignKey: 'AddressFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'AddressEntity',
									editorOptions: {
										lookupDirective: 'basics-common-address-dialog',
										'lookupOptions': {
											foreignKey: 'AddressFk',
											titleField: 'cloud.common.entityAddress'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'AddressLine'
									}
								}
							}
						}
					};
				}

				return {getConfig: getLayout};
			}
		]);
})();
