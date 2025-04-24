/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'project.costcodes';

	/**
	 * @ngdoc service
	 * @name projectCostCodesJobRateConfigValuesService
	 * @function
	 *
	 * @description
	 * projectCostCodesJobRateConfigValuesService is the config service for all project costcode's Job Rate views.
	 */
	angular.module(moduleName).factory('projectCostCodesJobRateConfigValuesService', ['$injector', 'basicsLookupdataConfigGenerator',

		function ( $injector, basicsLookupdataConfigGenerator) {
			let service = {};

			let projectCostCodesJobRateDetailLayout = {

				'fid': 'project.costcodes.job.rate.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				addValidationAutomatically: true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['bascostcode.factorcosts', 'bascostcode.realfactorcosts',  'factorcosts', 'realfactorcosts',
							'bascostcode.factorhour', 'factorhour', 'bascostcode.factorquantity', 'bascostcode.realfactorquantity',
							'factorquantity', 'realfactorquantity', 'bascostcode.rate', 'rate', 'bascostcode.currencyfk', 'currencyfk',
							'bascostcode.dayworkrate', 'salesprice', 'co2source', 'co2project']
					},
					{
						'gid': 'assignments',
						'attributes': [ 'lgmjobfk', 'co2sourcefk']

					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'overloads': {

					'realfactorcosts': {
						'readonly': true
					},

					'realfactorquantity': {
						'readonly': true
					},

					'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'estimateMainJobLookupByProjectDataService',
						readonly: false,
						cacheEnable: true,
						required: true,
						additionalColumns: false,
						filter: function () {
							return $injector.get('projectMainService').getIfSelectedIdElse(null);
						}
					}, {required: true}),
					'currencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true
					}),
					'bascostcode.currencyfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true,
						readonly: true
					}),
					'co2source':{
						readonly: true
					},
					'co2sourcefk': {
						readonly: true,
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-source-name-lookup',
							'options': {
								version: 3
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-source-name-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'co2sourcename',
								displayMember: 'DescriptionInfo.Translated',
								version: 3
							}
						}
					}
				}

			};

			service.getProjectCostCodesJobRateDetailLayout = function(){
				let groups = projectCostCodesJobRateDetailLayout.groups;

				angular.forEach(groups, function(grp){
					if(grp.hasOwnProperty('attributes')){
						angular.forEach(grp.attributes, function(attr){
							if(attr.indexOf('bascostcode') >= 0 && attr.indexOf('fk') === -1 ){
								projectCostCodesJobRateDetailLayout.overloads[attr] = {'readonly': true};
							}
						});
					}
				});

				return projectCostCodesJobRateDetailLayout;
			};

			return service;
		}
	]);
})(angular);

