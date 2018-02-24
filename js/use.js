/**
 * jQuery Mobile Google maps
 * @Author: Jochen Vandendriessche <jochen@builtbyrobot.com>
 * @Author URI: http://builtbyrobot.com
 *
 * @TODO:
 * - fix https image requests
 **/

(function ($) {
    "use strict";

    var methods = {
        init: function (config) {
            var options = $.extend({
                    deviceWidth: 480,
                    showMarker: true,
                }, config),
                settings = {},
                markers = [];
            // we'll use the width of the device, because we stopped browsersniffing
            // a long time ago. Anyway, we want to target _every_ small display
            var _o = $(this); // store the jqyuery object once
            // iframe?
            //<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.be/maps?f=q&amp;source=s_q&amp;hl=nl&amp;geocode=&amp;q=Brugse+Heirweg+37,+aartrijke&amp;aq=&amp;sll=51.122175,3.086483&amp;sspn=0.009253,0.021651&amp;vpsrc=0&amp;ie=UTF8&amp;hq=&amp;hnear=Brugse+Heirweg+37,+8211+Zedelgem,+West-Vlaanderen,+Vlaams+Gewest&amp;t=m&amp;z=14&amp;ll=51.122175,3.086483&amp;output=embed"></iframe>
            options.imgURI = 'http://maps.googleapis.com/maps/api/staticmap?';
            settings.center = 'Brussels Belgium';
            settings.zoom = '5';
            settings.size = screen.width + 'x' + 480;
            settings.scale = window.devicePixelRatio ? window.devicePixelRatio : 1;
            settings.maptype = 'roadmap';
            settings.sensor = false;
            options.settings = settings;

            if ($(this).attr('data-center')) {
                options.settings.center = $(this).attr('data-center').replace(/ /gi, '+');
            }
            if ($(this).attr('data-zoom')) {
                options.settings.zoom = parseInt($(this).attr('data-zoom'));
            }
            if ($(this).attr('data-maptype')) {
                options.settings.zoom = $(this).attr('data-maptype');
            }

            // if there should be more markers _with_ text an ul.markers element should be used so
            // we can store all markers :-) (marker specific settings will be added later)
            if (options.showMarker) {
                markers.push({
                    label: 'A',
                    position: settings.center
                });
            }
            options.markers = markers;
            $(this).data('options', options);

            if (screen.width < options.deviceWidth) {
                $(this).mobileGmap('showImage');
            } else {
                $(this).mobileGmap('showMap');
            }

        },

        showMap: function () {
            var options = $(this).data('options'),
                geocoder = new google.maps.Geocoder(),
                latlng = new google.maps.LatLng(-34.397, 150.644),
                mapOptions = {},
                htmlObj = $(this).get(0);
            geocoder.geocode({
                'address': options.settings.center.replace(/\+/gi, ' ')
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // map.setCenter(results[0].geometry.location);
                    mapOptions = {
                        zoom: parseInt(options.settings.zoom),
                        center: results[0].geometry.location,
                        mapTypeId: options.settings.maptype
                    }
                    var map = new google.maps.Map(htmlObj, mapOptions);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                }
            });
        },

        showImage: function () {
            var par = [],
                r = new Image(),
                l = document.createElement('a'),
                options = $(this).data('options'),
                i = 0,
                m = [];
            for (var o in options.settings) {
                par.push(o + '=' + options.settings[o]);
            }
            if (options.markers.length) {
                var t = [];
                for (; i < options.markers.length; i++) {
                    t = [];
                    for (var j in options.markers[i]) {
                        if (j == 'position') {
                            t.push(options.markers[i][j]);
                        } else {
                            t.push(j + ':' + options.markers[i][j]);
                        }
                    }
                    m.push('&markers=' + t.join('%7C'));
                }
            }
            r.src = options.imgURI + par.join('&') + m.join('');
            l.href = 'http://maps.google.com/maps?q=' + options.settings.center;
            l.appendChild(r);
            $(this).empty().append(l);
        }

    };

    $.fn.mobileGmap = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.mobileGmap');
        }
    };
})(this.jQuery);

/*! Overthrow v.0.1.0. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function (a, b) {
    var c = a.document,
        d = c.documentElement,
        e = "overthrow-enabled",
        f = "ontouchmove" in c,
        g = "WebkitOverflowScrolling" in d.style || !f && a.screen.width > 1200 || function () {
            var b = a.navigator.userAgent,
                c = b.match(/AppleWebKit\/([0-9]+)/),
                d = c && c[1],
                e = c && d >= 534;
            return b.match(/Android ([0-9]+)/) && RegExp.$1 >= 3 && e || b.match(/ Version\/([0-9]+)/) && RegExp.$1 >= 0 && a.blackberry && e || b.indexOf(/PlayBook/) > -1 && RegExp.$1 >= 0 && e || b.match(/Fennec\/([0-9]+)/) && RegExp.$1 >= 4 || b.match(/wOSBrowser\/([0-9]+)/) && RegExp.$1 >= 233 && e || b.match(/NokiaBrowser\/([0-9\.]+)/) && parseFloat(RegExp.$1) === 7.3 && c && d >= 533
        }(),
        h = function (a, b, c, d) {
            return c * ((a = a / d - 1) * a * a + 1) + b
        },
        i = !1,
        j, k = function (c, d) {
            var e = 0,
                f = c.scrollLeft,
                g = c.scrollTop,
                h = {
                    top: "+0",
                    left: "+0",
                    duration: 100,
                    easing: a.overthrow.easing
                },
                i, k;
            if (d)
                for (var l in h) d[l] !== b && (h[l] = d[l]);
            return typeof h.left == "string" ? (h.left = parseFloat(h.left), i = h.left + f) : (i = h.left, h.left = h.left - f), typeof h.top == "string" ? (h.top = parseFloat(h.top), k = h.top + g) : (k = h.top, h.top = h.top - g), j = setInterval(function () {
                e++ < h.duration ? (c.scrollLeft = h.easing(e, f, h.left, h.duration), c.scrollTop = h.easing(e, g, h.top, h.duration)) : (i !== c.scrollLeft && (c.scrollLeft = i), k !== c.scrollTop && (c.scrollTop = k), m())
            }, 1), {
                top: k,
                left: i,
                duration: h.duration,
                easing: h.easing
            }
        },
        l = function (a, b) {
            return !b && a.className && a.className.indexOf("overthrow") > -1 && a || l(a.parentNode)
        },
        m = function () {
            clearInterval(j)
        },
        n = function () {
            if (i) return;
            i = !0;
            if (g || f) d.className += " " + e;
            a.overthrow.forget = function () {
                d.className = d.className.replace(e, ""), c.removeEventListener && c.removeEventListener("touchstart", y, !1), a.overthrow.easing = h, i = !1
            };
            if (g || !f) return;
            var j, n = [],
                o = [],
                p, q, r = function () {
                    n = [], p = null
                },
                s = function () {
                    o = [], q = null
                },
                t = function () {
                    var a = (n[0] - n[n.length - 1]) * 8,
                        b = (o[0] - o[o.length - 1]) * 8,
                        c = Math.max(Math.abs(b), Math.abs(a)) / 8;
                    a = (a > 0 ? "+" : "") + a, b = (b > 0 ? "+" : "") + b, !isNaN(c) && c > 0 && (Math.abs(b) > 80 || Math.abs(a) > 80) && k(j, {
                        left: b,
                        top: a,
                        duration: c
                    })
                },
                u, v = function (a) {
                    u = j.querySelectorAll("textarea, input");
                    for (var b = 0, c = u.length; b < c; b++) u[b].style.pointerEvents = a
                },
                x = function (a, d) {
                    if (c.createEvent) {
                        var e = (!d || d === b) && j.parentNode || j.touchchild || j,
                            f;
                        e !== j && (f = c.createEvent("HTMLEvents"), f.initEvent("touchend", !0, !0), j.dispatchEvent(f), e.touchchild = j, j = e, e.dispatchEvent(a))
                    }
                },
                y = function (a) {
                    m(), r(), s(), j = l(a.target);
                    if (!j || j === d || a.touches.length > 1) return;
                    v("none");
                    var b = a,
                        c = j.scrollTop,
                        e = j.scrollLeft,
                        f = j.offsetHeight,
                        g = j.offsetWidth,
                        h = a.touches[0].pageY,
                        i = a.touches[0].pageX,
                        k = j.scrollHeight,
                        u = j.scrollWidth,
                        w = function (a) {
                            var d = c + h - a.touches[0].pageY,
                                l = e + i - a.touches[0].pageX,
                                m = d >= (n.length ? n[0] : 0),
                                t = l >= (o.length ? o[0] : 0);
                            d > 0 && d < k - f || l > 0 && l < u - g ? a.preventDefault() : x(b), p && m !== p && r(), q && t !== q && s(), p = m, q = t, j.scrollTop = d, j.scrollLeft = l, n.unshift(d), o.unshift(l), n.length > 3 && n.pop(), o.length > 3 && o.pop()
                        },
                        y = function (a) {
                            t(), v("auto"), setTimeout(function () {
                                v("none")
                            }, 450), j.removeEventListener("touchmove", w, !1), j.removeEventListener("touchend", y, !1)
                        };
                    j.addEventListener("touchmove", w, !1), j.addEventListener("touchend", y, !1)
                };
            c.addEventListener("touchstart", y, !1)
        };
    a.overthrow = {
        set: n,
        forget: function () {},
        easing: h,
        toss: k,
        intercept: m,
        closest: l,
        support: g ? "native" : f && "polyfilled" || "none"
    }, n()
})(this);


/* Hoverdir Script */
(function ($, undefined) {

    /*
     * HoverDir object.
     */
    $.HoverDir = function (options, element) {

        this.$el = $(element);

        this._init(options);

    };

    $.HoverDir.defaults = {
        hoverDelay: 0,
        reverse: false
    };

    $.HoverDir.prototype = {
        _init: function (options) {

            this.options = $.extend(true, {}, $.HoverDir.defaults, options);

            // load the events
            this._loadEvents();

        },
        _loadEvents: function () {

            var _self = this;

            this.$el.on('mouseenter.hoverdir, mouseleave.hoverdir', function (event) {

                var $el = $(this),
                    evType = event.type,
                    $hoverElem = $el.find('div'),
                    direction = _self._getDir($el, {
                        x: event.pageX,
                        y: event.pageY
                    }),
                    hoverClasses = _self._getClasses(direction);

                $hoverElem.removeClass();

                if (evType === 'mouseenter') {

                    $hoverElem.hide().addClass(hoverClasses.from);

                    clearTimeout(_self.tmhover);

                    _self.tmhover = setTimeout(function () {

                        $hoverElem.show(0, function () {
                            $(this).addClass('da-animate').addClass(hoverClasses.to);
                        });


                    }, _self.options.hoverDelay);

                } else {

                    $hoverElem.addClass('da-animate');

                    clearTimeout(_self.tmhover);

                    $hoverElem.addClass(hoverClasses.from);

                }

            });

        },
        // credits : http://stackoverflow.com/a/3647634
        _getDir: function ($el, coordinates) {

            /** the width and height of the current div **/
            var w = $el.width(),
                h = $el.height(),

                /** calculate the x and y to get an angle to the center of the div from that x and y. **/
                /** gets the x value relative to the center of the DIV and "normalize" it **/
                x = (coordinates.x - $el.offset().left - (w / 2)) * (w > h ? (h / w) : 1),
                y = (coordinates.y - $el.offset().top - (h / 2)) * (h > w ? (w / h) : 1),

                /** the angle and the direction from where the mouse came in/went out clockwise (TRBL=0123);**/
                /** first calculate the angle of the point,
                add 180 deg to get rid of the negative values
                divide by 90 to get the quadrant
                add 3 and do a modulo by 4  to shift the quadrants to a proper clockwise TRBL (top/right/bottom/left) **/
                direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;

            return direction;

        },
        _getClasses: function (direction) {

            var fromClass, toClass;

            switch (direction) {
                case 0:
                    // from top
                    (!this.options.reverse) ? fromClass = 'da-slideFromTop': fromClass = 'da-slideFromBottom';
                    toClass = 'da-slideTop';
                    break;
                case 1:
                    // from right
                    (!this.options.reverse) ? fromClass = 'da-slideFromRight': fromClass = 'da-slideFromLeft';
                    toClass = 'da-slideLeft';
                    break;
                case 2:
                    // from bottom
                    (!this.options.reverse) ? fromClass = 'da-slideFromBottom': fromClass = 'da-slideFromTop';
                    toClass = 'da-slideTop';
                    break;
                case 3:
                    // from left
                    (!this.options.reverse) ? fromClass = 'da-slideFromLeft': fromClass = 'da-slideFromRight';
                    toClass = 'da-slideLeft';
                    break;
            };

            return {
                from: fromClass,
                to: toClass
            };

        }
    };

    var logError = function (message) {
        if (this.console) {
            console.error(message);
        }
    };

    $.fn.hoverdir = function (options) {

        if (typeof options === 'string') {

            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {

                var instance = $.data(this, 'hoverdir');

                if (!instance) {
                    logError("cannot call methods on hoverdir prior to initialization; " +
                        "attempted to call method '" + options + "'");
                    return;
                }

                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for hoverdir instance");
                    return;
                }

                instance[options].apply(instance, args);

            });

        } else {

            this.each(function () {

                var instance = $.data(this, 'hoverdir');
                if (!instance) {
                    $.data(this, 'hoverdir', new $.HoverDir(options, this));
                }
            });

        }

        return this;

    };

})(jQuery);

