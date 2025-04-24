/**
 * Created by zwz on 2020/1/8.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningBundlePinningContextExtension
	 * @function
	 * @requires $q, cloudDesktopPinningContextService
	 * @description
	 * transportplanningBundlePinningContextExtension provides pinning context functionality for bundle data service
	 */
	module.service('transportplanningBundlePinningContextExtension', PinningContextExtension);
	PinningContextExtension.$inject = ['$q', 'cloudDesktopPinningContextService'];

	function PinningContextExtension($q, cloudDesktopPinningContextService) {

		var prjPinCtxToken = cloudDesktopPinningContextService.tokens.projectToken;
		var mntReqPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntToken;
		var mntActPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntActToken;
		var trsReqPinCtxToken = cloudDesktopPinningContextService.tokens.trsReqToken;
		var trsBundlePinCtxToken = cloudDesktopPinningContextService.tokens.trsBundleToken;

		this.createPinningOptions = function () {
			return {
				isActive: true,
				showPinningContext: [
					{ token: prjPinCtxToken, show: true },
					{ token: mntReqPinCtxToken, show: true },
					{ token: mntActPinCtxToken, show: true },
					{ token: trsReqPinCtxToken, show: true },
					{ token: trsBundlePinCtxToken, show: true }
				],
				setContextCallback: setCurrentPinningContext
			};
		};

		function setCurrentPinningContext(dataService) {
			var bundle = dataService.getSelected();
			if (bundle) {
				setPinningContext(bundle.ProjectFk, null, null, null, bundle, dataService);
			}
		}

		function setPinningContext(projectId, requisition, activity, trsRequisition, bundle, dataService) {
			var pinningContext = [];

			if (bundle) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(trsBundlePinCtxToken, bundle.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(bundle.Code, bundle.DescriptionInfo.Translated, ' - '))
				);
			}
			if (trsRequisition) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(trsReqPinCtxToken, trsRequisition.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(trsRequisition.Code, trsRequisition.DescriptionInfo.Translated, ' - '))
				);
			}
			if (activity) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(mntActPinCtxToken, activity.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(activity.Code, activity.DescriptionInfo.Translated, ' - '))
				);
			}
			if (requisition) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(mntReqPinCtxToken, requisition.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(requisition.Code, requisition.DescriptionInfo.Translated, ' - '))
				);
			}

			var projectPromise = $q.when(true);
			if (angular.isNumber(projectId)) {
				projectPromise = cloudDesktopPinningContextService.getProjectContextItem(projectId).then(function (pinningItem) {
					pinningContext.push(pinningItem);
				});
			}
			return $q.all([projectPromise]).then(
				function () {
					if (pinningContext.length > 0) {
						cloudDesktopPinningContextService.setContext(pinningContext, dataService);
					}
				});
		}
	}
})(angular);