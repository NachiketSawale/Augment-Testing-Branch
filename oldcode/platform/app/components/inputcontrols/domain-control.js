/*
 * $Id: domain-control.js 623961 2021-02-17 12:38:18Z uestuenel $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('domainControl', domainControl);

	domainControl.$inject = ['_', '$compile', 'platformDomainService', 'platformDomainControlService', 'platformE2eUtilService'];

	/*
	 Usage:
	 <div domain-control domain="integer" data-model="myModel" regex="regex"></div>
	 or
	 <div domain-control domain="integer"></div>

	 attributes:
	 model: the angular data model
	 regex: a regex which defines the boundaries of the entered string
	 */
	function domainControl(_, $compile, platformDomainService, platformDomainControlService, platformE2eUtilService) {

		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem, attrs) { // jshint ignore:line
				if (!attrs.domain) {
					throw new Error('domain not defined');
				}

				let inGrid = !_.isUndefined(attrs.grid) ? true : false;
				let config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
				let options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};
				let domain = _.assign({}, platformDomainService.loadDomain(options.inputDomain || config.inputDomain || attrs.domain) || {});
				let _model = (attrs.model || attrs.ngModel) + (!inGrid && domain.model ? '.' + domain.model : '');

				if (attrs.platformAutofocus) {
					attrs.autofocus = attrs.platformAutofocus;
				}

				if (attrs.regex) {
					domain.regex = attrs.regex;
				} else if (config.regex) {
					domain.regex = config.regex;
				} else if (domain.regexTemplate) {
					let regexTemplate = domain.regexTemplate;

					if (attrs.maxLength || config.maxLength) {
						regexTemplate = regexTemplate.replace(/@@maxLength/g, attrs.maxLength || config.maxLength);
					}

					if (attrs.decimalPlaces || options.decimalPlaces) {
						let precision = attrs.decimalPlaces || options.decimalPlaces;

						if(_.isFunction(precision)) {
							precision = precision(config, inGrid ? config.field : config.model);

							if(_.isNil(precision)) {
								precision = domain.precision || 0;
							}
						}
						regexTemplate = regexTemplate.replace(/@@decimalPlaces/g, precision);
					}

					if (regexTemplate !== domain.regexTemplate) {
						domain.regex = regexTemplate;
					}
				}

				if (domain.regex && domain.disallowNegative && config.disallowNegative) {
					domain.regex = domain.regex.replace(/\[(?:\+-|-\+)\]\?/g, '[+]?');
				}

				if (attrs.mandatory) {
					domain.mandatory = (attrs.mandatory === 'true');
				}

				attrs.ngModelOptions = platformDomainControlService.modelOptions(attrs.domain, !inGrid, {
					suppressDebounce: !!attrs.suppressDebounce
				});

				if (attrs.modelOptions) {
					attrs.ngModelOptions = attrs.modelOptions;
				}

				if (config.limits) {
					domain.limits = config.limits;
				}

				if (!attrs.change) {
					// change tracking on entity
					if (attrs.dirty || config.change) {
						attrs.change = attrs.config + '.rt$change()';
					}
				}

				if (!inGrid) {
					// create binding when used outside of grid, in grid readonly is handled in slickgrid internally
					if (config.readonly) {
						attrs.readonly = 'true';
					} else {
						// lookup of readonly in __rt$data in form; provided by row definition in form-content
						if (scope.$eval(attrs.config + '.rt$readonly')) {
							attrs.readonly = attrs.readonly && scope.$eval(attrs.readonly) ? attrs.readonly : attrs.config + '.rt$readonly()';
						}
					}

					if (config.placeholder && !attrs.placeholder) {
						attrs.placeholder = _.isFunction(config.placeholder) ? ('{{' + attrs.config + '.rt$placeholder()}}') : config.placeholder;
					}

					if (config.autofocus) {
						attrs.autofocus = config.autofocus;
					}

					if (config.autocomplete) {
						attrs.autocomplete = 'on';
					}

					attrs.colorinfo = attrs.config + '.rt$colorInfo()';

					if (scope.$eval(attrs.config + '.rt$hideContent')) {
						attrs.isHideContent = attrs.isHideContent && scope.$eval(attrs.isHideContent) ? attrs.isHideContent : attrs.config + '.rt$hideContent()';
					}
				}

				if (options.limits) {
					domain.limits = config.limits;
				}

				let template = platformDomainControlService.controlMarkup(attrs.domain, attrs, config || {}, options || {}, !inGrid);
				let attrList = [
					'data-ng-model="' + (attrs.model || attrs.ngModel) + (!inGrid && domain.model ? '.' + domain.model : '') + '"', // domain.model specifies a sub-property to be used
					!inGrid ? ' data-platform-control-validation' : platformDomainControlService.gridInputKeyHandlerMarkup(attrs.domain),
					!attrs.ngModelOptions ? '' : ' data-ng-model-options="' + attrs.ngModelOptions + '"',
					!domain.regex ? '' : ' data-ng-pattern-restrict="' + domain.regex + '"',
					!domain.mandatory ? '' : ' required',
					!attrs.readonly ? '' : platformDomainControlService.readonlyMarkup(attrs.domain, attrs),
					!attrs.change ? '' : ' data-ng-change="' + attrs.change + '"',
					!attrs.keyup ? '' : ' data-ng-keyup="' + attrs.keyup + '"',
					!attrs.keydown ? '' : ' data-ng-keydown="' + attrs.keydown + '"',
					!attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"',
					!attrs.uom ? '' : ' data-uom="' + attrs.uom + '"',
					!attrs.fraction ? '' : ' data-fraction="' + attrs.fraction + '"',
					!attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"',
					!attrs.domain ? '' : ' data-domain="' + (options.inputDomain || config.inputDomain || attrs.domain) + '"',
					!attrs.config ? '' : ' data-config="' + attrs.config + '"',
					!attrs.options ? '' : ' data-options="' + attrs.options + '"',
					!attrs.entity ? '' : ' data-entity="' + attrs.entity + '"',
					!attrs.placeholder ? '' : ' placeholder="' + attrs.placeholder + '"',
					!attrs.autocomplete ? '' : ' autocomplete="' + attrs.autocomplete + '"',
					_.isUndefined(attrs.autofocus) ? '' : (attrs.autofocus === '' ? ' autofocus' : ' data-autofocus="' + attrs.autofocus + '"'),
					!attrs.style ? '' : ' style="' + attrs.style + '"',
					!attrs.id ? '' : ' id="' + attrs.id + '"',
					!attrs.grid ? '' : ' data-grid="' + attrs.grid + '"',
					!config.tooltip ? '' : ' title="' + config.tooltip + '"'
				];
				let cssList = [
					'domain-type-' + attrs.domain,
					!attrs.class ? '' : ' ' + attrs.class,
					!options || !options.cssClass ? '' : ' ' + options.cssClass,
					platformE2eUtilService.getCssForTest({model: _model}, ['model'])
				];

				let controlFlag = !config ? '' : inGrid ? 'grid-control' : 'form-control'; // obsolete

				template = template
					.replace(/@@attributes@@/g, attrList.join(''))
					.replace(/@@cssclass@@/g, cssList.join(''))
					.replace(/@@controlflag@@/g, controlFlag)
					.replace(/@@readonly@@/g, platformDomainControlService.readonlyMarkup(attrs.domain, attrs))
					.replace(/@@disabled@@/g, platformDomainControlService.readonlyMarkup('disabled', attrs));

				let content = $compile(template)(scope);
				elem.replaceWith(content);
			}
		};
	}
})(angular);
