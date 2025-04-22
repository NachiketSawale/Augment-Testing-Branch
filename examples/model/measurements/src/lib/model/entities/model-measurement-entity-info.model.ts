/*
 * Copyright(c) RIB Software GmbH
 */

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { EntityInfo } from '@libs/ui/business-base';
import { ModelMeasurementDataService } from '../../services/model-measurement-data.service';
import { ModelMeasurementBehavior } from '../../behaviors/model-measurement-behavior.service';
import { IModelMeasurementEntity } from './model-measurement-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';

 export const ModelMeasurementEntityInfo: EntityInfo = EntityInfo.create<IModelMeasurementEntity> ({
                grid: {
                    title: {key: 'model.measurements.modelMeasurementListTitle'},
	                 behavior: ctx =>  ctx.injector.get(ModelMeasurementBehavior)
                },
                form: {
			            title: { key: 'model.measurements.modelMeasurementDetailTitle' },
			            containerUuid: '82a0d97bcd4842d9b2d5460b05473158',
                },
                dataService: ctx => ctx.injector.get(ModelMeasurementDataService),
                dtoSchemeId: {moduleSubModule: 'Model.Measurements', typeName: 'ModelMeasurementDto'},
                permissionUuid: '1b72a5f32b6646e8b5358653fcc51a77',
	             layoutConfiguration: {
		             groups: [{
			             gid: 'contextGroup',
			             attributes: ['ModelFk']
		             }, {
			             gid: 'baseGroup',
			             attributes: ['DescriptionInfo', 'MeasurementGroupFk', 'Code', 'Type', 'Color', 'Value', 'Uom']
		             }],
		             /*overloads: {
			             ModelFk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				             dataServiceName: 'modelProjectVersionedModelLookupDataService',
				             enableCache: true,
				             filter: item => _.isInteger(item.ProjectFk) ? item.ProjectFk : 0,
				             readonly: true
			             }),
			             Type: {
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
			             Code: {
				             navigator: {
					             moduleName: 'model.measurements'
				             }
			             },
			             Color: {
				             editor: 'color',
				             editorOptions: {
					             showClearButton: true
				             }
			             },
			             Value: {
				             readonly: true
			             },
			             MeasurementGroupFk: {
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
			             Uom: {
				             formatter: 'text',
				             readonly: true,
				             grid: {
					             field: 'Uom'
				             }
			             }
			             Uom: {
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
							 }
		             }*/
		             labels: {
			             ...prefixAllTranslationKeys('model.measurements.', {
				             ModelFk: {key: 'model'},
				             MeasurementGroupFk: {key: 'measurementgroupfk'},
				             Code: {key: 'code'},
				             Type: {key: 'type'},
				             Color: {key: 'color'},
				             Value: {key: 'value'},
				             Uom: {key: 'uom'}
			             }),
			             ...prefixAllTranslationKeys('cloud.common.', {
				             DescriptionInfo: {key: 'entityDescription'}
			             })
		             }
	             }
            });