(function () {
	'use strict';

	angular.module('platform').directive('platformItemListTree', platformItemListTree);

	platformItemListTree.$inject = ['$compile'];

	function platformItemListTree($compile) {
		return {
			restrict: 'A',
			scope: {
				treeitems: '=',
				options: '=',
				searchmodule: '=?'
			},
			link: function (scope, elem) {
				var favContent = '';

				function buildHTMLMarkup(items) {
					if (items) {
						favContent = '<div data-ng-repeat="treeitem in treeitems track by $index" data-ng-if="!treeitem.disabled" class="treelist tree-accordion">' +
							'<div data-platform-item-list-tree-accordion-header data-treeitems="treeitems" data-treeitem="treeitem" data-options="options"></div>' +
							'<div data-ng-if="treeitem.tabs" data-platform-item-list-tree-accordion-content data-treeitem="treeitem" data-childs="treeitem.tabs" data-options="options" class="margin-left-ld"></div>' +
							'</div>';

						elem.empty();

						elem.append($compile(favContent)(scope));
					}
				}

				scope.$watch(function () {
					return scope.treeitems;
				}, function (newItem) {
					buildHTMLMarkup(newItem);
				});
			}
		};
	}

	angular.module('platform').directive('platformItemListTreeAccordionHeader', platformItemListTreeAccordionHeader);
	platformItemListTreeAccordionHeader.$inject = ['platformTranslateService', '$parse', 'platformStringUtilsService', '$compile'];

	function platformItemListTreeAccordionHeader(platformTranslateService, $parse, stringUtils, $compile) {

		return {
			restrict: 'A',
			scope: {
				treeitem: '=',
				options: '='
			},
			link: link
		};

		function link(scope, elem) {

			scope.expand = function (item, mouseclick) {
				/*
				13 --> ok
				37 --> left arrow
				39 --> right arrow
			 */
				var keycodes = [13, 37, 39];
				if (mouseclick || keycodes.indexOf(event.keyCode) > -1) {
					event.stopPropagation();
					event.preventDefault();

					if ((mouseclick && !item.expanded) || event.keyCode === 39) {
						scope.options.expandFn(item.id);
					} else if ((mouseclick && item.expanded) || event.keyCode === 37) {
						scope.options.collapseFn(item.id);
					}
					// key 'Enter'
					else if (event.keyCode === 13) {
						scope.header(item.id, event);
					}
				}
			};

			scope.header = function (id, event) {
				scope.options.clickHeaderFn(id, event);
			};

			var nodeTemplate = '<div class="projectname tree-accordion-header flex-box">' +
				'<div data-ng-show="treeitem.hasChildren" class="nodetoggleimg header-collapse control-icons" data-ng-click="expand(treeitem, true)" data-ng-class="{ \'ico-tree-expand\': treeitem.expanded, \'ico-tree-collapse\': !treeitem.expanded }"></div>' +
				'<div class="nodetoggle header-body flex-element" data-ng-style="{\'padding-left\': treeitem.hasChildren ? 0 : \'20px\'}">' +
				'<div ng-if="!treeitem.imgUrl" class="nodeimg app-small-icons" data-ng-class="treeitem.cssClass"></div>' +
				'<img ng-if="treeitem.imgUrl" class="nodeimg" data-ng-class="treeitem.cssClass" ng-src="{{treeitem.imgUrl}}" />' +
				'<button class="onClickNode nodetitle" title="{{treeitem.Description}}" data-ng-keydown="expand(treeitem, false)" data-ng-click="header(treeitem.id, $event)">' +
				'{{treeitem.Description}}' +
				'</button>' +
				'</div>' +
				'</div>';

			elem.append($compile(nodeTemplate)(scope));
		}
	}

	angular.module('platform').directive('platformItemListTreeAccordionContent', platformItemListTreeAccordionContent);
	platformItemListTreeAccordionContent.$inject = ['platformTranslateService', '$parse', 'platformStringUtilsService', '$compile'];

	function platformItemListTreeAccordionContent(platformTranslateService, $parse, stringUtils, $compile) {

		return {
			restrict: 'A',
			scope: {
				childs: '=',
				options: '=',
				treeitem: '='
			},
			link: tabLink
		};

		function tabLink(scope, elem) {

			scope.tabFn = function (id, tabId) {
				scope.options.clickTabFn(id, event, tabId);
			};

			let tabs = '<button data-ng-repeat="tab in childs.items" data-ng-if="tab.Isvisible" class="rw rw-content" data-ng-class="{\'active\': tab.active}" data-ng-click="tabFn(treeitem.id, tab.Id)">' +
				'{{tab.Description}}' +
				'</button>';

			elem.append($compile(tabs)(scope));

			let content = scope.childs;
		}
	}
})();
