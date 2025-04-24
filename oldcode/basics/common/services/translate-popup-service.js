/**
 * Created by spr on 2016-09-06.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonTranslatePopupService
	 * @description
	 * This service is used to open/close translation popup.
	 * Currently called from {@link basicsCommonTranslateCell}
	 * Popup's controller is {@link basicsCommonTranslatePopupController}
	 */
	angular.module(moduleName).factory('basicsCommonTranslatePopupService', [
		'basicsLookupdataPopupService', 'globals',
		function (basicsLookupdataPopupService, globals) {

			const service = {};

			service.openPopup = openPopup;

			service.closePopup = closePopup;

			const popupHelper = basicsLookupdataPopupService.getToggleHelper();
			return service;

			/**
			 * @ngdoc function
			 * @name openPopup
			 * @function
			 * @methodOf basicsCommonTranslatePopupService
			 * @description Open translation popup on passed element
			 * @param {element} e Element to be associated with popup
			 * @param {scope} scope Scope to associated with popup. Scope of popup will become child scope.
			 * @returns {object} popup object created through popupHelper
			 */
			function openPopup(e, scope) {

				const popupOptions = {
					templateUrl: globals.appBaseUrl + '/basics.common/templates/translation/translate-popup.html',
					showLastSize: true,
					controller: 'basicsCommonTranslatePopupController',
					focusedElement: angular.element(e),
					relatedTarget: angular.element(e),
					scope: scope.$new(),
					formatter: service.displayFormatter // return custom input content
				};
				// toggle popup
				return popupHelper.show(popupOptions);
			}

			/**
			 * @ngdoc function
			 * @name closePopup
			 * @function
			 * @methodOf basicsCommonTranslatePopupService
			 * @description
			 * Close currently opened translation popup
			 */
			function closePopup() {
				popupHelper.hide();
			}
		}
	]);
})(angular);