/*
 * Copyright(c) RIB Software GmbH
 */

import { ICharacteristicDataEntity, ICharacteristicEntity } from '@libs/basics/interfaces';

export interface ICharacteristicCodeLookupOptions {
	sectionId: number;
	entityListFilter?: () => ICharacteristicDataEntity[];
	selectionExceptFirstHandle?: (selectionExceptFirst: ICharacteristicEntity[]) => void;
}
