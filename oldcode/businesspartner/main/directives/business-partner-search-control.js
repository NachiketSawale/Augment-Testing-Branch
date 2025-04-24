(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';
	angular.module(moduleName).directive('businessPartnerSearchControl', businessPartnerSearchControl);

	businessPartnerSearchControl.$inject = ['$compile', 'basicsLookupdataPopupService', '$timeout', '$translate', 'platformSearchControlService', 'keyCodes', 'platformTranslateService'];

	//https://rib-40.atlassian.net/browse/DEV-31727
	//todo There is a lot of code duplication between this instruction and platformSearchControl. Please design a good framework when migrating angular.
	function businessPartnerSearchControl($compile, basicsLookupdataPopupService, $timeout, $translate, platformSearchControlService, keyCodes, platformTranslateService) {
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

				// Need for button-highlighting. Has the origin values changed, then button get a highlighted css-class
				let changesAvailable = _.cloneDeep(scope.ngModel);

				// showOptions not showing if showSearchModes and showSearchIn is displaying
				scope.options.showOptions = !(!scope.options.showSearchModes && !scope.options.showSearchIn);

				// #109179 --> only after okay click, the new value saved in ngModel.mode
				function setRadioButtonValue() {
					scope.valueOfRadioButtons = scope.ngModel.mode;
				}

				setRadioButtonValue();

				// Assign the options for the domain-control
				scope.config = _.assign({
					placeholder: $translate.instant('platform.searchcontrol.placeholderInputField'),
					autofocus: 300
				}, scope.options.config);

				// Use directive for radio-input-fields. This is the options for that.
				// The operators are determined by developers. Default is: contains, starts, ends. Operators in array.
				platformSearchControlService.getRadioGroupOption(scope.options.operators || []).then(function (response) {
					scope.radioGroupOpt = response;
				});

				// Function for radio-input-fields
				scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
					scope.valueOfRadioButtons = radioValue;
				};

				// Map options in JSON-Object for Action-Item-List
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

				// For action-list controller --> not closing popup after an item-click.
				if (scope.options.openPopUpAfterItemClick) {
					scope.messageList.openPopUpAfterItemClick = scope.options.openPopUpAfterItemClick;
				}

				// Initialize Action-Item-List
				let actionItemsLinkMessages = null;
				scope.initActionItemsLinkMessages = function (link) {
					actionItemsLinkMessages = link;
					link.setFields(scope.messageList);
				};

				// For filtering in input-field in popup-container. Set items visible true or false. For displaying show or hide.
				function updateSelectedItem(item, bool) {
					actionItemsLinkMessages.updateFields([{
						id: item.id,
						visible: bool
					}]);
				}

				// Set selected key in action-list
				function processSelectedItems(ids, bool) {
					for (let id of ids) {
						actionItemsLinkMessages.updateFields([{
							id: id,
							selected: bool,
							cssClass: bool ? 'selected' : ''
						}]);
					}
				}

				// Key-up for input-field in popup-container. Filtering items via value in input-field
				scope.handleFilter = function (inputfield, event) {
					if (event.keyCode === keyCodes.ESCAPE) {
						event.preventDefault();
						event.stopPropagation();

						inputfield.searchValue = '';
						setItemsOnVisible();
						closePopup();
					} else {
						_.forEach(scope.messageList.items, function (item) {
							if (inputfield.searchValue && (!_.includes(item.caption.toLowerCase(), inputfield.searchValue.toLowerCase()))) {
								updateSelectedItem(item, false); // Hide item in list
							} else if (!item.visible) {
								updateSelectedItem(item, true); // Show item in list
							}
						});
					}
				};

				let instance;

				function setItemsOnVisible() {
					_.forEach(scope.messageList.items, function (item) {
						item.visible = true;
					});
				}

				// Init popup-container
				scope.openPopup = function () {
					instance = basicsLookupdataPopupService.toggleLevelPopup($.extend({}, platformSearchControlService.getPopupOption(), {
						scope: scope,
						focusedElement: $(event.currentTarget),
						containerClass: 'search-control-popup'
					}));
					if (!(_.isNull(instance) || _.isUndefined(instance))) {
						// When popup-container is open
						instance.opened.then(function () {
							// Set visible to default value
							setItemsOnVisible();

							$timeout(function () {
								scope.$digest();
							}, 0);
						});

						// #143449 - Revert original state if user close popup by clicking space outside the popup window rather than cancel button.
						instance.closed.then(function (ok) {
							if (!ok) {
								setRadioButtonValue();

								if (!scope.options.multipleSelect) {
									setActiveValueIfNotMultiSelect();
								} else {
									// Get selected items by user
									let selectedItemsId = _.map(_.filter(scope.messageList.items, {'selected': true}), 'id');
									// Revert selected items
									processSelectedItems(selectedItemsId, false);

									// Set selected items via from ngmodel
									let selectedItemsInModel = _.map(_.filter(scope.messageList.items, function (item) {
										return _.includes(scope.ngModel.selected, item.value);
									}), 'id');

									processSelectedItems(selectedItemsInModel.length > 0 ? selectedItemsInModel : [scope.messageList.items[0].id], true);
								}
							}
						});
					}
				};

				// Set selected items in ng-model
				function setSelectedItemsInModel() {
					if (scope.options.multipleSelect) {
						scope.ngModel.selected = _.map(_.filter(scope.messageList.items, {'selected': true}), 'value');
					} else {
						scope.ngModel.selected.length = 0;
						scope.ngModel.selected.push(scope.messageList.activeValue);
					}

					// If first item selected --> then model get empty array
					if (scope.ngModel.selected.length === 1 && scope.ngModel.selected[0] === 'allItemsFromSystem') {
						scope.ngModel.selected.length = 0;
					}
				}

				// Click OK button in popup-container
				scope.okFn = function (event) {
					setSelectedItemsInModel();
					// Set radio value in ngModel
					scope.ngModel.mode = scope.valueOfRadioButtons;
					closePopup(true);
					if (_.isFunction(scope.options.onOk)) {
						scope.options.onOk.apply(this, [scope.ngModel, scope.options, {scope: scope}]);
					}
				};

				// Close popup-container
				function closePopup(result) {
					if (instance) {
						instance.close(result);
					}
				}

				// Click on cancel-button in popup-container
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

				// Get description of the selected search items
				scope.getSearchDescription = function () {
					if (scope.ngModel.selected && scope.ngModel.selected.length > 0) {
						let selectedTexts = scope.ngModel.selected.map(function (value) {
							let selectedItem = scope.messageList.items.find(item => item.value === value);
							return selectedItem ? selectedItem.caption : '';
						});
						return selectedTexts.join(', ');
					} else {
						return $translate.instant('platform.searchcontrol.allItems');
					}
				};

				// Set HTML Markup for search-input-field and button for opening popup-container
				function getTemplate() {
					return `
						<style>
						   .btn { color: #3789cc; }
						   .btn-fulltext { display: inline-flex; width: 120px !important; }
						   .btn-fulltext-text { height: 18px; flex: 1; margin: 6px 0; text-align: left; padding: 0 8px; line-height: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #333; }
						   .btn-fulltext-ico { height: 30px !important; width: 30px; line-height: 30px !important; padding: 0 !important; box-sizing: content-box; background-position: 50% !important; }
						</style>
						<div class="input-group form-control">
						   <div data-domain-control autofocus data-domain="description" data-ng-model="ngModel.searchstring" data-model-options="{debounce: { default: 0, blur: 0 }}" data-config="config" data-keydown="changeWrapper($event)"></div>
						   <span class="input-group-btn">
						       <button class="btn btn-default btn-fulltext" data-ng-click="openPopup()">
						           <span class="btn-fulltext-text" data-ng-bind="getSearchDescription()" title="{{ getSearchDescription() }}"></span>
						           <span class="btn-fulltext-ico control-icons ico-down"></span>
						       </button>
						   </span>
						</div>
						`;
				}

				elem.append($compile(getTemplate())(scope));

			}
		};
	}
})(angular);
