(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var modeule='procurement.ticketsystem';
	/**
	 * @ngdoc controller
	 * @name procurementTicketsystemOrderRequestListController
	 * @require $scope
	 * @description controller for ticket system
	 */
	angular.module(modeule).controller('procurementTicketsystemOrderRequestListController',
		['$scope', '$injector', '$translate',
			function ($scope, $injector, $translate) {
				var entityType = $scope.getContentValue('entityType');
				var orderListDataServiceName = $scope.getContentValue('orderListDataServiceName');
				var orderListDataService = orderListDataServiceName ? $injector.get(orderListDataServiceName) : {};

				$scope.maxSize = 10;
				$scope.itemsPerPage = 5;
				$scope.currentPage = 1;
				$scope.totalItems = 0;

				$scope.setError = function (isShow, messageCol, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: messageCol,
						message: message,
						type: type
					};
				};

				// drop down button
				$scope.moreMenu = {
					imageUrl: globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-menu',
					showImageCol: false,
					imageColPrimary: true,
					'items': [
						{
							id: 'item1', name: 'Received', type: 'listitem', imageURL: '',
							executeFn: function () {
								// todo : this function must contain one param --- hold on
								// received();
							}
						},
						{id: 'item3', name: 'Add Chart', type: 'listitem', imageURL: ''},
						{id: 'item3', name: 'Send Remind', type: 'listitem', imageURL: ''}
					]
				};

				// button cancel function
				$scope.orderDelete = function (entity) {
					if ($scope.orderList.indexOf(entity) === -1) {
						return;
					}

					orderListDataService.orderListOperation(entity).then(function (response) {
						if (response.data) {
							entity.showDeleteBtn = false;
							entity.ReqStatus = response.data;
							entity.ReqStatusFk = response.data.Id;
						}
					});
				};
				$scope.showDetails = function (entity) {
					if (!entity.IsShowDetails) {
						entity.ShowDetails = $translate.instant('procurement.ticketsystem.orderRequest.HideDetails');
					} else {
						entity.ShowDetails = $translate.instant('procurement.ticketsystem.orderRequest.ShowDetails');
					}
					entity.IsShowDetails = !entity.IsShowDetails;
				};

				$scope.modalOptions = {
					dialogLoading: false,
					loadingInfo: ''
				};

				var commodityTranslate = 'basics.material.materialSearchLookup',
					pageTranslate = commodityTranslate + '.page';

				$scope.htmlTranslate = {
					firstText: $translate.instant(pageTranslate + '.firstText'),
					previousText: $translate.instant(pageTranslate + '.previousText'),
					nextText: $translate.instant(pageTranslate + '.nextText'),
					lastText: $translate.instant(pageTranslate + '.lastText')
				};

				$scope.pageChanged = function () {

					$scope.modalOptions.dialogLoading = true;
					orderListDataService.loadData({
						CurrentPage: $scope.currentPage,
						ItemsPerPage: $scope.itemsPerPage,
						TotalItems: 0,
						EntityType:entityType
					}).then(function (data) {
						$scope.orderList = data.Result;
						$scope.totalItems = data.TotalItems;
						$scope.modalOptions.dialogLoading = false;
					}, function () {
						$scope.modalOptions.dialogLoading = false;
					});
				};

				// option to directive
				$scope.orderOption = {
					orderDelete: $scope.orderDelete,
					moreMenu: $scope.moreMenu,
					showDetails: $scope.showDetails
				};

				$scope.pageChanged();

				/*
				 * watcher submit cartItem
				 */
				var unSubmitCartItemWatcher = $scope.$on('submitCartItem', function () {
					$scope.currentPage = 1;
					$scope.pageChanged();
				});

				/*
				 * destroy watcher
				 */
				$scope.$on('$destroy', function () {
					unSubmitCartItemWatcher();
				});

			}]);
})(angular);
