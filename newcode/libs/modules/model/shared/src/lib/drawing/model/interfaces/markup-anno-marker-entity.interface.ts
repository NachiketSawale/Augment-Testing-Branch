/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';
// import {IMarkupAnnotationEntity} from './markup-annotation-entity.interface';

/**
 * Model AnnoMarker Entity
 */
export interface IMarkupAnnoMarkerEntity extends IEntityBase {
    /**
     * Id
     */
    Id: number;
    /**
     * AnnotationFk
     */
    AnnotationFk: number;
    /**
     * CameraFk
     */
    CameraFk?: number;
    /**
     * Color
     */
    Color: number;
    /**
     * DescriptionInfo
     */
    DescriptionInfo: IDescriptionInfo;
    /**
     * EffectiveColor
     */
    EffectiveColor: number;
    /**
     * LayoutId
     */
    LayoutId: string;
    /**
     * MarkerShapeFk
     */
    MarkerShapeFk?: number;
    /**
     * MarkupJson
     */
    MarkupJson: string;
    /**
     * OwnerModelFk
     */
    OwnerModelFk: number;
    /**
     * PosX
     */
    PosX: number;
    /**
     * PosY
     */
    PosY: number;
    /**
     * PosZ
     */
    PosZ: number;
    /**
     * RawAnnotationBaseType
     */
    RawAnnotationBaseType: number;
    /**
     * UniformAnnotationParentId
     */
    UniformAnnotationParentId: string;

    // AnnotationEntity?: IMarkupAnnotationEntity;
    // ModelAnnotationCameraEntity?: [];
}