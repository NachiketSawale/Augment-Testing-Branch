/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEngDrawingComponentEntity } from './entities/eng-drawing-component-entity.interface';
import { IEngDrawingSkillEntity } from './entities/eng-drawing-skill-entity.interface';
import { IEngStackEntity } from './entities/eng-stack-entity.interface';
import { EngStackComplete } from './eng-stack-complete.class';

import { CompleteIdentification } from '@libs/platform/common';
import { IEngDrawingEntity } from './entities/eng-drawing-entity.interface';
import { IPpsDocumentEntity, IPpsProductTemplateEntityGenerated, PpsDocumentComplete, PpsProductTemplateComplete } from '@libs/productionplanning/shared';

export class EngDrawingComplete implements CompleteIdentification<IEngDrawingEntity> {

	/*
	 * ClobToSave
	 */
	//TODO: public ClobToSave!: IClobEntity | null;

	/*
	 * CostGroupToDelete
	 */
	//TODO: public CostGroupToDelete!: IMainItem2CostGroupEntity[] | null;

	/*
	 * CostGroupToSave
	 */
	//TODO: public CostGroupToSave!: IMainItem2CostGroupEntity[] | null;

	/*
	 * Drawing
	 */
	public Drawing!: IEngDrawingEntity[] | null;

	/*
	 * DrawingComponentsToDelete
	 */
	public DrawingComponentsToDelete!: IEngDrawingComponentEntity[] | null;

	/*
	 * DrawingComponentsToSave
	 */
	public DrawingComponentsToSave!: IEngDrawingComponentEntity[] | null;

	/*
	 * EngDrawingSkillToDelete
	 */
	public EngDrawingSkillToDelete!: IEngDrawingSkillEntity[] | null;

	/*
	 * EngDrawingSkillToSave
	 */
	public EngDrawingSkillToSave!: IEngDrawingSkillEntity[] | null;

	/*
	 * MainItemId
	 */
	public MainItemId!: number | null;

	/*
	 * PpsDocumentToDelete
	 */
	public PpsDocumentToDelete!: IPpsDocumentEntity[] | null;

	/*
	 * PpsDocumentToSave
	 */
	public PpsDocumentToSave!: PpsDocumentComplete[] | null;

	/*
	 * ProductDescriptionToDelete
	 */
	public ProductDescriptionToDelete!: IPpsProductTemplateEntityGenerated[] | null;

	/*
	 * ProductDescriptionToSave
	 */
	public ProductDescriptionToSave!: PpsProductTemplateComplete[] | null;

	/*
	 * ProgressReportToDelete
	 */
	//TODO: public ProgressReportToDelete!: IEngDrwProgReportEntity[] | null;

	/*
	 * ProgressReportToSave
	 */
	//TODO: public ProgressReportToSave!: IEngDrwProgReportEntity[] | null;

	/*
	 * StacksToDelete
	 */
	public StacksToDelete!: IEngStackEntity[] | null;

	/*
	 * StacksToSave
	 */
	public StacksToSave!: EngStackComplete[] | null;
}
