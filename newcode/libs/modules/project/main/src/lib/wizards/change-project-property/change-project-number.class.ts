/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from '@libs/project/interfaces';
import { CoreProjectProperties } from './core-project-properties.class';

export class ChangeProjectNumber extends CoreProjectProperties {
	public NewNumber?: string;

	public constructor(project: IProjectEntity) {
		super(project);
		this.NewNumber = '';
	}
}
