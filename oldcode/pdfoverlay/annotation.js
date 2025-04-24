//frei definierbare Variablen
var delay = 150;
var opacity = 35;
var annotationElementTextPadding = 4;
var areaIconSize = 16;
var borderMinWidth = 1;
var maxAreaBorderRadius = 10;
var defaultIconColor = "#333";
//Titel und Nachrichten
var title_createArea = translateMessage("annotation.title.create.area", "Notiz erstellen");
var title_createPin = translateMessage("annotation.title.create.pin", "Pin erstellen");

var title_color = translateMessage('annotation.title.color', 'Farbe');
var title_layer = translateMessage('annotation.title.layer', 'Ebene');
var title_layerUp = translateMessage('annotation.title.layerUp', 'Nach vorne');
var title_layerDown = translateMessage('annotation.title.layerUp', 'Nach hinten');
var title_minimize = translateMessage('annotation.title.minimize', 'Notiz minimieren');
var title_maximize = translateMessage('annotation.title.minimize', 'Notiz maximieren');
var title_editArea = translateMessage('annotation.title.editAreaText', 'Text bearbeiten');
var title_increaseFontSize = translateMessage('annotation.title.increaseFontSize', 'Schrift vergrößern');
var title_decreaseFontSize = translateMessage('annotation.title.decreaseFontSize', 'Schrift verkleinern');
var title_openDataset = translateMessage('annotation.title.editAreaDataset', 'Datensatz öffnen');
var title_remove = translateMessage('annotation.title.deleteArea', 'Notiz entfernen');
var title_saveText = translateMessage('annotation.title.annotationInputButtonOk', 'Text Speichern');
var title_removeText = translateMessage('annotation.title.annotationInputButtonCancel', 'Text Verwerfen');
var title_viewAnnotationsShow = translateMessage("annotation.title.show.annotations", "Markierung anzeigen");
var title_viewAnnotationsHide = translateMessage("annotation.title.hide.annotations", "Markierung ausblenden");
var title_viewAnnotationTextShow = translateMessage("annotation.title.show.annotationText", "Notiztext anzeigen");
var title_viewAnnotationTextHide = translateMessage("annotation.title.hide.annotationText", "Notiztext ausblenden");
var question_saveAnnotation_title = translateMessage("annotation.title.saveAnnotation", "Notiz Speichern");
var question_saveAnnotation = translateMessage("annotation.question.saveAnnotation", "Wollen Sie die Notiz Speichern?");
var question_deleteAnnotation_title = translateMessage("annotation.title.deleteAnnotation", "Markierung entfernen?");
var question_deleteAnnotation = translateMessage("annotation.question.deleteAnnotation", "Sind Sie sicher, dass Sie die Markierung dauerhaft entfernen möchten?");
var button_deleteAnnotation = translateMessage("annotation.delete.buttonYes", "Entfernen");

var content_readOnly = translateMessage("annotation.content.readOnly", "<b>Vorschaumodus:</b> zum Bearbeiten des Dokuments bitte den Datensatz öffnen!");

var icon_annotation = "fa fa-sticky-note";

var icon_annotations_show = "fa fa-eye";
var icon_annotations_hide = "fa fa-eye-slash";

var cursor_pen = "fa-pencil";

var annotationBar = '<div class="annotationBar doorHanger hidden" id="annotationBar">' +
    '<div class="splitToolbarButtonSeparator"></div>' +
    '<div id="annotation" class="toolbarButton" code="annotation.title.toggle.annotationText" title="' + title_viewAnnotationTextShow + '"><i class="toggleAnnotationButton"></i></div>' +
    '<div id="view" class="toolbarButton" code="annotation.title.toggle.annotations" title="' + title_viewAnnotationsHide + '"><i class="' + icon_annotations_hide + '"></i></div>' +
    '</div>';

var colorSelector = '<select name="colorSelect" class="toolbarField" id="optionBox_select_bg_color">' +
    '<option class="#ffff00" value="rgba(255,255,0,.' + opacity + ')" style="background: rgba(255,255,0,.' + opacity + ');" selected></option>' +
    '<option value="rgba(0,255,255,.' + opacity + ')" style="background: rgba(0,255,255,.' + opacity + ');"></option>' +
    '<option value="rgba(255,0,0,.' + opacity + ')" style="background: rgba(255,0,0,.' + opacity + ');"></option>' +
    '<option value="rgba(255,165,0,.' + opacity + ')" style="background: rgba(255,165,0,.' + opacity + ');"></option>' +
    '<option value="rgba(0,255,0,.' + opacity + ')" style="background: rgba(0,255,0,.' + opacity + ');"></option>' +
    '<option value="rgba(0,0,0,.' + opacity + ')" style="background: rgba(0,0,0,.' + opacity + ');"></option>' +
    '</select>'

var optionBox = '<div class="optionBox doorHanger" id="optionBox" style="display:none;">' +
    '<label for="colorSelect" class="toolbarLabel colorSelect" code="annotation.title.color" style="display: none;">' + title_color + '</label>' + colorSelector +
    '<label class="toolbarLabel posLabel" code="annotation.title.layer" style="display: none;">' + title_layer + '</label>' +
    '<div class="splitToolbarButton">' +
    '<button id="indexUp" class="toolbarButton" code="annotation.title.layerUp" title="' + title_layerUp + '" onclick="changeIndex(true);"><i class="fa fa-arrow-up"></i></button>' +
    '<div class="splitToolbarButtonSeparator"></div>' +
    '<button id="indexDown" class="toolbarButton" code="annotation.title.layerDown" title="' + title_layerDown + '" onclick="changeIndex(false);"><i class="fa fa-arrow-down"></i></button>' +
    '</div>' +
    '<button id="toggleAnnotationSizeButton" class="toolbarButton" code="annotaiton.title.toggleAnnotation" title="' + title_minimize + '"><i class="fa fa-compress"></i></button>' +
    '<button id="editTextButton" class="toolbarButton" code="annotaiton.title.editAreaText" title="' + title_editArea + '" onclick="editAnnotation()"><i class="fa fa-i-cursor"></i></button>' +
    '<div id="changeFontSize" class="splitToolbarButton">' +
    '<button id="increaseFontSize" class="toolbarButton" code="annotation.title.increaseFontSize" title="' + title_increaseFontSize + '" onclick="changeFontSize(true);"><i class="fa fa-font"></i></button>' +
    '<div class="splitToolbarButtonSeparator"></div>' +
    '<button id="decreaseFontSize" class="toolbarButton" code="annotation.title.decreaseFontSize" title="' + title_decreaseFontSize + '" onclick="changeFontSize(false);"><i class="fa fa-font"></i></button>' +
    '</div>' +
    '<button id="editDatasetButton" class="toolbarButton" code="annotation.title.editAreaDataset" title="' + title_openDataset + '" onclick="openAnnotation()"><i class="fa fa-cog"></i></button>' +
    '<button id="deleteButton" class="toolbarButton" code="annotation.title.remove" title="' + title_remove + '" onclick="showDelete()"><i class="fa fa-trash-o"></i></button>' +
    '</div>';



//--- variablen für die laufzeit ---//
var startIndex = 10;

var minPinSize = -1
var docViewer = null;

var cursorType = cursor_pen;
var cursorId = null
var cursor = "";

var startX = 0, startY = 0;

var mouseDown = false;
var boxIsEdit = false;

var list = {};
var origList = {};
var callbackList = {};
var overlays = {};
var observer = {
    _pageList: {},
    addInitPageObserver: function (defer, page, isThumb) {
        isThumb = isThumb === true
        if (typeof observer._pageList[page + "_" + isThumb] == "undefined")
            observer._pageList[page + "_" + isThumb] = []

        observer._pageList[page + "_" + isThumb].push(defer)

        var target = $(getPage(page, isThumb))
        var _observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName == "data-loaded" && (target.attr("data-loaded") === true || target.attr("data-loaded") === "true")) {
                    $.each(observer._pageList[page + "_" + isThumb], function () {
                        defer.resolve()
                    })
                    _observer.disconnect();
                }
            });
        });
        _observer.observe(target[0], {attributes: true});
    },
    _list: {},
    observer: new MutationObserver(function (mutations) {
        var _observer = observer
        $.each(mutations, function () {
            if (this.type == "attributes" && $(this.target).attr("data-loaded") === "true") {
                var uids = _observer._list[$(this.target).attr("data-page-number")]
                if (uids != null && typeof uids != "undefined" && uids.length > 0) {
                    $.each(uids, function () {
                        drawAnnotation(this)
                    })
                }
            }
        })
    }),
    add: function (uid, pageIdx) {
        var _observer = this
        $.when(isDone("page", pageIdx)).done(function () {
            if (_observer._list[pageIdx] == null || typeof  _observer._list[pageIdx] == "undfined")
                _observer._list[pageIdx] = []

            if (_observer._list[pageIdx].indexOf(uid) == -1) {
                var page = getPage(pageIdx)
                $.each(page, function () {
                    _observer.observer.observe(this, {attributes: true, attributeFilter: ['data-loaded']})
                })

                _observer._list[pageIdx].push(uid)
            }
        })
    }
}
//--- ende variablen für laufzeit ---//

var scale = null

$(function () {
    $.widget("custom.selectmenu", $.ui.selectmenu, {
        _renderItem: function (ul, item) {
            var li = $("<li style='font-size:0;line-height:0;'>", {text: item.div});

            if (item.disabled) {
                li.addClass("ui-state-disabled");
            }

            $("<div>", {
                style: "background:" + item.value + ";",
                "class": "colorDiv"
            }).appendTo(li).wrap("<div class='colorWrapper'></div>");

            return li.appendTo(ul);
        }
    });
});

function getPage(page, isThumb) {
    return $((isThumb === true ? "#sidebarContainer a[href='#page=" + page + "'] .thumbnail" : "#viewerContainer .page[data-page-number='" + page + "']"))
}

function pageExists(page) {
    var page = $(getPage(page))
    return !(typeof page == "undefined" || page == null || page.length == 0)
}

var initVars = {
    "documentReady": false,
    "documumentInitDone": false,
    "initDone": false,
    "annotation": function (id, isThumb) {
        return $("#" + id + (isThumb ? "_thumb" : "")).length > 0;
    },
    "page": function (page, isThumb) {
        return page = getPage(page, isThumb), page.attr("data-loaded") === true || page.attr("data-loaded") === "true";
    },
    "proxy": function () {
        return PDFViewerApplication.pdfDocument != null
    }
};

function isDone(inits, id, isThumb) {
    var defer = $.Deferred()
    var list = typeof inits == "string" ? [inits] : Array.isArray(inits) ? inits : null

    var counter = 0

    function run() {
        counter = counter > 49 ? 50 : counter + 1
        if (list == null) {
            defer.reject()
            return
        }

        var x = true
        $.each(list, function (idx, val) {
            x = x && (typeof initVars[val] == "boolean" ? initVars[val] : initVars[val](id, isThumb))
        })

        if (x) {
            defer.resolve()
            observer.observer
        } else {
            if (counter == 50 && inits == "page")
                observer.addInitPageObserver(defer, id, isThumb)
            else
                setTimeout(run, 1 + (counter * 10))
        }
    }

    run()
    return defer.promise()
}

