/**
 * Created by zwz on 2020/1/8.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.producttemplate';
	var module = angular.module(moduleName);

    /**
	 * @ngdoc service
	 * @name productionplanningProducttemplatePinningContextExtension
	 * @function
	 * @requires $q, basicsLookupdataLookupDescriptorService, cloudDesktopPinningContextService, productionplanningDrawingPinnableEntityService, projectMainPinnableEntityService
	 * @description
	 * productionplanningProducttemplatePinningContextExtension provides pinning context functionality for product template data service
	 */
	module.service('productionplanningProducttemplatePinningContextExtension', PinningContextExtension);
	PinningContextExtension.$inject = ['$q',
		'basicsLookupdataLookupDescriptorService',
		'cloudDesktopPinningContextService',
		'productionplanningDrawingPinnableEntityService',
		'projectMainPinnableEntityService'];

	function PinningContextExtension($q,
									 basicsLookupdataLookupDescriptorService,
									 cloudDesktopPinningContextService,
									 drawingPinnableEntityService,
									 projectPinnableEntityService) {

		this.createPinningOptions = function () {
			return {
				isActive: true,
				showPinningContext: [
					{ token: cloudDesktopPinningContextService.tokens.projectToken, show: true },
					{ token: cloudDesktopPinningContextService.tokens.ppsEngDrawingToken, show: true }
				],
				setContextCallback: setCurrentPinningContext
			};
		};

		// pinning context (project, drawing)
		function setDrawingToPinningContext(projectId, drawing, dataService) {
			var drawingId = _.get(drawing, 'Id');
			if ((projectPinnableEntityService.getPinned() !== projectId) || (drawingPinnableEntityService.getPinned() !== drawingId)) {
				var ids = {};
				drawingPinnableEntityService.appendId(ids, drawingId);
				projectPinnableEntityService.appendId(ids, projectId);
				return drawingPinnableEntityService.pin(ids, dataService).then(function () {
					return true;
				});
			} else {
				return $q.when(false);
			}
		}

		function setCurrentPinningContext(dataService) {
			var selected = dataService.getSelected();
			if (selected) {
				$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('EngDrawing', selected.EngDrawingFk)).then(function (drawing) {
					if (drawing) {
						setDrawingToPinningContext(drawing.PrjProjectFk, drawing, dataService);
					}
				});
			}
		}

		this.getDrawingPinnedItem = function getDrawingPinnedItem() {
			var currentPinningContext = cloudDesktopPinningContextService.getContext();
			return _.find(currentPinningContext, {token: cloudDesktopPinningContextService.tokens.ppsEngDrawingToken});
		};
	}
})(angular);
