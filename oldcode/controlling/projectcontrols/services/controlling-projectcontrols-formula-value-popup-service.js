(function (angular) {
	'use strict';

	const moduleName = 'controlling.projectcontrols';

	/**
	 * @ngdoc service
	 * @name controllingProjectcontrolsFormulaValuePopupService
	 */
	angular.module(moduleName).factory('controllingProjectcontrolsFormulaValuePopupService', [
		'basicsLookupdataPopupService', 'globals',
		function (basicsLookupdataPopupService, globals) {

			const service = {};

			service.openPopup = openPopup;

			service.closePopup = closePopup;

			service.displayFormatter = function(a,b,c,d){
				console.log(a);
			};

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
					templateUrl: globals.appBaseUrl + '/controlling.projectcontrols/templates/dashboard/controlling-projectcontrols-formula-value-popup.html',
					showLastSize: true,
					controller: 'controllingProjectcontrolsFormulaValuePopupController',
					focusedElement: angular.element(e),
					relatedTarget: angular.element(e),
					scope: scope.$new(),
					width: 300,
					height: 280,
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