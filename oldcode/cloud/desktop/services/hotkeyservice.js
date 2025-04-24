/**
 * Created by knickenberg on 03.07.2014.
 */

/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopHotKeyService
 * @priority default value
 * @description
 * Load hotkeys (combo + function description) from a json file.
 * Provides register and unregister functions for hotkeys.
 *
 *
 *
 * @example
 ...
 var fn = function(){
 // doSomething
 }

 cloudDesktopHotKeyService.register('doSomething',fn);

 $scope.$on('$destroy', function () {
    cloudDesktopHotKeyService.unregister('doSomething',fn);
 }
 ...
 */
/* global Platform:false */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').config(['globals', 'hotkeysProvider',
		function (globals, hotkeysProvider) {

			hotkeysProvider.cheatSheetHotkey = 'alt+k';
			hotkeysProvider.template = '<div class="cfp-hotkeys-container fade" ng-class="{in: helpVisible}" style="display: none;"><div class="cfp-hotkeys">' +
				'<h4 class="cfp-hotkeys-title" ng-if="!header">{{ "cloud.common.keyboardShortcuts" | translate}}</h4>' +
				'<div ng-bind-html="header" ng-if="header"></div>' +
				'<table>' +
				'<tbody ng-repeat="hotkey in hotkeys" ng-if="hotkey.description">' +
				'<tr ng-if="$even">' +
				'<td class="cfp-hotkeys-keys">' +
				'<span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span>' +
				'</td>' +
				'<td class="cfp-hotkeys-text">{{::hotkey.description  | translate}}</td>' +
				'<td style="width:50px;"></td>' +
				'<td class="cfp-hotkeys-keys">' +
				'<span ng-repeat="key in hotkeys[$index+1].format() track by $index" class="cfp-hotkeys-key">{{ key }}</span>' +
				'</td>' +
				'<td class="cfp-hotkeys-text">{{ hotkeys[$index+1].description | translate}}</td>' +
				'</tr>' +
				'</tbody>' +
				'</table>' +
				'<div ng-bind-html="footer" ng-if="footer"></div>' +
				'<div class="cfp-hotkeys-close" ng-click="toggleCheatSheet()">&#215;</div>' +
				'</div></div>';
		}]);

	angular.module('cloud.desktop').factory('cloudDesktopHotKeyService', ['_', 'hotkeys', '$http', 'platformTranslateService', 'hotkeyCodes', function (_, hotkeys, $http, platformTranslateService, hotkeyCodes) {
		var service = {};
		var shortcuts = {};

		// Get existing  messenger or create a new
		var getMessengerSave = function (callbackId) {
			if (angular.isUndefined(service[callbackId])) {
				service[callbackId] = new Platform.Messenger();
			}
			return service[callbackId];
		};

		var getWrappedMessenger = function (callbackId) {
			if(callbackId === 'toggleCheatSheet') {
				return hotkeys.toggleCheatSheet;
			}
			else {
				var messenger = getMessengerSave(callbackId);
				return function (event) {
					if(messenger.disabled && ((_.isFunction(messenger.disabled) && messenger.disabled()) || (!_.isFunction(messenger.disabled) && messenger.disabled))) {
						// messenger.fire();
					}
					else {
						if(messenger.displayed) {
							messenger.fire();
							event.preventDefault();
							event.stopPropagation();
						}
					}
				};
			}
		};

		// Register a callback function to the hotkey with the callbackId
		service.register = function (callbackId, callback, disableFn, isDisplayed = true) {

			let shortcut = shortcuts[callbackId];
			if(shortcut) {
				hotkeys.del(shortcut.shortcut);
				hotkeys.add(shortcut.combo);
			}

			let messenger = getMessengerSave(callbackId);
			messenger.register(callback);
			if(disableFn) {
				messenger.disabled = disableFn;
			}
			messenger.displayed = isDisplayed;
		};

		service.setVisibleOptionsInCheatSheet = function (availableShortcuts) {
			if(hotkeys) {
				if(availableShortcuts) {
					for(let propertyName in shortcuts) {
						if (shortcuts[propertyName].moduleName === 'default') {
							if(availableShortcuts.includes(propertyName)) {
								hotkeys.add(shortcuts[propertyName].combo);
							}
							else {
								hotkeys.del(shortcuts[propertyName].shortcut);
							}
						}
					}
				}
				else {
					for(let propertyName in shortcuts) {
						if (shortcuts[propertyName].moduleName === 'default') {
								hotkeys.add(shortcuts[propertyName].combo);
						}
					}
				}
			}
		};

		service.setDescription = function (callbackId, description) {
			let item = hotkeys.get(shortcuts[callbackId].shortcut);
			if (item && item.description != '') {
				item.description = description;
			}
		};

		service.resetDescription = function (callbackId) {
			let item = hotkeys.get(shortcuts[callbackId].shortcut);
			if (item && item.description != '') {
				item.description = shortcuts[callbackId].description;
			}
		};

		service.getTooltip = function (callbackId, fallback) {
			let hotkey = [];
			if(fallback) {
				hotkey = fallback;
			}
			else if(angular.isDefined(shortcuts[callbackId])) {
				shortcuts[callbackId].shortcut.split('+').forEach(function(item) {
					if (item === '-') {
						hotkey.push(_.get(hotkeyCodes, 'MINUS'));
					} else if (item === '+' || item === '=') {
						hotkey.push(_.get(hotkeyCodes, 'PLUS'));
					} else {
						hotkey.push(_.get(hotkeyCodes, item.toUpperCase()));
					}
				});
			}

			let tooltip = '';
			if (hotkey) {
				for(let index = 0; index < hotkey.length; index++) {
					let translated = platformTranslateService.instant(hotkey[index].translation, null, true);
					tooltip += translated;
					if (index !== hotkey.length - 1) {
						tooltip += '+';
					}
				}
			}
			return tooltip;
		};

		// Unregister a callback function
		service.unregister = function (callbackId) {
			var messenger = getMessengerSave(callbackId);
			messenger.unregisterAll();
			let shortcut = shortcuts[callbackId];
			if(shortcut) {
				hotkeys.del(shortcut.shortcut);
			}
		};

		service.hasHotKey = function(callbackId) {
			return angular.isDefined(service[callbackId]);
		};

		// Register an array of callback objects {callbackId: 'something', callback: fn}
		service.registerBulk = function (hkArray) {
			for (var i = 0; i < hkArray.length; i++) {
				if (angular.isDefined(hkArray[i].callbackId) && angular.isDefined(hkArray[i].callback)) {
					service.register(hkArray[i].callbackId, hkArray[i].callback);
				}
			}
		};

		// Unregister an array of callback objects {callbackId: 'something', callback: fn}
		service.unregisterBulk = function (hkArray) {
			for (var i = 0; i < hkArray.length; i++) {
				if (angular.isDefined(hkArray[i].callbackId) && angular.isDefined(hkArray[i].callback)) {
					service.unregister(hkArray[i].callbackId, hkArray[i].callback);
				}
			}
		};

		service.unregisterModuleShortcuts = function (moduleName) {
			for(let propertyName in shortcuts) {
				if (shortcuts[propertyName].moduleName === moduleName) {
					hotkeys.del(shortcuts[propertyName].shortcut);
					delete shortcuts.propertyName;
				}
			}
		};

		service.registerHotkeyjson = function(file, moduleName) {
			$http(
				{
					method: 'GET',
					url: globals.appBaseUrl + file
				}
			).then(function (response) {
				for (var i = 0; i < response.data.length; i++) {
					var combo = response.data[i];
					combo.callback = getWrappedMessenger(combo.callbackId);
					hotkeys.add(combo);
					shortcuts[combo.callbackId] = { tooltip: combo.tooltip, description: combo.description, shortcut: combo.combo, combo: combo, moduleName: moduleName };
				}
			});
		};

		function addItemToShortcut(item, moduleName) {
			let combo = {
				"combo": item.hotkey.map(u=> u.key).join('+'),
				"description": moduleName === 'navBar' ? item.description : item.caption,
				"callbackId": moduleName === 'navBar' ? item.key : item.id,
				"allowIn": [
					"INPUT",
					"SELECT",
					"TEXTAREA"
				]};
			combo.callback = getWrappedMessenger(combo.callbackId);
			hotkeys.add(combo);
			shortcuts[combo.callbackId] = { tooltip: item.tooltip, description: combo.description, shortcut: combo.combo, combo: combo, moduleName: moduleName };
		}

		service.registerToolbar = function(toolbarItems, moduleName = 'default') {
			toolbarItems.forEach(function(item) {
				if(moduleName === 'navBar') {
					if (service.hasHotKey(item.key) && item.fn) {
						service.register(item.key, item.fn, item.disabled, item.isDisplayed);
						if (item.description) {
							item.description = platformTranslateService.instant(item.description, null, true);
						}
						item.tooltip = item.description + ' (' + service.getTooltip(item.key, item.hotkey) + ')';

						if(!angular.isDefined(shortcuts[item.key])) {
							addItemToShortcut(item, moduleName);
						}
					}
					else {
						if (item.fn && item.hotkey) {
							if (item.description) {
								item.description = platformTranslateService.instant(item.description, null, true);
							}
							item.tooltip = item.description + ' (' + service.getTooltip(item.key, item.hotkey) + ')';

							addItemToShortcut(item, moduleName);
						}
					}
				}
				else {
					if (service.hasHotKey(item.id) && item.fn) {
						service.register(item.id, item.fn, item.isDisabled, item.isDisplayed);
						if (item.caption) {
							service.setDescription(item.id, platformTranslateService.instant(item.caption, null, true));
						}
					} else if (item.fn) {
						item.tooltip = item.description + ' (' + service.getTooltip(item.id, item.hotkey) + ')';
						addItemToShortcut(item, moduleName);
					}
				}
			});
		}

		service.unregisterToolbar = function(toolbarItems) {
			toolbarItems.forEach(function (item) {
				if (service.hasHotKey(item.id) && item.fn) {
					service.unregister(item.id, item.fn);
					service.resetDescription(item.id);
				}
			});
		}

		$http(
			{
				method: 'GET',
				url: globals.appBaseUrl + 'cloud.desktop/content/json/hotkey.json'
			}
		).then(function (response) {
			for (var i = 0; i < response.data.length; i++) {
				var combo = response.data[i];
				combo.callback = getWrappedMessenger(combo.callbackId);
				hotkeys.add(combo);
				shortcuts[combo.callbackId] = { tooltip: combo.tooltip, description: combo.description, shortcut: combo.combo, combo: combo, moduleName: 'default' };
			}
		});
		return service;
	}]);
})(angular);

