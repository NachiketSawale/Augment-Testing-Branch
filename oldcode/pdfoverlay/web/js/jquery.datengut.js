
/**Ende Dialog Timepicker und Datepicker**/
/**JQuery Erweiterungen**/
var oldShow = $.fn.show;
var oldHide = $.fn.hide;
var oldAppend = $.fn.append;
var oldAddClass = $.fn.addClass;
var oldRemoveClass = $.fn.removeClass;
var oldVal = $.fn.val;

/* Dom-Element schnell(!) leeren */
$.fn.clear = function() {
    if ($(this).length && !$.browser.msie)
        $(this)[0].innerHTML = "";
    return $(this);
};

$.fn.show = function(){
    var result = oldShow.apply( this, arguments );
    $(this).trigger("show", arguments);
    return result;
};

$.fn.hide = function(){
    var result = oldHide.apply( this, arguments );
    $(this).trigger("hide", arguments);
    return result;
};

$.fn.append = function(){
    var result = oldAppend.apply( this, arguments );
    $(this).trigger("appended");
    return result;
};

$.fn.addClass = function(){
    var result = oldAddClass.apply( this, arguments );
    $(this).trigger("addClass", arguments);
    return result;
};

$.fn.removeClass = function(){
    var result = oldRemoveClass.apply( this, arguments );
    $(this).trigger("removeClass", arguments);
    return result;
};

$.fn.val = function(){
    if($(this).is(":input:not([type='hidden'])")){
        if(arguments.length > 0){
            if(!(arguments.length > 1 && arguments[1] === 'historyUndo')){
                $(this).data("historyUndoReturnValue", $(this)[0].value);
                $(this).off("keydown.historyUndo").on("keydown.historyUndo", function(e){
                    if(e.ctrlKey && e.keyCode === 90){
                        $(this).off("input.historyUndo");
                        $(this).val($(this).data("historyUndoReturnValue"), 'historyUndo');
                        $(this).data("historyUndoReturnValue", null);
                        return false
                    }
                });
            }
        }
    }
    return oldVal.apply(this, arguments);
};

$.fn.forceRedraw = function(){
    $(this).hide().show(0);
    return $(this);
};

$.fn.zIndex = function( zIndex ) {
    if ( zIndex !== undefined ) {
        return this.css( "zIndex", zIndex );
    }

    if ( this.length ) {
        var elem = $( this[ 0 ] ), position, value;
        while ( elem.length && elem[ 0 ] !== document ) {
            // Ignore z-index if position is set to a value where z-index is ignored by the browser
            // This makes behavior of this function consistent across browsers
            // WebKit always returns auto if the element is positioned
            position = elem.css( "position" );
            if ( position === "absolute" || position === "relative" || position === "fixed" ) {
                // IE returns 0 when zIndex is not specified
                // other browsers return a string
                // we ignore the case of nested elements with an explicit value of 0
                // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                value = parseInt( elem.css( "zIndex" ), 10 );
                if ( !isNaN( value ) && value !== 0 ) {
                    return value;
                }
            }
            elem = elem.parent();
        }
    }

    return 0;
};

$.fn.reverse = [].reverse;

$.fn.smartresize = function(fn, name){
    var debounce = function(func, threshold, execAsap){
        var timeout;

        return function debounced(){
            var obj = this, args = arguments;

            function delayed(){
                if(!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if(timeout)
                clearTimeout(timeout);
            else if(execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, 50);
        };
    };
    return fn ? this.unbind('resize.' + name).bind('resize.' + name, debounce(fn)) : this.trigger(sr);
};

// Neues Event VOR allen anderen Events des Elements platzieren
$.fn.bindFirst = function(name, fn, stayFirst) {
    this.on(name, fn);
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        var handler = handlers.pop();
            handler["stayFirst"] = stayFirst

        if(handlers.length > 0){
            for(var i = 0; i < handlers.length; i++){
                if(typeof handlers[i].stayFirst === "undefined" || handlers[i].stayFirst == false){
                    handlers.splice(i, 0, handler);
                    break;
                }
            }
        }else{
                handlers.push(handler)
        }
    });
    return this;
};

