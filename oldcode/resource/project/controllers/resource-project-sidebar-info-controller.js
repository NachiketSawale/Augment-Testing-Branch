/**
 * Created by hog on 14.12.2017.
 */
(function () {
	'use strict';

	function resourceProjectSidebarInfoController($scope, cloudDesktopSidebarInfoControllerService, resourceProjectPlanningBoardInfoConfigItems, resourceProjectPlanningBoardReservationService) {

		var dataConfig = [
			{
				dataService: resourceProjectPlanningBoardReservationService,
				selectedItem: 'resourceProjectPlanningBoardProjectCommonItem'
			}
		];

		$scope.config = resourceProjectPlanningBoardInfoConfigItems;

		// Header
		$scope.getFirstHeader = function () {
			if ($scope.mountingProjectCommonItem) {
				return $scope.mountingProjectCommonItem.Description;
			}
		};

		cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);
	}

	angular.module('resource.project').controller('resourceProjectSidebarInfoController', ['$scope', 'cloudDesktopSidebarInfoControllerService', 'resourceProjectPlanningBoardInfoConfigItems', 'resourceProjectPlanningBoardReservationService',
		resourceProjectSidebarInfoController])
		.value('resourceProjectPlanningBoardInfoConfigItems', [
			{
				panelType: 'text',
				header: 'getFirstHeader()',
				model: 'resourceProjectPlanningBoardProjectCommonItem',
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
						domain: 'text',
						navigator: {
							moduleName: 'project.main',
							targetIdProperty: 'Id'
						}
					},
					{
						model: 'Requisition.CommentText',
						iconClass: 'app-small-icons ico-estimate-rules',
						description: '"Comment Text"',
						domain: 'comment'
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
					}
				]
			}
		]);
})();