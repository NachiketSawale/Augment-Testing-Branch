import {ITextModuleTextEntity} from './entities/textmoduletext-entity.interface';
import {BlobsEntity, IClobsEntity} from '@libs/basics/shared';
import {TextFormatTypes} from './types/text-format.type';
import {EditorOptions} from './types/editor-options';

export class BasicsTextModulesScope {

	public constructor() {
		this.editorOptions ={
			language:{
				current: undefined,
				visible: false,
				list: undefined
			},
			variable:{
				current: undefined,
				visible: false,
				list: undefined
			}
		};
	}

	public textareaEditable = false;

	public textFormatFk?: TextFormatTypes;

	public contentField = '';

	public isVariableVisible: boolean = false;

	public showTableBtn?: boolean = false;

	public selectedLanguageId?: object;

	public translation?: ITextModuleTextEntity;

	public oldContent?: BlobsEntity | IClobsEntity;

	public editorOptions : EditorOptions  ;
}
