/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular, _) {
	'use strict';

	function platformFullsizeButtonController(domUtilsService, $translate, cloudDesktopHotKeyService) {
		var ctrl = this; // jshint ignore:line
		var info;
		var lastParentPane;
		var lastIndex;
		var placeholderElement;

		function getStateValue(stateName) {
			switch (stateName) {
				case 'fullscreen':
					return _.get(ctrl, 'fullsizeStates.fullscreen');
				case 'placeholderElement':
					return _.get(ctrl, 'fullsizeStates.placeholderElement');
				case 'lastParentPane':
					return _.get(ctrl, 'fullsizeStates.lastParentPane');
				case 'lastIndex':
					return _.get(ctrl, 'fullsizeStates.lastPanelIndex');
				default:
					return undefined;
			}
		}

		function setStateValue(stateName, value) {
			switch (stateName) {
				case 'fullscreen':
					_.set(ctrl, 'fullsizeStates.fullscreen', value);
					break;
				case 'placeholderElement':
					_.set(ctrl, 'fullsizeStates.placeholderElement', value);
					break;
				case 'lastParentPane':
					_.set(ctrl, 'fullsizeStates.lastParentPane', value);
					break;
				case 'lastIndex':
					_.set(ctrl, 'fullsizeStates.lastPanelIndex', value);
					break;
				default:
					return undefined;
			}
		}

		function setButtonTitle() {
            const actionTitle = (ctrl.fullsizeStates && ctrl.fullsizeStates.fullscreen) 
                ? $translate.instant('cloud.common.minimize') 
                : $translate.instant('cloud.common.maximize');
            const shortCut = cloudDesktopHotKeyService.getTooltip('maxmin');
            ctrl.title = shortCut ? `${actionTitle} (${shortCut})` : actionTitle;
        }

		ctrl.click = function ($event) {
			const evCallback = ctrl.onBeforeResize();

			if(evCallback) {
				evCallback($event);
			}

			var pane = $event.currentTarget.closest('.k-pane');
			var contentPanel = $event.currentTarget.closest('#splitter');

			if (getStateValue('fullscreen')) {
				pane.classList.remove('fullscreen-mode');
				placeholderElement = getStateValue('placeholderElement');
				// copy placeholder attribute values to original pane
				domUtilsService.setAttributesToElement(pane, placeholderElement.attributes);
				// remove placeholder element
				placeholderElement.remove();
				// move element back to old position
				lastIndex = getStateValue('lastIndex');
				lastParentPane = getStateValue('lastParentPane');
				lastParentPane.insertBefore(pane, lastParentPane.children[lastIndex]);
			} else {
				lastParentPane = pane.parentNode;
				setStateValue('lastParentPane', lastParentPane);

				lastIndex = Array.prototype.indexOf.call(lastParentPane.children, pane);
				setStateValue('lastIndex', lastIndex);

				// create placeholder element and insert it in original pane's position
				placeholderElement = domUtilsService.cloneNode(pane, 1);
				setStateValue('placeholderElement', placeholderElement);
				lastParentPane.insertBefore(placeholderElement, lastParentPane.children[lastIndex]);

				// move original pane to upper position to make it fullscreen
				pane.classList.add('fullscreen-mode');
				contentPanel.appendChild(pane);
			}

			contentPanel.classList.toggle('fullscreen');
			setStateValue('fullscreen', !getStateValue('fullscreen'));

			if (_.isFunction(ctrl.onClick)) {
				info = {fullscreen: getStateValue('fullscreen')};
				ctrl.onClick()($event, info);
			}

			setButtonTitle();
		};
		setButtonTitle();
	}

	var fullsizeButtonConfig = {
		bindings: {
			onClick: '&',
			onBeforeResize: '&?',
			fullsizeStates: '=?'
		},
		template: '<button data-ng-click="$ctrl.click($event)" title="{{ $ctrl.title }}" data-ng-class="$ctrl.fullsizeStates.fullscreen ? \'ico-minimized2 highlight\' : \'ico-maximized2\'" class="tlb-icons"></button>',
		controller: platformFullsizeButtonController
	};

	angular.module('platform').component('platformFullsizeButton', fullsizeButtonConfig);
	platformFullsizeButtonController.$inject = ['platformDomUtilsService', '$translate', 'cloudDesktopHotKeyService'];

})(window.angular, _);
