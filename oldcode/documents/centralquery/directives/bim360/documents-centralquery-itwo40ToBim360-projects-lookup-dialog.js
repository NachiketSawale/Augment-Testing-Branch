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
	angular.module('documents.centralquery').directive('documentscentralqueryitwo40tobim360projectslookupdialog',
		['_', '$q', '$injector', 'basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'documentsCentralqueryITwo40toBim360Service',
			'cloudDeskBim360Service',
			function (_, $q, $injector, basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, documentsCentralqueryITwo40toBim360Service,
				cloudDeskBim360Service) {
				var defaults = {
					version: 3,
					lookupType: 'project',
					valueMember: 'PrjKey',
					displayMember: 'ProjectNo',
					showClearButton: true,
					uuid: '35a8b1d3ea274aa0b695da998e891007',
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
								var service = $injector.get('documentsCentralqueryITwo40toBim360Service');
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
							return documentsCentralqueryITwo40toBim360Service.getProjects(value.SearchText).then(function (response) {
								var resData = response.data;
								if (resData.TokenInfo) {
									cloudDeskBim360Service.setSessionAuth(resData.TokenInfo);
								}
								if (resData.StateCode === 'OK') {
									var projectsInfo = JSON.parse(resData.ResultMsg);
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
									} else {
										return $q.when([]);
									}
								}
							}, function (error) {
								return $q.reject(error);
							});
						}
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, dataService);
			}]);

})(angular);