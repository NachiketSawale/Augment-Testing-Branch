/**
 * Created by chi on 3/26/2021.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonGenericWizardCommentController', basicsCommonGenericWizardCommentController);

	basicsCommonGenericWizardCommentController.$inject = ['$scope', '$injector'];

	function basicsCommonGenericWizardCommentController($scope, $injector) {

		const configServiceName = $scope.getContentValue('configService');
		const configService = configServiceName ? $injector.get(configServiceName) : null;
		if (!configService) {
			throw new Error('configService does not exist.');
		}
		$scope.setTools({items: []});

		const service = configService.getService();
		const configurationService = angular.isFunction(configService.getConfigurationService) ? configService.getConfigurationService() : null;

		$scope.config = {
			data: service.getComments(),
			columns: service.columns,
			parentProp: '',
			childProp: 'Children',
			dateProp: (configurationService && configurationService.getConfig().dateProp) ? configurationService.getConfig().dateProp : 'Comment.InsertedAt',
			pageSize: 20,
			pageNum: service.pageNum,
			ready: init,
			create: service.create,
			delete: service.delete,
			detail: service.detailInfo,
			loading: service.loading,
			statusOptions: service.statusOptions,
			IsReadonlyStatus: service.IsReadonlyStatus,
			updateRootCount: service.updateRootCount,
			showLastComments: angular.isFunction(configService.getShowLastComments) ? configService.getShowLastComments() : false
		};

		$scope.disable = function () {
			return !(service.loginClerk.Clerk && service.loginClerk.Clerk.Id);
		};

		$scope.isReadOnly = function () {
			return true;
		};

		function init(viewer) {
			service.onDataRefresh.register(handleDataRefresh);
			viewer.onDestroy.register(handleViewerDestroy);
			viewer.onPageNumChanged.register(handlePageNumChanged);

			function handleDataRefresh(items) {
				var comments = service.getComments();
				viewer.setData(comments, service.getSelectedParentItemStatus());
				$scope.config.IsReadonlyStatus = service.getSelectedParentItemStatus();
				if ($scope.$parent.setInfo) {
					$scope.$parent.setInfo(items ? items : comments);
				}
			}

			function handleViewerDestroy() {
				service.onDataRefresh.unregister(handleDataRefresh);
				viewer.onDestroy.unregister(handleViewerDestroy);
				viewer.onPageNumChanged.unregister(handlePageNumChanged);
			}

			function handlePageNumChanged(e, args) {
				service.pageNum = args.newValue;
			}
		}
	}
})(angular);