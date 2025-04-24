/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IEditorDialogResult, IFormConfig, LookupSimpleEntity, StandardDialogButtonId, UiCommonFormDialogService, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { IDrawingCompareConfig, DrawingComparisonType } from '../model/interfaces/drawing-compare-config.interface';
import { ModelSharedDrawingLayoutLookupService } from '../lookup/drawing-layout-lookup.service';


@Injectable({
	providedIn: 'root'
})
export class ModelShareDrawingCompareDialogService {
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	public showDialog(drawingId: string, layoutId: string, calibrationFactor: number) {
		// TODO defaultSettingsProvider wait cos instanceheader/oldmodelinfo?instanceHeaderId=
		const entity: IDrawingCompareConfig = {
			baseDrawingId: drawingId,
			baseLayoutId: layoutId,
			calibrationFactor: calibrationFactor,
			mode: DrawingComparisonType.Overlay,
			useTolerance: false
		};
		return this.openDialog(entity);
	}

	private async openDialog(entity: IDrawingCompareConfig) {
		const result = await this.formDialogService.showDialog<IDrawingCompareConfig>({
			id: 'drawing-compare-dialog',
			headerText: this.translateService.instant('model.wdeviewer.editMarker').text,
			formConfiguration: this.createEditCompareFormConfig(entity),
			entity: entity,
			customButtons: [],
		}) as IEditorDialogResult<IDrawingCompareConfig>;
		if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			result.value.baseLayoutInfo = this.createLayouInfo(result.value, true);
			result.value.refLayoutInfo = this.createLayouInfo(result.value, false);
		}
		return result;
	}

	private createLayouInfo(param: IDrawingCompareConfig, isBase: boolean) {
		const baseLoaderConfig = {
			calibrationAngle: 0.0,
			calibrationXFactor: param.calibrationFactor,
			calibrationYFactor: param.calibrationFactor,
			scaleXFactor: param.calibrationFactor,
			scaleYFactor: param.calibrationFactor,
			scaleZFactor: param.calibrationFactor
		};
		const baseLayoutInfo = {
			filename: isBase ? param.baseDrawingId : param.refDrawingId,
			layoutId: isBase ? param.baseLayoutId : param.refLayoutId,
			loaderConfig: baseLoaderConfig
		};

		return JSON.stringify(baseLayoutInfo);
	}

	private createEditCompareFormConfig(param: IDrawingCompareConfig): IFormConfig<IDrawingCompareConfig> {
		return {
			formId: 'model.wdeviewer.comparison',
			showGrouping: false,
			groups: [
				{
					groupId: 'comparison',
					header: {
						key: 'model.wdeviewer.comparison.title',
						text: 'Drawing Compare'
					}
				},
			],
			rows: [
				{
					groupId: 'comparison',
					id: 'mode',
					label: {
						key: 'model.wdeviewer.comparison.mode',
						text: 'Comparison Type',
					},
					model: 'mode',
					type: FieldType.Lookup,
					visible: true,
					sortOrder: 1,
					required: false,
					readonly: false,
					lookupOptions: createLookup<IDrawingCompareConfig, LookupSimpleEntity>({
						dataService: this.lookupServiceFactory.fromSimpleItemClass([
							{id: DrawingComparisonType.Overlay, desc: {text: 'Overlay', key: 'model.wdeviewer.comparison.overlay'}},
							{id: DrawingComparisonType.Geometry, desc: {text: 'Geometry', key: 'model.wdeviewer.comparison.geometry'}},
							{id: DrawingComparisonType.Object, desc: {text: 'Object', key: 'model.wdeviewer.comparison.object'}}
						], {
							valueMember: 'id',
							displayMember: 'desc',
							translateDisplayMember: true
						})
					})
				},
				{
					groupId: 'comparison',
					id: 'useTolerance',
					label: {
						key: 'model.wdeviewer.comparison.useTolerance',
						text: 'Use Tolerance',
					},
					type: FieldType.Boolean,
					model: 'useTolerance',
					sortOrder: 2,
					required: false,
					readonly: false,
				},
				{
					groupId: 'comparison',
					id: 'refModelId',
					label: {
						key: 'model.wdeviewer.comparison.refModelId',
						text: 'Reference Model',
					},
					type: FieldType.Integer,//TODO DEV-6085: model lookup
					model: 'refModelId',
					sortOrder: 3,
					required: false,
					readonly: false,
					change: (e) => {
						e.entity.refDrawingId = '';
						e.entity.refLayoutId = '';
					}
				},
				{
					groupId: 'comparison',
					id: 'refLayoutId',
					label: {
						key: 'model.wdeviewer.comparison.refLayoutId',
						text: 'Reference Layout',
					},
					type: FieldType.Lookup,
					model: 'refLayoutId',
					visible: true,
					sortOrder: 4,
					required: false,
					readonly: false,
					lookupOptions: createLookup<IDrawingCompareConfig, LookupSimpleEntity>({
						dataServiceToken: ModelSharedDrawingLayoutLookupService// TODO check this layout, wait model lookup
					})
				},
				{
					groupId: 'comparison',
					id: 'calibrationFactor',
					label: {
						key: 'model.wdeviewer.comparison.calibration',
						text: 'Calibration',
					},
					type: FieldType.Quantity,
					model: 'calibrationFactor',
					sortOrder: 5,
					required: false,
					readonly: false,
				},
			]
		};
	}
}
