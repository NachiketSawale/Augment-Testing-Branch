/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList, EventEmitter, ViewEncapsulation, NgZone } from '@angular/core';
import { Observable, Subscriber, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IArea, IPoint, ISplitSnapshot, IAreaSnapshot, IOutputData, IOutputAreaSizes, IDefaultOptions } from '../model/interface';
import { SplitAreaDirective } from '../directive/split-area.directive';
import {
	getInputPositiveNumber,
	getInputBoolean,
	getAreaMinSize,
	getAreaMaxSize,
	getPointFromEvent,
	getElementPixelSize,
	getGutterSideAbsorptionCapacity,
	isUserSizesValid,
	pointDeltaEquals,
	updateAreaSize,
	getKeyboardEndpoint,
} from '../model/utils';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { SplitterEventType } from '../model/splitter-event.enum';

/**
 * angular-split
 *
 *
 *  PERCENT MODE ([unit]="'percent'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |       20                 30                 20                 15                 15      | <-- [size]="x"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |calc(20% - 8px)    calc(30% - 12px)   calc(20% - 8px)    calc(15% - 6px)    calc(15% - 6px)| <-- CSS flex-basis property (with flex-grow&shrink at 0)
 * |     152px              228px              152px              114px              114px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *  flex-basis = calc( { area.size }% - { area.size/100 * nbGutter*gutterSize }px );
 *
 *
 *  PIXEL MODE ([unit]="'pixel'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |      100                250                 *                 150                100      | <-- [size]="y"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |   0 0 100px          0 0 250px           1 1 auto          0 0 150px          0 0 100px   | <-- CSS flex property (flex-grow/flex-shrink/flex-basis)
 * |     100px              250px              200px              150px              100px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *
 */

@Component({
	selector: 'as-split',
	exportAs: 'asSplit',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [`./split.component.scss`],
	template: `
		<ng-content></ng-content>
		<ng-template ngFor [ngForOf]="displayedAreas" let-area="$implicit" let-index="index" let-last="last">
			<div
				role="slider"
				tabindex="0"
				*ngIf="last === false"
				#gutterEls
				class="as-split-gutter"
				[style.flex-basis.px]="gutterSize"
				[style.order]="index * 2 + 1"
				id="sp{{ index }}"
				[attr.aria-label]="gutterAriaLabel"
				[attr.aria-orientation]="direction"
				[attr.aria-valuemin]="area.minSize"
				[attr.aria-valuemax]="area.maxSize"
				[attr.aria-valuenow]="area.size"
				[attr.aria-valuetext]="getAriaAreaSizeText(area.size)"
			>
				<div class="as-split-gutter-icon" id="gutterIcon{{ panel }}{{ index }}">
					<!-- Added for customization in current library -->
					<div class="left-arrow-icon" id="leftIcon{{ panel }}{{ index }}" (click)="onLeftArrowClick(index, direction)"></div>

					<div
						[ngClass]="direction === 'horizontal' ? 'horizonalCustom' : 'verticalCustom'"
						cdkDrag
						[cdkDragLockAxis]="direction === 'horizontal' ? 'x' : 'y'"
						cdkDragBoundary=".dragLimit"
						(cdkDragStarted)="onDragStarted($event)"
						(cdkDragEnded)="onDragEnded($event, index)"
						id="{{ direction }}{{ index }}"
					></div>
					<div [ngClass]="direction === 'vertical' ? 'right-arrow-icon rightArrow' : 'right-arrow-icon'" id="rightIcon{{ panel }}{{ index }}" (click)="onRightArrowClick(index, direction)"></div>
				</div>
			</div>
		</ng-template>
	`,
	encapsulation: ViewEncapsulation.Emulated,
})

/**
 * Class implements splitter to split areas into multiple panels
 */
export class SplitComponent implements AfterViewInit, OnDestroy {
	@Input() panel!: string;
	@Input() initial!: string;
	private gutterIndex!: number;
	private tempEvnet!: MouseEvent | TouchEvent;

	@Output() onSplitterChangeSize = new EventEmitter<string>();

	@Input() set direction(v: string) {
		this._direction = v && v.toLowerCase() === 'vertical' ? 'vertical' : 'horizontal';
		this.renderer.addClass(this.elRef.nativeElement, `as-${this._direction}`);
		this.renderer.removeClass(this.elRef.nativeElement, `as-${this._direction === 'vertical' ? 'horizontal' : 'vertical'}`);
		this.build(false, false);
	}

	get direction(): 'horizontal' | 'vertical' {
		return this._direction;
	}

	@Input() set unit(v: 'percent' | 'pixel') {
		this._unit = v === 'pixel' ? 'pixel' : 'percent';
		this.renderer.addClass(this.elRef.nativeElement, `as-${this._unit}`);
		this.renderer.removeClass(this.elRef.nativeElement, `as-${this._unit === 'pixel' ? 'percent' : 'pixel'}`);
		this.build(false, true);
	}

	get unit(): 'percent' | 'pixel' {
		return this._unit;
	}

	@Input() set gutterSize(v: number) {
		this._gutterSize = getInputPositiveNumber(v, 18);
		this.build(false, false);
	}

