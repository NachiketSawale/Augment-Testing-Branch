/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

// eslint-disable-next-line func-names
(function ($) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformGrid:platformGridDomainService
	 * @function
	 * @requires platformLanguageService, platformDomainService, platformContextService, accounting, moment
	 * @description
	 * platformGridDomainService provides formatter and editor for RIB domain types for platformGrid
	 */
	angular.module('platform').factory('platformGridDomainService', platformGridDomainService);

	platformGridDomainService.$inject = ['platformLanguageService', 'platformDomainService', 'platformContextService', 'platformGridAPI', 'accounting',
		'moment', 'platformObjectHelper', 'platformTranslateService', '$injector', '$interpolate', '$q', 'platformRuntimeDataService',
		'platformModuleInfoService', 'platformModuleNavigationService', 'IBAN', 'math', 'basicsCommonUnitFormatterService', 'globals',
		'_', '$log', 'platformGridLookupDomainFormatterService', 'basicsCommonDrawingUtilitiesService', 'platformUtilService', 'platformDialogService'];

	function platformGridDomainService(platformLanguageService, platformDomainService, platformContextService, platformGridAPI, accounting,
		moment, platformObjectHelper, platformTranslateService, $injector, $interpolate, $q, platformRuntimeDataService,
		infoService, naviservice, IBAN, math, basicsCommonUnitFormatterService, globals,
		_, $log, platformGridLookupDomainFormatterService, drawingUtils, platformUtilService, platformDialogService) { // jshint ignore:line
		var formatters = {};
		var editorMarkups = {};
		var culture = platformContextService.culture();
		var cultureInfo = platformLanguageService.getLanguageInfo(culture);
		var service = {};

		platformContextService.contextChanged.register(function (type) {
			if (type === 'culture') {
				culture = platformContextService.culture();
				cultureInfo = platformLanguageService.getLanguageInfo(culture);
				formatters = {};
				editorMarkups = {};
			}
		});

		function getConditionForNaviBtn(columnDef) {
			return columnDef.navigator && (columnDef.navigator.force || !naviservice.isCurrentState(columnDef.navigator.moduleName)) && naviservice.hasPermissionForModule(columnDef.navigator.moduleName);
		}

		/**
		 * @ngdoc function
		 * @name formatCommonMarkupAdditions
		 * @function
		 * @methodOf platformGridDomainService.formatCommonMarkupAdditions
		 * @description renders navigator buttons, additonal image, required state and error including error-tooltip for given entity (dataContext) and columns (columnDef)
		 * @param dataContext {object} data context (entity)
		 * @param columnDef {object} column definition
		 * @param formatterMarkup {string} markup already rendered by domain formatter
		 * @param disableImageSelector {boolean | undefined} disables imageSelector handling
		 * @returns {string} css
		 */
		function formatCommonMarkupAdditions(dataContext, columnDef, formatterMarkup, disableImageSelector) {
			// add navigator markup
			try {
				if (getConditionForNaviBtn(columnDef)) {
					formatterMarkup = formatterMarkup + getNavigator(columnDef, dataContext);
				}
			} catch (e) {
			}

			// add additional image
			try {
				if (!_.get(columnDef, 'formatterOptions.disableCommonImage', disableImageSelector)) {
					let imgSelector = columnDef.formatterOptions && columnDef.formatterOptions.imageSelector;

					if (_.isString(imgSelector)) {
						imgSelector = $injector.get(imgSelector);
					}

					// selector looks like:
					// {
					//    select: (entity, columnDef) => {
					//          return 'status-icons ico-status01';
					//       }
					//    /* optional */
					//    isCss: () => true,
					//    /* optional */
					//    selectTooltip: (entity, columnDef) => {
					//          return 'sample tooltip';
					//       }
					if (angular.isObject(imgSelector) && _.get(imgSelector, 'isCss', () => true)()) {
						const css = imgSelector.select(dataContext, columnDef);
						const tooltip = _.get(imgSelector, 'selectTooltip', () => '')(dataContext, columnDef);

						if (css && css.length) {
							formatterMarkup = '<i style="float: left" class="block-image slick ' + css + '" title="' + tooltip + '"></i><span class="pane-r" > ' + formatterMarkup + '</span>';
						}
					}
				}
			} catch (e) {
			}

			// add error / required markup
			try {
				const error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];

				if (error) {
					if (error.error$tr$) {
						platformTranslateService.translateObject(error, 'error');
					}

					return '<div class="invalid-cell" title="' + error.error + '">' + formatterMarkup + '</div>';
				} else if (columnDef.required && _.isNil(dataContext[columnDef.field]) && (_.isNil(formatterMarkup) || (_.isString(formatterMarkup) && !formatterMarkup.length))) {
					return '<div class="required-cell">' + formatterMarkup + '</div>';
				}
			} catch (e) {
			}

			return formatterMarkup;
		}

		/**
		 * @jsdoc function
		 * @name formatterValue
		 * @function
		 * @methodOf platformGridDomainService
		 * @description retrieves value to be used by formatter
		 * @param dataContext {object} data context (entity)
		 * @param field {string} default binding
		 * @param options {string|null} formatter options
		 * @param [internalField] {string|null} optional field specified internally (used in translation domain only -> 'Translated'
		 * @param [value] {object} value already retrieved by grid
		 * @returns return {object|string|..} value
		 */
		function formatterValue(dataContext, field, options, internalField, value) {
			if (dataContext) {
				if (options) {
					if (options.field) {
						field = options.field;
					} else {
						if (options.displayMember) {
							field = field + '.' + options.displayMember;
						}
					}
				}
				if (internalField) {
					field = field + '.' + internalField;
				}
				return platformObjectHelper.getValue(dataContext, field);
			} else {
				return value;
			}
		}

		service.navigatorCallFunction = function (options, entity, event) {
			if (options && options.navigator) {
				if (event) {
					// prevent to leave grid editor in opened state
					event.stopPropagation();
				}

				// go-to button in dialogs get the key forceNewTab = true
				if (!options.navigator.forceNewTab) {
					options.navigator.forceNewTab = platformDialogService.isElementInDialog(angular.element(event.target));
				}

				// custom navFunc, where u can impl your own logic
				if (_.isFunction(options.navigator.navFunc)) {
					options.navigator.navFunc(options, entity);
				} else {
					openModule(options, entity);
				}
			}
		};

		function addClickHandler(buttonId, options, entity, callBack, field) {
			// append event handler on the next cycle
			setTimeout(function () {
				let customButton = $('#' + buttonId);
				// only add of button still exists
				if (customButton.length > 0) {
					customButton.on('click', function (event) {
						event.stopPropagation();
						var type = buttonId.split('_')[0];
						switch (type) {
							case'navigator':
								service.navigatorCallFunction(options, entity, event);
								break;

							case 'actionButton':
								var list = entity.actionList || options.actionList;
								if (field && entity[field] && entity[field].actionList) {
									list = entity[field].actionList;
								}
								if (!_.isEmpty(list)) {
									if (_.isFunction(callBack)) {
										platformGridAPI.grids.commitAllEdits();
										callBack(entity, field, options);
									}
								}
								break;
						}
					});
				}
			}, 0);
		}

		service.getConfigObjectNavigator = getConfigObjectNavigator;

		function getConfigObjectNavigator(options, entity) {
			let moduleName = getNavModuleName(options, entity);
			let navOptions = _.assign({}, naviservice.getNavigator(moduleName), _.get(options, 'navigator'));
			let value = _.isObject(entity) ? platformObjectHelper.getValue(entity, options.field) : entity;
			let hide = (entity && _.isFunction(navOptions.hide)) ? navOptions.hide(entity) : false;

			let configObject = {
				moduleName: moduleName,
				value: value,
				navOptions: navOptions,
				hide: hide,
				showNavigator: checkShowNavigator(navOptions, entity, value, hide),
				description: getDescriptionForNavigator(navOptions, entity, moduleName)
			};

			platformTranslateService.translateObject(configObject.navOptions, ['toolTip']);
			return configObject;
		}

		function checkShowNavigator(options, entity, value, hide) {
			let toReturn = true;
			if (!platformObjectHelper.isSet(value) || hide) {
				toReturn = false;
			} else if (_.isString(value) && value.trim().length === 0) {
				toReturn = false;
			} else if (_.isFunction(options.navShowNavigator)) {
				toReturn = options.navShowNavigator(options, entity);
			}
			return toReturn;
		}

		function getNavModuleName(options, entity) {
			let moduleName;
			if (_.isFunction(options.navigator.navModuleName)) {
				moduleName = options.navigator.navModuleName(options, entity);
			}
			return moduleName ? moduleName : options.navigator.moduleName;
		}

		function getDescriptionForNavigator(navOptions, entity, moduleName) {
			var toolTipText = (function retrieveToolTipText() {
				if (_.isFunction(navOptions.toolTip)) {
					return navOptions.toolTip(entity);
				} else if (_.isString(navOptions.toolTip)) {
					return navOptions.toolTip;
				}
				return infoService.getNavigatorTitle(moduleName);
			})();
			return toolTipText;
		}

		function getNavigator(options, entity) {
			let btn = null;
			let configNavigator = getConfigObjectNavigator(options, entity);

			let hide = false;
			if (entity && _.isFunction(configNavigator.navOptions.hide)) {
				hide = configNavigator.navOptions.hide(entity);
			}

			if (!platformObjectHelper.isSet(configNavigator.value) || hide) {
				btn = '';
			}
			if (btn === null) {
				let iconClass = 'ico-goto';
				let naviConf = naviservice.getNavigator(configNavigator.moduleName);

				if (naviConf && naviConf.externalEntityParam) {
					iconClass = 'ico-goto2';
				}

				if (_.isFunction(configNavigator.navOptions.iconClass)) {
					iconClass = configNavigator.navOptions.iconClass(entity).trim();
				} else if (_.isString(configNavigator.navOptions.iconClass)) {
					iconClass = configNavigator.navOptions.iconClass.trim();
				}
				let iconSetClass = iconClass.includes(' ') ? '' : 'tlb-icons';

				let toolTipText = getDescriptionForNavigator(configNavigator.navOptions, entity, configNavigator.moduleName);
				/*
				There are hover-navigator buttons that dont have a goto-function. Or add a grid-column at runtime that has a goto-function.
				This hover-buttons exist at the moment.
				 */
				let dynamicIconClass = options.hasOwnProperty('isDynamic') && options.isDynamic ? 'navigator-dynamic' : '';

				let buttonId = _.uniqueId('navigator_');
				btn = $('<div>').append($('<button>').attr('class', `navigator-button ${iconSetClass} ${iconClass} ${dynamicIconClass}`)
					.attr('title', toolTipText)
					.attr('id', buttonId)
				).html();
				addClickHandler(buttonId, options, entity);
			}
			return btn;
		}

		function getActionButtons(entity, columnDef) {
			let field = null;
			let list = entity.actionList;

			if (columnDef) {
				field = columnDef.field;
				list = list || columnDef.actionList;
			}

			if (field && entity[field] && entity[field].actionList) {
				list = entity[field].actionList;
			}

			var button = null;
			var container = $('<div>');

			_.each(list, function (action) {
				let buttonId = _.uniqueId('actionButton_');
				var toolTip;
				if (_.isFunction(action.toolTip)) {
					toolTip = action.toolTip(entity, field);
				} else {
					toolTip = action.toolTip + ' ' + (entity.Name ? entity.Name : '');
				}

				var readonly = _.get(action, 'readonly');
				var icon2Show = action.icon;

				if (_.isFunction(readonly)) {
					readonly = readonly();
				}
				// check the conditions for valueIcon
				if (action.valueIcon && platformObjectHelper.isSet(entity[field])) {
					icon2Show = action.valueIcon;
				}

				button = $('<button>')
					.attr('class', `${icon2Show} gridcell-ico`)
					.attr('title', toolTip)
					.attr('id', buttonId);

				if (readonly) {
					button.attr('disabled', 'disabled');
				}

				container.append(button);

				if (!readonly) {
					addClickHandler(buttonId, columnDef, entity, action.callbackFn, field);
				}
			});

			// display field content beside the button(s)
			if (columnDef && columnDef.formatterOptions && columnDef.formatterOptions.appendContent) {

				// container.append('<span>' + entity[field] + '</span>');  --> must concern displayMember!
				var displayMember = columnDef.formatterOptions.displayMember ? columnDef.formatterOptions.displayMember : field;
				var displayValue = platformObjectHelper.getValue(entity, displayMember) || '';
				container.append('<span>' + displayValue + '</span>');

			}

			return container.html();
		}

		service.getNavigator = getNavigator;
		service.getActionButton = getActionButtons;

		function openModule(options, entity) {
			naviservice.navigate(options.navigator, entity, options.field);
		}

		function getSvgColorProperty(color, type, layer) {
			let iconColors = '';
			let svgBackground = '';

			if (color && type && !_.isNil(layer) && !_.isEmpty(layer)) {
				iconColors = ' style="';
				switch (type) {
					case 'dec':
						svgBackground = drawingUtils.decToHexColor(color);
						break;
					case 'hex': // the implementation of hex format hasn't been yet defined -> needs to be in string format with '#' at first position
					case 'string':
						svgBackground = color;
						break;
					default:
						break;
				}
				layer.forEach(l => iconColors += `--icon-color-${l}: ${svgBackground}; `);

				iconColors += '"';

			}
			return iconColors;
		}

		function getSvgIconWrapper(iconColors, imageUrl) {
			let svgUrl = `${imageUrl.split(' ')[0]}.svg#${imageUrl.split(' ')[1]}`;
			return `<svg class="block-image"${iconColors}>
							<use href="${globals.clientUrl}cloud.style/content/images/${svgUrl}" class="block-image ${imageUrl}"></use>
						</svg>`;
		}

		/**
		 * @ngdoc function
		 * @name formatLookup
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description
		 * @param dataContext {object} entity
		 * @param columnDef {object} column definition
		 * @param result {string} already rendered result of formatter (by default the value of field)
		 * @param [item] {object} item used by image selector
		 * @returns {string} rendered value including errors, navigator and image
		 */
		function formatLookup(dataContext, columnDef, result, item) {
			let disableImageSelector = false;

			// add action button markup, one entity can have several action buttons
			if (dataContext && (columnDef.field && dataContext[columnDef.field] && (!_.isEmpty(dataContext[columnDef.field].actionList) || !_.isEmpty(dataContext.actionList) || !_.isEmpty(columnDef.actionList)) || columnDef.forceActionButtonRender)) {
				result = getActionButtons(dataContext, columnDef);
			}

			// add image markup
			if (item && columnDef.formatterOptions && columnDef.formatterOptions.imageSelector) {
				var imageUrl = '';
				let iconWrapper = '';
				var imageSelector = columnDef.formatterOptions.imageSelector;

				if (angular.isString(imageSelector)) {
					imageSelector = $injector.get(imageSelector);
				}
				if (angular.isObject(imageSelector)) {
					imageUrl = imageSelector.select(item, dataContext);
				}

				if (imageUrl) {
					iconWrapper = '<img src="' + imageUrl + '">';
					if (imageSelector.getIconType) {
						switch (imageSelector.getIconType()) {
							case 'css':
								iconWrapper = '<i class="block-image slick ' + imageUrl + '"></i>';
								disableImageSelector = true;
								break;
							case 'svg': {
								let iconColors = getSvgColorProperty(dataContext[columnDef.formatterOptions.svgBackgroundColor], columnDef.formatterOptions.backgroundColorType, columnDef.formatterOptions.backgroundColorLayer);
								iconWrapper = getSvgIconWrapper(iconColors, imageUrl);
								break;
							}
							case 'url':
							default:
								break;
						}
					}
					result = iconWrapper + '<span class="pane-r slick">' + result + '</span>';
				}
			}

			if (item && columnDef.formatterOptions && columnDef.formatterOptions.filter && columnDef.formatterOptions.filter.field && columnDef.formatterOptions.filter.field.toLowerCase() === 'color') {
				result = $injector.get('basicsLookupDataColorItemFormatter').formatter(dataContext[columnDef.field], item, item[columnDef.formatterOptions.displayMember], columnDef.formatterOptions);
			}

			if (_.isObject(result) && _.isArray(result.actionList)) {
				return '';
			} else {
				return _.isNil(result) ? '' : formatCommonMarkupAdditions(dataContext, columnDef, result, disableImageSelector);
			}
		}

		/**
		 * @ngdoc function
		 * @name applyAsyncFormatterMarkup
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description applies markup of async formatter call when cell is not editable (editor is opened)
		 * @param uniqueId {string} unique id of grid cell
		 * @param markup {string} html markup
		 * @param isSanitized {boolean} markup string is already sanitized
		 */
		function applyAsyncFormatterMarkup(uniqueId, markup, isSanitized) {
			const node = $('#' + uniqueId);

			if (!node.hasClass('editable')) {
				const markupSanitized = isSanitized ? markup : platformUtilService.getSanitized(markup);

				node.html(markupSanitized);
			}
		}

		function appendColorInfo(context, field, value) {
			const colorInfo = platformRuntimeDataService.colorInfo(context, field);

			if (colorInfo) {
				value = '<span class="left-side flex-inline-box color-field ' + colorInfo + '"></span>' + value;
			}

			return value;
		}

		function parseValueToDomainType(value, datatype) {
			if (_.isString(value)) {
				switch (datatype) {
					case 'bool':
					case 'marker':
						value = (value === 'true');
						return value;
					case 'numeric':
					case 'integer':
					case 'convert':
					case 'imperial':
					case 'duration':
					case 'imperialft':
						value = Number(value);
						return value;
					default:
						return value;
				}
			} else {
				return value;
			}
		}

		/**
		 * @ngdoc function
		 * @name formatter
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description creates and retrieves a formatter for given domain type
		 * @param domainType {string} domain type
		 * @returns {function} formatter
		 */
		service.formatter = function formatter(domainType) { // jshint ignore:line
			if (!_.has(formatters, domainType)) {
				var domainInfo = platformDomainService.loadDomain(domainType);
				var gridFormatter = null;

				if (!cultureInfo) {
					throw new Error('CultureInfo not available');
				}

				if (domainInfo) {
					switch (domainInfo.datatype) {
						case 'bool':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								var template;

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null);
								value = parseValueToDomainType(value, domainInfo.datatype);

								if (!plainText) {
									let isReadonly = platformRuntimeDataService.isReadonly(dataContext, columnDef.field);
									if (columnDef.editor && !isReadonly && (options && options.editable)) {
										template = '<input type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
									} else {
										if (platformRuntimeDataService.isHideReadonly(dataContext, columnDef.field) || columnDef.formatterOptions && columnDef.formatterOptions.hideReadonly) {
											template = '';
										} else if (isReadonly || !columnDef.editor || (options && !options.editable)) {
											template = '<input type="checkbox" onclick="return false" disabled="disabled"' + (value ? ' checked="checked"' : '') + '>';
										} else {
											template = '<input type="checkbox" onclick="return false"' + (value ? ' checked="checked"' : '') + '>';
										}
									}

									value = formatCommonMarkupAdditions(dataContext, columnDef, template);
								}

								return value;
							};
							break;

						case 'numeric':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								value = parseValueToDomainType(value, domainInfo.datatype);
								value = _.isNumber(value) && (_.ceil(value) !== 0 || !platformRuntimeDataService.isHideZeroValue(dataContext, columnDef.field)) ? value : ' ';

								if (_.isNumber(value)) {
									let precision = _.get(columnDef, 'formatterOptions.decimalPlaces', _.get(columnDef, 'editorOptions.decimalPlaces', domainInfo.precision));

									if (_.isFunction(precision)) {
										precision = precision(columnDef, columnDef.field);

										if (_.isNil(precision)) {
											precision = domainInfo.precision || 0;
										}
									}

									value = accounting.formatNumber(value, precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
								}

								if (options && options.filter) {
									return value;
								}

								return plainText ? value || '' : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
							};
							break;

						case 'fraction':
							// gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
							//  if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
							//   return '';
							//  }
							//
							//  value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
							//  value = _.isNumber(value) && (_.ceil(value) !== 0 || !platformRuntimeDataService.isHideZeroValue(dataContext, columnDef.field)) ? value : ' ';
							//
							//  if (_.isNumber(value)) {
							//   //lookup data
							//   var uomVal = basicsCommonUnitFormatterService.detectUom(columnDef.field, dataContext);
							//   var uomOpt = basicsCommonUnitFormatterService.returnLookupSettings();
							//   var service = $injector.get(uomOpt.lookupType);
							//   var uomItem = service.getItemById(uomVal, uomOpt);
							//
							//   //if uom can't be looked up
							//   if (!uomItem) {
							//    service.getItemByIdAsync(uomVal, uomOpt)
							//     .then(function (uomItem) {
							//      if (uomItem) {
							//       value = basicsCommonUnitFormatterService.simpleUomFormatter(value, columnDef, dataContext, true);
							//       applyAsyncFormatterMarkup(uniqueId, value);
							//      }
							//      return plainText ? value || '' : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
							//     });
							//   }
							//   //general value processing
							//   value = basicsCommonUnitFormatterService.simpleUomFormatter(value, columnDef, dataContext, true);
							//  }
							//  return plainText ? value || '' : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
							// };
							break;

						case 'imperialft':
						case 'convert':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								value = parseValueToDomainType(value, domainInfo.datatype);
								value = _.isNumber(value) && (_.ceil(value) !== 0 || !platformRuntimeDataService.isHideZeroValue(dataContext, columnDef.field)) ? value : ' ';

								if (_.isNumber(value)) {

									var result = basicsCommonUnitFormatterService.uomBranch(value, columnDef, dataContext);

									if (!_.isString(result)) {
										return basicsCommonUnitFormatterService.fetchUomAsync(columnDef, dataContext).then(function (uomItem) {
											value = basicsCommonUnitFormatterService.uomBranch(value, columnDef, dataContext, uomItem);
											applyAsyncFormatterMarkup(uniqueId, value);
											return plainText ? value || '' : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
										});
									} else {
										value = result;
									}
									return plainText ? value || '' : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
								}
							};
							break;

						case 'action':
							gridFormatter = function (row, cell, value, columnDef, dataContext) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);

								return formatLookup(dataContext, columnDef, value, dataContext);
							};
							break;

						case 'integer':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								value = parseValueToDomainType(value, domainInfo.datatype);
								value = _.isNumber(value) && (value !== 0 || !platformRuntimeDataService.isHideZeroValue(dataContext, columnDef.field)) ? value : ' ';

								return plainText ? value.toString() : formatCommonMarkupAdditions(dataContext, columnDef, value.toString());
							};
							break;

						case 'date':
						case 'dateutc':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								var utc = domainInfo.datatype.indexOf('utc') !== -1;

								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);

								if (_.isString(value)) {
									$log.error('date(utc)|formatter: provide a moment object instead of string ->', value);

									value = utc ? moment.utc(value) : moment(value);
								}

								if (moment.isMoment(value)) {
									if (utc && !value.isUtc()) {
										value = moment.utc(value);
									} else if (!utc && value.isUtc()) {
										value = value.local();
									}
								}

								if (options && options.filter) {
									return moment(value);
								}

								if (value) {
									value = value.isValid()
										? (options && options.grouping
												? value.toISOString().split('T')[0]
												: columnDef.formatterOptions && columnDef.formatterOptions.showDayPrefix
													? value.format('dd') + ' ' + value.format('L')
													: value.format(domainInfo.format || 'L')
										)
										: '';
								}

								if (!plainText) {
									value = appendColorInfo(dataContext, columnDef.field, value);
								}

								return plainText ? value || '' : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
							};
							break;

						case 'datetime':
						case 'datetimeutc':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								var utc = domainInfo.datatype.indexOf('utc') !== -1;

								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);

								if (_.isString(value)) {
									$log.error('date(utc)|formatter: provide a moment object instead of string ->', value);

									value = utc ? moment.utc(value) : moment(value);
								}

								if (moment.isMoment(value)) {
									if (utc && !value.isUtc()) {
										value = moment.utc(value);
									} else if (!utc && value.isUtc()) {
										value = value.local();
									}

									if (options && options.filter) {
										return (columnDef.formatterOptions && columnDef.formatterOptions.showWeekday) ? value.format('dddd') : value;
									}
								}

								if (value) {
									if (value.isValid()) {
										if (options && options.grouping) {
											if (options.groupKey || _.isUndefined(options.groupKey)) {
												value = (columnDef.formatterOptions && columnDef.formatterOptions.showWeekday) ? moment(dataContext[columnDef.field]).day() : value.toISOString();
											} else {
												value = (columnDef.formatterOptions && columnDef.formatterOptions.showWeekday) ? value.format('dddd') : value.format(domainInfo.format || 'L LTS');
											}
										} else {
											value = (columnDef.formatterOptions && columnDef.formatterOptions.showWeekday) ? value.format('dddd') : value.format(domainInfo.format || 'L LTS');
										}
									} else {
										value = '';
									}
								}

								if (!plainText) {
									value = appendColorInfo(dataContext, columnDef.field, value);
								}

								return plainText ? (!_.isNull(value) ? value : '') : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
							};
							break;

						case 'time':
						case 'timeutc':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								var utc = domainInfo.datatype.indexOf('utc') !== -1;

								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);

								if (_.isString(value)) {
									$log.error('date(utc)|formatter: provide a moment object instead of string ->', value);

									value = utc ? moment.utc(value) : moment(value);
								}

								if (moment.isMoment(value)) {
									if (utc && !value.isUtc()) {
										value = moment.utc(value);
									} else if (!utc && value.isUtc()) {
										value = value.local();
									}
								}

								if (value) {
									value = value.isValid() ? (options && options.grouping ? value.toISOString().split('T')[1] : value.format(domainInfo.format || 'LT')) : '';
								}

								if (!plainText) {
									value = appendColorInfo(dataContext, columnDef.field, value);
								}

								return plainText ? value || '' : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
							};
							break;

						case 'duration':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);

								if (_.isInteger(value)) {
									value = moment.duration(value, domainInfo.format);
								}

								if (value) {
									value = moment.isDuration(value) ? math.floor(value.asDays()) + ' ' + moment.utc(value.asMilliseconds()).format('HH:mm:ss') : '';
								}

								return plainText ? value || '' : formatCommonMarkupAdditions(dataContext, columnDef, value || '');
							};
							break;

						case 'inputselect':
						case 'string':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, domainInfo.model || null, value) || '';

								if (plainText) {
									value = _.escape(value).replace('&amp;', '&');
								} else {
									value = formatCommonMarkupAdditions(dataContext, columnDef, _.escape(value));
								}

								return value;
							};
							break;

						case 'iban':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, domainInfo.model || null, value) || '';
								value = IBAN.printFormat(value);

								if (!plainText) {
									value = formatCommonMarkupAdditions(dataContext, columnDef, _.escape(value));
								}

								return value;
							};
							break;

						case 'colorpicker':
						case 'color':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null);

								if (value !== null) {
									value = _.padStart(value.toString(16), 7, '#000000');
									let showHashCode = _.get(columnDef, 'formatterOptions.showHashCode', false);

									if (!plainText) {
										var markup = '<button type="button" class="btn btn-default btn-colorpicker" style="background-color:' + value + '"></button>' + (showHashCode ? '<label class="color-picker">' + value.toString().toUpperCase() + '</label>' : '');
										value = formatCommonMarkupAdditions(dataContext, columnDef, markup);
									}
								}

								return value || '';
							};
							break;
						case 'multiImage':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) {
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								const options = columnDef.formatterOptions;
								if (options) {
									let imgCount = options.imageCount ? options.imageCount : 2;
									let imageSelector = options.imageSelector;
									let hasTooltip = false;
									if (angular.isString(imageSelector)) {
										imageSelector = $injector.get(imageSelector);
										hasTooltip = _.isBoolean(options.tooltip) ? options.tooltip : false;
										if (angular.isObject(imageSelector)) {
											let imageList = imageSelector.select(dataContext);
											if (hasTooltip) {
												const tooltips = imageSelector.selectTooltip(dataContext);
												let returnValue = '<div>';

												imageList.forEach(function (item) {
													if (imgCount > 0) {
														const tooltipObj = tooltips.find(t => t.icon === item.Description);
														let tooltip = tooltipObj ? tooltipObj.tooltip : '';
														returnValue += '<i class="block-image slick ' + item.image + '" title="' + tooltip + '"></i>';
													}
													imgCount--;
												});

												returnValue += '</div>';
												return returnValue;
											}
										}
									}
								}

								return '';
							};
							break;
						case 'image':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								var options = columnDef.formatterOptions;
								var targetData;
								var entity;
								var result = '';
								var imageUrl = '';
								var service = $injector.get(options.dataServiceName ? options.dataServiceName : 'basicsLookupdataLookupDescriptorService');

								if (options && service) {
									// inject imageSelector when string
									var imageSelector = options.imageSelector;
									var hasTooltip = false;

									if (angular.isString(imageSelector)) {
										imageSelector = $injector.get(imageSelector);
										hasTooltip = _.isBoolean(options.tooltip) ? options.tooltip : false;
									}

									if (options.lookupType) {
										if (options.displayText) {
											result = options.displayText(value, dataContext, service);
										} else {
											targetData = service.getData(options.lookupType);

											if (targetData) {
												entity = targetData[value];

												if (angular.isObject(entity)) {
													result = entity[options.displayMember];
												}
											}
										}

										if (angular.isObject(entity) && angular.isObject(imageSelector)) {
											imageUrl = imageSelector.select(entity, dataContext);
										}

										if (plainText) {
											return result;
										}

										value = '<img src="' + imageUrl + '">' + '<span class="pane-r slick">' + result + '</span>';
									} else {
										var tooltip = '',
											isCss;

										if (angular.isObject(imageSelector)) {
											isCss = imageSelector.isCss && imageSelector.isCss();
											imageUrl = imageSelector.select(dataContext);
											if (hasTooltip) {
												tooltip = imageSelector.selectTooltip(dataContext);
											}
										}

										if (plainText) {
											return tooltip;
										}

										value = isCss ? '<i class="block-image slick ' + imageUrl + '" title="' + tooltip + '"></i>' : '<img src="' + imageUrl + '" title="' + tooltip + '">';
									}
								}

								return value;
							};
							break;

						case 'lookup':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								if (_.isString(value)) {
									// fast-data-recording: string value has been assigned if there's no matching lookup-entity
									if (columnDef.additionalColumn) {
										return '';
									} else {
										return formatCommonMarkupAdditions(dataContext, columnDef, _.escape(value));
									}
								}

								var result = '';
								if (columnDef.additionalColumn) {
									result = platformGridLookupDomainFormatterService.formatLookupAdditionalColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, service, applyAsyncFormatterMarkup);
								} else {
									result = platformGridLookupDomainFormatterService.formatLookupMainColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, formatLookup, applyAsyncFormatterMarkup);
								}

								return result;
							};
							break;

						case 'url':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								var reg;
								if (value) {
									if (['http', 'https', 'ftp', 'ftps', 'file', 'www.'].some((word) => value.startsWith(word))) {
										if (value.startsWith('www.')) {
											reg = new RegExp('(^|s)((https?://)?[w-]+(.[w-]+)+.?(:d+)?(/S*)?)');
										} else {
											reg = new RegExp('^((http[s]?|ftp[s]?|file):\\/)?\\/?((\\/\\w+)*\\/)([\\w\\-\\.]+[^#?\\s]+)(.*)?(#[\\w\\-]+)?$', 'i');
										}
									} else {
										if (value.startsWith('\\')) {
											reg = new RegExp('((w+)*)([w]+[^#?s]+)(.*)?(#[w]+)?');
										} else {
											if (value.length < 50) {
												reg = new RegExp('^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
											}
										}
									}
								}
								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);

								if (!plainText) {
									if (value && value.length && (reg && reg.test(value))) {
										let hrefValue = value;
										if (!(['http', 'https', 'ftp', 'ftps', 'file'].some((word) => value.startsWith(word)) || value.startsWith('\\'))) {
											hrefValue = 'https://' + value;
										}
										value = '<a href="' + hrefValue + '" target="_blank" rel="noopener noreferrer" placeholder="Enter a valid URL"><i class="block-image slick ' + domainInfo.image + '"></i></a><span class="pane-r slick">' + value + '</span>';
										// No longer required - there is a validation requiring that http and https are entered in the input
										// $('a:not([href^="http://"]):not([href^="https://"])').attr('href', function () {
										//	return 'http://' + $(this).attr('href');
										// });
									}
									value = formatCommonMarkupAdditions(dataContext, columnDef, value);
								}

								return value;
							};
							break;

						case 'select':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								var options = columnDef.formatterOptions || columnDef.editorOptions;

								function getValue(value, columnDef, dataContext, plainText) { // jshint ignore:line
									value = formatterValue(dataContext, columnDef.field, null, null);
									value = _.result(_.find(options.items || [], _.set({}, options.valueMember, _.isObject(value) ? value[options.valueMember] : value)), options.displayMember, value);

									return plainText ? value : formatCommonMarkupAdditions(dataContext, columnDef, _.escape(value));
								}

								// items injected as value or constant
								if (_.isString(options.items)) {
									options.items = $injector.get(options.items);
								}

								if (!options.items) {
									if (_.isString(options.serviceName)) { // get items from a service
										var service = $injector.get(options.serviceName);

										if (_.isString(options.serviceMethod) || _.isString(options.serviceDataFunction)) {
											options.items = service[options.serviceDataFunction || options.serviceMethod]();

											if (!_.isArray(options.items)) {
												options.items = options.items
													.then(function (data) {
														options.items = data;

														return true;
													});
											}
										} else {
											options.items = service.loadData()
												.then(function () {
													options.items = service.getList();

													return true;
												});
										}
									}
								}

								if (!_.isArray(options.items)) {
									var formatterOptions = [columnDef.formatterOptions];

									options.items
										.then(function () {
											// save current and restore old formatterOptions (can be already changed when using dynamic domain type
											formatterOptions.unshift(columnDef.formatterOptions);
											columnDef.formatterOptions = formatterOptions.pop();

											applyAsyncFormatterMarkup(uniqueId, getValue(value, columnDef, dataContext));

											// restore current
											columnDef.formatterOptions = formatterOptions.pop();
										});

									return '';
								}

								return getValue(value, columnDef, dataContext, plainText);
							};
							break;

						case 'history':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = _.get(dataContext, columnDef.field) || '';

								if (platformObjectHelper.isPromise(value)) {
									value.then(function () {
										$('#' + uniqueId).html(_.get(dataContext, columnDef.field));
									});

									if (options && options.promise) {
										return value;
									}

									return '';
								}

								if (options && options.grouping) {
									if (columnDef.field.endsWith('updatedAt')) {
										value = _.get(dataContext, 'UpdatedAt', '') || _.get(dataContext, 'updatedAt', '');
										value = _.isString(value) ? value : value.toISOString();
									} else if (columnDef.field.endsWith('insertedAt')) {
										value = _.get(dataContext, 'InsertedAt', '') || _.get(dataContext, 'insertedAt', '');
										value = _.isString(value) ? value : value.toISOString();
									}
								}

								return value;
							};
							break;

						case 'password':
							gridFormatter = function (row, cell, value, columnDef, dataContext) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = _.get(dataContext, columnDef.field) || '';
								value = _.repeat('*', value.length);

								return value;
							};
							break;

						case 'imageselect':
							gridFormatter = function imageSelectFormatter(row, cell, value, columnDef, dataContext, plainText, uniqueId, option) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								var options = columnDef.formatterOptions || {};
								const valueAccepted = !_.isNil(value) && (Boolean(options.acceptFalsyValues) || Boolean(value));

								if (angular.isUndefined(value) || !valueAccepted) {
									value = _.get(dataContext, columnDef.field, '');
								}

								if (!imageSelectFormatter.templates) {
									imageSelectFormatter.templates = [
										$interpolate('<img src="{{res}}"><span class="pane-r slick" title="{{text}}">{{text}}</span>'),
										$interpolate('<img src="{{res}}" class="pane-r slick">'),
										$interpolate('<i class="block-image slick {{res}}" title="{{title}}"></i><span class="pane-r slick" title="{{text}}">{{text}}</span>'),
										$interpolate('<i class="pane-r slick block-image {{res}} {{id}}"></i>'),
										$interpolate('<div class="overlay-counter" title="{{title}}"><i class="block-image slick {{res}}"></i><span class="slick">{{text}}</span></div>'),
									];
								}

								var service = $injector.get(options.serviceName || 'platformStatusIconService');
								var result = '';

								if (plainText) {
									let item = options.iconItem || service.getItemById ? service.getItemById(value) : null;
									return item ? item.text : '';
								}

								function getImageSelectorTemplate(value, offset) {
									if (options.hasOwnProperty('showOverlayTemplate') && options.showOverlayTemplate) {
										return imageSelectFormatter.templates[4];
									}

									return _.isArray(value) ? imageSelectFormatter.templates[offset + 1] : imageSelectFormatter.templates[offset];
								}

								function createHtml(value) {
									let isCss = (options.iconItem && options.iconItem.css) || service.isCss && service.isCss();
									let offset = isCss ? 2 : 0;
									let template = getImageSelectorTemplate(value, offset);

									_.each(_.isArray(value) ? value : [value], function (index) {
										var value = options.iconItem || service.getItemById ? service.getItemById(index) : null;

										if (valueAccepted) {
											result += template(value);
										}
									});

									return result;
								}

								if (options.dataServiceName && _.isString(options.dataServiceMethod)) {
									var dataService = options.dataServiceName && $injector.get(options.dataServiceName);

									if (dataService) {
										value = dataService[options.dataServiceMethod](dataContext, options);
										if (option && option.autosizecolumn && value && value.$$state) {
											return createHtml(value.$$state.value);
										}
									}
								} else if (!options.dataServiceName && _.isFunction(options.dataServiceMethod)) {
									value = options.dataServiceMethod(dataContext, options);
								}

								if (value && platformObjectHelper.isPromise(value)) {
									var formatterOptions = [options];

									value
										.then(function (value) {
											if (valueAccepted) {
												// save current and restore old formatterOptions (can be already changed when using dynamic domain type
												formatterOptions.unshift(columnDef.formatterOptions);
												columnDef.formatterOptions = formatterOptions.pop();

												applyAsyncFormatterMarkup(uniqueId, createHtml(value));

												// restore current
												columnDef.formatterOptions = formatterOptions.pop();
											}
										});

									return '';
								}

								return valueAccepted ? createHtml(value) : '';
							};
							break;

						case 'marker':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								var template = '';

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null);

								if (!plainText) {
									var type = ((columnDef.formatterOptions && columnDef.formatterOptions.multiSelect) || (columnDef.editorOptions && columnDef.editorOptions.multiSelect)) ? 'checkbox' : 'radio';
									var considerReadonly = _.get(columnDef, 'considerReadonly', false);
									var ctrlName = columnDef.gridUid + '_' + columnDef.field;

									if ((!columnDef.editor || platformRuntimeDataService.isReadonly(dataContext, columnDef.field)) && considerReadonly) {
										if (columnDef.formatterOptions && columnDef.formatterOptions.hideReadonly) {
											template = '';
										} else {
											if (type === 'radio') {
												template = '<input name="' + ctrlName + '" type="' + type + '" disabled="disabled"' + (value ? ' checked="checked"' : '') + '>';
												//
											} else {
												template = '<input type="' + type + '" disabled="disabled"' + (value ? ' checked="checked"' : '') + '>';
											}
										}
									} else {
										if (type === 'radio') {
											template = '<input name="' + ctrlName + '"  type="' + type + '"' + (value ? ' checked="checked"' : '') + '>';
											// template = '<input type="' + type + '"' + (value ? ' checked="checked"' : '') + '>';
										} else {
											template = '<input type="' + type + '"' + (value ? ' checked="checked"' : '') + '>';
										}
									}

									setTimeout(function () {
										if (dataContext.hasOwnProperty(columnDef.field) && dataContext[columnDef.field] === null && columnDef.editorOptions.idProperty) {
											let ele = $('.item-id_' + dataContext[columnDef.editorOptions.idProperty] + ' >.r' + cell + '.item-field_' + columnDef.field + ' :input[type="checkbox"]');
											if (ele) {
												ele.prop('indeterminate', true);
											}
										}
									}, 0);
								}

								return template;
							};
							break;

						case 'none':
							gridFormatter = function () {
								return '';
							};
							break;

						case 'email':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) {
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								if (!domainInfo.regExp) {
									domainInfo.regExp = new RegExp(domainInfo.regex);
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								value = _.escape(value);
								if (!plainText) {
									if (value && value.length && domainInfo.regExp.test(value)) {
										value = '<a href="mailto:' + value + '"><i class="block-image slick ' + domainInfo.image + '" title="mailto:' + value + '"></i></a><span class="pane-r slick">' + value + '</span>';
									}
									value = formatCommonMarkupAdditions(dataContext, columnDef, value);
								}
								return value;
							};
							break;

						case 'phone':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) {
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								value = _.escape(value);
								if (!plainText) {
									if (value && value.length && globals.telephoneScheme.id) {
										value = '<a href="' + globals.telephoneScheme.scheme + ':' + value + '"><i class="block-image slick control-icons ' + globals.telephoneScheme.css + '" title="' + globals.telephoneScheme.scheme + ':' + value + '"></i></a><span class="pane-r">' + value + '</span>';
									}
									value = formatCommonMarkupAdditions(dataContext, columnDef, value);
								}

								return value;
							};
							break;

						case 'fax':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) {
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								value = _.escape(value);
								if (!plainText) {
									if (value && value.length) {
										value = '<a href="fax:' + value + '"><i class="block-image slick ' + domainInfo.image + '" title="fax:' + value + '"></i></a><span class="pane-r slick">' + value + '</span>';
									}
									value = formatCommonMarkupAdditions(dataContext, columnDef, value);
								}

								return value;
							};
							break;

						case 'multicode':
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) {
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = _.compact(_.map(value, (item) => {
									if (item.delete) {
										return null;
									}

									return item.external ? '(' + (item.formatterValue || item.value) + ')' : (item.formatterValue || item.value);
								})).join(', ');

								if (!plainText) {
									value = formatCommonMarkupAdditions(dataContext, columnDef, value);
								}

								return value;
							};
							break;

						default:
							gridFormatter = function (row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
								if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
									return '';
								}

								value = formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null) || '';

								return plainText ? value : formatCommonMarkupAdditions(dataContext, columnDef, _.escape(value));
							};
					}
				}

				formatters[domainType] = gridFormatter;

				return gridFormatter;
			}

			return formatters[domainType];
		};

		/**
		 * @ngdoc function
		 * @name alignmentCssClass
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description retrieves domain specific css for given domain type
		 * @param domainType {string} domain type
		 * @returns {string} css
		 */
		service.alignmentCssClass = function alignmentCssClass(domainType) {
			var domainInfo = platformDomainService.loadDomain(domainType);
			var result = '';

			if (domainInfo) {
				switch (domainInfo.datatype) {
					case 'numeric':
					case 'integer':
					case 'convert':
					case 'imperial':
					case 'duration':
					case 'imperialft':
						result = 'text-right';
						break;

					case 'bool':
					case 'marker':
						result = 'text-center';
						break;

					case 'action':
						result = 'no-padding';
						break;
				}
			}

			return result;
		};

		/**
		 * @ngdoc function
		 * @name isSearchable
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description retrieves default value for searchable state for given domain type
		 * @param domainType {string} domain type
		 * @returns {boolean} searchable
		 */
		service.isSearchable = function isSearchable(domainType) {
			var domainInfo = platformDomainService.loadDomain(domainType);

			if (domainInfo) {
				return domainInfo.searchable || false;
			}

			return false;
		};

		function getEditorMarkup(domainInfo, domainType) { // jshint ignore:line
			var markup;

			switch (domainType) {
				case 'tristatecheckbox':
					markup = '<tristatechk data-ng-model="value" data-grid="true" $$placeholder$$></tristatechk>';
					break;

				case 'buttoninput':
					markup = '<buttoninputctrl data-options="$$row$$" data-ng-model="value" data-grid="true" $$placeholder$$></buttoninputctrl>';
					break;

				case 'telephonefax':
					break;

				case 'optiongroup':
					markup = '<radiolistctrl data-options="$$row$$" data-valueMember="$$valueMember$$" data-displayMember="$$displayMember$$" data-grid="true" $$placeholder$$></radiolistctrl>';
					break;
			}

			if (!markup && domainInfo) {
				switch (domainInfo.datatype) {
					case 'lookup':
						markup = '<div data-$$directive$$ data-ng-model="value" data-entity="entity" data-use-in-grid-cell="true" data-options="options" data-grid="true"></div>';
						break;

					case 'directive':
						markup = '<div data-$$directive$$ data-ng-model="value" data-entity="entity" data-options="options" data-grid="true" $$placeholder$$></div>';
						break;

					default:
						markup = '<div data-domain-control data-model="value" data-domain="' + domainType + '" data-grid="true" $$placeholder$$></div>';
						break;
				}
			}

			return markup;
		}

		/**
		 * @ngdoc function
		 * @name editorTemplate
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description creates and retrieves a markup template for given domain type
		 * @param domainType {string} domain type
		 * @returns {function} markup template
		 */
		service.editorTemplate = function editorTemplate(domainType) {
			if (_.isUndefined(editorMarkups[domainType])) {
				var domainInfo = platformDomainService.loadDomain(domainType);

				if (!domainInfo) {
					throw new Error('Domain info for type ' + domainType + ' not available');
				}

				editorMarkups[domainType] = getEditorMarkup(domainInfo, domainType);
			}

			return editorMarkups[domainType];
		};

		/**
		 * @ngdoc function
		 * @name domainInfo
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description creates and retrieves a markup template for given domain type
		 * @param domainType {string} domain type
		 * @returns {function} markup template
		 */
		service.domainInfo = function domainInfo(domainType) {
			return platformDomainService.loadDomain(domainType);
		};

		/**
		 * @ngdoc function
		 * @name isReadonly
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description retrieves default value for readonly state for given domain type
		 * @param domainType {string} domain type
		 * @returns {boolean} readonly
		 */
		service.isReadonly = function isReadonly(domainType) {
			var domainInfo = platformDomainService.loadDomain(domainType);

			if (domainInfo) {
				return domainInfo.readonly || false;
			}

			return false;
		};

		/**
		 * @ngdoc function
		 * @name getApplyValueCallback
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description retrieves callback to be called when new values has been applied in editor for given domain type
		 * @param domainType {string} domain type
		 * @returns {function} callback function
		 */
		service.getApplyValueCallback = function getApplyValueCallback(domainType) {
			var domainInfo = platformDomainService.loadDomain(domainType);

			if (domainInfo) {
				switch (domainInfo.datatype) {
					case 'marker':
						return $injector.get('platformMarkerDomainTypeService').postApplyValueCallback;
				}
			}

			return angular.noop();
		};

		/**
		 * @ngdoc function
		 * @name hasApplyValueCallback
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description retrieves value for post applyValue callback in grid editor for given domain type
		 * @param domainType {string} domain type
		 * @returns {boolean} true if callback is defined
		 */
		service.hasApplyValueCallback = function hasPostApplyValueCallback(domainType) {
			var domainInfo = platformDomainService.loadDomain(domainType);

			if (domainInfo) {
				switch (domainInfo.datatype) {
					case 'marker':
						return true;
				}
			}

			return false;
		};

		/**
		 * @ngdoc function
		 * @name getConditionForNaviBtn
		 * @function
		 * @methodOf platform.platformGridDomainService
		 * @description checks if a navigator-function exists in grid-column configuration
		 * @param domainType {string} column configuration
		 * @returns {boolean} true if callback is defined
		 */
		service.getConditionForNaviBtn = getConditionForNaviBtn;

		service.applyAsyncFormatterMarkup = applyAsyncFormatterMarkup;
		service.formatLookup = formatLookup;

		return service;
	}
})($);