//alterStyle
$.fn.extend({
    alterStyle: function(param, type, isImportant, setValue){
        if(typeof isImportant == "undefined")
            isImportant = null;

        if(typeof setValue == "undefined" || setValue == null)
            setValue = false;

        if(!$.isNumeric(param))
            setValue = true;

        if((typeof param != "undefined" && param != null && typeof type != "undefined" && type != null)
            && typeof setValue == "boolean"
            && (isImportant == null || (isImportant != null && typeof isImportant == "boolean"))){
            this.each(function(indx, item){
                var newStyle;

                // Berechneter Wert (calc)
                var style = $(item).attr("style");

                if(typeof style == "undefined" || style == null){
                    style = type + ":" + $(item).css(type) + ";";
                    $(item).attr("style", style)
                }

                if(style.indexOf(type) == -1){
                    style += type + ":" + $(item).css(type) + ";";
                    $(item).attr("style", style)
                }

                var regex = new RegExp(type + ":\\s?calc\\((\\+|-)?(\\d*\\.?\\d*)(px|%)\\s?(\\+|-)\\s?(\\d*\\.?\\d*)(px|%)\\)\\s?(.*?);");
                var matches = style.match(regex);

                if(matches !== null && matches.length == 8){
                    var newStyle;
                    if(setValue){
                        newStyle = type + ":" + param + ($.isNumeric(param) ? "px" : '') + (matches[7].indexOf("important") > -1 || isImportant ? " !important" : "") + ";";
                    }else{
                        if(matches[6] == "%" && matches[3] == "px"){
                            style = type + ":calc(" + matches[4] + matches[5] + matches[6] + " " + (matches[1] ? matches[1] : "+") + " " + matches[2] + matches[3] + ")" + (matches[7].indexOf("important") > -1 || isImportant ? " !important" : "") + ";";
                            matches = style.match(regex);
                        }

                        var newValue = (matches[3] == "+") ? parseInt(matches[5]) + param : parseInt(matches[5]) - param;
                        newStyle = type + ":calc(" + matches[2] + matches[3] + " " + matches[4] + " " + newValue + matches[6] + ")" + (matches[7].indexOf("important") > -1 || isImportant ? " !important" : "") + ";";
                    }
                    style = style.replace(matches[0], newStyle);
                    $(item).attr("style", style);
                }

                // einfacher Wert
                else{
                    regex = new RegExp(type + ":\\s?(\\+|-)?(\\d*\\.?\\d*)(px|%)\\s?(.*?);");
                    var matches = style.match(regex);
                    if(matches !== null && matches.length == 5){
                        var newStyle;
                        if(setValue){
                            newStyle = type + ":" + param + ($.isNumeric(param) ? "px" : '') + (matches[4].indexOf("important") > -1 || isImportant ? " !important" : "") + ";";
                        }else{
                            var newValue = ((matches[1] == "-") ? parseInt(matches[2]) - param : parseInt(matches[2]) + param);
                            newStyle = type + ":" + (matches[1] == "-" ? "-" : "") + newValue + matches[3] + (matches[4].indexOf("important") > -1 || isImportant ? " !important" : "") + ";";
                        }

                        style = style.replace(matches[0], newStyle);
                        $(item).attr("style", style);
                    }
                }
            });
        }
    }
});

//Events
$.fn.extend({
    functionsFromEvent: function(event, namespace){
        var result = [];

        if(typeof event == "undefined" || event == null)
            return null;

        this.each(function(){
            $.each($(this).getEvents(event), function(i, e){
                $.each(e, function(index, item){
                    if(typeof namespace == "undefined" || namespace == null || namespace == item.namespace)
                        result.push(item.handler)
                })
            })
        });
        return result
    },
    overrideFunctionsFromEvent: function(event, namespace, newFunction){
        var result = [];

        if(typeof event == "undefined" || event == null)
            return null;

        this.each(function(){
            $.each($(this).getEvents(event), function(i, e){
                $.each(e, function(index, item){
                    if(typeof namespace == "undefined" || namespace == null || namespace == item.namespace){
                        result.push(item.handler);

                        if(typeof newFunction != "undefined" && newFunction != null)
                            item.handler = newFunction;
                        else
                            item.handler = function(){
                            }

                    }
                })
            })
        });
        return result
    },
    getEvents: function(eventName){
        var result = [];
        this.each(function(){
            var data = jQuery.hasData(this) && jQuery._data(this);
            if(data){
                $.each(data.events, function(name, e){
                    if(eventName == name)
                        result.push(e)
                });
            }
        });
        return result
    }
});

$.fn.hasScrollBar = function() {
    return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
};

$.fn.completeWidth = function(){
	if(this === null || typeof this === "undefined" || this.length === 0)
		return -1;

	var ret = 0;
	$.each(this, function(){
		ret += $(this).width()
	});

	return ret
};

/**Ende Erweiterungen**/
/**Prototypes**/

Object.defineProperty(Object.prototype, "toBoolean", {
    value: function() {
        switch(this.constructor.name){
            case "Number":  return this > 0;
            case "String":  return /^(t(rue)?)|(on)|(1)|(j(a)?)/.test(this.toLowerCase().trim());
            case "Array":   return this.length > 0;
            case "Boolean": return this == true;
            case "Object ": return this != null && typeof this != "undefined";
            case "jQuery" : return this.length > 0;
        }

        return false;
    },
    enumerable : false
});

