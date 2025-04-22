/*
 * Copyright(c) RIB Software GmbH
 */
import { isArray, isNumber } from 'lodash';
import { Observable } from 'rxjs';
import { IDimension, IUpdateDimension, ICurrentLayoutInfo, DimensionFullData } from '@rib-4.0/ige-viewer';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { FieldType, IFormConfig, IEditorDialogResult } from '@libs/ui/common';
import { IIdentificationData } from '@libs/platform/common';

import { OpenModelRequest } from '../open-model-request';
import { IDimensionService } from '../interfaces/dimension-service.interface';
import { IDimensionGroupEntity } from '../interfaces/dimension-group-entity.interface';
import { DrawingWorkerBase } from './drawing-worker-base';
import { IDimensionEntity } from '../interfaces/dimension-entity.interface';
import { IObjectTemplate } from '../interfaces/object-template.interface';
import { IDimensionData } from '../interfaces/dimension-data.interface';
import { DrawingViewer } from './drawing-viewer';
import { IDimensionFormData } from '../interfaces/dimension-form-data.interface';

/**
 * Drawing dimension worker, handle dimension related logic.
 */
export class DrawingDimensionWorker extends DrawingWorkerBase {
	private modelId: number;
	private dimensionService: IDimensionService;

	public dimensionEntityMap = new Map<string, IDimensionEntity>();

