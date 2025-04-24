(function ()
{
	'use strict';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 * @description
	 **/
	angular.module('basics.costgroups').controller('basicsCostgroupsBkpCopyrightController', ['$scope', 'platformContextService',
		function ($scope, platformContextService)
		{
			var language = platformContextService.getLanguage();
			$scope.image = 'Cloud.Style/content/images/crb-copyright/CRB_Dialogbox_' + (language==='fr' ? 'F' : language==='it' ? 'I' : 'D') + '_BKP.gif';
		}
	]);

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 * @description
	 **/
	angular.module('basics.costgroups').controller('basicsCostgroupsBkpImportController', ['$scope', '$http', 'platformGridAPI', 'platformTranslateService', 'basicsCostGroupCatalogDataService',
		function ($scope, $http, platformGridAPI, platformTranslateService, basicsCostGroupCatalogDataService)
		{
			var webApiBaseUrl = globals.webApiBaseUrl + 'basics/costgroupcat/';

			// Inits the combo boxes
			$scope.typeOptions = { items: [{ id: 'BKP', name: 'BKP' }, { id: 'eBKP-H', name: 'eBKP-H' }, { id: 'eBKP-T', name: 'eBKP-T' }], valueMember: 'id', displayMember: 'name' };
			$scope.selectedType = 'BKP';

			// Inits the grid
			var gridColumns = [{ id:'v', field:'v', name$tr$:'basics.costgroups.bkpVersion', width:200 }];
			platformTranslateService.translateGridConfig(gridColumns);
			$scope.gridId   = 'B2CBE4E3F01E4522B91C5D2524F2212C';
			$scope.gridData = { state: $scope.gridId };
			platformGridAPI.grids.config({ id: $scope.gridId, options: { idProperty: 'v', multiSelect: false }, columns: gridColumns });
			updateGrid();

			var okButton = $scope.dialog.getButtonById('ok');
			okButton.disabled = function ()
			{
				return undefined===platformGridAPI.rows.selection({ gridId: $scope.gridId });
			};
			okButton.fn = function()
			{
				$scope.$close({ ok: true });

				// Starts the import
				$http.post(webApiBaseUrl + 'importcrbbkp',
					{
						BkpType:    $scope.selectedType,
						BkpVersion: platformGridAPI.rows.selection({ gridId: $scope.gridId }).v
					})
					.then(function()
					{
						basicsCostGroupCatalogDataService.load();
					});
			};

			$scope.$on('$destroy', function()
			{
				platformGridAPI.grids.unregister($scope.gridId);
				$http.post(globals.webApiBaseUrl + 'boq/main/crb/' + 'license/logout');
			});

			function updateGrid()
			{
				var service = webApiBaseUrl + 'bkpversions?bkpType=' + $scope.selectedType;
				$http.get(service).then(function(response)
				{
					platformGridAPI.items.data($scope.gridId, response.data);
				});
			}

			$scope.onSelectedOptionChanged = function()
			{
				updateGrid();
			};
		}
	]);
})();