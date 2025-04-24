/**
 * Created by xsi on 2016-06-17.
 */
(function() {
	'use strict';
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).controller('constructionSystemMainHeaderGroupLookupController',
		['$scope', 'constructionSystemMainHeaderService',
			function ($scope, constructionSystemMainHeaderService) {

				var selectedBoqHeaderChanged = function selectedBoqHeaderChanged(e, args) {
					if (args.selectedItem) {
						constructionSystemMainHeaderService.reloadBySelectedGroup(args.selectedItem.Id);
						$scope.selectedItem = args.selectedItem;
					} else {
						constructionSystemMainHeaderService.reloadBySelectedGroup(-1);
						$scope.selectedItem = args.selectedItem;
					}
				};

				$scope.lookupOptions = {
					events: [{
						name: 'onSelectedItemChanged', handler: selectedBoqHeaderChanged
					}],
					dataServiceName: 'constructionSystemMainGroupLookupDataService',
					displayMember: 'Description',
					lookupModuleQualifier: 'constructionSystemMainGroupLookupDataService',
					lookupType: 'ConstructionSystemMasterGroup',
					showClearButton: true,
					valueMember: 'Id',
					columns: [
						{
							id: 'Description',
							field: 'Description',
							name: 'Description',
							formatter: 'description',
							name$tr$: 'cloud.common.entityDescription'
						}
					]
				};

				$scope.selectedGroup = {
					cosGroupFk: constructionSystemMainHeaderService.getSelectedGroupId()
				};
			}

		]);

})();
