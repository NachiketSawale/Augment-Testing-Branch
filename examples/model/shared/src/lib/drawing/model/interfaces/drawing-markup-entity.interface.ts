/*
 * Copyright(c) RIB Software GmbH
 */

import {IMarkupAnnotationEntity} from './markup-annotation-entity.interface';
import {IMarkupAnnoMarkerEntity} from './markup-anno-marker-entity.interface';
import { MarkupStyle, MarkupType } from '@rib/ige-engine-core';

/**
 * markup record (model annotation marker data)
 */
export interface IDrawingMarkupEntity {
    /**
     * Id
     */
    Id: number;
    /**
     * Markup.id
     */
    MarkerId: string;
    /**
     * Marker (Markup.serialize())
     */
    Marker: string;
    /**
     * LayoutId
     */
    LayoutId: string;
    /**
     * BasClerkFk
     */
    ClerkFk: number;
    /**
     * Clerk Name
     */
    Clerk: string;
    /**
     * UpdateTime (substr 4 by AnnoMarker.InsertedAt)
     */
    UpdateTime: string;
    /**
     * Is Select
     */
    IsSelect: boolean;
	/**
	 * Is Focus
	 */
    IsFocus: boolean;
    /**
     * Is Disable Goto button
     */
    IsDisableGoto: boolean;
    /**
     * Is Show in viewer
     */
    IsShow: boolean;
    /**
     * Color (hexColorToInt)
     */
    Color: number;
    /**
     * Description (Markup.text)
     */
    Description: string;
    /**
     * Content (AnnoMarker.DescriptionInfo.Translated)
     */
    Content: string;
    /**
     * markup from module name
     */
    ModuleName: string;
    /**
     * MdlAnnotationFk
     */
    AnnotationFk: number;
    /**
     * MdlAnnoMarkerFk
     */
    AnnoMarkerFk: number;
    /**
     * InfoRequestFk (link project.InfoRequest)
     */
    InfoRequestFk?: number;
    /**
     * HsqChecklistFk (link Hsqe.Checklist)
     */
    HsqChecklistFk?: number;
    /**
     * DefectFk (link Defect.main)
     */
    DefectFk?: number;
    /**
     * OriginMarker (Origin Markup.serialize())
     */
    OriginMarker: string;
    /**
     * MarkupAnnotationEntity
     */
    MarkupAnnotationEntity?: IMarkupAnnotationEntity;
    /**
     * MarkupAnnoMarkerEntity
     */
    MarkupAnnoMarkerEntity?: IMarkupAnnoMarkerEntity;
}

// TODO maybe use ige.IMarkup, but I not found 'markupBlob' now
export interface IMarkup {
	id: string;
	type: MarkupType;
	style: MarkupStyle;
	text: string;
	fontHeight: number;
	markupBlob: string;
}