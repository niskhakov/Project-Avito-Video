import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faBars,
  faCamera,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons";

let ENABLED_VIDEO = null;

let stream;

const constraints = (window.constraints = {
  audio: false,
  video: true,
});

async function init(e, turnOff) {
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    if (ENABLED_VIDEO === false) {
      setTimeout(() => {
        turnOff();
        stream.getTracks().forEach((track) => track.stop());
      }, 1000);
    }
  } catch (e) {
    handleError(e);
  }
}

function handleSuccess(stream) {
  const video = document.querySelector("video");
  const phoneOn = document.querySelector("#phone-icon-on");
  const phoneOff = document.querySelector("#phone-icon-off");
  if (!ENABLED_VIDEO) {
    const videoTracks = stream.getVideoTracks();
    video.classList.remove("contact-video");
    phoneOn.classList.add("d-none");
    phoneOff.classList.remove("d-none");
    console.log("Got stream with constraints:", constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
    ENABLED_VIDEO = true;
  } else {
    video.srcObject = null;
    video.removeAttribute("src");
    video.removeAttribute("srcObject");

    phoneOn.classList.remove("d-none");
    phoneOff.classList.add("d-none");
    video.classList.add("contact-video");

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

const Call = ({ setPage, extra }) => {
  const username = extra[0];
  const realname = extra[1];
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
              className="btn btn-outline-primary m-2 p-2"
              onClick={(e) =>
                init(e, () => {
                  setPage("Contacts", extra);
                })
              }
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
            onClick={(e) =>
              init(e, () => {
                setPage("Contacts", extra);
              })
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
            <div className="comment-wrapper">
              <div className="panel panel-info">
                <h3 className="text-center my-3">Чат</h3>

                <div className="panel-body">
                  <ul className="media-list pl-0">
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
