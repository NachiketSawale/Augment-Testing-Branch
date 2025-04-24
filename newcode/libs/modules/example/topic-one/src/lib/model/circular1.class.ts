import { LazyInjectable, PlatformLazyInjectorService } from '@libs/platform/common';
import { Circular1Token, Circular2Token, ICircular1 } from '@libs/example/interfaces';
import { Injector } from '@angular/core';

@LazyInjectable({
	token: Circular1Token
})
export class Circular1 implements ICircular1 {

	public constructor(injector: Injector) {
		this.lazyInjector = injector.get(PlatformLazyInjectorService);
	}

	private readonly lazyInjector: PlatformLazyInjectorService;

	public test() {
		this.lazyInjector.inject(Circular2Token).then(c => c.outputOther());
	}

	public output() {
		console.log('Circular 1!');
	}
}