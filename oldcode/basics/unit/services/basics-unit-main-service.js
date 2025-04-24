(function (angular) {
	/* global globals */
	'use strict';
	var basicsUnitModule = angular.module('basics.unit');

	/**
	 * @ngdoc service
	 * @name basicsUnitMainService
	 * @function
	 *
	 * @description
	 * basicsUnitMainService is the data service for all unit related functionality.
	 */
	basicsUnitModule.factory('basicsUnitMainService', ['_', '$injector', 'platformDataServiceFactory', 'platformPermissionService',

		function (_, $injector, platformDataServiceFactory, platformPermissionService) {
			var serviceContainer = null;
			var basicsUnitServiceOption = {
				flatRootItem: {
					module: basicsUnitModule,
					serviceName: 'basicsUnitMainService',
					entityNameTranslationID: 'basics.unit.entityUnit',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/unit/',
						usePostForRead: true,
						endRead: 'filtered'
					},
					translation: {
						uid: 'basicsUnitMainService',
						title: 'basics.unit.entityUnit',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}, {header: 'basics.unit.entityUnit', field: 'UnitInfo'}],
						dtoScheme: { typeName: 'UomDto', moduleSubModule: 'Basics.Unit' }
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							codeField: 'Unit',
							itemName: 'Uom',
							moduleName: 'cloud.desktop.moduleDisplayNameBasicsUnit',
							handleUpdateDone: function (updateData, response, data) {
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								var basicsUnitLookupDataService = $injector.get('basicsUnitLookupDataService');
								if(basicsUnitLookupDataService){
									basicsUnitLookupDataService.resetCache({lookupType : 'basicsUnitLookupDataService'});
								}
							}
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function(result, data) {
								var res = serviceContainer.data.handleReadSucceeded(result, data);
								data.UnitsAreLoaded = true;

								return res;
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'basics.unit',
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: null,
							pinningOptions: null,
							withExecutionHints: true
						}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(basicsUnitServiceOption);
			var service = serviceContainer.service;
			var data = serviceContainer.data;
			data.UnitsAreLoaded = false;

			service.preloadData = function() {
				if (platformPermissionService.hasRead('438973c14ead47d3a651742bbc9b5696')) {
					service.load();
					data.UnitsAreLoaded = true;
				}
			};

			service.hasUnitsLoaded = function hasUnitsLoaded() {
				return data.UnitsAreLoaded;
			};

			service.hasBaseUnitForDimension = function hasBaseUnitForDimension(unit) {
				return !!_.find(data.itemList, function(uom) {
					return uom.IsBase &&
					uom.LengthDimension === unit.LengthDimension &&
					uom.TimeDimension === unit.TimeDimension &&
					uom.MassDimension === unit.MassDimension;
				});
			};

			return service;

		}]);
})(angular);
