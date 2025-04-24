/**
 * Created by zwz on 2020/1/8.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingPinningContextExtension
	 * @function
	 * @requires cloudDesktopPinningContextService
	 * @description
	 * productionplanningDrawingPinningContextExtension provides pinning context functionality for drawing data service
	 */
	module.service('productionplanningDrawingPinningContextExtension', PinningContextExtension);
	PinningContextExtension.$inject = ['cloudDesktopPinningContextService'];

	function PinningContextExtension(cloudDesktopPinningContextService) {

		var ppsDrawingPinCtxToken = cloudDesktopPinningContextService.tokens.ppsEngDrawingToken;

		this.createPinningOptions = function () {
			return {
				isActive: true,
				showPinningContext: [
					{ token: 'project.main', show: true },
					{ token: ppsDrawingPinCtxToken, show: true }
				],
				setContextCallback: setPinningContext
			};
		};

		function setPinningContext(dataService) {
			var item = dataService.getSelected();
			if (item) {
				var pinningContext = [];
				cloudDesktopPinningContextService.getProjectContextItem(item.PrjProjectFk).then(function (pinningItem) {
					pinningContext.push(pinningItem);
					pinningContext.push(new cloudDesktopPinningContextService.PinningItem(ppsDrawingPinCtxToken, item.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(item.Code, item.Description, ' - ')));
					cloudDesktopPinningContextService.setContext(pinningContext, dataService);
				});
			}
		}
	}
})(angular);
