/*
 * Copyright(c) RIB Software GmbH
 */

import {isArray, isNumber, isNil, isNaN, find, extend} from 'lodash';
import {DrawingLayoutConfig} from './drawing-layout-config';
import {IDrawingScaleInfo} from './interfaces/drawing-scale-info.interface';

export class DrawingModelConfig {
    public layout: string | null = null;
    public name: string | null = null; // layout name
    public uomFk: number | null = null;
    public drawingDistanceX = 1.0;
    public actualDistanceX = 1.0;
    public drawingDistanceY = 1.0;
    public actualDistanceY = 1.0;
    public drawingDistance = 1.0;
    public actualDistance = 1.0;
    public calibrated = false;
    public angle = 0;
    public calibration: number | null = null;
    public layoutSettings?: DrawingLayoutConfig[] | null = [];
    public layoutNames?: string[] | null = [];
    public layoutSort?: string[] | null = [];
    public isShowMarkup = false;
    public isFeet = false;
    public isImperial = false;
    // used by ige engine to solve offset issue, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 53970.88915271428, 120161.05249170371, 0, 1]
    public toOriginMatrix?: { [key: string]: number[] } | null = null;


    /**
     * Get layout config.
     * @param layoutId
     */
    public getLayoutConfig(layoutId: string) {
        if (!isArray(this.layoutSettings)) {
            this.layoutSettings = [];
        }

        let lSettings = find(this.layoutSettings, {lid: layoutId, custom: true}) as DrawingLayoutConfig;

        if (isNil(lSettings)) {
            lSettings = new DrawingLayoutConfig();
            lSettings.lid = this.layout;
            lSettings.name = this.name;
            this.toLayout(lSettings);
        }

        return lSettings;
    }

    private toLayout(lSettings: DrawingLayoutConfig) {
        lSettings.uomFk = this.uomFk;
        lSettings.drawingDistanceX = this.drawingDistanceX;
        lSettings.actualDistanceX = this.actualDistanceX;
        lSettings.drawingDistanceY = this.drawingDistanceY;
        lSettings.actualDistanceY = this.actualDistanceY;
        lSettings.drawingDistance = this.drawingDistance;
        lSettings.actualDistance = this.actualDistance;
        lSettings.calibrated = this.calibrated;
        lSettings.angle = this.angle;
        lSettings.calibration = this.calibration;
        lSettings.isFeet = this.isFeet;
        lSettings.isImperial = this.isImperial;
    }

    private fromLayout(lSettings: DrawingLayoutConfig) {
        this.uomFk = lSettings.uomFk;
        this.drawingDistanceX = lSettings.drawingDistanceX;
        this.actualDistanceX = lSettings.actualDistanceX;
        this.drawingDistanceY = lSettings.drawingDistanceY;
        this.actualDistanceY = lSettings.actualDistanceY;
        this.drawingDistance = lSettings.drawingDistance;
        this.actualDistance = lSettings.actualDistance;
        this.calibrated = lSettings.calibrated;
        this.angle = lSettings.angle;
        this.calibration = lSettings.calibration;
        this.isFeet = lSettings.isFeet;
        this.isImperial = lSettings.isImperial;
    }

    /**
     * Get scale factor.
     * @param layoutId
     */
    public getLayoutScale(layoutId: string): IDrawingScaleInfo {
        const layoutConfig = this.getLayoutConfig(layoutId);
        return this.extractLayoutScale(layoutConfig);

    }

    /**
     * Extract scale information.
     * @param layoutConfig
     */
    public extractLayoutScale(layoutConfig: DrawingLayoutConfig) {
        const x = layoutConfig.actualDistanceX / layoutConfig.drawingDistanceX;
        const y = layoutConfig.actualDistanceY / layoutConfig.drawingDistanceY;
        const ratio = layoutConfig.actualDistance / layoutConfig.drawingDistance;

        const data = {
            x: isNumber(x) && !isNaN(x) ? x : 1,
            y: isNumber(y) && !isNaN(y) ? y : 1,
            ratio: isNumber(ratio) && !isNaN(ratio) ? ratio : 1,
            mode: layoutConfig.calibration,
            angle: layoutConfig.angle || 0,
            isImperial: layoutConfig.isImperial,
            isFeet: layoutConfig.isFeet
        };

        return data;
    }

    /**
     * Get origin matrix for wde dimensions.
     * @param layoutId
     */
    public getLayoutToOriginMatrix(layoutId: string) {
        if (!this.toOriginMatrix) {
            return null;
        }

        return this.toOriginMatrix[layoutId];
    }

    /**
     * Get custom layouts
     */
    public getCustomLayoutIds() {
        if (!this.layoutSettings) {
            return [];
        }

        return this.layoutSettings.filter((item) => {
            return item.custom;
        }).map(function (item) {
            return item.lid;
        });
    }

    /**
     * Update layout configuration
     * @param layoutConfig
     */
    public updateLayoutConfig(layoutConfig: DrawingLayoutConfig) {
        if (layoutConfig.custom) {
            if (!isArray(this.layoutSettings)) {
                this.layoutSettings = [];
            }

            const layoutSetting = find(this.layoutSettings, {
                lid: layoutConfig.lid,
                custom: true
            }) as DrawingLayoutConfig;

            if (layoutSetting) {
                extend(layoutSetting, layoutConfig);
            } else {
                this.layoutSettings.push(layoutConfig);
            }
        } else {
            this.fromLayout(layoutConfig);
        }
    }
}