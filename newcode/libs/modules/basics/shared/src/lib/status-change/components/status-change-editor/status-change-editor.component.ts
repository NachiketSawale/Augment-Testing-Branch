import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IStatus } from '../../model/interfaces/status.interface';
import { IStatusChangeEditorOptions } from '../../model/interfaces/status-change-editor-options.interface';
import { StatusChangeEvent } from '../../model/status-change-event';

@Component({
	selector: 'basics-shared-status-change-editor',
	templateUrl: './status-change-editor.component.html',
	styleUrls: ['./status-change-editor.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class BasicsSharedStatusChangeEditorComponent implements OnInit, OnChanges {
	private readonly statusItemHeight = 35;

	/**
	 * editor configure
	 */
	public constructor(private hostElement: ElementRef) {}

	/**
	 * editor configure
	 */
	@Input()
	public config?: IStatusChangeEditorOptions;

	/**
	 * status select finish by doubling click the status item
	 */
	@Output()
	public selectFinished: EventEmitter<StatusChangeEvent> = new EventEmitter<StatusChangeEvent>();

	/**
	 * status select changed
	 */
	@Output()
	public selectChanged: EventEmitter<StatusChangeEvent> = new EventEmitter<StatusChangeEvent>();

	/**
	 * status select changed
	 */
	@Output()
	public editorSizeChanged: EventEmitter<number> = new EventEmitter<number>();

	/**
	 * Remark text
	 */
	public remark: string = '';

	/**
	 * Bind to the checkbox whether show the available status
	 */
	public get showAvailableStatus(): boolean {
		return this.config ? this.config.showAvailableStatus : false;
	}

	public set showAvailableStatus(value) {
		if (this.config) {
			this.config.showAvailableStatus = value;
			this.updateStatusList(false);
		}
	}

	/**
	 * status array
	 */
	public statusList: IStatus[] = [];

	/**
	 * current selected status
	 */
	public selectedStatus?: IStatus;

	/**
	 * the slider max value
	 */
	public sliderMaxValue: number = this.statusList.length - 1;
	/**
	 * the current select status index value
	 */
	public currentStateValue: number = this.statusList.length - 1;

	public sliderHeight: string = '';

	/**
	 * on initializing, lifecycle hook
	 */
	public ngOnInit(): void {
		this.updateStatusList(true);
	}

	private getSliderHeight() {
		//6: is the magic number for the padding of the slider
		return (this.statusList?.length - 1) * this.statusItemHeight + 6;
	}

	/**
	 * Select status by Index
	 */
	private selectStatusByIndex(index: number) {
		if (this.statusList && this.selectedStatus) {
			const curIndex = this.statusList?.findIndex((status) => status === this.selectedStatus);
			if (curIndex !== index) {
				setTimeout(() => {
					if (this.statusList) {
						this.selectedStatus = this.statusList[index];
						this.selectChanged.emit({ status: this.selectedStatus, remark: this.remark });
					}
				});
			}
		}
	}

	/**
	 * Select status by moving down the slider
	 */
	public OnSelectDown() {
		if (this.statusList && this.selectedStatus) {
			const index = this.statusList.findIndex((status) => status === this.selectedStatus);

			for (let i = index + 1; i < this.statusList.length; i++) {
				const nextStatus = this.statusList[i];
				if (nextStatus.isAvailable) {
					this.currentStateValue = i;
					this.selectStatusByIndex(i);
					break;
				}
			}
		}
	}

	/**
	 * Select status by moving up the slider
	 */
	public OnSelectUp() {
		if (this.statusList && this.selectedStatus) {
			const index = this.statusList.findIndex((status) => status === this.selectedStatus);

			for (let i = index - 1; i >= 0; i--) {
				const nextStatus = this.statusList[i];
				if (nextStatus.isAvailable) {
					this.currentStateValue = i;
					this.selectStatusByIndex(i);
					break;
				}
			}
		}
	}

	/**
	 * Event handler, when status is selected by clicking
	 */
	public onSelectStatus(status: IStatus) {
		if (status.isAvailable && this.statusList) {
			const index = this.statusList.findIndex((s) => s === status);
			this.selectStatusByIndex(index);
			//for slider, assign the opposite position of the index to currentStateValue
			this.currentStateValue = index;
		}
	}

	/**
	 * Event handler, when status is double click means finish selection
	 */
	public onDoubleClickStatus(status: IStatus) {
		if (status.isAvailable) {
			this.selectFinished.emit({ status: status, remark: this.remark });
		}
	}

	/**
	 * return the status icon svg url
	 */
	public getStatusIconURL(status: IStatus): string {
		return 'assets/ui/common/images/status-icons.svg#ico-status' + status.Icon.toString().padStart(2, '0');
	}

	/**
	 * return the status icon svg style
	 */
	public getStatusIconStyle(status: IStatus): object {
		if (status.BackGroundColor) {
			const colorString = status.BackGroundColor.toString(16).padStart(7, '#000000');
			return {
				'--icon-color-1': colorString,
				'--icon-color-2': colorString,
				'--icon-color-3': colorString,
				'--icon-color-4': colorString,
				'--icon-color-5': colorString,
				'--icon-color-6': colorString,
			};
		}
		return {};
	}

	/**
	 * Update the status list and the selected status when conf is changed or initial
	 */
	private updateStatusList(initialSelect: boolean) {
		if (this.config) {
			this.statusList = this.config.statusList.filter((s) => !this.config?.showAvailableStatus || s.isAvailable).sort((a, b) => (b.Sorting !== a.Sorting ? b.Sorting - a.Sorting : b.Id - a.Id));
			if (initialSelect) {
				this.selectedStatus = this.statusList?.find((s) => s.Id === this.config?.fromStatusId);
			}

			//for slider:
			if (this.statusList && this.selectedStatus) {
				this.currentStateValue = this.statusList.indexOf(this.selectedStatus);
				this.sliderMaxValue = this.statusList.length - 1;
				this.sliderHeight = this.getSliderHeight() + 'px';

				const curIndex = this.statusList?.indexOf(this.selectedStatus);
				setTimeout(() => {
					const selectedItemHeight = curIndex * this.statusItemHeight;
					// fixed the issue: #106059, Status Change - Focus/Scroll to current status
					if (selectedItemHeight > 0) {
						this.hostElement.nativeElement.querySelector('#change-status-container').scrollTop = selectedItemHeight;
					}
				});
			}
		}
	}

	/**
	 * event when the input changed
	 */
	public ngOnChanges() {
		this.updateStatusList(true);
	}

	public remarkChanged() {
		if (this.selectedStatus) {
			this.selectChanged.emit({ status: this.selectedStatus, remark: this.remark });
		}
	}
}

