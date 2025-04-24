/**
 * Created by jes on 4/21/2017.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Slick */
	var moduleName = 'procurement.ticketsystem';

	angular.module(moduleName).controller('procurementTicketSystemSubmitSuccessDialogController', procurementTicketSystemSubmitSuccessDialogController);

	procurementTicketSystemSubmitSuccessDialogController.$inject = [
		'_',
		'$scope',
		'platformGridAPI',
		'platformTranslateService',
		'platformModuleNavigationService'
	];

	function procurementTicketSystemSubmitSuccessDialogController(
		_,
		$scope,
		platformGridAPI,
		platformTranslateService,
		platformModuleNavigationService
	) {

		var uuid = '3c29b2b9d78b478ab52e40711d72c98c';
		_.extend($scope, {
			gridId: uuid,
			gridData: {
				state: uuid
			},
			onOK: function () {
				$scope.$close(false);
			},
			goTo: function () {
				var ids = _.map($scope.modalOptions.itemList, function (item) {
					return item.Id;
				});
				if (ids.length > 0) {
					$scope.$close(false);
					var navigator = {moduleName: 'procurement.requisition', registerService: 'procurementRequisitionHeaderDataService'};
					if ($scope.modalOptions.type === 1) {
						navigator = {moduleName: 'procurement.contract', registerService: 'procurementContractHeaderDataService'};
					}
					platformModuleNavigationService.navigate(navigator, ids, 'Id');
				}
			},
			goToContract: function () {
				var ids = _.map($scope.modalOptions.itemList, function (item) {
					return item.Id;
				});

				if (ids.length > 0) {
					$scope.$close(false);
					var navigator = {
						moduleName: 'procurement.contract',
						registerService: 'procurementContractHeaderDataService'
					};
					platformModuleNavigationService.navigate(navigator, ids);
				}
			},
			goToRequisition: function () {
				var ids = _.map($scope.modalOptions.itemList, function (item) {
					return item.Id;
				});
				if (ids.length > 0) {
					$scope.$close(false);
					var navigator = {
						moduleName: 'procurement.requisition',
						registerService: 'procurementRequisitionHeaderDataService'
					};
					platformModuleNavigationService.navigate(navigator, ids, 'Id');
				}
			}
		});

		var columns = [
			{
				id: 'code',
				field: 'Code',
				name: 'Code',
				name$tr$: 'cloud.common.entityCode',
				readonly: true,
				width: 100
			},
			{
				id: 'description',
				field: 'Description',
				name: 'Description',
				name$tr$: 'cloud.common.entityDescription',
				readonly: true,
				width: 150
			},
			{
				id: 'projectId',
				field: 'ProjectId',
				name: 'Project No.',
				name$tr$: 'cloud.common.entityProjectNo',
				readonly: true,
				width: 100,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'project',
					displayMember: 'ProjectNo',
					valueMember: 'Id'
				}
			},
			{
				id: 'ProjectDescription',
				field: 'ProjectId',
				name: 'Project Name',
				name$tr$: 'cloud.common.entityProjectName',
				readonly: true,
				width: 120,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'project',
					displayMember: 'ProjectName',
					valueMember: 'Id'
				}
			},
			{
				id: 'businessPartner',
				field: 'BusinessPartnerId',
				name: 'Business Partner',
				name$tr$: 'cloud.common.entityBusinessPartner',
				readonly: true,
				width: 120,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'BusinessPartner',
					displayMember: 'BusinessPartnerName1',
					valueMember: 'Id'
				}
			}
		];

		platformTranslateService.translateGridConfig(columns);

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			var grid = {
				columns: angular.copy(columns),
				data: [],
				id: uuid,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'Id',
					iconClass: '',
					editorLock: new Slick.EditorLock(),
					multiSelect: false
				}
			};

			platformGridAPI.grids.config(grid);
		}

		platformGridAPI.items.data($scope.gridId, $scope.modalOptions.itemList);

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
		});
	}

})(angular);