/*
 * $Id: pinningcontext-service.js 633699 2021-04-23 14:29:37Z alisch $
 * Copyright (c) RIB Software SE
 */

/**
 * Created by rei on 11.06.2015.
 global console
 */

(function (angular) {
	'use strict';

	/**
	 *
	 */
	angular.module('cloud.desktop').factory('cloudDesktopPinningContextService', cloudDesktopPinningContextService);

	cloudDesktopPinningContextService.$inject = ['_', 'moment', '$injector', '$q', '$http', '$translate', 'platformContextService', 'initApp', 'cloudDesktopSidebarService', 'platformModuleInfoService', 'platformContextMenuTypes'];

	function cloudDesktopPinningContextService(_, moment, $injector, $q, $http, $translate, platformContextService, initAppService, sidebarService, platformModuleInfoService, platformContextMenuTypes) { // jshint ignore:line

		var self = this; // jshint ignore:line

		// project Context is handled here
		// 13.04.2016@rei:  added support save pinning context by logon company id
		Object.defineProperties(self, {
			'appPinningContextKey': {
				get: function () {
					return 'sb.PinningCtx.' + platformContextService.clientId;
				}, enumerable: true
			}
		});

		var projectContextToken = 'project.main';

		var onSetPinningContext = new Platform.Messenger();
		var onClearPinningContext = new Platform.Messenger();
		var showPinningContext = [];  // array of {token: {string}, show: {boolean} } indicate if pinned item are shown
		var thePinningOptions;         // keep current pinning options for fast access
		var currentPinningContext = [];

		var textNoItemFound = $translate.instant('cloud.desktop.sbPinningContextnotAvailable');

		/**
		 * constructs a pinning item for the pinning context
		 *
		 * {token: 'businesspartner.main', id: 23, info: 'Paul Sommersby limittes' }
		 * @param token   the token, identifies the primary key of the main entity
		 * @param id      primary key of the main entity
		 * @param info    Name to be displayed in Sdebar or otherwise for the pinned item.
		 * @constructor
		 */
		function PinningItem(token, id, info) {
			this.token = token;
			this.id = id;
			this.info = info;
		}

		/**
		 *
		 * @param token
		 * @param show
		 * @constructor
		 */
		function ShowPinningItem(token, show) {
			this.token = token;
			this.show = show;
		}

		/**
		 * forwarded to {cloudDesktopPinningContextService}.{showPinningItemEnabled}
		 * @param token
		 * @returns {string} token    name of the pinning item i.e. 'businesspartner.main'
		 */
		function getPinningItemIcon(token) {
			var icon = 'app-small-icons ';
			icon += platformModuleInfoService.getImageClass(token);
			return icon;
		}

		/**
		 * forwarded to {cloudDesktopPinningContextService}.{showPinningItemEnabled}
		 * @param token
		 * @returns {string} token    name of the pinning item i.e. 'businesspartner.main'
		 */
		function getPinningItemModuleName(token) {
			var name = platformModuleInfoService.getI18NName(token);
			return name;
		}

		/**
		 * Project Context specific behaviour
		 * if there is a Project context we have following behaviour:
		 *  if pinningItem (projectContext) id remains the same id,
		 *    we do not clear current context but keep or overwrite existing pinningItems or
		 *  other we clear the context and assign the new value
		 *
		 * @param {array of pinningItem}  newPinningContext
		 */
		function checkProjectContext(newPinningContext) {

			// project specific handling
			var projCtx = _.find(currentPinningContext, {token: projectContextToken});
			if (projCtx) {
				var newProjCtx = _.find(newPinningContext, {token: projectContextToken});
				if (newProjCtx && (projCtx.id === newProjCtx.id)) {
					// merge both context together
					var u1 = _.union(newPinningContext, currentPinningContext); // first concat array
					var mergedContext = _.uniqBy(u1, 'token'); // remove duplicate entries
					return mergedContext;
				}
			}
			return newPinningContext;
		}

		/**
		 * This function sets the pinning context.
		 *
		 * @param {PinningItem} pinningContext PinningItem or array of PinningItems.
		 * @param {DataService} dataService
		 */
		function setContext(pinningContext, dataService) {
			if (!pinningContext) {
				clearContext();
				return;
			}

			// currentPinningContext = _.isArray(pinningContext) ? pinningContext : [pinningContext];

			currentPinningContext = checkProjectContext(_.isArray(pinningContext) ? pinningContext : [pinningContext]);
			var appPinnedKey = self.appPinningContextKey;

			// rei@15.4.16  check not working because application data contains reference,
			// TODO: use copy of currentPinningContext
			// var currentVal = platformContextService.getApplicationValue(appPinnedKey);
			// is there a change?
			// if (!_.isEqual(currentVal, currentPinningContext)) {
			platformContextService.setApplicationValue(appPinnedKey, currentPinningContext, true);
			platformContextService.saveContextToLocalStorage(); // save under current user context

			// notify sidebar and other
			sidebarService.filterRequest.setPinningContext(currentPinningContext);
			onSetPinningContext.fire(currentPinningContext, dataService);
			// }
		}

		/**
		 * This function resets the pinning context to empty
		 *
		 */
		function clearContext() {
			var appPinnedKey = self.appPinningContextKey;
			var currentVal = platformContextService.getApplicationValue(self.appPinningContextKey);
			if (currentVal) {
				platformContextService.removeApplicationValue(appPinnedKey);
				sidebarService.filterRequest.setPinningContext();
				platformContextService.saveContextToLocalStorage(); // save under current user context
			}
			currentPinningContext = [];
			onClearPinningContext.fire();
		}

		function getContext() {
			var appPinnedKey = self.appPinningContextKey;
			currentPinningContext = platformContextService.getApplicationValue(appPinnedKey);
			return currentPinningContext;
		}

		/**
		 * This function defines the pinning item which should be shown in sidebar as row like: [icon][ info text  ][x]
		 *
		 * @param {array of ShowPinningItem} pinningOptions  [ {token: {string}, show: {boolean} }]
		 */
		function setPinningOptions(pinningOptions) {
			thePinningOptions = pinningOptions || {isActive: false, showPinningContext: []};
			if (thePinningOptions.isActive && thePinningOptions.showPinningContext) {
				showPinningContext = thePinningOptions.showPinningContext;
			} else {
				showPinningContext = [];
			}
		}

		/**
		 * This function removes corresponding a pinned Item (token) from pinningContext if found
		 * and save the pinningContext to local storage,
		 * @param token
		 * @returns {*}
		 */
		function clearPinningItem(token) {
			if (!currentPinningContext) {
				return textNoItemFound;
			}

			// if we delete the project context, we clear all others as well
			if (_.isEqual(token, projectContextToken)) {
				setContext();
				return;
			}

			var found = _.remove(currentPinningContext, {token: token});
			if (found) {
				setContext(currentPinningContext);
			}
			return found;
		}

		/**
		 * @ngdoc function
		 * @name IsAnyPinningContextVisbile
		 * @function
		 * @methodOf cloudDesktopPinningContextService
		 * @description Indicates whether a pin to be displayed exists.
		 * @param { bool } showAlways If true, only the pinning context must exist for true to be returned.
		 * @returns {bool} True, if a pin to be displayed exists.
		 */
		function isAnyPinningContextVisbile(showAlways) {
			if (showPinningContext.length === 0) {
				return false;
			}

			_.forEach(currentPinningContext, (pinningContext) => {
				if (showAlways || _.find(showPinningContext, {token: pinningContext.token, show: true})) {
					return true;
				}
			});

			return false;
		}

		function getVisiblePinningContexts(tokens = [], showAlways) {
			let visiblePinningContexts = [];
			let searchedToken = _.isArray(tokens) ? tokens : [tokens];

			if (showPinningContext.length === 0) {
				return visiblePinningContexts;
			}

			if (searchedToken.length) {
				_.forEach(searchedToken, token => {
					let visiblePinningContext = _.find(showPinningContext, {token: token, show: true});
					let pinnedItem = _.find(currentPinningContext, {token: token});
					if (pinnedItem && (visiblePinningContext || showAlways)) {

						visiblePinningContexts.push(getEnrichedPinningContext(pinnedItem));
					}
				});
			} else {
				_.forEach(currentPinningContext, (pinningContext) => {
					let visiblePinningContext = _.find(showPinningContext, {token: pinningContext.token, show: true});
					if (showAlways || visiblePinningContext) {
						visiblePinningContexts.push(getEnrichedPinningContext(pinningContext));
					}
				});
			}

			return sortPinningContexts(visiblePinningContexts);
		}

		function sortPinningContexts(pinningContextsArray) {
			return _.sortBy(pinningContextsArray, function (pc) {
				let index = _.indexOf(tokens, pc.token);
				return index > -1 ? index : 9999;
			});
		}

		function getEnrichedPinningContext(pinningContext) {
			if (_.isUndefined(pinningContext) && _.isObject(pinningContext)) {
				return;
			}

			let moduleName = platformModuleInfoService.getI18NName(pinningContext.token);

			return _.assign({}, pinningContext, {
				title: moduleName + ': ' + pinningContext.info,
				icon: getPinningItemIcon(pinningContext.token)
			});
		}

		/**
		 * @param token
		 * @returns {boolean}
		 */
		function showPinningItemEnabled(token, showAlways) {
			if (!showPinningContext) {
				return false;
			}

			var showEnabled = _.find(showPinningContext, {token: token, show: true});
			if (showAlways === true) { // override show
				showEnabled = true;
			}
			var pinnedItemFound = _.find(currentPinningContext, {token: token});

			return (showEnabled && pinnedItemFound);
		}

		/**
		 * @param token
		 * @returns {boolean}
		 */
		function getPinningItem(token) {
			if (!currentPinningContext) {
				return null;
			}
			return _.find(currentPinningContext, {token: token});
		}

		/**
		 * @param token
		 * @returns {boolean}
		 */
		function getPinningItemInfo(token) {
			return _.get(getPinningItem(token), 'info', textNoItemFound);
		}

		/**
		 * @param token
		 * @returns {integer}
		 */
		function getPinnedId(token) {
			let pinningItem = getPinningItem(token);
			return pinningItem ? pinningItem.id : null;
		}

		/**
		 * This function add and remove watchlist buttons into the toolbar.
		 *
		 * @param {$scope}  the container scope holding the tools.items property
		 * @param {dataService} dataservice, require for getting selected items
		 */
		function getPinningToolbarButton($scope, dataService) {
			var callbackFct;
			var disableContextBtnCbFct;
			var modelCallbackFct;
			var disableModelContextBtnCbFct;
			var returnBtns = [];

			if (dataService && _.isFunction(dataService.getPinningOptions)) {
				var options = dataService.getPinningOptions();
				if (options) {
					if (_.isFunction(options.setContextCallback)) {
						callbackFct = options.setContextCallback;
					}
					if (_.isFunction(options.disableContextBtnCallback)) {
						disableContextBtnCbFct = options.disableContextBtnCallback;
					}
					if (_.isFunction(options.setModelContextCallback)) {
						modelCallbackFct = options.setModelContextCallback;
					}
					if (_.isFunction(options.disableModelContextBtnCallback)) {
						disableModelContextBtnCbFct = options.disableModelContextBtnCallback;
					}
				}
			}

			/**
			 * Check dataService for selected item
			 * @returns {boolean}
			 */
			function checkDisabledWithButtonId(buttonId) {
				if (dataService) {
					var selected = dataService.getSelected();
					if (selected && selected.Id) {
						if (buttonId === 't-pinningctx' && _.isFunction(disableContextBtnCbFct)) {
							/* pinning context disable callback, will be called to enable/disable toolbar button
							 parameter:  selected item from dataservice
							 return false: enable button;   true: disable button
						 */
							var ret = disableContextBtnCbFct(selected);
							// console.log('checkPinningButtonDisabled', ret);
							return ret;
						} else if(buttonId === 't-pinningctx-model' && _.isFunction(disableModelContextBtnCbFct)) {
							return disableModelContextBtnCbFct(selected);
						} else {
							return false;
						}
					}
					return true;
				}
				return true;
			}

			function checkPinningButtonDisabled(){
				return checkDisabledWithButtonId('t-pinningctx');
			}

			function checkModelPinningButtonDisabled(){
				return checkDisabledWithButtonId('t-pinningctx-model');
			}

			returnBtns.push({
				id: 't-pinningctx',
				type: 'item',
				caption: $translate.instant('cloud.common.toolbarPinningContext'),
				iconClass: 'tlb-icons ico-set-prj-context',  // must be unique in whole itemList
				disabled: checkPinningButtonDisabled,
				fn: function () {
					var opResult;
					if (_.isFunction(callbackFct)) {
						opResult = callbackFct(dataService) || 1;
					} else {
						if (dataService && _.isFunction(dataService.setPinnningContext)) {
							opResult = dataService.setPinnningContext(dataService) || 1;
						}
					}
					if (opResult) {
						$q.when(opResult).then(function () {
							$scope.getUiAddOns().getAlarm().show(formatPinnedMessageByDataService(dataService));
						});
					}
				},
				contextAreas: [platformContextMenuTypes.gridRow.type]
			});

			if(_.isFunction(modelCallbackFct)){
				returnBtns.push({
					id: 't-pinningctx-model',
					type: 'item',
					caption: $translate.instant('cloud.common.toolbarPinningModelContext'),
					iconClass: 'tlb-icons ico-pin-model',
					disabled: checkModelPinningButtonDisabled,
					fn: function () {
						var opResult = modelCallbackFct(dataService) || 1;
						$q.when(opResult).then(function () {
							$scope.getUiAddOns().getAlarm().show(formatPinnedMessageByDataService(dataService,
								$translate.instant('model.main.entityModel')));
						});
					},
					contextAreas: [platformContextMenuTypes.gridRow.type]
				});
			}

			return returnBtns;
		}

		function formatPinnedMessageByDataService(dataService, entityName) {
			return $translate.instant('cloud.desktop.entityPinnedMessage', {
				entity: (function retrieveEntityName() {
					if (_.isString(entityName)){
						return entityName;
					}
					if (dataService && _.isFunction(dataService.getTranslatedEntityName)) {
						var eName = dataService.getTranslatedEntityName();
						if (eName) {
							return eName;
						}
					}
					return $translate.instant('cloud.desktop.entityPinnedDefaultEntity');
				})()
			});
		}

		/**
		 *
		 * @param string1
		 * @param string2
		 * @param delimiter
		 * @returns {string}
		 */
		function concate2StringsWithDelimiter(string1, string2, delimiter) {
			var result = '' + string1 ? string1 : '';
			result += (string1 && string2) ? delimiter : '';
			result += (string2) ? string2 : '';
			return result;
		}

		/**
		 * return a promise
		 * if project found it returns pinningItem
		 * @param projectFk
		 * @returns {*}
		 */
		function getProjectContextItem(projectFk) {
			var basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');
			return basicsLookupdataLookupDataService.getItemByKey('Project', projectFk).then(function (projectItem) {
				projectItem = projectItem ? projectItem : {ProjectNo: '*'};
				var projectContextItem = new PinningItem('project.main', projectFk, concate2StringsWithDelimiter(projectItem.ProjectNo, projectItem.ProjectName, ' - '));
				return projectContextItem;
			});
		}

		/**
		 * return a promise
		 * if model found it returns pinningItem
		 * @param modelFk
		 * @returns {*}
		 */
		function getModelContextItem(modelFk) {
			return $http.get(globals.webApiBaseUrl + 'model/project/model/getbyid?id=' + modelFk).then(function (response) {
					if(response.data){
						var modelContextItem = new PinningItem('model.main', modelFk,
							concate2StringsWithDelimiter(response.data.Code, response.data.Description, ' - '));
						return modelContextItem;
					}
			});
		}

		/**
		 *
		 * @param dataService
		 * @param projectProperty
		 * @returns {*}
		 */
		function setCurrentProjectToPinnningContext(dataService, projectProperty, selected) {
			var currentItem = selected || dataService.getSelected() || {};
			var projectFk = currentItem[projectProperty] || currentItem.ProjectFk;
			if (angular.isNumber(projectFk)) {
				return getProjectContextItem(projectFk).then(function (projectPinningItem) {
					setContext(projectPinningItem, dataService);
				});
			}
			return $q.when(true);
		}

		/**
		 *
		 * @param dataService
		 * @param modelProperty
		 * @returns {*}
		 */
		function setCurrentModelToPinnningContext(dataService, modelProperty, projectProperty, selected) {
			var currentItem = selected || dataService.getSelected() || {};
			var modelFk = currentItem[modelProperty] || currentItem.ModelFk;
			let modelPromise = $q.when(true);
			const pinningContext = [];
			if (currentItem){
				if (angular.isNumber(modelFk)) {
					modelPromise = getModelContextItem(modelFk).then(function (modelPinningItem) {
						pinningContext.push(modelPinningItem);
					});

					if(projectProperty && angular.isNumber(currentItem[projectProperty])){
						// If project is pinned, check if it is the same with current model's project
						// If yes, then the project should stay pinned in context
						const pinnedContext = getContext();
						if (pinnedContext) {
							const projectContext = _.find(pinnedContext, {token: "project.main"});
							if (projectContext && projectContext.id === currentItem[projectProperty]) {
								pinningContext.push(projectContext);
							}
						}
					}
				}
			}
			return $q.all([modelPromise]).then(
				function () {
					if (pinningContext.length > 0) {
						setContext(pinningContext, dataService);
					}
				});
		}

		var pinnableEntityServices = {};

		function createPinnableEntityService(config) {
			if (!angular.isDefined(config.token)) {
				throw new Error('No pinnable entity ID specified.');
			}
			if (pinnableEntityServices[config.token]) {
				throw new Error('Pinnable entity ID ' + config.token + ' has already been registered.');
			}

			var state = {
				token: config.token,
				retrieveInfo: angular.isFunction(config.retrieveInfo) ? config.retrieveInfo : function () {
					return $q.when(true);
				},
				dependsUpon: angular.isArray(config.dependsUpon) ? config.dependsUpon.slice(0) : (angular.isString(config.dependsUpon) ? [config.dependsUpon] : []),
				doPin: function (ids, visited, pinningContextPromises) {
					if (!angular.isDefined(ids[state.token])) {
						throw new Error('No ID of type ' + state.token + ' provided for pinning.');
					}

					if (visited[state.token]) {
						return;
					}
					visited[state.token] = true;

					var id = ids[state.token];
					pinningContextPromises.push(state.retrieveInfo(id, _.cloneDeep(ids)).then(function (info) {
						return new PinningItem(state.token, id, info);
					}));

					state.dependsUpon.forEach(function (dependentId) {
						var dependentSvc = pinnableEntityServices[dependentId];
						if (dependentSvc) {
							dependentSvc.state.doPin(ids, visited, pinningContextPromises);
						}
					});
				}
			};

			var svc = {
				pin: function (ids, dataService) {
					var pinningContextPromises = [];
					state.doPin(ids, {}, pinningContextPromises);
					return $q.all(pinningContextPromises).then(function (newContext) {
						var context = getContext() || [];
						newContext.forEach(function (ctxItem) {
							var index = _.findIndex(context, {token: ctxItem.token});
							if (index >= 0) {
								context[index] = ctxItem;
							} else {
								context.push(ctxItem);
							}
						});
						setContext(context, dataService);
					});
				},
				getPinned: function () {
					var pinningItem = getPinningItem(state.token);
					if (pinningItem) {
						return pinningItem.id;
					} else {
						return null;
					}
				},
				getPinnedInfo: function () {
					var pinningItem = getPinningItem(state.token);
					if (pinningItem) {
						var result = pinningItem.info;
						if (angular.isString(result)) {
							return result;
						} else {
							return '';
						}
					} else {
						return null;
					}
				},
				appendId: function (ids, id) {
					ids[state.token] = id;
				},
				extractId: function (ids) {
					return ids[state.token];
				},
				clear: function () {
					clearPinningItem(state.token);
				}
			};

			pinnableEntityServices[state.token] = {
				service: svc,
				state: state
			};

			return svc;
		}

		/*
		* write tokens here for common usage
		* should keep consistent with \cloud.desktop\templates\sidebar\sidebar-search-google.html
		* */
		let tokens = [];
		tokens.projectToken = projectContextToken;
		tokens.schedulingToken = 'scheduling.main';
		tokens.estimateToken = 'estimate.main';
		tokens.cstrSysToken = 'constructionsystem.main';
		tokens.mdlToken = 'model.main';
		tokens.mdlChangeSetToken = 'model.changeset';
		tokens.ppsItemToken = 'productionplanning.item';
		tokens.ppsMntToken = 'productionplanning.mounting'; // stand for mounting requisition
		tokens.ppsMntActToken = 'productionplanning.activity';
		tokens.ppsMntRptToken = 'productionplanning.report';
		tokens.ppsMntEngToken = 'productionplanning.engineering';
		tokens.ppsEngDrawingToken = 'productionplanning.drawing';
		tokens.trsReqToken = 'transportplanning.requisition';
		tokens.trsBundleToken = 'transportplanning.bundle';
		tokens.trsTransportToken = 'transportplanning.transport';
		tokens.logisticJobToken = 'logistic.job';
		tokens.push.apply(tokens, _.map(Object.keys(tokens), function (key) {
			return tokens[key];
		}));

		// all method support by this service listed here
		return {
			// constructor functions
			PinningItem: PinningItem,
			ShowPinningItem: ShowPinningItem,
			// events
			onSetPinningContext: onSetPinningContext,
			onClearPinningContext: onClearPinningContext,

			// other functions
			getPinningItem: getPinningItem,
			getPinningItemIcon: getPinningItemIcon,
			getPinningItemModuleName: getPinningItemModuleName,
			setPinningOptions: setPinningOptions,
			showPinningItemEnabled: showPinningItemEnabled,
			getPinningItemInfo: getPinningItemInfo,
			getPinnedId: getPinnedId,
			setContext: setContext,
			clearContext: clearContext,
			getContext: getContext,
			clearPinningItem: clearPinningItem,
			getPinningToolbarButton: getPinningToolbarButton,
			formatPinnedMessageByDataService: formatPinnedMessageByDataService,

			// helper service for reading Project Context Info
			setCurrentProjectToPinnningContext: setCurrentProjectToPinnningContext,
			setCurrentModelToPinnningContext: setCurrentModelToPinnningContext,
			getProjectContextItem: getProjectContextItem,
			getModelContextItem: getModelContextItem,
			concate2StringsWithDelimiter: concate2StringsWithDelimiter,

			createPinnableEntityService: createPinnableEntityService,
			tokens: tokens,

			isAnyPinningContextVisbile: isAnyPinningContextVisbile,
			getVisiblePinningContexts: getVisiblePinningContexts

		};
	}
})(angular);