	get gutterSize(): number {
		return this._gutterSize;
	}

	@Input() set gutterStep(v: number) {
		this._gutterStep = getInputPositiveNumber(v, 1);
	}

	get gutterStep(): number {
		return this._gutterStep;
	}

	@Input() set restrictMove(v: boolean) {
		this._restrictMove = getInputBoolean(v);
	}

	get restrictMove(): boolean {
		return this._restrictMove;
	}

	@Input() set useTransition(v: boolean) {
		this._useTransition = getInputBoolean(v);

		if (this._useTransition) {
			this.renderer.addClass(this.elRef.nativeElement, 'as-transition');
		} else {
			this.renderer.removeClass(this.elRef.nativeElement, 'as-transition');
		}
	}

	get useTransition(): boolean {
		return this._useTransition;
	}

	@Input() set disabled(v: boolean) {
		this._disabled = getInputBoolean(v);

		if (this._disabled) {
			this.renderer.addClass(this.elRef.nativeElement, 'as-disabled');
		} else {
			this.renderer.removeClass(this.elRef.nativeElement, 'as-disabled');
		}
	}

	get disabled(): boolean {
		return this._disabled;
	}

	@Input() set dir(v: 'ltr' | 'rtl') {
		this._dir = v === 'rtl' ? 'rtl' : 'ltr';
		this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
	}

	get dir(): 'ltr' | 'rtl' {
		return this._dir;
	}

	@Input() set gutterDblClickDuration(v: number) {
		this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
	}

	@Input() gutterClickDeltaPx = 2;
	@Input() gutterAriaLabel!: string;

	get gutterDblClickDuration(): number {
		return this._gutterDblClickDuration;
	}

	@Output() get transitionEnd(): Observable<IOutputAreaSizes> {
		return new Observable<IOutputAreaSizes>((subscriber: Subscriber<IOutputAreaSizes>) => (this.transitionEndSubscriber = subscriber)).pipe(debounceTime<IOutputAreaSizes>(20));
	}

	private _config: IDefaultOptions = {
		direction: 'horizontal',
		unit: 'percent',
		gutterSize: 18,
		gutterStep: 1,
		restrictMove: false,
		useTransition: false,
		disabled: false,
		dir: 'ltr',
		gutterDblClickDuration: 0,
	};

	private _direction!: 'horizontal' | 'vertical';
	private globalConfig!: IDefaultOptions;

	constructor(
		private ngZone: NgZone,
		private elRef: ElementRef,
		private cdRef: ChangeDetectorRef,
		private renderer: Renderer2,
		private moduleManagerService: PlatformModuleManagerService,
	) {
		// To force adding default class, could be override by user @Input() or not
		this.direction = this._direction;
		this._config = this.globalConfig ? Object.assign(this._config, this.globalConfig) : this._config;
		Object.keys(this._config).forEach((property): void => {
			this[property as keyof this] = (this._config as never)[property];
		});
	}

	private _unit!: 'percent' | 'pixel';
	private _gutterSize!: number;
	private _gutterStep!: number;
	private _restrictMove!: boolean;
	private _useTransition!: boolean;
	private _disabled!: boolean;
	private _dir!: 'ltr' | 'rtl';
	private _gutterDblClickDuration!: number;

	@Output() dragStart = new EventEmitter<IOutputData>(false);
	@Output() dragEnd = new EventEmitter<IOutputData>(false);
	@Output() gutterClick = new EventEmitter<IOutputData>(false);
	@Output() gutterDblClick = new EventEmitter<IOutputData>(false);

	private transitionEndSubscriber!: Subscriber<IOutputAreaSizes>;
	private dragProgressSubject: Subject<IOutputData> = new Subject();
	dragProgress$: Observable<IOutputData> = this.dragProgressSubject.asObservable();

	private isDragging = false;
	private isWaitingClear = false;
	private isWaitingInitialMove = false;
	private dragListeners: Array<Function> = [];
	private snapshot: ISplitSnapshot | null = null;
	private startPoint: IPoint | null = null;
	private endPoint: IPoint | null = null;

	public readonly displayedAreas: Array<IArea> = [];
	private readonly hiddenAreas: Array<IArea> = [];

	@ViewChildren('gutterEls') private gutterEls!: QueryList<ElementRef>;

	_clickTimeout: number | null = null;

	public ngAfterViewInit(): void {
		this.ngZone.runOutsideAngular(() => {
			// To avoid transition at first rendering
			setTimeout(() => this.renderer.addClass(this.elRef.nativeElement, 'as-init'));
		});

		this.displayedAreas.forEach((area: IArea) => {
			area.originalArea = area.size as number;
		});
	}

	private getNbGutters(): number {
		return this.displayedAreas.length === 0 ? 0 : this.displayedAreas.length - 1;
	}

	public addArea(component: SplitAreaDirective): void {
		const newArea: IArea = {
			component,
			order: 0,
			size: 0,
			minSize: null,
			maxSize: null,
			sizeBeforeCollapse: null,
			id: Math.random(),
			gutterBeforeCollapse: 0,
			originalArea: 0,
		};

		if (component.visible === true) {
			this.displayedAreas.push(newArea);

			this.build(true, true);
		} else {
			this.hiddenAreas.push(newArea);
		}
	}

