(function (angular) {
	/* global globals, Platform */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('scheduling.main').factory('schedulingMainClipboardService', [
		'_',
		'$http',
		'$injector',
		'schedulingMainService',
		'schedulingMainConstantValues',
		'schedulingMainEventService',
		'schedulingMainClerkService',
		'platformDragdropService',
		'schedulingMainRelationshipAllService',
		'schedulingMainObservationDataService',
		'schedulingMainHammockDataService',
		'schedulingMainHammockAllService',
		'schedulingMainActivityTypes',
		'schedulingSchedulePinnableEntityService',
		function (_, $http, $injector, schedulingMainService, schedulingMainConstantValues, schedulingMainEventService, schedulingMainClerkService, platformDragdropService, schedulingMainRelationshipAllService, schedulingMainObservationDataService, schedulingMainHammockDataService, schedulingMainHammockAllService, schedulingMainActivityTypes, schedulingSchedulePinnableEntityService) {

			var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			var service = {};
			var actTypeIdActivity = schedulingMainActivityTypes.Activity;
			var actTypeIdMilestone = schedulingMainActivityTypes.Milestone;
			var actTypeIdHammock = schedulingMainActivityTypes.Hammock;

			var clearClipboard = function () {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			};

			var getChildren = function (list, items) {
				angular.forEach(items, function (item) {
					list.push(item);
					if (item.HasChildren) {
						getChildren(list, item.Activities);
					}
				});
			};

			function flatten(data) {
				var flattenedData = [];
				for (var i = 0; i < data.length; i++) {
					flattenedData.push(data[i]);
					if (data[i].HasChildren) {
						getChildren(flattenedData, data[i].Activities);
					}
				}
				return flattenedData;
			}

			var postClipboard = function (toId, action, type, data, onSuccessCallback) {

				if (!toId) {
					toId = null;
				}

				var api = action === platformDragdropService.actions.move ? 'move' : 'copy';
				var url = '';
				var params = '?toItem=' + toId;
				var list;
				if (type === 'sourceTemplate' || type === 'sourceActivity' || type === 'observation') {
					list = data.map(function (item) {
						return item.Id;
					});
				} else {
					list = data;
				}
				var relType;
				if (type === 'sourceActivity' || type === 'sourceTemplate') {
					var uuid = type === 'sourceActivity' ? '4cbbc13ef72f49808cd693bdca839846' : '026c24f15a944a27980437ab4dc85b58';
					var config = $injector.get('schedulingMainContainerInformationService').getContainerInfoByGuid(uuid);
					if (angular.isString(config.dataServiceName)) {
						config.dataServiceName = $injector.get(config.dataServiceName);
					}
					relType = config.dataServiceName.getSelectedFilter('relationFk');
				}
				switch (type) {
					case 'sourceActivity':
						if (_.isNull(toId)) {
							toId = -1;
						}
						if (!schedulingMainService.getSelectedSchedule()) {
							return;
						}
						url = 'scheduling/main/activity/';
						api = 'copyfromsourceactivities';
						params = '?toItem=' + toId + '&scheduleId=' + schedulingMainService.getSelectedSchedule().Id + '&projectId=' + schedulingMainService.getSelectedProjectId() + '&relType=' + relType;
						break;
					case 'sourceTemplate':
						url = 'scheduling/main/activity/';
						api = 'copyfromsourceactivitytemplates';
						params = '?toItem=' + toId + '&scheduleId=' + schedulingMainService.getSelectedSchedule().Id + '&projectId=' + schedulingMainService.getSelectedProjectId() + '&relType=' + relType;
						list = data.map(function (item) {
							return item.Id;
						});
						break;
					case 'activity':
						url = 'scheduling/main/activity/';
						params += '&scheduleId=' + schedulingMainService.getSelectedSchedule().Id;
						break;
					case 'observation':
						url = 'scheduling/main/observation/';
						api = 'copyfromsourceactivities';
						break;
					case 'event':
					case 'eventOverview':
						url = 'scheduling/main/event/';
						break;
					case 'clerk':
						url = 'scheduling/main/clerk/';
						break;
				}
				let longtimewarning = false;

				let currentlength = list.length;

				if ((type === 'observation' || type === 'sourceActivity') && currentlength >= 1000) {
					longtimewarning = true;
					const t = $injector.get('$translate');
					t.instant('scheduling.main.printing.reportOptions')
					$injector.get('platformDialogService').showMsgBox(t.instant('scheduling.main.bigCopyDialog.pre-message'),
						t.instant('scheduling.main.bigCopyDialog.pre-message-headerA') + currentlength + t.instant('scheduling.main.bigCopyDialog.pre-message-headerB'),
						'warning', 20, false)
						.then(function () {
							$http.post(globals.webApiBaseUrl + url + api + params, list)
								.then(function onSuccess(response) {
									onSuccessCallback(response);
									$injector.get('platformDialogService').showMsgBox(t.instant('scheduling.main.bigCopyDialog.success'),
										t.instant('scheduling.main.bigCopyDialog.post-message-headerA') + currentlength + t.instant('scheduling.main.bigCopyDialog.post-message-headerB'),
										'info', 20, false);
								})
								.catch(function onError(response) {
									service.onPostClipboardError.fire(response);
									$injector.get('platformDialogService').showMsgBox(t.instant('scheduling.main.bigCopyDialog.failure'),
										t.instant('scheduling.main.bigCopyDialog.post-message-headerC') + currentlength + t.instant('scheduling.main.bigCopyDialog.post-message-headerB'),
										'error', 20, false);
								});
						});
				}

				if (!longtimewarning) {
					$http.post(globals.webApiBaseUrl + url + api + params, list)
						.then(function onSuccess(response) {
							onSuccessCallback(response);
						})
						.catch(function onError(response) {
							// console.log(response.Exception.Message);
							service.onPostClipboardError.fire(response);
						});
				}
			};

			var add2Clipboard = function (node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				for (var i = 0; i < clipboard.data.length; i++) {
					clipboard.dataFlattened.push(clipboard.data[i]);
					if (clipboard.data[i].HasChildren) {
						getChildren(clipboard.dataFlattened, clipboard.data[i].Activities);
					}
				}
				service.clipboardStateChanged.fire();
			};

			var copyMoveActivityToPersistantRootAllowed = function copyMoveActivityToPersistantRootAllowed(result, canPastedContent) {
				if (schedulingSchedulePinnableEntityService.getPinned() === null) {
					return {
						canDrop: false,
						currentAction: canPastedContent.currentAction
					};
				} else if (_.every(canPastedContent.data, getIsPersitentRoot(canPastedContent))) {
					if (canPastedContent.currentAction === platformDragdropService.actions.copy) {
						return {
							canDrop: true,
							currentAction: canPastedContent.currentAction // platformDragdropService.actions.copy
						};
					} else if (canPastedContent.currentAction === platformDragdropService.actions.move) {
						return {
							canDrop: false,
							currentAction: canPastedContent.currentAction // platformDragdropService.actions.copy
						};
					} else {
						return {
							canDrop: false,
							currentAction: canPastedContent.currentAction // platformDragdropService.actions.copy
						};
					}
				} else {
					return result;
				}
			};

			var isLinkFromActivityToHammockActivityAllowed = function (result, canPastedContent) {
				// Determin weather there are activities in the dragged content, that are not linkable to the selected hammock activity.
				// Precisly, filter activities with none activityType of 'milestone' or 'activity'
				var notLinkableActivities = _.filter(canPastedContent.data, function (canPastedContentDataItem) {
					return canPastedContentDataItem.ActivityTypeFk !== actTypeIdActivity && canPastedContentDataItem.ActivityTypeFk !== actTypeIdMilestone;
				});
				// If there are not linkable activities in the dragged content, droping is forbidden.
				if (notLinkableActivities.length > 0) {
					result = {
						canDrop: false,
						currentAction: canPastedContent.currentAction
					};
				} else {
					result = {
						canDrop: true,
						currentAction: platformDragdropService.actions.link
					};
				}
				return result;
			};

			var isDragActivtyToDropActivityAllowed = function isDragActivtyToDropActivityAllowed(result, canPastedContent, dataFlattened, selectedItem) {
				if (!angular.isDefined(selectedItem)) {
					result = copyMoveActivityToPersistantRootAllowed(result, canPastedContent);
				} else if (isTransientRoot(selectedItem)) {
					result = copyMoveActivityToPersistantRootAllowed(result, canPastedContent);
				} else if (isHammockActivity(selectedItem)) {
					result = isLinkFromActivityToHammockActivityAllowed(result, canPastedContent);
				} else {
					result = copyMoveActivityToActivityAllowed(result, dataFlattened, selectedItem);
				}
				return result;
			};

			var copyMoveActivityToActivityAllowed = function (result, dataFlattened, selectedItem) {
				var pos = _.find(dataFlattened, function (item) {
					return item.Id === selectedItem.Id || item.Id === schedulingMainConstantValues.activity.transientRootEntityId;
				});
				if (pos || schedulingMainService.isActivityAssignmentToAHammock(selectedItem)) {
					result.canDrop = false;
				}
				return result;
			};

			var isTransientRoot = function (item) {
				return item.ActivityTypeFk === schedulingMainConstantValues.activity.transientRootActivityTypeFk;
			};
			var isHammockActivity = function (item) {
				return item.ActivityTypeFk === actTypeIdHammock;
			};
			var getIsPersitentRoot = function getIsPersitentRoot() {
				var isTheTransientRootInUseHere = schedulingMainService.isTransientRootEntityActive();// canPastedContent.type === 'activity' && type === 'activity' && schedulingMainService.isTransientRootEntityActive();
				return function isPersitentRoot(item) {
					return isTheTransientRootInUseHere ? item.ParentActivityFk === schedulingMainConstantValues.activity.transientRootEntityId : item.ParentActivityFk === null;
				};
			};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			service.doCanPaste = function doCanPaste(canPastedContent, type, selectedItem) {
				var result = {
					canDrop: true
				};

				if (!selectedItem && canPastedContent.type !== 'sourceActivity' && canPastedContent.type !== 'sourceTemplate' && canPastedContent.type !== 'hammock' && canPastedContent.type !== 'activity') {
					return false;
				}
				if (!canPastedContent.data) {
					return false;
				}
				if (_.some(canPastedContent.data, isTransientRoot)) {
					return false;
				}
				if (schedulingSchedulePinnableEntityService.getPinned() === null && !selectedItem) {
					return false;
				}

				var dataFlattened = flatten(canPastedContent.data);

				if (type !== canPastedContent.type) {
					switch (canPastedContent.type) {
						case 'sourceActivity':
							var selectedMainContainer = schedulingMainService.getSelected();
							if (type === 'hammock') {
								result.currentAction = platformDragdropService.actions.link;
								var isNotAllowedOnCurrentTarget = selectedMainContainer === null || selectedMainContainer.ActivityTypeFk === undefined || selectedMainContainer.ActivityTypeFk !== actTypeIdHammock || selectedItem !== undefined;
								var isActiviyUnLinkedableOrLinked = function (activity) {
									return !schedulingMainHammockDataService.isActivityLinkableAndUnlinked(activity);
								};
								if (isNotAllowedOnCurrentTarget || _.every(canPastedContent.data, isActiviyUnLinkedableOrLinked)) {
									result.canDrop = false;
								}
							} else if (type === 'event' || type === 'clerk' || type === 'eventOverview' || (type === 'observation' && !selectedMainContainer)) {
								result.canDrop = false;
							} else if (type === 'activity') {
								result.canDrop = true;
								result.currentAction = platformDragdropService.actions.copy;
							}
							break;
						case 'sourceTemplate':
							if (type === 'event' || type === 'clerk' || type === 'eventOverview' || type === 'hammock') {
								result.canDrop = false;
							}
							break;
						case 'activity':
							if (type === 'event' || type === 'clerk' || type === 'sourceActivity' || type === 'sourceTemplate' || type === 'eventOverview' || type === 'hammock' || type === 'observation') {
								result.canDrop = false;
							}
							break;
						case 'event':
						case 'eventOverview':
							if (type !== 'activity' || type === 'hammock') {
								result.canDrop = false;
							}
							break;
						case 'clerk':
							if (type !== 'activity' || type === 'hammock') {
								result.canDrop = false;
							}
							break;
					}
					return result;
				} else {
					if (canPastedContent.type === 'sourceActivity' || canPastedContent.type === 'sourceTemplate' || canPastedContent.type === 'eventOverview') {
						return false;
					}
					if (canPastedContent.type === 'activity' || canPastedContent.type === 'observation') {
						result = isDragActivtyToDropActivityAllowed(result, canPastedContent, dataFlattened, selectedItem);
					} else if (canPastedContent.type === 'hammock') {
						result = false;
					}
				}
				return result;
			};
			/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
			service.canPaste = function (type, selectedItem) {
				service.doCanPaste({
						type: clipboard.type,
						data: clipboard.data,
						action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
					},
					type, selectedItem);
			};

			/**
			 * @ngdoc function
			 * @name cut
			 * @function
			 * @methodOf schedulingTemplateClipboardService
			 * @description adds the item to the cut clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.cut = function (items, type) {
				// schedulingTemplateMainService.update();
				// schedulingTemplateGrpEditService.update();
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};

			/**
			 * @ngdoc function
			 * @name copy
			 * @function
			 * @methodOf schedulingTemplateClipboardService
			 * @description adds the item to the copy clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};

			/**
			 * @ngdoc function
			 * @name doPaste
			 * @function
			 * @methodOf schedulingActivityClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.doPaste = function doPaste(pastedContent, selectedItem, type, onSuccess) {
				if (!selectedItem && pastedContent.type !== 'sourceActivity' && pastedContent.type !== 'sourceTemplate' && pastedContent.type !== 'hammock' && pastedContent.type !== 'activity') {
					return;
				}

				var action = pastedContent.action;

				schedulingMainService.update().then(function (response) {
					var pastedData = angular.copy(pastedContent.data);

					// removes a node including all sub-nodes
					var removeNode = function (item, type) {
						switch (type) {
							case 'activity':
								schedulingMainService.moveItem(item);
								break;
							case 'event':
								schedulingMainEventService.moveItem(item);
								break;
							case 'clerk':
								schedulingMainClerkService.moveItem(item);
								break;
							case 'observation':
								schedulingMainObservationDataService.moveItem(item);
								break;
						}
					};
					// handle drag and drop from 'sourceActivity to 'hammock'
					if (pastedContent.type === 'sourceActivity' && type === 'hammock' && pastedContent.action === platformDragdropService.actions.link) {
						schedulingMainHammockDataService.CreateHammockCompleteAndSync2(pastedData).then(function () {
							schedulingMainService.refreshHammockDateFields(schedulingMainService.getSelected());
						});
					}
					// handle drag and drop from 'activity' to 'activity', while ActivityType = 'hammock' of the destination's 'activity'
					else if (selectedItem && pastedContent.type === 'activity' && type === 'activity' && selectedItem.ActivityTypeFk === actTypeIdHammock && pastedContent.action === platformDragdropService.actions.link) {
						var schedulingMainHammockAllService = $injector.get('schedulingMainHammockAllService');
						schedulingMainHammockAllService.CreateHammockCompleteAndSync2(selectedItem, pastedData).then(function () {
							schedulingMainService.refreshHammockDateFields(selectedItem);
						});
					}
					// handle rest
					else {
						var toItemId;
						if (type === pastedContent.type) {
							// if(clipboard.cut) {
							//   return;
							// }
							if (type === 'event' || type === 'clerk' || type === 'observation') {
								toItemId = pastedData[0].ActivityFk;
							} else if (type === 'activity') {
								if (selectedItem) {
									toItemId = selectedItem.Id;
								} else {
									toItemId = null;
								}

							} else {
								toItemId = selectedItem.Id;
							}
						} else {
							if (selectedItem) {
								toItemId = selectedItem.Id;
							} else if (type === 'observation') {
								var selectedMain = schedulingMainService.getSelected();
								if (selectedMain) {
									toItemId = selectedMain.Id;
									pastedContent.type = type;
								} else {
									return;
								}
							}
							if (pastedContent.type === 'sourceActivity' || pastedContent.type === 'sourceTemplate' || pastedContent.type === 'eventOverview') {
								action = 'platformDragdropService.actions.copy';
							}
						}
						// send changes to the server
						postClipboard(toItemId, action, pastedContent.type, pastedData, function (data) {

							// remove node first
							if (pastedContent.action === platformDragdropService.actions.move) {
								removeNode(pastedData, pastedContent.type);
							}

							// update clipboard
							pastedData = data;
							if (pastedContent.type === type || pastedContent.type === 'sourceActivity' || pastedContent.type === 'sourceTemplate' || pastedContent.type === 'eventOverview') {
								switch (pastedContent.type) {
									case 'sourceActivity':
									case 'sourceTemplate':
										if (angular.isArray(pastedData.data)) {
											angular.forEach(pastedData.data, function (item) {
												if (item.RelationshipsToSave && item.RelationshipsToSave.length > 0) {
													schedulingMainRelationshipAllService.takeOverRelations(item.RelationshipsToSave);
												}
												if (item.EventsToSave && item.EventsToSave.length > 0) {
													schedulingMainEventService.takeOverEvents(item.EventsToSave);
												}
												if (item.Activities && item.Activities.length > 0) {
													schedulingMainService.takeOverNewActivities(item.Activities);
												}
											});
											schedulingMainService.setSelected(pastedData.data[0].Activities[0]);
										} else {
											if (pastedData.data.RelationshipsToSave && pastedData.data.RelationshipsToSave.length > 0) {
												schedulingMainRelationshipAllService.takeOverRelations(pastedData.data.RelationshipsToSave);
											}
											if (pastedData.data.EventsToSave && pastedData.data.EventsToSave.length > 0) {
												schedulingMainEventService.takeOverEvents(pastedData.data.EventsToSave);
											}
											if (pastedData && pastedData.data && pastedData.data.Activities.length > 0) {
												schedulingMainService.takeOverNewActivities(pastedData.data.Activities);
												schedulingMainService.setSelected(pastedData.data.Activities[0]);
											}
										}
										// schedulingMainService.load();
										// schedulingMainService.refresh();
										break;
									case 'activity':
										// schedulingMainService.load();
										// schedulingMainService.refresh();
										schedulingMainService.takeOverNewActivities(pastedData.data);
										schedulingMainService.setSelected(pastedData.data);
										break;
									case 'event':
									case 'eventOverview':
										schedulingMainEventService.load();
										schedulingMainEventService.takeOverEvents(pastedData.data);
										break;
									case 'clerk':
										schedulingMainClerkService.load();
										break;
									case 'observation':
										schedulingMainObservationDataService.load();
										break;
								}
							} else if (pastedContent.type === 'event') {
								schedulingMainEventService.takeOverEvents(pastedData.data);
							}

							onSuccess(pastedContent.type);   // callback on success
							clearClipboard();
						});
					}
				});
			};
			/**
			 * @ngdoc function
			 * @name paste
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.paste = function (selectedItem, type, onSuccess) {
				service.doPaste({
						type: clipboard.type,
						data: clipboard.data,
						action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
					},
					selectedItem, type, onSuccess);
			};

			service.getClipboard = function () {
				return clipboard;
			};

			service.clearClipboard = function () {
				clearClipboard();
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};

			// keep this code - supports offline mode !
			//   var nextId = 0;
			//   var getUnusedId = function() {
			//      nextId--;
			//      return nextId;
			//   }
			//   var setNewIds = function(boqItem) {
			//
			//      boqItem.Id = getUnusedId();
			//
			//      if (angular.isDefined(boqItem.BoqItems) && boqItem.BoqItems !== null) {
			//
			//         for (var i = 0; i < boqItem.BoqItems.length; i++) {
			//            boqItem.BoqItems[i].Id = getUnusedId();
			//            setNewIds(boqItem.BoqItems[i]);
			//         }
			//      }
			//   };

			return service;
		}

	]);

})(angular);

