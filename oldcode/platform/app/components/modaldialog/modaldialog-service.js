/**
 * Created by alisch on 09.09.2014.
 *
 * !! IMPORTANT
 * THIS FILE IS OBSOLETE. USE THE dialog-service.js!
 */
(function () {
	'use strict';

	function dialogService($modal, platformTranslateService, $translate, errorDialogService, $templateCache, $injector, platformDialogService, $log) {
		var service = {};

		// standard modaldialog options
		var defaultModalOptions = {
			// Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click.
			backdrop: 'static',
			// Closes the modal when escape key is pressed
			keyboard: true,
			// the min width from dialog window
			minWidth: 'min',
			// the max width from the dialog window
			maxWidth: 'max',
			// the max height from the dialog window
			maxHeight: 'max',
			// indicates whether the dialog can be resized
			resizeable: false,
			// URL to the template for the outer frame of the dialog. (window)
			windowTemplateUrl: globals.appBaseUrl + 'app/components/modaldialog/window-template.html',
			// URL to the template for the dialog content (header and footer)
			templateUrl: 'modaldialog/modaldialog-template.html',
			// URL to the template for the body area of the dialog content (body)
			bodyTemplateUrl: 'modaldialog/modaldialog-body-template.html',
			// URL to the template for the footer of the dialog
			footerTemplateUrl: 'modaldialog/modaldialog-footer-template.html',
			// URL to the template for the header of the dialog
			headerTemplateUrl: 'modaldialog/modaldialog-header-template.html',
			// a class for the dialog window element, most used to identify the dialog
			windowClass: ''
		};

		/**
		 * @ngdoc function
		 * @name cleanSizeValues
		 * @methodOf platform.platformModalService
		 * @description replace the word 'max' by the specified value
		 * @param {( object )} tempModalOptions The option object for the modal dialog
		 */
		var cleanSizeValues = function cleanSizeValues(tempModalOptions) {
			var maxSize = '90%';
			var minWidth = '600px'; // defined on 02082016

			if (tempModalOptions.width === 'max') {
				tempModalOptions.width = maxSize;
			}
			if (tempModalOptions.maxWidth === 'max') {
				tempModalOptions.maxWidth = maxSize;
			}
			if (tempModalOptions.height === 'max') {
				tempModalOptions.height = maxSize;
			}
			if (tempModalOptions.maxHeight === 'max') {
				tempModalOptions.maxHeight = maxSize;
			}
			if (tempModalOptions.minWidth === 'min') {
				tempModalOptions.minWidth = minWidth;
			}
		};

		/**
		 * @ngdoc function
		 * @name getCleanIconClassValue
		 * @methodOf platform.platformModalService
		 * @description replace the icon-string with the correct string for the dialog
		 * @param {( string )} value The string which should be set to the correct icon class string
		 * @returns {result} Returns the cleaned icon class which can be used.
		 */
		var getCleanIconClassValue = function getCleanIconClassValue(value) { // jshint ignore:line
			switch (value) {
				case 'question':
					return 'ico-question';
				case 'asterix':
				case 'info':
				case 'information':
				case 'ico-information':
					return 'ico-info';
				case 'warning':
				case 'exclamation':
					return 'ico-warning';
				case 'error':
				case 'hand':
				case 'stop':
					return 'ico-error';
				default:
					return value;
			}
		};

		// loads or updates translated strings
		var loadTranslations = function loadTranslations() {
			defaultModalOptions.cancelBtnText = $translate.instant('platform.cancelBtn');
			defaultModalOptions.okBtnText = $translate.instant('platform.okBtn');
			defaultModalOptions.yesBtnText = $translate.instant('platform.yesBtn');
			defaultModalOptions.noBtnText = $translate.instant('platform.noBtn');
			defaultModalOptions.ignoreBtnText = $translate.instant('platform.ignoreBtn');
			defaultModalOptions.retryBtnText = $translate.instant('platform.retryBtn');
		};

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		/**
		 * @ngdoc function
		 * @name showMsgBox
		 * @methodOf platform.platformModalService
		 * @description An standard Messagebox like c# messagebox. It displays a text, a title, a OK-button and optionally an dialog icon.
		 * @param {( string )} bodyTextKey The key sets a translated text in bodyText. This text will be displayed in the message box.
		 * @param {( string )} headerTextKey  The key sets a translated text in headerText. This text will be displayed in the header of the message box.
		 * @param {( string )} iconClass  One of the Icon values that specifies which icon to display in the message box. Allowed values: warning, question, info, error.
		 * @returns {result} returns the result of the dialog.
		 */
		service.showMsgBox = function showMsgBox(bodyTextKey, headerTextKey, iconClass) {
			var msgBoxOptions = {};
			msgBoxOptions.bodyTextKey = bodyTextKey;
			msgBoxOptions.headerTextKey = headerTextKey;
			msgBoxOptions.iconClass = iconClass;
			msgBoxOptions.windowClass = 'msgbox';

			return this.showDialog(msgBoxOptions);
		};

		/**
		 * @ngdoc function
		 * @name showErrorBox
		 * @methodOf platform.platformModalService
		 * @description Just showing an error with header and content text
		 * @param {( string )} bodyTextKey The key sets a translated text in bodyText. This text will be displayed in the message box.
		 * @param {( string )} titleTextKey  The key sets a translated text in headerText. This text will be displayed in the header of the message box.
		 * @returns {result} returns the result of the dialog.
		 */
		service.showErrorBox = function showError(bodyTextKey, titleTextKey) {
			return this.showMsgBox(bodyTextKey, titleTextKey, 'error');
		};

		/**
		 * @ngdoc function
		 * @name showYesNoDialog
		 * @methodOf platform.platformModalService
		 * @description Just showing an dialog with header and content text and Yes/No Buttons. The question icon is predefined.
		 * @param {string} titleTextKey
		 * @param {string} bodyTextKey
		 * @param {string} defaultButton the default button when enter is pressed. Input here 'yes' or 'no'.
		 * @returns {result} returns the result of the dialog {yes: true} or {no: true}.
		 */
		service.showYesNoDialog = function showYesNoDialog(bodyTextKey, titleTextKey, defaultButton) {
			var options = {
				headerTextKey: titleTextKey,
				bodyTextKey: bodyTextKey,
				showYesButton: true,
				showNoButton: true,
				defaultButton: defaultButton || 'yes',
				iconClass: 'ico-question'
			};

			return show(options);
		};

		/**
		 * @ngdoc function
		 * @name showErrorDialog
		 * @methodOf platform.platformModalService
		 * @description An extended dialog to display an exception to user
		 * @param {(object)} exception the thrown error.
		 * @returns {result} returns the result of the dialog
		 */
		service.showErrorDialog = function showErrorDialog(exception) {
			var customOptions = {
				templateUrl: globals.appBaseUrl + 'app/components/modaldialog/error-dialog-template.html',
				width: '800px',
				height: '500px',
				resizeable: true,
				headerTextKey: 'cloud.common.errorMessage',
				windowClass: 'error-dialog'
			};
			errorDialogService.addException(exception);

			return this.showDialog(customOptions);
		};

		/**
		 * @ngdoc function
		 * @name showInputDialog
		 * @methodOf platform.platformModalService
		 * @description An standard dialog to get any input from the user.
		 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
		 * @returns {result} Returns the result of the dialog.
		 */
		service.showInputDialog = function showInputDialog(customModalOptions) {
			return platformDialogService.showInputDialog(customModalOptions);
		};

		/**
		 * @ngdoc function
		 * @name showSaveProfileAsDialog
		 * @methodOf platform.platformModalService
		 * @description
		 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
		 * @returns {result} Returns the result of the dialog.
		 */
		service.showSaveProfileAsDialog = function showSaveProfileAsDialog(customModalOptions) {
			// define template
			customModalOptions.templateUrl = globals.appBaseUrl + 'app/components/modaldialog/save-profile-as-template.html';
			customModalOptions.windowClass = 'input-box';

			customModalOptions.areaItems = [];
			customModalOptions.areaItems.push({id: 1, description: 'User'});
			if (customModalOptions.areaSystem) {
				customModalOptions.areaItems.push({id: 2, description: 'System'});
			}

			if (!customModalOptions.hasOwnProperty('result')) {
				customModalOptions.result = {};
			}

			if (!customModalOptions.result.hasOwnProperty('textProfileName')) {
				customModalOptions.result.textProfileName = '';
			}

			if (!customModalOptions.result.hasOwnProperty('selectedArea') || Object.keys(customModalOptions.result.selectedArea).length === 0) {
				customModalOptions.result.selectedArea = customModalOptions.areaItems[0];
			}

			return show(customModalOptions);
		};

		/**
		 * @ngdoc function
		 * @name showDialog
		 * @methodOf platform.platformModalService
		 * @description An standard dialog to display a message to user. Comparable with .net MessageBox.
		 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
		 * @returns {result} returns the result of the dialog.
		 */
		service.showDialog = function showDialog(customModalOptions) {

			// if no Button is configured visible, then make ok button visible
			if (!customModalOptions.showCancelButton && !customModalOptions.showRetryButton && !customModalOptions.showIgnoreButton && !customModalOptions.showYesButton && !customModalOptions.showNoButton) {
				customModalOptions.showOkButton = true;
			}

			// set default button (button will be clicked when enter is pressed)
			if (customModalOptions.showOkButton && !customModalOptions.defaultButton) {
				customModalOptions.defaultButton = 'ok';
			}

			return show(customModalOptions);
		};

		function getIsDisabledFn(button) {
			return function IsDisabled() {
				if (angular.isUndefined(button)) {
					return undefined;
				}
				return angular.isFunction(button.disabled) ? button.disabled(button) : button.disabled;
			};
		}

		function getFnWrapperFn(button) {
			return function ($event, closeFn) {
				if (button.fn) { // call only if there is a function declared
					button.fn.apply(this, [button, $event, closeFn]);
				}

				if (button.autoClose === true) {
					closeFn('autoclose fired');
				}
			};
		}

		function getCustomButtonsTemplate(buttons) {
			var buttonsTemplate = '';

			angular.forEach(buttons, function (button, index) {

				button.fnWrapper = getFnWrapperFn(button);
				button.isDisabled = getIsDisabledFn(button);

				var buttonPath = 'modalOptions.customButtons[' + index + ']';
				var buttonTemplate = '<button class="btn' + (button.cssClass ? ' ' + button.cssClass : '') + '" data-ng-class="modalOptions.defaultButton === \'' + button.id + '\' ? \'btn-return\' : \'btn-default\'" data-ng-click="' + buttonPath + '.fnWrapper($event, $close)" data-ng-disabled="' + buttonPath + '.isDisabled()">{{::' + buttonPath + '.caption | translate}}</button>';
				buttonsTemplate += buttonTemplate;
			});

			return buttonsTemplate;
		}

		/**
		 * @ngdoc function
		 * @name show
		 * @methodOf platform.platformModalService
		 * @description shows a dialog to user
		 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
		 * @returns {result} Returns the result of the dialog.
		 */
		function show(customModalOptions) {
			// $log.warn('This platformModalService is obsolete. Please use platformDialogService instead. See http://rib-s-wiki01.rib-software.com/cloud/wiki/1290/dialog-service');

			// translate header and body text, if translation key is set
			if (customModalOptions.headerTextKey) {
				customModalOptions.headerText = $translate.instant(customModalOptions.headerTextKey);
			}
			if (customModalOptions.bodyTextKey) {
				customModalOptions.bodyText = $translate.instant(customModalOptions.bodyTextKey);
			}

			// If no template, set css class for message box.
			if (!customModalOptions.templateUrl && !customModalOptions.template && !customModalOptions.bodyTemplateUrl && !customModalOptions.footerTemplateUrl) {
				customModalOptions.windowClass = 'msgbox';
			}

			// modify default templates only when no custom dialog template is set
			if (!customModalOptions.templateUrl && !customModalOptions.template) {
				// default template is used, set templates
				var templateSuffix = '-final';

				// modify footer template, when no custom footer template is set
				if (!customModalOptions.footerTemplateUrl) {
					var footerTemplate = $templateCache.get(defaultModalOptions.footerTemplateUrl).replace('%%customButtons%%', getCustomButtonsTemplate(customModalOptions.customButtons));
					$templateCache.put(defaultModalOptions.footerTemplateUrl + templateSuffix, footerTemplate);
					customModalOptions.footerTemplateUrl = defaultModalOptions.footerTemplateUrl + templateSuffix;
				}
			}

			// Map user defined options to standard dialog options
			var tempModalOptions = {};
			angular.extend(tempModalOptions, defaultModalOptions, customModalOptions);

			// replace special strings with correct values
			cleanSizeValues(tempModalOptions);
			tempModalOptions.iconClass = getCleanIconClassValue(tempModalOptions.iconClass);

			if (!tempModalOptions.controller) {
				tempModalOptions.controller = ['$scope', function controller($scope) {

					$scope.modalOptions = tempModalOptions;

					var click = function click(button, result) {
						var customResult = result || {};

						switch (button) {
							case 'ok':
								if (_.isObject($scope.modalOptions.value)) {
									customResult.value = $scope.modalOptions.value;
								}
								if (!_.isObject(customResult) && _.isString(customResult)) {
									var obj = {};
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
						var platformGridAPI = $injector.get('platformGridAPI');
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

						var disableButton = getButtonPropertyValue(button, 'disable');

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

						var showButton = getButtonPropertyValue(button, 'show');

						return angular.isFunction(showButton) ? showButton($scope.modalOptions, $scope) : showButton;
					};

					/**
					 * @ngdoc function
					 * @name onReturnButtonPress
					 * @methodOf platform.platformModalService.controller
					 * @description click event for the default button, when 'enter' key is pressed.
					 */
					$scope.modalOptions.onReturnButtonPress = function onReturnButtonPress() {
						var button = $scope.modalOptions.defaultButton;
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
					var getButtonPropertyValue = function getButtonPropertyValue(buttonName, propertyName) {
						return $scope.modalOptions[propertyName + _.capitalize(buttonName) + 'Button'];
					};
				}];
			}

			var modalInstance = $modal.open(tempModalOptions);
			return modalInstance.result;
		}

		loadTranslations();
		return service;
	}

	function loadTemplateFile($templateCache) {

		$templateCache.loadTemplateFile('app/components/modaldialog/modaldialog-templates.html').then(function () {

		});
	}

	loadTemplateFile.$inject = ['$templateCache'];
	dialogService.$inject = ['$modal', 'platformTranslateService', '$translate', 'errorDialogService', '$templateCache', '$injector', 'platformDialogService', '$log'];

	/**
	 * @ngdoc service
	 * @name platform.platformModalService
	 * @function
	 * @description Service for some standard modal dialogs
	 */
	angular.module('platform').service('platformModalService', dialogService)
		.run(loadTemplateFile);
})();
