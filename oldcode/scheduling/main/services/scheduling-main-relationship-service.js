/**
 * Created by baf on 26.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityRelationshipService
	 * @function
	 *
	 * @description
	 * schedulingMainActivityRelationshipService CRUD service for relationships entities, also updates 
	 * predecessor and successor fields.
	 */
	schedulingMainModule.factory('schedulingMainRelationshipService', schedulingMainRelationshipService);

	schedulingMainRelationshipService.$inject = [
		'$http', '_', 'platformDataServiceEntityRoleExtension', 'platformDataServiceDataProcessorExtension', 'platformDataServiceModificationTrackingExtension',
		'basicsCommonMandatoryProcessor', 'platformDataServiceFactory', 'schedulingMainService', 'schedulingMainActivityLookupDataProviderService', 'schedulingMainConstantValues',
		'$q', '$injector', 'platformRuntimeDataService', 'platformDataValidationService'
	];

	function schedulingMainRelationshipService(
		$http, _, platformDataServiceEntityRoleExtension, platformDataServiceDataProcessorExtension, platformDataServiceModificationTrackingExtension,
		basicsCommonMandatoryProcessor, platformDataServiceFactory, schedulingMainService, schedulingMainActivityLookupDataProviderService, schedulingMainConstantValues,
		$q, $injector, platformRuntimeDataService, platformDataValidationService) {
		var serviceContainer;

		function handleCreateRelationSucceded(creationData) {
			var newItem = creationData.RelationshipsToSave[0];
			var act = schedulingMainService.getSelected();

			if (serviceContainer.data.createPredeccessorRequested === false) {
				newItem.PredecessorCode = act.Code;
				newItem.PredecessorDesc = act.Description;
				if (act.Schedule) {
					newItem.PredecessorSchedule = act.Schedule.Code;
				}
			} else {
				delete creationData.MainItemId;
				newItem.SuccessorCode = act.Code;
				newItem.SuccessorDesc = act.Description;
				if (act.Schedule) {
					newItem.SuccessorSchedule = act.Schedule.Code;
				}
			}

			if (creationData.Activities) {
				_.forEach(creationData.Activities, function (activity) {
					schedulingMainService.mergeInActivityChange(activity);
				});
				takeOverMoreActivities(creationData.RelationshipsToSave, creationData.Activities);

				schedulingMainService.gridRefresh();
			}

			return newItem;
		}

		var schedulingMainRelationshipServiceOption = {
			module: schedulingMainModule,
			serviceName: 'schedulingMainRelationshipService',
			entityNameTranslationID: 'scheduling.main.entityRelationship',
			httpCreate: {
				route: globals.webApiBaseUrl + 'scheduling/main/relationship/',
				endCreate: 'create'
			},
			dataProcessor: [schedulingMainActivityLookupDataProviderService],
			actions: {
				delete: true,
				create: 'flat'
			},
			entityRole: {
				leaf: {
					itemName: 'Relationships',
					parentService: schedulingMainService
				}
			},
			presenter: {
				list: {
					initCreationData: function initCreationData(creationData) {
						if (serviceContainer.data.createPredeccessorRequested === false) {
							creationData.MainItemId = schedulingMainService.getSelected().Id;
							creationData.ScheduleId = schedulingMainService.getSelected().ScheduleFk;
							creationData.ChildItemId = serviceContainer.data.childFk;
						} else {
							creationData.MainItemId = serviceContainer.data.mainItemId;
							creationData.ChildItemId = schedulingMainService.getSelected().Id;
							creationData.ScheduleId = schedulingMainService.getSelected().ScheduleFk;
						}
					},
					handleCreateSucceeded: handleCreateRelationSucceded
				}
			},
			entitySelection: {},
			modification: {
				multi: true
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainRelationshipServiceOption);
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		serviceContainer.data.createPredeccessorRequested = false;
		var service = serviceContainer.service;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'schedulingMainRelationshipValidationService'
		}, schedulingMainConstantValues.schemes.relationship));

		serviceContainer.data.deleteItem = function deleteRelationship(entity, data) {
			return serviceContainer.data.deleteRelations([entity], data);
		};

		serviceContainer.data.deleteEntities = function deleteRelationships(entities, data) {
			return serviceContainer.data.deleteRelations(entities, data);
		};

		function relationShipHasBothActivitiesAssigned(rel) {
			return !_.isNil(rel.ParentActivityFk) && rel.ParentActivityFk !== 0 && !_.isNil(rel.ChildActivityFk) && rel.ChildActivityFk !== 0;
		}

		serviceContainer.data.deleteRelations = function deleteRelations(entities, data) {
			return platformDataServiceEntityRoleExtension.deleteSubEntities(entities, service, data).then(function () {
				var withSuccessors = _.filter(entities, function (r) {
					return relationShipHasBothActivitiesAssigned(r);
				});
				if (_.isEmpty(withSuccessors)) {
					return true;
				}

				// removePredecessorSuccessorColumns(withSuccessors[0]);
				return schedulingMainService.executeCompleteCommand({
					MainItemId: withSuccessors[0].ParentActivityFk,
					EntitiesCount: 1,
					RelationshipsToDelete: withSuccessors,
					PostProcess: {
						Action: 19,
						EffectedItemId: withSuccessors[0].ParentActivityFk
					}
				});
			});
		};

		service.createPredecessor = function createPredecessor(mainItemId) {
			serviceContainer.data.createPredeccessorRequested = true;
			serviceContainer.data.mainItemId = mainItemId;
			return service.createItem();
		};

		service.createSuccessor = function createSuccessor(childFk) {
			serviceContainer.data.createPredeccessorRequested = false;
			serviceContainer.data.childFk = childFk;

			return service.createItem();
		};

		serviceContainer.data.clearContent = function clearListContent() {};

		serviceContainer.data.handleReadSucceeded = function onReadAllRelationshipsSucceeded(result, data) {
			data.itemList.length = 0;
			_.forEach(result, function (entity) {
				schedulingMainService.processActivity(entity.ChildActivityFk);
				data.itemList.push(entity);
			});

			platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

			data.listLoaded.fire(result);
		};



		serviceContainer.data.onDataFilterChanged = function onDataFilterChanged() {
			serviceContainer.data.listLoaded.fire();
		};

		schedulingMainService.registerSelectionChanged(serviceContainer.data.onDataFilterChanged);

		service.addRelationship = function addRelationship(parentActivityFk, childActivityFk, relationKindFk) {
			return schedulingMainService.updateWithPostProcess({
				Action: 8,
				EffectedItemId: parentActivityFk,
				ActivityIds: [childActivityFk],
				ReferredEntityId: relationKindFk
			}).then(function () {
				// item may changed due to the relationship creation
				var modifiedItem = schedulingMainService.getItemById(childActivityFk);
				if (modifiedItem) {
					schedulingMainService.markItemAsModified(modifiedItem);
				}
			});
		};

		service.addRelationships = function addRelationships() {
			// Workaround until selectionchanged event is thrown for multiselection
			var platformDialogService = $injector.get('platformDialogService');
			if (!schedulingMainService.getSelectedEntities() || schedulingMainService.getSelectedEntities().length < 2) {
				platformDialogService.showMsgBox('You need to select two or more activities.', 'Insufficient selection', 'info').then(function () {
					return;
				});
			}

			// var data = serviceContainer.data;
			var itemIds = _.map(schedulingMainService.getSelectedEntities(), 'Id');
			var scheduleId = schedulingMainService.getSelectedEntities()[0].ScheduleFk;
			var relationKind = 1; // default is finish-start
			return $http.post(globals.webApiBaseUrl + 'scheduling/main/relationship/createmultiple', {
				ItemIds: itemIds,
				ScheduleId: scheduleId,
				RelationshipTypeFk: relationKind
			}).then(function (response) {
				schedulingMainService.takeOverActivities(response.data.Activities, true);
				// Need to handle activities again
				takeOverMoreActivities(response.data.RelationshipsToSave, response.data.Activities);

				takeOverRelations(response.data.RelationshipsToSave, response.data.Activities);
			}, function ( /* error */ ) {});
		};

		function takeOverMoreActivities(relationships, activities) {
			relationships.forEach(relation => {
				var act1 = _.find(activities, ['Id', relation.ParentActivityFk]);
				var act2 = _.find(activities, ['Id', relation.ChildActivityFk]);
				if (!_.isNil(act1)) {
					if (!_.find(act1.Successor, ['id', relation.Id])) {
						act1.Successor.push({
							id: relation.Id,
							value: relation.SuccessorCode,
							editable: true,
							external: false
						});
					}
				}
				if (!_.isNil(act2)) {
					if (!_.find(act2.Predecessor, ['id', relation.Id])) {
						act2.Predecessor.push({
							id: relation.Id,
							value: relation.PredecessorCode,
							editable: true,
							external: false
						});
					}
				}
			});

			var preservice = $injector.get('schedulingMainPredecessorRelationshipDataService');
			var sucservice = $injector.get('schedulingMainSuccessorRelationshipDataService');
			var $timeout = $injector.get('$timeout');

			preservice.load().then(function () {
				preservice.loadSubItemList().then(function () {
					$timeout(preservice.gridRefresh(), 0);
				});
			});
			sucservice.load().then(function () {
				sucservice.loadSubItemList().then(function () {
					$timeout(sucservice.gridRefresh(), 0);
				});
			});
		}

		service.getFilteredList = function getFilteredList() {
			var result = [];
			var selectedItem = schedulingMainService.getSelected();
			if (selectedItem && selectedItem.Id) {
				result = _.filter(serviceContainer.data.itemList, {
					ParentActivityFk: selectedItem.Id
				});
			}
			return result;
		};

		service.getSuccessorList = function getSuccessorList() {
			var result = [];
			var selectedItem = schedulingMainService.getSelected();
			if (selectedItem && selectedItem.Id) {
				result = _.filter(serviceContainer.data.itemList, {
					ParentActivityFk: selectedItem.Id
				});
			}
			return result;
		};

		service.getPredecessorList = function getPredecessorList() {
			var result = [];
			var selectedItem = schedulingMainService.getSelected();
			if (selectedItem && selectedItem.Id) {
				result = _.filter(serviceContainer.data.itemList, {
					ChildActivityFk: selectedItem.Id
				});
			}
			return result;
		};

		service.getPredecessor = function getPredecessor(activityId) {
			return _.filter(serviceContainer.data.itemList, {
				ParentActivityFk: activityId
			});
		};

		service.takeOverRelations = takeOverRelations;

		service.removeDeletedRelationship = function removeDeletedRelationship (relation) {
			_.remove(serviceContainer.data.itemList, function(n) {
				return n.Id === relation.Id;
			});
			serviceContainer.data.onDataFilterChanged();
		};

		function takeOverRelations(relations) {
			var toDo = _.filter(relations, function (rel) {
				return !_.some(serviceContainer.data.itemList, ['Id', rel.Id]);
			});
			var toDoChange = _.filter(relations, function (rel) {
				return _.some(serviceContainer.data.itemList, ['Id', rel.Id]);
			});

			var fireListLoaded = false;

			_.forEach(toDo, function (rel) {
				serviceContainer.data.itemList.push(rel);
				if (rel.Version === 0) {
					serviceContainer.service.markItemAsModified(rel);
				}
				fireListLoaded = true;
			});
			_.forEach(toDoChange, function (rel) {
				var loadedRel = serviceContainer.data.getItemById(rel.Id, serviceContainer.data);
				if (loadedRel !== null && loadedRel !== undefined) {
					loadedRel.PredecessorCode = rel.PredecessorCode;
					loadedRel.PredecessorDesc = rel.PredecessorDesc;
					loadedRel.PredecessorSchedule = rel.PredecessorSchedule;
					loadedRel.SuccessorCode = rel.SuccessorCode;
					loadedRel.SuccessorDesc = rel.SuccessorDesc;
					loadedRel.SuccessorSchedule = rel.SuccessorSchedule;
					loadedRel.ScheduleFk = rel.ScheduleFk;
					loadedRel.ChildScheduleFk = rel.ChildScheduleFk;
				}
				fireListLoaded = true;
			});

			updateOtherlines();

			if (fireListLoaded) {
				serviceContainer.data.onDataFilterChanged();
			}
		}

		service.markRelationsAsDeleted = function markRelationsAsDeleted(relations) {
			platformDataServiceModificationTrackingExtension.markEntitiesAsDeleted(service, relations, serviceContainer.data);
		};

		service.removeLinksToNewSummary = function removeLinksToNewSummary(sumId) {
			var oldLength = serviceContainer.data.itemList.length;
			serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (rel) {
				return rel.ParentActivityFk !== sumId && rel.ChildActivityFk !== sumId;
			});

			if (oldLength !== serviceContainer.data.itemList.length) {
				serviceContainer.data.onDataFilterChanged();
			}
		};

		function initializeRelationEntity(predecessor, relation, activity, relationActivity) {
			const child = predecessor ? activity : relationActivity;
			const parent = predecessor ? relationActivity : activity;
			const validation = $injector.get('schedulingMainRelationshipValidationService');

			relation.ParentActivityFk = parent.Id;
			relation.ChildActivityFk = child.Id;
			relation.SuccessorCode = child.Code;
			relation.SuccessorDesc = child.Description;
			relation.PredecessorCode = parent.Code;
			relation.PredecessorDesc = parent.Description;
			relation.SuccessorSchedule = relation.PredecessorSchedule = _.get(activity, 'Schedule.Code', null);

			platformRuntimeDataService.applyValidationResult(true, relation, 'ChildActivityFk');
			platformRuntimeDataService.applyValidationResult(true, relation, 'ParentActivityFk');

			platformDataValidationService.removeFromErrorList(relation, 'ChildActivityFk', validation, service);
			platformDataValidationService.removeFromErrorList(relation, 'ParentActivityFk', validation, service);

			return relation;
		}

		function getMulticodeModel(predecessor, activity) {
			return _.map(predecessor ? service.getPredecessorList() : service.getSuccessorList(), (relation) => {
				return {
					id: relation.Id,
					value: predecessor ? relation.PredecessorCode : relation.SuccessorCode,
					editable: relation.ScheduleFk === activity.ScheduleFk,
					external: relation.ScheduleFk !== activity.ScheduleFk
				};
			});
		}

		schedulingMainService.registerSelectionChanged(() => {
			var activity = schedulingMainService.getSelected();

			updateOtherlines();
			if (activity) {
				// activity.Predecessor = getMulticodeModel(true, activity);
				// activity.Successor = getMulticodeModel(false, activity);
			}

			serviceContainer.data.onDataFilterChanged();
		});

		function assertRelatedIsInArray(activity, related, prop) {
			if (!_.isArray(activity[prop])) {
				activity[prop] = [];
			}
			if (_.findIndex(activity[prop], ['id', related.Id]) === -1) {
				activity[prop].push({
					id: related.Id,
					value: related.SuccessorCode,
					editable: related.ScheduleFk === activity.ScheduleFk,
					external: related.ScheduleFk !== activity.ScheduleFk
				});
			}
		}

		function updateOtherlines() {
			var predecessors = service.getPredecessorList();
			var successors = service.getSuccessorList();

			predecessors.forEach(function (item) {
				let parent = schedulingMainService.getItemById(item.ParentActivityFk);
				if (!_.isNil(parent)) {
					assertRelatedIsInArray(parent, item, 'Successor');
				}

				let child = schedulingMainService.getItemById(item.ChildActivityFk);
				if (!_.isNil(child)) {
					assertRelatedIsInArray(child, item, 'Predecessor');
				}
			});
			successors.forEach(function (item) {
				let child = schedulingMainService.getItemById(item.ChildActivityFk);
				if (!_.isNil(child)) {
					assertRelatedIsInArray(child, item, 'Predecessor');
				}

				let parent = schedulingMainService.getItemById(item.ParentActivityFk);
				if (!_.isNil(parent)) {
					assertRelatedIsInArray(parent, item, 'Successor');
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name predecessorCodes
		 * @function
		 * @methodOf schedulingMainRelationshipService
		 * @description retrieves or applies predecessors for given activity
		 * @param activity {object} activity to retrieve relationships
		 * @param codes {string[]} codes to be assigned, getter === undefined
		 * @returns {array} array of { id, value, formatterValue, editable, external }
		 */
		service.predecessorCodes = (activity, codes) => {
			if (codes) {
				const toDelete = _.compact(_.map(_.filter(codes, 'delete'), (code) => {
					return _.find(serviceContainer.data.itemList, ['Id', code.id]);
				}));

				serviceContainer.data.deleteEntities(toDelete, serviceContainer.data);

				let result = [];
				const promises = [];
				const activities = [];

				_.forEach(_.filter(codes, 'create'), (code) => {
					const relationActivity = schedulingMainService.getItemByCode(code, activity.ScheduleFk);

					if (relationActivity) {
						result.push(code);

						promises.push(service.createPredecessor(relationActivity.Id)
							.then((relation) => {
								initializeRelationEntity(true, relation, activity, relationActivity);

								code.id = relation.Id;
								activities.push(relationActivity);
							}));
					}
				});

				result = result.concat(_.filter(codes, (code) => {
					return !code.create && !code.delete;
				}));

				if (promises.length > 0) {
					$q.all(promises)
						.then(() => {
							activity.Predecessor = getMulticodeModel(true, activity);
							schedulingMainService.gridRefresh();
						});
				}

				return result;
			}

			return getMulticodeModel(true, activity);
		};

		/**
		 * @ngdoc function
		 * @name successorCodes
		 * @function
		 * @methodOf schedulingMainRelationshipService
		 * @description retrieves or applies predecessors for given activity
		 * @param activity {object} activity to retrieve relationships
		 * @param codes {string[]} codes to be assigned, getter === undefined
		 * @returns {array} array of { id, value, formatterValue, editable, external }
		 */
		service.successorCodes = (activity, codes) => {
			if (codes) {
				const toDelete = _.compact(_.map(_.filter(codes, 'delete'), (code) => {
					return _.find(serviceContainer.data.itemList, ['Id', code.id]);
				}));

				serviceContainer.data.deleteEntities(toDelete, serviceContainer.data);

				let result = [];
				const promises = [];
				const activities = [];

				_.forEach(_.filter(codes, 'create'), (code) => {
					const relationActivity = schedulingMainService.getItemByCode(code);

					if (relationActivity) {
						result.push(code);

						promises.push(service.createSuccessor(relationActivity.Id)
							.then((relation) => {
								initializeRelationEntity(false, relation, activity, relationActivity, code);

								code.id = relation.Id;
								activities.push(relationActivity);
							}));
					}
				});

				result = result.concat(_.filter(codes, (code) => {
					return !code.create && !code.delete;
				}));

				if (promises.length > 0) {
					$q.all(promises)
						.then(() => {
							activity.Successor = getMulticodeModel(false, activity);
							schedulingMainService.gridRefresh();
						});
				}

				return result;
			}

			return getMulticodeModel(false, activity);
		};

		serviceContainer.service.initService = _.noop; // Just one method doing nothing

		return serviceContainer.service;
	}
})(angular);