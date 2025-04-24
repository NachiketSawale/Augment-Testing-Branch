/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';
import { IMarkupAnnoMarkerEntity } from './markup-anno-marker-entity.interface';

/**
 * Model Annotation Entity
 */
export interface IMarkupAnnotationEntity extends IEntityBase {
    /**
     * Id
     */
    Id: number;
    /**
     * BpdContactFk
     */
    BpdContactFk?: number;
    /**
     * BusinessPartnerFk
     */
    BusinessPartnerFk?: number;
    /**
     * CategoryFk
     */
    CategoryFk?: number;
    /**
     * ClerkFk
     */
    ClerkFk: number;
    /**
     * Clerk Name
     */
    Clerk: string;
    /**
     * Color
     */
    Color: number;
    /**
     * DefectFk
     */
    DefectFk?: number;
    /**
     * DescriptionInfo
     */
    DescriptionInfo: IDescriptionInfo;
    /**
     * DueDate
     */
    DueDate: string;
    /**
     * EffectiveCategoryFk
     */
    EffectiveCategoryFk: number;
    /**
     * HsqChecklistFk
     */
    HsqChecklistFk?: number;
    /**
     * InfoRequestFk
     */
    InfoRequestFk?: number;
    /**
     * MeasurementFk
     */
    MeasurementFk?: number;
    /**
     * MeasurementValue
     */
    MeasurementValue?: number;
    /**
     * ModelFk
     */
    ModelFk: number;
    /**
     * PriorityFk
     */
    PriorityFk: number;
    /**
     * RawType
     */
    RawType: number;
    /**
     * Remark
     */
    Remark: string;
    /**
     * Sorting
     */
    Sorting: number;
    /**
     * StatusFk
     */
    StatusFk: number;
    /**
     * SubsidiaryFk
     */
    SubsidiaryFk?: number;
    /**
     * Uuid
     */
    Uuid: string;
    /**
     * ViewpointFk
     */
    ViewpointFk?: number;

    // CameraEntities: [];
    // ClipEntities?: [];
    // CommentEntities?: [];
    // DocumentEntities?: [];
    MarkerEntities: IMarkupAnnoMarkerEntity[];
	Markers: IMarkupAnnoMarkerEntity[];
    // ReferenceFromEntity?: object;
    // ReferenceToEntity?: object;
}