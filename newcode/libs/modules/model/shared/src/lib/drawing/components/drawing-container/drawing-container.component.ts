/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { MarkupType } from '@rib/ige-engine-core';
import { MarkupPointStyle, MarkupStyle } from '@rib/ige-engine-core/src/ige';

import { PlatformPinningContextService } from '@libs/platform/common';
import { IMenuItemEventInfo, ItemType } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';

import { BasicsShareModelPermissionSummaryService, PinningContextToken } from '@libs/basics/shared';

import { ModelSharedDrawingViewerComponent } from '../drawing-viewer/drawing-viewer.component';
import { CreateMarkupToolIdEnum, DrawingDisplayMode, MarkupIgeOptionValue } from '../../model/enums';
import {
	DrawingViewerOptionsToken,
	IDrawingViewerConfig,
	IDrawingViewerOptions
} from '../../model/interfaces/drawing-viewer-config.interface';
import { ModelSharedDimensionReadonlyService, ModelSharedDrawingViewerService, ModelSharedMarkupReadonlyService } from '../../services';
import { MarkupLineOptionEnum, MarkupPointStyleEnum, MarkupRegionShapeEnum, MarkupTypeEnum } from '../../model/interfaces/drawing-markup-edit-info.interface';
import { OpenModelRequest } from '../../model';

/**
 * Drawing container
 */
@Component({
	selector: 'model-shared-drawing-container',
	templateUrl: './drawing-container.component.html',
	styleUrls: ['./drawing-container.component.scss'],
})
export class ModelSharedDrawingContainerComponent extends ContainerBaseComponent implements OnInit, AfterViewInit {
	protected readonly options = inject<IDrawingViewerOptions>(DrawingViewerOptionsToken, {
		optional: true
	});
	protected readonly modelPermissionSummaryService = inject(BasicsShareModelPermissionSummaryService);
	protected readonly pinningContextService = inject(PlatformPinningContextService);
	protected readonly viewerService = inject(ModelSharedDrawingViewerService);

	protected config!: IDrawingViewerConfig;

	protected displayMode!: DrawingDisplayMode;
	private isShowMarkup: boolean = false;// TODO wait type: ItemType.Check ok

	@ViewChild('dv')
	public viewer!: ModelSharedDrawingViewerComponent;

	public constructor() {
		super();
	}

	public ngOnInit() {
		this.mergeConfig();
		this.addFeatures();
	}

	public ngAfterViewInit() {
		this.handleDisplayModeChanged();
	}

	private mergeConfig() {
		this.config = {
			displayMode: DrawingDisplayMode.D2,
			readonly: true,
			dimensionService: ModelSharedDimensionReadonlyService,
			markupService: ModelSharedMarkupReadonlyService,
			...this.options
		};
		this.displayMode = this.config.displayMode;
	}

	private addFeatures() {
		this.addCalibrationFeature();
		this.addZoomFeature();
		this.addMarkerFeature();
		this.addRotateFeature();
		this.addMarkupShowAllFeature();
		this.addSettingFeature();
		this.addMeasurementFeature();
		this.addSnapFeature();
		this.addDimensionFeature();
		this.addDragDropFeature();
		this.addFilterFeature();
		this.addRefreshFeature();
		this.addCompareFeature();
		this.addPrintFeature();
		this.addOperationFeature();
		this.addPermissionFeature();
		this.addPinModelFeature();
		this.add3DFeature();
		this.addPinningModelFeature();
	}

	private reloadFeatures() {
		this.uiAddOns.toolbar.clear();
		this.addFeatures();
	}

