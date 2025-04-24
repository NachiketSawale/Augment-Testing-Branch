(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsConfigModuleTableLookupDataService
	 * @function
	 *
	 * @description
	 * basicsConfigModuleTableLookupDataService is the data service for configurable tables in a module
	 **/
	angular.module('basics.lookupdata').factory('basicsConfigModuleTableLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigModuleTableLookupDataService', {
				valMember: 'Id',
				dispMember: 'Table',
				showIcon:false,
				columns: [
					{
						id: 'table',
						field: 'Table',
						name: 'Table',
						formatter: 'description',
						width: 160,
						name$tr$: 'basics.customize.table'
					},
					{
						id: 'entity',
						field: 'Entity',
						name: 'Entity',
						formatter: 'description',
						width: 160,
						name$tr$: 'basics.customize.entity'
					}
				],
				uuid: 'b6292a0ce3be4ab0aacc6e39939369ed'
			});

			var basicsConfigModuleTableLookupDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/config/entitycreation/', endPointRead: 'configurable' },
				filterParam: 'module',
				dataEnvelope: 'ConfigurableTables'
			};

			return platformLookupDataServiceFactory.createInstance(basicsConfigModuleTableLookupDataServiceConf).service;
		}]);
})(angular);
