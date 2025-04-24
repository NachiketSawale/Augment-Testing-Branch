/**
 * Created by alisch on 27.07.2018.
 */
(function () {
	'use strict';

	function dialogService($modal, defaultButtonIds, platformTranslateService, dialogUserSettingService, errorDialogService, $templateCache, $injector, platformWatchListService, $timeout, platformCreateUuid, $log, _, $q, $rootScope) {
		let service = {
			showMsgBox: showMsgBox,
			showDetailMsgBox: showDetailMsgBox,
			showYesNoDialog: showYesNoDialog,
			showErrorBox: showErrorBox,
			showErrorDialog: showErrorDialog,
			showInputDialog: showInputDialog,
			showInfoBox: showInfoBox,
			showSaveProfileAsDialog: showSaveProfileAsDialog,
			showDialog: show,
			isElementInDialog: isElementInDialog,
			assets: {
				buttons: {
					getCopyToClipboard: createCopyToClipboardButton,
					getShowDetails: createShowDetailsButton
				}
			}
		};

		const dialogConsts = {
			showDetailsId: 'showDetails'
		};

		const detailsTypes = {
			grid: 'grid',
			longtext: 'longtext',
			template: 'template'
		};

		// standard modaldialog options
		const defaultModalOptions = {
			// Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click.
			backdrop: 'static',
			// Closes the modal when escape key is pressed
			keyboard: true,
			// the min width from dialog window
			minWidth: 'min',
			// the max width from the dialog window
			maxWidth: 'max',
			// the min height from the dialog window
			minHeight: 'min',
			// the max height from the dialog window
			maxHeight: 'max',
			// indicates whether the dialog can be resized
			resizeable: false,
			// URL to the template for the outer frame of the dialog. (window)
			windowTemplateUrl: globals.appBaseUrl + 'app/components/modaldialog/dialog-window-template.html',
			// URL to the template for the dialog content (header and footer)
			templateUrl: 'dialog/modaldialog-template.html',
			// URL to the template for the body area of the dialog content (body)
			bodyTemplateUrl: 'dialog/modaldialog-body-template.html',
			// The template for the body area of the dialog content (body). If both "bodyTemplateUrl" and "bodyTemplate" is set, bodyTemplate wins.
			bodyTemplate: undefined,
			// URL to the template for the footer of the dialog
			footerTemplateUrl: 'dialog/modaldialog-footer-template.html',
			// URL to the template for the header of the dialog
			headerTemplateUrl: 'dialog/modaldialog-header-template.html',
			// a class for the dialog window element, most used to identify the dialog
			windowClass: '',
			// the X Button in the default header to close the dialog (same as the cancel button in the footer)
			showCloseButton: true,
			//indicates whether the dialog can be Minimize/Maximize
			showMinimizeMaximizeButton: false,
			// checkbox to allow the user to set the option to not show the dialog again (Option “Don’t show this message again”)
			dontShowAgain: {showOption: false, defaultActionButtonId: defaultButtonIds.ok},
			// default result to return
			defaultButtonId: defaultButtonIds.ok,
			// the id of the dialog
			id: '',
			// parameter for Error- / Message- / YesNo - / Info - Dialogs
			isMessageBox: false
		};

		const defaultButtons = [{
			id: defaultButtonIds.ok,
			caption$tr$: 'platform.okBtn'
		}, {
			id: defaultButtonIds.yes,
			caption$tr$: 'platform.yesBtn'
		}, {
			id: defaultButtonIds.no,
			caption$tr$: 'platform.noBtn'
		}, {
			id: defaultButtonIds.ignore,
			caption$tr$: 'platform.ignoreBtn'
		}, {
			id: defaultButtonIds.cancel,
			caption$tr$: 'platform.cancelBtn'
		}, {
			id: defaultButtonIds.retry,
			caption$tr$: 'platform.retryBtn'
		}, {
			id: defaultButtonIds.delete,
			caption$tr$: 'platform.deleteBtn'
		}, {
			id: defaultButtonIds.save,
			caption$tr$: 'platform.saveBtn'
		}];

		let currentStep = null;

		let maxSize = '90%';
		let minWidth = '600px';
		let minHeight = '400px';
		let messageBoxParamters = {
			minWidth: '300px',
			maxWidth: '500px'
		};

		//START - Focus Trap

		function trapFocus(e, modalClass) {
			const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

			/**
			 * If a key other than tab is pressed, ignore.
			 */
			if (!isTabPressed) {
				return;
			}

			/**
			 * Get the targeted modal.
			 */
			const elements = document.getElementsByClassName(modalClass);

			if(elements.length === 0) {
				return;
			}

			const modal = elements[0];

			/**
			 * Set what type of elements should be able to receive focus.
			 */
			const focusableElements = 'input, button, .formatted-filter-input';

			/**
			 * Get all focusable elements in the modal.
			 */
			const focusableContent = modal.querySelectorAll(focusableElements);

			let currentTabIndex = 0;

			for (const element of focusableContent) {
				if (document.activeElement === element) {
					if (e.shiftKey) {
						currentTabIndex -= 1;
						if (currentTabIndex <= 0) {
							currentTabIndex = focusableContent.length -1;
						}
					}
					else {
						currentTabIndex += 1;
						if (currentTabIndex === focusableContent.length) {
							currentTabIndex = 1;
						}
					}
					break;
				}
				currentTabIndex += 1;
			}

			while (focusableContent[currentTabIndex] && (focusableContent[currentTabIndex].clientHeight === 0 || focusableContent[currentTabIndex].disabled)) {
				e.shiftKey ? currentTabIndex -= 1 : currentTabIndex += 1;
			}

			if (currentTabIndex <= 0) {
				currentTabIndex = focusableContent.length -1;
			} else if (currentTabIndex === focusableContent.length) {
				currentTabIndex = 1;
			}

			focusableContent[currentTabIndex].focus();
			e.preventDefault();
		}

		function initTrapFocus(e) {
			return trapFocus(e, 'modal-dialog');
		}

		//END

		function getDefaultMinWidth(modalOptions) {
			return modalOptions.isMessageBox ? messageBoxParamters.minWidth : minWidth;
		}

		function getDefaultMaxWidth(modalOptions) {
			return modalOptions.isMessageBox ? messageBoxParamters.maxWidth : maxSize;
		}

		/**
		 * @ngdoc function
		 * @name cleanSizeValues
		 * @methodOf platform.platformDialogService
		 * @description replace the word 'max' by the specified value
		 * @param {( object )} modalOptions The option object for the modal dialog
		 */
		let cleanSizeValues = function cleanSizeValues(modalOptions) {
			if (modalOptions.width === 'max') {
				modalOptions.width = maxSize;
			}
			if (modalOptions.maxWidth === 'max') {
				modalOptions.maxWidth = getDefaultMaxWidth(modalOptions);
			}
			if (modalOptions.height === 'max') {
				modalOptions.height = maxSize;
			}
			if (modalOptions.maxHeight === 'max') {
				modalOptions.maxHeight = maxSize;
			}
			if (modalOptions.minWidth === 'min') {
				modalOptions.minWidth = getDefaultMinWidth(modalOptions);
			}
			if (modalOptions.minHeight === 'min') {
				modalOptions.minHeight = minHeight;
			}
		};

		/**
		 * @ngdoc function
		 * @name getCleanIconClassValue
		 * @methodOf platform.platformDialogService
		 * @description replace the icon-string with the correct string for the dialog
		 * @param {( string )} value The string which should be set to the correct icon class string
		 * @returns {result} Returns the cleaned icon class which can be used.
		 */

		let getCleanIconClassValue = function (options) {
			//new icons is in controls-icons. before was in tlb-icons. Therefore add ome new case-parameters.
			switch (options.iconClass) {
				case 'question':
				case 'ico-question':
				case 'asterix':
				case 'info':
				case 'ico-info':
				case 'information':
				case 'ico-information':
					options.iconClass =  'control-icons ico-alert-info';
					options.windowClass += ' question';
					break;
				case 'warning':
				case 'exclamation':
				case 'ico-warning':
					options.iconClass =  'control-icons ico-alert-warning';
					options.windowClass += ' warning';
					break;
				case 'ico-error':
				case 'error':
				case 'hand':
				case 'stop':
					options.iconClass =  'control-icons ico-alert-error';
					options.windowClass += ' error';
					break;
				case 'success':
					options.iconClass = 'control-icons ico-alert-success';
					options.windowClass += ' success';
					break;
			}
		};

		function createCopyToClipboardButton(dataToCopy, config) {
			let defaultOptions = {
				id: 'copyToClipboard',
				caption$tr$: 'cloud.common.copyToClipboardText',
				show: function (info) {
					return (info.scope.dialog.details.show && !_.isUndefined(navigator) && !_.isUndefined(navigator.clipboard));
				},
				fn: function ($event, info) {
					let retrieveDataPromise = $q.when(_.isFunction(dataToCopy) ? dataToCopy(info) : dataToCopy);

					let processSuccess = (_.isObject(config) && _.isFunction(config.processSuccess)) ? config.processSuccess : function () {
					};

					retrieveDataPromise.then((data) => {
						return navigator.clipboard.writeText(data).then(function () {
							processSuccess(info, 'cloud.common.copyToClipboardSucess', true);
							info.scope.$digest();
						}, () => {
							processSuccess(info, 'cloud.common.copyToClipboardFailed', false);
							info.scope.$digest();
						});
					});
				}
			};

			if(config.iconSVG) {
				defaultOptions.showSVGTag = true;
				defaultOptions.svgSprite = 'control-icons';
				defaultOptions.svgImage = 'ico-clipboard';
			}

			return _.assign(defaultOptions, _.isObject(config) ? config : {});
		}

		function createShowDetailsButton(config) {
			return _.assign({
				id: dialogConsts.showDetailsId,
				caption$tr$: 'cloud.common.showDetails',
				iconClass: 'minus-sign plus',
				show: function (info) {
					return _.has(info, 'scope.dialog.details');
				},
				fn: ($event, info) => {
					if (_.has(info, 'scope.dialog.details')) {
						info.scope.dialog.details.show = !info.scope.dialog.details.show;
						info.button.caption = info.scope.dialog.details.texts[+info.scope.dialog.details.show];
						info.button.iconClass = info.scope.dialog.details.icons[+info.scope.dialog.details.show];

						const element = angular.element($event.target.closest('.modal-content'));
						const copyToClipboard = _.find(info.scope.dialog.customButtons, {id: 'copyToClipboard'});
						const downloadClipboard = _.find(info.scope.dialog.customButtons, {id: 'downloadClipboard'});

						if (info.scope.dialog.details.show) {
							copyToClipboard.cssClass = 'show';
							downloadClipboard.cssClass = 'show';
							// details are shown
							if (_.has(info, 'scope.dialog.sizes.expandedWidth')) {
								element.width(_.get(info, 'scope.dialog.sizes.expandedWidth'));
								element.height(_.get(info, 'scope.dialog.sizes.expandedHeight'));
							} else {
								// there are no existing sizes for the expanded dialog.

								// set width
								let detailWidth = _.parseInt(_.get(info, 'modalOptions.details.offsetX'));
								if (!_.isNaN(detailWidth)) {
									element.width(element.width() + detailWidth);
								}

								// set height
								let detailHeight = _.parseInt(_.get(info, 'modalOptions.details.offsetY'));
								if (!_.isNaN(detailHeight)) {
									element.height(element.height() + detailHeight);
								} else {
									if (_.get(info, 'scope.dialog.details.type') === detailsTypes.grid) {
										element.height(element.height() + 300);
									}
								}
							}
							element.addClass('expanded');
						} else {
							// details are collapsed
							copyToClipboard.cssClass = 'hide';
							downloadClipboard.cssClass = 'hide';

							// save expanded size values
							_.set(info, 'scope.dialog.sizes.expandedWidth', element[0].clientWidth);
							_.set(info, 'scope.dialog.sizes.expandedHeight', element[0].clientHeight);

							element.removeClass('expanded');

							element.width('');
							element.height('');
						}
					}
				}
			}, _.isObject(config) ? config : {});
		}

		function createDownloadButton(config) {
			return _.assign({
				id: 'downloadClipboard',
				caption$tr$: 'cloud.common.DownloadErrorFile',
				showSVGTag: true,
				svgSprite: 'control-icons',
				svgImage: 'ico-download',
				show: function (info) {
					return info.scope.dialog.details.show;
				},
				fn: ($event, info) => {
					let processSuccess = (_.isObject(config) && _.isFunction(config.processSuccess)) ? config.processSuccess : function () {
					};
					if (_.has(info, 'scope.dialog.details')) {
						if (info.modalOptions.dataItem.exception) {
							const platformFileDownloadService = $injector.get('platformFileDownloadService');
							platformFileDownloadService.downloadFile(info.modalOptions.dataItem.exception, 'error.json', 'text/json');
							processSuccess(info, 'cloud.common.DownloadClipboardSucess', true);
						}
					}
				}
			}, _.isObject(config) ? config : {});
		}

		/**
		 * @ngdoc function
		 * @name showMsgBox
		 * @methodOf platform.platformDialogService
		 * @description An standard Messagebox like c# messagebox. It displays a text, a title, an OK-button and optionally a dialog icon.
		 * @param {( string )} bodyText$tr$ The key sets a translated text in bodyText. This text will be displayed in the message box.
		 * @param {( string )} headerText$tr$   The key sets a translated text in headerText. This text will be displayed in the header of the message box.
		 * @param {( string )} iconClass  One of the Icon values that specifies which icon to display in the message box. Allowed values: warning, question, info, error.
		 * @param {( string )} dialogId The Id for the dialog, required to save the dialog user settings, e.g. position, size and if set the dontShowAgain.showOption.
		 * @param {( boolean | object )} dontShowAgain if true, displays the checkbox option to prevent future display of this dialog. It is also possible to handle an option object.
		 * @returns {promise} returns the result of the dialog.
		 */
		function showMsgBox(bodyText$tr$, headerText$tr$, iconClass, dialogId, dontShowAgain) {
			let msgBoxOptions = {};
			msgBoxOptions.id = dialogId;
			msgBoxOptions.bodyText$tr$ = bodyText$tr$;
			msgBoxOptions.bodyText = bodyText$tr$;
			msgBoxOptions.headerText$tr$ = headerText$tr$;
			msgBoxOptions.headerText = headerText$tr$;
			msgBoxOptions.iconClass = iconClass;
			msgBoxOptions.windowClass = 'msgbox';
			msgBoxOptions.bodyMarginLarge = true;
			msgBoxOptions.dontShowAgain = dontShowAgain;
			msgBoxOptions.isMessageBox = true;

			return show(msgBoxOptions);
		}

		/**
		 * @ngdoc function
		 * @name showInfoBox
		 * @methodOf platform.platformDialogService
		 * @description An standard dialog for information messages. It displays a text, a title, an OK-button and an information icon.
		 * @param {( string )} bodyText$tr$ The key sets a translated text in bodyText. This text will be displayed in the message box.
		 * @param {( string )} customId Custom Id for dialog, required if dontShowAgain.showOption is set to true. This is for the saving and restoring of the deactivate option.
		 * @param {( boolean | object )} dontShowAgain.showOption  if true, show the checkbox option to deactivate future display of this dialog.It is also possible to handle an option object.
		 * @returns {result} returns the result of the dialog.
		 */
		function showInfoBox(bodyText$tr$, customId, dontShowAgain) {
			const options = {
				id: customId,
				headerText$tr$: 'cloud.common.infoBoxHeader',
				bodyText: bodyText$tr$,
				bodyText$tr$: bodyText$tr$,
				showOkButton: true,
				iconClass: 'info',
				dontShowAgain: dontShowAgain,
				isMessageBox: true
			};

			return show(options);
		}

		/**
		 * @ngdoc function
		 * @name showErrorBox
		 * @methodOf platform.platformModalService
		 * @description Just showing an error with header and content text
		 * @param {( string )} bodyText$tr$ The key sets a translated text in bodyText. This text will be displayed in the message box.
		 * @param {( string )} titleText$tr$  The key sets a translated text in headerText. This text will be displayed in the header of the message box.
		 * @returns {result} returns the result of the dialog.
		 */
		function showErrorBox(bodyText$tr$, titleText$tr$) {
			return showMsgBox(bodyText$tr$, titleText$tr$, 'error');
		}

		/**
		 * @ngdoc function
		 * @name showYesNoDialog
		 * @methodOf platform.platformDialogService
		 * @description Just showing an dialog with header and content text and Yes/No Buttons. The question icon is predefined.
		 * @param {string} titleText$tr$
		 * @param {string} bodyTextKey$tr$
		 * @param {string} defaultButtonId the default button when enter is pressed. Input here 'yes' or 'no'.
		 * @param {string} customId Custom Id for dialog, required if dontShowAgain.showOption is set to true. This is for the saving and restoring of the deactivate option.
		 * @param {boolean} showDontShowAgain  if true, show the checkbox option to deactivate future display of this dialog.
		 * @param {object} customConfig Custom config object with further dialog settings.
		 * @returns {result} returns the result of the dialog.
		 */
		function showYesNoDialog(bodyTextKey$tr$, titleText$tr$, defaultButtonId, customId, showDontShowAgain, customConfig) {
			const options = {
				id: customId,
				headerText$tr$: titleText$tr$,
				headerText: titleText$tr$,
				bodyText$tr$: bodyTextKey$tr$,
				bodyText: bodyTextKey$tr$,
				showYesButton: true,
				showNoButton: true,
				showCancelButton: _.get(customConfig, 'showCancelButton', false),
				defaultButtonId: defaultButtonId || defaultButtonIds.yes,
				iconClass: 'question',
				dontShowAgain: {showOption: showDontShowAgain, defaultActionButtonId: defaultButtonIds.yes},
				isMessageBox: true
			};

			return show(options);
		}

		/**
		 * @ngdoc function
		 * @name showErrorDialog
		 * @methodOf platform.platformDialogService
		 * @description An extended dialog to display an exception to user
		 * @param {(object)} exception the thrown error.
		 * @returns {result} returns the result of the dialog
		 */
		function showErrorDialog(exception) {
			errorDialogService.addException(exception);

			let ex = errorDialogService.getLastException(true);

			let customOptions = {
				bodyTemplateUrl: 'dialog/detail-msgbox-template.html',
				windowClass: 'error-dialog',
				bodyFlexColumn: true,
				bodyMarginLarge: true,
				resizeable: true,
				headerText$tr$: 'cloud.common.errorDialogTitle',
				bodyText: ex.errorCodeMessage(),
				iconClass: 'error',
				dataItem: {
					exception: ex
				},
				details: {
					type: detailsTypes.template,
					templateUrl: globals.appBaseUrl + 'app/components/modaldialog/error-dialog-template.html',
					cssClass: 'longtext'
				},
				buttons: [{
					id: defaultButtonIds.ok
				}],
				customButtons: [createShowDetailsButton({
					show: (info) => {
						let exception = _.get(info, 'modalOptions.dataItem.exception');
						if (exception) {
							return (exception.detailMessage || exception.errorDetail || exception.detailMethod || exception.detailStackTrace);
						}

						return false;
					}
				}), createCopyToClipboardButton(function (info) {
					return JSON.stringify(info.modalOptions.dataItem.exception);
				}, {
					tooltip$tr$: 'cloud.common.copyToClipboardTooltip',
					processSuccess: (info, msgKey) => {
						let fn = _.get(info, 'scope.dialog.setAlarm');
						if (_.isFunction(fn)) {
							fn(msgKey);
						}
					},
					iconSVG: true
				}), createDownloadButton({
					processSuccess: (info, msgKey) => {
						let fn = _.get(info, 'scope.dialog.setAlarm');
						if (_.isFunction(fn)) {
							fn(msgKey);
						}
					}
				})],
				isMessageBox: true
			};

			return showWithDetails(customOptions);
		}

		/**
		 * @ngdoc function
		 * @name showDetailMsgBox
		 * @methodOf platform.platformDialogService
		 * @description An extended dialog to display an exception to user
		 * @param {(object)} customOptions The dialogs options.
		 * @returns {result} returns the result of the dialog
		 */
		function showDetailMsgBox(customOptions) {
			if (_.isUndefined(customOptions)) {
				$log.error('Dialog was not configured correctly. Modal options are undefined.');
				return;
			}

			let defaultOptions = {
				iconClass: 'info',
				width: '600px',
				isMessageBox: true
			};

			let forcedOptions = {
				bodyTemplateUrl: 'dialog/detail-msgbox-template.html',
				windowClass: 'detail-msgbox',
				resizeable: true,
				bodyFlexColumn: true,
				bodyMarginLarge: true,
			};

			return showWithDetails(_.assign({}, defaultOptions, customOptions, forcedOptions));
		}

		/**
		 * @ngdoc function
		 * @name showInputDialog
		 * @methodOf platform.platformDialogService
		 * @description An standard dialog to get any input from the user.
		 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
		 * @returns {result} Returns the value of the input field.
		 */
		function showInputDialog(customModalOptions) {
			// define customOptions (that overwrites standard options)
			customModalOptions.bodyTemplateUrl = globals.appBaseUrl + 'app/components/modaldialog/inputdialog-template.html';
			customModalOptions.windowClass = 'input-box';
			customModalOptions.bodyFlexColumn = true;
			customModalOptions.buttons = [{
				id: defaultButtonIds.ok
			}, {
				id: defaultButtonIds.cancel
			}];

			// customModalOptions.maxLength = 524288; // html5 standard value
			if (!Object.prototype.hasOwnProperty.call(customModalOptions, 'type')) {
				customModalOptions.type = 'text';
			}

			if (!Object.prototype.hasOwnProperty.call(customModalOptions, 'textInput')) {
				customModalOptions.textInput = '';
			}

			return show(customModalOptions);
		}

		/**
		 * @ngdoc function
		 * @name showSaveProfileAsDialog
		 * @methodOf platform.platformModalService
		 * @description
		 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
		 * @returns {result} Returns the result of the dialog.
		 */
		function showSaveProfileAsDialog(customModalOptions) {
			// define template
			customModalOptions.bodyTemplateUrl = 'dialog/save-profile-as-template.html';
			customModalOptions.windowClass = 'saveProfileAs';

			customModalOptions.areaItems = [{id: 1, description: 'User'}];

			if (customModalOptions.areaSystem) {
				customModalOptions.areaItems.push({id: 2, description: 'System'});
			}

			if (!Object.prototype.hasOwnProperty.call(customModalOptions, 'value')) {
				customModalOptions.value = {};
			}

			if (!Object.prototype.hasOwnProperty.call(customModalOptions, 'selectedArea') || Object.keys(customModalOptions.value.selectedArea).length === 0) {
				customModalOptions.value.selectedArea = customModalOptions.areaItems[0];
			}

			customModalOptions.buttons = [{
				id: defaultButtonIds.save,
				disabled: function (info) {
					// form validation
					if (info.value) {
						return (info.value.textProfileName === '' || angular.isUndefined(info.value.textProfileName) || angular.isUndefined(info.value.selectedArea));
					}

					return true;
				}
			}, {
				id: defaultButtonIds.cancel
			}];

			customModalOptions.defaultButtonId = 'save';

			return show(customModalOptions).then(result => {
				result.value.textProfileName = getSaveString(result.value.textProfileName);
				return result;
			});
		}

		function getSaveString(text) {
			return _.escape(text);
		}

		function extendDialogButton(target, source) {
			// only these property values of the source will be copied to the target
			 const props = ['show', 'disabled'];
			_.forEach(props, (prop) => {
				if (source.hasOwnProperty(prop)) {
					target[prop] = source[prop];
				}
			});

			return target;
		}

		function translateObject(options) {
			// Remove following line after a few months of conversion
			transformToNewTranslationProperties(options);

			// translating the whole config object
			platformTranslateService.translateObject(options, undefined, {recursive: false});
			platformTranslateService.translateObject(options.topDescription, undefined, {recursive: true});
			platformTranslateService.translateObject(options.bottomDescription, undefined, {recursive: true});
		}

		function transformToNewTranslationProperties(modalOptions) {
			// translate header and body text, if translation key is set
			if (modalOptions.headerTextKey) {
				$log.warn('headerTextKey is obsolete. Please use headerText$tr$.');
				modalOptions.headerText$tr$ = modalOptions.headerTextKey;
			}
			if (modalOptions.bodyTextKey) {
				$log.warn('bodyTextKey is obsolete. Please use bodyText$tr$.');
				modalOptions.bodyText$tr$ = modalOptions.bodyTextKey;
			}
		}

		function getCustomButtonCaption(texts, showDetail, icons) {
			let toReturn = {};
			if (showDetail) {
				toReturn = {
					caption$tr$: '',
					caption: texts[+showDetail],
					iconClass: icons[+showDetail]
				};
			}

			return toReturn;
		}

		function showWithDetails(customOptions) {
			let dialogProperties = {
				details: {
					show: _.get(customOptions, 'details.show', false),
					texts: [platformTranslateService.instant('cloud.common.showDetails', undefined, true), platformTranslateService.instant('cloud.common.hideDetails', undefined, true)],
					type: _.get(customOptions, 'details.type'),
					icons: ['minus-sign plus', 'minus-sign']
				}
			};

			if (_.findIndex(customOptions.customButtons, {id: dialogConsts.showDetailsId}) < 0 &&
				_.findIndex(customOptions.buttons, {id: dialogConsts.showDetailsId}) < 0) {
				if (!customOptions.customButtons) {
					customOptions.customButtons = [];
				}

				customOptions.customButtons.unshift(createShowDetailsButton(getCustomButtonCaption(dialogProperties.details.texts, customOptions.details.show, dialogProperties.details.icons)));
			}

			return show(customOptions, dialogProperties);
		}

		function cleanUpOptions(customModalOptions) {
			// Map user defined options to standard dialog options
			let finalOptions = _.extend({}, defaultModalOptions, getFilteredOptions(customModalOptions));

			// If no template, set css class for message box.
			if (!customModalOptions.templateUrl && !customModalOptions.template && !customModalOptions.bodyTemplateUrl && !customModalOptions.bodyTemplate && !customModalOptions.footerTemplateUrl) {
				finalOptions.isMessageBox = true;
				finalOptions.bodyMarginLarge = true;
			}

			if(customModalOptions.isMessageBox || finalOptions.isMessageBox) {
				finalOptions.windowClass += ' message-dialog';
			}

			// translating the object
			translateObject(finalOptions);

			// replace special strings with correct values
			cleanSizeValues(finalOptions);

			getCleanIconClassValue(finalOptions);

			if (_.isBoolean(finalOptions.dontShowAgain)) {
				// with this convertation it is possible to set only a boolean
				finalOptions.dontShowAgain = _.assign({}, defaultModalOptions.dontShowAgain, {showOption: finalOptions.dontShowAgain});
			}

			return finalOptions;
		}

		/**
		 * @ngdoc function
		 * @name show
		 * @methodOf platform.platformDialogService
		 * @description shows a dialog to user
		 * @param {(object)} customModalOptions The options for the modal dialog. See http://rib-s-wiki01.rib-software.com/cloud/wiki/32/ui-dialog for more information.
		 * @param {object} dialogProperties Properties that are written to the scope.dialog object and overwrite possible existing properties. This object is used by the dialog at runtime.
		 * @returns {result} Returns the result of the dialog.
		 */
		function show(customModalOptions, dialogProperties) {
			if (_.isUndefined(customModalOptions)) {
				$log.error('Dialog was not configured correctly. Modal options are undefined.');
				return;
			}

			let finalModalOptions = cleanUpOptions(customModalOptions);

			function dialogSettings(info) {
				if (info.previousStep && info.previousStep.stepSettingsId) {
					dialogUserSettingService.saveDialogSettings(customModalOptions, null, info.previousStep.stepSettingsId);
					currentStep = info.step;
				}
				if (info.step.stepSettingsId) {
					dialogUserSettingService.applyDialogSettings(finalModalOptions, info.step);
				}
			}

			if (customModalOptions.value && customModalOptions.value.wizard) {
				if (angular.isFunction(customModalOptions.value.wizard.onChangeStep)) {
					customModalOptions.value.wizard.onChangeStep = [customModalOptions.value.wizard.onChangeStep];
					customModalOptions.value.wizard.onChangeStep.push(dialogSettings);
				} else if (angular.isArray(customModalOptions.value.wizard.onChangeStep)) {
					customModalOptions.value.wizard.onChangeStep.push(dialogSettings);
				} else {
					customModalOptions.value.wizard.onChangeStep = dialogSettings;
				}
			}

			function saveSettings() {
				if (customModalOptions.id) {
					if (_.get(finalModalOptions, 'dontShowAgain.showOption') && finalModalOptions.dontShowAgain.activated) {
						dialogUserSettingService.deactivateDialog(customModalOptions.id);
					}
					if (currentStep) {
						dialogUserSettingService.saveDialogSettings(customModalOptions, null, currentStep.id);
						currentStep = null;
					} else {
						dialogUserSettingService.saveDialogSettings(customModalOptions);
					}
				}
			}

			if (_.get(finalModalOptions, 'dontShowAgain.showOption') && !customModalOptions.id) {
				$log.error('If dontShowAgain.showOption is enabled, a custom id has to be provided.');
				return;
			}

			if (!finalModalOptions.controller) {
				finalModalOptions.controller = ['$scope', function controller($scope) {

					function checkBtnAsActiveElem(activeElement) {
						return activeElement.tagName === 'BUTTON' && activeElement.id && activeElement.id !== '';
					}

					$scope.dialog = {
						id: customModalOptions.id ? customModalOptions.id : platformCreateUuid(), // generate unique id for this dialog
						modalOptions: finalModalOptions,
						dontShowAgain: {
							label: platformTranslateService.instant('cloud.desktop.dialogDeactivate', undefined, true)
						},
						getButtonById: getButtonById,
						buttons: getDialogButtons(finalModalOptions),
						customButtons: getCustomDialogButtons(finalModalOptions),
						setAlarm: setAlarm,
						alarm: _.get(finalModalOptions, 'dataItem.alarm'),
						click: (button, $event, customResult) => {

							let info = getButtonInfo($scope.dialog.modalOptions, button);

							if (angular.isDefined(customResult)) {
								info.result = customResult;
							}

							if (_.isFunction(button.fn)) { // call only if there is a function declared
								button.fn.apply(this, [$event, info]);
							} else {
								// perform default defined click
								performDefaultClick(button, $event, info);
							}

							if (button.autoClose === true) {
								info.$close('autoclose fired');
							}
						},
						/**
						 * @ngdoc function
						 * @name isDisabled
						 * @methodOf platform.platformDialogService.controller
						 * @description checks whether the button is disabled.
						 * @param {( string )} button The name of the button
						 * @returns { bool } A value that indicates whether the button is disabled
						 */
						isDisabled: function isDisabled(button) {
							if (angular.isUndefined(button)) {
								return undefined;
							}

							const info = getButtonInfo($scope.dialog.modalOptions, button);
							return angular.isFunction(button.disabled) ? button.disabled(info) : button.disabled;
						},
						/**
						 * @ngdoc function
						 * @name getTooltip
						 * @methodOf platform.platformDialogService.controller
						 * @description Gets the tooltip of the button
						 * @param {( string )} button The id of the button
						 * @returns { string } The tooltip of the button
						 */
						getTooltip: function getTooltip(button) {
							if (angular.isUndefined(button)) {
								return undefined;
							}

							const info = getButtonInfo($scope.dialog.modalOptions, button);
							return angular.isFunction(button.tooltip) ? button.tooltip(info) : button.tooltip;
						},
						/**
						 * @ngdoc function
						 * @name isShown
						 * @methodOf platform.platformDialogService.controller
						 * @description Checks whether the button is shown
						 * @param {( string )} button The id of the button
						 * @returns { bool } A value that indicates whether the button is shown
						 */
						isShown: function isShown(button) {
							if (angular.isUndefined(button)) {
								return undefined;
							}

							if (angular.isDefined(button.show)) {
								if (angular.isFunction(button.show)) {
									let info = getButtonInfo($scope.dialog.modalOptions, button);
									return button.show(info);
								} else {
									return button.show;
								}
							} else {
								return true;
							}
						},
						/**
						 * @ngdoc function
						 * @name isExecutable
						 * @methodOf platform.platformDialogService.controller
						 * @description Checks whether the button is executable
						 * @param {( string )} button The id of the button
						 * @returns { bool } A value that indicates whether the button is executable
						 */
						isExecutable: function isExecutable(button) {
							return $scope.dialog.isShown(button) && !$scope.dialog.isDisabled(button);
						},
						/**
						 * @ngdoc function
						 * @name onReturnButtonPress
						 * @methodOf platform.platformDialogService.controller
						 * @description click event for the default button, when 'enter' key is pressed.
						 */
						onReturnButtonPress: function onReturnButtonPress() {
							const activeElement = document.activeElement;
							// Check if the focused element is an input (text, radio, or checkbox), textarea
							if(activeElement.tagName === 'INPUT' || activeElement.type === 'text' || activeElement.type === 'radio' || activeElement.type === 'checkbox' ||
									activeElement.tagName === 'TEXTAREA') {
									return;
							}

							let activeBtn = checkBtnAsActiveElem(activeElement);
							let btnId = activeBtn ? activeElement.id : $scope.dialog.modalOptions.defaultButtonId;
							let button = getButtonById(btnId);

							if (button && $scope.dialog.isExecutable(button)) {
								$scope.dialog.click(button);
							}
						},
						cancel: function cancel(event) {
							$scope.dialog.click({id: defaultButtonIds.cancel}, event);
						},
						isMaximized: true
					};

					function setAlarm(msgKey) {
						_.set($scope, 'dialog.alarm.text', msgKey);
					}

					// set custom dialog properties. This is used e.g. in the detail msgbox dialog
					if (!_.isUndefined(dialogProperties)) {
						_.assign($scope.dialog, dialogProperties);
					}

					if (_.has($scope, 'dialog.modalOptions.watches')) {
						platformWatchListService.createWatches($scope.dialog.modalOptions.watches, $scope, '', function (infoObj) {
							infoObj.dialog = $scope.dialog;
							infoObj.$close = $scope.$close;
							infoObj.value = $scope.dialog.modalOptions.value;
						});
					}

					function performDefaultClick(button, event, info) {
						let result;

						switch (button.id) {
							case defaultButtonIds.ok:
							case defaultButtonIds.yes:
							case defaultButtonIds.retry:
							case defaultButtonIds.no:
							case defaultButtonIds.ignore:
							case defaultButtonIds.delete:
							case defaultButtonIds.save:
								commitAllGridEdits();
								commitAllFormEdits(info);
								result = getResultValue(info, button.id);
								$scope.$close(result);
								break;
							case defaultButtonIds.cancel:
								$scope.$dismiss(button.id);
								break;
							default:
								$scope.$dismiss('undefined');
								break;
						}
					}

					function getButtonPropertyValue(buttonName, propertyName) {
						return finalModalOptions[propertyName + _.capitalize(buttonName) + 'Button'];
					}

					function getCustomDialogButtons(modalDialogOptions) {
						const buttons = [];

						function pushButton(button) {
							platformTranslateService.translateObject(button, undefined, {recursive: false});
							buttons.push(button);
						}

						_.forEach(modalDialogOptions.customButtons, function (customButton) {
							pushButton(customButton);
						});

						return buttons;
					}

					function getButtonInfo(options, btn) {
						const info = getStandardInfo(options);

						if (angular.isDefined(btn) && angular.isObject(btn)) {
							info.button = btn;
							info.$close = $scope.$close;
						}

						info.dialog.commitAllFormEdits = commitAllFormEdits;
						info.dialog.commitAllGridEdits = () => commitAllGridEdits(info);

						return info;
					}

					function getStandardInfo(options) {
						return {
							modalOptions: options,
							value: _.get(options, 'value'),
							scope: $scope,
							dialog: {
								getButtonById: _.get($scope, 'dialog.getButtonById'),
								setAlarm: _.get($scope, 'dialog.setAlarm'),
								getTooltip: _.get($scope, 'dialog.getTooltip')
							}
						};
					}

					$scope.dialog.getStandardInfo = getStandardInfo;

					function getDefaultButtonId(buttons) {
						return buttons.length === 1 ? buttons[0].id : defaultButtonIds.ok;
					}

					function getDialogButtons(modalDialogOptions) {
						const result = [];

						function pushButton(button) {
							platformTranslateService.translateObject(button, undefined, {recursive: false});
							result.push(button);
						}

						function getButtonById(array, id) {
							return _.find(array, function (btn) {
								return btn.id === id;
							});
						}

						// insert user defined buttons
						_.forEach(modalDialogOptions.buttons, function (btn) {
							if (!getButtonById(defaultButtons, btn.id)) {
								pushButton(btn);
							}
						});

						// insert default buttons
						_.forEach(_.cloneDeep(defaultButtons), function (defBtn) {
							const userButton = getButtonById(modalDialogOptions.buttons, defBtn.id);

							if (userButton) {
								// extend defaultButton with some properties from userButton
								extendDialogButton(defBtn, userButton);
								pushButton(defBtn);
							} else if (angular.isDefined(getButtonPropertyValue(defBtn.id, 'show'))) {

								const info = getStandardInfo(finalModalOptions);
								const btnShow = getButtonPropertyValue(defBtn.id, 'show');
								const btnShowValue = angular.isFunction(btnShow) ? btnShow(info) : btnShow;

								if (btnShowValue) {
									pushButton(defBtn);
								}
							}
						});

						// if no Button is configured visible, then make ok button visible
						if (result.length === 0) {
							const btn = _.find(defaultButtons, function (btn) {
								return btn.id === defaultButtonIds.ok;
							});

							pushButton(btn);
						}

						// set default button (button will be clicked when enter is pressed)
						if (!modalDialogOptions.defaultButtonId) {
							modalDialogOptions.defaultButtonId = getDefaultButtonId(result);
						}

						return result;
					}

					function getResultValue(info, buttonId) {
						let result = (info && info.result) || {};

						if (!_.isObject(result) && _.isString(result)) {
							const obj = {};
							obj[result] = true;
							result = obj;
						}

						if (!_.isUndefined($scope.dialog.modalOptions.value)) {
							result.value = $scope.dialog.modalOptions.value;
						}

						if (!_.isUndefined(buttonId)) {
							result[buttonId] = true;
						}

						return result;
					}

					function commitAllFormEdits(info) {
						let anyButton = document.querySelector(`[id="${info.scope.dialog.id}"] button`);
						if (anyButton) {
							anyButton.focus(); // workaround for issue that on blur is not triggered
							if (info && info.scope) {
								$timeout(function () {
									info.scope.$applyAsync();
								});
							}
						}
					}

					function commitAllGridEdits() {
						const platformGridAPI = $injector.get('platformGridAPI');
						platformGridAPI.grids.commitAllEdits();
					}

					function getButtonById(id) {
						let button = _.find($scope.dialog.buttons, function (btn) {
							return btn.id === id;
						});

						if (!button) {
							button = _.find($scope.dialog.customButtons, function (btn) {
								return btn.id === id;
							});
						}

						return button;
					}
				}];
			}

			let showDialog = true;
			if (_.get(finalModalOptions, 'dontShowAgain.showOption') && customModalOptions.id) {
				showDialog = !dialogUserSettingService.isDialogDeactivated(customModalOptions.id);
			}

			if (showDialog) {
				if (customModalOptions.id) {
					if (customModalOptions.value && customModalOptions.value.wizard) {
						dialogUserSettingService.setModalOptions(finalModalOptions, customModalOptions.value.wizard.steps[0]);
					} else {
						dialogUserSettingService.setModalOptions(finalModalOptions);
					}
				}

				const modalInstance = $modal.open(finalModalOptions);
				modalInstance.dialogId = customModalOptions.id;

				modalInstance.result.then(function (result) {
					if (result.stepStatus) {
						switch (result.stepStatus) {
							case 'next':
							case 'previous':
								saveSettings();
								break;
							default:
								break;
						}
					} else if (result.isOk || result) {
						saveSettings();
					} else {
						if ([defaultButtonIds.ok, defaultButtonIds.yes, defaultButtonIds.retry, defaultButtonIds.delete, defaultButtonIds.save].some(value => Object.keys(result).includes(value))) {
							saveSettings();
						}
					}
				}, function (data) {
					if (data === 'escape key press') {
						$rootScope.$emit('modelDialog.escPress', {cancel: true});
					}
				});

				modalInstance.opened.then(function () {
					const existCondition = setInterval(function () {
						//set focus on modal-content-container. (DEV-29099)
						const modalContent = document.getElementsByClassName('modal-content');
						if (modalContent.length) {
							modalContent[0].focus();
						}
						const modalDialogList = document.getElementsByClassName('modal-dialog');
						if (modalDialogList.length) {
							clearInterval(existCondition);
							modalDialogList[0].addEventListener('keydown', initTrapFocus);

							if (finalModalOptions.id) {
								modalDialogList[modalDialogList.length - 1].classList.add(finalModalOptions.id);
								if (finalModalOptions.left) {
									modalDialogList[modalDialogList.length - 1].style.margin = 0;
								}
							}
						}
					}, 100);

				});
				return modalInstance.result;
			} else {
				return Promise.resolve({[_.get(finalModalOptions, 'dontShowAgain.defaultActionButtonId')]: true});
			}
		}

		function isElementInDialog(elem) {
			return (elem && elem.closest('.modal-content').length > 0) ? true : false;
		}

		function getFilteredOptions(customObject) {
			/*
			There a few ways to defined backdrop-value. UX-Team decided on a fix value,
			so that all dialogs get the same background.
			 */
			return _.omit(customObject, 'backdrop');
		}

		// loadTranslations();
		return service;
	}

	function loadTemplateFile($templateCache) {
		$templateCache.loadTemplateFile('app/components/modaldialog/dialog-templates.html');
	}

	loadTemplateFile.$inject = ['$templateCache'];
	dialogService.$inject = ['$modal', 'platformDialogDefaultButtonIds', 'platformTranslateService', 'dialogUserSettingService', 'errorDialogService', '$templateCache', '$injector', 'platformWatchListService', '$timeout', 'platformCreateUuid', '$log', '_', '$q', '$rootScope'];

	/**
	 * @ngdoc service
	 * @name platform.platformDialogService
	 * @function
	 * @description Service for some standard modal dialogs
	 */
	angular.module('platform').service('platformDialogService', dialogService)
		.run(loadTemplateFile);

	angular.module('platform').constant('platformDialogDefaultButtonIds', {
		ok: 'ok',
		yes: 'yes',
		no: 'no',
		ignore: 'ignore',
		cancel: 'cancel',
		retry: 'retry',
		delete: 'delete',
		save: 'save'
	});
})();
