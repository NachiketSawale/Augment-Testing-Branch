/**
 * Created by joshi on 16.09.2014.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';
	/* global globals */

	/**
	 * @ngdoc service
	 * @name basicsCostCodesPriceVersionDataService
	 * @function
	 *
	 * @description
	 * basicsCostCodesPriceVersionDataService
	 */

	/* jshint -W072 */
	angular.module(moduleName).factory('basicsCostCodesPriceVersionDataService', [
		'platformDataServiceFactory', 'ServiceDataProcessDatesExtension',
		'$injector', 'platformPermissionService',
		function (platformDataServiceFactory, ServiceDataProcessDatesExtension,
			$injector, platformPermissionService) {

			let serviceOption = {
				flatRootItem: {
					module: moduleName + '.priceVersion',
					serviceName: 'basicsCostCodesPriceVersionDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/costcodes/versions/'
					},
					entityRole: {
						root: {itemName: 'PriceVersion'}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo', 'DataDate'])],
					entitySelection: {supportsMultiSelection: false},
					entityNameTranslationID: 'basics.costcodes.priceVerion',
					translation: {
						uid: 'basicsCostCodesPriceVersionDataService',
						title: 'basics.costcodes.priceVerion.grid.title',
						columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'CostcodePriceVerDto', moduleSubModule: 'Basics.CostCodes' }
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = serviceContainer.service;
			let data = serviceContainer.data;

			service.loadData=function () {
				if (platformPermissionService.hasRead('b0f893daa2e142489a24fb0e34546897')) {
					service.load();
				}
			};

			service.loadData();


			data.newEntityValidator = newEntityValidator();

			function newEntityValidator() {
				return {
					validate: function validate(entity) {
						let validateService = $injector.get('basicsCostCodesPriceVersionValidationService');
						validateService.validateEntity(entity);
					}
				};
			}

			return service;
		}
	]);
})(angular);
