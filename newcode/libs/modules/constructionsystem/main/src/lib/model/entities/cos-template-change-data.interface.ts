/*
 * Copyright(c) RIB Software GmbH
 */
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';

export interface ICosTemplateChangeData {
	/**
	 * template id
	 */
	Id: number;
	/**
	 * instance entity
	 */
	entity: ICosInstanceEntity;
}
