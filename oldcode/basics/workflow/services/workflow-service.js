/* global angular */
(function () {
	'use strict';

	function basicsWorkflowTemplateService($http, $q, _, $injector, globals, platformModuleStateService, basicsWorkflowPreProcessorService,
	                                       basicsWorkflowActionType, cloudDesktopInfoService, platformTranslateService,
	                                       basicsWorkflowVersionStatus, platformModalService, basicsWorkflowUtilityService, platformDialogService, basicsWorkflowValidationService, $translate) {

		var service = {};
		var module = 'basics.workflow';
		var moduleName = '';
		var state = platformModuleStateService.state(module);
		var templateRequest = {
			method: 'GET',
			url: globals.appBaseUrl + module + '/content/json/workflow-template.json'
		};
		var _lastElement;
		var currentMaxItemId;
		let selectedTemplates = [];

		function setModuleName() {
			moduleName = platformTranslateService.instant('basics.workflow.moduleName', null, true);
		}

		function sortInMainEntity(item) {
			if (item) {
				var index = _.findIndex(state.mainEntities, {Id: item.Id});
				basicsWorkflowPreProcessorService.prepareWorkflowTemplate(item);
				state.mainEntities[index] = item;
				if (state.selectedMainEntity.Id === item.Id) {
					state.selectedMainEntity = item;
					for (var i = 0; i < item.TemplateVersions.length; i++) {
						if (state.selectedTemplateVersion && item.TemplateVersions[i] && state.selectedTemplateVersion.Id === item.TemplateVersions[i].Id) {
							state.selectedTemplateVersion = item.TemplateVersions[i];
							if (state.currentWorkflowAction) {
								state.currentWorkflowAction = service.findActionById(state.selectedTemplateVersion.WorkflowAction, state.currentWorkflowAction.id, true);
							}
						}
					}
				}
			}
			return item;
		}

		platformTranslateService.translationChanged.register(setModuleName);

		setModuleName();

		/**
		 * @ngdoc function
		 * @name createItem
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapps the server call for creating a new workflow template item.
		 * @returns { promis } In the response of the promis you get the new workflow template item.
		 */
		service.createItem = function () {
			var dataRequest = {
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/template/create'
			};

			return $q.all([$http(dataRequest), $http(templateRequest)]).then(
				function (response) {
					var newWorkflow = response[0].data;
					basicsWorkflowPreProcessorService.prepareWorkflowTemplate(newWorkflow);
					newWorkflow.TemplateVersions[0].WorkflowAction = response[1].data;
					state.mainEntities.push(newWorkflow);
					service.changeSelectedMainEntity(newWorkflow, null);
					return newWorkflow;
				});
		};

		/**
		 * @ngdoc function
		 * @name getApprovementTemplate
		 * @methodOf basicsWorkflowTemplateService
		 * @description Gives back a template for an approval process.
		 * @returns { object } approval process template.
		 */
		service.getApprovementTemplate = function (name) {
			if (!name) {
				name = 'approvement-wizard-template';
			}
			var path = 'basics.workflow/content/json/' + name + '.json';

			return $http(
				{
					method: 'GET',
					url: path
				})
				.then(function (response) {
					return angular.fromJson(response.data);
				});
		};

		/**
		 * @ngdoc function
		 * @name createItemByImport
		 * @methodOf basicsWorkflowTemplateService
		 * @description Creates a new workflow template by a existing version.
		 * @returns { object } New workflow template which is created.
		 */
		service.createItemByImport = function (importedVersion) {
			try {
				if (!_.isObject(importedVersion) && !importedVersion.WorkflowAction) {
					importedVersion = angular.fromJson(importedVersion);
					importedVersion = basicsWorkflowPreProcessorService.prepareWorkflowTemplateVersionToImport(importedVersion);
					importedVersion.workflowAction = angular.toJson(importedVersion.workflowAction);
				}
				return basicsWorkflowValidationService.validateWorkflowTemplate(importedVersion).then(function (response) {
					if (response.isValid) {
						return $http(
							{
								method: 'POST',
								url: globals.webApiBaseUrl + 'basics/workflow/template/import',
								data: importedVersion
							}
						).then(function (response) {
							var newWorkflow;
							if (response.data) {
								newWorkflow = response.data;
								basicsWorkflowPreProcessorService.prepareWorkflowTemplate(newWorkflow);
								state.mainEntities.push(newWorkflow);
								service.changeSelectedMainEntity(newWorkflow, state.selectedMainEntity);
							}
							return newWorkflow;
						});
					} else {
						const modalOptions = {
							bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-description-template-dialog.html',
							errorText: $translate.instant(response.errorText),
							value:{
								text: importedVersion.Description
							},
							headerText$tr$: 'basics.workflow.template.errorDialog.templateDescription.header',
							showCancelButton: true,
							showOkButton: true,
							pattern: '.',
						};
						return platformDialogService.showDialog(modalOptions).then(function (response) {
							if (response.value) {
								importedVersion.Description = response.value.text;
								return service.createItemByImport(importedVersion);
							}
						});
					}
				});
			} catch (e) {
				platformDialogService.showMsgBox('basics.workflow.service.errorMessage', 'basics.workflow.service.errorHeaderTitle', 'info');
				return $q.when();
			}
		};

		service.importVersion = function (json) {
			try {
				var version = angular.fromJson(json);
				version = basicsWorkflowPreProcessorService.prepareWorkflowTemplateVersionToImport(version);
				return $http(
					{
						method: 'POST',
						url: globals.webApiBaseUrl + 'basics/workflow/template/version/import',
						data: {'source': version, 'templateId': state.selectedMainEntity.Id}
					}
				).then(function (response) {
					var result = null;
					if (response.data) {
						var newVersion = basicsWorkflowPreProcessorService.prepareWorkflowTemplateVersion(response.data);
						state.selectedMainEntity.TemplateVersions.push(newVersion);
						state.selectedTemplateVersion = newVersion;
						state.mainItemIsDirty = true;
						result = newVersion;
					}
					return result;
				});
			} catch (ex) {
				platformDialogService.showMsgBox('basics.workflow.service.errorImportVersionMessage', 'basics.workflow.service.errorImportVersionHeaderTitle', 'info');
				return $q.when();
			}
		};

		/**
		 * @ngdoc function
		 * @name importZippedTemplates
		 * @methodOf basicsWorkflowTemplateService
		 * @description Import workflow templates by a Import Wizard with existing version.
		 * @returns { object } New workflow template which is imported.
		 */
		service.importZippedTemplates = function (importedTemplates) {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/template/proceedimportwizard',
					data: importedTemplates,
					// responseType: 'arraybuffer'
				}
			).then(function (response) {
				if (response.data) {
					var newWorkflow = response.data;
					basicsWorkflowPreProcessorService.prepareWorkflowTemplate(newWorkflow);
					state.mainEntities.push(newWorkflow);
					service.changeSelectedMainEntity(newWorkflow, state.selectedMainEntity);
				}
				// return newWorkflow;
			});
		};

		/**
		 * @ngdoc function
		 * @name analyseImportSource
		 * @methodOf basicsWorkflowTemplateService
		 * @description Unzip the imported Zip file.
		 * @returns { object } Ana array of Template details.
		 */
		service.analyseImportSource = function (source) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/analysesourcefile',
					params: {'source': source.toString()}
				}
			);
		};

		// service.addElementByImport = function (importedVersion) {
		// 	/*var version = angular.fromJson(importedVersion);
		// 	 var action = version.WorkflowAction;
		// 	 if(action.actionTypeId === basicsWorkflowActionType.start.id){
		// 	 action = action.transitions[0].workflowAction;
		// 	 }
		// 	 state.currentWorkflowAction.transitions[0]= action);*/
		// };

		/**
		 * @ngdoc function
		 * @name downloadVersion
		 * @methodOf basicsWorkflowTemplateService
		 * @description Downlaod selected template's version.
		 * @returns { object } In the response selected version of the selected workflow templates will return.
		 */
		service.downloadVersion = function (id) {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/template/version/export',
					params: {versionId: id}
				}
			).then(function (result) {
				buildFiles(angular.toJson(result.data), result.headers);
			});
		};

		/**
		 * @ngdoc function
		 * @name exportZippedTemplates
		 * @methodOf basicsWorkflowTemplateService
		 * @description Export / Downlaod selected templates via a Wizard.
		 * @returns { promis } In the response of the promis you get azip of selected workflow templates.
		 */
		// Zip Export Wizard service
		service.exportZippedTemplates = function (templateIdList, exportOptions) {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/template/exportwizard',
					data: {
						'TemplateIdList': templateIdList,
						'ExportOptions': exportOptions
					},
					responseType: 'arraybuffer'
				}
			).then(function (result) {
				buildFiles(result.data, result.headers);
			});
		};

		/**
		 * @ngdoc function
		 * @name deleteSelectedItem
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapps the server call for deleting an workflow template and use the current selected
		 * item. It also removes the item from platformModuleStateService.
		 * @returns { null }
		 */
		service.deleteSelectedItem = function () {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/template/delete',
					params: {id: platformModuleStateService.state(module).selectedMainEntity.Id}
				}
			).then(function () {

				state.mainItemIsDirty = false;

				var basicsWorkflowUIService = $injector.get('basicsWorkflowUIService');
				return basicsWorkflowUIService.removeItemAndRefreshList(module);
			});
		};

		/**
		 * @ngdoc function
		 * @name saveSelectedItem
		 * @methodOf basicsWorkflowTemplateService
		 * @description Uses the saveItem function with the current selected worklow template.
		 * @returns { promis } In the response of the promis you get the saved workflow template item.
		 */
		service.saveSelectedItem = function () {
			if (state.selectedMainEntity) {
				return service.saveItem(state.selectedMainEntity);
			}
			return $q.when(null);
		};

		/**
		 * @ngdoc function
		 * @name saveItem
		 * @methodOf basicsWorkflowTemplateService
		 * @description Uses the saveItem function with the current selected worklow template.
		 * @returns { promis } In the response of the promis you get the saved workflow template item.
		 */
		service.saveItem = function (item) {
			if (item.Id && !state.creatingNewTemplate) {
				var copy = angular.copy(item);
				return basicsWorkflowValidationService.validateWorkflowTemplate(copy).then(function (response) {
					if (response.isValid) {
						basicsWorkflowPreProcessorService.prepareWorkflowTemplateToSave(copy);
						if (!state.newestCreatedTemplateId || item.Id === state.newestCreatedTemplateId) {
							state.mainItemIsDirty = false;
							state.newestCreatedTemplateId = null;
						}
						return $http(
							{
								method: 'POST',
								url: globals.webApiBaseUrl + 'basics/workflow/template/save',
								data: copy,
								headers: {
									errorDialog: false
								}
							}
						).then(function (response) {
							sortInMainEntity(response.data);
							state.originalMainItems = angular.copy(state.mainEntities);
							state.isSaveHookCalled = true;
						}, function (response) {
							var errorObject;
							try {
								errorObject = angular.fromJson(response.data.ErrorMessage);
							} catch (e) {
								errorObject = {
									type: 'TemplateEntity',
									entityId: item.id,
									error: response.data.ErrorMessage
								};
							}
							/*if (item.Id === state.newestCreatedTemplateId) {
								state.mainItemIsDirty = false;
								state.newestCreatedTemplateId = null;
							}*/
							// state.selectedMainEntity = null;
							basicsWorkflowPreProcessorService.prepareWorkflowTemplate(copy);
							if (errorObject.type === 'TemplateVersionEntity') {
								service.getItem(copy.Id).then(function (serverEntity) {
									sortInMainEntity(serverEntity);
									service.copyVersion(errorObject.entityId).then(function (response) {
										var oldVersion = _.find(copy.TemplateVersions,
											{Id: parseInt(errorObject.entityId)});
										var index = _.findIndex(state.selectedMainEntity.TemplateVersions,
											{Id: response.data.Id});
										state.selectedMainEntity.TemplateVersions[index].WorkflowAction = oldVersion.WorkflowAction;
										state.mainItemIsDirty = true;
									});
								});
								platformModalService.showMsgBox('basics.workflow.template.version.errorDialog.concurency.text', 'basics.workflow.template.version.errorDialog.concurency.header', 'info');
							}
							if (errorObject.type === 'TemplateVersionSavingKeywordError') {
								platformModalService.showErrorBox('basics.workflow.template.errorDialog.workflowKeyword.text', 'basics.workflow.template.errorDialog.workflowKeyword.header');
							} else {
								platformModalService.showErrorBox(errorObject.error, errorObject.error);
							}
						});
					} else {
						const modalOptions = {
							bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-description-template-dialog.html',
							value:{
								text: item.Description
							},
							errorText: $translate.instant(response.errorText),
							headerText$tr$: 'basics.workflow.template.errorDialog.templateDescription.header',
							showCancelButton: true,
							showOkButton: true,
							pattern: '.',
						};
						return platformDialogService.showDialog(modalOptions).then(function (response) {
							if (response.value) {
								copy.Description = response.value.text;
								return service.saveItem(copy);
							}
						});
					}
				});
			} else {
				return $q.when({});
			}
		};

		/**
		 * @ngdoc function
		 * @name getList
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapper for server call to load all workflow templates.
		 * @returns { promis } In the response of the promis you get an array of workflow templates.
		 */
		service.getList = function () {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/list'
				}
			).then(function (response) {
				state.mainEntities = response.data;
				_.each(state.mainEntities,
					function (item) {
						item = basicsWorkflowPreProcessorService.prepareWorkflowTemplate(item);
					});
				return response.data;
			});

		};

		service.getListHeader = function () {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/listreduced'
				}
			).then(function (response) {
				state.mainEntitiesReduced = response.data;
				return response.data;
			});

		};

		service.getItem = function (id) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/byId',
					params: {templateId: id}
				}
			).then(function (response) {
				basicsWorkflowPreProcessorService.prepareWorkflowTemplate(response.data);
				return response.data;
			});
		};

		/**
		 * @ngdoc function
		 * @name getFilteredList
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapper for server call to load a filtered list of workflow templates.
		 * The sidebar filter request can be used for that function.
		 * @returns { promis } In the response of the promis you get an array of workflow templates.
		 */
		service.getFilteredList = function (filterRequest) {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/template/byfilter',
					data: filterRequest
				}
			).then(function (response) {
				state.mainEntities = response.data.dtos ? response.data.dtos : response.data.Dtos;

				_.each(state.mainEntities,
					function (item) {
						item = basicsWorkflowPreProcessorService.prepareWorkflowTemplate(item);
					});

				// Collection to hold original items
				state.originalMainItems = angular.copy(state.mainEntities);

				return response.data;
			});
		};

		/**
		 * @ngdoc function
		 * @name loadEntityById
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapper for server call to load a filtered selected entity of workflow templates.
		 * The sidebar filter request can be used for that function.
		 * @returns { promis } In the response of the promis you get an array of workflow templates.
		 */
		service.loadEntityById = function (id) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/byId',
					params: {templateId: id}
				}
			);
		};

		/**
		 * @ngdoc function
		 * @name getFilteredExportList
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapper for server call to load a simple filtered list of workflow templates to export via wizard.
		 * @returns { promis } In the response of the promis you get an array of workflow templates.
		 */
		service.getFilteredExportList = function (filter) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/byfilterexport',
					params: {filter: filter}
				}
			).then(function (response) {
				return response.data;
			});
		};

		/**
		 * @ngdoc function
		 * @name getWorkflowByModule
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapper for server call to load all workflow templates which are connected to a module.
		 * @returns { promis } In the response of the promis you get an array of workflow templates.
		 */
		service.getWorkflowByModule = function (module) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/bymodule',
					params: {moduleName: module}
				}
			).then(function (response) {
				return response.data;
			});
		};

		/**
		 * @ngdoc function
		 * @name getUserWorkflows
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapper for server call to load all workflow templates which are type of user workflow.
		 * @returns { promis } In the response of the promis you get an array of workflow templates.
		 */
		service.getUserWorkflows = function (entityIds) {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/template/workflows/currentuser',
					data: entityIds
				}
			).then(function (response) {
				return response.data;
			}, function err(err) {
				console.log('service.getUserWorkflows() failed.', err);
			});
		};

		/**
		 * @ngdoc function
		 * @name getWorkflowByEntity
		 * @methodOf basicsWorkflowTemplateService
		 * @description Wrapper for server call to load all workflows by entity type.
		 * @returns { promis } In the response of the promis you get an array of workflow templates.
		 */
		service.getWorkflowByEntity = function (entity) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/byentity',
					params: {entityName: entity}
				}
			).then(function (response) {
				return response.data;
			});
		};

		service.getLastElement = function () {
			return _lastElement;
		};

		function setLastElement(element) {
			_lastElement = element;
		}

		/*
		 selectedId = Id from selected svg-element
		 addActionTypId = type from new element
		 */
		service.addElement = function (selected, addActionTypId) {
			pushNewTransitions(selected, addActionTypId);
		};

		service.addElementAfter = function (parent, actionTypId, action) {
			var transiton;

			if (parent.workflowAction) {
				var parentAction = angular.toJson(parent.workflowAction);
				transiton = createTransition(null);
				transiton.workflowAction = angular.fromJson(parentAction);
				state.currentWorkflowAction = createAction(actionTypId, [transiton], action);
				parent.workflowAction = state.currentWorkflowAction;
			} else {
				if (parent.actionTypeId === basicsWorkflowActionType.decision.id) {
					var endTransition = createTransition('');
					endTransition.workflowAction = createAction(basicsWorkflowActionType.end.id, null);
					transiton = createTransition('?');
					transiton.workflowAction = createAction(actionTypId, [endTransition], action);
					parent.transitions.push(transiton);
					state.currentWorkflowAction = transiton.workflowAction;
				} else {
					transiton = createTransition(null);
					var parentTrans = angular.toJson(parent.transitions);
					transiton.workflowAction = createAction(actionTypId, angular.fromJson(parentTrans), action);
					parent.transitions = [];
					parent.transitions.push(transiton);
					state.currentWorkflowAction = transiton.workflowAction;
				}
			}
			return state.currentWorkflowAction;
		};

		function createTransition(param) {
			return {
				id: getNextActionId(),
				parameter: param,
				workflowAction: null
			};
		}

		function createAction(actionTypeId, childTransitions, action) {

			var description;
			var input = [];
			var output = [];
			var actionId = null;

			if (actionTypeId === basicsWorkflowActionType.decision.id) {

				for (var i = 0; i < childTransitions.length; i++) {
					childTransitions[i].parameter = '?';
				}

			}

			if (action) {
				description = action.Description;
				actionId = action.Id;
				_.each(action.Input, function (item) {
					input.push(
						basicsWorkflowPreProcessorService.getContextObj(item, ''));
				});

				_.each(action.Output, function (item) {
					output.push(
						basicsWorkflowPreProcessorService.getContextObj(item, ''));
				});

				// should be placed in a separate service. For each action it should be possible to add defaults.
				if (actionId === '00000000000000000000000000000001' ||
					actionId === '00000000000000000000000000000000' || actionId === '00000CB98D9A4C87A6504C5313080EB9') {
					var config = [];
					if (actionId === '00000000000000000000000000000001' || actionId === '00000CB98D9A4C87A6504C5313080EB9') {
						config.push({type: 'userDecision', description: 'User Decision'});
					}
					config.push({type: 'title', description: 'Title'});
					config.push({type: 'subtitle', description: 'Subtitle'});
					input[0].value = angular.toJson(config);
				} else if (actionId === '000019b479164ad1adeb7631d3fd6161') {
					var contexParam = _.find(input, {key: 'Context'});
					if (contexParam) {
						contexParam.value = '{{Context}}';
					}
				}

			} else {
				description = basicsWorkflowActionType.getById(actionTypeId).key;
			}

			return {
				id: getNextActionId(),
				code: '',
				description: platformTranslateService.instant(description, null, true),
				documentList: [],
				actionTypeId: actionTypeId,
				actionId: actionId,
				userId: '',
				lifeTime: action && action.IsLongRunning ? 4 : 1,
				priorityId: state.defaultPriority.id,
				transitions: childTransitions,
				input: input,
				output: output
			};
		}

		service.deleteElement = function (item, version) {
			var rootItem = version.WorkflowAction;

			var parent = service.getParentAction(item.parameter ? item.workflowAction.id : item.id, rootItem, null);

			if (parent) {
				if (item.actionTypeId === 3 && !(item.transitions.length === 1 && item.transitions[0].workflowAction.actionTypeId === 2)) {
					platformModalService.showYesNoDialog('basics.workflow.action.deleteDecisionAction.deleteConfirmation', 'basics.workflow.action.deleteDecisionAction.header', 'no')
						.then(function (result) {
							if (result.yes) {
								deleteElement(item, parent);
							}
						});
				} else {
					deleteElement(item, parent);
				}
			}
		};

		function deleteElement(item, parent) {
			if (item.parameter) {
				var index = parent.transitions.indexOf(item);
				parent.transitions.splice(index, 1);
				if (parent.transitions.length === 0) {
					parent.transitions.push(createEndTransition('?'));
				}

			} else {

				for (var i = 0; i < parent.transitions.length; i++) {
					if (parent.transitions[i].workflowAction.id === item.id) {
						break;
					}
				}

				if (basicsWorkflowActionType.decision.id === item.actionTypeId) {
					var parameter = parent.actionTypeId === basicsWorkflowActionType.decision.id ? '?' : null;
					parent.transitions[i] = createEndTransition(parameter);
				} else {
					if (parent.actionTypeId === basicsWorkflowActionType.decision.id) {
						parent.transitions[i].workflowAction.transitions[0].parameter = parent.transitions[i].parameter;
					}

					parent.transitions[i] = parent.transitions[i].workflowAction.transitions[0];
				}
			}
			state.currentWorkflowAction = parent;
			state.mainItemIsDirty = true;
		}

		service.copyElement = function (item) {
			return item.parameter ? copyTransition(item) : service.copyAction(item, basicsWorkflowActionType.decision.id === item.actionTypeId);
		};

		service.copyAction = function copyAction(action, deep) {
			var options = [];
			_.each(action.transitions, function (t) {
				if (t.parameter !== undefined && _.find(options, {id: t.parameter}) === undefined) {
					options.push(
						{
							id: t.parameter,
							parameter: t.description ? t.description : t.parameter
						}
					);
				}
			});

			return {
				id: getNextActionId(),
				code: action.code,
				description: action.description,
				comment: action.comment,
				documentList: action.documentList,
				actionTypeId: action.actionTypeId,
				actionId: action.actionId,
				userId: action.userId,
				input: angular.fromJson(angular.toJson(action.input)),
				output: angular.fromJson(angular.toJson(action.output)),
				lifeTime: action.lifeTime,
				priorityId: action.priorityId,
				transitions: deep ? copyTransitions(action.transitions) : [],
				options: options,
				userDefined1: action.userDefined1,								// ALM #108230. Missing fields while coping an action of workflow is updated.
				userDefined2: action.userDefined2,
				userDefined3: action.userDefined3,
				userDefined4: action.userDefined4,
				userDefined5: action.userDefined5,
				endTime: action.endTime,
				executeCondition: action.executeCondition,
				userDefinedMoney1: action.userDefinedMoney1,
				userDefinedMoney2: action.userDefinedMoney2,
				userDefinedMoney3: action.userDefinedMoney3,
				userDefinedMoney4: action.userDefinedMoney4,
				userDefinedMoney5: action.userDefinedMoney5,
				userDefinedDate1: action.userDefinedDate1,
				userDefinedDate2: action.userDefinedDate2,
				userDefinedDate3: action.userDefinedDate3,
				userDefinedDate4: action.userDefinedDate4,
				userDefinedDate5: action.userDefinedDate5
			};
		};

		function copyTransitions(transitions) {
			var result = [];
			_.each(transitions, function (transition) {
				var copyTrans = copyTransition(transition);
				result.push(copyTrans);
			});
			return result;
		}

		function copyTransition(transition) {
			return {
				id: getNextActionId(),
				parameter: transition.parameter,
				workflowAction: transition.workflowAction ? service.copyAction(transition.workflowAction, true) : null
			};
		}

		service.pasteElement = function (parent, item) {
			var transition;
			var lastAction;
			// parent and item are normal actions
			if (!item.parameter && !parent.parameter && parent.actionTypeId !== basicsWorkflowActionType.decision.id) {
				transition = createTransition(null);
				transition.workflowAction = service.copyAction(item, basicsWorkflowActionType.decision.id === item.actionTypeId);

				var tempTransitions = copyTransitions(parent.transitions);
				parent.transitions = [];
				transition.workflowAction.transitions = tempTransitions;
				if (transition.workflowAction.actionTypeId === basicsWorkflowActionType.decision.id) {
					_.each(transition.workflowAction.transitions, function (item) {
						item.parameter = '?';
					});
				}
				parent.transitions.push(transition);
			}

			// parent is normal action and item is transition
			if (item.parameter && !parent.parameter && parent.actionTypeId !== basicsWorkflowActionType.decision.id) {
				item.parameter = '';
				lastAction = service.copyAction(service.getLastActionInRow(item.workflowAction));
				lastAction.transitions = copyTransitions(parent.transitions);
				parent.transitions[0] = copyTransition(item);
			}

			// when parent is a decision
			if (parent.actionTypeId === basicsWorkflowActionType.decision.id) {
				if (item.parameter) {
					transition = item;
				} else {
					transition = createTransition('?');
					transition.workflowAction = service.copyAction(item);
				}
				var newItem = service.getLastActionInRow(transition.workflowAction);
				var param = newItem.actionTypeId === basicsWorkflowActionType.decision.id ? '?' : null;
				newItem.transitions = [createEndTransition(param)];
				parent.transitions.push(transition);
			}

			// when parent is a transition
			if (parent.parameter) {
				if (item.parameter) {
					var grandFather = service.getParentAction(parent.workflowAction.id, item.workflowAction);
					grandFather.transitions.push(copyTransition(item));
				} else {
					lastAction = service.copyAction(service.getLastActionInRow(item));
					lastAction.transitions = [];
					transition = lastAction.actionTypeId === basicsWorkflowActionType.decision.id ? createTransition('?') : createTransition(null);
					transition.workflowAction = parent.workflowAction;
					lastAction.transitions.push(transition);
					parent.workflowAction = lastAction;
				}
			}

			state.mainItemIsDirty = true;

		};

		service.cutElement = function (item, version) {
			var result = service.copyElement(item);
			service.deleteElement(item, version);
			return result;
		};

		service.getParentAction = function (searchId, item, parent) {
			if (item.id === searchId) {
				return parent;
			}
			if (item.transitions) {
				var result = null;
				_.each(item.transitions, function (subitem) {
					var p = service.getParentAction(searchId, subitem.workflowAction, item);
					if (p) {
						result = p;
					}
				});
				return result;
			}
		};

		function createEndTransition(parameter) {
			var transition = createTransition(null);
			transition.workflowAction = createAction(basicsWorkflowActionType.end.id, null);
			transition.parameter = parameter;

			return transition;
		}

		service.getElemForAddTransition = function (root, id) {

			id = parseInt(id);

			if (root.id === id) {
				return root;
			}

			// startnode hasn't 'workflowAction'
			var nexRoot = root.workflowAction ? root.workflowAction.transitions : root.transitions;

			if (nexRoot) {
				for (var j = 0; j < nexRoot.length; j++) {
					// in each transition -> exist one workflowAction
					// var child = root.transitions[j].workflowAction;
					var child = nexRoot[j];
					var result = service.getElemForAddTransition(child, id);
					if (result) {
						return result;
					}
				}
			}
			// return undefined
		};

		service.changeSelectedMainEntity = function (mainEntity, oldVal) {
			if (oldVal && state.selectedMainEntity.Id !== oldVal.Id) {
				state.debugContext = '';
			}
			if (angular.isDefined(mainEntity) && mainEntity !== null) {

				if (state.mainItemIsDirty && state.selectedTemplateVersion && !state.selectedTemplateVersion.IsReadOnly) {
					service.saveItem(state.selectedMainEntity);
				}

				if (mainEntity.Id) {
					cloudDesktopInfoService.updateModuleInfo(moduleName + ': ' + mainEntity.Id + ' - ' + mainEntity.Description);
				} else {
					cloudDesktopInfoService.updateModuleInfo(moduleName);
				}

				state.selectedMainEntity = mainEntity;

				if (mainEntity.TemplateVersions &&
					(!state.selectedTemplateVersion || state.selectedTemplateVersion.WorkflowTemplateId !== mainEntity.Id)) {
					var currentVersion = null;

					_.each(mainEntity.TemplateVersions, function (version) {
						if (version.Status && version.Status === basicsWorkflowVersionStatus.active.id) {
							currentVersion = version;
						}
					});

					if (currentVersion === null) {
						currentVersion = mainEntity.TemplateVersions[mainEntity.TemplateVersions.length - 1];
					}

					state.selectedTemplateVersion = currentVersion;

					if (currentVersion) {
						var list = [];
						basicsWorkflowUtilityService.forEachAction(currentVersion.WorkflowAction, function (item) {
							item.action = _.find(state.actions, {Id: item.actionId});
							list.push(item);
						});
						state.actionList = list;
					}
				}
			}
		};

		service.copyVersion = function (id) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/version/copy',
					params: {id: id}
				}
			).then(function (response) {
				if (response.data) {
					var newVersion = basicsWorkflowPreProcessorService.prepareWorkflowTemplateVersion(response.data);
					state.selectedMainEntity.TemplateVersions.push(newVersion);
					state.selectedTemplateVersion = newVersion;
				}
				return response;
			});
		};

		function buildFiles(data, headers) {
			var octetStreamMime = 'application/octet-stream';

			// Get the headers
			headers = headers();
			// Get the filename from the x-filename header or default to "download.bin"
			var filename = headers['x-filename'] || 'download.bin';

			// Determine the content type from the header or default to "application/octet-stream"
			var contentType = headers['content-type'] || octetStreamMime;

			// Get the blob url creator
			var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
			if (urlCreator) {
				// Try to use a download link
				var link = document.createElement('a');
				if ('download' in link) {
					// Try to simulate a click
					try {
						// data = data.replace('/ /g', ''); //Not required the escaping for Zip download.
						// Prepare a blob URL
						var blob = new Blob([data], {type: contentType});
						var url = urlCreator.createObjectURL(blob);
						link.setAttribute('href', url);

						// Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
						link.setAttribute('download', filename);

						// Simulate clicking the download link
						var event = document.createEvent('MouseEvents');
						event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
						link.dispatchEvent(event);
					} catch (ex) {
						// no error should appear.
					}
				}
			}
		}

		service.deleteVersion = function (version) {
			version.status = 4;

		};

		service.changeVersionStatus = function (version) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/version/changeStatus',
					params: {id: version.Id}
				}
			).then(function (response) {
				sortInMainEntity(response.data);
				return response;
			});
		};

		service.goToDesignerEndpoint = function (item) {
			var request = {
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/template/byInstance',
				params: {instanceId: item.WorkflowInstanceId}
			};

			return $http(request)
				.then(function (result) {
					state.currentWorkflowAction = item.action;
					state.selectedMainEntity = result.data;
				});

		};

		service.getAllCodes = function (rootItem) {
			var result = [];
			basicsWorkflowUtilityService.forEachAction(rootItem, function (item) {
				if (item.code !== null && item.code !== '') {
					result.push(item.code);
				}
			});
			return result;
		};

		service.registerSelectionChanged = function (callBackFn) {
			selectedTemplates.push(callBackFn);
		};

		service.getSelected = function () {
			return service.selectedItem;
		};

		service.getAllCodesFromCurrentVersion = function () {
			return service.getAllCodes(state.selectedTemplateVersion.WorkflowAction);
		};

		service.findActionById = function findActionById(rootAction, id, onlyFirst) {
			var result = null;
			var fn = function (item) {
				if (item.id === id) {
					if (result && onlyFirst) {
						return;
					}
					result = item;
				}
			};
			basicsWorkflowUtilityService.forEachAction(rootAction, fn);
			return result;
		};

		service.getLastActionInRow = function getLastActionInRow(rootAction) {
			var result = [];

			var fn = function (item) {
				if (item.transitions && item.transitions.length > 0) {
					if (item.transitions[0].workflowAction && item.transitions[0].workflowAction.actionTypeId === basicsWorkflowActionType.end.id) {
						result.push(item);
					}
				} else {
					if (item.actionTypeId !== basicsWorkflowActionType.end.id) {
						result.push(item);
					}
				}
			};
			basicsWorkflowUtilityService.forEachAction(rootAction, fn);

			return result.length > 0 ? result[0] : null;
		};

		service.getContextStructure = function (templateVersion) {
			var structure = state.entityDescriptions[state.selectedMainEntity.entityId];

			for (var i = 0; i < templateVersion.Context.length; i++) {
				structure[templateVersion.Context[i].key] = templateVersion.Context[i].value;
			}

			basicsWorkflowUtilityService.forEachAction(templateVersion.WorkflowAction, function (item) {
				if (angular.isArray(item.output)) {
					for (var o = 0; o < item.output.length; o++) {
						structure[item.output[o].value] = '';
					}
				}
			});

			return structure;

		};

		service.debugAction = function (action, context) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/actions/debug',
					params: {
						wfAction: angular.toJson(service.copyAction(action, false)),
						context: context
					}
				}
			).then(function (response) {
				return response.data;
			});
		};

		service.createNewSubscribedEvent = function (templateId) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/workflow/template/' + templateId + '/subscribedevent'
			}).then(function (response) {
				if (response.data) {
					var newVersion = response.data;
					state.selectedMainEntity.SubscribedEvents.push(newVersion);
					state.selectedSubscribedEvent = newVersion;
				}
				return response;
			});
		};

		service.createApproverConfig = function createApproverConfig(templateId) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/approverConfig/create',
				params: {templateFk: templateId}
			}).then(function (response) {
				if (response.data) {
					var approverConfig = response.data;
					basicsWorkflowPreProcessorService.processDates([approverConfig]);
					state.selectedMainEntity.ApproverConfigList = state.selectedMainEntity.ApproverConfigList ? state.selectedMainEntity.ApproverConfigList : [];
					state.selectedMainEntity.ApproverConfigList.push(approverConfig);
					state.selectedApproverConfig = approverConfig;
					state.mainItemIsDirty = true;
					return approverConfig;
				}
			});
		};

		service.createApprover = function createApprover(configFk) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/approver/create',
				params: {approverConfigFk: configFk}
			}).then(function (response) {
				if (response.data) {
					var approver = response.data;
					basicsWorkflowPreProcessorService.processDates([approver]);
					state.selectedApproverConfig.ApproverList = state.selectedApproverConfig.ApproverList ? state.selectedApproverConfig.ApproverList : [];
					state.selectedApproverConfig.ApproverList.push(approver);
					state.selectedApprover = approver;
					state.mainItemIsDirty = true;
					return approver;
				}
			});
		};

		service.markCurrentSubscribedEventForDelete = function () {
			state.selectedSubscribedEvent.IsDeleted = true;
			state.mainItemIsDirty = true;
		};

		/*
		Get all status matrix for a selected templateId
		*/
		service.getStatusMatrix = function (templateId) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/template/getstatusmatrix',
					params: {templateId: templateId}
				}).then(function (response) {
				return response.data;
			});
		};

		function pushNewTransitions(parentFromNewObject, actionId) {
			/* check is a decision or an action type.
			 action type has one transition(normally)
			 decision has more childs in transitions
			 */
			if (angular.isDefined(parentFromNewObject) && parentFromNewObject !== null) {
				// message, prozess action
				// start or end
				if (parentFromNewObject.actionTypeId !== basicsWorkflowActionType.decision.id) {
					// action. first save transitions.
					checkAddaDecision(parentFromNewObject, actionId);
					var cacheCurrentTransition = parentFromNewObject.transitions;
					parentFromNewObject.transitions = null;

					parentFromNewObject.transitions = [addObjectInWorkflowData(actionId, cacheCurrentTransition, null)];
				}

				// select a decision-element
				else {
					// kann sein, dass length noch null ist.
					if (parentFromNewObject.transitions) {
						// füge ich irgendwo ein decision -> der nach kommende Element kriegtnoch ein 'decision-rect'
						parentFromNewObject.transitions[parentFromNewObject.transitions.length] =
							addObjectInWorkflowData(actionId, null, 'param');
					} else {
						// transitions ist noch null
						parentFromNewObject.transitions = [addObjectInWorkflowData(actionId, null, 'param')];
					}
				}
			}
		}

		// after add a decision-node, insert a param-description.
		function checkAddaDecision(parentFromNewObject, actionId) {
			if (actionId === basicsWorkflowActionType.decision.id && parentFromNewObject.transitions) {
				parentFromNewObject.transitions[0].parameter = 'param';
			}
			return parentFromNewObject;
		}

		function addObjectInWorkflowData(actionTypId, commonTransition, parameter) {

			var newObject = {
				id: getNextActionId(),
				parameter: parameter,
				workflowAction: getActionContent(actionTypId, commonTransition)
			};

			setLastElement(newObject);

			return newObject;
		}

		function getActionContent(newActionTypID, newTransition) {

			// after add a new action add an endnode, if not available
			if (newActionTypID > basicsWorkflowActionType.decision.id && newTransition === null) {
				newTransition = [addObjectInWorkflowData(basicsWorkflowActionType.end.id, null, null)];
			}

			return {
				id: getNextActionId(),
				code: '',
				description: platformTranslateService.instant(basicsWorkflowActionType.getById(newActionTypID).key, null, true),
				documentList: [],
				actionTypeId: newActionTypID,
				actionId: null,
				userId: '',
				transitions: newTransition
			};
		}

		function getNextActionId() {
			currentMaxItemId += 1;
			return currentMaxItemId;
		}

		service.updateCurrentMaxItemId = function updateCurrentMaxItemId() {
			let itemIdList = [];

			if (state.selectedTemplateVersion) {
				basicsWorkflowUtilityService.forEachElement(state.selectedTemplateVersion.WorkflowAction, function (item) {
					if (!_.isNaN(+item.id)) {
						itemIdList.push(item.id);
					}
				});
			}

			currentMaxItemId = _.max(itemIdList);
		};

		// Check if any action has changed
		service.hasActionChanged = function () {
			// Current state of actions for selected template version
			if (!state.selectedTemplateVersion) {
				return false;
			}

			let currentActions = state.selectedTemplateVersion.WorkflowAction;
			let originalActions;

			if (!angular.isDefined(state.originalMainItems)) {
				return false;
			}

			let originalMainItems = state.originalMainItems.filter(entities => entities.Id === state.selectedMainEntity.Id)[0];
			if (originalMainItems !== undefined) {
				let originalSelectedTemplate = originalMainItems.TemplateVersions.filter(templateVersions => templateVersions.Id === state.selectedTemplateVersion.Id)[0];
				if (originalSelectedTemplate !== undefined) {
					// Original State of actions for selected template version
					originalActions = originalSelectedTemplate.WorkflowAction;

					if (typeof (originalActions) === 'string') {
						originalActions = JSON.parse(originalActions);
					}
				}
			}

			return checkCurrentActionChanged(currentActions, originalActions);
		};

		function checkCurrentActionChanged(currentActions, originalActions) {

			// Check the current action against original action
			let isActionChanged = checkCurrentActionAgainstOriginal(currentActions, originalActions);

			// If current action hasn't changed continue to check other actions
			if (!isActionChanged && angular.isDefined(currentActions.transitions) && currentActions.transitions !== null) {
				// Check child actions against list of original actions
				for (let transitionIndex = 0; transitionIndex < currentActions.transitions.length; transitionIndex++) {

					// If the current action has changed in the transition, then no need to check the next transition.
					if (isActionChanged) {
						break;
					}

					if (currentActions.transitions && originalActions.transitions && currentActions.transitions[transitionIndex] && originalActions.transitions[transitionIndex]) {
						isActionChanged = isActionChanged || checkCurrentActionChanged(currentActions.transitions[transitionIndex].workflowAction, originalActions.transitions[transitionIndex].workflowAction);
					} else {
						isActionChanged = true;
					}
				}
			}

			return isActionChanged;
		}

		// Removes properties from the action which are not required during comparison
		function returnActionObj(actionObj) {
			let modifiedActionObj = angular.copy(actionObj);
			delete modifiedActionObj.transitions;
			delete modifiedActionObj.actionType;
			delete modifiedActionObj.action;
			delete modifiedActionObj.context;
			delete modifiedActionObj.refreshWrapper;
			return modifiedActionObj;
		}

		// Checks an action against all the other actions in the current selected template for changes
		function checkCurrentActionAgainstOriginal(currentAction, allActionsInTemplate) {
			if (!angular.isDefined(allActionsInTemplate) || allActionsInTemplate === null) {
				return true;
			}

			let actionToCheck = returnActionObj(currentAction);
			let allActions = returnActionObj(allActionsInTemplate);

			if (actionToCheck.id === allActions.id) {
				let allKeys = Object.keys(actionToCheck);
				let valueMatch = false;
				allKeys.forEach(key => {
					if (allActions[key] === undefined) {
						valueMatch = valueMatch || actionToCheck[key] !== '';
					} else {
						valueMatch = valueMatch || (JSON.stringify(actionToCheck[key]) !== JSON.stringify(allActions[key]));
					}
				});
				return valueMatch;
			} else {
				return true;
			}
		}

		service.checkTasksExistsForApproverConfigs = function checkTasksExistsForApproverConfigs(approverConfigIds) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/workflow/approverconfig/checkTasksExistsForApproverConfigs',
				data: approverConfigIds
			});
		};

		service.getServiceName = function getServiceName() {
			return 'basicsWorkflowTemplateService';
		}

		return service;
	}

	angular.module('basics.workflow').factory('basicsWorkflowTemplateService', ['$http', '$q', '_', '$injector', 'globals',
		'platformModuleStateService', 'basicsWorkflowPreProcessorService', 'basicsWorkflowActionType',
		'cloudDesktopInfoService', 'platformTranslateService', 'basicsWorkflowVersionStatus',
		'platformModalService', 'basicsWorkflowUtilityService', 'platformDialogService', 'basicsWorkflowValidationService', '$translate',
		basicsWorkflowTemplateService]);
})();

