
(function (angular) {

	'use strict';
	let moduleName = 'qto.main';

	angular.module(moduleName).controller('qtoDetailCommentsListController',
		['$scope','$injector', 'platformGridAPI','platformContainerControllerService','qtoDetailCommentsService',
			function ($scope,$injector, platformGridAPI,platformContainerControllerService,qtoDetailCommentsService) {

				platformContainerControllerService.initController($scope, moduleName, '004EBBD55C9947879A938A640C4A4747');

				function onSelectedRowsChanged() {

					let qtoHeader = $injector.get ('qtoMainHeaderDataService').getSelected ();
					let qtoStatusItem = $injector.get ('qtoHeaderReadOnlyProcessor').getItemStatus (qtoHeader);
					let btnStatus = false;
					if (qtoStatusItem) {
						btnStatus = qtoStatusItem.IsReadOnly;
					}

					if (btnStatus) {
						angular.forEach ($scope.tools.items, function (item) {
							if (item.id === 'delete' || item.id === 'create' || item.id === 't14') {
								item.disabled = function () {
									return btnStatus;
								};
							}
						});

					} else {
						let qtoComment = platformGridAPI.rows.selection ({gridId: $scope.gridId});
						let disable = true;

						if (qtoComment && qtoComment.BasQtoCommentsTypeFk > 0 && qtoComment.Version > 0) {
							disable = qtoComment.IsDelete;
						}

						if(!qtoComment){
							disable = false;
						}

						angular.forEach ($scope.tools.items, function (item) {
							if (item.id === 'delete') {
								item.disabled = function () {
									return !disable;
								};
							}
							if (item.id === 'create' || item.id === 't14') {
								item.disabled = function () {
									qtoHeader = $injector.get ('qtoMainHeaderDataService').getSelected ();
									qtoStatusItem = $injector.get ('qtoHeaderReadOnlyProcessor').getItemStatus (qtoHeader);
									btnStatus = false;
									if (qtoStatusItem) {
										btnStatus = qtoStatusItem.IsReadOnly;
									}
									if (btnStatus) {
										return true;
									} else {
										let qtoDetail = $injector.get ('qtoMainDetailService').getSelected ();
										return !qtoDetail;
									}

								};
							}
						});
					}
					$scope.tools.update ();
					platformGridAPI.grids.refresh ($scope.gridId);
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);


				qtoDetailCommentsService.refreshBtn.register(onSelectedRowsChanged);

				$scope.$on('$destroy', function () {

					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					qtoDetailCommentsService.refreshBtn.unregister(onSelectedRowsChanged);
				});
			}
		]);
})(angular);