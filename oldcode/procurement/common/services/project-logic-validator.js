/**
 * Created by wuj on 5/13/2015.
 */

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonProjectLogicalValidator',
		['$q', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', '$timeout',
			function ($q, lookupDataService, basicsLookupdataLookupDescriptorService, $timeout) {

				function Validator() {
					var self = this;
					self.getService = function getService(options) {
						var projectFkField = options.ProjectFk || 'ProjectFk',
							prcPackageFkField = options.PrcPackageFk || 'PrcPackageFk',
							controllingUnitFkField = options.ControllingUnitFk || 'ControllingUnitFk',
							descriptionField = options.Description || 'Description',
							dataService = options.dataService,
							service = {},
							prcPackages = [], prcPackageItem,
							controllingUnits = [], controllingUnitItem;

						/**
						 * refresh grid display
						 */
						function refresh(entity) {
							if (dataService && dataService.fireItemModified) {
								$timeout(function () {
									entity = entity || dataService.getSelected();
									dataService.fireItemModified(entity);
								});
							}
						}

						function flatten(input, output, childProp) {
							var i;
							for (i = 0; i < input.length; i++) {
								output.push(input[i]);
								if (input[i][childProp] && input[i][childProp].length > 0) {
									flatten(input[i][childProp], output, childProp);
								}
							}
							return output;
						}

						function setPrcPackage(entity, projectFk, fireEvent) {
							if (entity[prcPackageFkField]) {
								prcPackageItem = _.find(prcPackages, {Id: entity[prcPackageFkField]});

								if (projectFk && (!prcPackageItem || prcPackageItem.ProjectFk !== projectFk)) {
									// this package must be from the current project
									entity[prcPackageFkField] = null;
								} else {
									if (!entity[descriptionField] && prcPackageItem) {
										// If not set by the user the name of the package is copied.
										entity[descriptionField] = prcPackageItem.Description;
									}
									if (dataService && dataService.autoCreateChainedInvoice && fireEvent) {
										dataService.autoCreateChainedInvoice.fire();
									}
								}
								refresh(entity);
							} else {
								if (projectFk) {
									// If PRC_PACKAGE_FK is null and there is only one PRC_PACKAGE
									// for the project then set the package automatically
									var packageItems = _.filter(prcPackages, function (item) {
										return item.ProjectFk === projectFk;
									});
									if (packageItems.length === 1) {
										entity.PrcPackageFk = packageItems[0].Id;
										if (dataService && dataService.autoCreateChainedInvoice && fireEvent) {
											dataService.autoCreateChainedInvoice.fire();
										}
									}
									refresh(entity);
								}
							}
						}

						function checkPrcPackage(entity, projectFk, fireEvent) {
							const loadPkgPromise = prcPackages.length ? $q.when(prcPackages) : lookupDataService.getList('PrcPackage');
							loadPkgPromise.then((data) => {
								if (!data) {
									return;
								}
								prcPackages = data;
								setPrcPackage(entity, projectFk, fireEvent);
							});
						}

						function setControllingUnit(entity, projectFk) {
							if (entity.ControllingUnitFk) {
								controllingUnitItem = _.find(controllingUnits, {Id: entity.ControllingUnitFk});
								if (!controllingUnitItem || controllingUnitItem.PrjProjectFk !== projectFk) {
									// then this controlling unit must be from the current project
									entity.ControllingUnitFk = null;
									refresh(entity);
								}
							} else {
								if (projectFk) {
									// If PRC_PACKAGE_FK is null and there is only one PRC_PACKAGE
									// for the project then set the package automatically
									var controllingUnitItems = _.filter(controllingUnits, function (item) {
										return item.PrjProjectFk === projectFk;
									});
									if (controllingUnitItems.length === 1) {
										entity.ControllingUnitFk = controllingUnitItems[0].Id;
									}
									refresh(entity);
								}
							}
						}

						function checkControllingUnit(entity, projectFk) {
							if (controllingUnits.length > 0) {
								setControllingUnit(entity, projectFk);
							}
							else {
								var data = basicsLookupdataLookupDescriptorService.getData('Controllingunit');
								if (!data || !data.length) {
									lookupDataService.getList('Controllingunit').then(function (data) {
										if (!data) {
											return;
										}

										flatten(data, controllingUnits, 'ChildItems');
										setControllingUnit(entity, projectFk);
									});
								} else {
									flatten(data, controllingUnits, 'ChildItems');
									setControllingUnit(entity, projectFk);
								}
							}
						}

						function setProjectFk(entity, controllingUnitFk) {
							controllingUnitItem = _.find(controllingUnits, {Id: controllingUnitFk});
							// If MDC_CONTROLLINGUNIT_FK is set to a value not equal to NULL and the project is NULL,
							// then the project is set to MDC_CONTROLLINGUNIT.PRJ_PROJECT_FK
							if (controllingUnitItem && !entity[projectFkField]) {
								entity[projectFkField] = controllingUnitItem.PrjProjectFk;
								if (angular.isFunction(dataService.updateReadOnly)) {
									dataService.updateReadOnly(entity);
								}
								// also check PRC_PACKAGE_FK
								checkPrcPackage(entity, entity[projectFkField], true);
								refresh(entity);
							}
						}

						function checkProjectFk(entity, controllingUnitFk) {
							if (controllingUnits.length === 0) {
								var data = basicsLookupdataLookupDescriptorService.getData('Controllingunit');
								if (!data || !data.length) {
									lookupDataService.getList('Controllingunit').then(function (data) {
										if (!data) {
											return;
										}
										flatten(data, controllingUnits, 'ChildItems');
										setProjectFk(entity, controllingUnitFk);
									});
								} else {
									flatten(data, controllingUnits, 'ChildItems');
									setProjectFk(entity, controllingUnitFk);
								}
							} else {
								setProjectFk(entity, controllingUnitFk);
							}
						}

						service.projectValidator = function projectValidator(entity, value) {
							if (entity[projectFkField] === value) {
								return true;
							}
							entity[projectFkField] = value;

							if (value) {
								checkPrcPackage(entity, value, !!entity.ConHeaderFk);
								checkControllingUnit(entity, value);
							}
							if (angular.isFunction(dataService.updateReadOnly)) {
								dataService.updateReadOnly(entity);
							}
							return true;
						};

						service.prcPackageValidator = function prcPackageValidator(entity, value, model, fireEvent) {
							if (!value) {
								return true;
							}

							if (entity[prcPackageFkField] === value) {
								return true;
							}

							entity[prcPackageFkField] = value;
							checkPrcPackage(entity, null, fireEvent);
							return true;
						};

						service.controllingUnitValidator = function controllingUnitValidator(entity, value) {
							if (!value || entity[projectFkField]) {
								return true;
							}
							entity[controllingUnitFkField] = value;
							checkProjectFk(entity, value);
							return true;
						};

						return service;
					};
				}

				return new Validator();

			}]);

})(angular);