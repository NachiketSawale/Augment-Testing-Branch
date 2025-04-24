(function (angular) {
	'use strict';

	angular.module('platform').directive('scrollTabsDirective', scrollTabsDirective);

	scrollTabsDirective.$inject = ['_', '$', '$compile', 'platformObjectHelper'];

	function scrollTabsDirective(_, $, $compile, platformObjectHelper) {
		return {
			restrict: 'E',
			scope: {
				tabs: '=',
				clickFunction: '&',
				options: '='
			},
			link: function ($scope, elem) {

				var destroyWatch = $scope.$watch(function () {
					return $scope.tabs;
				}, function (tabs) {
					if (_.isArray(tabs) && !_.isEmpty(tabs)) {
						var defaultOptions = {
							displayNameProperty: 'title',
							showTooltip: true,
							tabMaxWidth: 150,
							hideTab: function (tab) {
								return tab.IsHidden;
							},
							initialTabIndex: 0
						};

						var options = {};
						_.forEach(Object.keys(defaultOptions), function (key) {
							options[key] = $scope.options ? $scope.options[key] || defaultOptions[key] : defaultOptions[key];
						});

						var rootElement = $('<div>');
						rootElement.prop('id', 'scroll-tabs-wrapper');
						var tabList = $('<ul>');
						tabList.prop('id', 'scroll-tabs-list');

						tabs = _.filter(tabs, function (tab, index) {
							tab.index = index;
							return !options.hideTab(tab);
						});

						_.forEach(tabs, function (tab, i) {
							var tabElement = $('<li>');
							tabElement.addClass('scroll-tabs-tab');

							var maxWidth = options.tabMaxWidth ? options.tabMaxWidth + 'px' : '150px';
							tabElement.css('max-width', maxWidth);

							if (i === options.initialTabIndex) {
								tabElement.addClass('tab_selected');
							}
							var tabName = _.get(tab, options.displayNameProperty) ? _.get(tab, options.displayNameProperty) : 'title';

							if (platformObjectHelper.isSet(options.showTooltip) ? options.showTooltip : true) {
								tabElement.attr('title', tabName);
							}
							tabElement.attr('data-ng-click', 'clickFunction()(tabs[' + tab.index + '])');
							tabElement.prop('id', 'scroll-tabs-tab-' + i);
							tabElement.text(tabName);

							tabList.append(tabElement);
						});

						rootElement.append(tabList);
						$(tabList).scrollTabs();
						elem.replaceWith($compile(rootElement)($scope));
						if (_.isFunction($scope.clickFunction())) {
							$scope.clickFunction()(tabs[options.initialTabIndex]);
						}

						destroyWatch();
					}
				});
			}
		};
	}
})(angular);