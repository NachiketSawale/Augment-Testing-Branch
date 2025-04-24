/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllowanceConfigEntity } from './est-allowance-config-entity.interface';
import { IEstAllowanceConfigTypeEntity } from './est-allowance-config-type-entity.interface';
import { IEstColumnConfigEntity } from './est-column-config-entity.interface';
import { IEstColumnConfigTypeEntity } from './est-column-config-type-entity.interface';
import { IEstConfigTypeEntity } from './est-config-type-entity.interface';
import { IEstCopyOptionEntity } from './est-copy-option-entity.interface';
import { IEstStructureConfigEntity } from './est-structure-config-entity.interface';
import { IEstStructureTypeEntity } from './est-structure-type-entity.interface';
import { IEstTotalsConfigEntity } from './est-totals-config-entity.interface';
import { IEstTotalsConfigTypeEntity } from './est-totals-config-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstConfigEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstAllowanceConfigEntity
 */
  EstAllowanceConfigEntity?: IEstAllowanceConfigEntity | null;

/*
 * EstAllowanceConfigFk
 */
  EstAllowanceConfigFk?: number | null;

/*
 * EstAllowanceConfigTypeEntity
 */
  EstAllowanceConfigTypeEntity?: IEstAllowanceConfigTypeEntity | null;

/*
 * EstAllowanceConfigTypeFk
 */
  EstAllowanceConfigTypeFk?: number | null;

/*
 * EstColumnConfigEntity
 */
  EstColumnConfigEntity?: IEstColumnConfigEntity | null;

/*
 * EstColumnConfigFk
 */
  EstColumnConfigFk?: number | null;

/*
 * EstColumnConfigTypeEntity
 */
  EstColumnConfigTypeEntity?: IEstColumnConfigTypeEntity | null;

/*
 * EstColumnConfigTypeFk
 */
  EstColumnConfigTypeFk?: number | null;

/*
 * EstConfigTypeEntities
 */
  EstConfigTypeEntities?: IEstConfigTypeEntity[] | null;

/*
 * EstCopyOptionEntity
 */
  EstCopyOptionEntity?: IEstCopyOptionEntity | null;

/*
 * EstCopyOptionFk
 */
  EstCopyOptionFk?: number | null;

/*
 * EstCostBudgetConfigFk
 */
  EstCostBudgetConfigFk?: number | null;

/*
 * EstCostBudgetTypeFk
 */
  EstCostBudgetTypeFk?: number | null;

/*
 * EstHeaderEntities
 */
  EstHeaderEntities?: IEstHeaderEntity[] | null;

/*
 * EstRootAssignmentTypeFk
 */
  EstRootAssignmentTypeFk?: number | null;

/*
 * EstRoundingConfigFk
 */
  EstRoundingConfigFk?: number | null;

/*
 * EstRoundingConfigTypeFk
 */
  EstRoundingConfigTypeFk?: number | null;

/*
 * EstStructureConfigEntity
 */
  EstStructureConfigEntity?: IEstStructureConfigEntity | null;

/*
 * EstStructureConfigFk
 */
  EstStructureConfigFk?: number | null;

/*
 * EstStructureTypeEntity
 */
  EstStructureTypeEntity?: IEstStructureTypeEntity | null;

/*
 * EstStructureTypeFk
 */
  EstStructureTypeFk?: number | null;

/*
 * EstTotalsconfigEntity
 */
  EstTotalsconfigEntity?: IEstTotalsConfigEntity | null;

/*
 * EstTotalsconfigFk
 */
  EstTotalsconfigFk?: number | null;

/*
 * EstTotalsconfigtypeEntity
 */
  EstTotalsconfigtypeEntity?: IEstTotalsConfigTypeEntity | null;

/*
 * EstTotalsconfigtypeFk
 */
  EstTotalsconfigtypeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsColumnConfig
 */
  IsColumnConfig?: boolean | null;

/*
 * WicCatFk
 */
  WicCatFk?: number | null;
}
