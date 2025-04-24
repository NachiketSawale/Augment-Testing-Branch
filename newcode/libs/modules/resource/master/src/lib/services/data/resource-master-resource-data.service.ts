/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMasterResourceDataGeneratedService } from './generated/resource-master-resource-data-generated.service';
import { inject, Injectable } from '@angular/core';
import { ResourceMasterResourceProcessor } from '../resource-master-resource-processor.class';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceMasterResourceDataService extends ResourceMasterResourceDataGeneratedService {
	private readonly configService = inject(PlatformConfigurationService);
	public constructor() {
		super();
		this.processor.addProcessor(new ResourceMasterResourceProcessor(this,this.configService));
	}
}