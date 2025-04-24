/**
 * Created by wed on 9/18/2017.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	/**
	 * @ngdoc service
	 * @name basicsCommonLoadingService
	 * @function
	 *
	 * @description
	 * Service to control loading.
	 **/
	angular.module(moduleName).factory('basicsCommonLoadingService', [function () {

		let container = null;
		let attachCss = false;

		function initialize() {
			container = angular.element('<div class="wait-overlay" style="display:none;"></div>');
			const box = angular.element('<div class="box"></div>').appendTo(container);
			box.append('<div class="spinner-lg"></div>');
			box.append('<span></span>');
			container.appendTo('#appContainer');
		}

		function buildContent(options) {
			const opt = options || {};
			if (!container) {
				initialize();
			}
			if (opt.cssClass) {
				let cssClass = opt.cssClass;
				if (attachCss) {
					container.removeClass();
					cssClass = 'wait-overlay ' + opt.cssClass;
				}
				container.addClass(cssClass);
				attachCss = true;
			} else {
				attachCss = false;
			}
			if (opt.info) {
				container.find('span').show().text(opt.info);
			} else {
				container.find('span').hide();
			}
		}

		/**
		 * @ngdoc function
		 * @name show
		 * @function
		 * @methodOf basicsCommonLoadingService
		 * @description Function to show loading overlay in body.
		 * @param {object} options Indicates the loading information.
		 * e.g.
		 *    options : {
		 *      cssClass:'myClass',
		 *      info:'Please wait.'
		 *    }
		 */
		function show(options) {
			buildContent(options);
			return container.show();
		}

		function hide() {
			if (container) {
				container.hide();
			}
		}

		function setInfo(info) {
			if (container) {
				container.find('span').show().text(info);
			}
		}

		return {
			show: show,
			setInfo: setInfo,
			hide: hide
		};
	}]);
})(angular);
