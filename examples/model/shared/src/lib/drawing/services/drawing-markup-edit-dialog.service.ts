/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { isNumber } from 'lodash';
import { ColorFormat, PlatformTranslateService } from '@libs/platform/common';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { createLookup, FieldType, IEditorDialogResult, IFormConfig, LookupSimpleEntity, UiCommonFormDialogService, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import {
	IDrawingMarkupEditInfo, IMarkupEditChange, IMarkupEditConfig, IMarkupRequest,
	MarkupLineOptionEnum , MarkupPointStyleEnum, MarkupRegionShapeEnum, MarkupTypeEnum
} from '../model/interfaces/drawing-markup-edit-info.interface';
import { DrawingMarkupEntity } from '../model/drawing-markup-entity';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ModelShareDrawingMarkupEditDialogService {
	public formDialogService = inject(UiCommonFormDialogService);
	public translateService = inject(PlatformTranslateService);
	private readonly pointStyleArray = [MarkupPointStyleEnum.Tick, MarkupPointStyleEnum.Cross];
	private readonly shapeArray = [MarkupRegionShapeEnum.Ellipse, MarkupRegionShapeEnum.Rectangle];
	private markupEditSubject = new Subject<IDrawingMarkupEditInfo>();
	private editDialogSubject = new Subject<[IDrawingMarkupEditInfo, IFormConfig<IDrawingMarkupEditInfo>]>();
	public readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	public constructor() {
	}

	public sendMarkupEdit(param: IDrawingMarkupEditInfo) {
		this.markupEditSubject.next(param);
	}

	public markupEditAsObservable() {
		return this.markupEditSubject.asObservable();
	}

	public editDialogAsObservable() {
		return this.editDialogSubject.asObservable();
	}

	public async showEditDialog(param: IMarkupRequest, currentMarkups: DrawingMarkupEntity[]) {
		const runtimeInfo: EntityRuntimeData<IDrawingMarkupEditInfo> = {
			readOnlyFields: [],
			validationResults: [],
			entityIsReadOnly: false
		};
		const entity = this.initDialogData(param, currentMarkups);
		const formConfig = this.createEditFormConfig(entity.ReadOnlyConfig);
		this.editDialogSubject.next([entity, formConfig]);

		const result = await this.formDialogService.showDialog<IDrawingMarkupEditInfo>({
			id: 'markup-edit-dialog',
			headerText: this.translateService.instant('model.wdeviewer.editMarker').text,
			formConfiguration: formConfig,
			entity: entity,
			runtime: runtimeInfo,
			customButtons: [],
		}) as IEditorDialogResult<IDrawingMarkupEditInfo>;
		if (result && result.closingButtonId === 'ok') {
			this.sendMarkupEdit(result.value as IDrawingMarkupEditInfo);
		} else {
			this.sendMarkupEdit({Id: '', ReadOnlyConfig: {isNewMarkup: param.bNewMarkup}} as IDrawingMarkupEditInfo);
		}
	}

	private decToHexColor(data: number) {
		return data.toString(16).padStart(7, '#000000');
	}

	private initDialogData(param: IMarkupRequest, currentMarkups: DrawingMarkupEntity[]) {
		const editEntity = {
			Id: param.markupId,
			Comment: param.text,
			FontHeight: param.height,
			LineWidth: 1 // default line
		} as IDrawingMarkupEditInfo;
		if (!editEntity.ReadOnlyConfig) {
			editEntity.ReadOnlyConfig = {} as IMarkupEditConfig;
			editEntity.Change = {} as IMarkupEditChange;
		}
		if (param.markupStyle) {
			editEntity.LineWidth = param.markupStyle.lineThickness;
			editEntity.RegionShape = param.markupStyle.shape;
		}
		const markupEntity = currentMarkups.find(e => e.MarkerId === param.markupId);
		if (markupEntity) {
			editEntity.AnnotationDescription = markupEntity.Annotation.DescriptionInfo.Translated;
		}
		editEntity.Color = this.hexColorToInt(param.Color);
		editEntity.ReadOnlyConfig.isNewMarkup = param.bNewMarkup;
		// TODO TawType && AnnotationDescription (need modelWdeViewerAnnotationService)

		editEntity.LinePattern = param.markupStyle ? param.markupStyle.linePatternId : 0;
		if (editEntity.LinePattern === 0 && param.markupStyle && param.markupStyle.endPointStyle.value > 0) {
			editEntity.LinePattern = param.markupStyle.endPointStyle.value;
		}
		if (param.markupStyle?.fillColour && param.markupStyle?.fillColour !== '#00000000') {
			editEntity.FillColor = this.hexColorToInt(param.markupStyle?.fillColour);
		}
		editEntity.ReadOnlyConfig.isHighlighter = (!!param.markupStyle?.colour && param.markupStyle.colour.endsWith('80'));
		if (editEntity.ReadOnlyConfig.isHighlighter) {
			editEntity.Color = this.hexColorToInt(param.Color + '80');// 80: Color transparency
			editEntity.FillColor = editEntity.Color;
		}

		editEntity.ReadOnlyConfig.isReadOnlyColor = false;
		//TODO set isReadOnlyColor=true when isCreateMultipleMarker && param.bNewMarkup
		//TODO get isTakeOffMode
		//TODO get isRawTypeModule
		//TODO get isSameAnnotation
		editEntity.ReadOnlyConfig.isUseAnnoRawType = editEntity.ReadOnlyConfig.isTakeOffMode &&
			!editEntity.ReadOnlyConfig.isDefaultAnnoRawType && !editEntity.ReadOnlyConfig.isReadOnlyColor &&
			editEntity.ReadOnlyConfig.isRawTypeModule && !editEntity.ReadOnlyConfig.isSameAnnotation;
		editEntity.ReadOnlyConfig.isNoPoint = this.pointStyleArray.indexOf(param.markupStyle?.endPointStyle?.value) > -1 ||
			(param.markupStyle?.endPointStyle?.value === MarkupPointStyleEnum.Default && param.markupStyle?.lineOptions === MarkupLineOptionEnum.None && param.markupType?.value === 0);
		const shape = param.markupStyle ? param.markupStyle.shape : 0;
		editEntity.ReadOnlyConfig.isFillColor = this.shapeArray.indexOf(shape) > -1 && param.markupType?.value === MarkupTypeEnum.Region;
		editEntity.ReadOnlyConfig.isFillColor = false; // TODO The current version does not have fill color,so false
		return editEntity;
	}

	private createEditFormConfig(param: IMarkupEditConfig): IFormConfig<IDrawingMarkupEditInfo> {
		return {
			formId: 'markup-edit-form',
			showGrouping: false,
			groups: [
				{
					groupId: 'markupEdit',
					header: {
						key: 'model.wdeviewer.colorTitle',
						text: 'Edit'
					},
				},
			],
			rows: [
				{
					groupId: 'markup-edit',
					id: 'color',
					label: {
						key: 'model.wdeviewer.markerColor',
						text: 'Color',
					},
					type: FieldType.Color,
					model: 'Color',
					sortOrder: 1,
					required: false,
					readonly: param.isReadOnlyColor,
					change: e => {
						e.entity.Change.isColor = true;
					},
					format: ColorFormat.RgbaValue
				},
				{
					groupId: 'markup-edit',
					id: 'annoRawType',
					label: {
						key: 'model.wdeviewer.annoRawType',
						text: 'Raw Type',
					},
					type: FieldType.Boolean,
					model: 'AnnotationRawType',
					visible: param.isTakeOffMode && !param.isReadOnlyColor && !param.isDefaultAnnoRawType && param.isRawTypeModule,
					sortOrder: 2,
					required: false,
					readonly: param.isSameAnnotation || !param.isNewMarkup,
					change: e => {
						e.entity.Change.isAnnotationRawType = true;
						window.console.log(e);
						//TODO readonly AnnotationDescription and set Description
						/*$injector.get('platformRuntimeDataService').readonly(entity, [{field: 'AnnotationDescription', readonly: value === true}]);
						if (value === true) {
							entity.AnnotationDescription = modelWdeViewerAnnotationService.currentTempDescription;
						}*/
					}
				},
				{
					groupId: 'markup-edit',
					id: 'annotationDescription',
					label: {
						key: 'model.wdeviewer.annoDescription',
						text: 'AnnoDescription',
					},
					type: FieldType.Comment,
					model: 'AnnotationDescription',
					visible: param.isTakeOffMode,
					sortOrder: 3,
					required: false,
					readonly: param.isReadOnlyColor,
					change: e => {
						e.entity.Change.isAnnotationDescription = true;
					}
				},
				{
					groupId: 'markup-edit',
					id: 'comment',
					label: {
						key: 'model.wdeviewer.markerComment',
						text: 'Comment',
					},
					type: FieldType.Comment,
					model: 'Comment',
					visible: true,
					sortOrder: 4,
					required: false,
					readonly: false,
					change: e => {
						e.entity.Change.isComment = true;
						// set fontHeight after it have comment text
						if (e.newValue && (e.newValue as string).length > 0 && e.entity.FontHeight === 0) {
							e.entity.FontHeight = 20;
						}
					}
				},
				{
					groupId: 'markup-edit',
					id: 'fontHeight',
					label: {
						key: 'model.wdeviewer.textFontHeight',
						text: 'Font Height',
					},
					type: FieldType.Lookup,
					model: 'FontHeight',
					visible: true,
					sortOrder: 5,
					required: false,
					readonly: false,
					lookupOptions: createLookup<IDrawingMarkupEditInfo, LookupSimpleEntity>({
						dataService: this.lookupServiceFactory.fromSimpleItemClass([
							{id: 16, desc: '16'},
							{id: 20, desc: '20'},
							{id: 24, desc: '24'},
							{id: 32, desc: '32'}
						])
					}),
					change: e => {
						e.entity.Change.isFontHeight = true;
					}
				},
				{
					groupId: 'markup-edit',
					id: 'lineWidth',
					label: {
						key: 'model.wdeviewer.lineWidth',
						text: 'Line Width',
					},
					model: 'LineWidth',
					type: FieldType.Lookup,
					visible: !param.isNoPoint && !param.isHighlighter,
					sortOrder: 6,
					required: false,
					readonly: false,
					lookupOptions: createLookup<IDrawingMarkupEditInfo, LookupSimpleEntity>({
						dataService: this.lookupServiceFactory.fromSimpleItemClass([
							{id: 1, desc: '1'},
							{id: 2, desc: '2'},
							{id: 3, desc: '3'},
							{id: 4, desc: '4'},
							{id: 5, desc: '5'}
						])
					}),
					change: e => {
						e.entity.Change.isLineWidth = true;
					}
				},
				{
					groupId: 'markup-edit',
					id: 'linePattern',
					label: {
						key: 'model.wdeviewer.linePattern',
						text: 'Line Pattern',
					},
					type: FieldType.Select,
					model: 'LinePattern',
					itemsSource: {
						items: [
							{
								id: MarkupPointStyleEnum.Default,
								displayName: {key: 'model.wdeviewer.markup.none', text: 'None'}
							},
							{
								id: MarkupPointStyleEnum.Tick,
								displayName: {key: 'model.wdeviewer.markup.tick', text: 'Tick'}
							},
							{
								id: MarkupPointStyleEnum.Cross,
								displayName: {key: 'model.wdeviewer.markup.cross', text: 'Cross'}
							}
						],
					},
					visible: param.isNoPoint && !param.isHighlighter,
					sortOrder: 7,
					required: false,
					readonly: false,
					change: e => {
						e.entity.Change.isLinePattern = true;
					}
				},
				{
					groupId: 'markup-edit',
					id: 'fillColor',
					label: {
						key: 'model.wdeviewer.markerFillColor',
						text: 'Fill Color',
					},
					type: FieldType.Color,
					model: 'FillColor',
					visible: param.isFillColor && !param.isHighlighter,
					sortOrder: 8,
					required: false,
					readonly: false,
					showClearButton: true,
					change: e => {
						e.entity.Change.isFillColor = true;
					},
					format: ColorFormat.RgbaValue
				},
				{
					groupId: 'markup-edit',
					id: 'regionShape',
					label: {
						key: 'model.wdeviewer.markerRegionShape',
						text: 'Region Shape',
					},
					type: FieldType.Select,
					itemsSource: {
						items: [
							{
								id: MarkupRegionShapeEnum.Rectangle,
								displayName: {key: 'model.wdeviewer.markup.rectangle', text: 'Rectangle'}
							},
							{
								id: MarkupRegionShapeEnum.Ellipse,
								displayName: {key: 'model.wdeviewer.markup.ellipse', text: 'Ellipse'}
							}
						],
					},
					model: 'RegionShape',
					visible: param.isFillColor && !param.isHighlighter,
					sortOrder: 9,
					required: false,
					readonly: false,
					change: e => {
						e.entity.Change.isRegionShape = true;
					}
				}
			]
		};
	}

	private hexColorToInt(colour: number | string) {
		let color = 0;
		if (isNumber(colour)) {
			color = colour;
		} else if (colour.length > 7) {
			const colStr = colour.substr(1, 6);
			color = parseInt(colStr, 16);
		} else {
			color = parseInt(colour.slice(1), 16);
		}
		return color;
	}

	/*
		private isTextDialogOpen: boolean = false;
		public showTextDialog(markerId:string,text:string,currentMarkups: DrawingMarkupEntity[]){
			if(this.isTextDialogOpen){
				this.isTextDialogOpen = false;
				return;
			}
			const divHtml = document.createElement('div');
			divHtml.style.position = 'absolute';
			divHtml.style.left = `px`;
			divHtml.style.top = `px`;
			document.body.appendChild(divHtml);
			const elementRef = new ElementRef(divHtml);
			const textDialogInstance = this.popupService.open(elementRef,'',{width:140});
			if(textDialogInstance){
				textDialogInstance.opened.subscribe((e)=>{
					setTimeout(function () {
						angular.element('#markupTextInput').focus();
					}, 100);
				});
				textDialogInstance.closed.subscribe((e)=>{
					const lastMarkup = last(currentMarkups);
					if(lastMarkup&& lastMarkup.Description!==null&&lastMarkup.Description.length<1){
						// delete this markup
						// Continuous markup
					}
					this.isTextDialogOpen = false;
				});
			}
		}*/
}


