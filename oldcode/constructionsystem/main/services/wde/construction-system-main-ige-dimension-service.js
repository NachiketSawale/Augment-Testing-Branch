/**
 * Created by wui on 6/21/2018.
 */
/* global _,globals */
(function(angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainIgeDimensionService', [
		'$http',
		'modelWdeViewerIgeDimensionServiceFactory',
		'constructionSystemMainInstanceService',
		'constructionSystemMainObjectTemplateDataService',
		'constructionSystemMainInstance2ObjectService',
		'constructionSystemMainObjectService',
		'modelMainObjectLookupDataService',
		'modelViewerObjectTreeService',
		'constructionSystemMainInstanceProgressService',
		function(
			$http,
			modelWdeViewerDimensionServiceFactory,
			constructionSystemMainInstanceService,
			constructionSystemMainObjectTemplateDataService,
			constructionSystemMainInstance2ObjectService,
			constructionSystemMainObjectService,
			modelMainObjectLookupDataService,
			modelViewerObjectTreeService,
			constructionSystemMainInstanceProgressService) {
			var service,
				options = {
					objectUsageContract: 'Cos.Main.ObjectUsage',
					objectTemplateContract: 'Cos.Main.ObjectTemplate',
					headerService: constructionSystemMainInstanceService,
					assignedObjectService: constructionSystemMainInstance2ObjectService,
					mapHeaderId: function (header) {
						return {
							Id: header.Id,
							PKey1: header.InstanceHeaderFk
						};
					},
					mapObjectId: function (assignObject) {
						return {
							Id: assignObject.ObjectFk,
							PKey1: assignObject.ModelFk
						};
					},
					getObjectTemplate: function () {
						// var objectTemplate = {
						//     mode: WDE_CONSTANTS.DIMENSION_MODE.AREA,
						//     name: '',
						//     height: 0,
						//     multiplier: 0,
						//     positiveColor: null,
						//     negativeColor: null,
						//     positiveTexture: null,
						//     negativeTexture: null
						// };
						var objectTemplate, objectTemplates = constructionSystemMainObjectTemplateDataService.getList();

						if (objectTemplates.length) {
							objectTemplate = {};
							objectTemplate.id = objectTemplates[0].Id;
							objectTemplate.mode = objectTemplates[0].MdlDimensionTypeFk;
							objectTemplate.name = objectTemplates[0].Description;
							objectTemplate.height = objectTemplates[0].Height;
							objectTemplate.multiplier = objectTemplates[0].Multiplier;
							objectTemplate.offset = objectTemplates[0].Offset;
							objectTemplate.positiveColor = objectTemplates[0].PositiveColor;
							objectTemplate.negativeColor = objectTemplates[0].NegativeColor;
							objectTemplate.positiveTexture = objectTemplates[0].MdlObjectTexturePosFk;
							objectTemplate.negativeTexture = objectTemplates[0].MdlObjectTextureNegFk;
						}

						return objectTemplate;
					},
					onDimensionCreated: function (res) {
						// update model object lookup cache.
						var modelId = constructionSystemMainInstanceService.getCurrentSelectedModelId();
						modelMainObjectLookupDataService.setFilter(modelId);
						var list = modelMainObjectLookupDataService.getListSync({
							lookupType: 'modelProjectModelLookupDataService'
						});
						list.push(res.data.ModelObject);
						// todo-wui: update object tree info, there is no method to add new model object to current tree info.
						modelViewerObjectTreeService.loadTree(res.data.ModelFk);
						// constructionSystemMainInstanceService.updateStatusToModified();
						refreshInstanceStatus();

						refreshObjects(res.data.ModelFk,  {
							modelId: res.data.ModelFk,
							objectId: res.data.ModelObjectFk
						});

						refreshAssignedObjects(res.data.ModelFk,  {
							modelId: res.data.ModelFk,
							objectId: res.data.ModelObjectFk
						});
					},
					onDimensionDelete: function (modelId) {
						refreshAssignedObjects(modelId);
						refreshObjects(modelId);
						refreshInstanceStatus();
					},
					onDimensionUpdate: function (modelId, dimension, onlyProperty) {
						if (onlyProperty) {
							var assignedObject = constructionSystemMainInstance2ObjectService.getSelected();

							if (assignedObject && assignedObject.ModelFk === dimension.ModelFk && assignedObject.ObjectFk === dimension.ModelObjectFk) {
								constructionSystemMainInstance2ObjectService.propertyReload.fire();
							}

							var modelObject = constructionSystemMainObjectService.getSelected();

							if (modelObject && modelObject.ModelFk === dimension.ModelFk && modelObject.Id === dimension.ModelObjectFk) {
								constructionSystemMainObjectService.propertyReload.fire();
							}
						} else {
							updateObjectDescription(modelId, dimension.ModelObjectFk, dimension.Name);
							refreshAssignedObjects(modelId);
							refreshObjects(modelId);
						}

						refreshInstanceStatus();
					},
					onDimensionsUpdate: function(modelId, dimensions, onlyProperty) {
						if (onlyProperty) {
							var assignedObject = constructionSystemMainInstance2ObjectService.getSelected();

							if (assignedObject && _.find(dimensions, {
								ModelFk: assignedObject.ModelFk,
								ModelObjectFk: assignedObject.ObjectFk
							})) {
								constructionSystemMainInstance2ObjectService.propertyReload.fire();
							}

							var modelObject = constructionSystemMainObjectService.getSelected();

							if (modelObject && _.find(dimensions, {
								ModelFk: modelObject.ModelFk,
								ModelObjectFk: modelObject.Id
							})) {
								constructionSystemMainObjectService.propertyReload.fire();
							}
						} else {
							dimensions.forEach(function (dimension) {
								updateObjectDescription(modelId, dimension.ModelObjectFk, dimension.Name);
							});
							refreshAssignedObjects(modelId);
							refreshObjects(modelId);
						}

						refreshInstanceStatus();
					},
					filterByHeader: function (dimensions) {
						var list = constructionSystemMainInstance2ObjectService.getList();

						return list.map(function (item) {
							return _.find(dimensions, {
								ModelFk: item.ModelFk,
								ModelObjectFk: item.ObjectFk
							});
						});
					},
					onRecalibrateDone: function (data) {
						refreshAssignedObjects(data.modelId);
						refreshObjects(data.modelId);
						refreshInstanceStatus();
					},
					isValidHeader: function (header) {
						return header.IsChecked;
					},
					onDimensionPaste: function (modelId, dimensions, pasteOptions) {
						// update model object lookup cache.
						modelMainObjectLookupDataService.setFilter(modelId);
						var list = modelMainObjectLookupDataService.getListSync({
							lookupType: 'modelProjectModelLookupDataService'
						});
						dimensions.forEach(function (dimension) {
							list.push(dimension.ModelObject);
						});
						// todo-wui: update object tree info, there is no method to add new model object to current tree info.
						modelViewerObjectTreeService.loadTree(modelId);

						refreshObjects(modelId, {
							modelId: dimensions[0].ModelFk,
							objectId: dimensions[0].ModelObjectFk
						});

						if(pasteOptions && pasteOptions.assignToOriginalHeader) {
							refreshInstanceStatus();

							refreshAssignedObjects(modelId, {
								modelId: dimensions[0].ModelFk,
								objectId: dimensions[0].ModelObjectFk
							});
						}
					}
				};

			if (constructionSystemMainInstanceService.getSelected()) {
				constructionSystemMainObjectTemplateDataService.load();
			}

			function refreshObjects(modelId, selected) {
				var modelObject;

				if(selected === null || selected === undefined) {
					modelObject = constructionSystemMainObjectService.getSelected();

					if (modelObject !== null && modelObject !== undefined) {
						selected = {
							modelId: modelObject.ModelFk,
							objectId: modelObject.Id
						};
					}
				}

				service.disableSelection(modelId);

				constructionSystemMainObjectService.load().then(function () {
					var list = constructionSystemMainObjectService.getList();

					if (selected && list.length) {
						var newSelected = _.find(list, {
							ModelFk: selected.modelId,
							Id: selected.objectId
						});

						if (newSelected) {
							constructionSystemMainObjectService.setSelected(newSelected);
						}
					}
				}).finally(function () {
					service.enableSelection(modelId);
				});
			}

			function refreshAssignedObjects(modelId, selected) {
				var assignedObject;

				if (selected === null || selected === undefined) {
					assignedObject = constructionSystemMainInstance2ObjectService.getSelected();

					if (assignedObject !== null && assignedObject !== undefined) {
						selected = {
							modelId: assignedObject.ModelFk,
							objectId: assignedObject.ObjectFk
						};
					}
				}

				service.disableSelection(modelId);

				constructionSystemMainInstance2ObjectService.load().then(function () {
					var list = constructionSystemMainInstance2ObjectService.getList();

					if (selected && list.length) {
						var newSelected = _.find(list, {
							ModelFk: selected.modelId,
							ObjectFk: selected.objectId
						});

						if (newSelected) {
							constructionSystemMainInstance2ObjectService.setSelected(newSelected);
						}
					}
				}).finally(function () {
					service.enableSelection(modelId);
				});
			}

			function refreshInstanceStatus() {
				var list = constructionSystemMainInstanceService.getList();

				if (!list.length) {
					return;
				}

				$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/statusinfo', {
					InstanceHeaderId: list[0].InstanceHeaderFk,
					InstanceIds: list.map(function (item) {
						return item.Id;
					})
				}).then(function (res) {
					var statusList = res.data;

					constructionSystemMainInstanceProgressService.refresh(statusList.map(function (item) {
						return {
							InstanceHeaderFk: item.InstanceHeaderFk,
							CosInstanceFk: item.Id,
							JobState: item.Status
						};
					}));

					statusList.forEach(function (item) {
						var target = _.find(list, {
							InstanceHeaderFk: item.InstanceHeaderFk,
							Id: item.Id
						});

						if (target && target.Status !== item.Status) {
							target.Status = item.Status;
							target.Version = item.Version;
						}
					});
				});
			}

			function updateObjectDescription(modelId, objectId, description) {
				// update model object lookup cache.
				modelMainObjectLookupDataService.setFilter(modelId);

				var list = modelMainObjectLookupDataService.getListSync({
					lookupType: 'modelProjectModelLookupDataService'
				});

				var item = _.find(list, {
					ModelFk: modelId,
					Id: objectId
				});

				if (item) {
					item.Description = description;
				}
			}

			service = modelWdeViewerDimensionServiceFactory.create(options);

			return service;
		}
	]);


})(angular);