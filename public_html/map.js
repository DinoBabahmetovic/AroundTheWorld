/* global NaN */

(function() {
    var d;
    window.AmCharts ? d = window.AmCharts : (d = {},
    window.AmCharts = d,
    d.themes = {},
    d.maps = {},
    d.inheriting = {},
    d.charts = [],
    d.onReadyArray = [],
    d.useUTC = !1,
    d.updateRate = 60,
    d.uid = 0,
    d.lang = {},
    d.translations = {},
    d.mapTranslations = {},
    d.windows = {},
    d.initHandlers = [],
    d.amString = "am",
    d.pmString = "pm");
    d.Class = function(a) {
        var b = function() {
            arguments[0] !== d.inheriting && (this.events = {},
            this.construct.apply(this, arguments));
        };
        a.inherits ? (b.prototype = new a.inherits(d.inheriting),
        b.base = a.inherits.prototype,
        delete a.inherits) : (b.prototype.createEvents = function() {
            for (var a = 0; a < arguments.length; a++)
                this.events[arguments[a]] = [];
        }
        ,
        b.prototype.listenTo = function(a, b, c) {
            this.removeListener(a, b, c);
            a.events[b].push({
                handler: c,
                scope: this
            });
        }
        ,
        b.prototype.addListener = function(a, b, c) {
            this.removeListener(this, a, b);
            a && this.events[a] && this.events[a].push({
                handler: b,
                scope: c
            });
        }
        ,
        b.prototype.removeListener = function(a, b, c) {
            if (a && a.events && (a = a.events[b]))
                for (b = a.length - 1; 0 <= b; b--)
                    a[b].handler === c && a.splice(b, 1);
        }
        ,
        b.prototype.fire = function(a) {
            for (var b = this.events[a.type], c = 0; c < b.length; c++) {
                var d = b[c];
                d.handler.call(d.scope, a);
            }
        }
        );
        for (var c in a)
            b.prototype[c] = a[c];
        return b;
    }
    ;
    d.addChart = function(a) {
        window.requestAnimationFrame ? d.animationRequested || (d.animationRequested = !0,
        window.requestAnimationFrame(d.update)) : d.updateInt || (d.updateInt = setInterval(function() {
            d.update();
        }, Math.round(1E3 / d.updateRate)));
        d.charts.push(a);
    }
    ;
    d.removeChart = function(a) {
        for (var b = d.charts, c = b.length - 1; 0 <= c; c--)
            b[c] === a && b.splice(c, 1);
        0 === b.length && (d.requestAnimation && (window.cancelAnimationFrame(d.requestAnimation),
        d.animationRequested = !1),
        d.updateInt && (clearInterval(d.updateInt),
        d.updateInt = NaN));
    }
    ;
    d.isModern = !0;
    d.getIEVersion = function() {
        var a = 0, b, c;
        "Microsoft Internet Explorer" === navigator.appName && (b = navigator.userAgent,
        c = /MSIE ([0-9]{1,}[.0-9]{0,})/,
        null !== c.exec(b) && (a = parseFloat(RegExp.$1)));
        return a;
    }
    ;
    d.applyLang = function(a, b) {
        var c = d.translations;
        b.dayNames = d.extend({}, d.dayNames);
        b.shortDayNames = d.extend({}, d.shortDayNames);
        b.monthNames = d.extend({}, d.monthNames);
        b.shortMonthNames = d.extend({}, d.shortMonthNames);
        b.amString = "am";
        b.pmString = "pm";
        c && (c = c[a]) && (d.lang = c,
        b.langObj = c,
        c.monthNames && (b.dayNames = d.extend({}, c.dayNames),
        b.shortDayNames = d.extend({}, c.shortDayNames),
        b.monthNames = d.extend({}, c.monthNames),
        b.shortMonthNames = d.extend({}, c.shortMonthNames)),
        c.am && (b.amString = c.am),
        c.pm && (b.pmString = c.pm));
        d.amString = b.amString;
        d.pmString = b.pmString;
    }
    ;
    d.IEversion = d.getIEVersion();
    9 > d.IEversion && 0 < d.IEversion && (d.isModern = !1,
    d.isIE = !0);
    d.dx = 0;
    d.dy = 0;
    if (document.addEventListener || window.opera)
        d.isNN = !0,
        d.isIE = !1,
        d.dx = .5,
        d.dy = .5;
    document.attachEvent && (d.isNN = !1,
    d.isIE = !0,
    d.isModern || (d.dx = 0,
    d.dy = 0));
    window.chrome && (d.chrome = !0);
    d.handleMouseUp = function(a) {
        for (var b = d.charts, c = 0; c < b.length; c++) {
            var e = b[c];
            e && e.handleReleaseOutside && e.handleReleaseOutside(a);
        }
    }
    ;
    d.handleMouseMove = function(a) {
        for (var b = d.charts, c = 0; c < b.length; c++) {
            var e = b[c];
            e && e.handleMouseMove && e.handleMouseMove(a);
        }
    }
    ;
    d.handleWheel = function(a) {
        for (var b = d.charts, c = 0; c < b.length; c++) {
            var e = b[c];
            if (e && e.mouseIsOver) {
                (e.mouseWheelScrollEnabled || e.mouseWheelZoomEnabled) && e.handleWheel && e.handleWheel(a);
                break
            }
        }
    }
    ;
    d.resetMouseOver = function() {
        for (var a = d.charts, b = 0; b < a.length; b++) {
            var c = a[b];
            c && (c.mouseIsOver = !1)
        }
    }
    ;
    d.ready = function(a) {
        d.onReadyArray.push(a)
    }
    ;
    d.handleLoad = function() {
        d.isReady = !0;
        for (var a = d.onReadyArray, b = 0; b < a.length; b++) {
            var c = a[b];
            isNaN(d.processDelay) ? c() : setTimeout(c, d.processDelay * b)
        }
    }
    ;
    d.addInitHandler = function(a, b) {
        d.initHandlers.push({
            method: a,
            types: b
        })
    }
    ;
    d.callInitHandler = function(a) {
        var b = d.initHandlers;
        if (d.initHandlers)
            for (var c = 0; c < b.length; c++) {
                var e = b[c];
                e.types ? d.isInArray(e.types, a.type) && e.method(a) : e.method(a)
            }
    }
    ;
    d.getUniqueId = function() {
        d.uid++;
        return "AmChartsEl-" + d.uid
    }
    ;
    d.isNN && (document.addEventListener("mousemove", d.handleMouseMove),
    document.addEventListener("mouseup", d.handleMouseUp, !0),
    window.addEventListener("load", d.handleLoad, !0));
    d.isIE && (document.attachEvent("onmousemove", d.handleMouseMove),
    document.attachEvent("onmouseup", d.handleMouseUp),
    window.attachEvent("onload", d.handleLoad));
    d.addWheelListeners = function() {
        d.wheelIsListened || (d.isNN && (window.addEventListener("DOMMouseScroll", d.handleWheel, !0),
        document.addEventListener("mousewheel", d.handleWheel, !0)),
        d.isIE && document.attachEvent("onmousewheel", d.handleWheel));
        d.wheelIsListened = !0
    }
    ;
    d.clear = function() {
        var a = d.charts;
        if (a)
            for (var b = a.length - 1; 0 <= b; b--)
                a[b].clear();
        d.updateInt && clearInterval(d.updateInt);
        d.requestAnimation && window.cancelAnimationFrame(d.requestAnimation);
        d.charts = [];
        d.isNN && (document.removeEventListener("mousemove", d.handleMouseMove, !0),
        document.removeEventListener("mouseup", d.handleMouseUp, !0),
        window.removeEventListener("load", d.handleLoad, !0),
        window.removeEventListener("DOMMouseScroll", d.handleWheel, !0),
        document.removeEventListener("mousewheel", d.handleWheel, !0));
        d.isIE && (document.detachEvent("onmousemove", d.handleMouseMove),
        document.detachEvent("onmouseup", d.handleMouseUp),
        window.detachEvent("onload", d.handleLoad))
    }
    ;
    d.makeChart = function(a, b, c) {
        var e = b.type
          , f = b.theme;
        d.isString(f) && (f = d.themes[f],
        b.theme = f);
        var g;
        switch (e) {
        case "serial":
            g = new d.AmSerialChart(f);
            break;
        case "xy":
            g = new d.AmXYChart(f);
            break;
        case "pie":
            g = new d.AmPieChart(f);
            break;
        case "radar":
            g = new d.AmRadarChart(f);
            break;
        case "gauge":
            g = new d.AmAngularGauge(f);
            break;
        case "funnel":
            g = new d.AmFunnelChart(f);
            break;
        case "map":
            g = new d.AmMap(f);
            break;
        case "stock":
            g = new d.AmStockChart(f);
            break;
        case "gantt":
            g = new d.AmGanttChart(f)
        }
        d.extend(g, b);
        d.isReady ? isNaN(c) ? g.write(a) : setTimeout(function() {
            d.realWrite(g, a)
        }, c) : d.ready(function() {
            isNaN(c) ? g.write(a) : setTimeout(function() {
                d.realWrite(g, a)
            }, c)
        });
        return g
    }
    ;
    d.realWrite = function(a, b) {
        a.write(b)
    }
    ;
    d.updateCount = 0;
    d.validateAt = Math.round(d.updateRate / 10);
    d.update = function() {
        var a = d.charts;
        d.updateCount++;
        var b = !1;
        d.updateCount == d.validateAt && (b = !0,
        d.updateCount = 0);
        if (a)
            for (var c = a.length - 1; 0 <= c; c--)
                a[c].update && a[c].update(),
                b && (a[c].autoResize ? a[c].validateSize && a[c].validateSize() : a[c].premeasure && a[c].premeasure());
        window.requestAnimationFrame && (d.requestAnimation = window.requestAnimationFrame(d.update))
    }
    ;
    "complete" == document.readyState && d.handleLoad()
})();
(function() {
    var d = window.AmCharts;
    d.toBoolean = function(a, b) {
        if (void 0 === a)
            return b;
        switch (String(a).toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return !0;
        case "false":
        case "no":
        case "0":
        case null:
            return !1;
        default:
            return !!a
        }
    }
    ;
    d.removeFromArray = function(a, b) {
        var c;
        if (void 0 !== b && void 0 !== a)
            for (c = a.length - 1; 0 <= c; c--)
                a[c] == b && a.splice(c, 1)
    }
    ;
    d.getPath = function() {
        var a = document.getElementsByTagName("script");
        if (a)
            for (var b = 0; b < a.length; b++) {
                var c = a[b].src;
                if (-1 !== c.search(/\/(amcharts|ammap)\.js/))
                    return c.replace(/\/(amcharts|ammap)\.js.*/, "/")
            }
    }
    ;
    d.normalizeUrl = function(a) {
        return "" !== a && -1 === a.search(/\/$/) ? a + "/" : a
    }
    ;
    d.isAbsolute = function(a) {
        return 0 === a.search(/^http[s]?:|^\//)
    }
    ;
    d.isInArray = function(a, b) {
        for (var c = 0; c < a.length; c++)
            if (a[c] == b)
                return !0;
        return !1
    }
    ;
    d.getDecimals = function(a) {
        var b = 0;
        isNaN(a) || (a = String(a),
        -1 != a.indexOf("e-") ? b = Number(a.split("-")[1]) : -1 != a.indexOf(".") && (b = a.split(".")[1].length));
        return b
    }
    ;
    d.wordwrap = function(a, b, c, e) {
        var f, g, h, k;
        a += "";
        if (1 > b)
            return a;
        f = -1;
        for (a = (k = a.split(/\r\n|\n|\r/)).length; ++f < a; k[f] += h) {
            h = k[f];
            for (k[f] = ""; h.length > b; k[f] += d.trim(h.slice(0, g)) + ((h = h.slice(g)).length ? c : ""))
                g = 2 == e || (g = h.slice(0, b + 1).match(/\S*(\s)?$/))[1] ? b : g.input.length - g[0].length || 1 == e && b || g.input.length + (g = h.slice(b).match(/^\S*/))[0].length;
            h = d.trim(h)
        }
        return k.join(c)
    }
    ;
    d.trim = function(a) {
        return a.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
    }
    ;
    d.wrappedText = function(a, b, c, e, f, g, h, k) {
        var l = d.text(a, b, c, e, f, g, h);
        if (l) {
            var m = l.getBBox();
            if (m.width > k) {
                var n = "\n";
                d.isModern || (n = "<br>");
                k = Math.floor(k / (m.width / b.length));
                2 < k && (k -= 2);
                b = d.wordwrap(b, k, n, !0);
                l.remove();
                l = d.text(a, b, c, e, f, g, h)
            }
        }
        return l
    }
    ;
    d.getStyle = function(a, b) {
        var c = "";
        if (document.defaultView && document.defaultView.getComputedStyle)
            try {
                c = document.defaultView.getComputedStyle(a, "").getPropertyValue(b)
            } catch (e) {}
        else
            a.currentStyle && (b = b.replace(/\-(\w)/g, function(a, b) {
                return b.toUpperCase()
            }),
            c = a.currentStyle[b]);
        return c
    }
    ;
    d.removePx = function(a) {
        if (void 0 !== a)
            return Number(a.substring(0, a.length - 2))
    }
    ;
    d.getURL = function(a, b) {
        if (a)
            if ("_self" != b && b)
                if ("_top" == b && window.top)
                    window.top.location.href = a;
                else if ("_parent" == b && window.parent)
                    window.parent.location.href = a;
                else if ("_blank" == b)
                    window.open(a);
                else {
                    var c = document.getElementsByName(b)[0];
                    c ? c.src = a : (c = d.windows[b]) ? c.opener && !c.opener.closed ? c.location.href = a : d.windows[b] = window.open(a) : d.windows[b] = window.open(a)
                }
            else
                window.location.href = a
    }
    ;
    d.ifArray = function(a) {
        return a && "object" == typeof a && 0 < a.length ? !0 : !1
    }
    ;
    d.callMethod = function(a, b) {
        var c;
        for (c = 0; c < b.length; c++) {
            var e = b[c];
            if (e) {
                if (e[a])
                    e[a]();
                var d = e.length;
                if (0 < d) {
                    var g;
                    for (g = 0; g < d; g++) {
                        var h = e[g];
                        if (h && h[a])
                            h[a]()
                    }
                }
            }
        }
    }
    ;
    d.toNumber = function(a) {
        return "number" == typeof a ? a : Number(String(a).replace(/[^0-9\-.]+/g, ""))
    }
    ;
    d.toColor = function(a) {
        if ("" !== a && void 0 !== a)
            if (-1 != a.indexOf(",")) {
                a = a.split(",");
                var b;
                for (b = 0; b < a.length; b++) {
                    var c = a[b].substring(a[b].length - 6, a[b].length);
                    a[b] = "#" + c
                }
            } else
                a = a.substring(a.length - 6, a.length),
                a = "#" + a;
        return a
    }
    ;
    d.toCoordinate = function(a, b, c) {
        var e;
        void 0 !== a && (a = String(a),
        c && c < b && (b = c),
        e = Number(a),
        -1 != a.indexOf("!") && (e = b - Number(a.substr(1))),
        -1 != a.indexOf("%") && (e = b * Number(a.substr(0, a.length - 1)) / 100));
        return e
    }
    ;
    d.fitToBounds = function(a, b, c) {
        a < b && (a = b);
        a > c && (a = c);
        return a
    }
    ;
    d.isDefined = function(a) {
        return void 0 === a ? !1 : !0
    }
    ;
    d.stripNumbers = function(a) {
        return a.replace(/[0-9]+/g, "")
    }
    ;
    d.roundTo = function(a, b) {
        if (0 > b)
            return a;
        var c = Math.pow(10, b);
        return Math.round(a * c) / c
    }
    ;
    d.toFixed = function(a, b) {
        var c = String(Math.round(a * Math.pow(10, b)));
        if (0 < b) {
            var e = c.length;
            if (e < b) {
                var d;
                for (d = 0; d < b - e; d++)
                    c = "0" + c
            }
            e = c.substring(0, c.length - b);
            "" === e && (e = 0);
            return e + "." + c.substring(c.length - b, c.length)
        }
        return String(c)
    }
    ;
    d.formatDuration = function(a, b, c, e, f, g) {
        var h = d.intervals
          , k = g.decimalSeparator;
        if (a >= h[b].contains) {
            var l = a - Math.floor(a / h[b].contains) * h[b].contains;
            "ss" == b ? (l = d.formatNumber(l, g),
            1 == l.split(k)[0].length && (l = "0" + l)) : l = d.roundTo(l, g.precision);
            ("mm" == b || "hh" == b) && 10 > l && (l = "0" + l);
            c = l + "" + e[b] + "" + c;
            a = Math.floor(a / h[b].contains);
            b = h[b].nextInterval;
            return d.formatDuration(a, b, c, e, f, g)
        }
        "ss" == b && (a = d.formatNumber(a, g),
        1 == a.split(k)[0].length && (a = "0" + a));
        ("mm" == b || "hh" == b) && 10 > a && (a = "0" + a);
        c = a + "" + e[b] + "" + c;
        if (h[f].count > h[b].count)
            for (a = h[b].count; a < h[f].count; a++)
                b = h[b].nextInterval,
                "ss" == b || "mm" == b || "hh" == b ? c = "00" + e[b] + "" + c : "DD" == b && (c = "0" + e[b] + "" + c);
        ":" == c.charAt(c.length - 1) && (c = c.substring(0, c.length - 1));
        return c
    }
    ;
    d.formatNumber = function(a, b, c, e, f) {
        a = d.roundTo(a, b.precision);
        isNaN(c) && (c = b.precision);
        var g = b.decimalSeparator;
        b = b.thousandsSeparator;
        var h;
        h = 0 > a ? "-" : "";
        a = Math.abs(a);
        var k = String(a)
          , l = !1;
        -1 != k.indexOf("e") && (l = !0);
        0 <= c && !l && (k = d.toFixed(a, c));
        var m = "";
        if (l)
            m = k;
        else {
            var k = k.split("."), l = String(k[0]), n;
            for (n = l.length; 0 <= n; n -= 3)
                m = n != l.length ? 0 !== n ? l.substring(n - 3, n) + b + m : l.substring(n - 3, n) + m : l.substring(n - 3, n);
            void 0 !== k[1] && (m = m + g + k[1]);
            void 0 !== c && 0 < c && "0" != m && (m = d.addZeroes(m, g, c))
        }
        m = h + m;
        "" === h && !0 === e && 0 !== a && (m = "+" + m);
        !0 === f && (m += "%");
        return m
    }
    ;
    d.addZeroes = function(a, b, c) {
        a = a.split(b);
        void 0 === a[1] && 0 < c && (a[1] = "0");
        return a[1].length < c ? (a[1] += "0",
        d.addZeroes(a[0] + b + a[1], b, c)) : void 0 !== a[1] ? a[0] + b + a[1] : a[0]
    }
    ;
    d.scientificToNormal = function(a) {
        var b;
        a = String(a).split("e");
        var c;
        if ("-" == a[1].substr(0, 1)) {
            b = "0.";
            for (c = 0; c < Math.abs(Number(a[1])) - 1; c++)
                b += "0";
            b += a[0].split(".").join("")
        } else {
            var e = 0;
            b = a[0].split(".");
            b[1] && (e = b[1].length);
            b = a[0].split(".").join("");
            for (c = 0; c < Math.abs(Number(a[1])) - e; c++)
                b += "0"
        }
        return b
    }
    ;
    d.toScientific = function(a, b) {
        if (0 === a)
            return "0";
        var c = Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)
          , e = String(e).split(".").join(b);
        return String(e) + "e" + c
    }
    ;
    d.randomColor = function() {
        return "#" + ("00000" + (16777216 * Math.random() << 0).toString(16)).substr(-6)
    }
    ;
    d.hitTest = function(a, b, c) {
        var e = !1
          , f = a.x
          , g = a.x + a.width
          , h = a.y
          , k = a.y + a.height
          , l = d.isInRectangle;
        e || (e = l(f, h, b));
        e || (e = l(f, k, b));
        e || (e = l(g, h, b));
        e || (e = l(g, k, b));
        e || !0 === c || (e = d.hitTest(b, a, !0));
        return e
    }
    ;
    d.isInRectangle = function(a, b, c) {
        return a >= c.x - 5 && a <= c.x + c.width + 5 && b >= c.y - 5 && b <= c.y + c.height + 5 ? !0 : !1
    }
    ;
    d.isPercents = function(a) {
        if (-1 != String(a).indexOf("%"))
            return !0
    }
    ;
    d.formatValue = function(a, b, c, e, f, g, h, k) {
        if (b) {
            void 0 === f && (f = "");
            var l;
            for (l = 0; l < c.length; l++) {
                var m = c[l]
                  , n = b[m];
                void 0 !== n && (n = g ? d.addPrefix(n, k, h, e) : d.formatNumber(n, e),
                a = a.replace(new RegExp("\\[\\[" + f + "" + m + "\\]\\]","g"), n))
            }
        }
        return a
    }
    ;
    d.formatDataContextValue = function(a, b) {
        if (a) {
            var c = a.match(/\[\[.*?\]\]/g), e;
            for (e = 0; e < c.length; e++) {
                var d = c[e]
                  , d = d.substr(2, d.length - 4);
                void 0 !== b[d] && (a = a.replace(new RegExp("\\[\\[" + d + "\\]\\]","g"), b[d]))
            }
        }
        return a
    }
    ;
    d.massReplace = function(a, b) {
        for (var c in b)
            if (b.hasOwnProperty(c)) {
                var e = b[c];
                void 0 === e && (e = "");
                a = a.replace(c, e)
            }
        return a
    }
    ;
    d.cleanFromEmpty = function(a) {
        return a.replace(/\[\[[^\]]*\]\]/g, "")
    }
    ;
    d.addPrefix = function(a, b, c, e, f) {
        var g = d.formatNumber(a, e), h = "", k, l, m;
        if (0 === a)
            return "0";
        0 > a && (h = "-");
        a = Math.abs(a);
        if (1 < a)
            for (k = b.length - 1; -1 < k; k--) {
                if (a >= b[k].number && (l = a / b[k].number,
                m = Number(e.precision),
                1 > m && (m = 1),
                c = d.roundTo(l, m),
                m = d.formatNumber(c, {
                    precision: -1,
                    decimalSeparator: e.decimalSeparator,
                    thousandsSeparator: e.thousandsSeparator
                }),
                !f || l == c)) {
                    g = h + "" + m + "" + b[k].prefix;
                    break
                }
            }
        else
            for (k = 0; k < c.length; k++)
                if (a <= c[k].number) {
                    l = a / c[k].number;
                    m = Math.abs(Math.floor(Math.log(l) * Math.LOG10E));
                    l = d.roundTo(l, m);
                    g = h + "" + l + "" + c[k].prefix;
                    break
                }
        return g
    }
    ;
    d.remove = function(a) {
        a && a.remove()
    }
    ;
    d.getEffect = function(a) {
        ">" == a && (a = "easeOutSine");
        "<" == a && (a = "easeInSine");
        "elastic" == a && (a = "easeOutElastic");
        return a
    }
    ;
    d.getObjById = function(a, b) {
        var c, e;
        for (e = 0; e < a.length; e++) {
            var d = a[e];
            if (d.id == b) {
                c = d;
                break
            }
        }
        return c
    }
    ;
    d.applyTheme = function(a, b, c) {
        b || (b = d.theme);
        try {
            b = JSON.parse(JSON.stringify(b))
        } catch (e) {}
        b && b[c] && d.extend(a, b[c])
    }
    ;
    d.isString = function(a) {
        return "string" == typeof a ? !0 : !1
    }
    ;
    d.extend = function(a, b, c) {
        var e;
        a || (a = {});
        for (e in b)
            c ? a.hasOwnProperty(e) || (a[e] = b[e]) : a[e] = b[e];
        return a
    }
    ;
    d.copyProperties = function(a, b) {
        for (var c in a)
            a.hasOwnProperty(c) && "events" != c && void 0 !== a[c] && "function" != typeof a[c] && "cname" != c && (b[c] = a[c])
    }
    ;
    d.processObject = function(a, b, c, e) {
        if (!1 === a instanceof b && (a = e ? d.extend(new b(c), a) : d.extend(a, new b(c), !0),
        a.listeners))
            for (var f in a.listeners)
                b = a.listeners[f],
                a.addListener(b.event, b.method);
        return a
    }
    ;
    d.fixNewLines = function(a) {
        var b = RegExp("\\n", "g");
        a && (a = a.replace(b, "<br />"));
        return a
    }
    ;
    d.fixBrakes = function(a) {
        if (d.isModern) {
            var b = RegExp("<br>", "g");
            a && (a = a.replace(b, "\n"))
        } else
            a = d.fixNewLines(a);
        return a
    }
    ;
    d.deleteObject = function(a, b) {
        if (a) {
            if (void 0 === b || null === b)
                b = 20;
            if (0 !== b)
                if ("[object Array]" === Object.prototype.toString.call(a))
                    for (var c = 0; c < a.length; c++)
                        d.deleteObject(a[c], b - 1),
                        a[c] = null;
                else if (a && !a.tagName)
                    try {
                        for (c in a.theme = null,
                        a)
                            a[c] && ("object" == typeof a[c] && d.deleteObject(a[c], b - 1),
                            "function" != typeof a[c] && (a[c] = null))
                    } catch (e) {}
        }
    }
    ;
    d.bounce = function(a, b, c, e, d) {
        return (b /= d) < 1 / 2.75 ? 7.5625 * e * b * b + c : b < 2 / 2.75 ? e * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : b < 2.5 / 2.75 ? e * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : e * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
    }
    ;
    d.easeInOutQuad = function(a, b, c, e, d) {
        b /= d / 2;
        if (1 > b)
            return e / 2 * b * b + c;
        b--;
        return -e / 2 * (b * (b - 2) - 1) + c
    }
    ;
    d.easeInSine = function(a, b, c, e, d) {
        return -e * Math.cos(b / d * (Math.PI / 2)) + e + c
    }
    ;
    d.easeOutSine = function(a, b, c, e, d) {
        return e * Math.sin(b / d * (Math.PI / 2)) + c
    }
    ;
    d.easeOutElastic = function(a, b, c, e, d) {
        a = 1.70158;
        var g = 0
          , h = e;
        if (0 === b)
            return c;
        if (1 == (b /= d))
            return c + e;
        g || (g = .3 * d);
        h < Math.abs(e) ? (h = e,
        a = g / 4) : a = g / (2 * Math.PI) * Math.asin(e / h);
        return h * Math.pow(2, -10 * b) * Math.sin(2 * (b * d - a) * Math.PI / g) + e + c
    }
    ;
    d.fixStepE = function(a) {
        a = a.toExponential(0).split("e");
        var b = Number(a[1]);
        9 == Number(a[0]) && b++;
        return d.generateNumber(1, b)
    }
    ;
    d.generateNumber = function(a, b) {
        var c = "", e;
        e = 0 > b ? Math.abs(b) - 1 : Math.abs(b);
        var d;
        for (d = 0; d < e; d++)
            c += "0";
        return 0 > b ? Number("0." + c + String(a)) : Number(String(a) + c)
    }
    ;
    d.setCN = function(a, b, c, e) {
        if (a.addClassNames && b && (b = b.node) && c) {
            var d = b.getAttribute("class");
            a = a.classNamePrefix + "-";
            e && (a = "");
            d ? b.setAttribute("class", d + " " + a + c) : b.setAttribute("class", a + c)
        }
    }
    ;
    d.removeCN = function(a, b, c) {
        b && (b = b.node) && c && (b = b.classList) && b.remove(a.classNamePrefix + "-" + c)
    }
    ;
    d.parseDefs = function(a, b) {
        for (var c in a) {
            var e = typeof a[c];
            if (0 < a[c].length && "object" == e)
                for (var f = 0; f < a[c].length; f++)
                    e = document.createElementNS(d.SVG_NS, c),
                    b.appendChild(e),
                    d.parseDefs(a[c][f], e);
            else
                "object" == e ? (e = document.createElementNS(d.SVG_NS, c),
                b.appendChild(e),
                d.parseDefs(a[c], e)) : b.setAttribute(c, a[c])
        }
    }
})();
(function() {
    var d = window.AmCharts;
    d.AmDraw = d.Class({
        construct: function(a, b, c, e) {
            d.SVG_NS = "http://www.w3.org/2000/svg";
            d.SVG_XLINK = "http://www.w3.org/1999/xlink";
            d.hasSVG = !!document.createElementNS && !!document.createElementNS(d.SVG_NS, "svg").createSVGRect;
            1 > b && (b = 10);
            1 > c && (c = 10);
            this.div = a;
            this.width = b;
            this.height = c;
            this.rBin = document.createElement("div");
            d.hasSVG ? (d.SVG = !0,
            b = this.createSvgElement("svg"),
            a.appendChild(b),
            this.container = b,
            this.addDefs(e),
            this.R = new d.SVGRenderer(this)) : d.isIE && d.VMLRenderer && (d.VML = !0,
            d.vmlStyleSheet || (document.namespaces.add("amvml", "urn:schemas-microsoft-com:vml"),
            31 > document.styleSheets.length ? (b = document.createStyleSheet(),
            b.addRule(".amvml", "behavior:url(#default#VML); display:inline-block; antialias:true"),
            d.vmlStyleSheet = b) : document.styleSheets[0].addRule(".amvml", "behavior:url(#default#VML); display:inline-block; antialias:true")),
            this.container = a,
            this.R = new d.VMLRenderer(this,e),
            this.R.disableSelection(a))
        },
        createSvgElement: function(a) {
            return document.createElementNS(d.SVG_NS, a)
        },
        circle: function(a, b, c, e) {
            var f = new d.AmDObject("circle",this);
            f.attr({
                r: c,
                cx: a,
                cy: b
            });
            this.addToContainer(f.node, e);
            return f
        },
        ellipse: function(a, b, c, e, f) {
            var g = new d.AmDObject("ellipse",this);
            g.attr({
                rx: c,
                ry: e,
                cx: a,
                cy: b
            });
            this.addToContainer(g.node, f);
            return g
        },
        setSize: function(a, b) {
            0 < a && 0 < b && (this.container.style.width = a + "px",
            this.container.style.height = b + "px")
        },
        rect: function(a, b, c, e, f, g, h) {
            var k = new d.AmDObject("rect",this);
            d.VML && (f = Math.round(100 * f / Math.min(c, e)),
            c += 2 * g,
            e += 2 * g,
            k.bw = g,
            k.node.style.marginLeft = -g,
            k.node.style.marginTop = -g);
            1 > c && (c = 1);
            1 > e && (e = 1);
            k.attr({
                x: a,
                y: b,
                width: c,
                height: e,
                rx: f,
                ry: f,
                "stroke-width": g
            });
            this.addToContainer(k.node, h);
            return k
        },
        image: function(a, b, c, e, f, g) {
            var h = new d.AmDObject("image",this);
            h.attr({
                x: b,
                y: c,
                width: e,
                height: f
            });
            this.R.path(h, a);
            this.addToContainer(h.node, g);
            return h
        },
        addToContainer: function(a, b) {
            b || (b = this.container);
            b.appendChild(a)
        },
        text: function(a, b, c) {
            return this.R.text(a, b, c)
        },
        path: function(a, b, c, e) {
            var f = new d.AmDObject("path",this);
            e || (e = "100,100");
            f.attr({
                cs: e
            });
            c ? f.attr({
                dd: a
            }) : f.attr({
                d: a
            });
            this.addToContainer(f.node, b);
            return f
        },
        set: function(a) {
            return this.R.set(a)
        },
        remove: function(a) {
            if (a) {
                var b = this.rBin;
                b.appendChild(a);
                b.innerHTML = ""
            }
        },
        renderFix: function() {
            var a = this.container
              , b = a.style;
            b.top = "0px";
            b.left = "0px";
            try {
                var c = a.getBoundingClientRect()
                  , e = c.left - Math.round(c.left)
                  , d = c.top - Math.round(c.top);
                e && (b.left = e + "px");
                d && (b.top = d + "px")
            } catch (g) {}
        },
        update: function() {
            this.R.update()
        },
        addDefs: function(a) {
            if (d.hasSVG) {
                var b = this.createSvgElement("desc")
                  , c = this.container;
                c.setAttribute("version", "1.1");
                c.style.position = "absolute";
                this.setSize(this.width, this.height);
                if (a.accessibleTitle) {
                    var e = this.createSvgElement("text");
                    c.appendChild(e);
                    e.innerHTML = a.accessibleTitle;
                    e.style.opacity = 0
                }
                d.rtl && (c.setAttribute("direction", "rtl"),
                c.style.left = "auto",
                c.style.right = "0px");
                a && (a.addCodeCredits && b.appendChild(document.createTextNode("JavaScript chart by amCharts " + a.version)),
                c.appendChild(b),
                a.defs && (b = this.createSvgElement("defs"),
                c.appendChild(b),
                d.parseDefs(a.defs, b),
                this.defs = b))
            }
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.AmDObject = d.Class({
        construct: function(a, b) {
            this.D = b;
            this.R = b.R;
            this.node = this.R.create(this, a);
            this.y = this.x = 0;
            this.scale = 1
        },
        attr: function(a) {
            this.R.attr(this, a);
            return this
        },
        getAttr: function(a) {
            return this.node.getAttribute(a)
        },
        setAttr: function(a, b) {
            this.R.setAttr(this, a, b);
            return this
        },
        clipRect: function(a, b, c, e) {
            this.R.clipRect(this, a, b, c, e)
        },
        translate: function(a, b, c, e) {
            e || (a = Math.round(a),
            b = Math.round(b));
            this.R.move(this, a, b, c);
            this.x = a;
            this.y = b;
            this.scale = c;
            this.angle && this.rotate(this.angle)
        },
        rotate: function(a, b) {
            this.R.rotate(this, a, b);
            this.angle = a
        },
        animate: function(a, b, c) {
            for (var e in a)
                if (a.hasOwnProperty(e)) {
                    var f = e
                      , g = a[e];
                    c = d.getEffect(c);
                    this.R.animate(this, f, g, b, c)
                }
        },
        push: function(a) {
            if (a) {
                var b = this.node;
                b.appendChild(a.node);
                var c = a.clipPath;
                c && b.appendChild(c);
                (a = a.grad) && b.appendChild(a)
            }
        },
        text: function(a) {
            this.R.setText(this, a)
        },
        remove: function() {
            this.stop();
            this.R.remove(this)
        },
        clear: function() {
            var a = this.node;
            if (a.hasChildNodes())
                for (; 1 <= a.childNodes.length; )
                    a.removeChild(a.firstChild)
        },
        hide: function() {
            this.setAttr("visibility", "hidden")
        },
        show: function() {
            this.setAttr("visibility", "visible")
        },
        getBBox: function() {
            return this.R.getBBox(this)
        },
        toFront: function() {
            var a = this.node;
            if (a) {
                this.prevNextNode = a.nextSibling;
                var b = a.parentNode;
                b && b.appendChild(a)
            }
        },
        toPrevious: function() {
            var a = this.node;
            a && this.prevNextNode && (a = a.parentNode) && a.insertBefore(this.prevNextNode, null)
        },
        toBack: function() {
            var a = this.node;
            if (a) {
                this.prevNextNode = a.nextSibling;
                var b = a.parentNode;
                if (b) {
                    var c = b.firstChild;
                    c && b.insertBefore(a, c)
                }
            }
        },
        mouseover: function(a) {
            this.R.addListener(this, "mouseover", a);
            return this
        },
        mouseout: function(a) {
            this.R.addListener(this, "mouseout", a);
            return this
        },
        click: function(a) {
            this.R.addListener(this, "click", a);
            return this
        },
        dblclick: function(a) {
            this.R.addListener(this, "dblclick", a);
            return this
        },
        mousedown: function(a) {
            this.R.addListener(this, "mousedown", a);
            return this
        },
        mouseup: function(a) {
            this.R.addListener(this, "mouseup", a);
            return this
        },
        touchmove: function(a) {
            this.R.addListener(this, "touchmove", a);
            return this
        },
        touchstart: function(a) {
            this.R.addListener(this, "touchstart", a);
            return this
        },
        touchend: function(a) {
            this.R.addListener(this, "touchend", a);
            return this
        },
        keyup: function(a) {
            this.R.addListener(this, "keyup", a);
            return this
        },
        focus: function(a) {
            this.R.addListener(this, "focus", a);
            return this
        },
        blur: function(a) {
            this.R.addListener(this, "blur", a);
            return this
        },
        contextmenu: function(a) {
            this.node.addEventListener ? this.node.addEventListener("contextmenu", a, !0) : this.R.addListener(this, "contextmenu", a);
            return this
        },
        stop: function() {
            d.removeFromArray(this.R.animations, this.an_translate);
            d.removeFromArray(this.R.animations, this.an_y);
            d.removeFromArray(this.R.animations, this.an_x)
        },
        length: function() {
            return this.node.childNodes.length
        },
        gradient: function(a, b, c) {
            this.R.gradient(this, a, b, c)
        },
        pattern: function(a, b, c) {
            a && this.R.pattern(this, a, b, c)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.SVGRenderer = d.Class({
        construct: function(a) {
            this.D = a;
            this.animations = []
        },
        create: function(a, b) {
            return document.createElementNS(d.SVG_NS, b)
        },
        attr: function(a, b) {
            for (var c in b)
                b.hasOwnProperty(c) && this.setAttr(a, c, b[c])
        },
        setAttr: function(a, b, c) {
            void 0 !== c && a.node.setAttribute(b, c)
        },
        animate: function(a, b, c, e, f) {
            a.animationFinished = !1;
            var g = a.node;
            a["an_" + b] && d.removeFromArray(this.animations, a["an_" + b]);
            "translate" == b ? (g = (g = g.getAttribute("transform")) ? String(g).substring(10, g.length - 1) : "0,0",
            g = g.split(", ").join(" "),
            g = g.split(" ").join(","),
            0 === g && (g = "0,0")) : g = Number(g.getAttribute(b));
            c = {
                obj: a,
                frame: 0,
                attribute: b,
                from: g,
                to: c,
                time: e,
                effect: f
            };
            this.animations.push(c);
            a["an_" + b] = c
        },
        update: function() {
            var a, b = this.animations;
            for (a = b.length - 1; 0 <= a; a--) {
                var c = b[a], e = c.time * d.updateRate, f = c.frame + 1, g = c.obj, h = c.attribute, k, l, m;
                if (f <= e) {
                    c.frame++;
                    if ("translate" == h) {
                        k = c.from.split(",");
                        h = Number(k[0]);
                        k = Number(k[1]);
                        isNaN(k) && (k = 0);
                        l = c.to.split(",");
                        m = Number(l[0]);
                        l = Number(l[1]);
                        m = 0 === m - h ? m : Math.round(d[c.effect](0, f, h, m - h, e));
                        c = 0 === l - k ? l : Math.round(d[c.effect](0, f, k, l - k, e));
                        h = "transform";
                        if (isNaN(m) || isNaN(c))
                            continue;
                        c = "translate(" + m + "," + c + ")"
                    } else
                        l = Number(c.from),
                        k = Number(c.to),
                        m = k - l,
                        c = d[c.effect](0, f, l, m, e),
                        isNaN(c) && (c = k),
                        0 === m && this.animations.splice(a, 1);
                    this.setAttr(g, h, c)
                } else
                    "translate" == h ? (l = c.to.split(","),
                    m = Number(l[0]),
                    l = Number(l[1]),
                    g.translate(m, l)) : (k = Number(c.to),
                    this.setAttr(g, h, k)),
                    g.animationFinished = !0,
                    this.animations.splice(a, 1)
            }
        },
        getBBox: function(a) {
            if (a = a.node)
                try {
                    return a.getBBox()
                } catch (b) {}
            return {
                width: 0,
                height: 0,
                x: 0,
                y: 0
            }
        },
        path: function(a, b) {
            a.node.setAttributeNS(d.SVG_XLINK, "xlink:href", b)
        },
        clipRect: function(a, b, c, e, f) {
            var g = a.node
              , h = a.clipPath;
            h && this.D.remove(h);
            var k = g.parentNode;
            k && (g = document.createElementNS(d.SVG_NS, "clipPath"),
            h = d.getUniqueId(),
            g.setAttribute("id", h),
            this.D.rect(b, c, e, f, 0, 0, g),
            k.appendChild(g),
            b = "#",
            d.baseHref && !d.isIE && (b = this.removeTarget(window.location.href) + b),
            this.setAttr(a, "clip-path", "url(" + b + h + ")"),
            this.clipPathC++,
            a.clipPath = g)
        },
        text: function(a, b, c) {
            var e = new d.AmDObject("text",this.D);
            a = String(a).split("\n");
            var f = d.removePx(b["font-size"]), g;
            for (g = 0; g < a.length; g++) {
                var h = this.create(null, "tspan");
                h.appendChild(document.createTextNode(a[g]));
                h.setAttribute("y", (f + 2) * g + Math.round(f / 2));
                h.setAttribute("x", 0);
                e.node.appendChild(h)
            }
            e.node.setAttribute("y", Math.round(f / 2));
            this.attr(e, b);
            this.D.addToContainer(e.node, c);
            return e
        },
        setText: function(a, b) {
            var c = a.node;
            c && (c.removeChild(c.firstChild),
            c.appendChild(document.createTextNode(b)))
        },
        move: function(a, b, c, e) {
            isNaN(b) && (b = 0);
            isNaN(c) && (c = 0);
            b = "translate(" + b + "," + c + ")";
            e && (b = b + " scale(" + e + ")");
            this.setAttr(a, "transform", b)
        },
        rotate: function(a, b) {
            var c = a.node.getAttribute("transform")
              , e = "rotate(" + b + ")";
            c && (e = c + " " + e);
            this.setAttr(a, "transform", e)
        },
        set: function(a) {
            var b = new d.AmDObject("g",this.D);
            this.D.container.appendChild(b.node);
            if (a) {
                var c;
                for (c = 0; c < a.length; c++)
                    b.push(a[c])
            }
            return b
        },
        addListener: function(a, b, c) {
            a.node["on" + b] = c
        },
        gradient: function(a, b, c, e) {
            var f = a.node
              , g = a.grad;
            g && this.D.remove(g);
            b = document.createElementNS(d.SVG_NS, b);
            g = d.getUniqueId();
            b.setAttribute("id", g);
            if (!isNaN(e)) {
                var h = 0
                  , k = 0
                  , l = 0
                  , m = 0;
                90 == e ? l = 100 : 270 == e ? m = 100 : 180 == e ? h = 100 : 0 === e && (k = 100);
                b.setAttribute("x1", h + "%");
                b.setAttribute("x2", k + "%");
                b.setAttribute("y1", l + "%");
                b.setAttribute("y2", m + "%")
            }
            for (e = 0; e < c.length; e++)
                h = document.createElementNS(d.SVG_NS, "stop"),
                k = 100 * e / (c.length - 1),
                0 === e && (k = 0),
                h.setAttribute("offset", k + "%"),
                h.setAttribute("stop-color", c[e]),
                b.appendChild(h);
            f.parentNode.appendChild(b);
            c = "#";
            d.baseHref && !d.isIE && (c = this.removeTarget(window.location.href) + c);
            f.setAttribute("fill", "url(" + c + g + ")");
            a.grad = b
        },
        removeTarget: function(a) {
            return a.split("#")[0]
        },
        pattern: function(a, b, c, e) {
            var f = a.node;
            isNaN(c) && (c = 1);
            var g = a.patternNode;
            g && this.D.remove(g);
            var g = document.createElementNS(d.SVG_NS, "pattern")
              , h = d.getUniqueId()
              , k = b;
            b.url && (k = b.url);
            d.isAbsolute(k) || -1 != k.indexOf("data:image") || (k = e + k);
            e = Number(b.width);
            isNaN(e) && (e = 4);
            var l = Number(b.height);
            isNaN(l) && (l = 4);
            e /= c;
            l /= c;
            c = b.x;
            isNaN(c) && (c = 0);
            var m = -Math.random() * Number(b.randomX);
            isNaN(m) || (c = m);
            m = b.y;
            isNaN(m) && (m = 0);
            var n = -Math.random() * Number(b.randomY);
            isNaN(n) || (m = n);
            g.setAttribute("id", h);
            g.setAttribute("width", e);
            g.setAttribute("height", l);
            g.setAttribute("patternUnits", "userSpaceOnUse");
            g.setAttribute("xlink:href", k);
            b.color && (n = document.createElementNS(d.SVG_NS, "rect"),
            n.setAttributeNS(null, "height", e),
            n.setAttributeNS(null, "width", l),
            n.setAttributeNS(null, "fill", b.color),
            g.appendChild(n));
            this.D.image(k, 0, 0, e, l, g).translate(c, m);
            k = "#";
            d.baseHref && !d.isIE && (k = this.removeTarget(window.location.href) + k);
            f.setAttribute("fill", "url(" + k + h + ")");
            a.patternNode = g;
            f.parentNode.appendChild(g)
        },
        remove: function(a) {
            a.clipPath && this.D.remove(a.clipPath);
            a.grad && this.D.remove(a.grad);
            a.patternNode && this.D.remove(a.patternNode);
            this.D.remove(a.node)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.AmChart = d.Class({
        construct: function(a) {
            this.svgIcons = this.tapToActivate = !0;
            this.theme = a;
            this.classNamePrefix = "amcharts";
            this.addClassNames = !1;
            this.version = "3.21.1";
            d.addChart(this);
            this.createEvents("buildStarted", "dataUpdated", "init", "rendered", "drawn", "failed", "resized", "animationFinished");
            this.height = this.width = "100%";
            this.dataChanged = !0;
            this.chartCreated = !1;
            this.previousWidth = this.previousHeight = 0;
            this.backgroundColor = "#FFFFFF";
            this.borderAlpha = this.backgroundAlpha = 0;
            this.color = this.borderColor = "#000000";
            this.fontFamily = "Verdana";
            this.fontSize = 11;
            this.usePrefixes = !1;
            this.autoResize = !0;
            this.autoDisplay = !1;
            this.addCodeCredits = this.accessible = !0;
            this.touchStartTime = this.touchClickDuration = 0;
            this.precision = -1;
            this.percentPrecision = 2;
            this.decimalSeparator = ".";
            this.thousandsSeparator = ",";
            this.labels = [];
            this.allLabels = [];
            this.titles = [];
            this.marginRight = this.marginLeft = this.autoMarginOffset = 0;
            this.timeOuts = [];
            this.creditsPosition = "top-left";
            var b = document.createElement("div")
              , c = b.style;
            c.overflow = "hidden";
            c.position = "relative";
            c.textAlign = "left";
            this.chartDiv = b;
            b = document.createElement("div");
            c = b.style;
            c.overflow = "hidden";
            c.position = "relative";
            c.textAlign = "left";
            this.legendDiv = b;
            this.titleHeight = 0;
            this.hideBalloonTime = 150;
            this.handDrawScatter = 2;
            this.cssScale = this.handDrawThickness = 1;
            this.cssAngle = 0;
            this.prefixesOfBigNumbers = [{
                number: 1E3,
                prefix: "k"
            }, {
                number: 1E6,
                prefix: "M"
            }, {
                number: 1E9,
                prefix: "G"
            }, {
                number: 1E12,
                prefix: "T"
            }, {
                number: 1E15,
                prefix: "P"
            }, {
                number: 1E18,
                prefix: "E"
            }, {
                number: 1E21,
                prefix: "Z"
            }, {
                number: 1E24,
                prefix: "Y"
            }];
            this.prefixesOfSmallNumbers = [{
                number: 1E-24,
                prefix: "y"
            }, {
                number: 1E-21,
                prefix: "z"
            }, {
                number: 1E-18,
                prefix: "a"
            }, {
                number: 1E-15,
                prefix: "f"
            }, {
                number: 1E-12,
                prefix: "p"
            }, {
                number: 1E-9,
                prefix: "n"
            }, {
                number: 1E-6,
                prefix: "\u03bc"
            }, {
                number: .001,
                prefix: "m"
            }];
            this.panEventsEnabled = !0;
            this.product = "amcharts";
            this.animations = [];
            this.balloon = new d.AmBalloon(this.theme);
            this.balloon.chart = this;
            this.processTimeout = 0;
            this.processCount = 1E3;
            this.animatable = [];
            this.langObj = {};
            d.applyTheme(this, a, "AmChart")
        },
        drawChart: function() {
            0 < this.realWidth && 0 < this.realHeight && (this.drawBackground(),
            this.redrawLabels(),
            this.drawTitles(),
            this.brr(),
            this.renderFix(),
            this.chartDiv && (this.boundingRect = this.chartDiv.getBoundingClientRect()))
        },
        makeAccessible: function(a, b, c) {
            this.accessible && a && (c && a.setAttr("role", c),
            a.setAttr("aria-label", b))
        },
        drawBackground: function() {
            d.remove(this.background);
            var a = this.container
              , b = this.backgroundColor
              , c = this.backgroundAlpha
              , e = this.set;
            d.isModern || 0 !== c || (c = .001);
            var f = this.updateWidth();
            this.realWidth = f;
            var g = this.updateHeight();
            this.realHeight = g;
            b = d.polygon(a, [0, f - 1, f - 1, 0], [0, 0, g - 1, g - 1], b, c, 1, this.borderColor, this.borderAlpha);
            d.setCN(this, b, "bg");
            this.background = b;
            e.push(b);
            if (b = this.backgroundImage)
                a = a.image(b, 0, 0, f, g),
                d.setCN(this, b, "bg-image"),
                this.bgImg = a,
                e.push(a)
        },
        drawTitles: function(a) {
            var b = this.titles;
            this.titleHeight = 0;
            if (d.ifArray(b)) {
                var c = 20, e;
                for (e = 0; e < b.length; e++) {
                    var f = b[e]
                      , f = d.processObject(f, d.Title, this.theme);
                    if (!1 !== f.enabled) {
                        var g = f.color;
                        void 0 === g && (g = this.color);
                        var h = f.size;
                        isNaN(h) && (h = this.fontSize + 2);
                        isNaN(f.alpha);
                        var k = this.marginLeft
                          , l = !0;
                        void 0 !== f.bold && (l = f.bold);
                        g = d.wrappedText(this.container, f.text, g, this.fontFamily, h, "middle", l, this.realWidth - 35);
                        g.translate(k + (this.realWidth - this.marginRight - k) / 2, c);
                        g.node.style.pointerEvents = "none";
                        f.sprite = g;
                        void 0 !== f.tabIndex && g.setAttr("tabindex", f.tabIndex);
                        d.setCN(this, g, "title");
                        f.id && d.setCN(this, g, "title-" + f.id);
                        g.attr({
                            opacity: f.alpha
                        });
                        c += g.getBBox().height + 5;
                        a ? g.remove() : this.freeLabelsSet.push(g)
                    }
                }
                this.titleHeight = c - 10
            }
        },
        write: function(a) {
            var b = this;
            if (b.listeners)
                for (var c = 0; c < b.listeners.length; c++) {
                    var e = b.listeners[c];
                    b.addListener(e.event, e.method)
                }
            b.fire({
                type: "buildStarted",
                chart: b
            });
            b.afterWriteTO && clearTimeout(b.afterWriteTO);
            0 < b.processTimeout ? b.afterWriteTO = setTimeout(function() {
                b.afterWrite.call(b, a)
            }, b.processTimeout) : b.afterWrite(a)
        },
        afterWrite: function(a) {
            var b;
            if (b = "object" != typeof a ? document.getElementById(a) : a) {
                for (; b.firstChild; )
                    b.removeChild(b.firstChild);
                this.div = b;
                b.style.overflow = "hidden";
                b.style.textAlign = "left";
                a = this.chartDiv;
                var c = this.legendDiv
                  , e = this.legend
                  , f = c.style
                  , g = a.style;
                this.measure();
                this.previousHeight = this.divRealHeight;
                this.previousWidth = this.divRealWidth;
                var h, k = document.createElement("div");
                h = k.style;
                h.position = "relative";
                this.containerDiv = k;
                k.className = this.classNamePrefix + "-main-div";
                a.className = this.classNamePrefix + "-chart-div";
                b.appendChild(k);
                (b = this.exportConfig) && d.AmExport && !this.AmExport && (this.AmExport = new d.AmExport(this,b));
                this.amExport && d.AmExport && (this.AmExport = d.extend(this.amExport, new d.AmExport(this), !0));
                this.AmExport && this.AmExport.init && this.AmExport.init();
                if (e) {
                    e = this.addLegend(e, e.divId);
                    if (e.enabled)
                        switch (f.left = null,
                        f.top = null,
                        f.right = null,
                        g.left = null,
                        g.right = null,
                        g.top = null,
                        f.position = "relative",
                        g.position = "relative",
                        h.width = "100%",
                        h.height = "100%",
                        e.position) {
                        case "bottom":
                            k.appendChild(a);
                            k.appendChild(c);
                            break;
                        case "top":
                            k.appendChild(c);
                            k.appendChild(a);
                            break;
                        case "absolute":
                            f.position = "absolute";
                            g.position = "absolute";
                            void 0 !== e.left && (f.left = e.left + "px");
                            void 0 !== e.right && (f.right = e.right + "px");
                            void 0 !== e.top && (f.top = e.top + "px");
                            void 0 !== e.bottom && (f.bottom = e.bottom + "px");
                            e.marginLeft = 0;
                            e.marginRight = 0;
                            k.appendChild(a);
                            k.appendChild(c);
                            break;
                        case "right":
                            f.position = "relative";
                            g.position = "absolute";
                            k.appendChild(a);
                            k.appendChild(c);
                            break;
                        case "left":
                            f.position = "absolute";
                            g.position = "relative";
                            k.appendChild(a);
                            k.appendChild(c);
                            break;
                        case "outside":
                            k.appendChild(a)
                        }
                    else
                        k.appendChild(a);
                    this.prevLegendPosition = e.position
                } else
                    k.appendChild(a);
                this.listenersAdded || (this.addListeners(),
                this.listenersAdded = !0);
                (this.mouseWheelScrollEnabled || this.mouseWheelZoomEnabled) && d.addWheelListeners();
                this.initChart()
            }
        },
        createLabelsSet: function() {
            d.remove(this.labelsSet);
            this.labelsSet = this.container.set();
            this.freeLabelsSet.push(this.labelsSet)
        },
        initChart: function() {
            this.balloon = d.processObject(this.balloon, d.AmBalloon, this.theme);
            window.AmCharts_path && (this.path = window.AmCharts_path);
            void 0 === this.path && (this.path = d.getPath());
            void 0 === this.path && (this.path = "amcharts/");
            this.path = d.normalizeUrl(this.path);
            void 0 === this.pathToImages && (this.pathToImages = this.path + "images/");
            this.initHC || (d.callInitHandler(this),
            this.initHC = !0);
            d.applyLang(this.language, this);
            var a = this.numberFormatter;
            a && (isNaN(a.precision) || (this.precision = a.precision),
            void 0 !== a.thousandsSeparator && (this.thousandsSeparator = a.thousandsSeparator),
            void 0 !== a.decimalSeparator && (this.decimalSeparator = a.decimalSeparator));
            (a = this.percentFormatter) && !isNaN(a.precision) && (this.percentPrecision = a.precision);
            this.nf = {
                precision: this.precision,
                thousandsSeparator: this.thousandsSeparator,
                decimalSeparator: this.decimalSeparator
            };
            this.pf = {
                precision: this.percentPrecision,
                thousandsSeparator: this.thousandsSeparator,
                decimalSeparator: this.decimalSeparator
            };
            this.destroy();
            (a = this.container) ? (a.container.innerHTML = "",
            a.width = this.realWidth,
            a.height = this.realHeight,
            a.addDefs(this),
            this.chartDiv.appendChild(a.container)) : a = new d.AmDraw(this.chartDiv,this.realWidth,this.realHeight,this);
            this.container = a;
            this.extension = ".png";
            this.svgIcons && d.SVG && (this.extension = ".svg");
            this.checkDisplay();
            this.checkTransform(this.div);
            a.chart = this;
            d.VML || d.SVG ? (a.handDrawn = this.handDrawn,
            a.handDrawScatter = this.handDrawScatter,
            a.handDrawThickness = this.handDrawThickness,
            d.remove(this.set),
            this.set = a.set(),
            d.remove(this.gridSet),
            this.gridSet = a.set(),
            d.remove(this.cursorLineSet),
            this.cursorLineSet = a.set(),
            d.remove(this.graphsBehindSet),
            this.graphsBehindSet = a.set(),
            d.remove(this.bulletBehindSet),
            this.bulletBehindSet = a.set(),
            d.remove(this.columnSet),
            this.columnSet = a.set(),
            d.remove(this.graphsSet),
            this.graphsSet = a.set(),
            d.remove(this.trendLinesSet),
            this.trendLinesSet = a.set(),
            d.remove(this.axesSet),
            this.axesSet = a.set(),
            d.remove(this.cursorSet),
            this.cursorSet = a.set(),
            d.remove(this.scrollbarsSet),
            this.scrollbarsSet = a.set(),
            d.remove(this.bulletSet),
            this.bulletSet = a.set(),
            d.remove(this.freeLabelsSet),
            this.freeLabelsSet = a.set(),
            d.remove(this.axesLabelsSet),
            this.axesLabelsSet = a.set(),
            d.remove(this.balloonsSet),
            this.balloonsSet = a.set(),
            d.remove(this.plotBalloonsSet),
            this.plotBalloonsSet = a.set(),
            d.remove(this.zoomButtonSet),
            this.zoomButtonSet = a.set(),
            d.remove(this.zbSet),
            this.zbSet = null,
            d.remove(this.linkSet),
            this.linkSet = a.set()) : this.fire({
                type: "failed",
                chart: this
            })
        },
        premeasure: function() {
            var a = this.div;
            if (a) {
                try {
                    this.boundingRect = this.chartDiv.getBoundingClientRect()
                } catch (e) {}
                var b = a.offsetWidth
                  , c = a.offsetHeight;
                a.clientHeight && (b = a.clientWidth,
                c = a.clientHeight);
                if (b != this.mw || c != this.mh)
                    this.mw = b,
                    this.mh = c,
                    this.measure()
            }
        },
        measure: function() {
            var a = this.div;
            if (a) {
                var b = this.chartDiv
                  , c = a.offsetWidth
                  , e = a.offsetHeight
                  , f = this.container;
                a.clientHeight && (c = a.clientWidth,
                e = a.clientHeight);
                var e = Math.round(e)
                  , c = Math.round(c)
                  , a = Math.round(d.toCoordinate(this.width, c))
                  , g = Math.round(d.toCoordinate(this.height, e));
                (c != this.previousWidth || e != this.previousHeight) && 0 < a && 0 < g && (b.style.width = a + "px",
                b.style.height = g + "px",
                b.style.padding = 0,
                f && f.setSize(a, g),
                this.balloon = d.processObject(this.balloon, d.AmBalloon, this.theme));
                this.balloon && this.balloon.setBounds && this.balloon.setBounds(2, 2, a - 2, g);
                this.updateWidth();
                this.balloon.chart = this;
                this.realWidth = a;
                this.realHeight = g;
                this.divRealWidth = c;
                this.divRealHeight = e
            }
        },
        checkDisplay: function() {
            if (this.autoDisplay && this.container) {
                var a = d.rect(this.container, 10, 10)
                  , b = a.getBBox();
                0 === b.width && 0 === b.height && (this.divRealHeight = this.divRealWidth = this.realHeight = this.realWidth = 0,
                this.previousWidth = this.previousHeight = NaN);
                a.remove()
            }
        },
        checkTransform: function(a) {
            if (this.autoTransform && window.getComputedStyle && a) {
                if (a.style) {
                    var b = window.getComputedStyle(a, null);
                    if (b && (b = b.getPropertyValue("-webkit-transform") || b.getPropertyValue("-moz-transform") || b.getPropertyValue("-ms-transform") || b.getPropertyValue("-o-transform") || b.getPropertyValue("transform")) && "none" !== b) {
                        var c = b.split("(")[1].split(")")[0].split(",")
                          , b = c[0]
                          , c = c[1]
                          , b = Math.sqrt(b * b + c * c);
                        isNaN(b) || (this.cssScale *= b)
                    }
                }
                a.parentNode && this.checkTransform(a.parentNode)
            }
        },
        destroy: function() {
            this.chartDiv.innerHTML = "";
            this.clearTimeOuts();
            this.legend && this.legend.destroy()
        },
        clearTimeOuts: function() {
            var a = this.timeOuts;
            if (a) {
                var b;
                for (b = 0; b < a.length; b++)
                    clearTimeout(a[b])
            }
            this.timeOuts = []
        },
        clear: function(a) {
            try {
                document.removeEventListener("touchstart", this.docfn1, !0),
                document.removeEventListener("touchend", this.docfn2, !0)
            } catch (b) {}
            d.callMethod("clear", [this.chartScrollbar, this.scrollbarV, this.scrollbarH, this.chartCursor]);
            this.chartCursor = this.scrollbarH = this.scrollbarV = this.chartScrollbar = null;
            this.clearTimeOuts();
            this.container && (this.container.remove(this.chartDiv),
            this.container.remove(this.legendDiv));
            a || d.removeChart(this);
            if (a = this.div)
                for (; a.firstChild; )
                    a.removeChild(a.firstChild);
            this.legend && this.legend.destroy();
            this.AmExport && this.AmExport.clear && this.AmExport.clear()
        },
        setMouseCursor: function(a) {
            "auto" == a && d.isNN && (a = "default");
            this.chartDiv.style.cursor = a;
            this.legendDiv.style.cursor = a
        },
        redrawLabels: function() {
            this.labels = [];
            var a = this.allLabels;
            this.createLabelsSet();
            var b;
            for (b = 0; b < a.length; b++)
                this.drawLabel(a[b])
        },
        drawLabel: function(a) {
            var b = this;
            if (b.container && !1 !== a.enabled) {
                a = d.processObject(a, d.Label, b.theme);
                var c = a.y
                  , e = a.text
                  , f = a.align
                  , g = a.size
                  , h = a.color
                  , k = a.rotation
                  , l = a.alpha
                  , m = a.bold
                  , n = d.toCoordinate(a.x, b.realWidth)
                  , c = d.toCoordinate(c, b.realHeight);
                n || (n = 0);
                c || (c = 0);
                void 0 === h && (h = b.color);
                isNaN(g) && (g = b.fontSize);
                f || (f = "start");
                "left" == f && (f = "start");
                "right" == f && (f = "end");
                "center" == f && (f = "middle",
                k ? c = b.realHeight - c + c / 2 : n = b.realWidth / 2 - n);
                void 0 === l && (l = 1);
                void 0 === k && (k = 0);
                c += g / 2;
                e = d.text(b.container, e, h, b.fontFamily, g, f, m, l);
                e.translate(n, c);
                void 0 !== a.tabIndex && e.setAttr("tabindex", a.tabIndex);
                d.setCN(b, e, "label");
                a.id && d.setCN(b, e, "label-" + a.id);
                0 !== k && e.rotate(k);
                a.url ? (e.setAttr("cursor", "pointer"),
                e.click(function() {
                    d.getURL(a.url, b.urlTarget)
                })) : e.node.style.pointerEvents = "none";
                b.labelsSet.push(e);
                b.labels.push(e)
            }
        },
        addLabel: function(a, b, c, e, d, g, h, k, l, m) {
            a = {
                x: a,
                y: b,
                text: c,
                align: e,
                size: d,
                color: g,
                alpha: k,
                rotation: h,
                bold: l,
                url: m,
                enabled: !0
            };
            this.container && this.drawLabel(a);
            this.allLabels.push(a)
        },
        clearLabels: function() {
            var a = this.labels, b;
            for (b = a.length - 1; 0 <= b; b--)
                a[b].remove();
            this.labels = [];
            this.allLabels = []
        },
        updateHeight: function() {
            var a = this.divRealHeight
              , b = this.legend;
            if (b) {
                var c = this.legendDiv.offsetHeight
                  , b = b.position;
                if ("top" == b || "bottom" == b) {
                    a -= c;
                    if (0 > a || isNaN(a))
                        a = 0;
                    this.chartDiv.style.height = a + "px"
                }
            }
            return a
        },
        updateWidth: function() {
            var a = this.divRealWidth
              , b = this.divRealHeight
              , c = this.legend;
            if (c) {
                var e = this.legendDiv
                  , d = e.offsetWidth;
                isNaN(c.width) || (d = c.width);
                c.ieW && (d = c.ieW);
                var g = e.offsetHeight
                  , e = e.style
                  , h = this.chartDiv.style
                  , k = c.position;
                if (("right" == k || "left" == k) && void 0 === c.divId) {
                    a -= d;
                    if (0 > a || isNaN(a))
                        a = 0;
                    h.width = a + "px";
                    this.balloon && this.balloon.setBounds && this.balloon.setBounds(2, 2, a - 2, this.realHeight);
                    "left" == k ? (h.left = d + "px",
                    e.left = "0px") : (h.left = "0px",
                    e.left = a + "px");
                    b > g && (e.top = (b - g) / 2 + "px")
                }
            }
            return a
        },
        getTitleHeight: function() {
            this.drawTitles(!0);
            return this.titleHeight
        },
        addTitle: function(a, b, c, e, d) {
            isNaN(b) && (b = this.fontSize + 2);
            a = {
                text: a,
                size: b,
                color: c,
                alpha: e,
                bold: d,
                enabled: !0
            };
            this.titles.push(a);
            return a
        },
        handleWheel: function(a) {
            var b = 0;
            a || (a = window.event);
            a.wheelDelta ? b = a.wheelDelta / 120 : a.detail && (b = -a.detail / 3);
            b && this.handleWheelReal(b, a.shiftKey);
            a.preventDefault && a.preventDefault()
        },
        handleWheelReal: function() {},
        handleDocTouchStart: function() {
            this.handleMouseMove();
            this.tmx = this.mouseX;
            this.tmy = this.mouseY;
            this.touchStartTime = (new Date).getTime()
        },
        handleDocTouchEnd: function() {
            -.5 < this.tmx && this.tmx < this.divRealWidth + 1 && 0 < this.tmy && this.tmy < this.divRealHeight ? (this.handleMouseMove(),
            4 > Math.abs(this.mouseX - this.tmx) && 4 > Math.abs(this.mouseY - this.tmy) ? (this.tapped = !0,
            this.panRequired && this.panEventsEnabled && this.chartDiv && (this.chartDiv.style.msTouchAction = "none",
            this.chartDiv.style.touchAction = "none")) : this.mouseIsOver || this.resetTouchStyle()) : (this.tapped = !1,
            this.resetTouchStyle())
        },
        resetTouchStyle: function() {
            this.panEventsEnabled && this.chartDiv && (this.chartDiv.style.msTouchAction = "auto",
            this.chartDiv.style.touchAction = "auto")
        },
        checkTouchDuration: function(a) {
            var b = this
              , c = (new Date).getTime();
            if (a)
                if (a.touches)
                    b.isTouchEvent = !0;
                else if (!b.isTouchEvent)
                    return !0;
            if (c - b.touchStartTime > b.touchClickDuration)
                return !0;
            setTimeout(function() {
                b.resetTouchDuration()
            }, 300)
        },
        resetTouchDuration: function() {
            this.isTouchEvent = !1
        },
        checkTouchMoved: function() {
            if (4 < Math.abs(this.mouseX - this.tmx) || 4 < Math.abs(this.mouseY - this.tmy))
                return !0
        },
        addListeners: function() {
            var a = this
              , b = a.chartDiv;
            document.addEventListener ? ("ontouchstart"in document.documentElement && (b.addEventListener("touchstart", function(b) {
                a.handleTouchStart.call(a, b)
            }, !0),
            b.addEventListener("touchmove", function(b) {
                a.handleMouseMove.call(a, b)
            }, !0),
            b.addEventListener("touchend", function(b) {
                a.handleTouchEnd.call(a, b)
            }, !0),
            a.docfn1 = function(b) {
                a.handleDocTouchStart.call(a, b)
            }
            ,
            a.docfn2 = function(b) {
                a.handleDocTouchEnd.call(a, b)
            }
            ,
            document.addEventListener("touchstart", a.docfn1, !0),
            document.addEventListener("touchend", a.docfn2, !0)),
            b.addEventListener("mousedown", function(b) {
                a.mouseIsOver = !0;
                a.handleMouseMove.call(a, b);
                a.handleMouseDown.call(a, b);
                a.handleDocTouchStart.call(a, b)
            }, !0),
            b.addEventListener("mouseover", function(b) {
                a.handleMouseOver.call(a, b)
            }, !0),
            b.addEventListener("mouseout", function(b) {
                a.handleMouseOut.call(a, b)
            }, !0),
            b.addEventListener("mouseup", function(b) {
                a.handleDocTouchEnd.call(a, b)
            }, !0)) : (b.attachEvent("onmousedown", function(b) {
                a.handleMouseDown.call(a, b)
            }),
            b.attachEvent("onmouseover", function(b) {
                a.handleMouseOver.call(a, b)
            }),
            b.attachEvent("onmouseout", function(b) {
                a.handleMouseOut.call(a, b)
            }))
        },
        dispDUpd: function() {
            this.skipEvents || (this.dispatchDataUpdated && (this.dispatchDataUpdated = !1,
            this.fire({
                type: "dataUpdated",
                chart: this
            })),
            this.chartCreated || (this.chartCreated = !0,
            this.fire({
                type: "init",
                chart: this
            })),
            this.chartRendered || (this.fire({
                type: "rendered",
                chart: this
            }),
            this.chartRendered = !0),
            this.fire({
                type: "drawn",
                chart: this
            }));
            this.skipEvents = !1
        },
        validateSize: function() {
            var a = this;
            a.premeasure();
            a.checkDisplay();
            a.cssScale = 1;
            a.cssAngle = 0;
            a.checkTransform(a.div);
            if (a.divRealWidth != a.previousWidth || a.divRealHeight != a.previousHeight) {
                var b = a.legend;
                if (0 < a.realWidth && 0 < a.realHeight) {
                    a.sizeChanged = !0;
                    if (b) {
                        a.legendInitTO && clearTimeout(a.legendInitTO);
                        var c = setTimeout(function() {
                            b.invalidateSize()
                        }, 10);
                        a.timeOuts.push(c);
                        a.legendInitTO = c
                    }
                    a.marginsUpdated = !1;
                    clearTimeout(a.initTO);
                    c = setTimeout(function() {
                        a.initChart()
                    }, 10);
                    a.timeOuts.push(c);
                    a.initTO = c
                }
                a.renderFix();
                b && b.renderFix && b.renderFix();
                clearTimeout(a.resizedTO);
                a.resizedTO = setTimeout(function() {
                    a.fire({
                        type: "resized",
                        chart: a
                    })
                }, 10);
                a.previousHeight = a.divRealHeight;
                a.previousWidth = a.divRealWidth
            }
        },
        invalidateSize: function() {
            this.previousHeight = this.previousWidth = NaN;
            this.invalidateSizeReal()
        },
        invalidateSizeReal: function() {
            var a = this;
            a.marginsUpdated = !1;
            clearTimeout(a.validateTO);
            var b = setTimeout(function() {
                a.validateSize()
            }, 5);
            a.timeOuts.push(b);
            a.validateTO = b
        },
        validateData: function(a) {
            this.chartCreated && (this.dataChanged = !0,
            this.marginsUpdated = !1,
            this.initChart(a))
        },
        validateNow: function(a, b) {
            this.initTO && clearTimeout(this.initTO);
            a && (this.dataChanged = !0,
            this.marginsUpdated = !1);
            this.skipEvents = b;
            this.chartRendered = !1;
            var c = this.legend;
            c && c.position != this.prevLegendPosition && (this.previousWidth = this.mw = 0,
            c.invalidateSize && (c.invalidateSize(),
            this.validateSize()));
            this.write(this.div)
        },
        showItem: function(a) {
            a.hidden = !1;
            this.initChart()
        },
        hideItem: function(a) {
            a.hidden = !0;
            this.initChart()
        },
        hideBalloon: function() {
            var a = this;
            clearTimeout(a.hoverInt);
            clearTimeout(a.balloonTO);
            a.hoverInt = setTimeout(function() {
                a.hideBalloonReal.call(a)
            }, a.hideBalloonTime)
        },
        cleanChart: function() {},
        hideBalloonReal: function() {
            var a = this.balloon;
            a && a.hide && a.hide()
        },
        showBalloon: function(a, b, c, e, d) {
            var g = this;
            clearTimeout(g.balloonTO);
            clearTimeout(g.hoverInt);
            g.balloonTO = setTimeout(function() {
                g.showBalloonReal.call(g, a, b, c, e, d)
            }, 1)
        },
        showBalloonReal: function(a, b, c, e, d) {
            this.handleMouseMove();
            var g = this.balloon;
            g.enabled && (g.followCursor(!1),
            g.changeColor(b),
            !c || g.fixedPosition ? (g.setPosition(e, d),
            isNaN(e) || isNaN(d) ? g.followCursor(!0) : g.followCursor(!1)) : g.followCursor(!0),
            a && g.showBalloon(a))
        },
        handleMouseOver: function() {
            this.outTO && clearTimeout(this.outTO);
            d.resetMouseOver();
            this.mouseIsOver = !0
        },
        handleMouseOut: function() {
            var a = this;
            d.resetMouseOver();
            a.outTO && clearTimeout(a.outTO);
            a.outTO = setTimeout(function() {
                a.handleMouseOutReal()
            }, 10)
        },
        handleMouseOutReal: function() {
            this.mouseIsOver = !1
        },
        handleMouseMove: function(a) {
            a || (a = window.event);
            this.mouse2Y = this.mouse2X = NaN;
            var b, c, e, d;
            if (a) {
                if (a.touches) {
                    var g = a.touches.item(1);
                    g && this.panEventsEnabled && this.boundingRect && (e = g.clientX - this.boundingRect.left,
                    d = g.clientY - this.boundingRect.top);
                    a = a.touches.item(0);
                    if (!a)
                        return
                } else
                    this.wasTouched = !1;
                this.boundingRect && a.clientX && (b = a.clientX - this.boundingRect.left,
                c = a.clientY - this.boundingRect.top);
                isNaN(e) ? this.mouseX = b : (this.mouseX = Math.min(b, e),
                this.mouse2X = Math.max(b, e));
                isNaN(d) ? this.mouseY = c : (this.mouseY = Math.min(c, d),
                this.mouse2Y = Math.max(c, d));
                this.autoTransform && (this.mouseX /= this.cssScale,
                this.mouseY /= this.cssScale)
            }
        },
        handleTouchStart: function(a) {
            this.hideBalloonReal();
            a && (a.touches && this.tapToActivate && !this.tapped || !this.panRequired) || (this.handleMouseMove(a),
            this.handleMouseDown(a))
        },
        handleTouchEnd: function(a) {
            this.wasTouched = !0;
            this.handleMouseMove(a);
            d.resetMouseOver();
            this.handleReleaseOutside(a)
        },
        handleReleaseOutside: function() {
            this.handleDocTouchEnd.call(this)
        },
        handleMouseDown: function(a) {
            d.resetMouseOver();
            this.mouseIsOver = !0;
            a && a.preventDefault && (this.panEventsEnabled ? a.preventDefault() : a.touches || a.preventDefault())
        },
        addLegend: function(a, b) {
            a = d.processObject(a, d.AmLegend, this.theme);
            a.divId = b;
            a.ieW = 0;
            var c;
            c = "object" != typeof b && b ? document.getElementById(b) : b;
            this.legend = a;
            a.chart = this;
            c ? (a.div = c,
            a.position = "outside",
            a.autoMargins = !1) : a.div = this.legendDiv;
            return a
        },
        removeLegend: function() {
            this.legend = void 0;
            this.previousWidth = 0;
            this.legendDiv.innerHTML = ""
        },
        handleResize: function() {
            (d.isPercents(this.width) || d.isPercents(this.height)) && this.invalidateSizeReal();
            this.renderFix()
        },
        renderFix: function() {
            if (!d.VML) {
                var a = this.container;
                a && a.renderFix()
            }
        },
        getSVG: function() {
            if (d.hasSVG)
                return this.container
        },
        animate: function(a, b, c, e, f, g, h) {
            a["an_" + b] && d.removeFromArray(this.animations, a["an_" + b]);
            c = {
                obj: a,
                frame: 0,
                attribute: b,
                from: c,
                to: e,
                time: f,
                effect: g,
                suffix: h
            };
            a["an_" + b] = c;
            this.animations.push(c);
            return c
        },
        setLegendData: function(a) {
            var b = this.legend;
            b && b.setData(a)
        },
        stopAnim: function(a) {
            d.removeFromArray(this.animations, a)
        },
        updateAnimations: function() {
            var a;
            this.container && this.container.update();
            if (this.animations)
                for (a = this.animations.length - 1; 0 <= a; a--) {
                    var b = this.animations[a]
                      , c = d.updateRate * b.time
                      , e = b.frame + 1
                      , f = b.obj
                      , g = b.attribute;
                    if (e <= c) {
                        b.frame++;
                        var h = Number(b.from)
                          , k = Number(b.to) - h
                          , c = d[b.effect](0, e, h, k, c);
                        0 === k ? (this.animations.splice(a, 1),
                        f.node.style[g] = Number(b.to) + b.suffix) : f.node.style[g] = c + b.suffix
                    } else
                        f.node.style[g] = Number(b.to) + b.suffix,
                        f.animationFinished = !0,
                        this.animations.splice(a, 1)
                }
        },
        update: function() {
            this.updateAnimations();
            var a = this.animatable;
            if (0 < a.length) {
                for (var b = !0, c = a.length - 1; 0 <= c; c--) {
                    var e = a[c];
                    e && (e.animationFinished ? a.splice(c, 1) : b = !1)
                }
                b && (this.fire({
                    type: "animationFinished",
                    chart: this
                }),
                this.animatable = [])
            }
        },
        inIframe: function() {
            try {
                return window.self !== window.top
            } catch (a) {
                return !0
            }
        },
        brr: function() {
            if (!this.hideCredits) {
                var a = "amcharts.com", b = window.location.hostname.split("."), c;
                2 <= b.length && (c = b[b.length - 2] + "." + b[b.length - 1]);
                this.amLink && (b = this.amLink.parentNode) && b.removeChild(this.amLink);
                b = this.creditsPosition;
                if (c != a || !0 === this.inIframe()) {
                    var a = "http://www." + a
                      , e = c = 0
                      , d = this.realWidth
                      , g = this.realHeight
                      , h = this.type;
                    if ("serial" == h || "xy" == h || "gantt" == h)
                        c = this.marginLeftReal,
                        e = this.marginTopReal,
                        d = c + this.plotAreaWidth,
                        g = e + this.plotAreaHeight;
                    var h = a + "/javascript-charts/"
                      , k = "JavaScript charts"
                      , l = "JS chart by amCharts";
                    "ammap" == this.product && (h = a + "/javascript-maps/",
                    k = "Interactive JavaScript maps",
                    l = "");
                    a = document.createElement("a");
                    l = document.createTextNode(l);
                    a.setAttribute("href", h);
                    a.setAttribute("title", k);
                    this.urlTarget && a.setAttribute("target", this.urlTarget);
                    a.appendChild(l);
                    this.chartDiv.appendChild(a);
                    this.amLink = a;
                    h = a.style;
                    h.position = "absolute";
                    h.textDecoration = "none";
                    h.color = this.color;
                    h.fontFamily = this.fontFamily;
                    h.fontSize = "11px";
                    h.opacity = .7;
                    h.display = "block";
                    var k = a.offsetWidth
                      , a = a.offsetHeight
                      , l = 5 + c
                      , m = e + 5;
                    "bottom-left" == b && (l = 5 + c,
                    m = g - a - 3);
                    "bottom-right" == b && (l = d - k - 5,
                    m = g - a - 3);
                    "top-right" == b && (l = d - k - 5,
                    m = e + 5);
                    h.left = l + "px";
                    h.top = m + "px"
                }
            }
        }
    });
    d.Slice = d.Class({
        construct: function() {}
    });
    d.SerialDataItem = d.Class({
        construct: function() {}
    });
    d.GraphDataItem = d.Class({
        construct: function() {}
    });
    d.Guide = d.Class({
        construct: function(a) {
            this.cname = "Guide";
            d.applyTheme(this, a, this.cname)
        }
    });
    d.Title = d.Class({
        construct: function(a) {
            this.cname = "Title";
            d.applyTheme(this, a, this.cname)
        }
    });
    d.Label = d.Class({
        construct: function(a) {
            this.cname = "Label";
            d.applyTheme(this, a, this.cname)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.AmBalloon = d.Class({
        construct: function(a) {
            this.cname = "AmBalloon";
            this.enabled = !0;
            this.fillColor = "#FFFFFF";
            this.fillAlpha = .8;
            this.borderThickness = 2;
            this.borderColor = "#FFFFFF";
            this.borderAlpha = 1;
            this.cornerRadius = 0;
            this.maxWidth = 220;
            this.horizontalPadding = 8;
            this.verticalPadding = 4;
            this.pointerWidth = 6;
            this.pointerOrientation = "V";
            this.color = "#000000";
            this.adjustBorderColor = !0;
            this.show = this.follow = this.showBullet = !1;
            this.bulletSize = 3;
            this.shadowAlpha = .4;
            this.shadowColor = "#000000";
            this.fadeOutDuration = this.animationDuration = .3;
            this.fixedPosition = !0;
            this.offsetY = 6;
            this.offsetX = 1;
            this.textAlign = "center";
            this.disableMouseEvents = !0;
            this.deltaSignX = this.deltaSignY = 1;
            d.isModern || (this.offsetY *= 1.5);
            this.sdy = this.sdx = 0;
            d.applyTheme(this, a, this.cname)
        },
        draw: function() {
            var a = this.pointToX
              , b = this.pointToY;
            d.isModern || (this.drop = !1);
            var c = this.chart;
            d.VML && (this.fadeOutDuration = 0);
            this.xAnim && c.stopAnim(this.xAnim);
            this.yAnim && c.stopAnim(this.yAnim);
            this.sdy = this.sdx = 0;
            if (!isNaN(a)) {
                var e = this.follow
                  , f = c.container
                  , g = this.set;
                d.remove(g);
                this.removeDiv();
                g = f.set();
                g.node.style.pointerEvents = "none";
                this.set = g;
                this.mainSet ? (this.mainSet.push(this.set),
                this.sdx = this.mainSet.x,
                this.sdy = this.mainSet.y) : c.balloonsSet.push(g);
                if (this.show) {
                    var h = this.l
                      , k = this.t
                      , l = this.r
                      , m = this.b
                      , n = this.balloonColor
                      , p = this.fillColor
                      , t = this.borderColor
                      , r = p;
                    void 0 != n && (this.adjustBorderColor ? r = t = n : p = n);
                    var q = this.horizontalPadding
                      , y = this.verticalPadding
                      , B = this.pointerWidth
                      , u = this.pointerOrientation
                      , w = this.cornerRadius
                      , v = c.fontFamily
                      , A = this.fontSize;
                    void 0 == A && (A = c.fontSize);
                    var n = document.createElement("div")
                      , C = c.classNamePrefix;
                    n.className = C + "-balloon-div";
                    this.className && (n.className = n.className + " " + C + "-balloon-div-" + this.className);
                    C = n.style;
                    this.disableMouseEvents && (C.pointerEvents = "none");
                    C.position = "absolute";
                    var x = this.minWidth
                      , z = "";
                    isNaN(x) || (z = "min-width:" + (x - 2 * q) + "px; ");
                    n.innerHTML = '<div style="text-align:' + this.textAlign + "; " + z + "max-width:" + this.maxWidth + "px; font-size:" + A + "px; color:" + this.color + "; font-family:" + v + '">' + this.text + "</div>";
                    c.chartDiv.appendChild(n);
                    this.textDiv = n;
                    var F = n.offsetWidth
                      , E = n.offsetHeight;
                    n.clientHeight && (F = n.clientWidth,
                    E = n.clientHeight);
                    v = E + 2 * y;
                    z = F + 2 * q;
                    !isNaN(x) && z < x && (z = x);
                    window.opera && (v += 2);
                    var H = !1
                      , A = this.offsetY;
                    c.handDrawn && (A += c.handDrawScatter + 2);
                    "H" != u ? (x = a - z / 2,
                    b < k + v + 10 && "down" != u ? (H = !0,
                    e && (b += A),
                    A = b + B,
                    this.deltaSignY = -1) : (e && (b -= A),
                    A = b - v - B,
                    this.deltaSignY = 1)) : (2 * B > v && (B = v / 2),
                    A = b - v / 2,
                    a < h + (l - h) / 2 ? (x = a + B,
                    this.deltaSignX = -1) : (x = a - z - B,
                    this.deltaSignX = 1));
                    A + v >= m && (A = m - v);
                    A < k && (A = k);
                    x < h && (x = h);
                    x + z > l && (x = l - z);
                    var k = A + y, m = x + q, G = this.shadowAlpha, D = this.shadowColor, q = this.borderThickness, K = this.bulletSize, J, y = this.fillAlpha, L = this.borderAlpha;
                    this.showBullet && (J = d.circle(f, K, r, y),
                    g.push(J));
                    this.drop ? (h = z / 1.6,
                    l = 0,
                    "V" == u && (u = "down"),
                    "H" == u && (u = "left"),
                    "down" == u && (x = a + 1,
                    A = b - h - h / 3),
                    "up" == u && (l = 180,
                    x = a + 1,
                    A = b + h + h / 3),
                    "left" == u && (l = 270,
                    x = a + h + h / 3 + 2,
                    A = b),
                    "right" == u && (l = 90,
                    x = a - h - h / 3 + 2,
                    A = b),
                    k = A - E / 2 + 1,
                    m = x - F / 2 - 1,
                    p = d.drop(f, h, l, p, y, q, t, L)) : 0 < w || 0 === B ? (0 < G && (a = d.rect(f, z, v, p, 0, q + 1, D, G, w),
                    d.isModern ? a.translate(1, 1) : a.translate(4, 4),
                    g.push(a)),
                    p = d.rect(f, z, v, p, y, q, t, L, w)) : (r = [],
                    w = [],
                    "H" != u ? (h = a - x,
                    h > z - B && (h = z - B),
                    h < B && (h = B),
                    r = [0, h - B, a - x, h + B, z, z, 0, 0],
                    w = H ? [0, 0, b - A, 0, 0, v, v, 0] : [v, v, b - A, v, v, 0, 0, v]) : (u = b - A,
                    u > v - B && (u = v - B),
                    u < B && (u = B),
                    w = [0, u - B, b - A, u + B, v, v, 0, 0],
                    r = a < h + (l - h) / 2 ? [0, 0, x < a ? 0 : a - x, 0, 0, z, z, 0] : [z, z, x + z > a ? z : a - x, z, z, 0, 0, z]),
                    0 < G && (a = d.polygon(f, r, w, p, 0, q, D, G),
                    a.translate(1, 1),
                    g.push(a)),
                    p = d.polygon(f, r, w, p, y, q, t, L));
                    this.bg = p;
                    g.push(p);
                    p.toFront();
                    d.setCN(c, p, "balloon-bg");
                    this.className && d.setCN(c, p, "balloon-bg-" + this.className);
                    f = 1 * this.deltaSignX;
                    m += this.sdx;
                    k += this.sdy;
                    C.left = m + "px";
                    C.top = k + "px";
                    g.translate(x - f, A, 1, !0);
                    p = p.getBBox();
                    this.bottom = A + v + 1;
                    this.yPos = p.y + A;
                    J && J.translate(this.pointToX - x + f, b - A);
                    b = this.animationDuration;
                    0 < this.animationDuration && !e && !isNaN(this.prevX) && (g.translate(this.prevX, this.prevY, NaN, !0),
                    g.animate({
                        translate: x - f + "," + A
                    }, b, "easeOutSine"),
                    n && (C.left = this.prevTX + "px",
                    C.top = this.prevTY + "px",
                    this.xAnim = c.animate({
                        node: n
                    }, "left", this.prevTX, m, b, "easeOutSine", "px"),
                    this.yAnim = c.animate({
                        node: n
                    }, "top", this.prevTY, k, b, "easeOutSine", "px")));
                    this.prevX = x - f;
                    this.prevY = A;
                    this.prevTX = m;
                    this.prevTY = k
                }
            }
        },
        fixPrevious: function() {
            this.rPrevX = this.prevX;
            this.rPrevY = this.prevY;
            this.rPrevTX = this.prevTX;
            this.rPrevTY = this.prevTY
        },
        restorePrevious: function() {
            this.prevX = this.rPrevX;
            this.prevY = this.rPrevY;
            this.prevTX = this.rPrevTX;
            this.prevTY = this.rPrevTY
        },
        followMouse: function() {
            if (this.follow && this.show) {
                var a = this.chart.mouseX - this.offsetX * this.deltaSignX - this.sdx
                  , b = this.chart.mouseY - this.sdy;
                this.pointToX = a;
                this.pointToY = b;
                if (a != this.previousX || b != this.previousY)
                    if (this.previousX = a,
                    this.previousY = b,
                    0 === this.cornerRadius)
                        this.draw();
                    else {
                        var c = this.set;
                        if (c) {
                            var e = c.getBBox()
                              , a = a - e.width / 2
                              , d = b - e.height - 10;
                            a < this.l && (a = this.l);
                            a > this.r - e.width && (a = this.r - e.width);
                            d < this.t && (d = b + 10);
                            c.translate(a, d);
                            b = this.textDiv.style;
                            b.left = a + this.horizontalPadding + "px";
                            b.top = d + this.verticalPadding + "px"
                        }
                    }
            }
        },
        changeColor: function(a) {
            this.balloonColor = a
        },
        setBounds: function(a, b, c, e) {
            this.l = a;
            this.t = b;
            this.r = c;
            this.b = e;
            this.destroyTO && clearTimeout(this.destroyTO)
        },
        showBalloon: function(a) {
            if (this.text != a || this.positionChanged)
                this.text = a,
                this.isHiding = !1,
                this.show = !0,
                this.destroyTO && clearTimeout(this.destroyTO),
                a = this.chart,
                this.fadeAnim1 && a.stopAnim(this.fadeAnim1),
                this.fadeAnim2 && a.stopAnim(this.fadeAnim2),
                this.draw(),
                this.positionChanged = !1
        },
        hide: function(a) {
            var b = this;
            b.text = void 0;
            isNaN(a) && (a = b.fadeOutDuration);
            var c = b.chart;
            if (0 < a && !b.isHiding) {
                b.isHiding = !0;
                b.destroyTO && clearTimeout(b.destroyTO);
                b.destroyTO = setTimeout(function() {
                    b.destroy.call(b)
                }, 1E3 * a);
                b.follow = !1;
                b.show = !1;
                var e = b.set;
                e && (e.setAttr("opacity", b.fillAlpha),
                b.fadeAnim1 = e.animate({
                    opacity: 0
                }, a, "easeInSine"));
                b.textDiv && (b.fadeAnim2 = c.animate({
                    node: b.textDiv
                }, "opacity", 1, 0, a, "easeInSine", ""))
            } else
                b.show = !1,
                b.follow = !1,
                b.destroy()
        },
        setPosition: function(a, b) {
            if (a != this.pointToX || b != this.pointToY)
                this.previousX = this.pointToX,
                this.previousY = this.pointToY,
                this.pointToX = a,
                this.pointToY = b,
                this.positionChanged = !0
        },
        followCursor: function(a) {
            var b = this;
            b.follow = a;
            clearInterval(b.interval);
            var c = b.chart.mouseX - b.sdx
              , e = b.chart.mouseY - b.sdy;
            !isNaN(c) && a && (b.pointToX = c - b.offsetX * b.deltaSignX,
            b.pointToY = e,
            b.followMouse(),
            b.interval = setInterval(function() {
                b.followMouse.call(b)
            }, 40))
        },
        removeDiv: function() {
            if (this.textDiv) {
                var a = this.textDiv.parentNode;
                a && a.removeChild(this.textDiv)
            }
        },
        destroy: function() {
            clearInterval(this.interval);
            d.remove(this.set);
            this.removeDiv();
            this.set = null
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.circle = function(a, b, c, e, f, g, h, k, l) {
        0 >= b && (b = .001);
        if (void 0 == f || 0 === f)
            f = .01;
        void 0 === g && (g = "#000000");
        void 0 === h && (h = 0);
        e = {
            fill: c,
            stroke: g,
            "fill-opacity": e,
            "stroke-width": f,
            "stroke-opacity": h
        };
        a = isNaN(l) ? a.circle(0, 0, b).attr(e) : a.ellipse(0, 0, b, l).attr(e);
        k && a.gradient("radialGradient", [c, d.adjustLuminosity(c, -.6)]);
        return a
    }
    ;
    d.text = function(a, b, c, e, f, g, h, k) {
        g || (g = "middle");
        "right" == g && (g = "end");
        "left" == g && (g = "start");
        isNaN(k) && (k = 1);
        void 0 !== b && (b = String(b),
        d.isIE && !d.isModern && (b = b.replace("&amp;", "&"),
        b = b.replace("&", "&amp;")));
        c = {
            fill: c,
            "font-family": e,
            "font-size": f + "px",
            opacity: k
        };
        !0 === h && (c["font-weight"] = "bold");
        c["text-anchor"] = g;
        return a.text(b, c)
    }
    ;
    d.polygon = function(a, b, c, e, f, g, h, k, l, m, n) {
        isNaN(g) && (g = .01);
        isNaN(k) && (k = f);
        var p = e
          , t = !1;
        "object" == typeof p && 1 < p.length && (t = !0,
        p = p[0]);
        void 0 === h && (h = p);
        f = {
            fill: p,
            stroke: h,
            "fill-opacity": f,
            "stroke-width": g,
            "stroke-opacity": k
        };
        void 0 !== n && 0 < n && (f["stroke-dasharray"] = n);
        n = d.dx;
        g = d.dy;
        a.handDrawn && (c = d.makeHD(b, c, a.handDrawScatter),
        b = c[0],
        c = c[1]);
        h = Math.round;
        m && (b[r] = d.roundTo(b[r], 5),
        c[r] = d.roundTo(c[r], 5),
        h = Number);
        k = "M" + (h(b[0]) + n) + "," + (h(c[0]) + g);
        for (var r = 1; r < b.length; r++)
            m && (b[r] = d.roundTo(b[r], 5),
            c[r] = d.roundTo(c[r], 5)),
            k += " L" + (h(b[r]) + n) + "," + (h(c[r]) + g);
        a = a.path(k + " Z").attr(f);
        t && a.gradient("linearGradient", e, l);
        return a
    }
    ;
    d.rect = function(a, b, c, e, f, g, h, k, l, m, n) {
        if (isNaN(b) || isNaN(c))
            return a.set();
        isNaN(g) && (g = 0);
        void 0 === l && (l = 0);
        void 0 === m && (m = 270);
        isNaN(f) && (f = 0);
        var p = e
          , t = !1;
        "object" == typeof p && (p = p[0],
        t = !0);
        void 0 === h && (h = p);
        void 0 === k && (k = f);
        b = Math.round(b);
        c = Math.round(c);
        var r = 0
          , q = 0;
        0 > b && (b = Math.abs(b),
        r = -b);
        0 > c && (c = Math.abs(c),
        q = -c);
        r += d.dx;
        q += d.dy;
        f = {
            fill: p,
            stroke: h,
            "fill-opacity": f,
            "stroke-opacity": k
        };
        void 0 !== n && 0 < n && (f["stroke-dasharray"] = n);
        a = a.rect(r, q, b, c, l, g).attr(f);
        t && a.gradient("linearGradient", e, m);
        return a
    }
    ;
    d.bullet = function(a, b, c, e, f, g, h, k, l, m, n, p, t) {
        var r;
        "circle" == b && (b = "round");
        switch (b) {
        case "round":
            r = d.circle(a, c / 2, e, f, g, h, k);
            break;
        case "square":
            r = d.polygon(a, [-c / 2, c / 2, c / 2, -c / 2], [c / 2, c / 2, -c / 2, -c / 2], e, f, g, h, k, m - 180, void 0, t);
            break;
        case "rectangle":
            r = d.polygon(a, [-c, c, c, -c], [c / 2, c / 2, -c / 2, -c / 2], e, f, g, h, k, m - 180, void 0, t);
            break;
        case "diamond":
            r = d.polygon(a, [-c / 2, 0, c / 2, 0], [0, -c / 2, 0, c / 2], e, f, g, h, k);
            break;
        case "triangleUp":
            r = d.triangle(a, c, 0, e, f, g, h, k);
            break;
        case "triangleDown":
            r = d.triangle(a, c, 180, e, f, g, h, k);
            break;
        case "triangleLeft":
            r = d.triangle(a, c, 270, e, f, g, h, k);
            break;
        case "triangleRight":
            r = d.triangle(a, c, 90, e, f, g, h, k);
            break;
        case "bubble":
            r = d.circle(a, c / 2, e, f, g, h, k, !0);
            break;
        case "line":
            r = d.line(a, [-c / 2, c / 2], [0, 0], e, f, g, h, k);
            break;
        case "yError":
            r = a.set();
            r.push(d.line(a, [0, 0], [-c / 2, c / 2], e, f, g));
            r.push(d.line(a, [-l, l], [-c / 2, -c / 2], e, f, g));
            r.push(d.line(a, [-l, l], [c / 2, c / 2], e, f, g));
            break;
        case "xError":
            r = a.set(),
            r.push(d.line(a, [-c / 2, c / 2], [0, 0], e, f, g)),
            r.push(d.line(a, [-c / 2, -c / 2], [-l, l], e, f, g)),
            r.push(d.line(a, [c / 2, c / 2], [-l, l], e, f, g))
        }
        r && r.pattern(n, NaN, p);
        return r
    }
    ;
    d.triangle = function(a, b, c, e, d, g, h, k) {
        if (void 0 === g || 0 === g)
            g = 1;
        void 0 === h && (h = "#000");
        void 0 === k && (k = 0);
        e = {
            fill: e,
            stroke: h,
            "fill-opacity": d,
            "stroke-width": g,
            "stroke-opacity": k
        };
        b /= 2;
        var l;
        0 === c && (l = " M" + -b + "," + b + " L0," + -b + " L" + b + "," + b + " Z");
        180 == c && (l = " M" + -b + "," + -b + " L0," + b + " L" + b + "," + -b + " Z");
        90 == c && (l = " M" + -b + "," + -b + " L" + b + ",0 L" + -b + "," + b + " Z");
        270 == c && (l = " M" + -b + ",0 L" + b + "," + b + " L" + b + "," + -b + " Z");
        return a.path(l).attr(e)
    }
    ;
    d.line = function(a, b, c, e, f, g, h, k, l, m, n) {
        if (a.handDrawn && !n)
            return d.handDrawnLine(a, b, c, e, f, g, h, k, l, m, n);
        g = {
            fill: "none",
            "stroke-width": g
        };
        void 0 !== h && 0 < h && (g["stroke-dasharray"] = h);
        isNaN(f) || (g["stroke-opacity"] = f);
        e && (g.stroke = e);
        e = Math.round;
        m && (e = Number,
        b[0] = d.roundTo(b[0], 5),
        c[0] = d.roundTo(c[0], 5));
        m = d.dx;
        f = d.dy;
        h = "M" + (e(b[0]) + m) + "," + (e(c[0]) + f);
        for (k = 1; k < b.length; k++)
            b[k] = d.roundTo(b[k], 5),
            c[k] = d.roundTo(c[k], 5),
            h += " L" + (e(b[k]) + m) + "," + (e(c[k]) + f);
        if (d.VML)
            return a.path(h, void 0, !0).attr(g);
        l && (h += " M0,0 L0,0");
        return a.path(h).attr(g)
    }
    ;
    d.makeHD = function(a, b, c) {
        for (var e = [], d = [], g = 1; g < a.length; g++)
            for (var h = Number(a[g - 1]), k = Number(b[g - 1]), l = Number(a[g]), m = Number(b[g]), n = Math.round(Math.sqrt(Math.pow(l - h, 2) + Math.pow(m - k, 2)) / 50) + 1, l = (l - h) / n, m = (m - k) / n, p = 0; p <= n; p++) {
                var t = k + p * m + Math.random() * c;
                e.push(h + p * l + Math.random() * c);
                d.push(t)
            }
        return [e, d]
    }
    ;
    d.handDrawnLine = function(a, b, c, e, f, g, h, k, l, m) {
        var n, p = a.set();
        for (n = 1; n < b.length; n++)
            for (var t = [b[n - 1], b[n]], r = [c[n - 1], c[n]], r = d.makeHD(t, r, a.handDrawScatter), t = r[0], r = r[1], q = 1; q < t.length; q++)
                p.push(d.line(a, [t[q - 1], t[q]], [r[q - 1], r[q]], e, f, g + Math.random() * a.handDrawThickness - a.handDrawThickness / 2, h, k, l, m, !0));
        return p
    }
    ;
    d.doNothing = function(a) {
        return a
    }
    ;
    d.drop = function(a, b, c, e, d, g, h, k) {
        var l = 1 / 180 * Math.PI
          , m = c - 20
          , n = Math.sin(m * l) * b
          , p = Math.cos(m * l) * b
          , t = Math.sin((m + 40) * l) * b
          , r = Math.cos((m + 40) * l) * b
          , q = .8 * b
          , y = -b / 3
          , B = b / 3;
        0 === c && (y = -y,
        B = 0);
        180 == c && (B = 0);
        90 == c && (y = 0);
        270 == c && (y = 0,
        B = -B);
        c = {
            fill: e,
            stroke: h,
            "stroke-width": g,
            "stroke-opacity": k,
            "fill-opacity": d
        };
        b = "M" + n + "," + p + " A" + b + "," + b + ",0,1,1," + t + "," + r + (" A" + q + "," + q + ",0,0,0," + (Math.sin((m + 20) * l) * b + B) + "," + (Math.cos((m + 20) * l) * b + y));
        b += " A" + q + "," + q + ",0,0,0," + n + "," + p;
        return a.path(b, void 0, void 0, "1000,1000").attr(c)
    }
    ;
    d.wedge = function(a, b, c, e, f, g, h, k, l, m, n, p, t, r) {
        var q = Math.round;
        g = q(g);
        h = q(h);
        k = q(k);
        var y = q(h / g * k)
          , B = d.VML
          , u = 359.5 + g / 100;
        359.94 < u && (u = 359.94);
        f >= u && (f = u);
        var w = 1 / 180 * Math.PI
          , u = b + Math.sin(e * w) * k
          , v = c - Math.cos(e * w) * y
          , A = b + Math.sin(e * w) * g
          , C = c - Math.cos(e * w) * h
          , x = b + Math.sin((e + f) * w) * g
          , z = c - Math.cos((e + f) * w) * h
          , F = b + Math.sin((e + f) * w) * k
          , w = c - Math.cos((e + f) * w) * y
          , E = {
            fill: d.adjustLuminosity(m.fill, -.2),
            "stroke-opacity": 0,
            "fill-opacity": m["fill-opacity"]
        }
          , H = 0;
        180 < Math.abs(f) && (H = 1);
        e = a.set();
        var G;
        B && (u = q(10 * u),
        A = q(10 * A),
        x = q(10 * x),
        F = q(10 * F),
        v = q(10 * v),
        C = q(10 * C),
        z = q(10 * z),
        w = q(10 * w),
        b = q(10 * b),
        l = q(10 * l),
        c = q(10 * c),
        g *= 10,
        h *= 10,
        k *= 10,
        y *= 10,
        1 > Math.abs(f) && 1 >= Math.abs(x - A) && 1 >= Math.abs(z - C) && (G = !0));
        f = "";
        var D;
        p && (E["fill-opacity"] = 0,
        E["stroke-opacity"] = m["stroke-opacity"] / 2,
        E.stroke = m.stroke);
        if (0 < l) {
            D = " M" + u + "," + (v + l) + " L" + A + "," + (C + l);
            B ? (G || (D += " A" + (b - g) + "," + (l + c - h) + "," + (b + g) + "," + (l + c + h) + "," + A + "," + (C + l) + "," + x + "," + (z + l)),
            D += " L" + F + "," + (w + l),
            0 < k && (G || (D += " B" + (b - k) + "," + (l + c - y) + "," + (b + k) + "," + (l + c + y) + "," + F + "," + (l + w) + "," + u + "," + (l + v)))) : (D += " A" + g + "," + h + ",0," + H + ",1," + x + "," + (z + l) + " L" + F + "," + (w + l),
            0 < k && (D += " A" + k + "," + y + ",0," + H + ",0," + u + "," + (v + l)));
            D += " Z";
            var K = l;
            B && (K /= 10);
            for (var J = 0; J < K; J += 10) {
                var L = a.path(D, void 0, void 0, "1000,1000").attr(E);
                e.push(L);
                L.translate(0, -J)
            }
            D = a.path(" M" + u + "," + v + " L" + u + "," + (v + l) + " L" + A + "," + (C + l) + " L" + A + "," + C + " L" + u + "," + v + " Z", void 0, void 0, "1000,1000").attr(E);
            l = a.path(" M" + x + "," + z + " L" + x + "," + (z + l) + " L" + F + "," + (w + l) + " L" + F + "," + w + " L" + x + "," + z + " Z", void 0, void 0, "1000,1000").attr(E);
            e.push(D);
            e.push(l)
        }
        B ? (G || (f = " A" + q(b - g) + "," + q(c - h) + "," + q(b + g) + "," + q(c + h) + "," + q(A) + "," + q(C) + "," + q(x) + "," + q(z)),
        h = " M" + q(u) + "," + q(v) + " L" + q(A) + "," + q(C) + f + " L" + q(F) + "," + q(w)) : h = " M" + u + "," + v + " L" + A + "," + C + (" A" + g + "," + h + ",0," + H + ",1," + x + "," + z) + " L" + F + "," + w;
        0 < k && (B ? G || (h += " B" + (b - k) + "," + (c - y) + "," + (b + k) + "," + (c + y) + "," + F + "," + w + "," + u + "," + v) : h += " A" + k + "," + y + ",0," + H + ",0," + u + "," + v);
        a.handDrawn && (k = d.line(a, [u, A], [v, C], m.stroke, m.thickness * Math.random() * a.handDrawThickness, m["stroke-opacity"]),
        e.push(k));
        a = a.path(h + " Z", void 0, void 0, "1000,1000").attr(m);
        if (n) {
            k = [];
            for (y = 0; y < n.length; y++)
                k.push(d.adjustLuminosity(m.fill, n[y]));
            "radial" != r || d.isModern || (k = []);
            0 < k.length && a.gradient(r + "Gradient", k)
        }
        d.isModern && "radial" == r && a.grad && (a.grad.setAttribute("gradientUnits", "userSpaceOnUse"),
        a.grad.setAttribute("r", g),
        a.grad.setAttribute("cx", b),
        a.grad.setAttribute("cy", c));
        a.pattern(p, NaN, t);
        e.wedge = a;
        e.push(a);
        return e
    }
    ;
    d.rgb2hex = function(a) {
        return (a = a.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)) && 4 === a.length ? "#" + ("0" + parseInt(a[1], 10).toString(16)).slice(-2) + ("0" + parseInt(a[2], 10).toString(16)).slice(-2) + ("0" + parseInt(a[3], 10).toString(16)).slice(-2) : ""
    }
    ;
    d.adjustLuminosity = function(a, b) {
        a && -1 != a.indexOf("rgb") && (a = d.rgb2hex(a));
        a = String(a).replace(/[^0-9a-f]/gi, "");
        6 > a.length && (a = String(a[0]) + String(a[0]) + String(a[1]) + String(a[1]) + String(a[2]) + String(a[2]));
        b = b || 0;
        var c = "#", e, f;
        for (f = 0; 3 > f; f++)
            e = parseInt(a.substr(2 * f, 2), 16),
            e = Math.round(Math.min(Math.max(0, e + e * b), 255)).toString(16),
            c += ("00" + e).substr(e.length);
        return c
    }
})();
(function() {
    var d = window.AmCharts;
    d.AmLegend = d.Class({
        construct: function(a) {
            this.enabled = !0;
            this.cname = "AmLegend";
            this.createEvents("rollOverMarker", "rollOverItem", "rollOutMarker", "rollOutItem", "showItem", "hideItem", "clickMarker", "clickLabel");
            this.position = "bottom";
            this.borderColor = this.color = "#000000";
            this.borderAlpha = 0;
            this.markerLabelGap = 5;
            this.verticalGap = 10;
            this.align = "left";
            this.horizontalGap = 0;
            this.spacing = 10;
            this.markerDisabledColor = "#AAB3B3";
            this.markerType = "square";
            this.markerSize = 16;
            this.markerBorderThickness = this.markerBorderAlpha = 1;
            this.marginBottom = this.marginTop = 0;
            this.marginLeft = this.marginRight = 20;
            this.autoMargins = !0;
            this.valueWidth = 50;
            this.switchable = !0;
            this.switchType = "x";
            this.switchColor = "#FFFFFF";
            this.rollOverColor = "#CC0000";
            this.reversedOrder = !1;
            this.labelText = "[[title]]";
            this.valueText = "[[value]]";
            this.accessibleLabel = "[[title]]";
            this.useMarkerColorForLabels = !1;
            this.rollOverGraphAlpha = 1;
            this.textClickEnabled = !1;
            this.equalWidths = !0;
            this.backgroundColor = "#FFFFFF";
            this.backgroundAlpha = 0;
            this.useGraphSettings = !1;
            this.showEntries = !0;
            this.labelDx = 0;
            d.applyTheme(this, a, this.cname)
        },
        setData: function(a) {
            this.legendData = a;
            this.invalidateSize()
        },
        invalidateSize: function() {
            this.destroy();
            this.entries = [];
            this.valueLabels = [];
            var a = this.legendData;
            this.enabled && (d.ifArray(a) || d.ifArray(this.data)) && this.drawLegend()
        },
        drawLegend: function() {
            var a = this.chart
              , b = this.position
              , c = this.width
              , e = a.divRealWidth
              , f = a.divRealHeight
              , g = this.div
              , h = this.legendData;
            this.data && (h = this.combineLegend ? this.legendData.concat(this.data) : this.data);
            isNaN(this.fontSize) && (this.fontSize = a.fontSize);
            this.maxColumnsReal = this.maxColumns;
            if ("right" == b || "left" == b)
                this.maxColumnsReal = 1,
                this.autoMargins && (this.marginLeft = this.marginRight = 10);
            else if (this.autoMargins) {
                this.marginRight = a.marginRight;
                this.marginLeft = a.marginLeft;
                var k = a.autoMarginOffset;
                "bottom" == b ? (this.marginBottom = k,
                this.marginTop = 0) : (this.marginTop = k,
                this.marginBottom = 0)
            }
            c = void 0 !== c ? d.toCoordinate(c, e) : "right" != b && "left" != b ? a.realWidth : 0 < this.ieW ? this.ieW : a.realWidth;
            "outside" == b ? (c = g.offsetWidth,
            f = g.offsetHeight,
            g.clientHeight && (c = g.clientWidth,
            f = g.clientHeight)) : (isNaN(c) || (g.style.width = c + "px"),
            g.className = "amChartsLegend " + a.classNamePrefix + "-legend-div");
            this.divWidth = c;
            (b = this.container) ? (b.container.innerHTML = "",
            g.appendChild(b.container),
            b.width = c,
            b.height = f,
            b.setSize(c, f),
            b.addDefs(a)) : b = new d.AmDraw(g,c,f,a);
            this.container = b;
            this.lx = 0;
            this.ly = 8;
            f = this.markerSize;
            f > this.fontSize && (this.ly = f / 2 - 1);
            0 < f && (this.lx += f + this.markerLabelGap);
            this.titleWidth = 0;
            if (f = this.title)
                f = d.text(this.container, f, this.color, a.fontFamily, this.fontSize, "start", !0),
                d.setCN(a, f, "legend-title"),
                f.translate(this.marginLeft, this.marginTop + this.verticalGap + this.ly + 1),
                a = f.getBBox(),
                this.titleWidth = a.width + 15,
                this.titleHeight = a.height + 6;
            this.index = this.maxLabelWidth = 0;
            if (this.showEntries) {
                for (a = 0; a < h.length; a++)
                    this.createEntry(h[a]);
                for (a = this.index = 0; a < h.length; a++)
                    this.createValue(h[a])
            }
            this.arrangeEntries();
            this.updateValues()
        },
        arrangeEntries: function() {
            var a = this.position
              , b = this.marginLeft + this.titleWidth
              , c = this.marginRight
              , e = this.marginTop
              , f = this.marginBottom
              , g = this.horizontalGap
              , h = this.div
              , k = this.divWidth
              , l = this.maxColumnsReal
              , m = this.verticalGap
              , n = this.spacing
              , p = k - c - b
              , t = 0
              , r = 0
              , q = this.container;
            this.set && this.set.remove();
            var y = q.set();
            this.set = y;
            var B = q.set();
            y.push(B);
            var u = this.entries, w, v;
            for (v = 0; v < u.length; v++) {
                w = u[v].getBBox();
                var A = w.width;
                A > t && (t = A);
                w = w.height;
                w > r && (r = w)
            }
            var A = r = 0
              , C = g
              , x = 0
              , z = 0;
            for (v = 0; v < u.length; v++) {
                var F = u[v];
                this.reversedOrder && (F = u[u.length - v - 1]);
                w = F.getBBox();
                var E;
                this.equalWidths ? E = A * (t + n + this.markerLabelGap) : (E = C,
                C = C + w.width + g + n);
                E + w.width > p && 0 < v && 0 !== A && (r++,
                E = A = 0,
                C = E + w.width + g + n,
                x = x + z + m,
                z = 0);
                w.height > z && (z = w.height);
                F.translate(E, x);
                A++;
                !isNaN(l) && A >= l && (A = 0,
                r++,
                x = x + z + m,
                C = g,
                z = 0);
                B.push(F)
            }
            w = B.getBBox();
            l = w.height + 2 * m - 1;
            "left" == a || "right" == a ? (n = w.width + 2 * g,
            k = n + b + c,
            h.style.width = k + "px",
            this.ieW = k) : n = k - b - c - 1;
            c = d.polygon(this.container, [0, n, n, 0], [0, 0, l, l], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
            d.setCN(this.chart, c, "legend-bg");
            y.push(c);
            y.translate(b, e);
            c.toBack();
            b = g;
            if ("top" == a || "bottom" == a || "absolute" == a || "outside" == a)
                "center" == this.align ? b = g + (n - w.width) / 2 : "right" == this.align && (b = g + n - w.width);
            B.translate(b, m + 1);
            this.titleHeight > l && (l = this.titleHeight);
            e = l + e + f + 1;
            0 > e && (e = 0);
            "absolute" != a && "outside" != a && e > this.chart.divRealHeight && (h.style.top = "0px");
            h.style.height = Math.round(e) + "px";
            q.setSize(this.divWidth, e)
        },
        createEntry: function(a) {
            if (!1 !== a.visibleInLegend && !a.hideFromLegend) {
                var b = this
                  , c = b.chart
                  , e = b.useGraphSettings
                  , f = a.markerType;
                f && (e = !1);
                a.legendEntryWidth = b.markerSize;
                f || (f = b.markerType);
                var g = a.color
                  , h = a.alpha;
                a.legendKeyColor && (g = a.legendKeyColor());
                a.legendKeyAlpha && (h = a.legendKeyAlpha());
                var k;
                !0 === a.hidden && (k = g = b.markerDisabledColor);
                var l = a.pattern, m, n = a.customMarker;
                n || (n = b.customMarker);
                var p = b.container
                  , t = b.markerSize
                  , r = 0
                  , q = 0
                  , y = t / 2;
                if (e) {
                    e = a.type;
                    b.switchType = void 0;
                    if ("line" == e || "step" == e || "smoothedLine" == e || "ohlc" == e)
                        m = p.set(),
                        a.hidden || (g = a.lineColorR,
                        k = a.bulletBorderColorR),
                        r = d.line(p, [0, 2 * t], [t / 2, t / 2], g, a.lineAlpha, a.lineThickness, a.dashLength),
                        d.setCN(c, r, "graph-stroke"),
                        m.push(r),
                        a.bullet && (a.hidden || (g = a.bulletColorR),
                        r = d.bullet(p, a.bullet, a.bulletSize, g, a.bulletAlpha, a.bulletBorderThickness, k, a.bulletBorderAlpha)) && (d.setCN(c, r, "graph-bullet"),
                        r.translate(t + 1, t / 2),
                        m.push(r)),
                        y = 0,
                        r = t,
                        q = t / 3;
                    else {
                        a.getGradRotation && (m = a.getGradRotation(),
                        0 === m && (m = 180));
                        r = a.fillColorsR;
                        !0 === a.hidden && (r = g);
                        if (m = b.createMarker("rectangle", r, a.fillAlphas, a.lineThickness, g, a.lineAlpha, m, l, a.dashLength))
                            y = t,
                            m.translate(y, t / 2);
                        r = t
                    }
                    d.setCN(c, m, "graph-" + e);
                    d.setCN(c, m, "graph-" + a.id)
                } else if (n)
                    m = p.image(n, 0, 0, t, t);
                else {
                    var B;
                    isNaN(b.gradientRotation) || (B = 180 + b.gradientRotation);
                    (m = b.createMarker(f, g, h, void 0, void 0, void 0, B, l)) && m.translate(t / 2, t / 2)
                }
                d.setCN(c, m, "legend-marker");
                b.addListeners(m, a);
                p = p.set([m]);
                b.switchable && a.switchable && p.setAttr("cursor", "pointer");
                void 0 !== a.id && d.setCN(c, p, "legend-item-" + a.id);
                d.setCN(c, p, a.className, !0);
                k = b.switchType;
                var u;
                k && "none" != k && 0 < t && ("x" == k ? (u = b.createX(),
                u.translate(t / 2, t / 2)) : u = b.createV(),
                u.dItem = a,
                !0 !== a.hidden ? "x" == k ? u.hide() : u.show() : "x" != k && u.hide(),
                b.switchable || u.hide(),
                b.addListeners(u, a),
                a.legendSwitch = u,
                p.push(u),
                d.setCN(c, u, "legend-switch"));
                k = b.color;
                a.showBalloon && b.textClickEnabled && void 0 !== b.selectedColor && (k = b.selectedColor);
                b.useMarkerColorForLabels && !l && (k = g);
                !0 === a.hidden && (k = b.markerDisabledColor);
                g = d.massReplace(b.labelText, {
                    "[[title]]": a.title
                });
                void 0 !== b.tabIndex && (p.setAttr("tabindex", b.tabIndex),
                p.setAttr("role", "menuitem"),
                p.keyup(function(c) {
                    13 == c.keyCode && b.clickMarker(a, c)
                }));
                c.accessible && b.accessibleLabel && (l = d.massReplace(b.accessibleLabel, {
                    "[[title]]": a.title
                }),
                c.makeAccessible(p, l));
                l = b.fontSize;
                m && (t <= l && (t = t / 2 + b.ly - l / 2 + (l + 2 - t) / 2 - q,
                m.translate(y, t),
                u && u.translate(u.x, t)),
                a.legendEntryWidth = m.getBBox().width);
                var w;
                g && (g = d.fixBrakes(g),
                a.legendTextReal = g,
                w = b.labelWidth,
                w = isNaN(w) ? d.text(b.container, g, k, c.fontFamily, l, "start") : d.wrappedText(b.container, g, k, c.fontFamily, l, "start", !1, w, 0),
                d.setCN(c, w, "legend-label"),
                w.translate(b.lx + r, b.ly),
                p.push(w),
                b.labelDx = r,
                c = w.getBBox().width,
                b.maxLabelWidth < c && (b.maxLabelWidth = c));
                b.entries[b.index] = p;
                a.legendEntry = b.entries[b.index];
                a.legendMarker = m;
                a.legendLabel = w;
                b.index++
            }
        },
        addListeners: function(a, b) {
            var c = this;
            a && a.mouseover(function(a) {
                c.rollOverMarker(b, a)
            }).mouseout(function(a) {
                c.rollOutMarker(b, a)
            }).click(function(a) {
                c.clickMarker(b, a)
            })
        },
        rollOverMarker: function(a, b) {
            this.switchable && this.dispatch("rollOverMarker", a, b);
            this.dispatch("rollOverItem", a, b)
        },
        rollOutMarker: function(a, b) {
            this.switchable && this.dispatch("rollOutMarker", a, b);
            this.dispatch("rollOutItem", a, b)
        },
        clickMarker: function(a, b) {
            this.switchable && (!0 === a.hidden ? this.dispatch("showItem", a, b) : this.dispatch("hideItem", a, b));
            this.dispatch("clickMarker", a, b)
        },
        rollOverLabel: function(a, b) {
            a.hidden || this.textClickEnabled && a.legendLabel && a.legendLabel.attr({
                fill: this.rollOverColor
            });
            this.dispatch("rollOverItem", a, b)
        },
        rollOutLabel: function(a, b) {
            if (!a.hidden && this.textClickEnabled && a.legendLabel) {
                var c = this.color;
                void 0 !== this.selectedColor && a.showBalloon && (c = this.selectedColor);
                this.useMarkerColorForLabels && (c = a.lineColor,
                void 0 === c && (c = a.color));
                a.legendLabel.attr({
                    fill: c
                })
            }
            this.dispatch("rollOutItem", a, b)
        },
        clickLabel: function(a, b) {
            this.textClickEnabled ? a.hidden || this.dispatch("clickLabel", a, b) : this.switchable && (!0 === a.hidden ? this.dispatch("showItem", a, b) : this.dispatch("hideItem", a, b))
        },
        dispatch: function(a, b, c) {
            a = {
                type: a,
                dataItem: b,
                target: this,
                event: c,
                chart: this.chart
            };
            this.chart && this.chart.handleLegendEvent(a);
            this.fire(a)
        },
        createValue: function(a) {
            var b = this
              , c = b.fontSize
              , e = b.chart;
            if (!1 !== a.visibleInLegend && !a.hideFromLegend) {
                var f = b.maxLabelWidth;
                b.forceWidth && (f = b.labelWidth);
                b.equalWidths || (b.valueAlign = "left");
                "left" == b.valueAlign && a.legendLabel && (f = a.legendLabel.getBBox().width);
                var g = f;
                if (b.valueText && 0 < b.valueWidth) {
                    var h = b.color;
                    b.useMarkerColorForValues && (h = a.color,
                    a.legendKeyColor && (h = a.legendKeyColor()));
                    !0 === a.hidden && (h = b.markerDisabledColor);
                    var k = b.valueText
                      , f = f + b.lx + b.labelDx + b.markerLabelGap + b.valueWidth
                      , l = "end";
                    "left" == b.valueAlign && (f -= b.valueWidth,
                    l = "start");
                    h = d.text(b.container, k, h, b.chart.fontFamily, c, l);
                    d.setCN(e, h, "legend-value");
                    h.translate(f, b.ly);
                    b.entries[b.index].push(h);
                    g += b.valueWidth + 2 * b.markerLabelGap;
                    h.dItem = a;
                    b.valueLabels.push(h)
                }
                b.index++;
                e = b.markerSize;
                e < c + 7 && (e = c + 7,
                d.VML && (e += 3));
                c = b.container.rect(a.legendEntryWidth, 0, g, e, 0, 0).attr({
                    stroke: "none",
                    fill: "#fff",
                    "fill-opacity": .005
                });
                c.dItem = a;
                b.entries[b.index - 1].push(c);
                c.mouseover(function(c) {
                    b.rollOverLabel(a, c)
                }).mouseout(function(c) {
                    b.rollOutLabel(a, c)
                }).click(function(c) {
                    b.clickLabel(a, c)
                })
            }
        },
        createV: function() {
            var a = this.markerSize;
            return d.polygon(this.container, [a / 5, a / 2, a - a / 5, a / 2], [a / 3, a - a / 5, a / 5, a / 1.7], this.switchColor)
        },
        createX: function() {
            var a = (this.markerSize - 4) / 2
              , b = {
                stroke: this.switchColor,
                "stroke-width": 3
            }
              , c = this.container
              , e = d.line(c, [-a, a], [-a, a]).attr(b)
              , a = d.line(c, [-a, a], [a, -a]).attr(b);
            return this.container.set([e, a])
        },
        createMarker: function(a, b, c, e, f, g, h, k, l) {
            var m = this.markerSize
              , n = this.container;
            f || (f = this.markerBorderColor);
            f || (f = b);
            isNaN(e) && (e = this.markerBorderThickness);
            isNaN(g) && (g = this.markerBorderAlpha);
            return d.bullet(n, a, m, b, c, e, f, g, m, h, k, this.chart.path, l)
        },
        validateNow: function() {
            this.invalidateSize()
        },
        updateValues: function() {
            var a = this.valueLabels, b = this.chart, c, e = this.data;
            if (a)
                for (c = 0; c < a.length; c++) {
                    var f = a[c]
                      , g = f.dItem;
                    g.periodDataItem = void 0;
                    g.periodPercentDataItem = void 0;
                    var h = " ";
                    if (e)
                        g.value ? f.text(g.value) : f.text("");
                    else {
                        var k = null;
                        if (void 0 !== g.type) {
                            var k = g.currentDataItem
                              , l = this.periodValueText;
                            g.legendPeriodValueText && (l = g.legendPeriodValueText);
                            g.legendPeriodValueTextR && (l = g.legendPeriodValueTextR);
                            k ? (h = this.valueText,
                            g.legendValueText && (h = g.legendValueText),
                            h = b.formatString(h, k)) : l && b.formatPeriodString && (l = d.massReplace(l, {
                                "[[title]]": g.title
                            }),
                            h = b.formatPeriodString(l, g))
                        } else
                            h = b.formatString(this.valueText, g);
                        l = g;
                        k && (l = k);
                        var m = this.valueFunction;
                        m && (h = m(l, h, b.periodDataItem));
                        var n;
                        this.useMarkerColorForLabels && !k && g.lastDataItem && (k = g.lastDataItem);
                        k ? n = b.getBalloonColor(g, k) : g.legendKeyColor && (n = g.legendKeyColor());
                        g.legendColorFunction && (n = g.legendColorFunction(l, h, g.periodDataItem, g.periodPercentDataItem));
                        f.text(h);
                        if (!g.pattern && (this.useMarkerColorForValues && f.setAttr("fill", n),
                        this.useMarkerColorForLabels)) {
                            if (f = g.legendMarker)
                                f.setAttr("fill", n),
                                f.setAttr("stroke", n);
                            (g = g.legendLabel) && g.setAttr("fill", n)
                        }
                    }
                }
        },
        renderFix: function() {
            if (!d.VML && this.enabled) {
                var a = this.container;
                a && a.renderFix()
            }
        },
        destroy: function() {
            this.div.innerHTML = "";
            d.remove(this.set)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.AmMap = d.Class({
        inherits: d.AmChart,
        construct: function(a) {
            this.cname = "AmMap";
            this.type = "map";
            this.theme = a;
            this.svgNotSupported = "This browser doesn't support SVG. Use Chrome, Firefox, Internet Explorer 9 or later.";
            this.createEvents("rollOverMapObject", "rollOutMapObject", "clickMapObject", "mouseDownMapObject", "selectedObjectChanged", "homeButtonClicked", "zoomCompleted", "dragCompleted", "positionChanged", "writeDevInfo", "click", "descriptionClosed");
            this.zoomDuration = .6;
            this.zoomControl = new d.ZoomControl(a);
            this.fitMapToContainer = !0;
            this.mouseWheelZoomEnabled = this.backgroundZoomsToTop = !1;
            this.allowClickOnSelectedObject = this.useHandCursorOnClickableOjects = this.showBalloonOnSelectedObject = !0;
            this.showObjectsAfterZoom = this.wheelBusy = !1;
            this.zoomOnDoubleClick = this.useObjectColorForBalloon = !0;
            this.allowMultipleDescriptionWindows = !1;
            this.dragMap = this.centerMap = this.linesAboveImages = !0;
            this.colorSteps = 5;
            this.forceNormalize = !1;
            this.showAreasInList = !0;
            this.showLinesInList = this.showImagesInList = !1;
            this.areasProcessor = new d.AreasProcessor(this);
            this.areasSettings = new d.AreasSettings(a);
            this.imagesProcessor = new d.ImagesProcessor(this);
            this.imagesSettings = new d.ImagesSettings(a);
            this.linesProcessor = new d.LinesProcessor(this);
            this.linesSettings = new d.LinesSettings(a);
            this.initialTouchZoom = 1;
            this.showDescriptionOnHover = !1;
            d.AmMap.base.construct.call(this, a);
            this.creditsPosition = "bottom-left";
            this.product = "ammap";
            this.areasClasses = {};
            this.updatableImages = [];
            d.applyTheme(this, a, this.cname)
        },
        initChart: function() {
            this.zoomInstantly = !0;
            var a = this.container;
            this.panRequired = !0;
            if (this.sizeChanged && d.hasSVG && this.chartCreated) {
                this.updatableImages = [];
                this.freeLabelsSet && this.freeLabelsSet.remove();
                this.freeLabelsSet = a.set();
                this.container.setSize(this.realWidth, this.realHeight);
                this.resizeMap();
                this.drawBackground();
                this.redrawLabels();
                this.drawTitles();
                this.processObjects(!0);
                this.rescaleObjects();
                this.zoomControl.init(this, a);
                this.drawBg();
                var b = this.smallMap;
                b && b.init(this, a);
                (b = this.valueLegend) && b.init(this, a);
                this.sizeChanged = !1;
                this.zoomToLongLat(this.zLevelTemp, this.zLongTemp, this.zLatTemp, !0);
                this.previousWidth = this.realWidth;
                this.previousHeight = this.realHeight;
                this.updateSmallMap();
                this.linkSet.toFront();
                this.zoomControl.update && this.zoomControl.update()
            } else
                (d.AmMap.base.initChart.call(this),
                d.hasSVG) ? (this.dataChanged && (this.parseData(),
                this.dispatchDataUpdated = !0,
                this.dataChanged = !1,
                a = this.legend) && (a.position = "absolute",
                a.invalidateSize()),
                this.createDescriptionsDiv(),
                this.svgAreas = [],
                this.svgAreasById = {},
                this.drawChart()) : (this.chartDiv.style.textAlign = "",
                this.chartDiv.setAttribute("class", "ammapAlert"),
                this.chartDiv.innerHTML = this.svgNotSupported,
                this.fire({
                    type: "failed",
                    chart: this
                }))
        },
        storeTemp: function() {
            if (d.hasSVG && 0 < this.realWidth && 0 < this.realHeight) {
                var a = this.mapContainer.getBBox();
                0 < a.width && 0 < a.height && (a = this.zoomLongitude(),
                isNaN(a) || (this.zLongTemp = a),
                a = this.zoomLatitude(),
                isNaN(a) || (this.zLatTemp = a),
                a = this.zoomLevel(),
                isNaN(a) || (this.zLevelTemp = a))
            }
        },
        invalidateSize: function() {
            this.storeTemp();
            d.AmMap.base.invalidateSize.call(this)
        },
        validateSize: function() {
            this.storeTemp();
            d.AmMap.base.validateSize.call(this)
        },
        handleWheelReal: function(a) {
            if (!this.wheelBusy) {
                this.stopAnimation();
                var b = this.zoomLevel()
                  , c = this.zoomControl
                  , e = c.zoomFactor;
                this.wheelBusy = !0;
                a = d.fitToBounds(0 < a ? b * e : b / e, c.minZoomLevel, c.maxZoomLevel);
                e = this.mouseX / this.mapWidth;
                c = this.mouseY / this.mapHeight;
                e = (this.zoomX() - e) * (a / b) + e;
                b = (this.zoomY() - c) * (a / b) + c;
                this.zoomTo(a, e, b)
            }
        },
        addLegend: function(a, b) {
            a.position = "absolute";
            a.autoMargins = !1;
            a.valueWidth = 0;
            a.switchable = !1;
            d.AmMap.base.addLegend.call(this, a, b);
            void 0 === a.enabled && (a.enabled = !0);
            return a
        },
        handleLegendEvent: function() {},
        createDescriptionsDiv: function() {
            if (!this.descriptionsDiv) {
                var a = document.createElement("div")
                  , b = a.style;
                b.position = "absolute";
                b.left = "0px";
                b.top = "0px";
                this.descriptionsDiv = a
            }
            this.containerDiv.appendChild(this.descriptionsDiv)
        },
        drawChart: function() {
            d.AmMap.base.drawChart.call(this);
            var a = this.dataProvider;
            this.dataProvider = a = d.extend(a, new d.MapData, !0);
            this.areasSettings = d.processObject(this.areasSettings, d.AreasSettings, this.theme);
            this.imagesSettings = d.processObject(this.imagesSettings, d.ImagesSettings, this.theme);
            this.linesSettings = d.processObject(this.linesSettings, d.LinesSettings, this.theme);
            var b = this.container;
            this.mapContainer && this.mapContainer.remove();
            this.mapContainer = b.set();
            this.graphsSet.push(this.mapContainer);
            var c;
            a.map && (c = d.maps[a.map]);
            a.mapVar && (c = a.mapVar);
            c ? (this.svgData = c.svg,
            this.getBounds(),
            this.buildEverything()) : (a = a.mapURL) && this.loadXml(a);
            this.balloonsSet.toFront()
        },
        drawBg: function() {
            var a = this;
            a.background.click(function() {
                a.handleBackgroundClick()
            });
            a.background.mouseover(function() {
                a.rollOutMapObject(a.previouslyHovered)
            })
        },
        buildEverything: function() {
            if (0 < this.realWidth && 0 < this.realHeight) {
                var a = this.container
                  , b = this.dataProvider;
                this.projection || (this.projection = b.projection,
                this.projection || (this.projection = "equirectangular"));
                this.updatableImages = [];
                var c = this.projection;
                c && (this.projectionFunction = d[c]);
                this.projectionFunction || (this.projectionFunction = d.equirectangular);
                this.dpProjectionFunction = d[b.projection];
                this.dpProjectionFunction || (this.dpProjectionFunction = d.equirectangular);
                this.zoomControl = d.processObject(this.zoomControl, d.ZoomControl, this.theme);
                this.zoomControl.init(this, a);
                this.drawBg();
                this.buildSVGMap();
                this.projectionFunction && c != b.projection || this.forceNormalize ? (this.normalizeMap(),
                this.changeProjection()) : this.fixMapPosition();
                if (c = this.smallMap)
                    c = d.processObject(c, d.SmallMap, this.theme),
                    c.init(this, a),
                    this.smallMap = c;
                isNaN(b.zoomX) && isNaN(b.zoomY) && isNaN(b.zoomLatitude) && isNaN(b.zoomLongitude) && (this.centerMap ? (c = this.xyToCoordinates(this.mapWidth / 2, this.mapHeight / 2),
                b.zoomLongitudeC = c.longitude,
                b.zoomLatitudeC = c.latitude) : (b.zoomX = 0,
                b.zoomY = 0),
                this.zoomInstantly = !0);
                this.selectObject(this.dataProvider);
                this.processAreas();
                if (b = this.valueLegend)
                    this.valueLegend = b = d.processObject(b, d.ValueLegend, this.theme),
                    b.init(this, a);
                this.objectList && (a = this.objectList = d.processObject(this.objectList, d.ObjectList)) && (this.clearObjectList(),
                a.init(this));
                this.dispDUpd();
                this.updateSmallMap();
                this.linkSet.toFront()
            } else
                this.cleanChart()
        },
        hideGroup: function(a) {
            this.showHideGroup(a, !1)
        },
        showGroup: function(a) {
            this.showHideGroup(a, !0)
        },
        showHideGroup: function(a, b) {
            this.showHideReal(this.imagesProcessor.allObjects, a, b);
            this.showHideReal(this.areasProcessor.allObjects, a, b);
            this.showHideReal(this.linesProcessor.allObjects, a, b)
        },
        showHideReal: function(a, b, c) {
            var e;
            for (e = 0; e < a.length; e++) {
                var d = a[e];
                if (d.groupId == b) {
                    var g = d.displayObject;
                    g && (c ? (d.hidden = !1,
                    g.show()) : (d.hidden = !0,
                    g.hide()))
                }
            }
        },
        makeObjectAccessible: function(a) {
            if (a.accessibleLabel) {
                var b = this.formatString(a.accessibleLabel, a);
                a.displayObject && this.makeAccessible(a.displayObject, b, "menuitem")
            }
        },
        update: function() {
            if (d.hasSVG) {
                d.AmMap.base.update.call(this);
                this.zoomControl && this.zoomControl.update && this.zoomControl.update();
                for (var a = 0, b = this.updatableImages.length; a < b; a++)
                    this.updatableImages[a].update()
            }
        },
        animateMap: function() {
            var a = this;
            a.totalFrames = a.zoomDuration * d.updateRate;
            a.totalFrames += 1;
            a.frame = 0;
            a.tweenPercent = 0;
            a.balloon.hide(0);
            setTimeout(function() {
                a.updateSize.call(a)
            }, 1E3 / d.updateRate)
        },
        updateSize: function() {
            var a = this
              , b = a.totalFrames;
            a.preventHover = !0;
            a.frame <= b ? (a.frame++,
            b = d.easeOutSine(0, a.frame, 0, 1, b),
            1 <= b ? (b = 1,
            a.preventHover = !1,
            a.wheelBusy = !1) : window.requestAnimationFrame ? window.requestAnimationFrame(function() {
                a.updateSize.call(a)
            }) : setTimeout(function() {
                a.updateSize.call(a)
            }, 1E3 / d.updateRate),
            .8 < b && (a.preventHover = !1)) : (b = 1,
            a.preventHover = !1,
            a.wheelBusy = !1);
            a.tweenPercent = b;
            a.rescaleMapAndObjects()
        },
        rescaleMapAndObjects: function() {
            var a = this.initialScale
              , b = this.initialX
              , c = this.initialY
              , e = this.tweenPercent
              , a = a + (this.finalScale - a) * e;
            this.mapContainer.translate(b + (this.finalX - b) * e, c + (this.finalY - c) * e, a, !0);
            if (this.areasSettings.adjustOutlineThickness) {
                for (var b = this.svgAreas, d = 0; d < b.length; d++)
                    (c = b[d]) && c.setAttr("stroke-width", this.areasSettings.outlineThickness / a / this.mapScale);
                if (b = this.dataProvider.areas)
                    for (d = 0; d < b.length; d++) {
                        var c = b[d]
                          , g = c.displayObject;
                        g && g.setAttr("stroke-width", c.outlineThicknessReal / a / this.mapScale)
                    }
            }
            this.rescaleObjects();
            this.positionChanged();
            this.updateSmallMap();
            1 == e && this.fire({
                type: "zoomCompleted",
                chart: this
            })
        },
        updateSmallMap: function() {
            this.smallMap && this.smallMap.update()
        },
        rescaleObjects: function() {
            var a = this.mapContainer.scale, b = this.imagesProcessor.objectsToResize, c;
            for (c = 0; c < b.length; c++) {
                var d = b[c].image
                  , f = b[c].scale
                  , g = b[c].mapImage;
                isNaN(g.selectedScaleReal) || g != this.selectedObject || (g.tempScale = f,
                f *= g.selectedScaleReal);
                d.translate(d.x, d.y, f / a, !0)
            }
            b = this.imagesProcessor.labelsToReposition;
            for (c = 0; c < b.length; c++)
                d = b[c],
                d.imageLabel && this.imagesProcessor.positionLabel(d.imageLabel, d, d.labelPositionReal);
            b = this.linesProcessor;
            if (d = b.linesToResize)
                for (c = 0; c < d.length; c++)
                    f = d[c],
                    f.line.setAttr("stroke-width", f.thickness / a);
            b = b.objectsToResize;
            for (c = 0; c < b.length; c++)
                d = b[c],
                d.translate(d.x, d.y, 1 / a, !0)
        },
        handleTouchEnd: function(a) {
            this.initialDistance = NaN;
            this.mouseIsDown = this.isDragging = !1;
            d.AmMap.base.handleTouchEnd.call(this, a)
        },
        handleMouseDown: function(a) {
            d.resetMouseOver();
            this.mouseIsDown = this.mouseIsOver = !0;
            this.balloon.hide(0);
            a && this.mouseIsOver && a.preventDefault && this.panEventsEnabled && a.preventDefault();
            if (this.chartCreated && !this.preventHover && (this.initialTouchZoom = this.zoomLevel(),
            this.dragMap && (this.stopAnimation(),
            this.mapContainerClickX = this.mapContainer.x,
            this.mapContainerClickY = this.mapContainer.y),
            a || (a = window.event),
            a.shiftKey && !0 === this.developerMode && this.getDevInfo(),
            a && a.touches)) {
                var b = this.mouseX
                  , c = this.mouseY
                  , e = a.touches.item(1);
                e && this.panEventsEnabled && this.boundingRect && (a = e.clientX - this.boundingRect.left,
                e = e.clientY - this.boundingRect.top,
                this.middleXP = (b + (a - b) / 2) / this.realWidth,
                this.middleYP = (c + (e - c) / 2) / this.realHeight,
                this.initialDistance = Math.sqrt(Math.pow(a - b, 2) + Math.pow(e - c, 2)))
            }
        },
        stopDrag: function() {
            this.isDragging = !1
        },
        handleReleaseOutside: function() {
            if (d.isModern) {
                var a = this;
                d.AmMap.base.handleReleaseOutside.call(a);
                a.mouseIsDown = !1;
                setTimeout(function() {
                    a.resetPinch.call(a)
                }, 100);
                if (!a.preventHover) {
                    a.stopDrag();
                    var b = a.zoomControl;
                    b && b.draggerUp && b.draggerUp();
                    a.mapWasDragged = !1;
                    var b = a.mapContainer
                      , c = a.mapContainerClickX
                      , e = a.mapContainerClickY;
                    isNaN(c) || isNaN(e) || !(3 < Math.abs(b.x - c) || 3 < Math.abs(b.y - e)) || (a.mapWasDragged = !0,
                    b = {
                        type: "dragCompleted",
                        zoomX: a.zoomX(),
                        zoomY: a.zoomY(),
                        zoomLevel: a.zoomLevel(),
                        chart: a
                    },
                    a.fire(b));
                    (a.mouseIsOver && !a.mapWasDragged && !a.skipClick || a.wasTouched && 3 > Math.abs(a.mouseX - a.tmx) && 3 > Math.abs(a.mouseY - a.tmy)) && a.fire({
                        type: "click",
                        x: a.mouseX,
                        y: a.mouseY,
                        chart: a
                    });
                    a.mapContainerClickX = NaN;
                    a.mapContainerClickY = NaN;
                    a.objectWasClicked = !1;
                    a.zoomOnDoubleClick && a.mouseIsOver && (b = (new Date).getTime(),
                    200 > b - a.previousClickTime && 40 < b - a.previousClickTime && a.doDoubleClickZoom(),
                    a.previousClickTime = b)
                }
                a.wasTouched = !1
            }
        },
        resetPinch: function() {
            this.mapWasPinched = !1
        },
        handleMouseMove: function(a) {
            var b = this;
            d.AmMap.base.handleMouseMove.call(b, a);
            if (!a || !a.touches || !b.tapToActivate || b.tapped) {
                b.panEventsEnabled && b.mouseIsOver && a && a.preventDefault && a.preventDefault();
                var c = b.previuosMouseX
                  , e = b.previuosMouseY
                  , f = b.mouseX
                  , g = b.mouseY
                  , h = b.zoomControl;
                isNaN(c) && (c = f);
                isNaN(e) && (e = g);
                b.mouse2X = NaN;
                b.mouse2Y = NaN;
                a && a.touches && (a = a.touches.item(1)) && b.panEventsEnabled && b.boundingRect && (b.mouse2X = a.clientX - b.boundingRect.left,
                b.mouse2Y = a.clientY - b.boundingRect.top);
                if (a = b.mapContainer) {
                    var k = b.mouse2X
                      , l = b.mouse2Y;
                    b.pinchTO && clearTimeout(b.pinchTO);
                    b.pinchTO = setTimeout(function() {
                        b.resetPinch.call(b)
                    }, 1E3);
                    var m = b.realHeight
                      , n = b.realWidth
                      , p = b.mapWidth
                      , t = b.mapHeight;
                    b.mouseIsDown && b.dragMap && (3 < Math.abs(b.previuosMouseX - b.mouseX) || 3 < Math.abs(b.previuosMouseY - b.mouseY)) && (b.isDragging = !0);
                    if (!isNaN(k)) {
                        b.stopDrag();
                        var r = Math.sqrt(Math.pow(k - f, 2) + Math.pow(l - g, 2))
                          , q = b.initialDistance;
                        isNaN(q) && (q = Math.sqrt(Math.pow(k - f, 2) + Math.pow(l - g, 2)));
                        if (!isNaN(q)) {
                            var k = b.initialTouchZoom * r / q
                              , k = d.fitToBounds(k, h.minZoomLevel, h.maxZoomLevel)
                              , h = b.zoomLevel()
                              , q = b.middleXP
                              , l = b.middleYP
                              , r = m / t
                              , y = n / p
                              , q = (b.zoomX() - q * y) * (k / h) + q * y
                              , l = (b.zoomY() - l * r) * (k / h) + l * r;
                            .1 < Math.abs(k - h) && (b.zoomTo(k, q, l, !0),
                            b.mapWasPinched = !0,
                            clearTimeout(b.pinchTO))
                        }
                    }
                    k = a.scale;
                    b.isDragging && (b.balloon.hide(0),
                    b.positionChanged(),
                    c = a.x + (f - c),
                    e = a.y + (g - e),
                    b.preventDragOut && (t = -t * k + m / 2 - b.diffY * b.mapScale * k,
                    m = m / 2 - b.diffY * b.mapScale * k,
                    c = d.fitToBounds(c, -p * k + n / 2, n / 2),
                    e = d.fitToBounds(e, t, m)),
                    isNaN(c) || isNaN(e) || (a.translate(c, e, k, !0),
                    b.updateSmallMap()));
                    b.previuosMouseX = f;
                    b.previuosMouseY = g
                }
            }
        },
        selectObject: function(a, b) {
            var c = this;
            a || (a = c.dataProvider);
            a.isOver = !1;
            var e = a.linkToObject;
            d.isString(e) && (e = c.getObjectById(e));
            a.useTargetsZoomValues && e && (a.zoomX = e.zoomX,
            a.zoomY = e.zoomY,
            a.zoomLatitude = e.zoomLatitude,
            a.zoomLongitude = e.zoomLongitude,
            a.zoomLevel = e.zoomLevel);
            var f = c.selectedObject;
            f && c.returnInitialColor(f);
            c.selectedObject = a;
            var g = !1, h, k;
            "MapArea" == a.objectType && (a.autoZoomReal && (g = !0),
            h = c.areasSettings.selectedOutlineColor,
            k = c.areasSettings.selectedOutlineThickness);
            if (e && !g && (d.isString(e) && (e = c.getObjectById(e)),
            isNaN(a.zoomLevel) && isNaN(a.zoomX) && isNaN(a.zoomY))) {
                if (c.extendMapData(e))
                    return;
                c.selectObject(e);
                return
            }
            c.allowMultipleDescriptionWindows || c.closeAllDescriptions();
            clearTimeout(c.selectedObjectTimeOut);
            clearTimeout(c.processObjectsTimeOut);
            e = c.zoomDuration;
            !g && isNaN(a.zoomLevel) && isNaN(a.zoomX) && isNaN(a.zoomY) ? (c.showDescriptionAndGetUrl(),
            b || c.processObjects()) : (c.selectedObjectTimeOut = setTimeout(function() {
                c.showDescriptionAndGetUrl.call(c)
            }, 1E3 * e + 200),
            c.showObjectsAfterZoom) ? b || (c.processObjectsTimeOut = setTimeout(function() {
                c.processObjects.call(c)
            }, 1E3 * e + 200)) : b || c.processObjects();
            e = a.displayObject;
            g = a.selectedColorReal;
            if ("MapImage" == a.objectType) {
                h = c.imagesSettings.selectedOutlineColor;
                k = c.imagesSettings.selectedOutlineThickness;
                var e = a.image
                  , l = a.selectedScaleReal;
                if (!isNaN(l) && 1 != l) {
                    var m = a.scale;
                    isNaN(a.tempScale) || (m = a.tempScale);
                    isNaN(m) && (m = 1);
                    a.tempScale = m;
                    var n = a.displayObject;
                    n.translate(n.x, n.y, m * l, !0)
                }
            }
            if (e) {
                if (d.removeCN(c, e, "selected-object"),
                d.setCN(c, e, "selected-object"),
                a.bringForwardOnHover && a.displayObject.toFront(),
                c.outlinesToFront(),
                !a.preserveOriginalAttributes) {
                    e.setAttr("stroke", a.outlineColorReal);
                    void 0 !== g && e.setAttr("fill", g);
                    void 0 !== h && e.setAttr("stroke", h);
                    void 0 !== k && e.setAttr("stroke-width", k);
                    "MapLine" == a.objectType && ((l = a.lineSvg) && l.setAttr("stroke", g),
                    l = a.arrowSvg) && (l.setAttr("fill", g),
                    l.setAttr("stroke", g));
                    if (l = a.imageLabel)
                        m = a.selectedLabelColorReal,
                        void 0 !== m && l.setAttr("fill", m);
                    a.selectable || (e.setAttr("cursor", "default"),
                    l && l.setAttr("cursor", "default"))
                }
            } else
                c.returnInitialColorReal(a);
            if (e = a.groupId)
                for (l = a.groupArray,
                l || (l = c.getGroupById(e),
                a.groupArray = l),
                m = 0; m < l.length; m++)
                    if (n = l[m],
                    n.isOver = !1,
                    e = n.displayObject,
                    "MapImage" == n.objectType && (e = n.image),
                    e) {
                        var p = n.selectedColorReal;
                        void 0 !== p && e.setAttr("fill", p);
                        void 0 !== h && e.setAttr("stroke", h);
                        void 0 !== k && e.setAttr("stroke-width", k);
                        "MapLine" == n.objectType && ((e = n.lineSvg) && e.setAttr("stroke", g),
                        e = n.arrowSvg) && (e.setAttr("fill", g),
                        e.setAttr("stroke", g))
                    }
            c.rescaleObjects();
            c.zoomToSelectedObject();
            f != a && c.fire({
                type: "selectedObjectChanged",
                chart: c
            })
        },
        returnInitialColor: function(a, b) {
            this.returnInitialColorReal(a);
            b && (a.isFirst = !1);
            if (this.selectedObject.bringForwardOnHover) {
                var c = this.selectedObject.displayObject;
                c && c.toFront()
            }
            if (c = a.groupId) {
                var c = this.getGroupById(c), d;
                for (d = 0; d < c.length; d++)
                    this.returnInitialColorReal(c[d]),
                    b && (c[d].isFirst = !1)
            }
            this.outlinesToFront()
        },
        outlinesToFront: function() {
            if (this.outlines)
                for (var a = 0; a < this.outlines.length; a++)
                    this.outlines[a].toFront()
        },
        closeAllDescriptions: function() {
            this.descriptionsDiv.innerHTML = ""
        },
        fireClosed: function() {
            this.fire({
                type: "descriptionClosed",
                chart: this
            })
        },
        returnInitialColorReal: function(a) {
            a.isOver = !1;
            var b = a.displayObject;
            if (b) {
                d.removeCN(this, b, "selected-object");
                b.toPrevious();
                if ("MapImage" == a.objectType) {
                    var c = a.tempScale;
                    isNaN(c) || b.translate(b.x, b.y, c, !0);
                    a.tempScale = NaN;
                    b = a.image
                }
                c = a.colorReal;
                if ("MapLine" == a.objectType) {
                    var e = a.lineSvg;
                    e && e.setAttr("stroke", c);
                    if (e = a.arrowSvg) {
                        var f = a.arrowColor;
                        void 0 === f && (f = c);
                        e.setAttr("fill", f);
                        e.setAttr("stroke", f)
                    }
                }
                var e = a.alphaReal
                  , f = a.outlineAlphaReal
                  , g = a.outlineThicknessReal
                  , h = a.outlineColorReal;
                if (a.showAsSelected) {
                    var c = a.selectedColorReal, k, l;
                    "MapImage" == a.objectType && (k = this.imagesSettings.selectedOutlineColor,
                    l = this.imagesSettings.selectedOutlineThickness);
                    "MapArea" == a.objectType && (k = this.areasSettings.selectedOutlineColor,
                    l = this.areasSettings.selectedOutlineThickness);
                    void 0 !== k && (h = k);
                    void 0 !== l && (g = l)
                }
                "bubble" == a.type && (c = void 0);
                void 0 !== c && b.setAttr("fill", c);
                if (k = a.image)
                    k.setAttr("fill", c),
                    k.setAttr("stroke", h),
                    k.setAttr("stroke-width", g),
                    k.setAttr("fill-opacity", e),
                    k.setAttr("stroke-opacity", f);
                "MapArea" == a.objectType && (c = 1,
                this.areasSettings.adjustOutlineThickness && (c = this.zoomLevel() * this.mapScale),
                b.setAttr("stroke", h),
                b.setAttr("stroke-width", g / c),
                b.setAttr("fill-opacity", e),
                b.setAttr("stroke-opacity", f));
                (c = a.pattern) && b.pattern(c, this.mapScale, this.path);
                (b = a.imageLabel) && !a.labelInactive && (a.showAsSelected && void 0 !== a.selectedLabelColor ? b.setAttr("fill", a.selectedLabelColor) : b.setAttr("fill", a.labelColorReal))
            }
        },
        zoomToRectangle: function(a, b, c, e) {
            var f = this.realWidth
              , g = this.realHeight
              , h = this.mapSet.scale
              , k = this.zoomControl
              , f = d.fitToBounds(c / f > e / g ? .8 * f / (c * h) : .8 * g / (e * h), k.minZoomLevel, k.maxZoomLevel);
            this.zoomToMapXY(f, (a + c / 2) * h, (b + e / 2) * h)
        },
        zoomToLatLongRectangle: function(a, b, c, e) {
            var f = this.dataProvider
              , g = this.zoomControl
              , h = Math.abs(c - a)
              , k = Math.abs(b - e)
              , l = Math.abs(f.rightLongitude - f.leftLongitude)
              , f = Math.abs(f.topLatitude - f.bottomLatitude)
              , g = d.fitToBounds(h / l > k / f ? .8 * l / h : .8 * f / k, g.minZoomLevel, g.maxZoomLevel);
            this.zoomToLongLat(g, a + (c - a) / 2, e + (b - e) / 2)
        },
        getGroupById: function(a) {
            var b = [];
            this.getGroup(this.imagesProcessor.allObjects, a, b);
            this.getGroup(this.linesProcessor.allObjects, a, b);
            this.getGroup(this.areasProcessor.allObjects, a, b);
            return b
        },
        zoomToGroup: function(a) {
            a = "object" == typeof a ? a : this.getGroupById(a);
            var b, c, d, f, g;
            for (g = 0; g < a.length; g++) {
                var h = a[g].displayObject;
                if (h) {
                    var k = h.getBBox()
                      , h = k.y
                      , l = k.y + k.height
                      , m = k.x
                      , k = k.x + k.width;
                    if (h < b || isNaN(b))
                        b = h;
                    if (l > f || isNaN(f))
                        f = l;
                    if (m < c || isNaN(c))
                        c = m;
                    if (k > d || isNaN(d))
                        d = k
                }
            }
            c += this.diffX;
            d += this.diffX;
            f += this.diffY;
            b += this.diffY;
            this.zoomToRectangle(c, b, d - c, f - b)
        },
        getGroup: function(a, b, c) {
            if (a) {
                var d;
                for (d = 0; d < a.length; d++) {
                    var f = a[d];
                    f.groupId == b && c.push(f)
                }
            }
        },
        zoomToStageXY: function(a, b, c, e) {
            if (!this.objectWasClicked) {
                var f = this.zoomControl;
                a = d.fitToBounds(a, f.minZoomLevel, f.maxZoomLevel);
                var f = this.zoomLevel()
                  , g = this.mapSet.getBBox();
                b = this.xyToCoordinates((b - this.mapContainer.x) / f - g.x * this.mapScale, (c - this.mapContainer.y) / f - g.y * this.mapScale);
                this.zoomToLongLat(a, b.longitude, b.latitude, e)
            }
        },
        zoomToLongLat: function(a, b, c, d) {
            b = this.coordinatesToXY(b, c);
            this.zoomToMapXY(a, b.x, b.y, d)
        },
        zoomToMapXY: function(a, b, c, d) {
            var f = this.mapWidth
              , g = this.mapHeight;
            this.zoomTo(a, -(b / f) * a + this.realWidth / f / 2, -(c / g) * a + this.realHeight / g / 2, d)
        },
        zoomToObject: function(a) {
            if (a) {
                var b = a.zoomLatitude
                  , c = a.zoomLongitude;
                isNaN(a.zoomLatitudeC) || (b = a.zoomLatitudeC);
                isNaN(a.zoomLongitudeC) || (c = a.zoomLongitudeC);
                var e = a.zoomLevel
                  , f = this.zoomInstantly
                  , g = a.zoomX
                  , h = a.zoomY
                  , k = this.realWidth
                  , l = this.realHeight;
                isNaN(e) || (isNaN(b) || isNaN(c) ? this.zoomTo(e, g, h, f) : this.zoomToLongLat(e, c, b, f));
                this.zoomInstantly = !1;
                "MapImage" == a.objectType && isNaN(a.zoomX) && isNaN(a.zoomY) && isNaN(a.zoomLatitude) && isNaN(a.zoomLongitude) && !isNaN(a.latitude) && !isNaN(a.longitude) && this.zoomToLongLat(a.zoomLevel, a.longitude, a.latitude);
                "MapArea" == a.objectType && (f = a.displayObject.getBBox(),
                g = this.mapScale,
                b = (f.x + this.diffX) * g,
                c = (f.y + this.diffY) * g,
                e = f.width * g,
                f = f.height * g,
                k = a.autoZoomReal && isNaN(a.zoomLevel) ? e / k > f / l ? .8 * k / e : .8 * l / f : a.zoomLevel,
                l = this.zoomControl,
                k = d.fitToBounds(k, l.minZoomLevel, l.maxZoomLevel),
                isNaN(a.zoomX) && isNaN(a.zoomY) && isNaN(a.zoomLatitude) && isNaN(a.zoomLongitude) && this.zoomToMapXY(k, b + e / 2, c + f / 2));
                this.zoomControl.update()
            }
        },
        zoomToSelectedObject: function() {
            this.zoomToObject(this.selectedObject)
        },
        zoomTo: function(a, b, c, e) {
            var f = this.zoomControl;
            a = d.fitToBounds(a, f.minZoomLevel, f.maxZoomLevel);
            f = this.zoomLevel();
            isNaN(b) && (b = this.realWidth / this.mapWidth,
            b = (this.zoomX() - .5 * b) * (a / f) + .5 * b);
            isNaN(c) && (c = this.realHeight / this.mapHeight,
            c = (this.zoomY() - .5 * c) * (a / f) + .5 * c);
            this.stopAnimation();
            isNaN(a) || (f = this.mapContainer,
            this.initialX = f.x,
            this.initialY = f.y,
            this.initialScale = f.scale,
            this.finalX = this.mapWidth * b,
            this.finalY = this.mapHeight * c,
            this.finalScale = a,
            this.finalX != this.initialX || this.finalY != this.initialY || this.finalScale != this.initialScale ? e ? (this.tweenPercent = 1,
            this.rescaleMapAndObjects(),
            this.wheelBusy = !1) : this.animateMap() : this.wheelBusy = !1)
        },
        loadXml: function(a) {
            var b;
            window.XMLHttpRequest && (b = new XMLHttpRequest);
            b.overrideMimeType && b.overrideMimeType("text/xml");
            b.open("GET", a, !1);
            b.send();
            this.parseXMLObject(b.responseXML);
            this.svgData && this.buildEverything()
        },
        stopAnimation: function() {
            this.frame = this.totalFrames
        },
        processObjects: function(a) {
            var b = this.selectedObject;
            if (0 < b.images.length || 0 < b.areas.length || 0 < b.lines.length || b == this.dataProvider || a) {
                a = this.container;
                var c = this.stageImagesContainer;
                c && c.remove();
                this.stageImagesContainer = c = a.set();
                this.trendLinesSet.push(c);
                var d = this.stageLinesContainer;
                d && d.remove();
                this.stageLinesContainer = d = a.set();
                this.trendLinesSet.push(d);
                var f = this.mapImagesContainer;
                f && f.remove();
                this.mapImagesContainer = f = a.set();
                this.mapContainer.push(f);
                var g = this.mapLinesContainer;
                g && g.remove();
                this.mapLinesContainer = g = a.set();
                this.mapContainer.push(g);
                this.linesAboveImages ? (f.toFront(),
                c.toFront(),
                g.toFront(),
                d.toFront()) : (g.toFront(),
                d.toFront(),
                f.toFront(),
                c.toFront());
                b && (this.imagesProcessor.reset(),
                this.linesProcessor.reset(),
                this.linesAboveImages ? (this.imagesProcessor.process(b),
                this.linesProcessor.process(b)) : (this.linesProcessor.process(b),
                this.imagesProcessor.process(b)));
                this.rescaleObjects()
            }
        },
        processAreas: function() {
            this.areasProcessor.process(this.dataProvider)
        },
        buildSVGMap: function() {
            d.remove(this.mapSet);
            var a = this.svgData.g.path
              , b = this.container
              , c = b.set();
            this.svgAreas = [];
            this.svgAreasById = {};
            void 0 === a.length && (a = [a]);
            var e;
            for (e = 0; e < a.length; e++) {
                var f = a[e]
                  , g = f.d
                  , h = f.title;
                f.titleTr && (h = f.titleTr);
                var k = b.path(g);
                k.id = f.id;
                if (this.areasSettings.preserveOriginalAttributes) {
                    k.customAttr = {};
                    for (var l in f)
                        "d" != l && "id" != l && "title" != l && (k.customAttr[l] = f[l])
                }
                f.outline && (k.outline = !0);
                k.path = g;
                this.svgAreasById[f.id] = {
                    area: k,
                    title: h,
                    className: f["class"]
                };
                this.svgAreas.push(k);
                c.push(k)
            }
            this.mapSet = c;
            this.mapContainer.push(c);
            this.resizeMap()
        },
        centerAlign: function() {},
        setProjection: function(a) {
            this.projection = a;
            this.chartCreated = !1;
            this.buildEverything()
        },
        addObjectEventListeners: function(a, b) {
            var c = this;
            a.mousedown(function(a) {
                c.mouseDownMapObject(b, a)
            }).mouseup(function(a) {
                c.clickMapObject(b, a)
            }).mouseover(function(a) {
                c.balloonX = NaN;
                c.rollOverMapObject(b, !0, a)
            }).mouseout(function(a) {
                c.balloonX = NaN;
                c.rollOutMapObject(b, a)
            }).touchend(function(a) {
                4 > Math.abs(c.mouseX - c.tmx) && 4 > Math.abs(c.mouseY - c.tmy) && (c.tapped = !0);
                c.tapToActivate && !c.tapped || c.mapWasDragged || c.mapWasPinched || (c.balloonX = NaN,
                c.rollOverMapObject(b, !0, a),
                c.clickMapObject(b, a))
            }).touchstart(function(a) {
                c.tmx = c.mouseX;
                c.tmy = c.mouseY;
                c.mouseDownMapObject(b, a)
            }).keyup(function(a) {
                13 == a.keyCode && c.clickMapObject(b, a)
            })
        },
        checkIfSelected: function(a) {
            var b = this.selectedObject;
            if (b == a)
                return !0;
            if (b = b.groupId) {
                var b = this.getGroupById(b), c;
                for (c = 0; c < b.length; c++)
                    if (b[c] == a)
                        return !0
            }
            return !1
        },
        clearMap: function() {
            this.chartDiv.innerHTML = "";
            this.clearObjectList()
        },
        clearObjectList: function() {
            var a = this.objectList;
            a && a.div && (a.div.innerHTML = "")
        },
        checkIfLast: function(a) {
            if (a) {
                var b = a.parentNode;
                if (b && b.lastChild == a)
                    return !0
            }
            return !1
        },
        showAsRolledOver: function(a) {
            var b = a.displayObject;
            if (!a.showAsSelected && b && !a.isOver) {
                b.node.onmouseout = function() {}
                ;
                b.node.onmouseover = function() {}
                ;
                b.node.onclick = function() {}
                ;
                !a.isFirst && a.bringForwardOnHover && (b.toFront(),
                a.isFirst = !0);
                var c = a.rollOverColorReal, e;
                a.preserveOriginalAttributes && (c = void 0);
                "bubble" == a.type && (c = void 0);
                void 0 == c && (isNaN(a.rollOverBrightnessReal) || (c = d.adjustLuminosity(a.colorReal, a.rollOverBrightnessReal / 100)));
                if (void 0 != c)
                    if ("MapImage" == a.objectType)
                        (e = a.image) && e.setAttr("fill", c);
                    else if ("MapLine" == a.objectType) {
                        if ((e = a.lineSvg) && e.setAttr("stroke", c),
                        e = a.arrowSvg)
                            e.setAttr("fill", c),
                            e.setAttr("stroke", c)
                    } else
                        b.setAttr("fill", c);
                (c = a.imageLabel) && !a.labelInactive && (e = a.labelRollOverColorReal,
                void 0 != e && c.setAttr("fill", e));
                c = a.rollOverOutlineColorReal;
                void 0 != c && ("MapImage" == a.objectType ? (e = a.image) && e.setAttr("stroke", c) : b.setAttr("stroke", c));
                "MapImage" == a.objectType ? (c = this.imagesSettings.rollOverOutlineThickness,
                (e = a.image) && (isNaN(c) || e.setAttr("stroke-width", c))) : (c = this.areasSettings.rollOverOutlineThickness,
                isNaN(c) || b.setAttr("stroke-width", c));
                if ("MapArea" == a.objectType) {
                    c = this.areasSettings;
                    e = a.rollOverAlphaReal;
                    isNaN(e) || b.setAttr("fill-opacity", e);
                    e = c.rollOverOutlineAlpha;
                    isNaN(e) || b.setAttr("stroke-opacity", e);
                    e = 1;
                    this.areasSettings.adjustOutlineThickness && (e = this.zoomLevel() * this.mapScale);
                    var f = c.rollOverOutlineThickness;
                    isNaN(f) || b.setAttr("stroke-width", f / e);
                    (c = c.rollOverPattern) && b.pattern(c, this.mapScale, this.path)
                }
                "MapImage" == a.objectType && (c = a.rollOverScaleReal,
                isNaN(c) || 1 == c || (e = b.scale,
                isNaN(e) && (e = 1),
                a.tempScale = e,
                b.translate(b.x, b.y, e * c, !0)));
                this.useHandCursorOnClickableOjects && this.checkIfClickable(a) && b.setAttr("cursor", "pointer");
                a.mouseEnabled && this.addObjectEventListeners(b, a);
                a.isOver = !0
            }
            this.outlinesToFront()
        },
        rollOverMapObject: function(a, b, c) {
            if (this.chartCreated) {
                this.handleMouseMove();
                var d = this.previouslyHovered;
                d && d != a ? (!1 === this.checkIfSelected(d) && (this.returnInitialColor(d, !0),
                this.previouslyHovered = null),
                this.balloon.hide(0)) : clearTimeout(this.hoverInt);
                if (!this.preventHover) {
                    if (!1 === this.checkIfSelected(a)) {
                        if (d = a.groupId) {
                            var d = this.getGroupById(d), f;
                            for (f = 0; f < d.length; f++)
                                d[f] != a && this.showAsRolledOver(d[f])
                        }
                        this.showAsRolledOver(a)
                    } else
                        (d = a.displayObject) && (this.allowClickOnSelectedObject ? d.setAttr("cursor", "pointer") : d.setAttr("cursor", "default"));
                    this.showDescriptionOnHover ? this.showDescription(a) : !this.showBalloonOnSelectedObject && this.checkIfSelected(a) || !1 === b || (f = this.balloon,
                    this.balloon.fixedPosition = !1,
                    b = a.colorReal,
                    d = "",
                    void 0 !== b && this.useObjectColorForBalloon || (b = f.fillColor),
                    (f = a.balloonTextReal) && (d = this.formatString(f, a)),
                    this.balloonLabelFunction && (d = this.balloonLabelFunction(a, this)),
                    d && "" !== d && this.showBalloon(d, b, !1, this.balloonX, this.balloonY));
                    this.fire({
                        type: "rollOverMapObject",
                        mapObject: a,
                        chart: this,
                        event: c
                    });
                    this.previouslyHovered = a
                }
            }
        },
        longitudeToX: function(a) {
            return (this.longitudeToCoordinate(a) + this.diffX * this.mapScale) * this.zoomLevel() + this.mapContainer.x
        },
        latitudeToY: function(a) {
            return (this.latitudeToCoordinate(a) + this.diffY * this.mapScale) * this.zoomLevel() + this.mapContainer.y
        },
        latitudeToStageY: function(a) {
            return this.latitudeToCoordinate(a) * this.zoomLevel() + this.mapContainer.y + this.diffY * this.mapScale
        },
        longitudeToStageX: function(a) {
            return this.longitudeToCoordinate(a) * this.zoomLevel() + this.mapContainer.x + this.diffX * this.mapScale
        },
        stageXToLongitude: function(a) {
            a = (a - this.mapContainer.x) / this.zoomLevel();
            return this.coordinateToLongitude(a)
        },
        stageYToLatitude: function(a) {
            a = (a - this.mapContainer.y) / this.zoomLevel();
            return this.coordinateToLatitude(a)
        },
        rollOutMapObject: function(a, b) {
            this.hideBalloon();
            a && this.chartCreated && a.isOver && (this.checkIfSelected(a) || this.returnInitialColor(a),
            this.fire({
                type: "rollOutMapObject",
                mapObject: a,
                chart: this,
                event: b
            }))
        },
        formatString: function(a, b) {
            var c = this.nf
              , e = this.pf
              , f = b.title;
            b.titleTr && (f = b.titleTr);
            void 0 == f && (f = "");
            var g = b.value
              , g = isNaN(g) ? "" : d.formatNumber(g, c)
              , c = b.percents
              , c = isNaN(c) ? "" : d.formatNumber(c, e)
              , e = b.description;
            void 0 == e && (e = "");
            var h = b.customData;
            void 0 == h && (h = "");
            return a = d.massReplace(a, {
                "[[title]]": f,
                "[[value]]": g,
                "[[percent]]": c,
                "[[description]]": e,
                "[[customData]]": h
            })
        },
        mouseDownMapObject: function(a, b) {
            this.fire({
                type: "mouseDownMapObject",
                mapObject: a,
                chart: this,
                event: b
            })
        },
        clickMapObject: function(a, b) {
            var c = this;
            b && (b.touches || isNaN(a.zoomLevel) && isNaN(a.zoomX) && isNaN(a.zoomY) || c.hideBalloon());
            if (c.chartCreated && !c.preventHover && c.checkTouchDuration(b) && !c.mapWasDragged && c.checkIfClickable(a) && !c.mapWasPinched) {
                c.selectObject(a);
                var d = c.zoomLevel()
                  , f = c.mapSet.getBBox()
                  , d = c.xyToCoordinates((c.mouseX - c.mapContainer.x) / d - f.x * c.mapScale, (c.mouseY - c.mapContainer.y) / d - f.y * c.mapScale);
                c.clickLatitude = d.latitude;
                c.clickLongitude = d.longitude;
                b && b.touches && setTimeout(function() {
                    c.showBalloonAfterZoom.call(c)
                }, 1E3 * c.zoomDuration);
                c.fire({
                    type: "clickMapObject",
                    mapObject: a,
                    chart: c,
                    event: b
                });
                c.fire({
                    type: "homeButtonclicked",
                    chart: c
                });
                /*c.fire({
                type: "dataUpdated",
                chart: c
                });*/
                /*c.dataProvider.images = [
                {latitude: 40.4168, longitude:  -3.703790, type: "circle", color: "#6c00ff"} 
                ];
                c.update();*/
                /*var video = document.getElementById("video1");
                video.setAttribute("src", this.selectedObject.id + ".mp4");
                video.style.visibility = "visible";    
                video.play();*/
                /*var dp = this.dataProvider;
                var im = dp.images;
                alert(im.length);
                
                c.fire({
                    images: [ {
                    latitude: 40.4168,
                    longitude:  -3.703790,
                    type: "circle",
                    color: "#6c00ff"
                    } ]
                });*/
                //c.selectObject(c.dataProvider);
                c.objectWasClicked = !0
            }
        },
        showBalloonAfterZoom: function() {
            var a = this.clickLongitude
              , b = this.clickLatitude
              , c = this.selectedObject;
            "MapImage" != c.objectType || isNaN(c.longitude) || (a = c.longitude,
            b = c.latitude);
            a = this.coordinatesToStageXY(a, b);
            this.balloonX = a.x;
            this.balloonY = a.y;
            this.rollOverMapObject(this.selectedObject, !0)
        },
        checkIfClickable: function(a) {
            var b = this.allowClickOnSelectedObject;
            return this.selectedObject == a && b ? !0 : this.selectedObject != a || b ? !0 === a.selectable || "MapArea" == a.objectType && a.autoZoomReal || a.url || a.linkToObject || 0 < a.images.length || 0 < a.lines.length || !isNaN(a.zoomLevel) || !isNaN(a.zoomX) || !isNaN(a.zoomY) || a.description ? !0 : !1 : !1
        },
        resizeMap: function() {
            var a = this.mapSet;
            if (a) {
                var b = 1
                  , c = a.getBBox()
                  , d = this.realWidth
                  , f = this.realHeight
                  , g = c.width
                  , c = c.height;
                0 < g && 0 < c && (this.fitMapToContainer && (b = g / d > c / f ? d / g : f / c),
                a.translate(0, 0, b, !0),
                this.mapScale = b,
                this.mapHeight = c * b,
                this.mapWidth = g * b)
            }
        },
        zoomIn: function() {
            var a = this.zoomLevel() * this.zoomControl.zoomFactor;
            this.zoomTo(a)
        },
        zoomOut: function() {
            var a = this.zoomLevel() / this.zoomControl.zoomFactor;
            this.zoomTo(a)
        },
        moveLeft: function() {
            var a = this.zoomX() + this.zoomControl.panStepSize;
            this.zoomTo(this.zoomLevel(), a, this.zoomY())
        },
        moveRight: function() {
            var a = this.zoomX() - this.zoomControl.panStepSize;
            this.zoomTo(this.zoomLevel(), a, this.zoomY())
        },
        moveUp: function() {
            var a = this.zoomY() + this.zoomControl.panStepSize;
            this.zoomTo(this.zoomLevel(), this.zoomX(), a)
        },
        moveDown: function() {
            var a = this.zoomY() - this.zoomControl.panStepSize;
            this.zoomTo(this.zoomLevel(), this.zoomX(), a)
        },
        zoomX: function() {
            return this.mapSet ? Math.round(1E4 * this.mapContainer.x / this.mapWidth) / 1E4 : NaN
        },
        zoomY: function() {
            return this.mapSet ? Math.round(1E4 * this.mapContainer.y / this.mapHeight) / 1E4 : NaN
        },
        goHome: function() {
            this.selectObject(this.dataProvider);
            this.fire({
                type: "homeButtonClicked",
                chart: this
            })
            var video = document.getElementById("video1");
            if(video != null){
                video.pause();
                video.style.visibility = "hidden";}
            var wiki = document.getElementById("wiki");
            if(wiki != null){
                wiki.style.visibility = "hidden";
                wiki.style.opacity = "0";}
        },
        zoomLevel: function() {
            return Math.round(1E5 * this.mapContainer.scale) / 1E5
        },
        showDescriptionAndGetUrl: function() {
            var a = this.selectedObject;
            if (a) {
                this.showDescription();
                var b = a.url;
                if (b)
                    d.getURL(b, a.urlTarget);
                else if (b = a.linkToObject) {
                    if (d.isString(b)) {
                        var c = this.getObjectById(b);
                        if (c) {
                            this.selectObject(c);
                            return
                        }
                    }
                    b && a.passZoomValuesToTarget && (b.zoomLatitude = this.zoomLatitude(),
                    b.zoomLongitude = this.zoomLongitude(),
                    b.zoomLevel = this.zoomLevel());
                    this.extendMapData(b) || this.selectObject(b)
                }
            }
        },
        extendMapData: function(a) {
            var b = a.objectType;
            if ("MapImage" != b && "MapArea" != b && "MapLine" != b)
                return d.extend(a, new d.MapData, !0),
                this.dataProvider = a,
                this.zoomInstantly = !0,
                this.validateData(),
                !0
        },
        showDescription: function(a) {
            a || (a = this.selectedObject);
            this.allowMultipleDescriptionWindows || this.closeAllDescriptions();
            if (a.description) {
                var b = a.descriptionWindow;
                b && b.close();
                b = new d.DescriptionWindow;
                a.descriptionWindow = b;
                var c = a.descriptionWindowWidth
                  , e = a.descriptionWindowHeight
                  , f = a.descriptionWindowLeft
                  , g = a.descriptionWindowTop
                  , h = a.descriptionWindowRight
                  , k = a.descriptionWindowBottom;
                isNaN(h) || (f = this.realWidth - h);
                isNaN(k) || (g = this.realHeight - k);
                var l = a.descriptionWindowX;
                isNaN(l) || (f = l);
                l = a.descriptionWindowY;
                isNaN(l) || (g = l);
                isNaN(f) && (f = this.mouseX,
                f = f > this.realWidth / 2 ? f - c - 20 : f + 20);
                isNaN(g) && (g = this.mouseY);
                b.maxHeight = e;
                l = a.title;
                a.titleTr && (l = a.titleTr);
                b.show(this, this.descriptionsDiv, a.description, l);
                a = b.div.style;
                a.position = "absolute";
                a.width = c + "px";
                a.maxHeight = e + "px";
                isNaN(k) || (g -= b.div.offsetHeight);
                isNaN(h) || (f -= b.div.offsetWidth);
                a.left = f + "px";
                a.top = g + "px"
            }
        },
        parseXMLObject: function(a) {
            var b = {
                root: {}
            };
            this.parseXMLNode(b, "root", a);
            this.svgData = b.root.svg;
            this.getBounds()
        },
        getBounds: function() {
            var a = this.dataProvider;
            try {
                var b = this.svgData.defs["amcharts:ammap"];
                a.leftLongitude = Number(b.leftLongitude);
                a.rightLongitude = Number(b.rightLongitude);
                a.topLatitude = Number(b.topLatitude);
                a.bottomLatitude = Number(b.bottomLatitude);
                a.projection = b.projection;
                var c = b.wrappedLongitudes;
                c && (a.rightLongitude += 360);
                a.wrappedLongitudes = c
            } catch (d) {}
        },
        recalcLongitude: function(a) {
            return this.dataProvider.wrappedLongitudes ? a < this.dataProvider.leftLongitude ? Number(a) + 360 : a : a
        },
        latitudeToCoordinate: function(a) {
            var b, c = this.dataProvider;
            if (this.mapSet) {
                b = c.topLatitude;
                var d = c.bottomLatitude;
                "mercator" == c.projection && (a = this.mercatorLatitudeToCoordinate(a),
                b = this.mercatorLatitudeToCoordinate(b),
                d = this.mercatorLatitudeToCoordinate(d));
                b = (a - b) / (d - b) * this.mapHeight
            }
            return b
        },
        longitudeToCoordinate: function(a) {
            a = this.recalcLongitude(a);
            var b, c = this.dataProvider;
            this.mapSet && (b = c.leftLongitude,
            b = (a - b) / (c.rightLongitude - b) * this.mapWidth);
            return b
        },
        mercatorLatitudeToCoordinate: function(a) {
            89.5 < a && (a = 89.5);
            -89.5 > a && (a = -89.5);
            a = d.degreesToRadians(a);
            return d.radiansToDegrees(.5 * Math.log((1 + Math.sin(a)) / (1 - Math.sin(a))) / 2)
        },
        zoomLatitude: function() {
            if (this.mapContainer) {
                var a = this.mapSet.getBBox()
                  , b = (-this.mapContainer.x + this.previousWidth / 2) / this.zoomLevel() - a.x * this.mapScale
                  , a = (-this.mapContainer.y + this.previousHeight / 2) / this.zoomLevel() - a.y * this.mapScale;
                return this.xyToCoordinates(b, a).latitude
            }
        },
        zoomLongitude: function() {
            if (this.mapContainer) {
                var a = this.mapSet.getBBox()
                  , b = (-this.mapContainer.x + this.previousWidth / 2) / this.zoomLevel() - a.x * this.mapScale
                  , a = (-this.mapContainer.y + this.previousHeight / 2) / this.zoomLevel() - a.y * this.mapScale;
                return this.xyToCoordinates(b, a).longitude
            }
        },
        getAreaCenterLatitude: function(a) {
            a = a.displayObject.getBBox();
            var b = this.mapScale
              , c = this.mapSet.getBBox();
            return this.xyToCoordinates((a.x + a.width / 2 + this.diffX) * b - c.x * b, (a.y + a.height / 2 + this.diffY) * b - c.y * b).latitude
        },
        getAreaCenterLongitude: function(a) {
            a = a.displayObject.getBBox();
            var b = this.mapScale
              , c = this.mapSet.getBBox();
            return this.xyToCoordinates((a.x + a.width / 2 + this.diffX) * b - c.x * b, (a.y + a.height / 2 + this.diffY) * b - c.y * b).longitude
        },
        milesToPixels: function(a) {
            var b = this.dataProvider;
            return this.mapWidth / (b.rightLongitude - b.leftLongitude) * a / 69.172
        },
        kilometersToPixels: function(a) {
            var b = this.dataProvider;
            return this.mapWidth / (b.rightLongitude - b.leftLongitude) * a / 111.325
        },
        handleBackgroundClick: function() {
            if (this.backgroundZoomsToTop && !this.mapWasDragged) {
                var a = this.dataProvider;
                if (this.checkIfClickable(a))
                    this.clickMapObject(a);
                else {
                    var b = a.zoomX
                      , c = a.zoomY
                      , d = a.zoomLongitude
                      , f = a.zoomLatitude
                      , a = a.zoomLevel;
                    isNaN(b) || isNaN(c) || this.zoomTo(a, b, c);
                    isNaN(d) || isNaN(f) || this.zoomToLongLat(a, d, f, !0)
                }
            }
        },
        parseXMLNode: function(a, b, c, d) {
            void 0 === d && (d = "");
            var f, g, h;
            if (c) {
                var k = c.childNodes.length;
                for (f = 0; f < k; f++) {
                    g = c.childNodes[f];
                    var l = g.nodeName
                      , m = g.nodeValue ? this.trim(g.nodeValue) : ""
                      , n = !1;
                    g.attributes && 0 < g.attributes.length && (n = !0);
                    if (0 !== g.childNodes.length || "" !== m || !1 !== n)
                        if (3 == g.nodeType || 4 == g.nodeType) {
                            if ("" !== m) {
                                g = 0;
                                for (h in a[b])
                                    a[b].hasOwnProperty(h) && g++;
                                g ? a[b]["#text"] = m : a[b] = m
                            }
                        } else if (1 == g.nodeType) {
                            var p;
                            void 0 !== a[b][l] ? void 0 === a[b][l].length ? (p = a[b][l],
                            a[b][l] = [],
                            a[b][l].push(p),
                            a[b][l].push({}),
                            p = a[b][l][1]) : "object" == typeof a[b][l] && (a[b][l].push({}),
                            p = a[b][l][a[b][l].length - 1]) : (a[b][l] = {},
                            p = a[b][l]);
                            if (g.attributes && g.attributes.length)
                                for (m = 0; m < g.attributes.length; m++)
                                    p[g.attributes[m].name] = g.attributes[m].value;
                            void 0 !== a[b][l].length ? this.parseXMLNode(a[b][l], a[b][l].length - 1, g, d + "  ") : this.parseXMLNode(a[b], l, g, d + "  ")
                        }
                }
                g = 0;
                c = "";
                for (h in a[b])
                    "#text" == h ? c = a[b][h] : g++;
                0 === g && void 0 === a[b].length && (a[b] = c)
            }
        },
        doDoubleClickZoom: function() {
            if (!this.mapWasDragged) {
                var a = this.zoomLevel() * this.zoomControl.zoomFactor;
                this.zoomToStageXY(a, this.mouseX, this.mouseY)
            }
        },
        getDevInfo: function() {
            var a = this.zoomLevel()
              , b = this.mapSet.getBBox()
              , b = this.xyToCoordinates((this.mouseX - this.mapContainer.x) / a - b.x * this.mapScale, (this.mouseY - this.mapContainer.y) / a - b.y * this.mapScale)
              , a = {
                chart: this,
                type: "writeDevInfo",
                zoomLevel: a,
                zoomX: this.zoomX(),
                zoomY: this.zoomY(),
                zoomLatitude: this.zoomLatitude(),
                zoomLongitude: this.zoomLongitude(),
                latitude: b.latitude,
                longitude: b.longitude,
                left: this.mouseX,
                top: this.mouseY,
                right: this.realWidth - this.mouseX,
                bottom: this.realHeight - this.mouseY,
                percentLeft: Math.round(this.mouseX / this.realWidth * 100) + "%",
                percentTop: Math.round(this.mouseY / this.realHeight * 100) + "%",
                percentRight: Math.round((this.realWidth - this.mouseX) / this.realWidth * 100) + "%",
                percentBottom: Math.round((this.realHeight - this.mouseY) / this.realHeight * 100) + "%"
            }
              , b = "zoomLevel:" + a.zoomLevel + ", zoomLongitude:" + a.zoomLongitude + ", zoomLatitude:" + a.zoomLatitude + "\n"
              , b = b + ("zoomX:" + a.zoomX + ", zoomY:" + a.zoomY + "\n")
              , b = b + ("latitude:" + a.latitude + ", longitude:" + a.longitude + "\n")
              , b = b + ("left:" + a.left + ", top:" + a.top + "\n")
              , b = b + ("right:" + a.right + ", bottom:" + a.bottom + "\n")
              , b = b + ("left:" + a.percentLeft + ", top:" + a.percentTop + "\n")
              , b = b + ("right:" + a.percentRight + ", bottom:" + a.percentBottom + "\n");
            a.str = b;
            this.fire(a);
            return a
        },
        getXY: function(a, b, c) {
            void 0 !== a && (-1 != String(a).indexOf("%") ? (a = Number(a.split("%").join("")),
            c && (a = 100 - a),
            a = Number(a) * b / 100) : c && (a = b - a));
            return a
        },
        getObjectById: function(a) {
            var b = this.dataProvider;
            if (b.areas) {
                var c = this.getObject(a, b.areas);
                if (c)
                    return c
            }
            if (c = this.getObject(a, b.images))
                return c;
            if (a = this.getObject(a, b.lines))
                return a
        },
        getObject: function(a, b) {
            if (b) {
                var c;
                for (c = 0; c < b.length; c++) {
                    var d = b[c];
                    if (d.id == a)
                        return d;
                    if (d.areas) {
                        var f = this.getObject(a, d.areas);
                        if (f)
                            return f
                    }
                    if (f = this.getObject(a, d.images))
                        return f;
                    if (d = this.getObject(a, d.lines))
                        return d
                }
            }
        },
        parseData: function() {
            var a = this.dataProvider;
            this.processObject(a.areas, a, "area");
            this.processObject(a.images, a, "image");
            this.processObject(a.lines, a, "line")
        },
        processObject: function(a, b, c) {
            if (a) {
                var e;
                for (e = 0; e < a.length; e++) {
                    var f = a[e];
                    f.parentObject = b;
                    "area" == c && d.extend(f, new d.MapArea(this.theme), !0);
                    "image" == c && (f = d.extend(f, new d.MapImage(this.theme), !0));
                    "line" == c && (f = d.extend(f, new d.MapLine(this.theme), !0));
                    a[e] = f;
                    f.areas && this.processObject(f.areas, f, "area");
                    f.images && this.processObject(f.images, f, "image");
                    f.lines && this.processObject(f.lines, f, "line")
                }
            }
        },
        positionChanged: function() {
            var a = {
                type: "positionChanged",
                zoomX: this.zoomX(),
                zoomY: this.zoomY(),
                zoomLevel: this.zoomLevel(),
                chart: this
            };
            this.fire(a)
        },
        getX: function(a, b) {
            return this.getXY(a, this.realWidth, b)
        },
        getY: function(a, b) {
            return this.getXY(a, this.realHeight, b)
        },
        trim: function(a) {
            if (a) {
                var b;
                for (b = 0; b < a.length; b++)
                    if (-1 === " \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(b))) {
                        a = a.substring(b);
                        break
                    }
                for (b = a.length - 1; 0 <= b; b--)
                    if (-1 === " \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(b))) {
                        a = a.substring(0, b + 1);
                        break
                    }
                return -1 === " \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(0)) ? a : ""
            }
        },
        destroy: function() {
            d.AmMap.base.destroy.call(this)
        },
        x2c: function(a) {
            var b = this.dataProvider.leftLongitude;
            return Math.round(this.unscaledMapWidth * (a - b) / (this.dataProvider.rightLongitude - b) * 100) / 100
        },
        y2c: function(a) {
            var b = this.dataProvider.topLatitude;
            return Math.round(this.unscaledMapHeight * (a - b) / (this.dataProvider.bottomLatitude - b) * 100) / 100
        },
        normalize: function(a) {
            if (!a.pathsArray) {
                var b;
                if (a.normalized)
                    b = a.normalized;
                else {
                    var c = d.normalizePath(a.node);
                    b = a.node.getAttribute("d");
                    a.normalized = b;
                    c.maxX > this.maxMapX && (this.maxMapX = c.maxX);
                    c.minX < this.minMapX && (this.minMapX = c.minX);
                    c.maxY > this.maxMapY && (this.maxMapY = c.maxY);
                    c.minY < this.minMapY && (this.minMapY = c.minY)
                }
                a.node.setAttribute("d", b)
            }
        },
        redraw: function(a) {
            var b = a.normalized
              , b = b.split(" Z").join("")
              , b = b.split("M");
            a.pathsArray = [];
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                if (d) {
                    for (var d = d.split("L"), f = [], g = 0; g < d.length; g++)
                        if (d[g]) {
                            var h = d[g].split(" ")
                              , h = this.xyToCoordinates(Number(h[1]), Number(h[2]), this.dpProjectionFunction, this.sourceMapWidth, this.sourceMapHeight);
                            f.push([h.longitude, h.latitude])
                        }
                    a.pathsArray.push(f)
                }
            }
            b = "";
            for (c = 0; c < a.pathsArray.length; c++)
                b += this.redrawArea(a.pathsArray[c]);
            a.node.setAttribute("d", b);
            a.path = b
        },
        redrawArea: function(a) {
            for (var b = !1, c = "", e = 0; e < a.length; e++) {
                var f = a[e][0]
                  , g = a[e][1]
                  , h = d.degreesToRadians(a[e][0])
                  , k = d.degreesToRadians(a[e][1])
                  , k = this.projectionFunction(h, k)
                  , h = d.roundTo(this.x2c(d.radiansToDegrees(k[0])), 3)
                  , k = d.roundTo(this.y2c(d.radiansToDegrees(k[1])), 3);
                h < this.minMapXX && (this.minMapXX = h,
                this.leftLongLat = {
                    longitude: f,
                    latitude: g
                });
                h > this.maxMapXX && (this.maxMapXX = h,
                this.rightLongLat = {
                    longitude: f,
                    latitude: g
                });
                k < this.minMapYY && (this.minMapYY = k,
                this.topLongLat = {
                    longitude: f,
                    latitude: g
                });
                k > this.maxMapYY && (this.maxMapYY = k,
                this.bottomLongLat = {
                    longitude: f,
                    latitude: g
                });
                b ? c += " L " : (c += " M ",
                b = !0);
                c += h + " " + k
            }
            return c + " Z "
        },
        normalizeMap: function() {
            var a = d.degreesToRadians(this.dataProvider.leftLongitude)
              , b = d.degreesToRadians(this.dataProvider.rightLongitude)
              , c = d.degreesToRadians(this.dataProvider.topLatitude)
              , e = d.degreesToRadians(this.dataProvider.bottomLatitude)
              , f = a + (b - a) / 2
              , g = c + (e - c) / 2
              , h = this.dpProjectionFunction(f, c)[1]
              , k = this.dpProjectionFunction(f, e)[1]
              , l = this.dpProjectionFunction(a, g)[0]
              , m = this.dpProjectionFunction(b, g)[0]
              , c = d.equirectangular(f, c)
              , e = d.equirectangular(f, e)
              , h = (c[1] - e[1]) / (h - k)
              , a = d.equirectangular(a, g)
              , b = d.equirectangular(b, g)
              , l = (a[0] - b[0]) / (l - m);
            this.minMapX = Infinity;
            this.maxMapX = -Infinity;
            this.minMapY = Infinity;
            this.maxMapY = -Infinity;
            for (m = 0; m < this.svgAreas.length; m++)
                this.normalize(this.svgAreas[m]);
            if (this.dataProvider.wrappedLongitudes)
                for (m = 0; m < this.svgAreas.length; m++)
                    this.svgAreas[m].translate(-this.minMapX, -this.minMapY);
            this.sourceMapHeight = Math.abs(this.maxMapY - this.minMapY);
            this.sourceMapWidth = Math.abs(this.maxMapX - this.minMapX);
            this.unscaledMapWidth = this.sourceMapWidth * l;
            this.unscaledMapHeight = this.sourceMapHeight * h;
            this.diffY = this.diffX = 0
        },
        fixMapPosition: function() {
            var a = d.degreesToRadians(this.dataProvider.leftLongitude)
              , b = d.degreesToRadians(this.dataProvider.rightLongitude)
              , c = d.degreesToRadians(this.dataProvider.topLatitude)
              , e = d.degreesToRadians(this.dataProvider.bottomLatitude)
              , f = a + (b - a) / 2
              , g = c + (e - c) / 2
              , h = this.dpProjectionFunction(f, c)[1]
              , k = this.dpProjectionFunction(f, e)[1]
              , l = this.dpProjectionFunction(a, g)[0]
              , m = this.dpProjectionFunction(b, g)[0];
            this.sourceMapHeight = this.mapHeight / this.mapScale;
            this.sourceMapWidth = this.mapWidth / this.mapScale;
            this.unscaledMapWidth = (a - b) / (l - m) * this.sourceMapWidth;
            this.unscaledMapHeight = (c - e) / (h - k) * this.sourceMapHeight;
            b = this.coordinatesToXY(d.radiansToDegrees(f), d.radiansToDegrees(c));
            a = this.coordinatesToXY(d.radiansToDegrees(a), d.radiansToDegrees(g));
            c = g = Infinity;
            for (e = 0; e < this.svgAreas.length; e++)
                f = this.svgAreas[e].getBBox(),
                f.y < g && (g = f.y),
                f.x < c && (c = f.x);
            this.diffY = b.y / this.mapScale - g;
            this.diffX = a.x / this.mapScale - c;
            for (e = 0; e < this.svgAreas.length; e++)
                this.svgAreas[e].translate(this.diffX, this.diffY)
        },
        changeProjection: function() {
            this.minMapXX = Infinity;
            this.maxMapXX = -Infinity;
            this.minMapYY = Infinity;
            this.maxMapYY = -Infinity;
            this.projectionChanged = !1;
            for (var a = 0; a < this.svgAreas.length; a++)
                this.redraw(this.svgAreas[a]);
            this.projectionChanged = !0;
            this.resizeMap()
        },
        coordinatesToXY: function(a, b) {
            var c, e;
            c = !1;
            this.dataProvider && (c = this.dataProvider.wrappedLongitudes) && (a = this.recalcLongitude(a));
            this.projectionFunction ? (e = this.projectionFunction(d.degreesToRadians(a), d.degreesToRadians(b)),
            c = this.mapScale * d.roundTo(this.x2c(d.radiansToDegrees(e[0])), 3),
            e = this.mapScale * d.roundTo(this.y2c(d.radiansToDegrees(e[1])), 3)) : (c = this.longitudeToCoordinate(a),
            e = this.latitudeToCoordinate(b));
            return {
                x: c,
                y: e
            }
        },
        coordinatesToStageXY: function(a, b) {
            var c = this.coordinatesToXY(a, b)
              , d = c.x * this.zoomLevel() + this.mapContainer.x
              , c = c.y * this.zoomLevel() + this.mapContainer.y;
            return {
                x: d,
                y: c
            }
        },
        stageXYToCoordinates: function(a, b) {
            var c = this.mapSet.getBBox()
              , d = (a - this.mapContainer.x) / this.zoomLevel() - c.x * this.mapScale
              , c = (b - this.mapContainer.y) / this.zoomLevel() - c.y * this.mapScale;
            return this.xyToCoordinates(d, c)
        },
        xyToCoordinates: function(a, b, c, e, f) {
            var g;
            isNaN(e) && (e = this.mapWidth);
            isNaN(f) && (f = this.mapHeight);
            c || (c = this.projectionFunction);
            if (g = c.invert) {
                var h = this.dataProvider.leftLongitude
                  , k = this.dataProvider.rightLongitude
                  , l = this.dataProvider.topLatitude
                  , m = this.dataProvider.bottomLatitude
                  , n = h + (k - h) / 2
                  , p = l + (m - l) / 2
                  , l = d.radiansToDegrees(c(d.degreesToRadians(n), d.degreesToRadians(l))[1])
                  , m = d.radiansToDegrees(c(d.degreesToRadians(n), d.degreesToRadians(m))[1])
                  , h = d.radiansToDegrees(c(d.degreesToRadians(h), d.degreesToRadians(p))[0])
                  , k = d.radiansToDegrees(c(d.degreesToRadians(k), d.degreesToRadians(p))[0]);
                this.projectionChanged && (l = d.radiansToDegrees(c(d.degreesToRadians(this.topLongLat.longitude), d.degreesToRadians(this.topLongLat.latitude))[1]),
                m = d.radiansToDegrees(c(d.degreesToRadians(this.bottomLongLat.longitude), d.degreesToRadians(this.bottomLongLat.latitude))[1]),
                h = d.radiansToDegrees(c(d.degreesToRadians(this.leftLongLat.longitude), d.degreesToRadians(this.leftLongLat.latitude))[0]),
                k = d.radiansToDegrees(c(d.degreesToRadians(this.rightLongLat.longitude), d.degreesToRadians(this.rightLongLat.latitude))[0]));
                a = d.degreesToRadians(a / e * (k - h) + h);
                b = d.degreesToRadians(b / f * (m - l) + l);
                b = g(a, b);
                g = d.radiansToDegrees(b[0]);
                b = d.radiansToDegrees(b[1])
            } else
                g = this.coordinateToLongitude(a),
                b = this.coordinateToLatitude(b);
            return {
                longitude: d.roundTo(g, 4),
                latitude: d.roundTo(b, 4)
            }
        },
        coordinateToLatitude: function(a, b) {
            var c;
            void 0 === b && (b = this.mapHeight);
            if (this.mapSet) {
                var e = this.dataProvider
                  , f = e.bottomLatitude;
                c = e.topLatitude;
                "mercator" == e.projection ? (e = this.mercatorLatitudeToCoordinate(f),
                c = this.mercatorLatitudeToCoordinate(c),
                c = 2 * d.degreesToRadians(a * (e - c) / b + c),
                c = d.radiansToDegrees(2 * Math.atan(Math.exp(c)) - .5 * Math.PI)) : c = a / b * (f - c) + c
            }
            return Math.round(1E6 * c) / 1E6
        },
        coordinateToLongitude: function(a, b) {
            var c, d = this.dataProvider;
            void 0 === b && (b = this.mapWidth);
            this.mapSet && (c = a / b * (d.rightLongitude - d.leftLongitude) + d.leftLongitude);
            return Math.round(1E6 * c) / 1E6
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.ZoomControl = d.Class({
        construct: function(a) {
            this.cname = "ZoomControl";
            this.panStepSize = .1;
            this.zoomFactor = 2;
            this.maxZoomLevel = 64;
            this.minZoomLevel = 1;
            this.panControlEnabled = !1;
            this.zoomControlEnabled = !0;
            this.buttonRollOverColor = "#DADADA";
            this.buttonFillColor = "#FFFFFF";
            this.buttonFillAlpha = 1;
            this.buttonBorderColor = "#000000";
            this.buttonBorderAlpha = .1;
            this.buttonIconAlpha = this.buttonBorderThickness = 1;
            this.gridColor = this.buttonIconColor = "#000000";
            this.homeIconFile = "homeIcon.gif";
            this.gridBackgroundColor = "#000000";
            this.draggerAlpha = this.gridAlpha = this.gridBackgroundAlpha = 0;
            this.draggerSize = this.buttonSize = 31;
            this.iconSize = 11;
            this.homeButtonEnabled = !0;
            this.buttonCornerRadius = 2;
            this.gridHeight = 5;
            this.roundButtons = !0;
            this.top = this.left = 10;
            d.applyTheme(this, a, this.cname)
        },
        init: function(a, b) {
            var c = this;
            c.chart = a;
            d.remove(c.set);
            var e = b.set();
            d.setCN(a, e, "zoom-control");
            var f = c.buttonSize
              , g = c.zoomControlEnabled
              , h = c.panControlEnabled
              , k = c.buttonFillColor
              , l = c.buttonFillAlpha
              , m = c.buttonBorderThickness
              , n = c.buttonBorderColor
              , p = c.buttonBorderAlpha
              , t = c.buttonCornerRadius
              , r = c.buttonRollOverColor
              , q = c.gridHeight
              , y = c.zoomFactor
              , B = c.minZoomLevel
              , u = c.maxZoomLevel
              , w = c.buttonIconAlpha
              , v = c.buttonIconColor
              , A = c.roundButtons
              , C = a.svgIcons
              , x = a.getX(c.left)
              , z = a.getY(c.top);
            isNaN(c.right) || (x = a.getX(c.right, !0),
            x = h ? x - 3 * f : x - f);
            isNaN(c.bottom) || (z = a.getY(c.bottom, !0),
            g && (z -= q + 3 * f),
            z = h ? z - 3 * f : c.homeButtonEnabled ? z - .5 * f : z + f);
            e.translate(x, z);
            c.previousDY = NaN;
            var F, x = f / 4 - 1;
            if (g) {
                F = b.set();
                d.setCN(a, F, "zoom-control-zoom");
                e.push(F);
                c.set = e;
                c.zoomSet = F;
                5 < q && (g = d.rect(b, f + 6, q + 2 * f + 6, c.gridBackgroundColor, c.gridBackgroundAlpha, 0, "#000000", 0, 4),
                d.setCN(a, g, "zoom-bg"),
                g.translate(-3, -3),
                g.mouseup(function() {
                    c.handleBgUp()
                }).touchend(function() {
                    c.handleBgUp()
                }),
                F.push(g));
                var E = f;
                A && (E = f / 1.5);
                c.draggerSize = E;
                var H = Math.log(u / B) / Math.log(y) + 1;
                1E3 < H && (H = 1E3);
                var g = q / H, G, D = b.set();
                D.translate((f - E) / 2 + 1, 1, NaN, !0);
                F.push(D);
                for (G = 1; G < H; G++)
                    z = f + G * g,
                    z = d.line(b, [1, E - 2], [z, z], c.gridColor, c.gridAlpha, 1),
                    d.setCN(a, z, "zoom-grid"),
                    D.push(z);
                z = new d.SimpleButton;
                z.setDownHandler(c.draggerDown, c);
                z.setClickHandler(c.draggerUp, c);
                z.init(b, E, g, k, l, m, n, p, t, r);
                d.setCN(a, z.set, "zoom-dragger");
                F.push(z.set);
                z.set.setAttr("opacity", c.draggerAlpha);
                c.dragger = z.set;
                c.previousY = NaN;
                z = new d.SimpleButton;
                C ? (E = b.set(),
                H = d.line(b, [-x, x], [0, 0], v, w, 1),
                G = d.line(b, [0, 0], [-x, x], v, w, 1),
                E.push(H),
                E.push(G),
                z.svgIcon = E) : z.setIcon(a.pathToImages + "plus.gif", c.iconSize);
                z.setClickHandler(a.zoomIn, a);
                z.init(b, f, f, k, l, m, n, p, t, r, w, v, A);
                d.setCN(a, z.set, "zoom-in");
                F.push(z.set);
                z = new d.SimpleButton;
                C ? z.svgIcon = d.line(b, [-x, x], [0, 0], v, w, 1) : z.setIcon(a.pathToImages + "minus.gif", c.iconSize);
                z.setClickHandler(a.zoomOut, a);
                z.init(b, f, f, k, l, m, n, p, t, r, w, v, A);
                z.set.translate(0, q + f);
                d.setCN(a, z.set, "zoom-out");
                F.push(z.set);
                q -= g;
                u = Math.log(u / 100) / Math.log(y);
                c.realStepSize = q / (u - Math.log(B / 100) / Math.log(y));
                c.realGridHeight = q;
                c.stepMax = u
            }
            h && (h = b.set(),
            d.setCN(a, h, "zoom-control-pan"),
            e.push(h),
            F && F.translate(f, 4 * f),
            y = new d.SimpleButton,
            C ? y.svgIcon = d.line(b, [x / 5, -x + x / 5, x / 5], [-x, 0, x], v, w, 1) : y.setIcon(a.pathToImages + "panLeft.gif", c.iconSize),
            y.setClickHandler(a.moveLeft, a),
            y.init(b, f, f, k, l, m, n, p, t, r, w, v, A),
            y.set.translate(0, f),
            d.setCN(a, y.set, "pan-left"),
            h.push(y.set),
            y = new d.SimpleButton,
            C ? y.svgIcon = d.line(b, [-x / 5, x - x / 5, -x / 5], [-x, 0, x], v, w, 1) : y.setIcon(a.pathToImages + "panRight.gif", c.iconSize),
            y.setClickHandler(a.moveRight, a),
            y.init(b, f, f, k, l, m, n, p, t, r, w, v, A),
            y.set.translate(2 * f, f),
            d.setCN(a, y.set, "pan-right"),
            h.push(y.set),
            y = new d.SimpleButton,
            C ? y.svgIcon = d.line(b, [-x, 0, x], [x / 5, -x + x / 5, x / 5], v, w, 1) : y.setIcon(a.pathToImages + "panUp.gif", c.iconSize),
            y.setClickHandler(a.moveUp, a),
            y.init(b, f, f, k, l, m, n, p, t, r, w, v, A),
            y.set.translate(f, 0),
            d.setCN(a, y.set, "pan-up"),
            h.push(y.set),
            y = new d.SimpleButton,
            C ? y.svgIcon = d.line(b, [-x, 0, x], [-x / 5, x - x / 5, -x / 5], v, w, 1) : y.setIcon(a.pathToImages + "panDown.gif", c.iconSize),
            y.setClickHandler(a.moveDown, a),
            y.init(b, f, f, k, l, m, n, p, t, r, w, v, A),
            y.set.translate(f, 2 * f),
            d.setCN(a, y.set, "pan-down"),
            h.push(y.set),
            e.push(h));
            c.homeButtonEnabled && (h = new d.SimpleButton,
            C ? h.svgIcon = d.polygon(b, [-x, 0, x, x - 1, x - 1, 2, 2, -2, -2, -x + 1, -x + 1], [0, -x, 0, 0, x - 1, x - 1, 2, 2, x - 1, x - 1, 0], v, w, 1, v, w) : h.setIcon(a.pathToImages + c.homeIconFile, c.iconSize),
            h.setClickHandler(a.goHome, a),
            c.panControlEnabled && (p = l = 0),
            h.init(b, f, f, k, l, m, n, p, t, r, w, v, A),
            c.panControlEnabled ? h.set.translate(f, f) : F && F.translate(0, 1.5 * f),
            d.setCN(a, h.set, "pan-home"),
            e.push(h.set));
            c.update()
        },
        draggerDown: function() {
            this.chart.stopDrag();
            this.isDragging = !0
        },
        draggerUp: function() {
            this.isDragging = !1
        },
        handleBgUp: function() {
            var a = this.chart;
            a.zoomTo(100 * Math.pow(this.zoomFactor, this.stepMax - (a.mouseY - this.zoomSet.y - this.set.y - this.buttonSize - this.realStepSize / 2) / this.realStepSize))
        },
        update: function() {
            var a;
            a = this.zoomFactor;
            var b = this.realStepSize, c = this.stepMax, e = this.dragger, f = this.buttonSize, g, h = this.chart;
            h && (this.isDragging ? (h.stopDrag(),
            g = e.y + (h.mouseY - this.previousY),
            g = d.fitToBounds(g, f, this.realGridHeight + f),
            h.zoomTo(100 * Math.pow(a, c - (g - f) / b), NaN, NaN, !0)) : (a = Math.log(h.zoomLevel() / 100) / Math.log(a),
            g = (c - a) * b + f),
            this.previousY = h.mouseY,
            this.previousDY != g && e && (e.translate((this.buttonSize - this.draggerSize) / 2, g),
            this.previousDY = g))
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.SimpleButton = d.Class({
        construct: function() {},
        init: function(a, b, c, e, f, g, h, k, l, m, n, p, t) {
            var r = this;
            r.rollOverColor = m;
            r.color = e;
            r.container = a;
            m = a.set();
            r.set = m;
            t ? (b /= 2,
            e = d.circle(a, b, e, f, g, h, k),
            e.translate(b, b)) : e = d.rect(a, b, c, e, f, g, h, k, l);
            m.push(e);
            f = r.iconPath;
            var q;
            f && (q = r.iconSize,
            g = (b - q) / 2,
            t && (g = (2 * b - q) / 2),
            q = a.image(f, g, (c - q) / 2, q, q));
            r.svgIcon && (q = r.svgIcon,
            t ? q.translate(b, b) : q.translate(b / 2, b / 2));
            m.setAttr("cursor", "pointer");
            q && (m.push(q),
            q.setAttr("opacity", n),
            q.node.style.pointerEvents = "none");
            e.mousedown(function() {
                r.handleDown()
            }).touchstart(function() {
                r.handleDown()
            }).mouseup(function() {
                r.handleUp()
            }).touchend(function() {
                r.handleUp()
            }).mouseover(function() {
                r.handleOver()
            }).mouseout(function() {
                r.handleOut()
            });
            r.bg = e
        },
        setIcon: function(a, b) {
            this.iconPath = a;
            this.iconSize = b
        },
        setClickHandler: function(a, b) {
            this.clickHandler = a;
            this.scope = b
        },
        setDownHandler: function(a, b) {
            this.downHandler = a;
            this.scope = b
        },
        handleUp: function() {
            var a = this.clickHandler;
            a && a.call(this.scope)
        },
        handleDown: function() {
            var a = this.downHandler;
            a && a.call(this.scope)
        },
        handleOver: function() {
            this.container.chart.skipClick = !0;
            this.bg.setAttr("fill", this.rollOverColor)
        },
        handleOut: function() {
            this.container.chart.skipClick = !1;
            this.bg.setAttr("fill", this.color)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.SmallMap = d.Class({
        construct: function(a) {
            this.cname = "SmallMap";
            this.mapColor = "#e6e6e6";
            this.rectangleColor = "#FFFFFF";
            this.top = this.right = 10;
            this.minimizeButtonWidth = 23;
            this.backgroundColor = "#9A9A9A";
            this.backgroundAlpha = 1;
            this.borderColor = "#FFFFFF";
            this.iconColor = "#000000";
            this.borderThickness = 3;
            this.borderAlpha = 1;
            this.size = .2;
            this.enabled = !0;
            d.applyTheme(this, a, this.cname)
        },
        init: function(a, b) {
            var c = this;
            if (c.enabled) {
                c.chart = a;
                c.container = b;
                c.width = a.realWidth * c.size;
                c.height = a.realHeight * c.size;
                d.remove(c.mapSet);
                d.remove(c.allSet);
                d.remove(c.set);
                var e = b.set();
                c.set = e;
                d.setCN(a, e, "small-map");
                var f = b.set();
                c.allSet = f;
                e.push(f);
                c.buildSVGMap();
                var g = c.borderThickness
                  , h = c.borderColor
                  , k = d.rect(b, c.width + g, c.height + g, c.backgroundColor, c.backgroundAlpha, g, h, c.borderAlpha);
                d.setCN(a, k, "small-map-bg");
                k.translate(-g / 2, -g / 2);
                f.push(k);
                k.toBack();
                var l, m, k = c.minimizeButtonWidth, n = new d.SimpleButton, p = k / 2;
                a.svgIcons ? n.svgIcon = d.line(b, [-p / 2, 0, p / 2], [-p / 4, p / 4, -p / 4], c.iconColor, 1, 1) : n.setIcon(a.pathToImages + "arrowDown.gif", k);
                n.setClickHandler(c.minimize, c);
                n.init(b, k, k, h, 1, 1, h, 1);
                d.setCN(a, n.set, "small-map-down");
                n = n.set;
                c.downButtonSet = n;
                e.push(n);
                var t = new d.SimpleButton;
                a.svgIcons ? t.svgIcon = d.line(b, [-p / 2, 0, p / 2], [p / 4, -p / 4, p / 4], c.iconColor, 1, 1) : t.setIcon(a.pathToImages + "arrowUp.gif", k);
                t.setClickHandler(c.maximize, c);
                t.init(b, k, k, h, 1, 1, h, 1);
                d.setCN(a, t.set, "small-map-up");
                h = t.set;
                c.upButtonSet = h;
                h.hide();
                e.push(h);
                var r, q;
                isNaN(c.top) || (l = a.getY(c.top) + g,
                q = 0);
                isNaN(c.bottom) || (l = a.getY(c.bottom, !0) - c.height - g,
                q = c.height - k + g / 2);
                isNaN(c.left) || (m = a.getX(c.left) + g,
                r = -g / 2);
                isNaN(c.right) || (m = a.getX(c.right, !0) - c.width - g,
                r = c.width - k + g / 2);
                g = b.set();
                g.clipRect(1, 1, c.width, c.height);
                f.push(g);
                c.rectangleC = g;
                e.translate(m, l);
                n.translate(r, q);
                h.translate(r, q);
                f.mouseup(function() {
                    c.handleMouseUp()
                });
                c.drawRectangle()
            } else
                d.remove(c.allSet),
                d.remove(c.downButtonSet),
                d.remove(c.upButtonSet)
        },
        minimize: function() {
            this.downButtonSet.hide();
            this.upButtonSet.show();
            this.allSet.hide()
        },
        maximize: function() {
            this.downButtonSet.show();
            this.upButtonSet.hide();
            this.allSet.show()
        },
        buildSVGMap: function() {
            var a = this.chart
              , b = {
                fill: this.mapColor,
                stroke: this.mapColor,
                "stroke-opacity": 1
            }
              , c = this.container
              , e = c.set();
            d.setCN(a, e, "small-map-image");
            var f;
            for (f = 0; f < a.svgAreas.length; f++) {
                var g = c.path(a.svgAreas[f].path).attr(b);
                e.push(g)
            }
            this.allSet.push(e);
            b = e.getBBox();
            c = this.size * a.mapScale;
            f = -b.x * c;
            var g = -b.y * c
              , h = 0
              , k = 0;
            a.centerMap && (h = (this.width - b.width * c) / 2,
            k = (this.height - b.height * c) / 2);
            this.mapWidth = b.width * c;
            this.mapHeight = b.height * c;
            f += h;
            g += k;
            this.dx = h;
            this.dy = k;
            e.translate(f, g, c);
            this.mapSet = e;
            this.mapX = f;
            this.mapY = g
        },
        update: function() {
            var a = this.chart;
            if (a) {
                var b = a.zoomLevel()
                  , c = this.width
                  , d = this.height
                  , f = c / (a.realWidth * b)
                  , g = a.mapContainer.getBBox()
                  , c = c / b
                  , d = d / b
                  , h = this.rectangle;
                h.translate(-(a.mapContainer.x + g.x * b) * f + this.dx, -(a.mapContainer.y + g.y * b) * f + this.dy);
                0 < c && 0 < d && (h.setAttr("width", Math.ceil(c + 1)),
                h.setAttr("height", Math.ceil(d + 1)));
                this.rWidth = c;
                this.rHeight = d
            }
        },
        drawRectangle: function() {
            var a = this.rectangle;
            d.remove(a);
            a = d.rect(this.container, 10, 10, "#000", 0, 1, this.rectangleColor, 1);
            d.setCN(this.chart, a, "small-map-rectangle");
            this.rectangleC.push(a);
            this.rectangle = a
        },
        handleMouseUp: function() {
            var a = this.chart
              , b = a.zoomLevel();
            a.zoomToMapXY(b, (a.mouseX - this.set.x - this.mapX) / this.size + a.diffX * a.mapScale, (a.mouseY - this.set.y - this.mapY) / this.size + a.diffY * a.mapScale)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.AreasProcessor = d.Class({
        construct: function(a) {
            this.chart = a
        },
        process: function(a) {
            this.updateAllAreas();
            this.allObjects = [];
            a = a.areas;
            var b = this.chart;
            b.outlines = [];
            var c = a.length, d, f, g = 0, h = !1, k = !1, l = 0;
            for (d = 0; d < c; d++)
                if (f = a[d],
                f = f.value,
                !isNaN(f)) {
                    if (!1 === h || h < f)
                        h = f;
                    if (!1 === k || k > f)
                        k = f;
                    g += Math.abs(f);
                    l++
                }
            this.minValue = k;
            this.maxValue = h;
            isNaN(b.minValue) || (this.minValue = b.minValue);
            isNaN(b.maxValue) || (this.maxValue = b.maxValue);
            b.maxValueReal = h;
            b.minValueReal = k;
            for (d = 0; d < c; d++)
                f = a[d],
                isNaN(f.value) ? f.percents = void 0 : (f.percents = (f.value - k) / g * 100,
                k == h && (f.percents = 100));
            for (d = 0; d < c; d++)
                f = a[d],
                this.createArea(f);
            b.outlinesToFront()
        },
        updateAllAreas: function() {
            var a = this.chart, b = a.areasSettings, c = b.unlistedAreasColor, e = b.unlistedAreasAlpha, f = b.unlistedAreasOutlineColor, g = b.unlistedAreasOutlineAlpha, h = a.svgAreas, k = a.dataProvider, l = k.areas, m = {}, n;
            for (n = 0; n < l.length; n++)
                m[l[n].id] = l[n];
            for (n = 0; n < h.length; n++) {
                l = h[n];
                if (b.preserveOriginalAttributes) {
                    if (l.customAttr)
                        for (var p in l.customAttr)
                            l.setAttr(p, l.customAttr[p])
                } else {
                    void 0 != c && l.setAttr("fill", c);
                    isNaN(e) || l.setAttr("fill-opacity", e);
                    void 0 != f && l.setAttr("stroke", f);
                    isNaN(g) || l.setAttr("stroke-opacity", g);
                    var t = b.outlineThickness;
                    b.adjustOutlineThickness && (t = t / a.zoomLevel() / a.mapScale);
                    l.setAttr("stroke-width", t)
                }
                d.setCN(a, l, "map-area-unlisted");
                k.getAreasFromMap && !m[l.id] && (t = new d.MapArea(a.theme),
                t.parentObject = k,
                t.id = l.id,
                t.outline = l.outline,
                k.areas.push(t))
            }
        },
        createArea: function(a) {
            var b = this.chart
              , c = b.svgAreasById[a.id]
              , e = b.areasSettings;
            if (c && c.className) {
                var f = b.areasClasses[c.className];
                f && (e = d.processObject(f, d.AreasSettings, b.theme))
            }
            var g = e.color
              , h = e.alpha
              , k = e.outlineThickness
              , l = e.rollOverColor
              , m = e.selectedColor
              , n = e.rollOverAlpha
              , p = e.rollOverBrightness
              , t = e.outlineColor
              , r = e.outlineAlpha
              , q = e.balloonText
              , y = e.selectable
              , B = e.pattern
              , u = e.rollOverOutlineColor
              , w = e.bringForwardOnHover
              , v = e.preserveOriginalAttributes;
            this.allObjects.push(a);
            a.chart = b;
            a.baseSettings = e;
            a.autoZoomReal = void 0 == a.autoZoom ? e.autoZoom : a.autoZoom;
            f = a.color;
            void 0 == f && (f = g);
            var A = a.alpha;
            isNaN(A) && (A = h);
            h = a.rollOverAlpha;
            isNaN(h) && (h = n);
            isNaN(h) && (h = A);
            n = a.rollOverColor;
            void 0 == n && (n = l);
            l = a.pattern;
            void 0 == l && (l = B);
            B = a.selectedColor;
            void 0 == B && (B = m);
            m = a.balloonText;
            void 0 === m && (m = q);
            void 0 == e.colorSolid || isNaN(a.value) || (q = Math.floor((a.value - this.minValue) / ((this.maxValue - this.minValue) / b.colorSteps)),
            q == b.colorSteps && q--,
            q *= 1 / (b.colorSteps - 1),
            this.maxValue == this.minValue && (q = 1),
            a.colorReal = d.getColorFade(f, e.colorSolid, q));
            void 0 != a.color && (a.colorReal = a.color);
            void 0 == a.selectable && (a.selectable = y);
            void 0 == a.colorReal && (a.colorReal = g);
            g = a.outlineColor;
            void 0 == g && (g = t);
            t = a.outlineAlpha;
            isNaN(t) && (t = r);
            r = a.outlineThickness;
            isNaN(r) && (r = k);
            k = a.rollOverOutlineColor;
            void 0 == k && (k = u);
            u = a.rollOverBrightness;
            void 0 == u && (u = p);
            void 0 == a.bringForwardOnHover && (a.bringForwardOnHover = w);
            void 0 == a.preserveOriginalAttributes && (a.preserveOriginalAttributes = v);
            isNaN(e.selectedBrightness) || (B = d.adjustLuminosity(a.colorReal, e.selectedBrightness / 100));
            a.alphaReal = A;
            a.rollOverColorReal = n;
            a.rollOverAlphaReal = h;
            a.balloonTextReal = m;
            a.selectedColorReal = B;
            a.outlineColorReal = g;
            a.outlineAlphaReal = t;
            a.rollOverOutlineColorReal = k;
            a.outlineThicknessReal = r;
            a.patternReal = l;
            a.rollOverBrightnessReal = u;
            a.accessibleLabel || (a.accessibleLabel = e.accessibleLabel);
            d.processDescriptionWindow(e, a);
            if (c && (p = c.area,
            w = c.title,
            a.enTitle = c.title,
            w && !a.title && (a.title = w),
            (c = b.language) ? (w = d.mapTranslations) && (c = w[c]) && c[a.enTitle] && (a.titleTr = c[a.enTitle]) : a.titleTr = void 0,
            p)) {
                c = a.tabIndex;
                void 0 === c && (c = e.tabIndex);
                void 0 !== c && p.setAttr("tabindex", c);
                a.displayObject = p;
                a.outline && (A = 0,
                a.alphaReal = 0,
                a.rollOverAlphaReal = 0,
                a.mouseEnabled = !1,
                b.outlines.push(p),
                p.node.setAttribute("pointer-events", "none"));
                a.mouseEnabled && b.addObjectEventListeners(p, a);
                var C;
                void 0 != f && (C = f);
                void 0 != a.colorReal && (C = a.showAsSelected || b.selectedObject == a ? a.selectedColorReal : a.colorReal);
                p.node.setAttribute("class", "");
                d.setCN(b, p, "map-area");
                d.setCN(b, p, "map-area-" + p.id);
                e.adjustOutlineThickness && (r = r / b.zoomLevel() / b.mapScale);
                a.preserveOriginalAttributes || (p.setAttr("fill", C),
                p.setAttr("stroke", g),
                p.setAttr("stroke-opacity", t),
                p.setAttr("stroke-width", r),
                p.setAttr("fill-opacity", A));
                b.makeObjectAccessible(a);
                l && p.pattern(l, b.mapScale, b.path);
                a.hidden && p.hide()
            }
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.AreasSettings = d.Class({
        construct: function(a) {
            this.cname = "AreasSettings";
            this.alpha = 1;
            this.autoZoom = !1;
            this.balloonText = "[[title]]";
            this.color = "#FFCC00";
            this.colorSolid = "#990000";
            this.unlistedAreasAlpha = 1;
            this.unlistedAreasColor = "#DDDDDD";
            this.outlineColor = "#FFFFFF";
            this.outlineThickness = this.outlineAlpha = 1;
            this.selectedColor = this.rollOverOutlineColor = "#CC0000";
            this.unlistedAreasOutlineColor = "#FFFFFF";
            this.unlistedAreasOutlineAlpha = 1;
            this.descriptionWindowWidth = 250;
            this.bringForwardOnHover = this.adjustOutlineThickness = !0;
            this.accessibleLabel = "[[title]] [[value]] [[description]]";
            d.applyTheme(this, a, this.cname)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.ImagesProcessor = d.Class({
        construct: function(a) {
            this.chart = a;
            this.reset()
        },
        process: function(a) {
            var b = a.images, c;
            for (c = 0; c < b.length; c++) {
                var d = b[c];
                this.createImage(d, c);
                d.parentArray = b
            }
            this.counter = c;
            a.parentObject && a.remainVisible && this.process(a.parentObject)
        },
        createImage: function(a, b) {
            a = d.processObject(a, d.MapImage);
            a.arrays = [];
            isNaN(b) && (this.counter++,
            b = this.counter);
            var c = this.chart
              , e = c.container
              , f = c.mapImagesContainer
              , g = c.stageImagesContainer
              , h = c.imagesSettings;
            a.remove && a.remove();
            var k = h.color
              , l = h.alpha
              , m = h.rollOverColor
              , n = h.rollOverOutlineColor
              , p = h.selectedColor
              , t = h.balloonText
              , r = h.outlineColor
              , q = h.outlineAlpha
              , y = h.outlineThickness
              , B = h.selectedScale
              , u = h.rollOverScale
              , w = h.selectable
              , v = h.labelPosition
              , A = h.labelColor
              , C = h.labelFontSize
              , x = h.bringForwardOnHover
              , z = h.labelRollOverColor
              , F = h.rollOverBrightness
              , E = h.selectedLabelColor;
            a.index = b;
            a.chart = c;
            a.baseSettings = c.imagesSettings;
            var H = e.set();
            a.displayObject = H;
            var G = a.color;
            void 0 == G && (G = k);
            k = a.alpha;
            isNaN(k) && (k = l);
            void 0 == a.bringForwardOnHover && (a.bringForwardOnHover = x);
            l = a.outlineAlpha;
            isNaN(l) && (l = q);
            q = a.rollOverColor;
            void 0 == q && (q = m);
            m = a.selectedColor;
            void 0 == m && (m = p);
            p = a.balloonText;
            void 0 === p && (p = t);
            t = a.outlineColor;
            void 0 == t && (t = r);
            a.outlineColorReal = t;
            r = a.outlineThickness;
            isNaN(r) && (r = y);
            (y = a.labelPosition) || (y = v);
            v = a.labelColor;
            void 0 == v && (v = A);
            A = a.labelRollOverColor;
            void 0 == A && (A = z);
            z = a.selectedLabelColor;
            void 0 == z && (z = E);
            E = a.labelFontSize;
            isNaN(E) && (E = C);
            C = a.selectedScale;
            isNaN(C) && (C = B);
            B = a.rollOverScale;
            isNaN(B) && (B = u);
            u = a.rollOverBrightness;
            void 0 == u && (u = F);
            void 0 == a.selectable && (a.selectable = w);
            a.colorReal = G;
            isNaN(h.selectedBrightness) || (m = d.adjustLuminosity(a.colorReal, h.selectedBrightness / 100));
            a.alphaReal = k;
            a.rollOverColorReal = q;
            a.balloonTextReal = p;
            a.selectedColorReal = m;
            a.labelColorReal = v;
            a.labelRollOverColorReal = A;
            a.selectedLabelColorReal = z;
            a.labelFontSizeReal = E;
            a.labelPositionReal = y;
            a.selectedScaleReal = C;
            a.rollOverScaleReal = B;
            a.rollOverOutlineColorReal = n;
            a.rollOverBrightnessReal = u;
            a.accessibleLabel || (a.accessibleLabel = h.accessibleLabel);
            d.processDescriptionWindow(h, a);
            a.centeredReal = void 0 == a.centered ? h.centered : a.centered;
            n = a.type;
            u = a.imageURL;
            B = a.svgPath;
            C = a.width;
            E = a.height;
            w = a.scale;
            isNaN(a.percentWidth) || (C = a.percentWidth / 100 * c.realWidth);
            isNaN(a.percentHeight) || (E = a.percentHeight / 100 * c.realHeight);
            var D;
            u || n || B || (n = "circle",
            C = 1,
            l = k = 0);
            q = F = 0;
            h = a.selectedColorReal;
            if (n) {
                isNaN(C) && (C = 10);
                isNaN(E) && (E = 10);
                "kilometers" == a.widthAndHeightUnits && (C = c.kilometersToPixels(a.width),
                E = c.kilometersToPixels(a.height));
                "miles" == a.widthAndHeightUnits && (C = c.milesToPixels(a.width),
                E = c.milesToPixels(a.height));
                if ("circle" == n || "bubble" == n)
                    E = C;
                D = this.createPredefinedImage(G, t, r, n, C, E);
                q = F = 0;
                a.centeredReal ? (isNaN(a.right) || (F = C * w),
                isNaN(a.bottom) || (q = E * w)) : (F = C * w / 2,
                q = E * w / 2);
                D.translate(F, q, w, !0)
            } else
                u ? (isNaN(C) && (C = 10),
                isNaN(E) && (E = 10),
                D = e.image(u, 0, 0, C, E),
                D.node.setAttribute("preserveAspectRatio", "none"),
                D.setAttr("opacity", k),
                a.centeredReal && (F = isNaN(a.right) ? -C / 2 : C / 2,
                q = isNaN(a.bottom) ? -E / 2 : E / 2,
                D.translate(F, q, NaN, !0))) : B && (D = e.path(B),
                u = D.getBBox(),
                a.centeredReal ? (F = -u.x * w - u.width * w / 2,
                isNaN(a.right) || (F = -F),
                q = -u.y * w - u.height * w / 2,
                isNaN(a.bottom) || (q = -q)) : F = q = 0,
                D.translate(F, q, w, !0),
                D.x = F,
                D.y = q);
            D && (H.push(D),
            a.image = D,
            D.setAttr("stroke-opacity", l),
            D.setAttr("stroke-width", r),
            D.setAttr("stroke", t),
            D.setAttr("fill-opacity", k),
            "bubble" != n && D.setAttr("fill", G),
            d.setCN(c, D, "map-image"),
            void 0 != a.id && d.setCN(c, D, "map-image-" + a.id));
            G = a.labelColorReal;
            !a.showAsSelected && c.selectedObject != a || void 0 == h || (D.setAttr("fill", h),
            G = a.selectedLabelColorReal);
            D = null;
            void 0 !== a.label && (D = d.text(e, a.label, G, c.fontFamily, a.labelFontSizeReal, a.labelAlign),
            d.setCN(c, D, "map-image-label"),
            void 0 !== a.id && d.setCN(c, D, "map-image-label-" + a.id),
            G = a.labelBackgroundAlpha,
            (k = a.labelBackgroundColor) && 0 < G && (l = D.getBBox(),
            e = d.rect(e, l.width + 16, l.height + 10, k, G),
            d.setCN(c, e, "map-image-label-background"),
            void 0 != a.id && d.setCN(c, e, "map-image-label-background-" + a.id),
            H.push(e),
            a.labelBG = e),
            a.imageLabel = D,
            H.push(D),
            d.setCN(c, H, "map-image-container"),
            void 0 != a.id && d.setCN(c, H, "map-image-container-" + a.id),
            this.labelsToReposition.push(a),
            a.arrays.push({
                arr: this.labelsToReposition,
                el: a
            }));
            e = isNaN(a.latitude) || isNaN(a.longitude) ? !0 : !1;
            a.lineId && (D = this.chart.getObjectById(a.lineId)) && 0 < D.longitudes.length && (e = !1);
            e ? g.push(H) : f.push(H);
            H && (H.rotation = a.rotation,
            isNaN(a.rotation) || H.rotate(a.rotation),
            a.arrays.push({
                arr: this.allSvgObjects,
                el: H
            }),
            this.allSvgObjects.push(H));
            this.allObjects.push(a);
            c.makeObjectAccessible(a);
            f = a.tabIndex;
            void 0 === f && (f = c.imagesSettings.tabIndex);
            void 0 !== f && H.setAttr("tabindex", f);
            a.arrays.push({
                arr: this.allObjects,
                el: a
            });
            isNaN(a.longitude) || isNaN(a.latitude) || !a.fixedSize || (a.objToResize = {
                image: H,
                mapImage: a,
                scale: 1
            },
            this.objectsToResize.push(a.objToResize),
            a.arrays.push({
                arr: this.objectsToResize,
                el: a.objToResize
            }));
            this.updateSizeAndPosition(a);
            a.mouseEnabled && c.addObjectEventListeners(H, a);
            a.hidden && H.hide();
            d.removeFromArray(c.updatableImages, a);
            a.animateAlongLine && (c.updatableImages.push(a),
            a.delayAnimateAlong());
            return a
        },
        updateSizeAndPosition: function(a) {
            var b = this.chart, c = a.displayObject, e = b.getX(a.left), f = b.getY(a.top), g, h = a.image.getBBox();
            isNaN(a.right) || (e = b.getX(a.right, !0) - h.width * a.scale);
            isNaN(a.bottom) || (f = b.getY(a.bottom, !0) - h.height * a.scale);
            var k = a.longitude, l = a.latitude, m = a.positionOnLine, h = a.imageLabel, n = this.chart.zoomLevel(), p, t;
            a.lineId && (a.line = this.chart.getObjectById(a.lineId));
            if (a.line && a.line.getCoordinates) {
                a.line.chart = b;
                var r = a.line.getCoordinates(m, a.lineSegment);
                r && (k = b.coordinateToLongitude(r.x),
                l = b.coordinateToLatitude(r.y),
                p = r.x,
                t = r.y,
                a.animateAngle && (g = d.radiansToDegrees(r.angle)))
            }
            isNaN(g) || c.rotate(g + a.extraAngle);
            if (!isNaN(e) && !isNaN(f))
                c.translate(e, f, NaN, !0);
            else if (!isNaN(l) && !isNaN(k))
                if (f = b.coordinatesToXY(k, l),
                e = f.x,
                f = f.y,
                isNaN(p) || (e = p),
                isNaN(t) || (f = t),
                a.fixedSize) {
                    p = a.positionScale;
                    isNaN(p) ? p = 0 : (--p,
                    p *= 1 - 2 * Math.abs(m - .5));
                    if (m = a.objectToResize)
                        m.scale = 1 + p;
                    c.translate(e, f, 1 / n + p, !0)
                } else
                    c.translate(e, f, NaN, !0);
            this.positionLabel(h, a, a.labelPositionReal)
        },
        positionLabel: function(a, b, c) {
            if (a) {
                var d = b.image
                  , f = 0
                  , g = 0
                  , h = 0
                  , k = 0;
                d && (k = d.getBBox(),
                g = d.y + k.y,
                f = d.x + k.x,
                h = k.width,
                k = k.height,
                b.svgPath && (h *= b.scale,
                k *= b.scale));
                var d = a.getBBox()
                  , l = d.width
                  , m = d.height;
                "right" == c && (f += h + l / 2 + 5,
                g += k / 2 - 2);
                "left" == c && (f += -l / 2 - 5,
                g += k / 2 - 2);
                "top" == c && (g -= m / 2 + 3,
                f += h / 2);
                "bottom" == c && (g += k + m / 2,
                f += h / 2);
                "middle" == c && (f += h / 2,
                g += k / 2);
                a.translate(f + b.labelShiftX, g + b.labelShiftY, NaN, !0);
                a = b.labelFontSizeReal;
                b.labelBG && b.labelBG.translate(f - d.width / 2 + b.labelShiftX - 9, g - a / 2 + b.labelShiftY - 4, NaN, !0)
            }
        },
        createPredefinedImage: function(a, b, c, e, f, g) {
            var h = this.chart.container, k;
            switch (e) {
            case "circle":
                k = d.circle(h, f / 2, a, 1, c, b, 1);
                break;
            case "rectangle":
                k = d.polygon(h, [-f / 2, f / 2, f / 2, -f / 2], [g / 2, g / 2, -g / 2, -g / 2], a, 1, c, b, 1, 0, !0);
                break;
            case "bubble":
                k = d.circle(h, f / 2, a, 1, c, b, 1, !0);
                break;
            case "hexagon":
                f /= Math.sqrt(3),
                k = d.polygon(h, [.866 * f, 0 * f, -.866 * f, -.866 * f, 0 * f, .866 * f], [.5 * f, 1 * f, .5 * f, -.5 * f, -1 * f, -.5 * f], a, 1, c, b, 1)
            }
            return k
        },
        reset: function() {
            this.objectsToResize = [];
            this.allSvgObjects = [];
            this.allObjects = [];
            this.allLabels = [];
            this.labelsToReposition = []
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.ImagesSettings = d.Class({
        construct: function(a) {
            this.cname = "ImagesSettings";
            this.balloonText = "[[title]]";
            this.alpha = 1;
            this.borderAlpha = 0;
            this.borderThickness = 1;
            this.labelPosition = "right";
            this.labelColor = "#000000";
            this.labelFontSize = 11;
            this.color = "#000000";
            this.labelRollOverColor = "#00CC00";
            this.centered = !0;
            this.rollOverScale = this.selectedScale = 1;
            this.descriptionWindowWidth = 250;
            this.bringForwardOnHover = !0;
            this.outlineColor = "transparent";
            this.adjustAnimationSpeed = !1;
            this.baseAnimationDistance = 500;
            this.pauseDuration = 0;
            this.easingFunction = d.easeInOutQuad;
            this.animationDuration = 3;
            this.positionScale = 1;
            this.accessibleLabel = "[[title]] [[description]]";
            d.applyTheme(this, a, this.cname)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.LinesProcessor = d.Class({
        construct: function(a) {
            this.chart = a;
            this.reset()
        },
        process: function(a) {
            var b = a.lines, c;
            for (c = 0; c < b.length; c++) {
                var d = b[c];
                this.createLine(d, c);
                d.parentArray = b
            }
            this.counter = c;
            a.parentObject && a.remainVisible && this.process(a.parentObject)
        },
        createLine: function(a, b) {
            a = d.processObject(a, d.MapLine);
            isNaN(b) && (this.counter++,
            b = this.counter);
            a.index = b;
            a.remove && a.remove();
            var c = this.chart
              , e = c.linesSettings
              , f = this.objectsToResize
              , g = c.mapLinesContainer
              , h = c.stageLinesContainer
              , k = e.thickness
              , l = e.dashLength
              , m = e.arrow
              , n = e.arrowSize
              , p = e.arrowColor
              , t = e.arrowAlpha
              , r = e.color
              , q = e.alpha
              , y = e.rollOverColor
              , B = e.selectedColor
              , u = e.rollOverAlpha
              , w = e.balloonText
              , v = e.bringForwardOnHover
              , A = e.arc
              , C = e.rollOverBrightness
              , x = c.container;
            a.chart = c;
            a.baseSettings = e;
            var z = x.set();
            a.displayObject = z;
            var F = a.tabIndex;
            void 0 === F && (F = e.tabIndex);
            void 0 !== F && z.setAttr("tabindex", F);
            this.allSvgObjects.push(z);
            a.arrays.push({
                arr: this.allSvgObjects,
                el: z
            });
            this.allObjects.push(a);
            a.arrays.push({
                arr: this.allObjects,
                el: a
            });
            a.mouseEnabled && c.addObjectEventListeners(z, a);
            if (a.remainVisible || c.selectedObject == a.parentObject) {
                F = a.thickness;
                isNaN(F) && (F = k);
                k = a.dashLength;
                isNaN(k) && (k = l);
                l = a.color;
                void 0 == l && (l = r);
                r = a.alpha;
                isNaN(r) && (r = q);
                q = a.rollOverAlpha;
                isNaN(q) && (q = u);
                isNaN(q) && (q = r);
                u = a.rollOverColor;
                void 0 == u && (u = y);
                y = a.selectedColor;
                void 0 == y && (y = B);
                B = a.balloonText;
                void 0 === B && (B = w);
                w = a.arc;
                isNaN(w) && (w = A);
                A = a.arrow;
                if (!A || "none" == A && "none" != m)
                    A = m;
                m = a.arrowColor;
                void 0 == m && (m = p);
                void 0 == m && (m = l);
                p = a.arrowAlpha;
                isNaN(p) && (p = t);
                isNaN(p) && (p = r);
                t = a.arrowSize;
                isNaN(t) && (t = n);
                n = a.rollOverBrightness;
                void 0 == n && (n = C);
                a.colorReal = l;
                a.arrowColor = m;
                isNaN(e.selectedBrightness) || (y = d.adjustLuminosity(a.colorReal, e.selectedBrightness / 100));
                a.alphaReal = r;
                a.rollOverColorReal = u;
                a.rollOverAlphaReal = q;
                a.balloonTextReal = B;
                a.selectedColorReal = y;
                a.thicknessReal = F;
                a.rollOverBrightnessReal = n;
                a.accessibleLabel || (a.accessibleLabel = e.accessibleLabel);
                void 0 === a.shiftArrow && (a.shiftArrow = e.shiftArrow);
                void 0 == a.bringForwardOnHover && (a.bringForwardOnHover = v);
                d.processDescriptionWindow(e, a);
                v = this.processCoordinates(a.x, c.realWidth);
                C = this.processCoordinates(a.y, c.realHeight);
                n = a.longitudes;
                e = a.latitudes;
                q = n.length;
                if (0 < q)
                    for (v = [],
                    C = [],
                    u = 0; u < q; u++)
                        B = c.coordinatesToXY(n[u], e[u]),
                        v.push(B.x),
                        C.push(B.y);
                if (0 < v.length) {
                    a.segments = v.length;
                    d.dx = 0;
                    d.dy = 0;
                    var E, H, G, q = 10 * (1 - Math.abs(w));
                    10 <= q && (q = NaN);
                    1 > q && (q = 1);
                    a.arcRadius = [];
                    a.distances = [];
                    n = c.mapContainer.scale;
                    if (isNaN(q)) {
                        for (q = 0; q < v.length - 1; q++)
                            H = Math.sqrt(Math.pow(v[q + 1] - v[q], 2) + Math.pow(C[q + 1] - C[q], 2)),
                            a.distances[q] = H;
                        q = d.line(x, v, C, l, 1, F / n, k, !1, !1, !0);
                        l = d.line(x, v, C, l, .001, 5 / n, k, !1, !1, !0);
                        q.setAttr("stroke-linecap", "round")
                    } else {
                        u = 1;
                        0 > w && (u = 0);
                        B = {
                            fill: "none",
                            stroke: l,
                            "stroke-opacity": 1,
                            "stroke-width": F / n,
                            "fill-opacity": 0,
                            "stroke-linecap": "round"
                        };
                        void 0 !== k && 0 < k && (B["stroke-dasharray"] = k);
                        for (var k = "", D = 0; D < v.length - 1; D++) {
                            var K = v[D]
                              , J = v[D + 1]
                              , L = C[D]
                              , O = C[D + 1];
                            H = Math.sqrt(Math.pow(J - K, 2) + Math.pow(O - L, 2));
                            G = H / 2 * q;
                            E = 270 + 180 * Math.acos(H / 2 / G) / Math.PI;
                            isNaN(E) && (E = 270);
                            if (K < J) {
                                var P = K
                                  , K = J
                                  , J = P
                                  , P = L
                                  , L = O
                                  , O = P;
                                E = -E
                            }
                            0 < w && (E = -E);
                            k += "M" + K + "," + L + "A" + G + "," + G + ",0,0," + u + "," + J + "," + O;
                            a.arcRadius[D] = G;
                            a.distances[D] = H
                        }
                        q = x.path(k).attr(B);
                        l = x.path(k).attr({
                            "fill-opacity": 0,
                            stroke: l,
                            "stroke-width": 5 / n,
                            "stroke-opacity": .001,
                            fill: "none"
                        })
                    }
                    d.setCN(c, q, "map-line");
                    void 0 != a.id && d.setCN(c, q, "map-line-" + a.id);
                    d.dx = .5;
                    d.dy = .5;
                    z.push(q);
                    z.push(l);
                    q.setAttr("opacity", r);
                    if ("none" != A) {
                        var I, M, N;
                        if ("end" == A || "both" == A)
                            u = v[v.length - 1],
                            D = C[C.length - 1],
                            1 < v.length ? (B = v[v.length - 2],
                            I = C[C.length - 2]) : (B = u,
                            I = D),
                            I = 180 * Math.atan((D - I) / (u - B)) / Math.PI,
                            isNaN(E) || (I += E),
                            M = u,
                            N = D,
                            I = 0 > u - B ? I - 90 : I + 90;
                        r = [-t / 2 - .5, -.5, t / 2 - .5];
                        k = [t, -.5, t];
                        a.shiftArrow && "middle" != A && (k = [0, 1.2 * -t, 0]);
                        "both" == A && (t = d.polygon(x, r, k, m, p, 1, m, p, void 0, !0),
                        z.push(t),
                        t.translate(M, N, 1 / n, !0),
                        isNaN(I) || t.rotate(I),
                        d.setCN(c, q, "map-line-arrow"),
                        void 0 != a.id && d.setCN(c, q, "map-line-arrow-" + a.id),
                        a.fixedSize && f.push(t));
                        if ("start" == A || "both" == A)
                            t = v[0],
                            N = C[0],
                            1 < v.length ? (u = v[1],
                            M = C[1]) : (u = t,
                            M = N),
                            I = 180 * Math.atan((N - M) / (t - u)) / Math.PI,
                            isNaN(E) || (I -= E),
                            M = t,
                            I = 0 > t - u ? I - 90 : I + 90;
                        "middle" == A && (u = v[v.length - 1],
                        D = C[C.length - 1],
                        1 < v.length ? (B = v[v.length - 2],
                        I = C[C.length - 2]) : (B = u,
                        I = D),
                        M = B + (u - B) / 2,
                        N = I + (D - I) / 2,
                        I = 180 * Math.atan((D - I) / (u - B)) / Math.PI,
                        isNaN(E) || (E = H / 2,
                        G -= Math.sqrt(G * G - E * E),
                        0 > w && (G = -G),
                        E = Math.sin(I / 180 * Math.PI),
                        -1 == E && (E = 1),
                        M -= E * G,
                        N += Math.cos(I / 180 * Math.PI) * G),
                        I = 0 > u - B ? I - 90 : I + 90);
                        t = d.polygon(x, r, k, m, p, 1, m, p, void 0, !0);
                        d.setCN(c, q, "map-line-arrow");
                        void 0 != a.id && d.setCN(c, q, "map-line-arrow-" + a.id);
                        z.push(t);
                        t.translate(M, N, 1 / n, !0);
                        isNaN(I) || t.rotate(I);
                        a.fixedSize && (f.push(t),
                        a.arrays.push({
                            arr: f,
                            el: t
                        }));
                        a.arrowSvg = t
                    }
                    a.fixedSize && q && (f = {
                        line: q,
                        thickness: F
                    },
                    this.linesToResize.push(f),
                    a.arrays.push({
                        arr: this.linesToResize,
                        el: f
                    }),
                    f = {
                        line: l,
                        thickness: 5
                    },
                    this.linesToResize.push(f),
                    a.arrays.push({
                        arr: this.linesToResize,
                        el: f
                    }));
                    a.lineSvg = q;
                    a.showAsSelected && !isNaN(y) && q.setAttr("stroke", y);
                    0 < e.length ? g.push(z) : h.push(z);
                    a.hidden && z.hide();
                    c.makeObjectAccessible(a)
                }
            }
        },
        processCoordinates: function(a, b) {
            var c = [], d;
            for (d = 0; d < a.length; d++) {
                var f = a[d]
                  , g = Number(f);
                isNaN(g) && (g = Number(f.replace("%", "")) * b / 100);
                isNaN(g) || c.push(g)
            }
            return c
        },
        reset: function() {
            this.objectsToResize = [];
            this.allSvgObjects = [];
            this.allObjects = [];
            this.linesToResize = []
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.LinesSettings = d.Class({
        construct: function(a) {
            this.cname = "LinesSettings";
            this.balloonText = "[[title]]";
            this.thickness = 1;
            this.dashLength = 0;
            this.arrowSize = 10;
            this.arrowAlpha = 1;
            this.arrow = "none";
            this.color = "#990000";
            this.descriptionWindowWidth = 250;
            this.bringForwardOnHover = !0;
            d.applyTheme(this, a, this.cname)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.MapObject = d.Class({
        construct: function(a) {
            this.fixedSize = this.mouseEnabled = !0;
            this.images = [];
            this.lines = [];
            this.areas = [];
            this.remainVisible = !0;
            this.passZoomValuesToTarget = !1;
            this.objectType = this.cname;
            d.applyTheme(this, a, "MapObject");
            this.arrays = []
        },
        deleteObject: function() {
            this.remove();
            this.parentArray && d.removeFromArray(this.parentArray, this);
            if (this.arrays)
                for (var a = 0; a < this.arrays.length; a++)
                    d.removeFromArray(this.arrays[a].arr, this.arrays[a].el);
            this.arrays = []
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.MapArea = d.Class({
        inherits: d.MapObject,
        construct: function(a) {
            this.cname = "MapArea";
            d.MapArea.base.construct.call(this, a);
            d.applyTheme(this, a, this.cname)
        },
        validate: function() {
            this.chart.areasProcessor.createArea(this)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.MapLine = d.Class({
        inherits: d.MapObject,
        construct: function(a) {
            this.cname = "MapLine";
            this.longitudes = [];
            this.latitudes = [];
            this.x = [];
            this.y = [];
            this.segments = 0;
            this.arrow = "none";
            d.MapLine.base.construct.call(this, a);
            d.applyTheme(this, a, this.cname)
        },
        validate: function() {
            this.chart.linesProcessor.createLine(this)
        },
        remove: function() {
            var a = this.displayObject;
            a && a.remove()
        },
        getCoordinates: function(a, b) {
            isNaN(b) && (b = 0);
            isNaN(this.arc) || this.isValid || (this.isValid = !0,
            this.validate());
            if (!isNaN(a)) {
                var c, e, f, g, h, k;
                if (1 < this.longitudes.length) {
                    e = this.chart.coordinatesToXY(this.longitudes[b], this.latitudes[b]);
                    var l = this.chart.coordinatesToXY(this.longitudes[b + 1], this.latitudes[b + 1]);
                    c = e.x;
                    f = l.x;
                    e = e.y;
                    g = l.y
                } else
                    1 < this.x.length && (c = this.x[b],
                    f = this.x[b + 1],
                    e = this.y[b],
                    g = this.y[b + 1]);
                l = Math.sqrt(Math.pow(f - c, 2) + Math.pow(g - e, 2));
                c < f && !isNaN(this.arc) && 0 !== this.arc && (a = 1 - a);
                h = c + (f - c) * a;
                k = e + (g - e) * a;
                var m = Math.atan2(g - e, f - c);
                if (!isNaN(this.arc) && 0 !== this.arc && this.arcRadius) {
                    var n = 0;
                    c < f && (n = c,
                    c = f,
                    f = n,
                    n = e,
                    e = g,
                    g = n,
                    n = Math.PI);
                    k = this.arcRadius[b];
                    0 > this.arc && (l = -l);
                    h = c + (f - c) / 2 + Math.sqrt(k * k - l / 2 * (l / 2)) * (e - g) / l;
                    var p = e + (g - e) / 2 + Math.sqrt(k * k - l / 2 * (l / 2)) * (f - c) / l;
                    c = 180 * Math.atan2(e - p, c - h) / Math.PI;
                    f = 180 * Math.atan2(g - p, f - h) / Math.PI;
                    180 < f - c && (f -= 360);
                    m = d.degreesToRadians(c + (f - c) * a);
                    h += k * Math.cos(m);
                    k = p + k * Math.sin(m);
                    m = 0 < this.arc ? m + Math.PI / 2 : m - Math.PI / 2;
                    m += n
                }
                this.distance = l;
                return {
                    x: h,
                    y: k,
                    angle: m
                }
            }
        },
        fixToStage: function() {
            if (0 < this.latitudes.length) {
                this.y = [];
                for (var a = 0; a < this.latitudes.length; a++) {
                    var b = this.chart.coordinatesToStageXY(this.longitudes[a], this.latitudes[a]);
                    this.y.push(b.y);
                    this.x.push(b.x)
                }
                this.latitudes = [];
                this.longitudes = []
            }
            this.validate()
        },
        fixToMap: function() {
            if (0 < this.y.length) {
                this.latitudes = [];
                for (var a = 0; a < this.y.length; a++) {
                    var b = this.chart.stageXYToCoordinates(this.x[a], this.y[a]);
                    this.latitudes.push(b.latitude);
                    this.longitudes.push(b.longitude)
                }
                this.y = [];
                this.x = []
            }
            this.validate()
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.MapImage = d.Class({
        inherits: d.MapObject,
        construct: function(a) {
            this.cname = "MapImage";
            this.scale = 1;
            this.widthAndHeightUnits = "pixels";
            this.labelShiftY = this.labelShiftX = 0;
            this.positionOnLine = .5;
            this.direction = 1;
            this.lineSegment = this.extraAngle = 0;
            this.animateAngle = !0;
            this.createEvents("animationStart", "animationEnd");
            d.MapImage.base.construct.call(this, a);
            d.applyTheme(this, a, this.cname);
            this.delayCounter = 0
        },
        validate: function() {
            this.chart.imagesProcessor.createImage(this)
        },
        updatePosition: function() {
            this.chart.imagesProcessor.updateSizeAndPosition(this)
        },
        remove: function() {
            var a = this.displayObject;
            a && a.remove();
            (a = this.imageLabel) && a.remove()
        },
        animateTo: function(a, b, c, d) {
            isNaN(c) || (this.animationDuration = c);
            d && (this.easingFunction = d);
            this.finalX = a;
            this.finalY = b;
            isNaN(this.longitude) || (this.initialX = this.longitude);
            isNaN(this.left) || (this.initialX = this.left);
            isNaN(this.right) || (this.initialX = this.right);
            isNaN(this.latitude) || (this.initialY = this.latitude);
            isNaN(this.top) || (this.initialY = this.top);
            isNaN(this.bottom) || (this.initialY = this.bottom);
            this.animatingAlong = !1;
            this.animate()
        },
        animateAlong: function(a, b, c) {
            1 == this.positionOnLine && this.flipDirection && (this.direction = -1,
            this.extraAngle = 180);
            isNaN(b) || (this.animationDuration = b);
            c && (this.easingFunction = c);
            a && (this.line = this.chart.getObjectById(a));
            this.animateAlongLine = this.line;
            this.animatingAlong = !0;
            this.animate()
        },
        animate: function() {
            var a = this.chart.imagesSettings
              , b = this.animationDuration;
            isNaN(b) && (b = a.animationDuration);
            this.totalFrames = b * d.updateRate;
            b = 1;
            this.line && a.adjustAnimationSpeed && (this.line.distances && (b = this.line.distances[this.lineSegment] * this.chart.zoomLevel(),
            b = Math.abs(b / a.baseAnimationDistance)),
            this.totalFrames = Math.round(b * this.totalFrames));
            this.frame = 0;
            this.fire({
                type: "animationStart",
                chart: this.chart,
                image: this,
                lineSegment: this.lineSegment,
                direction: this.direction
            })
        },
        update: function() {
            var a = this.totalFrames;
            this.frame++;
            this.delayCounter--;
            0 === this.delayCounter && this.animateAlong();
            if (!(0 < this.delayCounter))
                if (this.frame <= a) {
                    this.updatePosition();
                    var b = this.chart.imagesSettings
                      , c = this.easingFunction;
                    c || (c = b.easingFunction);
                    a = c(0, this.frame, 0, 1, a);
                    -1 == this.direction && (a = 1 - a);
                    this.animatingAlong ? this.positionOnLine = a : (b = this.initialX + (this.finalX - this.initialX) * a,
                    isNaN(this.longitude) || (this.longitude = b),
                    isNaN(this.left) || (this.left = b),
                    isNaN(this.right) || (this.right = b),
                    a = this.initialY + (this.finalY - this.initialY) * a,
                    isNaN(this.latitude) || (this.latitude = a),
                    isNaN(this.top) || (this.top = a),
                    isNaN(this.bottom) || (this.bottom = a))
                } else
                    this.frame == a + 1 && (this.fire({
                        type: "animationEnd",
                        chart: this.chart,
                        image: this,
                        lineSegment: this.lineSegment,
                        direction: this.direction
                    }),
                    this.line && this.animatingAlong && (1 == this.direction ? this.lineSegment < this.line.segments - 2 ? (this.lineSegment++,
                    this.delayAnimateAlong(),
                    this.positionOnLine = 0) : this.flipDirection ? (this.direction = -1,
                    this.extraAngle = 180,
                    this.delayAnimateAlong()) : this.loop && (this.delayAnimateAlong(),
                    this.lineSegment = 0) : 0 < this.lineSegment ? (this.lineSegment--,
                    this.delayAnimateAlong(),
                    this.positionOnLine = 0) : this.loop && this.flipDirection ? (this.direction = 1,
                    this.extraAngle = 0,
                    this.delayAnimateAlong()) : this.loop && this.delayAnimateAlong()))
        },
        delayAnimateAlong: function() {
            this.animateAlongLine && (this.delayCounter = this.chart.imagesSettings.pauseDuration * d.updateRate)
        },
        fixToStage: function() {
            if (!isNaN(this.longitude)) {
                var a = this.chart.coordinatesToStageXY(this.longitude, this.latitude);
                this.left = a.x;
                this.top = a.y;
                this.latitude = this.longitude = void 0
            }
            this.validate()
        },
        fixToMap: function() {
            if (!isNaN(this.left)) {
                var a = this.chart.stageXYToCoordinates(this.left, this.top);
                this.longitude = a.longitude;
                this.latitude = a.latitude;
                this.top = this.left = void 0
            }
            this.validate()
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.degreesToRadians = function(a) {
        return a / 180 * Math.PI
    }
    ;
    d.radiansToDegrees = function(a) {
        return a / Math.PI * 180
    }
    ;
    d.getColorFade = function(a, b, c) {
        var e = d.hex2RGB(b);
        b = e[0];
        var f = e[1]
          , e = e[2]
          , g = d.hex2RGB(a);
        a = g[0];
        var h = g[1]
          , g = g[2];
        a += Math.round((b - a) * c);
        h += Math.round((f - h) * c);
        g += Math.round((e - g) * c);
        return "rgb(" + a + "," + h + "," + g + ")"
    }
    ;
    d.hex2RGB = function(a) {
        return [parseInt(a.substring(1, 3), 16), parseInt(a.substring(3, 5), 16), parseInt(a.substring(5, 7), 16)]
    }
    ;
    d.processDescriptionWindow = function(a, b) {
        isNaN(b.descriptionWindowX) && (b.descriptionWindowX = a.descriptionWindowX);
        isNaN(b.descriptionWindowY) && (b.descriptionWindowY = a.descriptionWindowY);
        isNaN(b.descriptionWindowLeft) && (b.descriptionWindowLeft = a.descriptionWindowLeft);
        isNaN(b.descriptionWindowRight) && (b.descriptionWindowRight = a.descriptionWindowRight);
        isNaN(b.descriptionWindowTop) && (b.descriptionWindowTop = a.descriptionWindowTop);
        isNaN(b.descriptionWindowBottom) && (b.descriptionWindowBottom = a.descriptionWindowBottom);
        isNaN(b.descriptionWindowWidth) && (b.descriptionWindowWidth = a.descriptionWindowWidth);
        isNaN(b.descriptionWindowHeight) && (b.descriptionWindowHeight = a.descriptionWindowHeight)
    }
    ;
    d.normalizePath = function(a) {
        for (var b = "", c = d.parsePath(a.getAttribute("d")), e, f, g = Infinity, h = -Infinity, k = Infinity, l = -Infinity, m = 0; m < c.length; m++) {
            var n = c[m]
              , p = n.letter
              , t = n.x
              , n = n.y;
            "h" == p && (p = "L",
            t += e,
            n = f);
            "H" == p && (p = "L",
            n = f);
            "v" == p && (p = "L",
            t = e,
            n += f);
            "V" == p && (p = "L",
            t = e);
            if ("m" === p || "l" === p)
                p = p.toUpperCase(),
                t += e,
                n += f;
            t = d.roundTo(t, 3);
            n = d.roundTo(n, 3);
            e = t;
            f = n;
            t > h && (h = t);
            t < g && (g = t);
            n > l && (l = n);
            n < k && (k = n);
            b = "z" == p.toLowerCase() ? b + "Z " : b + (p + " " + t + " " + n + " ")
        }
        a.setAttribute("d", b);
        return {
            minX: g,
            maxX: h,
            minY: k,
            maxY: l
        }
    }
    ;
    d.mercatorLatitudeToRadians = function(a) {
        return Math.log(Math.tan(Math.PI / 4 + d.degreesToRadians(a) / 2))
    }
    ;
    d.parsePath = function(a) {
        a = a.match(/([MmLlHhVvZz]{1}[0-9.,\-\s]*)/g);
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c].match(/([MmLlHhVvZz]{1})|([0-9.\-]+)/g)
              , f = {
                letter: d[0]
            };
            switch (d[0]) {
            case "Z":
            case "Z":
            case "z":
                break;
            case "V":
            case "v":
                f.y = Number(d[1]);
                break;
            case "H":
            case "h":
                f.x = Number(d[1]);
                break;
            default:
                f.x = Number(d[1]),
                f.y = Number(d[2])
            }
            b.push(f)
        }
        return b
    }
    ;
    d.acos = function(a) {
        return 1 < a ? 0 : -1 > a ? Math.PI : Math.acos(a)
    }
    ;
    d.asin = function(a) {
        return 1 < a ? Math.PI / 2 : -1 > a ? -Math.PI / 2 : Math.asin(a)
    }
    ;
    d.sinci = function(a) {
        return a ? a / Math.sin(a) : 1
    }
    ;
    d.asqrt = function(a) {
        return 0 < a ? Math.sqrt(a) : 0
    }
    ;
    d.winkel3 = function(a, b) {
        var c = d.aitoff(a, b);
        return [(c[0] + a / Math.PI * 2) / 2, (c[1] + b) / 2]
    }
    ;
    d.winkel3.invert = function(a, b) {
        var c = a
          , e = b
          , f = 25
          , g = Math.PI / 2;
        do
            var h = Math.cos(e), k = Math.sin(e), l = Math.sin(2 * e), m = k * k, n = h * h, p = Math.sin(c), t = Math.cos(c / 2), r = Math.sin(c / 2), q = r * r, y = 1 - n * t * t, B = y ? d.acos(h * t) * Math.sqrt(u = 1 / y) : u = 0, u, y = .5 * (2 * B * h * r + c / g) - a, w = .5 * (B * k + e) - b, v = .5 * u * (n * q + B * h * t * m) + .5 / g, A = u * (p * l / 4 - B * k * r), k = .125 * u * (l * r - B * k * n * p), m = .5 * u * (m * t + B * q * h) + .5, h = A * k - m * v, A = (w * A - y * m) / h, y = (y * k - w * v) / h, c = c - A, e = e - y;
        while ((1E-6 < Math.abs(A) || 1E-6 < Math.abs(y)) && 0 < --f);return [c, e]
    }
    ;
    d.aitoff = function(a, b) {
        var c = Math.cos(b)
          , e = d.sinci(d.acos(c * Math.cos(a /= 2)));
        return [2 * c * Math.sin(a) * e, Math.sin(b) * e]
    }
    ;
    d.orthographic = function(a, b) {
        return [Math.cos(b) * Math.sin(a), Math.sin(b)]
    }
    ;
    d.equirectangular = function(a, b) {
        return [a, b]
    }
    ;
    d.equirectangular.invert = function(a, b) {
        return [a, b]
    }
    ;
    d.eckert5 = function(a, b) {
        var c = Math.PI;
        return [a * (1 + Math.cos(b)) / Math.sqrt(2 + c), 2 * b / Math.sqrt(2 + c)]
    }
    ;
    d.eckert5.invert = function(a, b) {
        var c = Math.sqrt(2 + Math.PI)
          , d = b * c / 2;
        return [c * a / (1 + Math.cos(d)), d]
    }
    ;
    d.eckert6 = function(a, b) {
        for (var c = Math.PI, d = (1 + c / 2) * Math.sin(b), f = 0, g = Infinity; 10 > f && 1E-5 < Math.abs(g); f++)
            b -= g = (b + Math.sin(b) - d) / (1 + Math.cos(b));
        d = Math.sqrt(2 + c);
        return [a * (1 + Math.cos(b)) / d, 2 * b / d]
    }
    ;
    d.eckert6.invert = function(a, b) {
        var c = 1 + Math.PI / 2
          , e = Math.sqrt(c / 2);
        return [2 * a * e / (1 + Math.cos(b *= e)), d.asin((b + Math.sin(b)) / c)]
    }
    ;
    d.mercator = function(a, b) {
        b >= Math.PI / 2 - .02 && (b = Math.PI / 2 - .02);
        b <= -Math.PI / 2 + .02 && (b = -Math.PI / 2 + .02);
        return [a, Math.log(Math.tan(Math.PI / 4 + b / 2))]
    }
    ;
    d.mercator.invert = function(a, b) {
        return [a, 2 * Math.atan(Math.exp(b)) - Math.PI / 2]
    }
    ;
    d.miller = function(a, b) {
        return [a, 1.25 * Math.log(Math.tan(Math.PI / 4 + .4 * b))]
    }
    ;
    d.miller.invert = function(a, b) {
        return [a, 2.5 * Math.atan(Math.exp(.8 * b)) - .625 * Math.PI]
    }
    ;
    d.eckert3 = function(a, b) {
        var c = Math.PI
          , d = Math.sqrt(c * (4 + c));
        return [2 / d * a * (1 + Math.sqrt(1 - 4 * b * b / (c * c))), 4 / d * b]
    }
    ;
    d.eckert3.invert = function(a, b) {
        var c = Math.PI
          , e = Math.sqrt(c * (4 + c)) / 2;
        return [a * e / (1 + d.asqrt(1 - b * b * (4 + c) / (4 * c))), b * e / 2]
    }
})();
(function() {
    var d = window.AmCharts;
    d.MapData = d.Class({
        inherits: d.MapObject,
        construct: function() {
            this.cname = "MapData";
            d.MapData.base.construct.call(this);
            this.projection = "mercator";
            this.topLatitude = 90;
            this.bottomLatitude = -90;
            this.leftLongitude = -180;
            this.rightLongitude = 180;
            this.zoomLevel = 1;
            this.getAreasFromMap = !1
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.DescriptionWindow = d.Class({
        construct: function() {},
        show: function(a, b, c, d) {
            var f = this;
            f.chart = a;
            var g = document.createElement("div");
            g.style.position = "absolute";
            var h = a.classNamePrefix + "-description-";
            g.className = "ammapDescriptionWindow " + h + "div";
            f.div = g;
            b.appendChild(g);
            var k = ".gif";
            a.svgIcons && (k = ".svg");
            var l = document.createElement("img");
            l.className = "ammapDescriptionWindowCloseButton " + h + "close-img";
            //l.src = a.pathToImages + "xIcon" + k;
            l.src = "ammap/images/" + "xIcon" + k
            l.style.cssFloat = "right";
            l.style.cursor = "pointer";
            l.onclick = function() {
                f.close()
            }
            ;
            l.onmouseover = function() {
                //l.src = a.pathToImages + "xIconH" + k
                l.src = "ammap/images/" + "xIconH" + k
            }
            ;
            l.onmouseout = function() {
                //l.src = a.pathToImages + "xIcon" + k
                l.src = "ammap/images/" + "xIcon" + k
            }
            ;
            g.appendChild(l);
            b = document.createElement("div");
            b.className = "ammapDescriptionTitle " + h + "title-div";
            b.onmousedown = function() {
                f.div.style.zIndex = 1E3
            }
            ;
            g.appendChild(b);
            b.innerHTML = d;
            d = b.offsetHeight;
            b = document.createElement("div");
            b.className = "ammapDescriptionText " + h + "text-div";
            b.style.maxHeight = f.maxHeight - d - 20 + "px";
            g.appendChild(b);
            b.innerHTML = c
        },
        close: function() {
            try {
                this.div.parentNode.removeChild(this.div),
                this.chart.fireClosed()
            } catch (a) {}
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.ValueLegend = d.Class({
        construct: function(a) {
            this.cname = "ValueLegend";
            this.enabled = !0;
            this.showAsGradient = !1;
            this.minValue = 0;
            this.height = 12;
            this.width = 200;
            this.bottom = this.left = 10;
            this.borderColor = "#FFFFFF";
            this.borderAlpha = this.borderThickness = 1;
            this.color = "#000000";
            this.fontSize = 11;
            d.applyTheme(this, a, this.cname)
        },
        init: function(a, b) {
            if (this.enabled) {
                var c = a.areasSettings.color
                  , e = a.areasSettings.colorSolid
                  , f = a.colorSteps;
                d.remove(this.set);
                var g = b.set();
                this.set = g;
                d.setCN(a, g, "value-legend");
                var h = 0
                  , k = this.minValue
                  , l = this.fontSize
                  , m = a.fontFamily
                  , n = this.color
                  , p = {
                    precision: a.precision,
                    decimalSeparator: a.decimalSeparator,
                    thousandsSeparator: a.thousandsSeparator
                };
                void 0 == k && (k = d.formatNumber(a.minValueReal, p));
                void 0 !== k && (h = d.text(b, k, n, m, l, "left"),
                h.translate(0, l / 2 - 1),
                d.setCN(a, h, "value-legend-min-label"),
                g.push(h),
                h = h.getBBox().height);
                k = this.maxValue;
                void 0 === k && (k = d.formatNumber(a.maxValueReal, p));
                void 0 !== k && (h = d.text(b, k, n, m, l, "right"),
                h.translate(this.width, l / 2 - 1),
                d.setCN(a, h, "value-legend-max-label"),
                g.push(h),
                h = h.getBBox().height);
                if (this.showAsGradient)
                    c = d.rect(b, this.width, this.height, [c, e], 1, this.borderThickness, this.borderColor, 1, 0, 0),
                    d.setCN(a, c, "value-legend-gradient"),
                    c.translate(0, h),
                    g.push(c);
                else
                    for (l = this.width / f,
                    m = 0; m < f; m++)
                        n = d.getColorFade(c, e, 1 * m / (f - 1)),
                        n = d.rect(b, l, this.height, n, 1, this.borderThickness, this.borderColor, 1),
                        d.setCN(a, n, "value-legend-color"),
                        d.setCN(a, n, "value-legend-color-" + m),
                        n.translate(l * m, h),
                        g.push(n);
                e = c = 0;
                f = g.getBBox();
                h = a.getY(this.bottom, !0);
                l = a.getY(this.top);
                m = a.getX(this.right, !0);
                n = a.getX(this.left);
                isNaN(l) || (c = l);
                isNaN(h) || (c = h - f.height);
                isNaN(n) || (e = n);
                isNaN(m) || (e = m - f.width);
                g.translate(e, c)
            } else
                d.remove(this.set)
        }
    })
})();
(function() {
    var d = window.AmCharts;
    d.ObjectList = d.Class({
        construct: function(a) {
            this.divId = a
        },
        init: function(a) {
            this.chart = a;
            var b = this.divId;
            this.container && (b = this.container);
            this.div = "object" != typeof b ? document.getElementById(b) : b;
            b = document.createElement("div");
            b.className = "ammapObjectList " + a.classNamePrefix + "-object-list-div";
            this.div.appendChild(b);
            this.addObjects(a.dataProvider, b)
        },
        addObjects: function(a, b) {
            var c = this.chart
              , d = document.createElement("ul");
            d.className = c.classNamePrefix + "-object-list-ul";
            var f;
            if (a.areas)
                for (f = 0; f < a.areas.length; f++) {
                    var g = a.areas[f];
                    void 0 === g.showInList && (g.showInList = c.showAreasInList);
                    this.addObject(g, d)
                }
            if (a.images)
                for (f = 0; f < a.images.length; f++)
                    g = a.images[f],
                    void 0 === g.showInList && (g.showInList = c.showImagesInList),
                    this.addObject(g, d);
            if (a.lines)
                for (f = 0; f < a.lines.length; f++)
                    g = a.lines[f],
                    void 0 === g.showInList && (g.showInList = c.showLinesInList),
                    this.addObject(g, d);
            0 < d.childNodes.length && b.appendChild(d)
        },
        addObject: function(a, b) {
            var c = this;
            if (a.showInList && void 0 !== a.title) {
                var d = c.chart
                  , f = document.createElement("li");
                f.className = d.classNamePrefix + "-object-list-li";
                var g = a.titleTr;
                g || (g = a.title);
                var g = document.createTextNode(g)
                  , h = document.createElement("a");
                h.className = d.classNamePrefix + "-object-list-a";
                h.appendChild(g);
                f.appendChild(h);
                b.appendChild(f);
                this.addObjects(a, f);
                h.onmouseover = function() {
                    c.chart.rollOverMapObject(a, !1)
                }
                ;
                h.onmouseout = function() {
                    c.chart.rollOutMapObject(a)
                }
                ;
                h.onclick = function() {
                    c.chart.clickMapObject(a)
                }
            }
        }
    })
})();
