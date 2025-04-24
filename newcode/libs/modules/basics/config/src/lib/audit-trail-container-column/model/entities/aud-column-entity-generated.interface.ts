/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

// import { IAudEntitydependencyEntity } from './aud-entitydependency-entity.interface';
// import { IAudObjectFkDetailsEntity } from './aud-object-fk-details-entity.interface';
// import { IAudTableEntity } from './aud-table-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IAudColumnEntityGenerated extends IEntityBase {

/*
 * AudEntitydependencyEntities
 */
  // AudEntitydependencyEntities?: IAudEntitydependencyEntity[] | null;

/*
 * AudEntitydependencyEntities_ObjectFkAudColumnFk
 */
  // AudEntitydependencyEntities_ObjectFkAudColumnFk?: IAudEntitydependencyEntity[] | null;

/*
 * AudObjectFkDetailsEntities_LeftTableAudColumnFk
 */
  // AudObjectFkDetailsEntities_LeftTableAudColumnFk?: IAudObjectFkDetailsEntity[] | null;

/*
 * AudObjectFkDetailsEntities_ObjectFkAudColumnFk
 */
  // AudObjectFkDetailsEntities_ObjectFkAudColumnFk?: IAudObjectFkDetailsEntity[] | null;

/*
 * AudObjectFkDetailsEntities_RightTableAudColumnFk
 */
  // AudObjectFkDetailsEntities_RightTableAudColumnFk?: IAudObjectFkDetailsEntity[] | null;

/*
 * AudTableEntity
 */
  // AudTableEntity?: IAudTableEntity | null;

/*
 * AudTableFk
 */
  AudTableFk?: number | null;

/*
 * Columnname
 */
  Columnname?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * Isdeleted
 */
  Isdeleted?: boolean | null;

/*
 * Isenabletracking
 */
  Isenabletracking?: boolean | null;
}
