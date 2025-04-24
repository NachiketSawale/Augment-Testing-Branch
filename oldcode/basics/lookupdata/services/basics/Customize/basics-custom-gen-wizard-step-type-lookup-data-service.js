/**
 * Created by Henkel on 04.12.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomGenWizardStepTypeLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomGenWizardStepTypeLookupDataService is the data service for generic wizard step types
	 */
	angular.module('basics.lookupdata').factory('basicsCustomGenWizardStepTypeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomGenWizardStepTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon:true,
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '491f222aa83144f790395a1f347fbdb0'
			});

			var basicsCustomGenWizardStepTypeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/genericwizardsteptype/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomGenWizardStepTypeLookupDataServiceConfig).service;
		}]);
})(angular);
