(function (angular) {
	'use strict';

	handler.$inject = ['_', 'keyCodes', 'platformDialogService', 'platformGridDialogService', 'platformLogonService', '$http', 'platformContextService', 'platformCustomTranslateService', '$q'];

	function handler(_, keyCodes, dialogService, platformGridDialogService, platformLogonService, $http, platformContextService, platformCustomTranslateService, $q) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: true,
			link: function (scope, elem, attrs, ctrl) { // jshint ignore:line
				var btnDelete = elem.find('.ico-input-delete2');
				var btnDialog = elem.find('.ico-translation');
				var options, languageKey, listener, listenerId, currentControlValue;

				// to initiate the control
				init();

				/**
				 gets the translation string and sets it to the control value
				 */
				function loadLanguageData(languageKey, withFeedback) {
					return platformCustomTranslateService.getTranslation(languageKey).then(function (result) {
						setControlValue(result.data, withFeedback);
					});
				}

				/**
				 saves the translated string in the current ui language
				 */
				function saveLanguageData(value) {
					return platformCustomTranslateService.saveTranslation(languageKey, value && _.isString(value) ? value : scope.value);
				}

				function sendChangedFeedback() {
					var feedback = {
						translationKey: languageKey,
						language: platformContextService.getLanguage(),
						newValue: scope.value,
						oldValue: currentControlValue // To allow oldValue in feedback
					};

					// $rootScope.$broadcast('platformCustomTranslateChangeEvent',  eventArgs);
					if (_.isFunction(options.onTranslationChanged)) {
						options.onTranslationChanged(feedback);
					}
				}

				function sendInitiatedFeedback() {
					var feedback = {
						translationKey: languageKey,
						language: platformContextService.getLanguage(),
						value: scope.value
					};

					// $rootScope.$broadcast('platformCustomTranslateChangeEvent',  eventArgs);
					if (_.isFunction(options.onInitiated)) {
						options.onInitiated(feedback);
					}
				}

				/**
				 initial function for this control. Should be executed if the options has been changed.
				 */
				function init() {
					options = getOptions();
					languageKey = getLanguageKey();
					registerControl();

					// to set the translated string of the specified translation key to control
					loadLanguageData(languageKey, false).then(function () {
						sendInitiatedFeedback();
					});

					setModelValue(languageKey);

					// only to inform the developer with no functionality
					scope.translationKey = languageKey;
					scope.controlOptions = options;
				}

				/**
				 gets the options object of this control
				 */
				function getOptions() {
					var inGrid = !_.isUndefined(attrs.grid);
					var config = inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null) || {};
					return inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null)) || {};
				}

				function registerControl() {
					var funcs = {setValue: funcsSetValue, update: funcsUpdate};
					var info = {funcs: funcs, cacheEnabled: _.isUndefined(options.cacheEnabled) ? true : options.cacheEnabled};
					platformCustomTranslateService.control.register(languageKey, info);
				}

				function funcsSetValue(value) {
					if (scope.value === value) {
						return $q.when();
					}

					return saveLanguageData(value).then(function () {
						setControlValue(value);
					});
				}

				function funcsUpdate() {
					loadLanguageData(languageKey, true);
				}

				function onTranslationChanged() {
					// is fired when textfield in control has been changed
					saveLanguageData().then(function () {
						sendChangedFeedback();
						// To allow oldValue in feedback
						currentControlValue = scope.value;
					});
				}

				/**
				 sets the value to the control
				 */
				function setControlValue(value, withFeedback) {
					if (scope.value === value) {
						return;
					}

					scope.value = value;
					if (_.isUndefined(withFeedback) || withFeedback) {
						sendChangedFeedback();
					}
					currentControlValue = value;
				}

				/**
				 sets the value to the model
				 */
				function setModelValue(value) {
					ctrl.$setViewValue(value);
					ctrl.$commitViewValue();
				}

				/**
				 Creates the language key with the properties of the control options
				 */
				function getLanguageKey() {
					return platformCustomTranslateService.createTranslationKey(options);
				}

				scope.clearLanguage = function () {
					platformCustomTranslateService.deleteTranslationByKey(languageKey).then(function () {
						setControlValue('');
					});
				};

				// to watch the structure option. On changes the control is loaded new
				if (options.watchStructure) {
					listener = scope.$watch(function () {
						var newOptions = getOptions();
						return newOptions.structure;
					}, function (newVal, oldVal) {
						if (newVal !== oldVal && !_.isUndefined(oldVal)) {
							platformCustomTranslateService.control.unregister(languageKey);
							init();
						}
					});
				}

				// to watch the Id option. On changes the control is loaded new
				if (options.watchId) {
					listenerId = scope.$watch(function () {
						var newOptions = getOptions();
						return newOptions.id;
					}, function (newVal, oldVal) {
						if (newVal !== oldVal && !_.isUndefined(oldVal)) {
							platformCustomTranslateService.control.unregister(languageKey);
							init();
						}
					});
				}

				scope.onKeyUp = onKeyUp;
				scope.openDialog = openDialog;
				scope.onTranslationChanged = onTranslationChanged;
				btnDialog.on('keydown', onKeyDown);

				scope.$on('$destroy', function () {
					btnDelete.off();
					btnDialog.off();
					elem.off();
					if (listener) {
						listener();
					}
					if (listenerId) {
						listenerId();
					}

					platformCustomTranslateService.control.unregister(languageKey);
				});

				function onKeyDown(event) {
					// This method handles keydown events in the control
					switch (event.keyCode) {
						case keyCodes.SPACE:
							var myBtn = angular.element(event.target);
							myBtn.toggleClass('active');
							event.preventDefault();
							event.stopPropagation();
							break;
					}
				}

				function onKeyUp(event) {
					// This method handles keyup events in the control for controlling visibility of and selection within the popup.
					switch (event.keyCode) {
						case keyCodes.SPACE:
							var myBtn = angular.element(event.target);
							event.preventDefault();
							event.stopPropagation();
							openDialog().then(function () {
								myBtn.toggleClass('active');
							}, function () {
								myBtn.toggleClass('active');
							});
							break;
					}
				}

				// function getUiLanguageItems() {
				// 	return platformLogonService.getUiLanguages();
				// }

				function getEditor(domain) {
					switch (domain) {
						// supported input domains
						case 'description':
						case 'comment':
						case 'remark':
							return domain;
						default:
							return 'description';
					}
				}

				// ToDo: deleteButton ist immer aktiviert, obwohl es keine Daten gibt.

				/**
				 * @ngdoc function
				 * @name openDialog
				 * @function
				 * @methodOf platformCustomtranslateHandler
				 * @description Opens the translation dialog of this item.
				 */
				function openDialog() {
					return platformCustomTranslateService.openTranslationDialog(languageKey, getEditor(options.inputDomain)).then(function(response){
						btnDialog.focus();
						if (response.ok) {
							// convert array in object
							var trans = {};
							_.each(response.value, function (item) {
								trans[item.culture] = item.description;
							});

							return platformCustomTranslateService.saveTranslations(languageKey, trans).then(function () {
								setControlValue(trans[platformContextService.getLanguage()]);
							});
						}
					}, function () {
						btnDialog.focus();
					});
					//var languages = getUiLanguageItems();
				}
			}
		};
	}

	angular.module('platform').directive('platformCustomtranslateHandler', handler);

})(angular);