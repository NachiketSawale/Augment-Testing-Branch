/*
 * Copyright(c) RIB Software GmbH
 */

import { Markup, MarkupStyle } from '@rib/ige-engine-core';
import {DrawingWorkerBase} from './drawing-worker-base';
import {DrawingViewer} from './drawing-viewer';
import {OpenModelRequest} from '../open-model-request';
import {IMarkupService} from '../interfaces/markup-service.interface';
import {DrawingMarkupEntity} from '../drawing-markup-entity';
import { IDrawingMarkupEditInfo, IMarkupRequest } from '../interfaces/drawing-markup-edit-info.interface';
import { IMarkupAnnoMarkerEntity } from '../interfaces/markup-anno-marker-entity.interface';
import { IMarkupAnnotationEntity } from '../interfaces/markup-annotation-entity.interface';
import { isNumber } from 'lodash';
import { fromEvent } from 'rxjs';

/**
 * Drawing markup worker, handle markup related logic.
 */
export class DrawingMarkupWorker extends DrawingWorkerBase {
	private modelId: number;
	private fileName: string = '';
	private noChangeByUpdate: number = 0;//if > 0, no need go markup change function
	public markupService: IMarkupService;
	private tempMarkup: Markup = {} as Markup;
	public markupList: DrawingMarkupEntity[] = [];
	private readonly pointStyle = {
		Default: 0,
		Arrow: 1,
		Tick: 2,
		Cross: 3,
		Star: 4,
		NotVisible: 5
	};
	private mousePosition = {
		clientX: 0,
		clientY: 0
	};
	private readonly pointStyleArray = [this.pointStyle.Tick, this.pointStyle.Cross];

