(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,Slick,_ */

	angular.module('procurement.common').value('procurementCommonDataColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						field: 'Description',
						id: 'col1',
						name: 'Title',
						name$tr$: 'procurement.common.data.reqDataTitle',
						formatter: Slick.Formatters.TitleFormatter,
						width: 200
					},
					{
						field: 'Count',
						id: 'col2',
						name: 'Status',
						name$tr$: 'procurement.common.data.reqDataStatus',
						formatter: Slick.Formatters.IconTickFormatter
					}
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name procurementCommonDataListController
	 * @requires $scope, procurementCommonDataColumns, $translate, contextService, procurementCommonDataHttpService, procurementCommonDatprocurementCommonDataValidationServiceaDataService, procurementRequisitionHeaderDataService
	 * @description Controller for the data container.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonOverviewController',
		['$scope', '$rootScope', 'procurementContextService', 'platformGridControllerService', 'procurementCommonOverviewTreeDataService',
			'procurementCommonDataValidationService', 'procurementCommonOverviewUIStandardService', 'platformToolbarService',
			function ($scope, $rootScope, moduleContext, gridControllerService, dataServiceFactory, validationService, gridColumns, platformToolbarService) {

				var dataService = dataServiceFactory.getService(moduleContext.getMainService(),moduleContext.getLeadingService());
				gridControllerService.initListController($scope, gridColumns, dataService, validationService(dataService), dataService.treePresOpt);

				var containeruuid = $scope.getContainerUUID();
				// remove unnecessary tools
				var toolItems = _.filter(platformToolbarService.getTools(containeruuid), function (item) {
					return item && item.id !== 'create' && item.id !== 'delete' && item.id !== 'createChild' && item.id !== undefined;
				});

				// automatically refresh the overview after updated root.
				dataService.refreshAfterSave();

				const unRegisterUpdateDoneFn = $rootScope.$on('updateDone', function onUpdateDone() {
					dataService.refreshAfterSave();
				});

				platformToolbarService.removeTools(containeruuid);
				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolItems
				});

				$scope.$on('$destroy', function onDestroy() {
					unRegisterUpdateDoneFn();
				});
			}]);
})(angular);