/**
 * Created by shen on 02/10/2020
 */

(function (angular) {
	/* global globals,_ */
	'use strict';
	var myModule = angular.module('resource.requisition');

	/**
	 * @ngdoc service
	 * @name resourceRequisitionItemDataService
	 * @description pprovides methods to access, create and update resource requisitionitem entities
	 */
	myModule.service('resourceRequisitionItemDataService', ResourceRequisitionItemDataService);

	ResourceRequisitionItemDataService.$inject = [
		'$http', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceRequisitionConstantValues', 'resourceRequisitionDataService', 'resourceRequisitionItemReadOnlyProcessor',
		'platformDataServiceActionExtension', 'platformSchemaService'
	];

	function ResourceRequisitionItemDataService(
		$http, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceRequisitionConstantValues, resourceRequisitionDataService, resourceRequisitionItemReadOnlyProcessor,
		platformDataServiceActionExtension, platformSchemaService
	) {
		var self = this;
		var service;
		let data;
		let initCreationData = function initCreationData(creationData) {
			let selected = resourceRequisitionDataService.getSelected();
			creationData.PKey1 = selected.Id;
			creationData.PKey2 = selected.StockFk;
		};
		var resourceRequisitionItemServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'resourceRequisitionItemDataService',
				entityNameTranslationID: 'resource.requisition.requisitionItemEntity',

				httpCreate: {
					route: globals.webApiBaseUrl + 'resource/requisition/requisitionitem/'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/requisition/requisitionitem/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceRequisitionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(resourceRequisitionConstantValues.schemes.requisitionItem),
					{processItem: asyncUpdateTransitionData},
					resourceRequisitionItemReadOnlyProcessor
				],
				presenter: {
					list: {
						initCreationData: initCreationData
					}
				},
				entityRole: {
					node: {
						itemName: 'RequisitionItems',
						parentService: resourceRequisitionDataService
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceRequisitionItemServiceOption, self);

		serviceContainer.data.Initialised = true;
		service = serviceContainer.service;
		data = serviceContainer.data;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceRequisitionItemValidationService'
		}, resourceRequisitionConstantValues.schemes.requisitionItem));

		function asyncUpdateTransitionData(item) {
			const promises = [];

			// If the item has a non-empty Stock
			if (item.StockFk) {
				// Retrieve the stock master data to get stock's ProjectFk
				var promisedProjectFk = $http.post(globals.webApiBaseUrl + 'project/stock/byid', {PKey1: item.StockFk})
					.then(function (response) {
						if (response && response.data && response.data.ProjectFk) {
							// If the response is valid, rewrite the original (transitive) item's ProjectFk with
							//  the ProjectFk from the Stock
							item.Projectfk = response.data.ProjectFk;
						}
					});

				promises.push(promisedProjectFk);
			}

			if (item.MaterialFk) {
				var promisedDescription = $http.get(globals.webApiBaseUrl + 'basics/material/getbyid?id=' + item.MaterialFk)
					.then(function (response) {
						if (response && response.data) {
							if (!item.Description && response.data.DescriptionInfo1) {
								item.Description = response.data.DescriptionInfo1.Description;
							}
							item.UomFk = response.data.UomFk;
						}

					});

				promises.push(promisedDescription);
			}

			// Fire the modified item event to update the values
			return Promise.all(promises)
				.then(function () {
					// data.markItemAsModified(item, data);
				});
		}

		service.asyncUpdateTransitionData = asyncUpdateTransitionData;

		serviceContainer.data.requisitionItemChanged = new Platform.Messenger();
		serviceContainer.service.requisitionItemChanged = function (e, entity) {
			serviceContainer.data.requisitionItemChanged.fire(e, entity);
		};

		serviceContainer.service.getMaterialLookupSelectedItems = function getMaterialLookupSelectedItems(selectedItems) {
			var creationData = {};
			initCreationData(creationData, {}, null, true);
			var materialIds = [];
			var addItems = _.slice(selectedItems, 1);
			_.forEach(addItems, function (item) {
				materialIds.push(item.Id);
			}
			);
			let createPrcItemParameter = {
				requisitionCreateParameter: creationData,
				MaterialIds: materialIds
			};
			let validateItems = function validateItems(items) {
				let dtoScheme = platformSchemaService.getSchemaFromCache(resourceRequisitionConstantValues.schemes.requisitionItem).properties;
				$injector.get('resourceRequisitionContainerInformationService').getResourceRequisitionItemLayout();
				let allCols = _.
					filter($injector.
						get('resourceRequisitionContainerInformationService').
						getResourceRequisitionItemLayout().groups, i => i.gid !== 'entityHistory'
					).
					map(i => i.attributes).
					flat();
				let allColumns = _.filter(Object.keys(dtoScheme), col => allCols.includes(col.toLowerCase()));
				let validation = $injector.get('resourceRequisitionItemValidationService');
				_.forEach(items, function (item) {
					_.forEach(allColumns, function (column) {
						let validationMethodName = 'validate' + column;
						let asyncValidationMethodName = 'asyncValidate' + column;
						if(_.isFunction(validation[validationMethodName])){
							validation[validationMethodName](item, item[column], column);
						}
						if(_.isFunction(validation[asyncValidationMethodName])){
							validation[asyncValidationMethodName](item, item[column], column);
						}
					});
				});
			};
			$http.post(globals.webApiBaseUrl + 'resource/requisition/requisitionitem/multicreate', createPrcItemParameter).then(function (response) {
				let itemList = response.data;
				_.forEach(itemList, function (item) {
					serviceContainer.data.itemList.push(item);
					serviceContainer.data.markItemAsModified(item, serviceContainer.data);
					platformDataServiceActionExtension.fireEntityCreated(serviceContainer.data, item);
				});
				validateItems(itemList);
			}, function (err) {
				window.console.error(err);
			});
		};

	}
})(angular);
