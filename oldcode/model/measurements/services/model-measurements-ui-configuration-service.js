/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'model.measurements';

	/**
	 * @ngdoc service
	 * @name modelMeasurementUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('modelMeasurementUIConfigurationService', modelMeasurementUIConfigurationService);

	modelMeasurementUIConfigurationService.$inject = ['_', 'basicsLookupdataConfigGenerator',];

	function modelMeasurementUIConfigurationService(_, basicsLookupdataConfigGenerator) {
		const service = {};

		function getUom() {
			const settings = modelWdeViewerIgeService.getCurrentLayoutSettings(scope.modelId);

			if (settings.uomFk) {
				return basicsLookupdataLookupDescriptorService.loadItemByKey('uom', settings.uomFk).then(function (uom) {
					return uom.UnitInfo.Translated;
				});
			}

			return $q.when('');
		}


		service.getModelMeasurementLayout = function () {
			return {
				fid: 'model.measurements.modelMeasurementsForm',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [{
					gid: 'contextGroup',
					attributes: ['modelfk']
				}, {
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'measurementgroupfk', 'code', 'type', 'color', 'value', 'uom']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectVersionedModelLookupDataService',
						enableCache: true,
						filter: item => _.isInteger(item.ProjectFk) ? item.ProjectFk : 0,
						readonly: true
					}),
					type: {
						grid: {
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'modelMeasurementTypeIconService',
								acceptFalsyValues: true
							}
						},
						detail: {
							type: 'imageselect',
							options: {
								serviceName: 'modelMeasurementTypeIconService'
							}
						},
						readonly: true
					},
					code: {
						navigator: {
							moduleName: 'model.measurements'
						}
					},
					color: {
						editor: 'color',
						editorOptions: {
							showClearButton: true
						}
					},
					value: {
						readonly: true
					},
					measurementgroupfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'model-measurements-group-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ModelMeasurementsGroup',
								displayMember: 'DescriptionInfo.Translated',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'model-measurements-group-combobox',
							options: {
								descriptionMember: 'DescriptionInfo.Translated',
							}
						}
					},
					uom: {
						formatter: 'text',
						readonly: true,
						grid: {
							field: 'Uom'
						}
					}
					/*uom: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'model-measurement-uom-lookup-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ModelMeasurementUom',
								displayMember: 'Uom',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'model-measurement-uom-lookup-dialog',
							options: {
								descriptionMember: 'Uom',
							}
						},
						//readonly: true
					}*/
				}
			};
		};
		return service;
	}
})(angular);
