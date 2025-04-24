(function () {
	'use strict';

	angular.module('platform').factory('tooltipService', tooltipService);
	tooltipService.$inject = ['basicsLookupdataPopupService', '$timeout'];

	function tooltipService(basicsLookupdataPopupService, $timeout) {
		let service = {};
		let instance = null;
		service.closePopup = true;

		function getPopupInstance() {
			return instance;
		}

		function setPopupInstance(value) {
			instance = value;
		}

		service.showPopup = function (customToolTipOptions) {
			// if popup container exists --> then first close
			basicsLookupdataPopupService.hidePopup(0);

			let options = $.extend({}, {
				scope: customToolTipOptions.scope,
				focusedElement: customToolTipOptions.focusElement,
				level: 0,
				multiPopup: false,
				plainMode: true,
				hasDefaultWidth: false,
				template: '<div tooltip-popup-template></div>'
			}, customToolTipOptions);

			if (!_.isNil(getPopupInstance())) {
				setPopupInstance(null);
			}

			let _instance = basicsLookupdataPopupService.toggleLevelPopup(options);
			setPopupInstance(_instance);

			// eslint-disable-next-line no-undef
			if (!(_.isNull(getPopupInstance()) || _.isUndefined(getPopupInstance()))) {
				// eslint-disable-next-line no-mixed-spaces-and-tabs
				getPopupInstance().opened.then(() => {
					$timeout(() => {
						customToolTipOptions.scope.$digest();
					}, 100);
				});

				getPopupInstance().closed.then(() => {
					setPopupInstance(null);
				});
			}
		};

		service.hidePopup = function () {
			if (service.closePopup) {
				basicsLookupdataPopupService.hidePopup(0);
			}
		};

		service.getExistUrls = function (options) {
			if (options && options.hasOwnProperty('urls') && options.urls.length > 0) {
				return true;
			} else {
				return false;
			}
		};

		return service;
	}
})();
