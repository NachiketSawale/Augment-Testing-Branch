/**
 * Created by lvy on 6/1/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterObjectTemplateDataService', [
		'globals',
		'$injector',
		'platformDataServiceFactory',
		'constructionSystemMasterHeaderService',
		'PlatformMessenger',
		'basicsLookupdataLookupDescriptorService',
		'$http',
		function (
			globals,
			$injector,
			dataServiceFactory,
			parentService,
			PlatformMessenger,
			lookupDescriptorService,
			$http
		) {
			var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/objecttemplate/';
			var serviceContainer;
			var service;
			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMasterObjectTemplateDataService',
					httpCreate: {route: httpRoute},
					httpRead: {route: httpRoute},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
									basicsCostGroupAssignmentService.process(readData, service, {
										mainDataName: 'dtos',
										attachDataName: 'ObjectTemplate2CostGroups',
										dataLookupType: 'ObjectTemplate2CostGroups',
										identityGetter: function (entity) {
											return {
												Id: entity.MainItemId
											};
										}
									});
								}]);

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
							itemName: 'CosObjectTemplate',
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					translation: {
						uid: 'constructionSystemMasterObjectTemplateDataService',
						title: 'constructionsystem.master.2dObjectTemplateGridContainerTitle',
						dtoScheme: {
							typeName: 'CosObjectTemplateDto',
							moduleSubModule: 'ConstructionSystem.Master'
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return canCreate();
						},
						canDeleteCallBackFunc: function () {
							return canDelete();
						}
					},
					dataProcessor: []
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;

			service.parameterValidateComplete = new PlatformMessenger();
			service.parameterValueValidateComplete = new PlatformMessenger();
			service.parameterGetValueListComplete = new PlatformMessenger();
			service.deleteValuesComplete = new PlatformMessenger();

			service.defaultTypeChanged = new PlatformMessenger();
			service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			function canCreate() {
				var lists = service.getList();
				if (lists.length > 0) {
					return false;
				}
				else {
					return true;
				}
			}

			function canDelete() {
				var lists = service.getList();
				if (lists.length > 0) {
					return true;
				}
				else {
					return false;
				}
			}

			return service;
		}]);
})(angular);