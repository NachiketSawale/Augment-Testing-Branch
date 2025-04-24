import { UiCommonLookupSimpleDataService } from '@libs/ui/common';
import { IIconItem, IStatusIconLookupEntity } from '../model/interfaces/comment-status-option.interface';
import { firstValueFrom } from 'rxjs';

enum CommentStatusType {
	Question = 1,
	Answer = 2,
}

/**
 * Comment Status Lookup Service
 */
export class BasicsSharedStatusLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<IStatusIconLookupEntity, TEntity> {
	private statusIcons: IIconItem[] | undefined;

	public constructor(statusLookupQualifier: string) {
		super(statusLookupQualifier, {
			uuid: '',
			valueMember: 'Id',
			displayMember: 'Description',
		});

		this.initStatusIcons();
	}

	private initStatusIcons() {
		this.getList().subscribe((iconLookupEntities) => {
			this.statusIcons = iconLookupEntities.map((e) => {
				return { id: e.Id, displayName: e.Description ?? '', iconCSS: `status-icons ico-status${e.icon.toString().padStart(2, '0')}` };
			});
		});
	}

	/** TODO: Consider getting icons through the BasicsSharedStatusIconService. */
	public async generateIcons(): Promise<Array<IIconItem>> {
		if (!this.statusIcons) {
			const iconLookupEntities = await firstValueFrom(this.getList());
			this.statusIcons = iconLookupEntities.map((e) => {
				return { id: e.Id, displayName: e.Description ?? '', iconCSS: `status-icons ico-status${e.icon.toString().padStart(2, '0')}` };
			});
		}

		return this.statusIcons.map((e) => {
			return this.setCss(e);
		});
	}

	public getIconById(id: number): IIconItem | undefined {
		const icon = this.statusIcons?.find((icon) => icon.id === id);
		return icon ? this.setCss(icon) : undefined;
	}

	private setCss(icon: IIconItem): IIconItem {
		return { ...icon, iconCSS: 'block-image ' + icon.iconCSS };
	}

	public getDefaultIconId(parentCommentId?: number) {
		if (!this.statusIcons) {
			return undefined;
		}

		let result: number | undefined;
		if (parentCommentId === CommentStatusType.Question) {
			result = this.statusIcons.find((icon) => icon.id === CommentStatusType.Answer)?.id;
		} else if (parentCommentId === CommentStatusType.Answer) {
			result = this.statusIcons.find((icon) => icon.id === CommentStatusType.Question)?.id;
		}
		if (result === undefined) {
			result = this.statusIcons.reduce((pre, curr) => {
				return pre.id < curr.id ? pre : curr;
			}).id;
		}
		return result;
	}
}
