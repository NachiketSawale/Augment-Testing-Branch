/**
 *
 * Created by balkanci on 19.03.2015.
 */
(function (angular) {
		'use strict';

		angular.module('platform').directive('genericWizardDirective', control);

		control.$inject = ['_', '$', '$compile', 'genericWizardContainerLayoutService', 'WizardHandler', 'platformDataValidationService', '$injector', '$timeout', '$rootScope', '$templateCache', '$log', 'genericWizardService', '$q', 'genericWizardCharacteristicsService', 'platformObjectHelper', 'basicsLookupDataContainerListService', '$translate', 'genericWizardErrorService'];

		function control(_, $, $compile, layoutService, wizardHandler, validationService, $injector, $timeout, $rootScope, $templateCache, $log, wizardService, $q, characteristicsService, platformObjectHelper, basicsLookupDataContainerListService, $translate, genericWizardErrorService) {
			return {
				restrict: 'AE',
				scope: {
					wizardConfig: '=',
					modalOptions: '=',
					stepInfo: '='
				},
				link: function ($scope, elem) {

					$scope.stepBefore = null;
					var unregisterFinish;
					var unregisterCreated;

					$templateCache.put('wizard-rib.html',
						'<div class="modal-wrapper">' +
						'<div class="flex-element two-side-row-1">' +
						'<div data-ng-controller="infoBarController" class="left margin-full-md overflow">' +
						'<info-bar-directive config="config" go-to="goTo"></info-bar-directive>' +
						'</div>' +
						'<div class="right margin-full-md overflow">' +
						'<scroll-tabs-directive tabs="steps" click-function="goTo" options="wizardConfig.tabOptions"></scroll-tabs-directive>' +
						'<div class="steps modal-wrapper" style="height: calc( 100% - 36px ); overflow-y: hidden" data-ng-transclude></div>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'');

					function getStepById(stepId) {
						return wizardService.getStepById(stepId);
					}

					function getDataServiceFromContainer(ctn) {
						var info = layoutService.getContainerLayoutByContainerId(ctn.Id);
						return info.ctnrInfo.dataServiceName ? $injector.get(info.ctnrInfo.dataServiceName) : info.ctnrInfo.dataServiceProvider();
					}

					function evalStepScript(script) {
						var result;
						try {
							var dataServiceNames = wizardService.getAllDataServiceNames();
							var injectorString = '';
							var entityString = '';
							_.each(dataServiceNames, function (serviceName) {
								var service = $injector.get(serviceName);
								if (serviceName.getItemName) {
									injectorString += 'var ' + serviceName + ' = $injector.get("' + serviceName + '");';
									entityString += 'var ' + service.getItemName() + ' = ' + serviceName + '.getSelected();';
								}
							});
							var workflowString = 'function startWorkflow(workFlowId, entityId, context)' +
								'{' +
								' var service = $injector.get("basicsWorkflowInstanceService");' +
								' service.startWorkflow(workFlowId, entityId, context);' +
								'}';
							var executionString = '"use strict";' + injectorString + entityString + workflowString + script.ScriptAction;

							result = new Function('$injector', executionString)($injector);// jshint ignore:line
						} catch (e) {
							console.log('Error in Generic Wizard Script:' + '\n\r' + JSON.stringify(script), e);
							result = true;
						}
						return result;
					}

					function getCurrentStep() {
						var step = getCurrentWzStep();
						if (step) {
							var stepId = step.wzData;
							return getStepById(stepId);
						}
					}

					function getCurrentWzStep() {
						var stepController = wizardService.getWizardController();
						if (stepController) {
							return stepController.currentStep();
						}
					}

					$scope.getNextStep = function getNextStep(titleOnly) {
						var stepController = wizardService.getWizardController();
						var nextStep = stepController.getEnabledSteps()[stepController.currentStepNumber()];
						if (nextStep) {
							if (titleOnly) {
								return nextStep ? nextStep.title : 'Finish';
							} else {
								return getStepById(nextStep.wzData);
							}
						}
					};

					$scope.getPreviousStep = function getPreviousStep() {
						var stepController = wizardService.getWizardController();
						var previousStep = stepController.getEnabledSteps()[stepController.currentStepNumber() - 1];
						return getStepById(previousStep.wzData);
					};

					function getScriptsByTypeId(scriptList, typeId) {
						return _.filter(scriptList, {'GenericWizardScriptTypeFk': typeId});
					}

					function processScripts(scripts) {
						var result = false;
						_.each(scripts, function each(script) {
							var bool = evalStepScript(script);
							// only assign real bools not undefined when script crashs
							if (_.isBoolean(bool)) {
								result = bool;
								if (bool === false) {
									return false;
								}
							}
						});
						return result;
					}

					function processScriptsWithMessage(scripts) {
						var exitPossible = true;
						_.each(scripts, function (script) {
							var result = evalStepScript(script);
							if (_.isObject(result) && result.valid === false) {
								addMessage(result.message);
								exitPossible = result.valid;
							}
							if (_.isBoolean(result) && result === false) {
								exitPossible = result;
							}
						});
						return exitPossible;
					}

					$scope.canExit = function canExit(/** context */) {
						var defer = $q.defer();
						clearMessages();
						var exitPossible = true;
						// execute canExit script  here
						var currentStepConfig = getCurrentStep();

						var canExitScripts = getScriptsByTypeId(currentStepConfig.Scripts, 2);
						// validation scripts need to supply a special result object, to display information about the fields etc..
						var validationScripts = getScriptsByTypeId(currentStepConfig.Scripts, 3);
						var optionalValidationScripts = getScriptsByTypeId(currentStepConfig.Scripts, 4);

						if (!exitPossible) {
							addMessage('Please correct the Validation Errors');
						}

						// validationScripts can prevent from exiting
						if (!_.isEmpty(validationScripts) && exitPossible) {
							exitPossible = processScriptsWithMessage(validationScripts);
						}

						// canExitScript can prevent from exiting
						if (!_.isEmpty(canExitScripts) && exitPossible) {
							exitPossible = processScriptsWithMessage(canExitScripts);
						}

						// optionalValidation do not prevent from exiting a step
						if (!_.isEmpty(optionalValidationScripts) && exitPossible) {
							_.each(optionalValidationScripts, function (script) {
								var result = evalStepScript(script);
								// only messages from resultObjects with valid.false are shown
								if (_.isObject(result) && result.valid === false && result.message) {
									addMessage(result.message);
								}
							});
						}
						if (exitPossible) {
							$scope.stepBefore = currentStepConfig;
						}

						defer.resolve(exitPossible);

						return defer.promise;
					};

					unregisterCreated = $rootScope.$on('onEntityCreated', function () {
						$scope.beforeEnter(getCurrentStep());
					});

					$scope.beforeEnter = function (step) {
						var beforeEnterScripts = getScriptsByTypeId(step.Scripts, 5);
						if (!_.isEmpty(beforeEnterScripts)) {
							// before enterScripts dont need to return a bool, they are for defaulting of the future Step
							processScripts(beforeEnterScripts);
						}
					};

					$scope.canEnter = function canEnter(destinationStep, isFirstStep) {
						isFirstStep = _.isBoolean(isFirstStep) && isFirstStep === true;

						var futureStep = isFirstStep ? getCurrentStep() : getStepById(destinationStep.wzData);

						if (!futureStep) {
							futureStep = $scope.getPreviousStep();
						}
						// angular wizard doesnt call canEnter for the first Step, so we need to do it by our self
						if (isFirstStep) {
							futureStep = getCurrentStep();
						}

						var enterPossible = true;

						var canEnterScripts = getScriptsByTypeId(futureStep.Scripts, 1);

						if (!_.isEmpty(canEnterScripts)) {
							enterPossible = processScripts(canEnterScripts);
						}

						var ctr = wizardService.getWizardController();
						var steps = ctr.getEnabledSteps();
						for (var i = 0; i < steps.length; i++) {
							var step = steps[i];
							step.completed = true;
						}

						$scope.beforeEnter(futureStep);

						// when enter is not possible, go to the step after next
						if (!enterPossible && !isFirstStep) {

							// var ctr = wizardService.getWizardController();

							var index = _.findIndex(ctr.getEnabledSteps(), function (step) {
								return step.title === futureStep.Instance.Title;
							});
							var newIndex = index + 1;
							var wzStep = ctr.getEnabledSteps()[index];
							wzStep.denied = true;
							wzStep.completed = 'true';
							ctr.goTo(newIndex);
						}

						wizardService.updateStepInfo($scope);

						return enterPossible;
					};

					$scope.finishWizard = function finishWizard(e, args) {
						if ($scope.canExit()) {
							// update with the dataService from the first step
							$scope.loading = true;
							var wzStep = getCurrentWzStep();
							wzStep.completed = true;
							$scope.loading = false;
							$scope.ok(e, args);
						}
					};

					$scope.cancelDialog = function cancelDialog(e, data) {
						$scope.ok(null, _.extend({close: true}, data));
					};

					unregisterFinish = $rootScope.$on('wz-finish', $scope.cancelDialog);

					$scope.ok = function ok(e, data) {
						var task = $scope.wizardConfig.task ? $scope.wizardConfig.task : {};
						var outputKey = 'Context';
						task.output = task.Output ? task.Output : task.output;
						var result = _.find(task.output, {key: outputKey});
						if (result && result.value) {
							task.Context = task.Context !== '' ? task.Context : {};
							_.set(task.Context, result.value, data);
						}
						// for wf debug
						$scope.modalOptions.ok({
							data: {
								result: JSON.stringify(data),
								task: task,
								context: task.Context
							}
						});
					};

					function getModuleFk(wizardInstance, containerConfig) {
						var moduleFk = wizardInstance.ModuleFk;
						var useCaseConfigService = $injector.get('genericWizardUseCaseConfigService');
						var uuid = wizardInstance.WizardConfiGuuid;
						if (useCaseConfigService.isUseCaseWizard(uuid)) {
							moduleFk = useCaseConfigService.getModuleFromContainerUuid(uuid, containerConfig.ContainerUuid);
						}
						return moduleFk;
					}

					function createWzContainer(ctn, wizardConfig) {
						var uuid = wizardConfig.Instance.WizardConfiGuuid;
						var useCaseConfigService = $injector.get('genericWizardUseCaseConfigService');
						var containerUseCaseConfig = useCaseConfigService.getUseCaseContainer(uuid, ctn.ContainerUuid);
						var controller = containerUseCaseConfig.controller ? containerUseCaseConfig.controller : 'genericWizardContainerController';
						var startEntityId = wizardConfig[wizardConfig.startEntity];
						var container = $('<div start-entity-id=' + startEntityId + ' config-uuid="' + uuid + '" container-id="' + ctn.Id + '" modulefk="' + getModuleFk(wizardConfig.Instance, ctn) + '" ng-controller ="' + controller + '" class="modal-wrapper"></div>');
						var loadingLayer = createLoadingLayer();
						container.append(loadingLayer);
						/** ctn.CanInsert **/
						if (containerUseCaseConfig.isDocumentContainer || containerUseCaseConfig.isSelectionContainer) {
							container.append(createToolbar());
						}

						var containerInfo = basicsLookupDataContainerListService.getItemById(getModuleFk(wizardConfig.Instance, ctn), ctn.ContainerUuid);
						container.prepend(createContainerHeader(containerInfo, ctn));
						return container;
					}

					function createContainerHeader(containerInfo, ctn) {
						var title = ctn.TitleInfo ? ctn.TitleInfo.Translated ? ctn.TitleInfo.Translated : ctn.TitleInfo.Description ? ctn.TitleInfo.Description : null : null;
						title ??= $translate.instant(containerInfo.title);
						return $('<h1>' + title + '</h1>');
					}

					function createLoadingLayer() {
						return $('<div data-cloud-common-overlay data-loading="loading"></div>');
					}

					function createWzContainerCharacteristics(ctn, wizardConfig) {
						var moduleFk = getModuleFk(wizardConfig.Instance, ctn);
						var service = getDataServiceFromContainer(ctn);
						if (!_.isObject(service)) {
							service = $injector.get(service);
						}
						if (ctn.FilearchivedocFk && ctn.ContainerUuid) {
							var container = $('<div data-doc-id="' + ctn.FilearchivedocFk + '" data-module-fk="' + moduleFk + '" data-ctn-id="' + ctn.Id + '" data-ng-controller ="genericWizardCharacteristicsContainerController" class="modal-wrapper characteristics-container"></div>');
							var loadingLayer = createLoadingLayer();
							container.append(loadingLayer);
							return container;
						}
						throw new Error('Container or HTML Template not set for Characteristics-Container');
					}

					function createCharacteristicsCtn(ctn, wizardConfig) {
						var container = createWzContainerCharacteristics(ctn, wizardConfig);
						var editor = $('<div data-characteristics-html-editor data-in-progress="loading"  class="margin-full-md overflow" data-ctn-id="ctnId" data-doc-id="docId" data-module-fk="moduleFk"></div>');
						return container.append(editor);
					}

					function createGrid(ctn, wizardConfig) {
						var container = createWzContainer(ctn, wizardConfig);
						var grid = $('<div class="grid-wrapper modal-wrapper subview-container"><platform-grid  ng-if="gridData" class="wizardGrid" data="gridData"></platform-grid></div>');
						return container.append(grid);
					}

					function createForm(ctn, wizardConfig) {
						var container = createWzContainer(ctn, wizardConfig);
						var form = $('<div data-ng-if="formConfig" class="wizardForm overflow" data-platform-form data-form-options="formConfig" data-entity="dataItem"></div>');
						return container.append(form);
					}

					function createChart(ctn, wizardConfig) {
						var container = createWzContainer(ctn, wizardConfig);
						var module = getModuleFk(wizardConfig.Instance, ctn);
						var containerInfo = basicsLookupDataContainerListService.getItemById(module, ctn.ContainerUuid);
						var chartTemplate = $('<div/>');

						chartTemplate.attr('ng-controller', containerInfo.controller);
						chartTemplate.attr('ng-include', '\'' + containerInfo.template + '\'');
						chartTemplate.addClass('subview-content');
						chartTemplate.css({height: '100%', width: '100%'});
						var loadingLayer = createLoadingLayer();
						container.append(loadingLayer);
						container.append(chartTemplate);
						return container;
					}

					function createToolbar() {
						return $('<div class="toolbar"><div data-platform-menu-list data-list="tools" data-platform-refresh-on="tools.version"></div></div>');
					}

					function createMessageBox() {
						return $('<ul class="message-box alert-danger hide"></ul>');
					}

					function addMessage(message) {
						if (message) {
							var messageClasses = 'invalid-cell';
							$('.message-box').removeClass('hide').append($('<li>' + message + '</li>').addClass(messageClasses));
						}
					}

					function clearMessages() {
						$('.message-box').html('').addClass('hide');
					}

					function createInfoText(text) {
						if (!_.isEmpty(text)) {
							return $('<span>' + text + '</span>').addClass('margin-bottom-ld');
						}
					}

					function createStepErrorBox(stepIndex) {
						return $('<div class="alert-danger" data-ng-if="$parent.wizardConfig.Steps[' + stepIndex + '].errorMessageList.length !== 0"><div class="tlb-icons ico-error" data-ng-repeat="message in $parent.wizardConfig.Steps[' + stepIndex + '].errorMessageList" style="padding: 2px 0 0 18px; background-position: 3px; background-size: 10px">{{message.text}}</div></div>');
					}

					function createStepWarningBox(stepIndex) {
						return $('<div class="alert-warning" data-ng-if="$parent.wizardConfig.Steps[' + stepIndex + '].warningMessageList.length !== 0"><div class="tlb-icons ico-warning" data-ng-repeat="message in $parent.wizardConfig.Steps[' + stepIndex + '].warningMessageList" style="padding: 2px 0 0 18px; background-position: 3px; background-size: 10px">{{message.text}}</div></div>');
					}

					$scope.messageList = genericWizardErrorService.getAllMessages();

					function setMessageListWatch() {
						$scope.$watch(function () {
							return $scope.messageList;
						}, function (newVal) {
							var steps = $scope.wizardConfig.Steps;
							_.forEach(steps, function (step) {
								if (!_.isEmpty(newVal)) {
									step.errorMessageList = genericWizardErrorService.getErrorMessageListForStep(step.Container);
									step.warningMessageList = genericWizardErrorService.getWarningMessageListForStep(step.Container);
								} else {
									step.errorMessageList = [];
									step.warningMessageList = [];
								}
							});
						}, true);
					}

					function createContainer(container, wizardConfig) {
						var ctn = container.Instance;
						var wzContainer = $('<div>');
						var info = layoutService.getContainerLayoutByContainerId(ctn.Id);
						var isGrid = info && info.ctnrInfo.ContainerType.toLowerCase() === 'grid';
						var isChart = info && info.ctnrInfo.ContainerType.toLowerCase() === 'chart';
						var viewComponent = ctn.FilearchivedocFk ? createCharacteristicsCtn(ctn, wizardConfig) : isGrid ? createGrid(ctn, wizardConfig) : isChart ? createChart(ctn, wizardConfig) : createForm(ctn, wizardConfig);
						wzContainer.append(viewComponent).addClass('margin-bottom-ld modal-wrapper');
						return wzContainer;
					}

					function createStep(step, wizardConfig) {
						var wzStep = $('<wz-step>')
							.attr('wz-title', step.Instance.TitleInfo.Translated || step.Instance.TitleInfo.Description)
							.attr('canexit', 'canExit')
							.attr('data-step-id', step.Instance.Id)
							.attr('canenter', 'canEnter')
							.attr('wz-data', step.Instance.Id)
							.attr('wz-disabled', step.Instance.IsHidden)
							.addClass('modal-wrapper');

						var stepIndex = _.findIndex(wizardConfig.Steps, function (stp) {
							return stp.Instance.Id === step.Instance.Id;
						});

						wzStep.append(createStepErrorBox(stepIndex));
						wzStep.append(createStepWarningBox(stepIndex));
						wzStep.append(createMessageBox());
						wzStep.append(createInfoText(step.Instance.TextHeader));

						if (step.Container.length > 1) {
							var splittedStep = createSplittedContainer(step.Container, wizardConfig);
							wzStep.append(splittedStep);
						} else {
							var ctn = createContainer(step.Container[0], wizardConfig);
							wzStep.append(ctn);
						}

						wzStep.append(createInfoText(step.Instance.TextFooter));

						return wzStep;
					}

					$scope.$watch('wizardConfig', function (newValue) {
						if (newValue) {
							$scope.wizardConfig = newValue;
							if (!platformObjectHelper.isSet($scope.wizardConfig.tabOptions)) {
								setTabOptions();
							}

							renderWizard(newValue);
							wizardService.updateStepInfo($scope);
							setMessageListWatch();
						}
					});

					function areContainerHidden(containerList) {
						var containerHidden = false;
						_.each(containerList, function (container) {
							var hideFn = container.Instance.hide;
							if (_.isFunction(hideFn)) {
								containerHidden = hideFn($scope.wizardConfig);
								if (containerHidden) {
									return false;
								}
							}
						});
						return containerHidden;
					}

					function setTabOptions() {
						$scope.wizardConfig.tabOptions = {
							displayNameProperty: 'title',
							showTitle: true,
							tabMaxWidth: 150,
							hideTab: function (tab) {
								var step = wizardService.getStepById(tab.wzData);
								var containerHidden = areContainerHidden(step.Container);
								return step.Instance.IsHidden || containerHidden;
							},
							initialTabIndex: 0
						};
					}

					function createSplittedContainer(containerList, wizardConfig) {
						containerList = _.sortBy(containerList, 'Instance.Sorting');
						var kendo = $($templateCache.get('clouddesktop-kendo.html'));
						var leftContainer = createContainer(containerList[0], wizardConfig);
						var rightContainer = createContainer(containerList[1], wizardConfig);
						$(kendo.find('.genWizContainerLeft')).replaceWith(leftContainer);
						$(kendo.find('.genWizContainerRight')).replaceWith(rightContainer);
						return $(kendo);
					}

					function translateButtons(wizardConfig) {
						_.each(wizardConfig.wizardButtons, function (button) {
							button.titleTranslated = $translate.instant(button.title);
						});
					}

					function renderWizard(wizardConfig) {
						translateButtons($scope.wizardConfig);
						var wizard = $('<wizard>').attr('on-finish', 'finishWizard()').attr('get-next-step', 'getNextStep').attr('wizard-config', 'wizardConfig').attr('template', 'wizard-rib.html').attr('name', wizardConfig.Instance.Id).attr('edit-mode', true);

						var steps = _.sortBy(wizardConfig.Steps, function (step) {
							return step.Instance.Sorting;
						});
						wizard.append(createMessageBox());
						_.each(steps, function (step) {
							var stepElement = createStep(step, wizardConfig);
							stepElement.append($('<div>').addClass('button-wrapper-div'));
							wizard.append(stepElement);
						});

						var linkFn = $compile(wizard);
						var content = linkFn($scope);
						elem.replaceWith(content);

						// call canEnter of the first step in timeout otherwise wizardHandler is not ready
						$timeout(function () {
							if (!$scope.canEnter(null, true)) {
								$scope.cancelDialog();
								$log.info('Scripts prevent Wizard from being opened');
							}
						}, 0);
					}

					$scope.$on('$destroy', function () {
						if (unregisterFinish) {
							unregisterFinish();
						}
						if (unregisterCreated) {
							unregisterCreated();
						}
						genericWizardErrorService.resetMessageList();
					});
				}
			};
		}
	}

)(angular);
