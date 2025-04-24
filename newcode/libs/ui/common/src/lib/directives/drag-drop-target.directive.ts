/*
 * Copyright(c) RIB Software GmbH
 */

import { Directive, ElementRef, HostListener, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DragDropActionType, IDragDropState, IDragDropTarget, PlatformDragDropService } from '@libs/platform/common';
import { Subscription } from 'rxjs';

@Directive({
	selector: '[uiCommonDragDropTarget]',
})
export class DragDropTargetDirective<T extends object> implements OnInit, OnDestroy {

	private platformDragDropService = inject(PlatformDragDropService);

	private dragDropTarget!: IDragDropTarget<T>;

	private dragIndicator: HTMLElement | null = null;

	private dragStateChangedSubscription: Subscription | null = null;

	public constructor(private elementRef: ElementRef, private renderer: Renderer2) {
	}

	public setDragDropTarget(dragDropTarget: IDragDropTarget<T>): void {
		this.dragDropTarget = dragDropTarget;
	}

	@HostListener('mouseenter', ['$event'])
	private onMouseEnter(event: MouseEvent) {
		this.platformDragDropService.mouseEnterTarget(this.dragDropTarget);
	}

	@HostListener('mouseleave', ['$event'])
	private onMouseLeave(event: MouseEvent) {
		this.platformDragDropService.mouseLeaveTarget();
	}

	@HostListener('document:mousemove', ['$event'])
	private onMouseMove(event: MouseEvent) {
		if (this.dragIndicator) {
			this.dragIndicator.style.left = (event.clientX + 5) + 'px';
			this.dragIndicator.style.top = (event.clientY + 5) + 'px';
		}
	}

	@HostListener('document:keydown', ['$event'])
	private onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Control') {
			this.platformDragDropService.updatePreferredAction([DragDropActionType.Copy, true]);
		}
	}

	@HostListener('document:keyup', ['$event'])
	private onKeyUp(event: KeyboardEvent) {
		if (event.key === 'Control') {
			this.platformDragDropService.updatePreferredAction([DragDropActionType.Copy, false]);
		}
	}

	private onDragStateChanged(state: IDragDropState<object, object>) {

		// If this dragDropTarget directive is not related to currentDragInfo, no further action needed.
		if (state.currentDragInfo?.type != this.dragDropTarget?.id && this.dragIndicator == null) {
			return;
		}

		this.handleDragIndicator(state);
	}

	private handleDragIndicator(state: IDragDropState<object, object>) {

		// Show/ hide drag indicator
		this.toggleDragIndicator(state, state.isDragging);

		// Deal with the icon and background color
		if (this.dragIndicator) {
			const indicatorChild = this.dragIndicator.querySelector('#dragIndicator');
			if (state.canDrop && state.currentAction) {
				this.renderer.addClass(indicatorChild, 'valid');
			} else {
				this.renderer.removeClass(indicatorChild, 'valid');
			}
			const operation = this.dragIndicator.querySelector('#operation');
			if (operation) {
				operation.className = '';
				this.renderer.addClass(operation, 'control-icons');
				this.renderer.addClass(operation, (state.canDrop && state.currentAction ? state.currentAction.iconClass : 'ico-drag-not-allowed'));
			}
		}
	}

	private toggleDragIndicator(state: IDragDropState<object, object>, show: boolean) {
		if (show) {
			if (this.dragIndicator == null) {
				this.createDragIndicator(state);
			}
		} else {
			if (this.dragIndicator) {
				const bodyEl = document.body;
				this.renderer.removeChild(bodyEl, this.dragIndicator);
				this.renderer.removeClass(bodyEl, 'dragging');
				this.dragIndicator = null;
			}
		}
	}

	private createDragIndicator(state: IDragDropState<object, object>) {

		// Create a new div element for the newIndicator
		const newIndicator = this.renderer.createElement('div');

		// Set the inner HTML
		const htmlString = '<div id="dragIndicator"><div id="operation"></div><div id="separator"></div><div id="contentArea"><div><div id="content"></div></div></div></div>';
		this.renderer.setProperty(newIndicator, 'innerHTML', htmlString);

		// Set text
		newIndicator.querySelector('#content').textContent = state.currentText;

		// Append to body
		this.renderer.appendChild(document.body, newIndicator);

		// Set newIndicator(ng-content) position to absolute
		this.renderer.setStyle(newIndicator, 'position', 'absolute');

		// Set body class to dragging
		this.renderer.addClass(document.body, 'dragging');
		this.dragIndicator = newIndicator;
	}

	public ngOnInit() {
		this.dragStateChangedSubscription = this.platformDragDropService.registerDragStateChanged(
			(state) => {
				this.onDragStateChanged(state);
			});
	}

	public ngOnDestroy() {
		if (this.dragStateChangedSubscription) {
			this.platformDragDropService.unregisterDragStateChanged(this.dragStateChangedSubscription);
		}
	}
}