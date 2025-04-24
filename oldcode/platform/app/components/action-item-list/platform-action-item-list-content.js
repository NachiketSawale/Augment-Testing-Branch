(function () {
	'use strict';

	angular.module('platform').directive('platformActionItemListContent', platformActionItemListContent);

	function platformActionItemListContent() {
		return {
			restrict: 'A',
			template:
				'<ul class="left-side item-list-content">' +
				'<li data-ng-repeat="item in list.items | filter:{align:\'left\'}" title="{{item.toolTip}}" platform-action-item-list-element class="item-list-element" data-ng-class="item.parentCssClass"></li>' +
				'</ul>' +
				'<ul class="right-side item-list-content">' +
				'<li data-ng-repeat="item in list.items | filter:{align:\'right\'}" title="{{item.toolTip}}" platform-action-item-list-element class="item-list-element" data-ng-class="item.parentCssClass"></li>' +
				'</ul>'
		};
	}

	angular.module('platform').directive('platformActionItemListElement', platformActionItemListElement);

	platformActionItemListElement.$inject = ['$compile', 'basicsLookupdataPopupService', '$timeout', 'platformActionItemListHTMLMarkups', 'platformActionItemListService'];

	function platformActionItemListElement($compile, basicsLookupdataPopupService, $timeout, platformActionItemListHTMLMarkups, platformActionItemListService) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, element) {

				if (scope.item.type === 'sublist') {

					scope.list = scope.item.list;

					var normalizedFields = platformActionItemListService.processForNormalizedFields(scope.list);

					scope.list.items = normalizedFields;
				}

				var itemTemplate = platformActionItemListHTMLMarkups[_.camelCase(scope.item.type)].template;

				var iconElement = scope.item.iconClass ? getIconTemplate() : '';

				itemTemplate = itemTemplate.replace('##subIco##', iconElement);

				if (scope.item.hasOwnProperty('fn') && _.isFunction(scope.item.fn)) {
					createFnForButton(scope.item);
				}

				element.append($compile(itemTemplate)(scope));

				function getIconTemplate(iconCssClass) {
					var icoTemplate = '';
					// was ist wenn nur iconclass als background css initialisiert ist. testen
					if (!!scope.item.showSVGTag && scope.item.svgSprite && scope.item.svgImage) {
						icoTemplate = platformActionItemListHTMLMarkups.svg.template;
					}
					return icoTemplate;
				}

				function createFnForButton(item) {
					if (_.isFunction(item.fn)) {
						if (_.isFunction(_.get(scope, 'list.itemFnWrapper'))) {
							item.fnWrapper = (that, id, event) => {
								scope.list.itemFnWrapper.apply(that, [item, event, {
									scope: scope, callItemFn: (info) => {
										item.fn.apply(that, [id, item, {scope: scope, event: event, info: info}]);
									}
								}]);
							};
						} else {
							item.fnWrapper = (that, id, event) => {
								// format in json-object: item.fn: function(id, item, itemObject)
								item.fn.apply(this, [item.id, item, {scope: scope, e: event}]);

								// When the user clicks to deselect an item, remove the focus from the current element
								// to ensure the highlight state in the UI matches the actual selection state
								if (event && event.currentTarget){
									event.currentTarget.blur();
								}

								if (!scope.list.openPopUpAfterItemClick) {
									// to close the popup after click
									basicsLookupdataPopupService.hidePopup(0);
								}

								// update scope
								scope.$parent.linkObject.update();
							};
						}
					}
				}

				scope.getValueForBtnRadio = (object) => {
					return object.value ? (angular.isNumber(object.value) ? object.value : object.value.toString()) : object.value;
				};

				var instance;

				// render container for popup
				scope.executeFn = () => {
					var options = scope.item.popupOptions || {};

					// check how many popup-container is open in DOM
					var level = angular.element(event.currentTarget).parents('.popup-container').length > 0 ? angular.element('.popup-container').length : 0;

					scope.list = scope.item.list;

					var normalizedFields = platformActionItemListService.processForNormalizedFields(scope.list);

					scope.list.items = normalizedFields;

					var dropDownTemplate = '<ul data-platform-action-item-list-content class="popup-wrapper" data-init-once data-popup></ul>';

					instance = basicsLookupdataPopupService.toggleLevelPopup($.extend({}, {
						scope: scope,
						focusedElement: $(event.currentTarget),
						template: dropDownTemplate,
						level: level,
						multiPopup: false,
						plainMode: true,
						hasDefaultWidth: false
					}, options));
					if (!(_.isNull(instance) || _.isUndefined(instance))) {
						instance.opened.then(() => {
							$timeout(() => {
								scope.$digest();
							}, 0);
						});

						instance.closed.then(() => {
							instance = null;
						});
					}

					scope.list.instance = instance;
				};
			}
		};
	}
})();
