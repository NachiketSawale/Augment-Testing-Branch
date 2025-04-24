(function (ng, $) {
	'use strict';

	// var popupBtnOptions = {
	// 	'btnIconCss': '',                   //  @string:                icon css class for the anchor button.
	// 	'filter': false,                    //  @boolean:               is filter input active true/false.
	// 	'showResultBtn': false,             //  @boolean:               indicate if result buttons are active (OK/Cancel).
	// 	'items': ['ItemDefinition']         //  @array[ItemDefinition]: Array containing the item definitions for the poup list.
	//  'state': {}                         //  @object:                Object containing a saved state to be set on initialization.
	// };

	// var ItemDefinition = {
	// 	'label': 'Grouping Options',
	// 	'type': 'header',                   //Type can be header,button, radio, checkbox, color, custom
	// 	'template': '',                     // Only if custom type.
	// 	'events': 'click change keydown',   // Only if custom type.
	// 	'eventCallback': Function,
	// 	'itemCss': '',
	// 	'value': '',
	// 	'initialState': '',
	// 	'children': [],
	// 	'isHidden': false
	// };
	//
	// var DividerDefinition = {
	// 	'type': 'divider',
	// };

	var DEFAULT_ICO_CSS = 'tlb-icons ico-menu';

	function assign(obj, prop, value) {
		if (typeof prop === 'string') {
			prop = prop.split('.');
		}

		if (prop.length > 1) {
			var e = prop.shift();
			assign(obj[e] =
					Object.prototype.toString.call(obj[e]) === '[object Object]' ? obj[e] : {},
				prop,
				value);
		} else {
			obj[prop[0]] = value;
		}
	}

	function byString(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		for (var i = 0, n = a.length; i < n; ++i) {
			var k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return;
			}
		}
		return o;
	}

	function PopupButtonController($element, $compile, $scope, $templateCache) {
		var ctrl = this,
			_state = {},
			_prevState = {},
			_popupInstance,
			$listContainer,
			$filterInput,
			colorStateId,
			cpIsActive = false;

		/*****************************************************************************************
		 *      Controller Private Event Handlers
		 *****************************************************************************************/

		function processTargetType($target) {

		}

		function customItemEventHandler(e) {

			var args = {};

			ctrl.onCustomEvent({'args': args});
		}

		function handleFilter(e) {
			var filterValue = $(e.target).val().toLowerCase();
			$listContainer.find(':button').each(function () {
				// rei@4.10.18 only visible items can be used for search
				var notSearchable = $(this).parent().hasClass('notSearchable');
				if (!notSearchable) {
					var val = $(this).text().toLowerCase();
					if (val.search(filterValue) === -1) {
						$(this).parent().hide();
					} else if (val.search(filterValue) >= 0) {
						$(this).parent().show();
					}
				}
			});
		}

		ctrl.onColorChanged = function onColorChanged(cpId) {

		};

		function handleColorChange(e) {
			var $parent = $(e.target).closest('div');
			var state = byString(_state, $(e.target).val());
			if (state) {
				state['state'] = $(e.target).prop('checked') === true ? 'checked' : '';
			}
		}

		function handleCheckboxChange(parent, target) {
			var state = {};
			var targetInput = target.closest('li input');
			if (targetInput.prop('checked')) {
				state.state = 'checked';
			} else if (!targetInput.prop('checked')) {
				state.state = '';
			}
			updateState(state, targetInput.val(), targetInput.attr('data-parentval'));
		}

		function handleRadioChange(parent, target) {
			var activeRadio = parent.find('li input[type=radio][value!=' + target.val() + ']:checked');// .not('li ul li input:checked');
			var activeParentLI = activeRadio.closest('li');
			var targetInput = target.closest('li input');
			var targetLI = target.closest('li');
			if (activeRadio.length) {
				activeRadio.prop('checked', false);
				updateState({'state': '', 'disabled': false}, activeRadio.val(), activeRadio.attr('data-parentval'));
			}
			targetInput.prop('checked', true);
			updateState({'state': 'checked', 'disabled': false}, targetInput.val(), targetInput.attr('data-parentval'));
			var childInputs;
			if (activeParentLI.next().has('ul li input').length) {
				childInputs = activeParentLI.next().find('ul li input');
				var disabled = !activeRadio.prop('checked');
				childInputs.attr('disabled', disabled);
			} else if (targetLI.next().has('ul li input').length) {
				childInputs = targetLI.next().find('ul li input');
				var disabled = !targetInput.prop('checked');
				childInputs.attr('disabled', disabled);
			}
		}

		function handleSelectChange(e) {
			var targetInput = $(e.target).prev();
			updateState({'state': 'checked', 'selected': $(e.target).val()}, targetInput.val(), targetInput.attr('data-parentval'));
		}

		function handleStateChange(e) {
			var parentUL = $(e.target).closest('ul');
			var target = $(e.target).closest('li').find('input');
			var targetType = target.attr('type');

			if (targetType === 'radio') {
				handleRadioChange(parentUL, target);
			} else if (targetType === 'checkbox') {
				handleCheckboxChange(parentUL, target);
			}
			ctrl.onStateChange({'state': _state});
		}

		function handleKeyup(e) {
			if (_popupInstance && e.keyCode === 27) {
				closePopup();
				// $element.unbind('keyup',onKeyup);
			}
		}

		function handleKeydown(e) {

		}

		ctrl.handleClick = function handleClick(e, idx) {
			var result = {
				value: $(e.target).val()
			};
			if (result.value === 'OK') {
				var state = byString(_state, colorStateId);
				if (state && state.state === 'checked') {
					var color = _.padStart(ctrl.color.toString(16), 7, '#000000');
					state.color = color;
				}
				result.state = _state;
			} else if (result.value === 'Cancel') {
				_state = angular.copy(_prevState);
			} else {
				result.state = _state;
				result.idx = idx;
			}
			closePopup();
			ctrl.onAction({'result': result});
		};

		/*****************************************************************************************
		 *      Popup List Initialization
		 *****************************************************************************************/

		function bindEvents($ele, item) {
			for (var p in item.events) {
				var res = p.split(':'), el;
				if (res.length > 1 && res[0] === 'input') {
					el = $ele.find('input[type=' + res[1] + ']').on(item.events[p], customItemEventHandler);
				} else {
					el = $ele.find(p).on(item.events[p], customItemEventHandler);
				}
			}
		}

		function applyValues($ele, item) {
			var values = item.value, $item, value, state, isColorPicker = false;
			for (var p in values) {
				if (p.indexOf(':') > -1) {
					var res = p.split(':');
					$item = $ele.find('input[type=' + res[1] + ']');
					isColorPicker = res[1] === 'color';
				} else {
					$item = $ele.find('p');
				}
				value = values[p];
				if (isColorPicker && _state['colorPicker']) {
					value = _state['colorPicker'].state;
				} else if (isColorPicker && !_state['colorPicker']) {
					_state['colorPicker'] = {state: value};
				}
				if (_state[values[p]]) {
					value = _state[values[p]].state;
				} else if (!isColorPicker) {
					_state[values[p]] = {state: ''};
				}
				$item.val(value);
			}
		}

		function buildCustomItem(item) {
			var template;
			if (item.template) {
				template = item.template;
			} else {
				template = $templateCache.get(item.templateUrl);
			}
			var $template = $(template);
			bindEvents($template, item);
			applyValues($template, item);
			return $template;
		}

		function createCSS(item, hasParent) {
			var css = hasParent ? 'dropdown-child-item' : '';
			if (item.itemCss) {
				css += ' ' + item.itemCss;
			}
			return css;
		}

		function getStateForItem(path) {
			var state = byString(_state, path);
			if (!state) {
				return {
					'checked': false,
					'disabled': false
				};
			}
			return {
				checked: state['state'] === 'checked',
				disabled: state['disabled'],
				color: state['color'],
				selected: state['selected']
			};
		}

		function buildList($container, parentItem, parentState) {
			var items = parentItem ? parentItem.children : ctrl.options.items;
			var $content = $container;
			var disbaled;
			if (parentState) {
				disbaled = parentState.checked === false;
			}

			// var visibleItems = _.filter(items, {'isVisible': true});
			items.forEach(function (item, idx) {
				var parentValue = parentItem !== undefined ? parentItem.value : '';
				var css = createCSS(item, parentItem !== undefined);
				var path = parentItem ? parentItem.value + '.' + item.value : item.value;
				var state = '';
				if (item.type !== 'custom') {
					state = getStateForItem(path);
				}
				var $listItem = $('<li class="' + css + '">');

				switch (item.type) {
					case 'header':
						css = 'header-item';
						css += idx > 0 ? ' header-border-top' : '';
						$('<h4>' + item.label + '</h4>').appendTo($listItem);
						$listItem.addClass(css);
						break;
					case 'radio':
					case 'checkbox':
						var $wrapper = $('<div class="fullwidth">');
						var $input1 = $('<input class="pull-left" type="' + item.type + '" value="' + item.value + '" data-parentVal="' + parentValue + '" />').appendTo($wrapper);
						$('<label class="pull-left">' + item.label + '</label>').appendTo($wrapper);
						$input1.bind('change', handleStateChange);
						$input1.attr('disabled', disbaled || state.disabled);
						$input1.attr('checked', state.checked);

						$wrapper.appendTo($listItem);
						$listItem.bind('click', handleStateChange);
						break;
					case 'button':
						var $input2 = $('<button type="button" class="' + css + '" data-ng-click="$ctrl.handleClick($event,' + idx + ');" value="' + item.value + '" data-parentVal="' + parentValue + '">' + item.label + '</button>').appendTo($listItem);
						$input2.attr('disabled', state.disabled);
						break;
					case 'color':
						if (!ctrl.options.showResultBtn) {
							console.warn('Color picker will not work if result buttons are not present. Please set the showResultBtn flag in options to true.');
						}
						var template = $templateCache.get('platform/generic-popup-color.html');
						var $color = $(template).appendTo($listItem);

						$color.attr('disabled', state.disabled);
						$color.attr('value', item.value);
						colorStateId = item.value;
						var $input3 = $color.find('input[type=checkbox]').bind('change', handleColorChange);
						$input3.attr('checked', state.checked);
						$input3.val(item.value);
						ctrl.color = state.color;
						$color.find('label').text(item.label);
						$listItem.addClass('colour-line');
						break;
					case 'checkselect':
						var $wrapper = $('<div class="fullwidth">');
						var $input1 = $('<input class="pull-left" type="checkbox" value="' + item.value + '" data-parentVal="' + parentValue + '" />').appendTo($wrapper);
						$input1.bind('change', handleStateChange);
						$input1.attr('disabled', disbaled || state.disabled);
						$input1.attr('checked', state.checked);

						var $input2 = $('<select type="select" name="day-select" class="pull-left border-none"></select>');
						var input2selected = '';
						$.each(item.options, function (idx, option) {
							input2selected = (state.selected === idx) ? 'selected="selected"' : '';
							$input2.append('<option value="' + idx + '" ' + input2selected + '>' + option + '</option>');
						});

						$input2.appendTo($wrapper);
						$input2.bind('change', handleSelectChange);
						$wrapper.appendTo($listItem);
						break;
					case 'custom':
						$listItem.append(buildCustomItem(item));
						break;
					default:
						throw new Error('Unknown Type: ' + item.type);
				}
				if (item.divider) {
					$listItem.addClass('popup-item-divider');
				}
				if (item.isVisible === false) {
					$listItem.hide();
					$listItem.addClass('notSearchable'); // rei@4.10.18 mapp out the currently selected item from search list
				}
				$content.append($listItem);
				if (!parentItem && item.children && item.children.length) {
					var $item = $('<li class="dropdown-group">').appendTo($content);
					$item.css('height', 'auto');
					var $parent = $('<ul style="width: 100%">').appendTo($item);
					buildList($parent, item, state);
				}
			});
		}

		function buildContent() {
			var $outterContainer = $('<div>');
			$outterContainer.addClass('generic-popup fullwidth');
			if (ctrl.options.filter) {
				$filterInput = $('<input type="text" class="form-control">').appendTo($outterContainer);
				$filterInput.keyup(handleFilter);
			}
			$listContainer = $('<ul class="popup-list"></ul>');
			buildList($listContainer);
			$outterContainer.append($listContainer);
			if (ctrl.options.showResultBtn) {
				$('<input type="button" value="OK" class="btn btn-default" title="OK" ng-click="$ctrl.handleClick($event)">').appendTo($outterContainer);
				$('<input type="button" value="Cancel" class="btn btn-default" style="border-right: none;" title="Cancel" ng-click="$ctrl.handleClick($event)">').appendTo($outterContainer);
			} else {
				$outterContainer.addClass('flex-box flex-column');
			}
			return $outterContainer;
		}

		/*****************************************************************************************
		 *      Controller Private Helpers
		 *****************************************************************************************/

		function updateState(values, prop, parentProp) {
			var path = (parentProp === undefined || parentProp === '') ? prop : (parentProp + '.' + prop);
			var state = byString(_state, path);

			if (!state) {
				state = {state: '', disabled: false};
				assign(_state, path, state);
			}

			state['state'] = values.state;
			state['disabled'] = values.disabled;
			state['selected'] = (values.selected) ? values.selected : '';

			for (var p in state) {
				if (p !== 'state' && p !== 'disabled' && p !== 'selected') {
					state[p]['state'] = '';
					state[p]['disabled'] = state['disabled'];
					state[p]['selected'] = '';
				} else if (p !== 'state' && state['state'] === '' && state['disabled']) {
					state[p]['state'] = '';
					state[p]['disabled'] = true;
					state[p]['selected'] = '';
				}
			}
			if (Object.keys(state).length > 1) {
				return true;
			}
		}

		function closePopup() {
			if (_popupInstance) {
				_popupInstance.close();
				_popupInstance = null;
				return true;
			}
			return false;
		}

		/*****************************************************************************************
		 *      Controller Public Event Handlers
		 *****************************************************************************************/

		ctrl.togglePopup = function togglePopup(e) {

			e.preventDefault();
			e.stopPropagation();

			if (closePopup()) {
				// Unbind events
				return;
			}

			if (ctrl.options.showResultBtn) {
				_prevState = angular.copy(_state);
			}
			var raw_content = buildContent();
			$compile(raw_content)($scope);
			var options = {
				width: 230,
				plainMode: true
			};
			_popupInstance = $element.popup(raw_content, options);
			$element.keyup(handleKeyup);
			// $element.focusout(closePopup);
			if ($filterInput) {
				// Needed to activeate the input, otherwise you will not be able to click into it.
				$filterInput.focus();
			}
			_popupInstance.element.on('remove', function () {
				_popupInstance = null;
			});
		};

		/*****************************************************************************************
		 *      Lifecycle hooks
		 *****************************************************************************************/

		ctrl.$onInit = function onInit() {
			if (ctrl.options.state && !_.isEmpty(ctrl.options.state)) {
				_state = ctrl.options.state;
				return;
			}
			var items = ctrl.options.items;
			ctrl.color = '#000000';
			var colorPickers = _.find(items, {'type': 'color'});
			if (ng.isDefined(colorPickers) && (!ng.isObject(colorPickers) || colorPickers.length > 1)) {
				throw new Error('Currently only one colorpicker is supported.');
			}
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type === 'checkbox' || item.type === 'radio') {
					_state[item.value] = {'state': item.initialState, 'disabled': item.disabled};
				} else if (item.type === 'color') {
					var states = item.initialState.split('|');
					_state[item.value] = {'state': states[0], 'disabled': item.disabled, 'color': states[1]};
				} else if (item.type === 'checkselect') {
					_state[item.value] = {'state': item.initialState, 'disabled': item.disabled, 'selected': item.selected};
				}
				if (item.children && item.children.length) {
					var children = item.children;
					for (var j = 0; j < children.length; j++) {
						var child = children[j];
						_state[item.value][child.value] = {'state': child.initialState, 'disabled': item.disabled};
					}
				}
			}
		};

		ctrl.$onChanges = function onChanges(changes) {
			if (changes.items) {
				// ToDo: Something here...
			}
		};

		ctrl.$postLink = function postLink() {
			var btn = $element.find('button');
			if (ctrl.options.btnIconCSS) {
				btn.addClass('btn-dropdown ' + ctrl.options.btnIconCSS);
			} else {
				btn.addClass(DEFAULT_ICO_CSS);
			}
		};

		ctrl.$onDestroy = function onDestroy() {
			$element.unbind('keyup', handleKeyup);
		};
	}

	PopupButtonController.$inject = ['$element', '$compile', '$scope', '$templateCache'];

	var popupBtnConfig = {
		'bindings': {
			'options': '<',
			'onAction': '&',
			'onStateChange': '&',
			'onCustomEvent': '&'
		},
		'template': '<button class="btn " data-ng-click="$ctrl.togglePopup($event)"></button>',
		'controller': PopupButtonController
	};

	ng.module('platform').component('popupButton', popupBtnConfig);

})(angular, jQuery);
