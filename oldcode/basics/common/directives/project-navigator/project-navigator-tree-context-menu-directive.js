(function () {
	'use strict';

	/**
	 * <div basics-common-project-navigator-tree-context-menu></div>
	 */
	angular.module('basics.common').directive('basicsCommonProjectNavigatorTreeContextMenu', basicsCommonProjectNavigatorTreeContextMenu);
	basicsCommonProjectNavigatorTreeContextMenu.$inject = ['$templateCache', 'basicsLookupdataPopupService', '$timeout', '$parse', '$q'];

	function basicsCommonProjectNavigatorTreeContextMenu($templateCache, basicsLookupdataPopupService, $timeout, $parse, $q) {
		let instance = null;

		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elem) {
				let naviBtn;

				// Context menu
				elem.on('contextmenu', (event) => {
					event.preventDefault();

					// Check if the directive is on a button with data-ng-click
					if (elem[0].tagName === 'BUTTON' && elem[0].hasAttribute('data-ng-click')) {
						naviBtn = elem[0];
					} else {
						// Otherwise, find the first button with data-ng-click within the children
						const foundBtn = elem.find('button[data-ng-click]').first();
						if(!foundBtn.length){
							console.log('Navi button with click function not found');
							return;
						}
						naviBtn = foundBtn[0];
					}

					const onClickFnRef = $parse(naviBtn.getAttribute('data-ng-click'));
					if (typeof onClickFnRef !== 'function') {
						console.log('Function not found in scope:', naviBtn.getAttribute('data-ng-click'));
						return;
					}

					scope.$apply(function() {

						let contextItems = [];

						const contextMenuPopupTemplate = $templateCache.get('project-navigator/project-navigator-tree-context-menu-template.html');

						function createOpenNewTabContextItem(){
							let hasOption = false;
							if(naviBtn.classList.contains("module")){
								hasOption = naviBtn.getAttribute('data-ng-click').includes('true ? ');
							} else if (naviBtn.classList.contains("project") || naviBtn.classList.contains("item")) {
								hasOption = true;
							}

							if(hasOption){
								contextItems.push({
									id: 't-opennewtab',
									type: 'item',
									caption: 'basics.common.projectNavi.openNewTab',
									iconClass: '',
									disabled: false,
									contextAreas: [],
									sort: 10,
									isSet: true,
									isDisplayed: true,
									hideItem: false,
									fn: () => {
										try{
											// In current angularjs, it is not possible to locally change input param for onClickFn here.
											// Therefore, use scope.forceNewTab to change the navi setting
											scope.forceNewTab = true;
											onClickFnRef(scope);
										} finally {
											scope.forceNewTab = false;
										}
									}
								})
							}
						}

						function createFilterOptionContextItems(){
							// Check has filter func
							let naviModuleElem = naviBtn.closest('[data-get-filter-options]');
							const filterFn = naviBtn.getAttribute('data-on-filter')?.trim();
							if(filterFn && naviModuleElem){
								const getFilterOptsFnString = naviModuleElem.getAttribute('data-get-filter-options');
								try {
									const naviModuleScope = angular.element(naviModuleElem).scope(); //get the scope of the element.
									// Use eval() with caution! See important notes below.
									const getFilterOptsFn = $parse(getFilterOptsFnString);

									if (typeof getFilterOptsFn === 'function') {
										return getFilterOptsFn(naviModuleScope).then(
											function (filterOptions){
												const filterContextItems = [];
												if(filterOptions){
													if(filterOptions.isActiveInfo){
														filterContextItems.push({
															id: 'isActive',
															type: 'item',
															caption: filterOptions.isActiveInfo.title,
															cssClass: filterOptions.isActiveInfo.isActive ? 'active-caption' : null,
															fn: () => {
																let naviModuleElem = naviBtn.closest('[data-filter-option]');

																// Trigger a custom event
																let filterEvent = new CustomEvent('onFilter',
																	{
																		detail: {
																			key: "isActive",
																			value: {id: filterOptions.isActiveInfo.id, title: filterOptions.isActiveInfo.title}
																		}
																	});
																naviModuleElem.dispatchEvent(filterEvent);
															}});
														filterContextItems.push({
															id: 't11a',
															type: 'divider',
															caption: ''
														});
													}
													if(filterOptions.statusInfo?.options){
														const options = filterOptions.statusInfo.options;
														if(filterOptions.statusInfo.hasRubricCategory){
															for (const rubCat in options) {
																const statusList = options[rubCat];
																filterContextItems.push({
																	id: rubCat,
																	type: 'item',
																	caption: rubCat,
																	cssClass: 'title border-none',
																	disabled: true
																});
																for (let i = 0; i < statusList.length; i++) {
																	filterContextItems.push({
																		id: 'status-' + statusList[i].id,
																		type: 'item',
																		caption: statusList[i].title,
																		cssClass: statusList[i].isActive ? 'active-caption' : null,
																		fn: () => {
																			let naviModuleElem = naviBtn.closest('[data-filter-option]');

																			// Trigger a custom event
																			const badgeTitle = rubCat + ': ' + statusList[i].title;
																			let filterEvent = new CustomEvent('onFilter',
																				{
																					detail: {
																						key: "status",
																						value: {id: statusList[i].id, title: badgeTitle}
																					}
																				});
																			naviModuleElem.dispatchEvent(filterEvent);
																		}
																	});
																}
															}
														} else {
															filterContextItems.push({
																id: 'status-title',
																type: 'item',
																caption: 'Status',
																cssClass: 'title border-none',
																disabled: true
															});
															for (let i = 0; i < options.length; i++) {
																filterContextItems.push({
																	id: 'status-' + options[i].id,
																	type: 'item',
																	caption: options[i].title,
																	cssClass: options[i].isActive ? 'active-caption' : null,
																	fn: () => {
																		let naviModuleElem = naviBtn.closest('[data-filter-option]');

																		// Trigger a custom event
																		let badgeTitle = options[i].title;
																		let filterEvent = new CustomEvent('onFilter',
																			{
																				detail: {
																					key: "status",
																					value: {id: options[i].id, title: badgeTitle}
																				}
																			});
																		naviModuleElem.dispatchEvent(filterEvent);
																	}
																});
															}
														}
													}
												}

												if(filterContextItems && filterContextItems.length > 0){
													return [
														{
															id: "tfilter",
															caption: "Filter",
															type: "dropdown-btn",
															list: {
																cssClass: "dropdown-menu-right popup-menu width-m",
																level: 1,
																type: "dropdown-btn",
																showImages: false,
																showSearchfield: true,
																items: filterContextItems
															}
														}
													];
												}

												return [];
											}
										)
									} else {
										console.error("Attribute is not a function:", getFilterOptsFn);
									}
								} catch (error) {
									console.error("Error executing function:", error);
								}
							}
							return $q.when([]);
						}

						function createContextMenuContent(contextItems, event) {
							scope.contextMenuItems = {
								showImages: false,
								showTitles: true,
								cssClass: 'context-items',
								items: contextItems
							};


							instance = basicsLookupdataPopupService.toggleLevelPopup({
								multiPopup: false,
								hasDefaultWidth: true,
								plainMode: true,
								scope: scope,
								focusedElement: processFocusElement(event),
								template: contextMenuPopupTemplate
							});


							if (!_.isNil(instance)) {
								instance.opened
									.then(function () {
										$timeout(function () {
											scope.$digest();
										}, 0);
									});

								instance.closed.then(function () {
									angular.element('.tree-accordion-header, .header-body, button').removeClass('active');
								});
							}
						}

						function processFocusElement(event) {
							angular.element('.tree-accordion-header, .header-body, button').removeClass('active');

							let focusedElement = angular.element(event.target);
							if (event.target.tagName === 'BUTTON') {
								focusedElement.parents('.tree-accordion-header').addClass('active');
							} else {
								focusedElement.parents('button').addClass('active');
							}

							if (event.target.tagName.toUpperCase() === 'SVG' || event.target.tagName.toUpperCase() === 'USE') {
								focusedElement = angular.element(event.target).parents('.header-body');
								focusedElement.parents('.tree-accordion-header').addClass('active');
							} else if (angular.element(event.target).hasClass('header-collapse')) {
								focusedElement = angular.element(event.target).parents('.tree-accordion-header');
								focusedElement.addClass('active');
							}

							return focusedElement;
						}

						createOpenNewTabContextItem();
						createFilterOptionContextItems().then(
							function(filterItems){
								contextItems.push(...filterItems);
								createContextMenuContent(contextItems, event);
							}
						)

					});
				});

				scope.$on('$destroy', () => {
					elem.off('contextmenu');
				});

			}
		};
	}
})();