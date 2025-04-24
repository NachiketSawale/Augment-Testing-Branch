/**
 * Created by anl on 3/13/2018.
 */

(function () {
	'use strict';

	function productionPlanningActivitySidebarInfoController($scope, activityReservationService, cloudDesktopSidebarInfoControllerService, activityReservationInfoConfigItems) {

		var dataConfig = [
			{
				dataService: activityReservationService,
				selectedItem: 'activityReservationCommonItem'
			}
		];

		$scope.config = activityReservationInfoConfigItems;

		//Header
		$scope.getFirstHeader = function () {
			if ($scope.activityReservationCommonItem) {
				// $scope.mountingReservationCommonItem.AddOnInfoTextExperiment = 'I am here!!';
				return $scope.activityReservationCommonItem.Description;
			}
		};

		cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);
	}

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionPlanningActivitySidebarInfoController',
		['$scope', 'activityReservationService',
			'cloudDesktopSidebarInfoControllerService',
			'activityReservationInfoConfigItems',
			productionPlanningActivitySidebarInfoController]).value('activityReservationInfoConfigItems', [
		{
			panelType: 'text',
			header: 'getFirstHeader()',
			model: 'activityReservationCommonItem',
			items: [
				{
					model: 'Requisition.Project.ProjectName',
					iconClass: 'app-small-icons ico-project',
					description: '"Project Name"',
					domain: 'text'
				},
				{
					model: 'Requisition.Project.ProjectNo',
					iconClass: 'app-small-icons ico-project-boq',
					description: '"Project No"',
					domain: 'text'
				},
				/* {
				 model: 'AddOnInfoTextExperiment',
				 iconClass: 'app-small-icons ico-estimate-rules',
				 description: '"AddOnInfoTextExperiment"',
				 domain: 'comment'
				 },*/
				{
					model: 'Comment',
					iconClass: 'app-small-icons ico-estimate-rules',
					description: '"Comment Text"',
					domain: 'text'
				},
				{
					model: 'ReservedFrom',
					iconClass: 'tlb-icons ico-date',
					description: '"Reserved From"',
					domain: 'datetime'
				},
				{
					model: 'ReservedTo',
					iconClass: 'tlb-icons ico-date',
					description: '"Reserved To"',
					domain: 'datetime'
				},
				{
					model: 'QuantityWithUom',
					iconClass: 'tlb-icons ico-pie-chart',
					description: '"Reserved Quantity"',
					domain: 'text'
				},
				{
					model: 'Requisition.RequestedFrom',
					iconClass: 'tlb-icons ico-date',
					description: '"Requested From"',
					domain: 'datetime'
				},
				{
					model: 'Requisition.RequestedTo',
					iconClass: 'tlb-icons ico-date',
					description: '"Requested To"',
					domain: 'datetime'
				},
				{
					model: 'Requisition.QuantityWithUom',
					iconClass: 'tlb-icons ico-pie-chart',
					description: '"Requested Quantity"',
					domain: 'text'
				},
				{
					model: 'Requisition.CommentText',
					iconClass: 'app-small-icons ico-estimate-rules',
					description: '"Comment Text"',
					domain: 'comment'
				}
			]
		}
	]);
})();