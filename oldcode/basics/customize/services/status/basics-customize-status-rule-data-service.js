/**
 * Created by Frank Baedeker on 03.11.2015.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeStatusRuleDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeStatusRuleDataService is the data service for all entity type descriptions
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsCustomizeModule.factory('basicsCustomizeStatusRuleDataService', ['_', '$q', '$http', 'basicsCustomizeInstanceDataService', 'platformDataServiceFactory', 'basicsCustomizeTypeDataService',
		'platformDataServiceDataProcessorExtension', 'platformDataServiceEntityRoleExtension', 'platformRuntimeDataService', 'PlatformMessenger', 'platformObjectHelper', 'platformModalService',

		function (_, $q, $http, basicsCustomizeInstanceDataService, platformDataServiceFactory, basicsCustomizeTypeDataService, platformDataServiceDataProcessorExtension, platformDataServiceEntityRoleExtension, platformRuntimeDataService, PlatformMessenger, objectHelper, platformModalService) {

			var actionCreate = null;
			// The instance of the main service - to be filled with functionality below
			var basicsCustomizeStatusRuleDataServiceOption = {
				module: basicsCustomizeModule,
				serviceName: 'basicsCustomizeStatusRuleDataService',
				httpRead: {route: globals.webApiBaseUrl + 'basics/customize/', endRead: 'list', usePostForRead: true},
				httpCreate: {route: globals.webApiBaseUrl + 'basics/customize/', endCreate: 'create'},
				modification: {multi: {}},
				dataProcessor: [],
				actions: {create: 'flat', delete: {}},
				entitySelection: {},
				presenter: {list: {}}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCustomizeStatusRuleDataServiceOption);
			var service = serviceContainer.service;
			var data = serviceContainer.data;

			data.doesRequireLoadAlways = true;

			service.actionChanged = new PlatformMessenger();

			data.httpRoutePrefix = data.httpReadRoute;
			data.itemName = '';

			data.deletedEntities = [];
			data.modifiedEntities = [];
			data.modifiedEntitiesCount = 0;
			data.fromStateField = '';
			data.toStateField = '';
			data.typeEntity = undefined;
			data.selectedFromState = 0;
			data.selectedToState = 0;
			data.DeletedAccessRightDescriptorIds = [];
			data.AddedAccessRightDescriptor = [];
			data.AddedAccessRightMaskDescriptor = [];

			service.initialize = function initialize(endpoint, dbTable, fromField, toField) {
				data.deletedEntities = [];
				data.modifiedEntities = [];
				data.modifiedEntitiesCount = 0;

				data.fromStateField = fromField;
				data.toStateField = toField;
				data.typeEntity = undefined;
				if (dbTable.length > 0) {
					data.typeEntity = basicsCustomizeTypeDataService.getTypeByDBTableName(dbTable);
				}

				if (endpoint.length > 0) {
					data.httpReadRoute = data.httpRoutePrefix + endpoint + '/';
					data.httpCreateRoute = data.httpReadRoute;

					return service.load();
				}
				else {
					service.setList([]);

					return $q.when([]);
				}
			};

			service.addEntityToModified = function doAddEntityToModified(elemState, entity) {
				if (!_.find(data.modifiedEntities, {Id: entity.Id})) {
					data.modifiedEntities.push(entity);
					data.modifiedEntitiesCount += 1;
				}
			};

			service.addEntityToDeleted = function doAddNodeEntityToDeleted(elemState, entity, data) {
				data.deletedEntities.push(entity);
				data.modifiedEntitiesCount += 1;
			};

			service.getModifications = function getModifications(updateData) {
				if (data.modifiedEntitiesCount >= 1 && data.typeEntity) {
					updateData.StatusRuleData = {
						Id: data.typeEntity.Id
					};

					if (!_.isEmpty(data.modifiedEntities)) {
						updateData.StatusRuleData.ToSave = angular.copy(data.modifiedEntities);
						data.modifiedEntities = [];
					}

					if (!_.isEmpty(data.deletedEntities)) {
						updateData.StatusRuleData.ToDelete = angular.copy(data.deletedEntities);
						data.deletedEntities = [];
					}

					if (!_.isEmpty(data.DeletedAccessRightDescriptorIds)) {
						updateData.DeletedAccessRightDescriptorIds = angular.copy(data.DeletedAccessRightDescriptorIds);
						data.DeletedAccessRightDescriptorIds = [];
					}

					if (!_.isEmpty(data.AddedAccessRightDescriptor)) {
						updateData.AddedAccessRightDescriptor = angular.copy(data.AddedAccessRightDescriptor);
						data.AddedAccessRightDescriptor = [];
					}

					if (!_.isEmpty(data.AddedAccessRightDescriptor)) {
						updateData.AddedAccessRightDescriptor = angular.copy(data.AddedAccessRightDescriptor);
						data.AddedAccessRightDescriptor = [];
					}
				}
			};

			service.verifyModifications = function verifyModifications() {
				return true;
			};

			service.tryGetTypeEntries = function doTryGetCustomizeTypeEntries() {
				return data.modifiedEntities;
			};

			service.revertProcessItems = function doRevertCustomizeTypeItems() {
				var items = serviceContainer.service.tryGetTypeEntries();
				if (items && items.length > 0) {
					platformDataServiceDataProcessorExtension.revertProcessItems(items, serviceContainer.data);
				}
			};

			data.mergeItemAfterSuccessfullUpdate = _.noop;

			service.mergeInUpdateData = _.noop;

			service.parentService = function getInstanceParentService() {
				return basicsCustomizeTypeDataService;
			};

			service.deleteRuleFor = function deleteRuleFor(fromState, toState) {
				let item = _.find(data.itemList, function (toCmp) {
					return toCmp[data.fromStateField] === fromState && toCmp[data.toStateField] === toState;
				});
				if (item) {
					let idx = data.itemList.indexOf(item);
					data.itemList.splice(idx, 1);
					service.addEntityToDeleted(null, item, data);
					item = {CommentText: '', Hasrolevalidation: false};
					platformRuntimeDataService.readonly(item, ['CommentText', 'Hasrolevalidation']);
					data.selectionChanged.fire(null, item);
					if (_.find(data.modifiedEntities, {Id: item.Id})) {
						idx = data.modifiedEntities.indexOf(item);
						data.modifiedEntities.splice(idx, 1);
				}
				}
			};

			service.create = function create() {
				service.createItem();
			};

			data.onCreateSucceeded = function onCreateSucceeded(newData, data) {
				platformDataServiceDataProcessorExtension.doProcessItem(newData, data);
				newData[data.fromStateField] = data.selectedFromState;
				newData[data.toStateField] = data.selectedToState;

				data.itemList.push(newData);
				service.addEntityToModified(null, newData);

				service.setSelected(newData);
			};

			service.provideUpdateData = _.noop;

			service.selectStatusRule = function selectStatusRule(fromState, toState) {
				var item = _.find(data.itemList, function (toCmp) {
					return toCmp[data.fromStateField] === fromState && toCmp[data.toStateField] === toState;
				});

				if (_.isEmpty(item)) {
					if(data.selectedFromState !== fromState && data.selectedToState !== toState) {
						service.deselect(item);
						data.selectionChanged.fire(null, null);
					}
				} else {
					service.setSelected(item);
				}

				return item;
			};

			service.handleStateTransitionChange = function handleStateTransitionChange(fromState, toState, hasTransition) {
				if (hasTransition) {
					service.deleteRuleFor(fromState, toState);
				}
				else {
					return (service.createRuleFor(fromState, toState));
				}
			};

			service.createRuleFor = function createRuleFor(fromState, toState) {
				var item;
				var partialList = _.filter(data.itemList, function (toCmp) {
					return toCmp[data.fromStateField] === fromState;
				});
				if (partialList.length > 0) {
					item = _.find(partialList, function (toCmp) {
						return toCmp[data.toStateField] === toState;
					});
				}

				if (!item) {
					data.selectedFromState = fromState;
					data.selectedToState = toState;
					item = service.create();
				}

				return item;
			};

			service.provideTransitionEntities = function provideTransitionEntities(status) {
				return service.load().then(function () {
					var rules = data.itemList;
					var entities = [];
					var actionDelete = {
						toolTip: 'Delete Rule',
						icon: 'control-icons ico-tick',
						callbackFn: function (entity, field) {
							var modalOptions = {
								headerTextKey: 'basics.customize.titleReferencedWorkflow',
								bodyTextKey: 'basics.customize.removedReferencedWorkflow',
								showYesButton: true,
								showNoButton: true,
								showCancelButton: false,
								iconClass: 'ico-question'
							};

							platformModalService.showDialog(modalOptions).then(function (result) {
								if (result.yes) {
									var fromState = status[entity.Id - 1].Id;
									var idx = service.getColumnIdForFieldName(field);
									var toState = status[idx].Id;
									service.deleteRuleFor(fromState, toState);
									entity[field].actionList.shift();
									entity[field].actionList.push(actionCreate);
									service.actionChanged.fire(null, {fromState: fromState, toState: toState, field: idx + 2});
								}
							});
						}
					};

					actionCreate = {
						toolTip: 'New Rule',
						icon: 'control-icons ico-stop',
						callbackFn: function (entity, field) {
							var fromState = status[entity.Id - 1].Id;
							var idx = service.getColumnIdForFieldName(field);
							var toState = status[idx].Id;
							service.createRuleFor(fromState, toState);
							entity[field].actionList.shift();
							entity[field].actionList.push(actionDelete);
							service.actionChanged.fire(null, {fromState: fromState, toState: toState, field: idx + 2});
						}
					};

					_.forEach(status, function (rowItem, rowIndex) {
						var fields = [];
						var partialList = _.filter(rules, function (toCmp) {
							return toCmp[data.fromStateField] === rowItem.Id;
						});

						var entity = {'Id': rowIndex + 1, 'Code': rowItem.DescriptionInfo.Translated};
						//entity.actionList = [];

						_.forEach(status, function (colItem, colIndex) {
							var attName = service.getFieldNameForColumn(colIndex);
							var actionList = [];
							var obj = {};
							obj[attName] = entity[attName];
							obj.actionList = actionList;
							var exist = 0;
							if (rowIndex === colIndex) {
								entity[attName] = null;
								fields.push({field: attName, readonly: true});
								exist = 2;
							}
							else if (!_.isEmpty(partialList)) {
								var item = _.find(partialList, function (toCmp) {
									return toCmp[data.toStateField] === colItem.Id;
								});

								if (item && angular.isDefined(item.Id)) {
									exist = 1;
								}
							}
							if (exist !== 2) {
								entity[attName] = obj;
							}
							if (exist === 1) {
								entity[attName].actionList.push(actionDelete);

							} else if (exist === 0) {
								entity[attName].actionList.push(actionCreate);
							}
						});

						platformRuntimeDataService.readonly(entity, fields);
						entities.push(entity);
					});
					return entities;
				});
			};

			service.getFieldNameForColumn = function getFieldNameForColumn(colIndex) {
				return 'Col_' + colIndex;
			};

			service.getColumnIdForFieldName = function getColumnIdForFieldName(fieldName) {
				return +fieldName.slice(4);
			};

			service.loadAccessRightDescriptor = function loadAccessRightDescriptor(id) {
				if (objectHelper.isSet(id)) {
					return $http({
						url: globals.webApiBaseUrl + 'basics/customize/special/loadaccessright',
						method: 'GET',
						params: {id: id}
					}).then(function (result) {
						return result.data;
					});
				}
			};

			service.getStateDescription = function getStateDescription(stateId) {
				var role = basicsCustomizeInstanceDataService.getItemById(stateId);
				var desc = '';
				if (role) {
					desc = role.DescriptionInfo.Translated;
				}
				else {
					desc = stateId.toString();
				}

				return desc;
			};

			service.createAccessRightDescriptor = function createAccessRightDescriptor(entity) {
				var fromGetter = data.fromStateField;
				var toGetter = data.toStateField;

				if (objectHelper.isSet(entity.Id, entity.rule[fromGetter], entity.rule[toGetter])) {
					var dto = {
						TypeId: entity.Id,
						FromState: service.getStateDescription(entity.rule[fromGetter]),
						ToState: service.getStateDescription(entity.rule[toGetter]),
						DescriptorId: -1,
						DescriptorDesc: ''
					};

					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'basics/customize/special/createaccessrightmock',
						data: dto
					}).then(function (result) {
						var descriptorMock = result.data;
						var rule = service.getSelected();
						descriptorMock.RuleId = entity.rule.Id;
						data.AddedAccessRightDescriptor.push(descriptorMock);
						// -1 is set as Fk, which will be later on the server replaced by an valid AccessrightDescriptorFk
						rule.AccessrightDescriptorFk = descriptorMock.DescriptorId;
						rule.DescriptorDesc = descriptorMock.DescriptorDesc;
						service.addEntityToModified(null, rule);
						return result.data;
					});
				}
			};

			service.createAccessRightDescriptorWithAccessMask = function createAccessRightDescriptorWithAccessMask(entity, field, property, translatedKey, translatedDesc) {
				var desc = entity.DescriptionInfo.Translated;
				if(property.ActionDescProperty && _.get(entity, property.ActionDescProperty)) {
					desc = _.get(entity, property.ActionDescProperty);
				}

				let selType = basicsCustomizeTypeDataService.getSelected();

				var dto = {
					DescriptorDesc: (translatedDesc + ' (' + desc).substring(0, 254) + ')',
					SortOrderPath: property.ActionParam2,
					AccessMask: property.ActionParam3 ? property.ActionParam3 : 3855,
					ModuleName: property.ActionParam2 ? property.ActionParam2.split('/')[1] : selType.ModuleName,
					Name: (translatedKey + ' (' + desc).substring(0, 63)  + ')'
				};

				return $http({
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/customize/special/createaccessrightwithmask',
					data: dto
				}).then(function (result) {
					var descriptor = result.data;
					data.AddedAccessRightMaskDescriptor.push(descriptor);
					// Assign to the entity´s descriptor field, 1-5 possible
					entity[field] = descriptor.Id;
					basicsCustomizeInstanceDataService.markItemAsModified(entity);
					basicsCustomizeInstanceDataService.parentService().update();
					return result.data;
				});
			};

			service.deleteAccessRightDescriptorById = function createAccessRightDescriptor(entity, field) {
				if (entity[field] && entity[field] !== -1) {
					var id2Delete = angular.copy(entity[field]);
					entity[field] = null;
					basicsCustomizeInstanceDataService.markItemAsModified(entity);
					basicsCustomizeInstanceDataService.parentService().update().then(function createAccessRightDescriptor() {
						return $http({
							method: 'GET',
							url: globals.webApiBaseUrl + 'basics/customize/special/deleteaccessrightbyid',
							params: {id: id2Delete}
						});
					});
				}
			};

			service.deleteAccessRightDescriptor = function deleteAccessRightDescriptor(entity) {
				var fromGetter = data.fromStateField;
				var toGetter = data.toStateField;
				if (objectHelper.isSet(entity.Id, entity.rule[fromGetter], entity.rule[toGetter], entity.rule.AccessrightDescriptorFk)) {
					var rule = service.getSelected();
					if (rule) {
						// Mock AccessRightDescriptor dont ne to go to the server, just delete them on the client
						if (rule.AccessrightDescriptorFk !== -1) {
							data.DeletedAccessRightDescriptorIds.push(_.clone(rule.AccessrightDescriptorFk));
						}
						//clear props
						rule.AccessrightDescriptorFk = null;
						rule.DescriptorDesc = null;
						service.addEntityToModified(null, rule);
					}
				}
			};
			return service;
		}]);
})();
