/*
 * Copyright(c) RIB Software GmbH
 */
import {firstValueFrom} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {ModelSharedDrawingViewerService} from './drawing-viewer.service';
import {ICalibrationContext, ICalibrationRequest, ICalibrationPreviewResponse} from '../model/interfaces/calibration.interface';
import {DrawingModelConfig} from '../model/drawing-model-config';

/**
 * Calibration service
 */
@Injectable({
    providedIn: 'root'
})
export class ModelSharedCalibrationService {
    private http = inject(HttpClient);
    private configService = inject(PlatformConfigurationService);
    private viewerService = inject(ModelSharedDrawingViewerService);
    private object2DWebApiBaseUrl = this.configService.webApiBaseUrl + 'model/main/object2d/';

    private makeContext(config: DrawingModelConfig, request: ICalibrationRequest): ICalibrationContext {
        const layoutConfig = config.getLayoutConfig(request.layoutId);
        const isUomChanged = request.newUomFk !== layoutConfig.uomFk;

        return {
            ModelId: request.modelId,
            LayoutId: request.layoutId,
            BaseUnitId: isUomChanged ? request.newUomFk : layoutConfig.uomFk,
        };
    }

    private makeData(config: DrawingModelConfig, request: ICalibrationRequest) {
        const layoutConfig = config.getLayoutConfig(request.layoutId);
        const scaleInfo = config.getLayoutScale(request.layoutId);
        const isUomChanged = request.newUomFk !== layoutConfig.uomFk;
        const isScaleChanged = request.newScale !== scaleInfo.ratio;

        return {
            OldScale: scaleInfo.ratio,
            NewScale: isScaleChanged ? request.newScale : scaleInfo.ratio,
            OldUomFk: layoutConfig.uomFk,
            NewUomFk: isUomChanged ? request.newUomFk : layoutConfig.uomFk,
            IsScaleChanged: isScaleChanged,
            IsUomChanged: isUomChanged,
            IsCustomLayout: request.custom,
            Layout: request.layoutId,
            CustomLayouts: config.getCustomLayoutIds()
        };
    }


    /**
     * Preview calibration result
     * @param request
     */
    public async preview(request: ICalibrationRequest): Promise<ICalibrationPreviewResponse> {
        const config = await this.viewerService.loadModelConfig(request.modelId);
        return await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'beforerecalibrate', {
            Context: this.makeContext(config, request),
            Data: this.makeData(config, request)
        })) as ICalibrationPreviewResponse;
    }

    /**
     * Recalibrate dimension objects
     * @param request
     */
    public async recalibrate(request: ICalibrationRequest): Promise<ICalibrationPreviewResponse> {
        const config = await this.viewerService.loadModelConfig(request.modelId);
        return await firstValueFrom(this.http.post(this.object2DWebApiBaseUrl + 'recalibrate', {
            Context: this.makeContext(config, request),
            Data: this.makeData(config, request)
        })) as ICalibrationPreviewResponse;
    }
}