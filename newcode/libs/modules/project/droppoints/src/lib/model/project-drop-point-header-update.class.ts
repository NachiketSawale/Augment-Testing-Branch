/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IProjectDropPointArticlesEntity, IProjectDropPointEntity, IProjectEntity } from '@libs/project/interfaces';

export class ProjectDropPointHeaderUpdate implements CompleteIdentification<IProjectEntity> {
	public MainItemId: number = 0;
	public DropPointHeaders: IProjectEntity[] | null = [];
	public DropPointsToSave: IProjectDropPointEntity[] | null = [];
	public DropPointsToDelete: IProjectDropPointEntity[] | null = [];
	public DropPointArticlessToSave: IProjectDropPointArticlesEntity[] | null = [];
	public DropPointArticlessToDelete: IProjectDropPointArticlesEntity[] | null = [];
}