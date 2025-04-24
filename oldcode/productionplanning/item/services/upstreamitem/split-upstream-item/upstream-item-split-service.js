/**
 * Created by anl on 8/24/2021.
 */

(function (angular) {
	'use strict';
	/*globals angular, moment, _, Slick*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemUpstreamItemSplitService', SelectionService);

	SelectionService.$inject = [
		'$http', '$q',
		'platformTranslateService',
		'platformGridAPI',
		'platformModalService'];

	function SelectionService(
		$http, $q,
		platformTranslateService,
		platformGridAPI,
		platformModalService) {

		var service = {};

		service.showSplitDialog = function (selected){
			if(selected) {
				var modalCreateConfig = {
					width: '900px',
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-upstream-item-split-dialog.html',
					controller: 'productionplanningItemUpstreamItemSplitController',
					resolve: {
						'$options': function () {
							return {
								selected: selected
							};
						}
					}
				};
				platformModalService.showDialog(modalCreateConfig);
			}
			else{
				platformModalService.showErrorBox('productionplanning.item.wizard.moreItemsWarn',
					'productionplanning.item.upstreamItemSplit.dialogTitle', 'warning');
			}
		};

		return service;
	}
})(angular);