/**
 * Created by Frank Baedeker on 25.08.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.location';
	var projectLocationModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectLocationMainService
	 * @function
	 *
	 * @description
	 * projectLocationMainService is the data service for all location related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectLocationModule.factory('projectLocationMainService', ['_', 'globals', '$http', '$q', 'projectMainService', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension',
		'projectLocationMainImageProcessor', 'platformDataServiceDataProcessorExtension', 'platformDataServiceMandatoryFieldsValidatorFactory', 'mainViewService',
		'$timeout', 'basicsCompanyNumberGenerationInfoService', 'platformDataServiceFieldReadonlyProcessorFactory',

		function (_, globals, $http, $q, projectMainService, platformDataServiceFactory, ServiceDataProcessArraysExtension, projectLocationMainImageProcessor,
			platformDataServiceDataProcessorExtension, platformDataServiceMandatoryFieldsValidatorFactory, mainViewService,
			$timeout, basicsCompanyNumberGenerationInfoService, platformDataServiceFieldReadonlyProcessorFactory) {

			function doLoadStructure(projectId) {
				if (_.isNull(projectId) || _.isUndefined(projectId)) {
					return $q.when([]);
				}
				else {
					return $http.get(globals.webApiBaseUrl + 'project/location/treebyprojects?projectId=' + projectId);
				}
			}

			var locationFkToSelect;

			var locationServiceInfo = {// new SubItemBase(globals.webApiBaseUrl + 'project/location/', 'Locations', projectMainService, locationCRUDInfo);
				hierarchicalLeafItem: {
					module: projectLocationModule,
					serviceName: 'projectLocationMainService',
					httpCreate: {route: globals.webApiBaseUrl + 'project/location/'},
					httpRead: {route: globals.webApiBaseUrl + 'project/location/'},
					httpUpdate: {route: globals.webApiBaseUrl + 'project/location/', endUpdate: 'update'},
					dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor,
						platformDataServiceFieldReadonlyProcessorFactory.createProcessor([
							{field: 'Code', evaluate: function(item) {
								if (item.Version === 0) {
									var selectedProject = projectMainService.getSelected();

									if (selectedProject && selectedProject.RubricCatLocationFk && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService').hasToGenerateForRubricCategory(selectedProject.RubricCatLocationFk)) {
										item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService').provideNumberDefaultText(selectedProject.RubricCatLocationFk, item.Code);
										return true;
									} else {
										return false;
									}
								}else {
									return false;
								}
							}} ])
					],
					presenter: {
						tree: {
							parentProp: 'LocationParentFk', childProp: 'Locations',
							initCreationData: function initCreationData(creationData) {
								creationData.Id = projectMainService.getSelected().Id;
								var parentId = creationData.parentId;
								delete creationData.MainItemId;
								delete creationData.parentId;
								if(!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
									creationData.PKey1 = parentId;
								}
							}
						}
					},
					translation: {
						uid: 'projectLocationMainService',
						title: 'project.location.location',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {typeName: 'LocationDto', moduleSubModule: 'Project.Location'}
					},
					entityRole: {
						leaf: {
							itemName: 'Locations',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(locationServiceInfo);
			container.data.newEntityValidator = platformDataServiceMandatoryFieldsValidatorFactory.createValidator('projectLocationValidationService', 'Code');
			container.data.hasToReduceTreeStructures = true;

			var CHILD_PROP = locationServiceInfo.hierarchicalLeafItem.presenter.tree.childProp;
			var PARENT_PROP = locationServiceInfo.hierarchicalLeafItem.presenter.tree.parentProp;

			var service = container.service;

			service.getLocationStructure = function (projectId) {
				return doLoadStructure(projectId);
			};

			service.upgradeLocation = function upgradeLocation() {
				var destination, itemToMove, oldParent, parentFk;
				itemToMove = service.getSelected();

				if (itemToMove && itemToMove.Id) {
					parentFk = itemToMove[PARENT_PROP];
					if (parentFk) {
						oldParent = service.getItemById(itemToMove[PARENT_PROP]);
						destination = service.getItemById(oldParent[PARENT_PROP]);

						if (destination && destination.Id) {
							itemToMove.LocationParentFk = oldParent.LocationParentFk;
							destination.Locations.push(itemToMove);

							_.remove(oldParent[CHILD_PROP], function (treeItem) {
								return treeItem.Id === itemToMove.Id;
							});
							container.data.markItemAsModified(destination, container.data);
							container.data.markItemAsModified(oldParent, container.data);

						} else {
							itemToMove.LocationParentFk = null;
							service.getTree().push(itemToMove);

							_.remove(oldParent[CHILD_PROP], function (treeItem) {
								return treeItem.Id === itemToMove.Id;
							});
							container.data.markItemAsModified(itemToMove, container.data);
							container.data.markItemAsModified(oldParent, container.data);
						}
					}
					refreshNodeInfo(service.getTree());
					container.service.gridRefresh();
				}
			};

			/**
			 * refreshs the nodeInfo Objects and the hasChildren flag of an item
			 * @param itemsList
			 * @param level
			 */
			function refreshNodeInfo(itemsList, level) {
				var nodeLevel = level ? level : 0;

				_.each(itemsList, function (item) {
					// set the item level
					item.nodeInfo = item.nodeInfo ? item.nodeInfo : {};
					item.nodeInfo.level = _.clone(nodeLevel);
					// set the nodeInfo
					if (!_.isEmpty(item[CHILD_PROP])) {

						item.nodeInfo.children = true;
						item.HasChildren = true;
						item.nodeInfo.isLastItem = false;
						refreshNodeInfo(item[CHILD_PROP], nodeLevel + 1);

					}
					else {
						item.nodeInfo.children = false;
						item.HasChildren = false;
					}

					platformDataServiceDataProcessorExtension.doProcessItem(item, container.data);
				});
			}

			service.downgradeLocation = function downgradeLocation() {
				var locations, index, itemToMove, newParent, oldParent;
				itemToMove = service.getSelected();// The  element to be down graded

				if (itemToMove && itemToMove.Id) {
					if (itemToMove.LocationParentFk) {
						oldParent = service.getItemById(itemToMove.LocationParentFk);
						locations = oldParent.Locations;
					}
					else {
						locations = service.getTree();
					}

					index = locations.indexOf(itemToMove);
					if (index > 0) {
						newParent = locations[index - 1];
					}

					if (newParent && newParent.Id) {
						newParent.Locations.push(itemToMove);
						itemToMove.LocationParentFk = newParent.Id;

						if (oldParent) {
							_.remove(oldParent[CHILD_PROP], function (treeItem) {
								return treeItem.Id === itemToMove.Id;
							});
						} else {
							_.remove(service.getTree(), function (treeItem) {
								return treeItem.Id === itemToMove.Id;
							});
						}

						container.data.markItemAsModified(itemToMove, container.data);
						container.data.markItemAsModified(newParent, container.data);
						refreshNodeInfo(service.getTree());
						container.service.gridRefresh();
					}
				}
			};

			function selectLocation() {
				if (locationFkToSelect) {
					var item = service.getItemById(locationFkToSelect);
					if (item) {
						service.setSelected(item);
						locationFkToSelect = null;
					}
				}
			}

			service.registerListLoaded(function () {
				$timeout(function(){
					selectLocation();
				});

			});

			service.navigateToLocation = function (item, triggerField) {
				if (_.isObject(item) && _.isNumber(item[triggerField]) && _.isFunction(service.parentService().showTargetContainer)) {
					var targetLocationContainer = '6';
					var success = service.parentService().showTargetContainer(targetLocationContainer);
					if (success) {
						locationFkToSelect = item[triggerField];
						selectLocation();
					}
				}
			};

			service.setTree = function setLocationTree(rootLocations) {
				const data = container.data;
				// clear current data
				data.doClearModifications(null, data);
				data.selectedItem = null;
				data.itemTree.length = 0;
				for (var i = 0; i < rootLocations.length; ++i) {
					data.itemTree.push(rootLocations[i]);
				}
				data.itemList.length = 0;
				data.flatten(data.itemTree, data.itemList, 'Locations');

				container.data.listLoaded.fire();
			};

			return service;

		}
	]);
})(angular);
