/**
 * Created by leo on 24.11.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyLookupDataService
	 * @function
	 *
	 * @description
	 * modelAdministrationPropertyKeyLookupDataService is the data service for property keys
	 */
	angular.module('basics.lookupdata').factory('modelAdministrationPropertyKeyLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelAdministrationPropertyKeyLookupDataService', {
				valMember: 'Id',
				dispMember: 'PropertyName',
				columns: [
					{
						id: 'PropertyName',
						field: 'PropertyName',
						name: 'PropertyName',
						formatter: 'comment',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'ValueTypeFk',
						field: 'ValueTypeFk',
						name: 'ValueTypeFk',
						formatter: 'lookup',
						name$tr$: 'cloud.common.entityType',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.mdlvaluetype',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						width: 150
					}
				],
				uuid: 'efa1d62fee4849d7903dd2711952d539'
			});

			var modelAdministrationPrpertyKeyLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/administration/propertykey/', endPointRead: 'listwithvaluetype' }
			};

			return platformLookupDataServiceFactory.createInstance(modelAdministrationPrpertyKeyLookupDataServiceConfig).service;
		}]);
})(angular);
