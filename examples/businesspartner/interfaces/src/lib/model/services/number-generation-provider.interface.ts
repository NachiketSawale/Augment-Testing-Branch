import { LazyInjectionToken } from '@libs/platform/common';

export const NUMBER_GENERATION_PROVIDER = new LazyInjectionToken<INumberGenerationProvider>('number-generation-provider');

export interface INumberGenerationProvider {
	hasToGenerateForRubricCategory(rubricCateId: number): boolean;
}
