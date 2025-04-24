/**
 * Created by wui on 4/13/2015.
 */

(function (angular) {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopInfoItem', ['$compile', function ($compile) {

		/*
		 *  case 1: in json-data: itemType: 'location' for example
		 *  or
		 *  case 2: in json-data: iconClass: 'icon-css'
		 */

		var itemTypes = {
			location: {
				iconClass: 'control-icons ico-location'
			},
			email: {
				iconClass: 'control-icons ico-mail'
			},
			phone: {
				iconClass: 'control-icons ico-phone'
			},
			fax: {
				iconClass: 'control-icons ico-fax'
			},
			web: {
				iconClass: 'control-icons ico-web'
			}
		};

		return {
			restrict: 'A',
			link: function (scope, element, attrs) {// jshint ignore:line
				if (!attrs.model) {
					throw new Error('Attribute model is necessary!');
				}

				var description = '',
					iconClass = 'control-icons',
					template = '<div class="marginBottom flex-box" data-ng-show="##model##" >' +
						'<div class="##iconClass## ##iconUrl##" ></div>' +
						'<div class="flex-element ##contentCss##">' +
						'<div data-ng-bind-html="##model##"></div>' +
						'##description##' +
						'</div>##navigator##</div>';

				var navigatorTpl = '<span class="sidebar-navigator"><div navigator-button data-entity="' + attrs.entity + '" data-model="' + attrs.field + '" data-config="' + attrs.navigatorConfigPath + ' "></div></span>';

				// read custom template
				// todo: temp for showing item and description in one row
				if (attrs.type && attrs.type === 'custom') {
					template = attrs.customTemplate || template;
				}

				if (attrs.type && itemTypes[attrs.type]) {
					iconClass = itemTypes[attrs.type].iconClass;
				}

				iconClass = attrs.iconClass || iconClass;
				description = attrs.description || description;

				if (attrs.hideIcon && scope.$eval(attrs.hideIcon)) {
					iconClass = '';
				}

				template = template.replace(/##model##/g, attrs.model)
					.replace(/##contentCss##/g, attrs.contentCss)
					.replace(/##description##/g, description ? '<div class="desc">{{ ' + description + ' }}</div>' : '')
					.replace(/##iconClass##/g, iconClass ? iconClass : '')
					.replace(/##iconUrl##/g, attrs.iconUrl ? '{{' + attrs.iconUrl + '}}"' : '')
					.replace(/##navigator##/g, attrs.navigatorConfigPath ? navigatorTpl : '');

				element.replaceWith($compile(template)(scope));
			}
		};

	}]);

})(angular);