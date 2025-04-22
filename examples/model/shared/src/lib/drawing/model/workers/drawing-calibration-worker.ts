/*
 * Copyright(c) RIB Software GmbH
 */

import {Observable, of} from 'rxjs';
import {createLookup, FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId} from '@libs/ui/common';
import {OpenModelRequest} from '../open-model-request';
import {DrawingModelConfig} from '../drawing-model-config';
import {DrawingWorkerBase} from './drawing-worker-base';
import {EntityRuntimeData} from '@libs/platform/data-access';
import {ModelSharedUomLookupService} from '../../lookup/uom-lookup.service';
import {DrawingLayoutConfig} from '../drawing-layout-config';
import {ModelSharedDrawingScaleComponent} from '../../components/drawing-scale/drawing-scale.component';
import {DrawingScaleContext} from '../drawing-scale-context';
import {DrawingViewer} from './drawing-viewer';
import {DrawingUnitSymbol} from '../enums';

/**
 * Drawing calibration worker, dealing with calibration related logic.
 */
export class DrawingCalibrationWorker extends DrawingWorkerBase {
    private readonly modelConfig: DrawingModelConfig;

    public constructor(
        viewer: DrawingViewer,
        private modelRequest: OpenModelRequest
    ) {
        super(viewer);

        if(!modelRequest.modelConfig) {
            throw new Error('Current model configuration is empty!');
        }

        this.modelConfig = modelRequest.modelConfig;

        const s0 = this.igeViewer.calibration.calibrateAxisValue$.subscribe(e => {
            let title = 'model.wdeviewer.calibration.free';

            switch (e.axis) {
                case this.igeViewer.linker.ScreenAxis.Horizontal: {
                    title = 'model.wdeviewer.calibration.x';
                }
                    break;
                case this.igeViewer.linker.ScreenAxis.Vertical: {
                    title = 'model.wdeviewer.calibration.y';
                }
                    break;
            }

            this.showCalibrationDialog(title, true, {
                drawingDistance: e.length / e.layout.scale,
                actualDistance: e.length
            });
        });

        this.subscriptions.push(s0);
    }

    private createScaleFormConfig(context: DrawingScaleContext): IFormConfig<DrawingLayoutConfig> {
        return {
            formId: 'scale-form',
            showGrouping: false,
            groups: [
                {
                    groupId: 'default',
                    header: {
                        text: 'Scale',
                        key: 'model.wdeviewer.scale'
                    },
                },
            ],
            rows: [
                {
                    groupId: 'default',
                    id: 'uomFk',
                    label: {
                        text: 'Base UoM',
                        key: 'model.wdeviewer.uomBase'
                    },
                    type: FieldType.Lookup,
                    model: 'uomFk',
                    sortOrder: 2,
                    required: false,
                    lookupOptions: createLookup({
                        dataServiceToken: ModelSharedUomLookupService,
                        clientSideFilter: {
                            execute: item => item.LengthDimension == 1
                        },
                        displayMember: 'DescriptionInfo.Translated'
                    }),
                    change: e => {
                        context.uomChanged.next(e.newValue as number);
                    }
                },
                {
                    groupId: 'default',
                    id: 'scale',
                    label: {
                        text: 'Scale',
                        key: 'model.wdeviewer.scale'
                    },
                    type: FieldType.CustomComponent,
                    componentType: ModelSharedDrawingScaleComponent,
                    providers: [
                        {
                            provide: DrawingScaleContext,
                            useValue: context
                        }
                    ],
                    sortOrder: 5,
                    readonly: false
                },
                {
                    groupId: 'default',
                    id: 'custom',
                    label: {
                        text: 'Store scale in page',
                        key: 'model.wdeviewer.calibration.storeScaleInPage'
                    },
                    type: FieldType.Boolean,
                    model: 'custom',
                    sortOrder: 5,
                }
            ]
        };
    }