$(document).ready(function () {
    isDone(["initDone", "proxy"]).done(function () {
        PDFViewerApplication.pdfDocument.getPage(1).then(function (pdfPage) {
            isDone("page", 1).done(function () {
                scale = function (page, isThumb) {
                    var item = typeof page == "string" || typeof page == "number" ? getPage(page, isThumb) : page
                    var unscaledViewport = pdfPage.getViewport(1);

                    var h = num(item.css("height")) / unscaledViewport.height
                    var w = num(item.css("width")) / unscaledViewport.width

                    return Math.min(h, w)
                }
                initVars.documentReady = true
            })
        });
    })
});

function initDocument(isReadOnly) {
    if (!$("#outerContainer").hasClass("sidebarOpen"))
        $("#annotationContainer, #readOnly").addClass("fullSize")

    $(document).on("keydown", function (event) {
        if (event.key == "r" && $(".edit-text").length == 0 && !$("#findInput").is(":focus") && event.target.type != "textarea") {
            event.preventDefault()
            event.stopImmediatePropagation()
            event.bubble = false
            return false
        }
    })

    $(document).on("mousewheel DOMMouseScroll", function (event) {
        if (event.ctrlKey) {
            event.preventDefault()
            event.stopPropagation()

            var zoomIn = event.originalEvent.type == "mousewheel" ? event.originalEvent.wheelDelta > 0 : event.originalEvent.detail > 0

            if (zoomIn)
                $("#zoomIn").trigger("click")
            else
                $("#zoomOut").trigger("click")

        }
    })

    var windowResizeTimeout = null
    $(window).on("resize", function (event) {
        if (event.target != window)
            return

        var container = $("#outerContainer");
        var width = container.width();

        if (windowResizeTimeout != null)
            clearTimeout(windowResizeTimeout)

        windowResizeTimeout = setTimeout(function () {
            // hat sich die Größe in den letzten 25ms nicht mehr geändert, ist der Resize durch!
            if (container.width() == width)
                reload();
        }, 25);
    });

    $("#sidebarToggle").on("click", function (event) {
        if (!$("#annotationBar").hasClass("hidden"))
            $("#annotationButton").trigger("click", true)

        //Timeout, da sonst beim trigger, die hasClass falsches ergebniss liefert
        setTimeout(function () {
            if ($("#outerContainer").hasClass("sidebarOpen")) {
                $("#annotationContainer, #readOnly").removeClass("fullSize")
                drawThumbs();
            } else
                $("#annotationContainer, #readOnly").addClass("fullSize")
        }, 0)

        toggleOptionBox(false);
    });

    if (!initVars.documumentInitDone) {
        if (!isReadOnly) {
            // Button hinzufügen
            $("#sidebarToggle").after('<button style="display:none" id="annotationButton" class="toolbarButton"><i class="' + icon_annotation + '"></i></button>');

            $("#mainContainer").prepend(annotationBar);
            $("#mainContainer").prepend(optionBox);


            //ColorSelectBox erstellen
            $("#optionBox_select_bg_color").selectmenu({
                create: function (event, ui) {
                    $("#optionBox_select_bg_color-button").addClass("dropdownToolbarButton");
                    $("#optionBox_select_bg_color-button").children().first().remove();
                    $("#optionBox_select_bg_color-button").append('<div id="colorOverlayWrapper"><div id="colorOverlay"></div></div>');
                }, position: {my: "top", at: "bottom+2", collision: 'flip'}
            });

            $("#optionBox_select_bg_color").on("selectmenuselect", function (event, ui) {
                event.stopPropagation()
                event.preventDefault()
                if (typeof  event.which != "undefined" && !compareColor(ui.item.value, $(".focusedAnnotation").css("background-color"))) {
                    var annotation = $(".focusedAnnotation")
                    annotation.css("background-color", ui.item.value);
                    $("#colorOverlay").css("background-color", ui.item.value);
                    setStyleInfo(annotation);
                    drawThumbs(annotation.attr("id"));
                    annotation.addClass("focusedAnnotation")
                    toggleOptionBox()
                }
            });

            //Events
            $(".annotationSpinnerOverlay").on("click dblclick mousedown mouseup", function (event) {
                event.stopPropagation()
                event.preventDefault()
                event.bubble = false
            })

            $("#viewer").on("mousemove", ".annotationSpinnerOverlay", function (event) {
                var x = null
                var page = $(event.target).parents(".page").attr("id")

                $.each($("#" + page + " .annotationArea:not(.annotationThumbElement)"), function (idx, item) {
                    if (event.clientX > $(item).offset().left &&
                        event.clientX < $(item).offset().left + $(item).width() &&
                        event.clientY > $(item).offset().top &&
                        event.clientY < $(item).offset().top + $(item).height()) {
                        x = x == null ? item : parseInt($(item).css("z-index")) > parseInt($(x).css("z-index")) ? item : x
                    }
                })

                $(".annotationArea:not(.annotationThumbElement)").trigger("mouseout")
                if (x != null)
                    $(x).trigger("mouseover")
            })

            $("#viewer").on("mouseout", ".annotationSpinnerOverlay", function (event) {
                $(".annotationArea:not(.annotationThumbElement)").trigger("mouseout")
            });

            $(document).on("keyup", function (event) {
                function run() {
                    $("#viewer").removeClass("createArea");
                    $("#viewer").removeClass("Pin");
                    $("#viewer").removeClass("createStamp");
                    $(".focusedAnnotation").removeClass("focusedAnnotation");
                    $("#annotationButton").removeClass("toggled");
                    $("#annotationBar").addClass("hidden");
                    toggleOptionBox(false);
                    $("#viewer").trigger("mouseup");
                }

                if ($(".focusedAnnotation").length > 0 && $(".edit-text").length == 0) {
                    switch (event.key) {
                        case 'Delete':
                            showDelete();
                            break;
                        case '+' :
                            changeIndex(true);
                            break;
                        case '-' :
                            changeIndex(false);
                            break;
                    }
                }

                //Wenn ein neues element doch nicht Angelegt werden soll, per ESC abbrechen
                if (event.keyCode == 27) {
                    if ($(".edit-text").length > 0)
                        askForCompleteEditAnnotation(run)
                    else
                        run()
                }

                if (event.altKey && $(".edit-text").length == 0) {
                    switch (event.key) {
                        case "a" :
                        case "A" :
                            $("#annotation").trigger("click");
                            break;
                        case "n" :
                        case "N" :
                            $("#area").trigger("click");
                            break;
                        case "v" :
                        case "V" :
                            $("#view").trigger("click");
                            break;
                    }
                }
            });

            $(document).on("click", function (event) {
                function run() {
                    $(".focusedAnnotation").removeClass("focusedAnnotation");
                    $("#annotationButton").trigger("click", [true, true])
                    toggleOptionBox();
                }

                if ($(".edit-text").length > 0) {
                    if (!($(event.target).parents("#annotationContainer").length > 0 || $(event.target).attr("id") == "annotationContainer")) {
                        if ($(event.target).hasClass(".annotationElement") || $(event.target).parents(".annotationElement").length > 0)
                            askForCompleteEditAnnotation(function () {
                                run()
                                $(event.target).trigger("click")
                            })
                        else
                            askForCompleteEditAnnotation(run)
                    }
                    return
                }

                run()
            });

            $("#annotationButton").on("click", function (event, checkSidebarToggle, close) {
                event.stopPropagation()
                if (!checkSidebarToggle)
                    closeInnerSideBar()

                $("#viewer").removeClass("createArea");
                $("#viewer").removeClass("createPin");

                toggleOptionBox(false);
                $("#viewer").trigger("mouseup");

                if (!$("#annotationBar").hasClass("hidden") || close) {
                    $("#annotationButton").removeClass("toggled");
                    $("#annotationBar").addClass("hidden");
                } else {
                    if ($("#viewFind").hasClass("toggled"))
                        $("#viewFind").click();

                    $("#annotationBar").removeClass("hidden");
                    $("#annotationButton").addClass("toggled");

                    $("#annotationBar").position({
                        my: "left top",
                        at: "left bottom+7",
                        of: $("#annotationButton")
                    });
                }
            });

            /*
            $("#viewFind").on("click", function(){
                $("#annotationBar").addClass("hidden");
                $("#annotationButton").removeClass("toggled");

                toggleOptionBox(false);
            });
            */

            var size;
            $("#viewer").on("mousemove", ".drawer", function (event) {
                if ($("#cursor").length < 1) {
                    var cursorProp = $("#" + cursorId).data("properties")
                    var _scale = scale(parseInt($(this).parent().attr("data-page-number")))

                    cursor = $('<div id="cursor" class="' + cursorType + '" style="z-index:99998;"></div>')

                    if ($("#viewer").hasClass("createPin")) {
                        size = cursorProp.iconSize
                        size = size > minPinSize ? size : minPinSize

                        var borderRadius = getBorderRadius(cursorProp, _scale, true)
                        borderRadius = cursorProp.iconSize == cursorProp.borderRadius ? borderRadius > minPinSize ? borderRadius : minPinSize : borderRadius

                        cursor.css({
                            color: cursorProp.iconColor,
                            width: size,
                            height: size,
                            fontSize: size,
                            border: getBorder(cursorProp, _scale),
                        })

                        if (cursor.css("border").indexOf("none") == -1) {
                            cursor.css({
                                borderRadius: borderRadius,
                                padding: (annotationElementTextPadding)
                            })
                        }

                        cursor.addClass("annotationElement")
                        cursor.css("transform-origin", "0 0")
                        cursor.css("transform", "scale(" + _scale + ")")
                    } else {
                        var _scale = scale(parseInt($(this).parent().attr("data-page-number")))
                        if (cursorProp.width != null && typeof cursorProp.width != "undefined" && cursorProp.height != null && typeof cursorProp.height != "undefined") {
                            $("#viewer").addClass("createStamp")
                            cursor.addClass("stamp annotationElement")
                            cursor.removeClass("fa fa-pencil")
                            cursor.css({
                                backgroundColor: cursorProp.bgColor,
                                width: cursorProp.width,
                                height: cursorProp.height,
                            })

                            cursor.css("background-color", getBgColor(cursor))
                            cursor.css("border", getBorder(cursorProp, _scale))

                            appendAreaIcon(cursor, cursorProp, _scale)
                            setTextElement(cursor, cursorProp, _scale)

                            cursor.css("transform-origin", "0 0")
                            cursor.css("transform", "scale(" + _scale + ")")
                        } else {
                            cursor.css({
                                color: "#333",
                                width: areaIconSize,
                                height: areaIconSize,
                                fontSize: areaIconSize,
                            })
                        }

                        cursor.css("border-radius", getBorderRadius(cursorProp, _scale, false))
                    }

                    $(cursor).insertBefore($(this));
                }

                if ($("#viewer").hasClass("createStamp") || $("#viewer").hasClass("createPin")) {
                    if (num($("#cursor").css("height")) / 2 > event.offsetY) {
                        $("#cursor").css("top", 0);
                    } else if ($("#cursor").outerHeight() / 2 + event.offsetY > $(this).height()) {
                        $("#cursor").css("top", $(this).height() - $("#cursor").outerHeight());
                    } else {
                        $("#cursor").css("top", event.offsetY - num($("#cursor").css("height")) / 2);
                    }
                } else
                    $("#cursor").css("top", event.offsetY - num($("#cursor").css("height")));

                if ($("#viewer").hasClass("createStamp") || $("#viewer").hasClass("createPin"))
                    if (num($("#cursor").css("width")) / 2 > event.offsetX) {
                        $("#cursor").css("left", 0);
                    } else if ($("#cursor").outerWidth() / 2 + event.offsetX > $(this).width()) {
                        $("#cursor").css("left", $(this).width() - $("#cursor").outerWidth());
                    } else {
                        $("#cursor").css("left", event.offsetX - num($("#cursor").css("width")) / 2);
                    }
                else if ($("#viewer").hasClass("createArea"))
                    $("#cursor").css("left", event.offsetX);
            });

            $("#viewer").on("mouseout", ".drawer", function (event) {
                $("#cursor").remove();
            });

            $("#viewer").on("mousedown", ".drawer", function (event) {
                var number = $(this).parent(".page").attr("data-page-number")
                var page = getPage(number)
                var _scale = scale(number)

                var prop = $("#" + cursorId).data("properties")

                startY = event.offsetY;
                startX = event.offsetX;

                mouseDown = true;

                if ($("#viewer").hasClass("createStamp") || $("#viewer").hasClass("createPin")) {
                    var cursor = $("#cursor")

                    cursor.attr("id", "newAnnotationElement")
                    cursor.addClass("annotationElement")
                    cursor.css("position", "absolute")

                    if ($("#viewer").hasClass("createStamp")) {
                        cursor.addClass("annotationArea")
                        cursor.removeClass("area stamp")
                    } else {
                        cursor.attr("class", "")
                        cursor.append("<i class='" + cursorType + "'></i>")
                        cursor.children().removeClass("pin")
                        cursor.addClass("annotationPin annotationElement")
                    }

                    $(this).trigger("mouseup")
                } else if ($("#viewer").hasClass("createArea")) {

                    var a = $("<div id='newAnnotationElement' class='annotationElement annotationArea' style='border:" + getBorder(prop, _scale) + ";z-index:89;position:absolute;top:" + (startY) + "px;left:" + (startX) + "px;width:0px;height:0px;'></div>")
                    $(a).css("background-color", prop.bgColor)
                    $(a).css("background-color", getBgColor($(a)))
                    $(a).css("border-radius", getBorderRadius(prop, _scale, false))
                    if ($("#viewer").find("#newAnnotationElement").length == 0)
                        page.append(a);

                    if (prop.inlineEdit) {
                        $(a).prepend(markIcon);
                        $(a).blur(function () {
                            saveMarkAnnotation();
                        });
                    }

                    appendAreaIcon(a, prop, _scale)
                    setTextElement(a, prop, _scale)

                    $(a).css("transform-origin", "0 0")
                    $(a).css("transform", "scale(" + _scale + ")")
                }
            });

            $("#viewer").on("mousemove", ".drawer", function (event) {
                if (mouseDown) {
                    var number = $(this).parent(".page").attr("data-page-number")
                    var page = getPage(number)
                    var _scale = scale(number)

                    if ($("#viewer").hasClass("createArea")) {
                        var width = (event.offsetX - startX) / _scale;
                        var height = (event.offsetY - startY) / _scale;

                        if (event.offsetX > 0 && event.offsetX < num(page.css("width"))) {
                            if (width < 0) {
                                $("#newAnnotationElement").css("left", event.offsetX);
                                $("#newAnnotationElement").css("width", width * (-1));
                            } else {
                                $("#newAnnotationElement").css("left", startX);
                                $("#newAnnotationElement").css("width", width);
                            }
                        } else {
                            if (event.offsetX > 0)
                                $("#newAnnotationElement").css("width", (num(page.css("width")) - startX - 2));
                            else {
                                $("#newAnnotationElement").css("width", (width * (-1)) + event.offsetX);
                                $("#newAnnotationElement").css("left", 0);
                            }
                        }

                        if (event.offsetY > 0 && event.offsetY < num(page.css("height"))) {
                            if (height < 0) {
                                $("#newAnnotationElement").css("top", event.offsetY);
                                $("#newAnnotationElement").css("height", height * (-1));
                            } else {
                                $("#newAnnotationElement").css("top", startY);
                                $("#newAnnotationElement").css("height", height);
                            }
                        } else {
                            if (event.offsetY > 0)
                                $("#newAnnotationElement").css("height", (num(page.css("height")) - startY - 2));
                            else {
                                $("#newAnnotationElement").css("height", (height * (-1)) + event.offsetY);
                                $("#newAnnotationElement").css("top", 0);
                            }
                        }
                    }
                }
            });

            $("#viewer").on("mouseup", function (event) {
                mouseDown = false;
                $("#cursor").remove();

                $("#viewer .textLayer").children().removeClass("deselect");
                $(".ui-draggable:not(.minimized)").draggable("enable");
                $(".ui-resizable:not(.minimized)").resizable("enable");

                $(".drawer").remove();

                if ($("#newAnnotationElement").length > 0) {
                    var element = $("#newAnnotationElement")
                    if (num(element.css("width")) == 0 || num(element.css("height")) == 0) {
                        element.remove()
                        return
                    }

                    var properties = $("#" + cursorId).data("properties")
                    properties["allowEdit"] = true
                    properties["allowDelete"] = true

                    var page = parseInt(element.parent().attr("data-page-number"))

                    var date = new Date()
                    var id = date.getTime()

                    var index = startIndex + getPage(page).children(".annotationElement").length - 1

                    var _scale = scale(page)

                    var type = ""
                    var color = null
                    var editText = null
                    var fixWH = false

                    var padding = 0

                    if (element.hasClass("annotationArea")) {
                        setJQueryUI(element, page, properties);

                        type = "annotationArea"
                        color = element.css("background-color");
                        fixWH = $("#viewer").hasClass("createStamp")

                        if (element.children(".annotationElementText").length > 0)
                            editText = element.children(".annotationElementText").data("filledText")

                        $("#viewer").removeClass("createArea createStamp");
                    } else if (element.hasClass("annotationPin")) {
                        type = "annotationPin";

                        element.removeClass("hidden");
                        element.draggable({
                            containment: getPage(page),
                            start: startDrag,
                            drag: drag,
                            stop: function (event, ui) {
                                stopEditBox(this, ui);
                            }
                        });
                        $("#viewer").removeClass("createPin");

                        padding = element.css("border").indexOf("none") == -1 ? annotationElementTextPadding : 0
                    }

                    if ($("#view").hasClass("annotationHide"))
                        element.addClass("stay-visible");

                    element.css("z-index", index);

                    var prop = {
                        id: id,
                        page: page,
                        type: type,
                        width: fixWH ? properties.width : num(element.css("width")) /*/ _scale*/,
                        height: fixWH ? properties.height : num(element.css("height")) /*/ _scale*/,
                        top: num(element.css("top")) / _scale,
                        left: num(element.css("left")) / _scale,
                        backgroundColor: color,
                        editText: editText,
                        fontSize: properties.fontSize,
                        index: index,
                        source: properties
                    }

                    cursorId = null

                    prop["top"] = calcTopLeft(prop.top, prop.height, element, "top", false, padding)
                    prop["left"] = calcTopLeft(prop.left, prop.width, element, "left", false, padding)

                    list[id] = prop

                    element.attr("id", id);

                    if ($("#outerContainer").hasClass("sidebarOpen"))
                        drawThumbs(id);

                    createAnnotation(prop)
                }
            });

            $("#viewer").on("click", ".annotationElement", function (event) {
                if ($(".edit-text").length > 0)
                    return

                event.stopPropagation();
                $("#annotationButton").trigger("click", [true, true])
                closeInnerSideBar()

                $(".annotationElement").removeClass("dragAllowed");
                $(".annotationElement").children().removeClass("dragAllowed");

                if ($(this).hasClass("focusedAnnotation")) {
                    $(".annotationElement").removeClass("focusedAnnotation");
                } else {
                    $(this).addClass("focusedAnnotation");
                    $(".annotationElement").not(this).removeClass("focusedAnnotation");
                }

                toggleOptionBox();
            });

            $("#viewer").on("dblclick", ".annotationElement", function (event) {
                var prop = list[$(this).attr("id")]
                if ($(this).find(".annotationElementText").length == 0 || !prop.allowEdit || prop.isHTMLStamp === true)
                    return false

                event.stopPropagation();
                closeInnerSideBar()

                $(".annotationElement").removeClass("dragAllowed");
                $(".annotationElement").children().removeClass("dragAllowed");

                $(".annotationElement").removeClass("focusedAnnotation");
                $(this).addClass("focusedAnnotation");

                toggleOptionBox(false)
                editAnnotation()
            })

            $("#viewer").on("mouseover", ".annotationArea", function (event) {
                if (!innerAnnotation() || $(".edit-text").length > 0)
                    return

                $("#annotationText").val(getAnnotationText(event.currentTarget))
            })

            $("#viewer").on("mouseleave", ".annotationElement", function (event) {
                if ($(".edit-text").length > 0)
                    return

                if ($(".focusedAnnotation").length > 0)
                    $("#annotationText").val(getAnnotationText($(".focusedAnnotation")))
                else
                    $("#annotationText").val("")
            })

            $("#annotation_text").on("click", function (event) {
                toggleInnerAnnotation(false)
            })

            $("#annotationBar").on("click", " .toolbarButton", function (event) {
                event.stopPropagation()

                function hide() {
                    $("#annotationBar").addClass("hidden");
                    $("#annotationButton").removeClass("toggled");
                    $("#areaMenu").hide()
                    $("#area").removeClass("toggled")
                }

                if ($(event.currentTarget).attr("id") == "view") {
                    if ($(event.currentTarget).hasClass("annotationHide")) {
                        $(event.currentTarget).children("i").attr("class", icon_annotations_hide)
                        $(event.currentTarget).attr("title", title_viewAnnotationsHide)
                        $(".annotationElement").removeClass("hidden");
                        $(event.currentTarget).removeClass("annotationHide");
                    } else {
                        $(event.currentTarget).children("i").attr("class", icon_annotations_show)
                        $(event.currentTarget).attr("title", title_viewAnnotationsShow)
                        $(".annotationElement").addClass("hidden");
                        $(event.currentTarget).addClass("annotationHide");
                    }
                    hide()
                } else if ($(event.currentTarget).attr("id") == "annotation") {
                    toggleInnerAnnotation(false)
                    hide()
                } else if ($(event.currentTarget).attr("id") == "area") {
                    $("#areaMenu").toggle()
                    $(event.currentTarget).toggleClass("toggled")

                    $("#areaMenu").position({
                        my: "left top+4",
                        at: "left bottom",
                        of: $("#annotationBar")
                    })
                } else {
                    if ($(event.currentTarget).hasClass("createArea")) {
                        $("#viewer").addClass("createArea");
                        cursorType = "fa " + cursor_pen + " area";
                    } else if ($(event.currentTarget).hasClass("createPin")) {
                        $("#viewer").addClass("createPin");
                        cursorType = $(event.currentTarget).data("properties").icon + " pin";
                    }

                    if ($("#viewer").hasClass("createArea") || $("#viewer").hasClass("createPin")) {
                        cursorId = $(event.currentTarget).attr("id")

                        $("#viewer").find(".textLayer").children().addClass("deselect");

                        $(".ui-draggable").draggable("disable");
                        $(".ui-resizable").resizable("disable");

                        $("#viewer").children(".page").append("<div class='drawer' style='z-index:99998;position:absolute;width:100%;height:100%;top:0px;left:0px;'></div>");
                        $("#cursor").css("display", "block");
                    }

                    hide()
                }
            });

            $("#optionBox").on("click", function (event) {
                event.stopPropagation();
            });

            $("#sidebarContainer").on("mouseenter", ".annotationThumbElement", function (event) {
                var id = $(event.currentTarget).attr("id")
                id = id.replace("_thumb", "")

                $("#" + id).trigger("mouseenter")

                if ($("#view").hasClass("annotationHide"))
                    $("#" + id).removeClass("hidden")
            })

            $("#sidebarContainer").on("mouseleave", ".annotationThumbElement", function (event) {
                $(".annotationElement").trigger("mouseleave")

                if ($("#view").hasClass("annotationHide"))
                    $(".annotationElement:not(.stay-visible)").addClass("hidden")
            })

            $("#viewerContainer").scroll(function (event) {
                if (!boxIsEdit || $(".focusedAnnotation.ignoreScroll").length == 0) {
                    $(".focusedAnnotation").removeClass("focusedAnnotation")
                    toggleOptionBox(false);

                    /*
                    toggleOptionBox();

                    if(num($("#optionBox").css("top")) - 32 < 0 || num($("#optionBox").css("top")) + 28 > $("#viewerContainer").height())
                    */
                } else {
                    var cls = $(".focusedAnnotation.ignoreScroll").attr("class")
                    cls = cls.replace("focusedAnnotation", "")
                    cls = cls.replace("ignoreScroll", "")

                    $(".focusedAnnotation.ignoreScroll").attr("class", cls)
                }

                if ($("#optionBox_select_bg_color").hasClass("selectmenu-button-open"))
                    $("#optionBox_select_bg_color").selectmenu("close");

                if ($(".edit-text").length > 0)
                    toggleOptionBox(false)
            });

            $("#annotationText").on("keyup", function (event) {
                setAnnotationElementText($(this).val())
                $(this).addClass("changed")
            })

            $("#toggleAnnotationSizeButton").on("click", function (event, setFocus) {
                var annotation = $(".focusedAnnotation")
                annotation.removeClass("focusedAnnotation")
                toggleOptionBox()

                if (annotation.hasClass("minimized")) {
                    annotation.removeClass("minimized")

                    if (annotation.hasClass("ui-draggable"))
                        annotation.draggable("enable");

                    if (annotation.hasClass("ui-resizable"))
                        annotation.resizable("enable");

                    if (setFocus) {
                        annotation.addClass("focusedAnnotation")
                        toggleOptionBox(true)
                    }
                } else {
                    annotation.addClass("minimized")

                    if (annotation.hasClass("ui-draggable"))
                        annotation.draggable("disable");

                    if (annotation.hasClass("ui-resizable"))
                        annotation.resizable("disable");
                }

                updateToggleSizeButton()
            })
        } else {
            $("#viewer").on("dblclick", ".annotationElement", function () {
                var prop = list[$(this).attr("id")]
                if (prop.source.allowOpen)
                    getPromise(prop, "open")
            })
        }

        initVars.documumentInitDone = true
    }
}

