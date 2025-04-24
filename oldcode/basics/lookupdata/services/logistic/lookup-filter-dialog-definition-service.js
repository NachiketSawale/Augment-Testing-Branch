/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name LookupFilterDialogDefinition
	 * @requires
	 * @description ComboBox to select a activity template
	 */

	angular.module('basics.lookupdata').factory('LookupFilterDialogDefinition', LookupFilterDialogDefinition);
	LookupFilterDialogDefinition.$inject = ['$q', 'BasicsLookupdataLookupDirectiveDefinition', '$injector', 'globals', '_'];
	function LookupFilterDialogDefinition($q, BasicsLookupdataLookupDirectiveDefinition, $injector, globals, _) {

		return function (lookupOptions, dataServiceName, formSettings, gridSettings) {
			return initAsDirective(lookupOptions, dataServiceName, formSettings, gridSettings);
		};

		function dialogController($scope, $modalInstance, controllerService) {
			controllerService.initFilterDialogController($scope, $modalInstance);
		}

		function initAsDirective(lookupOptions, dataServiceName, formSettings, gridSettings) {
			var dataService;
			if (_.isString(dataServiceName)) {
				dataService = $injector.get(dataServiceName);
			} else {
				dataService = dataServiceName;
			}
			gridSettings.inputSearchMembers = gridSettings.inputSearchMembers || ['SearchPattern'];

			var defaultsLookupOptions = {
				lookupType: '',
				valueMember: 'Id',
				displayMember: 'Description'
			};
			lookupOptions = _.merge(defaultsLookupOptions, lookupOptions);
			var defaults = {
				disableDataCaching: true,
				detailConfig: formSettings,
				dataService: dataService,
				resizeable: true,
				width: '60%',
				minWidth: '600px',
				dialogOptions: {
					templateUrl: globals.appBaseUrl + 'basics.lookupdata/partials/lookup-filter-dialog-form-grid.html',
					controller: ['$scope', '$modalInstance', 'lookupFilterDialogControllerService', dialogController]
				}
			};
			defaults = _.merge(defaults, lookupOptions, gridSettings);
			if(lookupOptions.dataProcessor){
				defaults.dataProcessor = {
					execute: lookupOptions.dataProcessor
				};
			}

			var dataProvider = null;
			if (lookupOptions.dataProvider) {
				dataProvider = lookupOptions.dataProvider;
			} else if (dataService.dataProvider) {
				dataProvider = dataService.dataProvider;
			}
			if (dataProvider){
				return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {dataProvider: dataProvider});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults);
		}
	}
})(angular);