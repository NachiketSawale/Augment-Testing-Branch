/*
 * Copyright(c) RIB Software GmbH
 */

import {IBasicsClerkEntity} from '@libs/basics/shared';
import {IEvaluationDocumentToSaveEntity} from './evaluation-document-to-save-entity.interface';
import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEvaluationDocumentEntity } from './evaluation-document-entity.interface';
import { IEvaluationGroupDataToSaveEntity } from './evaluation-group-data-to-save-entity.interface';
import { IEvaluationGroupDataEntity } from './evaluation-group-data-entity.interface';

export type EvaluationGroupCreateEntityType = {
	MainItemId?: number | null;
	CreateEntities: IEvaluationGroupDataEntity[];
}

export class ScreenEvaluationCompleteEntity {
	public EvaluationGroupDataToSave?: IEvaluationGroupDataToSaveEntity[] | null;
	public Evaluation?: IEvaluationEntity | null;
	public EntitiesCount!: number;
	public MainItemId?: number;
	public Evaluation2ClerkToSave?: IBasicsClerkEntity[] | null;
	public Evaluation2ClerkToDelete?: IBasicsClerkEntity[] | null;
	public EvaluationDocumentToSave?: IEvaluationDocumentToSaveEntity[] | null;
	public EvaluationDocumentToDelete?: IEvaluationDocumentEntity[] | null;
	public CreateEntities?: EvaluationGroupCreateEntityType;
}