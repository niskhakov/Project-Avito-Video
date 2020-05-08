import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faBars,
  faCamera,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import getLocalStream, { localStream } from "./config/webrtc"

let stream;

const constraints = (window.constraints = {
  audio: true,
  video: true,
});


async function initCall(callDetails) {
  try {
    getLocalStream(document.querySelector("#remoteVideo"), document.querySelector("#localVideo"), constraints, callDetails)
    handleVideo(true)
  } catch (e) {
    handleError(e)
  }
}

async function hangupCall(afterTurnOff) {
  localStream.getTracks().forEach((track) => track.stop());
  handleVideo(false);
  afterTurnOff();
}

function handleVideo(videoState) {
  const video = document.querySelector("#remoteVideo");
  // const localVideo = window.querySelector("#localVideo")
  const phoneOn = document.querySelector("#phone-icon-on");
  const phoneOff = document.querySelector("#phone-icon-off");
  if (videoState) {
    // const videoTracks = stream.getVideoTracks();
    video.classList.remove("contact-video");
    phoneOn.classList.add("d-none");
    phoneOff.classList.remove("d-none");
    console.log("Got stream with constraints:", constraints);
    // console.log(`Using video device: ${videoTracks[0].label}`);
    // window.stream = stream; // make variable available to browser console
    // video.srcObject = stream;
  } else {
    // video.srcObject = null;
    video.removeAttribute("src");
    video.removeAttribute("srcObject");

    phoneOn.classList.remove("d-none");
    phoneOff.classList.add("d-none");
    video.classList.add("contact-video");
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
// init(e, () => {
//   setPage("Contacts", extra);
// })


const Call = ({ setPage, extra }) => {
  console.log(extra)
  let selectedUser = extra.selectedUser || ["incomingCall", "incoming call"]
  const username = selectedUser[0];
  const realname = selectedUser[1];

  // Start connection after component did mount
  useEffect(() => {

    const callDetails = {
      caller: {
        username: extra.currentUser[0],
        authToken: `##token##${extra.currentUser[0]}##` // TODO: transmit real token
      },
      callInfo: {
        "from": extra.currentUser[0],
        "to": username
      },
      acceptCall: username === "incoming" ? true : false
    }

    initCall(callDetails)
  })


  return (
    <div className="row align-items-center height">
      <div className="col-xl-8 justify-content-center my-5">
        <div className="row flex-column align-content-center justify-content-between w-100">
          <div className="video-container d-flex justify-content-center overflow-hidden align-items-center">
            <video
              id="remoteVideo"
              autoPlay
              className="contact-video rounded"
            ></video>
          </div>
          <div className="row align-items-center justify-content-center">
            <button
              id="showVideo"
              className="btn btn-outline-primary m-2 p-2 d-none"
            >
              Open/Close camera #test
            </button>

            <div
              className="btn btn-outline-info disabled btn-info-id m-2 p-2"
              style={{ cursor: "default" }}
            >
              @{username}
            </div>
          </div>

          <div id="errorMsg"></div>
        </div>
        <div className="row justify-content-around mt-5 mb-2">
          <div
            id="hangUpBtn"
            style={{ cursor: "pointer" }}
            onClick={() =>
              hangupCall(() => setPage("Contacts", extra))
            }
          >
            <FontAwesomeIcon
              icon={faPhone}
              size="4x"
              className="text-success"
              id="phone-icon-on"
            />
            <FontAwesomeIcon
              icon={faPhoneSlash}
              size="4x"
              className="text-danger d-none"
              id="phone-icon-off"
            />
          </div>
          <div>
            <FontAwesomeIcon
              icon={faCamera}
              size="4x"
              className="text-secondary"
            />
          </div>
          <div>
            <FontAwesomeIcon icon={faBars} size="4x" />
          </div>
        </div>
      </div>
      <div className="col-xl-4 d-flex justify-content-center">
        <div className="row bootstrap snippets">
          <div className="col">
            <div className="d-flex justify-content-center"><video
              id="localVideo"
              autoPlay
              className="rounded m-4 w-75"
              muted="muted"
            ></video></div>
            <div className="comment-wrapper">
              <div className="panel panel-info">
                <h3 className="text-center my-3">Чат</h3>

                <div className="panel-body">
                  <ul className="media-list pl-0">
                    <li className="media">
                      <div className="px-3">
                        <img
                          src={`https://robohash.org/${username}has?set=set4`}
                          alt="User"
                          className="img-circle"
                        />
                      </div>
                      <div className="media-body">
                        <strong className="text-success">{realname}</strong>
                        <p>
                          Lorem ipsum, dolor sit amet consectetur adipisicing
                          elit. Modi praesentium quae voluptates delectus
                          facilis beatae.
                        </p>
                      </div>
                    </li>
                    <li className="media">
                      <a href="#" className="px-3">
                        <img
                          src="https://bootdey.com/img/Content/user_1.jpg"
                          alt=""
                          className="img-circle"
                        />
                      </a>
                      <div className="media-body">
                        <strong className="text-success">Владислав</strong>
                        <p>
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit.
                        </p>
                      </div>
                    </li>
                    <li className="media">
                      <a href="#" className="px-3">
                        <img
                          src={`https://robohash.org/${username}has?set=set4`}
                          alt=""
                          className="img-circle"
                        />
                      </a>
                      <div className="media-body">
                        <strong className="text-success">{realname}</strong>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit.
                        </p>
                      </div>
                    </li>
                  </ul>
                  <div className="clearfix"></div>
                  <textarea
                    className="form-control"
                    placeholder="отправить в чат..."
                    rows="3"
                  ></textarea>
                  <br />
                  <button
                    type="button"
                    className="btn btn-outline-primary mx-2"
                  >
                    Отправить
                  </button>

                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Call;
