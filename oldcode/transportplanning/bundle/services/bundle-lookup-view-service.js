/**
 * Created by waz on 7/2/2018.
 */
(function (angular) {
	'use strict';
	/*global angular, globals*/
	/**
	 * @summary
	 * An interface to show bundle selection-dialog
	 */
	var module = 'transportplanning.bundle';
	angular.module(module).factory('transportplanningBundleLookupViewService', BundleLookupViewService);

	BundleLookupViewService.$inject = [
		'$templateCache',
		'platformModalService'];
	function BundleLookupViewService($templateCache, platformModalService) {

		function showLookupDialog(options) {
			return platformModalService.showDialog({
				templateUrl: globals.appBaseUrl + 'transportplanning.bundle/templates/lookup-grid-dialog.html',
				controller: 'transportplanningBundleReferenceLookupController',
				resizeable: true,
				width: '1000px',
				resolve: {
					'$options': function () {
						return options;
					}
				}
			});
		}

		return {
			showLookupDialog: showLookupDialog
		};
	}
})(angular);