	public constructor(viewer: DrawingViewer, private modelRequest: OpenModelRequest) {
		super(viewer);

		this.modelId = modelRequest.modelId;
		if (!viewer.config.markupService) {
			throw new Error('Current markupService is empty');
		}
		this.markupService = this.viewer.injector.get(viewer.config.markupService);
		this.markupService.setDrawingViewerState(true);
		const sMouseMove = fromEvent<MouseEvent>(document, 'mousemove').subscribe(event => {
			this.mousePosition.clientX = event.clientX;
			this.mousePosition.clientY = event.clientY;
		});
		const sDownloadPdf = this.markupService.downloadPdfAsObservable().subscribe(e => {
			const result = this.igeViewer.engine.savePDFDrawing(e);
			if (result !== 0 || result === undefined) {
				throw new Error(result === 138
					? 'Currently, only document mode is supported!'// if result=138, it is takeOff mode
					: `Download Failed, called back result:${result}`);
			} else {
				window.console.log('Save Markup to PDF ok');
			}
		});
		const sDownloadPdfName = this.markupService.downloadPdfNameAsObservable().subscribe(name => {
			this.fileName = name;// set name to setOnPublishDrawingFinished
		});
		const sMarkupEdit = this.markupService.markupEditAsObservable().subscribe(e => {
			if (e.Id.length > 0) {
				this.markupUpdateResponse(e);
			} else if (this.igeViewer.currentLayout && e.ReadOnlyConfig.isNewMarkup) {
				this.markupCreate(this.igeViewer.currentLayout.layoutId, this.tempMarkup);
			}
		});
		const sDeleteMarkup = this.markupService.deleteMarkupAsObservable().subscribe(e => {
			this.igeViewer.engine.deleteMarkups([e]);
		});
		const sZoomToMarkup = this.markupService.zoomToMarkupAsObservable().subscribe(e => {
			this.igeViewer.engine.zoomToMarkup(e);
		});
		// this.igeViewer.markup.readonly = true; //this code hide the markupCreate & markupEdit & markupDelete option in the context menu when return true
		const sCreate = this.igeViewer.markup.markupCreated$.subscribe(e => {
			const layout = this.igeViewer.currentLayout;
			if (layout) {
				this.tempMarkup = e;
			} else {
				throw new Error('Current layout not found!');
			}
			const viewConfig = viewer.viewerService.currentViewConfig();
			if (viewConfig.noMarkupDialog) {
				const regNumber = /^\d+$/;
				viewer.viewerService.activeMarkupTool = {
					btnId: (e && regNumber.test(e.id) ? Number(e.id) : 0),
					markupType: e.type,
					markupStyle: e.style
				};
			} else {
				viewer.viewerService.activeMarkupTool = null;
			}
			return true;
		});
		const sChange = this.igeViewer.markup.markupChange$.subscribe(e => {
			// I not need go this change function when igeViewer.engine.updateMarkupStyle && igeViewer.engine.updateMarkupText
			if (this.noChangeByUpdate > 0) {
				this.noChangeByUpdate--;
			} else {
				this.markupChange(e);
			}
			return true;
		});
		const sDelete = this.igeViewer.markup.markupDelete$.subscribe(e => {
			this.deleteMarkup(e);
		});
		const sFocus = this.igeViewer.markup.markupFocus$.subscribe(e => {
			this.markupService.currentMarkups.forEach(m => m.IsFocus = false);
			const entity = this.markupService.currentMarkups.find(m => m.MarkerId === e);
			if (entity) {
				entity.IsFocus = true;
			}
		});
		const sUpdateRequest = this.igeViewer.markup.markupUpdateRequest$.subscribe(e => {
			const viewConfig = viewer.viewerService.currentViewConfig();
			const editParam = e as IMarkupRequest;
			editParam.Color = editParam.markupStyle?.colour ?? '';
			if (e.bNewMarkup && viewConfig) {
				editParam.height = viewConfig.fontHeight;
				editParam.Color = this.decToHexColor(viewConfig.defaultMarkupColor);
				if (viewConfig.noMarkupDialog) {
					if (viewer.viewerService.activeMarkupTool && e.markupStyle?.endPointStyle.value === this.pointStyle.NotVisible) {
						this.showMarkupTextDialog(editParam, viewer);
					} else if (viewer.viewerService.activeMarkupTool) {
						document.addEventListener('mouseup', function (event) {
							if (viewer.viewerService.activeMarkupTool) {
								const activeMarkup = viewer.viewerService.activeMarkupTool;
								viewer.igeViewer.engine.createMarkup(activeMarkup.markupType, activeMarkup.markupStyle);
							}
						}, {once: true});
					}
					this.markupCreate(this.igeViewer.currentLayout?.layoutId as string, this.tempMarkup);
					return editParam.text;
				}
			}
			this.markupService.showEditDialog(editParam, this.markupService.currentMarkups);
			return editParam.text;
		});
		this.igeViewer.engine.setOnPublishDrawingFinished(d => {
			this.markupDrawingFinished(new Uint8Array(d));
		});
		this.subscriptions = [sCreate, sChange, sDelete, sFocus, sUpdateRequest, sDownloadPdf, sDownloadPdfName, sMarkupEdit, sDeleteMarkup, sZoomToMarkup, sFocus, sMouseMove];
	}

	/**
	 * load all markups about modelRequest.modelId
	 */
	public async loadAllMarkup() {
		this.markupService.currentMarkups = [];
		this.markupList = [];
		const annoEntities = await this.markupService.getAnnotations(this.modelRequest.modelId);
		if (!this.closed) {
			annoEntities.forEach(annoEntity => {
				const markupEntities = annoEntity.MarkerEntities.map(m => new DrawingMarkupEntity(annoEntity, m));
				this.markupList = this.markupList.concat(markupEntities);
			});
			return true;
		}
		return false;
	}

	/**
	 * load current markups about layoutId
	 * @param layoutId use this.igeViewer.currentLayout when layoutId null
	 */
	public loadMarkupsByLayout(layoutId?: string) {
		const modelId = this.modelRequest.modelId;
		if (this.markupList.find(m => m.ModelId === modelId)) {
			if (!layoutId) {
				const layout = this.igeViewer.currentLayout;
				if (layout) {
					layoutId = layout.layoutId;
				}
			}
			if (layoutId) {
				this.markupService.currentMarkups = this.markupList.filter(m => m.LayoutId === layoutId);
				this.markupService.sendLoadMarkup(this.markupService.currentMarkups);
				const markupData = this.markupService.currentMarkups.map(m => m.Marker);
				this.igeViewer.engine.loadMarkups(markupData);
				return true;
			}
		}
		return false;
	}

