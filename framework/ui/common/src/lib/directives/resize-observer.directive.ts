/*
 * Copyright(c) RIB Software GmbH
 */

import { DestroyRef, Directive, ElementRef, inject, Input, NgZone, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IResizeOptions } from '../model/resize-observer/resize-options.interface';
import { IResizeSize } from '../model/resize-observer/resize-size.interface';

@Directive({
	selector: '[uiCommonResizeObserver]',
})
/**
 * Represents a resize observe directive.
 */
export class ResizeObserverDirective implements OnInit {
	private resizeObserver: ResizeObserver;
	private resizeSize?: IResizeSize;

	private debounce = 10;
	private ngZone = inject(NgZone);
	private destroyRef = inject(DestroyRef);
	private sizeChanged = new Subject<ResizeObserverEntry[]>();

	/**
	 * Initialize resize observer.
	 * @param elementRef
	 */
	public constructor(private elementRef: ElementRef) {
		this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
			this.sizeChanged.next(entries);
		});
	}

	@Input({alias: 'uiCommonResizeObserver', required: true})
	public resizeOptions!: IResizeOptions;

	private getElementSize(entries: ResizeObserverEntry[]): IResizeSize {
		return {
			width: entries[0].contentRect.width,
			height: entries[0].contentRect.height
		};
	}

	private executeHandler(entries: ResizeObserverEntry[]) {
		const oldValue = this.resizeSize;
		const newValue = this.getElementSize(entries);

		this.resizeSize = newValue;
		this.resizeOptions.handler.execute({
			oldValue: oldValue !== undefined ? oldValue : newValue,
			newValue: newValue
		});
	}

	/**
	 * Starts observe element's size.
	 */
	public ngOnInit() {
		this.resizeObserver.observe(this.elementRef.nativeElement, this.resizeOptions);

		this.destroyRef.onDestroy(() => {
			this.resizeObserver.unobserve(this.elementRef.nativeElement);
		});

		this.sizeChanged.pipe(
			debounceTime(this.resizeOptions.debounce ?? this.debounce),
			takeUntilDestroyed(this.destroyRef)
		).subscribe((entries: ResizeObserverEntry[]) => {
			this.ngZone.run(()=>{
				this.executeHandler(entries);
			});
		});
	}
}