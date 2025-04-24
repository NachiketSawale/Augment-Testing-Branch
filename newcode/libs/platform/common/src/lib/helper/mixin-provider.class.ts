interface IHasPrototype {
	prototype: unknown
}
export class MixinProvider {

	/**
	 * Composites several ts types to a derived type
	 * @param derivedCtor
	 * @param constructors
	 */
	public applyMixinsFn(derivedCtor: IHasPrototype, constructors: IHasPrototype[]) {
		constructors.forEach((baseCtor) => {
			Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
				Object.defineProperty(
					derivedCtor.prototype,
					name,
					Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
					Object.create(null)
				);
			});
		});
	}
}