	public constructor(
		viewer: DrawingViewer,
		private modelRequest: OpenModelRequest,
	) {
		super(viewer);

		this.modelId = modelRequest.modelId;
		this.viewer.igeViewer.dimension.readonly = this.viewer.config.readonly;

		if (!viewer.config.dimensionService) {
			throw new Error('Current dimensionService is empty');
		}

		this.dimensionService = viewer.injector.get(viewer.config.dimensionService);

		const s0 = this.igeViewer.dimension.dimensionCreate$.subscribe((e) => {
			this.dimensionService.getObjectTemplate().then((template) => {
				const entity = this.createDimensionEntity(template, e.layout, e.dimension, true);

				if (entity) {
					this.dimensionService.createEntity(modelRequest.modelId, entity).then((d) => {
						this.dimensionEntityMap.set(d.Uuid, d);
					});
				}
			});
		});

		const s1 = this.igeViewer.dimension.dimensionDelete$.subscribe((e) => {
			this.dimensionService.deleteEntityByUuids(modelRequest.modelId, [e.dimension.id]).then((d) => {
				this.dimensionEntityMap.delete(e.dimension.id);
			});
		});

		const s2 = this.igeViewer.dimension.dimensionChange$.subscribe((e) => {
			const entity = this.dimensionEntityMap.get(e.dimension.id);

			if (!entity || !e.dimension.json) {
				return;
			}

			const fullData = this.igeViewer.dimension.getDimensionFullDataFromJson(e.dimension.json);
			const dimensionProps = this.getDimensionProperty(fullData);

			dimensionProps.Height = entity.Data.Height;
			//dimensionProps.Multiplier = entity.Data.Multiplier;
			dimensionProps.Offset = entity.Data.Offset;

			entity.Name = fullData.name;
			entity.IsNegative = fullData.resultType === this.igeViewer.linker.DimensionResultType.Negative;
			entity.Geometry = e.dimension.json;
			entity.Data = dimensionProps;
			this.dimensionService.updateEntity(modelRequest.modelId, entity).then((e) => {
				this.dimensionEntityMap.set(e.Uuid, e);
			});
		});

		const s3 = this.igeViewer.dimension.dimensionBulkCreate$.subscribe((e) => {
			this.dimensionService.getObjectTemplate().then((template) => {
				const entities = e.dimensions.map((item) => {
					const entity = this.createDimensionEntity(template, e.layout, item, true);
					return entity;
				});
				this.dimensionService.createEntities(modelRequest.modelId, entities).then((items) => {
					items.forEach((item) => this.dimensionEntityMap.set(item.Uuid, item));
				});
			});
		});

		const s4 = this.igeViewer.dimension.dimensionBulkDelete$.subscribe((e) => {
			const uuids = e.dimensions.map((i) => i.id);
			this.dimensionService.deleteEntityByUuids(modelRequest.modelId, uuids).then((success) => {
				if (success) {
					uuids.forEach((u) => this.dimensionEntityMap.delete(u));
				}
			});
		});

		const s5 = this.igeViewer.dimension.dimensionBulkChange$.subscribe((e) => {
			const entities = e.dimensions.map((item) => {
				const fullData = this.igeViewer.dimension.getDimensionFullDataFromJson(item.json!);
				const dimensionProps = this.getDimensionProperty(fullData);
				const entity = this.dimensionEntityMap.get(item.id);

				if (!entity) {
					throw new Error('entity is not found');
				}

				dimensionProps.Height = entity.Data.Height;
				//dimensionProps.Multiplier = entity.Data.Multiplier;
				dimensionProps.Offset = entity.Data.Offset;

				entity.Name = fullData.name;
				entity.IsNegative = fullData.resultType === this.igeViewer.linker.DimensionResultType.Negative;
				entity.Geometry = item.json!;
				entity.Data = dimensionProps;

				return entity;
			});

			this.dimensionService.updateEntities(this.modelId, entities).then((items) => {
				items.forEach((item) => this.dimensionEntityMap.set(item.Uuid, item));
			});
		});

		// this.igeViewer.engine.setOnDimensionHUDInformation(dimensionId => {
		//     const dim = this.igeViewer.engine.getDimensionById(dimensionId);
		//
		//     let hint = 'Name: ' + dim.name +
		//         // '\nKey: ' + dim.id +
		//         '\nCount: ' + dim.count +
		//         '\nLength: ' + dim.length +
		//         '\nWidth: ' + dim.width +
		//         '\nHeight: ' + dim.height +
		//         '\nOffset: ' + dim.baseOffset +
		//         '\nArea: ' + dim.area +
		//         '\nVertical Area: ' + dim.vericalArea +
		//         '\nVolume: ' + dim.volume;
		//
		//     const entity = this.dimensionEntityMap.get(dimensionId);
		//
		//     if (entity) {
		//         hint = 'Name: ' + dim.name +
		//             // '\nKey: ' + dim.id +
		//             '\nCount: ' + entity.Data.Count +
		//             '\nLength: ' + entity.Data.Length +
		//             '\nWidth: ' + entity.Data.Width +
		//             '\nHeight: ' + entity.Data.Height +
		//             '\nOffset: ' + entity.Data.Offset +
		//             '\nArea: ' + entity.Data.Area +
		//             '\nVertical Area: ' + entity.Data.WallArea +
		//             '\nVolume: ' + entity.Data.Volume;
		//     }
		//
		//     return hint;
		// });

		this.subscriptions = [s0, s1, s2, s3, s4, s5];
	}

	/**
	 * Refresh dimensions
	 */
	public refreshDimension$(): Observable<boolean> {
		this.igeViewer.engine.clearDimensionGroups();
		this.igeViewer.engine.unloadAllDimensions();
		return this.loadDimension$(this.igeViewer.currentLayout!.layoutId);
	}

	/**
	 * Load dimensions
	 * @param layoutId
	 */
	public loadDimension$(layoutId: string): Observable<boolean> {
		return new Observable((s) => {
			this.dimensionService.loadDimensionGroups(this.modelRequest.modelId).then((dimensionGroups) => {
				if (this.closed) {
					return;
				}

				this.igeViewer.dimension.loadDimensionGroups(dimensionGroups.map((e) => JSON.stringify(e)));

				this.dimensionService!.loadDimensions(this.modelRequest.modelId, layoutId).then((entities) => {
					if (this.closed) {
						return;
					}

					entities.forEach((entity) => {
						this.dimensionEntityMap.set(entity.Uuid, entity);

						if (entity.Geometry) {
							const dimension = JSON.parse(entity.Geometry) as IDimension;

							if (dimension.dimensionBlob && dimension.dimensionGroupId) {
								this.igeViewer.dimension.loadDimension(entity.Geometry);
							} else {
								const modelConfig = this.modelRequest.modelConfig;

								if (modelConfig) {
									const dimensionGroupId = this.findGroupId(dimension.dimensionId, dimensionGroups);
									const toOriginMatrix = modelConfig.getLayoutToOriginMatrix(layoutId);

									if (!toOriginMatrix) {
										console.info('toOriginMatrix is empty');
									} else {
										this.igeViewer.dimension.loadWdeDimension(dimensionGroupId, entity.Geometry, toOriginMatrix);
									}
								}
							}
						}
					});
					s.next(true);
				});
			});
		});
	}

