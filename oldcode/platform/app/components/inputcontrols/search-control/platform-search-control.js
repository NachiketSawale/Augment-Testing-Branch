(function (angular) {
	'use strict';

	angular.module('platform').directive('platformSearchControl', platformSearchControl);

	platformSearchControl.$inject = ['$compile', 'basicsLookupdataPopupService', '$timeout', '$translate', 'platformSearchControlService', 'keyCodes', 'platformTranslateService'];

	function platformSearchControl($compile, basicsLookupdataPopupService, $timeout, $translate, platformSearchControlService, keyCodes, platformTranslateService) {
		return {
			restrict: 'E',
			scope: {
				ngModel: '=',
				options: '<'
			},
			link: function (scope, elem) {

				platformTranslateService.translateObject(scope.options.fields, [scope.options.displayMember]);

				// multiSelect is default false. Doesn't have to come from outside
				scope.options = _.assign({
					multipleSelect: false,
					showSearchModes: true,
					showSearchIn: true,
					showOptions: true,
					openPopUpAfterItemClick: false
				}, scope.options);

				// need for button-highlighting. Has the origin values changed, then button get a highlighted css-class
				var changesAvailable = _.cloneDeep(scope.ngModel);

				// showOptions not showing if showSearchModes an showSearchIn is displaying
				scope.options.showOptions = !scope.options.showSearchModes && !scope.options.showSearchIn ? false : true;

				// #109179 --> only after okay click, the new value saved in ngModel.mode
				function setRadioButtonValue() {
					scope.valueOfRadioButtons = scope.ngModel.mode;
				}

				setRadioButtonValue();

				// assign the options for the domain-control
				scope.config = _.assign({
					placeholder: $translate.instant('platform.searchcontrol.placeholderInputField'),
					autofocus: 300
				}, scope.options.config);

				// use directive for radio-input-fields. This is the options for that.
				// the operators are determined by developers. Default is: contains, starts, ends. Operators in array.
				platformSearchControlService.getRadioGroupOption(scope.options.operators || []).then(function (response) {
					scope.radioGroupOpt = response;
				});

				// function for radio-input-fields
				scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
					scope.valueOfRadioButtons = radioValue;
				};

				// map options in JSON-Object for Action-Item-List
				scope.messageList = {
					items: platformSearchControlService.getMappedOptionsFields(scope.options, scope.ngModel.selected)
				};

				// Action-Item-List need activeValue-key for Radio-Buttons -> One Selection
				if (!scope.options.multipleSelect) {
					setActiveValueIfNotMultiSelect();
				}

				function setActiveValueIfNotMultiSelect() {
					scope.messageList.activeValue = scope.ngModel.selected[0] ? scope.ngModel.selected[0] : 'allItemsFromSystem';
				}

				// for action-list controller --> not closing popup after a item-click.
				if (scope.options.openPopUpAfterItemClick) {
					scope.messageList.openPopUpAfterItemClick = scope.options.openPopUpAfterItemClick;
				}

				// initialize Action-Item-List
				var actionItemsLinkMessages = null;
				scope.initActionItemsLinkMessages = function (link) {
					actionItemsLinkMessages = link;
					link.setFields(scope.messageList);
				};

				// for filterung in input-field in popup-container. Set items visible true or false. For displaying show or hide.
				function updateSelectedItem(item, bool) {
					actionItemsLinkMessages.updateFields([{
						id: item.id,
						visible: bool
					}]);
				}

				// set selected key in action-list
				function processSelectedItems(ids, bool) {
					for (var i = 0; i < ids.length; i++) {
						actionItemsLinkMessages.updateFields([{
							id: ids[i],
							selected: bool,
							cssClass: bool ? 'selected' : ''
						}]);
					}
				}

				// key-up for input-field in popup-container. Filterung items via value in input-field
				scope.handleFilter = function (inputfield, event) {
					if (event.keyCode === keyCodes.ESCAPE) {
						event.preventDefault();
						event.stopPropagation();

						inputfield.searchValue = '';
						setItemsOnVisible();
						closePopup();
					} else {
						_.forEach(scope.messageList.items, function (item) {
							if (inputfield.searchValue && (!_.includes(item.text.toLowerCase(), inputfield.searchValue.toLowerCase()))) {
								updateSelectedItem(item, false); // hide item in list
							} else if (!item.visible) {
								updateSelectedItem(item, true); // show item in list
							}
						});
					}
				};

				var instance;

				function setItemsOnVisible() {
					_.forEach(scope.messageList.items, function (item) {
						item.visible = true;
					});
				}

				// init popup-container
				scope.openPopup = function () {
					instance = basicsLookupdataPopupService.toggleLevelPopup($.extend({}, platformSearchControlService.getPopupOption(), {
						scope: scope,
						focusedElement: $(event.currentTarget),
						containerClass: 'search-control-popup'
					}));
					if (!(_.isNull(instance) || _.isUndefined(instance))) {
						// when popup-container is open
						instance.opened.then(function () {
							// set visible to default value
							setItemsOnVisible();

							$timeout(function () {
								scope.$digest();
							}, 0);
						});

						// #143449 - revert original state if user close popup by clicking space outside the popup window rather than cancel button.
						instance.closed.then(function (ok) {
							if(!ok) {
								setRadioButtonValue();

								if (!scope.options.multipleSelect) {
									setActiveValueIfNotMultiSelect();
								} else {
									// get selected items by user
									var selectedItemsId = _.map(_.filter(scope.messageList.items, {'selected': true}), 'id');
									// revert selected items
									processSelectedItems(selectedItemsId, false);

									// set selected items via from ngmodel
									var selectedItemsInModel = _.map(_.filter(scope.messageList.items, function (item) {
										return _.includes(scope.ngModel.selected, item.value);
									}), 'id');

									processSelectedItems(selectedItemsInModel.length > 0 ? selectedItemsInModel : [scope.messageList.items[0].id], true);
								}
							}
						});
					}
				};

				// set selected items in ng-model
				function setSelectedItemsInModel() {
					if (scope.options.multipleSelect) {
						scope.ngModel.selected = _.map(_.filter(scope.messageList.items, {'selected': true}), 'value');
					} else {
						scope.ngModel.selected.length = 0;
						scope.ngModel.selected.push(scope.messageList.activeValue);
					}

					// is first item selected --> then model get empty array
					if (scope.ngModel.selected.length === 1 && scope.ngModel.selected[0] === 'allItemsFromSystem') {
						scope.ngModel.selected.length = 0;
					}
				}

				// click ok button in popup-container
				scope.okFn = function (event) {
					setSelectedItemsInModel();
					// set radio value in ngModel
					scope.ngModel.mode = scope.valueOfRadioButtons;
					// if the changes have changed, the search button is highlighted
					scope.options.cssClassButton = setCssClassForButton() ? '' : 'highlight';

					closePopup(true);

					if (_.isFunction(scope.options.onOk)) {
						scope.options.onOk.apply(this, [scope.ngModel, scope.options, {scope: scope}]);
					}
				};

				function setCssClassForButton() {
					return _.isEqual(
						_.omit(changesAvailable, ['searchstring']),
						_.omit(scope.ngModel, ['searchstring'])
					);
				}

				// close popup-container
				function closePopup(result) {
					if (instance) {
						instance.close(result);
					}
				}

				// click on cancel-button in popup-container
				scope.closeFn = function (event) {
					closePopup(false);
				};

				scope.changeWrapper = function (event) {
					if (event.keyCode === keyCodes.ENTER || event.keyCode === keyCodes.TAB) {
						if (_.isFunction(scope.options.fnc)) {
							scope.options.fnc.apply(this, [scope.ngModel, scope.options, {scope: scope}]);
						}
					}
				};

				// set HTML Markup for search-input-field and button for opening popup-container
				function getTemplate() {
					var template = '<div class="input-group form-control">' +
						'<div data-domain-control data-domain="description" data-model="ngModel.searchstring" data-model-options="{debounce: { default: 0, blur: 0}}" data-config="config" data-keydown="changeWrapper($event)"></div>' +
						'<span data-ng-if="options.showOptions" class="input-group-btn">' +
						'<button class="btn btn-default input-sm tlb-icons ico-settings" data-ng-click="openPopup()" tabindex="0" ng-class="options.cssClassButton"></button>' +
						'</span>' +
						'</div>';
					return template;
				}

				var template = getTemplate();

				elem.append($compile(template)(scope));
			}
		};
	}
})(angular);