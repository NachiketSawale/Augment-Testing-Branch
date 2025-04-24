/**
 * @ngdoc directive
 * @name platform.directive:platformMenuList
 * @element div
 * @restrict A
 * @priority
 * @scope true
 * @description
 * Insert a unsorted list with buttons within the listitems
 * <doc:example>
 * <doc:source>
 *     <div data-platform-menu-list data-list="commandBarDeclaration"></div>
 * </doc:source>
 * </doc:example>
 */

// jshint -W072
// jshint -W074
(function (angular) {
	'use strict';

	// list config object
	angular.module('platform').constant('platformMenuListDefaultListConfig', {
		hide: 'hideItem',
		isOnlyContext: 'isOnlyContext',
		caption: 'caption',
		tooltip: 'tooltip',
		disabled: 'disabled',
		list: 'list',
		hideOverflow: 'hideOverflow',
		activeValue: 'activeValue',
		value: 'value',
		items: 'items',
		model: 'model',
		options: 'options',
		types: {
			item: 'item',
			subList: 'sublist',
			radio: 'radio',
			check: 'check',
			overflow: 'overflow-btn',
			directive: 'directive',
			dropDown: 'dropdown-btn',
			divider: 'divider',
			actionSelectButton: 'action-select-btn'
		}
	});

	// placeholder object
	angular.module('platform').constant('platformMenuListDefaultPlaceHolder', {
		hide: /##hide##/g,
		cssClass: /##cssClass##/g,
		cssExtendClass: /##cssExtendClass##/g,
		listCssClass: /##listCssClass##/g,
		ngClass: /##addClass##/g,
		content: /##content##/g,
		title: /##title##/g,
		tooltip: /##tooltip##/g,
		disabled: /##disabled##/g,
		fn: /##fn##/g,
		id: /##itemId##/g,
		attr: /##attr##/g,
		model: /##model##/g,
		currentButton: /##currentButtonId##/g,
		listHeader: /##listHeader##/g,
		hideOverflow: /##hideOverflow##/g,
		list: /##list##/g,
		menuAlignment: /##menuAlignment##/g,
		showSVGTag: /##showSVGTag##/g,
		svgSprite: /##svgSprite##/g,
		svgImage: /##svgImage##/g,
		svgClass: /##svgClass##/g,
		subIco: /##subico##/g,
		options: /##options##/g,
		indClass:/##indClass##/g,
		autofocus: /##autofocus##/g,
		searchPath: /##searchPath##/g
	});

	// template object
	angular.module('platform').factory('platformMenuListDefaultTemplates', ['$templateCache', function ($templateCache) {
		return {
			horizontalList: $templateCache.get('menulist/horizontal-ul-template.html'),
			list: $templateCache.get('menulist/ul-template.html'),
			button: $templateCache.get('menulist/content-template.html'),
			changeButton: $templateCache.get('menulist/change-content-template.html'),
			item: $templateCache.get('menulist/item-template.html'),
			subListItem: $templateCache.get('menulist/sublist-item-template.html'),
			dropDown: $templateCache.get('menulist/dropdown-template.html'),
			divider: $templateCache.get('menulist/divider-template.html'),
			overFlow: $templateCache.get('menulist/overflow-template.html'),
			subIco: $templateCache.get('menulist/sub-ico.html'),
			actionSelectButton: $templateCache.get('menulist/action-select-btn-template.html'),
			dropDownSearch: $templateCache.get('menulist/dropdown-search-template.html')
		};
	}]);

	platformMenuList.$inject = ['$compile', '$timeout', 'platformMenuListDefaultTemplates', 'platformMenuListDefaultPlaceHolder', 'platformMenuListDefaultListConfig', 'platformCreateUuid', '_', 'platformPermissionService', 'basicsLookupdataPopupService', '$rootScope', 'platformTranslateService', 'cloudDesktopHotKeyService'];

	function platformMenuList($compile, $timeout, platformMenuListDefaultTemplates, platformMenuListDefaultPlaceHolder, platformMenuListDefaultListConfig, platformCreateUuid, _, platformPermissionService, basicsLookupdataPopupService, $rootScope, platformTranslateService, cloudDesktopHotKeyService) { // jshint ignore:line
		var ph = platformMenuListDefaultPlaceHolder;

		// check if all templates are existing
		if (!platformMenuListDefaultTemplates.list || !platformMenuListDefaultTemplates.button || !platformMenuListDefaultTemplates.item || !platformMenuListDefaultTemplates.changeButton || !platformMenuListDefaultTemplates.dropDown || !platformMenuListDefaultTemplates.divider || !platformMenuListDefaultTemplates.overFlow || !platformMenuListDefaultTemplates.subIco) {
			throw new Error('One or more templates were not found!');
		}

		function getNgHide(path, rootList) {
			if (rootList && rootList.initOnce) {
				return '';
			} else if (rootList && rootList.overflow) {
				return 'data-ng-show=" ' + path + '.' + platformMenuListDefaultListConfig.hide + '"';
			} else {
				return 'data-ng-hide="' + path + '.' + platformMenuListDefaultListConfig.hide + ' || ' + path + '.' + platformMenuListDefaultListConfig.isOnlyContext + '"';
			}
		}

		function hideOverflowFuncFactory(item) {
			return function () {
				var result = true;
				for (var i = 0; i < item.list.items.length; i++) {
					if (item.list.items[i].hideItem) {
						result = false;
						break;
					}
				}
				return result;
			};
		}

		/*
		 generate ng-disabled attribute,
		 disabled can be a value or function
		 */
		function getNgDisabled(item, itemPath, rootList) {

			if (rootList && rootList.initOnce) {
				if (!(_.isUndefined(item.disabled) || _.isNull(item.disabled))) {
					if ((_.isFunction(item.disabled) && item.disabled()) || (!_.isFunction(item.disabled) && item.disabled)) {
						return 'disabled="disabled"';
					}
				}
			} else {
				item.isDisabled = function () {
					if (!(_.isUndefined(item.disabled) || _.isNull(item.disabled))) {
						if (_.isFunction(item.disabled)) {
							return item.disabled();
						} else {
							return item.disabled;
						}
					}
				};

				return 'data-ng-disabled="' + itemPath + '.isDisabled()"';
			}

			return '';
		}

		var instance;

		var options = {
			multiPopup: false,
			plainMode: true,
			hasDefaultWidth: false
		};

		function searchHandler(scope) {
			scope.handleFilter = function (event, path) {
				event.stopPropagation();
				// get value from input-field
				let filterValue = angular.element(event.target).val().toLowerCase();
				// get all the items for list items
				let list = angular.copy(path.items);
				//if title-button exist in list --> group-header --> show, if min. child of them is shown in the list
				let isTitleExist = _.some(path.items, function(p){
					return p.cssClass?.includes('title');
				});

				path.items.forEach((item, index) => {
					//check if search-value exist in items
					if (!item.cssClass?.includes('title') && item.caption?.toLowerCase().includes(filterValue)) {
						item.hideItem = false;

						if(isTitleExist) {
							for (let i = (index - 1); i >= 0; i--) {
								if (path.items[i].cssClass?.includes('title')) {
									path.items[i].hideItem = false;
									break;
								}
							}
						}
					} else {
						item.hideItem = true;
					}
				});

				//refresh list
				path.refreshVersion += 1;
			};
		}

		function dropdownButtonFn(scope, itemPath, buttonConfig, level, list) {
			return function (id, event) {
				let template;
				let path = itemPath + '.' + platformMenuListDefaultListConfig.list;
				if(list?.showSearchfield) {
					template = platformMenuListDefaultTemplates.dropDownSearch.replace(ph.searchPath, path);
				} else {
					template = '<div data-platform-menu-list data-list="' + path + '" data-init-once data-popup></div>';
				}

				instance = basicsLookupdataPopupService.toggleLevelPopup($.extend({}, options, {
					scope: scope,
					focusedElement: $(event.currentTarget),
					template: template,
					level: level
				}));

				if (!_.isNil(instance)) {
					instance.opened
						.then(function () {
							$timeout(function () {
								scope.$digest();
							}, 0);
						});
				}

				//for search-textfield
				searchHandler(scope);
			};
		}

		function getItemElement(template, item, itemPath, rootList, elementConfig, scope, elem) {

			var itemElementTemplate = template;
			var cssClass = [];
			var listCssClass = [];
			var cssExtendClass = [];
			var content = '';
			var ngHide = '';

			if (item.type === platformMenuListDefaultListConfig.types.item) {
				content = parseButton((item.buttonTemplate ? item.buttonTemplate : platformMenuListDefaultTemplates.button), item, itemPath, rootList, elementConfig, scope);
			} else if (item.type === platformMenuListDefaultListConfig.types.radio || item.type === platformMenuListDefaultListConfig.types.check) {
				content = parseButton((item.buttonTemplate ? item.buttonTemplate : platformMenuListDefaultTemplates.changeButton), item, itemPath, rootList, elementConfig, scope);
			} else if (item.type === platformMenuListDefaultListConfig.types.subList) {
				cssExtendClass.push('sublist');
				if (item.cssClass) {
					cssClass.push(item.cssClass);
				}
				rootList.sublist = true;
				content = getListDom(item.list, platformMenuListDefaultTemplates.list, itemPath, rootList, {scope: scope, elem: elem, isPopup: elementConfig.isPopup});
				rootList.sublist = false;
			}
			else if (item.type === platformMenuListDefaultListConfig.types.dropDown) {
				cssExtendClass.push('dropdown-toggle dropdown-caret tlb-icons');
				cssClass.push('dropdown-item-' + item.id);
				elementConfig.withoutWrapper = true;
				content = parseButton((item.buttonTemplate ? item.buttonTemplate : platformMenuListDefaultTemplates.button), item, itemPath, rootList, elementConfig, scope);
				item.fn = dropdownButtonFn(scope, itemPath, null, item.list.level, item.list);
			} else if (item.type === platformMenuListDefaultListConfig.types.actionSelectButton) {
				// itemElementTemplate = itemElementTemplate.replace(ph.model, _.isUndefined(item.model) ? '' : 'data-ng-model="' + getFullItemPath(itemPath, 'model') + '"');
				itemElementTemplate = itemElementTemplate.replace(ph.options, getFullItemPath(itemPath, 'options'));
			}

			if (!rootList.overflow && !rootList.sublist) {
				cssClass.push('collapsable');
			}

			if (!rootList.overflow || !rootList.sublist) {
				if (rootList.initOnce) {
					if ((rootList.overflow && !item.hideItem) || (!rootList.overflow && item.hideItem)) {
						cssClass.push('ng-hide');
					}
				}

				ngHide = getNgHide(itemPath, rootList);
			}

			if (item.listCssClass) {
				listCssClass.push(item.listCssClass);
			}

			itemElementTemplate = itemElementTemplate
				.replace(ph.hide, ngHide)
				.replace(ph.cssClass, cssClass.length > 0 ? cssClass.join(' ') : '')
				.replace(ph.listCssClass, listCssClass.length > 0 ? listCssClass.join(' ') : '')
				.replace(ph.content, content)
				.replace(ph.cssExtendClass, cssExtendClass.length > 0 ? (cssExtendClass.join(' ') + ' ') : '');
			return itemElementTemplate;
		}

		function getFullItemPath(itemPath, defaultListConfigProp) {
			return itemPath + '.' + platformMenuListDefaultListConfig[defaultListConfigProp];
		}

		// workaround to keep the dropdown in overflow still working
		var forceCreate = false;

		function parseButton(template, item, itemPath, rootList, buttonConfig, scope) {
			var title = '';
			var ngClass = '';
			var fn = '';
			var subIco = '';
			var cssClass = (item.cssClass ? item.cssClass : '') + ' ' + (item.iconClass ? item.iconClass : '');

			if (item[platformMenuListDefaultListConfig.caption + '$tr$'] || item[platformMenuListDefaultListConfig.tooltip + '$tr$']) {
				platformTranslateService.translateObject(item, [platformMenuListDefaultListConfig.caption, platformMenuListDefaultListConfig.tooltip]);
			}

			let captionPath = getFullItemPath(itemPath, 'caption');
			let tooltipPath = getFullItemPath(itemPath, 'tooltip');
			let tooltip = '{{' + (tooltipPath + '?' + tooltipPath + ':' + captionPath) + (item[platformMenuListDefaultListConfig.tooltip + '$tr$'] ? '' : ' |translate') + '}}';
			let shortCut = cloudDesktopHotKeyService.getTooltip(item.id, item.hotkey);

			if(shortCut) {
				tooltip = tooltip + ' (' + shortCut + ')';
				item.shortCut = shortCut;
			}

			if (rootList.showTitles !== false) {
				title = '{{' + captionPath + (item[platformMenuListDefaultListConfig.caption + '$tr$'] ? '' : ' |translate') + '}}';

				if(item.subCaption) {
					title += '<label>' + item.subCaption + '</label>';
				}
			}

			if (_.get(item, 'list.overflow')) {
				item.fnWrapper = function (id, $event) {
					forceCreate = true;
					if (item.fn) { // call only if there is a function declared
						item.fn(id, $event);

						// item.fn.apply(this, [id, item]);
						//
						$timeout(function () {
							scope.$digest();
						}, 0);
					}

					// to close the popup after click
					// basicsLookupdataPopupService.hidePopup(0);
				};

				fn = itemPath + '.fnWrapper(\'' + item.id + '\', $event)';

			} else if (buttonConfig.withoutWrapper) {
				fn = itemPath + '.fn(\'' + item.id + '\', $event)';
			} else {
				item.fnWrapper = function (id, event) {
					// if (angular.isUndefined(lastPress) || (Date.now() - lastPress) > 250) {
					let previousSelected = rootList.currentButton;
					if (rootList.toggleMode) {
						rootList.currentButton = rootList.currentButton === id ? null : id;
					} else {
						rootList.currentButton = id;
					}

					if (item.fn) { // call only if there is a function declared
						item.fn.apply(this, [id, item, {scope: scope, e: event, previous: previousSelected}]);

						$timeout(function () {
							scope.$digest();
						}, 0);
					}

					// to close the popup after click
					basicsLookupdataPopupService.hidePopup(0);
					forceCreate = false;
					// }
				};

				fn = itemPath + '.fnWrapper(\'' + item.id + '\', $event)';
			}

			// defines the subicon
			if (item.type === platformMenuListDefaultListConfig.types.dropDown && buttonConfig.isPopup) {
				subIco = '<i class="submenu-ico control-icons ico-tree-collapse"></i>';
			} else if (!!item.showSVGTag && item.svgSprite && item.svgImage) {
				subIco = platformMenuListDefaultTemplates.subIco
					.replace(ph.svgSprite, item.svgSprite)
					.replace(ph.svgImage, item.svgImage)
					.replace(ph.svgClass, item.svgClass);

				if(ph.svgClass) {
					subIco = subIco.replace('data-replace', '');
				}
			}

			var button = template;
			button = button
				.replace(ph.cssClass, cssClass ? cssClass : '')
				.replace(ph.ngClass, ngClass ? ngClass : '')
				.replace(ph.title, title)
				.replace(ph.tooltip, tooltip)
				.replace(ph.disabled, getNgDisabled(item, itemPath, rootList))
				.replace(ph.fn, fn)
				.replace(ph.id, item.id)
				.replace(ph.attr, buttonConfig.attr)
				.replace(ph.model, buttonConfig.model)
				.replace(ph.showSVGTag, !!item.showSVGTag)
				.replace(ph.svgSprite, item.svgSprite ? item.svgSprite : '')
				.replace(ph.svgImage, item.svgImage ? item.svgImage : '')
				.replace(ph.subIco, subIco)
				.replace(ph.currentButton, rootList.showSelected ? 'data-ng-class="{selected: \'' + item.id + '\'===' + rootList.rootPath + '.currentButton}"' : '')
				.replace(ph.indClass, item.showIndicator ? 'search-indicator' : '')
				.replace(ph.autofocus, item.autofocus ? 'autofocus' : '');
			return button;
		}

		function getListDom(menuList, template, itemPath, rootList, listConfig) {
			var scope = listConfig.scope;
			var elem = listConfig.elem;
			var list = template;
			var listContent = [];
			var cssClass = [];
			var subListTemp = '';
			var item;
			var title = '';

			if (menuList[platformMenuListDefaultListConfig.caption]) {
				var captionPath = getFullItemPath(itemPath, 'caption');
				title = '{{' + captionPath + ' |translate}}';
			}

			if (menuList) {

				if (menuList.showImages) {
					cssClass.push('showimages');
				}

				if (listConfig.cssClass) {
					cssClass.push(listConfig.cssClass);
				}

				if (menuList.cssClass) {
					cssClass.push(menuList.cssClass);
				}

				if (menuList.iconClass) {
					cssClass.push(menuList.iconClass);
				}

				if (menuList.align) {
					cssClass.push(menuList.align);
				}

				if (menuList.items && _.isArray(menuList.items)) {
					var lastIsDivider = false;
					var overflowIndex = _.findLastIndex(menuList.items, {type: 'overflow-btn'});

					if (overflowIndex !== -1 && overflowIndex !== menuList.items.length - 1) {
						var overflowButton = menuList.items[overflowIndex];

						console.error('overflow button must be the last item in menu list');

						menuList.items = _.filter(menuList.items, function (item) {
							return item.type !== 'overflow-btn';
						});
						menuList.items.push(overflowButton);
					}

					_.each(menuList.items, function eachMenuListElement(item, index) {
						var hasPermission = _.reduce(_.keys(item.permission || {}), function (result, descriptor) {
							result &= platformPermissionService.has(descriptor, item.permission[descriptor]);

							return result;
						}, true);

						if (hasPermission) {
							var elementConfig = {
								attr: '',
								model: '',
								withoutWrapper: false,
								isPopup: listConfig.isPopup
							};

							var newItemPath = itemPath + '.' + platformMenuListDefaultListConfig.items + '[' + index + ']';
							var elementContent;

							/*
							info: item.isDisplayed = true --> is important for the toolbar-process by collapsable-list.js
							 */
							switch (item.type) {
								case platformMenuListDefaultListConfig.types.divider:
									if (!lastIsDivider) {
										listContent.push(getItemElement(platformMenuListDefaultTemplates.divider, item, newItemPath, rootList, elementConfig, scope));
										item.isDisplayed = true;
									} else {
										item.isDisplayed = false;
									}
									lastIsDivider = true;
									break;

								case platformMenuListDefaultListConfig.types.subList:
									subListTemp = platformMenuListDefaultTemplates.subListItem
										.replace(ph.listHeader, platformMenuListDefaultTemplates.list)
										.replace(ph.hide, getNgHide(newItemPath, rootList));
									item.list.level = menuList.level + 1;
									elementContent = getItemElement(subListTemp, item, newItemPath + '.list', rootList, elementConfig, scope, elem);
									listContent.push(elementContent);
									item.isDisplayed = true;
									lastIsDivider = false;
									break;

								case platformMenuListDefaultListConfig.types.dropDown:
									var dropDownTemp = platformMenuListDefaultTemplates.dropDown;
									item.list.initOnce = true;
									if (listConfig.isPopup) {
										item.list.level = menuList.level + 1;
									}

									elementContent = getItemElement(dropDownTemp, item, newItemPath, rootList, elementConfig, scope, elem);
									// elementContent = getItemElement(dropDownTemp, item, newItemPath, item.list, elementConfig, scope, elem);
									listContent.push(elementContent);
									item.isDisplayed = true;
									lastIsDivider = false;
									break;

								case platformMenuListDefaultListConfig.types.actionSelectButton:
									if (listConfig.isPopup) {
										item.options.level = menuList.level + 1;
										item.options.showCaption = true;
									}

									var actionSelectButtonTemp = platformMenuListDefaultTemplates.actionSelectButton;
									// elementConfig.model = 'data-ng-model="' + itemPath + '.' + platformMenuListDefaultListConfig.activeValue + '"';
									elementContent = getItemElement(actionSelectButtonTemp, item, newItemPath, rootList, elementConfig, scope, elem);
									// elementContent = getItemElement(dropDownTemp, item, newItemPath, item.list, elementConfig, scope, elem);
									listContent.push(elementContent);
									item.isDisplayed = true;
									lastIsDivider = false;
									break;

								case platformMenuListDefaultListConfig.types.overflow:
									if (!rootList.overflow) {
										var overflowTemplate = platformMenuListDefaultTemplates.overFlow;

										item.list.overflow = true;
										item.list.level = menuList.level + 1;
										item.list.showImages = true;

										overflowTemplate = overflowTemplate
											.replace(ph.hideOverflow, newItemPath + '.' + platformMenuListDefaultListConfig.hideOverflow + '()')
											.replace(ph.menuAlignment, item.menuAlignment !== undefined ? item.menuAlignment : 'right');
										item.id = 'fixbutton';
										item.fn = dropdownButtonFn(scope, newItemPath, null, menuList.level, menuList);
										item.hideOverflow = hideOverflowFuncFactory(item);

										elementConfig.withoutWrapper = true;
										overflowTemplate = parseButton(overflowTemplate, item, newItemPath, rootList, elementConfig, scope);
										listContent.push(overflowTemplate);
										item.isDisplayed = true;
									} else {
										item.isDisplayed = false;
									}
									lastIsDivider = false;
									break;

								case platformMenuListDefaultListConfig.types.item:
									listContent.push(getItemElement(platformMenuListDefaultTemplates.item, item, newItemPath, rootList, elementConfig, scope));
									item.isDisplayed = true;
									lastIsDivider = false;
									break;

								case platformMenuListDefaultListConfig.types.radio:
									elementConfig.attr = 'btn-radio="\'' + item.value + '\'" ';
									elementConfig.model = 'data-ng-model="' + itemPath + '.' + platformMenuListDefaultListConfig.activeValue + '"';
									listContent.push(getItemElement(platformMenuListDefaultTemplates.item, item, newItemPath, rootList, elementConfig, scope));
									item.isDisplayed = true;
									lastIsDivider = false;
									break;

								case platformMenuListDefaultListConfig.types.check:
									elementConfig.attr = 'btn-checkbox ';
									elementConfig.model = 'data-ng-model="' + newItemPath + '.' + platformMenuListDefaultListConfig.value + '"';
									listContent.push(getItemElement(platformMenuListDefaultTemplates.item, item, newItemPath, rootList, elementConfig, scope));
									item.isDisplayed = true;
									lastIsDivider = false;
									break;

								case platformMenuListDefaultListConfig.types.directive:
									console.error('this type of menulist is obsolete. Please inform the ui team in germany.');
									listContent.push(getItemElement(platformMenuListDefaultTemplates.item, item, newItemPath, rootList, elementConfig, scope));
									item.isDisplayed = true;
									lastIsDivider = false;
									break;

								default:
									lastIsDivider = false;
									item.isDisplayed = false;
									break;
							}
						} else {
							item.isDisplayed = false;
						}
					});

					item = menuList.items[menuList.items.length - 1];
				}
			}

			return list
				.replace(ph.cssClass, cssClass.join(' '))
				.replace(ph.title, title)
				.replace(ph.hide, item ? item.hideItem : '')
				.replace(ph.list, listContent.join(''));
		}

		// return the directive object
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				var random = platformCreateUuid();
				var childScope;

				function create(newVal, attr) {
					if (newVal) {
						var itemPath = attr.list;
						var config = attr.hasOwnProperty('config') ? scope.$eval(attr.config) : {};
						var level;

						if (!newVal.currentButton) {
							newVal.currentButton = null;
						}

						if (_.isNil(newVal.showTitles)) {
							newVal.showTitles = true;
						}

						level = attr.hasOwnProperty('level') ? parseInt(attr.level) : 0;
						level = angular.isNumber(level) && !_.isNaN(level) ? level : 0;

						if (attr.hasOwnProperty('popup')) {
							config.cssClass = 'popup-menu';
							config.isPopup = true;
						}
						newVal.level = level;

						newVal.initOnce = attr.hasOwnProperty('initOnce') ? attr.hasOwnProperty('initOnce') : newVal.initOnce;
						newVal.rootPath = itemPath;

						if (childScope) {
							childScope.$destroy();
						}
						childScope = scope.$new(false, null);

						config.scope = scope;
						config.elem = elem;

						// init(scope);
						elem.parent().children('.list-items-' + random).remove();
						var element = getListDom(newVal, platformMenuListDefaultTemplates.list, itemPath, newVal, config);
						var compiledElem = angular.element($compile(element)(childScope)).addClass('list-items-' + random);
						if (scope.hideToolbar && scope.hideToolbar()) {
							compiledElem.css('display', 'none');
						}
						elem.parent().append(compiledElem);
					}
				}

				function isVersionChanged(newValue, oldValue) {
					if (_.isNil(oldValue) || _.isNil(newValue)) {
						return true;
					}

					// set default version value
					if (newValue && (!_.isNumber(newValue.version) || _.isNaN(newValue.version))) {
						newValue.version = 0;
					}

					// set default refresh version value
					if (newValue && (!_.isNumber(newValue.refreshVersion) || _.isNaN(newValue.refreshVersion))) {
						newValue.refreshVersion = 0;
					}

					if (forceCreate && newValue.level === 0) {
						return true;
					}

					if (newValue.overflow || newValue.initOnce) {
						return true;
					}

					if (!oldValue.hasOwnProperty('version') && !newValue.hasOwnProperty('version')) {
						return true;
					} else {
						// 0 and 1 because many set 0 or 1 initial in config although it is unecessary
						return oldValue.version === 0 || oldValue.version === 1 || (newValue.version !== oldValue.version);
					}
				}

				var watchUnregister = scope.$watch(function () {
					return scope.$eval(attr.list);
				}, function (newValue, oldValue) {
					if (isVersionChanged(newValue, oldValue)) {
						var tools = scope.$eval(attr.list);
						var unregister = [];

						if (childScope) {
							childScope.$destroy();
							childScope = null;
						}

						create(newValue, attr);

						if (tools && !tools.unregisterPermissionEvent && !_.isUndefined(tools.refreshVersion) && _.find(tools.items, 'permission')) {
							unregister.push($rootScope.$on('permission-service:changed', function () {
								if (tools && tools.update) {
									tools.update();
								}
							}));

							// unregister when container destroyed
							unregister.push(scope.$parent.$on('$destroy', function () {
								_.over(unregister)();
								unregister = null;
								tools = null;

								if (scope) {
									scope.$destroy();
								}
							}));
						}
					}

					if (attr.hasOwnProperty('initOnce')) {
						watchUnregister();
					}
				}, true);
			}
		};
	}

	// create the platformMenuList directive.
	angular.module('platform').directive('platformMenuList', platformMenuList);

})(angular);

