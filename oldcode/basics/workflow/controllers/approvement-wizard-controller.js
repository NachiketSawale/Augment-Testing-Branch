(function () {
	'use strict';

	function approvementWizardCtrl($scope, basicsWorkflowChangeStatusService, basicsWorkflowClerkRoleService, basicsWorkflowTemplateService, $rootScope) {

		$scope.dialog.getButtonById('create').fn = function (event) {
			var okBtn = $scope.dialog.getButtonById('ok');

			basicsWorkflowTemplateService.getApprovementTemplate()
				.then(function (template) {
					template.Context = [
						{
							id: (Math.floor(Math.random() * 90000) + 10000),
							key: 'RejectStatus',
							value: $scope.rejectedStatus
						},
						{
							id: (Math.floor(Math.random() * 90000) + 10000),
							key: 'ApproveStatus',
							value: $scope.approvedStatus
						},
						{
							id: (Math.floor(Math.random() * 90000) + 10000),
							key: 'StepDefinition',
							value: angular.toJson($scope.stepList)
						},
						{
							id: (Math.floor(Math.random() * 90000) + 10000),
							key: 'EntityName',
							value: _.find($scope.entityList, {Id: $scope.entityId}).statusName
						}
					];
					template.Description = $scope.templateName;
					template.EntityId = $scope.entityId;
					template.TemplateVersion = 1;

					basicsWorkflowTemplateService.createItemByImport(template).then(function () {
						$rootScope.$broadcast('jsonImported:' + 'createItemByImport', null);
						$scope.dialog.click(okBtn, event);
					});
				});

		};
		$scope.newStatusId = null;
		$scope.newRoleId = null;
		$scope.codeMirrorRuleOptions = {
			lineWrapping: false,
			lineNumbers: false,
			singleLine: true,
			scrollbarStyle: 'none',
			lint: false,
			showHint: false,
			readOnly: false,
			// hintOptions: {
			//     get globalScope() {
			//         return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
			//     }
		};

		basicsWorkflowClerkRoleService.getItems('ClerkRole/list').then(function (response) {
			$scope.roleDropDownOptions.items = _.map(_.sortBy(_.filter(response, function (item) {
				return item.IsLive && item.DescriptionInfo.Translated;
			}), ['Sorting']), function (item) {
				return {Id: item.Id, Description: item.DescriptionInfo.Translated};
			});
		});

		$scope.entityId = null;
		$scope.entityList = [
			{
				Id: 'E148524050DA474FBAC64A01CE1D204E',
				Description: 'InvHeaderEntity',
				statusName: 'invoice'
			},
			{
				Id: 'A853F0B9E5E840D1B5B1882323C1C8F7',
				Description: 'ConHeaderEntity',
				statusName: 'contract'
			}
		];
		$scope.entityDropDownOptions = {
			items: $scope.entityList,
			displayMember: 'Description',
			valueMember: 'Id'
		};
		$scope.roleDropDownOptions = {
			items: [],
			displayMember: 'Description',
			valueMember: 'Id'
		};
		$scope.statusDropDownOptions = {
			items: [],
			displayMember: 'Description',
			valueMember: 'Id'
		};

		$scope.status = {
			get approved() {
				return _.find($scope.statusDropDownOptions.items, {Id: $scope.approvedStatus});
			},
			get rejected() {
				return _.find($scope.statusDropDownOptions.items, {Id: $scope.rejectedStatus});
			}
		};

		$scope.stepList = [];

		$scope.$watch(function () {
			return $scope.entityId;
		}, function (newVal, oldVal) {
			if (newVal && newVal !== oldVal) {
				basicsWorkflowChangeStatusService.getParameters($scope.selectedEntity().statusName).then(function (result) {
					$scope.statusDropDownOptions.items = _.map(_.sortBy(result, ['Sorting']), function (item) {
						return {Id: item.Id, Description: item.DescriptionInfo.Translated};
					});
				});
			}
		});

		$scope.selectedEntity = function () {
			return _.find($scope.entityList, {Id: $scope.entityId});
		};
		$scope.addStep = function () {
			var status = _.find($scope.statusDropDownOptions.items, {Id: $scope.newStatusId});
			var role = _.find($scope.roleDropDownOptions.items, {Id: $scope.newRoleId});

			$scope.stepList.push({pos: ($scope.stepList.length + 1), status: status, role: role, rule: $scope.newRule});
			$scope.newStatusId = null;
			$scope.newRoleId = null;
			$scope.newRule = null;
		};

		$scope.removeStep = function (pos) {
			$scope.stepList.splice((pos - 1), 1);
		};
	}

	approvementWizardCtrl.$inject = ['$scope', 'basicsWorkflowChangeStatusService', 'basicsWorkflowClerkRoleService', 'basicsWorkflowTemplateService', '$rootScope'];

	angular.module('basics.workflow')
		.controller('basicsWorkflowApprovementWizardController', approvementWizardCtrl);

})();