	public removeArea(component: SplitAreaDirective): void {
		if (this.displayedAreas.some((a) => a.component === component)) {
			const area = this.displayedAreas.find((a) => a.component === component);
			this.displayedAreas.splice(this.displayedAreas.indexOf(area as IArea), 1);

			this.build(true, true);
		} else if (this.hiddenAreas.some((a) => a.component === component)) {
			const area = this.hiddenAreas.find((a) => a.component === component);
			this.hiddenAreas.splice(this.hiddenAreas.indexOf(area as IArea), 1);
		}
	}

	public updateArea(component: SplitAreaDirective, resetOrders: boolean, resetSizes: boolean): void {
		if (component.visible === true) {
			this.build(resetOrders, resetSizes);
		}
	}

	public showArea(component: SplitAreaDirective): boolean {
		const area = this.hiddenAreas.find((a) => a.component === component);
		if (area === undefined) {
			return false;
		}

		const areas = this.hiddenAreas.splice(this.hiddenAreas.indexOf(area), 1);
		this.displayedAreas.push(...areas);

		this.build(true, true);
		return true;
	}

	public hideArea(comp: SplitAreaDirective): void {
		const area = this.displayedAreas.find((a) => a.component === comp);
		if (area === undefined) {
			return;
		}

		const areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
		areas.forEach((item) => {
			item.order = 0;
			item.size = 0;
		});
		this.hiddenAreas.push(...areas);

		this.build(true, true);
	}

	public getVisibleAreaSizes(): IOutputAreaSizes {
		return this.displayedAreas.map((a) => (a.size === null ? '*' : a.size));
	}

	public setVisibleAreaSizes(sizes: IOutputAreaSizes): boolean {
		if (sizes.length !== this.displayedAreas.length) {
			return false;
		}

		const formattedSizes = sizes.map((s: string | number | null) => getInputPositiveNumber(s, null));
		const isValid = isUserSizesValid(this.unit, formattedSizes);

		if (isValid === false) {
			return false;
		}

		// @ts-ignore
		this.displayedAreas.forEach((area, i) => (area.component._size = formattedSizes[i]));

		this.build(false, true);
		return true;
	}

	private build(resetOrders: boolean, resetSizes: boolean): void {
		this.stopDragging();
		// ¤ AREAS ORDER
		if (resetOrders === true) {
			// If user provided 'order' for each area, use it to sort them.
			if (this.displayedAreas.every((a) => a.component.order !== null)) {
				this.displayedAreas.sort((a, b) => <number>a.component.order - <number>b.component.order);
			}
			// Then set real order with multiples of 2, numbers between will be used by gutters.
			this.displayedAreas.forEach((area, i) => {
				area.order = i * 2;
				area.component.setStyleOrder(area.order);
			});
		}

		// ¤ AREAS SIZE

		if (resetSizes === true) {
			const useUserSizes = isUserSizesValid(
				this.unit,
				this.displayedAreas.map((a) => a.component.size),
			);
			switch (this.unit) {
				case 'percent': {
					const defaultSize = 100 / this.displayedAreas.length;

					this.displayedAreas.forEach((area) => {
						area.size = useUserSizes ? <number>area.component.size : defaultSize;
						area.minSize = getAreaMinSize(area);
						area.maxSize = getAreaMaxSize(area);
					});
					break;
				}
				case 'pixel': {
					if (useUserSizes) {
						this.displayedAreas.forEach((area) => {
							area.size = area.component.size;
							area.minSize = getAreaMinSize(area);
							area.maxSize = getAreaMaxSize(area);
						});
					} else {
						const wildcardSizeAreas = this.displayedAreas.filter((a) => a.component.size === null);

						// No wildcard area > Need to select one arbitrarily > first
						if (wildcardSizeAreas.length === 0 && this.displayedAreas.length > 0) {
							this.displayedAreas.forEach((area, i) => {
								area.size = i === 0 ? null : area.component.size;
								area.minSize = i === 0 ? null : getAreaMinSize(area);
								area.maxSize = i === 0 ? null : getAreaMaxSize(area);
							});
						} else if (wildcardSizeAreas.length > 1) {
							// More than one wildcard area > Need to keep only one arbitrarily > first
							let alreadyGotOne = false;
							this.displayedAreas.forEach((area) => {
								if (area.component.size === null) {
									if (alreadyGotOne === false) {
										area.size = null;
										area.minSize = null;
										area.maxSize = null;
										alreadyGotOne = true;
									} else {
										area.size = 100;
										area.minSize = null;
										area.maxSize = null;
									}
								} else {
									area.size = area.component.size;
									area.minSize = getAreaMinSize(area);
									area.maxSize = getAreaMaxSize(area);
								}
							});
						}
					}
					break;
				}
			}
		}

		this.refreshStyleSizes();
		this.cdRef.markForCheck();
	}

