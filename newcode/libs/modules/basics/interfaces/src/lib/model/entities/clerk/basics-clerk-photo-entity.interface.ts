/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsClerkEntity } from './basics-clerk-entity.interface';
import { IBasicsClerkBlobsEntity } from './basics-clerk-blob-entity-interface';


export interface IBasicsClerkPhotoEntity{
	Base64String?: string;
	BlobId?: number;
	ClerkDto?: IBasicsClerkEntity;
	Blob?: IBasicsClerkBlobsEntity | null;
}
