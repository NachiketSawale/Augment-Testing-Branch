/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformDomainControlService
	 * @function
	 * @requires platformDomainService, platformContextService, accounting, moment
	 * @description
	 * platformGridFormatterService provides formatter for RIB domain types for platformGrid
	 */
	angular.module('platform').factory('platformDomainControlService', platformDomainControlService);

	platformDomainControlService.$inject = ['_', 'platformTranslateService', 'platformCreateUuid', 'globals', 'platformStatusIconService', '$log'];

	function platformDomainControlService(_, platformTranslateService, platformCreateUuid, globals, iconService, $log) { // jshint ignore:line
		/**
		 * @ngdoc function
		 * @name controlMarkup
		 * @function
		 * @methodOf platform.platformDomainControlService
		 * @description provides a markup template for given domain type
		 * @param domain {string} domain type
		 * @param attrs {object} attributes of directive
		 * @param config {object} configuration object
		 * @param options {object} additionally configuration object (provided by attribute data-options)
		 * @param inForm {boolean} used in form or grid
		 * @returns {string} markup template
		 */
		function controlMarkup(domain, attrs, config, options, inForm) { // jshint ignore:line
			let markup;
			let tmp;
			let bindingBase;
			let toolTip;
			let startdiv;
			if (inForm && attrs.isHideContent) {
				startdiv = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
					'<div data-ng-if="!' + attrs.isHideContent + '" class="input-group @@cssclass@@ @@controlflag@@">';
			}
			else {
				startdiv = '<div class="input-group @@cssclass@@ @@controlflag@@">';
			}

			function checkToInfoText(alignment) {
				return _.isString(options.infoText) ? `<span class="info-text form-icon-box tlb-icons ico-info ${alignment}" title="${options.infoText}"></span>` : '';
			}

			switch (domain) {
				case 'code':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input data-ng-if="!' + attrs.isHideContent + '" type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-code-converter @@attributes@@>';
					}
					else {
						markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-code-converter @@attributes@@>';
					}
					break;

				case 'numcode':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input data-ng-if="!' + attrs.isHideContent + '" type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-numeric-code-converter @@attributes@@>';
					}
					else {
						markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-numeric-code-converter @@attributes@@>';
					}
					break;

				case 'multicode':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input data-ng-if="!' + attrs.isHideContent + '" type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-multi-code-converter @@attributes@@>';
					}
					else {
						markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-multi-code-converter @@attributes@@>';
					}
					break;

				case 'description':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input data-ng-if="!' + attrs.isHideContent + '" type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus @@attributes@@>';
					}
					else {
						markup = '<input type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus @@attributes@@>';
					}
					break;

				case 'history':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input data-ng-if="!' + attrs.isHideContent + '" type="text" class="@@cssclass@@ @@controlflag@@" @@attributes@@>';
					}
					else {
						markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" @@attributes@@>';
					}
					break;

				case 'translation':
					if(inForm){
						if (attrs.isHideContent && config.isMultiLine) {
							markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							 '<textarea data-ng-trim="false" data-ng-if="!' + attrs.isHideContent + '" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-textarea-handler data-platform-translation-converter @@attributes@@></textarea>';
					   } else if (attrs.isHideContent) {
							markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
								'<input data-ng-if="!' + attrs.isHideContent + '" type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-translation-converter @@attributes@@>';
						} else if (config.isMultiLine) {
							markup = '<textarea data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-textarea-handler data-platform-translation-converter @@attributes@@></textarea>';
						} else {
							markup = '<input type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-translation-converter @@attributes@@>';
						}
					} else {
						markup = '<input type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-translation-converter @@attributes@@>';
					}
					break;

				case 'email':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<div data-ng-if="!' + attrs.isHideContent + '" class="input-group @@cssclass@@ @@controlflag@@">';
					}
					else {
						markup = '<div class="input-group @@cssclass@@ @@controlflag@@">';
					}
					if (options && options.showButton && options.buttonFn) {
						markup += '  <input type="email" class="input-group-content"  data-platform-select-on-focus data-platform-email-handler data-platform-email-validation @@attributes@@>';
						markup += '  <div class="input-group-btn" >';
						markup += '  	<button data-ng-click="btnClick(' + attrs.entity + ')" class="btn btn-default control-icons ico-send" data-tabstop="true"></button>';
						markup += '  </div>';
					} else {
						markup += '  <input type="email" class="input-group-content" data-platform-select-on-focus data-platform-email-validation @@attributes@@>';
					}
					markup += '</div>';
					break;

				case 'password':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input type="password" data-ng-if="!' + attrs.isHideContent + '" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus @@attributes@@>';
					}
					else {
						markup = '<input type="password" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus @@attributes@@>';
					}
					break;

				case 'iban':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input type="text" data-ng-if="!' + attrs.isHideContent + '" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-i-b-a-n-converter data-platform-i-b-a-n-validation @@attributes@@>';
					}
					else {
						markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-i-b-a-n-converter data-platform-i-b-a-n-validation @@attributes@@>';
					}
					break;

				case 'convert':
				case 'imperialft':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input type="text" data-ng-if="!' + attrs.isHideContent + '" class="@@cssclass@@ @@controlflag@@ text-right" data-platform-select-on-focus data-platform-unit-converter @@attributes@@>';
					}
					else {
						markup = '<input type="text" class="@@cssclass@@ @@controlflag@@ text-right" data-platform-select-on-focus data-platform-unit-converter @@attributes@@>';
					}
					break;

				case 'durationsec':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input type="text" data-ng-if="!' + attrs.isHideContent + '" class="@@cssclass@@ @@controlflag@@ text-right" data-platform-select-on-focus data-platform-duration-converter @@attributes@@>';
					}
					else {
						markup =  '<input type="text" class="@@cssclass@@ @@controlflag@@ text-right" data-platform-select-on-focus data-platform-duration-converter @@attributes@@>';
					}
					break;

				case 'money':
				case 'integer':
				case 'quantity':
				case 'factor':
				case 'exchangerate':
				case 'percent':
				case 'decimal': {
					let infoText = _.isString(options.infoText) ? `<span class="info-text form-icon-box tlb-icons ico-info" title="${options.infoText}"></span>` : undefined;

					markup = `<div class="input-group ${infoText ? 'info' : ''} @@cssclass@@ @@controlflag@@">`;
					if (infoText) {
						markup = markup + infoText;
					}
					if (inForm && attrs.isHideContent) {
						markup = markup + '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input type="text" data-ng-if="!' + attrs.isHideContent + '" class="input-group-content text-right" data-platform-select-on-focus data-platform-numeric-converter @@attributes@@></div>';
					}
					else {
						markup = markup + '<input type="text" class="input-group-content text-alignment" data-platform-select-on-focus data-platform-numeric-converter @@attributes@@></div>';
					}
				}
					break;

				case 'time':
				case 'timeutc':
					if (inForm && attrs.isHideContent) {
						markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<input type="time" data-ng-if="!' + attrs.isHideContent + '" class="@@cssclass@@ @@controlflag@@" data-platform-time-converter @@attributes@@>';
					}
					else {
						markup =  '<input type="time" class="@@cssclass@@ @@controlflag@@" data-platform-time-converter @@attributes@@>';
					}
					break;

				case 'date':
				case 'dateutc':
				case 'datetime':
				case 'datetimeutc':
					// inline and not inline here!
					if (options.disablePopup) {
						markup = '<div class="datepickerinput date" data-platform-select-on-focus data-platform-datetime-handler data-platform-datetime-converter @@attributes@@></div>';
					} else {
						markup = [
							'<div class="input-group date @@cssclass@@ @@controlflag@@" @@readonly@@>',
							'  <div class="input-group-addon" data-ng-class="' + attrs.colorinfo + '" data-ng-show="' + attrs.colorinfo + '"></div>',
							'  <input type="text" class="input-group-content datepickerinput" data-platform-select-on-focus data-platform-datetime-handler data-platform-datetime-converter @@attributes@@>',
							'  <span class="input-group-btn"><button class="btn btn-default" @@disabled@@ data-tabstop="true"><span class="glyphicon-calendar glyphicon"></span></button></span>',
							'</div>'
						].join('');
					}
					break;

				case 'boolean':
					toolTip = options.toolTipTitle && options.toolTipCaption ? ' custom-tooltip="{\'title\':\'' + options.toolTipTitle  + '\',\'caption\':\''  + options.toolTipCaption +  '\',\'width\':300}" ': '';
					markup = '<div class="' + (inForm ? '' : 'text-center ') + '@@cssclass@@ @@controlflag@@"><input type="checkbox" @@attributes@@' + (!options.ctrlId ? '' : ' id="{{' + attrs.options + '.ctrlId}}"') + '>' + (!options.labelText ? '</div>' : '<label' + toolTip  + ' for="{{' + attrs.options + '.ctrlId}}">' + options.labelText + '</label></div>');
					break;

				case 'text':
				case 'remark':
				case 'comment':
					if (inForm) {
						if (attrs.isHideContent) {
							markup = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
								'<textarea data-ng-trim="false" data-ng-if="!' + attrs.isHideContent + '" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-textarea-handler @@attributes@@></textarea>';
						}
						else {
							markup =  '<textarea data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-textarea-handler @@attributes@@></textarea>';
						}
					} else {
						markup = '<input type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" @@attributes@@>';
					}
					break;

				case 'select':
					if (inForm && attrs.isHideContent) {
						startdiv = '<div data-ng-if="' + attrs.isHideContent + '" class="form-control"></div>' +
							'<div data-ng-if="!' + attrs.isHideContent + '" class="input-group @@cssclass@@ @@controlflag@@">';
					}
					else {
						startdiv =  '<div class="input-group @@cssclass@@ @@controlflag@@">';
					}
					markup = [
						startdiv,
						'  <div class="input-group-content ellipsis" data-platform-select-converter data-platform-select-handler tabindex="-1" @@attributes@@></div>',
						'  <div class="input-group-btn" >',
						'    <button type="button" class="btn btn-default dropdown-toggle"' + (inForm ? '@@disabled@@' : '') + '>',
						'      <span class="caret"></span>',
						'    </button>',
						'  </div>',
						'</div>'].join('');
					break;

				case 'inputselect':
					tmp = attrs.options || (config && config.options ? (attrs.config + '.options') : false) || (options ? 'options' : false) || null;
					markup = [
						startdiv,
						controlMarkup(options.inputDomain || config.inputDomain, attrs, config, {}, inForm)
							.replace('@@attributes@@', 'data-platform-input-select-handler data-platform-input-select-converter @@attributes@@')
							.replace('@@cssclass@@', 'input-group-content domain-type-' + options.inputDomain || config.inputDomain),
						'  <div class="input-group-btn">',
						'    <button type="button" class="btn btn-default dropdown-toggle"' + (inForm ? '@@disabled@@' : '') + '>',
						'      <span class="caret"></span>',
						'    </button>',
						'  </div>',
						'</div>'].join('');
					break;

				case 'imageselect':
					markup = [
						startdiv,
						'  <div class="input-group-content" data-platform-image-select-handler tabindex="-1" @@attributes@@></div>',
						'  <div class="input-group-btn">',
						'    <button type="button" class="btn btn-default dropdown-toggle"' + (inForm ? '@@disabled@@' : '') + '>',
						'      <span class="caret"></span>',
						'    </button>',
						'<button ng-show="' + !options.hiddenClearButton + '" class="btn btn-default control-icons ico-input-delete" data-ng-click="clearValue()"></button>',
						' </div>',
						'</div>',
						].join('');
					break;

				case 'fileselect':
					var fsMaxSize = options.maxSize || '2MB';
					var fsAccept = options.fileFilter || ' * ';
					var fsmultiSelect = options.multiSelect ? ' ngf-multiple="true"' : ' ngf-multiple="false"';
					var fsReadOnlyDelete = (function (attrs, inForm) {
						if (!inForm) {
							return ' data-ng-disabled="!hasData()"';
						}

						var readonly = attrs.readonly === 'true';
						return readonly ? 'disabled' : (' data-ng-disabled="((!hasData()) || (' + attrs.readonly + '))"');

					})(attrs, inForm);

					var fsReadOnlySelect = (function (attrs, inForm) {
						if (!inForm) {
							return '';
						}

						var readonly = attrs.readonly === 'true';
						return readonly ? 'disabled' : (' data-ng-disabled="' + attrs.readonly + '"');

					})(attrs, inForm);

					markup = [
						'<div class="input-group @@cssclass@@ @@controlflag@@" data-ngf-multiple="false" platform-file-select-handler @@attributes@@>',
						'  <div name="fileName" class="input-group-content" data-ng-bind="name" readonly="readonly"></div>',
						'  <div class="input-group-btn">',
						'     <button class="btn btn-default control-icons ico-input-delete2" data-ng-click="deleteData()" title="{{ ::btnDeleteTitle }}"' + fsReadOnlyDelete + '></button>',
						'     <button class="btn btn-default control-icons ico-input-lookup" name="fileInput" data-accept="' + fsAccept + '" data-ngf-model-invalid="errFile" data-ngf-max-size="' + fsMaxSize + '" data-ngf-select="uploadFiles($files, $invalidFiles)"' + fsReadOnlySelect + fsmultiSelect + '></button>',
						'  </div>',
						'</div>'].join('');
					break;

				case 'customtranslate':
					markup = [
						'<div class="input-group @@cssclass@@ @@controlflag@@" data-platform-customtranslate-handler @@attributes@@>',
						'  <input ng-change="onTranslationChanged()" type="text" ng-model="value" class="input-group-content" @@readonly@@ placeholder="" data-platform-select-on-focus>',
						'  <div class="input-group-btn">',
						'    <button ng-show="' + !options.hiddenClearButton + '" data-ng-click="clearLanguage($event)" class="btn btn-default ico-input-delete2 control-icons" @@disabled@@></button>',
						'    <button data-ng-click="openDialog($event)" data-ng-keyup="onKeyUp($event)" class="btn btn-default ico-translation control-icons" @@disabled@@></button>',
						'  </div>',
						'</div>'
					].join('');
					break;

				case 'color':
				case 'colorpicker':
					bindingBase = (inForm ? attrs.config + '.' : '') + 'rt$callbacks.';
					tmp = _.get(options, 'showClearButton', false) || _.get(config, 'editorOptions.showClearButton', false) ?
						'<div class="input-group-btn">' +
						'<button class="btn btn-default control-icons ico-input-delete" data-ng-disabled="' + bindingBase + 'isDeleteBtnDisabled()" data-ng-click="' + bindingBase + 'clearColor()" data-tabstop="true" tabindex="1"></button>' +
						'</div>'
						: '';

					markup =
						'<div class="@@cssclass@@ @@controlflag@@ input-group">' +
						checkToInfoText('left') +
						'<div class="color-group" @@readonly@@>' +
						'<div class="color-picker">' +
						'<input type="color" @@disabled@@ data-platform-color-converter data-platform-color-handler @@attributes@@>' +
						'<svg class="overlay" data-ng-if="' + bindingBase + 'showOverlay()">' +
						'<line x1="0" y1="100%" x2="100%" y2="0" style="stroke:var(--input-border-color);stroke-width:var(--border-width-default)"/>' +
						'</svg>' +
						'</div>' +
						((inForm ? _.get(options, 'showHashCode', true) : _.get(config, 'editorOptions.showHashCode', false)) ?
							'<input type="text" class="input-group-content"  placeholder="#FFFFFF" style="text-transform:uppercase" maxlength="7" data-platform-select-on-focus data-platform-color-converter data-platform-color-handler @@attributes@@>'
							: '') +
						'</div>' +
						tmp +
						'</div>';
					break;

				case 'url':
					markup = [
						startdiv,
						'  <input type="url" class="input-group-content" data-platform-select-on-focus data-platform-url-handler data-platform-url-validation @@attributes@@>',
						'  <div class="input-group-btn" >',
						'  <button data-ng-disabled="isValid()" data-ng-click="openUrl()" class="btn btn-default control-icons ico-domain-url" data-tabstop="true"></button>',
						'  </div>',
						' </div>'].join('');
					break;

				case 'action':
					var actionList = attrs.model + '.actionList';
					markup = ['<div class="input-group-btn @@cssclass@@">',
						'<button data-ng-repeat="action in ' + actionList + '" class="btn btn-default control-icons ico-domain-url" title="{{action.toolTip||\'\'}}" data-ng-disabled="' + attrs.readonly + ' || action.readonly" data-tabstop="{{action.tabStop||true}}" data-ng-class="action.icon" data-ng-click="action.callbackFn(' + attrs.entity + ')"></button>',
						'<button class="btn btn-default" data-ng-if="' + actionList + ' === undefined || (' + actionList + ' !== undefined && ' + actionList + ' !== null && ' + actionList + '.length == 0)" style="visibility: hidden;"></button>',
						'</div>'].join('');
					break;

				case 'marker':
					tmp = (config.editorOptions && config.editorOptions.multiSelect) || (config.formatterOptions && config.formatterOptions.multiSelect) ? true : false;
					var considerReadonly = _.get(config, 'considerReadonly', false);
					if (considerReadonly) {
						markup = '<input type="' + (tmp ? 'checkbox' : 'radio" platform-marker-converter value="true') + '" class="@@cssclass@@ @@controlflag@@" @@attributes@@ @@disabled@@>';
					}
					else {
						markup = '<input type="' + (tmp ? 'checkbox' : 'radio" platform-marker-converter value="true') + '" class="@@cssclass@@ @@controlflag@@" @@attributes@@>';
					}

					break;

				case 'composite':
					markup = '<div class="flex-box @@cssclass@@ @@controlflag@@" @@attributes@@>';
					if (angular.isArray(config.composite)) {
						var actualModel = attrs.entity + (config.model ? '.' + config.model : '');
						platformTranslateService.translateObject(config.composite);
						config.composite.forEach(function (part, partIndex) {
							var endLabel = '';
							if (part.label && part.label !== '') {
								markup += '<div class="flex-element flex-box flex-align-center">';
								if (partIndex > 0) {
									markup += '<div class="margin-left-ld">';
								} else {
									markup += '<div>';
								}
								markup += part.label + '</div>';
								markup += '<div class="margin-left-ld flex-element">';
								endLabel = '</div></div>';
							}
							markup += '<div data-domain-control data-domain="' + part.type + '" data-entity="' + actualModel + '"';
							if (part.fill || (part.fill === null) || angular.isUndefined(part.fill)) {
								markup += ' class="flex-element"';
							} else {
								markup += ' class="auto-width"';
							}
							if (part.model) {
								markup += ' data-model="' + actualModel + '.' + part.model + '"';
							}
							if (attrs.config) {
								markup += ' data-config="' + attrs.config + '.composite[' + partIndex + ']"';
							}
							markup += '>' + endLabel + '</div>';
						});
					}
					markup += '</div>';
					break;

				case 'radio':
					if (inForm) {
						markup = '<div class="@@cssclass@@">';
						if (!options.groupName) {
							options.groupName = platformCreateUuid();
						}

						_.each(options.items, function (item, index) {
							var itemRoMarkup = ' data-ng-disabled="' + attrs.readonly + '"';
							if (options.disabledMember) {
								if (item[options.disabledMember]) {
									var readonlyMarkupValue = readonlyMarkup('radio', attrs);
									if (readonlyMarkupValue.trim() !== 'disabled') {
										itemRoMarkup = ' disabled';
									}
								}
							}
							var itemValuePath = 'angular.isDefined(' + attrs.config + '.options.items[' + index + '][' + attrs.config + '.options.idMember || ' + attrs.config + '.options.valueMember]) ? (' + attrs.config + '.options.items[' + index + '][' + attrs.config + '.options.idMember || ' + attrs.config + '.options.valueMember]) : (' + attrs.config + '.options.items[' + index + '][' + attrs.config + '.options.idMember || ' + attrs.config + '.options.valueMember])';
							var itemValue = angular.isDefined(options.items[index][options.idMember || options.valueMember]) ? (options.items[index][options.idMember || options.valueMember]) : (attrs.config.options.items[index][options.idMember || options.valueMember]);
							var itemDisplayValue = options.items[index][options.labelMember] || attrs.config.options.items[index][options.labelMember];
							var imageMarkup = '';
							if (options.showImage) {
								var src = iconService.select(item);
								imageMarkup = iconService.isCss() ? '<i class="block-image ' + src + '" style="margin-right: 3px;"></i>' : '<img  class="block-image" style="margin-right: 3px;"  src="' + src + '" />';
							}
							markup += '<div class="checkbox spaceToUp">';
							markup += '<input type="radio" name="' + options.groupName + '" id="' + options.groupName + '-' + itemValue + '" data-ng-value="' + itemValuePath + '"' + itemRoMarkup + ' @@attributes@@>';
							markup += '<label for="' + options.groupName + '-' + itemValue + '">' + imageMarkup + itemDisplayValue + '</label>';
							markup += '</div>';
						});

						markup += '</div>';
					} else {
						$log.warn('domain type: ' + domain + ' not supported in grid');
					}
					break;

				case 'image':
					$log.warn('image domain not supported!');
					break;

				default:
					$log.warn('unknown domain type: ' + domain);
			}

			return markup || '';
		}

		/**
		 * @ngdoc function
		 * @name modelOptions
		 * @function
		 * @methodOf platform.platformDomainControlService
		 * @description provides ngModelOptions for given domain type
		 * @param domain {string} domain type
		 * @param inForm {boolean} used in form or grid
		 * @param config {Object} Optionally, some additional configuration options.
		 * @returns {object} ngModelOptions
		 */
		function modelOptions(domain, inForm, config) { // jshint ignore:line
			var actualConfig = _.assign({
				suppressDebounce: false
			}, _.isObject(config) ? config : {});

			var options = null;

			if (inForm) {
				switch (domain) {
					case 'boolean':
					case 'select':
					case 'color':
					case 'colorpicker':
					case 'radio':
					case 'fileselect':
						break;

					case 'money':
					case 'decimal':
					case 'quantity':
					case 'factor':
					case 'exchangerate':
					case 'percent':
					case 'convert':
					case 'imperialft':
					case 'date':
					case 'dateutc':
					case 'datetime':
					case 'datetimeutc':
					case 'numcode':
					case 'multicode':
						options = '{ updateOn: \'blur\' }';
						break;

					default:
						options = '{ updateOn: \'default blur\'' + (actualConfig.suppressDebounce ? '' : ', debounce: { default: 2000, blur: 0}') + ' }';
				}
			} else {
				switch (domain) {
					case 'date':
					case 'dateutc':
					case 'datetime':
					case 'datetimeutc':
					case 'multicode':
						options = '{ updateOn: \'blur\' }';
						break;
				}
			}

			return options;
		}

		/**
		 * @ngdoc function
		 * @name readonlyMarkup
		 * @function
		 * @methodOf platform.platformDomainControlService
		 * @description provides ng-disabled or ng-readonly markup for given domain type
		 * @param domain {string} domain type
		 * @param attrs {object} attributes of directive
		 * @returns {string} markup
		 */
		function readonlyMarkup(domain, attrs) {
			if (attrs) {
				var readonly = attrs.readonly === 'true';

				switch (domain) {
					case 'boolean':
					case 'select':
					case 'inputselect':
					case 'disabled':
					case 'imageselect':
					case 'customtranslation':
						return readonly ? ' disabled' : (' data-ng-disabled="' + attrs.readonly + '"');
					case 'radio':
						return readonly ? ' disabled' : '';

					default:
						return readonly ? ' readonly' : (' data-ng-readonly="' + attrs.readonly + '"');
				}
			}

			return '';
		}

		/**
		 * @ngdoc function
		 * @name gridInputKeyHandlerMarkup
		 * @function
		 * @methodOf platform.platformDomainControlService
		 * @description provides platform-grid-key-handler directive or empty markup for given domain type
		 * @param domain {string} domain type
		 * @returns {string} markup
		 */
		function gridInputKeyHandlerMarkup(domain) { // jshint ignore: line
			switch (domain) {
				case 'code':
				case 'numcode':
				case 'description':
				case 'history':
				case 'translation':
				case 'email':
				case 'password':
				case 'money':
				case 'integer':
				case 'quantity':
				case 'factor':
				case 'exchangerate':
				case 'percent':
				case 'decimal':
				case 'time':
				case 'timeutc':
				case 'date':
				case 'dateutc':
				case 'datetime':
				case 'datetimeutc':
				case 'remark':
				case 'comment':
				case 'convert':
				case 'durationsec':
				case 'imperialft':
					return ' data-platform-grid-control-key-handler';
			}

			return '';
		}

		return {
			modelOptions: modelOptions,
			readonlyMarkup: readonlyMarkup,
			controlMarkup: controlMarkup,
			gridInputKeyHandlerMarkup: gridInputKeyHandlerMarkup
		};
	}
})();