	private refreshStyleSizes(): void {
		///////////////////////////////////////////
		// PERCENT MODE
		if (this.unit === 'percent') {
			// Only one area > flex-basis 100%
			if (this.displayedAreas.length === 1) {
				this.displayedAreas[0].component.setStyleFlex(0, 0, `100%`, false, false);
			} else {
				// Multiple areas > use each percent basis
				const sumGutterSize = this.getNbGutters() * (this.gutterSize as number);

				this.displayedAreas.forEach((area) => {
					area.component.setStyleFlex(0, 0, `calc( ${area.size}% - ${(<number>area.size / 100) * sumGutterSize}px )`, area.minSize !== null && area.minSize === area.size, area.maxSize !== null && area.maxSize === area.size);
				});
			}
		} else if (this.unit === 'pixel') {
			///////////////////////////////////////////
			// PIXEL MODE
			this.displayedAreas.forEach((area) => {
				// Area with wildcard size
				if (area.size === null) {
					if (this.displayedAreas.length === 1) {
						area.component.setStyleFlex(1, 1, `100%`, false, false);
					} else {
						area.component.setStyleFlex(1, 1, `auto`, false, false);
					}
				} else {
					// Area with pixel size
					// Only one area > flex-basis 100%
					if (this.displayedAreas.length === 1) {
						area.component.setStyleFlex(0, 0, `100%`, false, false);
					} else {
						// Multiple areas > use each pixel basis
						area.component.setStyleFlex(0, 0, `${area.size}px`, area.minSize !== null && area.minSize === area.size, area.maxSize !== null && area.maxSize === area.size);
					}
				}
			});
		}
	}

	public clickGutter(event: MouseEvent | TouchEvent, gutterNum: number): void {
		const tempPoint = getPointFromEvent(event);
		// Be sure mouseup/touchend happened if touch/cursor is not moved.
		if (this.startPoint && pointDeltaEquals(this.startPoint, tempPoint, this.gutterClickDeltaPx) && (!this.isDragging || this.isWaitingInitialMove)) {
			// If timeout in progress and new click > clearTimeout & dblClickEvent
			if (this._clickTimeout !== null) {
				window.clearTimeout(this._clickTimeout);
				this._clickTimeout = null;
				this.notify('dblclick', gutterNum);
				this.stopDragging();
			} else {
				// Else start timeout to call clickEvent at end
				this._clickTimeout = window.setTimeout(() => {
					this._clickTimeout = null;
					this.notify('click', gutterNum);
					this.stopDragging();
				}, this.gutterDblClickDuration);
			}
		}
	}

	public startKeyboardDrag(event: KeyboardEvent, gutterOrder: number, gutterNum: number): void {
		if (this.disabled === true || this.isWaitingClear === true) {
			return;
		}
		const endPoint = getKeyboardEndpoint(event, this.direction);
		if (endPoint === null) {
			return;
		}
		this.endPoint = endPoint;
		this.startPoint = getPointFromEvent(event);
		event.preventDefault();
		event.stopPropagation();
		this.setupForDragEvent(gutterOrder, gutterNum);
		this.startDragging();
		this.drag();
		this.stopDragging();
	}

	public startMouseDrag(event: MouseEvent | TouchEvent, gutterOrder: number, gutterNum: number): void {
		event.preventDefault();
		event.stopPropagation();
		/** Below line is added for customization in current library */
		this.gutterIndex = gutterNum - 1;
		this.startPoint = getPointFromEvent(event);
		if (this.startPoint === null || this.disabled === true || this.isWaitingClear === true) {
			return;
		}
		this.setupForDragEvent(gutterOrder, gutterNum);
		this.startDragging();
	}

	private setupForDragEvent(gutterOrder: number, gutterNum: number): void {
		this.snapshot = {
			gutterNum,
			lastSteppedOffset: 0,
			allAreasSizePixel: getElementPixelSize(this.elRef, this.direction) - this.getNbGutters() * (this.gutterSize as number),
			allInvolvedAreasSizePercent: 100,
			areasBeforeGutter: [],
			areasAfterGutter: [],
		};
		this.displayedAreas.forEach((area) => {
			const areaSnapshot: IAreaSnapshot = {
				area,
				sizePixelAtStart: getElementPixelSize(area.component.elRef, this.direction),
				sizePercentAtStart: this.unit === 'percent' ? (area.size as number) : -1, // If pixel mode, anyway, will not be used.
			};
			if (area.order < gutterOrder) {
				if (this.restrictMove === true) {
					(this.snapshot as ISplitSnapshot).areasBeforeGutter = [areaSnapshot];
				} else {
					(this.snapshot as ISplitSnapshot).areasBeforeGutter.unshift(areaSnapshot);
				}
			} else if (area.order > gutterOrder) {
				if (this.restrictMove === true) {
					if ((this.snapshot as ISplitSnapshot).areasAfterGutter.length === 0) {
						(this.snapshot as ISplitSnapshot).areasAfterGutter = [areaSnapshot];
					}
				} else {
					(this.snapshot as ISplitSnapshot).areasAfterGutter.push(areaSnapshot);
				}
			}
		});

		this.snapshot.allInvolvedAreasSizePercent = [...this.snapshot.areasBeforeGutter, ...this.snapshot.areasAfterGutter].reduce((t, a) => t + a.sizePercentAtStart, 0);

		if (this.snapshot.areasBeforeGutter.length === 0 || this.snapshot.areasAfterGutter.length === 0) {
			return;
		}
	}

