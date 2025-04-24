/**
 * Created by joshi on 16.09.2014.
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
	angular.module(moduleName).factory('basicsCostCodesPriceVersionCompanyUIConfigurationService', [
		function () {

			return {
				getDetailLayout: function () {
					return {
						'fid': 'basics.costcodes.price.version.company.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['code', 'companyname', 'ischecked']
							}
						],

						'overloads': {
							'code': {
								readonly: true
							},
							'companyname': {
								readonly: true
							}
						}
					};
				}
			};
		}]);
})();