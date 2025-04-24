(function (angular) {
	'use strict';

	function PreProcessorService(globals, moment, _,
		platformTranslateService, basicsWorkflowVersionStatusToId, platformModuleStateService,
		platformPriorityIconService, basicsWorkflowUtilityService, basicsWorkflowDtoService,
		platformDataProcessExtensionHistoryCreator, platformRuntimeDataService, BasicsCommonDateProcessor, cloudDesktopCompanyService) {

		var state = platformModuleStateService.state('basics.workflow');

		var service = {};

		service.convertToMomentHandler = function (property, resultProperty, format) {
			return function (item) {
				if (angular.isArray(format)) {
					var result = '';
					_.each(format, function (f) {
						result += moment(item[property]).format(f) + ' ';
					});
					item[resultProperty] = result;
				} else {
					item[resultProperty] = moment(item[property]).local().format(format);
				}

				return item;
			};
		};

		service.setPropertyByInput = function (property, type) {
			return function (item) {
				var input = _.find(item.Input, {key: type});
				if (input) {
					item[property] = input.value;
				}
				return item;
			};
		};

		service.replacePropertyByInput = function (property, type) {
			return function (item) {
				var configProp = _.find(item.Input, {key: 'Config'});
				if (configProp) {
					try {
						var config = configProp.value;
						if (isJson(configProp.value)) {
							config = angular.fromJson(configProp.value);
						}
						var inputProperty = _.find(config, {type: type});
						if (inputProperty && inputProperty.options && inputProperty.options.displayText) {
							var displayText = inputProperty.options.displayText;
							if (inputProperty.options.escapeHtml) {
								displayText = _.escape(displayText);
							}
							item[property] = displayText;
						}
					} catch (err) {
						_.noop(err);
					}
				}
				return item;
			};
		};

		service.replacePropertyByInputParam = function (property, inputParam) {
			return function (item) {
				if (item) {
					var prop = _.find(item.Input, {key: inputParam});
					if (prop) {
						item[property] = prop.value;
					}
				}
				return item;
			};
		};

		function isJson(str) {
			str = typeof str !== 'string' ? JSON.stringify(str) : str;
			try {
				str = JSON.parse(str);
			} catch (e) {
				return false;
			}
			if (typeof str === 'object' && str !== null) {
				return true;
			}
			return false;
		}

		service.convertPrioToIcon = function (property, iconProperty) {
			return function (item) {
				if (item[property]) {
					item[iconProperty] = platformPriorityIconService.getItemById(item[property]).res;
					item.Priority = _.find(state.priority, {Id: item[property]});
				}
				return item;
			};
		};

		service.convertLifeTimeToIcon = function (property, lifetimeProperty, iconProperty, endedString) {
			var baseSprite = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#';
			return function (item) {
				if (item[property] && item[property] !== 0) {
					var currentTime = moment();
					if (currentTime.isAfter(moment(item[property]))) {
						item[iconProperty] = baseSprite + 'ico-lifetime-0';
						item.lifeTimePercent = endedString;
					} else if (currentTime.add(item[lifetimeProperty] * 0.25, 'h').isAfter(moment(item[property]))) {
						item[iconProperty] = baseSprite + 'ico-lifetime-25';
						item.lifeTimePercent = '0-25 %';
					} else if (currentTime.add(item[lifetimeProperty] * 0.5, 'h').isAfter(moment(item[property]))) {
						item[iconProperty] = baseSprite + 'ico-lifetime-50';
						item.lifeTimePercent = '25-50 %';
					} else if (currentTime.add(item[lifetimeProperty] * 0.75, 'h').isAfter(moment(item[property]))) {
						item[iconProperty] = baseSprite + 'ico-lifetime-75';
						item.lifeTimePercent = '50-75 %';

					} else {
						item[iconProperty] = baseSprite + 'ico-lifetime-100';
						item.lifeTimePercent = '> 75-100 %';
					}
				} else {
					item[iconProperty] = baseSprite + 'ico-lifetime-100';
					item.lifeTimePercent = '100 %';
				}
				return item;
			};
		};

		service.createGroupableDate = function (dateProperty, resultProperty, noDateString) {
			return function (item) {
				if (moment(item[dateProperty]).isValid()) {
					item[resultProperty] = moment(item[dateProperty]).format('L');
				} else {
					item[resultProperty] = noDateString;
				}
				return item;
			};
		};

		service.addUserInfo = function (currentClerkId) {
			var baseSprite = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#';
			return function (item) {
				if (item.OwnerId && item.OwnerId === currentClerkId) {
					item.OwnerType = 'user';
					item.OwnerIcon = baseSprite + 'ico-user';
					item.Readonly = false;
				} else {
					item.OwnerType = 'group';
					item.OwnerIcon = baseSprite + 'ico-user-group';
					if (item.ProgressById) {
						if (item.ProgressById === currentClerkId) {
							item.OwnerIcon = baseSprite + 'ico-user-group-edit';
							item.Readonly = false;
						} else {
							item.OwnerIcon = baseSprite + 'ico-user-group-locked';
							item.Readonly = true;
						}
					}
				}
				return item;
			};
		};

		service.addPortalUserInfo = function () {
			var baseSprite = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#';
			return function (item) {
				if (item) {
					item.OwnerType = 'portaluser';
					item.OwnerIcon = baseSprite + 'ico-user';
					item.Clerk = platformTranslateService.instant('basics.workflow.task.list.grouping.MyTasks', null, true);
					item.Readonly = false;
				}
				return item;
			};
		};

		service.addCompanyName = function () {
			return function (item) {
				if (item) {
					item.CompanyName = cloudDesktopCompanyService.getCompanybyId(item.CompanyFk)?.name;
				}
				return item;
			};
		};

		service.addProcessingStatus = function (currentClerk) {
			return function (item) {
				if (item.IsRunning) {
					if (item.ProgressById) {
						if (item.ProgressById === currentClerk.Id) {
							item.ProcessingStatus = 'edit';
						} else {
							item.ProcessingStatus = 'locked';

						}
					} else {
						item.ProcessingStatus = 'running';
					}
				} else {
					item.ProcessingStatus = 'done';
					item.ProcessingStatusIcon = 'ico-hook2';
				}
				return item;
			};
		};

		service.addEntityHeader = function (item) {
			item.entityHeader = 'Code Description';
			return item;
		};

		service.addWrapper = function (item) {
			return basicsWorkflowDtoService.extendObject(item);
		};

		service.addFnHandler = function (fn, property) {
			return function (item) {
				item[property] = fn;
				return item;
			};
		};

		service.prepareOutput = function () {
			return function (action) {
				if (angular.isString(action.output)) {
					action.output = angular.fromJson(action.output);
				}

				_.each(action.output, function (item) {
					var words;
					if (item.value.indexOf(';') !== -1) {
						words = item.value.split(';');
						item.title = words[0];
						item.default = words[1];
					} else {
						item.title = item.key;
						item.default = item.value;
					}
				});
			};

		};

		service.prepareWorkflowContext = function (context) {
			return parseObjectToRow(context, null, service.getContextObj);
		};

		service.prepareWorkflowTemplate = function (workflowTemplate) {
			workflowTemplate.Context = angular.fromJson(workflowTemplate.Context);
			platformDataProcessExtensionHistoryCreator.processItem(workflowTemplate);
			_.each(workflowTemplate.TemplateVersions, function (item) {
				service.prepareWorkflowTemplateVersion(item);
			});
			if (!_.isEmpty(workflowTemplate.ApproverConfigList)) {
				processDates(workflowTemplate.ApproverConfigList);
			}
		};

		function processDates(approverConfigList) {
			var processor = new BasicsCommonDateProcessor(['ClassifiedDate', 'InsertedAt', 'Evaluatedon', 'Duedate', 'EvaluatedOn', 'UpdatedAt']);
			_.each(approverConfigList, function (approverConfig) {
				processor.processItem(approverConfig);
				_.each(approverConfig.ApproverList, function (approver) {
					processor.processItem(approver);
				});
			});
		}

		service.processDates = processDates;

		service.prepareWorkflowTemplateToSave = function (workflowTemplate) {
			workflowTemplate.TemplateVersions = _.filter(workflowTemplate.TemplateVersions, function (version) {
				return version.Status === 1 || version.Status === 4;
			});
			_.each(workflowTemplate.TemplateVersions, function (version) {
				basicsWorkflowUtilityService.forEachAction(version.WorkflowAction, function (item) {
					if (item.hasOwnProperty('Context')) {
						delete item.Context;
					}
					var action = _.find(state.actions, {id: item.actionId});
					if (action) {
						_.remove(item.input, function (input) {
							return _.indexOf(action.input, input.key) === -1;
						});
						_.remove(item.output, function (output) {
							return _.indexOf(action.output, output.key) === -1;
						});
					}
				});
				version.WorkflowAction = angular.toJson(version.WorkflowAction);
				version.Context = angular.toJson(version.Context);
				prepareScripts(version);
			});
		};

		function prepareScripts(version) {
			if (_.isArray(version.IncludedScripts)) {
				version.IncludedScripts = _.map(version.IncludedScripts, function (script) {
					return {
						Id: script.Id,
						TemplateVersionFk: version.Id,
						FilePath: script.FilePath,
						Include: script.Include
					};
				});
			}
		}

		service.prepareWorkflowTemplateVersionToImport = function (version) {
			version.WorkflowAction = angular.toJson(version.WorkflowAction);
			version.Context = angular.toJson(version.Context);
			return version;
		};

		service.prepareWorkflowTemplateVersion = function (version) {
			version.WorkflowAction = angular.fromJson(version.WorkflowAction);
			try {
				version.Context = angular.fromJson(version.Context);
			} catch (ex) {
				version.Context = [];
			}

			platformDataProcessExtensionHistoryCreator.processItem(version);
			platformRuntimeDataService.readonly(version, version.IsReadOnly);
			var status = basicsWorkflowVersionStatusToId[version.Status];
			if (status) {
				version.Image = 'cloud.style/content/images/control-icons.svg#' + 'ico-' + status.description;// Defect #107389 - Removed using of direct image references
			}
			return version;
		};

		service.getContextObj = function (key, value) {
			if (!key) {
				key = '';
			}

			var id = Math.floor((1 + Math.random()) * 0x10000);

			return {
				id: id,
				key: key,
				value: value
			};
		};

		function parseObjectToRow(obj, possibleProperties, converterFn) {
			var data = [];
			_.each(possibleProperties, function (prop) {
				data.push(converterFn(prop, obj[prop] ? obj[prop] : ''));
			});
			return data;
		}

		service.prepareActionTypeList = function prepareActionTypeList(list) {

			_.each(list, function (item) {
				if (item.key) {
					item.description = platformTranslateService.instant(item.key, null, true);
				}

			});
			return list;
		};

		return service;
	}

	angular.module('basics.workflow').factory('basicsWorkflowPreProcessorService', ['globals', 'moment', '_',
		'platformTranslateService', 'basicsWorkflowVersionStatusToId', 'platformModuleStateService',
		'platformPriorityIconService', 'basicsWorkflowUtilityService', 'basicsWorkflowDtoService', 'platformDataProcessExtensionHistoryCreator', 'platformRuntimeDataService', 'BasicsCommonDateProcessor', 'cloudDesktopCompanyService',
		PreProcessorService]);

})(angular);
