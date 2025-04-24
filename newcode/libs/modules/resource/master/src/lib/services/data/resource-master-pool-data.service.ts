/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMasterPoolDataGeneratedService } from './generated/resource-master-pool-data-generated.service';
import { inject, Injectable } from '@angular/core';
import { ResourceMasterPoolResourceProcessor } from '../resource-master-pool-resource-processor.class';
import { ResourceMasterContextService } from '../resource-master-context.service';

@Injectable({
	providedIn: 'root'
})
export class ResourceMasterPoolDataService extends ResourceMasterPoolDataGeneratedService {
	private readonly resourceMasterContextService = inject(ResourceMasterContextService);
	public constructor() {
		super();
		this.processor.addProcessor(new ResourceMasterPoolResourceProcessor(this,this.resourceMasterContextService));
	}
}