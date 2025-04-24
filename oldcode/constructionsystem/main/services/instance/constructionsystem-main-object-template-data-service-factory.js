/**
 * Created by lvy on 3/13/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/* global _ */
	/**
     * @ngdoc service
     * @name constructionSystemMainObjectTemplateDataService
     * @function
     * @requires Data service for Object template
     *
     * @description
     * #
     *  data service for constuctionsystem main object template grid/form controller.
     * */
	angular.module(moduleName).factory('cosMainObjectTemplateDataServiceFactory', [
		'globals',
		'$q',
		'$http',
		'$timeout',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'$injector',
		'platformDataServiceModificationTrackingExtension',
		'basicsCostGroupAssignmentService',
		function (globals,
			$q,
			$http,
			$timeout,
			PlatformMessenger,
			platformDataServiceFactory,
			basicsLookupdataLookupDescriptorService,
			$injector,
			platformDataServiceModificationTrackingExtension,
			basicsCostGroupAssignmentService) {

			function getService(parentService, doesRequireLoadAlways) {
				var loadAlways = doesRequireLoadAlways === null ? true : doesRequireLoadAlways;
				var serviceOptions = {
					flatNodeItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMainObjectTemplateDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/main/objecttemplate/',
							endRead: 'list',
							usePostForRead: true,
							initReadData: function (readData) {
								var obj = parentService.getSelected();
								if (obj && obj.Id && obj.InstanceHeaderFk) {
									readData.CosInsHeaderId = obj.InstanceHeaderFk;
									readData.InstanceId = obj.Id;
								} else {
									readData.CosInsHeaderId = -1;
									readData.InstanceId = -1;
								}
							}
						},
						dataProcessor: [],
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							node: {
								itemName: 'CosInsObjectTemplate',
								parentService: parentService,
								doesRequireLoadAlways: loadAlways
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
						}
					}
				};
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				var service = serviceContainer.service;
				service.onCostGroupCatalogsLoaded = new PlatformMessenger();

				function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData || {});
					service.assignCostGroups(readData);
					return data.handleReadSucceeded(readData.Main || [], data);
				}

				function canCreate() {
					var lists = service.getList();
					return lists.length <= 0;
				}

				function canDelete() {
					var lists = service.getList();
					return lists.length > 0;
				}

				service.updateObjectTemplateByInsTemplateId = function updateObjectTemplateByInsTemplateId(postData) {
					$http.post(globals.webApiBaseUrl + 'constructionsystem/main/objecttemplate/getListByMasterTemlatepId', postData).then(function (response) {
						if (_.isArray(response.data.InsObjectTemplates)) {
							var currentList = service.getList();
							_.forEach(currentList, function (item) {
								platformDataServiceModificationTrackingExtension.markAsDeleted(service, item, serviceContainer.data);
							});
							service.syncCostGroups(response.data.InsObjectTemplates, [{
								CostGroupToSave: _.flatten(_.map(_.filter(response.data.InsObjectTemplates, function (item) {
									return item.CostGroups && item.CostGroups.length > 0;
								}), function (item) {
									return item.CostGroups;
								}))
							}]);
							service.setList(response.data.InsObjectTemplates);
							service.setSelected(response.data.InsObjectTemplates[0]);

							var groupService = $injector.get('constructionSystemMainObjectTemplateCostGroupService');
							groupService.load().then(function () {
								_.each(groupService.getList(), function (item) {
									groupService.markItemAsModified(item);
								});
							});
						}
						if (_.isArray(response.data.InsObjectTemplatePropertys)) {
							var cosMainObjectTemplatePropertyDataService = $injector.get('constructionSystemMainObjectTemplatePropertyDataService');
							cosMainObjectTemplatePropertyDataService.setListFromTemplate(response.data.InsObjectTemplatePropertys);
						}
					});
				};

				// #94793 - When a instance is selected, the object template should be selected automatically.
				service.registerListLoaded(function () {
					var selected = service.getSelected();

					if (!selected) {
						var list = service.getList();
						if (list.length) {
							selected = list[0];
							$timeout(function () {
								service.setSelected(selected);
							});
						}
					}
				});

				service.assignCostGroups = function (readData) {
					basicsCostGroupAssignmentService.process(readData, service, {
						mainDataName: 'Main',
						attachDataName: 'ObjectTemplate2CostGroups',
						dataLookupType: 'ObjectTemplate2CostGroups',
						identityGetter: function (entity) {
							return {
								Id: entity.MainItemId
							};
						}
					});
				};

				service.syncCostGroups = function (dtos, completeData) {
					var groupService = $injector.get('constructionSystemMainObjectTemplateCostGroupService');
					var readData = {
						Main: dtos,
						CostGroupCats: service.costGroupCatalogs,
						ObjectTemplate2CostGroups: []
					};
					_.each(completeData, function (tmpl) {
						if (tmpl.CostGroupToSave && tmpl.CostGroupToSave.length > 0) {
							_.each(tmpl.CostGroupToSave, function (group) {
								group.Id = groupService.getEntityNextId();
								readData.ObjectTemplate2CostGroups.push(group);
							});
						}
					});

					service.assignCostGroups(readData);
				};

				service.getServiceContainerData = function() {
					return serviceContainer.data;
				};

				return service;
			}

			return {
				getService: getService
			};
		}]);
})(angular);