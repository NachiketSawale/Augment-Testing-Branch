/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

((angular, Platform, _) => {
	'use strict';

	const LOAD_FAILED = 0;

	/**
	 * @type {{moduleName: string, resolve: {}, templateFileUrl: string, controller: string, onDestroy: Array}}
	 */
	const defaultModuleOptions = {
		'moduleName': '',
		'resolve': {},
		'templateFileUrl': '',
		'controller': '',
		'onDestroy': []
	};

	/**
	 * @type {{serviceUrl: string, homeState: string}}
	 */
	const defaultConfig = {
		'serviceUrl': 'basics/layout',
		'homeState': 'desktop'
	};

	let applyingConfig = false;
	let currentModule = null,
		defaultLayoutConfig = null,
		activeTab = 0,
		previousTab = 0,
		globalResolves = null,
		viewChange = false;

	const registeredModuleOptions = {};
	let activeTabIndex = 0;

	/**
	 *
	 * @param json
	 * @returns {boolean}
	 */
	function checkJSON(json) {
		try {
			JSON.parse(json);
		} catch (e) {
			return false;
		}
		return true;
	}

	/**
	 *
	 * @param viewConfig
	 * @returns {*}
	 */
	function serializeConfig(viewConfig) {
		let config = _.cloneDeep(viewConfig);
		config.splitterDef = JSON.stringify(config.splitterDef);
		config.subviews = JSON.stringify(config.subviews);
		config = JSON.stringify(config);
		return config;
	}

	/**
	 *
	 * @param viewConfig
	 * @returns {*}
	 */
	function deserializeConfig(viewConfig) {
		let config = _.cloneDeep(viewConfig);

		config = JSON.parse(config);
		config.splitterDef = JSON.parse(config.splitterDef);

		// validate pane sizes - must be not more than 100%
		_.each(config.splitterDef, function (splitterDef) {
			if (splitterDef.panes.length) {
				const sum = _.sumBy(splitterDef.panes, function (pane) {
					if (!pane.collapsed) {
						return parseFloat(pane.size);
					}
				});

				if (sum > 100.1) {
					// reset panes to default values
					const size = (100.0 / splitterDef.panes.length).toString() + '%';

					_.each(splitterDef.panes, function (pane) {
						pane.size = size;
					});
				}
			}
		});

		if (angular.isString(config.subviews)) {
			config.subviews = JSON.parse(config.subviews);
		}
		return config;
	}

	// noinspection FunctionTooLongJS,FunctionWithMoreThanThreeNegationsJS
	/**
	 *
	 * @param $rootScope
	 * @param $state
	 * @param $http
	 * @param $q
	 * @param $injector
	 * @param globals
	 * @param $
	 * @param $log
	 * @param platformContextService
	 * @returns {{}}
	 * @constructor
	 */
	let MainViewService = function ($rootScope, $state, $http, $q, $injector, globals, $, $log, platformContextService) {
		let service = {};

		// Layout System Events.
		let splitterMoved = new Platform.Messenger();
		let tabChangedEvent = new Platform.Messenger();
		let viewChangedEvent = new Platform.Messenger();
		let newLayoutAdded = new Platform.Messenger();
		let tabStatusChanged = new Platform.Messenger();
		let layoutEdited = new Platform.Messenger();
		let layoutChanged = new Platform.Messenger();
		let _currentSelected = null;

		/**
		 *
		 * @param index
		 */
		function reloadByIndex(index) {
			const tabId = currentModule.tabs[index].Id;
			reload(tabId, false);
		}

		/**
		 *
		 * @param tabId
		 */
		function reload(tabId) {
			const viewId = currentModule.tabs[activeTab].activeView.original ? currentModule.tabs[activeTab].activeView.original.id : currentModule.tabs[activeTab].activeView.Id;
			$state.transitionTo($state.current.name, {tab: tabId, view: viewId}, {
				location: 'replace',
				notify: true
			});
		}

		let counter = 1;

		/**
		 *
		 * @param viewObj
		 */
		function applyViewTemplate(viewObj) {
			const latest = getActiveView();

			if (!latest) {
				return;
			}

			if (!latest.$$id) {
				latest.$$id = counter++;
			}

			latest.Config = _.cloneDeep(viewObj.Config);
			latest.ModuleTabViewOriginFk = viewObj.Id;

			// merge config into latest and reset config when configuration not available in template
			_.forEach(_.map(latest.Config.subviews, 'content'), function (content) {
				_.forEach(_.isArray(content) ? content : [content], function (id) {
					const container = _.find(currentModule.containers, ['id', id]);

					if (container) {
						setConfigProps(container, viewObj, latest);

						if (container.subcontainers) {
							_.forEach(container.subcontainers, function (subcontainer) {
								setConfigProps(subcontainer, viewObj, latest);
							});
						}
					}
				});
			});

			// set version to 0
			_.forEach(latest.ModuleTabViewConfigEntities, function (config) {
				config.Version = 0;
			});

			currentModule.tabs[activeTab].activeView = latest;
			(_.find(currentModule.tabs[activeTab].Views, ['Id', latest.Id]) || {}).ModuleTabViewOriginFk = viewObj.Id;
		}

		function setConfigProps(container, viewObj, latest) {
			let nConfig = _.filter(viewObj.ModuleTabViewConfigEntities, function (x) {
				return x.Guid.toLowerCase() === container.uuid.toLowerCase();
			});
			const newConfig = nConfig && nConfig.length > 0 ? nConfig[0] : null;
			let oConfig = _.filter(latest.ModuleTabViewConfigEntities, function (x) {
				return x.Guid.toLowerCase() === container.uuid.toLowerCase();
			});
			const config = oConfig && oConfig.length > 0 ? oConfig[0] : null;

			if (config && newConfig) {
				config.Gridconfig = newConfig.Gridconfig;
				config.Propertyconfig = newConfig.Propertyconfig;
				config.Viewdata = newConfig.Viewdata;
			} else if (config) {
				config.Gridconfig = null;
				config.Propertyconfig = null;
				config.Viewdata = null;
			} else if (newConfig) {
				latest.ModuleTabViewConfigEntities.push({
					BasModuletabviewFk: latest.Id,
					Gridconfig: newConfig.Gridconfig,
					Guid: container.uuid,
					ModuletabviewEntity: null,
					Propertyconfig: newConfig.Propertyconfig,
					Viewdata: newConfig.Viewdata
				});
			} else {
				latest.ModuleTabViewConfigEntities.push({
					BasModuletabviewFk: latest.Id,
					Gridconfig: null,
					Guid: container.uuid,
					ModuletabviewEntity: null,
					Propertyconfig: null,
					Viewdata: null
				});
			}
		}

		/**
		 *
		 * @returns {activeView|*}
		 */
		function getActiveView() {
			const activeView = _.get(currentModule, 'tabs[' + activeTab + '].activeView');

			if (!activeView) {
				console.warn('activeView is null!');
			}
			return activeView;
		}

		/**
		 * @ngdoc function
		 * @name initService
		 * @function
		 * @description Wires up ui-router events.
		 */
		function initService() {
			$rootScope.$on('$stateChangeStart', function (e, toState) {
				if (!(_.isNull(currentModule))) {
					if (toState.isDesktop) {
						service.saveview(null, null, true);
					}
					// noinspection JSUnresolvedVariable
					if (toState.name !== currentModule.state) {

						try {
							if (currentModule.scope) {
								currentModule.scope.$destroy();
							}
							currentModule = null;
							activeTab = previousTab = 0;
							applyingConfig = false;
							const args = {
								fromTab: previousTab,
								toTab: activeTab
							};
							tabChangedEvent.fire(e, args);
						} catch (e) { // jshint ignore:line
							currentModule = null;
							activeTab = previousTab = 0;
							applyingConfig = false;
						}
					}
				}
			});

			$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
				// noinspection JSUnresolvedVariable
				if (toParams.tab && (toParams.tab !== fromParams.tab)) {
					const args = {
						fromTab: previousTab,
						toTab: activeTab
					};
					tabChangedEvent.fire(e, args);
				}
				if (applyingConfig) {
					applyingConfig = false;
				}
			});

			window.onhashchange = function () {
				$rootScope.$apply();
			};
		}

		/**
		 * @ngdoc function
		 * @name registerListener
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description register an event listener for an event.
		 * @param {String} eventName name - of the module.
		 * @param {function} fn - contains the resolve functions for the module state transition.
		 *
		 */
		service.registerListener = function registerListener(eventName, fn) {
			switch (eventName) {
				case 'onTabChanged':
					return tabChangedEvent.register(fn);

				case 'onSplitterMoved':
					return splitterMoved.register(fn);

				case 'onLayoutAdded':
					return newLayoutAdded.register(fn);

				case 'onlayoutEdit':
					return layoutEdited.register(fn);

				case 'onLayoutChanged':
					return layoutChanged.register(fn);

				case 'onViewChanged':
					return viewChangedEvent.register(fn);

				case 'onTabStatusChanged':
					return tabStatusChanged.register(fn);
			}

			return _.noop;
		};

		/**
		 * @ngdoc function
		 * @name unregisterListener
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description unregister an event listner for an event.
		 * @param {String} eventName - name of the module.
		 * @param {function} fn - contains the resolve functions for the module state transition.
		 *
		 */
		service.unregisterListener = function unregisterListener(eventName, fn) {
			switch (eventName) {
				case 'onTabChanged':
					tabChangedEvent.unregister(fn);
					break;
				case 'onSplitterMoved':
					splitterMoved.unregister(fn);
					break;
				case 'onLayoutAdded':
					newLayoutAdded.unregister(fn);
					break;
				case 'onlayoutEdit':
					layoutEdited.unregister(fn);
					break;
				case 'onLayoutChanged':
					layoutChanged.unregister(fn);
					break;
				case 'onViewChanged':
					viewChangedEvent.unregister(fn);
					break;
				case 'onTabStatusChanged':
					tabStatusChanged.unregister(fn);
					break;
			}
		};

		/**
		 * @ngdoc function
		 * @name initialize
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description initializes the service.
		 */
		service.initialize = function initialize() {
			if (_.isNull(defaultLayoutConfig)) {
				$http({
					method: 'GET',
					url: globals.appBaseUrl + 'app/components/layoutsystem/json/default-layout.json'
				})
					.then(function (response) {
						defaultLayoutConfig = response.data;
					});
			}
		};

		/**
		 * @ngdoc function
		 * @name getTabs
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description gets the tabs array for the current module.
		 *
		 */
		service.getTabs = function getTabs() {
			if (currentModule && currentModule.tabs) {
				return currentModule.tabs;
			}
		};

		/**
		 *
		 * @returns {number}
		 */
		service.getActiveTab = function getActiveTab() {
			return activeTab;
		};

		/**
		 * @ngdoc function
		 * @name getTabindex
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description gets the index of a tab.
		 *
		 */
		service.getTabIndex = function getTabIndex(stateName) {
			if (currentModule && currentModule.tabs) {
				return _.findIndex(currentModule.tabs, {state: stateName});
			}
		};

		/**
		 * @ngdoc function
		 * @name setActiveTab
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description set active tab.
		 *
		 */
		service.setActiveTab = function setActiveTab(index, preventReload) {
			previousTab = activeTab;
			/*
			 Default value for index is zero. But is activeTabIndex not undefined, thats means index is set by quickstart.
			 And actually tab index is in activeTab.
			 */
			activeTab = activeTabIndex ? activeTab : index;
			const args = {
				toTab: index,
				fromTab: previousTab
			};
			applyingConfig = true;
			tabChangedEvent.fire(null, args);
			service.saveview(null, null, true);

			if (!preventReload) {
				reloadByIndex(index);
			}
		};

		/*
		 to control the tab displaying from outside, this function must be calles.
		 activeTabIndex is the index of the available tabs-list.
		 If it's not set, index has defaultvalue 0 -> first tab is visible/active
		 */
		service.setActiveTabIndex = function (index) {
			activeTabIndex = index;
		};

		/**
		 * @ngdoc function
		 * @name getTabContent
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description gets the content for the active tab in the main view.
		 *
		 */
		service.getTabContent = function getTabContent() {
			if (currentModule && currentModule.tabs && currentModule.tabs[activeTab].activeView) {
				const template = defaultLayoutConfig[currentModule.tabs[activeTab].activeView.Config.baseLayoutId].template;// currentModule.tabs[activeTab].activeView.Config.template;
				return globals.appBaseUrl + template;
			}
		};

		/**
		 * @ngdoc function
		 * @name changeView
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description set active tab.
		 * @param {object} viewObj - name of the view to change to.
		 */
		service.changeView = function changeView(viewObj) {
			applyingConfig = true;
			viewChange = true;
			applyViewTemplate(viewObj);
			service.saveview(null, null, true);
			reload(currentModule.tabs[activeTab].Id);
		};

		// noinspection FunctionWithMoreThanThreeNegationsJS
		/**
		 * @ngdoc function
		 * @name getContainerForPane
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description set active tab.
		 * @param {String} paneId - pane id.
		 */
		service.getViewForPane = function getViewForPane(paneId) {
			if (!currentModule && !currentModule.tabs && !activeTab && !currentModule.tabs[activeTab].activeView.Config) {
				return;
			}

			const view = _.find(currentModule.tabs[activeTab].activeView.Config.subviews, {pane: paneId});

			if (view && view.content) {
				if (angular.isArray(view.content)) {
					const content = [];
					_.each(view.content, function (id) {
						const cont = _.find(currentModule.containers, {id: id});
						if (cont) {
							cont.shortcuts = view.shortcuts || {};
							content.push(cont);
						}
					});
					return {
						content: content,
						activeTab: view.activeTab
					};
				} else {
					return {
						content: _.find(currentModule.containers, {id: view.content}),
						activeTab: view.activeTab
					};
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name getCurrentModuleName
		 * @function
		 * @methodOf MainViewService
		 * @description Retrieves the unique name of the currently opened module.
		 * @returns {String} The module name, or `null` if no module is opened.
		 */
		service.getCurrentModuleName = function () {
			if (currentModule) {
				return currentModule.name;
			} else {
				return null;
			}
		};

		/**
		 * @ngdoc function
		 * @name getSplitterDef
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description gets the splitter definitions for the current active view.
		 */
		service.getSplitterDef = function (layoutName) {
			if (currentModule && currentModule.tabs) {
				if (layoutName) {
					return defaultLayoutConfig[layoutName].splitterDef;
				} else {
					return currentModule.tabs[activeTab].activeView.Config.splitterDef;
				}
			}
		};

		const _splitterMoved = [];

		/**
		 * @ngdoc function
		 * @name getSplitterDef
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description sets the splitter definitions for the current active view.
		 */
		service.setSplitterDef = function setSplitterDef(e) {
			const sender = e.sender;
			const deferred = $q.defer();

			if (currentModule && currentModule.tabs) {
				const activeView = getActiveView();

				if (!activeView) {
					return;
				}
				const paneObj = _.find(activeView.Config.splitterDef, {selectorName: sender.element[0].id});

				if (sender.options.panes.length === paneObj.panes.length) {
					angular.forEach(sender.options.panes, function (pane, index) {
						let dimension;
						let calVal;

						if (sender._dimension === 'height') {
							dimension = $('#splitter').height();
						} else {
							dimension = $('#splitter').width();
						}
						if (pane.size.indexOf('%') > -1) {
							calVal = dimension * (parseFloat(pane.size) / 100);
						} else {
							calVal = pane.size;
						}
						paneObj.panes[index].size = (100 / dimension * parseFloat(calVal)) + '%';
						paneObj.panes[index].collapsed = pane.collapsed;
					});
					currentModule.tabs[activeTab].altered = true;
					deferred.resolve(true);
					_splitterMoved.push(deferred.promise);
				}
				const id = setTimeout(function () {
					$q.all(_splitterMoved).then(function () {
						service.saveview(null, null, true);
					});
					clearTimeout(id);
				}, 20);
			}
		};

		/**
		 * @ngdoc function
		 * @name getBaseLayouts
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description sets the splitter definitions for the current active view.
		 */
		service.getBaseLayouts = function getBaseLayouts(baseLayoutId) {
			return defaultLayoutConfig[baseLayoutId];
		};

		/**
		 * @ngdoc function
		 * @name applyConfig
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description sets the splitter definitions for the current active view.
		 */
		service.applyConfig = function applyConfig(config, editor, save) {
			if (currentModule && currentModule.tabs) {
				const activeView = getActiveView();

				if (!activeView) {
					return;
				}

				if (config.baseLayoutId === activeView.Config.baseLayoutId) {
					config.splitterDef = _.cloneDeep(activeView.Config.splitterDef);
					config.filterId = activeView.Config.filterId;
					config.loadDataModuleStart = activeView.Config.loadDataModuleStart;
					config.loadDataTabChanged = activeView.Config.loadDataTabChanged;
					config.template = activeView.Config.template;
					activeView.Config = config;
				} else {
					config.splitterDef = defaultLayoutConfig[config.baseLayoutId].splitterDef;
					config.template = defaultLayoutConfig[config.baseLayoutId].template;
					_.assignIn(activeView.Config, config);
				}
				applyingConfig = true;
				currentModule.tabs[activeTab].altered = true;

				const tabId = currentModule.tabs[activeTab].Id;

				currentModule.tabs[activeTab].activeView = activeView;
				reload(tabId, !editor);
				if (editor) {
					layoutEdited.fire();
				}
				if (save) {
					service.saveview(null, null, true);
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name getAllViewNames
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description get the names of all views.
		 */
		service.getAllViewNames = function getAllViewNames() {
			// noinspection JSUnresolvedVariable
			return currentModule.tabs[activeTab].Views;
		};

		/**
		 * @ngdoc function
		 * @name getCurrentView
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description get the names of all views.
		 * @returns {*}
		 */
		service.getCurrentView = function getCurrentView() {
			// return currentModule.tabs[activeTab].activeView;
			return _.get(currentModule, `tabs[${activeTab}].activeView`, null);
		};

		/**
		 * @ngdoc function
		 * @name getDefaultLayout
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description sets the splitter definitions for the current active view.
		 */
		service.getDefaultLayout = function getDefaultLayout(layoutName) {
			const result = {
				layoutName: '',
				config: {}
			};
			if (_.isNull(layoutName) || _.isUndefined(layoutName)) {
				result.layoutName = currentModule.tabs[activeTab].activeView.Config.baseLayoutId;
				result.config = defaultLayoutConfig[currentModule.tabs[activeTab].activeView.Config.baseLayoutId];
				return result;
			} else {
				result.layoutName = layoutName;
				result.config = defaultLayoutConfig[layoutName];
				return result;
			}
		};

		/**
		 * @ngdoc function
		 * @name getAllViews
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description sets the splitter definitions for the current active view.
		 */
		service.getAllViews = function getAllViews() {
			return currentModule.containers;
		};

		/**
		 * @ngdoc function
		 * @name getPermission
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description retreives permission for given container uuid
		 * @param uuid {string} uuid of container
		 */
		service.getPermission = function getPermissions(uuid) {
			return _.result(_.find((currentModule && currentModule.containers) || [], {uuid: uuid}), 'permission', null);
		};

		/**
		 * @ngdoc function
		 * @name getCurrentLayout
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description gets the layout config object of the current active tab.
		 */
		service.getCurrentLayout = function getCurrentLayout() {
			return currentModule.tabs[activeTab].activeView.Config;
		};

		/**
		 * @ngdoc function
		 * @name getCurrentLayoutId
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description gets the layout id of the current active tab.
		 */
		service.getCurrentLayoutId = function getCurrentLayoutId() {
			return currentModule.tabs[activeTab].activeView.Id;
		};

		/**
		 *
		 * @returns {*}
		 */
		service.getMainControllerName = function getMainControllerName() {
			return currentModule.controller;
		};

		/**
		 *
		 * @param scope
		 */
		service.setMainScope = function setMainScope(scope) {
			currentModule.scope = scope;
		};

		let _isSaving = false;

		/**
		 * @ngdoc function
		 * @name renameView
		 * @function
		 * @methodOf MainViewService
		 * @description Renames a view
		 * @param { number } id The id of the view
		 * @param { string } newName The new name of the view
		 * @returns { object } The view object
		 */
		service.renameview = function renameView(id, newName) {
			return $http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + `/renameview?id=${id}&newName=${newName}`)
				.then(function (response) {
					return response;
				}, function () {
					return arguments;
				});
		};

		// noinspection FunctionWithMoreThanThreeNegationsJS,OverlyComplexFunctionJS,FunctionTooLongJS
		/**
		 *
		 * @param viewInfo
		 * @param viewType
		 * @param isLatest
		 * @param additionalConfig {filterId, loadDataModuleStart, loadDataTabChanged}
		 */
		service.saveview = function saveview(viewInfo, viewType, isLatest, additionalConfig) {
			if (_isSaving) {
				return;
			}

			const activeView = getActiveView();
			let view;
			let transView;
			let saveConfigs = false;

			if (!activeView) {
				return;
			}

			_isSaving = true;

			if (!currentModule && !currentModule.tabs && activeTab < 0) {
				return;
			}

			const tabID = currentModule.tabs[activeTab].Id;

			if (isLatest) {
				view = activeView;
				view.Description = null;
				view.Issystem = false;
				viewType = '0';
			} else {
				// noinspection JSUnresolvedVariable
				view = _.find(currentModule.tabs[activeTab].Views, {Id: viewInfo.Id});
			}
			if ((!view || view.Id === -1) && !isLatest) {
				view = _.cloneDeep(activeView);
				view.Id = -1;
				view.BasModuletabFk = tabID;
				view.Description = viewInfo.Description;
				view.DescriptionTr = viewInfo.Id;
				view.Isdefault = viewInfo.default || additionalConfig.isDefault;

				// noinspection JSUnresolvedVariable
				currentModule.tabs[activeTab].Views.push(view);
				saveConfigs = true;
			} else if (view && !isLatest) {
				if (activeView.ModuleTabViewConfigEntities) {
					view.ModuleTabViewConfigEntities = _.cloneDeep(activeView.ModuleTabViewConfigEntities);
					for (let i = 0; i < view.ModuleTabViewConfigEntities.length; i++) {
						view.ModuleTabViewConfigEntities[i].BasModuletabviewFk = view.Id;
					}
				} else {
					view.ModuleTabViewConfigEntities = null;
				}
				view.Config = _.cloneDeep(activeView.Config);
				saveConfigs = true;
			}

			view.AsRole = view.Issystem = view.IsPortal = false;

			if (additionalConfig) {
				view.Config.filterId = additionalConfig.filterId;
				view.Config.loadDataModuleStart = additionalConfig.loadDataModuleStart;
				view.Config.loadDataTabChanged = additionalConfig.loadDataTabChanged;
				saveConfigs = true;
			}

			switch (viewType) {
				case '0':
					break;
				case '1':
					view.Issystem = true;
					break;
				case '2':
					view.AsRole = true;
					break;
				case '3':
					view.IsPortal = true;
					break;
			}

			transView = _.cloneDeep(view);
			transView.Config = serializeConfig(transView.Config);
			delete transView.ModuleTabViewConfigEntities;

			if (!platformContextService.isLoggedIn) {
				// prevent from additional 401 errors after logout
				_isSaving = false;
				viewChange = false;

				return $q.reject(false);
			}

			return $http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/saveview?asRole=' + transView.AsRole, transView)
				.then(function (response) {
					_isSaving = false;
					if (response.status === 201) {
						_.each(view.ModuleTabViewConfigEntities, function (config) {
							config.BasModuletabviewFk = response.data.Id;
						});
						view.Id = response.data.Id;
						view.FrmUserFk = response.data.FrmUserFk;
						view.FrmAccessroleFk = response.data.FrmAccessroleFk;
					}

					view.Version = response.data.Version;
					view.InsertedBy = response.data.InsertedBy;
					view.InsertedAt = response.data.InsertedAt;
					view.UpdatedBy = response.data.UpdatedBy;
					view.UpdatedAt = response.data.UpdatedAt;

					if (viewChange) {
						viewChangedEvent.fire(view);
						viewChange = false;
					}

					globals.debug = {
						activeView: activeView,
						savedView: view
					};

					if (saveConfigs) {
						applyViewTemplate(view);
						saveConfigsForView(view, isLatest);
						if (view.Isdefault) {
							updateViewsAfterSetDefault(view);
						}

						viewChange = false;
					}

					return view;
				}, function () {
					_isSaving = false;
					viewChange = false;

					return arguments;
				});
		};

		/**
		 *
		 * @param viewObj
		 */
		service.deleteView = function deleteView(viewObj) {
			// noinspection JSUnresolvedVariable
			const index = _.indexOf(currentModule.tabs[activeTab].Views, viewObj);
			// noinspection JSUnresolvedVariable
			currentModule.tabs[activeTab].Views.splice(index, 1);
			if (viewObj === currentModule.tabs[activeTab].activeView) {
				// noinspection JSUnresolvedVariable
				currentModule.tabs[activeTab].activeView = currentModule.tabs[activeTab].Views[0];
			}
			$http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/deleteview?viewId=' + viewObj.Id).then(function (response) {
				if (response.status === 200) {
					viewObj = null;
				}
			});
		};

		/**
		 * Sets given view as default view
		 * @param viewObj
		 * @returns Promise
		 */
		service.setDefaultView = function setDefaultView(viewObj) {
			return $http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/setdefault?id=' + viewObj.Id)
				.then(function (response) {
					if (response.status === 200) {
						// noinspection JSUnresolvedVariable
						updateViewsAfterSetDefault(viewObj);
					}
				});
		};

		function updateViewsAfterSetDefault(viewObj) {
			_.each(currentModule.tabs[activeTab].Views, function (view) {
				if (view.Isdefault && view.FrmAccessroleFk === viewObj.FrmAccessroleFk && view.FrmUserFk === viewObj.FrmUserFk && view.Issystem === viewObj.Issystem && view.IsPortal === viewObj.IsPortal) {
					view.Isdefault = false;
				}
				viewObj.Isdefault = true;
			});
		}

		/**
		 *
		 * @returns {*}
		 */
		service.getViewsForTab = function getViewsForTab() {
			if (currentModule && currentModule.tabs.length && activeTab > -1) {
				// noinspection JSUnresolvedVariable
				return currentModule.tabs[activeTab].Views;
			}
		};

		service.getCurrentViewConfig = function getCurrentViewConfig() {
			let activeView = getActiveView();

			if (activeView && currentModule && currentModule.tabs.length && activeTab > -1) {
				// noinspection JSUnresolvedVariable
				let foundView = currentModule.tabs[activeTab].Views.find(x => x.Id === activeView.Id);
				if (foundView) {
					return Object.assign(foundView.Config, activeView.Config);
				}
				return activeView.Config;
			}
			return null;
		};

		const _moduleState = {};

		/**
		 *
		 */
		service.saveModuleState = function () {
			_moduleState.name = currentModule.name;
			_moduleState.tabId = currentModule.tabs[activeTab].Id;
		};

		/**
		 *
		 */
		service.importviews = function importviews(viewData) {
			viewData.ActiveModule = _moduleState.name;
			viewData.Activetab = _moduleState.tabId;
			return $http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/importlayouts', viewData)
				.then(function (response) {
					return response.data;
				});
		};

		service.reloadactivetab = function reloadactivetab() {
			reload(currentModule.tabs[activeTab].Id);
		};

		/**
		 *
		 * @param data
		 * @param headers
		 */
		function buildFiles(data, headers) {
			const octetStreamMime = 'application/octet-stream';

			// Get the headers
			headers = headers();

			// Get the filename from the x-filename header or default to "download.bin"
			const filename = headers['x-filename'] || 'download.bin';

			// Determine the content type from the header or default to "application/octet-stream"
			const contentType = headers['content-type'] || octetStreamMime;

			// Get the blob url creator
			const urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;

			if (urlCreator) {
				// Try to use a download link
				const link = document.createElement('a');

				// Try to simulate a click
				try {
					data = data.replace('/ /g', '');

					// Prepare a blob URL
					const blob = new Blob([data], {type: contentType});

					if (window.navigator && window.navigator.msSaveOrOpenBlob) {
						window.navigator.msSaveOrOpenBlob(blob, filename);
					} else {
						// noinspection JSUnresolvedFunction
						const url = urlCreator.createObjectURL(blob);

						link.setAttribute('href', url);

						// Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
						link.setAttribute('download', filename);

						// Simulate clicking the download link
						const event = document.createEvent('MouseEvents');

						event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
						link.dispatchEvent(event);
					}
				} catch (ex) {
					console.log('Download link method with simulated click failed with the following exception:');
					console.log(ex);
				}
			}
		}

		/**
		 *
		 * @param views2export
		 */
		service.exportviews = function exportviews(views2export) {
			const layouts = {};
			const layoutTranslations = {};

			for (let i = 0; i < views2export.length; i++) {
				layouts[views2export[i].id] = views2export[i].description;
				layoutTranslations[views2export[i].id] = views2export[i].translations;
			}

			const exportInfo = {
				Modulename: currentModule.name,
				Layouts: layouts,
				LayoutTranslations: layoutTranslations,
				TabDescription: currentModule.tabs[activeTab].Description,
				TabId: currentModule.tabs[activeTab].Id
			};

			$http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/exportlayout', exportInfo, {
				responseType: 'arrayBuffer', transformResponse: function (data) {
					return data;
				}
			})
				.then(function (data) {
					buildFiles(data.data, data.headers);
				}, function (data) {
					console.log('Request failed with status: ' + data.status);
				});
		};

		/**
		 *
		 */
		service.exportAllViews = function exportAllViews() {
			const exports = [];

			for (let i = 0; i < currentModule.tabs.length; i++) {
				let layouts = {};
				let views = currentModule.tabs[i].Views;

				for (let j = 0; j < views.length; j++) {
					if (views[j].Description === null) {
						continue;
					}
					layouts[views[j].Id] = views[j].description;
				}
				const exportInfo = {
					Modulename: currentModule.name,
					Layouts: layouts,
					TabDescription: currentModule.tabs[i].Description,
					TabId: currentModule.tabs[i].Id
				};

				exports.push($http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/exportlayout', exportInfo, {
					responseType: 'arrayBuffer', transformResponse: function (data) {
						return data;
					}
				}));
			}

			$q.all(exports)
				.then(function (responses) {
					for (let i = 0; i < responses.length; i++) {
						buildFiles(responses[i].data, responses[i].headers);
					}
				});
		};

		function createConfig(guid, viewId) {
			const config = {
				Guid: guid,
				BasModuletabviewFk: viewId
			};
			const activeView = getActiveView();

			if (!activeView) {
				return;
			}

			activeView.ModuleTabViewConfigEntities.push(config);

			return config;
		}

		function saveConfig(config) {
			const data = _.cloneDeep(config);

			// prevent configurations to be saved not having a valid guid!
			if (data.Guid.length !== 32) {
				console.error('main-view-service.saveConfig canceled | provide a valid guid (32 hexadecimal characters)!');
				return $q.when(true);
			}

			data.Gridconfig = angular.isString(data.Gridconfig) ? data.Gridconfig : JSON.stringify(data.Gridconfig);
			// Uncomment when DTO is extended to include StatusBar
			// data.StatusBar = angular.isString(data.StatusBar) ? data.StatusBar : JSON.stringify(data.StatusBar);
			data.Propertyconfig = angular.isString(data.Propertyconfig) || _.isNull(data.Propertyconfig) ? data.Propertyconfig : JSON.stringify(data.Propertyconfig);
			data.Propertyconfig = data.Propertyconfig === 'null' ? null : data.Propertyconfig;
			data.Viewdata = _.isNull(data.Viewdata) ? data.Viewdata : JSON.stringify(data.Viewdata);
			data.Viewdata = data.Viewdata === 'null' ? null : data.Viewdata;

			return $http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/saveconfig', data)
				.then(function (response) {
					config.Version = response.data;
				});
		}

		let isSaving = false;

		// noinspection OverlyComplexFunctionJS,FunctionTooLongJS,FunctionWithMoreThanThreeNegationsJS
		/**
		 *
		 * @param uuid
		 * @param config
		 * @param grouping
		 * @param save
		 * @param isFormConfig
		 * @param gridInfo
		 */
		service.setViewConfig = function setViewConfig(uuid, config, grouping, save, isFormConfig, gridInfo) { // jshint ignore:line
			if (uuid) {
				const activeView = getActiveView();

				if (!activeView) {
					return;
				}

				if (activeView.Id === -1) {
					if (_isSaving) {
						return;
					}

					const view = activeView;
					const transView = _.cloneDeep(view);

					transView.Config = serializeConfig(transView.Config);
					delete transView.ModuleTabViewConfigEntities;
					_isSaving = true;

					$http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/saveview?asRole=' + false, transView)
						.then(function (response) {
							if (response.status === 201) {
								_.each(view.ModuleTabViewConfigEntities, function (config) {
									config.BasModuletabviewFk = response.data.Id;
								});
								view.Id = response.data.Id;
								view.FrmUserFk = response.data.FrmUserFk;
								view.FrmAccessroleFk = response.data.FrmAccessroleFk;
							}

							view.Version = response.data.Version;
							view.InsertedBy = response.data.InsertedBy;
							view.InsertedAt = response.data.InsertedAt;
							view.UpdatedBy = response.data.UpdatedBy;
							view.UpdatedAt = response.data.UpdatedAt;

							service.setViewConfig(uuid, config, grouping, true, isFormConfig);
							_isSaving = false;
						}, function () {
							_isSaving = false;
						});
					return;
				}

				let container = _.find(activeView.ModuleTabViewConfigEntities, {Guid: uuid});

				if (!container) {
					container = {
						Guid: uuid,
						BasModuletabviewFk: activeView.Id
					};

					if (!activeView.ModuleTabViewConfigEntities) {
						activeView.ModuleTabViewConfigEntities = [];
					}
					activeView.ModuleTabViewConfigEntities.push(container);
				}
				if (!_.isEmpty(config)) {
					container.Propertyconfig = _.cloneDeep(config);
				}
				if (grouping) {
					if (angular.isString(container.Gridconfig) && container.Gridconfig.length) {
						container.Gridconfig = JSON.parse(container.Gridconfig);
					}
					if (container.Gridconfig && (!angular.isString(container.Gridconfig))) {
						grouping.groups = grouping.groups ? grouping.groups : (container.Gridconfig.groups ? container.Gridconfig.groups : []);
						grouping.sortColumn = grouping.sortColumn ? grouping.sortColumn : (container.Gridconfig.sortColumn ? container.Gridconfig.sortColumn : 'SomeColumn');
						// grouping.version = grouping.version;
					}
					container.Gridconfig = save === true ? JSON.stringify(grouping) : grouping;
				}
				if (gridInfo) {
					if (angular.isString(container.Gridconfig) && container.Gridconfig.length) {
						container.Gridconfig = JSON.parse(container.Gridconfig);
					}
					if (container.Gridconfig && (!angular.isString(container.Gridconfig))) {
						Object.assign(container.Gridconfig, gridInfo);
					}
				}

				if (save && !isSaving) {
					saveConfig(container);
				}
			}
		};

		/**
		 *
		 * @param view
		 * @param isLatest
		 */
		function saveConfigsForView(view, isLatest) {
			try {
				if (!view.ModuleTabViewConfigEntities || !view.ModuleTabViewConfigEntities.length) {
					return;
				}

				const len = view.ModuleTabViewConfigEntities.length;
				let i = 0;
				const dtos = [];

				for (; i < len; i++) {
					const guid = view.ModuleTabViewConfigEntities[i].Guid;

					if (!_.isNil(guid) && !_.isEmpty(guid) && guid.length === 32) {
						let found = _.filter(dtos, function (x) {
							return x.Guid.toLowerCase() === guid.toLowerCase();
						});
						if (!found || (found && found.length === 0)) {
							const container = _.cloneDeep(view.ModuleTabViewConfigEntities[i]);

							container.Propertyconfig = angular.isObject(container.Propertyconfig) ? JSON.stringify(container.Propertyconfig) : container.Propertyconfig;
							container.Gridconfig = angular.isObject(container.Gridconfig) ? JSON.stringify(container.Gridconfig) : container.Gridconfig;
							// Uncomment when DTO is extended to include StatusBar
							// container.StatusBar = angular.isObject(container.StatusBar) ? JSON.stringify(container.StatusBar) : container.StatusBar;
							container.Viewdata = angular.isObject(container.Viewdata) ? JSON.stringify(container.Viewdata) : container.Viewdata;
							if (!isLatest) {
								container.InsertedBy = 0;
								container.Version = 0;
							}
							container.BasModuletabviewFk = view.Id;
							dtos.push(container);
						}
					}
				}

				if (dtos.length) {
					$http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/saveconfigs', dtos)
						.then(function () {
							const activeView = getActiveView();

							if (!activeView) {
								return;
							}

							for (let i = 0; i < activeView.ModuleTabViewConfigEntities.length; i++) {
								if (!activeView.ModuleTabViewConfigEntities[i].Version) {
									activeView.ModuleTabViewConfigEntities[i].Version = 1;
								} else {
									activeView.ModuleTabViewConfigEntities[i].Version++;
								}
							}
						});
				}
			} catch (ex) {
				console.error(ex);
			}
		}

		/**
		 *
		 * @param uuid
		 * @returns {*}
		 */
		service.getViewConfig = function getViewConfig(uuid) {
			let config;

			if (currentModule && currentModule.tabs) {
				const activeView = getActiveView();

				if (!activeView) {
					return null;
				}

				config = _.find(activeView.ModuleTabViewConfigEntities, {
					Guid: uuid,
					BasModuletabviewFk: activeView.Id
				});

				if (config) {
					if (config.Propertyconfig === 'null') {
						config.Propertyconfig = null;
					}

					// Uncomment when DTO is extended to include StatusBar
					// if(config.StatusBar && angular.isString(config.StatusBar)){
					// config.StatusBar = JSON.parse(config.StatusBar);
					// }
					if (config.Gridconfig && angular.isString(config.Gridconfig)) {
						config.Gridconfig = JSON.parse(config.Gridconfig);
					}
					if (config.Viewdata && checkJSON(config.Viewdata)) {
						config.Viewdata = JSON.parse(config.Viewdata);
					}
					return _.cloneDeep(config);
				} else {
					/* let defaultView = null;
					if(activeView.ModuleTabViewOriginFk) {
						defaultView = currentModule.tabs[activeTab].Views.find(x => x.Id === activeView.ModuleTabViewOriginFk);
					}
					else {
						// get the default
						defaultView = currentModule.tabs[activeTab].Views.find(x => x.Isdefault === true);
					} */
					// get the default
					let defaultView = currentModule.tabs[activeTab].Views.find(x => x.Isdefault === true);
					if (!_.isNil(defaultView)) {
						config = _.find(defaultView.ModuleTabViewConfigEntities, {
							Guid: uuid
						});

						if (config) {
							return _.cloneDeep(config);
						}
					}
				}
			}

			return null;
		};

		/**
		 *
		 * @param uuid
		 * @returns {*}
		 */
		service.activeContainer = function activeContainer(uuid) {
			if (uuid) {
				_currentSelected = uuid;
			} else {
				return _currentSelected;
			}
		};

		/**
		 *
		 * @param uuid
		 * @returns {boolean}
		 */
		service.jumpToContainer = function jumpToContainer(uuid) {
			const container = _.find(currentModule.containers, {uuid: uuid});

			if (!container) {
				return false;
			}

			const id = container.id;
			let i;
			let view = null;

			for (i = 0; i < currentModule.tabs.length; i++) {
				const subviews = currentModule.tabs[i].activeView.Config.subviews;
				view = _.find(subviews, {content: id});

				if (view) {
					break;
				}
			}
			if (view) {
				service.setActiveTab(i);
			}
			return true;
		};

		let _oldOptions;

		/**
		 *
		 * @param options
		 */
		service.toggleTabState = function toggleTabState(options) {
			for (let i = 0; i < currentModule.tabs.length; i++) {
				const tab = currentModule.tabs[i];

				tab.disabled = false;
				tab.css = '';
				if (options && options[tab.Id]) {
					if (options[tab.Id].indexOf('.') === 0) {
						tab.css = options[tab.Id] = options[tab.Id].substr(1);
					} else if (options[tab.Id] === 'disabled') {
						tab.disabled = true;
					} else {
						tab.css = '';
						tab.disabled = false;
					}
				}
			}
			tabStatusChanged.fire(this, _oldOptions);
			_oldOptions = options;
		};

		/**
		 *
		 * @param containerUuid
		 * @param key
		 * @param value
		 * @returns {*}
		 */
		service.customData = function customData(containerUuid, key, value) {
			const activeView = getActiveView();

			if (!activeView) {
				return;
			}

			let container = _.find(activeView.ModuleTabViewConfigEntities, {
				Guid: containerUuid,
				BasModuletabviewFk: activeView.Id
			});

			if (!container) {
				container = createConfig(containerUuid, activeView.Id);
				container.Viewdata = {};
				container.Propertyconfig = null;
			} else {
				container.Viewdata = angular.isString(container.Viewdata) ? JSON.parse(container.Viewdata) : _.clone(container.Viewdata);
				if (_.isUndefined(container.Viewdata) || _.isNull(container.Viewdata) || (_.isString(container.Viewdata) && container.Viewdata.match(/null/g))) {
					container.Viewdata = {};
				}
			}
			if (value) {
				container.Viewdata[key] = _.cloneDeep(value);

				if (activeView.Id === -1) {
					service.saveview(null, null, true)
						.then(function (view) {
							container.BasModuletabviewFk = view.Id;
							return saveConfig(container);
						});
				} else {
					container.Viewdata[key] = _.cloneDeep(value);

					return saveConfig(container);
				}
			} else {
				return container.Viewdata[key];
			}
		};

		/**
		 *
		 */
		service.goto = function goto(/* route */) {
			// ToDo: add implementation to reload entire state depending on state that is to be routed to.
		};

		/**
		 * @ngdoc function
		 * @name loadDomains
		 * @function
		 * @methodOf MainViewService
		 * @description executes loadDomains function from resolve block of given module
		 * @param moduleName {string} name of module as '[moduleName].[submoduleName]'
		 * @returns {Promise}
		 */
		service.loadDomains = function loadDomains(moduleName) {
			const options = registeredModuleOptions[moduleName];

			if (options && options.resolve && options.resolve.loadDomains) {
				return $injector.invoke(options.resolve.loadDomains);
			}

			return $q.when(true);
		};

		/**
		 * @ngdoc function
		 * @name loadDomains
		 * @function
		 * @methodOf MainViewService
		 * @description executes registerWizards function from resolve block of given module
		 * @param moduleName {string} name of module as '[moduleName].[submoduleName]'
		 * @returns {Promise}
		 */
		service.registerWizards = function registerWizards(moduleName) {
			const options = registeredModuleOptions[moduleName];

			if (options && options.resolve && options.resolve.registerWizards) {
				return $injector.invoke(options.resolve.registerWizards);
			}

			return $q.when(true);
		};

		/**
		 * @ngdoc function
		 * @name loadTranslation
		 * @function
		 * @methodOf MainViewService
		 * @description executes loadTranslations function from resolve block of given module
		 * @param moduleName {string} name of module as '[moduleName].[submoduleName]'
		 * @returns {Promise}
		 */
		service.loadTranslation = function loadTranslation(moduleName) {
			const options = registeredModuleOptions[moduleName];

			if (options && options.resolve) {
				if (options.resolve.loadTranslation) {
					return $injector.invoke(options.resolve.loadTranslation);
				}

				if (options.resolve.loadTranslations) {
					return $injector.invoke(options.resolve.loadTranslations);
				}
			}

			return $q.when(true);
		};

		$rootScope.$on('permission-service:updated', function () {
			const platformPermissionService = $injector.get('platformPermissionService');

			_.each((currentModule && currentModule.containers) || [], function (container) {
				if (container && container.state) {
					const read = platformPermissionService.hasRead(container.permission);
					const write = platformPermissionService.hasWrite(container.permission);

					if (container.state.read !== read || container.state.write !== write) {
						container.state.read = read;
						container.state.write = write;
						container.state.update = true;

						if (!read) {
							container.controller = '';
							container.template = container.state.denyTemplate;
						} else {
							container.controller = container.state.controller;
							container.template = container.state.template;
						}
					} else {
						container.state.update = false;
					}
				}
			});
		});

		/**
		 * @ngdoc function
		 * @name getContainerByUuid
		 * @function
		 * @methodOf MainViewService
		 * @description retrieves container for given UUID
		 * @param uuid {string} uuid of container
		 * @returns {object} container info
		 */
		service.getContainerByUuid = function getContainerByUuid(uuid) {
			return _.find((currentModule && currentModule.containers) || [], {uuid: uuid});
		};

		/**
		 * @ngdoc function
		 * @name updateSubviewTab
		 * @function
		 * @methodOf MainViewService
		 * @description updates selected tab of subView to be persisted in the database
		 * @param paneId
		 * @param index {int} index of currently active tab
		 * @returns {object} container info
		 */
		service.updateSubviewTab = function updateSubviewTab(paneId, index) {
			if (!currentModule && !currentModule.tabs && !activeTab && !getActiveView().Config) {
				return;
			}
			const view = _.find(getActiveView().Config.subviews, {pane: paneId});
			if (view) {
				view.activeTab = index;
				service.saveview(null, null, true);
			}
		};

		function prepareModuleConfigData(config) {
			const data = _.clone(config);

			data.Gridconfig = _.isNil(config.Gridconfig) ? null : JSON.stringify(config.Gridconfig);
			data.Propertyconfig = _.isNil(config.Propertyconfig) ? null : JSON.stringify(config.Propertyconfig);
			data.CustomConfig = _.isNil(config.CustomConfig) ? null : JSON.stringify(config.CustomConfig);

			return data;
		}

		function getDefaultModuleConfig(uuid) {
			return {
				Guid: uuid,
				Propertyconfig: null,
				Gridconfig: null,
				CustomConfig: null,
				IsUser: true,
				IsRole: false,
				IsSystem: false,
				IsPortal: false,
				IsFormConfig: false
			};
		}

		let moduleConfigSaving = false;

		function saveModuleConfig(config) {
			if (config) {
				config.isDirty = true;
			}

			if (moduleConfigSaving) {
				return;
			}

			const data = _.reduce(currentModule.moduleUiConfigs, function (result, config) {
				if (config.isDirty) {
					result.push(prepareModuleConfigData(config));
					config.isDirty = false;
				}

				return result;
			}, []);

			if (data.length) {
				moduleConfigSaving = true;

				$http.post(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/module-config', data, {
					params: {
						module: currentModule.name
					}
				})
					.then(function () {
						moduleConfigSaving = false;
						saveModuleConfig();
					}, function () {
						moduleConfigSaving = false;
					});
			}
		}

		/**
		 * @ngdoc function
		 * @name setModuleConfig
		 * @function
		 * @methodOf MainViewService
		 * @description set module user configuration for given uuid
		 * @param {string} uuid uuid of configuration (grid/form/...)
		 * @param {Object} config configuration
		 * @param {Object} grouping configuration to be saved
		 * @param {Object} gridInfo provides current filter, statusbar etc, configuration
		 * @param {Object} options object containing options -> { disableConfigSave: false, isFormConfig: false }
		 */
		service.setModuleConfig = function setModuleConfig(uuid, config, grouping, gridInfo, options) {
			if (!uuid) {
				return;
			}

			const newConfig = _.get(currentModule.moduleUiConfigs, uuid) || getDefaultModuleConfig(uuid);

			currentModule.moduleUiConfigs[uuid] = newConfig;

			newConfig.IsFormConfig = _.get(options, 'isFormConfig', false);

			if (!_.isEmpty(config)) {
				newConfig.Propertyconfig = _.cloneDeep(config) || null;
			}

			if (grouping) {
				newConfig.Gridconfig = config.Gridconfig || {};
				newConfig.Gridconfig.groups = grouping.groups || config.Gridconfig.groups || [];
				newConfig.Gridconfig.sortColumn = grouping.sortColumn || config.Gridconfig.sortColumn || 'SomeColumn';
			}

			if (gridInfo) {
				newConfig.Gridconfig = newConfig.Gridconfig || config.Gridconfig || {};
				newConfig.Gridconfig.searchString = gridInfo.searchString;
				newConfig.Gridconfig.showFilterRow = gridInfo.showFilterRow;
				newConfig.Gridconfig.showMainTopPanel = gridInfo.showMainTopPanel;
				newConfig.Gridconfig.statusBar = gridInfo.statusBar;
				newConfig.Gridconfig.markReadonlyCells = gridInfo.markReadonlyCells;
				newConfig.Gridconfig.allowCopySelection = gridInfo.allowCopySelection;
				newConfig.Gridconfig.includeHeaderWhenCopyingToExcel = gridInfo.includeHeaderWhenCopyingToExcel;
			}

			if (!options || !options.disableConfigSave) {
				saveModuleConfig(newConfig);
			}
		};

		/**
		 * @ngdoc function
		 * @name setModuleCustomConfig
		 * @function
		 * @methodOf MainViewService
		 * @description set custom module user configuration for given uuid
		 * @param {string} uuid uuid of configuration (custom)
		 * @param {object} value value of new custom configuration property.
		 * @param {Object} options object containing options -> { disableConfigSave: false, isFormConfig: false }
		 */
		service.setModuleCustomConfig = function setModuleCustomConfig(uuid, value, options) {
			if (!uuid) {
				return;
			}
			const newConfig = _.get(currentModule.moduleUiConfigs, uuid) || getDefaultModuleConfig(uuid);

			currentModule.moduleUiConfigs[uuid] = newConfig;

			// set custom configuration
			newConfig.CustomConfig = value || {};

			if (!options || !options.disableConfigSave) {
				saveModuleConfig(newConfig);
			}
		};

		/**
		 * @ngdoc function
		 * @name resetModuleConfig
		 * @function
		 * @methodOf MainViewService
		 * @description reset the property config of the module configuration
		 * @param {string} uuid uuid of configuration (grid/form/...)
		 */
		service.resetModuleConfig = function resetModuleConfig(uuid) {
			if (!uuid) {
				return;
			}

			const newConfig = _.get(currentModule.moduleUiConfigs, uuid) || getDefaultModuleConfig(uuid);

			currentModule.moduleUiConfigs[uuid] = newConfig;

			newConfig.Propertyconfig = null;

			saveModuleConfig(newConfig);
		};

		/**
		 * @ngdoc function
		 * @name getModuleConfig
		 * @function
		 * @methodOf MainViewService
		 * @description get module user configuration for given uuid
		 * @param {string} uuid uuid of configuration (grid/form/custom)
		 * @returns {Object} object containing configuration or null if not found
		 */
		service.getModuleConfig = function getModuleConfig(uuid) {
			if (!uuid) {
				return;
			}

			if (!currentModule) {
				$log.error('The dialog cannot save or load user settings because it does not belong to a module. Remove the id of the dialog config.');
				return;
			}

			return _.cloneDeep(_.get(currentModule.moduleUiConfigs, uuid, null));
		};

		/**
		 * @ngdoc function
		 * @name hasModuleConfig
		 * @function
		 * @methodOf MainViewService
		 * @description checks if module configuration for given uuid and type is available
		 * @param {string} uuid uuid of configuration (grid/form/...)
		 * @param {string} type type of configuration ('u'=user, 'r'=role, 'p'=portal, 's'=system)
		 * @returns {boolean} true if available, otherwise false
		 */
		service.hasModuleConfig = function hasModuleConfig(uuid, type) {
			if (!uuid || !/^[urps]$/.test(type)) {
				return false;
			}

			return !!(currentModule && _.get(currentModule.moduleUiConfigs, (type !== 'u' ? type + '#' : '') + uuid, null));
		};

		/**
		 * @ngdoc function
		 * @name applyModuleConfig
		 * @function
		 * @methodOf MainViewService
		 * @description applies module configuration for given uuid and type
		 * @param {string} uuid uuid of configuration (grid/form/...)
		 * @param {string} type type of configuration ('r'=role, 'p'=portal, 's'=system)
		 */
		service.applyModuleConfig = function applyModuleConfig(uuid, type) {
			if (!uuid || !/^[rps]$/.test(type)) {
				return;
			}

			const config = _.cloneDeep(_.get(currentModule.moduleUiConfigs, type + '#' + uuid, null));

			if (config) {
				config.IsRole = config.IsPortal = config.IsSystem = false;
				config.IsUser = true;

				_.set(currentModule.moduleUiConfigs, uuid, config);

				saveModuleConfig(config);
			}
		};

		/**
		 * @ngdoc function
		 * @name saveModuleConfigAs
		 * @function
		 * @methodOf MainViewService
		 * @description saves user configuration of given uuid as configuration of given type
		 * @param {string} uuid uuid of configuration (grid/form/...)
		 * @param {string} type type of configuration ('r'=role, 'p'=portal, 's'=system)
		 */
		service.saveModuleConfigAs = function saveModuleConfigAs(uuid, type) {
			if (!uuid || !/^[rps]$/.test(type)) {
				return;
			}

			const config = _.cloneDeep(_.get(currentModule.moduleUiConfigs, uuid, null));

			if (config) {
				config.IsRole = type === 'r';
				config.IsPortal = type === 'p';
				config.IsSystem = type === 's';
				config.IsUser = false;

				_.set(currentModule.moduleUiConfigs, type + '#' + uuid, config);

				saveModuleConfig(config);
			}
		};

		/**
		 * @ngdoc function
		 * @name saveModuleConfigAs
		 * @function
		 * @methodOf MainViewService
		 * @description saves user configuration of given uuid as configuration of given type
		 * @param {string} uuid uuid of configuration (grid/form/...)
		 * @param {string} type type of configuration ('r'=role, 'p'=portal, 's'=system)
		 */
		service.deleteModuleConfig = function deleteModuleConfig(uuid, type) {
			if (!uuid || !/^[rps]$/.test(type)) {
				return;
			}

			const config = _.get(currentModule.moduleUiConfigs, type + '#' + uuid, null);

			if (config) {
				_.unset(currentModule.moduleUiConfigs, type + '#' + uuid);

				$http.delete(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/module-config', {
					params: {
						module: currentModule.name,
						type: type
					}
				});
			}
		};

		service.inEditMode = false;

		initService();

		return service;
	};

	/**
	 *
	 * @type {string[]}
	 */
	MainViewService.$inject = ['$rootScope', '$state', '$http', '$q', '$injector', 'globals', '$', '$log', 'platformContextService'];

	/**
	 *
	 * @param $stateProvider
	 * @param globals
	 * @returns {{}}
	 * @constructor
	 */
	const MainViewServiceProvider = function ($stateProvider, globals) {
		let provider = {};
		let deferred;

		/**
		 * @ngdoc function
		 * @name setServiceUrl
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description sets the service url for  the layout service/system.
		 * @param {object} config - the config object.
		 *
		 */
		provider.setConfig = function (config) {
			angular.extend(defaultConfig, config);
		};

		/**
		 *
		 * @param resolveObj
		 * @returns {*}
		 */
		provider.globalResolves = function (resolveObj) {
			if (resolveObj) {
				if (!globalResolves) {
					globalResolves = {};
				}
				angular.extend(globalResolves, resolveObj);
			} else {
				return globalResolves;
			}
		};

		/**
		 * @ngdoc function
		 * @name registerModule
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description sets the service url for  the layout service/system.
		 * @param {Object} moduleOptions - contains the module options.
		 *
		 */
		provider.registerModule = function (moduleOptions) {
			if (angular.isString(moduleOptions)) {
				const name = moduleOptions;
				moduleOptions = angular.extend({}, defaultModuleOptions);
				moduleOptions.moduleName = name;
			}
			const stateName = globals.defaultState + '.' + moduleOptions.moduleName.replace('.', '');

			if (!angular.isDefined(moduleOptions.controller) || moduleOptions.controller === '') {
				const parts = moduleOptions.moduleName.split('.');
				const prefix = parts[0] + parts[1][0].toUpperCase() + parts[1].substr(1);
				moduleOptions.controller = prefix + 'Controller';
			}

			registeredModuleOptions[moduleOptions.moduleName] = moduleOptions;

			const resolveModuleTransition = {
				secureContextRole: ['platformContextService', (platformContextService) => {
					return platformContextService.isSecureClientRoleReady;
				}],
				init: ['$log', '$http', '$rootScope', 'secureContextRole',
					function ($log, $http, $rootScope) { // jshint ignore: line
						if (applyingConfig) {
							return true;
						}
						let promise = true;
						if (_.isNull(defaultLayoutConfig)) {
							promise = $http({
								method: 'GET',
								url: globals.appBaseUrl + 'app/components/layoutsystem/json/default-layout.json'
							}).then(function (response) {
								defaultLayoutConfig = response.data;
								return true;
							}, function () {
								return false;
							});
						}

						currentModule = {};
						currentModule.name = moduleOptions.moduleName;
						currentModule.controller = moduleOptions.controller;
						currentModule.scope = $rootScope.$new();
						currentModule.state = stateName;

						return promise;
					}],
				loadConfigFromDB: ['$http', '$log', 'loadViews', 'platformCustomTranslateService', 'platformTranslateService',
					function ($http, $log, preResult, platformCustomTranslateService, platformTranslateService) {
						if (!preResult) {
							$log.error('Preload initialization failed.');
						}
						if (applyingConfig) {
							return true;
						}

						// reloading translation tables
						platformTranslateService.translationChanged.register(function () {
							platformTranslateService.registerCustomTranslation('views');
						});

						return $http.get(globals.webApiBaseUrl + defaultConfig.serviceUrl + '/gettabs?moduleName=' + moduleOptions.moduleName)
							.then(function (response) {
								if (currentModule) {
									currentModule.tabs = response.data;

									for (let i = 0; i < currentModule.tabs.length; i++) {
										const tab = currentModule.tabs[i];
										// noinspection JSUnresolvedVariable
										for (let j = 0; j < tab.Views.length; j++) {
											// noinspection JSUnresolvedVariable
											const view = tab.Views[j];

											// important for the process translation-object. We need $tr$ for dropdown and list in saveview-dialog
											if (view.Description && (view.Issystem || view.IsPortal || view.FrmAccessroleFk)) {
												view.Description$tr$ = `${platformCustomTranslateService.getTranslationPrefix()}.views.${view.Id}.Description`;
											}

											if (tab.Views[j].Config || tab.Views[j].Config !== '') {
												view.Config = deserializeConfig(view.Config);
											}

											_.forEach(view.ModuleTabViewConfigEntities, function (item) {
												item.Guid = item.Guid.toLowerCase();
											});
										}
									}
								}
								return true;
							}, function (response) {
								if (response.status >= 500) {
									$log.error('Server error: ' + response.status);
								} else {
									return LOAD_FAILED;
								}
							});
					}],
				loadViews: ['$http', '$q', 'platformPermissionService', 'platformContextService', '_', 'init', 'globalResolves',
					function ($http, $q, platformPermissionService, platformContextService, _) { // jshint ignore:line
						if (applyingConfig) {
							return true;
						}

						let calls = [];

						calls.push($http.get(globals.appBaseUrl + moduleOptions.moduleName + '/content/json/module-containers.json')
							.then(function (response) {
								let containerDefs = response.data;
								const items = _.partition(containerDefs, function (cntDef) {
									return _.isObject(cntDef) && _.isString(cntDef.include);
								});

								if (!items[0].length) {
									// early out, no includes found
									return response;
								}

								containerDefs = items[1];
								const includeCalls = _.map(items[0], function (includeDef) {
									return $http.get(globals.appBaseUrl + includeDef.include);
								});

								return $q.all(includeCalls)
									.then(function (responses) {
										return {
											data: _.concat(containerDefs, _.flatten(_.map(responses, function (r) {
												return r.data;
											})))
										};
									});
							}));
						calls.push($http.get(globals.webApiBaseUrl + 'basics/layout/containerdefinition?module=' + moduleOptions.moduleName));
						calls.push($http.get(globals.webApiBaseUrl + 'basics/dependentdata/containerslist?internalModuleName=' + moduleOptions.moduleName));
						calls.push($http.get(globals.webApiBaseUrl + 'basics/layout/module-config?module=' + moduleOptions.moduleName)
							.then(function (response) {
								currentModule.moduleUiConfigs = {};

								_.forEach(response.data, function (data) {
									data.Gridconfig = _.isNil(data.Gridconfig) ? null : JSON.parse(data.Gridconfig);
									data.Propertyconfig = _.isNil(data.Propertyconfig) ? null : JSON.parse(data.Propertyconfig);
									data.CustomConfig = _.isNil(data.CustomConfig) ? null : JSON.parse(data.CustomConfig);

									if (data.IsSystem) {
										currentModule.moduleUiConfigs['s#' + data.Guid] = data;
									} else if (data.IsPortal) {
										currentModule.moduleUiConfigs['p#' + data.Guid] = data;
									} else if (data.IsRole) {
										currentModule.moduleUiConfigs['r#' + data.Guid] = data;
									} else {
										currentModule.moduleUiConfigs[data.Guid] = data;
									}
								});

								return true;
							}));

						let permissions = [
							'1b77aedb2fae468cb9fd539af120b87a', // layout save system views
							'00f979839fb94839a2998b4ca9dd12e5', // layout save user views
							'842f845cb6934b109a40983366f981ef', // layout save role views
							'c9e2ece5629b4037b4f8695c92e59c1b', // layout save portal views
							'b92e1f10594d4e7daa2cba19be14d5aa', // import/export layout
							'91c3b3b31b5d4ead9c4f7236cb4f2bc0', // Access Right to enable the Grid Layout option
							'a1013e0c2c12480c9292deaed7cb11dd', // Access Right to enable the Edit View option
							'7ee17da2cd004de6a53c63af7cb4d3d9', // Right to maintain Role | System Configuration of Lookups
							'511ee30db32342c6808b02994435bf50', // BI+ Admin
							'54d412d4bd54444b9f9d93cc2e69b182', // BI+ Admin or Editor
							'9fdc8f6f619748bea214ebce20b819d7', // system filter in search sidebar
							'77e6b79bfab44adc9d9ae30b8c494a7f', // role filter in search sidebar
							'253c472c903f4ffcab2ae7d401833398'  // user filter in search sidebar
						];

						calls.push(platformPermissionService.loadPermissions(permissions, true));

						if (platformContextService.permissionObjectInfo) {
							calls.push(platformPermissionService.loadPermissions(permissions, false));
						}

						return $q.all(calls)
							.then(function (response) {
								if (!currentModule) {
									return $q.resolve();
								}

								if (!currentModule.containers) {
									currentModule.containers = [];
								}

								currentModule.containers = _.compact(response[0].data.concat(response[1].data, response[2].data));

								// set permission uuid if not specified
								_.each(currentModule.containers, function (container) {
									container.permission = (container.permission || container.uuid).toLowerCase();
								});

								permissions = _.uniq(_.union(_.map(currentModule.containers, 'permission'), moduleOptions.permissions || []));
								calls = [];

								calls.push(platformPermissionService.loadPermissions(permissions, true));

								if (platformContextService.permissionObjectInfo) {
									calls.push(platformPermissionService.loadPermissions(permissions, false));
								}

								// finally load and check permissions
								return $q.all(calls)
									.then(function () {
										_.each(currentModule.containers, function (container) {
											container.uuid = container.uuid.toLowerCase();

											if (!container.state) {
												container.state = {
													write: platformPermissionService.hasWrite(container.permission),
													read: platformPermissionService.hasRead(container.permission),
													template: container.template,
													controller: container.controller,
													denyTemplate: 'layout-system-templates-container-empty.html'
												};
											}

											if (!container.state.read) {
												container.template = container.state.denyTemplate;
												container.controller = '';
											} else {
												container.template = container.state.template;
												container.controller = container.state.controller;
											}

										});

										return true;
									});
							}, function () {
								return 'failed to load views.';
							});
					}],
				finalize: ['$http', 'platformContextService', 'loadConfigFromDB',
					function ($http, platformContextService, preResult) { // jshint ignore:line
						if (applyingConfig) {
							return true;
						}
						if (!preResult) {
							deferred.reject('failed to load views.');
						}
						for (let i = 0; i < currentModule.tabs.length; i++) {
							const tab = currentModule.tabs[i];

							tab.disabled = false;

							// noinspection JSUnresolvedVariable
							for (let j = 0; j < tab.Views.length; j++) {
								// noinspection JSUnresolvedVariable
								tab.Views[j].Config.template = defaultLayoutConfig[tab.Views[j].Config.baseLayoutId].template;
								// noinspection JSUnresolvedVariable
								if (tab.Views[j].Config.splitterDef.length === 0) {
									// noinspection JSUnresolvedVariable
									tab.Views[j].Config.splitterDef = defaultLayoutConfig[tab.Views[j].Config.baseLayoutId].splitterDef;
								}
							}
							// noinspection JSUnresolvedVariable
							let latest = _.find(tab.Views, {Description: null});

							if (!latest) {
								tab.activeView = {
									Id: -1,
									Description: null,
									DescriptionTr: null,
									BasModuletabFk: tab.Id,
									Issystem: false,
									Isdefault: false,
									Config: {
										subviews: [
											{
												content: currentModule.containers[0].id,
												pane: 'pane-0'
											}
										],
										splitterDef: [],
										baseLayoutId: 'layout0'
									},
									ModuleTabViewConfigEntities: [],
									Version: 0
								};

								// noinspection JSUnresolvedVariable
								let view = _.find(tab.Views, {
									Isdefault: true,
									FrmAccessroleFk: platformContextService.permissionRoleId
								});

								// noinspection JSUnresolvedVariable
								view = view ? view : _.find(tab.Views, {
									Isdefault: true,
									Issystem: !globals.portal,
									IsPortal: globals.portal
								});

								if (view) {
									latest = tab.activeView;
									latest.Config = _.cloneDeep(view.Config);
									latest.ModuleTabViewOriginFk = view.Id;

									if (view.ModuleTabViewConfigEntities) {
										latest.ModuleTabViewConfigEntities = _.cloneDeep(view.ModuleTabViewConfigEntities);
										const len = latest.ModuleTabViewConfigEntities.length;
										const configs = latest.ModuleTabViewConfigEntities;
										for (let k = 0; k < len; k++) {
											configs[k].BasModuletabviewFk = latest.Id;
											configs[k].Version = 0;
										}
									}
									tab.activeView = latest;
									tab.Views.push(latest);
								}
							} else {
								tab.activeView = _.cloneDeep(latest);
							}
						}

						const activeTabObject = getActiveTabObject();
						if (activeTabObject) {
							activeTab = _.indexOf(currentModule.tabs, activeTabObject);
							previousTab = activeTab;
						}
						currentModule.tabs = _.sortBy(currentModule.tabs, 'sorting');

						return true;
					}],
				setActive: ['$stateParams', '$q', '$rootScope', '$injector', 'finalize', '$controller', 'platformGenericStructureService', 'platformPermissionService',
					function ($stateParams, $q, $rootScope, $injector, finalize, $controller, platformGenericStructureService, platformPermissionService) {
						if (!finalize) {
							throw new Error('Failed to finalize resolve.');
						}

						$stateParams.tab = currentModule.tabs[activeTab].Id;
						$stateParams.view = '';

						if (!currentModule.initialized) {
							const promises = [];

							_.each(_.keys(moduleOptions.resolve), function (prop) {
								promises.push($injector.invoke(moduleOptions.resolve[prop]));
							});

							promises.push(platformPermissionService.registerObjectPermissionFallback(currentModule.name));

							return $q.all(promises)
								.then(() => {
									if (currentModule) {
										currentModule.initialized = true;
										if (currentModule.controller && currentModule.controller !== '') {
											$controller(currentModule.controller, {'$scope': currentModule.scope});
										}

										return platformGenericStructureService.retrieveServices(currentModule.name, currentModule.containers);
									}
								});
						}
						return true;
					}],
				globalResolves: ['$injector', '$q', '_', 'init',
					function ($injector, $q, _) { // jshint ignore:line
						if (globalResolves) {
							const promises = [];

							_.each(Object.getOwnPropertyNames(globalResolves), function (prop) {
								promises.push($injector.invoke(globalResolves[prop]));
							});

							return $q.all(promises);
						}
						return true;
					}]
			};

			const url = '^/' + moduleOptions.moduleName.replace('.', '/') + '/:tab/:view';

			$stateProvider.state(stateName, {
				url: url,
				template: '<div class="fullheight" main-view></div>',
				resolve: resolveModuleTransition
			});
		};

		// set active tab
		function getActiveTabObject() {
			// check, if tab index (activeTabIndex) set from outside
			return activeTabIndex ? _.find(currentModule.tabs, {Id: activeTabIndex}) : _.find(currentModule.tabs, {activeView: {Isactivetab: true}});
		}

		/**
		 * @ngdoc function
		 * @name registerRoute
		 * @function
		 * @methodOf platform:platformMainViewService
		 * @description Registeres a route with ui-router.stomData
		 * @param options
		 */
		provider.registerRoute = function (options) {
			// noinspection JSUnresolvedVariable
			$stateProvider.state(options.stateName, options);
		};

		/**
		 * @ngdoc service
		 * @function
		 * @requires $state
		 * @requires $http
		 * @requires $q
		 *
		 * @description returns the service of this provider.
		 */
		provider.$get = MainViewService;

		return provider;
	};

	/**
	 *
	 * @type {string[]}
	 */
	MainViewServiceProvider.$inject = ['$stateProvider', 'globals'];

	/**
	 * @ngdoc provider
	 * @name platform.mainViewService
	 * @function
	 * @requires $stateProvider
	 *
	 * @description Main view service that manages the layout and ui elements of the main view.
	 */
	angular.module('platform').provider('mainViewService', MainViewServiceProvider);
})(angular, Platform, _);
