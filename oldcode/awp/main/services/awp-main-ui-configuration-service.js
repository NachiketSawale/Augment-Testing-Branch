/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'awp.main';

	/**
	 * @ngdoc service
	 * @name awpMainUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('awpMainUIConfigurationService', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			const service = {};

			service.getPackageStructureLineItemLayout = function () {
				return {
					'fid': 'awp.main.package.structure.lineItem',
					'version': '1.0.2',
					'showGrouping': true,
					'change': 'change',
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['code', 'description', 'quantity', 'wqquantity', 'quantitytotal', 'basuomfk', 'unitrate', 'grandcostunittarget', 'finalprice', 'grandtotal', 'prcstructurefk']
						}],
					'overloads': {
						'code': {
							'searchable': true,
							'grouping': {'generic': false, 'aggregateForce': true},
							'readonly': true,
							'aggregation': false
						},
						'description': {
							'searchable': true,
							'grouping': {'generic': false, 'aggregateForce': true},
							'readonly': true,
							'aggregation': false
						},
						'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}, {required: false}),
						'prcstructurefk': {
							'readonly': true,
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-procurementstructure-structure-dialog',
									'lookupOptions': {
										'additionalColumns': true,
										'displayMember': 'Code'
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'prcstructure',
									'displayMember': 'Code'
								}
							}
						}
					}
				}
			};

			return service;
		}
	]);
})(angular);
