(function (angular) {
	'use strict';
	const module = angular.module('basics.common');
	module.factory('basicsCommonPermissionSummaryService', basicsCommonPermissionSummaryService);
	basicsCommonPermissionSummaryService.$inject = ['_','$translate', '$http', 'platformGridDialogService', 'platformRuntimeDataService'];
	function basicsCommonPermissionSummaryService(_,$translate, $http, platformGridDialogService, platformRuntimeDataService){

		function getColumns(gridData) {
			const columns = [
				{
					id: 'permissionName',
					name$tr$: 'basics.common.dialog.permissionSummary.column.permissionName',
					formatter: 'description',
					field: 'AccessRightDescriptorName',
					width: 250
				},
				{
					id: 'permissionUUID',
					name$tr$: 'basics.common.dialog.permissionSummary.column.permissionUUID',
					formatter: 'description',
					field: 'AccessGuid',
					width: 250
				}
			];

			const hidePurposeColumn = _.every(gridData, (item) => {
				return _.isNil(item['Explanation']);
			});

			if (!hidePurposeColumn) {
				columns.push({
					id: 'purpose',
					name$tr$: 'basics.common.dialog.permissionSummary.column.purpose',
					formatter: 'description',
					field: 'Explanation',
					width: 250
				});
			}

			columns.push(...[
				{
					id: 'create',
					name$tr$: 'basics.common.dialog.permissionSummary.column.create',
					formatter: 'boolean',
					field: 'HasCreate',
					width: 50
				},
				{
					id: 'read',
					name$tr$: 'basics.common.dialog.permissionSummary.column.read',
					formatter: 'boolean',
					field: 'HasRead',
					width: 50
				},
				{
					id: 'write',
					name$tr$: 'basics.common.dialog.permissionSummary.column.write',
					formatter: 'boolean',
					field: 'HasWrite',
					width: 50
				},
				{
					id: 'delete',
					name$tr$: 'basics.common.dialog.permissionSummary.column.delete',
					formatter: 'boolean',
					field: 'HasDelete',
					width: 50
				},
				{
					id: 'execute',
					name$tr$: 'basics.common.dialog.permissionSummary.column.execute',
					formatter: 'boolean',
					field: 'HasExecute',
					width: 50
				}
			]);
			return columns;
		}

		function showDialog(key, title){
			if(!key){
				throw 'No key was found.';
			}
			if(!title){
				title = $translate.instant('basics.common.dialog.permissionSummary.defaultTitle');
			}

			$http.get(globals.webApiBaseUrl+'basics/common/permissionsummary/summary?key='+key).then((result)=>{
				const gridData = result.data;
				gridData.forEach(item => processItem(item));
				const columns = getColumns(gridData);

				const gridConfig = {
					columns: columns,
					items: gridData,
					idProperty: 'AccessGuid',
					tree: false,
					headerText: title,
					isReadOnly: true
				};

				platformGridDialogService.showDialog(gridConfig);
			});

		}

		function processItem(item){
			const hiddenFields = [];
			if(_.isNil(item['HasCreate'])){
				hiddenFields.push('HasCreate');
			}

			if(_.isNil(item['HasRead'])){
				hiddenFields.push('HasRead');
			}

			if(_.isNil(item['HasWrite'])){
				hiddenFields.push('HasWrite');
			}

			if(_.isNil(item['HasDelete'])){
				hiddenFields.push('HasDelete');
			}

			if(_.isNil(item['HasExecute'])){
				hiddenFields.push('HasExecute');
			}
			platformRuntimeDataService.hideContent(item, hiddenFields, true);
		}

		return {
			showDialog: showDialog
		};
	}
})(angular);