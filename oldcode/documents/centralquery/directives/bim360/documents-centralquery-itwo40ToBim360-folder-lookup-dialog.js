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
	angular.module('documents.centralquery').directive('documentscentralqueryitwo40tobim360folderlookupdialog',
		['_', '$q', '$injector', 'basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'documentsCentralqueryITwo40toBim360Service',
			'cloudDeskBim360Service',
			function (_, $q, $injector, basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, documentsCentralqueryITwo40toBim360Service,
				cloudDeskBim360Service) {
				var defaults = {
					version: 3,
					lookupType: 'project',
					valueMember: 'Id',
					displayMember: 'FullName',
					showClearButton: true,
					uuid: 'd240b40b5e394433967e726570b0452d',
					columns: [
						{
							id: 'FolderNameDisplay',
							field: 'FullName',
							name: 'FolderNameDisplay',
							width: 120,
							name$tr$: 'documents.centralquery.bim360Documents.folderNameDisplay'
						}
					],
					title: {
						name: 'Select BIM 360 folder',
						name$tr$: 'documents.centralquery.bim360Documents.selectBim360Folder'
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
								service.setSelectedFolderInfo(args.selectedItem);
								service.okDisabled();
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
							return documentsCentralqueryITwo40toBim360Service.getFolders(value.SearchText).then(function (response) {
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