/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject, Subscription } from 'rxjs';
import { IDraggedDataInfo } from '../interfaces/dragged-data-info.interface';
import { IDragDropTarget } from '../interfaces/drag-drop-target.interface';
import { inject, Injectable } from '@angular/core';
import { IDragDropAction } from '../interfaces/drag-drop-action.interface';
import { remove } from 'lodash';
import { IDragDropState } from '../interfaces/drag-drop-state-info.interface';
import { PlatformTranslateService } from './platform-translate.service';
import { DragDropBase } from '../model/drag-drop/drag-drop-base.class';
import { DragDropActionType } from '../utils/model/drag-drop-action-type.enum';

@Injectable({
	providedIn: 'root',
})
export class PlatformDragDropService {

	private readonly translateService = inject(PlatformTranslateService);

	private dragStateChanged$ = new Subject<IDragDropState<object, object>>();
	private state: IDragDropState<object, object>;
	public actions: IDragDropAction[] = [
		{
			type: DragDropActionType.Move,
			priority: 1,
			iconClass: 'ico-drag-move',
		},
		{
			type: DragDropActionType.Copy,
			priority: 2,
			iconClass: 'ico-drag-copy',
		},
		{
			type: DragDropActionType.Link,
			priority: 3,
			iconClass: 'ico-drag-link',
		}
	];
	private dragDropBases: DragDropBase<object>[] = [];

	/**
	 * Constructor
	 */
	public constructor() {
		this.state = {
			currentTarget: null,
			currentDragInfo: null,
			canDrop: false,
			currentAction: null,
			currentText: null,
			preferredActions: {
				[DragDropActionType.Move]: false,
				[DragDropActionType.Copy]: false,
				[DragDropActionType.Link]: false,
			},
			isDragging: false,
			sourceId: undefined
		};
	}

	public registerDragDropBase(dDBase: DragDropBase<object>) {
		if (this.getDragDropBase(dDBase.type)) {
			console.warn('DragDropBase is registered more than one time, please check again registerDragDropBase(). Container Uuid: ' + dDBase.type);
			return;
		}
		this.dragDropBases.push(dDBase);
	}

	public unregisterDragDropBase(dDBase: DragDropBase<object>) {
		this.dragDropBases = remove(this.dragDropBases, dDBase);
	}

	private getDragDropBase(type: string): DragDropBase<object> | null {
		const dDBase = this.dragDropBases.filter(b => b.type === type);
		if (!dDBase || dDBase.length === 0) {
			return null;
		} else if (dDBase.length > 1) {
			throw new Error('Incorrect drag drop base found!');
		}

		return dDBase[0];
	}

	private getSourceContainer(): DragDropBase<object> | null {
		if (this.state.currentDragInfo) {
			return this.getDragDropBase(this.state.currentDragInfo.type);
		}
		return null;
	}

	/**
	 * @name mouseEnterTarget
	 * @description Notifies the service that the cursor has entered a drop target.
	 * @param dropTarget The target object of the element.
	 */
	public mouseEnterTarget(dropTarget: IDragDropTarget<object>) {
		this.state.currentTarget = dropTarget;
		if (this.state.currentDragInfo) {
			this.updateCanDrop(false);
		}
	}

	/**
	 * @name mouseLeaveTarget
	 * @description Notifies the service that the cursor has left a drop target.
	 */
	public mouseLeaveTarget() {
		this.state.currentTarget = null;
		if (this.state.currentDragInfo) {
			this.updateCanDrop(true);
		}
	}

	/**
	 * @name currentTargetDataChanged
	 * @description Notifies the service that the cursor has hovered to a new data
	 * within the drop target.
	 * @param newData The drop target object.
	 */
	public currentTargetDataChanged(newData: object[] | null) {
		if(this.state.currentTarget){
			const forceUpdate = this.state.currentTarget.data !== newData;
			this.state.currentTarget.data = newData ?? [];
			if (this.state.currentDragInfo) {
				this.updateCanDrop(forceUpdate);
			}
		}
	}

