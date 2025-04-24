/*
 * $Id: sidebar-service.js 634244 2021-04-27 12:11:57Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, $, Platform */
	'use strict';
	// noinspection JSAnnotator
	angular.module('cloud.desktop').factory('cloudDesktopSidebarService',
		['$rootScope', 'platformTranslateService', 'platformContextService', 'cloudCommonLastObjectsService', '$translate',
			'$injector', '$templateCache', 'cloudDesktopSidebarAutofilterService', '_', 'PlatformMessenger', '$http', 'basicCustomizeSystemoptionLookupDataService', '$q', 'mainViewService', 'basicsConfigNavCommandbarService', 'platformNavBarService',
			function ($rootScope, platformTranslateService, platformContextService, lastObjectsService, $translate, $injector,
				$templateCache, cloudDesktopSidebarAutofilterService, _, PlatformMessenger, $http, basicCustomizeSystemoptionLookupDataService, $q, mainViewService, basicsConfigNavCommandbarService, platformNavBarService) { // jshint ignore:line
				var service = {};
				var currentFilterModuleName;  // holding current Filter Modulename
				service.scope = null;

				var isInNewModule = false;
				var patternHasBeenResettedFlag = false;
				var navigateToModule = null;

				var eFilterService = null;  // enhanced Filter Service: >>> will be filled by $injector on first call
				var pinningContextService = null;
				var pinningFilterService = null;
				var searchFormService = null;

				var bulkSearchService = null;
				var bulkFormService = null;

				var companyLoginContextService = null;

				var autoFilter;

				service.recordPerPageMaxValue = 500;
				service.recordPerPageStandardValue = 100;
				service.recordPerPageDataFetched = false;

				// static variables to store page size
				const pageSizeUuid = '503ba4c157614ecebfbe2e6f6de6f62f';
				const pageSizeSettingsKey = 'sidebarPageSize';

				service.readRecordPerPageStandardSize = function () {
					if (!service.recordPerPageDataFetched) {
						return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/standardRecordPerPage').then(function (resp) {
							service.recordPerPageStandardValue = resp.data;
							service.recordPerPageDataFetched = true;
							return true;
						});
					} else {
						return $q.when(true);
					}
				};

				service.currentSearchType = '';  // reflects the current active search tpye:  'google', 'enhanced' ...
				service.settingsActive = null; // refelcts whether settings tab is opened or closed

				function getSidebarIdAsId(id) {
					return '#' + id;
				}

				var sidebarIds = {
					quickStart: 'sidebar-quickstart',
					search: 'sidebar-search',
					info: 'sidebar-info',
					modelObjectSearch: 'sidebar-modelObjectSearch',
					lastobjects: 'sidebar-lastobjects',
					watchlist: 'sidebar-watchlist',
					projectNavi: 'sidebar-prjNavi',
					reports: 'sidebar-reports',
					inquiry: 'sidebar-inquiry',
					newWizards: 'sidebar-newWizard',
					workflow: 'workflow',
					oneDrive: 'sidebar-oneDrive',
					chatBot: 'sidebar-chatBot',
					notification: 'sidebar-notification',
					outlook: 'sidebar-outlook',
					getId: getSidebarIdAsId
				};

				service.patternHasBeenResetted = function () {
					return patternHasBeenResettedFlag;
				};

				service.getSidebarIdAsId = getSidebarIdAsId;

				service.getSidebarIds = function () {
					return sidebarIds;
				};

				// sidebar messengers
				service.onExecuteSearchFilter = new Platform.Messenger();
				service.onCloseSidebar = new Platform.Messenger();
				service.onOpenSidebar = new Platform.Messenger();
				service.onClosingSidebar = new Platform.Messenger();
				service.onModuleChanged = new Platform.Messenger();
				service.onAutoFilterChanged = new Platform.Messenger();
				service.onAutoFilterLoaded = new Platform.Messenger();
				service.closeSidebar = new Platform.Messenger();
				service.openSidebar = new Platform.Messenger();
				service.pineSidebar = new Platform.Messenger();
				service.filterChanged = new PlatformMessenger();
				service.onFilterReady = new PlatformMessenger();

				// default settings for sidebar commands
				var showOptionsDefault = [
					{ sidebarId: sidebarIds.quickStart, active: !globals.portal },
					{ sidebarId: sidebarIds.projectNavi, active: !globals.portal },
					{ sidebarId: sidebarIds.search, active: false },
					{ sidebarId: sidebarIds.info, active: false },
					{ sidebarId: sidebarIds.modelObjectSearch, active: false },
					{ sidebarId: sidebarIds.watchlist, active: false },
					{ sidebarId: sidebarIds.lastobjects, active: !globals.portal },
					{ sidebarId: sidebarIds.reports, active: false },
					// {sidebarId: sidebarIds.inquiry, active: false},
					{ sidebarId: sidebarIds.newWizards, active: false },
					{ sidebarId: sidebarIds.oneDrive, active: true },
					{ sidebarId: sidebarIds.chatBot, active: true }
				];

				/**
				 * @function
				 * @description returns true if sidebarId is by defualt active
				 * @param sidebarId
				 * @returns {*}
				 */
				function checkCurrentSidebarContainerOtherwiseToQuickstart() {

					if (!service.scope || !service.scope.sidebarOptions) {
						return;
					}
					var lbId = service.scope.sidebarOptions.lastButtonId || '';
					if (lbId.length > 0) { // there is sidebar container opened
						var sidebarId = lbId.replace('#', '');
						var isActive = _.find(showOptionsDefault, { sidebarId: sidebarId, active: true });

						if (!isActive) {  // switch to sidebar quick-start in case of pinned and container not valid for desktop
							service.scope.cmdbarredirectTo(sidebarIds.getId(sidebarIds.quickStart));
						}
					}
				}

				// //////////////////////////////////////////////////////////////////////////////////////////////
				// all sidebar tabs are defined here
				// //////////////////////////////////////////////////////////////////////////////////////////////
				var CommandItem = function CommandItem(_id, _caption, _hideItem, _cssClass, _svgSprite, _svgImage, _sortOder, _configurable) {
					this.id = sidebarIds.getId(_id);
					this.caption$tr$ = _caption;
					this.hideItem = _hideItem;
					this.cssClass = _cssClass + ' item-id_' + _id;
					this.type = 'item';
					this.showSVGTag = true;
					this.svgSprite = _svgSprite;
					this.svgImage = _svgImage;
					this.sortOrder = _sortOder !== undefined ? _sortOder : 999;
					this.configurable = _configurable !== undefined ? _configurable : true;
					this.showIndicator = false;
				};

				CommandItem.prototype.fn = function fn(event) {
					service.scope.cmdbarredirectTo(event);
				};

				var inquiryCommandItem = new CommandItem(sidebarIds.inquiry, 'cloud.desktop.sdCmdBarinquiry', true, 'indicator', 'sidebar-icons', 'ico-inquiry', null, false);

				$templateCache.loadTemplateFile('cloud.desktop/templates/sidebar/inquiry/sidebar-inquiry-template.html').then(function () {
					inquiryCommandItem.buttonTemplate = $templateCache.get('cloud.desktop/inquiry-notify-button.html');
				});
				// inquiryCommandItem.iconClass = 'ico-inquiry';

				var defaultCommandbarList = [
					new CommandItem(sidebarIds.quickStart, 'cloud.desktop.sdCmdBarQuickstart', true, 'indicator', 'sidebar-icons', 'ico-apps', 1),
					new CommandItem(sidebarIds.projectNavi, 'cloud.desktop.sdCmdBarPrjNavi', true, 'indicator', 'sidebar-icons', 'ico-project-favorites', 2),
					new CommandItem(sidebarIds.search, 'cloud.desktop.sdCmdBarSearch', true, 'indicator', 'sidebar-icons', 'ico-search', 3),
					new CommandItem(sidebarIds.info, 'cloud.desktop.sdCmdBarInfo', true, 'indicator', 'sidebar-icons', 'ico-info', 4),
					new CommandItem(sidebarIds.modelObjectSearch, 'model.main.objectSidebar.cmdBarSearch', true, 'indicator', 'sidebar-icons', 'ico-object-filter', 5),
					new CommandItem(sidebarIds.watchlist, 'cloud.desktop.sdCmdBarWatchlist', true, 'indicator', 'sidebar-icons', 'ico-watchlists', 6),
					new CommandItem(sidebarIds.lastobjects, 'cloud.desktop.sdCmdBarLastObjects', true, 'indicator', 'sidebar-icons', 'ico-last-objects', 7),
					new CommandItem(sidebarIds.reports, 'cloud.desktop.sdCmdBarReport', true, 'indicator', 'sidebar-icons', 'ico-report', 8),
					new CommandItem(sidebarIds.newWizards, 'cloud.desktop.sdCmdBarWizard', true, 'indicator', 'sidebar-icons', 'ico-wiz', 9),
					new CommandItem(sidebarIds.oneDrive, 'cloud.desktop.sdCmdBarOneDrive', true, 'indicator', 'sidebar-icons', 'ico-onedrive', 10),
					new CommandItem(sidebarIds.chatBot, 'cloud.desktop.sdCmdBarChatBot', true, 'indicator', 'sidebar-icons', 'ico-chatbot', 11),
					new CommandItem(sidebarIds.outlook, 'cloud.desktop.sdCmdBarOutlook', true, 'indicator', 'sidebar-icons', 'ico-outlook', 12)
				];

				var searchIndex = defaultCommandbarList.findIndex(x => x.id === '#sidebar-search');

				service.updateNavbarRefreshTooltip = function updateNavbarRefreshTooltip(filterString) {
					let searchFunctionName = '';
					let searchText = '';
					let searchResult = '';
					switch (service.currentSearchType) {
						case 'google':
							defaultCommandbarList[searchIndex].svgImage = 'ico-search-standard';
							searchFunctionName = $translate.instant('cloud.desktop.searchGoogle.maintitle');
							searchText = $translate.instant('cloud.desktop.titleSearchCriteria') + $translate.instant('cloud.desktop.titleNoSearchTerm');
							searchResult = $translate.instant('cloud.desktop.titleAllRecord');
							if (filterString !== '') {
								searchText = $translate.instant('cloud.desktop.titleSearchCriteria') + '"' + filterString + '"';
								searchResult = $translate.instant('cloud.desktop.titleMatchRecord');
							}
							break;
						case 'bulk':
							defaultCommandbarList[searchIndex].svgImage = 'ico-search-enhanced';
							searchFunctionName = $translate.instant('cloud.desktop.searchEnhanced.maintitle');
							searchText = $translate.instant('cloud.desktop.titleSelectedSearch') + '"' + filterString + '"';
							searchResult = $translate.instant('cloud.desktop.titleMatchRecord');

							break;
						case 'bulkForm':
							defaultCommandbarList[searchIndex].svgImage = 'ico-search-form';
							searchFunctionName = $translate.instant('cloud.desktop.searchform.maintitle');
							searchText = $translate.instant('cloud.desktop.titleSelectedForm') + $translate.instant('cloud.desktop.titleNoSearchTerm');
							if (filterString !== '') {
								searchText = $translate.instant('cloud.desktop.titleSelectedForm') + '"' + filterString + '"';
								searchResult = $translate.instant('cloud.desktop.titleMatchRecord');
							}
							break;
						default:
							break;
					}

					let refreshBtn = platformNavBarService.getActionByKey('refresh');
					refreshBtn.tooltip = $translate.instant('cloud.desktop.navBarRefreshDesc') + '\n\n' + $translate.instant('cloud.desktop.titleCurrentSearch') + searchFunctionName + '\n' + searchText + '\n\n' + searchResult;

					if (filterString !== '') {
						defaultCommandbarList[searchIndex].showIndicator = true;
						refreshBtn.indicator = true;
					} else {
						defaultCommandbarList[searchIndex].showIndicator = false;
						refreshBtn.indicator = false;
					}
				};

				// definition for all available sidebar command, !!!! This list is fixed!!!
				service.commandBarDeclaration = {
					showImages: true,
					showTitles: true,
					toggleMode: true,
					showSelected: true,
					cssClass: 'flex-element',
					items: defaultCommandbarList
				};

				service.isSearchActive = function () {
					let searchItem = _.find(service.commandBarDeclaration.items, { id: '#' + sidebarIds.search });
					if (searchItem) {
						return !searchItem.hideItem;
					}
					return false;
				};

				// alm #100332, used in mainframe controllers sidebarOptions to populate the sidebar.
				service.getCommandBarWithoutHidden = function () {
					var commandBarDeclarationWithoutHiddenItems = {
						showImages: service.commandBarDeclaration.showImages,
						showTitles: service.commandBarDeclaration.showTitles,
						toggleMode: service.commandBarDeclaration.toggleMode,
						showSelected: service.commandBarDeclaration.showSelected,
						cssClass: service.commandBarDeclaration.cssClass,
						currentButton: service.commandBarDeclaration.currentButton,
						items: []
					};

					let list = _.filter(service.commandBarDeclaration.items, { hideItem: false });
					commandBarDeclarationWithoutHiddenItems.items = _.sortBy(list, ['sortOrder']);

					return commandBarDeclarationWithoutHiddenItems;
				};

				// ///////////////////////////////////////////////////////////////////////////////////////////////////////
				// definition of standard sidebar panels
				// ///////////////////////////////////////////////////////////////////////////////////////////////////////
				var quickStart = {
					name: sidebarIds.quickStart,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-quickstart.html'
				};
				var prjNavi = {
					name: sidebarIds.projectNavi,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/project-navigator/sidebar-project-navigator.html'
				};

				var watchlist = {
					name: sidebarIds.watchlist,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/watchlist/watchlist-container.html'
				};
				var lastObjects = {
					name: sidebarIds.lastobjects,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-lastobjects.html'
				};
				var search = {
					name: sidebarIds.search,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-main.html',
					isActive: function () {
						let searchItem = service.commandBarDeclaration.items.find(item => item.id === sidebarIds.search);
						return searchItem ? !searchItem.hideItem : true;
					}
				};
				var inquiry = {
					name: sidebarIds.inquiry,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/inquiry/sidebar-inquiry-main.html'
				};

				var oneDrive = {
					name: sidebarIds.oneDrive,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/one-drive/one-drive-main.html'
				};

				var chatBot = {
					name: sidebarIds.chatBot,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/chat-bot/chat-bot-main.html'
				};

				var notification = {
					name: sidebarIds.notification,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-notification.html'
				};

				let outlook = {
					name: sidebarIds.outlook,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/outlook/outlook-main.html'
				};

				var sidebarElements = [
					{
						name: sidebarIds.quickStart,
						element: quickStart
					},
					{
						name: sidebarIds.projectNavi,
						element: prjNavi
					},
					{
						name: sidebarIds.watchlist,
						element: watchlist
					},
					{
						name: sidebarIds.lastobjects,
						element: lastObjects
					},
					{
						name: sidebarIds.search,
						element: search
					},
					{
						name: sidebarIds.inquiry,
						element: inquiry
					},
					{
						name: sidebarIds.oneDrive,
						element: oneDrive
					},
					{
						name: sidebarIds.chatBot,
						element: chatBot
					},
					{
						name: sidebarIds.outlook,
						element: outlook
					}
				];

				service.sidebarElements = sidebarElements;

				$rootScope.$on('moduleConfigLoaded', function () {
					loadCommandbarConfiguration();
				});

				function loadCommandbarConfiguration() {
					let moduleConfig = basicsConfigNavCommandbarService.moduleConfigurations[$rootScope.currentModule];
					if (moduleConfig && moduleConfig.InternalName === $rootScope.currentModule && (globals.portal && (moduleConfig.CombarPortalEnabled) || (!globals.portal && moduleConfig.CombarEnabled)) && moduleConfig.CommandbarConfig.length > 0) {
						var cmdItems = defaultCommandbarList;
						let commandBar = [];
						cmdItems.forEach(function (item) {
							let combarItem = moduleConfig.CommandbarConfig.find(obj => {
								return '#' + obj.ItemCode === item.id;
							});
							if (combarItem) {
								item.hideItem = !combarItem.ConfigVisibility;
								item.sortOrder = combarItem.ConfigSorting;
							}
							commandBar.push(item);
						});
						service.commandBarDeclaration.items = _.sortBy(commandBar, ['sortOrder']);
					}
				}

				/**
				 *This method ass container and command button for external access inquiry
				 */
				service.addInquirySidebarandCommand = function () {
					service.registerSidebarContainer(inquiry, true, inquiryCommandItem);
				};

				var sidebarContainers = [];
				sidebarContainers.push(notification);
				service.sidebarContainers = sidebarContainers;

				service.getCommandBarItems = function () {
					let commandBarItems = [];
					service.sidebarContainers.forEach(function (item) {
						let found = service.commandBarDeclaration.items.find(element => element.id === '#' + item.name && element.configurable !== false);
						if (found) {
							commandBarItems.push(found);
						}
					});

					return _.sortBy(commandBarItems, ['sortOrder']);
				};

				service.showHideButtons = function (showOptions) {
					_.forEach(showOptions, function (item) {
						let sidebarElement = sidebarElements.find(i => i.name === item.sidebarId);
						if (sidebarElement || item.sidebarContainer) {
							removeSidebarContainer(item.sidebarId);
							if (item.active) {
								sidebarContainers.push(item.sidebarContainer ? item.sidebarContainer : sidebarElement.element);
							}
						}
						var found = _.find(service.commandBarDeclaration.items, { id: '#' + item.sidebarId });
						if (found) {
							found.hideItem = !item.active;
						}
					});
				};

				function removeSidebarContainer(name) {
					var found = _.find(sidebarContainers, function (item) {
						return item.name === name;
					});
					if (found) {
						var idx = sidebarContainers.indexOf(found);
						sidebarContainers.splice(idx, 1);
					}
				}

				/**
				 * Before a new panel will be added, an eventually old with same name will be removed
				 *
				 * @method registerSidebarContainer
				 * @param {object} sidebarContainerOptions
				 *   {name: {string},         name of the panel, must be one of the service.getSidebarIds, i.e. service.getSidebarIds.wizards
							type: 'template',       always 'template'
							templateUrl: {string}   url to the sidebar panel template
						};
				 * @param {bool } includeButton   if true command button in sidebar will be switched on
				 **/
				service.registerSidebarContainer = function (sidebarContainerOptions, includeButton, button) {
					if (button) {
						button.fn = CommandItem.prototype.fn;
						button.cssClass += ' item-id_' + button.id.replace('#', '');

						// remove eventually already registered old button i.e. external inquiry button
						_.remove(service.commandBarDeclaration.items, function (item) {
							return item.id === button.id;
						});

						service.commandBarDeclaration.items.push(button);
					}

					service.showHideButtons([{ sidebarId: sidebarContainerOptions.name, sidebarContainer: sidebarContainerOptions, active: includeButton }]);

					loadCommandbarConfiguration();
				};

				/**
				 * The method unregister a sidebar panel, which mean panel will be removed from the sidebar
				 *
				 * @method unRegisterSidebarContainer
				 * @param {string} sidebarContainerName   unregisters the sidebar panel with name idebarContainerName
				 * @param {bool } includeButton           if true command button in sidebar will be switched to invisible
				 **/
				service.unRegisterSidebarContainer = function (sidebarContainerName, includeButton) {
					removeSidebarContainer(sidebarContainerName);
					if (includeButton) {
						service.showHideButtons([{ sidebarId: sidebarContainerName, active: false }]);
					}
				};

				// L a s t o b j e c t   L i s t api functions placed here */
				// L a s t o b j e c t   L i s t api functions placed here */
				// L a s t o b j e c t   L i s t api functions placed here */
				/*
				 Create a new LastObject List and initializes it with modulename and prepares lst for adding
				 lastobjects
				 */
				service.createLastObjectList = function createLastObjectList(moduleName) {
					return {
						moduleName: moduleName,
						objects: []
					};
				};

				/* This method adds a lastObject to the lastobject List (loList)
				 */
				service.addLastObjectToList = function createLastObjectList(loList, summary, objectId) {
					loList.objects.push({ objectId: objectId, summary: summary });
				};

				/*
				 Create a new LastObject(s) determined by the lastObjectList.
				 update the client last objects, removes already listed lastobjects with same module and objectid from the list and adds
				 the new lastobjects on top of it.

				 @params lastObjectList {object}  the last object list ot following type
				 { moduleName: {string},
				 objects: [ {objectId: {int}, summary: {string}]
				 }
				 */
				service.addLastObjects = function addLastObjects(lastObjectList) {
					var newLoList = [];
					if (lastObjectList && lastObjectList.moduleName && lastObjectList.objects) {
						_.forEach(lastObjectList.objects, function (object) {
							var newLo = lastObjectsService.createLastObject(lastObjectList.moduleName, null, object.summary, object.objectId);
							newLoList.push(newLo);
						});
						lastObjectsService.addLastObjects(newLoList);
					}
				};

				/*
				 * This method executes sidebarFilter with Startup parameter from platfrom application context
				 *    Key is 'cloud.desktop.StartupParameter' if there is one,
				 * otherwise it returns false
				 if there is a startup parameter found, it'll be cleared
				 */
				service.checkStartupFilter = function checkStartupFilter() {
					// console.log('sidebar-service.checkStartupFilter');
					var startUpFilter = platformContextService.getApplicationValue('cloud.desktop.StartupParameter');
					if (startUpFilter && startUpFilter.filter) {
						// console.log('sidebar-service.checkStartupFilter:  startUpFilter recognized', startUpFilter.filter);
						platformContextService.removeApplicationValue('cloud.desktop.StartupParameter');
						if (_.isArray(startUpFilter.filter)) {
							service.filterSearchFromPKeys(startUpFilter.filter, startUpFilter.furtherFilter, startUpFilter.projectContextId);
						}
						if (_.isString(startUpFilter.filter)) {
							service.filterSearchFromPattern(startUpFilter.filter, startUpFilter.furtherFilter, startUpFilter.projectContextId);
						}
						return true;
					}
					return false;
				};

				/**
				 * @description set a startup filter for applications
				 * @example cloudDesktopSidebarService.setStartupFilter( {filter: [lo.proxy.ObjectId]} );
				 * @param filter
				 */
				service.setStartupFilter = function (filter) {
					platformContextService.setApplicationValue('cloud.desktop.StartupParameter', filter);
				};

				/**
				 * @function removeStartupFilter
				 * @description removes the startup filter for applications
				 * @example cloudDesktopSidebarService.removeStartupFilter();
				 * @param filter
				 */
				service.removeStartupFilter = function () {
					platformContextService.removeApplicationValue('cloud.desktop.StartupParameter');
				};

				// ^^^^^^^^ L a s t o b j e c t   E N D ^^^^^^^^

				// /////////////////////////////////////
				// !!! Hint !!!!: modification of FilterRequest must check as well:
				//    service.filterStartSearch = function (resetPageNumber)
				//    service.FilterRequest.prototype.filterRequestToServiceParameter
				// /////////////////////////////////////

				/**
				 * The constructor function for FilterRequest, all property are describe in detail belowbas
				 * @method FilterRequest constructor
				 * @param {int}   pageSize define the size of a page when reading data
				 **/
				service.FilterRequest = function FilterRequest(pageSize, pageNumber) {
					this.reset = function () {
						this.moduleName = undefined;  // the modulename of the caller i.e.:'cloud.boq' (new since 4.3.15)
						this.pattern = '';            // search pattern as string
						this.pKeys = null;            // representing primary keys of the entity to be retrieved
						// array of primary keys, normally integer array of primaray keys
						this.furtherFilters = null;   // tokenvalue array for transferring further filter parameter
						// TokenValueFilter [{ Token: {string}, Value: {string} }]
						this.pageSize = 100;          // number of records send back per request for one page
						this.pageNumber = 0;          // page numbere to be retrieved
						this.orderBy = null;          // optional, entity property name by which the result should be ordered,
						// an array of { Field: {strng} , Desc: {bool} }
						// order columname and descending/ascending flag, true is descinding
						this.showOptions = false;     // only display parameter, should be the Options below display in search panel
						this.useCurrentClient = null; // option property:      query should include the current client id while querying
						this.useCurrentProfitCenter = null; // option property: query should restrict the current profit center id while querying
						this.includeNonActiveItems = null; // option property: search in nonactive records as well
						this.includeReferenceLineItems = null; // option property: search in estimate module reference lineitems as well
						this.customOption = null;

						this.showProjectContext = false;// if showProjectContext is true, show projectContext is enabled,
						// The project context in search panel is display when projectContextId  is not null
						this.projectContextId = null; // query should include projectcontextId while querying as well
						this.projectContextInfo = null; // only display parameter, should contain a valid description of the project context,
						// not further used for filtering
						this.showPinningContext = []; // array of {token: {string}, show: {boolean} } indicate if pinning item(s) are shown
						this.pinningContext = [];          // the pinning context as array of Pinningtem(s)

						this.includeResultIds = null; // when returning the resultset, we want to have the primary keys of all  records.
						this.restoreEntities = null; // if true, autoFilter triggers search on fresh entry in module
						this.withExecutionHints = null; // if true, server might produce execution info and an textarea control is shown in search settings panel
						this.enhancedSearchEnabled = null; // is there an enhanced Serach avaliable
						this.enhancedSearchVersion = '1.0'; // version of the enhanced search
						this.containsGlobalData = null; //if true, it will suppress refresh at module start even if there is a pinning project

						this.includeDateSearch = null; // option property: enables the date search
						this.includeRadiusSearch = null; // option property: enables the radius search
						this.httpRoute = null; // the http route of the main data service, necessary for the new endpoint
						this.dateSearch = null; // object that contains the filter for a date search, which is added to furtherFilters during execution
					};
					this.reset();
					this.pageSize = pageSize;
					this.pageNumber = pageNumber;
				};

				/* all prototyp function to FilterRequest placed here */

				/**
				 * This method returns a FilterRequest(.netClass naming) object with default values coming from initial values from the module
				 * setup and user input data. Pattern is set to empty.
				 * @method filterRequestParams
				 * @param {int}   pageSize define the size of a page when reading data
				 **/
				function filterRequestParams(resetStartTime, isPending, enhancedFilterOptions, saveFilter) { // jshint ignore:line
					var fr = service.filterRequest;
					fr.isNavigateToModule = false;
					// TODO: .Net Core Porting: lst 2020-11-17 11:12:32 remove empty pin-item.
					if (fr.pinningContext && fr.pinningContext.length) {
						for (var i = 0; i < fr.pinningContext.length; i++) {
							var item = fr.pinningContext[i];
							if (!item.id) {
								fr.pinningContext.splice(i, 1);
								i--;
							}
						}
					}

					var execFilter = {
						Pattern: fr.pattern || null,
						PageSize: (fr.pageSize && fr.pageSize > 0) ? fr.pageSize : null,
						PageNumber: fr.pageNumber || 0,
						UseCurrentClient: fr.useCurrentClient,
						UseCurrentProfitCenter: fr.useCurrentProfitCenter,
						IncludeNonActiveItems: fr.includeNonActiveItems,
						IncludeReferenceLineItems: fr.includeReferenceLineItems,
						ProjectContextId: fr.projectContextId,
						PinningContext: fr.pinningContext,
						ExecutionHints: fr.withExecutionHints,
						GlobalData: fr.containsGlobalData
					};
					/* optional parameter, ommited if not there */
					if (fr.pKeys) {// representing primary keys of the entity to be retrieved
						execFilter.PKeys = fr.pKeys;
					}
					if (fr.inc) {// tokenvalue array for transferring further filter parameter
						execFilter.furtherFilters = fr.furtherFilters;
					}
					if (fr.includeResultIds) {// tokenvalue array for transferring further filter parameter
						execFilter.IncludeResultIds = fr.includeResultIds;
					}
					if (fr.furtherFilters) {// tokenvalue array for transferring further filter parameter
						execFilter.furtherFilters = fr.furtherFilters;
					}
					if (fr.orderBy) {
						execFilter.OrderBy = fr.orderBy;
					}
					// process function parameters
					if (resetStartTime) {
						service.filterRequest.setStartTime();
					}
					if (isPending) {
						service.updateFilterResult({ isPending: true });
					}

					if (_.isUndefined(enhancedFilterOptions) && service.currentSearchType === 'enhanced' && eFilterService && eFilterService.currentFilterDefItem) {

						// add enhanced filter only if its valid.
						var valid = eFilterService.currentFilterDefItem.isValidFilterDefinition(false);
						if (valid) {
							enhancedFilterOptions = {
								resetPageNumber: false,
								filterDefAsJSONString: eFilterService.filterDefAsJSONString(eFilterService.currentFilterDefItem),
								interfaceVersion: '1.0'
							};
						}
					}

					// TODO: Refresh should take currently set filter (centralised!)
					if (_.isUndefined(enhancedFilterOptions) && !fr.disableEnhancedSearch && _.isNil(navigateToModule)) {
						var filterDef;
						if (service.currentSearchType === 'bulk' && bulkSearchService.getCurrentFilter()) {
							filterDef = bulkSearchService.getProcessedFilter(null, true);
						} else if (service.currentSearchType === 'bulkForm' && bulkFormService.getProcessedFilter()) {
							filterDef = bulkFormService.getProcessedFilter(null, true);
						}
						if (filterDef) {
							enhancedFilterOptions = {
								resetPageNumber: false,
								filterDefAsJSONString: filterDef,
								interfaceVersion: '2.0'
							};
						}
					}

					if (service.filterRequest.pinnedFilter) {
						// #121872 only one pinned filter available at the moment!
						if(navigateToModule === null  ||  navigateToModule === service.filterRequest.pinnedFilter.moduleName){
							execFilter.PinnedEnhancedFilter = [bulkSearchService.getProcessedFilter(service.filterRequest.pinnedFilter.filterDef, true)];
							execFilter.IsEnhancedFilter = true;
							execFilter.InterfaceVersion = '2.0';
						}

					}

					// #125795: own parameter required to prevent ehanced search from revoming pKeys!
					if (enhancedFilterOptions && !fr.pKeysOnly) {
						execFilter.IsEnhancedFilter = true;
						execFilter.EnhancedFilterDef = enhancedFilterOptions.filterDefAsJSONString;
						execFilter.Pattern = undefined; // clean pattern
						execFilter.PKeys = undefined; // clean PKeys
						execFilter.IncludeNonActiveItems = true; // rei@29.1.2016 we want to include nonactive items
						execFilter.IncludeReferenceLineItems = true; // we want to include estimate ref lineitems
						// TODO: FIXME: next code line necessary?
						//  #104403 => check if removing next (commented) line will have bad effect on getting the filter params
						// removed//  service.updateFilterResult({isPending: true});
						// => at the moment we just want prevent setting pending to true when getting the filter request param
						// END TODO
						execFilter.InterfaceVersion = enhancedFilterOptions.interfaceVersion;
					}

					// remove prior dateSearch filter
					_.remove(execFilter.furtherFilters, function (filter) {
						return filter.Token.includes('ADDCOL_FILTER');
					});
					// #125795: own parameter required to prevent datesearch from filtering out pKeys!
					if (fr.dateSearch && fr.includeDateSearch && !enhancedFilterOptions && !fr.pKeysOnly) {
						execFilter.furtherFilters = execFilter.furtherFilters || [];
						execFilter.furtherFilters.push(...fr.dateSearch);
					}
					if (fr.radiusSearch && fr.includeRadiusSearch && !fr.pKeysOnly) {
						execFilter.furtherFilters = execFilter.furtherFilters || [];
						execFilter.furtherFilters.push(...fr.radiusSearch);
					}

					// #125795: remove pattern and set active if pKeysOnly is set!
					if (fr.pKeysOnly === true) {
						execFilter.Pattern = null;
						execFilter.IncludeNonActiveItems = true;
						execFilter.IncludeReferenceLineItems = true;
					}

					// if new module: save this filter
					if (fr.moduleName && saveFilter) {
						saveAutofilter(execFilter, enhancedFilterOptions);
					}

					// if navigated here restore the filter after loading entities for the first time
					if (navigateToModule === fr.moduleName) {
						fr.isNavigateToModule = true;
						loadAutofilter(fr);
						navigateToModule = null;
					}

					return execFilter;
				}

				/**
				 * This method returns a FilterRequest(.netClass naming) object with origin filter or with default values coming
				 * from initial values from the module initializing and user input data.
				 * Pattern is set to empty, Pagenumber 0,
				 * @method defaultFilterRequestParameter
				 * @param {int}   pageSize define the size of a page when reading data
				 **/
				service.FilterRequest.prototype.getFilterRequestParamsOrDefault = function (filter, resetStartTime, isPending) {
					if (!filter) {
						var defparams = filterRequestParams(!!resetStartTime, !!isPending);
						return defparams;
					} else {
						return filter;
					}
				};

				/**
				 * This method returns a FilterRequest(.netClass naming) object with origin filter or with default values coming
				 * from initial values from the module initializing and user input data.
				 * Pattern is set to empty, Pagenumber 0,
				 * @method defaultFilterRequestParameter
				 * @param {int}   pageSize define the size of a page when reading data
				 **/
				service.FilterRequest.prototype.getFilterRequestParamsOrDefaultSav = function (filter, resetStartTime, isPending) {
					if (!filter) {
						var defparams = {
							Pattern: '',
							PageSize: this.pageSize || 100,
							PageNumber: 0,
							OrderBy: this.orderBy,
							UseCurrentClient: this.useCurrentClient,
							UseCurrentProfitCenter: this.useCurrentProfitCenter,
							IncludeNonActiveItems: this.includeNonActiveItems,
							IncludeReferenceLineItems: this.includeReferenceLineItems,
							ProjectContextId: this.projectContextId,
							PinningContext: this.pinningContext,
							ExecutionHints: this.withExecutionHints,
							IncludeResultIds: null,
							GlobalData: this.containsGlobalData
						};
						if (!resetStartTime || resetStartTime) {
							service.filterRequest.setStartTime();
						}
						if (!isPending || isPending) {
							service.updateFilterResult({ isPending: true });
						}
						return defparams;
					} else {
						return filter;
					}
				};

				/**
				 * This method reset the filterrequest and extends it with filterOptions, detail to filter options
				 * see FilterRequest Contructor
				 *
				 * @method initializeFilterRequest
				 * @param {FilterRequest} filterOptions detail see FilterRequest
				 **/
				service.FilterRequest.prototype.initializeFilterRequest = function (filterOptions) {

					injectServices();  // init all injected services first

					service.filterRequest.reset();
					angular.extend(service.filterRequest, filterOptions);
					service.initCustomOptionDataOptions(service.filterRequest);
					service.initCompanyBasedDataOptions(service.filterRequest);

					// #123779: load current page size from view data
					service.filterRequest.loadPageSize();

					// var projectContext = platformContextService.getApplicationValue(service.appContextProjectContextKey);
					// if (projectContext) {
					// 	service.filterRequest.setProjectContext(projectContext);
					// }

					pinningContextService.setPinningOptions(filterOptions.pinningOptions);
					var pinningContext = pinningContextService.getContext();
					if (pinningContext) {
						service.filterRequest.setPinningContext(pinningContext);
					}
					service.filterInfo.reset();
				};

				/*
				 * Calculates next pagenumber
				 * @method nextPageNumber
				 * @param {FilterEvent} filterInfo detail see FilterEvent
				 **/
				service.FilterRequest.prototype.nextPageNumber = function (filterInfo) {
					var maxPageNumber = calcMaxPageNumber(this, filterInfo.totalRec);
					if (this.pageNumber < maxPageNumber) {
						if (filterInfo.endRec < filterInfo.totalRec) {
							this.pageNumber++;
						}
					}
				};

				/*
				 * Calculates last pagenumber
				 * @method lastPageNumber
				 * @param {FilterEvent} filterInfo detail see FilterEvent
				 **/
				service.FilterRequest.prototype.lastPageNumber = function (filterInfo) {
					var maxPageNumber = calcMaxPageNumber(this, filterInfo.totalRec);

					this.pageNumber = maxPageNumber - 1;
				};

				/*
				 * Calculates pager count
				 * @method calcMaxPageNumber
				 * @param {totalRec} max count of lineitems
				 */
				function calcMaxPageNumber(self, totalRec) {
					return ((totalRec / self.pageSize) | 0) + ((totalRec % self.pageSize) > 0 ? 1 : 0);
				}

				/*
				 * Calculates first pagenumber
				 * @method firstPageNumber
				 * @param {FilterEvent} filterInfo detail see FilterEvent
				 **/
				service.FilterRequest.prototype.firstPageNumber = function () {
					this.pageNumber = 0;
				};

				/*
				 * Calculates previous pagenumber
				 * @method previousPageNumber
				 * @param {FilterEvent} filterInfo detail see FilterEvent
				 **/
				service.FilterRequest.prototype.previousPageNumber = function () {
					if (this.pageNumber > 0) {
						this.pageNumber--;
					}
				};

				// only internal usage
				service.FilterRequest.prototype.setPinningContext = function (option) {

					// for compatibility reason we put pinningItem(token='project.main') to projectContextId
					var projectItem = _.find(option, { token: 'project.main' });
					if (projectItem) {
						this.projectContextId = projectItem.id;
					} else {
						this.projectContextId = null;
					}
					// end compatibility reason

					this.pinningContext = option || [];
				};

				// only internal usage
				service.FilterRequest.prototype.setStartTime = function () {
					this.startTime = new Date();
				};

				// only internal usage
				service.FilterRequest.prototype.calculateExecutionTime = function () {
					if (this.startTime) {
						var eleapsedMs = new Date().getTime() - this.startTime.getTime();
						return eleapsedMs + ' ms complete execution done';
					} else {
						return '';
					}
				};

				service.FilterRequest.prototype.savePageSize = function () {
					mainViewService.customData(pageSizeUuid, pageSizeSettingsKey, this.pageSize);
				};

				service.FilterRequest.prototype.loadPageSize = function () {
					// there are currently four methods to read the current page size
					// a) Hardcoded global: For all filter requests, the standard pageSize is 100
					// b) Hardcoded module: Each module can specify a setting for the pageSize that is used instead
					// c) Systemsetting 'Standard Page Size': If set, this should overwrite the default page size for all modules (according to ALM case 120773)
					// d) Userdefined: The value set by the user is stored per module and takes highest priority

					// an array on promises that indicates a number of requests need to be run before repeating the process again.
					const pageSizePromises = [];

					// a) + b) is legacy!
					// c) read pageSize from systemoption stored in recordPerPageDataFetched
					if (service.recordPerPageDataFetched === true) {
						this.pageSize = service.recordPerPageStandardValue;
					} else {
						// #125527: always initialize load records per page and load page size again afterwards!
						pageSizePromises.push(service.readRecordPerPageStandardSize());
					}
					// d) If view has saved custom page size, restore it; otherwise, keep current value
					const userDefinedPageSize = mainViewService.customData(pageSizeUuid, pageSizeSettingsKey);
					if (!_.isUndefined(userDefinedPageSize)) {
						// empty the promise array, since it's not required anymore
						pageSizePromises.length = 0;
						this.pageSize = userDefinedPageSize;
					}
					if (!_.isEmpty(pageSizePromises)) {
						$q.all(pageSizePromises).then(() => {
							service.filterRequest.loadPageSize();
						});
					}
				};

				/* end prototyp to FilterRequest */

				/* filterRequest property with external functions */
				service.filterRequest = new service.FilterRequest(service.recordPerPageStandardValue, 0);

				/*
				 * this method execute the search by creating the FilterRequest parameter
				 * and fires then the onExecuteSearchFilter Event
				 * @method filterStartSearch
				 * @param {bool} resetPageNumber if true - reset start page set 0
				 **/
				service.filterStartSearch = function (resetPageNumber, saveFilter) {

					if (service.filterInfo.isPending) {
						return;
					}

					if (resetPageNumber) {
						service.filterRequest.pageNumber = 0;
					}

					service.updateNavbarRefreshTooltip(service.filterRequest.pattern);
					service.onExecuteSearchFilter.fire(null, filterRequestParams(true, true, undefined, saveFilter));
				};

				/**
				 * description see FilterRequest.filterRequestParams
				 *
				 * supply FilterRequest method direct from service api
				 *
				 * @type {filterRequestParams}
				 */
				// todo: service.filterRequest.filterRequestParams is not accessible!
				// service.getFilterRequestParams = service.filterRequest.filterRequestParams;
				service.getFilterRequestParams = function () {
					return filterRequestParams();
				};

				/*
				 * this method execute the search by creating the FilterRequest parameter
				 * and fires then the onExecuteSearchFilter Event
				 * @method filterStartSearch
				 * @param {bool} resetPageNumber if true - reset start page set 0
				 **/
				service.filterStartEnhancedSearch = function (filterOptions, saveFilter) {

					if (service.filterInfo.isPending) {
						return;
					}

					if (filterOptions && filterOptions.resetPageNumber) {
						service.filterRequest.pageNumber = 0;
					}
					service.onExecuteSearchFilter.fire(null, filterRequestParams(true, true, filterOptions, saveFilter));
				};

				/*
				 * this method execute the search by creating the FilterRequest parameter
				 * and fires then the onExecuteSearchFilter Event
				 * @method filterSearchFromPKeys
				 * @param {array} pKeys primary keys to be read from backend
				 * @param {array} furtherFilters see FilterRequest definition
				 * @param {int} projectContextId see FilterRequest definition
				 * @param {array of PinningItem} pinningContext see FilterRequest definition
				 **/
				service.filterSearchFromPKeys = function (pKeys, furtherFilters, projectContextId, pinningContext) {

					if (service.filterInfo.isPending) {
						return;
					}

					// for compatibility reason REI@15.4.2016
					if (projectContextId && !pinningContext && angular.isDefined(pinningContextService) && (pinningContextService !== null)) {
						pinningContext = [new pinningContextService.PinningItem('project.main', projectContextId)];
					}

					service.filterRequest.pageNumber = 0;
					var fRequest = filterRequestParams(true, true);
					fRequest.ProjectContextId = projectContextId;
					fRequest.PinningContext = pinningContext;

					// hof@8.9.2020 reverted changes of revision 597030 below as this should be handled in data service option useIdentification
					fRequest.PKeys = pKeys;
					// // rei@24.7.2020 fixed issue with wrong sending pkey to server in case of new finallogic.
					// if (service.filterRequest.enhancedSearchVersion === '2.0' && pKeys.length > 0) {
					// 	// for enhanced search version 2.0, we need array of IdentificationData
					// 	fRequest.PKeys = _.map(pKeys, function (key) {
					// 		if (_.isObject(key)) {
					// 			return key;
					// 		}
					// 		return {Id: key};
					// 	});
					// } else {
					// 	fRequest.PKeys = pKeys; // old implemention to old finallogic
					// }
					fRequest.furtherFilters = _.isArray(furtherFilters) ? furtherFilters : null; // rei@9.12.21 supply furtherFilters only if its un array, other exception on server might appear.
					fRequest.Pattern = null;
					fRequest.IsEnhancedFilter = false;
					fRequest.UseCurrentClient = false;        // rei@7.9 changed to pascal case
					fRequest.UseCurrentProfitCenter = false;
					fRequest.IncludeNonActiveItems = false;   // rei@7.9 changed to pascal case
					fRequest.IncludeReferenceLineItems = true;
					fRequest.isFromSideBar = true;
					service.onExecuteSearchFilter.fire(null, fRequest);
				};

				/*
				 * this method execute the search by creating the FilterRequest parameter
				 * and fires then the onExecuteSearchFilter Event
				 * @method filterSearchFromPattern
				 * @param {string} searchPattern  is searchpattern
				 * @param {array} furtherFilters see FilterRequest definition
				 * @param {int} projectContextId see FilterRequest definition
				 * @param {array of PinningItem} pinningContext see FilterRequest definition
				 **/
				service.filterSearchFromPattern = function (searchPattern, furtherFilters, projectContextId, pinningContext) {
					if (service.filterInfo.isPending) {
						return;
					}

					// for compatibility reason REI@15.4.2016
					if (projectContextId && !pinningContext && angular.isDefined(pinningContextService) && (pinningContextService !== null)) {
						pinningContext = [new pinningContextService.PinningItem('project.main', projectContextId)];
					}

					service.filterRequest.pageNumber = 0;
					var fRequest = filterRequestParams(true, true);
					fRequest.PKeys = null;
					fRequest.Pattern = searchPattern;
					fRequest.ProjectContextId = projectContextId;
					fRequest.PinningContext = pinningContext;
					fRequest.furtherFilters = _.isArray(furtherFilters) ? furtherFilters : null; // rei@9.12.21 supply furtherFilters only if its un array, other exception on server might appear.
					service.onExecuteSearchFilter.fire(null, fRequest);
				};

				/* this method resets search pattern
				 * @method filterResetPattern
				 **/
				service.filterResetPattern = function () {
					service.filterRequest.pattern = '';
					// not allow here !!!!
					var inputBoxObj = $('#GoogleSearchInput');
					if (inputBoxObj) {
						inputBoxObj.val('');
					}
					service.updateNavbarRefreshTooltip('');
				};

				service.setPatternHasBeenResettedFlag = function (flagValue) {
					patternHasBeenResettedFlag = flagValue;
				};

				/* this method resets project context
				 * @method clearProjectContext
				 **/
				service.clearProjectContext = function () {
					service.setProjectContext(null, null);
				};

				/* this method resets project context
				 * @method orderbyFilterRequest
				 * @param {object} orderBy an array with order columns info [{Field: '',Desc: false}]
				 */
				service.orderbyFilterRequest = function (orderBy) {
					service.filterRequest.orderBy = orderBy;
				};

				/**
				 *
				 */
				function injectServices() {
					if (eFilterService === null) {
						eFilterService = $injector.get('cloudDesktopEnhancedFilterService');
					}
					if (pinningContextService === null) {
						pinningContextService = $injector.get('cloudDesktopPinningContextService');
					}
					if (pinningFilterService === null) {
						pinningFilterService = $injector.get('cloudDesktopPinningFilterService');
					}
					if (searchFormService === null) {
						searchFormService = $injector.get('cloudDesktopSidebarSearchFormService');
					}

					if (bulkSearchService === null) {
						bulkSearchService = $injector.get('cloudDesktopBulkSearchDataService');
					}
					if (bulkFormService === null) {
						bulkFormService = $injector.get('cloudDesktopSidebarBulkSearchFormService');
					}
					if (companyLoginContextService === null) {
						companyLoginContextService = $injector.get('basicsCompanyLoginContextService');
					}
				}

				function isAutofilterActive() {
					return basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(10046).then(function (val) {
						return val !== '0';
					});
				}

				function loadAutofilter(originalOptions) {
					const options = _.cloneDeep(originalOptions);
					// #116159: Only restore autofilter if system setting is set to 1
					isAutofilterActive().then(function (active) {
						if (active === false) {
							//service.onFilterReady.fire();
							return;
						}
						// reset autoFilter
						autoFilter = null;
						let loadedParameters;
						cloudDesktopSidebarAutofilterService.loadAutofilter(service.filterRequest.moduleName).then(function (result) {
							if (result) {
								// service.pauseAutoFilter(false);
								var loadedAutoFilter = cloudDesktopSidebarAutofilterService.getCurrentFilter(service.filterRequest.moduleName, 'sidebarSearch');
								if (loadedAutoFilter) {
									service.currentSearchType = loadedAutoFilter.settings.searchType;
									service.settingsActive = loadedAutoFilter.settings.settingsActive;

									// merging the filter and excluding the undesired properties
									var reducedFilter = reduceAutoFilter(_.cloneDeep(loadedAutoFilter.filter));
									// by navigation reset page number
									if (options.isNavigateToModule) {
										reducedFilter.pageNumber = 0;
									}
									mergeAutoFilter(service.filterRequest, reducedFilter);

									switch (service.currentSearchType) {
										case 'google':
											service.setAutoFilter(service.currentSearchType, loadedAutoFilter.settings.parameters, 'dateParameters');
											if (loadedAutoFilter.settings.parameters && loadedAutoFilter.settings.parameters.hasOwnProperty('RadiusParameters')) {
												service.setAutoFilter(service.currentSearchType, loadedAutoFilter.settings.parameters, 'radiusParameters');
											}
											service.updateNavbarRefreshTooltip(service.filterRequest.pattern);
											break;
										case 'bulk':
										case 'bulkForm':
											service.setAutoFilter(service.currentSearchType, loadedAutoFilter.settings.parameters, 'radiusParameters');
											break;
										case 'form':
											searchFormService.loadAutoFilter(loadedAutoFilter.settings.parameters);
											break;
										case 'enhanced':
											eFilterService.loadAutoFilter(loadedAutoFilter.settings.parameters);
											break;
										default:
											break;
									}
									let dateParemeters = service.getAutoFilter(service.currentSearchType, 'dateParameters');
									let radiusParameters = service.getAutoFilter(service.currentSearchType, 'radiusParameters');

									if (dateParemeters && radiusParameters && radiusParameters.hasOwnProperty('RadiusParameters')) {
										loadedParameters = Object.assign(dateParemeters, radiusParameters);
									} else if (dateParemeters) {
										loadedParameters = dateParemeters;
									} else if (radiusParameters) {
										loadedParameters = radiusParameters;
									} else {
										loadedParameters = service.getAutoFilter(service.currentSearchType);
									}

									if (loadedParameters) {
										var event = null;
										var args = {
											searchType: service.currentSearchType,
											parameters: loadedParameters,
											options: options
										};
										service.onAutoFilterChanged.fire(event, args);
									}
									if (!options.disableEntityRestore && service.filterRequest.restoreEntities) {
										var enhancedFilter = loadedAutoFilter.enhancedFilter;
										service.onExecuteSearchFilter.fire(null, filterRequestParams(true, true, enhancedFilter, true));
									}
								}
							}
							service.onAutoFilterLoaded.fire(event, args);
						});
					});
				}

				function saveAutofilter(filter, enhancedFilterOptions) {
					let dateParemeters, radiusParameters;
					isAutofilterActive().then(function (active) {
						// #116159: Only save autofilter if system setting is set to 1
						if (active === false) {
							return;
						}
						var params;
						switch (service.currentSearchType) {
							case 'google':
								dateParemeters = service.getAutoFilter(service.currentSearchType, 'dateParameters');
								radiusParameters = service.getAutoFilter(service.currentSearchType, 'radiusParameters');
								if (dateParemeters && radiusParameters && radiusParameters.hasOwnProperty('RadiusParameters')) {
									if(dateParemeters.hasOwnProperty('RadiusParameters')){
										dateParemeters.RadiusParameters = Object.assign(dateParemeters.RadiusParameters, radiusParameters.RadiusParameters);
									}
									params = Object.assign(radiusParameters, dateParemeters);
								} else if (dateParemeters) {
									params = dateParemeters;
								} else if (radiusParameters) {
									params = radiusParameters;
								}
								break;
							case 'bulk':
							case 'bulkForm':
								radiusParameters = service.getAutoFilter(service.currentSearchType, 'radiusParameters');
								if (radiusParameters) {
									params = radiusParameters;
								}
								break;
							case 'form':
								params = _.cloneDeep(searchFormService.getSelectedItem());
								break;
							case 'enhanced':
								params = _.cloneDeep(eFilterService.selectedFilterDefDto);
								params.filterDef = filter.EnhancedFilterDef;
								break;
							default:
								break;
						}
						var reducedFilter = reduceAutoFilter(_.cloneDeep(service.filterRequest));
						var autoFilterDef = {
							filter: reducedFilter,
							enhancedFilter: enhancedFilterOptions,
							settings: {
								searchType: service.currentSearchType,
								settingsActive: service.settingsActive,
								parameters: params
							}
						};
						cloudDesktopSidebarAutofilterService.saveAutofilterDefinition(service.filterRequest.moduleName, 'u', autoFilterDef, 'sidebarSearch');
					});
				}

				function reduceAutoFilter(filter) {
					// properties that should be stored/restored
					//  #123779: remove pageSize from auto filter!
					//  #DEV-9781: remove useCurrentProfitCenter from auto filter
					var includedProperties = ['furtherFilters', 'includeDateSearch', 'includeRadiusSearch', 'includeNonActiveItems', 'includeResultIds', 'orderBy', 'pageNumber', 'pattern', 'restoreEntities', 'useCurrentClient', 'withExecutionHints', 'containsGlobalData'];
					return _.pickBy(filter, function (v, k) {
						return _.includes(includedProperties, k);
					});
				}

				function mergeAutoFilter(currentFilter, autoFilter) {
					// properties that should only be merged if they are not null
					var sensibleProperties = ['includeDateSearch', 'includeRadiusSearch', 'includeNonActiveItems', 'includeResultIds', 'restoreEntities', 'useCurrentClient', 'withExecutionHints', 'useCurrentProfitCenter', 'containsGlobalData'];
					_.mergeWith(currentFilter, autoFilter, function (originVal, newVal, key) {
						if (_.includes(sensibleProperties, key)) {
							return originVal !== null ? (newVal !== null ? newVal : originVal) : null;
						}
					});
				}

				service.setAutoFilter = function (mode, parameters, sectionName = null) {
					var storedParameters = _.cloneDeep(parameters);
					autoFilter = autoFilter || {};
					(sectionName) ? _.assign(autoFilter, { mode: mode, [sectionName]: storedParameters }) : _.assign(autoFilter, { mode: mode, parameters: storedParameters });

				};

				service.getAutoFilter = function (mode, sectionName = null) {
					var result = !_.isNil(autoFilter) && autoFilter.mode === mode ?
						(sectionName) ? _.cloneDeep(autoFilter[sectionName]) : _.cloneDeep(autoFilter.parameters) : null;
					return result;
				};

				/**
				 *
				 */
				service.isInNewModule = function () {
					return isInNewModule;
				};

				/* this method initializes the FilterRequest
				 * @method initializeFilterRequest, details see filterRequest.initializeFilterRequest
				 **/
				service.initializeFilterRequest = function (options) {

					injectServices();

					service.filterRequest.initializeFilterRequest(options);

					var moduleChanged = false;

					// is there a change in the moduleName
					if (currentFilterModuleName !== service.filterRequest.moduleName) {
						currentFilterModuleName = service.filterRequest.moduleName;
						moduleChanged = true;
						isInNewModule = true;
						service.setPatternHasBeenResettedFlag(false);

						service.onModuleChanged.fire(options);

						// dateSearchService.resetFilter(options);
						// bulkSearchService.resetFilter();
					} else {
						isInNewModule = false;
					}

					// load lastFilter
					if (navigateToModule !== service.filterRequest.moduleName) {
						loadAutofilter(options);
					}

					// inject enhanced Filter Service....
					eFilterService.Initialize(options, moduleChanged);
				};

				/* this method step one page back if possible
				 * @method filterPageBackward, details see filterRequest.previousPageNumber
				 **/
				service.filterPageBackward = function () {
					service.filterRequest.previousPageNumber();
				};

				service.filterPageFirst = function () {
					service.filterRequest.firstPageNumber();
				};

				/* this method step one page further if possible
				 * @method filterPageForward, details see filterRequest.nextPageNumber
				 **/
				service.filterPageForward = function () {
					service.filterRequest.nextPageNumber(service.filterInfo);
				};

				service.filterPageLast = function () {
					service.filterRequest.lastPageNumber(service.filterInfo);
				};

				/* end filterRequest property with external functions */

				/**
				 * The constructor function for FilterEvent, all property are describe in detail below
				 * @method FilterEvent constructor
				 * @param {int } totalRec   number of records total
				 * @param {int } startRec   start record number for the page
				 * @param {int } endRec     end record number for the page
				 * @param {int } isPending  indicating search in pending
				 * @param {string } executionInfo the execution info from service call
				 **/
				service.FilterEvent = function FilterEvent(totalRec, startRec, endRec, isPending, executionInfo) {
					this.totalRec = totalRec;
					this.startRec = startRec;
					this.endRec = endRec;
					this.isPending = isPending;
					this.executionInfo = executionInfo || null;
					this.recordInfoText = '';
					this.forwardEnabled = false;
					this.backwardEnabled = false;
				};

				service.FilterEvent.prototype.reset = function () {
					this.totalRec = 0;
					this.startRec = 0;
					this.endRec = 0;
					this.executionInfo = null;
					this.recordInfoText = '';
					this.forwardEnabled = false;
					this.backwardEnabled = false;
					this.isPending = false;
				};

				/* filterInfo property with external functions */
				service.filterInfo = new service.FilterEvent(0, 0, 0, false, '');

				/** This method takes the Filterresult from service call and calculates start-,endrecord of the fetched page
				 * add the execution hints (if required) and prepare is for displaying.
				 * This updates the sidebar search panel with the result information from a retrieval.
				 * Should be called after retrieving the data from the backend via a filterRequest
				 * @method updateFilterResult
				 * @param {object} filterevent {object} contains all information about the retrieval.
				 **/
				service.updateFilterResult = function (filterevent) {
					var fltrInfo = service.filterInfo;
					var completeExecTime = service.filterRequest.calculateExecutionTime();

					fltrInfo.reset();
					if (filterevent.requestFailed) {
						fltrInfo.isPending = false;
						fltrInfo.recordInfoText = $translate.instant('cloud.desktop.sdSearchFailedInfo');
						service.onFilterReady.fire();
					} else if (filterevent.isPending) {
						fltrInfo.isPending = true;
						// fltrInfo.recordInfoText = service.translate.cloud.desktop.sdSearchRunning;
						fltrInfo.recordInfoText = $translate.instant('cloud.desktop.sdSearchRunning');
					} else {
						fltrInfo.isPending = false;
						if (filterevent.filterResult && filterevent.filterResult.RecordsFound > 0) {
							var filterRequest = filterevent.filterRequest || {
								PageSize: service.filterRequest.pageSize,
								PageNumber: service.filterRequest.pageNumber
							};
							fltrInfo.startRec = (filterRequest.PageSize * filterRequest.PageNumber) + 1;
							fltrInfo.endRec = (fltrInfo.startRec - 1) + filterevent.filterResult.RecordsRetrieved;
							fltrInfo.totalRec = filterevent.filterResult.RecordsFound;
							fltrInfo.recordInfoText = fltrInfo.startRec + ' - ' + fltrInfo.endRec + ' / ' + fltrInfo.totalRec;
							fltrInfo.forwardEnabled = fltrInfo.endRec < fltrInfo.totalRec;
							fltrInfo.backwardEnabled = fltrInfo.startRec > 1;
							fltrInfo.executionInfo = filterevent.filterResult.ExecutionInfo;

							var info = {
								filterInfo: fltrInfo,
								filterRequest: filterRequest
							};
							service.filterChanged.fire(info);
						} else {
							// fltrInfo.recordInfoText = service.translate.cloud.desktop.sdGoogleNoSearchResult;
							fltrInfo.recordInfoText = $translate.instant('cloud.desktop.sdGoogleNoSearchResult');
							service.filterChanged.fire();
						}
						service.onFilterReady.fire();
					}
					fltrInfo.executionInfo += '\n' + completeExecTime;
				};

				// project Context is handled here
				// 21.12.2015@rei:  added support save project context by logon company id
				Object.defineProperties(service, {
					'appContextProjectContextKey': {
						get: function () {
							return 'sb.ProjCtx.' + platformContextService.clientId;
						}, enumerable: true
					}
				});

				/**
				 * forwarded to pinningContextService.setContext
				 * @param p
				 */
				service.setPinningContext = function (p) {
					pinningContextService.setContext(p);
				};

				/**
				 * forwarded to pinningContextService.setCurrentProjectToPinnningContext
				 * @param dataService, projectProperty, entity
				 */
				service.setCurrentProjectToPinnningContext = function (dataService, projectProperty, entity) {
					return pinningContextService.setCurrentProjectToPinnningContext(dataService, projectProperty, entity);
				};

				$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
					// var state= toState;
					if (toState.name !== fromState.name) {
						_.forEach(showOptionsDefault.filter(item => item.sidebarId === sidebarIds.oneDrive || item.sidebarId === sidebarIds.chatBot), function (item) {
							var found = _.find(service.commandBarDeclaration.items, { id: '#' + item.sidebarId });
							if (found) {
								found.hideItem = !item.active;
							}
						});
					}
					if (toState.name === 'app.desktop') {
						service.showHideButtons(showOptionsDefault);
						checkCurrentSidebarContainerOtherwiseToQuickstart();
					}
				});

				$rootScope.$on('navigateTo', function (e, moduleName) {
					navigateToModule = moduleName;
				});
				// console.log("init standard");
				// add the standard sidebar Container, register all and display certain
				service.registerSidebarContainer(quickStart, !globals.portal);
				service.registerSidebarContainer(prjNavi, !globals.portal);
				service.registerSidebarContainer(watchlist, false);
				service.registerSidebarContainer(lastObjects, !globals.portal);
				service.registerSidebarContainer(search, false);
				service.registerSidebarContainer(outlook, !globals.portal);

				service.openOneDriveSidebarContainer = function openOneDriveSidebarContainer() {
					if (!service.scope || !service.scope.sidebarOptions) {
						return false;
					}

					var oneDriveSidebarId = sidebarIds.getId(sidebarIds.oneDrive);

					if (service.scope.sidebarOptions.lastButtonId !== oneDriveSidebarId) {
						service.scope.cmdbarredirectTo(oneDriveSidebarId);
					}

					if (!service.scope.pinned) {
						service.scope.pinSidebar();
					}

					return true;
				};

				service.registerSidebarContainer(oneDrive, !globals.portal);

				service.setOneDriveButtonVisible = function (visible) {
					service.showHideButtons([{ sidebarId: sidebarIds.oneDrive, active: visible }]);
					var sidebarOption = _.find(showOptionsDefault, { sidebarId: sidebarIds.oneDrive });
					if (sidebarOption) {
						sidebarOption.active = visible;
					}
				};

				service.registerSidebarContainer(chatBot, !globals.portal);

				service.setChatBotButtonVisible = function (visible) {
					service.showHideButtons([{ sidebarId: sidebarIds.chatBot, active: visible }]);
					var sidebarOption = _.find(showOptionsDefault, { sidebarId: sidebarIds.chatBot });
					if (sidebarOption) {
						sidebarOption.active = visible;
					}
				};

				var helpDeskParamShowFetched = false;
				service.showHelpDeskServiceParameter = false;
				service.fetchShowHelpDeskServiceParameter = function () {
					if (!helpDeskParamShowFetched) {
						return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isshowhelpdeskserviceparameter').then(function (result) {
							service.showHelpDeskServiceParameter = result.data;
							helpDeskParamShowFetched = true;
							return true;
						});
					} else {
						return $q.when(true);
					}
				};

				// loads or updates translated strings
				var loadTranslations = function () {
					service.translate = platformTranslateService.instant({
						'cloud.desktop': ['sdGoogleNoSearchResult', 'sdSearchRunning']
					});
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				if (!platformTranslateService.registerModule(['cloud.desktop', 'businesspartner.main'])) {  // rei@20.11.18 needed for workflow action be display labels
					loadTranslations();
				}

				service.checkedInLocalStorage = function (sidebarId) {
					if (checkStatusInLocalStorage(sidebarId)) {
						return true;
					}
					return false;
				};

				function checkStatusInLocalStorage(sidebarId) {
					var toReturn = false;
					/*
					check first, if is saved in localStorage.
					second check: if sidebarId === saved last button
					lst check: if lastButton available in the common page
				 */
					if (service.scope.sidebarOptions && service.scope.sidebarOptions.savedInLocalStorage) {

						var sidebarItem = _.find(service.scope.sidebarOptions.commandBarDeclaration.items, { 'id': service.scope.sidebarOptions.lastButtonId });

						if (service.scope.sidebarOptions.lastButtonId === service.getSidebarIdAsId(sidebarId)) {
							toReturn = true;
						} else if (sidebarItem && sidebarItem.hideItem) {
							service.scope.sidebarOptions.lastButtonId = service.getSidebarIds().quickStart;
							toReturn = true;
						}
					}
					return toReturn;
				}

				service.initCustomOptionDataOptions = function initCustomOptionDataOptions(filterRequest) {
					if (_.isNil(filterRequest.customOption)) {
						filterRequest.customOptionChk = {};
					} else {
						filterRequest.customOptionChk = {
							ctrlId: 'customOptionId',
							labelText: filterRequest.customOption.label,
							labelText$tr$: filterRequest.customOption.label$tr$
						};
					}
				};

				service.evaluateCustomOptionDataOptions = function evaluateCustomOptionDataOptions(filterRequest) {
					if (_.isNil(filterRequest.customOption)) {
						return;
					}

					if (_.isNil(filterRequest.furtherFilters)) {
						filterRequest.furtherFilters = [];
					} else {
						filterRequest.furtherFilters = _.filter(filterRequest.furtherFilters, function (token) {
							return token.Token !== filterRequest.customOption.key;
						});
					}

					filterRequest.furtherFilters.push({
						Token: filterRequest.customOption.key,
						Value: filterRequest.customOption.value ? 'true' : 'false'
					});
				};

				service.initCompanyBasedDataOptions = function initCompanyBasedDataOptions(filterRequest){

					// Check useCurrentProfitCenter option
					if(!_.isNil(filterRequest.useCurrentProfitCenter) && companyLoginContextService.isVisibilityRestrictedToProfitCenter() === true){
						filterRequest.useCurrentProfitCenter = true;
					}
				}

				return service;
			}
		]);
})(angular);

