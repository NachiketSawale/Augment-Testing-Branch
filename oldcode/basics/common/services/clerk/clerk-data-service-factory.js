/**
 * Created by wed on 07/05/2017.
 */

(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('bascisCommonClerkDataServiceFactory', [
		'$injector', '$http', 'platformDataServiceFactory',
		'basicsLookupdataLookupFilterService', 'ServiceDataProcessDatesExtension', 'basicsCommonClerkValidationServiceFactory',
		'basicsCommonReadDataInterceptor', 'platformRuntimeDataService', 'documentsProjectDocumentDataService', 'documentsProjectDocumentModuleContext', '_', 'globals',
		'platformModuleStateService', 'basicsLookupdataLookupDescriptorService', 'basicsCommonMandatoryProcessor',
		function (
			$injector, $http, platformDataServiceFactory,
			basicsLookupdataLookupFilterService, ServiceDataProcessDatesExtension, basicsCommonClerkValidationServiceFactory,
			basicsCommonReadDataInterceptor, platformRuntimeDataService, documentsProjectDocumentDataService, documentsProjectDocumentModuleContext, _, globals,
			platformModuleStateService, basicsLookupdataLookupDescriptorService, basicsCommonMandatoryProcessor) {
			const service = {}, instanceCache = {};

			service.getService = function (qualifier, parentServiceName, itemName, doesRequireLoadAlways, contactClerkExtendServiceName) {
				let contactClerkExtendDataService;
				const cacheKey = qualifier.replace(/\./g, '') + parentServiceName.toLowerCase();
				const itemData = itemName ? itemName : 'ClerkData';
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
							serverSide: true,
							fn: function () {
								return 'IsLive = true';
							}
						}
					]);

					if (contactClerkExtendServiceName) {
						contactClerkExtendDataService = $injector.get(contactClerkExtendServiceName);
					}
					// create dataservice
					let parentService = $injector.get(parentServiceName);
					// should get the document data service accroding the difference module config
					if (parentServiceName === 'documentsProjectDocumentDataService') {
						const config = documentsProjectDocumentModuleContext.getConfig();
						parentService = documentsProjectDocumentDataService.getService(config);
					}
					const srvOption = {
						flatLeafItem: {
							module: moduleName,
							serviceName: cacheKey,
							entityNameTranslationID: 'basics.clerk.entityClerk',
							httpRead: {
								route: globals.webApiBaseUrl + 'basics/common/clerk/',
								endRead: 'listclerk',
								usePostForRead: true,
								initReadData: function (readData) {
									angular.extend(readData, {
										Qualifier: qualifier,
										MainItemId: parentService.getIfSelectedIdElse(0)
									});
								}
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'basics/common/clerk/',
								endCreate: 'createclerk'
							},
							dataProcessor: [new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo'])],
							presenter: {
								list: {
									initCreationData: function (creationData) {
										creationData.Qualifier = qualifier;
										creationData.MainItemId = parentService.getIfSelectedIdElse(0);
									},
									incorporateDataRead: function incorporateDataRead(readItems, data) {
										const Isreadonly = !SetReadonlyor();
										const dataRead = container.data.handleReadSucceeded(readItems, data);
										if (Isreadonly) {
											instance.setFieldReadonly(readItems);
										}

										const name = parentService.getModule().name;
										if (name === 'businesspartner.main' && Isreadonly) {
											const businesspartnerStatusRightService = $injector.get('businesspartnerStatusRightService');
											businesspartnerStatusRightService.setListDataReadonly(readItems, true);
										}
										return dataRead;
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
							}
						}
					};

					const container = platformDataServiceFactory.createNewComplete(srvOption);

					let baseOnDeleteDone = container.data.onDeleteDone;
					// if config the clerk for project document, need to set the project document parent as modifiend, fix issue: #135899
					container.data.onDeleteDone = function(deleteParams, data, response){
						var delEntities = angular.copy(deleteParams.entities);
						baseOnDeleteDone(deleteParams, data, response);
						if(parentService !== null && parentService.getServiceName() === 'documentsProjectDocumentDataService'){
							var leadingService = parentService.parentService();
							if(leadingService !== null && delEntities !== null){
								var storedEntities = _.filter(delEntities, function (entity) {
									return entity.Version > 0;
								});
								if(!_.isNil(storedEntities) && storedEntities.length !== 0){
									leadingService.markCurrentItemAsModified();
								}else{
									var modState = platformModuleStateService.state(leadingService.getModule());
									if(!_.isNil(modState)){
										modState.modifications.EntitiesCount -= 1;
									}
								}
							}
						}
					};

					if (contactClerkExtendDataService) {
						contactClerkExtendDataService.beforeInitAdditionalServices(container);
					}

					const instance = container.service;

					const validateService = basicsCommonClerkValidationServiceFactory.getService(qualifier, instance);
					container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						mustValidateFields:['ClerkFk', 'ClerkRoleFk', 'ContextFk'],
						typeName: 'ClerkDataDto',
						moduleSubModule: 'Basics.Common',
						validationService: validateService
					});

					instance.getClerkEmails = function (mainItemId, clerkFks) {
						const url = globals.webApiBaseUrl + 'basics/common/clerk/listclerkemails';
						const param = {
							Qualifier: qualifier,
							MainItemId: mainItemId,
							ClerkFks: clerkFks
						};
						return $http.post(url, param).then(function (response) {
							return response.data;
						}, function () {
							return [];
						});
					};

					const SetReadonlyor = function () {
						const name = parentService.getModule().name;
						if (_.includes(name, 'procurement.contract') || name === 'businesspartner.main') {
							const getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
							if (getModuleStatusFn) {
								const status = getModuleStatusFn();
								return !(status.IsReadOnly || status.IsReadonly);
							}
							return false;
						}
						return true;
					};

					const canCreate = instance.canCreate;
					instance.canCreate = function () {
						return canCreate() && SetReadonlyor();
					};
					const canDelete = instance.canDelete;
					instance.canDelete = function () {
						return canDelete() && SetReadonlyor();
					};

					const readonlyFields = [
						{field: 'ClerkFk', readonly: true}, {field: 'ClerkRoleFk', readonly: true},
						{field: 'ValidFrom', readonly: true}, {field: 'ValidTo', readonly: true},
						{field: 'CommentText', readonly: true}];

					instance.setFieldReadonly = function (items) {
						if (_.isArray(items)) {
							_.forEach(items, function (item) {
								platformRuntimeDataService.readonly(item, readonlyFields);
							});
						}
					};

					// do create the total item when parent created
					const onParentItemCreated = function onParentItemCreated(e, args) {
						if (itemData === 'ClerkData') {
							instance.setCreatedItems(args.clerkItems);
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

			service.getClerkEmails = function (clerkFks) {
				const url = globals.webApiBaseUrl + 'basics/common/clerk/listclerkemails';
				const param = {
					Qualifier: null,
					MainItemId: -1,
					ClerkFks: clerkFks
				};
				return $http.post(url, param).then(function (response) {
					return response.data;
				}, function () {
					return [];
				});
			};
			return service;

		}]);
})(angular);