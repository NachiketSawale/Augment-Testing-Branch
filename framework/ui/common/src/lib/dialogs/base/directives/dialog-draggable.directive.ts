/*
 * Copyright(c) RIB Software GmbH
 */

import { Directive, ElementRef } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

/**
 * Directive implements the drag and drop operations for modal dialog.
 */
@Directive({
	selector: '[uiCommonDialogDraggable]',
})
export class DialogDraggableDirective {
	/**
	 * Initial dialog X co-ordinate.
	 */
	private initialX: number = 0;

	/**
	 * Initial dialog Y co-ordinate.
	 */
	private initialY: number = 0;

	/**
	 * Current dialog X co-ordinate.
	 */
	private currentX: number = 0;

	/**
	 * Current dialog Y co-ordinate.
	 */
	private currentY: number = 0;

	/**
	 * Dialog Drag point element.
	 */
	private element!: HTMLElement;

	/**
	 * Parent element.
	 */
	private parentElement!: HTMLElement;

	/**
	 * Target element.
	 */
	private targetElement!: HTMLElement;

	/**
	 * Drag subscriptions.
	 */
	private subscriptions: Subscription[] = [];

	public constructor(private elementRef: ElementRef) {}

	/**
	 * This function initializes the drag operation when directive is instantiated.
	 */
	public ngOnInit(): void {
		this.element = <HTMLElement>this.elementRef.nativeElement;
		this.initDrag();
	}

	public ngAfterViewInit() {
		const element = document.getElementsByClassName('cdk-overlay-pane');
		this.parentElement = <HTMLElement>element.item(element.length - 1);
	}

	/**
	 * This function subscribes to three events mousedown,mousemove,mouseup for drag and drop operation.
	 */
	private initDrag(): void {
		const headerElement = this.elementRef.nativeElement.querySelector('.modal-header');
		const footerElement = this.elementRef.nativeElement.querySelector('.modal-footer');

		const arrayLikeTargets = {
			length: 2,
			0: headerElement,
			1: footerElement,
		};

		const dragStart: Observable<MouseEvent> = fromEvent<MouseEvent>(arrayLikeTargets, 'mousedown');
		const dragEnd: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mouseup');
		const drag: Observable<MouseEvent> = fromEvent<MouseEvent>(arrayLikeTargets, 'mousemove');
		let dragSub: Subscription;

		const dragStartSub = dragStart.subscribe((event: MouseEvent) => {
			this.targetElement = event.target as HTMLElement;
			this.targetElement.style.cursor = 'move';
			this.initialX = event.clientX - this.currentX;
			this.initialY = event.clientY - this.currentY;
			dragSub = drag.subscribe(($event: MouseEvent) => {
				event.preventDefault();
				this.currentX = $event.clientX - this.initialX;
				this.currentY = $event.clientY - this.initialY;
				this.parentElement.style.transform = 'translate(' + this.currentX + 'px, ' + this.currentY + 'px)';
			});
		});

		const dragEndSub = dragEnd.subscribe((event: MouseEvent) => {
			const eleStat = this.element.getBoundingClientRect();
			if (eleStat.x < 0 || eleStat.y < 0 || eleStat.x + eleStat.width > window.innerWidth || eleStat.y + eleStat.height > window.innerHeight) {
				this.parentElement.style.transform = 'translate(0px,0px)';
				this.currentX = 0;
				this.currentY = 0;
			}
			if (dragSub) {
				this.targetElement.style.cursor = 'context-menu';
				dragSub.unsubscribe();
			}
		});
		this.subscriptions.push(dragStartSub, dragEndSub);
	}

	/**
	 * Unsubscribed the mouseevents to avoid leak problems.
	 */
	public ngOnDestroy(): void {
		this.subscriptions.forEach((s) => s.unsubscribe());
	}
}
