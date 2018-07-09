$(function () {
    var p = "ws";
    if (location.protocol == 'https:') {
        p = "wss";
    } else {
        p = "ws";
    }
    w = new Ws(p + "://" + HOST + "/ws");

    w.OnConnect(function () {
        console.log("Connected")
    });

    w.OnDisconnect(function () {
        console.log("Disonnected")
    });

    var logo = document.getElementById("imgLogo");

    logoStyle = logo.style,
        _transform = "WebkitTransform" in logoStyle ? "WebkitTransform" :
            "MozTransform" in logoStyle ? "MozTransform" :
                "msTransform" in logoStyle ? "msTransform" : false;

    _transform && w.OnMessage(function (message) {
        var data = JSON.parse(message);

        var gamma = data.gamma;
        var beta = data.beta;
        var alpha = data.alpha;

        //Image rotation
        logoStyle[_transform] = "rotateY(" + gamma + "deg) rotateX(" + (-beta) + "deg) rotateZ(" + (-alpha) + "deg)";

        changeColor(gamma, beta);

        // gamma is the left-to-right tilt in degrees
        $("#gammas").text(gamma);
        // beta is the front-to-back tilt in degrees
        $("#betas").text(beta);
        // alpha is the compass direction the device is facing in degrees
        $("#alphas").text(alpha);

    });

    w.On("ID", function (message) {
        var txt = '<img src="https://api.qrserver.com/v1/create-qr-code/?data=' + location.href + 'device?id=' + message + '&amp;size=200x200" alt="" title="" />'
        $("#qr").append(txt)
    });

    w.On("CON", function () {
        $("#qr,#info").hide();
    })

    w.On("DC", function () {
        $("#qr,#info").show();
    })
});

window.onload = function () {
    var img = document.getElementById("wheel");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    colordiv = document.getElementById("color");
};

function changeColor(x, y) {
    Number.prototype.clamp = function (min, max) {
        return (Math.min(max, Math.max(min, this)));
    };

    x += 90;
    y += 90;

    y = y.clamp(90 - Math.sqrt((180 * x) - Math.pow(x, 2)), 90 + Math.sqrt((180 * x) - Math.pow(x, 2)));
    x = x.clamp(90 - Math.sqrt((180 * y) - Math.pow(y, 2)), 90 + Math.sqrt((180 * y) - Math.pow(y, 2)));

    var pxd = context.getImageData(x, y, 1, 1).data;
    var r = pxd[0];
    var g = pxd[1];
    var b = pxd[2];
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    $("#thcolor").attr("content", hex);
    colordiv.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
}