    /**
     * Initialize drawing calibration
     * @param layoutId
     */
    public initCalibration(layoutId: string) {
        const layoutConfig = this.modelConfig.getLayoutConfig(layoutId);
        const scaleInfo = this.modelConfig.getLayoutScale(layoutId);
        const drawingUnitHint = this.igeViewer.linker.DrawingUnitHint;
        this.igeViewer.calibration.setDrawingUnitSystem(scaleInfo.isImperial ? drawingUnitHint.Imperial : drawingUnitHint.Metric);
        this.igeViewer.calibration.init(scaleInfo.angle, scaleInfo.ratio, scaleInfo.ratio);

        if (layoutConfig.uomFk) {
            this.viewer.uomLookupService.getItemByKey({id: layoutConfig.uomFk}).subscribe(e => {
                this.setDisplayUOM(e.Unit, layoutConfig.isImperial, layoutConfig.isFeet);
            });
        }
    }

    /**
     * Start to calibrate x axis
     */
    public calibrateX() {
        const success = this.igeViewer.mode.calibrateX();

        if (!success) {
            this.viewer.messageBoxService.showYesNoDialog('model.wdeviewer.calibration.unitSystemDone', 'model.wdeviewer.calibration.reset')?.then(r => {
                if (r.closingButtonId === StandardDialogButtonId.Yes) {
                    this.resetCalibration$().subscribe(() => {
                        this.igeViewer.mode.calibrateX();
                    });
                }
            });
        }
    }

    /**
     * Start to calibrate y axis
     */
    public calibrateY() {
        const success = this.igeViewer.mode.calibrateY();

        if (!success) {
            this.viewer.messageBoxService.showYesNoDialog('model.wdeviewer.calibration.unitSystemDone', 'model.wdeviewer.calibration.reset')?.then(r => {
                if (r.closingButtonId === StandardDialogButtonId.Yes) {
                    this.resetCalibration$().subscribe(() => {
                        this.igeViewer.mode.calibrateY();
                    });
                }
            });
        }
    }

    /**
     * Reset calibration
     */
    public resetCalibration$(): Observable<boolean> {
        return new Observable(s => {

            if (!this.igeViewer.currentLayout) {
                throw new Error('current layout is empty!');
            }

            const layoutId = this.igeViewer.currentLayout.layoutId;
            const layoutConfig = this.modelConfig.getLayoutConfig(layoutId);
            const entity: DrawingLayoutConfig = {
                ...layoutConfig
            };

            entity.drawingDistance = 1;
            entity.actualDistance = 1;
            entity.custom = true;

            this.viewer.calibrationService.preview({
                modelId: this.modelRequest.modelId,
                layoutId: this.igeViewer.currentLayout!.layoutId,
                newScale: 1,
                custom: true
            }).then(e => {
                if (e.AffectedObjectCount > 0) {
                    this.viewer.messageBoxService.showYesNoDialog(this.viewer.translateService.instant({
                        key: 'model.wdeviewer.calibration.countHint',
                        params: {
                            count: e.AffectedObjectCount
                        }
                    }).text, 'model.wdeviewer.calibration.recalibrate')?.then(r => {
                        if (r.closingButtonId === 'yes') {
                            this.igeViewer.calibration.effectResolver = {
                                resolve: () => {
                                    return of({
                                        dimensions: e.Dimensions.map(i => i.Geometry)
                                    });
                                }
                            };
                            this.igeViewer.calibration.reset().subscribe(() => {
                                this.igeViewer.calibration.effectResolver = {resolve: () => of({})};

                                if (entity.isImperial) {
                                    this.setDisplayUOM(DrawingUnitSymbol.Inch, false, false);
                                } else {
                                    this.setDisplayUOM(DrawingUnitSymbol.Millimeter, false, false);
                                }

                                this.finishCalibration$(entity).subscribe(() => {
                                    s.next(true);
                                });
                            });
                        }
                    });
                } else {
                    this.igeViewer.calibration.reset().subscribe(() => {
                        if (entity.isImperial) {
                            this.setDisplayUOM(DrawingUnitSymbol.Inch, false, false);
                        } else {
                            this.setDisplayUOM(DrawingUnitSymbol.Millimeter, false, false);
                        }

                        this.finishCalibration$(entity).subscribe(() => {
                            s.next(true);
                        });
                    });
                }
            });
        });
    }

    /**
     * Show scale configuration dialog
     */
    public showScaleConfigDialog() {
        this.showCalibrationDialog('model.wdeviewer.scaleSetting', false);
    }