	/**
	 * @name isOnTarget
	 * @description Evaluates whether the cursor is currently hovering over a drag-drop-target.
	 */
	public isOnTarget() {
		return !!this.state.currentTarget;
	}

	/**
	 * @name isDragging
	 * @description Evaluates whether the mouse is currently dragging data.
	 */
	public isDragging() {
		return !!this.state.currentDragInfo;
	}

	/**
	 * @name updateCanDrop
	 * @description Updates whether the currently dragged data can be dropped at the current location by
	 * requesting the value from the current drop target, if the cursor is in an appropriate
	 * position, and fires a drag state change event.
	 * @param forceUpdate force update drag state
	 */
	private updateCanDrop(forceUpdate: boolean) {
		let needsUpdate = false;
		if (this.state.currentDragInfo) {
			if (this.state.currentTarget) {
				const newCanDrop = this.retrieveCanDrop();

				if (newCanDrop !== this.state.canDrop) {
					this.state.canDrop = newCanDrop;
					needsUpdate = true;
				}
				const newAction = this.retrieveAction();
				if (newAction != this.state.currentAction) {
					this.state.currentAction = newAction ?? null;
					this.state.canDrop = this.state.canDrop && !!newAction;
					needsUpdate = true;
				}
			} else {
				this.state.canDrop = false;
				needsUpdate = false;
			}
		}
		if (needsUpdate || forceUpdate) {
			this.updateDragState();
		}
	}

	/**
	 * @name retrieveCanDrop
	 * @description Retrieves a value that indicates whether the current drop target accepts the currently dragged data.
	 * @returns indicates whether the currently dragged data can be dropped at the current location of the cursor.
	 */
	private retrieveCanDrop(): boolean {
		if (this.state.currentDragInfo && this.state.currentTarget) {
			const dragDropBase = this.getDragDropBase(this.state.currentTarget.id);
			if (dragDropBase) {
				return dragDropBase.canDrop(this.state.currentDragInfo, this.state.currentTarget);
			}
		}
		return false;
	}

	/**
	 * @name updateDragState
	 * @description  trigger the drag state changed event and passes an object that contains some information about the event.
	 */
	private updateDragState() {
		const state = {
			...this.state,
			isDragging: this.isDragging(),
			sourceId: this.state.currentDragInfo?.type || '0000000000000000000000000000000',
		};
		this.emitDragStateChanged(state);
	}

	/**
	 * @name retrieveAction
	 * @description Retrieves the currently chosen drag action.
	 */
	private retrieveAction(): IDragDropAction | null {
		if (this.state.currentDragInfo && this.state.currentTarget) {

			const dragDropBase = this.getDragDropBase(this.state.currentTarget.id);
			if (dragDropBase) {
				const dragDropConnection = dragDropBase.dragDropConnections.find(c =>
					c.sourceType === this.state.currentDragInfo?.type && c.targetType === this.state.currentTarget?.id);
				if (dragDropConnection) {
					let allowedActionTypes = dragDropConnection.allowedActionTypes(this.state.currentDragInfo);
					if (!allowedActionTypes || allowedActionTypes.length === 0) {
						return null;
					}
					const anyPreferredActionEnabled = Object.values(this.state.preferredActions).some(value => value === true);

					if (anyPreferredActionEnabled) {
						allowedActionTypes = allowedActionTypes.filter(aa => this.state.preferredActions[aa] === true);
					}
					//allowedActionTypes = allowedActionTypes.filter(aa => this.state.preferredActions[aa]);
					if (!allowedActionTypes || allowedActionTypes.length === 0) {
						return null;
					}
					const allowedAction = this.actions.filter(a => allowedActionTypes.includes(a.type));
					if (allowedAction.length === 1) {
						return allowedAction[0];
					} else {
						// Get the highest priority (the smallest number)
						return allowedAction.reduce((prev, current) => {
							return current.priority < prev.priority ? current : prev;
						});
					}
				}
			}
		}

		return null;
	}

