/**
 * Created by wed on 12/25/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerEvaluationAdaptorService', [
		'businesspartnerMainHeaderDataService',
		'businesspartnerMainHeaderDataService',
		function (businesspartnerMainHeaderDataService,
			businessPartnerMainHeaderDataService) {

			return {
				getMainService: function () {
					return businessPartnerMainHeaderDataService;
				},
				getParentService: function () {
					return businessPartnerMainHeaderDataService;
				},
				onDataReadComplete: function (readItems, data, parentService, evaluationTreeService) {
					var businessPartnerItem = parentService.getSelected();
					if (businessPartnerItem) {
						evaluationTreeService.disableDelete(businessPartnerMainHeaderDataService.isBpStatusHasRight(businessPartnerItem, 'AccessRightDescriptorFk', 'statusWithDeleteRight'));
					}
				},
				extendCreateOptions: function (createOptions, parentService) {
					return angular.extend(createOptions, {
						businessPartnerId: parentService.getIfSelectedIdElse(-1)
					});
				},
				onControllerCreate: function (scope, parentService, evaluationTreeService) {
					parentService.registerSelectionChanged(evaluationTreeService.load);
				},
				onControllerDestroy: function (scope, parentService, evaluationTreeService) {
					parentService.unregisterSelectionChanged(evaluationTreeService.load);
				}
			};

		}]);
})(angular);
