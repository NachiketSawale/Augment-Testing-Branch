$.fn.extend({
    popover: function(param){
        this.each(function(idx, item){
            var title = param.title == null || typeof param.title != "string" ? "" : param.title
            var content = param.content == null || typeof param.content != "string" ? "" : param.content

            if(title == "" && content == "")
                return

            item = $(item)
            var event = param.trigger == null || typeof param.trigger == "undefined" ? "hover" : param.trigger
            var hideOnClasses = param.hideOnClasses == null || typeof param.hideOnClasses == "undefined" ? null : param.hideOnClasses
            var delay_show = param.delay.show == null || typeof param.delay.show != "number" ? 0 : param.delay.show
            var delay_hide = param.delay.hide == null || typeof param.delay.hide != "number" ? 0 : param.delay.hide

            var icon = param.icon == null || typeof param.icon != "string" ? "fa-caret" : param.icon
            var autoIcon = param.autoIcon == null || typeof param.autoIcon != "boolean" ? true : param.icon
            var iconPos = param.iconPlacement == null || typeof param.iconPlacement != "string" ? "center" : param.iconPlacement
            var iconColor = param.iconColor == null || typeof param.iconColor != "string" ? "#000" : param.iconColor
            var iconShow = param.showIcon == null || typeof param.showIcon != "boolean" ? true : param.showIcon

            var properties = {}
            properties["duration_show"] = param.duration.show == null || typeof param.duration.show != "number" ? 0 : param.duration.show
            properties["duration_hide"] = param.duration.hide == null || typeof param.duration.hide != "number" ? 0 : param.duration.hide
            properties["position"] = param.position == null || typeof param.position == "undefined" ? null : param.position
            properties["appendTo"] = param.container == null || typeof param.container == "undefined" ? "body" : param.container

            if(properties.position == null){
                properties.placement = param.placement == null || typeof param.placement == "undefined" ? {
                    position: "top",
                    placement: "center",
                    collision: "none"
                } : typeof param.placement == "string" ? {
                    position: param.placement,
                    placement: "center",
                    collision: "none"
                } : param.placement
                properties.position = getDirection(properties.placement.position, properties.placement.placement)
                properties.position["of"] = $(item)
                properties.position["collision"] = properties.placement.collision
                if(typeof properties.placement.within != "undefined")
                    properties.position["within"] = properties.placement.within
            }

            properties.position["using"] = function(obj, info){
                var c = 0
                if(properties.placement != null && typeof properties.placement != "undefined"){
                    var pos = properties.placement.placement

                    var width = dialog.parent(".ui-dialog").data("origWidth")
                    if(width == null || typeof width == "undefined"){
                        dialog.parent(".ui-dialog").data("origWidth", dialog.parent(".ui-dialog").outerWidth())
                    }else{
                        dialog.parent(".ui-dialog").css("min-width", width)
                        dialog.parent(".ui-dialog").css("max-width", width)
                    }

                    if(info.horizontal == "left"){
                        var x = $(window).width() - ($(info.target.element).offset().left+$(info.target.element).outerWidth())-25
                        if(dialog.parent(".ui-dialog").outerWidth() > x){
                            dialog.parent(".ui-dialog").css("min-width", x)
                            dialog.parent(".ui-dialog").css("max-width", x)
                        }
                    }else if(info.horizontal == "right"){
                        var ol = $(info.target.element).offset().left

                        if(dialog.parent(".ui-dialog").outerWidth() > ol-25){
                            dialog.parent(".ui-dialog").css("min-width", ol - 25)
                            dialog.parent(".ui-dialog").css("max-width", ol - 25)

                            if(info.element.width > ol - 25)
                                obj.left += (info.element.width - ol) + 25
                        }else{
                           dialog.parent(".ui-dialog").css("min-width", dialog.parent(".ui-dialog").outerWidth())
                        }
                    }


                    if(pos == "title")
                        c = (info.target.height / 2) - ($(info.element.element).find(".popover-title").outerHeight(false) / 2)
                    else if(pos == "content")
                        c = -((info.target.height / 2) - ($(info.element.element).find(".popover-content").outerHeight(false) / 2))

                    switch(properties.placement.position){
                        case "right"   :
                        case "left"    : obj.left += properties.placement.offset * (info.horizontal == "right" ? -1 : 1); break;
                        case "top"     :
                        case "bottom"  : obj.top += properties.placement.offset * (info.horizontal == "bottom" ? -1 : 1); break;
                    }
                }

                setIcon(dialog, iconShow, icon, autoIcon, iconColor, iconPos, info[info.important], item)

                $(this).css({
                    left: obj.left ,
                    top: obj.top + c
                })
            }

            var dialog = getDialog(title, content, properties)

            setEvent(item, dialog, event, hideOnClasses, delay_show, delay_hide)

            $(item).on("DOMNodeRemoved", function(){

                dialog.dialog("destroy")

            })
        })

        function setIcon(dialog, iconShow, icon, autoIcon, iconColor, iconPos, position, item){
            if(!iconShow)
                return

            position = position == "bottom" ? "down" : position

            icon = $("<i style='display:none;' class='popover-icon " + getCompleteIcon(icon, autoIcon, position) + "'></i>")

            dialog.parent(".ui-dialog").find(".popover-icon").remove()
            icon.insertAfter(dialog)


            var style = "position: absolute;"
            style+= "color:" + iconColor + ";"

            if(iconPos == "title")
                style += "top:"+((dialog.find(".popover-title").outerHeight(false)/2)-(icon.outerHeight()/2))+"px;"
            else if(iconPos == "content")
                style += "bottom:"+((dialog.find(".popover-content").outerHeight(false)/2)-(icon.outerHeight()/2))+"px;"
            else
                style += "top:"+((dialog.outerHeight(false)/2)-(icon.outerHeight()/2))+"px;"

            style += position+":-"+(icon.outerWidth(true)-1)+"px;"

            icon.attr("style", style)
        }

        function setEvent(item, dialog, event, hideOnClasses, _show, _hide){
            function hasClass(cls){
                if(hideOnClasses == null || typeof hideOnClasses == "undefined")
                    return false

                hideOnClasses = Array.isArray(hideOnClasses) ? hideOnClasses : hideOnClasses.split(" ")

                if(cls == null || typeof cls == "undefined"){
                    for(var i = 0; i < hideOnClasses.length; i++){
                        if($(item).hasClass(hideOnClasses[i])){
                            return true
                        }
                    }
                }else{
                    if($.inArray(cls, hideOnClasses))
                        return true
                }

                return false
            }

            var show = function(){
                if(!hasClass()){
                    setTimeout(function(){
                        if(event == "hover"){
                            if($(item).hasClass("popover-hover"))
                                dialog.dialog("open")
                            else
                             dialog.dialog("close")
                        }else{
                            dialog.dialog("open")
                        }
                    }, _show)
                }
            }

            var hide = function(_event){
                setTimeout(function(){
                    if(event == "hover"){
                        if(!$(item).hasClass("popover-hover"))
                            dialog.dialog("close")
                    }else{
                        dialog.dialog("close")
                    }
                }, _hide)
            }

            var toggle = function(){
                if(dialog.is(":visible"))
                    hide()
                else
                    show()
            }

            $(item).off("mouseover").on("mouseover", function(){
                $(this).addClass("popover-hover")
            })

            $(item).off("mouseout").on("mouseout", function(event){
                $(this).removeClass("popover-hover")
            })

            $(item).off("addClass").on("addClass", function(event, a){
                if(hasClass(a))
                    hide()
            })

            switch(event){
                case "hover":
                    $(item).hover(show, hide);
                    break;
                case "click":
                    $(item).click(toggle);
                    break;
            }

        }

        function getDialog(title, html, properties){
            var dialog = "<div id='" + new Date().getTime() + "' class='popover' style='position: relative;display: inline-block !important;'>" +
                "<div class='popover-title'>" + title + "</div>" +
                "<div class='popover-content'>" + html + "</div>" +
                "</div>"

            dialog = $(dialog).dialog({
                dialogClass: "popover-dialog",
                autoOpen: false,
                minHeight: 0,
                minWidth: 0,
                width: "auto",
                resizable: false,
                draggable: false,
                show: properties.duration_show,
                hide: properties.duration_hide,
                position: properties.position,
                appendTo: $(properties.appendTo)
            })

            var instance = dialog.dialog("instance")

            instance.uiDialog.css("padding", 0)
            instance.uiDialog.css("position", "")
            instance.uiDialog.css("overflow", "visible")
            instance.uiDialog.css("border-radius", 0)
            instance.uiDialog.attr("style", instance.uiDialog.attr("style") + "background:transparent !important;")
            instance.uiDialog.css("border", "none")
            instance.uiDialog.find(".ui-dialog-titlebar").remove()
            instance.uiDialog.find(".ui-dialog-content").css("padding", 0)
            instance.uiDialog.find(".ui-dialog-content").css("background", "white")

            return $(dialog)
        }

        function getCompleteIcon(icon, autoIcon, position){
            if(autoIcon){
                icon += "-" + position
            }

            if(icon.indexOf("fa ") == -1)
                icon = "fa " + icon

            return icon
        }

        function getDirection(position, at){
            var secParam = "center"

            if(position == "left" || position == "right"){
                if(at == "title")
                    secParam = "top"
                else if(at == "content")
                    secParam = "bottom"
            }


            if(position == "left")
                return {at: "left " + secParam, my: "right " + secParam}

            if(position == "right")
                return {at: "right " + secParam, my: "left " + secParam}

            if(position == "top")
                return {at: "center top", my: "center bottom"}


            return {at: "center bottom", my: "center top"}
        }

        function opposite(position, forIcon){
            switch(position){
                case "bottom":
                    return "top"
                case "top"   :
                    return forIcon ? "down" : "bottom"
                case "right" :
                    return "left"
                case "left"  :
                    return "right"
                default:
                    return position
            }
        }
    }
})