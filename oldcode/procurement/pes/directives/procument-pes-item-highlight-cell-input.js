/**
 * Created by lvy on 5/7/2019.
 */
(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,_ ,$ */
	'use strict';
	var moduleName = 'procurement.pes';

	angular.module(moduleName).directive('procumentPesItemHighlightCellInput', ['$compile', 'platformDomainService', 'platformDomainControlService',
		function ($compile, platformDomainService, platformDomainControlService) {
			return {
				restrict: 'A',
				scope: false,
				link: function (scope, elem, attrs) { // jshint ignore : line
					var type = 'money';

					var inGrid = false;
					var config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
					var options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};
					var domain = _.assign({}, platformDomainService.loadDomain(type) || {});

					if (attrs.regex) {
						domain.regex = attrs.regex;
					} else if(config.regex) {
						domain.regex = config.regex;
					} else if(domain.regexTemplate) {
						var regexTemplate = domain.regexTemplate;

						if(attrs.maxLength || config.maxLength) {
							regexTemplate = regexTemplate.replace(/@@maxLength/g, attrs.maxLength || config.maxLength);
						}

						if(attrs.decimalPlaces || options.decimalPlaces) {
							regexTemplate = regexTemplate.replace(/@@decimalPlaces/g, attrs.decimalPlaces || options.decimalPlaces);
						}

						if(regexTemplate !== domain.regexTemplate) {
							domain.regex = regexTemplate;
						}
					}

					if(domain.regex && domain.disallowNegative && config.disallowNegative) {
						domain.regex = domain.regex.replace(/\[-\+]\?/g, '[+]?');
					}

					if (attrs.mandatory) {
						domain.mandatory = (attrs.mandatory === 'true');
					}

					attrs.ngModelOptions = platformDomainControlService.modelOptions(type, !inGrid, {
						suppressDebounce: !!attrs.suppressDebounce
					});

					if(attrs.modelOptions) {
						attrs.ngModelOptions = attrs.modelOptions;
					}

					if(!attrs.change) {
						// change tracking on entity
						if(attrs.dirty || config.change) {
							attrs.change = attrs.config + '.rt$change()';
						}
					}

					if(!inGrid) {
						// create binding when used outside of grid, in grid readonly is handled in slickgrid internally
						if(config.readonly) {
							attrs.readonly = 'true';
						} else {
							// lookup of readonly in __rt$data in form; provided by row definition in form-content
							if (scope.$eval(attrs.config + '.rt$readonly')) {
								attrs.readonly = attrs.readonly && scope.$eval(attrs.readonly) ? attrs.readonly : attrs.config + '.rt$readonly()';
							}
						}

						attrs.colorinfo = attrs.config + '.rt$colorInfo()';
					}

					var template = '<input type="text" class="text-right @@cssclass@@" data-platform-select-on-focus data-platform-numeric-converter @@attributes@@>';
					var attrList = [
						'data-ng-model="' + (attrs.model || attrs.ngModel) + (!inGrid && domain.model ? '.' + domain.model : '') + '"',
						!inGrid ? ' data-platform-control-validation' : platformDomainControlService.gridInputKeyHandlerMarkup(type),
						!attrs.ngModelOptions ? '' : ' data-ng-model-options="' + attrs.ngModelOptions + '"',
						!domain.regex ? '' : ' data-ng-pattern-restrict="' + domain.regex + '"',
						!domain.mandatory ? '' : ' required',
						!attrs.readonly ? '' : platformDomainControlService.readonlyMarkup(type, attrs),
						!attrs.change ? '' : ' data-ng-change="' + attrs.change + '"',
						!attrs.enterstop ? '' : ' data-enterstop="' + attrs.enterstop + '"',
						!attrs.uom ? '' : ' data-uom="' + attrs.uom + '"',
						!attrs.fraction ? '' : ' data-fraction="' + attrs.fraction + '"',
						!attrs.tabstop ? '' : ' data-tabstop="' + attrs.tabstop + '"',
						!type ? '' : ' data-domain="' + (type) + '"',
						!attrs.config ? '' : ' data-config="' + attrs.config + '"',
						!attrs.options ? '' : ' data-options="' + attrs.options + '"',
						!attrs.entity ? '' : ' data-entity="' + attrs.entity + '"',
						!attrs.id ? '' : ' id="' + attrs.id + '"',
						!attrs.grid ? '' : ' data-grid="' + attrs.grid + '"',
						' data-ng-class="' + attrs.colorinfo + '"',
						!config.tooltip ? '' : ' title="' + config.tooltip + '"',
						' data-ng-style="{\'background-color\': entity.' + config.options.judgeIsHighlightField + '?\'' + config.options.hightlightColor + '\':\'none\'}"'
					];
					var cssList = [
						'domain-type-' + type,
						!config ? '' : inGrid ? ' grid-control' : ' form-control',
						!attrs.class ? '' : ' ' + attrs.class,
						!options || !options.cssClass ? '' : ' ' + options.cssClass
					];

					template = template
						.replace(/@@attributes@@/g, attrList.join(''))
						.replace(/@@cssclass@@/g, cssList.join(''));

					var content = $compile(template)(scope);
					content.on('focus', function () {
						if (this.readOnly === false) {
							$(this).attr('stylebeforefoucs',$(this).attr('style'));
							$(this).attr('style', 'background-color:none');
						}
					});
					content.on('blur', function () {
						if (this.readOnly === false) {
							$(this).attr('style', $(this).attr('stylebeforefoucs'));
						}
					});
					elem.replaceWith(content);
				}
			};
		}]);
})(angular);
