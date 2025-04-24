/**
 * Created by hog on 14.12.2017.
 */
(function () {
	'use strict';


	function resourceEnterpriseSidebarInfoController($scope, resourceEnterprisePlanningBoardReservationService, cloudDesktopSidebarInfoControllerService, resourceEnterprisePlanningBoardInfoConfigItems)  {

		var dataConfig = [
			{
				dataService: resourceEnterprisePlanningBoardReservationService,
				selectedItem: 'resourceEnterprisePlanningBoardEnterpriseCommonItem'
			}
		];

		$scope.config = resourceEnterprisePlanningBoardInfoConfigItems;

		// Header
		$scope.getFirstHeader = function () {
			if ($scope.mountingEnterpriseCommonItem) {
				return $scope.mountingEnterpriseCommonItem.Description;
			}
		};

		cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);
	}

	angular.module('resource.enterprise').controller('resourceEnterpriseSidebarInfoController', ['$scope', 'resourceEnterprisePlanningBoardReservationService',
		'cloudDesktopSidebarInfoControllerService', 'resourceEnterprisePlanningBoardInfoConfigItems',
		resourceEnterpriseSidebarInfoController])
		.value('resourceEnterprisePlanningBoardInfoConfigItems', [
			{
				panelType: 'text',
				header: 'getFirstHeader()',
				model: 'resourceEnterprisePlanningBoardEnterpriseCommonItem',
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