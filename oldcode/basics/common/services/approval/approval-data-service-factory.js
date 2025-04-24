/**
 * Created by pel on 19/09/2022.
 */

(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('bascisCommonApprovalDataServiceFactory', [
		'$injector', '$http', 'platformDataServiceFactory',
		'basicsLookupdataLookupFilterService', 'ServiceDataProcessDatesExtension', 'basicsCommonApprovalValidationServiceFactory',
		'basicsCommonReadDataInterceptor', 'platformRuntimeDataService',  '_', 'globals','platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDataService','basicsLookupdataLookupDescriptorService',
		function (
			$injector, $http, platformDataServiceFactory,
			basicsLookupdataLookupFilterService, ServiceDataProcessDatesExtension, basicsCommonApprovalValidationServiceFactory,
			basicsCommonReadDataInterceptor, platformRuntimeDataService,  _, globals, platformDataServiceProcessDatesBySchemeExtension,
			basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService) {
			const service = {}, instanceCache = {};

			service.getService = function (qualifier, parentServiceName, itemName, doesRequireLoadAlways) {
				const cacheKey = qualifier.replace(/\./g, '') + parentServiceName.toLowerCase();
				const itemData = itemName ? itemName : 'ApprovalData';
				let loadAlways = false;
				if (_.isBoolean(doesRequireLoadAlways)) {
					loadAlways = doesRequireLoadAlways;
				}
				if (instanceCache[cacheKey]) {
					return instanceCache[cacheKey];
				} else {

					// register filter
					basicsLookupdataLookupFilterService.registerFilter([
						{
							key: qualifier + '.filter',
							serverSide: true
						}
					]);

					// create dataservice
					let parentService = $injector.get(parentServiceName);

					const srvOption = {
						flatLeafItem: {
							module: moduleName,
							serviceName: cacheKey,
							entityNameTranslationID: 'basics.common.entityApproval',
							httpRead: {
								route: globals.webApiBaseUrl + 'basics/common/approval/',
								endRead: 'listapproval',
								usePostForRead: true,
								initReadData: function (readData) {
									angular.extend(readData, {
										Qualifier: qualifier,
										MainItemId: parentService.getIfSelectedIdElse(0)
									});
								}
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'basics/common/approval/',
								endCreate: 'createapproval'
							},
							presenter: {
								list: {
									initCreationData: function (creationData) {
										creationData.Qualifier = qualifier;
										creationData.MainItemId = parentService.getIfSelectedIdElse(0);
									},
									handleCreateSucceeded: function (entity) {
										const dataService = service.getService(qualifier, parentServiceName);
										const validateService = basicsCommonApprovalValidationServiceFactory.getService(qualifier, dataService);
										validateService.validateClerkFk(entity, entity.ClerkFk, 'ClerkFk');

									},
									incorporateDataRead: function incorporateDataRead(readItems, data) {
										basicsLookupdataLookupDescriptorService.attachData(readItems);
										return container.data.handleReadSucceeded(readItems.main, data);
									}
								}
							},
							actions: {delete: true, create: 'flat'},
							entityRole: {
								leaf: {
									itemName: itemData,
									parentService: parentService,
									doesRequireLoadAlways: loadAlways
								}
							},
							dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({typeName: 'ApprovalDataDto', moduleSubModule: 'Basics.Common'})]
						}
					};

					const container = platformDataServiceFactory.createNewComplete(srvOption);

					const instance = container.service;

					const canCreate = instance.canCreate;
					instance.canCreate = function () {
						return canCreate();
					};
					const canDelete = instance.canDelete;
					instance.canDelete = function () {
						return canDelete();
					};

					const readonlyFields = [
						{field: 'ClerkFk', readonly: true}, {field: 'ClerkRoleFk', readonly: true}
					];

					instance.setFieldReadonly = function (items) {
						if (_.isArray(items)) {
							_.forEach(items, function (item) {
								platformRuntimeDataService.readonly(item, readonlyFields);
							});
						}
					};



					const onParentItemCreated = function onParentItemCreated(e, args) {
						if (itemData === 'ApprovalData') {
							instance.setCreatedItems(args.approvalItems);
						}
					};

					if (parentService.completeItemCreated) {
						parentService.completeItemCreated.register(onParentItemCreated);
					}

					basicsCommonReadDataInterceptor.init(instance, container.data);
					instanceCache[cacheKey] = instance;

					return instance;
				}
			};


			return service;

		}]);
})(angular);