function setTextElement(element, prop, _scale) {
    if (prop.fontSize != null && typeof prop.fontSize != "undefined") {
        element = $(element)
        var textElement = $("<div class='annotationElementText'></div>")

        element.append(textElement)
        calcTextElement(textElement.parent(".annotationElement"), prop, _scale)

        var text = getFilledAnnotationText(prop)
        textElement.data("filledText", text)
        setAnnotationElementText(text, textElement)
    }
}

function getAnnotationList() {
    return list
}

function init(viewer, minPinsize, annotationList, isReadOnly, openCallback) {
    if (!initVars.initDone) {
        minPinSize = minPinsize == null || typeof minPinsize == "undefined" ? minPinSize : minPinsize

        if (viewer != null && typeof viewer != "undefined" && $(viewer).is("iframe")) {
            docViewer = $(viewer)
            initVars.initDone = true
            isDone("documentReady").done(function () {
                initDocument(isReadOnly === true)
            })

            if (annotationList != null && typeof annotationList != "undefined") {
                list = annotationList
                origList = $.extend({}, annotationList)
                isDone("documumentInitDone").done(function () {
                    reload()
                })
            }

            if (isReadOnly === true) {
                isDone("page", 1).done(function () {
                    var div = $("<div id='readOnly'><span><i class='fa fa-info-circle' style='margin-right:5px;margin-left:2px;font-size:14px;color:#464646;'></i>" + content_readOnly + "</span></div>");

                    if (openCallback == null || typeof openCallback == "undefined") {
                        var i = $("<i class='fa fa-cog' title='" + title_openDataset + "'></i>").on("click", openCallback);
                        div.append(i)
                    }

                    div.insertBefore("#viewerContainer");
                    $("#viewerContainer").css("top", 61);
                })
            }
        }
    }
}

