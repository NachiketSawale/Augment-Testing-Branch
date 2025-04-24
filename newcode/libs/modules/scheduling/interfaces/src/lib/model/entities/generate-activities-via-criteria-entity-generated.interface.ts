/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICriteria1Entity } from './criteria-1entity.interface';

export interface IGenerateActivitiesViaCriteriaEntityGenerated {

/*
 * CreateRelations
 */
  CreateRelations?: boolean | null;

/*
 * Criteria1
 */
  Criteria1?: ICriteria1Entity | null;

/*
 * Criteria2
 */
  Criteria2?: number | null;

/*
 * EstimateId
 */
  EstimateId?: number | null;

/*
 * FreeSchedule
 */
  FreeSchedule?: boolean | null;

/*
 * GenerationMode
 */
  GenerationMode?: number | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;

/*
 * RelationKind
 */
  RelationKind?: number | null;
}
