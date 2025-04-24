/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { projectDropPointEntityInfoGenerated } from './generated/project-drop-point-entity-info-generated.model';
import { IProjectDropPointEntity } from '@libs/project/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const projectDropPointEntityInfo = <Partial<IEntityInfo<IProjectDropPointEntity>>>{};
export const PROJECT_DROP_POINT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(projectDropPointEntityInfoGenerated,projectDropPointEntityInfo));