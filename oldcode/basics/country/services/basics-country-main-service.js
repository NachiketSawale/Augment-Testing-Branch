(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCountryMainService
	 * @function
	 *
	 * @description
	 * basicsCountryMainService is the data service for all Country related functionality.
	 */
	var moduleName = 'basics.country';
	var countryModule = angular.module(moduleName);
	countryModule.factory('basicsCountryMainService', ['$http','$translate', '_', 'globals', 'platformDataServiceFactory',

		function ($http, $translate, _, globals, platformDataServiceFactory) {
			var factoryOptions = {
				flatRootItem: {
					module: countryModule,
					serviceName: 'basicsCountryMainService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/country/', endRead: 'filtered', usePostForRead: true
					},
					translation: {
						uid: 'basicsCountryMainService',
						title: 'basics.country.listCountryTitle',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: { typeName: 'CountryDto', moduleSubModule: 'Basics.Country' }
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						root: {
							itemName: 'Country',
							moduleName: 'cloud.desktop.moduleDisplayNameCountry',
							handleUpdateDone: function (updateData, response, data) {
								_.forEach(response.EffectedCountries, function (item) {
									var oldItem = _.find(data.itemList, {Id: item.Id});
									if (oldItem) {
										angular.extend(oldItem, item);
									}
								});
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			var service = serviceContainer.service;

			// validation event
			service.mergeInDefaultValues = function mergeInDefaultValues(changedContries) {
				_.forEach(changedContries, function(country) {
					var oldValue = _.find(serviceContainer.data.itemList, { Id: country.Id } );
					oldValue.IsDefault = country.IsDefault;
					serviceContainer.data.itemModified.fire(null, oldValue);
				});
			};

			return service;

		}]);
})(angular);

