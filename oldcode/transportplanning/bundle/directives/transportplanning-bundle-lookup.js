/**
 * Created by waz on 8/3/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).directive('transportplanningBundleLookup', TransportplanningBundleLookup);

	TransportplanningBundleLookup.$inject = [
		'$http',
		'basicsLookupdataLookupDataService',
		'BasicsLookupdataLookupDirectiveDefinition',
		'transportplanningBundleUIStandardService',
		'transportplanningBundleLookupControllerService'];

	function TransportplanningBundleLookup($http,
	                                       basicsLookupdataLookupDataService,
	                                       BasicsLookupdataLookupDirectiveDefinition,
	                                       uiService,
	                                       lookupControllerService) {

		function controller($scope, $modalInstance, controllerService) {
			controllerService.initController($scope, $modalInstance);
		}

		var defaultFilters = {
			notAssignedFlags:{
				notAssignedToReq: true,
				notAssignedToPkg: true,
				notShipped: true
			}
		};

		var lookupOptions = {
			lookupType: 'TrsBundleLookup',
			defaultFilters: defaultFilters,
			width: '60%',
			dialogOptions: {
				templateUrl: globals.appBaseUrl + 'transportplanning.bundle/templates/lookup-grid-dialog.html',
				controller: [
					'$scope',
					'$modalInstance',
					'transportplanningBundleLookupControllerService',
					controller]
			},
			buildSearchString: function (searchString) {
				return '(Code!=null and Code.ToString().Contains("' + searchString + '")) or DescriptionInfo.Description.Contains("' + searchString + '")';
			}
		};
		var lookupConfig = lookupControllerService.createLookupConfig();
		_.assign(lookupOptions, lookupConfig);

		var dataProvider = basicsLookupdataLookupDataService.registerDataProviderByType(lookupOptions.lookupType);
		var getList = function () {
			var searchString = arguments.length > 3 ? arguments[3].searchString : null;
			// var filters = getFilters({});
			// var request = lookupOptions.dataService.generateRequest(filters, searchString);
			var request = lookupOptions.dataService.generateRequest(defaultFilters, searchString);
			return $http.post(globals.webApiBaseUrl + 'transportplanning/bundle/bundle/lookup', request).then(function (response) {
				return new Promise(function (resolve){
					resolve(response.data.Main);
				});
			});
		};
		return new BasicsLookupdataLookupDirectiveDefinition('input-base', lookupOptions, {
			dataProvider: _.merge(dataProvider, {
				getSearchList: getList,
				getList: getList
			})
		});
	}
})(angular);