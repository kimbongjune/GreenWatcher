/**
 * Minified by jsDelivr using UglifyJS v3.0.24.
 * Original file: /npm/tokml@0.4.0/tokml.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!(function (e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        ("undefined" != typeof window
            ? window
            : "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : this
        ).tokml = e();
    }
})(function () {
    return (function e(t, r, n) {
        function o(u, a) {
            if (!r[u]) {
                if (!t[u]) {
                    var c = "function" == typeof require && require;
                    if (!a && c) return c(u, !0);
                    if (i) return i(u, !0);
                    var s = new Error("Cannot find module '" + u + "'");
                    throw ((s.code = "MODULE_NOT_FOUND"), s);
                }
                var l = (r[u] = { exports: {} });
                t[u][0].call(
                    l.exports,
                    function (e) {
                        var r = t[u][1][e];
                        return o(r || e);
                    },
                    l,
                    l.exports,
                    e,
                    t,
                    r,
                    n
                );
            }
            return r[u].exports;
        }
        for (
            var i = "function" == typeof require && require, u = 0;
            u < n.length;
            u++
        )
            o(n[u]);
        return o;
    })(
        {
            1: [
                function (e, t, r) {
                    function n(e, t) {
                        return function (r) {
                            if (!r.properties || !j.valid(r.geometry))
                                return "";
                            var n = j.any(r.geometry);
                            if (!n) return "";
                            var o = "",
                                i = "";
                            if (e.simplestyle) {
                                var u = h(r.properties);
                                u &&
                                    (j.isPoint(r.geometry) && m(r.properties)
                                        ? (-1 === t.indexOf(u) &&
                                              ((o = d(r.properties, u)),
                                              t.push(u)),
                                          (i = S("styleUrl", "#" + u)))
                                        : (j.isPolygon(r.geometry) ||
                                              j.isLine(r.geometry)) &&
                                          k(r.properties) &&
                                          (-1 === t.indexOf(u) &&
                                              ((o = v(r.properties, u)),
                                              t.push(u)),
                                          (i = S("styleUrl", "#" + u))));
                            }
                            return (
                                o +
                                S(
                                    "Placemark",
                                    a(r.properties, e) +
                                        c(r.properties, e) +
                                        f(r.properties) +
                                        s(r.properties, e) +
                                        n +
                                        i
                                )
                            );
                        };
                    }
                    function o(e, t) {
                        if (!e.type) return "";
                        var r = [];
                        switch (e.type) {
                            case "FeatureCollection":
                                return e.features
                                    ? e.features.map(n(t, r)).join("")
                                    : "";
                            case "Feature":
                                return n(t, r)(e);
                            default:
                                return n(
                                    t,
                                    r
                                )({
                                    type: "Feature",
                                    geometry: e,
                                    properties: {},
                                });
                        }
                    }
                    function i(e) {
                        return void 0 !== e.documentName
                            ? S("name", e.documentName)
                            : "";
                    }
                    function u(e) {
                        return void 0 !== e.documentDescription
                            ? S("description", e.documentDescription)
                            : "";
                    }
                    function a(e, t) {
                        return e[t.name] ? S("name", L(e[t.name])) : "";
                    }
                    function c(e, t) {
                        return e[t.description]
                            ? S("description", L(e[t.description]))
                            : "";
                    }
                    function s(e, t) {
                        return e[t.timestamp]
                            ? S("TimeStamp", S("when", L(e[t.timestamp])))
                            : "";
                    }
                    function l(e) {
                        return e
                            .map(function (e) {
                                return e.join(",");
                            })
                            .join(" ");
                    }
                    function f(e) {
                        return S("ExtendedData", w(e).map(p).join(""));
                    }
                    function p(e) {
                        return S("Data", S("value", L(e[1])), [
                            ["name", L(e[0])],
                        ]);
                    }
                    function m(e) {
                        return !!(
                            e["marker-size"] ||
                            e["marker-symbol"] ||
                            e["marker-color"]
                        );
                    }
                    function d(e, t) {
                        return S(
                            "Style",
                            S("IconStyle", S("Icon", S("href", y(e)))) + g(e),
                            [["id", t]]
                        );
                    }
                    function y(e) {
                        var t = e["marker-size"] || "medium",
                            r = e["marker-symbol"]
                                ? "-" + e["marker-symbol"]
                                : "",
                            n = (e["marker-color"] || "7e7e7e").replace(
                                "#",
                                ""
                            );
                        return (
                            "https://api.tiles.mapbox.com/v3/marker/pin-" +
                            t.charAt(0) +
                            r +
                            "+" +
                            n +
                            ".png"
                        );
                    }
                    function g(e) {
                        return S("hotSpot", "", [
                            ["xunits", "fraction"],
                            ["yunits", "fraction"],
                            ["x", 0.5],
                            ["y", 0.5],
                        ]);
                    }
                    function k(e) {
                        for (var t in e)
                            if (
                                {
                                    stroke: !0,
                                    "stroke-opacity": !0,
                                    "stroke-width": !0,
                                    fill: !0,
                                    "fill-opacity": !0,
                                }[t]
                            )
                                return !0;
                    }
                    function v(e, t) {
                        var r = S("LineStyle", [
                                S(
                                    "color",
                                    x(e.stroke, e["stroke-opacity"]) ||
                                        "ff555555"
                                ) +
                                    S(
                                        "width",
                                        void 0 === e["stroke-width"]
                                            ? 2
                                            : e["stroke-width"]
                                    ),
                            ]),
                            n = "";
                        return (
                            (e.fill || e["fill-opacity"]) &&
                                (n = S("PolyStyle", [
                                    S(
                                        "color",
                                        x(e.fill, e["fill-opacity"]) ||
                                            "88555555"
                                    ),
                                ])),
                            S("Style", r + n, [["id", t]])
                        );
                    }
                    function h(e) {
                        var t = "";
                        return (
                            e["marker-symbol"] &&
                                (t = t + "ms" + e["marker-symbol"]),
                            e["marker-color"] &&
                                (t =
                                    t +
                                    "mc" +
                                    e["marker-color"].replace("#", "")),
                            e["marker-size"] &&
                                (t = t + "ms" + e["marker-size"]),
                            e.stroke &&
                                (t = t + "s" + e.stroke.replace("#", "")),
                            e["stroke-width"] &&
                                (t =
                                    t +
                                    "sw" +
                                    e["stroke-width"]
                                        .toString()
                                        .replace(".", "")),
                            e["stroke-opacity"] &&
                                (t =
                                    t +
                                    "mo" +
                                    e["stroke-opacity"]
                                        .toString()
                                        .replace(".", "")),
                            e.fill && (t = t + "f" + e.fill.replace("#", "")),
                            e["fill-opacity"] &&
                                (t =
                                    t +
                                    "fo" +
                                    e["fill-opacity"]
                                        .toString()
                                        .replace(".", "")),
                            t
                        );
                    }
                    function x(e, t) {
                        if ("string" != typeof e) return "";
                        if (3 === (e = e.replace("#", "").toLowerCase()).length)
                            e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2];
                        else if (6 !== e.length) return "";
                        var r = e[0] + e[1],
                            n = e[2] + e[3],
                            o = e[4] + e[5],
                            i = "ff";
                        return (
                            "number" == typeof t &&
                                t >= 0 &&
                                t <= 1 &&
                                ((i = (255 * t).toString(16)).indexOf(".") >
                                    -1 && (i = i.substr(0, i.indexOf("."))),
                                i.length < 2 && (i = "0" + i)),
                            i + o + n + r
                        );
                    }
                    function w(e) {
                        var t = [];
                        for (var r in e) t.push([r, e[r]]);
                        return t;
                    }
                    var P = e("strxml"),
                        S = P.tag,
                        L = P.encode;
                    t.exports = function (e, t) {
                        return (
                            (t = t || {
                                documentName: void 0,
                                documentDescription: void 0,
                                name: "name",
                                description: "description",
                                simplestyle: !1,
                                timestamp: "timestamp",
                            }),
                            '<?xml version="1.0" encoding="UTF-8"?>' +
                                S("kml", S("Document", i(t) + u(t) + o(e, t)), [
                                    ["xmlns", "http://www.opengis.net/kml/2.2"],
                                ])
                        );
                    };
                    var j = {
                        Point: function (e) {
                            return S(
                                "Point",
                                S("coordinates", e.coordinates.join(","))
                            );
                        },
                        LineString: function (e) {
                            return S(
                                "LineString",
                                S("coordinates", l(e.coordinates))
                            );
                        },
                        Polygon: function (e) {
                            if (!e.coordinates.length) return "";
                            var t = e.coordinates[0],
                                r = e.coordinates.slice(1),
                                n = S(
                                    "outerBoundaryIs",
                                    S("LinearRing", S("coordinates", l(t)))
                                ),
                                o = r
                                    .map(function (e) {
                                        return S(
                                            "innerBoundaryIs",
                                            S(
                                                "LinearRing",
                                                S("coordinates", l(e))
                                            )
                                        );
                                    })
                                    .join("");
                            return S("Polygon", n + o);
                        },
                        MultiPoint: function (e) {
                            return e.coordinates.length
                                ? S(
                                      "MultiGeometry",
                                      e.coordinates
                                          .map(function (e) {
                                              return j.Point({
                                                  coordinates: e,
                                              });
                                          })
                                          .join("")
                                  )
                                : "";
                        },
                        MultiPolygon: function (e) {
                            return e.coordinates.length
                                ? S(
                                      "MultiGeometry",
                                      e.coordinates
                                          .map(function (e) {
                                              return j.Polygon({
                                                  coordinates: e,
                                              });
                                          })
                                          .join("")
                                  )
                                : "";
                        },
                        MultiLineString: function (e) {
                            return e.coordinates.length
                                ? S(
                                      "MultiGeometry",
                                      e.coordinates
                                          .map(function (e) {
                                              return j.LineString({
                                                  coordinates: e,
                                              });
                                          })
                                          .join("")
                                  )
                                : "";
                        },
                        GeometryCollection: function (e) {
                            return S(
                                "MultiGeometry",
                                e.geometries.map(j.any).join("")
                            );
                        },
                        valid: function (e) {
                            return (
                                e &&
                                e.type &&
                                (e.coordinates ||
                                    ("GeometryCollection" === e.type &&
                                        e.geometries &&
                                        e.geometries.every(j.valid)))
                            );
                        },
                        any: function (e) {
                            return j[e.type] ? j[e.type](e) : "";
                        },
                        isPoint: function (e) {
                            return (
                                "Point" === e.type || "MultiPoint" === e.type
                            );
                        },
                        isPolygon: function (e) {
                            return (
                                "Polygon" === e.type ||
                                "MultiPolygon" === e.type
                            );
                        },
                        isLine: function (e) {
                            return (
                                "LineString" === e.type ||
                                "MultiLineString" === e.type
                            );
                        },
                    };
                },
                { strxml: 2 },
            ],
            2: [
                function (e, t, r) {
                    function n(e) {
                        return e && e.length
                            ? " " +
                                  e
                                      .map(function (e) {
                                          return e[0] + '="' + e[1] + '"';
                                      })
                                      .join(" ")
                            : "";
                    }
                    (t.exports.attr = n),
                        (t.exports.tagClose = function (e, t) {
                            return "<" + e + n(t) + "/>";
                        }),
                        (t.exports.tag = function (e, t, r) {
                            return "<" + e + n(r) + ">" + t + "</" + e + ">";
                        }),
                        (t.exports.encode = function (e) {
                            return (null === e ? "" : e.toString())
                                .replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/"/g, "&quot;");
                        });
                },
                {},
            ],
        },
        {},
        [1]
    )(1);
});
//# sourceMappingURL=/sm/d78098133d367fef0c2530983781f0739d3b5a8689271af4f6304807634a3a1f.map
