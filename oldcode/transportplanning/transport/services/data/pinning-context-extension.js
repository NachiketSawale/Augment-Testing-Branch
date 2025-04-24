/**
 * Created by zwz on 2020/1/20.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var module = angular.module(moduleName);

    /**
	 * @ngdoc service
	 * @name transportplanningTransportPinningContextExtension
	 * @function
	 * @requires $q, cloudDesktopPinningContextService
	 * @description
	 * transportplanningTransportPinningContextExtension provides pinning context functionality for transport data service
	 */
	module.service('transportplanningTransportPinningContextExtension', PinningContextExtension);
	PinningContextExtension.$inject = ['$q', 'cloudDesktopPinningContextService'];

	function PinningContextExtension($q, cloudDesktopPinningContextService) {

		this.createPinningOptions = function () {
			return {
				isActive: true, showPinningContext: [
					{token: cloudDesktopPinningContextService.tokens.projectToken, show: true},
					{token: cloudDesktopPinningContextService.tokens.trsTransportToken, show: true}
				],
				setContextCallback: setPinningContext
				// 	function (prjService) {
				// 	cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'ProjectDefFk');
				// }
			};
		};

		function setPinningContext(dataService) {
			var selectedItem = dataService.getSelected();
			if (selectedItem) {
				var projectPromise = $q.when(true);
				var pinningContext = [];
				if (angular.isNumber(selectedItem.ProjectDefFk)) {
					projectPromise = cloudDesktopPinningContextService.getProjectContextItem(selectedItem.ProjectDefFk).then(function (pinningItem) {
						pinningContext.push(pinningItem);
					});
				}

				if (selectedItem) {
					pinningContext.push(
						new cloudDesktopPinningContextService.PinningItem(cloudDesktopPinningContextService.tokens.trsTransportToken, selectedItem.Id,
							cloudDesktopPinningContextService.concate2StringsWithDelimiter(selectedItem.Code, selectedItem.DescriptionInfo.Translated, ' - '))
					);
				}

				return $q.all([projectPromise]).then(
					function () {
						if (pinningContext.length > 0) {
							cloudDesktopPinningContextService.setContext(pinningContext, dataService);
						}
					});
			}

		}

	}
})(angular);