function addAnnotationSource(params) {
    isDone("documumentInitDone").done(function () {

        params.icon = !params.icon ? null : params.icon.indexOf("fa ") > -1 ? params.icon : "fa " + params.icon;

        if (!params.title)
            params.title = params.isPin ? title_createPin : title_createArea;

        var source = $('<div id="' + params.sourceId + '" class="toolbarButton ' + (params.isPin ? "createPin" : "createArea") + '" code="annotation.title.create.' + (params.isPin ? "pin" : "area") + '" title="' + params.title + '"><i class="' + params.icon + '"></i></div>');
        var color = (!params.width && !params.height ? "#ffff00" : "rgba(255,255,255,.35)");

        var prop = {
            sourceId: params.sourceId,
            maskId: params.maskId,
            title: params.title,
            text: params.text,
            icon: params.icon,
            iconSize: params.iconSize,
            iconColor: !params.iconColor ? defaultIconColor : params.iconColor,
            iconPos: params.iconPos,
            fontSize: params.fontSize,
            width: params.width,
            height: params.height,
            borderStyle: params.borderStyle,
            borderWidth: params.borderWidth,
            borderColor: params.borderColor,
            borderRadius: params.borderRadius,
            bgColor: !params.bgColor ? color : params.bgColor,
            allowUserColor: params.allowUserColor,
            isPin: params.isPin,
            isHtml: params.isHtml,
            inlineEdit: params.inlineEdit,
            allowFontResize: params.allowFontResize,
            allowResize: params.allowResize,
            callbacks: {
                create: params.callbacks.create,
                text: params.callbacks.text
            }
        };

        source.data("properties", prop);
        appendAnnotationToBar(source, prop);

        $("#annotationButton").css("display", "block")
    })
}

function addAnnotation(params) {

    if (!params.top || !params.left || !params.page)
        return

    var uid = params.maskId + "_" + params.elementId;
    var prop = {
        uid: uid,
        inactive: params.inactive,
        id: params.elementId,
        page: params.page,
        type: params.isPin ? "annotationPin" : "annotationArea",
        width: params.isPin ? params.iconSize : params.width,
        height: params.isPin ? params.iconSize : params.height,
        top: params.top,
        left: params.left,
        backgroundColor: params.bgColor === "" ? "rgba(255,255,255,.35)" : params.bgColor,
        index: params.zIndex,
        editText: params.text,
        title: params.title,
        inlineEdit: params.inlineEdit,
        fontSize: params.fontSize,
        source: {
            maskId: params.maskId,
            icon: !params.icon ? null : params.icon.indexOf("fa ") > -1 ? params.icon : "fa " + params.icon,
            iconSize: params.iconSize,
            iconColor: !params.iconColor ? defaultIconColor : params.iconColor,
            iconPos: params.iconPos,
            bgColor: !params.bgColor ? "#ffff00" : params.bgColor,
            fontSize: params.fontSize,
            borderStyle: params.borderStyle,
            borderWidth: params.borderWidth,
            borderColor: params.borderColor,
            borderRadius: params.borderRadius,
            isHTMLStamp: params.isHTMLStamp,
            allowFontResize: params.allowFontResize,
            allowUserColor: params.allowUserColor,
            allowResize: params.allowResize,
            keepRatio: params.keepRatio,
            allowEdit: params.allowEdit,
            allowTextEdit: params.allowTextEdit,
            allowDelete: params.allowDelete,
            allowOpen: params.allowOpen,
            inlineEdit: params.inlineEdit,
            callbacks: {
                update: params.callbacks.update,
                delete: params.callbacks.delete,
                open: params.callbacks.open,
            }
        }
    }

    list[uid] = prop
    origList[uid] = $.extend({}, prop)

    var promise = drawAnnotation(uid)

    promise.done(function () {
        observer.add(uid, prop.page)
    })

    promise.fail(function () {
        delete list[uid]
        delete origList[uid]
    })

    return uid
}

function drawAnnotation(uid) {
    var prop = list[uid]
    var defer = $.Deferred()

    $.when(isDone("documentReady")).done(function () {
        if (pageExists(prop.page)) {
            $.when(isDone("page", prop.page), isDone("initDone"), isDone("documumentInitDone")).done(function () {
                $("#" + uid).remove()
                var annotation = $("<div id='" + uid + "' class='annotationElement hidden " + prop.type + "' style='position: absolute;right: auto;bottom: auto'></div>")
                getPage(prop.page).append(annotation)

                annotation = setAttr(annotation, prop)
                annotation.removeClass("hidden")
            })

            $.when(isDone("page", 1, true), isDone("documumentInitDone")).done(function () {
                drawThumbs(uid)
            })

            defer.resolve()
        } else {
            defer.reject()
        }
    })

    return defer.promise()
}

function getFilledAnnotationText(properties) {
    return properties.callbacks.text(properties.text)
}

function removeAnnotationsByMask(maskId) {
    $(".focusedAnnotation").removeClass("focusedAnnotation")
    toggleOptionBox(false)

    $.each($(".annotationElement[maskId='" + maskId + "']"), function (idx, item) {
        var id = $(item).attr("id")

        $("#" + id + "_thumb").remove()

        delete list[id]
        delete origList[id]

        $(item).remove()
    })
}

function getPromise(prop, callbackType) {
    var callback = callbackList[prop.uid]

    if (callback == null || typeof callback == "undefined") {
        callback = prop.source.callbacks
    } else if (callbackType == "create")
        return null

    if (callback == null || typeof callback == "undefined")
        return null

    switch (callbackType) {
        case "create" :
            return callback.create(prop)
        case "update" :
            return callback.update(prop)
        case "delete" :
            return callback.delete(prop)
        case "open"      :
            return callback.open(prop)
    }

    return null
}

