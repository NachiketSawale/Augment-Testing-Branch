/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainWicboqMovingController', ['$scope', '$injector', '$translate', 'platformTranslateService',
		function ($scope, $injector,  $translate, platformTranslateService) {

			$scope.path = globals.appBaseUrl;

			$scope.entity = {
				MergeOption:1,
				MergeType:1
			};

			$scope.configTitle = $translate.instant('estimate.main.generateProjectBoQsWizard.moveingWicBoqHeaderText');

			$scope.formOptionsCompareOptionSettings = {
				configure: getFormConfig(true)
			};

			function getFormConfig(){
				let  formConfig =  {
					fid: 'estimate.main.moveBoq',
					version: '0.1.1',
					showGrouping: true,
					groups: [
						{
							gid: 'groupGroup',
							header: 'Merging Option',
							header$tr$: 'estimate.main.generateProjectBoQsWizard.mergeOption',
							visible: true,
							isOpen: true,
							attributes: []
						}
					],
					rows: [
						{
							gid: 'groupGroup',
							rid: 'MergeOption',
							label: 'Merge Option',
							label$tr$: 'estimate.main.generateProjectBoQsWizard.mergeOption',
							type: 'radio',
							model: 'MergeOption',
							sortOrder: 1,
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								items: [
									{Id: 1, Description: $translate.instant('estimate.main.generateProjectBoQsWizard.mergeOption1'), Value : '1'},
									{Id: 2, Description: $translate.instant('estimate.main.generateProjectBoQsWizard.mergeOption2'), Value : '2'}
								]}
						}// ,
						// {
						//     gid: 'groupGroup',
						//     rid: 'MergeType',
						//     label: 'How to merge',
						//     label$tr$: 'estimate.main.generateProjectBoQsWizard.mergeType',
						//     type: 'radio',
						//     model: 'MergeType',
						//     sortOrder: 1,
						//     options: {
						//         labelMember: 'Description',
						//         valueMember: 'Value',
						//         items: [
						//             {Id: 1, Description: $translate.instant('estimate.main.generateProjectBoQsWizard.mergeTypeOption1'), Value : '1'},
						//             {Id: 2, Description: $translate.instant('estimate.main.generateProjectBoQsWizard.mergeTypeOption2'), Value : '2'}
						//         ]}
						// }
					]
				};

				platformTranslateService.translateFormConfig(formConfig);

				return formConfig;
			}

			$scope.hideTreeGrid = !!$scope.$parent.modalOptions.dataItems;

			$scope.canExecute = function () {
				let selected = $injector.get('estimateMainMovingWicboqTreeService').getSelected() || $scope.$parent.modalOptions.dataItems;
				return selected && (!selected.cssClass);
			};

			$scope.execute = function () {
				let service = $injector.get('estimateMainMovingWicboqTreeService');
				let selected = $injector.get('estimateMainMovingWicboqTreeService').getSelected() || $scope.$parent.modalOptions.dataItems;
				service.restoreCss();
				if(selected){
					$injector.get('estimateMainWicboqToPrjboqCompareDataForWicService').moveSeletedItemTo(selected, $scope.entity.MergeOption);
				}

				$scope.close();
			};

			$scope.modalOptions.headerText = $scope.configTitle;

			$scope.close = function () {
				$scope.$close(false);
			};


			// un-register on destroy
			$scope.$on('$destroy', function () {

			});
		}]);
})();
