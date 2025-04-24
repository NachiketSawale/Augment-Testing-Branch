/**
 * Created by zov on 10/14/2022.
 */

(function () {
	'use strict';
	/*global angular, _*/

	/**
	 * @ngdoc service
	 * @name ppsCommonOpenLookupDialogHelper
	 * @function
	 * @requires
	 *
	 * @description
	 * help to open lookup dialog directly (e.g. in a toolbar button)
	 *
	 */
	angular.module('productionplanning.common').factory('ppsCommonOpenLookupDialogHelper', [
		'$rootScope', '$compile', '$injector',
		function ($rootScope, $compile, $injector) {
			let service = {};

			/**
			 * @ngdoc function
			 * @name openLookupDialog
			 * @function
			 * @methodOf
			 * @description open Lookup Dialog
			 * @param {string} directiveElementName - directive element name like 'esource-equipment-plant-lookup-dialog-new'
			 * @param {function} fnToReceiveSelectedItems - function to receive selected items in lookup dialog
			 * @param {object} entityInitObj - entity with properties to initial (lookup) values in lookup dialog
			 * @param {Array} readonlyProps - array contains readonly properties names
			 * @param {Array} hideProps - array contains properties names to be hidden
			 * @param {Array} events - events to register, see lookup-input-base.js -> registerEvents function
			 * @returns {void}
			 */
			service.openLookupDialog = function openLookupDialog(directiveElementName, fnToReceiveSelectedItems,
																				entityInitObj, readonlyProps, hideProps, events) {
				// initial with lookup controller:  BasicsLookupdataLookupDirectiveDefinition.controller
				let scope = $rootScope.$new();
				scope.entity = !entityInitObj ? {} : Object.create(entityInitObj);
				scope.options = {
					defaultFilter: {},
					events: events || []
				};
				if(entityInitObj) {
					Object.keys(entityInitObj).forEach(key => scope.options.defaultFilter[key] = key);
				}
				if(_.isArray(readonlyProps)) {
					readonlyProps.forEach(propName => scope.options.defaultFilter[`${propName}ReadOnly`] = true);
				}
				if(_.isArray(hideProps)) {
					hideProps.forEach(propName => scope.options.defaultFilter[`${propName}Visible`] = false);
				}

				let lookupTemplate = `<div ${directiveElementName} data-ng-model="value" data-entity="entity" data-options="options">
												<div pps-common-expose-scope></div>
											</div>`;
				let content = angular.element(lookupTemplate);
				$compile(content)(scope);
				let exposeScopeCache = $injector.get('ppsCommonExposeScopeCache');
				scope = exposeScopeCache.getScope();

				// initial with lookup-input-base controller (lookupEditor)
				let lookupInputTemplate = `<div data-basics-lookupdata-lookup-input-base data-options="lookupOptions" data-entity="$parent.entity" data-ng-model="value"></div>
														<div pps-common-expose-scope></div>
													</div>`;
				content = angular.element(lookupInputTemplate);
				//let childScope = scope.$new();
				$compile(content)(scope);
				scope = exposeScopeCache.getScope();
				exposeScopeCache.setScope(null);

				// enable multi select
				scope.settings.gridOptions.multiSelect = true;
				scope.onSelectedItemsChanged.register(function (e, args) {
					fnToReceiveSelectedItems(args.selectedItems);
				});
				scope.cancelTimeout();

				setTimeout(function () {
					content.find('button')[1].click(); // locate on the 'edit' button, should use better jquery selector like id or class in future
				});
			};
			return service;
		}
	]);
})();