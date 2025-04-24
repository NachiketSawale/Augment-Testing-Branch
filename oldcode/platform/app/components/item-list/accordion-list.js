(function () {
	'use strict';
	// placeholder pattern for templates. Example: {{id}}
	var phBinding = /{{.*?}}/g; // match {{variables}}
	var phBinding$$ = /\$\$.*\$\$/g;  // added 11.Jun.2015 @rei
	// placeholder for items in the grouped template
	var phItems = /##items##/g;

	/**
	 *
	 * @param scope
	 * @param cs
	 * @returns {*|Object}
	 */
	function makeChildScopeWithClean(scope, cs) {
		if (cs) {
			cs.$destroy();
		}
		return scope.$new(false);
	}

	/**
	 * @ngdoc function
	 * @name addItems
	 * @function
	 * @methodOf
	 * @description
	 * @param {Array} markUp - The mark up for the items.
	 * @param {Array} items - The items to render.
	 * @param {string} itemTemplate - Template for one item.
	 * @param {boolean} dollarBinding - determines whether
	 * @param _
	 * @param $sanitize
	 * @returns {Array} markUp - Result of the replace.
	 */
	function addItems(markUp, items, itemTemplate, dollarBinding,_, $sanitize) {
		var bindings = dollarBinding ? itemTemplate.match(phBinding$$) : itemTemplate.match(phBinding);
		let tempItem = '';
		for (var i = 0; i < items.length; i++) {
			tempItem = itemTemplate;

			for (var b = 0; b < bindings.length; b++) {
				var prop = bindings[b].substring(2, bindings[b].length - 2);
				var value = _.result(items[i], prop, '');
				if (angular.isFunction(items[i][prop])) {
					value = items[i][prop]();
				}
				value = _.isString(value)? $sanitize(value): value;
				tempItem = tempItem.replace(bindings[b],  value);
			}
			markUp.push(tempItem);
		}

		return markUp;
	}

	function getGroupTemplate(groupTemplate, $templateCache) {
		return groupTemplate ? groupTemplate : $templateCache.get('platform/accordion-group.html');
	}

	function getItemTemplate(itemTemplate, $templateCache) {
		return itemTemplate ? itemTemplate : $templateCache.get('platform/list-items.html');
	}

	/**
	 * @ngdoc function
	 * @name itemListDirective
	 * @function
	 * @methodOf
	 * @description
	 * @param _
	 * @param $sanitize
	 * @param {object} $compile       angular's compile service.
	 * @param {object} $templateCache angular's template cache
	 * @returns {object} A list directive.
	 */
	function accordionListDirective(_,$sanitize,$compile, $templateCache) {
		return {
			restrict: 'A',
			scope: {
				list: '=',
				itemTemplate: '=',
				clickFn: '=',
				dollarbinding: '='  // if true we use $$item$$ as palceholder instead of {{item}}
			},
			link: function (scope, elem) {
				var childscope;
				scope.$watchCollection(function () {
					return scope.list;
				},
				function (newValue) {
					if (newValue) {
						var markUp = [];

						addItems(markUp, newValue, getItemTemplate(scope.itemTemplate, $templateCache), scope.dollarbinding,_, $sanitize);
						elem.children().remove();
						childscope = makeChildScopeWithClean(scope, childscope);
						elem.append(angular.element($compile(angular.element(markUp.join('')))(childscope)));
					}
				});
			}
		};
	}

	/**
	 * @ngdoc function
	 * @name groupedItemListDirective
	 * @function
	 * @methodOf
	 * @description
	 * @param {object} $compile - The angular service.
	 * @param {object} _ - Wrapper for underscore / lowdash
	 * @param $sanitize
	 * @param {object} $templateCache
	 * @returns {object} A list directive.
	 */
	function groupedAccordionListDirective(_,$sanitize,$compile, $templateCache) {
		return {
			restrict: 'A',
			scope: {
				groupedList: '=',
				groupedListCfg: '=?', // to hold a configuration object, e.g. to use in clickFn function
				itemTemplate: '=',
				groupTemplate: '=',
				toggleClickFn: '=',
				clickFn: '=',
				childProperty: '=',
				keyProperty: '=',
				dollarbinding: '='  // if true we use $$item$$ as placeholder instead of {{item}}
			},
			link: function (scope, elem) {
				var childscope;
				if (_.isUndefined(scope.groupedListCfg)) {
					scope.groupedListCfg = {};
				}

				function refresh() {
					var markUp = [];
					var groupMarkUp = [];
					var itemsMarkUp = [];
					for (var i = 0; scope.groupedList && (i < scope.groupedList.length); i++) {
						itemsMarkUp.length = 0;
						groupMarkUp.length = 0;
						// set icon-css-class. toggle accordion is up or down
						scope.groupedList[i].toggleClass = scope.groupedList[i].visible ? 'ico-up' : 'ico-down';
						addItems(groupMarkUp, [scope.groupedList[i]], getGroupTemplate(scope.groupTemplate, $templateCache), scope.dollarbinding,_, $sanitize);
						if (scope.groupedList[i].visible) {
							addItems(itemsMarkUp, scope.groupedList[i][scope.childProperty], getItemTemplate(scope.itemTemplate, $templateCache), scope.dollarbinding,_, $sanitize);
							markUp.push(groupMarkUp.join('').replace(phItems, itemsMarkUp.join('')));
						} else {
							markUp.push(groupMarkUp.join('').replace(phItems, ''));
						}

					}
					elem.children().remove();
					childscope = makeChildScopeWithClean(scope, childscope);
					elem.append(angular.element($compile(angular.element(markUp.join('')))(childscope)));
				}

				// click on accordion-header
				scope.invert = function (groupKey) {
					var group = _.find(scope.groupedList, _.set({}, scope.keyProperty || 'key', groupKey));

					group.visible = !group.visible;

					if (_.isFunction(scope.toggleClickFn)) {
						scope.toggleClickFn(groupKey);
					}

					refresh();
				};

				scope.$watchCollection(function () {
					return scope.groupedList;
				}, refresh);
			}
		};
	}

	angular.module('platform').directive('platformAccordionListDirective', ['_','$sanitize','$compile', '$templateCache', accordionListDirective]);
	angular.module('platform').directive('platformGroupedAccordionListDirective', ['_','$sanitize','$compile', '$templateCache', groupedAccordionListDirective]);

	angular.module('platform').run(['$templateCache', function ($templateCache) {
		$templateCache.loadTemplateFile('app/components/item-list/accordion-templates.html');
	}]);

})();
