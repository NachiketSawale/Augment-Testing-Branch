/**
 * Created by baf on 29.07.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.project');

	/**
	 * @ngdoc service
	 * @name resourceProjectEstimateHeaderDataService
	 * @description pprovides methods to access, create and update resource project estimateHeader entities
	 */
	myModule.service('resourceProjectEstimateHeaderDataService', ResourceProjectEstimateHeaderDataService);

	ResourceProjectEstimateHeaderDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceEntityReadonlyProcessor', 'resourceProjectConstantValues', 'resourceProjectDataService'];

	function ResourceProjectEstimateHeaderDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformDataServiceEntityReadonlyProcessor, resourceProjectConstantValues, resourceProjectDataService) {
		var self = this;
		var resourceProjectEstimateHeaderServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'resourceProjectEstimateHeaderDataService',
				entityNameTranslationID: 'resource.project.estimateHeaderEntity',
				httpRead: {
					route: globals.webApiBaseUrl + 'estimate/project/',
					endRead: 'list',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceProjectDataService.getSelected();
						readData.projectFk = selected.Id;
					}
				},
				actions: {delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceProjectConstantValues.schemes.estimateHeader),
				platformDataServiceEntityReadonlyProcessor],
				presenter: { list: { } },
				entityRole: {
					node: {itemName: 'Estimates', parentService: resourceProjectDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceProjectEstimateHeaderServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.onReadSucceeded = function onReadSucceededSales(readItems, data) {
			var res = [];
			_.forEach(readItems, function(item) {
				res.push(item.EstHeader);
			});

			serviceContainer.data.handleReadSucceeded(res, data);

			return res;
		};

		serviceContainer.service.getSelectedProjectId = function getSelectedProjectId() {
			var selected = resourceProjectDataService.getSelected();

			return selected.Id;
		};
	}
})(angular);
