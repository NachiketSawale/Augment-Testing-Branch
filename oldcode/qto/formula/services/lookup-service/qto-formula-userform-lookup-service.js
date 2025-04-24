/**
 * Created by myh on 21/10/2020.
 */
(function (angular) {
	'use strict';
	/* globals globals */

	var moduleName = 'qto.formula';

	angular.module(moduleName).factory('qtoFormulaUserformLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('qtoFormulaUserformLookupService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'User Form',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityUserForm',
					}
				],
				uuid: 'a1592dac35d24f778b6013b43a0adef9'
			});

			let config = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/userform/', endPointRead: 'list' },
				filterParam: 'rubricId'
			};

			let container = platformLookupDataServiceFactory.createInstance(config);

			return container.service;
		}]);
})(angular);
