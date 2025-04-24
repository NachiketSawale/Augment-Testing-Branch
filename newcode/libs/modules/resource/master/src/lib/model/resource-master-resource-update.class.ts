/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMasterProvidedResourceSkillUpdate } from './resource-master-provided-resource-skill-update.class';
import { CompleteIdentification } from '@libs/platform/common';
import {
	IResourceMasterPhotoEntity,
	IResourceMasterPoolEntity,
	IResourceMasterProvidedResourceSkillEntity,
	IResourceMasterRequiredResourceSkillEntity,
	IResourceMasterResourceEntity,
	IResourceMasterResourcePartEntity,
	IResourceMasterResResource2mdcContextEntity
} from '@libs/resource/interfaces';

export class ResourceMasterResourceUpdate implements CompleteIdentification<IResourceMasterResourceEntity> {
	public MainItemId: number = 0;
	public ResourceDtos: IResourceMasterResourceEntity[] | null = [];
	public PhotosToSave: IResourceMasterPhotoEntity[] | null = [];
	public PhotosToDelete: IResourceMasterPhotoEntity[] | null = [];
	public PoolsToSave: IResourceMasterPoolEntity[] | null = [];
	public PoolsToDelete: IResourceMasterPoolEntity[] | null = [];
	public ResResource2mdcContextsToSave: IResourceMasterResResource2mdcContextEntity[] | null = [];
	public ResResource2mdcContextsToDelete: IResourceMasterResResource2mdcContextEntity[] | null = [];
	public ProvidedSkillsToSave: ResourceMasterProvidedResourceSkillUpdate[] | null = [];
	public ProvidedSkillsToDelete: IResourceMasterProvidedResourceSkillEntity[] | null = [];
	public RequiredSkillsToSave: IResourceMasterRequiredResourceSkillEntity[] | null = [];
	public RequiredSkillsToDelete: IResourceMasterRequiredResourceSkillEntity[] | null = [];
	public PartsToSave: IResourceMasterResourcePartEntity[] | null = [];
	public PartsToDelete: IResourceMasterResourcePartEntity[] | null = [];
}