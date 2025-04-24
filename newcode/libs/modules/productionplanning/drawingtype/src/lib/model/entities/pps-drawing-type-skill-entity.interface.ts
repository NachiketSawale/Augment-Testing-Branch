/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IPpsDrawingTypeSkillEntity extends IEntityBase {
    Id: number;
    EngDrawingTypeFk: number;
    ResSkillFk: number;
    CommentText: string;
}