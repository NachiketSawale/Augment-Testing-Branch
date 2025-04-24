/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	var templates = {
		'tab': ['<li data-ng-class="{active: isActive(%index%)}" class="tab subview-tab-overflow" data-ng-if="tabs[%index%].shown" data-tid="tab_@id@" style="display: none;">',
			'<button data-ng-click="onTabClicked(%index%)" title=" {{ getTitle(tabs[%index%]) }}" data-ng-bind="getTitle(tabs[%index%])"></button>',
			'</li>'].join('')
	};

	var elements = {};

	function buildOverflow(tabs) {
		var $tabs = $('<ul></ul>');
		$tabs.addClass('tabs');
		var index;
		var tabsHTML = [];
		for (index = 0; index < tabs.length; index++) {
			// noinspection JSCheckFunctionSignatures
			var nTab = templates.tab.replace(/%\w+%/g, index).replace(/@id@/g, tabs[index].Id);
			tabsHTML.push(nTab);
			tabs[index].shown = true;
		}
		$(tabsHTML.join('')).appendTo($tabs);

		return $tabs;
	}

	function sortComparer(a, b) {
		var x, y;
		var result = 0;
		x = a.Description ? a.Description.toLowerCase() : '';
		y = b.Description ? b.Description.toLowerCase() : '';
		if (!x || x === '') {
			result = 1;
		} else if (!y || y === '') {
			result = -1;
		} else {
			if (_.isString(x) && _.isString(y)) {
				result = x.localeCompare(y);
			} else {
				result = (x === y ? 0 : (x > y ? 1 : -1));
			}
		}
		return result;
	}

	mainViewTabDirective.$inject = ['$templateCache', '$compile', '$translate', '$rootScope', 'platformModalService', 'platformDialogService', 'mainViewService',
		'platformPermissionService', '$timeout', 'basicsLookupdataPopupService', 'cloudDesktopUtilService', 'platformObjectHelper','platformDialogDefaultButtonIds',
		'platformLayoutSaveDialogService', 'platformTranslateService', 'platformCustomTranslateService', 'platformContextService'];

	function mainViewTabDirective($templateCache, $compile, $translate, $rootScope, platformModalService, platformDialogService, mainViewService, platformPermissionService,
		$timeout, basicsLookupdataPopupService, cloudDesktopUtilService, platformObjectHelper, defaultButtonIds, platformLayoutSaveDialogService, platformTranslateService,
		platformCustomTranslateService, platformContextService) { // jshint ignore:line
		var currentTab = 0;
		var importing = false;
		let translated = false;
		var directive = {
			template: $templateCache.get('main-view-tabbar'),
			scope: true
		};

		directive.link = function (scopeRef, eleRef) {
			var scope = scopeRef;
			var ele = eleRef;
			var unregister = [];

			platformLayoutSaveDialogService.registerViewsCustomTranslation();

			elements.tabs = ele.find('ul.tabs');

			currentTab = mainViewService.getActiveTab();

			var toPromise = $timeout(function () {
				if (scope) {
					elements.hidden = buildOverflow(scope.tabs);
					elements.anchor = ele.find('button.overflow-anchor');
					checkResize();
				}
				$timeout.cancel(toPromise);
			}, 0);

			scope.open = false;
			scope.changeView = mainViewService.changeView;
			scope.overflow = true;
			scope.tabs = mainViewService.getTabs();

			angular.forEach(scope.tabs, function (tab) {
				tab.shown = true;
				var tabEle = _.find(elements.tabs, function (tItem) {
					return tItem.id === tab.Id;
				});
				// noinspection JSUnresolvedVariable
				if (tabEle && tab.tabCss) {
					// noinspection JSUnresolvedVariable
					$(tabEle).addClass(tab.tabCss);
				}

				 platformTranslateService.translateObject(tab, ['Description'], {recursive: true});
				 platformTranslateService.translateObject(tab.Views, ['Description'], {recursive: true});
			});

			// Checks whether the tab-items are hidden or displayed
			function checkResize() {
				$timeout(function () {
					if (getParentWidth() < getChildrenWidth()) {
						beSmaller();
					} else {
						beGreater();
					}
					if (ele) {
						toggleAnchor();
					}
				}, 50);
			}

			/*
			 Is the place for the tab-items.
			 parentWidth = $('#main-tabs') - elements.anchor.width - id-tabbar-margin-right - close-button.
			 */
			function getParentWidth() {
				return $('#main-tabs').innerWidth() - 66;
			}

			// If not all items are displayed, then show the Menu-DropDown-icon on the right Side.
			function toggleAnchor() {
				elements.anchor = ele.find('button.overflow-anchor');
				if (getChildren(elements.hidden.children(), 'block').length > 0) {
					elements.anchor.show();
				} else {
					elements.anchor.hide();
				}
			}

			// Get total width of tab-items that are visible or hidden.
			function getChildren(parent, displayStatus) {
				return parent.filter(function () {
					return $(this).css('display') === displayStatus;
				});
			}

			// Get the visible Tabs, and the tab-items are hidden until the visible are is filled correctly.
			function beSmaller() {
				getChildren($(elements.tabs.children('li').get().reverse()), 'block').each(function () {
					if (getParentWidth() > getChildrenWidth()) {
						return false;
					}

					// active-tabs shows in visible range
					if (!$(this).hasClass('active')) {
						$(this).css('display', 'none');

						// show item in popup-container
						elements.hidden.find('>li[data-tid="' + $(this).attr('id') + '"]').css('display', 'block');
					}
				});
			}

			// Get the hidden tabs, and show the tabs in visible-range.
			function beGreater() {
				getChildren(elements.tabs.children('li'), 'none').each(function () {
					// check before if hidden-tabs in the area fits. Yes -> show item, and hidden this item in popup-dropdown.
					if (getParentWidth() > (getChildrenWidth() + $(this).outerWidth(true))) {
						$(this).css('display', 'block');

						elements.hidden.find('>li[data-tid="' + $(this).attr('id') + '"]').css('display', 'none');
					} else {
						return false;
					}
				});
			}

			scope.home = function () {
				cloudDesktopUtilService.goHomeLink();
			};

			// Get total width from tabs-item, that are visible in the main-view. Note: Menu-Button is also one of in visible area.
			function getChildrenWidth() {
				if (!elements) {
					return 0;
				}
				var childrenWidth = 0;

				getChildren($('#main-tabs ul.tabs > *'), 'block').each(function () {
					childrenWidth += $(this).outerWidth(true);
				});

				return childrenWidth + elements.anchor.outerWidth();
			}

			function isPortal() {
				return globals.portal;
			}

			scope.defaultFunctions = [{
				css: 'layout-dropdown-save',
				description: $translate.instant('platform.layoutsystem.save'),
				enabled: !isPortal(),
				execute: function () {
					var modalOptions = {
						template: $templateCache.get('layout-save-dialog.html'),
						controller: 'layoutSaveController',
						width: '800px'
					};
					platformModalService.showDialog(modalOptions);
				}
			}, {
				css: 'layout-dropdown-edit',
				description: $translate.instant('platform.layoutsystem.edit'),
				enabled: !isPortal() && platformPermissionService.hasExecute('a1013e0c2c12480c9292deaed7cb11dd'),
				execute: function () {
					var modalOptions = {
						template: $templateCache.get('layout-editor'),
						controller: 'layoutEditorController',
						controllerAs: 'editorCtrl',
						windowClass: 'layoutDialog',
						width: 'max'
					};
					mainViewService.inEditMode = true;
					platformModalService.showDialog(modalOptions)
						.then(function () {
							mainViewService.inEditMode = false;
						});
				}
			}, {
				css: 'layout-dropdown-export',
				description: $translate.instant('platform.layoutsystem.export'),
				enabled: !isPortal() && platformPermissionService.hasExecute('b92e1f10594d4e7daa2cba19be14d5aa'),
				execute: function () {
					var modalOptions = {
						headerText$tr$: 'platform.layoutsystem.exportDialogHeader',
						bodyTemplate:['<section class="modal-body" data-platform-form-adjust-label>',
							'<div data-ng-controller="layoutExportController">',
							'<platform-grid class="border-all" data="gridData" style="height: 200px;"></platform-grid>',
							'</div>',
							'</section>'].join(''),
						width: '635px',
						height: '600px',
						resizeable: true,
						buttons: [{
							id: 'export',
							caption$tr$: 'cloud.desktop.navBarExportDesc',
						}, {
							id: defaultButtonIds.cancel,
						}]
					};

					platformDialogService.showDialog(modalOptions);
				}
			}, {
				css: 'layout-dropdown-import',
				description: $translate.instant('platform.layoutsystem.import'),
				enabled: !isPortal() && platformPermissionService.hasExecute('b92e1f10594d4e7daa2cba19be14d5aa'),
				execute: function () {
					importing = true;
					mainViewService.saveModuleState();
					$timeout(function () {
						$('#layoutinport').click();
						$timeout(function () {
							importing = false;
						}, 0);
					}, 20, false);
				}
			}];

			function groupViews() {
				if (scope) {
					angular.forEach(scope.tabs, function (tab) {
						// noinspection JSUnresolvedVariable
						var views = _.sortBy(tab.Views, 'Issystem');
						var latest = _.find(views, function (v) {
							return v.Description === null;
						});

						if (latest) {
							latest.hidden = true;
						}

						(_.find(views, ['css', 'selected']) || {}).css = null;
						if (latest && latest.ModuleTabViewOriginFk) {
							(_.find(views, ['Id', latest.ModuleTabViewOriginFk]) || {}).css = 'selected';
						}

						var groups = _.groupBy(views, function (view) {
							return view.Issystem ? 'System' : view.IsPortal ? 'Portal' : view.FrmAccessroleFk !== null ? 'Role' : 'User';
						});
						tab.grouped = {};
						_.mapValues(groups, function (val, key) {
							switch (key) {
								case 'System':
									tab.grouped[0] = val;
									break;
								case 'Role':
									tab.grouped[1] = val;
									break;
								case 'User':
									tab.grouped[2] = val;
									break;
								case 'Portal':
									tab.grouped[3] = val;
									break;
							}
						});
						if (tab.grouped[0]) {
							tab.grouped[0] = tab.grouped[0].sort(sortComparer);
						}
						if (tab.grouped[1]) {
							tab.grouped[1] = tab.grouped[1].sort(sortComparer);
						}
						if (tab.grouped[2]) {
							tab.grouped[2] = tab.grouped[2].sort(sortComparer);
						}
						if (tab.grouped[3]) {
							tab.grouped[3] = tab.grouped[3].sort(sortComparer);
						}
					});
				}
			}

			groupViews(scope.tabs[currentTab]);

			unregister.push(scope.$watch(function () {
				// noinspection JSUnresolvedVariable
				return (scope.tabs[currentTab] || {}).Views;
			}, function (newVal) {
				var toPromise = $timeout(function () {
					groupViews(newVal);
					$timeout.cancel(toPromise);
				}, 0);
			}, true));

			function tabChanged() {
				$rootScope.$emit('updateRequested');
				currentTab = arguments[1].toTab;
			}

			function tabStatusChanged() {
				var args = arguments[1];
				for (var i = 0; i < scope.tabs.length; i++) {
					var elem = ele.find('#tab_' + scope.tabs[i].Id);
					if (scope.tabs[i].css) {
						elem.addClass(scope.tabs[i].css);
					} else if (args && args[scope.tabs[i].Id]) {
						elem.removeClass(args[scope.tabs[i].Id]);
					}
				}
			}

			// As soon as the browser window changes the width.
			window.addEventListener('resize', checkResize, true);

			unregister.push(function () {
				window.removeEventListener('resize', checkResize, true);
			});

			function showImportedDialog(values) {
				let gridDefinition = {
					columns: [{
						id: 'view',
						name$tr$: 'platform.layoutsystem.view',
						formatter: 'description',
						field: 'view',
						width: 200
					}, {
						id: 'overwrite',
						name$tr$: 'platform.layoutsystem.isoverwritten',
						formatter: 'description',
						field: 'isoverwritten',
						width: 400
					}],
					id: 'importedViewsInfoDialog',
					lazyInit: true,
					enableConfigSave: false,
					options: {
						idProperty: 'view',
						editable: false,
						indicator: true,
						skipPermissionCheck: true
					}
				};

				let options = {
					width: '600px',
					headerText: 'Imported Views',
					iconClass: 'ico-info',
					bodyText: $translate.instant('platform.layoutsystem.importSuccess'),
					details: {
						type: 'grid',
						options: gridDefinition,
						value: values,
						offsetY: 150
					}
				};

				platformDialogService.showDetailMsgBox(options);
			}

			function importViews(viewData) {
				mainViewService.importviews(viewData).then(function(result){
					let values = result.map(function(x) {
						return { view: x['newDescription'], isoverwritten: x['isOverwritten'].toString() };
					});

					platformLayoutSaveDialogService.createTranslationObjectsAfterImport(result).then(function() {
						mainViewService.reloadactivetab();
						showImportedDialog(values);
					});
				});
			}

			function removeUnnecessaryTranslations(viewData, overwriteObjects) {
				if (viewData.overwrite && overwriteObjects.length > 0) {
					angular.forEach(overwriteObjects, function (item) {
						//delete JSON-Files in Folder: \customize\views
						platformLayoutSaveDialogService.deleteCustomTranslation(item.selectedTypeId, item.overwriteId);
					})
				}
			}

			function handleImport(evt) {
				let files = evt.target.files;
				if (files[0].name.indexOf('.lsv') === -1) {
					throw new Error('Wrong file type.');
				}
				let reader = new FileReader();
				var currentCulture = platformContextService.getLanguage();

				reader.onloadend = function (evt) {
					let overwrite = false;
					let overwriteObjects = [];
					let result = evt.target.result;
					if (result) {
						let module = JSON.parse(result);
						if(module && module.Layouts) {
							module.Layouts.every(function(layout) {

								if(layout.Translations) {
									let translatedName = layout.Translations[currentCulture];
									if(translatedName) {
										layout.Name = translatedName;
									}

								}

								scope.tab.Views.filter(function(view) {
									if(layout.Name === view.Description &&
										((layout.Type === 0 && view.Issystem) ||
											(layout.Type === 1 && !view.Issystem && !view.FrmAccessroleFk) ||
											(layout.Type === 2 && !view.Issystem && view.FrmAccessroleFk))) {

										//note all translation IDs to be deleted.
										overwriteObjects.push({
											overwriteId: view.Id,
											selectedTypeId: platformLayoutSaveDialogService.isSelectedTypeUser(view) ? 'u' : 'rest',
											translations: layout.Translations
										});

										overwrite = true;
									}
								});

								return true;
							});
						}
					}

					if(overwrite) {
						let customConfig = {
							showCancelButton: true
						};

						platformDialogService.showYesNoDialog('platform.overwriteExisting', 'platform.importLayoutHeader', 'yes', undefined, undefined, customConfig).then(function (res) {
							let viewData = {
								overwrite: !!res.yes,
								Layouts: result
							};

							removeUnnecessaryTranslations(viewData, overwriteObjects);

							importViews(viewData);
						}).finally(() => {
							$('#layoutinport').val('');
						});
					}
					else {
						let viewData = {
							Layouts: result,
							overwrite: false
						};
						importViews(viewData);
						$('#layoutinport').val('');
					}

				};

				reader.readAsText(files[0]);
			}

			toPromise = $timeout(function () {
				var elem = document.getElementById('layoutinport');
				if (elem) {
					elem.addEventListener('change', handleImport, false);

					unregister.push(function () {
						elem.removeEventListener('change', handleImport, false);
					});
				}
				$timeout.cancel(toPromise);
			}, 0);

			unregister.push(mainViewService.registerListener('onTabChanged', tabChanged));
			unregister.push(mainViewService.registerListener('onTabStatusChanged', tabStatusChanged));

			unregister.push(scope.$on('resizeNavigation', function () {
				checkResize();
			}));

			unregister.push(scope.$on('$destroy', function () {
				_.over(unregister)();
				unregister = null;

				platformObjectHelper.cleanupScope(scope, $timeout);

				ele = null;
				scope = null;
			}));

			toPromise = $timeout(function () {
				tabStatusChanged();
				$timeout.cancel(toPromise);
			}, 0);
		};

		directive.controller = ['$scope', function ($scope) {
			$scope.onTabClicked = function (index) {
				if (currentTab !== index && !$scope.tabs[index].disabled && !importing) {
					// set tab index to defaultvalue 0
					mainViewService.setActiveTabIndex(0);
					mainViewService.setActiveTab(index);
				}
			};

			$scope.isActive = function (index) {
				return currentTab === index;
			};

			$scope.isDisabled = function (index) {
				return $scope.tabs[index].disabled;
			};

			$scope.isActiveView = function (view) {
				if ($scope.tabs) {
					return $scope.tabs[currentTab].activeView.Id === view.Id;
				}
			};

			$scope.getActiveTab = function () {
				return $scope.tabs[currentTab];
			};

			$scope.getTabByIndex = function (index) {
				return $scope.tabs[index];
			};

			$scope.getHeader = function (type) {
				var result = '!Header Not Defined';
				switch (type) {
					case '0':
						result = $translate.instant('platform.layoutsystem.systemviews');
						break;
					case '1':
						result = $translate.instant('platform.layoutsystem.roleviews');
						break;
					case '2':
						result = $translate.instant('platform.layoutsystem.userviews');
						break;
					case '3':
						result = $translate.instant('platform.layoutsystem.portalviews');
						break;
				}
				return result;
			};

			$scope.getTitle = function (tab) {
				return $translate.instant(tab.Description);
			};

			$scope.userViewsVisible = function (type, views) {
				var res = (views.length === 1 && views[views.length - 1].hidden);

				return !res;
			};

			$scope.userHasRights = true;

			var instance;
			var popupOpen = false;

			$scope.openPopupLayoutMenue = function (index, event, tabItem) {
				popupInit(event, 'openPopupLayoutMenue', false, index, tabItem);
			};

			// Popup-Dropdown for the tab-items, that hidden in the man-view. These items shows in Popup-Dropdown.
			$scope.openPopupOverflowAnchor = function (event) {
				popupInit(event, 'openPopupOverflowAnchor', false);
			};

			function popupInit(event, popupTemplate, isOpen, index, tabItem) {
				event.preventDefault();
				event.stopPropagation();

				// for open layout selectbox
				if (tabItem) {
					$scope.tab = tabItem;
					if ($scope.isActive(index)) {
						$scope.tabs[index].open = !$scope.tabs[index].open;
					} else {
						mainViewService.setActiveTab(index);
					}
				}

				if (popupOpen) {
					return;
				}

				var htmlMarkup = popupTemplate === 'openPopupOverflowAnchor' ? elements.hidden : $templateCache.get('main-view-tabbar-dropdown-container');

				if(!translated && tabItem) {
					platformTranslateService.translateObject($scope.tab, ['Description'], {recursive: true});
					platformTranslateService.translateObject($scope.tab.Views, ['Description'], {recursive: true});
					translated = true;
				}

				var popupOptions = {
					scope: $scope,
					multiPopup: false,
					plainMode: true,
					hasDefaultWidth: false,
					focusedElement: $(event.target),
					template: htmlMarkup
				};

				// used showPopup. Open and close problem with getToggleHelper(). And After click an item on popup-> popup dont close
				// see defect-id: 85821
				setTimeout(function () {
					instance = basicsLookupdataPopupService.showPopup(popupOptions);

					instance.opened.then(function () {
						popupOpen = true;
					});

					instance.closed.then(function () {
						popupOpen = false;
					});
				}, 0);

				// after click on the button, the popup-menu has to close
				function clicked(e) {
					if (e.target !== elements.hidden && popupOpen) {
						// close popup-container. Otherwise is popup open, if dialog open too
						instance.close();
						popupOpen = false;
						$('html').unbind('click', clicked);
					}
				}

				$('html').click(clicked);
			}
		}];

		return directive;
	}

	/**
	 * @ngdoc directive
	 * @name platform.mainTabs
	 * @element div
	 * @restrict A
	 * @priority 0
	 * @scope
	 * @description
	 * main view tabs.
	 * NOTE: this directive creates a new child scope from ist parent.
	 * In this case the mainView directive and should not be used otherwise.
	 *
	 * @example
	 * <doc:example>
	 * <doc:source>
	 *      <div class="fullheight" main-view></div>
	 * </doc:source>
	 * </doc:example>
	 */
	angular.module('platform').directive('mainTabs', mainViewTabDirective);

})(angular);