	private startDragging(): void {
		this.displayedAreas.forEach((area) => area.component.lockEvents());
		this.isDragging = true;
		this.isWaitingInitialMove = true;
	}

	private mouseDragEvent(event: MouseEvent | TouchEvent): void {
		event.preventDefault();
		event.stopPropagation();
		const tempPoint = getPointFromEvent(event);
		if (this._clickTimeout !== null && !pointDeltaEquals(this.startPoint as IPoint, tempPoint, this.gutterClickDeltaPx)) {
			window.clearTimeout(this._clickTimeout);
			this._clickTimeout = null;
		}
		if (this.isDragging === false) {
			return;
		}
		this.endPoint = getPointFromEvent(event);
		if (this.endPoint === null) {
			return;
		}

		this.drag();
	}

	private drag(): void {
		/** Below if-else added for customization in current library */
		if (this.direction === 'vertical') {
			if (document.getElementById('gutterIcon' + this.panel + this.gutterIndex)?.classList.contains('image-none')) {
				return;
			}
		} else {
			if (document.getElementById('gutterIcon' + this.gutterIndex)?.classList.contains('image-none')) {
				return;
			}
		}
		if (this.isWaitingInitialMove) {
			if ((this.startPoint as IPoint).x !== (this.endPoint as IPoint).x || (this.startPoint as IPoint).y !== (this.endPoint as IPoint).y) {
				this.ngZone.run(() => {
					this.isWaitingInitialMove = false;

					this.renderer.addClass(this.elRef.nativeElement, 'as-dragging');
					this.renderer.addClass(this.gutterEls.toArray()[(this.snapshot as ISplitSnapshot).gutterNum - 1].nativeElement, 'as-dragged');

					this.notify('start', (this.snapshot as ISplitSnapshot).gutterNum);
				});
			} else {
				return;
			}
		}

		// Calculate steppedOffset

		let offset = this.direction === 'horizontal' ? (this.startPoint as IPoint).x - (this.endPoint as IPoint).x : (this.startPoint as IPoint).y - (this.endPoint as IPoint).y;
		if (this.dir === 'rtl') {
			offset = -offset;
		}
		const steppedOffset = Math.round(offset / this.gutterStep) * this.gutterStep;
		if (steppedOffset === (this.snapshot as ISplitSnapshot).lastSteppedOffset) {
			return;
		}

		(this.snapshot as ISplitSnapshot).lastSteppedOffset = steppedOffset;

		// Need to know if each gutter side areas could reacts to steppedOffset

		let areasBefore = getGutterSideAbsorptionCapacity(this.unit, (this.snapshot as ISplitSnapshot).areasBeforeGutter, -steppedOffset, (this.snapshot as ISplitSnapshot).allAreasSizePixel);
		let areasAfter = getGutterSideAbsorptionCapacity(this.unit, (this.snapshot as ISplitSnapshot).areasAfterGutter, steppedOffset, (this.snapshot as ISplitSnapshot).allAreasSizePixel);

		// Each gutter side areas can't absorb all offset
		if (areasBefore.remain !== 0 && areasAfter.remain !== 0) {
			if (Math.abs(areasBefore.remain) === Math.abs(areasAfter.remain)) {
			} else if (Math.abs(areasBefore.remain) > Math.abs(areasAfter.remain)) {
				areasAfter = getGutterSideAbsorptionCapacity(this.unit, (this.snapshot as ISplitSnapshot).areasAfterGutter, steppedOffset + areasBefore.remain, (this.snapshot as ISplitSnapshot).allAreasSizePixel);
			} else {
				areasBefore = getGutterSideAbsorptionCapacity(this.unit, (this.snapshot as ISplitSnapshot).areasBeforeGutter, -(steppedOffset - areasAfter.remain), (this.snapshot as ISplitSnapshot).allAreasSizePixel);
			}
		} else if (areasBefore.remain !== 0) {
			// Areas before gutter can't absorbs all offset > need to recalculate sizes for areas after gutter.
			areasAfter = getGutterSideAbsorptionCapacity(this.unit, (this.snapshot as ISplitSnapshot).areasAfterGutter, steppedOffset + areasBefore.remain, (this.snapshot as ISplitSnapshot).allAreasSizePixel);
		} else if (areasAfter.remain !== 0) {
			// Areas after gutter can't absorbs all offset > need to recalculate sizes for areas before gutter.
			areasBefore = getGutterSideAbsorptionCapacity(this.unit, (this.snapshot as ISplitSnapshot).areasBeforeGutter, -(steppedOffset - areasAfter.remain), (this.snapshot as ISplitSnapshot).allAreasSizePixel);
		}

		if (this.unit === 'percent') {
			// Hack because of browser messing up with sizes using calc(X% - Ypx) -> el.getBoundingClientRect()
			// If not there, playing with gutters makes total going down to 99.99875% then 99.99286%, 99.98986%,..
			const all = [...areasBefore.list, ...areasAfter.list];
			const areaToReset = all.find((a) => a.percentAfterAbsorption !== 0 && a.percentAfterAbsorption !== a.areaSnapshot.area.minSize && a.percentAfterAbsorption !== a.areaSnapshot.area.maxSize);

			if (areaToReset) {
				areaToReset.percentAfterAbsorption = (this.snapshot as ISplitSnapshot).allInvolvedAreasSizePercent - all.filter((a) => a !== areaToReset).reduce((total, a) => total + a.percentAfterAbsorption, 0);
			}
		}
		// Now we know areas could absorb steppedOffset, time to really update sizes
		areasBefore.list.forEach((item) => updateAreaSize(this.unit, item));
		areasAfter.list.forEach((item) => updateAreaSize(this.unit, item));
		this.refreshStyleSizes();
		this.notify('progress', (this.snapshot as ISplitSnapshot).gutterNum);

		/** Below function is called for customization in current library */
		this.checkOriginalArea();
	}