	/**
	 * resolve dimension uuids by model object ids
	 * @param ids
	 */
	public resolveDimensionUuids(ids: IIdentificationData[]): string[] {
		const uuids: string[] = [];
		const entities = [...this.dimensionEntityMap.values()];

		ids.forEach((i) => {
			entities.some((e) => {
				const matched = e.ModelFk === i.pKey1 && e.ModelObjectFk === i.id;

				if (matched) {
					uuids.push(e.Uuid);
				}

				return matched;
			});
		});

		return uuids;
	}

	/**
	 * Select dimensions
	 * @param uuids
	 */
	public selectDimensions(uuids?: string[] | null) {
		this.igeViewer.mode.enableDimensionSelection();

		if (uuids) {
			this.igeViewer.engine.zoomToDimensions(uuids);
			this.igeViewer.engine.selectDimensions(uuids, true);
		} else {
			this.igeViewer.engine.selectDimensions([], true);
		}
	}

	private findGroupId(dimensionId: string, groups: IDimensionGroupEntity[]) {
		for (let i = 0; i < groups.length; i++) {
			if (
				isArray(groups[i].DimensionIds) &&
				groups[i].DimensionIds.some(function (item) {
					return item === dimensionId;
				})
			) {
				return groups[i].dimensionGroupId;
			}
		}

		return groups[0].dimensionGroupId;
	}

	private createDimensionEntity(template: IObjectTemplate, layout: ICurrentLayoutInfo, data: IUpdateDimension, updateLabel: boolean, dimensionAffected?: IDimensionEntity) {
		if (!data.json) {
			throw new Error('dimension json is null!');
		}

		const fullData = this.igeViewer.dimension.getDimensionFullDataFromJson(data.json!);
		let dimensionProps: IDimensionData;

		if (dimensionAffected) {
			if (updateLabel) {
				this.igeViewer.dimension.updateDimensionName(data.json!, dimensionAffected.Name);
			}

			dimensionProps = this.getDimensionProperty(fullData);
			dimensionProps.Height = dimensionAffected.Data.Height;
			dimensionProps.Multiplier = dimensionAffected.Data.Multiplier;
			dimensionProps.Offset = dimensionAffected.Data.Offset;
		} else {
			if (updateLabel) {
				this.igeViewer.dimension.updateDimensionName(data.json!, template.name);
			}

			dimensionProps = this.getDimensionProperty(fullData);
			dimensionProps.Height = template.height;
			dimensionProps.Multiplier = template.multiplier;
			dimensionProps.Offset = template.offset;
		}

		const dimension = this.igeViewer.engine.getDimensionById(data.id);
		const dimensionEntity = this.dimensionService.newEntity(this.modelRequest.modelId);

		dimensionEntity.Uuid = data.id;
		dimensionEntity.Name = fullData.name;
		dimensionEntity.IsNegative = dimension.resultType === this.igeViewer.linker.DimensionResultType.Negative;
		dimensionEntity.Geometry = dimension.serialize();
		dimensionEntity.Data = dimensionProps;
		dimensionEntity.Layout = layout.layoutId;
		dimensionEntity.Scale = layout.scale;

		return dimensionEntity;
	}

