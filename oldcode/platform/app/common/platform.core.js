(function ($, _) {
	'use strict';

	$.extend(true, window, {
		'Platform': {
			'Messenger': Messenger,
			'replaceImageToSvg': replaceImageToSvg,
			'Action': Action,
			'ActionGroup': {
				navBarActions: 'navBar',
				defaultOptionsAction: 'defaultOptions',
				moduleOptionsAction: 'moduleOptions'
			}
		}
	});

	angular.module('platform').constant('PlatformMessenger', Messenger); // jshint ignore:line

	/**
	 * @ngdoc function
	 * @name Messenger
	 * @function
	 * @description Constructor of platform messenger
	 */
	function Messenger() {
		var handlers = [];
		var that = this;

		/**
		 * @ngdoc function
		 * @name register
		 * @function
		 * @methodOf Messenger
		 * @description registers a new callback
		 * @param {function} fn callback to be registered
		 * @returns {function} un-register function
		 */
		this.register = function register(fn) {
			handlers.push(fn);

			return function () {
				that.unregister(fn);
			};
		};

		/**
		 * @ngdoc function
		 * @name unregister
		 * @function
		 * @methodOf Messenger
		 * @description unregisters a callback
		 * @param {function} fn callback to be unregistered
		 */
		this.unregister = function unregister(fn) {
			for (var i = 0; i < handlers.length; i++) {
				if (handlers[i] === fn) {
					handlers.splice(i, 1);
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name unregister all callbacks
		 * @function
		 * @methodOf Messenger
		 * @description unregister all callbacks
		 */
		this.unregisterAll = function unregisterAll() {
			handlers = [];
		};

		/**
		 * @ngdoc function
		 * @name fire
		 * @function
		 * @methodOf Messenger
		 * @description fires an event to registered callbacks
		 * @param {object} e event
		 * @param {args} args arguments
		 * @param {object} scope $scope
		 * @returns {object} result of last callback
		 */
		this.fire = function fire(e, args, scope) {
			var returnValue;
			scope = scope || this;
			for (var i = 0; i < handlers.length; i++) {
				if (_.isFunction(handlers[i])) {
					returnValue = handlers[i].call(scope, e, args);
				}
			}
			return returnValue;
		};
	}

	function replaceImageToSvg() {
		$('img.svg').each(function () {
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			$.get(imgURL, function (data) {
				var $svg = $(data).find('svg');

				if (typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				if (typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass + ' replaced-svg');
				}
				$svg = $svg.removeAttr('xmlns:a');
				var color = $img.attr('color');

				$('path, polygon, circle', $svg).attr('fill', color);
				$img.replaceWith($svg);
			});
		});
	}

	/**
	 *
	 * @param actionKey
	 * @param actionGroup
	 * @param actionTranslateString
	 * @param actionIconCSS
	 * @param isVisible
	 * @param isDisabled
	 * @param actionSortOrder
	 * @param actionFunction
	 * @param actionPermission {String} permission to check as string (guid#rwcde)
	 * @constructor
	 */
	function Action(actionKey, actionGroup, actionTranslateString, actionIconCSS, isVisible, isDisabled, actionSortOrder, actionFunction, actionPermission, isShowIndicator, hotkey) { // jshint ignore:line
		this.key = actionKey || 'nokey';
		this.description = actionTranslateString || '';
		this.description$tr$ = actionTranslateString || '';
		this.visible = isVisible !== undefined ? isVisible : true;
		this.disabled = isDisabled !== undefined ? isDisabled : false;
		this.fn = actionFunction || angular.noop;
		this.iconCSS = actionIconCSS || '';
		this.group = actionGroup;
		this.sortOrder = actionSortOrder !== undefined ? actionSortOrder : 999;
		this.permission = actionPermission;
		this.indicator = isShowIndicator;
		this.tooltip = this.description;
		this.hotkey = hotkey;

		this.sync = function sync(action) {
			this.key = action.key;
			this.description = action.description || '';
			this.description$tr$ = action.description$tr$ || '';
			this.visible = action.visible !== undefined ? action.visible : true;
			this.disabled = action.disabled || false;
			this.fn = action.fn || angular.noop;
			this.iconCSS = action.iconCSS || '';
			this.group = action.group || Platform.ActionGroup.navBarActions;
			this.sortOrder = action.sortOrder !== undefined ? action.sortOrder : 9999;
			this.permission = action.permission;
			this.indicator = action.indicator;
			this.tooltip = action.tooltip || action.description;
			this.hotkey = action.hotkey;
			return this;
		};

		this.clone = function clone() {
			return new Action(this.key, this.group, this.description, this.iconCSS, this.visible, this.disabled, this.sortOrder, this.fn, this.permission, this.indicator, this.hotkey);
		};

		this.getMenuListItem = function getMenuListItems() {
			return {
				caption: this.description,
				key: this.key,
				type: 'item',
				cssClass: this.iconCSS,
				fn: this.fn,
				visible: this.visible,
				disabled: this.disabled,
				permission: this.permission,
				indicator: this.indicator,
				tooltip: this.tooltip,
				hotkey: this.hotkey
			};
		};
	}

// eslint-disable-next-line no-undef
})($, _);