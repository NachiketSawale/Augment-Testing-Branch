/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class PlatformDomainControlService {
	platformCreateUuid: any;

	constructor(
		private translate: PlatformTranslateService // private platformIconBasisService: PlatformIconBasisService //private platformTranslateService: PlatformTranslateService // private platformCreateUuid: PlatformCreateUuid, // private platformStatusIconService: PlatformStatusIconService,
	) {}

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
	controlMarkup(domain: string, attrs: any, config: any, options: any, inForm: boolean) {
		// jshint ignore:line
		let markup: any;
		let tmp;
		let bindingBase;
		let tokens;

		switch (domain) {
			case 'code':
				markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-code-converter @@attributes@@>';
				break;

			case 'numcode':
				markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-numeric-code-converter @@attributes@@>';
				break;

			case 'multicode':
				markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-multi-code-converter @@attributes@@>';
				break;

			case 'description':
				markup = '<input type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus @@attributes@@>';
				break;

			case 'history':
				markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" @@attributes@@>';
				break;

			case 'translation':
				markup = '<input type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-translation-converter @@attributes@@>';
				break;

			case 'email':
				markup = '<input type="email" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-email-validation @@attributes@@>';
				break;

			case 'password':
				markup = '<input type="password" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus @@attributes@@>';
				break;

			case 'iban':
				markup = '<input type="text" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus data-platform-i-b-a-n-converter data-platform-i-b-a-n-validation @@attributes@@>';
				break;

			case 'convert':
			case 'imperialft':
				markup = '<input type="text" class="@@cssclass@@ @@controlflag@@ text-right" data-platform-select-on-focus data-platform-unit-converter @@attributes@@>';
				break;

			case 'durationsec':
				markup = '<input type="text" class="@@cssclass@@ @@controlflag@@ text-right" data-platform-select-on-focus data-platform-duration-converter @@attributes@@>';
				break;

			case 'money':
			case 'integer':
			case 'quantity':
			case 'uomquantity':
			case 'linearquantity':
			case 'factor':
			case 'exchangerate':
			case 'percent':
			case 'decimal':
				const infoText = _.isString(options.infoText) ? `<span class="info-text form-icon-box tlb-icons ico-info" title="${options.infoText}"></span>` : undefined;

				markup = `<div class="input-group ${infoText ? 'info' : ''} @@cssclass@@"><input type="text" class="@@controlflag@@ input-group-content text-right" data-platform-select-on-focus data-platform-numeric-converter @@attributes@@>`;
				if (infoText) {
					markup = markup + infoText;
				}
				markup = markup + '</div>';
				break;

			case 'time':
			case 'timeutc':
				markup = '<input type="time" class="@@cssclass@@ @@controlflag@@" data-platform-time-converter @@attributes@@>';
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
						'</div>',
					].join('');
				}
				break;

			case 'boolean':
				markup =
					'<div class="' +
					(inForm ? '' : 'text-center ') +
					'@@cssclass@@ @@controlflag@@"><input type="checkbox" @@attributes@@' +
					(!options.ctrlId ? '' : ' id="{{' + attrs.options + '.ctrlId}}"') +
					'>' +
					(!options.labelText ? '</div>' : '<label for="{{' + attrs.options + '.ctrlId}}">{{' + attrs.options + '.labelText}}</label></div>');
				break;

			case 'text':
			case 'remark':
			case 'comment':
				if (inForm) {
					markup = '<textarea data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" data-platform-select-on-focus @@attributes@@></textarea>';
				} else {
					markup = '<input type="text" data-ng-trim="false" class="@@cssclass@@ @@controlflag@@" @@attributes@@>';
				}
				break;

			case 'select':
				markup = [
					'<div class="input-group @@cssclass@@ @@controlflag@@">',
					'  <div class="input-group-content" data-platform-select-converter data-platform-select-handler tabindex="-1" @@attributes@@></div>',
					'  <div class="input-group-btn" >',
					'    <button type="button" class="btn btn-default dropdown-toggle"' + (inForm ? '@@disabled@@' : '') + '>',
					'      <span class="caret"></span>',
					'    </button>',
					'  </div>',
					'</div>',
				].join('');
				break;

			case 'inputselect':
				tmp = attrs.options || (config && config.options ? attrs.config + '.options' : false) || (options ? 'options' : false) || null;
				markup = [
					'<div class="input-group @@cssclass@@ @@controlflag@@">',
					this.controlMarkup(options.inputDomain || config.inputDomain, attrs, config, {}, inForm)
						.replace('@@attributes@@', 'data-platform-input-select-handler data-platform-input-select-converter @@attributes@@')
						.replace('@@cssclass@@', 'input-group-content domain-type-' + options.inputDomain || config.inputDomain),
					'  <div class="input-group-btn">',
					'    <button type="button" class="btn btn-default dropdown-toggle"' + (inForm ? '@@disabled@@' : '') + '>',
					'      <span class="caret"></span>',
					'    </button>',
					'  </div>',
					'</div>',
				].join('');
				break;

			case 'imageselect':
				markup = [
					'<div class="input-group @@cssclass@@ @@controlflag@@">',
					'  <div class="input-group-content" data-platform-image-select-handler tabindex="-1" @@attributes@@></div>',
					'  <div class="input-group-btn">',
					'    <button type="button" class="btn btn-default dropdown-toggle"' + (inForm ? '@@disabled@@' : '') + '>',
					'      <span class="caret"></span>',
					'    </button>',
					'  </div>',
					'</div>',
				].join('');
				break;

			case 'fileselect':
				const fsMaxSize = options.maxSize || '2MB';
				const fsAccept = options.fileFilter || ' * ';
				const fsmultiSelect = options.multiSelect ? ' ngf-multiple="true"' : ' ngf-multiple="false"';
				const fsReadOnlyDelete = (function (attrs, inForm) {
					if (!inForm) {
						return ' data-ng-disabled="!hasData()"';
					}

					const readonly = attrs.readonly === 'true';
					return readonly ? 'disabled' : ' data-ng-disabled="((!hasData()) || (' + attrs.readonly + '))"';
				})(attrs, inForm);

				const fsReadOnlySelect = (function (attrs, inForm) {
					if (!inForm) {
						return '';
					}

					const readonly = attrs.readonly === 'true';
					return readonly ? 'disabled' : ' data-ng-disabled="' + attrs.readonly + '"';
				})(attrs, inForm);

				markup = [
					'<div class="input-group @@cssclass@@ @@controlflag@@" data-ngf-multiple="false" platform-file-select-handler @@attributes@@>',
					'  <div name="fileName" class="input-group-content" data-ng-bind="name" readonly="readonly"></div>',
					'  <div class="input-group-btn">',
					'     <button class="btn btn-default control-icons ico-input-delete2" data-ng-click="deleteData()" title="{{ ::btnDeleteTitle }}"' + fsReadOnlyDelete + '></button>',
					'     <button class="btn btn-default control-icons ico-input-lookup" name="fileInput" data-accept="' +
						fsAccept +
						'" data-ngf-model-invalid="errFile" data-ngf-max-size="' +
						fsMaxSize +
						'" data-ngf-select="uploadFiles($files, $invalidFiles)"' +
						fsReadOnlySelect +
						fsmultiSelect +
						'></button>',
					'  </div>',
					'</div>',
				].join('');
				break;

			case 'customtranslate':
				markup = [
					'<div class="input-group @@cssclass@@ @@controlflag@@" data-platform-customtranslate-handler @@attributes@@>',
					'  <input ng-change="onTranslationChanged()" type="text" ng-model="value" class="input-group-content" @@readonly@@ placeholder="" data-platform-select-on-focus>',
					'  <div class="input-group-btn">',
					'    <button data-ng-click="clearLanguage($event)" class="btn btn-default ico-input-delete2 control-icons" @@disabled@@></button>',
					'    <button data-ng-click="openDialog($event)" data-ng-keyup="onKeyUp($event)" class="btn btn-default ico-translation control-icons" @@disabled@@></button>',
					'  </div>',
					'</div>',
				].join('');
				break;

			case 'color':
			case 'colorpicker':
				bindingBase = (inForm ? attrs.config + '.' : '') + 'rt$callbacks.';
				tmp =
					_.get(options, 'showClearButton', false) || _.get(config, 'editorOptions.showClearButton', false)
						? '<div class="input-group-btn">' +
						  '<button class="btn btn-default control-icons ico-input-delete" data-ng-disabled="' +
						  bindingBase +
						  'isDeleteBtnDisabled()" data-ng-click="' +
						  bindingBase +
						  'clearColor()" data-tabstop="true" tabindex="1"></button>' +
						  '</div>'
						: '';

				markup =
					'<div class="@@cssclass@@ @@controlflag@@ input-group">' +
					'<div class="color-group" @@readonly@@>' +
					'<div class="color-picker">' +
					'<input type="color" @@disabled@@ data-platform-color-converter data-platform-color-handler @@attributes@@>' +
					'<svg class="overlay" data-ng-if="' +
					bindingBase +
					'showOverlay()">' +
					'<line x1="0" y1="100%" x2="100%" y2="0" style="stroke:var(--input-border-color);stroke-width:var(--border-width-default)"/>' +
					'</svg>' +
					'</div>' +
					((inForm ? _.get(options, 'showHashCode', true) : _.get(config, 'editorOptions.showHashCode', false))
						? '<input type="text" class="input-group-content"  placeholder="#FFFFFF" style="text-transform:uppercase" maxlength="7" data-platform-select-on-focus data-platform-color-converter data-platform-color-handler @@attributes@@>'
						: '') +
					'</div>' +
					tmp +
					'</div>';
				break;

			case 'url':
				markup = [
					'<div class="input-group @@cssclass@@ @@controlflag@@">',
					'  <input type="url" class="input-group-content" data-platform-select-on-focus data-platform-url-handler data-platform-url-validation @@attributes@@>',
					'  <div class="input-group-btn" >',
					'  <button data-ng-click="openUrl()" class="btn btn-default control-icons ico-domain-url" data-tabstop="true"></button>',
					'  </div>',
					' </div>',
				].join('');
				break;

			case 'action':
				const actionList = attrs.model + '.actionList';
				markup = '<div class="input-group @@cssclass@@">';
				markup += '<div class="input-group-btn">';
				markup +=
					'<button data-ng-repeat="action in ' +
					actionList +
					'" class="btn btn-default control-icons ico-domain-url" title="{{action.toolTip||\'\'}}" @@disabled@@ data-tabstop="{{action.tabStop||true}}" data-ng-class="action.icon" data-ng-click="action.callbackFn(' +
					attrs.entity +
					')"></button>';
				markup += '<button class="btn btn-default" data-ng-if="' + actionList + ' === undefined || (' + actionList + ' !== undefined && ' + actionList + ' !== null && ' + actionList + '.length == 0)" style="visibility: hidden;"></button>';
				markup += '</div>';
				markup += '</div>';
				break;

			case 'marker':
				tmp = (config.editorOptions && config.editorOptions.multiSelect) || (config.formatterOptions && config.formatterOptions.multiSelect) ? true : false;
				markup = '<input type="' + (tmp ? 'checkbox' : 'radio" platform-marker-converter value="true') + '" class="@@cssclass@@ @@controlflag@@" @@attributes@@>';
				break;

			case 'composite':
				markup = '<div class="flex-box @@cssclass@@ @@controlflag@@" @@attributes@@>';
				if (_.isArray(config.composite)) {
					const actualModel = attrs.entity + (config.model ? '.' + config.model : '');
					//this.platformTranslateService.translateObject(config.composite, [], options);
					config.composite.forEach((part: any, partIndex: any) => {
						let endLabel = '';
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
						if (part.fill || part.fill === null || _.isUndefined(part.fill)) {
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
					markup = '<div class"@@cssclass@@ @@controlflag@@"><fieldset style="border: none;">';

					if (!options.groupName) {
						options.groupName = this.platformCreateUuid;
					}

					_.each(options.items, (item, index) => {
						let itemRoMarkup = ' data-ng-disabled="' + attrs.readonly + '"';
						if (options.disabledMember) {
							if (item[options.disabledMember]) {
								const readonlyMarkupValue = this.readonlyMarkup('radio', attrs);
								// if (readonlyMarkupValue.trim() !== 'disabled') {
								// 	itemRoMarkup = ' disabled';
								// }
							}
						}
						const itemValuePath =
							'angular.isDefined(' +
							attrs.config +
							'.options.items[' +
							index +
							'][' +
							attrs.config +
							'.options.idMember || ' +
							attrs.config +
							'.options.valueMember]) ? (' +
							attrs.config +
							'.options.items[' +
							index +
							'][' +
							attrs.config +
							'.options.idMember || ' +
							attrs.config +
							'.options.valueMember]) : (' +
							attrs.config +
							'.options.items[' +
							index +
							'][' +
							attrs.config +
							'.options.idMember || ' +
							attrs.config +
							'.options.valueMember])';
						const itemValue = _.isUndefined(options.items[index][options.idMember || options.valueMember])
							? options.items[index][options.idMember || options.valueMember]
							: attrs.config.options.items[index][options.idMember || options.valueMember];
						const itemDisplayValue = options.items[index][options.labelMember] || attrs.config.options.items[index][options.labelMember];
						const imageMarkup = '';
						if (options.showImage) {
							//select() and isCss() comes from icon-basis-service and need to change that service
							//const src = this.platformIconBasisService.select(item);
							// imageMarkup = this.platformIconBasisService.isCss() ? '<i class="block-image ' + src + '" style="margin-right: 3px;"></i>' : '<img  class="block-image" style="margin-right: 3px;"  src="' + src + '" />';
						}
						markup += '<div>';
						markup += '<input type="radio" name="' + options.groupName + '" id="' + options.groupName + '-' + itemValue + '" data-ng-value="' + itemValuePath + '"' + itemRoMarkup + ' @@attributes@@>';
						markup += '<label for="' + options.groupName + '-' + itemValue + '">' + imageMarkup + itemDisplayValue + '</label>';
						markup += '</div>';
					});

					markup += '</fieldset></div>';
				} else {
					// $log.warn('domain type: ' + domain + ' not supported in grid');
					// console.log('domain type: ' + domain + ' not supported in grid');
				}
				break;

			case 'image':
				//  $log.warn('image domain not supported!');
				// console.log('image domain not supported!');

				break;

			default:
			// $log.warn('unknown domain type: ' + domain);
			// console.log('unknown domain type: ' + domain);
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
	modelOptions(domain: string, inForm: boolean, config: any) {
		// jshint ignore:line
		const actualConfig = _.assign(
			{
				suppressDebounce: false,
			},
			_.isObject(config) ? config : {}
		);

		let options = null;

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
				case 'quantity':
				case 'uomquantity':
				case 'linearquantity':
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
					options = "{ updateOn: 'blur' }";
					break;

				default:
					options = "{ updateOn: 'default blur'" + (actualConfig.suppressDebounce ? '' : ', debounce: { default: 2000, blur: 0}') + ' }';
			}
		} else {
			switch (domain) {
				case 'date':
				case 'dateutc':
				case 'datetime':
				case 'datetimeutc':
				case 'multicode':
					options = "{ updateOn: 'blur' }";
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
	readonlyMarkup(domain: string, readonlyAttr: string) {
		if (readonlyAttr) {
			const readonly = readonlyAttr === 'true';
			//let isDisabled:boolean=false
			switch (domain) {
				case 'boolean':
				case 'select':
				case 'inputselect':
				case 'disabled':
				case 'imageselect':
				case 'customtranslation':
					return readonly ? true : false;
				case 'radio':
					return readonly ? true : false;

				default:
					return readonly ? true : false;
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
	gridInputKeyHandlerMarkup(domain: string) {
		// jshint ignore: line
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
			case 'uomquantity':
			case 'linearquantity':
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
}