	private getDimensionProperty(dimension: DimensionFullData) {
		return {
			Id: dimension.id,
			Name: dimension.name,
			Count: dimension.count,
			Length: dimension.length,
			Area: dimension.area,
			Volume: dimension.volume,
			Width: dimension.width,
			Height: dimension.height,
			WallArea: dimension.vericalArea,
			Offset: dimension.baseOffset,
			VertexCount: dimension.vertexCount,
			SegmentCount: dimension.segmentCount,
			CutoutArea: dimension.cutoutArea,
			CutoutLength: dimension.cutoutLength,
			AreaExcludingCutouts: dimension.areaExcludingCutouts,
			LengthExcludingCutouts: dimension.lengthExcludingCutouts,
			SegmentCountExcludingCutouts: dimension.segmentCountExcludingCutouts,
			VertexCountExcludingCutouts: dimension.vertexCountExcludingCutouts,
		};
	}

	private createDimensionFormConfig(entity: IDimensionFormData, labels: IDimensionLabel): IFormConfig<IDimensionFormData> {
		return {
			formId: 'drawing-viewer-dimension-form',
			showGrouping: false,
			groups: [
				{
					groupId: 'default',
				},
			],
			rows: [
				{
					groupId: 'default',
					id: 'Name',
					label: {
						text: labels.name,
					},
					type: FieldType.Description,
					model: 'Name',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'Count',
					label: {
						text: labels.count,
					},
					type: FieldType.Decimal,
					model: 'Count',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'Length',
					label: {
						text: labels.length,
					},
					type: FieldType.Decimal,
					model: 'Length',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'Area',
					label: {
						text: labels.area,
					},
					type: FieldType.Decimal,
					model: 'Area',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'Volume',
					label: {
						text: labels.volume,
					},
					type: FieldType.Decimal,
					model: 'Volume',
					sortOrder: 5,
					readonly: false,
				},
				{
					groupId: 'default',
					id: 'Width',
					label: {
						text: labels.width,
					},
					type: FieldType.Decimal,
					model: 'Width',
					sortOrder: 5,
					readonly: false,
				},
				{
					groupId: 'default',
					id: 'Height',
					label: {
						text: labels.height,
					},
					type: FieldType.Decimal,
					model: 'Height',
					sortOrder: 5,
					readonly: false,
				},
				{
					groupId: 'default',
					id: 'Offset',
					label: {
						text: labels.offset,
					},
					type: FieldType.Decimal,
					model: 'Offset',
					sortOrder: 5,
					readonly: false,
				},
				{
					groupId: 'default',
					id: 'Multiplier',
					label: {
						text: labels.multiplier,
					},
					type: FieldType.Decimal,
					model: 'Multiplier',
					sortOrder: 5,
					readonly: false,
				},
				{
					groupId: 'default',
					id: 'SegmentCount',
					label: {
						text: labels.segmentCount,
					},
					type: FieldType.Decimal,
					model: 'SegmentCount',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'VertexCount',
					label: {
						text: labels.vertexCount,
					},
					type: FieldType.Decimal,
					model: 'VertexCount',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'CutoutArea',
					label: {
						text: labels.cutoutArea,
					},
					type: FieldType.Decimal,
					model: 'CutoutArea',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'CutoutLength',
					label: {
						text: labels.cutoutLength,
					},
					type: FieldType.Decimal,
					model: 'CutoutLength',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'AreaExcludingCutouts',
					label: {
						text: labels.areaExcludingCutouts,
					},
					type: FieldType.Decimal,
					model: 'AreaExcludingCutouts',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'LengthExcludingCutouts',
					label: {
						text: labels.lengthExcludingCutouts,
					},
					type: FieldType.Decimal,
					model: 'LengthExcludingCutouts',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'SegmentCountExcludingCutouts',
					label: {
						text: labels.segmentCountExcludingCutouts,
					},
					type: FieldType.Decimal,
					model: 'SegmentCountExcludingCutouts',
					sortOrder: 5,
					readonly: true,
				},
				{
					groupId: 'default',
					id: 'VertexCountExcludingCutouts',
					label: {
						text: labels.vertexCountExcludingCutouts,
					},
					type: FieldType.Decimal,
					model: 'VertexCountExcludingCutouts',
					sortOrder: 5,
					readonly: true,
				},
			],
		};
	}

