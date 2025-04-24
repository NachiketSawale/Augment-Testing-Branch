(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonJobPinboardController', [
		'$scope', 'ppsCommonJobPinboardDataServiceFactory',
		'$injector', '$http',
		function ($scope, serviceFactory,
			$injector, $http) {
			var qualifier          = $scope.getContentValue('commentQualifier'),
				parentServiceName  = $scope.getContentValue('parentService'),
				commentEntity      = $scope.getContentValue('commentEntity'),
				configProviderName = $scope.getContentValue('configServiceName'),
				configService      = configProviderName ? $injector.get(configProviderName) : null;

			var attributeName = $scope.getContentValue('attributeName');
			var	noService 		   = serviceFactory.noService(qualifier, parentServiceName);
			var	service            = serviceFactory.get(qualifier, parentServiceName, configService ? configService.getConfig() : {commentEntity: commentEntity}, attributeName);
			var showLastComments = $scope.getContentValue('showLastComments');

			$scope.setTools({items: []});

			$scope.config = {
				data: service.getComments(),
				columns: service.columns,
				parentProp: '',
				childProp: 'Children',
				dateProp: configService ? configService.getConfig().dateProp : 'Comment.InsertedAt',
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

			$scope.isReadOnly = function(){
				var readonly = false;
				var parentService = parentServiceName ? $injector.get(parentServiceName) : null;
				if(parentService !== null && !!parentService.getItemStatus){
					var status = parentService.getItemStatus();
					if(status && status.IsReadonly) {
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
					viewer.setData(service.getComments(),service.getSelectedParentItemStatus());
					$scope.config.IsReadonlyStatus = service.getSelectedParentItemStatus();
				}

				function handleViewerDestroy() {
					service.onDataRefresh.unregister(handleDataRefresh);
				}

				function handlePageNumChanged(e, args) {
					service.pageNum = args.newValue;
				}
			}

			//-----------------------------------------------above code is copied from basicsCommonCommentController-------------------------
			//-----------------------------------------------below is custom code------------------------------------------------------------
			//
			// var attributeName = $scope.getContentValue('attributeName');
			// service.getParentItem = function getParentItem(){
			// 	var itemSelected =  service.parentDataService.getSelected();
			// 	if(itemSelected && angular.isDefined(itemSelected[attributeName])){
			// 		return  lookupService.getLookupItem('logisticJob',itemSelected[attributeName]);
			// 	}
			// };

			if(noService){ //if not create srvice before, reload the service data again, fix #121596
				service.load();
			}
		}
	]);

})();