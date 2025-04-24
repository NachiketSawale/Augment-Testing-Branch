/**
 * Created by lvy on 3/15/2024
 */
(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,_ ,$ */
	'use strict';
	const moduleName = 'procurement.common';

	angular.module(moduleName).directive('prcCommonItemTotalCallOffQuantityDirective', ['$compile', 'platformDomainService', 'platformDomainControlService',
		function ($compile, platformDomainService, platformDomainControlService) {
			return {
				restrict: 'A',
				scope: false,
				link: function (scope, elem, attrs) {
					const type = 'money';
					const inGrid = !_.isUndefined(attrs.grid);
					const config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
					const options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};
					const domain = _.assign({}, platformDomainService.loadDomain(type) || {});
					let precision = _.get(config, 'options.decimalPlaces', _.get(options, 'decimalPlaces', domain.precision));
					if (_.isFunction(precision)) {
						precision = precision(config, config.model);
						if(_.isNil(precision)) {
							precision = domain.precision || 0;
						}
					}

					if(!inGrid) {
						if(config.readonly) {
							attrs.readonly = 'true';
						} else {
							if (scope.$eval(attrs.config + '.rt$readonly')) {
								attrs.readonly = attrs.readonly && scope.$eval(attrs.readonly) ? attrs.readonly : attrs.config + '.rt$readonly()';
							}
						}
					}

					const bindModel = (attrs.model || attrs.ngModel) + (!inGrid && domain.model ? '.' + domain.model : '');
					const showWarningSign = 'entity.' + config.model + ' > entity.' + config.options.comparisonField;
					const totalCallOffWaringSignHtml = config.options.warningSignHtml;
					let template = `
									<div class="control-directive">
										<div readonly>
											<div class=" @@cssclass@@">
												<div class="input-group-content" style="justify-content: end; padding: 0 4px;">
													<span data-ng-if="`+showWarningSign+`">` + totalCallOffWaringSignHtml + `</span>
													<span style="justify-content: end;" data-ng-bind="` + bindModel + ` | calloffquantityformat:` + precision + `" @@attributes@@></span>
												</div>
											</div>
										</div>
									</div>`;
					const attrList = [
						'data-ng-model="' + (attrs.model || attrs.ngModel) + (!inGrid && domain.model ? '.' + domain.model : '') + '"',
						!inGrid ? ' data-platform-control-validation' : platformDomainControlService.gridInputKeyHandlerMarkup(type),
						!attrs.readonly ? '' : platformDomainControlService.readonlyMarkup(type, attrs),
						!type ? '' : ' data-domain="' + (type) + '"',
						!attrs.config ? '' : ' data-config="' + attrs.config + '"',
						!attrs.options ? '' : ' data-options="' + attrs.options + '"',
						!attrs.entity ? '' : ' data-entity="' + attrs.entity + '"',
						!attrs.id ? '' : ' id="' + attrs.id + '"',
						!attrs.grid ? '' : ' data-grid="' + attrs.grid + '"',
						' data-ng-class="' + attrs.colorinfo + '"',
						!config.tooltip ? '' : ' title="' + config.tooltip + '"'
					];
					const cssList = [
						'domain-type-' + type,
						!config ? '' : inGrid ? ' grid-control' : ' form-control',
						!attrs.class ? '' : ' ' + attrs.class,
						!options || !options.cssClass ? '' : ' ' + options.cssClass
					];

					template = template
						.replace(/@@attributes@@/g, attrList.join(''))
						.replace(/@@cssclass@@/g, cssList.join(''));

					let content = $compile(template)(scope);
					elem.replaceWith(content);
				}
			};
		}]);

	angular.module(moduleName)
		.filter('calloffquantityformat', [
			'accounting',
			'platformContextService',
			'platformLanguageService',
			'platformDomainService',
			function(
				accounting,
				platformContextService,
				platformLanguageService,
				platformDomainService) {
				return function(value, precision) {
					let formatterText = value;
					if (!_.isNil(value) && !_.isNil(precision)) {
						const culture = platformContextService.culture();
						const cultureInfo = platformLanguageService.getLanguageInfo(culture);
						const domainInfo = platformDomainService.loadDomain('money');
						formatterText = accounting.formatNumber(value, precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
					}
					return formatterText;
				}
			}]);
})(angular);