function showWait(page) {
    isDone("page", page).done(function () {
        var spinner = '<div class="annotationSpinnerOverlay"><i class="fa fa-spinner fa-3x fa-fw fa-pulse"></i><div class="pleaseWait" code="label.pleaseWait">' + translateMessage("label.pleaseWait", "Bitte warten ...") + '</div></div>';
        getPage(page).prepend(spinner)
        overlays[page] = true
    })
}

function hideWait(page) {
    isDone("page", page).done(function () {
        getPage(page).find(".annotationSpinnerOverlay").remove()
        overlays[page] = false
    })
}

function createAnnotation(prop) {
    var promise = getPromise(prop, "create")
    var _id = prop.id + ""
    var annotation = $("#" + _id)

    function remove() {
        delete list[_id]
        delete origList[_id]

        annotation.remove()
        $("#" + _id + "_thumb").remove()
    }

    if (promise == null) {
        remove()
        return
    }

    showWait(prop.page)

    promise.always(function () {
        remove()
        hideWait(prop.page)
    })
}

function updateAnnotation(prop) {
    var promise = getPromise(prop, "update")
    var _id = prop.uid
    var annotation = $("#" + _id)

    if (promise == null)
        return

    showWait(prop.page)

    promise.done(function () {
        origList[prop.uid] = jQuery.extend({}, list[prop.uid])
    })

    promise.fail(function () {
        if (prop.index == origList[prop.uid].index) {
            repaintBox(annotation, origList[prop.uid])
            drawThumbs(annotation.attr("id"), true)
        } else {
            annotation.css("z-index", origList[prop.uid].index)
        }

        list[prop.uid] = jQuery.extend({}, origList[prop.uid])
    })

    promise.always(function () {
        $(".edit-text").removeClass("edit-text")
        hideWait(prop.page)
    })
}

function deleteAnnotation(prop) {
    var promise = getPromise(prop, "delete")
    var _id = prop.uid + ""
    var annotation = $("#" + _id)

    annotation.addClass("beforeDelete")
    isDone("annotation", _id, true).done(function () {
        $("#" + _id + "_thumb").addClass("forDelete")
    })

    if (promise == null) {
        annotation.removeClass("forDelete")
        isDone("annotation", _id, true).done(function () {
            $("#" + _id + "_thumb").removeClass("forDelete")
        })
        return
    }

    promise.done(function () {
        delete list[_id]
        delete origList[_id]
        delete callbackList[_id]

        annotation.remove()

        isDone("annotation", _id, true).done(function () {
            $("#" + _id + "_thumb").remove()
        })
    })

    promise.fail(function () {
        annotation.removeClass("forDelete, beforeDelete")
        isDone("annotation", _id, true).done(function () {
            $("#" + _id + "_thumb").removeClass("forDelete")
        })
    })
}

function openAnnotation() {
    var prop = list[$(".focusedAnnotation").attr("id")]
    var promise = getPromise(prop, "open")
}

//Elemente in das Header-Menü hängen
function appendAnnotationToBar(item, prop) {
    function getRebuildDiv(ele) {
        ele = $(ele)
        ele.append(ele.attr("title"))

        return ele
    }

    var icon_annotation_area = prop.isPin ? '' : prop.isHtml ? 'fa-sticky-note' : prop.icon == null ? 'fa-sticky-note-o' : prop.icon

    isDone("documumentInitDone").done(function () {
        if ($(item).hasClass("createPin")) {
            $(item).insertBefore("#annotationBar .splitToolbarButtonSeparator:not(.areaSeperator)")
        } else {
            $(item).children("i").attr("class", "fa " + icon_annotation_area)

            if ($("#annotationBar").find(".createArea").length == 0) {
                $("#annotationBar").prepend("<div class='splitToolbarButtonSeparator areaSeperator'></div>")
                $("#annotationBar").prepend(item)
            } else {
                if ($("#annotationBar").find("#area").length == 0) {
                    var entry = $("#annotationBar").find(".createArea").clone(true)

                    $("#annotationBar").find(".createArea").attr("id", "area")
                    $("#annotationBar").find(".createArea").attr("title", title_createArea)
                    $("#annotationBar").find(".createArea").children("i").attr("class", 'fa fa-clone')
                    $("#annotationBar").find(".createArea").removeClass("createArea")

                    var menu = $('<div id="areaMenu" class="annotationBar doorHanger" style="display: none;position:absolute;"></div>')
                    $("#annotationBar").append(menu);
                    menu.append(getRebuildDiv(entry))
                }

                $("#areaMenu").append(getRebuildDiv(item))
            }
        }
    })
}

function appendAreaIcon(item, properties, _scale, hidden) {

    if (properties == null || typeof properties == "undefined")
        return

    if (properties.icon == null || typeof properties.icon == "undefined")
        return

    if (properties.iconSize == null || typeof properties.iconSize == "undefined")
        return

    if (properties.iconPos == null || typeof properties.iconPos == "undefined")
        return

    item = $(item)

    var color = properties.iconColor == null || typeof properties.iconColor == "undefined" ? "#333" : properties.iconColor
    var size = properties.iconSize
    var icon = properties.icon
    icon = icon.indexOf("fa ") == -1 ? "fa " + icon : icon

    var div = $('<div class="annotationElementIcon ' + icon + '" style="position:absolute;color:' + color + ';font-size:' + size + 'px;width:' + size + 'px;height:' + size + 'px;' + (hidden ? "opacity:1;" : "") + '"></div>')
    item.prepend(div)

    var pos = properties.iconPos.toLowerCase()

    if (pos == "top" || pos == "bottom") {
        div.css("left", "calc(50% - " + size / 2 + "px)")
        div.css((pos == "top" ? "top" : "bottom"), annotationElementTextPadding)
    } else if (pos == "left" || pos == "right") {
        div.css("top", "calc(50% - " + size / 2 + "px)")
        div.css((pos == "left" ? "left" : "right"), annotationElementTextPadding)
    }
}

function getBorder(properties, _scale) {
    var borderWidth = properties.borderWidth
    borderWidth = borderWidth < borderMinWidth ? borderMinWidth : borderWidth
    borderWidth = borderWidth + "px"
    var borderStyle = properties.borderStyle == null || typeof properties.borderStyle == "undefined" || properties.borderStyle.toLowerCase() == "none" ? "none" : properties.borderStyle.toLowerCase()
    var borderColor = properties.borderColor == null || typeof properties.borderColor == "undefined" ? "" : properties.borderColor

    return borderWidth + " " + borderStyle + " " + borderColor
}

function getBorderRadius(properties, _scale, isPin) {
    var radius = properties.borderRadius == null || typeof properties.borderRadius == "undefined" ? 0 : properties.borderRadius
    return radius > 0 ? (isPin ? radius + annotationElementTextPadding : radius > maxAreaBorderRadius ? maxAreaBorderRadius : radius) : 0
}

function getBgColor(item) {
    var bgc = $(item).css("background-color")
    if (bgc.indexOf("rgba") < 0) {
        bgc = bgc.replace("rgb", "rgba")
        bgc = bgc.replace(")", ",." + opacity + ")")
    }
    return bgc
}

function calcTextElement(parent, properties, _scale, fontSize) {
    fontSize = fontSize == null || typeof fontSize == "undefined" ? properties.fontSize : fontSize
    parent = $(parent)
    _scale = _scale == null || typeof _scale == "undefined" ? scale(parent.parent(".page").attr("data-page-number")) : _scale

    var item = parent.children(".annotationElementIcon")
    var padding = annotationElementTextPadding

    var size = Math.min(parent.innerWidth(), parent.innerHeight())
    var style = "padding:" + padding + "px;"
    if (size < padding * 3) {
        size = (size - (padding * 2))

        if (parent.innerHeight() < padding * 3) {
            style += "padding-top:" + (size < 0 ? 0 : size) + "px;"
            style += "padding-bottom:0px;"
        }
        if (parent.innerWidth() < padding * 3) {
            style += "padding-left:" + (size < 0 ? 0 : size) + "px;"
            style += "padding-right:" + (size < 0 ? 0 : size) + "px;"
        }
    } else
        size = 0

    style += "font-size:" + fontSize + "px;"
    if (properties.icon != null && typeof properties.icon != "undefined") {
        padding *= 2
        if (properties.iconPos.toLowerCase() == "left" || properties.iconPos.toLowerCase() == "right") {
            style += "width:calc(100% - " + (item.outerWidth(true) + padding * 2) + "px);"
            style += "height:calc(100% - " + (padding - size) + "px);"
            if (properties.iconPos.toLowerCase() == "left") {
                style += "margin-left:" + (item.outerWidth(true) + padding) + "px;"
                style += "padding-left:0px;padding-right:0px;"
            } else
                style += "padding-right:0px;"
        } else {
            style += "height:calc(100% - " + (item.outerHeight(true) + padding * 2) + "px);"
            style += "width:calc(100% - " + (padding - size) + "px);"
            if (properties.iconPos.toLowerCase() == "top") {
                style += "margin-top:" + (item.outerHeight(true)) + "px;"
                style += "padding-bottom:0px;padding-right:0px;"
            } else {
                style += "padding-bottom:" + padding + "px;padding-right:0px;"
            }
        }
    }

    parent.children(".annotationElementText").attr("style", style)
}

function setAnnotationElementText(text, target) {
    target = target == null || typeof target == "undefined" ? $(".edit-text > .annotationElementText") : target
    if (text == null || typeof text == "undefined")
        target.html("")
    else if (!target.hasClass("htmlAnnotation") || target[0].type != "textarea")
        target.html(text.replace(/\r?\n/g, '<br/>'))
    else
        target.html(text)
}

function getOverlappingItems(item, up) {
    item = $(item)
    var items = item.parent(".page").find(".annotationElement").not(item)
    items = items.sort(function (itemA, itemB) {
        var a = parseInt($(itemA).css('z-index'));
        var b = parseInt($(itemB).css('z-index'));

        return a == b ? 0 : up ? (a < b) ? -1 : 1 : (a > b) ? -1 : 1;
    })

    var returns = []

    $.each(items, function (idx, element) {
        element = $(element)

        if (	//element Punkte innerhalb des items
        //Oben Links
            (element.position().left > item.position().left && element.position().left < item.position().left + item.width() &&
                element.position().top > item.position().top && element.position().top < item.position().top + item.height()) ||
            //Oben Rechts
            (element.position().left + element.width() > item.position().left && element.position().left + element.width() < item.position().left + item.width() &&
                element.position().top > item.position().top && element.position().top < item.position().top + item.height()) ||
            //Unten Links
            (element.position().left > item.position().left && element.position().left < item.position().left + item.width() &&
                element.position().top + element.height() > item.position().top && element.position().top + element.height() < item.position().top + item.height()) ||
            //Unten Rechts
            (element.position().left + element.width() > item.position().left && element.position().left + element.width() < item.position().left + item.width() &&
                element.position().top + element.height() > item.position().top && element.position().top + element.height() < item.position().top + item.height()) ||
            //item Punkte innerhalb des elements
            //Oben Links
            (item.position().left > element.position().left && item.position().left < element.position().left + element.width() &&
                item.position().top > element.position().top && item.position().top < element.position().top + element.height()) ||
            //Oben Rechts
            (item.position().left + item.width() > element.position().left && item.position().left + item.width() < element.position().left + element.width() &&
                item.position().top > element.position().top && item.position().top < element.position().top + element.height()) ||
            //Unten Links
            (item.position().left > element.position().left && item.position().left < element.position().left + element.width() &&
                item.position().top + item.height() > element.position().top && item.position().top + item.height() < element.position().top + element.height()) ||
            //Unten Rechts
            (item.position().left + item.width() > element.position().left && item.position().left + item.width() < element.position().left + element.width() &&
                item.position().top + item.height() > element.position().top && item.position().top + item.height() < element.position().top + element.height())) {

            if (up ? parseInt(item.css("z-index")) < parseInt(element.css("z-index")) : parseInt(item.css("z-index")) > parseInt(element.css("z-index")))
                returns.push(element)
        }

    })

    return returns
}

