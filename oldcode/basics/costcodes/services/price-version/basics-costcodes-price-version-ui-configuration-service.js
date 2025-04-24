/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {

	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesUIConfigurationService
	 * @function
	 *
	 * @description
	 * basicsCostCodesUIConfigurationService is the config service for all costcodes views.
	 */
	angular.module(moduleName).factory('basicsCostCodesPriceVersionUIConfigurationService', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {

			return {
				getDetailLayout: function () {
					return {
						'fid': 'basics.costcodes.price.version.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['descriptioninfo', 'pricelistfk', 'validfrom', 'validto', 'datadate', 'weighting']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'pricelistfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.pricelist', null, { required: true })
						},
						'addition': {}
					};
				}
			};
		}
	]);
})();