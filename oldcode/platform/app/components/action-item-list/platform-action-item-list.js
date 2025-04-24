(function () {
	'use strict';

	angular.module('platform').directive('platformActionItemList', platformActionItemList);

	platformActionItemList.$inject = ['_', 'platformActionItemListService', 'platformTranslateService'];

	function platformActionItemList(_, platformActionItemListService, platformTranslateService) {
		return {
			restrict: 'A',
			scope: {
				setLink: '&',
			},
			template: '<div data-platform-action-item-list-content data-ng-class="list.cssClass" platform-refresh-on="version"></div>',
			link: function (scope, elem) {

				function sortFields() {
					scope.list.items.sort(function (a, b) {
						if (!_.isObject(a) || !_.isObject(b)) {
							return 0;
						}
						if (a.sortOrder === b.sortOrder) {
							return 0;
						}
						if (a.sortOrder < b.sortOrder) {
							return -1;
						} else {
							return 1;
						}
					});
				}

				function hideItem(f) {
					var idx = _.findIndex(scope.list.items, {id: f.id});
					if (idx >= 0) {
						scope.list.items.splice(idx, 1);
					}
				}

				function addItem(f, subField) {
					f = platformActionItemListService.addDefaultSettings(f);
					if (subField.hasOwnProperty('list')) {
						subField.list.items.push(f);
					} else {
						subField.items.push(f);
					}
					return f;
				}

				function changeFieldProcess(changeField, listOfFields, existFieldInList) {
					if (existFieldInList) {
						_.assign(existFieldInList, changeField);
					} else {
						// if item dont exist in the list, then add this new object in the list
						addItem(changeField, listOfFields);
					}
				}

				function changeFields(changedFields, subId, arrayIndex) {
					changedFields.forEach(function (f) {
						var origField = _.find(scope.list.items, {id: f.id});
						var subField, childField;
						if (subId) {
							subField = _.find(scope.list.items, {id: subId});
						}

						if (arrayIndex && arrayIndex > -1 && scope.list.items[arrayIndex]) {
							scope.list.items.splice(arrayIndex, 0, f);
							return;
						}

						// if a delete-key existing, and that is true. then remove this item from list
						if (f.hasOwnProperty('disable') && !f.disable) {
							hideItem(f);
						}
						// if item exist in the list, then only update this object
						else if (subField && subField.hasOwnProperty('list')) {
							childField = _.find(subField.list.items, {id: f.id});
							changeFieldProcess(f, subField, childField);
						} else {
							changeFieldProcess(f, scope.list, origField);
						}
					});
				}

				var loadTranslations = function (newFields) {
					// load translation ids and convert result to object
					platformTranslateService.translateObject(newFields, undefined, {recursive: true});
				};

				scope.linkObject = {
					setFields: function (newList) {
						scope.$evalAsync(function () {
							loadTranslations(newList);
							var normalizedFields = platformActionItemListService.processForNormalizedFields(newList);

							scope.list = newList;
							scope.list.items = normalizedFields;
							sortFields();

							scope.version++;
						});
					},
					updateFields: function (changedFields) {
						scope.$evalAsync(function () {
							changeFields(changedFields);
							sortFields();

							scope.version++;
						});
					},
					updateFieldsById: function (changedFields, subId) {
						scope.$evalAsync(function () {
							changeFields(changedFields, subId);
							sortFields();

							scope.version++;
						});
					},
					addFieldsByIndex: function (changedFields, arrayIndex, subId) {
						scope.$evalAsync(function () {
							changeFields(changedFields, subId, arrayIndex);

							scope.version++;
						});
					},
					update: function () {
						scope.$evalAsync(function () {
							scope.version++;
						});
					}
				};
				scope.setLink({
					link: scope.linkObject
				});

				scope.list = [];

				scope.version = 0;
			}
		};
	}
})();
