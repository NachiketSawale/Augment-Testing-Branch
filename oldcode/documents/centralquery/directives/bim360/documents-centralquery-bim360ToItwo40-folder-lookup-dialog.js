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
	angular.module('documents.centralquery').directive('documentscentralquerybim360toitwo40folderlookupdialog',
		['_', '$q', '$injector', 'basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'documentsCentralqueryBim360toITwo40Service',
			'cloudDeskBim360Service',
			function (_, $q, $injector, basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition, documentsCentralqueryBim360toITwo40Service,
				cloudDeskBim360Service) {
				var defaults = {
					version: 3,
					lookupType: 'project',
					valueMember: 'Id',
					displayMember: 'FullName',
					showClearButton: true,
					readonly: true,
					uuid: 'c0ea049c6e7c48d492716492aff23504',
					columns: [
						{
							id: 'FolderNameDisplay',
							field: 'FullName',
							name: 'FolderNameDisplay',
							width: 120,
							readonly: true,
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
								var service = $injector.get('documentsCentralqueryBim360toITwo40Service');
								service.setSelectedFolderInfo(args.selectedItem);
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
							return documentsCentralqueryBim360toITwo40Service.getFolders(value.SearchText).then(function (response) {
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