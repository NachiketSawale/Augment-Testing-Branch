/**
 * Created by janas on 11.12.2015.
 */


(function () {
	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureWizardGeneratePreviewService
	 * @function
	 *
	 * @description
	 * controllingStructureWizardGeneratePreviewService is the data service for showing a preview.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	controllingStructureModule.factory('controllingStructureWizardGeneratePreviewService',
		['_', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformTranslateService', 'controllingStructureGeneratorService', 'controllingStructureGeneratorAssignmentsService', 'controllingStructureCodetemplateValidationService',
			function (_, platformDataServiceFactory, platformRuntimeDataService, platformTranslateService, generatorService, generatorAssignmentsService, codetemplateValidator) {

				var codeTemplate = null,
					controllingUnitTemplate = null,
					metadataService = null,
					validationErrorsAvailable = false, // will  be set to true, if no issues found
					alerts = [];

				var generatePreviewServiceOptions = {
						module: controllingStructureModule,
						serviceName: 'controllingStructureWizardGeneratePreviewService',
						httpRead: {
							useLocalResource: true,
							resourceFunction: generateData,
							resourceFunctionParameters: []
						},
						entitySelection: {},
						presenter: {
							tree: {
								parentProp: 'ControllingunitFk',
								childProp: 'ControllingUnits'
							}
						},
						actions: {}
					},
					serviceContainer = platformDataServiceFactory.createNewComplete(generatePreviewServiceOptions),
					service = serviceContainer.service;

				function eachInTree(tree, func) {
					return _.each(tree, function (item) {
						func(item);
						eachInTree(item[generatePreviewServiceOptions.presenter.tree.childProp], func); // children?
					});
				}

				function validateGeneratedData(data) {
					resetAlerts();
					validationErrorsAvailable = false;
					var properties = ['Code',
						'Assignment01', 'Assignment02', 'Assignment03', 'Assignment04', 'Assignment05',
						'Assignment06', 'Assignment07', 'Assignment08', 'Assignment09', 'Assignment10'];

					eachInTree(data, function (item) {
						// validate properties above => max length 32
						_.forEach(properties, function (propName) {
							var result = /^.{0,32}$/.test(item[propName]);
							if (!result) {
								validationErrorsAvailable = true;
							}
							platformRuntimeDataService.applyValidationResult(result, item, propName);
						});
					});

					// show alert / warning message if validation errors available
					if (validationErrorsAvailable) {
						addAlert('Validation errors available!', 'controlling.structure.validationErrorsAvailableWarning');
					}

					// check root element restriction (only one root controlling unit)
					if (_.size(data) > 1) {
						addAlert('Only one root controlling unit allowed!', 'controlling.structure.rootRestrictionWarning');
					}
				}

				function generateData() {
					if (!codetemplateValidator.validate(codeTemplate) || metadataService === null) {
						return [];
					}

					generatorService.init(codeTemplate, metadataService);
					var data = generatorService.generateCUs({
						parentProp: generatePreviewServiceOptions.presenter.tree.parentProp,    // 'ControllingunitFk'
						childProp: generatePreviewServiceOptions.presenter.tree.childProp,      // 'ControllingUnits'
						idStart: 0,
						processFunc: function (cunit) {
							generatorAssignmentsService.extendAssignments(controllingUnitTemplate, cunit);
						}
					});

					validateGeneratedData(data);

					return data;
				}

				function addAlert(message, messageTr) {
					var alert = {
						title: 'Warning', title$tr$: 'basics.common.alert.warning', css: 'alert-warning',
						theme: 'warning', message: message,
						message$tr$: messageTr
					};
					platformTranslateService.translateObject(alert);
					alerts.push(alert);
				}

				function resetAlerts() {
					alerts.length = 0; // clean alerts
				}

				service.canGenerate = function canGenerate() {
					return !validationErrorsAvailable && _.size(service.getAlerts()) === 0;
				};

				service.getTemplate = function () {
					return controllingUnitTemplate;
				};

				service.setControllingUnitTemplate = function (cunitTemplate) {
					if (angular.isDefined(cunitTemplate) && cunitTemplate !== null) {
						controllingUnitTemplate = cunitTemplate;
						codeTemplate = cunitTemplate.Codetemplate;
					}
				};

				service.setMetadataService = function (dataservice) {
					metadataService = dataservice;
				};

				service.getAlerts = function getAlerts() {
					return alerts;
				};

				return service;
			}
		]);
})();
