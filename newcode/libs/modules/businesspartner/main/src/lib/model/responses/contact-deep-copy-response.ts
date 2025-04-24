/*
 * Copyright(c) RIB Software GmbH
 */

import { IContactEntity, IContactPhotoEntity } from '@libs/businesspartner/interfaces';

export interface IContactDeepCopyResponse {
	Contact?: IContactEntity|null;
	ContactPhoto?:IContactPhotoEntity|null;
	ContactClerkIds?: number[]|null;
}
