! function(i) {
    "use strict";

    function e(i) {
        return i.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()
    }

    function t(i) {
        return r ? r + i : i.toLowerCase()
    }
    var n = {
            defaultParams: {
                type: "web",
                url: window.location.href,
                title: document.title,
                image_url: "",
                text: ""
            },
            shareDataStr: null,
            init: function(e) {
                if (window._biliShareOnApp = e, window.BiliApp || i("#biliapp-script-tag").length) e && e();
                else {
                    var t = "//static.hdslb.com/biliapp/biliapp.js",
                        n = document.createElement("script"),
                        a = document.getElementsByTagName("body")[0];
                    n.src = t, n.id = "biliapp-script-tag", n.setAttribute("onload", "window._biliShareOnApp && window._biliShareOnApp();"), a.appendChild(n)
                }
            },
            set: function(e) {
                var t = i.extend({}, this.defaultParams, e);
                n.shareData = t;
                var a = JSON.stringify(t);
                return window.BiliApp ? window.BiliApp.setShareContent(t) : window.biliios ? window.biliios.setShareContext(a) : window.biliandroid && window.biliandroid.setShareContext ? window.biliandroid.setShareContext(a) : window.biliandroid && window.biliandroid.setShareContent && window.biliandroid.setShareContent(a), this.shareDataStr = a, a
            },
            show: function() {
                window.BiliApp ? BiliApp.showShareWindow(this.shareData) : window.biliios ? window.biliios.showShareWindow(this.shareDataStr || JSON.stringify(this.defaultParams)) : window.biliandroid && window.biliandroid.showShareWindow(this.shareDataStr || JSON.stringify(this.defaultParams))
            },
            close: function() {
                window.BiliApp ? window.BiliApp.closeBrowser() : window.biliios ? window.biliios.closeBrowser() : window.biliandroid && window.biliandroid.closeBrowser()
            }
        },

        a = {
            version: function() {
                var i = navigator.userAgent;
                navigator.appVersion;
                return {
                    mobile: /AppleWebKit.*Mobile.*/i.test(i),
                    ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(i),
                    android: /Android/i.test(i) || /Linux/i.test(i),
                    windowsphone: /Windows Phone/i.test(i),
                    iPhone: /iPhone/i.test(i),
                    iPad: /iPad/i.test(i),
                    webApp: !/Safari/i.test(i),
                    MicroMessenger: /MicroMessenger/i.test(i),
                    weibo: /Weibo/i.test(i),
                    uc: /ucweb|UCBrowser/i.test(i),
                    qq: /MQQBrowser/i.test(i),
                    baidu: /Baidu/i.test(i)
                }
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };
    window.GetRandomString = function(i) {
        for (var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), t = "", n = 0; i > n; n++) var a = Math.floor(62 * Math.random()),
            t = t + e[a];
        return t
    };
    var s = {
            init: function(e) {
                if (!e) return !1;
                var t = i.extend({
                        share: {
                            title: document.title,
                            desc: "desc",
                            link: window.location.href,
                            pics: "//static.hdslb.com/mobile/img/app_logo.png",
                            searchPic: "false",
                            shareWay: ["weibo", "qzone", "tieba", "qq"]
                        },
                        shareByApp: !0,
                        wrapperId: "bili-share-wrap",
                        loadCss: "//static.hdslb.com/mstation/monkey/biliShare/build/biliShare.mobile.css",
                        onCancel: function() {}
                    }, e || {}),
                    a = i(this);
                n.init(), t.loadCss && !i("#bilishare-css-load").length && i('<link id="bilishare-css-load" rel="stylesheet" type="text/css" href="' + t.loadCss + '">').appendTo("head"), a.each(function() {
                    s.bind.call(this, t)
                })
            },
            bind: function(e) {
                i(this).on("click.share", function() {
                    var t = (i(this), i('<div id="' + e.wrapperId + '" class="black-wrp"><div class="share-box"><div class="share-box-list"></div><div class="share-box-title clearfix"></div><div class="share-box-content clearfix"></div><a class="share-box-cancel clearfix">鍙栨秷</a></div></div>')),
                        r = t.find(".share-box"),
                        d = (t.find(".share-box-list"), t.hide().appendTo(i("body")));
                    if (t.click(function(t) {
                            i(window).off("touchmove"), i(t.currentTarget).hide().remove(), e.onCancel.call(this)
                        }), t.find(".share-box").click(function() {
                            event.stopPropagation()
                        }), d.find(".share-box-cancel").click(function() {
                            i(window).off("touchmove"), d.hide().remove(), e.onCancel.call(this)
                        }), e.shareByApp && (window.biliios || window.biliandroid || window.biliapp)) n.set({
                        title: e.share.title,
                        text: e.share.title + " " + e.share.desc,
                        url: e.share.link,
                        image_url: e.share.pics
                    }), n.show();
                    else {
                        d.show().animate({
                            opacity: 1
                        }, 100);
                        r.height();
                        r.animate({
                            bottom: 0
                        }, 200), i(window).on("touchmove", function(t) {
                            return i("#" + e.wrapperId).length ? !1 : void 0
                        })
                    }
                    s.bindDefault(d, e.share);
                    var c = navigator.appVersion,
                        l = {
                            uc: "",
                            qq: ""
                        },
                        p = function(i) {
                            var e = i.split("."),
                                t = parseFloat(e[0] + "." + e[1]);
                            return t
                        };
                    if (l.qq = a.version.qq ? p(c.split("MQQBrowser/")[1]) : 0, l.uc = a.version.uc ? p(c.split("UCBrowser/")[1]) : 0, a.version.MicroMessenger) o(d, e);
                    else if (a.version.uc && (l.uc > 10.2 && a.version.iPhone || l.uc > 9.7 && a.version.android)) s.bindUC(d, e.share);
                    else if (a.version.weibo) t.addClass("weibo");
                    else if (a.version.qq) {
                        var h = "http://jsapi.qq.com/get?api=app.share";
                        a.version.android && l.qq < 5.4 && (h = "http://3gimg.qq.com/html5/js/qb.js");
                        var w = document.createElement("script"),
                            u = document.getElementsByTagName("body")[0];
                        w.setAttribute("src", h), window._biliShareQb = function() {
                            (window.qb || a.app && a.app.share) && s.bindQQ(d, e.share), window._biliShareQb = null
                        }, w.onload = window._biliShareQb(), u.appendChild(w)
                    } else a.version.ios && !a.version.webApp && (t.addClass("safari"), r.find(".share-box-title").html('鐐瑰嚮<i class="icons icons-safari"></i>鍙互鍒嗕韩鍒版洿澶氬湴鏂瑰摝~'), r.find(".share-box-content").html("杩樺彲浠ユ敹钘忓拰澶嶅埗閾炬帴鍝�"))
                })
            },
            bindDefault: function(e, t) {
                for (var n = e.find(".share-box"), a = e.find(".share-box-list"), s = "", o = t.shareWay || ["weibo", "qzone", "tieba", "qq"], r = 0; r < o.length; r++) switch (o[r]) {
                    case "weibo":
                        s += '<a target="_blank" href="javascript:void(0);" class="share-box-item weibo"><i class="icons icons-weibo"></i><div>鏂版氮寰崥</div></a>';
                        break;
                    case "qzone":
                        s += '<a target="_blank" href="javascript:void(0);" class="share-box-item qzone"><i class="icons icons-qzone"></i><div>QQ绌洪棿</div></a>';
                        break;
                    case "tieba":
                        s += '<a target="_blank" href="javascript:void(0);" class="share-box-item tieba"><i class="icons icons-tieba"></i><div>鐧惧害璐村惂</div></a>';
                        break;
                    case "qq":
                        s += '<a target="_blank" href="javascript:void(0);" class="share-box-item qq"><i class="icons icons-qq"></i><div>QQ濂藉弸</div></a>'
                }
                a.html(s);
                var d = n.find(".weibo"),
                    c = n.find(".qzone"),
                    l = n.find(".tieba"),
                    p = n.find(".qq"),
                    h = n.find(".share-box-item").length || 1,
                    w = 100 / h + "%";
                n.find(".share-box-item").css("width", w);
                var u = {
                    url: t.link,
                    desc: t.desc,
                    title: t.title,
                    summary: t.desc,
                    pics: t.pics,
                    pic: t.pics,
                    imgUrl: t.pics,
                    searchPic: "false"
                };
                if (/MQQBrowser/i.test(navigator.userAgent) || /(.*?(iPad|iPhone|iPod).*?QQ\/([\d\.]+).*?)|(.*?\bV1_AND_SQI?_([\d\.]+)(.*?QQ\/([\d\.]+))?.*?)/i.test(navigator.userAgent))
                    if (window.setShareInfo) window.setShareInfo({
                        url: t.link,
                        title: t.title,
                        summary: t.desc,
                        pic: t.pics
                    });
                    else {
                        var f = document.createElement("script"),
                            b = document.getElementsByTagName("body")[0];
                        f.setAttribute("src", "http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js");
                        var m = function(i) {
                            window.setShareInfo && window.setShareInfo(i)
                        };
                        f.onload = m({
                            url: t.link,
                            title: t.title,
                            summary: t.desc,
                            pic: t.pics
                        }), b.appendChild(f)
                    }
                var v = function(i) {
                        var e = [];
                        for (var t in i) e.push(t + "=" + encodeURIComponent(i[t] || ""));
                        return e
                    },
                    g = i.extend({}, u, t.weibo || {});
                g.title = g.title + " " + g.desc, g.use = {
                    url: g.url,
                    desc: g.desc,
                    title: g.title,
                    summary: g.desc,
                    pic: g.pics,
                    searchPic: "false"
                }, d.attr("href", "http://service.weibo.com/share/share.php?appkey=2841902482&language=zh_cn&" + v(g.use).join("&"));
                var x = i.extend({}, u, t.qzone || {});
                x.use = {
                    url: x.url,
                    desc: x.desc,
                    title: x.title,
                    summary: x.desc,
                    pics: x.pics,
                    searchPic: x.searchPic || "false"
                }, c.attr("href", "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?style=203&width=98&height=22&otype=share&" + v(x.use).join("&"));
                var y = i.extend({}, u, t.tieba || {});
                y.use = {
                    url: y.url,
                    desc: y.desc,
                    title: y.title,
                    pic: y.pics
                }, l.attr("href", "http://tieba.baidu.com/f/commit/share/openShareApi?" + v(y.use).join("&"));
                var q = i.extend({}, u, t.qq || {});
                q.use = {
                    url: q.url,
                    desc: q.desc,
                    title: q.title,
                    summary: q.desc,
                    pics: q.pics
                }, p.attr("href", "http://connect.qq.com/widget/shareqq/index.html?" + v(q.use).join("&"))
            },
            bindQQ: function(e, t) {
                var n = (e.find(".share-box"), e.find(".share-box-list")),
                    s = {
                        sinaWeibo: ["kSinaWeibo", "SinaWeibo", 11, "鏂版氮寰崥"],
                        weixin: ["kWeixin", "WechatFriends", 1, "寰俊濂藉弸"],
                        weixinFriend: ["kWeixinFriend", "WechatTimeline", "8", "寰俊鏈嬪弸鍦�"],
                        QQ: ["kQQ", "QQ", "4", "QQ濂藉弸"],
                        QZone: ["kQZone", "QZone", "3", "QQ绌洪棿"],
                        copy: ["copy", "copy", "10", "澶嶅埗閾炬帴"]
                    };
                n.css("text-align", "left").html('<a target="_blank" href="javascript:void(0);" class="share-box-item weibo" data-app="sinaWeibo"><i class="icons icons-weibo"></i><div>鏂版氮寰崥</div></a><a target="_blank" href="javascript:void(0);" class="share-box-item qzone" data-app="QZone"><i class="icons icons-qzone"></i><div>QQ绌洪棿</div></a><a target="_blank" href="javascript:void(0);" class="share-box-item wx" data-app="weixin"><i class="icons icons-wx"></i><div>寰俊濂藉弸</div></a><a target="_blank" href="javascript:void(0);" class="share-box-item pyq" data-app="weixinFriend"><i class="icons icons-pyq"></i><div>鏈嬪弸鍦�</div></a><a target="_blank" href="javascript:void(0);" class="share-box-item qq" data-app="QQ"><i class="icons icons-qq"></i><div>QQ濂藉弸</div></a><a target="_blank" href="javascript:void(0);" class="share-box-item other" data-app=""><i class="icons icons-other"></i><div>鍏跺畠</div></a>'), n.find(".share-box-item").css("width", "25%").click(function() {
                    var e = i(this).attr("data-app") || "";
                    e = "" == e ? "" : s[e][2];
                    var n = {
                        url: t.link,
                        title: t.title,
                        description: t.desc,
                        img_url: t.pics,
                        img_title: t.title,
                        to_app: e,
                        cus_txt: "璇疯緭鍏ユ鏃舵鍒绘兂瑕佸垎浜殑鍐呭"
                    };
                    "undefined" != typeof a && "undefined" != typeof a.app ? a.app.share(n) : "undefined" != typeof window.qb && window.qb.share(n)
                })
            },
            bindUC: function(e, t) {
                e.remove();
                var n = i(this).attr("data-app") || "";
                n = "" == n ? "" : a.version.ios ? ucAppList[n][0] : ucAppList[n][1], "QZone" == n && (e.hide(), B = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url=" + t.pics + "&title=" + t.title + "&description=" + t.desc + "&url=" + t.link + "&app_name=@" + window.location.host, k = document.createElement("div"), k.style.visibility = "hidden", k.innerHTML = '<iframe src="' + B + '" scrolling="no" width="1" height="1"></iframe>', document.body.appendChild(k), setTimeout(function() {
                    k && k.parentNode && k.parentNode.removeChild(k)
                }, 5e3)), "undefined" != typeof ucweb ? (e.hide(), ucweb.startRequest("shell.page_share", [t.title, t.link, t.link, n, "", "@" + window.location.host, ""])) : "undefined" != typeof ucbrowser && (e.hide(), ucbrowser.web_share(t.title, t.link, t.link, n, "", "@" + window.location.host, ""))
            },
            setShareContent: function(e) {
                var t = {
                    title: document.title,
                    desc: "desc",
                    link: window.location.href,
                    pics: "//static.hdslb.com/mobile/img/app_logo.png"
                };
                e = i.extend({}, t, e);
                var s = function() {
                    e.text = e.desc, e.url = e.link, e.image_url = e.pics;
                    var i = new Image;
                    if (i.src = e.pics, window.BiliApp) BiliApp.setShareContent(e);
                    else var t = 0,
                        n = setInterval(function() {
                            window.BiliApp && (clearInterval(n), BiliApp.setShareContent(e)), t += 300, t > 3e3 && clearInterval(n)
                        }, 300)
                };
                if (n.init(s), a.version.MicroMessenger) {
                    e.imgUrl = e.pics;
                    var r = {
                        share: e
                    };
                    o(i(this), r), window._biliShareWx = function() {
                        o(i("body"), r)
                    }, i(window).on("load", function() {
                        window._biliShareWx(), window._biliShareWx = null
                    })
                }
                if (/(.*?(iPad|iPhone|iPod).*?QQ\/([\d\.]+).*?)|(.*?\bV1_AND_SQI?_([\d\.]+)(.*?QQ\/([\d\.]+))?.*?)/i.test(navigator.userAgent))
                    if (window.setShareInfo) window.setShareInfo({
                        url: e.link,
                        title: e.title,
                        summary: e.desc,
                        pic: e.pics
                    });
                    else {
                        var d = document.createElement("script"),
                            c = document.getElementsByTagName("body")[0];
                        d.setAttribute("src", "http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js");
                        var l = function(i) {
                            window.setShareInfo && window.setShareInfo(i)
                        };
                        d.onload = l({
                            url: e.link,
                            title: e.title,
                            summary: e.desc,
                            pic: e.pics
                        }), c.appendChild(d), l({
                            url: e.link,
                            title: e.title,
                            summary: e.desc,
                            pic: e.pics
                        })
                    }
            }
        },
        o = function(e, t) {
            var n = Date.parse(new Date) / 1e3,
                a = GetRandomString(32),
                s = "wx108457cda8a1b9f9";
            t.share.imgUrl = t.share.pics, e.addClass("wx"), i.ajax({
                url: "//app.bilibili.com/x/display/wechat/sign",
                type: "get",
                data: {
                    url: window.location.href,
                    timestamp: n,
                    nonce: a,
                    jsonp: "jsonp"
                },
                dataType: "jsonp",
                success: function(e) {
                    if (e && 0 == e.code) {
                        var o = function() {
                            window.wx && (wx.config({
                                beta: !0,
                                debug: !1,
                                appId: s,
                                nonceStr: a,
                                timestamp: n,
                                signature: e.data,
                                jsApiList: ["showOptionMenu", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"]
                            }), wx.ready(function() {
                                var e = i.extend({}, t.share, t.share.weibo || {});
                                e.imgUrl = e.pics;
                                var n = i.extend({}, t.share, t.share.qzone || {});
                                n.imgUrl = n.pics;
                                var a = i.extend({}, t.share, t.share.weixin || {});
                                a.imgUrl = a.pics;
                                var s = i.extend({}, t.share, t.share.qq || {});
                                s.imgUrl = s.pics, wx.onMenuShareTimeline(a), wx.onMenuShareAppMessage(a), wx.onMenuShareQQ(s), wx.onMenuShareWeibo(e), wx.onMenuShareQZone(n)
                            }))
                        };
                        if (i.getScript) i.getScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js", o());
                        else {
                            var r = document.getElementsByTagName("head")[0],
                                d = document.createElement("script");
                            d.onload = o(), d.setAttribute("type", "text/javascript"), d.setAttribute("src", "http://res.wx.qq.com/open/js/jweixin-1.0.0.js"), r.appendChild(d)
                        }
                    }
                },
                error: function() {}
            })
        };
    if (!window.jQuery) {
        var r, d, c, l, p, h, w, u, f, b, m = "",
            v = {
                Webkit: "webkit",
                Moz: "",
                O: "o"
            },
            g = document.createElement("div"),
            x = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
            y = {};
        i.each(v, function(i, e) {
            return void 0 !== g.style[i + "TransitionProperty"] ? (m = "-" + i.toLowerCase() + "-", r = e, !1) : void 0
        }), d = m + "transform", y[c = m + "transition-property"] = y[l = m + "transition-duration"] = y[h = m + "transition-delay"] = y[p = m + "transition-timing-function"] = y[w = m + "animation-name"] = y[u = m + "animation-duration"] = y[b = m + "animation-delay"] = y[f = m + "animation-timing-function"] = "", i.fx = {
            off: void 0 === r && void 0 === g.style.transitionProperty,
            speeds: {
                _default: 400,
                fast: 200,
                slow: 600
            },
            cssPrefix: m,
            transitionEnd: t("TransitionEnd"),
            animationEnd: t("AnimationEnd")
        }, i.fn.animate = function(e, t, n, a, s) {
            return i.isFunction(t) && (a = t, n = void 0, t = void 0), i.isFunction(n) && (a = n, n = void 0), i.isPlainObject(t) && (n = t.easing, a = t.complete, s = t.delay, t = t.duration), t && (t = ("number" == typeof t ? t : i.fx.speeds[t] || i.fx.speeds._default) / 1e3), s && (s = parseFloat(s) / 1e3), this.anim(e, t, n, a, s)
        }, i.fn.anim = function(t, n, a, s, o) {
            var r, m, v, g = {},
                q = "",
                S = this,
                Q = i.fx.transitionEnd,
                k = !1;
            if (void 0 === n && (n = i.fx.speeds._default / 1e3), void 0 === o && (o = 0), i.fx.off && (n = 0), "string" == typeof t) g[w] = t, g[u] = n + "s", g[b] = o + "s", g[f] = a || "linear", Q = i.fx.animationEnd;
            else {
                m = [];
                for (r in t) x.test(r) ? q += r + "(" + t[r] + ") " : (g[r] = t[r], m.push(e(r)));
                q && (g[d] = q, m.push(d)), n > 0 && "object" == typeof t && (g[c] = m.join(", "), g[l] = n + "s", g[h] = o + "s", g[p] = a || "linear")
            }
            return v = function(e) {
                if ("undefined" != typeof e) {
                    if (e.target !== e.currentTarget) return;
                    i(e.target).unbind(Q, v)
                } else i(this).unbind(Q, v);
                k = !0, i(this).css(y), s && s.call(this)
            }, n > 0 && (this.bind(Q, v), setTimeout(function() {
                k || v.call(S)
            }, 1e3 * (n + o) + 25)), this.size() && this.get(0).clientLeft, this.css(g), 0 >= n && setTimeout(function() {
                S.each(function() {
                    v.call(this)
                })
            }, 0), this
        }, g = null
    }
    i.fn.biliShareMobile = function(i) {
        if (i) {
            if (s[i] && "_" != i.charAt(0)) return s[i].apply(this, Array.prototype.slice.call(arguments, 1));
            if ("object" == typeof i) return s.init.apply(this, arguments), this;
            console.log("Method " + i + " does not exist.")
        } else console.log("biliShare needs an argument.")
    }

    
}(window.jQuery || window.Zepto);