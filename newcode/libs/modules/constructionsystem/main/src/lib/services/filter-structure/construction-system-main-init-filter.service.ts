/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

/**
 * a base service to init leading structure grid controller and data service.
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInitFilterService {
	private currentSelectedEstimateHeaderId?: number;

	public setEstHeaderId(estHeaderId?: number, projectId?: number) {
		if (!!estHeaderId && this.currentSelectedEstimateHeaderId !== estHeaderId) {
			this.currentSelectedEstimateHeaderId = estHeaderId;
			// estimateParameterFormatterService.setSelectedEstHeaderNProject(estHeaderId, projectId);
		}
	}
}
