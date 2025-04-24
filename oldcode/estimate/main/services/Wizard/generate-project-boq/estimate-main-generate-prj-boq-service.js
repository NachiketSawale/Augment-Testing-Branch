/**
 * Created by wul on 4/12/2018.
 */

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainReplaceResourceService
     * @function
     * @requires $q
     * @description
     */
	angular.module(moduleName).factory('estimateMainGeneratePrjBoqService', ['$q', '$translate', '$injector', '$http',
		'platformModalService',
		'estimateMainService',
		function ($q, $translate,$injector, $http,
			platformModalService,
			estimateMainService
		) {
			let service = {};
			let obj = {
				selector: {},
				__selectorSettings: {}
			};
			let wzConfig = {
				steps: [{
					id: 'compareCondition',
					disallowBack: false,
					disallowNext: false,
					canFinish: false
				},{
					id: 'compareResult',
					title$tr$: 'estimate.main.generateProjectBoQsWizard.groupTitle3',
					topDescription$tr$: 'estimate.main.generateProjectBoQsWizard.groupTitle3',
					disallowBack: false,
					disallowNext: false,
					canFinish: true
				}]
			};
			let modalOptions = {
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/generate-project-boq/estimate-main-wicboq-to-prjboq-compare-grid.html',
				backdrop: false,
				windowClass: 'form-modal-dialog',
				width: '800px',
				resizeable: true,
				value: {
					wizard: wzConfig,
					entity:obj,
					wizardName: 'wzdlg'
				}
			};

			service.showGeneratePrjBoqDialog = function(entity){

				let projectId = estimateMainService.getSelectedProjectId();
				let estHeaderId = estimateMainService.getSelectedEstHeaderId();
				if(!projectId || projectId <=0 || !estHeaderId || estHeaderId < 0){
					platformModalService.showMsgBox($translate.instant('estimate.main.generateProjectBoQsWizard.noPrjOrLI'), $translate.instant('estimate.main.generateProjectBoQsWizard.noDataFound'));
					return;
				}
				let uiService = $injector.get('estimateMainGeneratePrjBoqUiService');
				uiService.setPropertyId(projectId, estHeaderId);
				uiService.setEntity(entity);
				$injector.get('estimateMainGroupCriteriaTypeService').initData(projectId).then(function(){
					platformModalService.showDialog(modalOptions);
				});
			};

			// service.showGeneratePrjBoqCompareDialog = function (entity) {
			//     let options = angular.copy(modalOptions);
			//
			//     options.templateUrl = globals.appBaseUrl + 'estimate.main/templates/wizard/generate-project-boq/estimate-main-generate-prj-boq-page2.html';
			//     options.resizeable = true;
			//     options.width = '80%';
			//     options.height = '73%';
			//     options.controller = ['$http','$scope', '$injector', '$translate', 'platformGridAPI','platformModalService','estimateMainGeneratePrjBoqUiService','estimateMainGeneratePrjBoqValidationService','WizardHandler', estimateMainGeneratePrjBoqCompareController];
			//     let uiService = $injector.get('estimateMainGeneratePrjBoqUiService');
			//     uiService.setEntity(entity);
			//
			//     platformModalService.showDialog(options);
			// };


			return service;
		}]);
})();



