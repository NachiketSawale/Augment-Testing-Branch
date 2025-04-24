/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainRiskCalculatorWizardController', [
		'$scope', '$injector', 'estimateMainRiskCalculatorWizardService',
		function ($scope, $injector, estimateMainRiskCalculatorWizardService) {

			let defaultOptions = {
				backdrop: 'static',
				bodyTemplateUrl: 'modaldialog/modaldialog-body-template.html',
				cancelBtnText: 'Cancel',
				footerTemplateUrl: 'modaldialog/modaldialog-footer-template.html',
				headerTemplateUrl: 'modaldialog/modaldialog-header-template.html',
				ignoreBtnText: 'Ignore',
				keyboard: true,
				maxHeight: 'max',
				maxWidth: 'max',
				minWidth: 'min',
				noBtnText: 'No',
				okBtnText: 'OK',
				resizeable: false,
				retryBtnText: 'Retry',
				templateUrl: 'modaldialog/modaldialog-template.html',
				windowClass: '',
				windowTemplateUrl: '/cloud/vTrunk/clientn/app/components/modaldialog/window-template.html',
				yesBtnText: 'Yes'
			};

			let customOptions = estimateMainRiskCalculatorWizardService.getWizardConfigObj();
			let tempModalOptions = {};

			angular.extend(tempModalOptions, defaultOptions, customOptions);

			$scope.modalOptions = tempModalOptions;

			let click = function click(button, result) {
				let customResult = result || {};

				switch (button) {
					case 'ok':
						if (_.isObject($scope.modalOptions.value)) {
							customResult.value = $scope.modalOptions.value;
						}
						if (!_.isObject(customResult) && _.isString(customResult)) {
							let obj = {};
							obj[customResult] = true;
							customResult = obj;
						}
						customResult[button] = true;
						$scope.$close(customResult);
						break;
					case 'yes':
					case 'retry':
					case 'no':
					case 'ignore':
						customResult[button] = true;
						$scope.$close(customResult);
						break;
					case 'cancel':
						$scope.$dismiss(button);
						break;
					default:
						$scope.$dismiss('undefined');
						break;
				}
			};

			function commitAllGridEdits() {
				let platformGridAPI = $injector.get('platformGridAPI');
				platformGridAPI.grids.commitAllEdits();
			}

			$scope.modalOptions.ok = function ok(result) {
				commitAllGridEdits();
				click('ok', result);
			};

			$scope.modalOptions.cancel = function cancel(result) {
				click('cancel', result);
			};

			$scope.modalOptions.yes = function yes(result) {
				commitAllGridEdits();
				click('yes', result);
			};

			$scope.modalOptions.retry = function retry(result) {
				commitAllGridEdits();
				click('retry', result);
			};

			$scope.modalOptions.no = function no(result) {
				click('no', result);
			};

			$scope.modalOptions.ignore = function ignore(result) {
				click('ignore', result);
			};

			/**
			 * @ngdoc function
			 * @name isDisabled
			 * @methodOf platform.platformModalService.controller
			 * @description checks whether the button is disabled
			 * @param {( string )} button The name of the button
			 * @returns { bool } A value that indicates whether the button is disabled
			 */
			$scope.modalOptions.isDisabled = function isDisabled(button) {
				if (angular.isUndefined(button)) {
					return undefined;
				}

				let disableButton = getButtonPropertyValue(button, 'disable');

				return angular.isFunction(disableButton) ? disableButton($scope.modalOptions) : disableButton;
			};

			/**
			 * @ngdoc function
			 * @name isShown
			 * @methodOf platform.platformModalService.controller
			 * @description checks whether the button is shown
			 * @param {( string )} button The name of the button
			 * @returns { bool } A value that indicates whether the button is showncustomButtons
			 */
			$scope.modalOptions.isShown = function isShown(button) {
				if (angular.isUndefined(button)) {
					return undefined;
				}

				let showButton = getButtonPropertyValue(button, 'show');

				return angular.isFunction(showButton) ? showButton($scope.modalOptions, $scope) : showButton;
			};

			/**
			 * @ngdoc function
			 * @name onReturnButtonPress
			 * @methodOf platform.platformModalService.controller
			 * @description click event for the default button, when 'enter' key is pressed.
			 */
			$scope.modalOptions.onReturnButtonPress = function onReturnButtonPress() {
				let button = $scope.modalOptions.defaultButton;
				if ($scope.modalOptions.isShown(button) && !$scope.modalOptions.isDisabled(button)) {
					click(button);
				}
			};

			/**
			 * @ngdoc function
			 * @name getButtonPropertyValue
			 * @methodOf platform.platformModalService.controller
			 * @description Gets the value of a property
			 * @param {( string )} buttonName The name of the button, for example 'ok'
			 * @param { string } propertyName The name of the property, for example 'disable'
			 * @returns { return } The value of the property for the specified button
			 */
			let getButtonPropertyValue = function getButtonPropertyValue(buttonName, propertyName) {
				return $scope.modalOptions[propertyName + _.capitalize(buttonName) + 'Button'];
			};

			$scope.$on('$destroy', function () {

			});
		}
	]);
})(angular);