	public loadCurrentMarkup() {
		const markupData = this.markupService.currentMarkups.map(m => m.Marker);
		const result = this.igeViewer.engine.loadMarkups(markupData);
		window.console.log(result);
		if (!result) {
			throw new Error('load markup failed!');
		}
	}

	public hideCurrentMarkup() {
		const markupIds = this.markupService.currentMarkups.map(m => m.MarkerId);
		this.igeViewer.engine.unloadMarkups(markupIds);
	}

	/**
	 * load current markups about layoutId
	 * @remark query all markup when load cache markups return false
	 * @param layoutId use this.igeViewer.currentLayout when layoutId null
	 */
	public async initMarkup(layoutId?: string) {
		if (!this.loadMarkupsByLayout(layoutId)) {
			const loadOk = await this.loadAllMarkup();
			if (loadOk) {
				this.loadMarkupsByLayout(layoutId);
			}
		}
	}

	/**
	 * markup Create
	 * @param layoutId
	 * @param markup
	 */
	private async markupCreate(layoutId: string, markup: Markup) {
		if (this.markupService.currentMarkups.find(m => m.MarkerId === markup.id)) {
			return;
		}
		const markupJsonString = this.markupString(markup);
		const color = this.markupService.hexColorToInt(markup.style.colour);
		const annoMarkerEntity = {
			Id: 0,
			LayoutId: layoutId,
			MarkupJson: markupJsonString,
			Color: color,
			DescriptionInfo: {Description: '', Modified: true},
			Version: 0
		} as IMarkupAnnoMarkerEntity;
		const annoEntity = {
			Id: 0,
			ModelFk: this.modelId,
			ClerkFk: this.viewer.companyContextService.loginCompanyEntity.ClerkFk,
			RawType: 0,//TODO set RawType after get module
			Color: color,
			DescriptionInfo: {Description: '', Modified: true},
			MarkerEntities: [annoMarkerEntity],
			Version: 0
		} as IMarkupAnnotationEntity;
		const newMarkup = await this.markupService.saveAnnotations([annoEntity]);
		const newDrawingMarkup = newMarkup[0].MarkerEntities.map(m => new DrawingMarkupEntity(newMarkup[0], m))[0];
		this.markupService.currentMarkups.push(newDrawingMarkup);
		this.markupList.push(newDrawingMarkup);
	}

	/**
	 * markup change
	 * @param markup
	 */
	private async markupChange(markup: { id: string, serialize: () => string } /*Markup*/) {
		const markupItem = this.markupService.currentMarkups.find(m => m.MarkerId === markup.id);
		if (markupItem && markupItem.MarkupAnnoMarkerEntity) {
			const markupEntity = await this.markupService.updateMarkupChange(markupItem);
			markupItem.MarkupAnnoMarkerEntity = markupEntity.MarkupAnnoMarkerEntity;
		}
	}

	/**
	 * markup delete
	 * @param markupId Markup.id
	 */
	public deleteMarkup(markupId: string): void {
		const markupEntity = this.markupService.currentMarkups.find(m => m.MarkerId === markupId);
		if (markupEntity && markupEntity.MarkupAnnotationEntity) {
			this.markupService.deleteAnnotation(markupEntity.MarkupAnnotationEntity);
			this.markupService.currentMarkups = this.markupService.currentMarkups.filter(m => m.MarkerId !== markupId);
			this.markupList = this.markupList.filter(m => m.MarkerId !== markupId);
		} else {
			// TODO
			window.console.log('not found annotation entity in markup!');
			return;
		}
		const selMarkup = this.igeViewer.engine.getMarkup(markupId);
		if (selMarkup) {
			this.igeViewer.engine.unloadMarkups([markupId]);
			window.console.log('markup delete: ' + markupId);
		}
	}

	/**
	 * print or download pdf markup
	 * @param data Uint8Array
	 */
	private markupDrawingFinished(data: Uint8Array) {
		const name = (this.fileName && this.fileName.length > 0) ? this.fileName : 'Publish.pdf';
		window.console.log(`Callback OnPublishFinished: Offering download of ${name}, with ${data.length} bytes...`);
		const element = document.createElement('a');
		element.download = name;
		element.href = URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
		element.style.display = 'none';

		document.body.appendChild(element);
		element.click();
		element.addEventListener('click', () => {
			document.body.removeChild(element);
			URL.revokeObjectURL(element.href);
		});
	}

