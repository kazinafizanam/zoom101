import { ZoomMtg } from "@zoomus/websdk";
import { useEffect } from "react";

const crypto = require("crypto");

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
    return new Promise((res, rej) => {
        const timestamp = new Date().getTime() - 30000;
        const msg = Buffer.from(
            apiKey + meetingNumber + timestamp + role
        ).toString("base64");
        const hash = crypto
            .createHmac("sha256", apiSecret)
            .update(msg)
            .digest("base64");
        const signature = Buffer.from(
            `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
        ).toString("base64");

        res(signature);
    });
}

var apiKey = "9g00irxhS_iLjWNkF7iHDw";
var apiSecret = "vJXbqIYZPGZMv5xhwnVKaqs5IKBfOmwAhNuu";
var meetingNumber = 8389683980;
var leaveUrl = "http://localhost:3000"; // our redirect url
var userName = "WEBSDK"; // host name
var userEmail = "";
var password = "8LTYbG";
var signature = "";

generateSignature(apiKey, apiSecret, meetingNumber, 0).then(
    (res) => (signature = res)
);

const Zoom = () => {
    useEffect(() => {
        showZoomDiv();
        ZoomMtg.setZomJSLib("https://source.zoom.us/1.9.0/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
        initiateMeeting();
    }, []);

    const showZoomDiv = () => {
        document.getElementById("zmmtg-root").style.display = "block";
    };

    const initiateMeeting = () => {
        ZoomMtg.init({
            leaveUrl: leaveUrl,
            isSupportAV: true,
            success: (success) => {
                console.log(success);

                ZoomMtg.join({
                    signature: signature,
                    meetingNumber: meetingNumber,
                    userName: userName,
                    apiKey: apiKey,
                    userEmail: userEmail,
                    password: password,
                    success: (success) => {
                        console.log(success);
                    },
                    error: (error) => {
                        console.log(error);
                    },
                });
            },
            error: (error) => {
                console.log(error);
            },
        });
    };

    return <div className="App">Zoom</div>;
};

export default Zoom;