	public showDimensionPropertyDialog(dimensionId: string) {
		const entity = this.dimensionEntityMap.get(dimensionId);

		if (!entity) {
			throw new Error(`Entity is not found for dimension ${dimensionId}`);
		}

		const data: IDimensionFormData = {
			Name: entity.Name,
			...entity.Data,
		};

		const runtimeInfo: EntityRuntimeData<IDimensionFormData> = {
			readOnlyFields: [],
			validationResults: [],
			entityIsReadOnly: false,
		};

		const labels = this.createDimensionLabel(1);

		this.viewer.formDialogService
			.showDialog<IDimensionFormData>({
				id: 'drawing-viewer-dimension-dialog',
				headerText: labels.title,
				formConfiguration: this.createDimensionFormConfig(data, labels),
				entity: data,
				runtime: runtimeInfo,
				customButtons: [],
				//topDescription: '',
			})
			?.then((result: IEditorDialogResult<IDimensionFormData>) => {
				if (result.closingButtonId === 'ok' && result.value) {
					this.updateDimensionProperty(entity, result.value);
				} else {
					//this.handleCancel(result);
				}
			});
	}

	private updateDimensionProperty(entity: IDimensionEntity, formData: IDimensionFormData) {
		const m = this.checkNSetDimensionProperty(entity, formData);

		if (m.nameModified || m.propModified) {
			this.viewer.status.work('Updating dimension property');
			this.updateDimensionByEntity(entity, m.nameModified, m.propModified);
			this.dimensionService
				.updateEntity(this.modelId, entity, {
					propModified: m.propModified,
					nameModified: m.nameModified,
				})
				.then(() => {
					this.viewer.status.rest();
				});
		}
	}

	private updateDimensionByEntity(entity: IDimensionEntity, nameModified: boolean, propModified: boolean) {
		let dimension = this.igeViewer.engine.getDimensionById(entity.Uuid);
		const copy = JSON.parse(dimension.serialize());

		if (nameModified) {
			copy.name = entity.Name;
		}

		if (propModified) {
			copy.width = entity.Data.Width;
			copy.height = entity.Data.Height;
			copy.vericalArea = entity.Data.WallArea;
			copy.baseOffset = entity.Data.Offset;
		}

		this.igeViewer.engine.updateDimensions([JSON.stringify(copy)]);

		dimension = this.igeViewer.engine.getDimensionById(dimension.id);

		entity.Geometry = dimension.serialize();
	}

	private createDimensionLabel(selectedCount: number) {
		let titleSuffix = '',
			propertySuffix = '';

		if (isNumber(selectedCount) && selectedCount > 1) {
			titleSuffix = '(' + selectedCount + ' ' + this.viewer.translateService.instant('model.wdeviewer.dimension.selected').text + ')';
			propertySuffix = '(' + this.viewer.translateService.instant('model.wdeviewer.dimension.sum').text + ')';
		}

		return {
			title: this.viewer.translateService.instant('model.wdeviewer.dimension.title').text + titleSuffix,
			editDimensionText: this.viewer.translateService.instant('model.wdeviewer.contextMenu.editDimensionText').text,

			name: this.viewer.translateService.instant('model.wdeviewer.dimension.name').text,
			count: this.viewer.translateService.instant('model.wdeviewer.dimension.count').text + propertySuffix,
			length: this.viewer.translateService.instant('model.wdeviewer.dimension.length').text + propertySuffix,
			area: this.viewer.translateService.instant('model.wdeviewer.dimension.area').text + propertySuffix,
			volume: this.viewer.translateService.instant('model.wdeviewer.dimension.volume').text + propertySuffix,
			width: this.viewer.translateService.instant('model.wdeviewer.dimension.width').text,
			height: this.viewer.translateService.instant('model.wdeviewer.dimension.height').text,
			wallArea: this.viewer.translateService.instant('model.wdeviewer.dimension.wallArea').text,
			offset: this.viewer.translateService.instant('model.wdeviewer.dimension.offset').text,
			multiplier: this.viewer.translateService.instant('model.wdeviewer.dimension.multiplier').text,

			segmentCount: this.viewer.translateService.instant('model.wdeviewer.dimension.segmentCount').text + propertySuffix,
			vertexCount: this.viewer.translateService.instant('model.wdeviewer.dimension.vertexCount').text + propertySuffix,
			cutoutArea: this.viewer.translateService.instant('model.wdeviewer.dimension.cutoutArea').text + propertySuffix,
			cutoutLength: this.viewer.translateService.instant('model.wdeviewer.dimension.cutoutLength').text + propertySuffix,
			areaExcludingCutouts: this.viewer.translateService.instant('model.wdeviewer.dimension.areaExcludingCutouts').text + propertySuffix,
			lengthExcludingCutouts: this.viewer.translateService.instant('model.wdeviewer.dimension.lengthExcludingCutouts').text + propertySuffix,
			segmentCountExcludingCutouts: this.viewer.translateService.instant('model.wdeviewer.dimension.segmentCountExcludingCutouts').text + propertySuffix,
			vertexCountExcludingCutouts: this.viewer.translateService.instant('model.wdeviewer.dimension.vertexCountExcludingCutouts').text + propertySuffix,
		};
	}