	private showMarkupTextDialog(markupEntity: IMarkupRequest, viewer: DrawingViewer) {
		const textInput = document.createElement('textarea');
		textInput.style.position = 'absolute';
		textInput.style.top = `${this.mousePosition.clientY}px`;
		textInput.style.left = `${this.mousePosition.clientX}px`;
		textInput.style.width = '100px';
		textInput.style.height = '60px';
		textInput.style.zIndex = '9999';
		textInput.style.padding = '3px';
		textInput.placeholder = 'input...';
		textInput.addEventListener('blur', () => {
			this.closeTextarea(textInput, markupEntity, viewer);
		});
		textInput.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') {
				this.closeTextarea(textInput, markupEntity, viewer);
			}
		});
		document.body.appendChild(textInput);
		textInput.focus();
	}

	private closeTextarea(element: HTMLTextAreaElement, markupEntity: IMarkupRequest, viewer: DrawingViewer) {
		if (element.value) {
			this.viewer.igeViewer.engine.updateMarkupText(markupEntity.markupId, element.value, markupEntity.height);
		}
		document.body.removeChild(element);

		document.addEventListener('mouseup', function (event) {
			if (viewer.viewerService.activeMarkupTool) {
				const activeMarkup = viewer.viewerService.activeMarkupTool;
				viewer.igeViewer.engine.createMarkup(activeMarkup.markupType, activeMarkup.markupStyle);
			}
		}, {once: true});
	}

	/**
	 * update Markup Style to IGE viewer
	 * @param entity markup edit dialog config
	 * @param igeMarkup ige markup data
	 */
	private checkUpdateMarkupStyle(entity: IDrawingMarkupEditInfo, igeMarkup: Markup) {
		const markupStyle = igeMarkup.style as MarkupStyle;
		const isUpdateStyle = entity.Change.isFillColor || entity.Change.isColor ||
			entity.Change.isLinePattern || entity.Change.isLineWidth || entity.Change.isRegionShape;
		if (entity.Change.isFillColor) {
			if (!entity.FillColor || entity.FillColor === 0) {
				markupStyle.fillColour = '#00000000';//default transparent color
			} else {
				markupStyle.fillColour = this.decToHexColor(entity.FillColor) + '80'; // 80 = transparency
			}
		}
		if (entity.Change.isColor) {
			markupStyle.colour = this.decToHexColor(entity.Color);
		}
		if (entity.Change.isLineWidth) {
			markupStyle.lineThickness = entity.LineWidth;
		}
		if (entity.Change.isLinePattern) {
			markupStyle.linePatternId = entity.LinePattern;
			markupStyle.endPointStyle.value = entity.LinePattern;
			if (this.pointStyleArray.indexOf(igeMarkup.style.endPointStyle.value) > -1) {
				markupStyle.startPointStyle.value = entity.LinePattern;
			}
		}
		if (entity.Change.isRegionShape) {
			markupStyle.shape = entity.RegionShape;
		}
		if (isUpdateStyle) {
			this.noChangeByUpdate++;
			this.viewer.igeViewer.engine.updateMarkupStyle(entity.Id, markupStyle);
		}
		return markupStyle;
	}

	private markupString(igeMarkup: Markup): string {
		if (igeMarkup.serialize) {
			return igeMarkup.serialize();
		}
		const markupItem = this.igeViewer.engine.getMarkup(igeMarkup.id);
		if (markupItem && markupItem.serialize) {
			return markupItem.serialize();
		}
		return '';
	}

	private async markupUpdateResponse(entity: IDrawingMarkupEditInfo) {
		const igeMarkup = this.igeViewer.engine.getMarkup(entity.Id);
		this.checkUpdateMarkupStyle(entity, igeMarkup);
		if (entity.Change.isComment || entity.Change.isFontHeight) {
			this.noChangeByUpdate++;
			this.viewer.igeViewer.engine.updateMarkupText(entity.Id, entity.Comment, entity.FontHeight);
		}
		if (this.igeViewer.currentLayout) {
			const markupEntity = this.markupService.currentMarkups.find(m => m.MarkerId === entity.Id);
			let annoEntity: IMarkupAnnotationEntity;
			const color = entity.Color;
			const markupJsonString = this.markupString(igeMarkup);
			if (markupEntity && markupEntity.MarkupAnnotationEntity) {
				if (markupEntity.MarkupAnnoMarkerEntity) {
					markupEntity.MarkupAnnoMarkerEntity.LayoutId = this.igeViewer.currentLayout.layoutId;
					markupEntity.MarkupAnnoMarkerEntity.MarkupJson = markupJsonString;
					markupEntity.MarkupAnnoMarkerEntity.Color = color;
					markupEntity.MarkupAnnoMarkerEntity.DescriptionInfo.Description = entity.Comment;
					markupEntity.MarkupAnnoMarkerEntity.DescriptionInfo.Translated = entity.Comment;
					markupEntity.MarkupAnnoMarkerEntity.DescriptionInfo.Modified = true;
				}
				markupEntity.MarkupAnnotationEntity.Color = color;
				// TODO markupEntity.MarkupAnnotationEntity.RawType = this.getRawType(entity.AnnotationRawType);
				if (entity.Change.isAnnotationDescription) {
					markupEntity.MarkupAnnotationEntity.DescriptionInfo.Description = entity.AnnotationDescription;
					markupEntity.MarkupAnnotationEntity.DescriptionInfo.Translated = entity.AnnotationDescription;
					markupEntity.MarkupAnnotationEntity.DescriptionInfo.Modified = true;
				}
				markupEntity.MarkupAnnotationEntity.MarkerEntities = [markupEntity.MarkupAnnoMarkerEntity as IMarkupAnnoMarkerEntity];
				markupEntity.MarkupAnnotationEntity.Markers = markupEntity.MarkupAnnotationEntity.MarkerEntities;
				annoEntity = markupEntity.MarkupAnnotationEntity;
			} else {
				const annoMarkerEntity = {
					Id: 0,
					LayoutId: this.igeViewer.currentLayout.layoutId,
					MarkupJson: markupJsonString,
					Color: color,
					DescriptionInfo: {Description: entity.Comment, Modified: true},
					Version: 0
				} as IMarkupAnnoMarkerEntity;
				annoEntity = {
					Id: 0,
					ModelFk: this.modelId,
					ClerkFk: this.viewer.companyContextService.loginCompanyEntity.ClerkFk,
					RawType: 0,//TODO set RawType after get module
					Color: color,
					DescriptionInfo: {Description: entity.AnnotationDescription, Modified: true},
					MarkerEntities: [annoMarkerEntity],
					Version: 0
				} as IMarkupAnnotationEntity;
				//TODO DefectFk/HsqChecklistFk/InfoRequestFk/ViewpointFk && ProjectFk
			}
			const newMarkup = await this.markupService.saveAnnotations([annoEntity]);
			if (markupEntity) {
				markupEntity.MarkupAnnotationEntity = newMarkup[0];
				markupEntity.MarkupAnnoMarkerEntity = newMarkup[0].MarkerEntities[0];
				const markupItem = this.markupList.find(m => m.MarkerId === entity.Id);
				if (markupItem) {
					markupItem.MarkupAnnotationEntity = newMarkup[0];
					markupItem.MarkupAnnoMarkerEntity = newMarkup[0].MarkerEntities[0];
				}
			} else {
				const newDrawingMarkup = newMarkup[0].MarkerEntities.map(m => new DrawingMarkupEntity(newMarkup[0], m))[0];
				this.markupService.currentMarkups.push(newDrawingMarkup);
				this.markupList.push(newDrawingMarkup);
			}
		}
	}

	/**
	 * Converts a decimal representation of a color to a string representation of color in hexadecimal format.
	 * @param data number
	 */
	public decToHexColor(data: number) {
		return data.toString(16).padStart(7, '#000000');
	}

	public hexColorToInt(colour: number | string) {
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

	public override dispose() {
		super.dispose();
		this.viewer.viewerService.clearMarkupTool();
		this.markupService.setDrawingViewerState(false);
	}
}