    private showCalibrationDialog(title: string, calibrateAxis: boolean, options?: Partial<DrawingLayoutConfig>) {
        if (!this.igeViewer.currentLayout) {
            throw new Error('current layout is empty!');
        }

        const layoutId = this.igeViewer.currentLayout.layoutId;
        const layoutConfig = this.modelConfig.getLayoutConfig(layoutId);
        const entity: DrawingLayoutConfig = {
            ...layoutConfig,
            ...options
        };
        const runtimeInfo: EntityRuntimeData<DrawingLayoutConfig> = {
            readOnlyFields: [
                {
                    field: 'uomFk',
                    readOnly: false,
                }
            ],
            validationResults: [],
            entityIsReadOnly: false
        };

        const context = new DrawingScaleContext(entity);

        this.viewer.formDialogService
            .showDialog<DrawingLayoutConfig>({
                id: 'scale-dialog',
                headerText: title,
                formConfiguration: this.createScaleFormConfig(context),
                entity: entity,
                runtime: runtimeInfo,
                customButtons: [],
                //topDescription: '',
            })
            ?.then((result: IEditorDialogResult<DrawingLayoutConfig>) => {
                if (result.closingButtonId === StandardDialogButtonId.Ok) {
                    // support fractional imperial format
                    if (calibrateAxis && entity.isImperial && entity.isFeet) {
                        entity.actualDistance = entity.actualDistance * 12;
                    }

                    //this.handleOk(result);
                    this.applyScaleConfig(entity, layoutConfig);
                } else {
                    //this.handleCancel(result);
                }
            });
    }

    private setDisplayUOM(unit: string, isImperial: boolean, isFeet: boolean) {
        const UOM = this.igeViewer.linker.UOM;

        // Todo - Workaround here, how to know the square unit and cubic unit to base unit is? need a solution from UOM module.
        this.igeViewer.engine.setDisplayUOM(
            {
                type: this.igeViewer.linker.UOMType.LengthUnit,
                prefix: this.igeViewer.linker.UOMPrefix.None,
                uom: isImperial ? (isFeet ? UOM.Feet : UOM.Inches) : UOM.Metre
            }, unit,
            {
                type: this.igeViewer.linker.UOMType.AreaUnit,
                prefix: this.igeViewer.linker.UOMPrefix.None,
                uom: isImperial ? (isFeet ? UOM.SquareFeet : UOM.SquareInches) : UOM.SquareMetre
            }, unit + '2',
            {
                type: this.igeViewer.linker.UOMType.VolumeUnit,
                prefix: this.igeViewer.linker.UOMPrefix.None,
                uom: isImperial ? (isFeet ? UOM.CubicFeet : UOM.CubicInches) : UOM.CubicMetre
            }, unit + '3'
        );

        this.igeViewer.engine.setDrawingUOM(
            {
                type: this.igeViewer.linker.UOMType.LengthUnit,
                prefix: this.igeViewer.linker.UOMPrefix.None,
                uom: isImperial ? UOM.Inches : UOM.Metre
            },
            {
                type: this.igeViewer.linker.UOMType.AreaUnit,
                prefix: this.igeViewer.linker.UOMPrefix.None,
                uom: isImperial ? UOM.SquareInches : UOM.SquareMetre
            },
            {
                type: this.igeViewer.linker.UOMType.VolumeUnit,
                prefix: this.igeViewer.linker.UOMPrefix.None,
                uom: isImperial ? UOM.CubicInches : UOM.CubicMetre
            }
        );
    }

