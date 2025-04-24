(function () {

	'use strict';

	var moduleName = 'basics.dependentdata';
	var dependentDataModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * data service for all FormField related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	dependentDataModule.factory('basicsDependentDataColumnService', ['$http', '$q', 'basicsDependentDataMainService', 'platformDataServiceFactory', 'platformRuntimeDataService',

		function ($http, $q, basicsDependentDataMainService, platformDataServiceFactory, platformRuntimeDataService) {

			var serviceFactoryOptions = { flatLeafItem: {
				module: dependentDataModule,
				serviceName: 'basicsDependentDataColumnService',
				dataProcessor: [{ processItem: function(item) {
					var fields = [
						{ field: 'ModuleFk', readonly: item.DisplayDomainFk === 19 || item.DisplayDomainFk === 24},   // url, filedownload
						{ field: 'DependentDataColumnFk', readonly: item.DisplayDomainFk !== 24 && item.DisplayDomainFk !== 19 && item.ModuleFk === null }  // filedownload
					];
					platformRuntimeDataService.readonly(item, fields);
				}
				}],
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/dependentdata/column/', endRead:'list'
				},
				httpCreate: {
					route: globals.webApiBaseUrl + 'basics/dependentdata/column/', endCreate:'createEntity'
				},
				httpDelete: {
					route: globals.webApiBaseUrl + 'basics/dependentdata/column/', endDelete:'delete'
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'basics/dependentdata/column/', endUpdate:'update'
				},
				entityRole: {
					leaf: { itemName: 'DependentDataColumns', parentService: basicsDependentDataMainService }
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = basicsDependentDataMainService.getSelected().Id;
						}
					}
				},
				translation: {
					uid: 'basicsDependentDataColumnService',
					title: 'Columns Translation',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: { typeName: 'DependentDataColumnDto', moduleSubModule: 'Basics.DependentData' }
				}
			} };

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

			/**
			 * @ngdoc function
			 * @name
			 * @function
			 * @description
			 */
			serviceContainer.service.parseView = function () {

				var deferred = $q.defer();

				var selectedMainItem = basicsDependentDataMainService.getSelected();
				if (selectedMainItem && selectedMainItem.hasOwnProperty('Id')) {

					$http.post(globals.webApiBaseUrl + 'basics/dependentdata/parseview?dependentDataId=' + selectedMainItem.Id, '"' + selectedMainItem.SourceObject + '"').then(
						function (response) {
							deferred.resolve(response.data);
						});

				}
				else {
					deferred.resolve(null);
				}
				return deferred.promise;
			};

			var init = function() {
			};
			init();


			return serviceContainer.service;

		}]);
})(angular);
