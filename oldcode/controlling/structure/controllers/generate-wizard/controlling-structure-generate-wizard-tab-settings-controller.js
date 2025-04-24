/**
 * Created by janas on 25.01.2016.
 */

(function () {

	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name controllingStructureGenerateWizardTabSettingsController
	 * @function
	 *
	 * @description
	 * Controller for generate controlling units wizard.
	 **/
	controllingStructureModule.controller('controllingStructureGenerateWizardTabSettingsController',
		['_', '$scope', '$translate', 'basicsLookupdataConfigGenerator', 'controllingStructureTemplateLookupDataService', 'projectMainForCOStructureService', 'controllingStructureWizardGeneratePreviewService', 'controllingStructureDynamicAssignmentsService',
			function Controller(_, $scope, $translate, basicsLookupdataConfigGenerator, codetemplateDataService, projectMainForCOStructureService, generatePreviewService, dynamicAssignmentsService) {

				$scope.codeTemplates = {list: [], current: undefined};
				codetemplateDataService.getList({disableDataCaching: true}).then(function (templates) {

					_.each(templates, function (template) {
						if (template.IsLive) {
							$scope.codeTemplates.list.push(template);
						}
					});
					// prefer project controlling unit template as preselection
					var selectedProject = projectMainForCOStructureService.getSelected();
					var projectTemplate = _.find(templates, {'Id': selectedProject.ControllingUnitTemplateFk});
					var defaultTemplate = _.find(templates, {'IsDefault': true});
					$scope.codeTemplates.current = projectTemplate || defaultTemplate || templates[0];

					generatePreviewService.setControllingUnitTemplate($scope.codeTemplates.current);
				});

				$scope.codeTemplateOptions = {
					items: $scope.codeTemplates.list,
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					inputDomain: 'description',
					tooltip: 'controlling.structure.codeTemplateTooltip'
				};

				// caching ...
				var assignment2Label = dynamicAssignmentsService.getAssignment2Label();

				$scope.getAssignmentLabels = function getAssignmentLabels(n) {
					var curLabel = assignment2Label['Assignment' + n + 'Name'];
					return curLabel || $translate.instant('controlling.structure.entityAssignment', {p_0: n});
				};

				$scope.$watch('codeTemplates.current', generatePreviewService.setControllingUnitTemplate, true);

				$scope.dataItem = {};
				$scope.formConfiguration = {
					fid: 'controlling.structure.generateWizardTabSettings',
					version: '0.0.1',
					showGrouping: false,
					groups: [
						{gid: 'baseGroup', attributes: ['codetemplate']}
					],
					rows: [
						// Code Template
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'controllingStructureTemplateLookupDataService',
							enableCache: false
						},
						{
							gid: 'baseGroup',
							rid: 'codetemplate',
							model: 'codetemplate',
							sortOrder: 1,
							label$tr$: 'basics.customize.Codetemplate'
						}
						)
					]
				};

			}]);

})();
