/*
 * $Id: project-info-request-node-data-service.js 633803 2021-04-25 09:39:23Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestNodeDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestNodeDataService is a data service for info request
	 */
	module.factory('projectInfoRequestNodeDataService', ['_', '$http',
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'cloudDesktopPinningContextService', 'platformDataServiceSelectionExtension',
		'platformDataServiceMandatoryFieldsValidatorFactory', 'platformRuntimeDataService',

		function (_, $http,
			platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
			cloudDesktopPinningContextService, platformDataServiceSelectionExtension,
			fieldsValidatorFactory, platformRuntimeDataService) {

			function createInforRequestNodeDataService(parentDataService, moduleName) {

				// var parentDataService = $injector.get(parentService);
				var projectInfoRequestDataServiceOption = {
					flatNodeItem: {
						module: moduleName,
						serviceName: 'projectInfoRequestDataService',
						entityNameTranslationID: 'project.translation.resourceEntity',
						httpCreate: {
							route: globals.webApiBaseUrl + 'project/rfi/informationrequest/'
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'InfoRequestDto',
							moduleSubModule: 'Project.InfoRequest'
						}), {processItem: processItem}],
						modification: {},
						entityRole: {
							node: {
								itemName: 'Request',
								moduleName: 'Project InfoRequest',
								mainItemName: 'Request',
								parentService: parentDataService
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									for (var prop in creationData) {
										if (creationData.hasOwnProperty(prop)) {
											delete creationData[prop];
										}
									}

									var context = cloudDesktopPinningContextService.getPinningItem('project.main');
									if (context) {
										creationData.PKey1 = context.id;
									}

								}
							}
						}
					}
				};

				var container = platformDataServiceFactory.createNewComplete(projectInfoRequestDataServiceOption);
				container.data.newEntityValidator = fieldsValidatorFactory.createValidator('projectInfoRequestValidationService', 'Code');
				var service = container.service;

				var pinnedProject;

				service.canCreate = function canCreate() {
					var context = cloudDesktopPinningContextService.getPinningItem('project.main');
					return !(_.isNull(context) || _.isUndefined(context)) && context && context.id >= 1 && parentDataService.getList().length>0;
				};
				service.canDelete = function canDelete() {
					var context = cloudDesktopPinningContextService.getPinningItem('project.main');
					return !(_.isNull(context) || _.isUndefined(context)) && context && context.id >= 1 && parentDataService.getList().length>0 && service.hasSelection();
				};

				container.data.doNotLoadOnSelectionChange = true;
				container.data.doNotDeselctOnClearContent = true;
				container.data.clearContent = function clearListContent() {
				};
				container.service.setSelected = function setSelectedRCI(item, entities) {
					platformDataServiceSelectionExtension.doSelectEntities(entities, container.data);
					return platformDataServiceSelectionExtension.doSelect(item, container.data);
				};

				container.service.setSelectedEntities = function setSelectedEntities(entities) {
					return platformDataServiceSelectionExtension.doSelectEntities(entities, container.data);
				};

				container.service.deselect = function deselectRCI() {
					return platformDataServiceSelectionExtension.deselect(container.data);
				};
				container.service.loadAllRequests = function loadAllRequests() {
					var data = container.data;

					var httpReadRoute = globals.webApiBaseUrl + 'project/rfi/informationrequest/getbyproject';

					var context = cloudDesktopPinningContextService.getPinningItem('project.main');
					if (context) {
						httpReadRoute += '?projectId=' + context.id;
					} else {
						data.handleReadSucceeded({}, data);
						return;
					}

					return $http.get(httpReadRoute).then(function (response) {
						pinnedProject = context.id;
						angular.forEach(response.data, function (item) {
							var obj = {};
							obj.Action = 'Marker';
							obj.actionList = [];
							item.Action = obj;
							processItem(item);
						});
						return data.handleReadSucceeded(response.data, data);
					});
				};

				parentDataService.registerListLoaded(service.loadAllRequests);

				service.getFilteredList = function getFilteredList() {
					var result = [];
					var project;
					var context = cloudDesktopPinningContextService.getPinningItem('project.main');
					if (context) {
						project = context.id;
					}
					if (project && project !== pinnedProject) {
						pinnedProject = project;
						result = _.filter(container.data.itemList, {ProjectFk: project});
					}
					return result;
				};

				cloudDesktopPinningContextService.onSetPinningContext.register(service.loadAllRequests);
				cloudDesktopPinningContextService.onClearPinningContext.register(service.loadAllRequests);

				container.service.setActionActive = function () {
				};

				function processItem(item) {
					var fields = [
						{
							field: 'ModelFk',
							readonly: !!item.ModelFk
						}
					];
					platformRuntimeDataService.readonly(item, fields);
				}

				return service;
			}

			return {
				createInforRequestNodeDataService: createInforRequestNodeDataService
			};
		}]);
})();
