/**
 * Created by janas on 11.12.2015.
 */
(function () {


	'use strict';

	// TODO: move to lookups place
	/**
	 * @ngdoc service
	 * @name controllingStructureTemplateLookupDataService
	 * @function
	 *
	 * @description
	 * controllingStructureTemplateLookupDataService is the data service for company lookup in sales bid
	 * @remarks
	 * name is shortend, full name should be controllingStructureControllingunittemplateLookupDataService
	 */
	angular.module('controlling.structure').factory('controllingStructureTemplateLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('controllingStructureTemplateLookupDataService', {
				valMember: 'Id',
				dispMember: 'Codetemplate',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Codetemplate',
						field: 'Codetemplate',
						name: 'Codetemplate',
						formatter: 'description',
						name$tr$: 'basics.customize.Codetemplate'
					}
				],
				uuid: 'c074311a147c4444855107fcf048ae15'
			});

			var codeTemplateLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/customize/PrjControllingUnitTemplate/',
					endPointRead: 'list'
				},
				// we need a http post instead of http get here. So we need to use filterParam & prepareFilter
				filterParam: {},
				prepareFilter: function prepareFilter() { return {}; }
			};

			return platformLookupDataServiceFactory.createInstance(codeTemplateLookupDataServiceConfig).service;
		}]);
})();