function changeIndex(up) {
    var item = $(".focusedAnnotation")
    var idx = parseInt(item.css("z-index"))
    var items = getOverlappingItems(item, up)

    if (items.length > 0) {
        var idx = parseInt(items[0].css("z-index")) + (up ? 1 : -1)
        idx = idx < startIndex ? startIndex : idx

        item.css("z-index", idx)
        drawThumbs(item.attr("id"))

        var prop = list[item.attr("id")]
        prop.index = idx
        updateAnnotation(prop)

        updateIndexButtons()

        $.each(items, function (idx, item) {
            var _items = getOverlappingItems(item, up)

            if (_items.length == 0 && parseInt($(item).css("z-index")) == startIndex) {

            }
        })
    }
}

function changeFontSize(increase) {
    var item = $(".focusedAnnotation")
    var prop = list[item.attr("id")]
    var fs = prop.fontSize + (increase ? 1 : -1)
    list[item.attr("id")].fontSize = fs

    function save(size, properties) {
        setTimeout(function () {
            if (size == properties.fontSize)
                updateAnnotation(properties)
        }, 350)
    }

    $(".focusedAnnotation").children(".annotationElementText").css("font-size", fs * scale(item.parent(".page").attr("data-page-number")))
    save(fs, prop)
}

function updateIndexButtons() {
    var list = getOverlappingItems($(".focusedAnnotation"), false)

    if (list.length == 0 || parseInt($(list[0]).css("z-index")) < 10)
        $("#indexDown").attr("disabled", true);
    else
        $("#indexDown").removeAttr("disabled");

    list = getOverlappingItems($(".focusedAnnotation"), true)
    if (list.length == 0)
        $("#indexUp").attr("disabled", true);
    else
        $("#indexUp").removeAttr("disabled");
}

function updateToggleSizeButton() {
    var annotation = $(".focusedAnnotation")

    if (annotation == null || typeof annotation == "undefined")
        return

    if (annotation.hasClass("minimized")) {
        $("#toggleAnnotationSizeButton").attr("title", title_maximize)
        $("#toggleAnnotationSizeButton").children("i").attr("class", "fa fa-expand")
    } else {
        $("#toggleAnnotationSizeButton").attr("title", title_minimize)
        $("#toggleAnnotationSizeButton").children("i").attr("class", "fa fa-compress")
    }

}

function drawThumbs(id, originalData) {
    function draw(_id, prop) {
        var thumbID = _id + "_thumb"
        var page = getPage(prop.page, true)

        $("#" + thumbID).remove();

        var item = document.createElement('div');
        $(item).attr("id", thumbID);
        $(item).addClass("annotationThumbElement hidden " + prop.type);
        $(item).css("position", "absolute");

        page.children(".thumbnailSelectionRing").append(item);

        item = $(setAttr(item, prop, page))

        //x und y koordinate verschieben damit die elemente in der Vorschau an der richtigen stelle liegen
        $(item).css("top", num($(item).css("top")) + 7);
        $(item).css("left", num($(item).css("left")) + 7);

        item.removeClass("hidden")
    }

    var propList = originalData === true ? origList : list
    var prop
    if (id != null && typeof id != "undefined") {
        prop = propList[id]

        if (prop == null || typeof prop == "undefined")
            return

        isDone("page", prop.page, true).done(function () {
            draw(id, prop)
        })
    } else {
        $.each(propList, function (index, value) {
            isDone("page", value.page, true).done(function () {
                draw(value.uid, value)
            })
        })
    }
}

var pinIcons = ["fa-map-marker", "fa-map-pin", "fa-thumb-tack"]

function calcTopLeft(pos, size, element, type, reverse, padding, _scale) {
    element = $(element)

    if (element.hasClass("annotationArea"))
        return pos

    var isPinIcon = false

    if (type == "top") {
        for (var i = 0; i < pinIcons.length; i++) {
            if (element.children("i").hasClass(pinIcons[i])) {
                isPinIcon = true
                break
            }
        }
    }

    padding = padding > 0 ? annotationElementTextPadding : -annotationElementTextPadding
    return pos//(isPinIcon ? pos+(reverse ? -size: size) : pos+(reverse ? -((size/2)+(padding/2)): ((size/2)+(padding/2))))
}

function setPageInfo(item) {
    var prop = list[$(item).attr("id")]
    var _scale = scale(prop.page)

    prop.top = num($(item).css("top")) / _scale
    prop.left = num($(item).css("left")) / _scale
    prop.width = num($(item).css("width")) / _scale
    prop.height = num($(item).css("height")) / _scale

    var padding = $(item).css("border").indexOf("none") == -1 ? annotationElementTextPadding : 0

    prop.top = calcTopLeft(prop.top, prop.height, item, "top", false, padding)
    prop.left = calcTopLeft(prop.left, prop.width, item, "left", false, padding)

    updateAnnotation(prop)
}

function setStyleInfo(item) {
    var prop = list[$(item).attr("id")]

    if (prop.type == "annotationArea") {
        prop.backgroundColor = $(item).css("background-color");
        updateAnnotation(prop, true)
    }
}

function startDrag(event, ui) {
    var item = $(ui.helper)
    var _scale = scale(item.parent(".page").attr("data-page-number"))
    var size = {width: $(item).width(), height: $(item).height()}

    //size["width"] = ($(item).width()+(num($(item).css("border-width"))/2))/ _scale
    //size["height"] = ($(item).height()+(num($(item).css("border-width"))/2))/ _scale

    $(item).data("size", size)


    if ($(".edit-text").length > 0 || !$(this).hasClass("dragAllowed")) {
        return false
    }
    editBox(this)
}

function drag(event, ui) {
    var size = $(ui.helper).data("size")
    if (event.target.attributes.class.textContent.includes("customAnnotation") != true) {
        $(ui.helper).css("width", size.width)
        $(ui.helper).css("height", size.height)
    } else {
        $(ui.helper).css("min-width", "fit-content");
        $(ui.helper).css("min-height", "fit-content");
    }
}

function setJQueryUI(item, page, properties) {
    page = getPage(page)
    var prop = list[$(item).attr("id")]

    if (properties.allowEdit) {
        $(item).draggable({
            containment: page,
            start: startDrag,
            drag: drag,
            stop: function (event, ui) {
                stopEditBox(this, ui);
            }
        });
    }

    if (properties.allowResize && properties.allowEdit && properties.inlineEdit != true && properties.icon != "fa fa-check") {
        var handles = "ne, nw, sw, se"

        if (!properties.keepRatio === true)
            handles = "n, e, w, s, " + handles

        var setRez = function () {
            var setHeight, setWidth, setTop, setLeft
            var xPos, yPos, xDif, yDif
            var width = null, height = null
            var parentOffset = $(item).parent().offset();
            var _scale = scale(page.attr("data-page-number"))
            $(item).resizable({
                handles: handles,
                start: function (event, ui) {
                    editBox(this);

                    if ($(event.toElement).hasClass("ui-resizable-se"))
                        setHeight = setWidth = true

                    if ($(event.toElement).hasClass("ui-resizable-ne"))
                        setWidth = setTop = true

                    if ($(event.toElement).hasClass("ui-resizable-nw"))
                        setTop = setLeft = true

                    if ($(event.toElement).hasClass("ui-resizable-sw"))
                        setLeft = setHeight = true

                    if ($(event.toElement).hasClass("ui-resizable-n"))
                        setTop = true

                    if ($(event.toElement).hasClass("ui-resizable-e"))
                        setWidth = true

                    if ($(event.toElement).hasClass("ui-resizable-s"))
                        setHeight = true

                    if ($(event.toElement).hasClass("ui-resizable-w"))
                        setLeft = true

                    ui.originalSize.height = prop.height
                    ui.originalSize.width = prop.width

                    xPos = event.pageX - parentOffset.left;
                    yPos = event.pageY - parentOffset.top;

                },
                resize: function (event, ui) {
                    xDif = (event.pageX - parentOffset.left) - xPos
                    yDif = (event.pageY - parentOffset.top) - yPos

                    if (properties.keepRatio === true) {
                        if ((setWidth && setHeight) || (setWidth && setTop))
                            ui.size.width = ui.originalSize.width + xDif
                        else
                            ui.size.width = ui.originalSize.width - (xDif / _scale)

                        ui.size.height = ui.originalSize.height / (ui.originalSize.width / ui.size.width)

                        if (setTop) {
                            ui.position.top = ui.originalPosition.top + ((ui.originalSize.height - ui.size.height) * _scale)

                            if (ui.size.height < 0) {
                                ui.position.top = ui.originalPosition.top + (ui.originalSize.height * _scale)
                            }
                        }

                        if (setLeft) {
                            ui.position.left = ui.originalPosition.left + ((ui.originalSize.width - ui.size.width) * _scale)

                            if (ui.size.width < 0) {
                                ui.position.left = ui.originalPosition.left + (ui.originalSize.width * _scale)
                            }
                        }
                    } else {
                        if (setWidth)
                            ui.size.width = ui.originalSize.width + xDif

                        if (setHeight)
                            ui.size.height = ui.originalSize.height + yDif

                        if (setTop) {
                            ui.size.height = ui.originalSize.height - (yDif / _scale)

                            if (ui.size.height < 0) {
                                ui.size.height = 0
                                ui.position.top = ui.originalPosition.top + (ui.originalSize.height * _scale)
                            }
                        }

                        if (setLeft) {
                            ui.size.width = ui.originalSize.width - (xDif / _scale)

                            if (ui.size.width < 0) {
                                ui.size.width = 0
                                ui.position.left = ui.originalPosition.left + (ui.originalSize.width * _scale)
                            }
                        }
                    }

                    if (ui.position.left < 0)
                        ui.position.left = 0

                    if (ui.position.top < 0)
                        ui.position.top = 0

                    if (ui.position.top + (ui.size.height * _scale) + num($(ui.element).css("border-width")) > page.height()) {
                        ui.size.height = (page.height() - ui.position.top) / _scale

                        if (width == null)
                            width = ui.size.width

                    } else
                        width = null

                    if (ui.position.left + (ui.size.width * _scale) + num($(ui.element).css("border-width")) > page.width()) {
                        ui.size.width = (page.width() - ui.position.left) / _scale

                        if (height == null)
                            height = ui.size.height

                    } else
                        height = null

                    if (width != null)
                        ui.size.width = width

                    if (height != null)
                        ui.size.height = height

                },
                stop: function (event, ui) {
                    $(item).resizable("destroy")
                    setRez()
                    stopEditBox(this, ui);
                }
            });

            var child = $(item).children(".ui-resizable-se");
            $(child).removeClass("ui-icon");
            $(child).removeClass("ui-icon-gripsmall-diagonal-se");
            $(child).css("height", "9px");
            $(child).css("width", "9px");
            $(child).css("right", "-5px");
            $(child).css("bottom", "-5px");
        }

        setRez()
    }
}

