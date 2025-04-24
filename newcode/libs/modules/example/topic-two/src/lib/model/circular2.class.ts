import { LazyInjectable, PlatformLazyInjectorService } from '@libs/platform/common';
import { Circular1Token, Circular2Token, ICircular2 } from '@libs/example/interfaces';
import { Injector } from '@angular/core';

@LazyInjectable({
	token: Circular2Token
})
export class Circular2 implements ICircular2 {

	public constructor(injector: Injector) {
		this.lazyInjector = injector.get(PlatformLazyInjectorService);
	}

	private readonly lazyInjector: PlatformLazyInjectorService;

	public test() {
		this.lazyInjector.inject(Circular1Token).then(c => c.output());
	}

	public outputOther() {
		console.log('Circular 2!');
	}
}