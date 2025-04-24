/*
 * Copyright(c) RIB Software GmbH
 */
import { IEvaluationGroupEntity } from './evaluation-group-entity.interface';
import {EvaluationGroupComplete} from './evaluation-group-complete.class';
import { IEvaluationSchemaEntity } from './evaluation-schema-entity.interface';
import { IEvaluationSchemaIconEntity } from './evaluation-schema-icon-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';

/**
 * Represents an evaluationschemacomplete object.
 */
export class EvaluationSchemaComplete implements CompleteIdentification<IEvaluationSchemaEntity>{

	/**
	 * ActivityPlanningChange
	 */
	public ActivityPlanningChange?: object | null = [];
  
	/**
	 * EntitiesCount
	 */
	public EntitiesCount!: number;
  
	/**
	 * EvaluationSchema
	 */
	public EvaluationSchema?: IEvaluationSchemaEntity | null;
  
	/**
	 * EvaluationSchemaIconToDelete
	 */
	public EvaluationSchemaIconToDelete?: IEvaluationSchemaIconEntity[] | null = [];
  
	/**
	 * EvaluationSchemaIconToSave
	 */
	public EvaluationSchemaIconToSave?: IEvaluationSchemaIconEntity[] | null = [];
  
	/**
	 * EvaluationSchemas
	 */
	public EvaluationSchemas?: IEvaluationSchemaEntity[] | null = [];
  
	/**
	 * GroupToDelete
	 */
	public GroupToDelete?: IEvaluationGroupEntity[] | null = [];
  
	/**
	 * GroupToSave
	 */
	public GroupToSave?: EvaluationGroupComplete[] | null = [];
  
	/**
	 * MainItemId
	 */
	public MainItemId!: number;
  }
