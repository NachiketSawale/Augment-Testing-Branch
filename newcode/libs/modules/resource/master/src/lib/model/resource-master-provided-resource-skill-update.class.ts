/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceMasterProvidedResourceSkillEntity, IResourceMasterProvidedSkillDocumentEntity } from '@libs/resource/interfaces';

export class ResourceMasterProvidedResourceSkillUpdate implements CompleteIdentification<IResourceMasterProvidedResourceSkillEntity> {
	public MainItemId: number = 0;
	public ProvidedSkills: IResourceMasterProvidedResourceSkillEntity | null = null;
	public ProvidedSkillDocumentsToSave: IResourceMasterProvidedSkillDocumentEntity[] | null = [];
	public ProvidedSkillDocumentsToDelete: IResourceMasterProvidedSkillDocumentEntity[] | null = [];
}