var oldFind = Array.prototype.find;
Array.prototype.find = function(value, attribute, returnAttributes, countElements){

	// MWA: im Standard erwartet array.find() eine Callback Funktion!
	if (typeof arguments[0] === "function")
    	return (typeof oldFind !== "undefined") ? oldFind.apply( this, arguments ) : null;

    if((value == null || typeof value === "undefined") &&
        (attribute == null || typeof attribute === "undefined"))
        return null;

    var buildReturns = function(object){
        var retArray = [];
        $.each(returnAttributes, function(i, v){
            if(v in object){
                retArray.push(object[v]);
            }
        });

        return retArray
    };

    var checkReturn = returnAttributes instanceof Array;
    var arr = this;
    var counter = arr.length;
    var helper = 0;
    var number = 0;
    var retCounter = 0;
    var toggle = true;
    var object;

    countElements = countElements === true && !checkReturn ? true : false;

    while(counter > 0){
        object= arr[number];

        if(attribute in object && object[attribute] == value){
            if(checkReturn)
                return buildReturns(object);
            else if(countElements)
                retCounter++;
            else
                return number;

            if(!countElements)
                return false
        }

        if(toggle){
            number = (counter-1)+helper;
            helper++
        }else{
            number = helper
        }

        counter--;

        toggle = !toggle
    }

    if(checkReturn)
        return [];
    else if(countElements)
        return retCounter;
    else
        return -1
};

Array.prototype.first = function(){
    return this[0]
};

Array.prototype.last = function(){
    return this[this.length-1]
};

Array.prototype.indexOfInsensitiv = function(searchVal){
    var index = 0;
    if(this.length==0 || searchVal=="")
        return -1;
    do{
        if(this[index]!="" && (this[index].toLowerCase() == searchVal.toLowerCase()))
            return index
    }while(++index < this.length);
    return -1;
};

//Merged zwei Arrays und übernimmt nur Array2-Elemente, die nicht in Array1 vorhanden sind
Array.prototype.distinctUnion = function(array2,controleStartArray){
    var array1 = [];
    if(controleStartArray === true){
        // Duplikate werden auch aus Array1 geworfen
        array1 = [].distinctUnion(this);
    }else {
        array1 = this.slice(); //Klon anlegen, um Arrays nicht zu verändern
    }
    var index = array2.length;
    while(--index > -1){
        if(array1.indexOf(array2[index])==-1){
            array1.push(array2[index])
        }
    }
    return array1
};

Array.prototype.removeAtIndex = function(index){
    var list = _list = [];

    list  = this.splice(0, index);
    _list = this.slice(index+1);

    return list.concat(_list)
};

String.prototype.format = function (args) {
    var str = this;
    return str.replace(new RegExp("{-?[0-9]+}", "g"), function(item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};

String.prototype.splice = function(index, length, newString){
    newString = newString != null && typeof newString == "string" ? newString : "";
    return  this.substr(0, index) + newString + this.substr(index+length)
};

String.prototype.reverse = function(){
    return this.split("").reverse().join("")
};

// String endsWith implementieren
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.contains = function(text){

    var str = "";
    $.each(this, function(i, v){
        str += v
    });

    if(str.indexOf(text) != -1)
        return true;
    else
        return false;
};

String.prototype.insert = function(text, position){
    text = text+"";
    position = parseInt(position);
    if(position == 0)
        return text + this;
    else if(position == this.length)
        return this + text;
    else
        return this.slice(0,position) + text + this.slice(position)
};

String.prototype.insertValue = function(value, start, end){
    if(typeof start == "undefined" || start == null)
        return this + checkObject(value, "string");

    end = end == null || typeof end == "undefined" ? start : end;

    return [this.slice(0, start), value, this.slice(end)].join("")
};

String.prototype.durationFromMillis = function(){
    var sec_num = parseInt(this, 10) / 1000;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num % 3600) / 60);
    var seconds = Math.floor(sec_num % 60);

    if(hours < 10){
        hours = "0" + hours;
    }
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
};

var fillToMaxWidthCache = {};
String.prototype.fillToMaxWidth = function(maxWidth, string,fontFamily, fontSize){
    var ret = fillToMaxWidthCache[this+"_"+maxWidth+"_"+string];
    if(ret != null && typeof ret != "undefined")
        return ret;

    var div = $("<div style='white-space:pre;position:absolute;top:-50px;left:0;font-family:" + fontFamily + ";font-size:" + fontSize + ";'>" + this + "</div>").appendTo($("body"));
    var str = this == "" ? string : this;

    if(div[0].clientWidth < maxWidth){
        while(div[0].clientWidth < maxWidth){
            str = " " + str;
            div.text(str)
        }

        div.remove();
        ret = str
    }else{
        while(div[0].clientWidth > maxWidth && str != ""){
            str = str.substr(0, str.length-1);
            div.text(str+string)
        }

        div.remove();
        ret = str+string
    }

    if(ret != null)
        fillToMaxWidthCache[this+"_"+maxWidth+"_"+string] = ret;

    return ret
};

String.prototype.digitSum = function(){
    var x = 0;
    $.each(this.split(""), function(){
        x += parseInt(this)
    });

    return x
};

String.prototype.autoAddSigns = function(sign, count){
    if(this == null || typeof this == "undefined")
        return;

    count = count == null || typeof count == "undefined" ? 4 : count;
    var result = "";
    $.each(this.split(""), function(i, v){
        result += (i > 0 && i%count==0 ? sign : "") + v
    });

    return result
};

/**Ende Prototypes**/