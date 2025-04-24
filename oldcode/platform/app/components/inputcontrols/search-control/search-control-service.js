(function (angular) {
	'use strict';

	angular.module('platform').factory('platformSearchControlService', platformSearchControlService);

	platformSearchControlService.$inject = ['$translate', 'searchControlOperatorService'];

	function platformSearchControlService($translate, searchControlOperatorService) {
		var service = {};
		var defaultOperators = ['contains', 'starts', 'ends'];

		// JSON Object for the radio-buttotn directive
		service.getRadioGroupOption = function (ids) {
			// if has ids no value, then default value is used
			var operators = ids.length === 0 ? defaultOperators : ids;

			return searchControlOperatorService.getOperatorsByIds(operators).then(function (response) {
				return {
					displayMember: 'description',
					valueMember: 'value',
					cssMember: 'cssClass',
					items: response
				};
			});
		};

		// mapping scope-options to object for action-item-list directive
		service.getMappedOptionsFields = function (option, selectedItems) {
			var items = [];

			// config for ALL Items. Is static
			items.push(getObjectForItem('allItemsFromSystem', option.multipleSelect, (selectedItems && selectedItems.length > 0 ? false : true), '', $translate.instant('platform.searchcontrol.allItems'), 'allItemsFromSystem'));

			angular.forEach(option.fields, function (field) {
				items.push(getObjectForItem(field.id, option.multipleSelect, (_.includes(selectedItems, field.id) ? true : false), field.iconClass, field[option.displayMember], field[option.valueMember]));
			});

			return items;
		};

		function updateItemFields(info, id, isSelected) {
			info.scope.linkObject.updateFields([{
				id: id,
				selected: isSelected,
				cssClass: isSelected ? 'selected' : ''
			}]);
		}

		function getObjectForItem(id, multipleSelect, selected, iconClass, text, value) {
			return {
				id: id,
				type: multipleSelect ? 'item' : 'radio',
				selected: selected,
				iconClass: iconClass || '',
				cssClass: 'btn-default' + (selected && multipleSelect ? ' selected' : ''),
				caption: text,
				value: value,
				visible: true,
				fn: function (id, options, info) {
					if (multipleSelect && info.scope.linkObject) {
						/*
							If ALL Items clicked -> only this is selected.
							If one of the items selected -> All Items is deselected
						 */
						if (id === 'allItemsFromSystem') {
							let selectedItems = _.filter(info.scope.$parent.list.items, {'selected': true});
							_.forEach(selectedItems, function (item) {
								updateItemFields(info, item.id, false);
							});
						} else {
							updateItemFields(info, 'allItemsFromSystem', false);
						}

						updateItemFields(info, id, !options.selected);
					}
				}
			};
		}

		// options for initialize popup-container
		service.getPopupOption = function () {
			return {
				multiPopup: false,
				plainMode: true,
				hasDefaultWidth: false,
				minWidth: 200,
				containerClass: 'flex-column',
				templateUrl: globals.appBaseUrl + 'app/components/inputcontrols/search-control/search-control-popup-template.html',
				level: 0
			};
		};

		return service;
	}
})(angular);