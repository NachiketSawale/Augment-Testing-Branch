/**
 * Created by wui on 12/10/2014.
 */

((angular) => {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonCommentController', basicsCommonCommentController);

	basicsCommonCommentController.$inject = ['$scope', 'basicsCommonCommentDataServiceFactory', '$injector', '_'];

	function basicsCommonCommentController($scope, serviceFactory, $injector, _) {
		const qualifier = $scope.getContentValue('commentQualifier'),
			parentServiceName = $scope.getContentValue('parentService'),
			commentEntity = $scope.getContentValue('commentEntity'),
			configProviderName = $scope.getContentValue('configServiceName'),
			configService = configProviderName ? $injector.get(configProviderName) : null,
			saveParentBefore = $scope.getContentValue('saveParentBefore'),
			service = serviceFactory.get(qualifier, parentServiceName, configService ? configService.getConfig() : {commentEntity: commentEntity, saveParentBefore: saveParentBefore});
		const showLastComments = $scope.getContentValue('showLastComments');

		$scope.setTools({items: []});

		$scope.config = {
			data: service.getComments(),
			columns: service.columns,
			parentProp: '',
			childProp: 'Children',
			dateProp: (configService && configService.getConfig().dateProp) ? configService.getConfig().dateProp : 'Comment.InsertedAt',
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
			showLastComments: !!showLastComments
		};

		$scope.disable = function () {
			return !(service.loginClerk.Clerk && service.loginClerk.Clerk.Id);
		};

		$scope.isReadOnly = function () {
			let readonly = false;
			const parentService = parentServiceName ? $injector.get(parentServiceName) : null;
			if (configService && configService.getConfig().isPinBoardReadonly) {
				readonly = true;
			} else if (parentService !== null) {
				const isPinBoardEditable = $scope.getContentValue('isPinBoardEditable');
				if (!_.isNil(isPinBoardEditable) && isPinBoardEditable) {
					return readonly;
				} else if (parentService.getItemStatus) {
					const status = parentService.getItemStatus();
					if (status && status.IsReadonly)
						readonly = true;
				}
			}
			return readonly;
		};

		function init(viewer) {
			service.onDataRefresh.register(handleDataRefresh);
			viewer.onDestroy.register(handleViewerDestroy);
			viewer.onPageNumChanged.register(handlePageNumChanged);

			function handleDataRefresh() {
				viewer.setData(service.getComments(), service.getSelectedParentItemStatus());
				$scope.config.IsReadonlyStatus = service.getSelectedParentItemStatus();
			}

			function handleViewerDestroy() {
				service.onDataRefresh.unregister(handleDataRefresh);
			}

			function handlePageNumChanged(e, args) {
				service.pageNum = args.newValue;
			}
		}
	}
})(angular);
