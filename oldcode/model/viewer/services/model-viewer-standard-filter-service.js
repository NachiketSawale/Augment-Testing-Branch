/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerStandardFilterService
	 * @function
	 *
	 * @description Defines the hard-coded standard filters available for the 3D viewer.
	 */
	angular.module('model.viewer').factory('modelViewerStandardFilterService', ['_', '$q', '$injector',
		'modelViewerFilterDefinitionService', 'mainViewService', '$log', '$timeout',
		'modelMainProgressReportingService', 'modelViewerCompletionDegreeFilterService',
		function (_, $q, $injector, modelViewerFilterDefinitionService, mainViewService, $log, $timeout,
		          modelMainProgressReportingService, modelViewerCompletionDegreeFilterService) {

			function getModuleName() {
				var result = mainViewService.getCurrentModuleName();
				if (_.isEmpty(result)) {
					throw new Error('There is no opened module at this time.');
				}
				return result;
			}

			// DisabledFilter ----------------------------------------------------------------

			function DisabledFilter() {
				modelViewerFilterDefinitionService.Filter.call(this);
				this.isDisabledFilter = true;
			}

			DisabledFilter.prototype = Object.create(modelViewerFilterDefinitionService.Filter.prototype);
			DisabledFilter.prototype.constructor = DisabledFilter;

			DisabledFilter.prototype.getIconClass = function () {
				return 'control-icons ico-filter-off';
			};

			DisabledFilter.prototype.getDescriptors = function () {
				return [{
					type: 'disabled'
				}];
			};

			// ModuleSpecificLazyFilter ----------------------------------------------------------------

			function ModuleSpecificLazyFilter() {
				var that = this;
				modelViewerFilterDefinitionService.LazyFilter.call(this, function invokeModuleSpecificUpdate(resultController) {
					var moduleSpecificUpdateFunc = that._updateFuncsByModule[getModuleName()];
					if (_.isFunction(moduleSpecificUpdateFunc)) {
						return moduleSpecificUpdateFunc(resultController);
					} else {
						resultController.excludeAll();
						return $q.resolve();
					}
				});
				this._updateFuncsByModule = {};
			}

			ModuleSpecificLazyFilter.prototype = Object.create(modelViewerFilterDefinitionService.LazyFilter.prototype);
			ModuleSpecificLazyFilter.prototype.constructor = ModuleSpecificLazyFilter;

			ModuleSpecificLazyFilter.prototype.setUpdateFunc = function (updateFunc) {
				this._updateFuncsByModule[getModuleName()] = updateFunc;
			};

			ModuleSpecificLazyFilter.prototype.setUpdateFuncProviderName = function (name) {
				this._updateFuncsByModule[getModuleName()] = function invokeUpdateByName(resultController) {
					var updateFunc = $injector.get(name);
					if (!_.isFunction(updateFunc)) {
						throw new Error('Identifier ' + name + ' did not load a lazy model object filter function.');
					}
					return updateFunc(resultController);
				};
			};

			ModuleSpecificLazyFilter.prototype.isAvailableInCurrentModule = function () {
				var moduleSpecificUpdateFunc = this._updateFuncsByModule[getModuleName()];
				return _.isFunction(moduleSpecificUpdateFunc);
			};

			ModuleSpecificLazyFilter.prototype.getStateDescArguments = function () {
				return this.countByMeshState(true, true);
			};

			// service ----------------------------------------------------------------

			var service = {};

			var state = {
				defaultFilters: [],
				defaultFiltersById: {},
				moduleSpecificInfo: {}
			};

			function addDefaultFilter(id, filter) {
				filter.id = id;
				filter.translationKeyRoot = 'model.viewer.filters.' + id;
				state.defaultFilters.push(filter);
				state.defaultFiltersById[id] = filter;
				return filter;
			}

			addDefaultFilter('disabled', new DisabledFilter());

			addDefaultFilter('mainEntity', new ModuleSpecificLazyFilter());

			addDefaultFilter('objectSearchSidebar', _.assign(new modelViewerFilterDefinitionService.EagerFilter(), {
				isPending: false,
				getStateDescArguments: function () {
					return this.countByMeshState(true, true);
				}
			}));

			(function registerRulesetFilter() {
				var filterWrapper = _.assign(new modelViewerFilterDefinitionService.Filter(), {
					_userCount: 0,
					_innerFilter: null,
					registerUser: function () {
						this._userCount++;
						modelViewerFilterDefinitionService.Filter.prototype.registerUser.apply(this, arguments);
						if (this._userCount === 1) {
							this._innerFilter.registerUser(this.getUserFacade());
						}
					},
					unregisterUser: function () {
						this._userCount--;
						modelViewerFilterDefinitionService.Filter.prototype.unregisterUser.apply(this, arguments);
						if (this._userCount === 0) {
							this._innerFilter.unregisterUser(this.getUserFacade());
						}
					},
					usesDynamicHighlightingSchemes: function () {
						return this._innerFilter.usesDynamicHighlightingSchemes();
					},
					getHighlightingSchemeIds: function (defaultStaticHlSchemeId) {
						return this._innerFilter.getHighlightingSchemeIds(defaultStaticHlSchemeId);
					},
					prepareMeshStates: function () {
						return this._innerFilter.prepareMeshStates();
					},
					getMeshStates: function (includeIdMap) {
						return this._innerFilter.getMeshStates(includeIdMap);
					},
					dependsOnRuleset: function (rulesetId) {
						return this._innerFilter.dependsOnRuleset(rulesetId);
					},
					update: function () {
						return this._innerFilter.update();
					},
					getDescriptors: function () {
						return this._innerFilter.getDescriptors();
					},
					countByMeshState: function () {
						return this._innerFilter.countByMeshState.apply(this._innerFilter, arguments);
					},
					countByMeshInfoGroup: function () {
						return this._innerFilter.countByMeshInfoGroup.apply(this._innerFilter, arguments);
					},
					getByMeshInfoGroup: function () {
						return this._innerFilter.getByMeshInfoGroup.apply(this._innerFilter, arguments);
					}
				});

				function setInnerFilter(newFilter) {
					var that = this; // jshint ignore:line

					if (newFilter !== that._innerFilter) {
						if (that._userCount > 0) {
							var userFacade = that.getUserFacade();
							if (that._innerFilter) {
								that._innerFilter.unregisterUser(userFacade);
							}
							if (newFilter) {
								newFilter.registerUser(userFacade);
							}
						}
						that._innerFilter = newFilter;
						that.update();
					}
				}

				var modelEvaluationRulesetDataService = null;
				var modelEvaluationRulesetFilterService = null;

				function updateRulesetSelection() {
					var newInnerFilter = null;

					var selRuleset = modelEvaluationRulesetDataService.getSelected();
					if (selRuleset) {
						if (!modelEvaluationRulesetFilterService) {
							modelEvaluationRulesetFilterService = $injector.get('modelEvaluationRulesetFilterService');
						}
						newInnerFilter = modelEvaluationRulesetFilterService.getFilter(_.isNumber(selRuleset.ModelRulesetSuperFk) ? selRuleset.ModelRulesetSuperFk : selRuleset.Id, selRuleset.HighlightingSchemeFk);
					} else {
						newInnerFilter = new DisabledFilter();
					}

					setInnerFilter.call(filterWrapper, newInnerFilter);
				}

				$timeout(function () {
					if (!modelEvaluationRulesetDataService) {
						modelEvaluationRulesetDataService = $injector.get('modelEvaluationRulesetDataService');
					}
					modelEvaluationRulesetDataService.registerSelectionChanged(updateRulesetSelection);
					updateRulesetSelection();
				});

				addDefaultFilter('ruleset', filterWrapper);
			})();

			addDefaultFilter('reportedProgress', new modelMainProgressReportingService.ReportedProgressFilter());
			addDefaultFilter('completionDegree', new modelViewerCompletionDegreeFilterService.CompletionDegreeFilter());

			service.getFilterById = function (id, moduleSpecific) {
				if (moduleSpecific) {
					return _.find(service.getFiltersForCurrentModule(), function (f) {
						return f.id === id;
					});
				} else {
					return state.defaultFiltersById[id];
				}
			};

			service.setModuleSpecificFilterProvider = function (providerFunc) {
				state.moduleSpecificInfo[getModuleName()] = providerFunc;
			};

			service.setModuleSpecificFilterProviderName = function (name) {
				state.moduleSpecificInfo[getModuleName()] = function invokeFilterProviderByName() {
					var providerFunc = $injector.get(name);
					if (!_.isFunction(providerFunc)) {
						throw new Error('Identifier ' + name + ' did not load a module-specific filter provider function.');
					}
					state.moduleSpecificInfo[getModuleName()] = providerFunc;
					return providerFunc();
				};
			};

			service.getFiltersForCurrentModule = function () {
				var result = _.filter(state.defaultFilters, function (f) {
					if (_.isFunction(f.isAvailableInCurrentModule)) {
						return f.isAvailableInCurrentModule();
					} else {
						return true;
					}
				});

				var moduleSpecificProviderFunc = state.moduleSpecificInfo[getModuleName()];
				if (_.isFunction(moduleSpecificProviderFunc)) {
					var additionalFilters = moduleSpecificProviderFunc();
					if (_.isArray(additionalFilters)) {
						result.push.apply(result, additionalFilters);
					} else if (_.isObject(additionalFilters)) {
						result.push(additionalFilters);
					}
				}

				return result;
			};

			service.updateMainEntityFilter = function () {
				return service.getFilterById('mainEntity').update();
			};

			var lastChangedSelections = {
				byModule: {},
				addServiceName: function (serviceName) {
					var moduleList = this.byModule[getModuleName()];
					if (!moduleList) {
						moduleList = this.byModule[getModuleName()] = [];
					}

					var oldIdx = moduleList.indexOf(serviceName);
					if (oldIdx >= 0) {
						moduleList.splice(oldIdx, 1);
					}

					moduleList.unshift(serviceName);
				},
				getServiceNames: function () {
					var moduleList = this.byModule[getModuleName()];
					return _.isArray(moduleList) ? moduleList : [];
				}
			};

			var dataServiceAttachments = {};

			service.attachMainEntityFilter = function (scope, dataService) {
				var ds = _.isString(dataService) ? $injector.get(dataService) : dataService;
				if (_.isNil(ds)) {
					$log.warn('Failed to attach model main entity filter to data service, as data service reference was empty.');
					return;
				}

				var dsName = ds.getServiceName();
				if (!_.isString(dsName)) {
					throw new Error('A data service passed to attachMainEntityFilter does not return a valid name.');
				}

				var dsa = dataServiceAttachments[dsName];
				if (!_.isObject(dsa)) {
					dsa = dataServiceAttachments[dsName] = {
						count: 0,
						fn: function () {
							lastChangedSelections.addServiceName(dsName);
							service.updateMainEntityFilter();
						}
					};
					Object.defineProperty(dsa.fn, 'name', {
						value: 'updateMainEntityFilter_for_' + dsName
					});
				}
				dsa.count++;
				if (dsa.count === 1) {
					service.updateMainEntityFilter();
					ds.registerSelectedEntitiesChanged(dsa.fn);
				}

				scope.$on('$destroy', function () {
					dsa.count--;
					if (dsa.count <= 0) {
						ds.unregisterSelectedEntitiesChanged(dsa.fn);
						dsa.count = 0;
					}
				});
			};

			service.orderServiceNamesByLastSelectionChange = function (items, getServiceName) {
				if (_.isNil(getServiceName)) {
					getServiceName = _.identity;
				}

				var svcNames = lastChangedSelections.getServiceNames();

				return _.map(_.orderBy(_.filter(_.map(items, function createItemInfo(item, index) {
					return {
						item: item,
						svcName: getServiceName(item),
						originalIndex: index
					};
				}), function isItemActive(item) {
					var dsa = dataServiceAttachments[item.svcName];
					return _.isObject(dsa) ? dsa.count > 0 : false;
				}), function getItemOrder(item) {
					var sortedIdx = svcNames.indexOf(item.svcName);
					if (sortedIdx >= 0) {
						return sortedIdx;
					} else {
						return svcNames.length + item.originalIndex;
					}
				}), function reduceToItem(item) {
					return item.item;
				});
			};

			return service;
		}]);
})(angular);