/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 *
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 *
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;
(function (b) {
    var m, t, u, f, D, j, E, n, z, A, q = 0,
        e = {},
        o = [],
        p = 0,
        d = {},
        l = [],
        G = null,
        v = new Image,
        J = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,
        W = /[^\.]\.(swf)\s*$/i,
        K, L = 1,
        y = 0,
        s = "",
        r, i, h = false,
        B = b.extend(b("<div/>")[0], {
            prop: 0
        }),
        M = b.browser.msie && b.browser.version < 7 && !window.XMLHttpRequest,
        N = function () {
            t.hide();
            v.onerror = v.onload = null;
            G && G.abort();
            m.empty()
        },
        O = function () {
            if (false === e.onError(o, q, e)) {
                t.hide();
                h = false
            } else {
                e.titleShow = false;
                e.width = "auto";
                e.height = "auto";
                m.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>');
                F()
            }
        },
        I = function () {
            var a = o[q],
                c, g, k, C, P, w;
            N();
            e = b.extend({}, b.fn.fancybox.defaults, typeof b(a).data("fancybox") == "undefined" ? e : b(a).data("fancybox"));
            w = e.onStart(o, q, e);
            if (w === false) h = false;
            else {
                if (typeof w == "object") e = b.extend(e, w);
                k = e.title || (a.nodeName ? b(a).attr("title") : a.title) || "";
                if (a.nodeName && !e.orig) e.orig = b(a).children("img:first").length ? b(a).children("img:first") : b(a);
                if (k === "" && e.orig && e.titleFromAlt) k = e.orig.attr("alt");
                c = e.href || (a.nodeName ? b(a).attr("href") : a.href) || null;
                if (/^(?:javascript)/i.test(c) ||
                    c == "#") c = null;
                if (e.type) {
                    g = e.type;
                    if (!c) c = e.content
                } else if (e.content) g = "html";
                else if (c) g = c.match(J) ? "image" : c.match(W) ? "swf" : b(a).hasClass("iframe") ? "iframe" : c.indexOf("#") === 0 ? "inline" : "ajax";
                if (g) {
                    if (g == "inline") {
                        a = c.substr(c.indexOf("#"));
                        g = b(a).length > 0 ? "inline" : "ajax"
                    }
                    e.type = g;
                    e.href = c;
                    e.title = k;
                    if (e.autoDimensions)
                        if (e.type == "html" || e.type == "inline" || e.type == "ajax") {
                            e.width = "auto";
                            e.height = "auto"
                        } else e.autoDimensions = false;
                    if (e.modal) {
                        e.overlayShow = true;
                        e.hideOnOverlayClick = false;
                        e.hideOnContentClick =
                            false;
                        e.enableEscapeButton = false;
                        e.showCloseButton = false
                    }
                    e.padding = parseInt(e.padding, 10);
                    e.margin = parseInt(e.margin, 10);
                    m.css("padding", e.padding + e.margin);
                    b(".fancybox-inline-tmp").unbind("fancybox-cancel").bind("fancybox-change", function () {
                        b(this).replaceWith(j.children())
                    });
                    switch (g) {
                        case "html":
                            m.html(e.content);
                            F();
                            break;
                        case "inline":
                            if (b(a).parent().is("#fancybox-content") === true) {
                                h = false;
                                break
                            }
                            b('<div class="fancybox-inline-tmp" />').hide().insertBefore(b(a)).bind("fancybox-cleanup", function () {
                                b(this).replaceWith(j.children())
                            }).bind("fancybox-cancel",
                                function () {
                                    b(this).replaceWith(m.children())
                                });
                            b(a).appendTo(m);
                            F();
                            break;
                        case "image":
                            h = false;
                            b.fancybox.showActivity();
                            v = new Image;
                            v.onerror = function () {
                                O()
                            };
                            v.onload = function () {
                                h = true;
                                v.onerror = v.onload = null;
                                e.width = v.width;
                                e.height = v.height;
                                b("<img />").attr({
                                    id: "fancybox-img",
                                    src: v.src,
                                    alt: e.title
                                }).appendTo(m);
                                Q()
                            };
                            v.src = c;
                            break;
                        case "swf":
                            e.scrolling = "no";
                            C = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + e.width + '" height="' + e.height + '"><param name="movie" value="' + c +
                                '"></param>';
                            P = "";
                            b.each(e.swf, function (x, H) {
                                C += '<param name="' + x + '" value="' + H + '"></param>';
                                P += " " + x + '="' + H + '"'
                            });
                            C += '<embed src="' + c + '" type="application/x-shockwave-flash" width="' + e.width + '" height="' + e.height + '"' + P + "></embed></object>";
                            m.html(C);
                            F();
                            break;
                        case "ajax":
                            h = false;
                            b.fancybox.showActivity();
                            e.ajax.win = e.ajax.success;
                            G = b.ajax(b.extend({}, e.ajax, {
                                url: c,
                                data: e.ajax.data || {},
                                error: function (x) {
                                    x.status > 0 && O()
                                },
                                success: function (x, H, R) {
                                    if ((typeof R == "object" ? R : G).status == 200) {
                                        if (typeof e.ajax.win ==
                                            "function") {
                                            w = e.ajax.win(c, x, H, R);
                                            if (w === false) {
                                                t.hide();
                                                return
                                            } else if (typeof w == "string" || typeof w == "object") x = w
                                        }
                                        m.html(x);
                                        F()
                                    }
                                }
                            }));
                            break;
                        case "iframe":
                            Q()
                    }
                } else O()
            }
        },
        F = function () {
            var a = e.width,
                c = e.height;
            a = a.toString().indexOf("%") > -1 ? parseInt((b(window).width() - e.margin * 2) * parseFloat(a) / 100, 10) + "px" : a == "auto" ? "auto" : a + "px";
            c = c.toString().indexOf("%") > -1 ? parseInt((b(window).height() - e.margin * 2) * parseFloat(c) / 100, 10) + "px" : c == "auto" ? "auto" : c + "px";
            m.wrapInner('<div style="width:' + a + ";height:" + c +
                ";overflow: " + (e.scrolling == "auto" ? "auto" : e.scrolling == "yes" ? "scroll" : "hidden") + ';position:relative;"></div>');
            e.width = m.width();
            e.height = m.height();
            Q()
        },
        Q = function () {
            var a, c;
            t.hide();
            if (f.is(":visible") && false === d.onCleanup(l, p, d)) {
                b.event.trigger("fancybox-cancel");
                h = false
            } else {
                h = true;
                b(j.add(u)).unbind();
                b(window).unbind("resize.fb scroll.fb");
                b(document).unbind("keydown.fb");
                f.is(":visible") && d.titlePosition !== "outside" && f.css("height", f.height());
                l = o;
                p = q;
                d = e;
                if (d.overlayShow) {
                    u.css({
                        "background-color": d.overlayColor,
                        opacity: d.overlayOpacity,
                        cursor: d.hideOnOverlayClick ? "pointer" : "auto",
                        height: b(document).height()
                    });
                    if (!u.is(":visible")) {
                        M && b("select:not(#fancybox-tmp select)").filter(function () {
                            return this.style.visibility !== "hidden"
                        }).css({
                            visibility: "hidden"
                        }).one("fancybox-cleanup", function () {
                            this.style.visibility = "inherit"
                        });
                        u.show()
                    }
                } else u.hide();
                i = X();
                s = d.title || "";
                y = 0;
                n.empty().removeAttr("style").removeClass();
                if (d.titleShow !== false) {
                    if (b.isFunction(d.titleFormat)) a = d.titleFormat(s, l, p, d);
                    else a = s && s.length ?
                        d.titlePosition == "float" ? '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' + s + '</td><td id="fancybox-title-float-right"></td></tr></table>' : '<div id="fancybox-title-' + d.titlePosition + '">' + s + "</div>" : false;
                    s = a;
                    if (!(!s || s === "")) {
                        n.addClass("fancybox-title-" + d.titlePosition).html(s).appendTo("body").show();
                        switch (d.titlePosition) {
                            case "inside":
                                n.css({
                                    width: i.width - d.padding * 2,
                                    marginLeft: d.padding,
                                    marginRight: d.padding
                                });
                                y = n.outerHeight(true);
                                n.appendTo(D);
                                i.height += y;
                                break;
                            case "over":
                                n.css({
                                    marginLeft: d.padding,
                                    width: i.width - d.padding * 2,
                                    bottom: d.padding
                                }).appendTo(D);
                                break;
                            case "float":
                                n.css("left", parseInt((n.width() - i.width - 40) / 2, 10) * -1).appendTo(f);
                                break;
                            default:
                                n.css({
                                    width: i.width - d.padding * 2,
                                    paddingLeft: d.padding,
                                    paddingRight: d.padding
                                }).appendTo(f)
                        }
                    }
                }
                n.hide();
                if (f.is(":visible")) {
                    b(E.add(z).add(A)).hide();
                    a = f.position();
                    r = {
                        top: a.top,
                        left: a.left,
                        width: f.width(),
                        height: f.height()
                    };
                    c = r.width == i.width && r.height ==
                        i.height;
                    j.fadeTo(d.changeFade, 0.3, function () {
                        var g = function () {
                            j.html(m.contents()).fadeTo(d.changeFade, 1, S)
                        };
                        b.event.trigger("fancybox-change");
                        j.empty().removeAttr("filter").css({
                            "border-width": d.padding,
                            width: i.width - d.padding * 2,
                            height: e.autoDimensions ? "auto" : i.height - y - d.padding * 2
                        });
                        if (c) g();
                        else {
                            B.prop = 0;
                            b(B).animate({
                                prop: 1
                            }, {
                                duration: d.changeSpeed,
                                easing: d.easingChange,
                                step: T,
                                complete: g
                            })
                        }
                    })
                } else {
                    f.removeAttr("style");
                    j.css("border-width", d.padding);
                    if (d.transitionIn == "elastic") {
                        r = V();
                        j.html(m.contents());
                        f.show();
                        if (d.opacity) i.opacity = 0;
                        B.prop = 0;
                        b(B).animate({
                            prop: 1
                        }, {
                            duration: d.speedIn,
                            easing: d.easingIn,
                            step: T,
                            complete: S
                        })
                    } else {
                        d.titlePosition == "inside" && y > 0 && n.show();
                        j.css({
                            width: i.width - d.padding * 2,
                            height: e.autoDimensions ? "auto" : i.height - y - d.padding * 2
                        }).html(m.contents());
                        f.css(i).fadeIn(d.transitionIn == "none" ? 0 : d.speedIn, S)
                    }
                }
            }
        },
        Y = function () {
            if (d.enableEscapeButton || d.enableKeyboardNav) b(document).bind("keydown.fb", function (a) {
                if (a.keyCode == 27 && d.enableEscapeButton) {
                    a.preventDefault();
                    b.fancybox.close()
                } else if ((a.keyCode ==
                        37 || a.keyCode == 39) && d.enableKeyboardNav && a.target.tagName !== "INPUT" && a.target.tagName !== "TEXTAREA" && a.target.tagName !== "SELECT") {
                    a.preventDefault();
                    b.fancybox[a.keyCode == 37 ? "prev" : "next"]()
                }
            });
            if (d.showNavArrows) {
                if (d.cyclic && l.length > 1 || p !== 0) z.show();
                if (d.cyclic && l.length > 1 || p != l.length - 1) A.show()
            } else {
                z.hide();
                A.hide()
            }
        },
        S = function () {
            if (!b.support.opacity) {
                j.get(0).style.removeAttribute("filter");
                f.get(0).style.removeAttribute("filter")
            }
            e.autoDimensions && j.css("height", "auto");
            f.css("height", "auto");
            s && s.length && n.show();
            d.showCloseButton && E.show();
            Y();
            d.hideOnContentClick && j.bind("click", b.fancybox.close);
            d.hideOnOverlayClick && u.bind("click", b.fancybox.close);
            b(window).bind("resize.fb", b.fancybox.resize);
            d.centerOnScroll && b(window).bind("scroll.fb", b.fancybox.center);
            if (d.type == "iframe") b('<iframe id="fancybox-frame" name="fancybox-frame' + (new Date).getTime() + '" frameborder="0" hspace="0" ' + (b.browser.msie ? 'allowtransparency="true""' : "") + ' scrolling="' + e.scrolling + '" src="' + d.href + '"></iframe>').appendTo(j);
            f.show();
            h = false;
            b.fancybox.center();
            d.onComplete(l, p, d);
            var a, c;
            if (l.length - 1 > p) {
                a = l[p + 1].href;
                if (typeof a !== "undefined" && a.match(J)) {
                    c = new Image;
                    c.src = a
                }
            }
            if (p > 0) {
                a = l[p - 1].href;
                if (typeof a !== "undefined" && a.match(J)) {
                    c = new Image;
                    c.src = a
                }
            }
        },
        T = function (a) {
            var c = {
                width: parseInt(r.width + (i.width - r.width) * a, 10),
                height: parseInt(r.height + (i.height - r.height) * a, 10),
                top: parseInt(r.top + (i.top - r.top) * a, 10),
                left: parseInt(r.left + (i.left - r.left) * a, 10)
            };
            if (typeof i.opacity !== "undefined") c.opacity = a < 0.5 ? 0.5 : a;
            f.css(c);
            j.css({
                width: c.width - d.padding * 2,
                height: c.height - y * a - d.padding * 2
            })
        },
        U = function () {
            return [b(window).width() - d.margin * 2, b(window).height() - d.margin * 2, b(document).scrollLeft() + d.margin, b(document).scrollTop() + d.margin]
        },
        X = function () {
            var a = U(),
                c = {},
                g = d.autoScale,
                k = d.padding * 2;
            c.width = d.width.toString().indexOf("%") > -1 ? parseInt(a[0] * parseFloat(d.width) / 100, 10) : d.width + k;
            c.height = d.height.toString().indexOf("%") > -1 ? parseInt(a[1] * parseFloat(d.height) / 100, 10) : d.height + k;
            if (g && (c.width > a[0] || c.height > a[1]))
                if (e.type ==
                    "image" || e.type == "swf") {
                    g = d.width / d.height;
                    if (c.width > a[0]) {
                        c.width = a[0];
                        c.height = parseInt((c.width - k) / g + k, 10)
                    }
                    if (c.height > a[1]) {
                        c.height = a[1];
                        c.width = parseInt((c.height - k) * g + k, 10)
                    }
                } else {
                    c.width = Math.min(c.width, a[0]);
                    c.height = Math.min(c.height, a[1])
                }
            c.top = parseInt(Math.max(a[3] - 20, a[3] + (a[1] - c.height - 40) * 0.5), 10);
            c.left = parseInt(Math.max(a[2] - 20, a[2] + (a[0] - c.width - 40) * 0.5), 10);
            return c
        },
        V = function () {
            var a = e.orig ? b(e.orig) : false,
                c = {};
            if (a && a.length) {
                c = a.offset();
                c.top += parseInt(a.css("paddingTop"),
                    10) || 0;
                c.left += parseInt(a.css("paddingLeft"), 10) || 0;
                c.top += parseInt(a.css("border-top-width"), 10) || 0;
                c.left += parseInt(a.css("border-left-width"), 10) || 0;
                c.width = a.width();
                c.height = a.height();
                c = {
                    width: c.width + d.padding * 2,
                    height: c.height + d.padding * 2,
                    top: c.top - d.padding - 20,
                    left: c.left - d.padding - 20
                }
            } else {
                a = U();
                c = {
                    width: d.padding * 2,
                    height: d.padding * 2,
                    top: parseInt(a[3] + a[1] * 0.5, 10),
                    left: parseInt(a[2] + a[0] * 0.5, 10)
                }
            }
            return c
        },
        Z = function () {
            if (t.is(":visible")) {
                b("div", t).css("top", L * -40 + "px");
                L = (L + 1) % 12
            } else clearInterval(K)
        };
    b.fn.fancybox = function (a) {
        if (!b(this).length) return this;
        b(this).data("fancybox", b.extend({}, a, b.metadata ? b(this).metadata() : {})).unbind("click.fb").bind("click.fb", function (c) {
            c.preventDefault();
            if (!h) {
                h = true;
                b(this).blur();
                o = [];
                q = 0;
                c = b(this).attr("rel") || "";
                if (!c || c == "" || c === "nofollow") o.push(this);
                else {
                    o = b("a[rel=" + c + "], area[rel=" + c + "]");
                    q = o.index(this)
                }
                I()
            }
        });
        return this
    };
    b.fancybox = function (a, c) {
        var g;
        if (!h) {
            h = true;
            g = typeof c !== "undefined" ? c : {};
            o = [];
            q = parseInt(g.index, 10) || 0;
            if (b.isArray(a)) {
                for (var k =
                        0, C = a.length; k < C; k++)
                    if (typeof a[k] == "object") b(a[k]).data("fancybox", b.extend({}, g, a[k]));
                    else a[k] = b({}).data("fancybox", b.extend({
                        content: a[k]
                    }, g));
                o = jQuery.merge(o, a)
            } else {
                if (typeof a == "object") b(a).data("fancybox", b.extend({}, g, a));
                else a = b({}).data("fancybox", b.extend({
                    content: a
                }, g));
                o.push(a)
            }
            if (q > o.length || q < 0) q = 0;
            I()
        }
    };
    b.fancybox.showActivity = function () {
        clearInterval(K);
        t.show();
        K = setInterval(Z, 66)
    };
    b.fancybox.hideActivity = function () {
        t.hide()
    };
    b.fancybox.next = function () {
        return b.fancybox.pos(p +
            1)
    };
    b.fancybox.prev = function () {
        return b.fancybox.pos(p - 1)
    };
    b.fancybox.pos = function (a) {
        if (!h) {
            a = parseInt(a);
            o = l;
            if (a > -1 && a < l.length) {
                q = a;
                I()
            } else if (d.cyclic && l.length > 1) {
                q = a >= l.length ? 0 : l.length - 1;
                I()
            }
        }
    };
    b.fancybox.cancel = function () {
        if (!h) {
            h = true;
            b.event.trigger("fancybox-cancel");
            N();
            e.onCancel(o, q, e);
            h = false
        }
    };
    b.fancybox.close = function () {
        function a() {
            u.fadeOut("fast");
            n.empty().hide();
            f.hide();
            b.event.trigger("fancybox-cleanup");
            j.empty();
            d.onClosed(l, p, d);
            l = e = [];
            p = q = 0;
            d = e = {};
            h = false
        }
        if (!(h || f.is(":hidden"))) {
            h =
                true;
            if (d && false === d.onCleanup(l, p, d)) h = false;
            else {
                N();
                b(E.add(z).add(A)).hide();
                b(j.add(u)).unbind();
                b(window).unbind("resize.fb scroll.fb");
                b(document).unbind("keydown.fb");
                j.find("iframe").attr("src", M && /^https/i.test(window.location.href || "") ? "javascript:void(false)" : "about:blank");
                d.titlePosition !== "inside" && n.empty();
                f.stop();
                if (d.transitionOut == "elastic") {
                    r = V();
                    var c = f.position();
                    i = {
                        top: c.top,
                        left: c.left,
                        width: f.width(),
                        height: f.height()
                    };
                    if (d.opacity) i.opacity = 1;
                    n.empty().hide();
                    B.prop = 1;
                    b(B).animate({
                        prop: 0
                    }, {
                        duration: d.speedOut,
                        easing: d.easingOut,
                        step: T,
                        complete: a
                    })
                } else f.fadeOut(d.transitionOut == "none" ? 0 : d.speedOut, a)
            }
        }
    };
    b.fancybox.resize = function () {
        u.is(":visible") && u.css("height", b(document).height());
        b.fancybox.center(true)
    };
    b.fancybox.center = function (a) {
        var c, g;
        if (!h) {
            g = a === true ? 1 : 0;
            c = U();
            !g && (f.width() > c[0] || f.height() > c[1]) || f.stop().animate({
                top: parseInt(Math.max(c[3] - 20, c[3] + (c[1] - j.height() - 40) * 0.5 - d.padding)),
                left: parseInt(Math.max(c[2] - 20, c[2] + (c[0] - j.width() - 40) * 0.5 -
                    d.padding))
            }, typeof a == "number" ? a : 200)
        }
    };
    b.fancybox.init = function () {
        if (!b("#fancybox-wrap").length) {
            b("body").append(m = b('<div id="fancybox-tmp"></div>'), t = b('<div id="fancybox-loading"><div></div></div>'), u = b('<div id="fancybox-overlay"></div>'), f = b('<div id="fancybox-wrap"></div>'));
            D = b('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(f);
            D.append(j = b('<div id="fancybox-content"></div>'), E = b('<a id="fancybox-close"></a>'), n = b('<div id="fancybox-title"></div>'), z = b('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'), A = b('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>'));
            E.click(b.fancybox.close);
            t.click(b.fancybox.cancel);
            z.click(function (a) {
                a.preventDefault();
                b.fancybox.prev()
            });
            A.click(function (a) {
                a.preventDefault();
                b.fancybox.next()
            });
            b.fn.mousewheel && f.bind("mousewheel.fb", function (a, c) {
                if (h) a.preventDefault();
                else if (b(a.target).get(0).clientHeight == 0 || b(a.target).get(0).scrollHeight === b(a.target).get(0).clientHeight) {
                    a.preventDefault();
                    b.fancybox[c > 0 ? "prev" : "next"]()
                }
            });
            b.support.opacity || f.addClass("fancybox-ie");
            if (M) {
                t.addClass("fancybox-ie6");
                f.addClass("fancybox-ie6");
                b('<iframe id="fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || "") ? "javascript:void(false)" : "about:blank") + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(D)
            }
        }
    };
    b.fn.fancybox.defaults = {
        padding: 10,
        margin: 40,
        opacity: false,
        modal: false,
        cyclic: false,
        scrolling: "auto",
        width: 560,
        height: 340,
        autoScale: true,
        autoDimensions: true,
        centerOnScroll: false,
        ajax: {},
        swf: {
            wmode: "transparent"
        },
        hideOnOverlayClick: true,
        hideOnContentClick: false,
        overlayShow: true,
        overlayOpacity: 0.7,
        overlayColor: "#777",
        titleShow: true,
        titlePosition: "float",
        titleFormat: null,
        titleFromAlt: false,
        transitionIn: "fade",
        transitionOut: "fade",
        speedIn: 300,
        speedOut: 300,
        changeSpeed: 300,
        changeFade: "fast",
        easingIn: "swing",
        easingOut: "swing",
        showCloseButton: true,
        showNavArrows: true,
        enableEscapeButton: true,
        enableKeyboardNav: true,
        onStart: function () {},
        onCancel: function () {},
        onComplete: function () {},
        onCleanup: function () {},
        onClosed: function () {},
        onError: function () {}
    };
    b(document).ready(function () {
        b.fancybox.init()
    })
})(jQuery);

// jquery.tweet.js - See http://tweet.seaofclouds.com/ or https://github.com/seaofclouds/tweet for more info
// Copyright (c) 2008-2012 Todd Matthews & Steve Purcell
(function (factory) {
    if (typeof define === 'function' && define.amd)
        define(['jquery'], factory); // AMD support for RequireJS etc.
    else
        factory(jQuery);
}(function ($) {
    $.fn.tweet = function (o) {
        var s = $.extend({
            username: null, // [string or array] required unless using the 'query' option; one or more twitter screen names (use 'list' option for multiple names, where possible)
            list: null, // [string]   optional name of list belonging to username
            favorites: false, // [boolean]  display the user's favorites instead of his tweets
            query: null, // [string]   optional search query (see also: http://search.twitter.com/operators)
            avatar_size: null, // [integer]  height and width of avatar if displayed (48px max)
            count: 3, // [integer]  how many tweets to display?
            fetch: null, // [integer]  how many tweets to fetch via the API (set this higher than 'count' if using the 'filter' option)
            page: 1, // [integer]  which page of results to fetch (if count != fetch, you'll get unexpected results)
            retweets: true, // [boolean]  whether to fetch (official) retweets (not supported in all display modes)
            intro_text: null, // [string]   do you want text BEFORE your your tweets?
            outro_text: null, // [string]   do you want text AFTER your tweets?
            join_text: null, // [string]   optional text in between date and tweet, try setting to "auto"
            auto_join_text_default: " I said, ", // [string]   auto text for non verb: "I said" bullocks
            auto_join_text_ed: " I ", // [string]   auto text for past tense: "I" surfed
            auto_join_text_ing: " I am ", // [string]   auto tense for present tense: "I was" surfing
            auto_join_text_reply: " I replied to ", // [string]   auto tense for replies: "I replied to" @someone "with"
            auto_join_text_url: " I was looking at ", // [string]   auto tense for urls: "I was looking at" http:...
            loading_text: null, // [string]   optional loading text, displayed while tweets load
            refresh_interval: null, // [integer]  optional number of seconds after which to reload tweets
            twitter_url: "twitter.com", // [string]   custom twitter url, if any (apigee, etc.)
            twitter_api_url: "api.twitter.com", // [string]   custom twitter api url, if any (apigee, etc.)
            twitter_search_url: "search.twitter.com", // [string]   custom twitter search url, if any (apigee, etc.)
            template: "{avatar}{time}{join} {text}", // [string or function] template used to construct each tweet <li> - see code for available vars
            comparator: function (tweet1, tweet2) { // [function] comparator used to sort tweets (see Array.sort)
                return tweet2["tweet_time"] - tweet1["tweet_time"];
            },
            filter: function (tweet) { // [function] whether or not to include a particular tweet (be sure to also set 'fetch')
                    return true;
                }
                // You can attach callbacks to the following events using jQuery's standard .bind() mechanism:
                //   "loaded" -- triggered when tweets have been fetched and rendered
        }, o);

        // See http://daringfireball.net/2010/07/improved_regex_for_matching_urls
        var url_regexp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;

        // Expand values inside simple string templates with {placeholders}
        function t(template, info) {
            if (typeof template === "string") {
                var result = template;
                for (var key in info) {
                    var val = info[key];
                    result = result.split('{' + key + '}').join(val === null ? '' : val);
                }
                return result;
            } else return template(info);
        }
        // Export the t function for use when passing a function as the 'template' option
        $.extend({
            tweet: {
                t: t
            }
        });

        function replacer(regex, replacement) {
            return function () {
                var returning = [];
                this.each(function () {
                    returning.push(this.replace(regex, replacement));
                });
                return $(returning);
            };
        }

        function escapeHTML(s) {
            return s.replace(/</g, "&lt;").replace(/>/g, "^&gt;");
        }

        $.fn.extend({
            linkUser: replacer(/(^|[\W])@(\w+)/gi, "$1<span class=\"at\">@</span><a href=\"http://" + s.twitter_url + "/$2\">$2</a>"),
            // Support various latin1 (\u00**) and arabic (\u06**) alphanumeric chars
            linkHash: replacer(/(?:^| )[\#]+([\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0600-\u06ff]+)/gi,
                ' <a href="http://' + s.twitter_search_url + '/search?q=&tag=$1&lang=all' +
                ((s.username && s.username.length == 1 && !s.list) ? '&from=' + s.username.join("%2BOR%2B") : '') +
                '" class="tweet_hashtag">#$1</a>'),
            makeHeart: replacer(/(&lt;)+[3]/gi, "<tt class='heart'>&#x2665;</tt>")
        });

        function linkURLs(text, entities) {
            return text.replace(url_regexp, function (match) {
                var url = (/^[a-z]+:/i).test(match) ? match : "http://" + match;
                var text = match;
                for (var i = 0; i < entities.length; ++i) {
                    var entity = entities[i];
                    if (entity.url == url && entity.expanded_url) {
                        url = entity.expanded_url;
                        text = entity.display_url;
                        break;
                    }
                }
                return "<a href=\"" + escapeHTML(url) + "\">" + escapeHTML(text) + "</a>";
            });
        }

        function parse_date(date_str) {
            // The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
            // cannot handle in IE. We therefore perform the following transformation:
            // "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
            return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
        }

        function extract_relative_time(date) {
            var toInt = function (val) {
                return parseInt(val, 10);
            };
            var relative_to = new Date();
            var delta = toInt((relative_to.getTime() - date) / 1000);
            if (delta < 1) delta = 0;
            return {
                days: toInt(delta / 86400),
                hours: toInt(delta / 3600),
                minutes: toInt(delta / 60),
                seconds: toInt(delta)
            };
        }

        function format_relative_time(time_ago) {
            if (time_ago.days > 2) return 'about ' + time_ago.days + ' days ago';
            if (time_ago.hours > 24) return 'about a day ago';
            if (time_ago.hours > 2) return 'about ' + time_ago.hours + ' hours ago';
            if (time_ago.minutes > 45) return 'about an hour ago';
            if (time_ago.minutes > 2) return 'about ' + time_ago.minutes + ' minutes ago';
            if (time_ago.seconds > 1) return 'about ' + time_ago.seconds + ' seconds ago';
            return 'just now';
        }

        function build_auto_join_text(text) {
            if (text.match(/^(@([A-Za-z0-9-_]+)) .*/i)) {
                return s.auto_join_text_reply;
            } else if (text.match(url_regexp)) {
                return s.auto_join_text_url;
            } else if (text.match(/^((\w+ed)|just) .*/im)) {
                return s.auto_join_text_ed;
            } else if (text.match(/^(\w*ing) .*/i)) {
                return s.auto_join_text_ing;
            } else {
                return s.auto_join_text_default;
            }
        }

        function build_api_url() {
            var proto = ('https:' == document.location.protocol ? 'https:' : 'http:');
            var count = (s.fetch === null) ? s.count : s.fetch;
            var common_params = '&callback=?';
            if (s.list) {
                return proto + "//" + s.twitter_api_url + "/1/" + s.username[0] + "/lists/" + s.list + "/statuses.json?page=" + s.page + "&per_page=" + count + common_params;
            } else if (s.favorites) {
                return proto + "//" + s.twitter_api_url + "/1/favorites.json?screen_name=" + s.username[0] + "&page=" + s.page + "&count=" + count + common_params;
            } else if (s.query === null && s.username.length == 1) {
                return proto + '//' + s.twitter_api_url + '/1/statuses/user_timeline.json?screen_name=' + s.username[0] + '&count=' + count + (s.retweets ? '&include_rts=1' : '') + '&page=' + s.page + common_params;
            } else {
                var query = (s.query || 'from:' + s.username.join(' OR from:'));
                return proto + '//' + s.twitter_search_url + '/search.json?&q=' + encodeURIComponent(query) + '&rpp=' + count + '&page=' + s.page + common_params;
            }
        }

        function extract_avatar_url(item, secure) {
            if (secure) {
                return ('user' in item) ?
                    item.user.profile_image_url_https :
                    extract_avatar_url(item, false).
                replace(/^http:\/\/[a-z0-9]{1,3}\.twimg\.com\//, "https://s3.amazonaws.com/twitter_production/");
            } else {
                return item.profile_image_url || item.user.profile_image_url;
            }
        }

        // Convert twitter API objects into data available for
        // constructing each tweet <li> using a template
        function extract_template_data(item) {
            var o = {};
            o.item = item;
            o.source = item.source;
            o.screen_name = item.from_user || item.user.screen_name;
            // The actual user name is not returned by all Twitter APIs, so please do not
            // file an issue if it is empty:
            o.name = item.from_user_name || item.user.name;
            o.retweet = typeof (item.retweeted_status) != 'undefined';

            o.tweet_time = parse_date(item.created_at);
            o.join_text = s.join_text == "auto" ? build_auto_join_text(item.text) : s.join_text;
            o.tweet_id = item.id_str;
            o.twitter_base = "http://" + s.twitter_url + "/";
            o.user_url = o.twitter_base + o.screen_name;
            o.tweet_url = o.user_url + "/status/" + o.tweet_id;
            o.reply_url = o.twitter_base + "intent/tweet?in_reply_to=" + o.tweet_id;
            o.retweet_url = o.twitter_base + "intent/retweet?tweet_id=" + o.tweet_id;
            o.favorite_url = o.twitter_base + "intent/favorite?tweet_id=" + o.tweet_id;
            o.retweeted_screen_name = o.retweet && item.retweeted_status.user.screen_name;
            o.tweet_relative_time = format_relative_time(extract_relative_time(o.tweet_time));
            o.entities = item.entities ? (item.entities.urls || []).concat(item.entities.media || []) : [];
            o.tweet_raw_text = o.retweet ? ('RT @' + o.retweeted_screen_name + ' ' + item.retweeted_status.text) : item.text; // avoid '...' in long retweets
            o.tweet_text = $([linkURLs(o.tweet_raw_text, o.entities)]).linkUser().linkHash()[0];
            o.retweeted_tweet_text = $([linkURLs(item.text, o.entities)]).linkUser().linkHash()[0];
            o.tweet_text_fancy = $([o.tweet_text]).makeHeart()[0];

            o.avatar_size = s.avatar_size;
            o.avatar_url = extract_avatar_url(o.retweet ? item.retweeted_status : item, (document.location.protocol === 'https:'));
            o.avatar_screen_name = o.retweet ? o.retweeted_screen_name : o.screen_name;
            o.avatar_profile_url = o.twitter_base + o.avatar_screen_name;

            // Default spans, and pre-formatted blocks for common layouts
            o.user = t('<a class="tweet_user" href="{user_url}">{screen_name}</a>', o);
            o.join = s.join_text ? t('<span class="tweet_join">{join_text}</span>', o) : '';
            o.avatar = o.avatar_size ?
                t('<a class="tweet_avatar" href="{avatar_profile_url}"><img src="{avatar_url}" height="{avatar_size}" width="{avatar_size}" alt="{avatar_screen_name}\'s avatar" title="{avatar_screen_name}\'s avatar" border="0"/></a>', o) : '';
            o.time = t('<span class="tweet_time"><a href="{tweet_url}" title="view tweet on twitter">{tweet_relative_time}</a></span>', o);
            o.text = t('<span class="tweet_text">{tweet_text_fancy}</span>', o);
            o.retweeted_text = t('<span class="tweet_text">{retweeted_tweet_text}</span>', o);
            o.reply_action = t('<a class="tweet_action tweet_reply" href="{reply_url}">reply</a>', o);
            o.retweet_action = t('<a class="tweet_action tweet_retweet" href="{retweet_url}">retweet</a>', o);
            o.favorite_action = t('<a class="tweet_action tweet_favorite" href="{favorite_url}">favorite</a>', o);
            return o;
        }

        function render_tweets(widget, tweets) {
            var list = $('<ul class="tweet_list">');
            list.append($.map(tweets, function (o) {
                return "<li>" + t(s.template, o) + "</li>";
            }).join('')).
            children('li:first').addClass('tweet_first').end().
            children('li:odd').addClass('tweet_even').end().
            children('li:even').addClass('tweet_odd');

            $(widget).empty().append(list);
            if (s.intro_text) list.before('<p class="tweet_intro">' + s.intro_text + '</p>');
            if (s.outro_text) list.after('<p class="tweet_outro">' + s.outro_text + '</p>');

            $(widget).trigger("loaded").trigger((tweets.length === 0 ? "empty" : "full"));
            if (s.refresh_interval) {
                window.setTimeout(function () {
                    $(widget).trigger("tweet:load");
                }, 1000 * s.refresh_interval);
            }
        }

        function load(widget) {
            var loading = $('<p class="loading">' + s.loading_text + '</p>');
            if (s.loading_text) $(widget).not(":has(.tweet_list)").empty().append(loading);
            $.getJSON(build_api_url(), function (data) {
                var tweets = $.map(data.results || data, extract_template_data);
                tweets = $.grep(tweets, s.filter).sort(s.comparator).slice(0, s.count);
                $(widget).trigger("tweet:retrieved", [tweets]);
            });
        }

        return this.each(function (i, widget) {
            if (s.username && typeof (s.username) == "string") {
                s.username = [s.username];
            }

            $(widget).unbind("tweet:render").unbind("tweet:retrieved").unbind("tweet:load").
            bind({
                "tweet:load": function () {
                    load(widget);
                },
                "tweet:retrieved": function (ev, tweets) {
                    $(widget).trigger("tweet:render", [tweets])
                },
                "tweet:render": function (ev, tweets) {
                    render_tweets($(widget), tweets);
                }
            }).trigger("tweet:load");
        });
    };
}));

// Generated by CoffeeScript 1.3.3

/*
Easy pie chart is a jquery plugin to display simple animated pie charts for only one value

Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

Built on top of the jQuery library (http://jquery.com)

@source: http://github.com/rendro/easy-pie-chart/
@autor: Robert Fleischmann
@version: 1.0.1

Inspired by: http://dribbble.com/shots/631074-Simple-Pie-Charts-II?list=popular&offset=210
Thanks to Philip Thrasher for the jquery plugin boilerplate for coffee script
*/


(function () {

    (function ($) {
        $.easyPieChart = function (el, options) {
            var addScaleLine, animateLine, drawLine, easeInOutQuad, renderBackground, renderScale, renderTrack,
                _this = this;
            this.el = el;
            this.$el = $(el);
            this.$el.data("easyPieChart", this);
            this.init = function () {
                var percent;
                _this.options = $.extend({}, $.easyPieChart.defaultOptions, options);
                percent = parseInt(_this.$el.data('percent'), 10);
                _this.percentage = 0;
                _this.canvas = $("<canvas width='" + _this.options.size + "' height='" + _this.options.size + "'></canvas>").get(0);
                _this.$el.append(_this.canvas);
                if (typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager !== null) {
                    G_vmlCanvasManager.initElement(_this.canvas);
                }
                _this.ctx = _this.canvas.getContext('2d');
                _this.ctx.translate(_this.options.size / 2, _this.options.size / 2);
                _this.$el.addClass('easyPieChart');
                _this.$el.css({
                    width: _this.options.size,
                    height: _this.options.size,
                    lineHeight: "" + _this.options.size + "px"
                });
                _this.update(percent);
                return _this;
            };
            this.update = function (percent) {
                if (_this.options.animate === false) {
                    return drawLine(percent);
                } else {
                    return animateLine(_this.percentage, percent);
                }
            };
            renderScale = function () {
                var i, _i, _results;
                _this.ctx.fillStyle = _this.options.scaleColor;
                _this.ctx.lineWidth = 1;
                _results = [];
                for (i = _i = 0; _i <= 24; i = ++_i) {
                    _results.push(addScaleLine(i));
                }
                return _results;
            };
            addScaleLine = function (i) {
                var offset;
                offset = i % 6 === 0 ? 0 : _this.options.size * 0.017;
                _this.ctx.save();
                _this.ctx.rotate(i * Math.PI / 12);
                _this.ctx.fillRect(_this.options.size / 2 - offset, 0, -_this.options.size * 0.05 + offset, 1);
                return _this.ctx.restore();
            };
            renderTrack = function () {
                var offset;
                offset = _this.options.size / 2 - _this.options.lineWidth / 2;
                if (_this.options.scaleColor !== false) {
                    offset -= _this.options.size * 0.08;
                }
                _this.ctx.beginPath();
                _this.ctx.arc(0, 0, offset, 0, Math.PI * 2, true);
                _this.ctx.closePath();
                _this.ctx.strokeStyle = _this.options.trackColor;
                _this.ctx.lineWidth = _this.options.lineWidth;
                return _this.ctx.stroke();
            };
            renderBackground = function () {
                if (_this.options.scaleColor !== false) {
                    renderScale();
                }
                if (_this.options.trackColor !== false) {
                    return renderTrack();
                }
            };
            drawLine = function (percent) {
                var offset;
                renderBackground();
                _this.ctx.strokeStyle = $.isFunction(_this.options.barColor) ? _this.options.barColor(percent) : _this.options.barColor;
                _this.ctx.lineCap = _this.options.lineCap;
                offset = _this.options.size / 2 - _this.options.lineWidth / 2;
                if (_this.options.scaleColor !== false) {
                    offset -= _this.options.size * 0.08;
                }
                _this.ctx.save();
                _this.ctx.rotate(-Math.PI / 2);
                _this.ctx.beginPath();
                _this.ctx.arc(0, 0, offset, 0, Math.PI * 2 * percent / 100, false);
                _this.ctx.stroke();
                return _this.ctx.restore();
            };
            animateLine = function (from, to) {
                var currentStep, fps, steps;
                fps = 30;
                steps = fps * _this.options.animate / 1000;
                currentStep = 0;
                _this.options.onStart.call(_this);
                _this.percentage = to;
                if (_this.animation) {
                    clearInterval(_this.animation);
                    _this.animation = false;
                }
                return _this.animation = setInterval(function () {
                    _this.ctx.clearRect(-_this.options.size / 2, -_this.options.size / 2, _this.options.size, _this.options.size);
                    renderBackground.call(_this);
                    drawLine.call(_this, [easeInOutQuad(currentStep, from, to - from, steps)]);
                    currentStep++;
                    if ((currentStep / steps) > 1) {
                        clearInterval(_this.animation);
                        _this.animation = false;
                        return _this.options.onStop.call(_this);
                    }
                }, 1000 / fps);
            };
            easeInOutQuad = function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) {
                    return c / 2 * t * t + b;
                } else {
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                }
            };
            return this.init();
        };
        $.easyPieChart.defaultOptions = {
            barColor: '#ef1e25',
            trackColor: '#f2f2f2',
            scaleColor: '#dfe0e0',
            lineCap: 'round',
            size: 110,
            lineWidth: 3,
            animate: false,
            onStart: $.noop,
            onStop: $.noop
        };
        $.fn.easyPieChart = function (options) {
            return $.each(this, function (i, el) {
                var $el;
                $el = $(el);
                if (!$el.data('easyPieChart')) {
                    return $el.data('easyPieChart', new $.easyPieChart(el, options));
                }
            });
        };
        return void 0;
    })(jQuery);

}).call(this);

/*
 * validate.js 1.1
 * Copyright (c) 2012 Rick Harrison, http://rickharrison.me
 * validate.js is open sourced under the MIT license.
 * Portions of validate.js are inspired by CodeIgniter.
 * http://rickharrison.github.com/validate.js
 */

(function (k, l, i) {
    var m = {
            required: "The %s field is required.",
            matches: "The %s field does not match the %s field.",
            valid_email: "The %s field must contain a valid email address.",
            valid_emails: "The %s field must contain all valid email addresses.",
            min_length: "The %s field must be at least %s characters in length.",
            max_length: "The %s field must not exceed %s characters in length.",
            exact_length: "The %s field must be exactly %s characters in length.",
            greater_than: "The %s field must contain a number greater than %s.",
            less_than: "The %s field must contain a number less than %s.",
            alpha: "The %s field must only contain alphabetical characters.",
            alpha_numeric: "The %s field must only contain alpha-numeric characters.",
            alpha_dash: "The %s field must only contain alpha-numeric characters, underscores, and dashes.",
            numeric: "The %s field must contain only numbers.",
            integer: "The %s field must contain an integer.",
            decimal: "The %s field must contain a decimal number.",
            is_natural: "The %s field must contain only positive numbers.",
            is_natural_no_zero: "The %s field must contain a number greater than zero.",
            valid_ip: "The %s field must contain a valid IP.",
            valid_base64: "The %s field must contain a base64 string."
        },
        n = function () {},
        o = /^(.+)\[(.+)\]$/,
        h = /^[0-9]+$/,
        p = /^\-?[0-9]+$/,
        g = /^\-?[0-9]*\.?[0-9]+$/,
        j = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
        q = /^[a-z]+$/i,
        r = /^[a-z0-9]+$/i,
        s = /^[a-z0-9_-]+$/i,
        t = /^[0-9]+$/i,
        u = /^[1-9][0-9]*$/i,
        v = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        w =
        /[^a-zA-Z0-9\/\+=]/i,
        e = function (a, b, c) {
            this.callback = c || n;
            this.errors = [];
            this.fields = {};
            this.form = l.forms[a] || {};
            this.messages = {};
            this.handlers = {};
            a = 0;
            for (c = b.length; a < c; a++) {
                var d = b[a];
                d.name && d.rules && (this.fields[d.name] = {
                    name: d.name,
                    display: d.display || d.name,
                    rules: d.rules,
                    id: null,
                    type: null,
                    value: null,
                    checked: null
                })
            }
            this.form.onsubmit = function (a) {
                return function (b) {
                    try {
                        return a._validateForm(b)
                    } catch (c) {}
                }
            }(this)
        };
    e.prototype.setMessage = function (a, b) {
        this.messages[a] = b;
        return this
    };
    e.prototype.registerCallback =
        function (a, b) {
            a && ("string" === typeof a && b && "function" === typeof b) && (this.handlers[a] = b);
            return this
        };
    e.prototype._validateForm = function (a) {
        this.errors = [];
        for (var b in this.fields)
            if (this.fields.hasOwnProperty(b)) {
                var c = this.fields[b] || {},
                    d = this.form[c.name];
                d && d !== i && (c.id = d.id, c.type = d.type, c.value = d.value, c.checked = d.checked);
                this._validateField(c)
            }
            "function" === typeof this.callback && this.callback(this.errors, a);
        if (0 < this.errors.length)
            if (a && a.preventDefault) a.preventDefault();
            else return !1;
        return !0
    };
    e.prototype._validateField = function (a) {
        var b = a.rules.split("|");
        if (!(-1 === a.rules.indexOf("required") && (!a.value || "" === a.value || a.value === i)))
            for (var c = 0, d = b.length; c < d; c++) {
                var f = b[c],
                    e = null,
                    g = !1;
                if (parts = o.exec(f)) f = parts[1], e = parts[2];
                "function" === typeof this._hooks[f] ? this._hooks[f].apply(this, [a, e]) || (g = !0) : "callback_" === f.substring(0, 9) && (f = f.substring(9, f.length), "function" === typeof this.handlers[f] && !1 === this.handlers[f].apply(this, [a.value]) && (g = !0));
                if (g) {
                    b = this.messages[f] || m[f];
                    c = "An error has occurred with the " +
                        a.display + " field.";
                    b && (c = b.replace("%s", a.display), e && (c = c.replace("%s", this.fields[e] ? this.fields[e].display : e)));
                    this.errors.push({
                        id: a.id,
                        name: a.name,
                        message: c
                    });
                    break
                }
            }
    };
    e.prototype._hooks = {
        required: function (a) {
            var b = a.value;
            return "checkbox" === a.type ? !0 === a.checked : null !== b && "" !== b
        },
        matches: function (a, b) {
            return (el = this.form[b]) ? a.value === el.value : !1
        },
        valid_email: function (a) {
            return j.test(a.value)
        },
        valid_emails: function (a) {
            for (var a = a.value.split(","), b = 0; b < a.length; b++)
                if (!j.test(a[b])) return !1;
            return !0
        },
        min_length: function (a, b) {
            return !h.test(b) ? !1 : a.value.length >= parseInt(b, 10)
        },
        max_length: function (a, b) {
            return !h.test(b) ? !1 : a.value.length <= parseInt(b, 10)
        },
        exact_length: function (a, b) {
            return !h.test(b) ? !1 : a.value.length === parseInt(b, 10)
        },
        greater_than: function (a, b) {
            return !g.test(a.value) ? !1 : parseFloat(a.value) > parseFloat(b)
        },
        less_than: function (a, b) {
            return !g.test(a.value) ? !1 : parseFloat(a.value) < parseFloat(b)
        },
        alpha: function (a) {
            return q.test(a.value)
        },
        alpha_numeric: function (a) {
            return r.test(a.value)
        },
        alpha_dash: function (a) {
            return s.test(a.value)
        },
        numeric: function (a) {
            return g.test(a.value)
        },
        integer: function (a) {
            return p.test(a.value)
        },
        decimal: function (a) {
            return g.test(a.value)
        },
        is_natural: function (a) {
            return t.test(a.value)
        },
        is_natural_no_zero: function (a) {
            return u.test(a.value)
        },
        valid_ip: function (a) {
            return v.test(a.value)
        },
        valid_base64: function (a) {
            return w.test(a.value)
        }
    };
    k.FormValidator = e
})(window, document);


/**
 * Isotope v1.5.05
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2011 David DeSandro / Metafizzy
 */
/*jshint curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, undef: true */
/*global Modernizr: true, jQuery: true */
(function (a, b, c) {
    "use strict";
    var d = function (a) {
            return a.charAt(0).toUpperCase() + a.slice(1)
        },
        e = "Moz Webkit Khtml O Ms".split(" "),
        f = function (a) {
            var b = document.documentElement.style,
                c;
            if (typeof b[a] == "string") return a;
            a = d(a);
            for (var f = 0, g = e.length; f < g; f++) {
                c = e[f] + a;
                if (typeof b[c] == "string") return c
            }
        },
        g = f("transform"),
        h = f("transitionProperty"),
        i = {
            csstransforms: function () {
                return !!g
            },
            csstransforms3d: function () {
                var a = !!f("perspective");
                if (a) {
                    var c = " -o- -moz- -ms- -webkit- -khtml- ".split(" "),
                        d = "@media (" + c.join("transform-3d),(") + "modernizr)",
                        e = b("<style>" + d + "{#modernizr{height:3px}}" + "</style>").appendTo("head"),
                        g = b('<div id="modernizr" />').appendTo("html");
                    a = g.height() === 3, g.remove(), e.remove()
                }
                return a
            },
            csstransitions: function () {
                return !!h
            }
        };
    if (a.Modernizr)
        for (var j in i) Modernizr.hasOwnProperty(j) || Modernizr.addTest(j, i[j]);
    else a.Modernizr = function () {
        var a = {
                _version: "1.6ish: miniModernizr for Isotope"
            },
            c = " ",
            d, e;
        for (e in i) d = i[e](), a[e] = d, c += " " + (d ? "" : "no-") + e;
        b("html").addClass(c);
        return a
    }();
    if (Modernizr.csstransforms) {
        var k = Modernizr.csstransforms3d ? {
                translate: function (a) {
                    return "translate3d(" + a[0] + "px, " + a[1] + "px, 0) "
                },
                scale: function (a) {
                    return "scale3d(" + a + ", " + a + ", 1) "
                }
            } : {
                translate: function (a) {
                    return "translate(" + a[0] + "px, " + a[1] + "px) "
                },
                scale: function (a) {
                    return "scale(" + a + ") "
                }
            },
            l = function (a, c, d) {
                var e = b.data(a, "isoTransform") || {},
                    f = {},
                    h, i = {},
                    j;
                f[c] = d, b.extend(e, f);
                for (h in e) j = e[h], i[h] = k[h](j);
                var l = i.translate || "",
                    m = i.scale || "",
                    n = l + m;
                b.data(a, "isoTransform", e), a.style[g] = n
            };
        b.cssNumber.scale = !0, b.cssHooks.scale = {
            set: function (a, b) {
                l(a, "scale", b)
            },
            get: function (a, c) {
                var d = b.data(a, "isoTransform");
                return d && d.scale ? d.scale : 1
            }
        }, b.fx.step.scale = function (a) {
            b.cssHooks.scale.set(a.elem, a.now + a.unit)
        }, b.cssNumber.translate = !0, b.cssHooks.translate = {
            set: function (a, b) {
                l(a, "translate", b)
            },
            get: function (a, c) {
                var d = b.data(a, "isoTransform");
                return d && d.translate ? d.translate : [0, 0]
            }
        }
    }
    var m, n;
    Modernizr.csstransitions && (m = {
        WebkitTransitionProperty: "webkitTransitionEnd",
        MozTransitionProperty: "transitionend",
        OTransitionProperty: "oTransitionEnd",
        transitionProperty: "transitionEnd"
    }[h], n = f("transitionDuration"));
    var o = b.event,
        p;
    o.special.smartresize = {
        setup: function () {
            b(this).bind("resize", o.special.smartresize.handler)
        },
        teardown: function () {
            b(this).unbind("resize", o.special.smartresize.handler)
        },
        handler: function (a, b) {
            var c = this,
                d = arguments;
            a.type = "smartresize", p && clearTimeout(p), p = setTimeout(function () {
                jQuery.event.handle.apply(c, d)
            }, b === "execAsap" ? 0 : 100)
        }
    }, b.fn.smartresize = function (a) {
        return a ? this.bind("smartresize", a) : this.trigger("smartresize", ["execAsap"])
    }, b.Isotope = function (a, c, d) {
        this.element = b(c), this._create(a), this._init(d)
    };
    var q = ["overflow", "position", "width", "height"];
    b.Isotope.settings = {
        resizable: !0,
        layoutMode: "masonry",
        containerClass: "isotope",
        itemClass: "isotope-item",
        hiddenClass: "isotope-hidden",
        hiddenStyle: {
            opacity: 0,
            scale: .001
        },
        visibleStyle: {
            opacity: 1,
            scale: 1
        },
        animationEngine: "best-available",
        animationOptions: {
            queue: !1,
            duration: 800
        },
        sortBy: "original-order",
        sortAscending: !0,
        resizesContainer: !0,
        transformsEnabled: !b.browser.opera,
        itemPositionDataEnabled: !1
    }, b.Isotope.prototype = {
        _create: function (c) {
            this.options = b.extend({}, b.Isotope.settings, c), this.styleQueue = [], this.elemCount = 0;
            var d = this.element[0].style;
            this.originalStyle = {};
            for (var e = 0, f = q.length; e < f; e++) {
                var g = q[e];
                this.originalStyle[g] = d[g] || ""
            }
            this.element.css({
                overflow: "hidden",
                position: "relative"
            }), this._updateAnimationEngine(), this._updateUsingTransforms();
            var h = {
                "original-order": function (a, b) {
                    b.elemCount++;
                    return b.elemCount
                },
                random: function () {
                    return Math.random()
                }
            };
            this.options.getSortData = b.extend(this.options.getSortData, h), this.reloadItems();
            var i = b(document.createElement("div")).prependTo(this.element);
            this.offset = i.position(), i.remove();
            var j = this;
            setTimeout(function () {
                j.element.addClass(j.options.containerClass)
            }, 0), this.options.resizable && b(a).bind("smartresize.isotope", function () {
                j.resize()
            }), this.element.delegate("." + this.options.hiddenClass, "click", function () {
                return !1
            })
        },
        _getAtoms: function (a) {
            var b = this.options.itemSelector,
                c = b ? a.filter(b).add(a.find(b)) : a,
                d = {
                    position: "absolute"
                };
            this.usingTransforms && (d.left = 0, d.top = 0), c.css(d).addClass(this.options.itemClass), this.updateSortData(c, !0);
            return c
        },
        _init: function (a) {
            this.$filteredAtoms = this._filter(this.$allAtoms), this._sort(), this.reLayout(a)
        },
        option: function (a) {
            if (b.isPlainObject(a)) {
                this.options = b.extend(!0, this.options, a);
                var c;
                for (var e in a) c = "_update" + d(e), this[c] && this[c]()
            }
        },
        _updateAnimationEngine: function () {
            var a = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, "");
            switch (a) {
                case "css":
                case "none":
                    this.isUsingJQueryAnimation = !1;
                    break;
                case "jquery":
                    this.isUsingJQueryAnimation = !0;
                    break;
                default:
                    this.isUsingJQueryAnimation = !Modernizr.csstransitions
            }
            this._updateUsingTransforms()
        },
        _updateTransformsEnabled: function () {
            this._updateUsingTransforms()
        },
        _updateUsingTransforms: function () {
            var a = this.usingTransforms = this.options.transformsEnabled && Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;
            a || (delete this.options.hiddenStyle.scale, delete this.options.visibleStyle.scale), this.getPositionStyles = a ? this._translate : this._positionAbs
        },
        _filter: function (a, b) {
            b = b || (this.options.filter === "" ? "*" : this.options.filter);
            if (!b) return a;
            var c = this.options.hiddenClass,
                d = "." + c,
                e = a.filter(d),
                f = e;
            if (b !== "*") {
                f = e.filter(b);
                var g = a.not(d).not(b).addClass(c);
                this.styleQueue.push({
                    $el: g,
                    style: this.options.hiddenStyle
                })
            }
            this.styleQueue.push({
                $el: f,
                style: this.options.visibleStyle
            }), f.removeClass(c);
            return a.filter(b)
        },
        updateSortData: function (a, c) {
            var d = this,
                e = this.options.getSortData,
                f, g;
            a.each(function () {
                f = b(this), g = {};
                for (var a in e) !c && a === "original-order" ? g[a] = b.data(this, "isotope-sort-data")[a] : g[a] = e[a](f, d);
                b.data(this, "isotope-sort-data", g)
            })
        },
        _sort: function () {
            var a = this.options.sortBy,
                b = this._getSorter,
                c = this.options.sortAscending ? 1 : -1,
                d = function (d, e) {
                    var f = b(d, a),
                        g = b(e, a);
                    f === g && a !== "original-order" && (f = b(d, "original-order"), g = b(e, "original-order"));
                    return (f > g ? 1 : f < g ? -1 : 0) * c
                };
            this.$filteredAtoms.sort(d)
        },
        _getSorter: function (a, c) {
            return b.data(a, "isotope-sort-data")[c]
        },
        _translate: function (a, b) {
            return {
                translate: [a, b]
            }
        },
        _positionAbs: function (a, b) {
            return {
                left: a,
                top: b
            }
        },
        _pushPosition: function (a, b, c) {
            b += this.offset.left, c += this.offset.top;
            var d = this.getPositionStyles(b, c);
            this.styleQueue.push({
                $el: a,
                style: d
            }), this.options.itemPositionDataEnabled && a.data("isotope-item-position", {
                x: b,
                y: c
            })
        },
        layout: function (a, b) {
            var c = this.options.layoutMode;
            this["_" + c + "Layout"](a);
            if (this.options.resizesContainer) {
                var d = this["_" + c + "GetContainerSize"]();
                this.styleQueue.push({
                    $el: this.element,
                    style: d
                })
            }
            this._processStyleQueue(a, b), this.isLaidOut = !0
        },
        _processStyleQueue: function (a, c) {
            var d = this.isLaidOut ? this.isUsingJQueryAnimation ? "animate" : "css" : "css",
                e = this.options.animationOptions,
                f, g, h, i;
            g = function (a, b) {
                b.$el[d](b.style, e)
            };
            if (this._isInserting && this.isUsingJQueryAnimation) g = function (a, b) {
                f = b.$el.hasClass("no-transition") ? "css" : d, b.$el[f](b.style, e)
            };
            else if (c) {
                var j = !1,
                    k = this;
                h = !0, i = function () {
                    j || (c.call(k.element, a), j = !0)
                };
                if (this.isUsingJQueryAnimation && d === "animate") e.complete = i, h = !1;
                else if (Modernizr.csstransitions) {
                    var l = 0,
                        o = this.styleQueue[0].$el,
                        p;
                    while (!o.length) {
                        p = this.styleQueue[l++];
                        if (!p) return;
                        o = p.$el
                    }
                    var q = parseFloat(getComputedStyle(o[0])[n]);
                    q > 0 && (g = function (a, b) {
                        b.$el[d](b.style, e).one(m, i)
                    }, h = !1)
                }
            }
            b.each(this.styleQueue, g), h && i(), this.styleQueue = []
        },
        resize: function () {
            this["_" + this.options.layoutMode + "ResizeChanged"]() && this.reLayout()
        },
        reLayout: function (a) {
            this["_" + this.options.layoutMode + "Reset"](), this.layout(this.$filteredAtoms, a)
        },
        addItems: function (a, b) {
            var c = this._getAtoms(a);
            this.$allAtoms = this.$allAtoms.add(c), b && b(c)
        },
        insert: function (a, b) {
            this.element.append(a);
            var c = this;
            this.addItems(a, function (a) {
                var d = c._filter(a, !0);
                c._addHideAppended(d), c._sort(), c.reLayout(), c._revealAppended(d, b)
            })
        },
        appended: function (a, b) {
            var c = this;
            this.addItems(a, function (a) {
                c._addHideAppended(a), c.layout(a), c._revealAppended(a, b)
            })
        },
        _addHideAppended: function (a) {
            this.$filteredAtoms = this.$filteredAtoms.add(a), a.addClass("no-transition"), this._isInserting = !0, this.styleQueue.push({
                $el: a,
                style: this.options.hiddenStyle
            })
        },
        _revealAppended: function (a, b) {
            var c = this;
            setTimeout(function () {
                a.removeClass("no-transition"), c.styleQueue.push({
                    $el: a,
                    style: c.options.visibleStyle
                }), c._isInserting = !1, c._processStyleQueue(a, b)
            }, 10)
        },
        reloadItems: function () {
            this.$allAtoms = this._getAtoms(this.element.children())
        },
        remove: function (a) {
            var b = this,
                c = function () {
                    b.$allAtoms = b.$allAtoms.not(a), a.remove()
                };
            a.filter(":not(." + this.options.hiddenClass + ")").length ? (this.styleQueue.push({
                $el: a,
                style: this.options.hiddenStyle
            }), this.$filteredAtoms = this.$filteredAtoms.not(a), this._sort(), this.reLayout(c)) : c()
        },
        shuffle: function (a) {
            this.updateSortData(this.$allAtoms), this.options.sortBy = "random", this._sort(), this.reLayout(a)
        },
        destroy: function () {
            var c = this.usingTransforms;
            this.$allAtoms.removeClass(this.options.hiddenClass + " " + this.options.itemClass).each(function () {
                this.style.position = "", this.style.top = "", this.style.left = "", this.style.opacity = "", c && (this.style[g] = "")
            });
            var d = this.element[0].style;
            for (var e = 0, f = q.length; e < f; e++) {
                var h = q[e];
                d[h] = this.originalStyle[h]
            }
            this.element.unbind(".isotope").undelegate("." + this.options.hiddenClass, "click").removeClass(this.options.containerClass).removeData("isotope"), b(a).unbind(".isotope")
        },
        _getSegments: function (a) {
            var b = this.options.layoutMode,
                c = a ? "rowHeight" : "columnWidth",
                e = a ? "height" : "width",
                f = a ? "rows" : "cols",
                g = this.element[e](),
                h, i = this.options[b] && this.options[b][c] || this.$filteredAtoms["outer" + d(e)](!0) || g;
            h = Math.floor(g / i), h = Math.max(h, 1), this[b][f] = h, this[b][c] = i
        },
        _checkIfSegmentsChanged: function (a) {
            var b = this.options.layoutMode,
                c = a ? "rows" : "cols",
                d = this[b][c];
            this._getSegments(a);
            return this[b][c] !== d
        },
        _masonryReset: function () {
            this.masonry = {}, this._getSegments();
            var a = this.masonry.cols;
            this.masonry.colYs = [];
            while (a--) this.masonry.colYs.push(0)
        },
        _masonryLayout: function (a) {
            var c = this,
                d = c.masonry;
            a.each(function () {
                var a = b(this),
                    e = Math.ceil(a.outerWidth(!0) / d.columnWidth);
                e = Math.min(e, d.cols);
                if (e === 1) c._masonryPlaceBrick(a, d.colYs);
                else {
                    var f = d.cols + 1 - e,
                        g = [],
                        h, i;
                    for (i = 0; i < f; i++) h = d.colYs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                    c._masonryPlaceBrick(a, g)
                }
            })
        },
        _masonryPlaceBrick: function (a, b) {
            var c = Math.min.apply(Math, b),
                d = 0;
            for (var e = 0, f = b.length; e < f; e++)
                if (b[e] === c) {
                    d = e;
                    break
                }
            var g = this.masonry.columnWidth * d,
                h = c;
            this._pushPosition(a, g, h);
            var i = c + a.outerHeight(!0),
                j = this.masonry.cols + 1 - f;
            for (e = 0; e < j; e++) this.masonry.colYs[d + e] = i
        },
        _masonryGetContainerSize: function () {
            var a = Math.max.apply(Math, this.masonry.colYs);
            return {
                height: a
            }
        },
        _masonryResizeChanged: function () {
            return this._checkIfSegmentsChanged()
        },
        _fitRowsReset: function () {
            this.fitRows = {
                x: 0,
                y: 0,
                height: 0
            }
        },
        _fitRowsLayout: function (a) {
            var c = this,
                d = this.element.width(),
                e = this.fitRows;
            a.each(function () {
                var a = b(this),
                    f = a.outerWidth(!0),
                    g = a.outerHeight(!0);
                e.x !== 0 && f + e.x > d && (e.x = 0, e.y = e.height), c._pushPosition(a, e.x, e.y), e.height = Math.max(e.y + g, e.height), e.x += f
            })
        },
        _fitRowsGetContainerSize: function () {
            return {
                height: this.fitRows.height
            }
        },
        _fitRowsResizeChanged: function () {
            return !0
        },
        _cellsByRowReset: function () {
            this.cellsByRow = {
                index: 0
            }, this._getSegments(), this._getSegments(!0)
        },
        _cellsByRowLayout: function (a) {
            var c = this,
                d = this.cellsByRow;
            a.each(function () {
                var a = b(this),
                    e = d.index % d.cols,
                    f = Math.floor(d.index / d.cols),
                    g = Math.round((e + .5) * d.columnWidth - a.outerWidth(!0) / 2),
                    h = Math.round((f + .5) * d.rowHeight - a.outerHeight(!0) / 2);
                c._pushPosition(a, g, h), d.index++
            })
        },
        _cellsByRowGetContainerSize: function () {
            return {
                height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top
            }
        },
        _cellsByRowResizeChanged: function () {
            return this._checkIfSegmentsChanged()
        },
        _straightDownReset: function () {
            this.straightDown = {
                y: 0
            }
        },
        _straightDownLayout: function (a) {
            var c = this;
            a.each(function (a) {
                var d = b(this);
                c._pushPosition(d, 0, c.straightDown.y), c.straightDown.y += d.outerHeight(!0)
            })
        },
        _straightDownGetContainerSize: function () {
            return {
                height: this.straightDown.y
            }
        },
        _straightDownResizeChanged: function () {
            return !0
        },
        _masonryHorizontalReset: function () {
            this.masonryHorizontal = {}, this._getSegments(!0);
            var a = this.masonryHorizontal.rows;
            this.masonryHorizontal.rowXs = [];
            while (a--) this.masonryHorizontal.rowXs.push(0)
        },
        _masonryHorizontalLayout: function (a) {
            var c = this,
                d = c.masonryHorizontal;
            a.each(function () {
                var a = b(this),
                    e = Math.ceil(a.outerHeight(!0) / d.rowHeight);
                e = Math.min(e, d.rows);
                if (e === 1) c._masonryHorizontalPlaceBrick(a, d.rowXs);
                else {
                    var f = d.rows + 1 - e,
                        g = [],
                        h, i;
                    for (i = 0; i < f; i++) h = d.rowXs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                    c._masonryHorizontalPlaceBrick(a, g)
                }
            })
        },
        _masonryHorizontalPlaceBrick: function (a, b) {
            var c = Math.min.apply(Math, b),
                d = 0;
            for (var e = 0, f = b.length; e < f; e++)
                if (b[e] === c) {
                    d = e;
                    break
                }
            var g = c,
                h = this.masonryHorizontal.rowHeight * d;
            this._pushPosition(a, g, h);
            var i = c + a.outerWidth(!0),
                j = this.masonryHorizontal.rows + 1 - f;
            for (e = 0; e < j; e++) this.masonryHorizontal.rowXs[d + e] = i
        },
        _masonryHorizontalGetContainerSize: function () {
            var a = Math.max.apply(Math, this.masonryHorizontal.rowXs);
            return {
                width: a
            }
        },
        _masonryHorizontalResizeChanged: function () {
            return this._checkIfSegmentsChanged(!0)
        },
        _fitColumnsReset: function () {
            this.fitColumns = {
                x: 0,
                y: 0,
                width: 0
            }
        },
        _fitColumnsLayout: function (a) {
            var c = this,
                d = this.element.height(),
                e = this.fitColumns;
            a.each(function () {
                var a = b(this),
                    f = a.outerWidth(!0),
                    g = a.outerHeight(!0);
                e.y !== 0 && g + e.y > d && (e.x = e.width, e.y = 0), c._pushPosition(a, e.x, e.y), e.width = Math.max(e.x + f, e.width), e.y += g
            })
        },
        _fitColumnsGetContainerSize: function () {
            return {
                width: this.fitColumns.width
            }
        },
        _fitColumnsResizeChanged: function () {
            return !0
        },
        _cellsByColumnReset: function () {
            this.cellsByColumn = {
                index: 0
            }, this._getSegments(), this._getSegments(!0)
        },
        _cellsByColumnLayout: function (a) {
            var c = this,
                d = this.cellsByColumn;
            a.each(function () {
                var a = b(this),
                    e = Math.floor(d.index / d.rows),
                    f = d.index % d.rows,
                    g = Math.round((e + .5) * d.columnWidth - a.outerWidth(!0) / 2),
                    h = Math.round((f + .5) * d.rowHeight - a.outerHeight(!0) / 2);
                c._pushPosition(a, g, h), d.index++
            })
        },
        _cellsByColumnGetContainerSize: function () {
            return {
                width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth
            }
        },
        _cellsByColumnResizeChanged: function () {
            return this._checkIfSegmentsChanged(!0)
        },
        _straightAcrossReset: function () {
            this.straightAcross = {
                x: 0
            }
        },
        _straightAcrossLayout: function (a) {
            var c = this;
            a.each(function (a) {
                var d = b(this);
                c._pushPosition(d, c.straightAcross.x, 0), c.straightAcross.x += d.outerWidth(!0)
            })
        },
        _straightAcrossGetContainerSize: function () {
            return {
                width: this.straightAcross.x
            }
        },
        _straightAcrossResizeChanged: function () {
            return !0
        }
    }, b.fn.imagesLoaded = function (a) {
        function h(a) {
            --e <= 0 && a.target.src !== f && (setTimeout(g), d.unbind("load error", h))
        }

        function g() {
            a.call(b, d)
        }
        var b = this,
            d = b.find("img").add(b.filter("img")),
            e = d.length,
            f = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        e || g(), d.bind("load error", h).each(function () {
            if (this.complete || this.complete === c) {
                var a = this.src;
                this.src = f, this.src = a
            }
        });
        return b
    };
    var r = function (b) {
        a.console && a.console.error(b)
    };
    b.fn.isotope = function (a, c) {
        if (typeof a == "string") {
            var d = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var c = b.data(this, "isotope");
                if (!c) r("cannot call methods on isotope prior to initialization; attempted to call method '" + a + "'");
                else {
                    if (!b.isFunction(c[a]) || a.charAt(0) === "_") {
                        r("no such method '" + a + "' for isotope instance");
                        return
                    }
                    c[a].apply(c, d)
                }
            })
        } else this.each(function () {
            var d = b.data(this, "isotope");
            d ? (d.option(a), d._init(c)) : b.data(this, "isotope", new b.Isotope(a, this, c))
        });
        return this
    }
})(window, jQuery);
