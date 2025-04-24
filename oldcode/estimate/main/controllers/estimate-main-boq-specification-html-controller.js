/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainSpecificationController
	 * @function
	 *
	 * @description
	 * Controller for the Specification view.
	 * Includes the textAngular html editor.
	 */

	angular.module(moduleName).controller('estimateMainSpecificationController',
		['boqMainSpecificationControllerService',
			'$scope',
			'estimateMainBoqSpecificationService', 'estimateMainBoqService','estimateMainPriceAdjustmentDataService','estimateMainWicBoqService','estimateMainService',
			function estimateMainSpecificationControllerFunction(boqMainSpecificationControllerService, $scope, estimateMainBoqSpecificationService, estimateMainBoqService,estimateMainPriceAdjustmentDataService,estimateMainWicBoqService,estimateMainService) {

				boqMainSpecificationControllerService.initSpecificationController($scope, estimateMainBoqSpecificationService, moduleName);

				function onLineItemSelectionChanged (e, item){
					let boqHeaderId,boqItemId;

					if(item && item.BoqHeaderFk && item.BoqItemFk){
						boqHeaderId= item.BoqHeaderFk;
						boqItemId = (Object.prototype.hasOwnProperty.call(item,'BoqItems') && Object.prototype.hasOwnProperty.call(item,'BoqLineTypeFk')) ?
							item.Id: item.BoqItemFk;
					}else if(item && item.WicBoqHeaderFk && item.WicBoqItemFk){
						boqHeaderId= item.WicBoqHeaderFk;
						boqItemId = (Object.prototype.hasOwnProperty.call(item,'BoqItems') && Object.prototype.hasOwnProperty.call(item,'BoqLineTypeFk')) ?
							item.Id: item.WicBoqItemFk;
					}else{
						return estimateMainBoqSpecificationService.setCurrentSpecification({
							Content: null,
							Id: 0,
							Version: 0
						});
					}
					estimateMainBoqSpecificationService.loadSpecificationByHeaderAndItemId(boqHeaderId, boqItemId);
				}

				estimateMainBoqService.registerSelectionChanged(onLineItemSelectionChanged);
				estimateMainPriceAdjustmentDataService.registerSelectionChanged(onLineItemSelectionChanged);
				estimateMainWicBoqService.registerSelectionChanged(onLineItemSelectionChanged);
				estimateMainService.registerSelectionChanged(onLineItemSelectionChanged);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					estimateMainBoqService.unregisterSelectionChanged(onLineItemSelectionChanged);
					estimateMainPriceAdjustmentDataService.unregisterSelectionChanged(onLineItemSelectionChanged);
					estimateMainWicBoqService.unregisterSelectionChanged(onLineItemSelectionChanged);
					estimateMainService.unregisterSelectionChanged(onLineItemSelectionChanged);
				});
			}
		]);
})();
