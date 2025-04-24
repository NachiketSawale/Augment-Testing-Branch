/**
 * Created by zwz on 2020/1/9.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningRequisitionPinningContextExtension
	 * @function
	 * @requires $q, cloudDesktopPinningContextService
	 * @description
	 * transportplanningRequisitionPinningContextExtension provides pinning context functionality for bundle data service
	 */
	module.service('transportplanningRequisitionPinningContextExtension', PinningContextExtension);
	PinningContextExtension.$inject = ['$q', 'cloudDesktopPinningContextService'];

	function PinningContextExtension($q, cloudDesktopPinningContextService) {

		var prjPinCtxToken = cloudDesktopPinningContextService.tokens.projectToken;
		var mntReqPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntToken;
		var mntActPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntActToken;
		var trsReqPinCtxToken = cloudDesktopPinningContextService.tokens.trsReqToken;

		this.createPinningOptions = function () {
			return {
				isActive: true,
				showPinningContext: [
					{ token: prjPinCtxToken, show: true },
					{ token: mntReqPinCtxToken, show: true },
					{ token: mntActPinCtxToken, show: true },
					{ token: trsReqPinCtxToken, show: true }
				],
				setContextCallback: setCurrentPinningContext
			};
		};


		this.getMntActivityPinnedItem = function getMntActivityPinnedItem() {
			var currentPinningContext = cloudDesktopPinningContextService.getContext();
			return _.find(currentPinningContext, { token: mntActPinCtxToken });
		};

		this.setPinningContext = setPinningContext;

		function setCurrentPinningContext(dataService) {
			var trsRequisition = dataService.getSelected();
			setTrsRequisitionPinningContext(trsRequisition, dataService);
		}

		function setTrsRequisitionPinningContext(trsRequisition, dataService) {
			if (trsRequisition) {
				// $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('MntActivity', trsRequisition.MntActivityFk)).then(function (activity) {
				// 	if (activity) {
				// 		getRequisitionById(activity.MntRequisitionFk).then(function (requisition) {
				// 			setPinningContext(trsRequisition.ProjectFk, requisition, activity, trsRequisition);
				// 		});
				// 	}
				// 	else {
				// 		setPinningContext(trsRequisition.ProjectFk, null, null, trsRequisition);
				// 	}
				// });

				setPinningContext(trsRequisition.ProjectFk, null, null, trsRequisition, dataService);
			}
		}

		function setPinningContext(projectId, requisition, activity, trsRequisition, dataService) {
			var projectPromise = $q.when(true);
			var pinningContext = [];
			if (angular.isNumber(projectId)) {
				projectPromise = cloudDesktopPinningContextService.getProjectContextItem(projectId).then(function (pinningItem) {
					pinningContext.push(pinningItem);
				});
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
			return $q.all([projectPromise]).then(
				function () {
					if (pinningContext.length > 0) {
						cloudDesktopPinningContextService.setContext(pinningContext, dataService);
					}
				});
		}

	}
})(angular);