	private addCalibrationFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'calibrationGroup',
				caption: 'model.wdeviewer.scale',
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-2dqto-calibrate',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 'scaleSetting',
							sort: 100,
							caption: 'model.wdeviewer.scaleSetting',
							iconClass: 'tlb-icons ico-settings',
							type: ItemType.Item,
							fn: () => {
								this.viewer.calibration!.showScaleConfigDialog();
							}
						},
						{
							id: 'calibrateReset',
							sort: 101,
							caption: 'model.wdeviewer.calibration.reset',
							iconClass: 'tlb-icons ico-2dqto-calibratereset',
							type: ItemType.Item,
							fn: () => {
								this.resetCalibration();
							}
						},
						{
							id: 'calibrateX',
							sort: 102,
							caption: 'model.wdeviewer.calibration.x',
							iconClass: 'tlb-icons ico-2dqto-calibratex',
							type: ItemType.Item,
							fn: () => {
								this.viewer.calibration!.calibrateX();
							}
						},
						{
							id: 'calibratey',
							sort: 103,
							caption: 'model.wdeviewer.calibration.y',
							iconClass: 'tlb-icons ico-2dqto-calibratey',
							type: ItemType.Item,
							fn: () => {
								this.viewer.calibration!.calibrateY();
							}
						}
					]
				},
				disabled: () => {
					const status = this.viewer.status;
					return status.isWorking || this.displayMode !== DrawingDisplayMode.D2;
				}
			}
		]);
	}

	private addZoomFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'zoomGroup',
				caption: 'model.viewer.zoomIn',
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-zoom-in',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 'view-zoom-in',
							sort: 110,
							caption: 'model.viewer.zoomIn',
							iconClass: 'tlb-icons ico-zoom-in',
							type: ItemType.Item,
							fn: () => {
								this.viewer.igeViewer.engine.zoomIn();
							}
						},
						{
							id: 'view-zoom-out',
							sort: 111,
							caption: 'model.viewer.zoomOut',
							iconClass: ' tlb-icons ico-zoom-out',
							type: ItemType.Item,
							fn: () => {
								this.viewer.igeViewer.engine.zoomOut();
							}
						},
						{
							id: 'zoomLastMarkupp',
							caption: 'model.wdeviewer.zoomLastMarkup',
							iconClass: 'tlb-icons ico-zoom-markup',
							type: ItemType.Item,
							fn: () => {
								const viewConfig = this.viewer.viewerService.currentViewConfig();
								const lastMarkup = this.viewer.markup?.markupService.currentMarkups[this.viewer.markup?.markupService.currentMarkups.length - 1];
								const selectMarkup = this.viewer.markup?.markupService.currentMarkups.find((e) => e.IsSelect);
								const markupId = viewConfig?.zoomSelectMarkup ? selectMarkup?.MarkerId : lastMarkup?.MarkerId;
								if (markupId) {
									this.viewer.igeViewer.engine.zoomToMarkup(markupId);
								}
							}
						},
						{
							id: 'view-zoom-fit',
							sort: 112,
							caption: 'model.viewer.cameraFit',
							iconClass: ' tlb-icons ico-zoom-fit',
							type: ItemType.Item,
							fn: () => {
								this.viewer.igeViewer.engine.resetView();
							}
						},
						{
							id: 'view-zoom-width',
							sort: 113,
							caption: 'model.wdeviewer.zoomWidth',
							iconClass: 'tlb-icons ico-fit-to-width',
							type: ItemType.Item,
							fn: () => {
								this.viewer.igeViewer.engine.setOptionAsBool(MarkupIgeOptionValue.ZoomToWidth, true);
							}
						},
						{
							id: 'view-font-zoom-in',
							sort: 114,
							caption: 'model.wdeviewer.markup.fontSizeDecrease',
							iconClass: ' tlb-icons ico-mark-text',
							type: ItemType.Item,
							fn: () => {
								let num = this.viewer.igeViewer.engine.optionAsFloat(MarkupIgeOptionValue.FontScale);
								num = Number(num.toFixed(2)) * 0.8;
								this.viewer.igeViewer.engine.setOptionAsFloat(MarkupIgeOptionValue.FontScale, num);
							}
						},
						{
							id: 'view-font-zoom-out',
							sort: 115,
							caption: 'model.wdeviewer.markup.fontSizeIncrease',
							iconClass: ' tlb-icons ico-mark-text',
							type: ItemType.Item,
							fn: () => {
								let num = this.viewer.igeViewer.engine.optionAsFloat(MarkupIgeOptionValue.FontScale);
								num = Number(num.toFixed(2)) * 1.2;
								this.viewer.igeViewer.engine.setOptionAsFloat(MarkupIgeOptionValue.FontScale, num);
							}
						}
					]
				}
			}
		]);
	}

	private addMarkerFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'markerGroup',
				caption: 'model.wdeviewer.marker.createMarker',
				iconClass: 'dropdown-toggle dropdown-caret tlb-icons ico-marker-icon',
				type: ItemType.DropdownBtn,
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: CreateMarkupToolIdEnum.Point.toString(),
							sort: 121,
							caption: 'model.wdeviewer.markup.point',
							iconClass: 'tlb-icons ico-mark-point',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.Tick.toString(),
							sort: 122,
							caption: 'model.wdeviewer.markup.tick',
							iconClass: ' tlb-icons ico-mark-tick',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.Cross.toString(),
							sort: 123,
							caption: 'model.wdeviewer.markup.cross',
							iconClass: ' tlb-icons ico-mark-cross',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.Line.toString(),
							sort: 124,
							caption: 'model.wdeviewer.markup.line',
							iconClass: ' tlb-icons ico-mark-line',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.Arrow.toString(),
							sort: 125,
							caption: 'model.wdeviewer.markup.arrow',
							iconClass: ' tlb-icons ico-mark-arrow',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.Rectangle.toString(),
							sort: 126,
							caption: 'model.wdeviewer.markup.rectangle',
							iconClass: ' tlb-icons ico-mark-rectangle',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.Ellipse.toString(),
							sort: 127,
							caption: 'model.wdeviewer.markup.ellipse',
							iconClass: ' tlb-icons ico-mark-ellipse',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.Freehand.toString(),
							sort: 128,
							caption: 'model.wdeviewer.markup.freehand',
							iconClass: ' tlb-icons ico-mark-freehand-line',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.FreehandArrow.toString(),
							sort: 129,
							caption: 'model.wdeviewer.markup.freehandArrow',
							iconClass: ' tlb-icons ico-mark-freehand-line',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.Text.toString(),
							sort: 130,
							caption: 'model.wdeviewer.markup.text',
							iconClass: 'tlb-icons ico-mark-text',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.RectangleHighlighter.toString(),
							sort: 131,
							caption: 'model.wdeviewer.markup.rectangleHighlighter',
							iconClass: ' tlb-icons ico-mark-rectangle',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
						{
							id: CreateMarkupToolIdEnum.EllipseHighlighter.toString(),
							sort: 132,
							caption: 'model.wdeviewer.markup.ellipseHighlighter',
							iconClass: ' tlb-icons ico-mark-ellipse',
							type: ItemType.Item,
							fn: info => this.btnMarkupMode(info)
						},
					]
				},
				disabled: () => {
					return this.config.displayMode === DrawingDisplayMode.D3;
				}
			}
		]);
	}
	private decToHexColor(data: number) {
		return this.viewer.markup ? this.viewer.markup?.decToHexColor(data) : data.toString(16).padStart(7, '#000000');
	}

	private btnMarkupMode(markerItemInfo: IMenuItemEventInfo) {
		const markerItemId = markerItemInfo.item.id;
		const nonePointStyle = {value: MarkupPointStyleEnum.Default} as MarkupPointStyle;
		const viewConfig = this.viewer.viewerService.currentViewConfig();
		const defaultMarkupType: MarkupStyle = {
			colour: this.decToHexColor(viewConfig.defaultMarkupColor),
			fillColour: '#00000000', //default color: transparent
			flags: this.viewer.igeViewer.engine.optionAsInteger(MarkupIgeOptionValue.ScreenSpaceDefault),
			shape: MarkupRegionShapeEnum.Rectangle,
			startPointStyle: nonePointStyle,
			endPointStyle: nonePointStyle,
			lineOptions: MarkupLineOptionEnum.None,
			linePatternId: MarkupPointStyleEnum.Default,
			lineThickness: this.viewer.igeViewer.engine.optionAsInteger(MarkupIgeOptionValue.LineWidthDefault)
		};
		let markupType: MarkupType = {value: MarkupTypeEnum.Point} as MarkupType;
		const regNumber = /^\d+$/;
		const id = markerItemId && regNumber.test(markerItemId) ? Number(markerItemId) : 0;
		switch (id) {
			case CreateMarkupToolIdEnum.Point:
				defaultMarkupType.lineOptions = MarkupLineOptionEnum.None;
				break;
			case CreateMarkupToolIdEnum.Tick:
				defaultMarkupType.lineOptions = MarkupLineOptionEnum.None;
				defaultMarkupType.startPointStyle.value = MarkupPointStyleEnum.Tick;
				defaultMarkupType.endPointStyle.value = MarkupPointStyleEnum.Tick;
				break;
			case CreateMarkupToolIdEnum.Cross:
				defaultMarkupType.lineOptions = MarkupLineOptionEnum.None;
				defaultMarkupType.startPointStyle.value = MarkupPointStyleEnum.Cross;
				defaultMarkupType.endPointStyle.value = MarkupPointStyleEnum.Cross;
				break;
			case CreateMarkupToolIdEnum.Line:
				markupType = {value: MarkupTypeEnum.Line} as MarkupType;
				break;
			case CreateMarkupToolIdEnum.Arrow:
				markupType = {value: MarkupTypeEnum.Line} as MarkupType;
				defaultMarkupType.endPointStyle.value = MarkupPointStyleEnum.Arrow;
				defaultMarkupType.lineOptions = MarkupLineOptionEnum.None;
				break;
			case CreateMarkupToolIdEnum.Rectangle:
				markupType = {value: MarkupTypeEnum.Region} as MarkupType;
				break;
			case CreateMarkupToolIdEnum.Ellipse:
				markupType = {value: MarkupTypeEnum.Region} as MarkupType;
				defaultMarkupType.shape = MarkupRegionShapeEnum.Ellipse;
				break;
			case CreateMarkupToolIdEnum.Freehand:
				markupType = {value: MarkupTypeEnum.Freehand} as MarkupType;
				defaultMarkupType.endPointStyle = nonePointStyle;
				break;
			case CreateMarkupToolIdEnum.FreehandArrow:
				markupType = {value: MarkupTypeEnum.Freehand} as MarkupType;
				defaultMarkupType.endPointStyle = {value: MarkupPointStyleEnum.Arrow} as MarkupPointStyle;
				break;
			case CreateMarkupToolIdEnum.Text:
				defaultMarkupType.endPointStyle.value = MarkupPointStyleEnum.NotVisible;
				break;
			case CreateMarkupToolIdEnum.RectangleHighlighter:
				markupType = {value: MarkupTypeEnum.Region} as MarkupType;
				defaultMarkupType.colour = defaultMarkupType.colour + '80';// 80: Color transparency
				defaultMarkupType.fillColour = defaultMarkupType.colour;
				break;
			case CreateMarkupToolIdEnum.EllipseHighlighter:
				markupType = {value: MarkupTypeEnum.Region} as MarkupType;
				defaultMarkupType.shape = MarkupRegionShapeEnum.Ellipse;
				defaultMarkupType.colour = defaultMarkupType.colour + '80';// 80: Color transparency
				defaultMarkupType.fillColour = defaultMarkupType.colour;
				break;
		}
		this.viewer.markup?.markupService.sendPrepareCreateMarkupInTool(defaultMarkupType);
		this.viewer.igeViewer.engine.createMarkup(markupType, defaultMarkupType);
		if (viewConfig.noMarkupDialog) {
			this.viewer.viewerService.activeMarkupTool = {
				btnId: id,
				markupType: markupType,
				markupStyle: defaultMarkupType
			};
		}
	}

	private addRotateFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'rotateGroup',
				caption: 'model.wdeviewer.rotate.title',
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-txt-rotate-left',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{

							id: 'rotate-left',
							sort: 120,
							caption: 'model.wdeviewer.rotate.left',
							iconClass: 'tlb-icons ico-txt-rotate-left',
							type: ItemType.Item,
							fn: () => {
								// Rotate -90 degree
								this.viewer.igeViewer.engine.rotateDrawing(-90);
							}
						},
						{

							id: 'rotate-right',
							sort: 121,
							caption: 'model.wdeviewer.rotate.right',
							iconClass: ' tlb-icons ico-txt-rotate-right',
							type: ItemType.Item,
							fn: () => {
								// Rotate 90 degree
								this.viewer.igeViewer.engine.rotateDrawing(90);
							}
						}
					]
				}
			}
		]);
	}

	private addMarkupShowAllFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'annotation-simple',
				caption: 'model.wdeviewer.marker.showMarker',
				iconClass: 'control-icons ico-annotation-simple',
				type: ItemType.Check,
				value: this.isShowMarkup,
				fn: () => {
					this.isShowMarkup = !this.isShowMarkup;
					if (this.isShowMarkup) {
						this.viewer.markup?.loadCurrentMarkup();
					} else {
						this.viewer.markup?.hideCurrentMarkup();
					}
				},
				disabled: () => {
					return this.viewer.markup?.markupService.currentMarkups.length === 0 || this.config.displayMode === DrawingDisplayMode.D3;
				}
			}
		]);
	}
	private addSettingFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'view-setting',
				sort: 114,
				caption: 'model.wdeviewer.configTitle',
				iconClass: 'tlb-icons ico-container-config',
				type: ItemType.Item,
				fn: () => {
					this.viewer.showViewConfigDialog();
				}
			}
		]);
	}

	private addMeasurementFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'measurementGroup',
				caption: 'model.wdeviewer.measurement.length',
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-view-m-point',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 'mmlengths',
							sort: 120,
							caption: 'model.wdeviewer.measurement.length',
							iconClass: 'tlb-icons ico-view-m-point',
							type: ItemType.Check,
							fn: info => {
								if (info.isChecked) {
									this.viewer.startMeasurement();
								} else {
									this.viewer.finishMeasurement();
								}
							}
						}
					]
				},
				disabled: () => {
					const status = this.viewer.status;
					return status.isWorking || this.displayMode !== DrawingDisplayMode.D2;
				}
			}
		]);
	}

	private addSnapFeature() {
		if (this.config.canEditDimension) {
			this.uiAddOns.toolbar.addItems([
				{
					id: 'snap-line',
					sort: 121,
					caption: 'model.wdeviewer.snap',
					iconClass: 'tlb-icons ico-2dqto-snap',
					type: ItemType.Check,
					value: true,
					fn: info => {
						const linker = this.viewer.igeViewer.linker;

						if (info.isChecked) {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.GeometrySnapMode.Line);
						} else {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.GeometrySnapMode.None);
						}
					}
				},
				{
					id: 'snap-point',
					sort: 122,
					caption: 'model.wdeviewer.selectPoint',
					iconClass: 'tlb-icons ico-2dqto-point',
					type: ItemType.Check,
					value: false,
					fn: info => {
						const linker = this.viewer.igeViewer.linker;

						if (info.isChecked) {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.GeometrySnapMode.Point);
						} else {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.GeometrySnapMode.None);
						}
					}
				}
			]);
		}
	}

	private addDimensionFeature() {
		if(this.config.canShowDimension) {
			this.uiAddOns.toolbar.addItems([
				{
					id: 'both',
					sort: 123,
					caption: 'model.wdeviewer.dimension.both',
					iconClass: 'tlb-icons ico-2dqto-mode-both',
					type: ItemType.Check,
					value: false,
					fn: info => {
						const linker = this.viewer.igeViewer.linker;

						if (info.isChecked) {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.DimensionResultMode.Both);
						} else {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.DimensionResultMode.Positive);
						}
					}
				},
				{
					id: 'negative',
					sort: 124,
					caption: 'model.wdeviewer.dimension.negative',
					iconClass: 'tlb-icons ico-2dqto-negative',
					type: ItemType.Check,
					value: false,
					fn: info => {
						const linker = this.viewer.igeViewer.linker;

						if (info.isChecked) {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.DimensionResultMode.Negative);
						} else {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.DimensionResultMode.Both);
						}
					}
				},
				{
					id: 'positive',
					sort: 125,
					caption: 'model.wdeviewer.dimension.positive',
					iconClass: 'tlb-icons ico-2dqto-positive',
					type: ItemType.Check,
					value: false,
					fn: info => {
						const linker = this.viewer.igeViewer.linker;

						if (info.isChecked) {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.DimensionResultMode.Positive);
						} else {
							this.viewer.igeViewer.engine.setGeometrySnapMode(linker.DimensionResultMode.Both);
						}
					}
				}
			]);
		}

		if(this.config.canEditDimension) {
			this.uiAddOns.toolbar.addItems([
				{
					id: 'edit',
					sort: 120,
					caption: 'model.wdeviewer.dimension.edit',
					iconClass: 'tlb-icons ico-2dqto-edit',
					type: ItemType.Check,
					value: false,
					fn: info => {
						// Todo - edit dimension
					}
				},
				{
					id: 'delete',
					sort: 125,
					caption: 'model.wdeviewer.dimension.delete',
					iconClass: 'tlb-icons ico-rec-delete',
					type: ItemType.Item,
					fn: () => {
						// Todo - deleteSelectedDimension
					}
				}
			]);
		}
	}

	private addDragDropFeature() {
		// Todo - drag drop dimension
	}

	private addFilterFeature() {
		// Todo - dimension filter
	}

	private addRefreshFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'view-refresh',
				sort: 113,
				caption: 'model.viewer.refresh',
				iconClass: ' tlb-icons ico-refresh',
				type: ItemType.Item,
				fn: () => {
					this.viewer.refreshView();
				}
			}
		]);
	}

	private addCompareFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'view-compare',
				sort: 114,
				caption: 'model.wdeviewer.compare.title',
				iconClass: ' tlb-icons ico-compare',
				type: ItemType.Item,
				fn: () => {
					this.viewer.showComparisonDialog();
				}
			}
		]);
	}

	private addPrintFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'print',
				sort: 115,
				caption: 'cloud.common.print',
				iconClass: 'tlb-icons ico-print',
				type: ItemType.Item,
				fn: () => {
					this.viewer.openPrintDialog();
				}
			}
		]);
	}

	private addOperationFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'layer',
				sort: 110,
				caption: 'model.wdeviewer.layerMode',
				iconClass: 'tlb-icons ico-mode-level',
				type: ItemType.Check,
				value: false,
				fn: info => {
					const linker = this.viewer.igeViewer.linker;

					if (info.isChecked) {
						this.viewer.igeViewer.engine.setGeometrySnapMode(linker.OperationMode.Layer);
					} else {
						this.viewer.igeViewer.engine.setGeometrySnapMode(linker.OperationMode.Dimension);
					}
				}
			}
		]);
	}

	private addPermissionFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'view-permission',
				sort: 116,
				caption: 'model.viewer.permissionSummary',
				iconClass: 'tlb-icons ico-permission-summary',
				type: ItemType.Item,
				fn: async () => {
					await this.modelPermissionSummaryService.showDialog('model.wdeViewer.2d');
				}
			}
		]);
	}

	private addPinModelFeature() {
		this.uiAddOns.toolbar.addItems([
			{
				id: 'view-restore',
				sort: 116,
				caption: 'model.wdeviewer.viewRestore',
				iconClass: 'tlb-icons ico-set-prj-context',
				type: ItemType.Item,
				fn: () => {
					// Todo - restore pin model
				}
			}
		]);
	}

	private add3DFeature() {
		// Todo - 3D feature
	}

	private addPinningModelFeature() {
		if(this.options?.ignorePinningModel) {
			return;
		}

		this.loadPinningModel();
	}

	private handleDisplayModeChanged() {
		const subscription = this.viewer.status.displayModeChanged$.subscribe(e => {
			this.displayMode = e;
			this.reloadFeatures();
		});

		this.registerSubscription(subscription);
	}

	public firstPage() {
		this.viewer.igeViewer.goFirstLayout();
	}

	public prevPage() {
		this.viewer.igeViewer.goPrevLayout();
	}

	public nextPage() {
		this.viewer.igeViewer.goNextLayout();
	}

	public lastPage() {
		this.viewer.igeViewer.goLastLayout();
	}

	public drawCount() {
		this.viewer.igeViewer.mode.setDimension(this.viewer.igeViewer.linker.DimensionMode.Count);
	}

	public drawLength() {
		this.viewer.igeViewer.mode.setDimension(this.viewer.igeViewer.linker.DimensionMode.Length);
	}

	public drawArea() {
		this.viewer.igeViewer.mode.setDimension(this.viewer.igeViewer.linker.DimensionMode.Area);
	}

	public resetCalibration() {
		this.viewer.calibration!.resetCalibration$().subscribe(() => {

		});
	}

	private loadPinningModel() {
		const modelId = this.pinningContextService.getPinningContextForModule(PinningContextToken.Model)?.Id;

		if (!modelId) {
			return;
		}

		const request = new OpenModelRequest(modelId);

		this.viewerService.openModel(request);
	}
}
