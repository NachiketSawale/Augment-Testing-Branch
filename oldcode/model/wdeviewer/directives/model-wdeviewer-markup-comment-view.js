
(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.wdeviewer';
	angular.module(moduleName).directive('modelWdeViewerMarkupCommentView', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'basics.common/partials/comment-view.html',
				controller: ['$scope', 'basicsCommonCommentDataServiceFactory', '$injector', '_', 'modelWdeViewerMarkupService', 'modelWdeViewerAnnotationService', controller]
			};

			function controller($scope, serviceFactory, $injector, _, modelWdeViewerMarkupService, modelWdeViewerAnnotationService) {
				const qualifier = 'model.annotation.comment',
					parentServiceName = 'modelAnnotationDataService',
					service = serviceFactory.get(qualifier, parentServiceName, {
						createUrl: globals.webApiBaseUrl + 'model/annotation/comment/create',
						lastUrl: globals.webApiBaseUrl + 'basics/common/comment/last',
						deleteUrl: globals.webApiBaseUrl + 'basics/common/comment/deletecomment',
						entityName: 'Comments'
					});
				let getAnnoParentItem = service.parentDataService.getSelected;
				service.parentDataService.getSelected = function (){
					let selectItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect: true});
					if (selectItem) {
						return _.find(modelWdeViewerAnnotationService.annotationItems, {Id: selectItem.AnnotationFk});
					}
					return getAnnoParentItem();
				};
				service.clear();

				$scope.config = {
					data: service.getComments(),
					columns: service.columns,
					parentProp: '',
					childProp: 'Children',
					dateProp: 'Comment.InsertedAt',
					pageSize: 10,
					pageNum: service.pageNum,
					ready: init,
					create: service.create,
					delete: service.delete,
					detail: service.detailInfo,
					loading: service.loading,
					statusOptions: service.statusOptions,
					IsReadonlyStatus: service.IsReadonlyStatus,
					updateRootCount: service.updateRootCount,
					showLastComments: true
				};
				$scope.disable = function () {
					return !(service.loginClerk.Clerk && service.loginClerk.Clerk.Id);
				};

				$scope.isReadOnly = function () {
					let readonly = false;
					const parentService = parentServiceName ? $injector.get(parentServiceName) : null;
					if (parentService !== null && parentService.getItemStatus) {
						const status = parentService.getItemStatus();
						if (status && status.IsReadonly)
							readonly = true;
					}
					return readonly;
				};
				modelWdeViewerMarkupService.selectMarkupChange.register(handleDataLoad);

				function init(viewer) {
					service.load();
					service.onDataRefresh.register(handleDataRefresh);
					viewer.onDestroy.register(handleViewerDestroy);
					viewer.onPageNumChanged.register(handlePageNumChanged);
					function handleDataRefresh() {
						viewer.setData(service.getComments(), service.getSelectedParentItemStatus());
					}
					function handleViewerDestroy() {
						service.onDataRefresh.unregister(handleDataRefresh);
					}

					function handlePageNumChanged(e, args) {
						service.pageNum = args.newValue;
					}
				}
				function handleDataLoad() {
					let selectItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect: true});
					if (service.tempCurrentSelectItem !== selectItem) {
						service.tempCurrentSelectItem = selectItem;
						let parentSel = service.parentDataService.getSelected();
						if (parentSel && parentSel.Id !== selectItem.AnnotationFk) {
							let parentList = service.parentDataService.getList();
							let findParentItem = _.find(parentList, {Id: selectItem.AnnotationFk});
							if (findParentItem) {
								service.parentDataService.setSelected(findParentItem);
								service.parentDataService.gridRefresh();
							}
						}
					}
				}
				$scope.$on('$destroy', function () {
					modelWdeViewerMarkupService.selectMarkupChange.unregister(handleDataLoad);
				});
			}
		}
	]);

})(angular);