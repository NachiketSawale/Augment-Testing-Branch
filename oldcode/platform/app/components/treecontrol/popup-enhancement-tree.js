(function (angular) {
	'use strict';

	angular.module('platform')
		.directive('platformTreeEnhancementWrapperDirective', platformTreeEnhancementWrapperDirective);

	platformTreeEnhancementWrapperDirective.$inject = ['$compile'];

	function platformTreeEnhancementWrapperDirective($compile) {
		return {
			restrict: 'AE',
			require: '?^ngModel',
			scope: {
				data: '=',
				level: '=?',
				doubleclick: '&',
				itemclick: '&'
			},
			template: '<div data-ng-show="data.displayed" class="category-tree">' +
				'<ul class="overflow">' +
				'<li ng-repeat="dir in data.ChildItems" data-ng-class="{\'selected\': dir.selected}">' +
				'<button data-ng-click="displayChildCatalog($index)" class="flex-box" data-ng-dblclick="check()" data-ng-attr-title="{{dir.DescriptionInfo.Translated}}">' +
				'<span class="flex-element ellipsis">{{dir.Code}} {{dir.DescriptionInfo.Translated}}</span>' +
				'<i data-ng-if="dir.HasChildren" class="block-image control-icons ico-tree-collapse"></i>' +
				'</button>' +
				'</li>' +
				'</ul>' +
				'<div platform-tree-enhancement-wrapper-directive ng-repeat="dir in data.ChildItems" data="dir" level="level" class="fullheight" doubleclick="doubleclick()" itemclick="itemclick()"></div>' +
				'</div>',
			compile: function () {
				return {
					pre: function (scope, element) {
						// first: build html markup. Categories are shown with display show/true

						// Break the recursion loop by removing the contents
						var childelement = element.contents().remove();
						var compiledHTMLMarkupContents;

						// Compile the contents
						if (!compiledHTMLMarkupContents) {
							compiledHTMLMarkupContents = $compile(childelement);
						}
						// Re-add the compiled contents to the element
						compiledHTMLMarkupContents(scope, function (clone) {
							element.append(clone);
						});
					},
					post: function (scope, iElement, iAttrs, controller) {

						// The first time set false
						scope.htmlMarkupRendered = false;

						// every Category-section get a level. So you know, which container have to displayed none or show
						if (!angular.isDefined(scope.level)) {
							scope.level = 0;
						} else {
							scope.level = scope.level + 1;
						}

						// check is attribute in scope.
						scope.check = function () {
							if (scope.doubleclick) {
								scope.doubleclick();
							}
						};

						function setChildItemsForTemplate(items, index) {
							// show container if this item have childItems.
							if (items) {
								scope.data.ChildItems[index].ChildItems = items;
								scope.data.ChildItems[index].displayed = true;
							}

							// set ngModel
							controller.$setViewValue(scope.data.ChildItems[index]);
							controller.$render();
						}

						// click event on category
						scope.displayChildCatalog = function (index) {
							// set selected and display on default(false)
							scope.resetCategoriesAttributes(scope.data.ChildItems, index);

							// set select-status for the clicked item
							scope.data.ChildItems[index].selected = true;

							if (scope.data.ChildItems[index].HasChildren) {
								if (scope.data.ChildItems[index].ChildItems === null && scope.itemclick) {
									scope.itemclick().then(function (response) {
										setChildItemsForTemplate(response, index);

									});
								} else {
									setChildItemsForTemplate(scope.data.ChildItems[index].ChildItems, index);
								}
							}
						};

						// set all Categories on false.
						scope.resetCategoriesAttributes = function (item, index) {
							// all child-items set selected=false
							angular.forEach(item, function (object) {
								object.selected = false;
								object.displayed = false;
								scope.resetCategoriesAttributes(object.ChildItems, index);
							});
						};

						// next display Block Container. Every Block has a level
						scope.$watch('level', function (val) {
							if (val === 0) {
								scope.data.displayed = true;
							}
						});

						scope.$watch('data', function (newV, oldV) {
							if (scope.htmlMarkupRendered) {
								// Reset only between the main categories
								scope.resetCategoriesAttributes(oldV.ChildItems);
							}

							scope.data = newV;
							if (scope.level === 0 && scope.data.ChildItems.length > 0) {
								scope.data.displayed = true;
							}
							// After the first call.
							scope.htmlMarkupRendered = true;
						});
					}
				};
			} // compile
		}; // return
	}

	angular.module('platform')
		.directive('platformTreeEnhancementDirective', platformTreeEnhancementDirective);

	function platformTreeEnhancementDirective() {
		return {
			restrict: 'AE',
			require: '?^ngModel',
			scope: {
				data: '=',
				dataModel: '=ngModel',
				doubleclick: '&',
				itemclick: '&'
			},
			template: '<div platform-tree-enhancement-wrapper-directive data="data" ng-model="dataModel" class="fullheight" doubleclick="doubleclick()" itemclick="itemclick()"></div>',
			link: function (scope) {
				scope.allFiles = [];

				getAllFiles(scope.data);

				function getAllFiles(data) {
					angular.forEach(data.ChildItems, function (dir) {
						getAllFiles(dir);
					});
				}

				// Watch for data change
				scope.$watch('data', function (newV, oldV) {
					if (angular.isDefined(newV)) {
						if (newV.ChildItems.length > 0) {
							scope.allFiles = [];
							getAllFiles(newV);
						}
					}
				});
			}
		};
	}
})(angular);