	/**
	 * Update preferred action for state
	 * @param info
	 */
	public updatePreferredAction(info: [DragDropActionType, boolean]) {
		const [action, value] = info;
		if (this.state.preferredActions[action] !== value) {
			this.state.preferredActions[action] = value;
			this.updateCanDrop(true);
		}
	}

	/**
	 * @name endDrag to end a drag operation
	 */
	public endDrag(): void {
		if (this.state.currentDragInfo && this.state.currentTarget) {
			this.updateCanDrop(false);

			if (this.state.canDrop) {
				const dragDropBase = this.getDragDropBase(this.state.currentTarget.id);
				if (dragDropBase) {
					dragDropBase.drop(this.state.currentDragInfo, this.state.currentTarget);
				}
			}

		}
		// clean up the current drag information and then update the drag state
		this.state.currentDragInfo = null;
		this.updateDragState();
	}

	/**
	 * @name startDrag to start a drag operation
	 * @description Retrieves the currently chosen drag action.
	 * @param draggedData the info of the current dragged item
	 */
	public startDrag(draggedData: IDraggedDataInfo<object>): void {
		if (!this.state.currentTarget) {
			throw new Error('The mouse cursor does not appear to be hovering over any allowable source location.');
		}

		let canDragObject = false;
		const dragDropBase = this.getDragDropBase(this.state.currentTarget.id);
		if (dragDropBase) {
			canDragObject = dragDropBase.canDrag(draggedData);
		}
		if (canDragObject) {
			this.state.currentDragInfo = draggedData;

			const sourceContainer = this.getSourceContainer();
			if (sourceContainer) {
				// Set custom text or default text which is defined at the module level via dragDropTextInfo method.
				const textInfo = sourceContainer.dragDropTextInfo(draggedData);
				this.setDraggedText(textInfo);
			}

			this.updateCanDrop(true);
		}
	}

	/**
	 * @name setDraggedText
	 * @description Updates the text displayed along with the cursor while a drag-and-drop operation is in progress.
	 * @param textInfo An object that specifies some information about the displayed text.
	 */
	public setDraggedText(textInfo: string | number | { text: string; number?: number }): void {
		let text: string | null = null;
		let count: number | null = null;

		if (typeof textInfo === 'string') {
			text = textInfo;
		} else if (typeof textInfo === 'number') {
			count = textInfo;
		} else if (typeof textInfo === 'object' && textInfo !== null) {
			text = textInfo.text;
			count = textInfo.number ?? null;
		}

		let result: string;

		if (text) {
			if (count !== null) {
				result = this.translateService.instant(text, {count}).text;
			} else {
				result = this.translateService.instant(text).text;
			}
		} else {
			if (count !== null) {
				result = this.translateService.instant('platform.dragdrop.items', {count}).text;
			} else {
				result = this.translateService.instant('platform.dragdrop.anyData').text;
			}
		}

		this.state.currentText = result;
	}

	/**
	 * @name registerDragStateChanged
	 * @description Registers an event handler to be called when the drag state changes.
	 * The handler will be invoked with the new drag state information whenever the drag state changes.
	 * @param handler The callback function to be called when the drag state changes.
	 * This function receives an object of type `IDragDropState<S, T>` which contains the details of the current dragdrop state.
	 */
	public registerDragStateChanged(handler: (stateInfo: IDragDropState<object, object>) => void): Subscription {
		return this.dragStateChanged$.subscribe(handler);
	}

	/**
	 * Emits a drag state change event with the provided information.
	 * This will notify all registered handlers of the updated drag state.
	 * @param stateInfo - The updated drag state information including whether dragging is in progress,
	 * if dropping is allowed, the current drag action, the dragged data, and the source ID.
	 */
	private emitDragStateChanged(stateInfo: IDragDropState<object, object>): void {
		this.dragStateChanged$.next(stateInfo);
	}

	/**
	 * @name unregisterDragStateChanged
	 * @description Unregisters an event handler for an event that is fired when the drag state has changed.
	 */
	public unregisterDragStateChanged(subscription: Subscription): void {
		subscription.unsubscribe();
	}
}


