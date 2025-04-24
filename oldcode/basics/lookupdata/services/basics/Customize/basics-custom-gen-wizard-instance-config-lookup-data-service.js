(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomGenWizardInstanceConfigLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomGenWizardInstanceConfigLookupDataService is the data service for generic wizard instance config
	 */
	angular.module('basics.lookupdata').factory('basicsCustomGenWizardInstanceConfigLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'genericWizardUseCaseConfigService', '$q',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, genericWizardUseCaseConfigService, $q) {


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomGenWizardInstanceConfigLookupDataService', {
				valMember: 'Id',
				dispMember: 'name',
				showIcon: true,
				columns: [
					{
						id: 'Description',
						field: 'name',
						name: 'Wizard Type',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '491f222aa83144f790395a1f347fbdb0'
			});

			var basicsCustomGenWizardInstanceConfigLookupDataService = {
				dataAlreadyLoaded: true
			};

			var instance = platformLookupDataServiceFactory.createInstance(basicsCustomGenWizardInstanceConfigLookupDataService).service;

			instance.getList = function getList() {
				return $q.when(genericWizardUseCaseConfigService.useCaseWizardList);
			};

			instance.getListSync = function getListSync() {
				return genericWizardUseCaseConfigService.useCaseWizardList;
			};


			return instance;

		}]);
})(angular);
