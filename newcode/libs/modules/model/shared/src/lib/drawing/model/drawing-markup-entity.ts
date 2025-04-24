/*
 * Copyright(c) RIB Software GmbH
 */

import {IDrawingMarkupEntity} from './interfaces/drawing-markup-entity.interface';
import {IMarkupAnnotationEntity} from './interfaces/markup-annotation-entity.interface';
import {IMarkupAnnoMarkerEntity} from './interfaces/markup-anno-marker-entity.interface';

/**
 * markup entity
 */
export class DrawingMarkupEntity implements IDrawingMarkupEntity {
    /**
     * Id
     */
    public Id: number = -1;
    /**
     * ModelId
     */
    public ModelId: number = -1;
    /**
     * Markup.id
     */
    public MarkerId: string = '';
    /**
     * Marker (Markup.serialize())
     */
    public Marker: string = '';
    /**
     * LayoutId
     */
    public LayoutId: string = '';
    /**
     * BasClerkFk
     */
    public ClerkFk: number = -1;
    /**
     * Clerk Name
     */
    public Clerk: string = '';
    /**
     * UpdateTime (substr 4 by AnnoMarker.InsertedAt)
     */
    public UpdateTime: string = '';
    /**
     * Is Select
     */
    public IsSelect: boolean = false;
	/**
	 * Is Focus
	 */
	public IsFocus: boolean = false;
    /**
     * Is Disable Goto button
     */
    public IsDisableGoto: boolean = false;
    /**
     * Is Show in viewer
     */
    public IsShow: boolean = false;
    /**
     * Color (hexColorToInt)
     */
    public Color: number = -1;
    /**
     * Description (Markup.text)
     */
    public Description: string = '';
    /**
     * Content (AnnoMarker.DescriptionInfo.Translated)
     */
    public Content: string = '';
    /**
     * markup from module name
     */
    public ModuleName: string = '';
    /**
     * MdlAnnotationFk
     */
    public AnnotationFk: number = -1;
    /**
     * MdlAnnoMarkerFk
     */
    public AnnoMarkerFk: number = -1;
    /**
     * InfoRequestFk (link project.InfoRequest)
     */
    public InfoRequestFk?: number;
    /**
     * HsqChecklistFk (link Hsqe.Checklist)
     */
    public HsqChecklistFk?: number;
    /**
     * DefectFk (link Defect.main)
     */
    public DefectFk?: number;
    /**
     * OriginMarker (Origin Markup.serialize())
     */
    public OriginMarker: string = '';
    /**
     * MarkupAnnotationEntity
     */
    public MarkupAnnotationEntity?: IMarkupAnnotationEntity;
    /**
     * MarkupAnnoMarkerEntity
     */
    public MarkupAnnoMarkerEntity?: IMarkupAnnoMarkerEntity;

    public constructor(public Annotation: IMarkupAnnotationEntity, public AnnoMarker: IMarkupAnnoMarkerEntity) {
        const marupData = JSON.parse(AnnoMarker.MarkupJson);
        this.MarkupAnnotationEntity = Annotation;
        this.MarkupAnnoMarkerEntity = AnnoMarker;
        this.Id = this.MarkerId = marupData.id;
        this.Marker = this.OriginMarker = AnnoMarker.MarkupJson;
        this.LayoutId = AnnoMarker.LayoutId;
        this.ModelId = Annotation.ModelFk;
        this.ClerkFk = Annotation.ClerkFk;
        this.Clerk = Annotation.Clerk;
        if (AnnoMarker.InsertedAt) {
            this.UpdateTime = new Date(AnnoMarker.InsertedAt).toDateString().substr(4);
        }
        this.Color = marupData.colour;
        this.Description = marupData.text;
        this.Content = AnnoMarker.DescriptionInfo.Translated || AnnoMarker.DescriptionInfo.Description;
        //TODO this.ModuleName
        this.AnnotationFk = Annotation.Id;
        this.AnnoMarkerFk = AnnoMarker.Id;
        this.InfoRequestFk = Annotation.InfoRequestFk;
        this.DefectFk = Annotation.DefectFk;
        this.HsqChecklistFk = Annotation.HsqChecklistFk;
    }
}