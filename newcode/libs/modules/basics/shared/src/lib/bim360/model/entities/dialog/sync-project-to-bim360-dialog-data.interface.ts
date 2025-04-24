/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360SourceUserEntity } from '../basics-bim360-source-user-entity.interface';
import { IBasicsBim360SourceProjectEntity } from '../basics-bim360-source-project-entity.interface';
import { IBasicsBim360ParamSelectItem } from '../../../lookup/entities/basics-bim360-param-select-item.interface';

export interface IBasicsSyncProjectToBim360DialogData {
	usersItems?: IBasicsBim360ParamSelectItem[];
	projectTemplateItems?: IBasicsBim360ParamSelectItem[];

	usersItemsSource?: IBasicsBim360SourceUserEntity[];
	projectTemplateItemsSource?: IBasicsBim360SourceProjectEntity[];
}
