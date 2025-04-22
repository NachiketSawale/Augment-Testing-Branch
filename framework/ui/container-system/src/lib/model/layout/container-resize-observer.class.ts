/*
 * Copyright(c) RIB Software GmbH
 */

import { IResizeArgs, IResizeHandler, IResizeMessenger } from '@libs/ui/common';

/**
 * Represents the container resize observer.
 */
export class ContainerResizeObserver implements IResizeMessenger, IResizeHandler {
	private handlers: ((args: IResizeArgs) => void)[] = [];

	/**
	 * Execute all the size changed handlers.
	 * @param args
	 */
	public execute(args: IResizeArgs): void {
		this.handlers.forEach(handler => {
			handler(args);
		});
	}

	/**
	 * Register size changed handler.
	 * @param handler
	 */
	public register(handler: (args: IResizeArgs) => void): void {
		this.handlers.push(handler);
	}

	/**
	 * Unregister size changed handler.
	 * @param handler
	 */
	public unregister(handler: (args: IResizeArgs) => void): void {
		for (let i = this.handlers.length - 1; i >= 0; i--) {
			if (handler === this.handlers[i]) {
				this.handlers.splice(i, 1);
			}
		}
	}
}