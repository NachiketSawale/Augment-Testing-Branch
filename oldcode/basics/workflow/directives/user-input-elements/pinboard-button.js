/*globals angular */
(function (angular) {
	'use strict';

	function basicsWorkflowPinboardButtonDirective(basicsCommonCommentDataServiceFactory, basicsWorkflowPinboardService, $injector,
		basicsLookupdataSimpleLookupService) {
		return {
			restrict: 'E',
			scope: {
				options: '='
			},
			template: '<div style="height: 450px" data-basics-common-comment-viewer="config" data-disabled="disable()"></div>',
			link: function (scope) {
				var actionInstanceId = '';
				var service = {};
				var entity = basicsWorkflowPinboardService.getSelected();
				if (!entity) {
					entity = {
						Version: 1
					};
				}

				if (scope.$parent.task && scope.$parent.task.id) {
					actionInstanceId = scope.$parent.task.id;
				}
				var mainEntityId = scope.options.mainEntityId;
				let options = {};
				let flag = false;
				function initOptions(){
					if (scope.options.editorMode === 1) {
						mainEntityId = scope.$parent.task.WorkflowInstanceId;
						entity.ActionInstanceId = scope.options.workflowGroupString;
						options.UserDefinedText1 = 'ActionInstanceId';
					} else {
						delete entity.ActionInstanceId;
						let lookupModuleQualifier;
						let serviceName;
						if (scope.options.qualifier === 'project.main.rfi-contributions'){
							lookupModuleQualifier = 'basics.customize.rficontributiontype';
							serviceName = 'projectInfoRequestContributionConfigService';
						}
						else if (scope.options.qualifier === 'change.main.changecomment'){
							lookupModuleQualifier = 'basics.customize.projectchangecontributiontype';
							serviceName = 'changeMainContributionConfigService';
						}

						if (lookupModuleQualifier){
							basicsLookupdataSimpleLookupService.getList({
								lookupModuleQualifier: lookupModuleQualifier,
								displayMember: 'Description',
								valueMember: 'Id'
							});
							options = $injector.get(serviceName).getConfig();
						}
						flag = Object.keys(options).length > 0;
					}
				}

				initOptions();

				entity.Id = mainEntityId;

				basicsWorkflowPinboardService.setSelected(entity);
				service = basicsCommonCommentDataServiceFactory.get(scope.options.qualifier,
					'basicsWorkflowPinboardService', options);

				scope.config = {
					data: service.getComments(),
					columns: flag ? options.columns : service.columns,
					parentProp: '',
					childProp: 'Children',
					dateProp: flag ? options.dateProp : 'Comment.InsertedAt',
					pageSize: 20,
					pageNum: service.pageNum,
					ready: init,
					create: service.create,
					delete: service.delete,
					detail: service.detailInfo,
					loading: service.loading,
					statusOptions: flag ? options.statusOptions: service.statusOptions,
					IsReadonlyStatus: service.IsReadonlyStatus,
					updateRootCount: service.updateRootCount,
					showLastComments: true
				};

				function init(viewer) {
					service.onDataRefresh.register(handleDataRefresh);
					viewer.onDestroy.register(handleViewerDestroy);
					viewer.onPageNumChanged.register(handlePageNumChanged);

					function handleDataRefresh() {
						viewer.setData(service.getComments(), service.getSelectedParentItemStatus());
						scope.config.IsReadonlyStatus = service.getSelectedParentItemStatus();
					}

					function handleViewerDestroy() {
						service.onDataRefresh.unregister(handleDataRefresh);
					}

					function handlePageNumChanged(e, args) {
						service.pageNum = args.newValue;
					}

					service.load();
				}

				scope.disable = function disable() {
					return !(service.loginClerk.Clerk && service.loginClerk.Clerk.Id);
				};
			}
		};
	}

	basicsWorkflowPinboardButtonDirective.$inject = ['basicsCommonCommentDataServiceFactory', 'basicsWorkflowPinboardService', '$injector', 'basicsLookupdataSimpleLookupService'];

	angular.module('basics.workflow').directive('basicsWorkflowPinboardButtonDirective',
		basicsWorkflowPinboardButtonDirective);
})(angular);