	public showDimensionsPropertyDialog(dimensionIds: string[]) {
		const entities = dimensionIds.map((dimensionId) => {
			const entity = this.dimensionEntityMap.get(dimensionId);

			if (!entity) {
				throw new Error(`Entity is not found for dimension ${dimensionId}`);
			}

			return entity;
		});

		const dimensionCount = dimensionIds.length;

		const dataItem: IDimensionFormData = {
			Name: '',
			Width: 0,
			Height: 0,
			WallArea: 0,
			Offset: 0,
			Multiplier: 0,

			// readonly properties
			Count: 0,
			Length: 0,
			Area: 0,
			Volume: 0,
			SegmentCount: 0,
			VertexCount: 0,
			CutoutArea: 0,
			CutoutLength: 0,
			AreaExcludingCutouts: 0,
			LengthExcludingCutouts: 0,
			SegmentCountExcludingCutouts: 0,
			VertexCountExcludingCutouts: 0,
		};

		entities.forEach((entity, index) => {
			if (index === 0) {
				dataItem.Name = entity.Name;
				dataItem.Width = entity.Data.Width;
				dataItem.Height = entity.Data.Height;
				dataItem.WallArea = entity.Data.WallArea;
				dataItem.Offset = entity.Data.Offset;
				dataItem.Multiplier = entity.Data.Multiplier || 0;
			} else {
				if (dataItem.Name && dataItem.Name !== entity.Name) {
					dataItem.Name = '';
				}
				if (dataItem.Width && dataItem.Width !== entity.Data.Width) {
					dataItem.Width = 0;
				}
				if (dataItem.Height && dataItem.Height !== entity.Data.Height) {
					dataItem.Height = 0;
				}
				if (dataItem.WallArea && dataItem.WallArea !== entity.Data.WallArea) {
					dataItem.WallArea = 0;
				}
				if (dataItem.Offset && dataItem.Offset !== entity.Data.Offset) {
					dataItem.Offset = 0;
				}
				if (dataItem.Multiplier && dataItem.Multiplier !== entity.Data.Multiplier) {
					dataItem.Multiplier = 0;
				}
			}

			dataItem.Count += entity.Data.Count;
			dataItem.Length += entity.Data.Length;
			dataItem.Area += entity.Data.Area;
			dataItem.Volume += entity.Data.Volume;
			dataItem.SegmentCount += entity.Data.SegmentCount;
			dataItem.VertexCount += entity.Data.VertexCount;
			dataItem.CutoutArea = this.addValue(dataItem.CutoutArea, entity.Data.CutoutArea);
			dataItem.CutoutLength = this.addValue(dataItem.CutoutLength, entity.Data.CutoutLength);
			dataItem.AreaExcludingCutouts = this.addValue(dataItem.AreaExcludingCutouts, entity.Data.AreaExcludingCutouts);
			dataItem.LengthExcludingCutouts = this.addValue(dataItem.LengthExcludingCutouts, entity.Data.LengthExcludingCutouts);
			dataItem.SegmentCountExcludingCutouts = this.addValue(dataItem.SegmentCountExcludingCutouts, entity.Data.SegmentCountExcludingCutouts);
			dataItem.VertexCountExcludingCutouts = this.addValue(dataItem.VertexCountExcludingCutouts, entity.Data.VertexCountExcludingCutouts);
		});

		const runtimeInfo: EntityRuntimeData<IDimensionFormData> = {
			readOnlyFields: [],
			validationResults: [],
			entityIsReadOnly: false,
		};

		const labels = this.createDimensionLabel(dimensionCount);

		this.viewer.formDialogService
			.showDialog<IDimensionFormData>({
				id: 'drawing-viewer-dimension-dialog',
				headerText: labels.title,
				formConfiguration: this.createDimensionFormConfig(dataItem, labels),
				entity: dataItem,
				runtime: runtimeInfo,
				customButtons: [],
				//topDescription: '',
			})
			?.then((result: IEditorDialogResult<IDimensionFormData>) => {
				if (result.closingButtonId === 'ok' && result.value) {
					this.updateDimensionsProperty(entities, result.value);
				} else {
					//this.handleCancel(result);
				}
			});
	}

