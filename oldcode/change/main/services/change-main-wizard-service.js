(function (angular) {
	'use strict';
	angular.module('change.main').factory('changeMainWizardService', ['_', 'basicsCommonChangeStatusService', 'basicsLookupdataSimpleLookupService', 'changeMainService', 'platformSidebarWizardConfigService',

		function (_, basicsCommonChangeStatusService, basicsLookupdataSimpleLookupService, changeMainService, platformSidebarWizardConfigService) {

			var service = {};

			function changeStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						mainService: changeMainService,
						statusField: 'ChangeStatusFk',
						codeField: 'Code',
						descField: 'Description',
						projectField: 'ProjectFk',
						statusDisplayField: 'Description',
						title: 'change.main.changeStatus',
						statusName: 'changeChangeStatus',
						statusProvider: function () {
							var currentChange = changeMainService.getSelected();
							return basicsLookupdataSimpleLookupService.getList({
								valueMember: 'Id',
								displayMember: 'Description',
								lookupModuleQualifier: 'basics.customize.projectchangestatus',
								filter: {
									field: 'RubricCategoryFk',
									customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
								}
							}).then(function (respond) {
								return _.filter(respond, function (item) {
									return item.RubricCategoryFk === currentChange.RubricCategoryFk && item.isLive === true;
								});
							});
						},
						updateUrl: 'change/main/changestatus',
						id: 888
					}
				);
			}

			service.changeStatus = changeStatus().fn;

			var wizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				items: [{
					id: 24458,
					text: 'changeChangeStatus',
					text$tr$: 'change.main.changeStatus',
					type: 'item',
					showItem: true,
					cssClass: 'rw md',
					fn: service.changeStatus
				}]
			};

			service.activate = function activate() {
				platformSidebarWizardConfigService.activateConfig('changeMainWizard', wizardConfig);
			};

			service.deactivate = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig('changeMainWizard');
			};

			return service;
		}

	]);
})(angular);
