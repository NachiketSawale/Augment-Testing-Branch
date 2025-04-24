/**
 * Created by chk on 1/11/2016.
 */
(function(angular){
	'use strict';
	/* jshint -W072 */
	angular.module('constructionsystem.master').constant('parameterDataLookup',10);
	angular.module('constructionsystem.master').constant('parameterDataTypes', {
		Integer: 0,
		Decimal1: 1,
		Decimal2: 2,
		Decimal3: 3,
		Decimal4: 4,
		Decimal5: 5,
		Decimal6: 6,
		Boolean: 10,
		Date: 11,
		Text: 12
	});

	angular.module('constructionsystem.master').factory('aggregateTypeService', ['platformTranslateService',function(platformTranslateService){
		var service = {};
		var aggregateTypeList = [
			'constructionsystem.master.entityAggregateNoneType',
			'constructionsystem.master.entityAggregateSumType',
			'constructionsystem.master.entityAggregateMinType',
			'constructionsystem.master.entityAggregateMaxType',
			'constructionsystem.master.entityAggregateAverageType'
		];

		var aggregateTypeListTranslated = null;

		service.getByIndex = function (index) {
			if(aggregateTypeListTranslated === null || aggregateTypeListTranslated === undefined){
				aggregateTypeListTranslated = service.getList();
			}
			if(angular.isDefined(aggregateTypeListTranslated[index])){
				return aggregateTypeListTranslated[index].Description;
			}
			return aggregateTypeListTranslated[0].Description || '';
		};

		service.getList = function () {
			if (aggregateTypeListTranslated === null) {
				aggregateTypeListTranslated = new Array();
				for (var i = 0; i < aggregateTypeList.length; i++) {
					var item = {Id:i,Description:platformTranslateService.instant(aggregateTypeList[i], null, true)};
					aggregateTypeListTranslated.push(item);
				}
			}
			return aggregateTypeListTranslated;
		};
		return service;
	}]);

	angular.module('constructionsystem.master').constant('variableNameKeywords',
		['public', 'private', 'protected', 'static', 'int', 'string', 'break', 'delete', 'function', 'return',
			'typeof', 'case', 'do', 'if', 'switch', 'var', 'catch', 'do', 'in', 'this', 'void', 'continue', 'false', 'instanceof',
			'throw', 'while', 'debugger', 'finally', 'new', 'true', 'with', 'default', 'for', 'null', 'try',
			'class', 'const', 'enum', 'export', 'extends', 'import', 'super', 'arguments', 'eval', 'abstract', 'double',
			'goto', 'native', 'static', 'boolean', 'enum', 'implements', 'package', 'byte', 'synchronized', 'char', 'final',
			'interface', 'transient', 'const', 'float', 'long', 'short', 'volatile', 'arguments', 'encodeURI', 'Infinity',
			'Number', 'RegExp', 'Array', 'encodeURIComponent', 'isFinite', 'Object', 'String', 'Boolean', 'Error', 'isNaN',
			'parseFloat', 'SyntaxError', 'Date', 'eval', 'JSON', 'parseInt', 'TypeError', 'decodeURI', 'EvalError', 'Math',
			'RangeError', 'undefined', 'decodeURIComponent', 'Function', 'NaN', 'ReferenceError', 'URIError',
			'Context', 'Project', 'Lookup', 'Log','context', 'project', 'lookup', 'log','prompt',
			'abstract','arguments','boolean','break','byte',
			'case','catch','char','class','const',
			'continue','debuuger','default','delete','do',
			'double','else','enum','eval','export',
			'extends','false','final','finally','float',
			'for','function','goto','if','implements',
			'import','in','instanceof','int','interface',
			'let','long','native','new','null',
			'package','private','protected','public','return',
			'short','static','super','switch','synchronized',
			'this','throw','throws','transient','true',
			'try','typeof','var','void','volatile','while','with','yield',
			'Array','Date','eval','function','hasOwnProperty',
			'Infinity','isFinite','isNaN','isPrototypeOf','length',
			'Math','NaN','name','Number','Object','prototype','String','toString','undefined','valueOf',
			'getClass','java','JavaArray','javaClass','JavaObject','JavaPackage',
			'alert','all','anchor','anchors','area',
			'assign','blur','button','checkbox','clearInterval',
			'clearTimeout','clientInformation','close','closed','confirm',
			'constructor','crypto','decodeURI','decodeURIComponent','defaultStatus',
			'document','element','elements','embed','embeds',
			'encodeURI','encodeURIComponent','escape','event','fileUpload',
			'focus','form','forms','frame','innerHeight',
			'innerWidth','layer','layers','link','location',
			'mimeTypes','navigate','navigator','frames','frameRate',
			'hidden','history','image','images','offscreenBuffering',
			'open','opener','option','outerHerght','outerWidth',
			'packages','pageXOffset','pageYOffset','parent','parseFloat',
			'parseInt','password','pkcs11','plugin','prompt',
			'propertylsEnum','radio','reset','screenX','screenY','scroll','secure',
			'select','self','setInterval',
			'setTimeout','status','submit','taint','text',
			'textarea','top','unescape','untaint','window',
			'onblur','onclick','onerror','onfocus','onkeydown','onkeypress','onkeyup','onmouseover','onload','onmouseup','onmousedown','onsubmit']
	);
})(angular);