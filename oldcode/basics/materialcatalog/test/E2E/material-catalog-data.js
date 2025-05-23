/**
 * Created by hni on 2015/7/23.
 */

/*var cellType = {
    normalCell: 'normalCell',
    comboBoxCell: 'comboBox',
    dropDownCell: 'dropDownBox',
    readOnlyCell: 'readOnlyCell'
};*/


module.exports = {
	CONTAINER_SEARCH:'AUTOTEST',
	MDC_HEADER: {
		ADD_RECORD: {
			CODE: '20150723',
			SUPPLIER: '222',
			DESCRIPTION: '20150723DESC',
			VALID_FROM: '1',
			VALID_TO: '28',
			DATE_VERSION: '22',
			TYPE: 'Standard-Materialkatalogtyp',
			RESPONSIBLE: '2015',
			BUSINESS_PARTNER: 'P.U',
			PAYMENT_TERM: '1',
			INCOTERMS: 'FAC'
		},
		MODIFY_RECORD: {
			CODE: '20150701',
			SUPPLIER: '20150205LAN',
			DESCRIPTION: '20150724DESC',
			VALID_FROM: '10',
			VALID_TO: '10',
			DATE_VERSION: '10',
			TYPE: 'framework agreements',
			RESPONSIBLE: 'DeDa2015',
			BUSINESS_PARTNER: '2D Grafic Ltd.',
			SUBSIDIARY: 'head quarter',
			SUBSIDIARY_ADDRESS: 'Adenauerstrasse 10 DE 20000 Hamburg Germany',
			PAYMENT_TERM: '2',
			INCOTERMS: 'DAP'
		},
		DEFAULT_CASE_CODE:'AUTOTEST80511',
		TEST_SAVE_SEARCH_CASE:{
			CODE: 'AUTOTEST0810',
			SUPPLIER: 'TEABILUOCHUN',
			TYPE: 'supplier material catalogs',
			DESCRIPTION: '20150724DESC',
			RESPONSIBLE: 'MY HOUSE:BALCONY',
			BUSINESS_PARTNER: '2D Grafic Ltd.',
			SUBSIDIARY: 'head quarter',
			SUBSIDIARY_ADDRESS: 'Adenauerstrasse 10 DE 20000 Hamburg Germany',
			PAYMENT_TERM: '645',
			INCOTERMS: 'DAP'
		},
		TEST_ADD_DELETE_BUTTON_CASE:{
			CODE: 'niu2016',
			SUPPLIER: 'TEABILUOCHUN'
		}
	},
	MATERIAL_GROUP: {
		SEARCH: 'AUTOTEST',
		CONTAINER_SEARCH:'AUTOTEST',
		ADD_ROOT: {
			CODE: 'AUTOTEST080503',
			DESCRIPTION: 'AUTOTEST2015080501',
			STRUCTURE_CODE: '20150225LAN'
		},
		ADD_SUB: {
			CODE: '2015072706SUB',
			DESCRIPTION: '2015072401DESCSUB',
			STRUCTURE_CODE: '20150225LAN'
		},
		MODIFY: {
			CODE: '2015072704MODIFY',
			DESCRIPTION: '2015072401DESCMODIFY',
			STRUCTURE_CODE: '20150225LAN'
		},
		TEST_SAVE_SEARCH_CASE:{
			CODE: 'AUTOTEST0810',
			DESCRIPTION: 'AUTOTEST0810',
			STRUCTURE_CODE: 'AUTO TEST'
		}
	},
	MATERIAL_DISCOUNT_GROUP:{
		SEARCH:'AUTOTEST',
		ADD_ROOT:{
			CODE:'2015072708ROOT',
			DESCRIPTION:'2015072401DESCROOT',
			DISCOUNT_TYPE:'Cash Back',
			DISCOUNT:'1.00'
		},
		ADD_SUB:{
			CODE:'2015072706SUB',
			DESCRIPTION:'2015072401DESCSUB',
			DISCOUNT_TYPE:'Cash Back',
			DISCOUNT:'0.60'
		},
		MODIFY:{
			CODE:'2015072706MODIFY',
			DESCRIPTION:'2015072401DESCMODIFY',
			DISCOUNT_TYPE:'Cash Back',
			DISCOUNT:'600.30'
		},
		TEST_SAVE_SEARCH_CASE:{
			CODE:'AUTOTEST0810',
			DESCRIPTION:'AUTOTEST0810',
			DISCOUNT_TYPE:'Cash Back',
			DISCOUNT:'100'
		}
	},
	ATTRIBUTES:{
		SEARCH:'AUTOTEST',
		ADD_RECORD:{
			ATTRIBUTE:'2015072701FIXADD8'
		},

		MODIFY:{
			ATTRIBUTE:'20150727FIXMODIFY'
		},
		TEST_SAVE_SEARCH_CASE:{
			ATTRIBUTE:'AUTOTEST0810'
		}
	},
	ATTRIBUTES_VALUES:{
		SEARCH:'AUTOTEST',
		ADD_RECORD:{
			VALUE:'VALUE3'
		},

		MODIFY:{
			VALUE:'VALUE2'
		},
		TEST_SAVE_SEARCH_CASE:{
			VALUE:'AUTOTEST1103'
		}
	}
};

