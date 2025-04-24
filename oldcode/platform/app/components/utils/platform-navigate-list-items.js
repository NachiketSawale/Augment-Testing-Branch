(function () {
	'use strict';

	/*
	Set event.focus() for the first element to navigate container.
	Using:
		<div platform-navigate-list-items-toggler list-items-selector="'.quickstart-items'">

		list-items-selector contains the css-class from target-container in DOM
 */
	angular.module('platform').directive('navigateListItemsToggler', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attribute) {

				element.bind('keydown', function (event) {

					var keycodes = [13, 40];
					if (keycodes.indexOf(event.keyCode) > -1) {
						event.stopPropagation();
						event.preventDefault();

						// key 'Down arrow'
						if (event.keyCode === 40) {
							// select first item in the list
							angular.element(scope.listItemsSelector).eq(0).trigger('focus');
						}
					}
				});
			},
			scope: {
				listItemsSelector: '='
			}
		};
	});

	/**
	 * Navigate list items using keyboard
	 *
	 * Using:
	 * <div platform-navigate-list-items list-items-selector="'.quickstart-items'">
	 *
	 * list-items-selector contains the css-class from the container in DOM, which items are navigated through
	 */
	angular.module('platform').directive('platformNavigateListItems', platformNavigateListItems);

	platformNavigateListItems.$inject = ['basicsLookupdataPopupService'];

	function platformNavigateListItems(basicsLookupdataPopupService) {
			return {
				restrict: 'AC',
				link: function (scope, element, attribute) {
					angular.element(element).addClass('key-navigate');
					/*
					The parent node of the items to be navigated gets this event.
					Otherwise I have to include a keydown event for each element.
				*/
					function navigationKeydown(event) {
						let keycodes = [9, 13, 27, 38, 40];
						if (keycodes.indexOf(event.keyCode) > -1) {
							event.stopPropagation();
							event.preventDefault();

							// key 'Enter'
							if (event.keyCode === 13) {
								angular.element(document.activeElement).trigger('click');
							}

							let items = getChildElements();

							// document.activeElement -->get active element of focus using
							navigateItems(event, angular.element(document.activeElement), items);
						}
					}

					setTimeout(function() {
						element.bind('keydown', navigationKeydown);
					}, 0);

					function getChildElements() {
						/*
							get all button/input elements from handed css-class,
							and the elements isn't disabled, and not hidden
						 */
						return element.find('button:visible, input:visible').not(':disabled');
					}
				},
				scope: {
					listItemsSelector: '='
				}
			};

			function navigateItems(event, current, items) {
				/*
				get the position(index) from current element form the list of the navigate item-elements
				 */
				let index = items.index(angular.element(current));

				// key'Tab' and 'Up arrow'
				if ((event.shiftKey && event.keyCode === 9) || event.keyCode === 38) {

					// focus on pre of current item
					index = index - 1;

					if (index >= 0) {
						items.eq(index).trigger('focus');
					}
				}
				// key 'Shift Tab' and 'Down arrow'
				else if (event.keyCode === 9 || event.keyCode === 40) {

					// focus on next of current item
					index = index + 1;

					if (index < items.length) {
						items.eq(index).trigger('focus');
					}
				}
			}
		}
})();