
(function (angular) {
	'use strict';
	var moduleName = 'basics.biplusdesigner';
	var module = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsBiPlusDesignerDashboard2GroupDataService',
		['$q', 'procurementCommonReadDataInterceptor', 'platformDataServiceFactory', 'basicsBiPlusDesignerService',
			'basicsLookupdataLookupDescriptorService', 'procurementContextService','$translate','$http','$injector',
			function ($q, procurementCommonReadDataInterceptor, dataServiceFactory, parentService,
			          basicsLookupdataLookupDescriptorService, moduleContext,$translate,$http,$injector) {
				var serviceContainer;
				var service;
				var serviceOption = {
					flatLeafItem: {
						module: module,
						serviceName: 'basicsBiPlusDesignerDashboard2GroupDataService',
						entityNameTranslationID: 'basics.biplusdesigner.dashboard2GroupContainerTitle',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard2group/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								var dashboard = parentService.getSelected();
								readData.PKey1 = (dashboard ? dashboard.Id : -1);
							}
						},
						presenter: {
							list: {
								initCreationData: function (creationData) {
									var parentItem = parentService.getSelected();
									creationData.PKey1 = parentItem.Id;
								},
								handleCreateSucceeded: function (newData) {
									var list = serviceContainer.service.getList();
									newData.Visibility = 1;
									if (list.length > 0) {
										newData.Sorting = _.max(_.map(list, 'Sorting')) + 1;
									} else {
										newData.Sorting = 1;
									}

								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'Dashboard2Group',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						translation: {
							uid: 'basicsBiPlusDesignerDashboard2GroupDataService',
							title: 'basics.biplusdesigner.dashboard2GroupContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
						},
						dataProcessor: [],
						actions: {
							delete: true, create: 'flat'
						}
					},
					entitySelection: {}
				};


				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				serviceContainer.data.newEntityValidator = newEntityValidator();
				function newEntityValidator(){
					return {
						validate: function validate(newItem) {
							var validationService = $injector.get('basicsBiPlusDesignerDashboard2GroupValidationService');
							validationService.validateBasDashboardGroupFk(newItem, newItem.BasDashboardGroupFk, 'BasDashboardGroupFk');
						}
					};
				}

				service = serviceContainer.service;

				service.createAccessRightDescriptor = function (entity) {
					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard2group/createAccessRightDescriptor',
						data: entity
					}).then(function (result) {
						entity.FrmAccessRightDescriptorFk = result.data.FrmAccessRightDescriptorFk;
						service.markItemAsModified(entity);
						if (angular.isFunction(parentService.update)) {
							parentService.update();
						}
						return result.data;
					});
				};

				service.deleteAccessRightDescriptor = function (entity) {
					if (entity.FrmAccessRightDescriptorFk && entity.FrmAccessRightDescriptorFk !== -1) {
						entity.FrmAccessRightDescriptorFk = null;
						service.markItemAsModified(entity);
						parentService.update().then(function createAccessRightDescriptor() {
							return $http({
								method: 'POST',
								url: globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard2group/deleteAccessRightDescriptor',
								data: entity
							});
						});
					}
				};

				return service;
			}]);
})(angular);