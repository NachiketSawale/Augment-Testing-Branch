/**
 * Created by lvy on 9/7/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterObjectTemplate2TemplateDataService', [
		'_',
		'globals',
		'$injector',
		'platformDataServiceFactory',
		'constructionSystemMasterTemplateDataService',
		'PlatformMessenger',
		'basicsLookupdataLookupDescriptorService',
		'$http',
		'basicsCommonReadDataInterceptor',
		'basicsCostGroupAssignmentService',
		function (
			_,
			globals,
			$injector,
			dataServiceFactory,
			parentService,
			PlatformMessenger,
			lookupDescriptorService,
			$http,
			basicsCommonReadDataInterceptor,
			basicsCostGroupAssignmentService) {
			var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/objecttemplate2template/';
			var serviceContainer = {};
			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMasterObjectTemplate2TemplateDataService',
					httpCreate: {route: httpRoute},
					httpRead: {
						route: httpRoute,
						initReadData: function (readData, data) {
							if (!data.filter) {
								readData.filter = '?mainItemId=0';
							} else {
								readData.filter = '?' + data.filter;
								if (data.enhanceFilterByModelObjectSelection) {
									data.enhanceFilterByModelObjectSelection(readData, data);
								}
							}
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								assignCostGroups(readData);
								var result = serviceContainer.data.handleReadSucceeded(readData.dtos, data);
								return result;
							},
							initCreationData: function initCreationData(creationData) {
								creationData.MainItemId = parentService.getSelected().Id;
							}
						}
					},
					entityRole: {
						node: {
							itemName: 'CosObjectTemplate2Template',
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					translation: {
						uid: 'constructionSystemMasterObjectTemplate2TemplateDataService',
						title: 'constructionsystem.master.2dObjectTemplate2TemplateGridContainerTitle'
					},
					actions: {delete: false, create: false},
					dataProcessor: []
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			serviceContainer.data.usesCache = false;
			var service = serviceContainer.service;
			basicsCommonReadDataInterceptor.init(serviceContainer.service, serviceContainer.data);
			parentService.completeEntityCreated.register(createList);


			service.parameterValidateComplete = new PlatformMessenger();
			service.parameterValueValidateComplete = new PlatformMessenger();
			service.parameterGetValueListComplete = new PlatformMessenger();
			service.deleteValuesComplete = new PlatformMessenger();

			service.defaultTypeChanged = new PlatformMessenger();
			service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			function assignCostGroups(readData) {
				basicsCostGroupAssignmentService.process(readData, service, {
					mainDataName: 'dtos',
					attachDataName: 'ObjectTemplate2Template2CostGroups',
					dataLookupType: 'ObjectTemplate2Template2CostGroups',
					identityGetter: function (entity) {
						return {
							Id: entity.MainItemId
						};
					}
				});
			}

			function syncCostGroups(dtos, completeData) {
				var groupService = $injector.get('constructionSystemMasterObjectTemplate2TemplateCostGroupService');
				var readData = {
					dtos: dtos,
					CostGroupCats: service.costGroupCatalogs,
					ObjectTemplate2Template2CostGroups: []
				};
				_.each(completeData.CosObjectTemplate2TemplateToSave, function (tmpl) {
					if (tmpl.CostGroupToSave && tmpl.CostGroupToSave.length > 0) {
						_.each(tmpl.CostGroupToSave, function (group) {
							group.Id = groupService.getEntityNextId();
							readData.ObjectTemplate2Template2CostGroups.push(group);
						});
					}
				});

				assignCostGroups(readData);
			}

			// noinspection JSUnusedLocalSymbols
			function createList(e, completeData) {
				if (!completeData) {
					return;
				}
				if (completeData.CosTemplate) {
					serviceContainer.data.filter = 'mainItemId=' + completeData.CosTemplate.Id;
				}
				/** @namespace completeData.CosParameter2TemplateToSave */
				var newList = [];
				angular.forEach(completeData.CosObjectTemplate2TemplateToSave, function (e) {
					if (e.CosObjectTemplate2Template) {
						newList.push(e.CosObjectTemplate2Template);
					}
				});

				syncCostGroups(newList, completeData);

				if (angular.isArray(newList) && newList.length > 0) {
					serviceContainer.service.setCreatedItems(newList, true);
					_.forEach(newList, function (item) {
						serviceContainer.service.markItemAsModified(item);
					});
					var groupService = $injector.get('constructionSystemMasterObjectTemplate2TemplateCostGroupService');
					groupService.load().then(function () {
						_.each(groupService.getList(), function (item) {
							groupService.markItemAsModified(item);
						});
					});
				}
			}

			return service;
		}]);
})(angular);