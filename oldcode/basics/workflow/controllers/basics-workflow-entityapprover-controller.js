(function (angular) {

	'use strict';
	var moduleName = 'basics.workflow';

	angular.module(moduleName).service('basicsWorkflowEntityApproversCommonColumns',['$translate', function ($translate) {

		var service = {};

		service.getStandardConfigForListView = function () {
			return {
				addValidationAutomatically: true,
				columns: [
					{
						id: 'Id',
						field: 'Id',
						name$tr$: 'basics.workflow.action.customEditor.id',
						name: 'Id',
						width:40,
						formatter:'integer',
						editor: 'integer'
					},
					{
						id: 'IsApproved',
						field: 'IsApproved',
						name$tr$: 'basics.workflow.approver.approverDecision',
						name: 'Approver Decision',
						width:40,
						readonly: true,
						formatter: function (row, cell, value, columnDef, dataContext) {
							let approverIcon = dataContext.IsApproved ? 'status-icons ico-status02' : (dataContext.EvaluatedOn === null ? 'status-icons ico-status19' : 'status-icons ico-status01');
							let approverText = dataContext.IsApproved ? $translate.instant('basics.workflow.approver.approved') : (dataContext.EvaluatedOn === null ? $translate.instant('basics.workflow.approver.pending') : $translate.instant('basics.workflow.approver.rejected'));
							return ('<i class ="block-image ' + approverIcon + '"></i>') + '<span class="pane-r slick">' + approverText +'</span>';
						}

					},
					{
						id: 'Comment',
						field: 'Comment',
						name$tr$: 'basics.workflow.template.comment',
						name: 'Comment',
						width: 100,
						formatter: 'comment',
						editor: 'comment'
					},
                    {
						id: 'EvaluationLevel',
						field: 'EvaluationLevel',
						name$tr$: 'basics.workflow.approver.evaluationLevel',
						name: 'EvaluationLevel',
						width: 40,
						formatter: 'integer',
						editor: 'integer'
					},
                    {
						id: 'EvaluatedOn',
						field: 'EvaluatedOn',
						name$tr$: 'basics.workflow.approver.evaluatedOn',
						name: 'EvaluatedOn',
						width: 100,
						formatter: 'dateutc'
						
					},
                    {
						id: 'DueDate',
						field: 'DueDate',
						name$tr$: 'basics.workflow.approver.dueDate',
						name: 'DueDate',
						width: 100,
						formatter: 'dateutc',

					},
                    {
						id: 'ClerkRole',
						field: 'ClerkRole',
						name$tr$: 'basics.workflow.action.customEditor.clerkRole',
						name: 'ClerkRole',
						width: 100,
						formatter: 'comment',
						editor: 'comment'
					},
                    {
						id: 'Clerk',
						field: 'Clerk',
						name$tr$: 'basics.workflow.action.customEditor.clerk',
						name: 'Clerk',
						width: 100,
						formatter: 'comment',
						editor: 'comment'
					}

				]
			};
		};
		return service;
	}]);

	angular.module(moduleName).controller('basicsWorkflowEntityApproverController', [
		'_',
		'$scope',
		'$translate',
		'$injector',
		'platformGridControllerService',
		'basicsWorkflowEntityApproversDataService',
		'basicsWorkflowEntityApproversCommonColumns',
		'platformGridAPI',
		'platformPermissionService',
		function (
			_,
			$scope,
			$translate,
			$injector,
			gridControllerService,
			dataServiceFactory,
			gridColumns,
			platformGridAPI,
			platformPermissionService
		) {

			var serviceName = $scope.getContentValue('mainService'),
				entityGUID = $scope.getContentValue('entityGUID'),
				uuid = $scope.getContentValue('uuid'),
				title = $scope.getContentValue('title'),
				parentService = $injector.get(serviceName),
				gridConfig = {initCalled: false, columns: []},
				permissionGUID = $scope.getContentValue('permission'),
				isReadonlyContainer = $scope.getContentValue('isReadonly');

			parentService.uuid = uuid;
			var dataService = dataServiceFactory.getGenericService(parentService, {
				uuid: uuid,
				entityGUID: entityGUID,
				title: title,
				isController:true
			});


			gridControllerService.initListController($scope, gridColumns, dataService, null, gridConfig);

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', isReadonlyContainer);


			
			function selectedItemChanged() {
				$scope.tools.update();  // force to call disabled fn of toolbar buttons
			}

			dataService.registerSelectionChanged(selectedItemChanged);

			function init() {
				platformPermissionService.loadPermissions([permissionGUID]).then(function () {
					angular.noop();
				});
			}

			init();

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', isReadonlyContainer);
				dataService.unregisterSelectionChanged(selectedItemChanged);
			});
		}
	]);
})(angular);