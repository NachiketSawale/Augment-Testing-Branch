/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceSelectionExtension
	 * @function
	 * @description
	 * platformDataServiceSelectionExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceValidationErrorHandlerExtension', PlatformDataServiceValidationErrorHandlerExtension);

	PlatformDataServiceValidationErrorHandlerExtension.$inject = ['$q', '_', 'platformModalFormConfigService', 'platformLayoutByDataService', 'platformTranslateService',
		'platformModuleStateService', 'platformValidationByDataService', 'platformDataValidationService'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function PlatformDataServiceValidationErrorHandlerExtension($q, _, platformModalFormConfigService, platformLayoutByDataService, platformTranslateService,
																															platformModuleStateService, platformValidationByDataService, platformDataValidationService) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceSelectionExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @param clearModState {boolean} flag if set to false does not
		 * @returns state
		 */
		var self = this;

		this.assertAllValid = function assertAllValid(rootService, clearModState) {
			var modState;
			if (clearModState === false) {
				modState = platformModuleStateService.state(rootService.getModule());
			} else {
				modState = platformModuleStateService.state(rootService.getModule(), rootService);
			}
			if (modState && modState.validation) {
				return self.waitForAsyncValidation(modState)
					.then(function () {
							return self.handleValidationIssues(rootService, modState)
								.then(function (result) {
										return !!result;
									},
									function () {
										return false;
									}
								);
						}
					);
			} else {
				return $q.when(true);
			}
		};

		this.waitForAsyncValidation = function waitForAsyncValidation(modState) {
			return $q.all(_.map(modState.validation.asyncCalls, function (call) {
				return call.myPromise;
			}));
		};

		this.handleValidationIssues = function handleValidationIssues(rootService, modState) {
			if (modState.validation.issues && modState.validation.issues.length > 0) {
				var issues = self.getValidationIssues(modState.validation.issues);

				var config = {};

				config.title = 'basics.common.validation.validationWizard';
				config.dialogOptions = {
					message: 'basics.common.validation.correctValidationErrors',
					rootService: rootService,
					handleOK: function handleOK() {
						// rootService.refresh();
					}
				};

				_.each(issues, function (issue) {

					if (issue.errLayout && issue.errLayout.formConfiguration) {
						var formOptions = {
							configure: issue.errLayout.formConfiguration
						};

						issue.errLayout.formContainerOptions = {
							formOptions: formOptions
						};
					}

				});

				config.items = issues;

				return platformModalFormConfigService.showDialog(config, true);
			} else {
				return $q.when(true);
			}
		};

		/* jshint -W083 */ // functions defined in loops are only lambda eypressions
		this.getValidationIssues = function getValidationIssues(issues) {
			var confs = [];
			var rest = issues;
			var dataSrv, compSrv;
			while (rest && rest.length > 0) {
				dataSrv = rest[0].dataSrv;
				compSrv = dataSrv.getServiceName();

				var splitted = _.partition(rest, function (candidate) {
					return candidate.dataSrv.getServiceName() === compSrv;
				});

				confs = _(confs).concat(self.getValidationIssuesOfType(splitted[0], dataSrv)).value();

				rest = splitted[1];
			}

			return confs;
		};

		this.getValidationIssuesOfType = function getValidationIssuesOfType(issues, dataSrv) {
			var confs = [];
			var rest = issues;
			while (rest && rest.length > 0) {
				var issue = rest[0];
				var compId = issue.entity.Id;

				var splitted = _.partition(rest, function (candidate) {
					return candidate.entity.Id === compId;
				});

				issue.errLayout = self.getValidationIssuesOfEntity(splitted[0], rest[0].entity, dataSrv);
				confs.push(issue);

				rest = splitted[1];
			}

			return confs;
		};

		this.getValidationIssuesOfEntity = function getValidationIssuesOfEntity(issues, entity, dataSrv) {
			return {
				title: 'Validation-Errors',
				dataItem: entity,
				formConfiguration: self.provideCondensedDetailForm(issues, entity, dataSrv)
			};
		};

		this.provideCondensedDetailForm = function provideCondensedDetailForm(issues, entity, dataSrv) {
			var formLayout = platformLayoutByDataService.provideLayoutFor(dataSrv);
			var myLayout = {
				fid: 'data.service.errorhandlerdialogform',
				version: '0.2.4',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'allData',
						header: dataSrv.getTranslatedEntityName(),
						sortOrder: 1,
						isOpen: true,
						visible: true
					}],
				rows: []
			};

			var index = 1;
			var validationService = platformValidationByDataService.getValidationServiceByDataService(dataSrv);
			_.forEach(formLayout.rows, function (row) {
				if (self.isRequiredField(row, issues)) {
					var newRow = {};
					_.extend(newRow, row);
					newRow.sortOrder = index;
					newRow.gid = 'allData';
					++index;

					const rowModel = row.model.replace(/\./g, '$');

					const syncName = 'validate' + rowModel;
					const asyncName = 'asyncValidate' + rowModel;
					let needsHandler = true;

					if (validationService[syncName]) {
						newRow.validator = validationService[syncName];
						needsHandler = false
					}

					if (validationService[asyncName]) {
						newRow.asyncValidator = validationService[asyncName];
						needsHandler = false;
					}

					if(needsHandler) {
						newRow.validator = function defaultHandlerForAllStuff(entity, value, model) {
							return platformDataValidationService.finishValidation(true, entity, value, model, validationService, dataSrv);
						};
					}

					myLayout.rows.push(newRow);
				}
			});

			platformTranslateService.translateFormConfig(myLayout);

			return myLayout;
		};

		this.isRequiredField = function isRequiredField(row, issues) {
			return row.requiredInErrorHandling || row.model === 'CodeInfo' || row.model === 'Code' ||
				row.model === 'DescriptionInfo' || row.model === 'Description' || row.model === 'DescriptionTr' ||
				row.important ||
				_.find(issues, {model: row.model});
		};

	}
})();