(function (angular) {
	'use strict';
	/* global globals, _ */
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportShiftTransportTimeDialogController', ShiftTransportTimeDialogController);
	ShiftTransportTimeDialogController.$inject = [
		'$scope',
		'$options',
		'$http',
		'moment',
		'transportplanningTransportRouteStatusLookupService',
		'platformModalService',
		'$translate',
		'platformTranslateService',
		'platformGridAPI'];

	function ShiftTransportTimeDialogController($scope,
		$options,
		$http,
		moment,
		routeStatusServ,
		platformModalService,
		$translate,
		platformTranslateService,
		platformGridAPI) {

		init();

		function init() {
			$scope.formOptions = {
				configure: platformTranslateService.translateFormConfig(createInputRows())
			};
			$scope.request = {shiftDate: _.get($options.dataService.getSelected(), 'PlannedDelivery')};
			$scope.handleOK = handleOK;
			$scope.title = $options.title;

			$scope.modalOptions = {
				headerText: $translate.instant($options.title),
				cancel: close
			};

			function close() {
				return $scope.$close(false);
			}
		}

		function createInputRows() {
			return {
				fid: 'transportplanning.transport.reuest',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'request',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}],
				rows: [
					{
						gid: 'request',
						rid: 'shiftDate',
						type: 'dateutc',
						label: '*Shift Date',
						label$tr$: 'transportplanning.transport.wizard.shiftTransportDate',
						model: 'shiftDate',
						sortOrder: 1
					}]
			};
		}

		function handleOK() {
			var selectedEntities = $options.dataService.getSelectedEntities();
			var statusList = routeStatusServ.getList();
			var bReadOnly = false;
			bReadOnly = selectedEntities.some(function (item) {
				var status = _.find(statusList, {Id: item.TrsRteStatusFk});
				return (status && status.IsInTransport === true);
			});

			if(bReadOnly === true){
				var bodyText = $translate.instant('transportplanning.transport.wizard.notifyRoutesReadOnly');
				var headerText = $translate.instant('transportplanning.transport.wizard.shiftTransportTime');
				platformModalService.showMsgBox(bodyText, headerText, 'ico-info');
				return;
			}

			$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/shiftTransportTime', {
				ShiftDate: $scope.request.shiftDate,
				RouteIds: _.map($options.dataService.getSelectedEntities(), 'Id')
			}).then(function (response) {
				$options.dataService.refreshSelectedEntities().then(()=>{
					_.forEach($options.dataService.getSelectedEntities(), function (dto) {
						dto.PlannedDeliveryTime = dto.PlannedDelivery;
						dto.PlannedDeliveryDate = dto.PlannedDelivery;
						dto.PlannedDeliveryDay = dto.PlannedDelivery;
						platformGridAPI.rows.refreshRow({gridId: '1293102b4ee84cb5bd1b538fdf2ae90a', item: dto});
					});
					$scope.$close(false);
				});
			}, function () {
				$scope.$close(false);
			});
		}
	}
})(angular);