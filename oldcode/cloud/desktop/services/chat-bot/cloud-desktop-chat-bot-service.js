/**
 * Created by liz on 4/16/2018.
 */
/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopChatBotService
 * @priority default value
 * @description
 *
 *
 *
 * @example
 ...
 }
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopChatBotService',
		['_', '$http', '$q', 'basicsWorkflowInstanceService', '$translate', 'mainViewService', 'cloudDesktopPinningContextService','mtwoChatbotQuestionAction',
			function (_, $http, $q, basicsWorkflowInstanceService, $translate, mainViewService, cloudDesktopPinningContextService,mtwoChatbotQuestionAction) {
				var service = {
					currentInstance: null,
					contextValueKey: null,
					isTodoCard: false,
					currentAction: null
				};

				// if already started task , change to true;
				service.inTask = false;
				function updateRunningInstance(instance,action) {
					if(!updateAction(instance,action) && instance.ChildInstanceEntitie) {
						updateRunningInstance(instance.ChildInstanceEntitie,action);
					}
				}

				function updateAction(instance,action) {
					var found = false;
					var actionInstances = instance.ActionInstances;
					if(actionInstances.length > 0) {
						_.forEach(instance.ActionInstances, function (item) {
							if(item.Id === action.Id) {
								item = action;
							}
						});
					}
					return found;
				}
				service.postMessages = function (text) {
					var defer = $q.defer();

					// start task
					if (!service.inTask) {

						service.startWorkflow(text).then(function(result){
							service.inTask = true;
							return defer.resolve(result.data);
						}, function (e) {
							service.inTask = false;
							return defer.reject(e);
						});
					}
					// continue task
					else {
						// var actions = service.currentInstance.ActionInstances;
						// var runningAction = actions[actions.length - 1];
						var runningAction = findCurrentAction(service.currentInstance);
						// if it's todo card , stringify json data
						if (service.isTodoCard) {
							runningAction.Context = JSON.stringify(runningAction.Context);
							service.isTodoCard = false;
						} else {
							let key=service.contextValueKey;
							let tempContext = {};
							tempContext[key] = text;
							runningAction.Context = JSON.stringify(tempContext);
							// runningAction.Context = '{"' + service.contextValueKey + '":"' + text + '"}';
						}
						service.contextValueKey = null;

						// stringify json data from Input and Output
						if (runningAction.Input && runningAction.Input instanceof Object) {
							runningAction.Input = JSON.stringify(runningAction.Input);
						}
						if (runningAction.Output && runningAction.Output instanceof Object) {
							runningAction.Output = JSON.stringify(runningAction.Output);
						}
						updateRunningInstance(service.currentInstance,runningAction);

						// service.currentInstance.ActionInstances = [];
						// service.currentInstance.ActionInstances.push(runningAction);
						service.continueWorkflow(service.currentInstance).then(function (result) {
							return defer.resolve(result.data);
						}, function (e) {
							service.inTask = false;
							return defer.reject(e);
						});
					}
					return defer.promise;
				};

				// cancel task
				service.escalateTask = function (actionId) {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'mtwo/publicapi/bot/1.0/conversations/cancel',
						params: {actionId: actionId}
					});
				};
				// post message and context when click the form card button
				service.postMessagesByContext = function (context) {
					var defer = $q.defer();
					if (service.isTodoCard) {
						service.isTodoCard = false;
					}
					var actions = service.currentInstance.ActionInstances;
					var runningAction = actions[actions.length - 1];
					runningAction.Context = context;
					if (runningAction.Input && runningAction.Input instanceof Object) {
						runningAction.Input = JSON.stringify(runningAction.Input);
					}
					if (runningAction.Output && runningAction.Output instanceof Object) {
						runningAction.Output = JSON.stringify(runningAction.Output);
					}
					service.currentInstance.ActionInstances = [];
					service.currentInstance.ActionInstances.push(runningAction);
					service.continueWorkflow(service.currentInstance).then(function (result) {
						return defer.resolve(result.data);
					}, function (e) {
						service.inTask = false;
						return defer.reject(e);
					});
					return defer.promise;
				};

				service.handleResult = function (result) {
					var card =[];
					if(result.Status === 0 || result.Status === 2){
						service.inTask = false;
						card.push({
							type: 'message',
							text: result.Message
						});
						return card;
					}
					var task = result.Data;

					var lastResult = false;
					if (task.Status === 4 || task.Status === 2) {
						service.currentInstance = null;
						service.inTask = false;
						lastResult = true;
						if(task.Status === 2) lastResult = true;
						if(task.ActionInstances.length >0) {
							var lastAction = task.ActionInstances[task.ActionInstances.length - 1];
							if (lastAction.IsRunning) {
								service.currentInstance = task;
								service.inTask = true;
								lastResult = false;
							}
						}
					}
					else{
						service.inTask = false;
					}
					return taskToMegCard(task, lastResult);
				};

				service.startWorkflow = function (text) {
					var currentModule = mainViewService.getCurrentModuleName();
					var projectId = cloudDesktopPinningContextService.getPinnedId('project.main');
					var context = {ProjectId: projectId};
					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'mtwo/publicapi/bot/1.0/conversations/start',
						data: {query: text, module: currentModule, JsonContext: JSON.stringify(context)}
					});
				};

				service.continueWorkflow = function (task) {
					var data = {};
					angular.copy(task, data);

					var continueTaskRequest = {
						method: 'POST',
						url: globals.webApiBaseUrl + 'mtwo/publicapi/bot/1.0/conversations/continue',
						headers: {
							errorDialog: false
						}
					};

					continueTaskRequest.data = data;

					return $http(continueTaskRequest);
				};


				function loadTaskData(task){
					var tasklist = basicsWorkflowInstanceService.updateListConfig({}, [task]);
					return tasklist[0];
				}

				function findCurrentAction(instance) {
					if(instance.ChildInstanceEntitie && instance.ChildInstanceEntitie.Status !== 2) {
						var actionInstances = instance.ChildInstanceEntitie.ActionInstances;
						if(actionInstances.length > 0) {
							var lastAction = actionInstances[actionInstances.length - 1];
							if(lastAction.IsRunning)
							{
								if(lastAction.ActionId.toLowerCase() === 'b9a051030fa2493bb6b0427e172e7fc9') {
									return findCurrentAction(instance.ChildInstanceEntitie);
								} else {
									return lastAction;
								}
							}
						}
						// if(instance.ChildInstanceEntitie.actio)
					} else {
						return instance.ActionInstances[instance.ActionInstances.length-1];
					}
				}

				function findDisplay(instance) {

					if(instance.ChildInstanceEntitie && instance.ChildInstanceEntitie.Status !== 2) {
						var actionInstances = instance.ChildInstanceEntitie.ActionInstances;
						if(actionInstances.length > 0) {
							var lastAction = actionInstances[actionInstances.length - 1];
							if(lastAction.IsRunning)
							{
								if(lastAction.ActionId.toLowerCase() === 'b9a051030fa2493bb6b0427e172e7fc9') {
									return findDisplay(instance.ChildInstanceEntitie);
								} else {
									var context = JSON.parse(instance.ChildInstanceEntitie.Context);
									if(context.hasOwnProperty('display')) {
										var data = context.display;
										context.display = [];
										instance.ChildInstanceEntitie.Context = JSON.stringify(context);
										return data;
									}
								}
							}
						}
					} else {
						var context = JSON.parse(instance.Context);
						if(context.hasOwnProperty('display')) {
							var data = context.display;
							context.display = [];
							instance.Context = JSON.stringify(context);
							return data;
						}
					}
					return null;
				}


				function showDispaly(result) {
					var card = [];
					var display = findDisplay(result);
					if(display !== null) {

						for (var i = 0,len = display.length; i<len; i++) {
							var item = display[i];
							if (item.DisplayType === 'text') {
								if (item.Content.trim().length > 0) {
									card.push({
										type: 'message', text: item.Content
									});
								}
							}
							if (item.DisplayType === 'card') {
								var header = [];
								if (item.Content) {
									try {
										var contentObj = JSON.parse(item.Content);
									} catch (Exception) {
										if (item.Content.trim().length > 0) {
											card.push({
												type: 'message', text: item.Content
											});
										}
										break;
									}
									if (contentObj.length > 0) {
										header = Object.getOwnPropertyNames(contentObj[0]);
									}
									card.push({
										type: 'card',
										mode: item.CardStyle,
										content: JSON.parse(item.Content),
										captain: item.CardCaptain,
										header: header,
										isNavigate: item.IsNavigate,
										module: item.Module,
										navigateField: item.NavigateField
									});
								}
							}
						}

					}
					return card;
				}
				function taskToMegCard(result,lastResult){
					var card = [];
					if(lastResult || result.Status === 2){
						card = showDispaly(result);
					}
					else{
						if(result.Status === 5) {
							service.currentAction = null;
							card.push({
								type: 'message', text: $translate.instant('cloud.desktop.botChat.taskCanceled')
							});
							service.isTodoCard = false;
						} else if (result.Status === 4) {
							// getCurrentAction
							card = showDispaly(result);
							// var lastAction = result.ActionInstances[result.ActionInstances.length - 1];
							var lastAction = findCurrentAction(result);

							// chatbot question
							if (lastAction.ActionId === mtwoChatbotQuestionAction.Id) {
								var inputs = JSON.parse(lastAction.Input);
								_.forEach(inputs, function (item) {
									if(item.value && item.key.toLowerCase() === 'question') {
										card.push({
											type: 'message', text: item.value
										});
									}
									if(item.value && item.key.toLowerCase() === 'hint') {
										card.push({
											type:'hint',text: item.value
										});
									}
									if(item.key.toLowerCase() === 'isoptional') {
										if(item.value) {
											card.push({
												type:'button',text: $translate.instant('cloud.desktop.botChat.skip')
											});
										}

									}
								});
								service.contextValueKey = JSON.parse(lastAction.Output)[0].value;
							} else {
								var inputsObj = JSON.parse(JSON.parse(lastAction.Input)[0].value);
								var descriptionInputs = _.filter(inputsObj, function (input) {
									return input.type === 'description' ? 1 : 0;
								});
								if (descriptionInputs.length === 1) {
									card.push({
										type: 'message',
										text: lastAction.Description
									});
									service.contextValueKey = descriptionInputs[0].context.split('.')[1];
								} else {
									lastAction = result.ActionInstances[result.ActionInstances.length - 1];
									var action = loadTaskData(lastAction);
									service.currentAction = action;
									card.push({
										type: 'todoCard', data: action
									});
									service.isTodoCard = true;
								}

							}
						}
					}
					return card;
				}



				return service;
			}]);
})(angular);
