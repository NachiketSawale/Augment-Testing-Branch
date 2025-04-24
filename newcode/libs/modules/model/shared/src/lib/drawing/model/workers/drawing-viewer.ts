/*
 * Copyright(c) RIB Software GmbH
 */

import { debounceTime, firstValueFrom, from, Subject, takeUntil } from 'rxjs';
import { ElementRef, inject, Injector } from '@angular/core';

import { ColorFormat, ContextService, PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import {
	ActivePopup,
	createLookup,
	FieldType,
	IEditorDialogResult,
	IFormConfig,
	IPopupMenuItem,
	LookupSimpleEntity,
	PopupService,
	StandardDialogButtonId,
	UiCommonDialogService,
	UiCommonFormDialogService,
	UiCommonLookupDataFactoryService,
	UiCommonMessageBoxService,
} from '@libs/ui/common';

import { EntityRuntimeData } from '@libs/platform/data-access';
import { igeService, IgeViewer, IIgeMenuItem, ILayout } from '@rib-4.0/ige-viewer';

import { DrawingViewConfig } from '../drawing-view-config';

import { OpenModelRequest } from '../open-model-request';
import { DrawingCalibrationWorker } from '../workers/drawing-calibration-worker';
import { DrawingDimensionWorker } from '../workers/drawing-dimension-worker';
import { ModelSharedDrawingViewerService } from '../../services/drawing-viewer.service';
import { ModelSharedCalibrationService } from '../../services/drawing-calibration.service';
import { ModelSharedUomLookupService } from '../../lookup/uom-lookup.service';
import { DrawingViewerStatus } from '../drawing-viewer-status';
import { OpenDrawingRequest, IDrawingLayoutInfo, IDrawingPrintInfo } from '../open-drawing-request';
import { DrawingMarkupWorker } from '../workers/drawing-markup-worker';
import { DrawingDisplayMode, MarkupIgeOptionValue, PrintPageOrientation, PrintPageSize } from '../enums';
import { IDrawingViewerConfig } from '../interfaces/drawing-viewer-config.interface';
import { DrawingPrintDialogComponent } from '../../components/drawing-print-dialog/drawing-print-dialog.component';
import { DRAWING_PRINT_DIALOG_TOKEN, IDimensionLegend } from '../interfaces/drawing-print-dialog-info.interface';
import { groupBy, map, forEach, sumBy, find } from 'lodash';
import { ModelShareDrawingCompareDialogService } from '../../services/drawing-compare.service';
import { BasicsSharedCompanyContextService } from '@libs/basics/shared';

/**
 * Abstract drawing viewer which provides common drawing logic
 */
export abstract class DrawingViewer {
	private viewId = '';
	private modelRequest?: OpenModelRequest;
	private drawingRequest?: OpenDrawingRequest;

	public readonly injector = inject(Injector);
	private readonly http = inject(PlatformHttpService);
	public readonly viewerService = inject(ModelSharedDrawingViewerService);
	public readonly calibrationService = inject(ModelSharedCalibrationService);
	public readonly configService = inject(PlatformConfigurationService);
	public readonly popupService = inject(PopupService);
	private readonly contextService = inject(ContextService);
	public readonly modalDialogService = inject(UiCommonDialogService);
	public readonly formDialogService = inject(UiCommonFormDialogService);
	public readonly uomLookupService = inject(ModelSharedUomLookupService);
	public readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	public readonly translateService = inject(PlatformTranslateService);
	public readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly drawingCompareService = inject(ModelShareDrawingCompareDialogService);
	public readonly companyContextService = inject(BasicsSharedCompanyContextService);

	protected destroy$ = new Subject<void>();

	/**
	 * Observable for cancel drawing request
	 * @protected
	 */
	protected get cancelDrawingRequest$() {
		return this.viewerService.cancelDrawingRequest$;
	}

	/**
	 * Time span for open drawing request to avoid multiple request in a short time, default is 200ms
	 * @private
	 */
	private readonly openDrawingTimeSpan = 200;

	/**
	 * Ige viewer instance
	 */
	public igeViewer!: IgeViewer;
	/**
	 * Viewer status
	 */
	public status = new DrawingViewerStatus();
	/**
	 * Host element for ige engine
	 */
	public abstract canvasElement: ElementRef;
	/**
	 * Viewer configuration
	 */
	public abstract config: IDrawingViewerConfig;
	/**
	 * Calibration worker
	 */
	public calibration?: DrawingCalibrationWorker;
	/**
	 * Dimension worker
	 */
	public dimension?: DrawingDimensionWorker;
	/**
	 * Markup worker
	 */
	public markup?: DrawingMarkupWorker;

	/**
	 * Viewer initializing
	 * @protected
	 */
	protected init() {
		this.translateService.load(['model.viewer', 'model.wdeviewer']);
		this.status.initDisplayMode(this.config.displayMode);
		from(igeService.startEngine(this.canvasElement.nativeElement))
			.pipe(takeUntil(this.destroy$))
			.subscribe((viewer) => {
				this.igeViewer = viewer;
				this.viewerService.openDrawingRequest$.pipe(debounceTime(this.openDrawingTimeSpan), takeUntil(this.destroy$)).subscribe((request) => {
					this.handleDrawingRequest(request);
				});
			});
		this.companyContextService.prepareLoginCompany();
	}

	private handleDrawingRequest(request?: OpenDrawingRequest) {
		this.drawingRequest = request;
		this.modelRequest = request?.modelRequest;
		this.status.clear();

		// if request is null meaning current drawing is not existed, we need to close previous drawing in the viewer
		if (!request) {
			this.closePreviousDrawing();
			return;
		}

		this.status.work('Loading drawing detail');

		from(this.igeViewer.loadDrawing(request.drawingId))
			.pipe(takeUntil(this.cancelDrawingRequest$), takeUntil(this.destroy$))
			.subscribe((d) => {
				let layout = d.currentLayout;

				this.status.rest('Finish Loading drawing detail');

				if (request.layoutId) {
					layout = d.toLayout(request.layoutId);
				} else if (request.layoutIndex) {
					d.layoutIndex = request.layoutIndex;
					layout = d.currentLayout;
				}

				if (!layout) {
					this.closePreviousDrawing();
					return;
				}

				if (!this.checkDrawingLayoutChanged(request, layout)) {
					return;
				}

				this.disposeWorkers();
				this.status.setDisplayMode(request.displayMode);
				this.status.work('Canceling layout');
				this.igeViewer
					.cancelOpenDrawing$()
					.pipe(takeUntil(this.cancelDrawingRequest$), takeUntil(this.destroy$))
					.subscribe(() => {
						this.loadDrawingLayout(request, layout!.id);
					});
			});
	}

	private closePreviousDrawing() {
		this.disposeWorkers();
		this.igeViewer.closeDrawing();
	}

	private loadDrawingLayout(request: OpenDrawingRequest, layoutId: string) {
		this.status.work('Opening layout');
		from(this.igeViewer.openLayout(layoutId, request.displayMode === DrawingDisplayMode.Document))
			.pipe(takeUntil(this.cancelDrawingRequest$), takeUntil(this.destroy$))
			.subscribe(() => {
				this.status.rest('Finish opening layout');

				this.loadNSetViewConfig();

				if (this.status.isDocument) {
					// TODO: treat this case
				} else {
					if (request.modelRequest && request.modelRequest.modelConfig) {
						this.calibration = new DrawingCalibrationWorker(this, request.modelRequest);
						if (this.config.dimensionService) {
							this.dimension = new DrawingDimensionWorker(this, request.modelRequest);
						}
					}
					if (this.calibration) {
						this.calibration.initCalibration(layoutId);
					}
					if (this.dimension) {
						this.status.work('Loading Dimension');
						this.dimension
							.loadDimension$(layoutId)
							.pipe(takeUntil(this.cancelDrawingRequest$), takeUntil(this.destroy$))
							.subscribe(() => {
								this.status.rest('Finish Loading Dimension');
								this.selectDimensions(request);
							});
					}
				}
				if (request.modelRequest) {
					this.markup = new DrawingMarkupWorker(this, request.modelRequest);
					this.markup.initMarkup(layoutId);
				}
			});
	}

	private checkDrawingLayoutChanged(request: OpenDrawingRequest, layout: ILayout) {
		const current = this.igeViewer.currentLayout;

		// The new drawing layout is the same with current opening one
		if (current && current.drawingId === request.drawingId && current.layoutId == layout.id && current.documentMode === this.status.isDocument) {
			if (this.status.isDocument) {
				// TODO: under document mode
			} else {
				if (this.dimension) {
					this.selectDimensions(request);
				}
			}
			return false; // target drawing layout is opened.
		}

		return true;
	}

	private selectDimensions(request: OpenDrawingRequest) {
		let uuids = request.dimensionUuids || [];
		if (request.modelRequest && request.modelRequest.modelObjectIds) {
			uuids = uuids.concat(this.dimension!.resolveDimensionUuids(request.modelRequest.modelObjectIds));
		}
		this.dimension!.selectDimensions(uuids);
	}

	/**
	 * Viewer destroying
	 * @protected
	 */
	protected destroy() {
		this.destroy$.next();
		this.destroy$.complete();
		this.disposeWorkers();
		this.igeViewer.shutdown();
	}

	private disposeWorkers() {
		if (this.dimension) {
			this.dimension.dispose();
			this.dimension = undefined;
		}
		if (this.calibration) {
			this.calibration.dispose();
			this.calibration = undefined;
		}
		if (this.markup) {
			this.markup.dispose();
			this.markup = undefined;
		}
	}

	public loadNSetViewConfig() {
		this.viewerService.loadViewConfig(this.viewId).then((settings) => {
			this.setViewConfig(settings);
		});
	}

	private setViewConfig(settings: DrawingViewConfig) {
		this.igeViewer.engine.setDrawingDisplayEnabled(this.igeViewer.linker.DrawingDisplaySetting.WhiteBackground, settings.white);
		this.igeViewer.engine.setDrawingDisplayEnabled(this.igeViewer.linker.DrawingDisplaySetting.UseMonochrome, settings.monochrome);
		this.igeViewer.engine.setDrawingDisplayEnabled(this.igeViewer.linker.DrawingDisplaySetting.ShowText, settings.text);
		this.igeViewer.engine.setDrawingDisplayEnabled(this.igeViewer.linker.DrawingDisplaySetting.ShowHatching, settings.showHatching);
		this.igeViewer.engine.setDrawingDisplayEnabled(this.igeViewer.linker.DrawingDisplaySetting.UseLineStyle, settings.lineStyle);
		this.igeViewer.engine.setDrawingDisplayEnabled(this.igeViewer.linker.DrawingDisplaySetting.UseLineWeight, settings.lineWeight);
		this.igeViewer.engine.setOptionAsInteger(MarkupIgeOptionValue.DimensionLabels, settings.labelType);

		if (settings.message) {
			this.igeViewer.engine.setSelectMessageMode(this.igeViewer.linker.SelectMessageMode.Show);
		} else {
			this.igeViewer.engine.setSelectMessageMode(this.igeViewer.linker.SelectMessageMode.Off);
		}
	}

	private _contextMenu?: ActivePopup;

	public openContextMenu(e: MouseEvent) {
		e.preventDefault();

		this.igeViewer.getContextMenu().then((items) => {
			const menuItems = items.map((item, index) => this.mapMenuItem(item, index));

			if (this.dimension && !this.config.readonly) {
				const selectedDimensionIds = this.igeViewer.engine.selectedDimensionIds();

				if (selectedDimensionIds.length === 1) {
					menuItems.splice(0, 0, {
						id: 'edit-dimension',
						description: {
							text: 'Edit Dimension',
							key: 'model.wdeviewer.dimension.edit',
						},
						execute: () => {
							this.dimension!.showDimensionPropertyDialog(selectedDimensionIds[0]);
						},
					});
				} else if (selectedDimensionIds.length > 1) {
					menuItems.splice(0, 0, {
						id: 'edit-dimensions',
						description: {
							text: 'Edit Dimensions',
							key: 'model.wdeviewer.dimension.bulkEdit',
						},
						execute: () => {
							this.dimension!.showDimensionsPropertyDialog(selectedDimensionIds);
						},
					});
				}
			}

			this._contextMenu = this.popupService.openMenu(
				this.canvasElement,
				{
					menuLevel: 0,
					menuItems: menuItems,
				},
				{
					basePoint: e,
				},
			);

			this._contextMenu.closed.subscribe(() => {
				this._contextMenu = undefined;
				this.igeViewer.engine.processContextMenuOption('0');
			});
		});
	}

	private mapMenuItem(item: IIgeMenuItem, index: number): IPopupMenuItem {
		const result: IPopupMenuItem = {
			id: index.toString(),
			description: item.text || '',
		};

		if (item.seperator) {
			result.divider = true;
		} else {
			if (item.id) {
				const menuOption = item.id.toString();
				result.execute = () => {
					this.igeViewer.engine.processContextMenuOption(menuOption);
				};
			}
			if (item.submenu) {
				result.subItems = item.submenu.map((s, i) => this.mapMenuItem(s, i));
			}
		}

		return result;
	}

	public closeContextMenu() {
		if (this._contextMenu) {
			this._contextMenu.close();
		}
	}

	private async getCurrentPageInfo(layoutId: string) {
		let pageInfo = '1'; // default page text
		let layoutName: string | null = null;
		if (this.modelRequest?.modelConfig?.layoutSettings && this.modelRequest?.modelConfig?.layoutSettings.length > 0 && layoutId) {
			const layoutSetting = this.modelRequest?.modelConfig?.layoutSettings?.find((l) => l.lid === layoutId);
			if (layoutSetting) {
				layoutName = layoutSetting.name as string;
				const layoutIndex = this.modelRequest.modelConfig.layoutSettings.indexOf(layoutSetting);
				pageInfo = `${layoutIndex + 1}/${this.modelRequest.modelConfig?.layoutSettings.length}`;
			}
		} else if (this.drawingRequest?.drawingId) {
			const layoutInfo = await firstValueFrom(this.http.get$<IDrawingLayoutInfo>('model/igeviewer/drawing/' + this.drawingRequest?.drawingId));
			const layoutItem = layoutInfo?.layouts?.find((l) => l.id === layoutId);
			if (layoutItem) {
				layoutName = layoutItem.name;
				const layoutIndex = layoutInfo?.layouts?.indexOf(layoutItem);
				pageInfo = `${layoutIndex + 1}/${layoutInfo?.totalLayout}`;
			}
		}
		return {
			name: layoutName,
			pageText: pageInfo,
		};
	}

	private getDimensionsOnView() {
		const count = this.igeViewer.engine.dimensionCount();
		const dims = [];
		for (let i = 0; i < count; i++) {
			const dimension = this.igeViewer.engine.getDimension(i).serialize();
			dims.push(JSON.parse(dimension));
		}

		return dims;
	}

	private createLegends(uomUnit: string) {
		const legends: IDimensionLegend[] = [];
		if (!this.modelRequest?.modelId || !this.dimension?.dimensionEntityMap) {
			return legends;
		}
		const group = groupBy(this.getDimensionsOnView(), 'dimensionGroupId');
		const dimensionGroups = this.igeViewer.dimension.dimensionGroups;

		const positiveItems: IDimensionLegend[] = [];
		const negativeItems: IDimensionLegend[] = [];
		forEach(group, (value, key) => {
			const dimensionGroup = find(dimensionGroups, { dimensionGroupId: key });
			if (!dimensionGroup) {
				return;
			}

			const positiveItem: IDimensionLegend = {
				color: dimensionGroup.positiveConfig.colour,
				colorInt: dimensionGroup.positiveConfig.fillStyle,
				name: dimensionGroup.name,
				value: 0,
				uom: uomUnit,
			};
			const negativeItem: IDimensionLegend = {
				color: dimensionGroup.negativeConfig.colour,
				colorInt: dimensionGroup.negativeConfig.fillStyle,
				name: dimensionGroup.name,
				value: 0,
				uom: uomUnit,
			};
			let isArea = false;

			forEach(value, (dim) => {
				const target = dim.area < 0 ? negativeItem : positiveItem;
				switch (dim.dimensionType) {
					case 'Count':
						target.value += dim.count;
						break;
					case 'Length':
						target.value += dim.length;
						break;
					case 'Area':
						target.value += dim.area;
						isArea = true;
						break;
				}
			});

			if (isArea && uomUnit) {
				positiveItem.uom += '2'; // TODO DEV-22097
				negativeItem.uom += '2';
			}
			if (positiveItem.value > 0) {
				positiveItems.push(positiveItem);
			}
			if (negativeItem.value < 0) {
				negativeItems.push(negativeItem);
			}
		});

		if (positiveItems.length > 0) {
			this.mergeAndPushLegendItems(positiveItems, legends);
		}
		if (negativeItems.length > 0) {
			this.mergeAndPushLegendItems(negativeItems, legends);
		}
		return legends;
	}

	private mergeAndPushLegendItems(items: IDimensionLegend[], legends: IDimensionLegend[]) {
		const groups = groupBy(items, (item) => `${item.name}-${item.uom}-${item.color}`);
		map(groups, (items) => {
			items[0].value = sumBy(items, 'value');
			return items[0];
		});
		forEach(groups, (group) => {
			legends.push(...group);
		});
	}

	public async openPrintDialog() {
		if (!this.modelRequest?.modelId) {
			await this.messageBoxService.showInfoBox('cloud.common.noCurrentSelection', 'info', true);
			return;
		}
		const layoutId = this.igeViewer?.currentLayout?.layoutId;
		let modelText: string | undefined;
		let pageText: string | undefined;
		let projectText: string | null = null;
		let legends: IDimensionLegend[] = [];
		let uomFk: number | null = null;
		const companyText = `${this.configService.signedInClientCode} ${this.configService.signedInClientName}`;
		if (layoutId && this.modelRequest?.modelConfig) {
			const pageInfo = await this.getCurrentPageInfo(layoutId);
			modelText = pageInfo.name ?? this.drawingRequest?.code;
			pageText = pageInfo.pageText as string;

			const layoutConfig = this.modelRequest?.modelConfig?.getLayoutConfig(layoutId);
			uomFk = layoutConfig?.uomFk;
			if (layoutConfig?.uomFk) {
				const uomItem = await firstValueFrom(this.uomLookupService.getItemByKey({ id: layoutConfig?.uomFk }));
				legends = this.createLegends(uomItem.Unit);
			}
		}
		const printInfoParam = {
			ModelId: this.modelRequest?.modelId,
			ModelObjectIds: [],
			UomFk: uomFk,
		};
		const printInfo = await firstValueFrom(this.http.post$<IDrawingPrintInfo>('model/wdeviewer/info/print', printInfoParam));
		let userText = this.contextService.clientName;
		if (printInfo) {
			userText = printInfo.UserName;
			projectText = printInfo.ProjectNo ? `${printInfo.ProjectNo} ${printInfo.ProjectName ?? printInfo.ProjectName2 ?? ''}` : null;
			if ((!userText || userText.length === 0) && printInfo.ModelCode && printInfo.ModelDesc) {
				modelText = `${printInfo.ModelCode} ${printInfo.ModelDesc}`;
			}
		}
		this.modalDialogService.show({
			id: 'open-print-dialog',
			headerText: 'cloud.common.print',
			showCloseButton: true,
			resizeable: true,
			width: '800px',
			bodyComponent: DrawingPrintDialogComponent,
			bodyProviders: [
				{
					provide: DRAWING_PRINT_DIALOG_TOKEN,
					useValue: {
						legends: legends,
						showLegend: true,
						isShowLegend: true,
						useVectorPublisher: false,
						pageOrientation: PrintPageOrientation.Landscape,
						pageSize: PrintPageSize.A4,
						sectionGroups: [],
						companyText: companyText,
						projectText: projectText,
						modelText: modelText,
						userText: userText,
						pageInfo: pageText,
						igeViewer: this.igeViewer,
					},
				},
			],
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					fn(evt, info) {
						info.dialog.body.openPrint();
					},
					isDisabled: false,
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
		});
	}

	public async showComparisonDialog() {
		const layoutId = this.igeViewer?.currentLayout?.layoutId;
		if (!layoutId || !this.modelRequest?.modelConfig || !this.drawingRequest?.drawingId) {
			return;
		}
		const scale = this.modelRequest.modelConfig.getLayoutScale(layoutId);
		const result = await this.drawingCompareService.showDialog(this.drawingRequest.drawingId, layoutId, scale.ratio);
		if (result.closingButtonId === StandardDialogButtonId.Ok && result?.value) {
			this.igeViewer.engine.closeDrawing();
			this.igeViewer.engine.compareDrawings(result.value.mode, result.value.baseLayoutInfo as string, result.value.refLayoutInfo as string, result.value.useTolerance);
		}
	}

	public showViewConfigDialog() {
		this.viewerService.loadViewConfig(this.viewId).then((viewConfig) => {
			const entity = {
				...viewConfig,
			};

			const runtimeInfo: EntityRuntimeData<DrawingViewConfig> = {
				readOnlyFields: [],
				validationResults: [],
				entityIsReadOnly: false,
			};

			this.formDialogService
				.showDialog<DrawingViewConfig>({
					id: 'view-config-dialog',
					headerText: {
						text: 'Viewer Configuration',
						key: 'model.viewer.configTitle',
					},
					formConfiguration: this.createViewFormConfig(),
					entity: entity,
					runtime: runtimeInfo,
					customButtons: [],
					//topDescription: '',
				})
				?.then((result: IEditorDialogResult<DrawingViewConfig>) => {
					if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						this.applyViewConfig(result.value);
						this.viewerService.clearMarkupTool();
					} else {
						//this.handleCancel(result);
					}
				});
		});
	}

	private createViewFormConfig(): IFormConfig<DrawingViewConfig> {
		return {
			formId: 'view-config-form',
			showGrouping: false,
			groups: [
				{
					groupId: 'default',
					header: {
						text: 'View Config',
						key: 'model.viewer.configTitle',
					},
				},
			],
			rows: [
				{
					groupId: 'default',
					id: 'highlightColor',
					label: {
						text: 'Highlight Color',
						key: 'model.wdeviewer.highlightColor',
					},
					type: FieldType.Color,
					model: 'highlightColor',
					sortOrder: 2,
					required: false,
					format: ColorFormat.RgbaValue,
				},
				{
					groupId: 'default',
					id: 'text',
					label: {
						text: 'Text',
						key: 'model.wdeviewer.text',
					},
					type: FieldType.Boolean,
					model: 'text',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'white',
					label: {
						text: 'White Background',
						key: 'model.wdeviewer.white',
					},
					type: FieldType.Boolean,
					model: 'white',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'monochrome',
					label: {
						text: 'Monochrome',
						key: 'model.wdeviewer.monochrome',
					},
					type: FieldType.Boolean,
					model: 'monochrome',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'message',
					label: {
						text: 'Show Message',
						key: 'model.wdeviewer.message',
					},
					type: FieldType.Boolean,
					model: 'message',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'showLegend',
					label: {
						text: 'Show Legend',
						key: 'model.wdeviewer.print.showLegend',
					},
					type: FieldType.Boolean,
					model: 'showLegend',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'showHatching',
					label: {
						text: 'Show Hatch',
						key: 'model.wdeviewer.showHatching',
					},
					type: FieldType.Boolean,
					model: 'showHatching',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'lineStyle',
					label: {
						text: 'Line Style',
						key: 'model.wdeviewer.lineStyle',
					},
					type: FieldType.Boolean,
					model: 'lineStyle',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'lineWeight',
					label: {
						text: 'Line Weight',
						key: 'model.wdeviewer.lineWeight',
					},
					type: FieldType.Boolean,
					model: 'lineWeight',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'labelType',
					label: {
						text: 'Label Type',
						key: 'model.wdeviewer.dimensionLabel.type',
					},
					type: FieldType.Lookup,
					model: 'labelType',
					sortOrder: 2,
					required: false,
					lookupOptions: createLookup<DrawingViewConfig, LookupSimpleEntity>({
						dataService: this.lookupServiceFactory.fromSimpleItemClass(
							[
								{ id: 0, desc: { text: 'None', key: 'model.wdeviewer.dimensionLabel.none' } },
								{ id: 1, desc: { text: 'Name', key: 'model.wdeviewer.dimensionLabel.name' } },
								{ id: 2, desc: { text: 'Quantity Unit', key: 'model.wdeviewer.dimensionLabel.quantityUnit' } },
								{ id: 3, desc: { text: 'Name Quantity Unit', key: 'model.wdeviewer.dimensionLabel.nameQuantityUnit' } },
							],
							{
								translateDisplayMember: true,
							},
						),
					}),
				},
				{
					groupId: 'default',
					id: 'zoomSelectMarkup',
					label: {
						text: 'Zoom to Highlighted Markup',
						key: 'model.wdeviewer.markup.zoomMarkup',
					},
					type: FieldType.Boolean,
					model: 'zoomSelectMarkup',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'noMarkupDialog',
					label: {
						text: 'Do not pop-up markup dialog',
						key: 'model.wdeviewer.markup.noMarkupDialog',
					},
					type: FieldType.Boolean,
					model: 'noMarkupDialog',
					sortOrder: 2,
					required: false,
				},
				{
					groupId: 'default',
					id: 'defaultMarkupColor',
					label: {
						text: 'Markup color',
						key: 'model.wdeviewer.markup.markupColor',
					},
					type: FieldType.Color,
					model: 'defaultMarkupColor',
					sortOrder: 2,
					required: false,
					format: ColorFormat.RgbaValue,
				},
				{
					groupId: 'default',
					id: 'fontHeight',
					label: {
						text: 'Markup color',
						key: 'model.wdeviewer.textFontHeight',
					},
					type: FieldType.Lookup,
					model: 'fontHeight',
					sortOrder: 2,
					required: false,
					lookupOptions: createLookup<DrawingViewConfig, LookupSimpleEntity>({
						dataService: this.lookupServiceFactory.fromSimpleItemClass([
							{ id: 16, desc: '16' },
							{ id: 20, desc: '20' },
							{ id: 24, desc: '24' },
							{ id: 32, desc: '32' },
						]),
					}),
				},
			],
		};
	}

	private applyViewConfig(viewConfig: DrawingViewConfig) {
		this.viewerService.saveViewConfig(this.viewId, viewConfig).then(() => {
			this.setViewConfig(viewConfig);
		});
	}

	public startMeasurement() {
		return this.igeViewer.engine.startActionMode(this.igeViewer.linker.ActionMode.Measure);
	}

	public finishMeasurement() {
		return this.igeViewer.engine.startActionMode(this.igeViewer.linker.ActionMode.None);
	}

	public refreshView() {
		this.disposeWorkers();
		this.loadDrawingLayout(this.drawingRequest!, this.igeViewer.currentLayout!.layoutId);
	}
}
