import { inject, Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { INumberGenerationProvider, NUMBER_GENERATION_PROVIDER } from '@libs/businesspartner/interfaces';
import { BusinesspartnerCommonNumberGenerationService } from '../number-generation.service';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<INumberGenerationProvider>({
	token: NUMBER_GENERATION_PROVIDER,
	useAngularInjection: true,
})
export class NumberGenerationProviderService implements INumberGenerationProvider {
	private numberGenerationService = inject(BusinesspartnerCommonNumberGenerationService);

	public hasToGenerateForRubricCategory(rubricCateId: number): boolean {
		return this.numberGenerationService.hasToGenerateForRubricCategory(rubricCateId);
	}
}