    private applyScaleConfig(newLayoutConfig: DrawingLayoutConfig, oldLayoutConfig: DrawingLayoutConfig) {
        const oldScale = this.modelConfig.extractLayoutScale(oldLayoutConfig);
        const newScale = this.modelConfig.extractLayoutScale(newLayoutConfig);

        const res = {
            ok: true,
            layout: newLayoutConfig.lid,
            scale: newScale,
            isScaleChanged: (oldScale.ratio !== newScale.ratio),
            isUomChanged: (newLayoutConfig.uomFk !== oldLayoutConfig.uomFk),
            isUnitHintChange: (oldLayoutConfig.isImperial !== oldLayoutConfig.isImperial),
            uomFk: newLayoutConfig.uomFk,
            rdData: null,
            isImperial: newLayoutConfig.isImperial,
            isFeet: newLayoutConfig.isFeet
        };

        if (res.isScaleChanged || res.isUnitHintChange || res.isUomChanged) {
            const request = {
                modelId: this.modelRequest.modelId,
                layoutId: this.igeViewer.currentLayout!.layoutId,
                newScale: newScale.ratio,
                newUomFk: newLayoutConfig.uomFk,
                custom: newLayoutConfig.custom
            };

            this.viewer.status.work('recalibrating');

            this.viewer.calibrationService.preview(request).then(e => {
                if (e.AffectedObjectCount > 0) { // exists dimensions on the current drawing layout.
                    this.viewer.messageBoxService.showYesNoDialog(`${e.AffectedObjectCount} object(s) will be affected, it may take time to update object property, continue to recalibrate?`, 'model.wdeviewer.calibration.recalibrate')!.then(dr => {
                        if (dr.closingButtonId !== 'yes') {
                            return;
                        }

                        const handleUomChanged = () => {
                            this.viewer.calibrationService.recalibrate(request).then(e => {
                                if (newLayoutConfig.uomFk) {
                                    this.viewer.uomLookupService.getItemByKey({id: newLayoutConfig.uomFk}).subscribe(e => {
                                        this.setDisplayUOM(e.Unit, res.isImperial, res.isFeet);
                                    });
                                }

                                this.finishCalibration(newLayoutConfig);
                            });
                        };

                        if (res.isUnitHintChange) {
                            this.viewer.messageBoxService.showInfoBox('model.wdeviewer.notAllowChangeSystemUnit', 'info', false);
                            return;
                        }

                        if (res.isScaleChanged) {
                            this.igeViewer.calibration.effectResolver = {
                                resolve: () => {
                                    return of({
                                        dimensions: e.Dimensions.map(i => i.Geometry)
                                    });
                                }
                            };

                            this.igeViewer.calibration.set(newScale.angle, newScale.ratio, newScale.ratio).subscribe((success) => {
                                this.igeViewer.calibration.effectResolver = {resolve: () => of({})};

                                if (success) {
                                    if (res.isUomChanged) {
                                        handleUomChanged();
                                    } else {
                                        this.finishCalibration(newLayoutConfig);
                                    }
                                } else {
                                    throw new Error('calibration failed');
                                }
                            });
                        } else if (res.isUomChanged) {
                            handleUomChanged();
                        }
                    });
                } else { // no dimension object exists.
                    if (res.isUnitHintChange) {
                        const unitHint = this.igeViewer.linker.DrawingUnitHint;
                        this.igeViewer.calibration.reset();
                        this.igeViewer.calibration.setDrawingUnitSystem(newLayoutConfig.isImperial ? unitHint.Imperial : unitHint.Metric);
                    }

                    if (res.isUomChanged && newLayoutConfig.uomFk) {
                        this.viewer.uomLookupService.getItemByKey({id: newLayoutConfig.uomFk}).subscribe(e => {
                            this.setDisplayUOM(e.Unit, res.isImperial, res.isFeet);
                        });
                    }

                    if (res.isScaleChanged) {
                        this.igeViewer.calibration.effectResolver = {resolve: () => of({})};
                        this.igeViewer.calibration.set(newScale.angle, newScale.ratio, newScale.ratio).subscribe(() => {
                            // calibration updated
                        });
                    }

                    this.finishCalibration(newLayoutConfig);
                }
            });
        }
    }

    private finishCalibration(newLayoutConfig: DrawingLayoutConfig) {
        this.finishCalibration$(newLayoutConfig).subscribe(() => {
            this.viewer.status.rest();
        });
    }

    private finishCalibration$(newLayoutConfig: DrawingLayoutConfig) {
        return new Observable(s => {
            this.saveScaleConfig(newLayoutConfig).then(() => {
                if (this.viewer.dimension) {
                    this.viewer.dimension.refreshDimension$().subscribe(e => {
                        s.next(e);
                    });
                } else {
                    s.next(true);
                }
            });
        });
    }

    private saveScaleConfig(newLayoutConfig: DrawingLayoutConfig) {
        this.modelConfig.updateLayoutConfig(newLayoutConfig);

        return this.viewer.viewerService.saveModelConfig(this.modelRequest.modelId, this.modelConfig);
    }
}