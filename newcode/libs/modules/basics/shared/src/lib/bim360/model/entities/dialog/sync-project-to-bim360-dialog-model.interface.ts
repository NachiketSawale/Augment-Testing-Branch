/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from '@libs/project/interfaces';
import { IBasicsBim360InitProjectDataRequestEntity } from '../request/bim360-init-project-data-request-entity.interface';

export interface IBasicsSyncProjectToBim360DialogModel {
	/**
	 * Select project in RIB 4.0
	 */
	projectData?: IProjectEntity | null;
	StartDate?: string;
	EndDate?: string;

	paramsInfo?: IBasicsBim360InitProjectDataRequestEntity | null;

	/**
	 * project type.
	 */
	projectTypeId?: string;

	languageId?: string;

	projectTemplateId?: string;

	assignProjectAdminId?: string;

	activeServiceIds: string[];
}
