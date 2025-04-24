(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsConfigModuleTableColumnLookupDataService
	 * @function
	 *
	 * @description
	 * basicsConfigModuleTableColumnLookupDataService is the data service for columns of a configurable tables in a module
	 **/
	angular.module('basics.lookupdata').factory('basicsConfigModuleTableColumnLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigModuleTableColumnLookupDataService', {
				valMember: 'Id',
				dispMember: 'Column',
				showIcon:false,
				columns: [
					{
						id: 'column',
						field: 'Column',
						name: 'Column',
						formatter: 'description',
						width: 160,
						name$tr$: 'basics.customize.column'
					},
					{
						id: 'property',
						field: 'Property',
						name: 'Property',
						formatter: 'description',
						width: 160,
						name$tr$: 'basics.customize.property'
					}
				],
				uuid: '59bb128175f54290999477f29c067ecf'
			});

			var basicsConfigModuleTableColumnLookupDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/config/entitycreation/', endPointRead: 'columns' },
				filterParam: 'module',
				dataEnvelope: 'ConfigurableColumns'
			};

			return platformLookupDataServiceFactory.createInstance(basicsConfigModuleTableColumnLookupDataServiceConf).service;
		}]);
})(angular);
