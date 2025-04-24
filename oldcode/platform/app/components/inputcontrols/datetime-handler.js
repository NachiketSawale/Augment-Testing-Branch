(function (angular) {
	'use strict';

	var popupOptions = null;

	angular.module('platform').directive('platformDatetimeHandler', handler);

	handler.$inject = ['moment', '_', 'platformDomainService', '$translate', 'keyCodes', 'basicsLookupdataPopupService'];

	function handler(moment, _, platformDomainService, $translate, keyCodes, basicsLookupdataPopupService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs, ctrl) {
				var inGrid = !_.isUndefined(attrs.grid);
				var config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
				var options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};
				var domainData = {
					datatype: 'date',
					format: 'L'
				};
				var unregister = [];

				if (attrs.domain) {
					domainData = platformDomainService.loadDomain(attrs.domain);
				}

				var utcMode = domainData.datatype.indexOf('utc') !== -1;
				var timeMode = domainData.datatype.indexOf('time') !== -1;
				var popupMode = (inGrid || !options.disablePopup);
				var datePickerOptions = initializeOptions(attrs, domainData, options, config, timeMode);

				// different setups if popup mode or not
				if (popupMode) {
					var group = elem.next('.input-group-btn');
					var button = group.children().first();

					elem.on('keydown', keyDown);
					elem.on('blur', function () {
						closePopup();
					});

					button.on('click', openPopup);
					button.on('keydown', keyDown);
					button.on('blur', function () {
						closePopup();
					});

					unregister.push(function () {
						button.off();
						elem.off();
					});

					unregister.push(scope.$on('$destroy', function () {
						closePopup();

						_.over(unregister)();
						unregister = null;
					}));
				} else {
					initializePicker(elem, datePickerOptions);
				}

				// general datepicker (both)
				// labels for datepicker
				datePickerOptions.tooltips = {
					minutes: $translate.instant('platform.minutes'),
					hours: $translate.instant('platform.hours'),
					today: $translate.instant('platform.todayTooltip'),
					clear: $translate.instant('platform.removeTooltip')
				};

				if (inGrid) {
					// provide ngmodel controller on scope
					scope.ngModelCtrl = ctrl;
				}

				/**
				 * @ngdoc function
				 * @name intializePicker
				 * @function
				 * @methodOf platformSelectHandler
				 * @description initializes the dateTimePicker
				 * @returns null
				 */
				function initializePicker(selectedElem, pickerOptions) {
					selectedElem.datetimepicker(pickerOptions);

					var picker = selectedElem.data('DateTimePicker');

					if (ctrl.$modelValue) {
						picker.date(ctrl.$modelValue);
					}

					unregister.push(scope.$watch(attrs.ngModel, function (newValue, oldValue) {
						if (picker) {
							// for getter/setter
							if (_.isFunction(newValue)) {
								newValue = newValue();
								oldValue = oldValue();
							}
							if (newValue !== null && moment.isMoment(newValue)) {
								picker.date(utcMode ? newValue.utc() : newValue);
							} else if (!newValue && !picker.date()) {
								picker.clear(null);
							}
						}
					}));

					picker.locale(moment.locale());

					if (!popupMode) { // this should only be done if not in popup mode
						var widget = selectedElem.children();
						widget.on('click', '.active', function () {
							var currentDate = picker.date();
							var viewValue = (utcMode ? moment.utc(currentDate) : currentDate).format(domainData.format);
							ctrl.$setViewValue(''); // set value to empty and recommit it
							ctrl.$setViewValue(viewValue);
						});
					}

					selectedElem.on('dp.change', function (e) {
						if (e.date === false) {
							if (ctrl.$viewValue !== null) {
								ctrl.$setViewValue(null);
								ctrl.$render();
								ctrl.$commitViewValue();
							}
						} else {
							var viewValue = (utcMode ? e.date.utc(true) : e.date).format(domainData.format);

							if (viewValue !== ctrl.$viewValue) {
								ctrl.$setViewValue(viewValue);
								ctrl.$render();
								ctrl.$commitViewValue();
							}
						}

						if (!timeMode && popupMode) {
							closePopup(); // this should only be done if in popup mode
						}
					});
				}

				/**
				 * @ngdoc function
				 * @name keyDown
				 * @function
				 * @methodOf platformSelectHandler
				 * @description KeyDown EventHandler For InputField.
				 * @returns null
				 */
				function keyDown(ev) {
					switch (ev.keyCode) {
						case keyCodes.SPACE:
							if (ev.metaKey || ev.ctrlKey) {
								event.preventDefault();
								event.stopPropagation();
								openPopup();
							}
							break;

						case keyCodes.ESCAPE:
							if (closePopup()) {
								event.preventDefault();
								event.stopPropagation();
							}
							break;

						case keyCodes.TAB:
						case keyCodes.ENTER:
						case keyCodes.UP:
						case keyCodes.DOWN:
							if(ctrl.$$lastCommittedViewValue !== ctrl.$viewValue) {
								ctrl.$commitViewValue();
							}
							break;
					}
				}

				/**
				 * @ngdoc function
				 * @name closePopup
				 * @function
				 * @methodOf platformSelectHandler
				 * @description Hides the popup.
				 * @returns A truthy value if the operation was successful, otherwise (for instance, because the
				 *          dropdown is not being displayed) a falsy value.
				 */
				function closePopup() {
					var open = popupOptions && popupOptions.instance;

					if (open) {
						group.removeClass('open');
						popupOptions.instance.close();

						elem.focus();
					}

					return open;
				}

				/**
				 * @ngdoc function
				 * @name openPopup
				 * @function
				 * @methodOf platformSelectHandler
				 * @description Toggles the visibility of the dropdown list.
				 * @returns boolean Always returns `false`.
				 */
				function openPopup() {
					button.focus();

					if (!closePopup()) {
						popupOptions = {
							scope: inGrid ? scope : scope.$new(),
							options: datePickerOptions,
							focusedElement: elem.parent(),
							relatedTarget: elem.parent(),
							hasDefaultWidth: false,
							template: '<div class="picker"></div>',
							plainMode: true,
							// picker: null,
							pickerElem: null
						};

						popupOptions.scope.options = datePickerOptions;

						group.addClass('open');
						popupOptions.instance = basicsLookupdataPopupService.showPopup(popupOptions);

						popupOptions.instance.opened
							.then(function () {
								popupOptions.pickerElem = arguments[0].element.children().children();

								// only intialize
								initializePicker(popupOptions.pickerElem, datePickerOptions);

								arguments[0].element.width(popupOptions.pickerElem.width());
								arguments[0].element.height(popupOptions.pickerElem.height());
							});

						popupOptions.instance.closed
							.then(function () {
								group.removeClass('open');
								if (popupOptions) {
									if (popupOptions.scope && !inGrid) {
										popupOptions.scope.$destroy();
									}

									popupOptions = popupOptions.scope = popupOptions.instance = null;
								}
							});
					}

					return false;
				}
			}
		};

		function initializeOptions(attrs, domainData, options, config, isWithTimeContent) {
			var configuration = {
				format: _.get(attrs, 'format', domainData.format),
				showTodayButton: true,
				showClear: !config.required,
				calendarWeeks: true,
				collapse: true,
				keepInvalid: true,
				showClose: false,
				useCurrent: false,
				sideBySide: true,
				inline: true,
				toolbarPlacement: isWithTimeContent ? 'bottom' : 'default'
			};

			_.merge(configuration, _.pick(options, _.keys(configuration)));

			return configuration;
		}
	}
})(angular);