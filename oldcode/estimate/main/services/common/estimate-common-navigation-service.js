/**
 * Created by mov on 9/2/2016.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateCommonNavigationService
	 * @function
	 * @description
	 * estimateCommonNavigationService is the common rule services for estimate rule.
	 */
	angular.module(moduleName).factory('estimateCommonNavigationService', [
		'$timeout', '$injector', 'mainViewService', 'globals', '$http', 'platformModuleNavigationService',
		function ($timeout, $injector, mainViewService, globals, $http, platformModuleNavigationService) {
			let service = {};

			angular.extend(service, {
				navToRuleScript: navToRuleScript,
				showTargetContainer: showTargetContainer,
				navigateToAssembly: navigateToAssembly,
				navigateToAssemblyCategory: navigateToAssemblyCategory,
				navigateToBoq: navigateToBoq
			});

			return service;

			function navToRuleScript(ruleSelected, tabIdToGo, viewIdToGo, ruleViews, scriptEditorId) {
				let estTabIndex = null;

				if (tabIdToGo) {
					estTabIndex = _.findIndex(mainViewService.getTabs(), {'Id': tabIdToGo});
					if (estTabIndex > -1 && mainViewService.getActiveTab() !== estTabIndex) {
						$timeout(function () {
							mainViewService.setActiveTab(estTabIndex);
						}, 0);
					}
				}

				$timeout(function () {
					goToViewAndScriptEditor(mainViewService, ruleSelected, viewIdToGo, ruleViews, scriptEditorId);
				}, 0);
			}

			function goToViewAndScriptEditor(mainService, ruleSelected, viewIdToGo, ruleViews, scriptEditorId) {
				let applyConfig = false, config = mainService.getCurrentView().Config, estAddToContainer = null, estViews = [];
				let estView = viewIdToGo, estRulesViews = ruleViews;

				if (config) {
					let containers = angular.copy(config.subviews) || [];

					angular.forEach(containers, function (container, ci) {
						let views = angular.isArray(container.content) ? container.content : [container.content];
						return angular.forEach(views, function (view, vi) {
							if (view === estRulesViews[0] || view === estRulesViews[1]) {
								estViews.push(view);
								if (vi > 0) {
									let estRuleView = containers[ci].content[vi];
									config.subviews[ci].content.splice(vi, 1);
									config.subviews[ci].content.unshift(estRuleView);
									applyConfig = true;
								}
							}
							if (view === estView) {
								container.index = ci;
								estAddToContainer = container;
							}
						});
					});

					if (estViews.length !== 2) {
						addViewToContainer(config, estRulesViews, estViews, estAddToContainer);
						applyConfig = true;
					}
				}

				if (applyConfig) {
					mainService.applyConfig(config, false, false);
				}

				if (scriptEditorId) {
					navToEstRuleScriptLine(ruleSelected, scriptEditorId);
				}
			}

			function addViewToContainer(config, estRuleViews, estViews, addToContainer) {
				addToContainer = addToContainer || config.subviews[0];
				addToContainer.index = addToContainer.index || 0;

				angular.forEach(estRuleViews, function (view) {
					if (estViews.indexOf(view) === -1) {
						let container = config.subviews[addToContainer.index];
						config.subviews[addToContainer.index].content = angular.isArray(container.content) ? container.content : [container.content];
						config.subviews[addToContainer.index].content.unshift(view);
					}
				});
			}

			function navToEstRuleScriptLine(ruleSelected, scriptEditorId) {
				let line = ruleSelected.Line? ruleSelected.Line : 1;
				let column = ruleSelected.Column? ruleSelected.Column : 0;

				let cm = $injector.get('basicsCommonScriptEditorService').getCm(scriptEditorId);
				if (cm) {
					cm.scrollTo(line);
					// eslint-disable-next-line no-undef
					cm.setCursor(CodeMirror.Pos(line - 1, column));
					cm.focus();

				}else{
					$timeout(function(){ navToEstRuleScriptLine(ruleSelected, scriptEditorId); }, 700);
				}
			}

			/**
			 * @ngdoc function
			 * @name showTargetContainer
			 * @function
			 * @methodOf estimateCommonNavigationService
			 * @description
			 * This method shows container passed as parameter.
			 * If targetContainer is not in current active tab, it will find first tab that has selected container and activate it.
			 * If there are multiple containers in sub view and targetContainer is not selected by default,
			 *    it will set position of targetContainer to 1st in sub view, so it is visible by default. This is patch applied currently.
			 *    TODO: In future there should be better mechanism to select container from sub view, right now no method available to select container from sub view.
			 * If target container is found, method returns true, otherwise false.
			 * @param {String} targetContainer
			 * Pass 'id' property (not uuid) set in module-containers.json file in respective modules.
			 * @returns {boolean} returns true if container is found and set, false otherwise
			 */
			function showTargetContainer(targetContainer) {
				let tabList = mainViewService.getTabs();
				return _.some(tabList, function (tab, index) {
					if (_.isObject(tab.activeView) && _.isObject(tab.activeView.Config)) {
						let config = tab.activeView.Config;
						if (_.isArray(config.subviews)) {
							let isSubViewMatching = _.some(config.subviews, function (subView) {
								if (_.isObject(subView)) {
									let content = subView.content;
									if (_.isString(content) && targetContainer === content) {
										return true;
									} else if (_.isArray(content)) {
										let index = _.findIndex(content, function (item) {
											return item === targetContainer;
										});
										if (index >= 0) {
											if (index > 0) {
												content.splice(index, 1);
												content.unshift(targetContainer);
											}
											return true;
										}
									}
								}
								return false;
							});
							if (isSubViewMatching) {
								if (mainViewService.getActiveTab() !== index) {
									mainViewService.setActiveTab(index);
								}
								return true;
							}
						}
					}
					return false;
				});
			}

			function navigateToAssembly(option, entity) {
				if(option.triggerModule === 'estimate.assemblies') {
					if(option.targetIdProperty){
						navigate('estimate.assemblies-internal', entity, option.targetIdProperty);
					} else {
						navigate('estimate.assemblies-internal', entity, option.field);
					}
				}
				else {
					$http.get(globals.webApiBaseUrl + 'estimate/assemblies/getmasterassemblyid?assemblyId=' + entity[option.field]).then(function (result) {
						if(result.data === 0) {
							navigate('project.main-assembly', entity, option);
						}
						else {
							let entityCopy = angular.copy(entity);
							entityCopy.EstAssemblyFk = result.data;
							navigate('estimate.assemblies', entityCopy, option.field);
						}
					});
				}
			}

			function navigateToAssemblyCategory(entity, field) {
				$http.get(globals.webApiBaseUrl + 'estimate/assemblies/structure/isprojectassemblycat?categoryId=' + entity[field]).then(function (result) {
					if(result && result.data > 0) {
						let option = {
							ProjectFk: result.data,
							field: field
						};
						navigate('project.main-assembly.structure', entity, option);
					}
					else {
						$injector.get('estimateAssembliesAssembliesStructureService').navigateToAssemblyCategory(entity, field);
					}
				});
			}

			function navigate(navigatorName, entity, optionOrField) {
				let navigator = platformModuleNavigationService.getNavigator(navigatorName);
				platformModuleNavigationService.navigate(navigator, entity, optionOrField);
			}

			function navigateToBoq (item, triggerFieldOption){
				let boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
				if (boqRuleComplexLookupService) {
					boqRuleComplexLookupService.setNavFromBoqProject();
					$injector.get('boqMainService').setList([]);
					let estimateMainService = $injector.get('estimateMainService');
					if (estimateMainService) {
						estimateMainService.updateAndExecute(function () {
							let projectId = estimateMainService.getSelectedProjectId();
							boqRuleComplexLookupService.setProjectId(projectId);
							boqRuleComplexLookupService.loadLookupData().then(function () {
								triggerFieldOption.ProjectFk = projectId;
								triggerFieldOption.NavigatorFrom = _.isString(triggerFieldOption.NavigatorFrom) ? triggerFieldOption.NavigatorFrom : 'EstBoqItemNavigator';
								let compositeBoqItem = {
									Boq: {PrjProjectFk : projectId},
									BoqHeaderFk: item.BoqHeaderFk,
									BoqItemFk: item.Id
								}
								$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, compositeBoqItem, triggerFieldOption);
							});
						});
					}
				}
			}
		}
	]);
})(angular);
