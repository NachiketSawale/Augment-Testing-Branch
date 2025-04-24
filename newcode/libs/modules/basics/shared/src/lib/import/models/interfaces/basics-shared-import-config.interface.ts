import { BasicsSharedImportModel } from '../types/basics-shared-import-model.type';

export interface IPageSkip<TCustom extends object> {
	/**
	 * skip page or not
	 */
	skip?: boolean | ((model: BasicsSharedImportModel<TCustom>) => boolean);
}

export interface ICanExecuteNext<T, U = void> {
	/**
	 * false: next button will grey out.
	 */
	canExecuteNext?: ((input1: T, input2?: U) => boolean);
}
