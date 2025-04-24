/**
 * Created by hzh on 9/19/2019.
 *
 * when Click Ok , get json :
 * ApprovalUserInfo : the root of approve action json
 * ApprovalClerkSelection,CcSelection,Nodes :the node of approve action
 * SelectionType : 0 : Current Project, 1 : Current Company, 2 : Other Company
 * SelectedId : if selected Current Project, it's the project id of current entity,
 *              if selected Current Company, it's then company id of current entity,
 *              if selected Other Company, it's from the popup dialog
 * IsRole : Role based, true or false
 * Role2Clerks,role,clerks : if IsRole is true ,it's the role and clerks from SelectionType to role
 * Clerks : if IsRole is true, it's from Clerk
 * Context
 {
  "ApprovalUserInfo": {
    "ApprovalClerkSelection": {
      "Nodes": [
        {
          "SelectionType": 0,
          "SelectedId": 1272,
          "IsRole": true,
          "Role2Clerks": [
            {
              "role": {},
              "clerks": [{}]
            }
          ],
          "Clerks": []
        },
      ]
    },
    "CcSelection": {
      "Nodes": [
        {
          "SelectionType": 0,
          "SelectedId": 1272,
          "IsRole": false,
          "Role2Clerks": ["role": {},"clerks": [{}]
          ],
          "Clerks": [{}]
        }
      ]
    }
  }
}
 */
(function (angular) {
	'use strict';

	function basicsWorkflowApproverActionDirective(_, $rootScope, $compile, $injector, $templateCache, basicsWorkflowClientActionUtilService,
	                                               basicsWorkflowApproverActionService, basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService,
	                                               basicsClerkClerkFilterTypeForWorkflowComboboxService) {

		return {
			restrict: 'A',
			require: 'ngModel',
			//templateUrl: globals.appBaseUrl + 'basics.workflow/templates/approver-action.html',
			compile: function compile() {
				return function postLink(scope, iElement, attrs, ngModelCtrl) {
					ngModelCtrl.$render = async function () {

						scope.currentItem = {
							clerk: {
								lookupDirective: 'basics-clerk-for-workflow-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									multipleSelection: true,
									events: [
										{
											id: 'clerkChange',
											name: 'onEditValueChanged',
											handler: function (e, args) {
												basicsLookupdataLookupDescriptorService.addData('clerk', args.selectedItems);
											}
										}
									]
								}
							},
							clerkRole: {
								lookupDirective: 'basic-clerk-role-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									multipleSelection: true,
									filterKey: 'clerk-role-for-workflow-filter'
								}
							}
						};

						var filters = [
							{
								key: 'clerk-role-for-workflow-filter',
								serverSide: true,
								fn: function (currentItem) {
									var currentCompany = scope.Context.Entity ? scope.Context.Entity.CompanyFk : 0;
									var currentProject = scope.Context.Entity ? scope.Context.Entity.ProjectFk : 0;
									var filterType = currentItem.SelectionType;
									var otherCompany = currentItem.SelectedId ? currentItem.SelectedId : 0;
									return {
										companyId: filterType === 2 ? otherCompany : currentCompany,
										projectId: currentProject,
										isProject: filterType === 0 ? true : false
									};
								}
							}
						];
						basicsLookupdataLookupFilterService.registerFilter(filters);
						scope.$on('$destroy', function () {
							basicsLookupdataLookupFilterService.unregisterFilter(filters);
						});

						var templateUrl = 'basics.workflow/approver-action.html';
						var html = $templateCache.get(templateUrl);

						await basicsWorkflowClientActionUtilService.initScope(scope, ngModelCtrl);

						var okFn = scope.onOk;
						scope.onOk = function () {
							if (scope.Context.ApprovalUserInfo !== undefined) {
								setClerkSelection(scope, 'ApprovalClerkSelection');
								setClerkSelection(scope, 'CcSelection');
							}

							okFn(scope.task);
						};

						scope.refresh = function () {
							if (!$rootScope.$$phase) {
								scope.$digest();
							} else {
								scope.$evalAsync();
							}
						};

						basicsClerkClerkFilterTypeForWorkflowComboboxService.translationChanged.register(scope.refresh);

						var cancelFn = scope.onCancel;
						scope.onCancel = function () {
							if (scope.Context.ApprovalUserInfo !== undefined) {
								delete scope.Context.ApprovalUserInfo;
							}

							cancelFn();
						};

						function setClerkSelection(scope, selection) {
							var ApprovalClerkSelection = scope.Context.ApprovalUserInfo[selection];
							if (ApprovalClerkSelection !== undefined) {
								var nodeCount = Object.keys(ApprovalClerkSelection).length - 1;
								var arr = [];
								var role2ClerkData = basicsLookupdataLookupDescriptorService.getData('basicclerkrolelookup');
								var clerkData = basicsLookupdataLookupDescriptorService.getData('clerk');
								for (var i = nodeCount - 1; i > -1; i--) {
									var clerks = [], role2Clerks = [];
									var attr = 'Nodes' + i;
									var nodes = ApprovalClerkSelection[attr];
									if (nodes !== undefined) {
										if (nodes.SelectionType !== 2) {
											nodes.SelectedId = '';
											if (nodes.SelectionType === 0 && scope.Context.Entity && scope.Context.Entity.ProjectFk) {
												nodes.SelectedId = scope.Context.Entity.ProjectFk;
											} else if (nodes.SelectionType === 1 && scope.Context.Entity && scope.Context.Entity.CompanyFk) {
												nodes.SelectedId = scope.Context.Entity.CompanyFk;
											}
										}
										if (nodes.IsRole) {
											/* jshint -W083 */
											_.forEach(role2ClerkData, function (item) {
												if (nodes.Role2Clerks.indexOf(item.Id) >= 0) {
													role2Clerks.push({
														role: item.role,
														clerks: item.clerks
													});
												}
											});
										} else {
											clerks = _.filter(clerkData, function (item) {
												return nodes.Clerks.indexOf(item.Id) >= 0;
											});
										}
									}
									arr.unshift({
										SelectionType: nodes.SelectionType,
										SelectedId: nodes.SelectedId,
										IsRole: nodes.IsRole,
										Role2Clerks: role2Clerks,
										Clerks: clerks
									});
								}
								scope.Context.ApprovalUserInfo[selection] = {};
								scope.Context.ApprovalUserInfo[selection].Nodes = arr;
							}
						}

						iElement.html($compile(html)(scope));

						basicsWorkflowApproverActionService.initScope(scope, ngModelCtrl, $compile, $templateCache);
					};

				};
			}
		};
	}

	basicsWorkflowApproverActionDirective.$inject = ['_', '$rootScope', '$compile', '$injector', '$templateCache', 'basicsWorkflowClientActionUtilService',
		'basicsWorkflowApproverAction', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService',
		'basicsClerkClerkFilterTypeForWorkflowComboboxService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowApproverActionDirective', basicsWorkflowApproverActionDirective);

})(angular);