function editBox(item) {
    boxIsEdit = true;
    toggleOptionBox(false);
}

function stopEditBox(item, ui) {
    var promise = typeof ui.size == "undefined" ? revertMove(item, ui) : revertSize(item, ui)

    promise.done(function () {
        setPageInfo(item);
        drawThumbs($(item).attr("id"))
    })

    promise.always(function () {
        boxIsEdit = false;
        $(item).removeClass("dragAllowed");

        if ($(item).hasClass("focusedAnnotation"))
            toggleOptionBox();
    })
}

function revertMove(item, ui) {
    return revert(item, ui, TITLE_MOVE, CONFIRM_MOVE)
}

function revertSize(item, ui) {
    return revert(item, ui, TITLE_SIZE, CONFIRM_SIZE)
}

function revert(item, ui, title, confirm) {
    var defer = $.Deferred()

    var yes = function () {
        defer.resolve()
    }

    var no = function () {
        var prop = list[$(item).attr("id")]
        var _scale = scale(prop.page)
        var obj = {top: prop.top * _scale, left: prop.left * _scale}

        if (typeof ui.originalSize != "undefined")
            obj = $.extend(obj, {width: prop.width, height: prop.height})

        $(item).animate(obj, {
            start: function () {
                toggleOptionBox(false)
            },
            complete: function () {
                if ($(".focusedAnnotation").length > 0)
                    toggleOptionBox(true)
            }
        })
        defer.reject()
    }

    window.yesNoDialog(title, confirm, yes, no)
    return defer.promise()
}

function compareColor(bg1, bg2) {
    bg1 = bg1.replace(/\s/g, "")
    bg2 = bg2.replace(/\s/g, "")

    bg1 = bg1.substring(0, bg1.lastIndexOf(","))
    bg2 = bg2.substring(0, bg2.lastIndexOf(","))

    return bg1 == bg2
}

function toggleOptionBox(show) {
    if ($(".focusedAnnotation").length == 0) {
        $("#optionBox").css("display", "none")
        return
    }
    var prop = list[$(".focusedAnnotation").attr("id")]

    if (!prop.source.allowEdit) {
        if (prop.source.allowOpen)
            openAnnotation()
        else
            $("#optionBox").css("display", "none")

        return
    }

    if ($(".focusedAnnotation").hasClass("minimized")) {
        $("#toggleAnnotationSizeButton").trigger("click", [true])
        return
    }

    $("#optionBox").css("display", "")

    if (typeof show != "undefined")
        (show) ? $("#optionBox").css("display", "") : $("#optionBox").css("display", "none")

    if ($("#optionBox").css("display") != "none") {
        if (prop.type == "annotationArea") {
            $("#toggleAnnotationSizeButton").css("display", "")
            $("#editTextButton").css("display", ($(".focusedAnnotation").find(".annotationElementText").length == 0 || !prop.source.allowEdit || prop.source.isHTMLStamp === true || !prop.source.allowTextEdit ? "none" : "block"))
            $("#changeFontSize").css("display", (prop.source.allowFontResize ? "block" : "none"))
            $("#optionBox_select_bg_color-button").css("display", (prop.source.allowUserColor ? "block" : "none"))
            $("#colorOverlay").css("background-color", $(".focusedAnnotation").css("background-color"));
        } else
            $("#editTextButton, #changeFontSize, #optionBox_select_bg_color-button, #toggleAnnotationSizeButton").css("display", "none")

        $("#editDatasetButton").css("display", (prop.source.allowOpen ? "" : "none"))

        $("#optionBox_select_bg_color").find(".appendedColor").remove()
        var bg = prop.source.bgColor
        //append da jquery aus jeder color nen rgb zurück gibt
        var bgDiv = $("<div style='display:none;background: " + bg + ";'></div>")
        $("body").append(bgDiv)
        bg = getBgColor(bgDiv)
        bgDiv.remove()
        var itemBg, appendItem = true
        $.each($("#optionBox_select_bg_color").find("option"), function (idx, item) {
            itemBg = $(item).css("background-color")
            if (compareColor(bg, itemBg)) {
                appendItem = false
                return false
            }
        })

        if (appendItem)
            $("#optionBox_select_bg_color").prepend('<option class="appendedColor" value="' + bg + '" style="background:' + bg + ';" selected></option>')
        $("#optionBox_select_bg_color").selectmenu("refresh")

        updateIndexButtons()
        updateToggleSizeButton()

        $("#optionBox").position({
            my: "left top",
            at: prop.type == "annotationArea" ? "left bottom+7" : "center-14 bottom+10",
            of: $(".focusedAnnotation"),
            collision: "none flip",
            using: function (obj, info) {
                if (info.vertical == "bottom") {
                    $("#optionBox").addClass("doorHangerTop");
                } else {
                    $("#optionBox").removeClass("doorHangerTop");
                }

                if ((obj.left + num($(this).css("width"))) > num($("#viewerContainer").css("width"))) {
                    $("#optionBox").addClass("doorHangerRight");
                    $("#optionBox").removeClass("doorHanger");

                    $(this).css({
                        left: ((obj.left + num($(".focusedAnnotation").css("width"))) - num($(this).css("width")) + 4) + 'px',
                        top: (obj.top + 4) + 'px'
                    });
                } else {
                    $("#optionBox").addClass("doorHanger");
                    $("#optionBox").removeClass("doorHangerRight");

                    $(this).css({
                        left: obj.left + 'px',
                        top: (obj.top + 4) + 'px'
                    });
                }
            }
        });
    }
}

function reload() {
    toggleOptionBox(false);

    $.each(list, function (index, value) {
        isDone("page", value.page).done(function () {
            if (overlays[value.page] != null && typeof overlays[value.page] != "undefined" && overlays[value.page])
                showWait(value.page)

            var item = document.createElement('div');
            $(item).attr("id", value.uid);
            $(item).addClass("annotationElement hidden" + value.type);
            $(item).css("position", "absolute");

            if ($(item).data("rendered") !== false) {
                $(item).data("rendered", false);
                repaintBox(item, value);
            }
        })
    });
}

function repaintBox(item, value) {
    $("#" + value.uid).remove()

    getPage(value.page).append(item);

    item = setAttr(item, value);
    $(item).data("rendered", true);

    if (!$("#view").hasClass("annotationHide"))
        setTimeout(function () {
            $(item).removeClass("hidden")
        }, 150)
}

function setAttr(item, properties, page) {
    var _scale = scale(properties.page, !(typeof page == "undefined" || page == null))
    var padding = 0

    $(item).addClass(properties.type);
    $(item).css("z-index", $(item).hasClass("annotationThumbElement") ? properties.index + 100 : properties.index);

    var top = properties.top
    var left = properties.left

    if (properties.inlineEdit != true && properties.source.icon != "fa fa-check") {
        $(item).css("width", properties.width)
        $(item).css("height", properties.height)
    } else {
        $(item).attr('class', 'customAnnotation annotationElement');
        $(item).css("min-width", "fit-content");
        $(item).css("min-height", "fit-content");
    }

    $(item).attr("maskId", properties.source.maskId)

    if (properties.title != null && typeof properties.title != "undefined")
        $(item).attr("title", properties.title)

    if (typeof properties.inactive != "undefined" && properties.inactive)
        $(item).addClass("inactive")

    if (properties.source.allowEdit !== true)
        $(item).addClass("notEditable")


    if (properties.type == "annotationArea") {
        $(item).css("background-color", ((properties.backgroundColor != false) ? properties.backgroundColor : ""));
        $(item).css("background-color", getBgColor(item))

        if (!$(item).hasClass("annotationThumbElement")) {
            setJQueryUI(item, properties.page, properties.source);

            $(item).css("border", getBorder(properties.source, _scale))
            $(item).css("border-radius", getBorderRadius(properties.source, _scale, false))

            appendAreaIcon(item, properties.source, _scale, true)

            $(item).children(".annotationElementText").remove()
            if ((properties.fontSize != null && typeof properties.fontSize != "undefined") || properties.source.isHTMLStamp) {

                var aet;

                if (properties.inlineEdit) {
                    aet = $("<textarea class='annotationElementText' rows='2' cols='20' wrap='hard' style='opacity: 0.5'></textarea>");
                    aet.blur(function () {
                        saveMarkAnnotation(properties);
                    });
                    var markIcon = $('<i/>').attr('class', 'fa fa-times').css('color', 'OrangeRed');
                    var markIconDiv = $('<div/>').attr('class', 'markIcon').prepend(markIcon);
                    $(item).prepend(markIconDiv);
                    aet.submit();
                } else {
                    aet = $("<div class='annotationElementText' style='opacity: 1'></div>");
                }

                if (properties.source.isHTMLStamp)
                    aet.addClass("htmlAnnotation");

                $(item).append(aet);
                calcTextElement(item, properties.source, _scale, properties.fontSize)
                setAnnotationElementText(properties.editText, $(item).children(".annotationElementText"))
            }
        } else
            $(item).click(function (event) {
                scrollTo(event, properties);
            });
    } else if (properties.type == "annotationPin") {
        if (!$(item).hasClass("annotationThumbElement")) {
            var x = properties.source.iconSize
            x = x < minPinSize ? minPinSize : x

            if (x * _scale < minPinSize) {
                x = minPinSize / _scale
                var dif = x - properties.source.iconSize

                top -= dif * _scale
                left -= dif * _scale
            }

            var borderRadius = getBorderRadius(properties.source, _scale, true)
            borderRadius = properties.source.iconSize == properties.source.borderRadius ? borderRadius > minPinSize ? borderRadius : minPinSize : borderRadius

            $(item).children().remove()
            $(item).append("<i class='" + properties.source.icon + "'></i>");
            $(item).css("color", properties.source.iconColor);
            $(item).css("font-size", x);
            $(item).css("height", x);
            $(item).css("width", x);


            $(item).css("border", getBorder(properties.source, _scale))

            if ($(item).css("border").indexOf("none") == -1) {
                $(item).css("border-radius", borderRadius)
                padding = annotationElementTextPadding
                $(item).css("padding", padding)
            }

            if (!$(item).hasClass("ui-draggable") && properties.source.allowEdit)
                $(item).draggable({
                    delay: delay,
                    containment: getPage(properties.page),
                    start: startDrag,
                    drag: drag,
                    stop: function (event, ui) {
                        stopEditBox(this, ui);
                    }
                });

            $(item).removeAttr("title")
            $(item).popover({
                html: true,
                placement: {position: "right", placement: "title", collision: "flip none", offset: 5},
                trigger: "hover",
                title: properties.title,
                content: properties.editText,
                container: "#viewerContainer",
                delay: {show: 500, hide: 200},
                duration: {show: 350, hide: 150},
                iconPlacement: "title",
                iconColor: "#484848",
                hideOnClasses: "dragAllowed focusedAnnotation"
            });
        } else {
            $(item).css("background-color", properties.source.iconColor)
            $(item).addClass("minSize")
            $(item).click(function (event) {
                scrollTo(event, properties);
            });
        }
    }

    $(item).css("top", calcTopLeft(top, properties.height, item, "top", true, padding, _scale) * _scale)
    $(item).css("left", calcTopLeft(left, properties.width, item, "left", true, padding, _scale) * _scale)

    if (navigator.appCodeName === 'Mozilla') {
        var l = (_scale / (_scale - 1)) * 4
        $(item).css("-moz-transform-origin", l + "px " + l + "px 0")
    } else
        $(item).css("transform-origin", "0 0")
    $(item).css("transform", "scale(" + _scale + ")")

    return item;
}

