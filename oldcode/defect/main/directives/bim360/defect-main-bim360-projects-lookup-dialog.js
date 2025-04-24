(function (angular) {
	'use strict';

	/**
     * @ngdoc directive
     * @name basics.lookupdata.directive: basicsLookupDataProjectProjectDialog
     * @element
     * @restrict
     * @priority
     * @scope
     * @description
     * #
     *a dialog directive for prj_project.
     *
     */
	angular.module('defect.main').directive('defectMainBim360ProjectsLookupDialog',
		['_', '$q', '$injector', 'basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'defectMainBim360Service',
			'cloudDeskBim360Service',
			function (_, $q, $injector, basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, defectMainBim360Service,
				cloudDeskBim360Service) {
				var defaults = {
					version: 3,
					lookupType: 'project',
					valueMember: 'PrjKey',
					displayMember: 'ProjectNo',
					showClearButton: true,
					uuid: '2d5a02634cff4ebabe6d636433e73d7b',
					columns: [
						{
							id: 'ProjectNo',
							field: 'ProjectNo',
							name: 'Project No.',
							width: 120,
							name$tr$: 'cloud.common.entityProjectNo'
						},
						{
							id: 'ProjectName',
							field: 'ProjectName',
							name: 'Project Name',
							width: 200,
							name$tr$: 'cloud.common.entityProjectName'
						},
						{
							id: 'ProjectCurrency',
							field: 'Currency',
							name: 'Project Currency',
							width: 80,
							name$tr$: 'cloud.common.entityCurrency'
						}
					],
					title: {
						name: 'Assign project',
						name$tr$: 'cloud.common.dialogTitleProject'
					},
					pageOptions: {
						enabled: true,
						size: 200
					},
					events: [
						{
							name: 'onSelectedItemChanged', // register event and event handler here.
							handler: function (e, args) {
								var service = $injector.get('defectMainBim360Service');
								service.setSelectedPrjInfo(args.selectedItem);
							}
						}
					]
				};

				var dataService = {
					dataProvider: {
						getItemByKey: function () {
							return [];
						},
						getSearchList: function (value) {
							return defectMainBim360Service.getProjects(value.SearchText).then(function (response) {
								var resData = response.data;
								if (resData.TokenInfo) {
									cloudDeskBim360Service.setSessionAuth(resData.TokenInfo);
								}
								var projectsInfo = resData.Bim360Projects;
								if (projectsInfo) {
									var index = 0;
									var curPage = value.PageState.PageNumber;
									var pageSize = value.PageState.PageSize;
									var items = _.filter(projectsInfo, function (item) {
										index++;
										if (index >= curPage * pageSize && index < (curPage + 1) * pageSize) {
											return item;
										}
									});
									var result = {
										items: items,
										itemsFound: projectsInfo.length,
										itemsRetrieved: value.PageState.PageNumber + 1
									};

									return $q.when(result);
								}
								else{
									return $q.when([]);
								}
							});
						}
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, dataService);
			}]);

})(angular);