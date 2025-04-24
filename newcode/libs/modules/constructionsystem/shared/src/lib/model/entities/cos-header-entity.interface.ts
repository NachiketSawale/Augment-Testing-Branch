/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosHeaderEntityGenerated } from './cos-header-entity-generated.interface';

export interface ICosHeaderEntity extends ICosHeaderEntityGenerated {
	IsChecked?: boolean;
	CosTemplateFk?: number | null;
}
