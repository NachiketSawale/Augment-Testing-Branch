import { Injectable } from '@angular/core';
import { EstimateCommonCreationService } from '@libs/estimate/common';


@Injectable({
	providedIn: 'root'
})
export class EstimateAssembliesCreationService extends EstimateCommonCreationService{
	public constructor() {
		super();
	}
}