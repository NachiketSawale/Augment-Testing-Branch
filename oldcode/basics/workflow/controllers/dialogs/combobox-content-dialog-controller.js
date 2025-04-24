/* global angular */
(function (angular) {
	'use strict';

	function ComboboxContentDialog($scope, $translate, platformGridAPI) {
		var toolsItems = [
			{
				id: '1',
				sort: 10,
				caption: 'basics.workflow.modalDialogs.toolsNew',
				iconClass: 'tlb-icons ico-rec-new',
				type: 'check'
			},
			{
				id: '2',
				sort: 20,
				caption: 'basics.workflow.modalDialogs.toolsDelete',
				iconClass: 'tlb-icons ico-rec-delete',
				type: 'item'
			},
			{
				id: '3',
				sort: 30,
				caption: 'basics.workflow.modalDialogs.toolsUp',
				iconClass: 'tlb-icons ico-grid-row-up',
				type: 'item'
			},
			{
				id: '4',
				sort: 40,
				caption: 'basics.workflow.modalDialogs.toolsDown',
				iconClass: 'tlb-icons ico-grid-row-down',
				type: 'item'
			}
		];

		$scope.tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: toolsItems,
			update: function () {
				$scope.tools.version += 1;
			}
		};

		$scope.orientation = 1;

		$scope.orientationOpt = {
			displayMember: 'description',
			valueMember: 'value',
			cssMember: 'cssClass',
			items: [
				{
					value: 1,
					description: $translate.instant('basics.workflow.modalDialogs.manualInputRadio'),
					cssClass: 'pull-left'
				},
				{
					value: 2,
					description: $translate.instant('basics.workflow.modalDialogs.scriptRadio'),
					cssClass: 'pull-left margin-left-ld'
				}
			]
		};

		$scope.changeOrientationOpt = function (radioValue) {
			$scope.orientation = radioValue;
		};

		$scope.gridId = 'A999224BDB7340708A5330B99A0999A9';

		$scope.gridData = {
			state: $scope.gridId
		};

		var tempColumns = [
			{
				id: 'code',
				field: 'Code',
				name: 'Code',
				name$tr$: 'cloud.common.entityCode',
				readonly: true,
				editor: null
			},
			{
				id: 'description',
				field: 'DescriptionInfo',
				name: 'Description',
				name$tr$: 'cloud.common.entityDescription',
				formatter: 'translation',
				editor: null,
				readonly: true,
				width: 300
			}
		];

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			var grid = {
				columns: tempColumns,
				data: [{
					id: 42,
					name: 'blubb',
					desc: 'test text'
				},
					{
						id: 24,
						name: 'test',
						desc: 'test2 text'
					}],
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'Id'
				}
			};
			platformGridAPI.grids.config(grid);
		}

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
		});
	}

	angular.module('basics.workflow').controller('basicsWorkflowComboBoxContentDialog', ['$scope', '$translate', 'platformGridAPI', ComboboxContentDialog]);

})(angular);
