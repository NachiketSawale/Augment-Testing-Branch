/*
 * Copyright(c) RIB Software GmbH
 */

// import { IAudColumnEntity } from './aud-column-entity.interface';
// import { IAudContainer2AudTableEntity } from './aud-container-2aud-table-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IAudContainerEntityGenerated extends IEntityBase {

/*
 * AudColumnToSave
 */
  // AudColumnToSave?: IAudColumnEntity[] | null;

/*
 * AudContainer2AudTableEntities
 */
  // AudContainer2AudTableEntities?: IAudContainer2AudTableEntity[] | null;

/*
 * Checked
 */
  Checked?: boolean | null;

/*
 * ContainerUuid
 */
  ContainerUuid?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * Module
 */
  Module?: string | null;

/*
 * Tablename
 */
  Tablename?: string | null;

/*
 * Title
 */
  Title?: string | null;
}
