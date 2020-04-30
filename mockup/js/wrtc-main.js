"use strict";

// Put variables in global scope to make them available to the browser console.
const constraints = (window.constraints = {
  audio: false,
  video: true,
});

let ENABLED_VIDEO = false;

function handleSuccess(stream) {
  const video = document.querySelector("video");
  if (!ENABLED_VIDEO) {
    const videoTracks = stream.getVideoTracks();
    video.classList.remove("contact-video");

    const phoneIcon = document.querySelector("#phone-icon");
    phoneIcon.classList.remove("fa-phone");
    phoneIcon.classList.remove("text-success");
    phoneIcon.classList.add("fa-phone-slash");
    phoneIcon.classList.add("text-danger");

    console.log("Got stream with constraints:", constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
    ENABLED_VIDEO = true;
  } else {
    video.srcObject = null;
    video.classList.add("contact-video");
    const phoneIcon = document.querySelector("#phone-icon");
    phoneIcon.classList.remove("fa-phone-slash");
    phoneIcon.classList.remove("text-danger");
    phoneIcon.classList.add("fa-phone");
    phoneIcon.classList.add("text-success");
    ENABLED_VIDEO = false;
  }
}

function handleError(error) {
  if (error.name === "ConstraintNotSatisfiedError") {
    const v = constraints.video;
    errorMsg(
      `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`
    );
  } else if (error.name === "PermissionDeniedError") {
    errorMsg(
      "Permissions have not been granted to use your camera and " +
        "microphone, you need to allow the page access to your devices in " +
        "order for the demo to work."
    );
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector("#errorMsg");
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== "undefined") {
    console.error(error);
  }
}

async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    handleError(e);
  }
}

document.querySelector("#showVideo").addEventListener("click", (e) => init(e));
document.querySelector("#phone-call").addEventListener("click", (e) => init(e));
