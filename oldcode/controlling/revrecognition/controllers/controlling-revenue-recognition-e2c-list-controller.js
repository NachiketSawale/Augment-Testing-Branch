/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';

	/**
     * @ngdoc controller
     * @name controllingRevenueRecognitionItemListController
     * @function
     *
     * @description
     * Controller for the list view of Cost Headers (Actuals).
     **/
	angular.module(moduleName).controller('controllingRevenueRecognitionE2cListController',
		['$scope', '_', 'platformGridAPI','platformModalService','platformGridControllerService', 'controllingRevenueRecognitionE2cItemService', 'controllingRevenueRecognitionItemE2cValidationService','controllingRevenueRecognitionE2cUIStandardService','controllingRevenueRecognitionHeaderDataService',
			function ($scope, _, platformGridAPI, platformModalService, platformGridControllerService, dataService,validateService,controllingRevenueRecognitionE2cUIStandardService,parentService) {

				var myGridConfig = {
					initCalled: false,
					lazyInit: true,
					columns: [],
					parentProp: 'ParentId',
					childProp: 'PrrItemE2cChildren',
				};

				platformGridControllerService.initListController($scope, controllingRevenueRecognitionE2cUIStandardService, dataService, validateService, myGridConfig);

				var toolbarItems = [
					{
						id: 't100',
						caption: 'Recalculate',
						type: 'item',
						cssClass: 'control-icons ico-recalculate',
						disabled: function () {
							var parentEntity=parentService.getSelected();
							if(!parentEntity||(parentEntity&&parentEntity.IsReadonlyStatus)){
								return true;
							}
							return false;
						},
						fn: function () {
							platformModalService.showYesNoDialog('controlling.revrecognition.recalculateTipMessage2', 'controlling.revrecognition.recalculateCaption', 'no')
								.then(function (result) {
									if (result.yes) {
										dataService.refreshItem();
									}
								});
						}
					}];
				platformGridControllerService.addTools(toolbarItems);


				$scope.$on('$destroy', function () {

				});
			}
		]);
})(angular);