	private addValue(current?: number, value?: number) {
		if (!current) {
			return value;
		}
		if (!value) {
			return current;
		}

		return current + value;
	}

	private updateDimensionsProperty(entities: IDimensionEntity[], formData: IDimensionFormData) {
		let nameModified = false,
			propModified = false;

		const entitiesToUpdate = entities.filter((entity) => {
			const m = this.checkNSetDimensionProperty(entity, formData);

			if (m.nameModified || m.propModified) {
				nameModified = nameModified || m.nameModified;
				propModified = propModified || m.propModified;
				this.updateDimensionByEntity(entity, m.nameModified, m.propModified);
				return true;
			}

			return false;
		});

		this.viewer.status.work('Updating dimension property');
		this.dimensionService
			.updateEntities(this.modelId, entitiesToUpdate, {
				propModified: propModified,
				nameModified: nameModified,
			})
			.then(() => {
				this.viewer.status.rest();
			});
	}

	private checkNSetDimensionProperty(entity: IDimensionEntity, formData: IDimensionFormData) {
		let nameModified = false,
			propModified = false;

		if (entity.Name !== formData.Name) {
			entity.Name = formData.Name;
			nameModified = true;
		}
		if (entity.Data.Width !== formData.Width) {
			entity.Data.Width = formData.Width;
			propModified = true;
		}
		if (entity.Data.Height !== formData.Height) {
			entity.Data.Height = formData.Height;
			propModified = true;
		}
		if (entity.Data.WallArea !== formData.WallArea) {
			entity.Data.WallArea = formData.WallArea;
			propModified = true;
		}
		if (entity.Data.Offset !== formData.Offset) {
			entity.Data.Offset = formData.Offset;
			propModified = true;
		}
		if (entity.Data.Multiplier !== formData.Multiplier) {
			entity.Data.Multiplier = formData.Multiplier;
			propModified = true;
		}

		return {
			nameModified: nameModified,
			propModified: propModified,
		};
	}
}

interface IDimensionLabel {
	name: string;
	count: string;
	length: string;
	area: string;
	volume: string;
	width: string;
	height: string;
	wallArea: string;
	offset: string;
	multiplier: string;
	segmentCount: string;
	vertexCount: string;
	cutoutArea: string;
	cutoutLength: string;
	areaExcludingCutouts: string;
	lengthExcludingCutouts: string;
	segmentCountExcludingCutouts: string;
	vertexCountExcludingCutouts: string;
}
