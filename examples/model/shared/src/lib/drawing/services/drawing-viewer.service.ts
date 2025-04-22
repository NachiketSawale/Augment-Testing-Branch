/*
 * Copyright(c) RIB Software GmbH
 */
import { extend } from 'lodash';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, from, takeUntil } from 'rxjs';

import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';

import { OpenDrawingRequest } from '../model/open-drawing-request';
import { OpenModelRequest } from '../model/open-model-request';
import { DrawingModelConfig } from '../model/drawing-model-config';
import { IModelConfigEntity } from '../model/interfaces/model-config-entity.interface';
import { IDrawingConversionInfo } from '../model/interfaces/drawing-conversion-info.interface';
import { IDrawingModelInfo, IModelInfoResponse } from '../model/interfaces/drawing-model-info.interface';
import { DrawingViewConfig } from '../model/drawing-view-config';
import { igeService } from '@rib-4.0/ige-viewer';
import { MarkupType } from '@rib/ige-engine-core';
import { MarkupStyle } from '@rib/ige-engine-core/src/ige';

/**
 * The service used to interact with drawing viewer.
 */
@Injectable({
	providedIn: 'root',
})
export class ModelSharedDrawingViewerService {
	private readonly baseUrl = 'model/main/object2d/';
	private readonly http = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly _openDrawingRequest$ = new BehaviorSubject<OpenDrawingRequest | undefined>(undefined);
	private _cancelDrawingRequest$ = new Subject<void>();

	private modelConfigMap: Map<number, IModelConfigEntity> = new Map();
	private viewConfigMap: Map<string, DrawingViewConfig> = new Map();

	/**
	 * Observable for open drawing request
	 */
	public get openDrawingRequest$() {
		return this._openDrawingRequest$.asObservable();
	}

	/**
	 * Observable for cancel drawing request
	 */
	public get cancelDrawingRequest$() {
		return this._cancelDrawingRequest$.asObservable();
	}

	/**
	 * The constructor, preset IGE configuration
	 */
	public constructor() {
		igeService.configure({
			keyboardElement: '#canvas',
			serverBaseUrl: this.configService.webApiBaseUrl + 'model/igeviewer',
			clientBaseUrl: window.crossOriginIsolated ? 'assets/ige/' : 'assets/ige/nop/',
		});
	}

	/**
	 * Send opening drawing request to viewer.
	 * @param request
	 */
	public openDrawing(request: OpenDrawingRequest) {
		this.cancelPreviousDrawing();
		this.nextDrawingRequest(request);
	}

	/**
	 * Cancel previous drawing request.
	 * @private
	 */
	private cancelPreviousDrawing() {
		this._cancelDrawingRequest$.next();
		this._cancelDrawingRequest$.complete();
		this._cancelDrawingRequest$ = new Subject<void>();
	}

	/**
	 * Open 2D model
	 * @param request
	 */
	public openModel(request: OpenModelRequest) {
		this.cancelPreviousDrawing();
		from(this.loadModel(request.modelId))
			.pipe(takeUntil(this.cancelDrawingRequest$))
			.subscribe((e) => {
				const modelInfo = e[0];
				const modelConfig = e[1];
				const openDrawingRequest = new OpenDrawingRequest(modelInfo.drawingId);
				openDrawingRequest.code = modelInfo.code;
				openDrawingRequest.description = modelInfo.description;
				openDrawingRequest.converted = modelInfo.converted;
				openDrawingRequest.layoutId = modelConfig.layout;
				openDrawingRequest.dimensionUuids = request.modelObjectUuids;
				openDrawingRequest.modelRequest = request;
				openDrawingRequest.modelRequest.modelConfig = modelConfig;
				openDrawingRequest.displayMode = request.displayMode;

				if (request.modelObjectIds) {
					// TODO: continue implementation
				}

				this.nextDrawingRequest(openDrawingRequest);
			});
	}

	/**
	 * close current drawing of viewer
	 */
	public closeDrawing() {
		this.cancelPreviousDrawing();
		this.nextDrawingRequest(undefined);
	}

	/**
	 * Emit the next drawing request
	 * @param request
	 * @private
	 */
	private nextDrawingRequest(request?: OpenDrawingRequest) {
		this._openDrawingRequest$.next(request);
	}

	/**
	 * load model configuration
	 * @param modelId
	 */
	public async loadModelConfig(modelId: number): Promise<DrawingModelConfig> {
		const defaults = new DrawingModelConfig();
		const entity = await this.http.get<IModelConfigEntity>(this.baseUrl + 'loadmodelconfig', {
			params: {
				modelId: modelId,
			},
		});

		this.modelConfigMap.set(modelId, entity);

		if (entity && entity.Config) {
			const config = JSON.parse(entity.Config);
			extend(defaults, config);
		}

		return defaults;
	}

	/**
	 * Save model configuration.
	 * @param modelId
	 * @param modelConfig
	 */
	public async saveModelConfig(modelId: number, modelConfig: DrawingModelConfig) {
		const configJson = JSON.stringify(modelConfig);
		let entity = this.modelConfigMap.get(modelId);

		if (!entity) {
			throw new Error('Model config entity is not found!');
		}

		entity.Config = configJson;
		entity = await this.http.post<IModelConfigEntity>(this.baseUrl + 'savemodelconfig', entity);

		this.modelConfigMap.set(modelId, entity);
	}

	/**
	 * load model information.
	 * @param modelId
	 */
	public async loadModel(modelId: number): Promise<[IDrawingModelInfo, DrawingModelConfig]> {
		const url = 'model/project/model/selectioninfo';
		const info = await this.http.get<IModelInfoResponse>(url, {
			params: {
				modelId: modelId,
			},
		});
		const converted = await this.isModelConverted(modelId);
		const modelConfig = await this.loadModelConfig(modelId);

		return [
			{
				drawingId: info.modelUuid,
				converted: converted,
				code: info.modelCode,
			},
			modelConfig,
		];
	}

	/**
	 * Is model converted?
	 * @param modelId
	 */
	public async isModelConverted(modelId: number) {
		const url = 'model/wdeviewer/info/conversioninfo';
		const conversionInfo = await this.http.get<IDrawingConversionInfo>(url, {
			params: {
				modelId: modelId,
			},
		});
		return conversionInfo.Converted;
	}

	private currentViewId: string = ''; // TODO remove this viewId when has viewId
	// TODO remove this function when has viewId
	public currentViewConfig() {
		const defaults = new DrawingViewConfig();
		const config = this.viewConfigMap.get(this.currentViewId);
		if (config) {
			extend(defaults, config);
		}
		return defaults;
	}

	/**
	 * load view configuration
	 * @param viewId
	 */
	public async loadViewConfig(viewId: string): Promise<DrawingViewConfig> {
		const defaults = new DrawingViewConfig();

		defaults.message = true;
		// Todo - load view config by reusing view config service
		this.currentViewId = viewId;
		const config = this.viewConfigMap.get(viewId);
		if (config) {
			extend(defaults, config);
		}

		return defaults;
	}

	/**
	 * Save view configuration
	 * @param viewId
	 * @param config
	 */
	public async saveViewConfig(viewId: string, config: DrawingViewConfig): Promise<boolean> {
		// Todo - save view config by reusing view config service
		this.viewConfigMap.set(viewId, config);
		return true;
	}

	public activeMarkupTool: {
		btnId: number;
		markupType: MarkupType;
		markupStyle: MarkupStyle;
	} | null = null;

	public clearMarkupTool() {
		this.activeMarkupTool = null;
	}
}