	private stopDragging(event?: Event): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (this.isDragging === false) {
			return;
		}
		this.displayedAreas.forEach((area) => area.component.unlockEvents());
		while (this.dragListeners.length > 0) {
			const fct = this.dragListeners.pop();
			if (fct) {
				fct();
			}
		}

		// Warning: Have to be before "notify('end')"
		// because "notify('end')"" can be linked to "[size]='x'" > "build()" > "stopDragging()"
		this.isDragging = false;

		// If moved from starting point, notify end
		if (this.isWaitingInitialMove === false) {
			this.notify('end', (this.snapshot as ISplitSnapshot).gutterNum);
		}

		this.renderer.removeClass(this.elRef.nativeElement, 'as-dragging');
		this.renderer.removeClass(this.gutterEls.toArray()[(this.snapshot as ISplitSnapshot).gutterNum - 1].nativeElement, 'as-dragged');
		this.snapshot = null;
		this.isWaitingClear = true;

		// Needed to let (click)="clickGutter(...)" event run and verify if mouse moved or not
		this.ngZone.runOutsideAngular(() => {
			setTimeout(() => {
				this.startPoint = null;
				this.endPoint = null;
				this.isWaitingClear = false;
			});
		});
	}

	public notify(type: 'start' | 'progress' | 'end' | 'click' | 'dblclick' | 'transitionEnd', gutterNum: number): void {
		const sizes = this.getVisibleAreaSizes();
		if (type === 'start') {
			this.dragStart.emit({ gutterNum, sizes });
		} else if (type === 'end') {
			this.dragEnd.emit({ gutterNum, sizes });
		} else if (type === 'click') {
			this.gutterClick.emit({ gutterNum, sizes });
		} else if (type === 'dblclick') {
			this.gutterDblClick.emit({ gutterNum, sizes });
		} else if (type === 'transitionEnd') {
			if (this.transitionEndSubscriber) {
				this.ngZone.run(() => this.transitionEndSubscriber.next(sizes));
			}
		} else if (type === 'progress') {
			// Stay outside zone to allow users do what they want about change detection mechanism.

			this.dragProgressSubject.next({ gutterNum, sizes });
		}
	}

	public ngOnDestroy(): void {
		this.stopDragging();
	}

	public collapseArea(comp: SplitAreaDirective, newSize: number, gutter: 'left' | 'right'): void {
		const area = this.displayedAreas.find((a) => a.component === comp);
		if (area === undefined) {
			return;
		}
		const whichGutter = gutter === 'right' ? 1 : -1;
		if (!area.sizeBeforeCollapse) {
			area.sizeBeforeCollapse = area.size;
			area.gutterBeforeCollapse = whichGutter;
		}
		area.size = newSize;
		const gtr = this.gutterEls.find((f) => f.nativeElement.style.order === `${area.order + whichGutter}`);
		this.updateArea(comp, false, false);
	}

	public expandArea(comp: SplitAreaDirective): boolean {
		const area = this.displayedAreas.find((a) => a.component === comp);
		if (area === undefined) {
			return false;
		}
		if (!area.sizeBeforeCollapse) {
			return false;
		}
		area.size = area.sizeBeforeCollapse;
		area.sizeBeforeCollapse = null;
		const gtr = this.gutterEls.find((f) => f.nativeElement.style.order === `${area.order + area.gutterBeforeCollapse}`);
		this.updateArea(comp, false, false);
		return true;
	}

	public getAriaAreaSizeText(size: number | null): string | null {
		if (size === null) {
			return null;
		}
		return size.toFixed(0) + ' ' + this.unit;
	}

	/**
	 * Below functions are added for customization in current library
	 */

	/**
	 * To expand/collapse panels on left arrow click.
	 * @param index {number}
	 * @returns {void}
	 */
	public onLeftArrowClick(index: number, direction: string): void {
		const num = this.getNbGutters();
		if (this.displayedAreas[index + 1].size === 0) {
			for (let i = num; i >= 0; i--) {
				if (this.displayedAreas[i].size !== 0) {
					const indexSize = this.displayedAreas[i].size;
					const nextIndexSize = this.displayedAreas[index + 1].size;
					let area = 0;
					area = (this.displayedAreas[i].size as number) - (this.displayedAreas[i].originalArea as number);
					this.collapseArea(this.displayedAreas[i].component, this.displayedAreas[i].originalArea as number, 'left');
					this.collapseArea(this.displayedAreas[index + 1].component, area, 'left');
					this.displayedAreas[i].sizeBeforeCollapse = indexSize;
					this.displayedAreas[index + 1].sizeBeforeCollapse = nextIndexSize;
					break;
				}
			}
			this.toggleArrows(index + 1, index, 'remove', direction);
			this.toggleGutterIcon(index, index + 1, 'remove', direction);
			this.splitterSizeChange(SplitterEventType.LeftArrowEvent);
		} else {
			const indexSize = this.displayedAreas[index].size;
			this.collapseArea(this.displayedAreas[index].component, 0, 'left');
			for (let i = num; i >= 0; i--) {
				if (this.displayedAreas[i].size !== 0) {
					const iIndexSize = this.displayedAreas[i].size;
					const area = (indexSize as number) + (this.displayedAreas[i].size as number);
					this.collapseArea(this.displayedAreas[i].component, area, 'left');
					this.displayedAreas[i].sizeBeforeCollapse = iIndexSize;
					this.displayedAreas[index].sizeBeforeCollapse = indexSize;
					break;
				}
			}
			this.toggleArrows(index, index - 1, 'add', direction);
			this.toggleGutterIcon(index, index - 1, 'add', direction);
			this.splitterSizeChange(SplitterEventType.LeftArrowEvent);
		}
	}

	/**
	 * To expand/collapse panels on right arrow click.
	 * @param index {number}
	 * @returns {void}
	 */
	public onRightArrowClick(index: number, direction: string): void {
		const num = this.getNbGutters();

		if (this.displayedAreas[index].size === 0) {
			const size = this.displayedAreas[index].size;
			this.collapseArea(this.displayedAreas[index].component, this.displayedAreas[index].sizeBeforeCollapse as number, 'left');
			const indexSize = this.displayedAreas[index].size;
			for (let i = num; i >= 0; i--) {
				if (this.displayedAreas[i].size !== 0) {
					const iIndexSize = this.displayedAreas[i].size;
					const area = (this.displayedAreas[i].size as number) - (indexSize as number);
					this.collapseArea(this.displayedAreas[i].component, area, 'left');
					this.displayedAreas[i].sizeBeforeCollapse = iIndexSize;
					this.displayedAreas[index].sizeBeforeCollapse = size;
					break;
				}
			}
			this.toggleArrows(index, index - 1, 'remove', direction);
			this.toggleGutterIcon(index, index - 1, 'remove', direction);
			this.splitterSizeChange(SplitterEventType.RightArrowEvent);
		} else if (this.displayedAreas[index + 1].size !== 0) {
			const nextIndexSize = this.displayedAreas[index + 1].size;
			this.collapseArea(this.displayedAreas[index + 1].component, 0, 'right');
			for (let i = num; i >= 0; i--) {
				if (this.displayedAreas[i].size !== 0) {
					const iIndexSize = this.displayedAreas[i].size;
					const area = (nextIndexSize as number) + (this.displayedAreas[i].size as number);
					this.collapseArea(this.displayedAreas[i].component, area, 'right');
					this.displayedAreas[i].sizeBeforeCollapse = iIndexSize;
					this.displayedAreas[index + 1].sizeBeforeCollapse = nextIndexSize;
					break;
				}
			}
			this.toggleArrows(index + 1, index, 'add', direction);
			this.toggleGutterIcon(index + 1, index, 'add', direction);
			this.splitterSizeChange(SplitterEventType.RightArrowEvent);
		}
	}

	/**
	 * To assign current area of panel to original area on drag.
	 * @returns {void}
	 */
	public checkOriginalArea(): void {
		this.displayedAreas.forEach((area: IArea) => {
			if (area.originalArea !== area.size) {
				area.originalArea = area.size as number;
			}
		});
	}

	/**
	 * To hide/show left/right arrows on arrow click.
	 * @param firstIndex {number}
	 * @param secondIndex {number}
	 * @param status {string}
	 * @returns {void}
	 */
	public toggleArrows(firstIndex: number, secondIndex: number, status: string, direction: string): void {
		this.initial = direction;
		this.direction = direction;
		let firstElement;
		let secondElement;
		let adjustFirstElement;
		let adjustSecondElement;
		let firstsplitter = document.getElementById(direction + firstIndex);
		let secondsplitter = document.getElementById(direction + secondIndex);
		if (this.initial === 'vertical') {
			firstElement = this.direction === 'vertical' ? document.getElementById('rightIcon' + this.panel + secondIndex) : document.getElementById('rightIcon' + secondIndex);
			secondElement = this.direction === 'vertical' ? document.getElementById('leftIcon' + this.panel + firstIndex) : document.getElementById('leftIcon' + firstIndex);
			adjustFirstElement = this.direction === 'vertical' ? document.getElementById('rightIcon' + this.panel + firstIndex) : document.getElementById('rightIcon' + firstIndex);
			adjustSecondElement = this.direction === 'vertical' ? document.getElementById('leftIcon' + this.panel + secondIndex) : document.getElementById('leftIcon' + secondIndex);
		} else {
			firstElement = this.direction === 'horizontal' ? document.getElementById('rightIcon' + this.panel + secondIndex) : document.getElementById('rightIcon' + secondIndex);
			secondElement = this.direction === 'horizontal' ? document.getElementById('leftIcon' + this.panel + firstIndex) : document.getElementById('leftIcon' + firstIndex);
			adjustFirstElement = this.direction === 'horizontal' ? document.getElementById('rightIcon' + this.panel + firstIndex) : document.getElementById('rightIcon' + firstIndex);
			adjustSecondElement = this.direction === 'horizontal' ? document.getElementById('leftIcon' + this.panel + secondIndex) : document.getElementById('leftIcon' + secondIndex);
		}
		if (status === 'add') {
			firstElement?.classList.add('d-none');
			secondElement?.classList.add('d-none');
			firstsplitter?.classList.add('d-none');
			secondsplitter?.classList.add('d-none');

			this.direction === 'vertical' ? adjustFirstElement?.classList.add('adjust-left') : adjustFirstElement?.classList.add('adjust-top');
			this.direction === 'vertical' ? adjustSecondElement?.classList.add('adjust-left') : adjustSecondElement?.classList.add('adjust-top');
		} else {
			firstElement?.classList.remove('d-none');
			secondElement?.classList.remove('d-none');
			firstsplitter?.classList.remove('d-none');
			secondsplitter?.classList.remove('d-none');
			this.direction === 'vertical' ? adjustFirstElement?.classList.remove('adjust-left') : adjustFirstElement?.classList.remove('adjust-top');
			this.direction === 'vertical' ? adjustSecondElement?.classList.remove('adjust-left') : adjustSecondElement?.classList.remove('adjust-top');
		}
	}

	/**
	 * To hide/show gutterIcon on arrow click.
	 * @param firstIndex {number}
	 * @param secondIndex {number}
	 * @param status {string}
	 * @returns {void}
	 */
	public toggleGutterIcon(firstIndex: number, secondIndex: number, status: string, direction: string): void {
		this.initial = direction;
		this.direction = direction;
		let firstElement;
		let secondElement;
		if (this.initial === 'vertical') {
			firstElement = this.direction === 'vertical' ? document.getElementById('gutterIcon' + this.panel + firstIndex) : document.getElementById('gutterIcon' + firstIndex);
			secondElement = this.direction === 'vertical' ? document.getElementById('gutterIcon' + this.panel + secondIndex) : document.getElementById('gutterIcon' + secondIndex);
		} else {
			firstElement = this.direction === 'horizontal' ? document.getElementById('gutterIcon' + this.panel + firstIndex) : document.getElementById('gutterIcon' + firstIndex);
			secondElement = this.direction === 'horizontal' ? document.getElementById('gutterIcon' + this.panel + secondIndex) : document.getElementById('gutterIcon' + secondIndex);
		}

		if (status === 'add') {
			firstElement?.classList.add(...['image-none', 'bg-color']);
			secondElement?.classList.add(...['image-none', 'bg-color']);
		} else {
			firstElement?.classList.remove(...['image-none', 'bg-color']);
			const allPanelOpen = this.checkIfAllPanelsOpen();
			if (allPanelOpen) {
				secondElement?.classList.remove(...['image-none', 'bg-color']);
			}
		}
	}

	/**
	 * To check panel status.
	 * @returns {boolean}
	 */
	public checkIfAllPanelsOpen(): boolean {
		let allPanelOpen = true;
		this.displayedAreas.forEach((area: IArea) => {
			if (area.size === 0) {
				allPanelOpen = false;
			}
		});
		return allPanelOpen;
	}

	/**
	 *
	 * @param event {CdkDragEnd}
	 * @param index {number}
	 * @param direction {string}
	 * Below function will triggered on dragging custom splitter bar.
	 * Based on drag direction (horizontal or vertical) it will execute respective
	 * fuction and will modifiy panel sizes.
	 */
	onDragEnded(cdkEvent: CdkDragEnd, index: number) {
		let event: MouseEvent | TouchEvent = cdkEvent.event;
		this.startMouseDrag(this.tempEvnet, index * 2 + 1, index + 1);
		this.mouseDragEvent(event);
		cdkEvent.source._dragRef.reset();
		this.moduleManagerService.informContainerResized(true);
		this.splitterSizeChange(SplitterEventType.ResizeEvent);
		this.cdRef.markForCheck();
		event.preventDefault();
	}

	/**
	 *
	 * @param event1 {CdkDragStart}
	 * @param index {number}
	 * @param direction {string}
	 */
	onDragStarted(cdkEvent: CdkDragStart) {
		this.tempEvnet = cdkEvent.event;
	}

	/**
	 * this function notify to parrent component when splitter will changed the size
	 * using of OutPut commponent communication methodology
	 *
	 * @param {string} value
	 */

	public splitterSizeChange(value: string): void {
		this.onSplitterChangeSize.emit(value);
	}
}