function scrollTo(event, value) {
    if (event != null) {
        event.preventDefault();
        event.stopPropagation();
    }

    focusAnnotation(value.uid)
}

function focusAnnotation(uid, selectAnnotation) {
    if ($("#" + uid).length > 0) {
        $("#viewerContainer").scrollTop(0);
        $("#viewerContainer").scrollTop((getPage(list[uid].page).offset().top));
    }

    isDone("annotation", uid, false).done(function () {
        function run() {
            toggleOptionBox(false)

            if ($("#view").hasClass("annotationHide"))
                $(".annotationElement").addClass("hidden")

            var hidden = $("#" + uid).hasClass("hidden")

            $(".focusedAnnotation").addClass("ignoreScroll")

            $("#" + uid).removeClass("hidden");
            $("#viewerContainer").css("overflow", "hidden");
            $("#viewerContainer").scrollTop(0);
            $("#viewerContainer").scrollTop(($("#" + uid).offset().top - 150));
            $("#viewerContainer").css("overflow", "auto");

            if (hidden)
                $("#" + uid).addClass("hidden");

            if (selectAnnotation === true) {
                $("#" + uid).removeClass("hidden");
                $(".focusedAnnotation").removeClass("focusedAnnotation")
                $("#" + uid).addClass("focusedAnnotation")
                toggleOptionBox(true)
            }
        }

        if ($(".edit-text").length > 0)
            askForCompleteEditAnnotation(run)
        else
            run()
    })
}

function num(val) {
    if (typeof val != "undefined" && val != null && val != "")
        return parseFloat(val.replace("px", ""));
    else
        return 0

}

function innerSidebar() {
    return num($("#sidebarContainer").css("left")) == 0
}

function toggledInnerSidebar() {
    return innerSidebar() && $("#sidebarToggle").hasClass("toggled")
}

function closeInnerSideBar() {
    if (toggledInnerSidebar() && $("body").width() < 770)
        $("#sidebarToggle").trigger("click")
}

function innerAnnotation() {
    return num($("#annotationContainer").css("bottom")) == 0
}

function toggleInnerAnnotation(forEdit, text) {
    if (!innerAnnotation() || forEdit === true) {
        if (text !== "")
            $("#annotationText").val(text)

        if (forEdit) {
            $("#annotationContainer").addClass("for-edit")

            if (!$("#annotation").hasClass("toggled"))
                $("#annotation").addClass("for-edit")
        }

        if ($("#sidebarToggle").hasClass("toggled"))
            $("#annotationContainer").removeClass("fullSize")

        $("#annotation").attr("title", title_viewAnnotationTextHide)
        $("#annotationContainer").addClass("annotationOpen")
        $("#annotation").addClass("toggled")
        $("#viewerContainer").addClass("additionalPadding")
    } else {
        $("#annotationText").val("")

        if ($("#annotation").hasClass("for-edit") || forEdit === false || $("#annotationContainer").hasClass("forFocus")) {
            $("#annotation").attr("title", title_viewAnnotationTextShow)
            $("#annotationContainer").removeClass("annotationOpen")
            $("#annotation").removeClass("toggled")
            $("#annotation").removeClass("for-edit")
            $("#viewerContainer").removeClass("additionalPadding")
        }

        $("#annotationContainer").removeClass("for-edit")
    }
}

function toggleInnerAnnotationEdit() {
    if ($(".focusedAnnotation").hasClass("edit-text")) {
        $("#annotationInputButtons").removeClass("disabled")
    } else {
        $("#annotationInputButtons").addClass("disabled")
    }
}

function replaceAnnotationText() {
    var prop = list[$(".focusedAnnotation").attr("id")]
    prop.editText = $("#annotationText").val()
    updateAnnotation(prop)
}

function getAnnotationText(targetAnnotation) {
    var text = targetAnnotation != null && typeof  targetAnnotation != "undefined" ? list[$(targetAnnotation).attr("id")].editText : list[$(".focusedAnnotation").attr("id")].editText
    return text == null || typeof text == "undefined" ? "" : text
}

function askForCompleteEditAnnotation(callback) {
    function yes() {
        saveAnnotationText()
        if (callback != null && typeof callback != "undefined")
            callback()
    }

    function no() {
        cancelAnnotationText()
        if (callback != null && typeof callback != "undefined")
            callback()
    }

    if ($("#annotationText").hasClass("changed"))
        window.yesNoDialog(question_saveAnnotation_title, question_saveAnnotation, yes, no)
    else
        no()
}

//***Button Funktionen***//
function editAnnotation() {
    var annotation = $(".focusedAnnotation")
    annotation.addClass("edit-text")

    $("#annotationText").removeProp("disabled").removeAttr("disabled")
    $("#annotationText").focus()

    $("#annotationInputButtons .toolbarButton:not(#annotation_text)").addClass("active")

    toggleInnerAnnotation(true, getAnnotationText())
    toggleOptionBox(false)
}

function watchMarkWrongText() {
    var markWrongElement = $(".focusedAnnotation");
    markWrongElement.onblur = function (evt) {
        saveAnnotationText();
    }
}

function replaceAnnotationInlineText(properties) {
    var prop = list[properties.uid];
    prop.editText = $('#' + properties.uid + '> textarea').val();
    updateAnnotation(prop)
}

function saveMarkAnnotation(properties) {
    replaceAnnotationInlineText(properties);
}

function saveAnnotationText() {
    replaceAnnotationText()
    completeEditAnnotation(true)
}

function cancelAnnotationText() {
    setAnnotationElementText(getAnnotationText())
    completeEditAnnotation(false)
}


//nur erweitern für save und cancel
function completeEditAnnotation(save) {

    var annotation = $(".focusedAnnotation")
    annotation.removeClass("edit-text")

    toggleInnerAnnotation()
    toggleOptionBox(true)

    $("#annotationInputButtons .toolbarButton").blur()
    $("#annotationText").prop("disabled", "disabled")
    $("#annotationText").removeClass("changed")

    $("#annotationInputButtons .toolbarButton:not(#annotation_text)").removeClass("active")

    annotation.trigger("mouseover")
}

function showDelete() {
    var id = $(".focusedAnnotation").attr("id")
    var prop = list[id]

    if (!prop.source.allowDelete || !prop.source.allowEdit)
        return

    toggleOptionBox(false);

    function noCallback() {
        docViewer[0].contentWindow.focus()
    }

    window.yesNoDialog(question_deleteAnnotation_title, question_deleteAnnotation, removeAnnotation, noCallback,
        {"btnYesLabel": button_deleteAnnotation, "btnNoLabel": translateMessage("BUTTON_CANCEL", BUTTON_CANCEL)})
}

function removeAnnotation() {
    toggleOptionBox(false);

    var id = $(".focusedAnnotation").attr("id")
    var prop = list[id]

    deleteAnnotation(prop)
}


function createCustomAnnotation(key, yCoord, xCoord) {
    var type = "annotationArea";
    var color = null;
    var editText = null;
    var annotationId;
    if (key == "markRight") {
        annotationId = 6;
        color = "rgba(0, 0, 0, 0)";
        editText = "<i class=\"fa fa-check\" style=\"color: #0ce675;\"></i>";
        yCoord = yCoord - 5;
        xCoord = xCoord - 3;
    } else {
        annotationId = 7;
        color = "rgba(229, 224, 236, 0.35)";
        editText = "";
        xCoord = xCoord + 27;
    }

    var number = $(this).attr("data-page-number")

    var properties = $("#" + annotationId).data("properties");
    properties["allowEdit"] = true;
    properties["allowDelete"] = true;

    var _scale = scale(number);

    if ($("#viewer").hasClass("createStamp") || $("#viewer").hasClass("createPin")) {
        var cursor = $("#cursor")

        cursor.attr("id", "newAnnotationElement")
        cursor.addClass("annotationElement")
        cursor.css("position", "absolute")

        if ($("#viewer").hasClass("createStamp")) {
            cursor.addClass("annotationArea")
            cursor.removeClass("area stamp")
        } else {
            cursor.attr("class", "")
            cursor.append("<i class='" + cursorType + "'></i>")
            cursor.children().removeClass("pin")
            cursor.addClass("annotationPin annotationElement")
        }

        $(this).trigger("mouseup")
    } else if ($("#viewer").hasClass("createArea")) {

        var a = $("<div id='newAnnotationElement' class='annotationElement annotationArea' style='border:" + getBorder(properties, _scale) + ";z-index:89;position:absolute;top:" + (startY) + "px;left:" + (startX) + "px;width:0px;height:0px;'></div>")
        $(a).css("background-color", properties.bgColor)
        $(a).css("background-color", getBgColor($(a)))
        $(a).css("border-radius", getBorderRadius(properties, _scale, false))
        if ($("#viewer").find("#newAnnotationElement").length == 0)
            page.append(a);

        if (properties.inlineEdit) {
            $(a).prepend(markIcon);
            $(a).blur(function () {
                saveMarkAnnotation();
            });
        }

        appendAreaIcon(a, properties, _scale)
        setTextElement(a, properties, _scale)

        $(a).css("transform-origin", "0 0")
        $(a).css("transform", "scale(" + _scale + ")")
    }

    var element = $("#newAnnotationElement");

    var page = parseInt(number);
    var date = new Date();
    var id = date.getTime();
    var index = startIndex + getPage(page).children(".annotationElement").length - 1;
    var _scale = scale(page);
    var fixWH = false;

    if ($("#view").hasClass("annotationHide"))
        element.addClass("stay-visible");

    element.css("z-index", index);

    var padding = 0
    var prop = {
        id: id,
        page: page,
        type: type,
        width: fixWH ? properties.width : num(element.css("width")) /*/ _scale*/,
        height: fixWH ? properties.height : num(element.css("height")) /*/ _scale*/,
        top: yCoord / _scale,
        left: xCoord / _scale,
        backgroundColor: color,
        editText: editText,
        fontSize: properties.fontSize,
        index: index,
        source: properties
    };

    createAnnotation(prop);
}
