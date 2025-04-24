(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCountryLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCountryLookupDataService is the data service providing data for Country look ups
	 */
	angular.module('cloud.translation').directive('cloudTranslationResourceLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'BasicsLookupdataLookupDirectiveDefinition', 'cloudTranslationResourceDataService',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, BasicsLookupdataLookupDirectiveDefinition, cloudTranslationResourceDataService) {

			const defaults = {
				lookupType: 'cloudTranslationResourceDataService',
				valueMember: 'id',
				displayMember: 'ResourceTerm',
				columns: [
					{
						id: 'Id',
						field: 'Id',
						name: 'Id',
						formatter: 'id',
						name$tr$: 'cloud.common.entityId'
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'cloudTranslationResourceDataService',
				dataProvider: {
					myUniqueIdentifier: 'cloudTranslationResourceDataService',

					getList: function () {
						return cloudTranslationResourceDataService.getList();
					},
					getItemByKey: function (key) {
						return cloudTranslationResourceDataService.getItemById(key);
					}
				}
			});
		}]);
})(angular);
