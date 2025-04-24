/**
 * Created by wui on 2/4/2015.
 * @description lookup input directive.
 */

(function (angular, $, global) {

	'use strict';

	var moduleName = 'basics.lookupdata';

	/**
	 * angular directive "ngShow" has animation which lookup don't need, so using directive "lookupShow" to simulate "ngShow" function.
	 */
	angular.module(moduleName).directive('lookupShow', function() {
		return {
			restrict: 'A',
			multiElement: true,
			link: function (scope, element, attr) {
				scope.$watch(attr.lookupShow, function lookupShowWatchAction(value) {
					element[value ? 'removeClass' : 'addClass']('ng-hide');
				});
			}
		};
	});

	/**
	 * Lookup directive default options
	 */
	angular.module(moduleName).constant('basicsLookupdataLookupDefaultOptions', {
		// string, id to save layout.
		uuid: '',

		// string, name unique to identify each lookup instance.
		lookupKey: '',

		// string, lookup type name.
		lookupType: '',

		// string, property name, specify identifier for data items, default to value member property.
		idProperty: '',

		// string, property name, get value from this property to apply edit value.
		valueMember: '',

		// string, property name, get value from this property to show in edit box.
		displayMember: '',

		// boolean, whether show clear button or not.
		showClearButton: false,

		// boolean, whether show edit button or not.
		showEditButton: true,

		// boolean, whether show add button or not.
		showAddButton: false,

		// oject, create form dialog options
		createOptions: {
			dataService: null,
			uiStandardService: null,
			validationService: null,
			fields: [],
			creationData: null
		},

		// boolean, whether show detail button or not.
		showDetailButton: false,

		// oject, detail form dialog options
		detailOptions: {
			isEditable: false,
			dataService: null,
			uiStandardService: null,
			validationService: null,
			readonlyFields: [],
			detailConverter: null
		},

		// boolean, show custom input content.
		showCustomInputContent: false,

		// function, input content formatter
		// if showCustomInputContent is false, it should return plain string, don't support html string.
		// if showCustomInputContent is true, it can return html string.
		formatter: null,

		// object array
		//  event listeners, each lister should be an object as { name: '', handler: null },
		//  @name: value one of 'onEditValueChanged'
		//  @handler: a function.
		events: [],

		// object array
		// show extra buttons in edit box for special command
		// button object properties include:
		//  @caption: string
		//  @execute: function
		//  @canExecute: function
		//  @img: string, background image url
		buttons: [],

		// object array same as buttons, but it's not control by readonly property.
		extButtons: [],

		// string, id used to register filter to service.
		filterKey: '',

		// filter options, if set filter key, it would be override
		// {serverSide: false, fn: null}
		filterOptions: null,

		// boolean, read only.
		readOnly: false,

		// boolean, angular directive name.
		customValidation: 'basics-lookupdata-lookup-validation',

		// boolean, enable validation.
		enableValidation: true,

		// object or angular service name, an object like { select: function(item,entity){ ... } }, provide image urls.
		imageSelector: null,

		// boolean, change lookup to text edit which has drop down list.
		isTextEditable: false,

		// eager load lookup item matches text, only available when isTextEditable is true
		eagerLoadTextItem: false,

		// boolean, disable input and button.
		disabled: false,

		// boolean, disable user input, only select value from drop down window.
		disableInput: false,

		// boolean, disable button.
		disableButton: false,

		// boolean, whether load data when lookup initializing.
		eagerLoad: false,

		// boolean, give the custom lookup also a chance to disable caching....
		disableDataCaching: false,

		// boolean, is sensitive to upper or lower case when searching.
		isCaseSensitiveSearch: false,

		// boolean, search lookup items which is the same as search value
		isExactSearch: false,

		// boolean, complete edit value automatically.
		autoComplete: true,

		// boolean, search data items according to edit value automatically.
		autoSearch: true,

		// object, data source of lookup
		// object interface restraint
		//  getList(), getDefault(), getItemByKey(key), getSearchList(searchString)
		dataProvider: null,

		// object, wrapper to data provider, provide common process to lookup data.
		dataView: null,

		// object array, slick grid columns, only valid if lookup view is grid.
		columns: [],

		// object, tree options for slick grid, only valid if lookup view is grid.
		treeOptions: null,

		// boolean, enable client side search.
		isClientSearch: false,

		// object, popup view options, interface restraint as below:
		// {
		//      template: '', string, template.
		//      templateUrl: '', string, template url.
		//      controller: null, function, angular controller for template.
		//      controllerAs: '', string, alias for controller in scope
		//      resolve: null, function, prepare necessary data before compile template.
		//      width: 0, decimal, popup window width.
		//      height: 0, decimal, popup window height.
		//      maxWidth: 0, decimal, popup window max width.
		//      maxHeight: 0, decimal, popup window max height.
		//      footerTemplate: '', string, template.
		//      footerTemplateUrl: '' string, template url.
		// }
		popupOptions: null,

		// object, dialog view options, interface restraint as below:
		// {
		//      template: '', string, template.
		//      templateUrl: '', string, template url.
		//      controller: null, function, angular controller for template.
		//      controllerAs: '', string, alias for controller in scope
		//      resolve: null, function, prepare necessary data before compile template.
		// 		minWidth: '0px',
		// 		maxWidth: '0px',
		// 		maxHeight: '0px',
		// 		width: '0px',
		// 		height: '0px',
		//      alerts: [{
		//          theme: '',
		//          css: '',
		//          title: '',
		//          title$tr$: '',
		//          message: '',
		//          message$tr$: ''
		//      }]
		// }
		dialogOptions: null,

		// function, callback if click refresh button in lookup view.
		onDataRefresh: null,

		// object, dialog title, only valid if lookup view is a dialog, interface restraint as below:
		// {
		//  name: '' string, dialog tile name.
		// }
		title: {name: 'Search Dialog'},

		// function, used to build search string for search dialog, it is valid only in search dialog.
		buildSearchString: null,

		// object, slick grid options.
		gridOptions: {
			multiSelect: false
		},

		// object, api interface { execute: new function}
		dataProcessor: null,

		// string, domain type
		domain: '',

		// string, text align direction
		textAlign: '',

		// string array, properties to search when input change
		// todo-wui: rename to searchMembers later.
		inputSearchMembers: [],

		// check if data item selectable before apply it
		selectableCallback: null,

		// data page options
		pageOptions: {
			// enable paging
			enabled: false,
			// page size, if size invalid , using the setting in customizing module.
			size: null
		},

		// place holder
		placeholder: '',

		// composite key mapping array
		// {fkMember: '', pkMember: ''}
		pKeyMaps: [],

		// value for ng-pattern-restrict
		// allow certain inputs based on a regex pattern, preventing the user from inputting anything invalid
		regex: null,

		// allow max length inputs
		maxLength: null,

		// the interval time for input search, in millisecond
		searchInterval: 800,

		// don't show popup window while input search
		disablePopupOnSearch: false,

		// a callback to handle lookup content element
		handleContent: null,

		// for tree structure, disable building tree structure for data
		disableBuildTree: false,

		// array, api interface [{processItem: function(item){}]
		dataProcessors: [],

		// specify columns source & schemas
		layoutOptions: {
			uiStandardServiceName: '',
			schemas: [],
			processColumns: function (columns) {
				return columns;
			}
		},

		// extend search filter display as detail form.
		formContainerOptions: {
			title: 'cloud.common.advancedCriteria',
			entity: null,
			formOptions: {
				configure: null // standard detail form configuration
			}
		},

		/**
		 * Highlight the input after initialization.
		 */
		highlightOnInit: false,

		/**
		 * Enable fast input for lookup editor of grid
		 */
		isFastDataRecording: false,

		// The default title for internal lookup buttons.
		buttonTitles: (prefix => {
			return {
				clear: prefix + 'clear',
				edit: prefix + 'edit',
				add: prefix + 'add',
				showDetail: prefix + 'showDetail',
				refresh: prefix + 'refresh',
				prev: prefix + 'prev',
				next: prefix + 'next'
			};
		})('basics.common.button.'),

		/**
		 * Multi-check options for grid dialog
		 * If it is enabled, a checkbox column will be appended dialog which allows user to multi-check grid items.
		 */
		multiCheckOptions: {
			/**
			 * Is enabled or not
			 */
			isEnabled: false,
			/**
			 * Checkbox column config
			 */
			columnConfig: {
				id: 'is-selected',
				field: 'IsSelected',
				name: 'Is Selected',
				name$tr$: 'basics.common.entityIsSelected',
				formatter: 'boolean',
				editor: 'boolean',
				width: 40,
				pinned: true,
				headerChkbox: true,
			},
			/**
			 * Apply checked items
			 */
			applyCallback: null
		}
	});

	/* jshint -W072 */
	angular.module(moduleName).directive('basicsLookupdataLookupInputBase', [
		'_',
		'$q',
		'globals',
		'$log',
		'$sce',
		'$timeout',
		'$compile',
		'$templateCache',
		'$injector',
		'$filter',
		'$translate',
		'platformObjectHelper',
		'basicsLookupdataLookupApi',
		'PlatformMessenger',
		'basicsLookupdataDomainService',
		'basicsLookupdataLookupDefaultOptions',
		'basicsLookupdataLookupKeyService',
		'basicsLookupdataLookupOptionService',
		'platformModalFormConfigService',
		'platformTranslateService',
		'platformSchemaService',
		'basicsCommonCreateDialogConfigService',
		'platformDataProcessExtensionHistoryCreator',
		'basicsCommonDrawingUtilitiesService',
		'basicsLookupdataLookupViewService',
		'platformE2eUtilService',
		function basicsLookupdataLookupInputBase(
			_,
			$q,
			globals,
			$log,
			$sce,
			$timeout,
			$compile,
			$templateCache,
			$injector,
			$filter,
			$translate,
			platformObjectHelper,
			basicsLookupdataLookupApi,
			PlatformMessenger,
			basicsLookupdataDomainService,
			basicsLookupdataLookupDefaultOptions,
			basicsLookupdataLookupKeyService,
			basicsLookupdataLookupOptionService,
			platformModalFormConfigService,
			platformTranslateService,
			platformSchemaService,
			createDialogConfigService,
			platformDataProcessExtensionHistoryCreator,
			drawingUtils,
			basicsLookupdataLookupViewService,
			platformE2eUtilService) {

			return {
				restrict: 'A',
				require: '^ngModel',
				controllerAs: 'ctrl',
				scope: {
					disabled: '=?',
					ngReadonly: '=?'
				},
				controller: ['$scope', '$element', '$attrs', 'keyCodes', 'basicsLookupdataPopupService', 'platformDialogService', 'platformPermissionService', 'platformSchemaService', 'platformDataServiceProcessDatesBySchemeExtension', controller],
				link: linker
			};

			/* jshint -W040 */
			function controller($scope, $element, $attrs, keyCodes, basicsLookupdataPopupService, platformDialogService, platformPermissionService, platformSchemaService, platformDataServiceProcessDatesBySchemeExtension) {
				// controller instance.
				var self = this;
				// promise to get lookup item
				var globalLookupItemPromise = null;
				// promise for defer function.
				var deferPromise = null;
				//
				var completeItem = null;
				var completeText = null;
				//
				var clearValueFromInput = false;
				// prevent popup closing
				var preventPopupClosing = false;
				//
				var escText = null;
				var isActive = false;

				// on input box key down event
				self.onInputKeyDown = new PlatformMessenger();
				//on input box key up event
				self.onInputKeyUp = new PlatformMessenger();
				//on input change event
				self.onInputChange = new PlatformMessenger();
				// on input blur event
				self.onInputBlur = new PlatformMessenger();
				// on search event
				self.onLookupSearch = new PlatformMessenger();
				// hook function, initialized during directive link function
				self.setViewValue = angular.noop;
				/**
				 * The controller has been destroyed or not.
				 * @type {boolean}
				 */
				self.disposed = false;


				self.getModelValue = function () {
					return $scope.ngModel;
				};

				self.onModelChange = function (oldValue, newValue, lookupItem, isFromNgModel) {
					var callBack = function () {
						var args = {
							newValue: newValue,
							oldValue: oldValue,
							selectedItem: $scope.displayItem,
							entity: $scope.entity
						};
						$scope.onEditValueChanged.fire(global.event, args, $scope);
					};

					if ($scope.settings.isTextEditable) {
						$scope.displayItem = lookupItem;
						// For text edit mode, select a data item while text value changed.
						if(isFromNgModel && !_.isNil(newValue) && newValue.toString().trim().length > 0 && $scope.settings.eagerLoadTextItem) {
							$scope.settings.dataView.search({
								searchFields: [$scope.settings.displayMember],
								searchString: newValue,
								isCaseSensitive: true,
								matchExact: true
							}).then(function (result) {
								if (result.searchString === newValue) {
									$scope.displayItem = result.similarItem;
									callBack();
								}
							});
						}
						else {
							callBack();
						}
					}
					else {
						self.refreshView(callBack, $scope.options, lookupItem);
					}
				};

				/**
				 * apply composite key
				 * @param dataItem
				 */
				self.applyPKey = function (dataItem) {
					if ($scope.result) { // delay applying composite key value to grid editor
						$scope.result.canApply = basicsLookupdataLookupKeyService.isPKeyChange(dataItem, $scope.entity, $scope.settings);
						$scope.result.apply = function () {
							basicsLookupdataLookupKeyService.applyPKey(dataItem, $scope.entity, $scope.settings);
						};
					}
					else {
						basicsLookupdataLookupKeyService.applyPKey(dataItem, $scope.entity, $scope.settings);
					}
				};

				/**
				 * @description restore display text depend on display item.
				 * @param lookupItem
				 */
				self.selectText = function (lookupItem) {
					var displayValue = $scope.extractValue(lookupItem, $scope.settings.displayMember);

					if (!$scope.settings.showCustomInputContent) {
						if (angular.isFunction($scope.settings.formatter)) {
							displayValue = $scope.settings.formatter($scope.ngModel, lookupItem, displayValue, $scope.settings, $scope.entity);
						}
						else if (angular.isString($scope.settings.formatter)) {
							displayValue = $filter($scope.settings.formatter)(displayValue);
						}
					}

					if ($scope.displayText !== displayValue) {
						$scope.setDisplayText(displayValue);
					}

					// prevent trigger event 'onchange' if lookup has no display text.
					if ($scope.displayText === null) {
						$scope.setDisplayText('');
					}

					return displayValue;
				};

				/**
				 * set display data item.
				 * @param displayItem
				 * @param callBack
				 */
				self.selectItem = function (displayItem, callBack) {
					$scope.displayItem = displayItem;
					self.selectText(displayItem);
					if (callBack) {
						callBack();
					}
				};

				/**
				 * @description update display text in edit box.
				 */
				self.refreshView = function (callBack, options, lookupItem) {
					if (lookupItem) {
						self.selectItem(lookupItem, callBack);
						return;
					}

					// null, undefined, {} and not a number
					if (_.isNil($scope.ngModel) || $scope.ngModel === '' || _.isNaN($scope.ngModel) ||
						(_.isObject($scope.ngModel) && _.isEmpty($scope.ngModel))) {
						self.selectItem(null, callBack);
					}
					else if (!!options.dynamicLookupMode && options.dynamicDisplayMember) {
						$scope.setDisplayText($scope.entity[$scope.options.dynamicDisplayMember]);
						if (!$scope.displayItem) {
							$scope.displayItem = {};
							$scope.displayItem[$scope.settings.displayMember] = $scope.displayText;
						}
					}
					else {
						var identification = basicsLookupdataLookupKeyService.getIdentification($scope.ngModel, $scope.entity, $scope.settings);
						var lookupItemPromise = $scope.settings.dataView.getItemById(identification);

						globalLookupItemPromise = lookupItemPromise;
						lookupItemPromise.then(function (dataItem) {
							// if later promise resolve before former promise then ignore setDisplayItem.
							if (lookupItemPromise === globalLookupItemPromise) {
								self.selectItem(dataItem, callBack);
							}

							// DEV-630 - support highlight lookup input after initialized in grid.
							if ($scope.settings.highlightOnInit) {
								self.highlightOnce();
							}
						});
					}
					// else if ($scope.ngModel === $scope.extractValue($scope.displayItem, $scope.settings.valueMember)) {
					// 	self.selectItem($scope.displayItem, callBack);
					// }
					// else {
					// 	var lookupItemPromise = $scope.settings.dataView.getItemById($scope.ngModel);
					// 	globalLookupItemPromise = lookupItemPromise;
					// 	lookupItemPromise.then(function (dataItem) {
					// 		// if later promise resolve before former promise then ignore setDisplayItem.
					// 		if (lookupItemPromise === globalLookupItemPromise) {
					// 			self.selectItem(dataItem, callBack);
					// 		}
					// 	});
					// }
				};

				self.updateSearchMembers = function updateSearchMembers(){
					var tempArray = [];
					tempArray.push($scope.settings.displayMember);
					if ($scope.settings.columns.length && !$scope.settings.isExactSearch) {
						$scope.settings.columns.forEach(function columnIterator(item) {
							if (item.searchable !== false && tempArray.indexOf(item.field) < 0) {
								// todo: ignore date time field, temporary solution for search nullable field error.
								if (!new RegExp('(^(d|D)ate[a-zA-Z0-9_]*)|([a-zA-Z][a-zA-Z0-9_]*Date$)').test(item.field)) {
									tempArray.splice(tempArray.length, 0, item.field);
								}
							}
						});
					}
					// avoid to modify default inputSearchMembers.
					$scope.settings.inputSearchMembers = tempArray;
				};

				/**
				 * @description: initialize function.
				 */
				self.initialize = function () {
					$scope.settings = self.mergeOptions(basicsLookupdataLookupDefaultOptions, $scope.options);
					$scope.isCellEditor = !!$element.parents('*[data-grid=true]').length;
					$scope.editModeHandler.setEditMode($scope.settings.isTextEditable);
					$scope.hasButtons = $scope.settings.buttons.length ? true : false;
					$scope.hasExtButtons = $scope.settings.extButtons.length ? true : false;
					$scope.lookupView = $scope.settings.dialogOptions ? 'dialog' : 'popup';
					_.each($scope.settings.events,function (e) {
						self.registerEvent(e.name, e.handler);
					});

					// if don't set id property, set it to value member property.
					if (!$scope.settings.idProperty) {
						$scope.settings.idProperty = $scope.settings.valueMember;
					}

					// initialize inputSearchMembers.
					if (!$scope.settings.inputSearchMembers.length) {
						self.updateSearchMembers();
					}

					// Consider it as angular service if value is string.
					if (angular.isString($scope.settings.imageSelector)) {
						$scope.settings.imageSelector = $injector.get($scope.settings.imageSelector);
					}
					// set a default formatter
					if (angular.isObject($scope.settings.imageSelector)) {
						$scope.settings.showCustomInputContent = true;
						$scope.settings.formatter = defaultImageFormatter;
					}

					// check create permission
					// todo: hide add button if lookup not specify the permission descriptor.
					$scope.settings.hasCheckedAddPermission = false;
					if ($scope.settings.showAddButton && !$scope.options.hideAddButton) {
						$scope.settings.checkAddPermission = function () {
							var createOptions = $scope.settings.createOptions;
							$scope.settings.hasAddPermission = createOptions && createOptions.permission ? (platformPermissionService.hasCreate(createOptions.permission) && platformPermissionService.hasWrite(createOptions.permission)) : true;
							$scope.settings.hasCheckedAddPermission = true;
							return $scope.settings.hasAddPermission;
						};
					}

					// Add default data processors
					if ($scope.settings.layoutOptions) {
						var layoutOptions = $scope.settings.layoutOptions;

						// Date processor
						if (!_.isEmpty(layoutOptions.schemas)) {
							_.forEach(layoutOptions.schemas, function schemaRefIterator(schemeRef) {
								$scope.settings.dataProcessors.unshift(platformDataServiceProcessDatesBySchemeExtension.createProcessor(schemeRef));
							});
						}

						// History processor
						if (layoutOptions.uiStandardServiceName) {
							$scope.settings.dataProcessors.unshift(platformDataProcessExtensionHistoryCreator);
						}

					}

					$scope.settings.dataView.setScope($scope);
					$scope.settings.dataView.init($scope.settings);
				};

				/**
				 * register event from option "events".
				 * @param e
				 */
				self.registerEvent = function (name, handler) {
					switch (name) {
						case 'onEditValueChanged': {
							$scope.onEditValueChanged.register(handler);
						}
							break;
						case 'onSelectedItemChanged': {
							$scope.onSelectedItemChanged.register(handler);
						}
							break;
						case 'onSelectedItemsChanged': {
							$scope.onSelectedItemsChanged.register(handler);
						}
							break;
						case 'onInputGroupClick': {
							$scope.onInputGroupClick.register(handler);
						}
							break;
						case 'onInitialized': {
							$scope.onInitialized.register(handler);
						}
							break;
						case 'onDestroyed': {
							$scope.onDestroyed.register(handler);
						}
							break;
						case 'onPopupOpened': {
							$scope.onPopupOpened.register(handler);
						}
							break;
						case 'onPopupClosed': {
							$scope.onPopupClosed.register(handler);
						}
							break;
						case 'onInputKeyUp': {
							self.onInputKeyUp.register(handler);
						}
							break;
						case 'onInputKeyDown': {
							self.onInputKeyDown.register(handler);
						}
							break;
					}
				};

				self.unregisterEvent = function (name, handler) {
					switch (name) {
						case 'onEditValueChanged': {
							$scope.onEditValueChanged.unregister(handler);
						}
							break;
						case 'onSelectedItemChanged': {
							$scope.onSelectedItemChanged.unregister(handler);
						}
							break;
						case 'onSelectedItemsChanged': {
							$scope.onSelectedItemsChanged.unregister(handler);
						}
							break;
						case 'onInputGroupClick': {
							$scope.onInputGroupClick.unregister(handler);
						}
							break;
						case 'onInitialized': {
							$scope.onInitialized.unregister(handler);
						}
							break;
						case 'onDestroyed': {
							$scope.onDestroyed.unregister(handler);
						}
							break;
						case 'onPopupOpened': {
							$scope.onPopupOpened.unregister(handler);
						}
							break;
						case 'onPopupClosed': {
							$scope.onPopupClosed.unregister(handler);
						}
							break;
						case 'onInputKeyUp': {
							self.onInputKeyUp.unregister(handler);
						}
							break;
						case 'onInputKeyDown': {
							self.onInputKeyDown.unregister(handler);
						}
							break;
					}
				};

				self.applyFastInputInGrid = function (inputValue) {
					if (!self.allowFastInputInGrid()) {
						return;
					}

					if ($scope.originalDisplayText !== inputValue) {
						self.setViewValue(inputValue);
					}
				};

				/**
				 * @description: apply selected item to edit value.
				 */
				self.apply = function (dataItem) {
					// cancel search deferred promise in case selecting lookup item would trigger change event.
					$scope.cancelTimeout();

					if (!dataItem && !$scope.settings.showClearButton) {
						return;
					}

					if(!dataItem && $scope.settings.isFastDataRecording) {
						doApply(null);
						return;
					}

					if ($scope.canSelect(dataItem)) {
						completeItem = null;

						if ($scope.settings.isTextEditable) { // text edit
							doApply(dataItem);
						}
						else if ($scope.displayItem !== dataItem) { // lookup edit
							// update service data used for formatting lookup foreign key.
							$scope.settings.dataView.updateDescriptor(dataItem);
							doApply(dataItem);
						} else if (!dataItem && !!$scope.options.dynamicLookupMode && $scope.options.dynamicDisplayMember) {
							$scope.settings.dataView.updateDescriptor(dataItem);
							doApply(dataItem);
						}
					}
				};

				/**
				 * apply data item.
				 * @param dataItem
				 */
				function doApply(dataItem) {
					var args = {
						previousItem: $scope.displayItem,
						selectedItem: dataItem,
						entity: $scope.entity
					};
					var oldValue = $scope.ngModel;
					var newValue = $scope.editModeHandler.getValueByItem(dataItem);

					$scope.ngModel = newValue;
					if ($scope.options.dynamicLookupMode) {
						if ($scope.options.lookupInfo && $scope.options.dependantField) {
							var info = $scope.options.lookupInfo[$scope.entity[$scope.options.dependantField]];
							var column = info.column;
							var fn = info.dynamicBeforeValidationFn;
							Object.keys($scope.options.lookupInfo).forEach(function (key) {
								if (key === $scope.entity[$scope.options.dependantField].toString()) {
									$scope.entity[column] = newValue;
									if (fn) {
										fn(newValue, oldValue, dataItem, $scope.entity);
									}
								} else {
									$scope.entity[$scope.options.lookupInfo[key].column] = null;
								}
							});
						}
						if ($scope.options.dynamicDisplayMember) {
							$scope.entity[$scope.options.dynamicDisplayMember] = self.selectText(dataItem);
						}
					}
					$scope.onSelectedItemChanged.fire(global.event, args, $scope);
					self.setViewValue(newValue);
					self.applyPKey(dataItem);
					self.onModelChange(oldValue, newValue, dataItem);
				}

				/**
				 * @description: open lookup view.
				 */
				self.openLookup = function () {
					switch ($scope.lookupView) {
						case 'popup': {
							self.openPopup();
						}
							break;
						case 'dialog': {
							self.closePopup();
							self.openDialog();
						}
							break;
					}
				};

				var popupInstance;

				/**
				 * @description: open popup view.
				 */
				self.openPopup = function () {
					// popup is opened.
					if (angular.isFunction($scope.$close) || !$scope.options.popupOptions) {
						return $q.when();
					}

					var lookupElement = $element.find('.lookup-container');

					var extension = {
						uuid: $scope.settings.uuid,
						scope: $scope,
						options: $scope.options,
						focusedElement: lookupElement,
						relatedTarget: lookupElement,
						onInputKeyDown: self.onInputKeyDown,
						onInputKeyUp: self.onInputKeyUp,
						onInputChange: self.onInputChange,
						onInputBlur: self.onInputBlur,
						onLookupSearch: self.onLookupSearch
					};

					var popupOptions = _.mergeWith({}, $scope.settings.popupOptions, extension, basicsLookupdataLookupOptionService.customizer);

					return self.doPreparation().then(function doPreparationCallback() {
						if(popupInstance || self.disposed) {
							return;
						}

						popupInstance = basicsLookupdataPopupService.showPopup(popupOptions);

						// waiting for popup window closed.
						popupInstance.closed.then(function () {
							preventPopupClosing = false;
							popupInstance = null;
							$scope.editModeHandler.onPopupDestroy();
							$scope.searchString = '';
							self.focus();
							$scope.onPopupClosed.fire(global.event, {popup: popupInstance}, $scope);
						});

						// waiting for result from popup window.
						popupInstance.result.then(function (result) {
							if (result && result.isOk) {
								// stop searching process
								$scope.isSearching = false;

								if (deferPromise === null) {
									if (result.value) {
										self.apply(result.value, result.delValue);
									} else if (clearValueFromInput) {
										self.apply(null);
									} else if (completeText !== null && result.completeItem) {
										self.apply(result.completeItem);
									}
								}
							}
						});

						// special logic for IE, preventDefault behavior for mouse down event can prevent input blur
						// prevent closing popup if popup content get focus
						popupInstance.opened.then(function (result) {
							result.element.bind('focusin', function () {
								preventPopupClosing = true;
							});

							$scope.onPopupOpened.fire(global.event, {popup: popupInstance}, $scope);
						});

					});
				};

				self.focus = function () {
					$scope.inputElement.focus();
				};

				self.highlight = function () {
					$scope.inputElement.focus().select();
				};

				self.highlightOnce = _.once(function () {
					$timeout(self.highlight);
				});

				/**
				 * @description: open dialog view.
				 */
				self.openDialog = function () {
					if (!$scope.options.dialogOptions) {
						return;
					}

					var dialogOptions = _.merge({}, $scope.options.dialogOptions, {
						scope: $scope
					});

					if($scope.settings.dialogUuid) {
						dialogOptions.id = $scope.settings.dialogUuid;
						dialogOptions.resizeable = $scope.settings.resizeable;
					}

					// #91866 - in case open dialog immediately after text input which will trigger search
					$scope.cancelTimeout();

					self.doPreparation().then(function doPreparationCallback() {
						platformDialogService.showDialog(dialogOptions).then(function closeDialogCallback(result) {
							if (result && result.isOk) {
								self.apply(result.selectedItem);
							}
						}).finally(self.focus);
					});

				};

				/**
				 * @description: open add dialog view.
				 */
				self.openAddDialog = function () {
					if ($scope.settings.openAddDialogFn) {
						$scope.settings.openAddDialogFn($injector, $scope.entity, $scope.settings, $scope.$parent.options).then(function (result) {
							if (result) {
								$scope.settings.dataView.updateDescriptor(result);
								self.apply(result);
							}
						}).finally(self.focus);
						return;
					}
					if (!$scope.settings.createOptions) {
						return;
					}

					var createOptions = $scope.settings.createOptions;
					if (angular.isString(createOptions)) {
						createOptions = $injector.get(createOptions);
					}

					var uiStandardService = createOptions.uiStandardService;
					if (angular.isString(uiStandardService)) {
						uiStandardService = $injector.get(uiStandardService);
					}

					if (!createOptions || !uiStandardService) {
						return;
					}

					var defaultOptions = {
						title: $translate.instant('cloud.common.toolbarInsert'),
						fid: 'basic.lookup.newDialog',
						attributes: {}
					};

					createOptions = _.merge({}, defaultOptions, createOptions);

					var domains = uiStandardService.getDtoScheme();
					_.each(createOptions.fields, function (field) {
						if (domains.hasOwnProperty(field)) {
							createOptions.attributes[field] = domains[field];
						}
					});

					createDialogConfigService.showDialog(createOptions).then(function (result) {
						if (result.ok) {
							$scope.settings.dataView.updateDescriptor(result.data);
							self.apply(result.data);
						}
					}).finally(self.focus);
				};

				/**
				 * @description: open detail dialog view.
				 */
				self.openDetailDialog = function () {
					if (!$scope.settings.detailOptions.uiStandardService) {
						return;
					}

					var uiStandardService = $scope.settings.detailOptions.uiStandardService;
					if (angular.isString(uiStandardService)) {
						uiStandardService = $injector.get(uiStandardService);
					}

					if (!uiStandardService) {
						return;
					}

					var isEditable = $scope.settings.detailOptions.isEditable;
					var config = {};
					config.title = $translate.instant('cloud.common.details');
					config.showCancelButton = isEditable;
					if ($scope.settings.detailOptions.detailConverter && _.isFunction($scope.settings.detailOptions.detailConverter)) {
						$scope.settings.detailOptions.detailConverter($scope.displayItem).then(function (item) {
							config.dataItem = item;
							self.openDetailFormDialog(config, uiStandardService, isEditable);
						});
					} else {
						config.dataItem = $scope.displayItem;
						self.openDetailFormDialog(config, uiStandardService, isEditable);
					}
				};

				/**
				 * @description: open detail form dialog view.
				 */
				self.openDetailFormDialog = function (config, uiStandardService, isEditable) {
					platformDataProcessExtensionHistoryCreator.processItem(config.dataItem);
					config.formConfiguration = self.provideDetailForm(uiStandardService, !isEditable);
					platformModalFormConfigService.showDialog(config, false).then(function (result) {
						if (result.ok && isEditable) {
							var dataService = $scope.settings.detailOptions.dataService;
							if (angular.isString(dataService)) {
								dataService = $injector.get(dataService);
							}
							dataService.update(result.data).then(function () {
								$scope.settings.dataView.updateDescriptor(result.data);
								self.apply(result.data);
								if (angular.isFunction($scope.settings.detailOptions.onOk)) {
									$scope.settings.detailOptions.onOk(result.data);
								}
							});
						}
					});
				};

				/**
				 * @description: reload lookup data.
				 */
				self.reloadLookupData = function (id) {
					var requestArgs = null;
					if($scope.settings.dataView.dataPage.enabled){
						requestArgs = {
							searchFields: $scope.settings.inputSearchMembers,
							searchString: $scope.searchString,
							isCaseSensitive: $scope.settings.isCaseSensitiveSearch,
							paging: true
						};
					}
					$scope.settings.dataView.loadData(requestArgs).then(function (data) {
						self.apply(_.find(data, function (item) {
							return item.Id === id;
						}));
					});
				};

				/**
				 * @description: provide detial form layout.
				 */
				self.provideDetailForm = function provideDetailForm(uiStandardService, readonly) {
					var formLayout = _.cloneDeep(uiStandardService.getStandardConfigForDetailView());
					var myLayout = {
						fid: 'data.service.detailForm',
						version: '0.0.1',
						showGrouping: true,
						groups: [],
						rows: []
					};

					_.forEach(formLayout.groups, function (group) {
						var newGroup = {};
						_.extend(newGroup, group);
						myLayout.groups.push(newGroup);
					});

					var index = 1;
					var readonlyFields = $scope.settings.detailOptions.readonlyFields;
					_.forEach(formLayout.rows, function (row) {
						var newRow = {};
						_.extend(newRow, row);
						newRow.sortOrder = index;
						newRow.readonly = row.readonly || readonly ||
							(_.findIndex(readonlyFields, function (f) {
								return f.toLowerCase() === row.rid;
							}) >= 0);
						++index;

						myLayout.rows.push(newRow);
					});

					platformTranslateService.translateFormConfig(myLayout);

					return myLayout;
				};

				/**
				 * @description: close popup view.
				 */
				self.closePopup = function () {
					var success = false;
					if (angular.isFunction($scope.$close)) {
						success = $scope.$close();
					}
					return success;
				};

				/**
				 * @description: search data source to find similar item to complete edit box value.
				 */
				self.search = function (newValue, paging) {
					var popupReadyPromise = $q.when();
					if (!$scope.settings.disablePopupOnSearch && isActive) {
						popupReadyPromise = self.openPopup();
					}

					popupReadyPromise.then(function popupReadyPromiseFn() {
						if(self.disposed) {
							return;
						}

						self.onInputChange.fire(global.event, {newValue: newValue}, $scope);
						$scope.isSearching = true;
						$scope.settings.dataView.search({
							searchFields: $scope.settings.inputSearchMembers,
							searchString: newValue,
							isCaseSensitive: $scope.settings.isCaseSensitiveSearch,
							paging: paging,
							treeOptions: $scope.settings.treeOptions,
							delaySetPageInfo: true
						}).then(function (result) {
							if (self.disposed || !$scope.isSearching) {
								return;
							}
							if ($scope.searchString === result.searchString) {
								self.autoComplete(result.similarItem, result.searchString);
								self.onLookupSearch.fire(global.event, {result: result}, $scope);
								// #147153 - set page info here due to some search will be ignored
								if ($scope.settings.dataView.dataPage.enabled && $scope.settings.dataView.pageInfo) {
									$scope.settings.dataView.dataPage.totalLength = $scope.settings.dataView.pageInfo.itemsFound;
									$scope.settings.dataView.dataPage.currentLength = $scope.settings.dataView.pageInfo.itemsRetrieved;
									$scope.settings.dataView.dataPage.count = Math.ceil($scope.settings.dataView.dataPage.totalLength / $scope.settings.dataView.dataPage.size);
								}
							}
						}).finally(function () {
							$scope.isSearching = false;
						});

					});
				};

				/**
				 * @description: complete edit box value.
				 */
				self.autoComplete = function (dataItem, input) {
					if (!$scope.settings.autoComplete || !dataItem || !$scope.canSelect(dataItem)) {
						return;
					}

					completeItem = dataItem;

					if(!isActive) {
						self.apply(completeItem);
						return;
					}

					var inputs = $scope.inputElement;
					var length = input.length;
					var completedValue = $scope.extractValue(dataItem, $scope.settings.displayMember);
					var completedLength = completedValue.length;

					if (completedLength > length) {
						inputs[0].value = completedValue;
						$scope.ngModel = inputs[0].value;
						inputs.selectRange(length, completedLength);
						completeText = completedValue;
					}
				};

				/**
				 * @description: generate corresponding handler logic for different edit mode.
				 */
				self.generateEditModeHandler = function () {
					var handler = {
						currentHandler: null,
						getValueByItem: function (dataItem) {
							return this.currentHandler.getValueByItem(dataItem);
						},
						getSelectedRowId: function () {
							return this.currentHandler.getSelectedRowId();
						},
						onPopupDestroy: function () {
							this.currentHandler.onPopupDestroy();
						},
						onInputChange: function (newValue) {
							this.currentHandler.onInputChange(newValue);
						}
					};

					var foreignkeyModeHandler = {
						getValueByItem: function (dataItem) {
							return $scope.extractValue(dataItem, $scope.settings.valueMember);
						},
						getSelectedRowId: function () {
							return basicsLookupdataLookupKeyService.getIdentificationValue(
								$scope.ngModel,
								$scope.displayItem,
								$scope.settings,
								true
							);
						},
						onPopupDestroy: function () {
							$scope.restoreDisplayText();
						},
						onInputChange: angular.noop
					};

					var textModeHandler = {
						getValueByItem: function (dataItem) {
							return $scope.extractValue(dataItem, $scope.settings.displayMember);
						},
						getSelectedRowId: function () {
							return basicsLookupdataLookupKeyService.getIdentificationValue(
								$scope.extractValue($scope.displayItem, $scope.settings.valueMember),
								$scope.displayItem,
								$scope.settings,
								true
							);
						},
						onPopupDestroy: angular.noop,
						onInputChange: function (newValue, oldValue) {
							self.setViewValue(newValue);
							self.onModelChange(oldValue, newValue, null);
						}
					};

					handler.setEditMode = function (isTextEditable) {
						this.currentHandler = isTextEditable ? textModeHandler : foreignkeyModeHandler;
					};

					return handler;
				};

				/**
				 * @description: merge default options with custom options.
				 */
				self.mergeOptions = function (defaultOptions, userOptions) {
					var appendedOptions = userOptions ? basicsLookupdataLookupApi.appendOptions(userOptions.lookupKey) || {} : {},
						domainOptions = userOptions ? basicsLookupdataDomainService.lookupOptionsByDomain(userOptions.domain, userOptions) : {};
					return _.mergeWith({}, defaultOptions, domainOptions, userOptions, appendedOptions, basicsLookupdataLookupOptionService.customizer);
				};

				/**
				 * @description: invalidate dropdown data source, lookup will load data from server next time.
				 */
				self.invalidateData = function () {
					$scope.settings.dataView.invalidateData();
				};

				/**
				 * @description update display data.
				 */
				self.refreshText = function () {
					if ($scope.settings.isTextEditable) {
						return;
					}
					if($scope.settings.dataView.dataPage.enabled){
						return;
					}
					// null, undefined and not a number.
					if (_.isNil($scope.ngModel) || $scope.ngModel === '' || _.isNaN($scope.ngModel)) {
						self.selectItem(null);
					}
					else {
						var identification = basicsLookupdataLookupKeyService.getIdentification($scope.ngModel, $scope.entity, $scope.settings);
						$scope.settings.dataView.getItemById(identification).then(function (lookupItem) {
							self.selectItem(lookupItem);
							// update service data used for formatting lookup foreign key.
							$scope.settings.dataView.updateDescriptor(lookupItem);
						});
					}
				};

				/**
				 * @description update ui view by options
				 * @param options an object with property in default options.
				 */
				self.updateOptions = function (options) {
					if (angular.isObject(options)) {
						_.mergeWith($scope.settings, options, basicsLookupdataLookupOptionService.customizer);
					}
				};

				/**
				 * call on scope destroying.
				 */
				self.destroy = function () {
					self.disposed = true;
					$scope.cancelTimeout();
				};

				self.onElementLoaded = function () {
					if ($scope.isCellEditor) {
						self.focus();
					}

					// prevent input focus lost
					$element.find('button[btn-edit]').mousedown(function (e) {
						e.preventDefault();
					});
				};

				self.loadSchemas = function loadSchemas(schemas) {

					var requestSchemas = _.filter(schemas, function requestFilterFn(schemaOption) {
						return !platformSchemaService.getSchemaFromCache(schemaOption);
					});

					return (requestSchemas.length > 0 ? platformSchemaService.getSchemas(requestSchemas) : $q.when(0)).then(function responseFn() {
						return _.map(schemas, function responseMapFn(schemaOption) {
							return platformSchemaService.getSchemaFromCache(schemaOption);
						});
					});
				};

				self.doPreparation = function doPreparation() {

					var settings = $scope.settings;
					var prePromises = [];

					// Prepare schema
					if (!_.isEmpty(settings.layoutOptions.schemas)) {
						prePromises.push(self.loadSchemas(settings.layoutOptions.schemas));
					}

					return $q.all(prePromises).then(function preResponseCallback() {

						// Prepare column
						if (_.isEmpty(settings.columns) && settings.layoutOptions.uiStandardServiceName) {

							// translation changed will lead to app update translation for grids, so the grid must ready before translation change.
							// settings.gridOptions.lazyInit = false;

							var standardService = $injector.get(settings.layoutOptions.uiStandardServiceName);

							settings.columns = $scope.options.columns = settings.layoutOptions.processColumns(_.map(standardService.getStandardConfigForListView().columns, function columnMapFn(col) {
								return _.extend(_.cloneDeep(col), {
									editor: null,
									editorOptions: null,
									required: false,
									searchable: col.searchable === true,
									navigator: null,
									formatter: angular.isString(col.formatter) ? col.formatter : function formatterFn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options) {
										if (angular.isFunction(col.formatter)) {
											var formattedValue = null;
											try {
												formattedValue = col.formatter(row, cell, value, columnDef, dataContext, plainText, uniqueId, options);
											} catch (ex) {
												$log.warn('(format error) > lookupType : ' + $scope.options.lookupType + ' > column : ' + columnDef.field + ' > ' + ex.message);
											}
											return formattedValue;
										}
										return col.formatter;
									}
								});
							}));

							self.updateSearchMembers();

							// Prepare translation
							var modules = _.uniq(_.map(_.filter(settings.columns, function filterFn(col) {
								return angular.isDefined(col.name$tr$) && col.name$tr$;
							}), function moduleMapFn(col) {
								return col.name$tr$.split('.').slice(0, 2).join('.');
							}));

							return platformTranslateService.registerModule(modules);
						}

						return $q.when(true);

					});
				};

				self.allowFastInputInGrid = function () {
					return $scope.isCellEditor && $scope.settings.isFastDataRecording;
				};

				$scope.settings = null;
				//
				$scope.ngModel = null;
				// Display text show in edit box of current foreign key.
				$scope.displayText = '';
				// Original display text in despite of user input
				$scope.originalDisplayText = '';
				// Data item of current foreign key.
				$scope.displayItem = null;
				// is lookup act as cell editor.
				$scope.isCellEditor = false;
				//
				$scope.hasButtons = false;
				//
				$scope.hasExtButtons = false;
				// represent lookup is loading data.
				$scope.isLoading = false;
				// represent lookup is searching data.
				$scope.isSearching = false;
				//
				$scope.searchString = '';
				//
				$scope.lookupView = '';
				// Event triggered when edit value changed.
				$scope.onEditValueChanged = new PlatformMessenger();
				// Event triggered when popup selected item changed.
				$scope.onSelectedItemChanged = new PlatformMessenger();
				// Event triggered when grid option's multi-select is true.
				$scope.onSelectedItemsChanged = new PlatformMessenger();
				// Event triggered on custom display template.
				$scope.onInputGroupClick = new PlatformMessenger();
				// Event triggered when controller initialized.
				$scope.onInitialized = new PlatformMessenger();
				// Event triggered when editor destroyed.
				$scope.onDestroyed = new PlatformMessenger();
				// on popup opened event
				$scope.onPopupOpened = new PlatformMessenger();
				// on popup closed event
				$scope.onPopupClosed = new PlatformMessenger();
				// handle different logic for edit mode.
				$scope.editModeHandler = self.generateEditModeHandler();

				// Get entity, read only.
				Object.defineProperty($scope, 'entity', {
					get: function () {
						return $scope.$parent.$eval($attrs.entity);
					},
					set: angular.noop
				});

				// Get options, read only.
				Object.defineProperty($scope, 'options', {
					get: function () {
						return $scope.$parent.$eval($attrs.options);
					},
					set: angular.noop
				});

				// Get result, read only.
				Object.defineProperty($scope, 'result', {
					get: function () {
						return $scope.$parent.$eval($attrs.result);
					},
					set: angular.noop
				});

				Object.defineProperty($scope, 'config', {
					get: function () {
						return $scope.$parent.$eval($attrs.config) || {};
					},
					set: angular.noop
				});

				// Get inputElement.
				var _inputElement = null;
				Object.defineProperty($scope, 'inputElement', {
					get: function () {
						if (!_inputElement || !_inputElement.length) {
							_inputElement = $element.find('input:first');
						}
						return _inputElement;
					},
					set: function (value) {
						_inputElement = value;
					}
				});

				$scope.setDisplayText = function (value) {
					$scope.displayText = value;
					$scope.originalDisplayText = value;
				};

				/**
				 * @description extract value of field from item object.
				 */
				$scope.extractValue = function (item, field) {
					return item ? platformObjectHelper.getValue(item, field) : null;
				};

				/**
				 * @description get status template to show in left part of input box.
				 * e.g. show status image to left part input box, now you can put custom template instead of just simple image html.
				 * e.g. estimate rule lookup, you can put several image button to left part input box.
				 */
				$scope.getCustomHtml = function () {
					const displayText = _.escape($scope.displayText);
					let snippet = $scope.settings.formatter($scope.ngModel, $scope.displayItem,
						displayText, $scope.settings, $scope.entity);

					// if custom content is empty, show placeholder.
					if (_.isNil(snippet) || snippet.trim() === '') {
						snippet = '<div style="color: #888;font-style: italic;cursor: default;">' + $scope.settings.placeholder + '</div>';
					}

					return $sce.trustAsHtml(snippet);
				};

				/**
				 * @description: fired when click input group.
				 */
				$scope.handleInputGroupClick = function (e) {
					var args = {
						selectedValue: $scope.ngModel,
						selectedItem: $scope.displayItem,
						entity: $scope.entity,
						settings: $scope.settings
					};
					$scope.onInputGroupClick.fire(e, args, $scope);
				};

				/**
				 * Cancel deferred promise
				 */
				$scope.cancelTimeout = function () {
					if (deferPromise) {
						$timeout.cancel(deferPromise);
						deferPromise = null;
					}
				};

				/**
				 * @description: defer execution of target function.
				 */
				$scope.defer = function (targetfn, self, args) {
					$scope.cancelTimeout();
					deferPromise = $timeout(function () {
						targetfn.apply(self, args);
						deferPromise = null;
					}, $scope.settings.searchInterval);
				};

				/**
				 * @description restore display text by display item as display text could be edit.
				 */
				$scope.restoreDisplayText = function () {
					if ($scope.options.dynamicLookupMode) {
						if ($scope.options.dynamicDisplayMember) {
							if (!_.isNull(escText)) {
								$scope.entity[$scope.options.dynamicDisplayMember] = escText;
							}
						}
					}
					self.selectText($scope.displayItem);
				};

				/**
				 * @description: event handler, it is triggered when click drop down button
				 */
				$scope.editValue = function () {
					self.focus();
					var success = self.closePopup();
					if (!!$scope.options.dynamicLookupMode && $scope.options.dynamicDisplayMember) {
						self.refreshText();
					}
					switch ($scope.lookupView) {
						case 'popup': {
							if (!success) {
								self.openPopup();
								self.focus();
							}
						}
							break;
						case 'dialog': {
							self.openDialog();
						}
							break;
					}
					$scope.searchString = '';
				};

				/**
				 * @description: event handler, it is triggered when click delete button.
				 */
				$scope.clearValue = function () {
					if (_.isNull(escText)) {
						escText = $scope.displayText;
					}
					self.apply(null);
				};

				/**
				 * @description: event handler, it is triggered when click add button.
				 */
				$scope.addValue = function () {
					self.focus();
					self.openAddDialog();
				};

				/**
				 * @description: event handler, it is triggered when click show detail button.
				 */
				$scope.showDetail = function () {
					self.focus();
					self.openDetailDialog();
				};

				/**
				 * @description: event handler, it is triggered when edit box is focused and have key down.
				 */
				/* jshint -W074 */ // cyclomatic complexity is too high.
				var deleteMode = false;
				$scope.onKeydown = function (event) {
					if ($scope.settings.readOnly || $scope.ngReadonly || !$scope.settings.showEditButton) {
						return;
					}

					const inputValue = $scope.inputElement && $scope.inputElement.length > 0 ? $scope.inputElement[0].value : '';

					var prevent = function () {
							event.preventDefault();
							event.stopPropagation();
						},
						args = {
							event: event,
							completeItem: completeItem,
							inputValue: inputValue,
							defaultPrevented: false
						};

					self.onInputKeyDown.fire(event, args, $scope);

					if (!args.defaultPrevented) {
						switch (event.keyCode) {
							case keyCodes.F3: {
								prevent();
								self.openLookup();
								if ($scope.settings.isTextEditable) {
									deleteMode = false;
									if (!$scope.settings.isSupportedKeyDown) {
										var inputs = $scope.inputElement;
										$scope.onChange(inputs[0].value);
									}
								}
							}
								break;
							case keyCodes.ESCAPE: {
								self.closePopup();
								completeItem = null;
								if (!$scope.settings.isTextEditable) {
									$scope.restoreDisplayText();
								}
							}
								break;
							case keyCodes.TAB:
							case keyCodes.ENTER: {
								//Grid needs the events dont prevent them >:(
								//prevent();
								if (completeItem) {
									self.apply(completeItem);
								} else if (clearValueFromInput) {
									self.apply(null);
								} else if (deleteMode === true && $scope.settings.isTextEditable) {
									$scope.onChange(inputValue);
								}
							}
								break;
						}

						if (event.keyCode === keyCodes.BACKSPACE || event.keyCode === keyCodes.DELETE) {
							deleteMode = true;
						} else {
							deleteMode = false;
						}
					}
				};

				$scope.onKeyup = function(event){
					if ($scope.settings.readOnly || $scope.ngReadonly || !$scope.settings.showEditButton) {
						return;
					}

					var args = {
						event: event,
						defaultPrevented: false
					};

					self.onInputKeyUp.fire(event, args, $scope);
				};

				/**
				 * @description: event handler, complete input value when edit value in edit box.
				 */
				$scope.onChange = function (newValue) {
					// I think even the input value equals completeText, we also need to filter the items.
					const tempCompleteText = completeText ? completeText.trim() : completeText; // newValue has been trimmed.
					if (newValue !== tempCompleteText) {
						completeText = null;
						if ($scope.settings.formatInput && _.isFunction($scope.settings.formatInput)) {
							newValue = $scope.settings.formatInput(newValue);
						}
						$scope.editModeHandler.onInputChange(newValue);
						clearValueFromInput = !newValue;
						if (deleteMode === true && $scope.settings.isTextEditable) {
							self.closePopup();
							completeItem = null;
						} else if ($scope.settings.autoSearch) {
							$scope.searchString = newValue;
							completeItem = null;
							$scope.defer(self.search, $scope, [newValue]);
						}
					}

					// fix https://rib-40.atlassian.net/browse/DEV-35956
					// if fast data recording is enabled, apply the value immediately
					self.applyFastInputInGrid(newValue);
				};

				/**
				 * @description: event handler.
				 */
				$scope.onFocus = function () {
					isActive = true;
				};

				/**
				 * @description: event handler.
				 */
				$scope.onBlur = function (event) {
					completeText = null;
					isActive = false;

					// don't close popup while popup content result in input blurs
					if(popupInstance && (document.hasFocus(popupInstance.element[0]) || $.contains(popupInstance.element[0], event.relatedTarget))) {
						return;
					}

					if (preventPopupClosing) {
						preventPopupClosing = false;
						self.focus();
						return;
					}

					var args = {
						event: event,
						defaultPrevented: false
					};

					self.onInputBlur.fire(event, args, $scope);
					if (!args.defaultPrevented) {
						completeItem = null;
						clearValueFromInput = false;
						if (!$scope.settings.isTextEditable) {
							$scope.restoreDisplayText();
						}
						self.closePopup();
					}
				};

				/**
				 * validate selected data item is valid or not.
				 */
				$scope.canSelect = function (dataItem) {
					var isValid = true;

					if (dataItem && $scope.settings.selectableCallback) {
						isValid = $scope.settings.selectableCallback(dataItem, $scope.entity, $scope.settings);
					}

					return isValid;
				};

				$scope.getEditIcon = function () {
					if ($scope.isSearching && !$scope.isCellEditor) {
						return 'spinner-sm';
					}

					// popup
					if ($scope.lookupView === 'popup') {
						return 'caret';
					}

					// dialog
					return 'control-icons ico-input-lookup lookup-ico-dialog';
				};

				$scope.updateDisplayData = self.refreshText;
				$scope.search = self.search;

				self.initialize();

				/**
				 * @description: default image formatter.
				 */
				function defaultImageFormatter(value, lookupItem, displayValue, options, entity) {
					var imgSrc = $scope.settings.imageSelector.select(lookupItem, entity);
					var imageSelector = $scope.settings.imageSelector;
					var htmlMarkup = '';

					//add img-tag if src-path enabled[FireFox].
					if (imgSrc !== '') {
						if (imageSelector.getIconType) {
							switch (imageSelector.getIconType()) {
								case 'css':
									htmlMarkup = '<i class="block-image ' + imgSrc + '"></i>';
									break;
								case 'svg': {
									htmlMarkup = '<img src="' + imgSrc + '">';
									var iconColors = getSvgColorProperty(entity[options.filter.svgBackgroundColor], options.filter.backgroundColorType, options.filter.backgroundColorLayer);
									htmlMarkup = getSvgIconWrapper(iconColors, imgSrc);
									break;
								}
								case 'url':
								default:
									htmlMarkup = '<img src="' + imgSrc + '" class="block-image" />';
									break;
							}
						}
					}
					if (displayValue !== '') {
						htmlMarkup += '<span class="pane-r">' + displayValue + '</span>';
					}

					return htmlMarkup;
				}
			}

			function getSvgColorProperty(color, type, layer) {
				let iconColors = '';
				let svgBackground = '';

				if (color && type && !_.isNil(layer) && !_.isEmpty(layer)) {
					iconColors = ' style="';
					switch (type) {
						case 'dec':
							svgBackground = drawingUtils.decToHexColor(color);
							break;
						case 'hex': // the implementation of hex format hasn't been yet defined -> needs to be in string format with '#' at first position
						case 'string':
							svgBackground = color;
							break;
						default:
							break;
					}
					layer.forEach(l => iconColors += `--icon-color-${l}: ${svgBackground}; `);

					iconColors += '"';

				}
				return iconColors;
			}

			function getSvgIconWrapper(iconColors, imageUrl) {
				let svgUrl = `${imageUrl.split(' ')[0]}.svg#${imageUrl.split(' ')[1]}`;
				return `<svg class="block-image"${iconColors}>
							<use href="${globals.clientUrl}cloud.style/content/images/${svgUrl}" class="block-image ${imageUrl}"></use>
						</svg>`;
			}

			function linker(scope, element, attrs, ngModelCtrl) { /* jshint -W074 */
				var _entity;

				// model -> view
				ngModelCtrl.$render = function () {
					var oldValue = scope.ngModel,
						newValue = ngModelCtrl.$viewValue;

					_entity = scope.entity;

					// if bound data is a string, lookup should directly show the value in editable input control when fast data recording is enabled
					if(scope.ctrl.allowFastInputInGrid() && _.isString(newValue)) {
						if(scope.settings.isTextEditable){
							scope.ngModel = newValue;
						}else{
							scope.setDisplayText(newValue);
						}
						return;
					}

					if (scope.settings.domain === 'translation') {
						if (angular.isObject(ngModelCtrl.$viewValue)) {
							scope.ngModel = ngModelCtrl.$viewValue.Translated;
						}
						else {
							scope.ngModel = null;
						}
					}
					else {
						scope.ngModel = ngModelCtrl.$viewValue;
					}

					scope.ctrl.onModelChange(oldValue, newValue, null, true);
				};

				// 125284 - Lookup does not update displayed value in form when switching item selection in grid due to ngModel value is not changed
				if(attrs.entity) {
					scope.$parent.$watch(attrs.entity, function (newValue) {
						if (newValue !== _entity) {
							scope.ctrl.refreshText();
						}
					});
				}

				scope.ngModelCtrl = ngModelCtrl;

				// call change callback from form control.
				ngModelCtrl.$viewChangeListeners.push(function () {
					scope.$parent.$eval(attrs.config + '.rt$change()');
				});

				// view -> model
				scope.ctrl.setViewValue = function (viewValue) {
					if (scope.settings.domain === 'translation') {
						if (angular.isObject(ngModelCtrl.$viewValue)) {
							if (ngModelCtrl.$viewValue.Translated !== viewValue) {
								ngModelCtrl.$viewValue.Translated = viewValue;
								ngModelCtrl.$viewValue.Modified = true;
								scope.$parent.$eval(attrs.config + '.rt$change()');
							}
						}
					}
					else {
						if (ngModelCtrl.$viewValue !== viewValue) {
							ngModelCtrl.$setViewValue(viewValue);
							ngModelCtrl.$commitViewValue();
						}
					}
				};

				//scope.ngModel = ngModelCtrl.$viewValue;

				// register instance to basicsLookupdataLookupApi
				if (scope.settings.lookupKey) {
					basicsLookupdataLookupApi.registerInstance(scope.settings.lookupKey, scope.ctrl);
					var unregisterInstance = function () {
						basicsLookupdataLookupApi.unregisterInstance(scope.settings.lookupKey, scope.ctrl);
					};
				}

				scope.$on('$destroy', function () {
					scope.onDestroyed.fire(global.event, {}, scope);
					ngModelCtrl.$render = angular.noop;
					scope.inputElement = null;
					scope.settings.dataView.destroy();
					scope.ctrl.destroy();
					(unregisterInstance || angular.noop)();
				});

				var template = $templateCache.get('lookup-general.html');
				var inputContent;

				if(scope.settings.multipleSelection) {
					inputContent = $templateCache.get('input-group-content-multiple.html');
				}
				else if (scope.settings.showCustomInputContent) {
					inputContent = $templateCache.get('input-group-content-custom.html');
				}
				else {
					inputContent = $templateCache.get('input-group-content-default.html')
						.replace(/\$\$inputStyleHolder\$\$/gm, scope.settings.textAlign === 'right' ? 'text-right' : '')
						.replace(/\$\$modelHolder\$\$/gm, scope.settings.isTextEditable ? 'ngModel' : 'displayText')
						.replace(/\$\$validationHolder\$\$/gm, scope.settings.enableValidation ? ('data-' + scope.settings.customValidation) : '')
						.replace(/\$\$placeholder\$\$/gm, scope.settings.placeholder ? ('placeholder="' + scope.settings.placeholder + '"') : '')
						.replace(/\$\$restrictHolder\$\$/gm, !scope.settings.regex ? '' : ' data-ng-pattern-restrict="' + scope.settings.regex + '"');
				}

				function getCssClasses() {
					let cssClass = scope.isCellEditor ? 'grid-container ' : 'form-control ';
					let e2eNameObject = Object.assign(scope.config, {
							displayMember: scope.settings.displayMember,
							lookupType: scope.settings.lookupType});

					let e2eCssClass = platformE2eUtilService.getCssForTest(e2eNameObject, ['model', 'lookupType', 'displayMember']);
					cssClass += e2eCssClass;

					return cssClass;
				}

				template = template.replace(/\$\$inputGroupContentHolder\$\$/gm, inputContent)
					.replace(/\$\$buttonsHtmlHolder\$\$/gm, scope.hasButtons ? $templateCache.get(scope.isCellEditor ? 'cell-buttons.html' : 'form-buttons.html') : '')
					.replace(/\$\$extButtonsHtmlHolder\$\$/gm, scope.hasExtButtons ? $templateCache.get(scope.isCellEditor ? 'cell-ext-buttons.html' : 'form-ext-buttons.html') : '')
					// .replace(/\$\$editIconHolder\$\$/gm, scope.lookupView === 'popup' ? '<i class="caret"></i>' : '<div class="control-icons ico-input-lookup lookup-ico-dialog">&nbsp;</div>')
					.replace(/\$\$editIconHolder\$\$/gm, '<div data-ng-class="getEditIcon()"></div>')
					.replace(/\$\$inputGroupStyleHolder\$\$/gm, getCssClasses())
					.replace(/\$\$btnStyleHolder\$\$/gm, scope.isCellEditor ? '' : 'input-sm');

				var content = angular.element(template);

				if(angular.isFunction(scope.settings.handleContent)){
					scope.settings.handleContent(content);
				}

				$compile(content)(scope).appendTo(element);

				// Skip buttons when do form navigation.
				var formControlElement = element.parents('.control-directive');

				if (formControlElement.length) {
					var tabstop = formControlElement.attr('data-tabstop');
					var enterstop = formControlElement.attr('data-enterstop');
					var elem = element.find(':input,[tabindex]').filter(':visible');

					if(elem && elem.length) {
						if (tabstop) {
							formControlElement.removeAttr('data-tabstop');
							$(elem[0]).attr('data-tabstop', tabstop);
						}
						if (enterstop) {
							formControlElement.removeAttr('data-enterstop');
							$(elem[0]).attr('data-enterstop', enterstop);
						}
					}
				}

				scope.ctrl.onElementLoaded();

				if (scope.options.showDropdown) {
					scope.ctrl.openLookup();
				}

				scope.onInitialized.fire(global.event, {lookup: scope.ctrl, lookupOptions: scope.options}, scope);
			}
		}]);

})(angular, jQuery, window);
