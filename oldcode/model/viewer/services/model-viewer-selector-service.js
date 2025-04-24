/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSelectorService
	 * @function
	 *
	 * @description Manages model object selectors.
	 */
	angular.module('model.viewer').factory('modelViewerSelectorService', ['_', '$translate',
		function (_, $translate) {
			var service = {};

			var state = {
				categories: {},
				defaultCategory: {
					id: 'others',
					name: 'model.viewer.selectors.defaultCategory'
				},
				selectors: []
			};
			state.categories[state.defaultCategory.id] = state.defaultCategory;

			/**
			 * @ngdoc method
			 * @name registerCategory
			 * @function
			 * @methodOf modelViewerSelectorService
			 * @description Registers a new selector category.
			 * @param {Object} category The category definition as an object with an `id` and a `name` property.
			 *                          The ID is a unique string ID, the name is a translation key for the human-
			 *                          readable category name.
			 */
			service.registerCategory = function (category) {
				if (!category) {
					throw new Error('No category object found.');
				}

				var newCat = {
					id: category.id,
					name: category.name
				};
				state.categories[newCat.id] = newCat;
			};

			/**
			 * @ngdoc method
			 * @name registerSelector
			 * @function
			 * @methodOf modelViewerSelectorService
			 * @description Registers a new selector.
			 * @param {Object} selector A selector definition.
			 * @return {Number} The ID assigned to the selector.
			 */
			service.registerSelector = function (selector) {
				if (!selector) {
					throw new Error('No selector object found.');
				}
				if (!angular.isFunction(selector.getObjects)) {
					throw new Error('No object selection function found.');
				}

				var newSel = {
					id: state.selectors.length + 1,
					name: selector.name || '',
					category: selector.category || '',
					suggestToObjectSet: !!selector.suggestToObjectSet,
					isAvailable: angular.isFunction(selector.isAvailable) ? selector.isAvailable : function () {
						return true;
					},
					getObjects: selector.getObjects,
					createWizardSteps: angular.isFunction(selector.createWizardSteps) ? selector.createWizardSteps : null,
					createSettings: angular.isFunction(selector.createSettings) ? selector.createSettings : null
				};
				state.selectors.push(newSel);

				return newSel.id;
			};

			/**
			 * @ngdoc method
			 * @name getSelectorById
			 * @function
			 * @methodOf modelViewerSelectorService
			 * @description Retrieves a selector definition by its ID.
			 * @param {Number} id The selector ID.
			 * @return {Object} The selector definition.
			 */
			service.getSelectorById = function (id) {
				return _.clone(_.find(state.selectors, {id: id}));
			};

			/**
			 * @ngdoc method
			 * @name getSelectorTree
			 * @function
			 * @methodOf modelViewerSelectorService
			 * @description Returns a list of available selectors grouped by categories.
			 * @return {Array} The list of category objects.
			 */
			service.getSelectorTree = function () {
				var categoriesByName = {};

				state.selectors.forEach(function (sel) {
					if (sel.isAvailable()) {
						var selCat = categoriesByName[sel.category];
						if (!selCat) {
							selCat = [];
							if (state.categories[sel.category]) {
								categoriesByName[sel.category] = selCat;
							} else {
								categoriesByName[state.defaultCategory.id] = selCat;
							}
						}

						selCat.push(sel);
					}
				});

				return _.map(Object.keys(categoriesByName), function (catId, index) {
					var cat = state.categories[catId];
					return {
						id: 'c' + (index + 1),
						name: $translate.instant(cat.name),
						selectors: _.map(categoriesByName[catId], function (sel) {
							return {
								id: sel.id,
								name: $translate.instant(sel.name),
								selectors: null,
								isSelector: true,
								image: 'ico-object-selector'
							};
						})
					};
				});
			};

			return service;
		}]);
})(angular);
