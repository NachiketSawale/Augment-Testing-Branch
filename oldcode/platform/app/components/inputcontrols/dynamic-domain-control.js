/*
 * $Id: dynamic-domain-control.js 590184 2020-06-09 12:32:10Z balkanci $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('dynamicDomainControl', domainControl);

	domainControl.$inject = ['$compile', '_'];

	/*
	 Usage:
	 <div dynamic-domain-control data-domain="myDomain" data-model="myModel"></div>

	 attributes:
	 model: the angular data model
	 regex: a regex which defines the boundaries of the entered string
	 */
	function domainControl($compile) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem, attrs) { // jshint ignore:line
				if (!_.isUndefined(attrs.grid)) {
					throw new Error('dynamic domain control can be used in grid only!');
				}

				var config = (attrs.config ? scope.$eval(attrs.config) : null) || {};
				var domain = getDomain();

				function getDomain() {
					return config.domain || scope.$eval(attrs.domain) || attrs.domain;
				}

				function getPlaceHolder() {
					return angular.isDefined(attrs.placeholderText) ? scope.$eval(attrs.placeholderText) : '';
				}

				var placeholderText = getPlaceHolder();

				if (_.isFunction(domain)) {
					domain = domain(scope.$eval(attrs.entity), config);
				}

				if (!domain) {
					throw new Error('domain not defined by attrs.domain of attrs.config.domain');
				}

				domain = null;

				// noinspection HtmlUnknownAttribute
				var template = '<div domain-control data-placeholder="$$placeholderText$$" data-domain="$$domain$$" $$placeholder$$></div>';
				var placeholder = _.reduce(attrs, function (result, value, key) {
					switch (key) {
						case 'dynamicDomainControl':
						case '$attr':
						case '$$element':
							break;
						case 'ngModelOptions':
							result += (result.length ? ' ' : '') + 'data-' + 'model-options' + (value && value.length ? ('="' + value + '"') : '');
							break;

						default:
							result += (result.length ? ' ' : '') + 'data-' + _.kebabCase(key) + (value && value.length ? ('="' + value + '"') : '');
					}

					return result;
				}, '');
				var unregister = [];

				template = template.replace(/\$\$placeholder\$\$/, placeholder);

				function render(domain) {
					domain = (domain === 'translation' && scope.$eval(attrs.downgradeTranslation) === true) ? 'remark' : domain;
					var placeHolderText = getPlaceHolder();
					var replaced = template.replace(/\$\$domain\$\$/, domain).replace(/\$\$placeholderText\$\$/, placeHolderText);
					var newElem = angular.element(replaced);

					elem.html('');
					elem.append(newElem);

					$compile(newElem)(scope);
				}

				unregister.push(scope.$watch(attrs.model, function () {
					var newDomain = getDomain();

					if (_.isFunction(newDomain)) {
						newDomain = newDomain(scope.$eval(attrs.entity), config);
					}

					if (domain !== newDomain) {
						domain = newDomain;
						render(domain);
					}
				}));

				unregister.push(scope.$on('domainChanged', function () {
					var newDomain = getDomain();
					var newPlaceholder = getPlaceHolder();

					if (_.isFunction(newDomain)) {
						newDomain = newDomain(scope.$eval(attrs.entity), config);
					}

					if ((domain !== newDomain && newDomain) || (placeholderText !== newPlaceholder && newPlaceholder)) {
						domain = newDomain;
						render(domain);
					}
				}));

				function onPlaceholderChanged(newPlaceholder, oldPlaceholder) {
					if (newPlaceholder !== oldPlaceholder) {
						render(getDomain());
					}
				}

				unregister.push(scope.$watch(getPlaceHolder, onPlaceholderChanged));

				unregister.push(scope.$on('$destroy', function () {
					_.over(unregister)();
					unregister = null;
				}));
			}
		};
	}
})(angular);