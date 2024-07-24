import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import {
  deleteCourseLecture,
  getCourseLecture,
} from "../../Redux/lectureSlice";

const DisplayLectures = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const courseDetails = location.state;

  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Function to handle lecture delete
  const handleLectureDelete = async (courseId, lectureId) => {
    try {
      await dispatch(deleteCourseLecture({ courseId, lectureId }));
      await dispatch(getCourseLecture(courseId));
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };

  // Fetching the course lecture data
  useEffect(() => {
    if (courseDetails?._id) {
      dispatch(getCourseLecture(courseDetails._id))
        .unwrap()
        .then((data) => {
          console.log("Fetched lectures:", data);
        })
        .catch((error) => {
          console.error("Error fetching lectures:", error);
        });
    }
  }, [dispatch, courseDetails?._id]);

  return (
    <Layout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-[5%]">
        {/* Displaying the course name */}
        <h1 className="text-center text-2xl font-semibold text-yellow-500">
          Course Name : {courseDetails?.title}
        </h1>

        <div className="flex justify-center gap-10 w-full">
          {/* Left section for playing the video and displaying course details to admin */}
          <div className="space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
            <video
              className="object-fill rounded-tl-lg rounded-tr-lg w-full"
              src={lectures?.[currentVideoIndex]?.lecture?.secure_url}
              controls
              disablePictureInPicture
              muted
              controlsList="nodownload"
            ></video>
            <div>
              <h1>
                <span className="text-yellow-500">Title : </span>
                {lectures?.[currentVideoIndex]?.title}
              </h1>
              <p>
                <span className="text-yellow-500 line-clamp-4">
                  Description :{" "}
                </span>
                {lectures?.[currentVideoIndex]?.description}
              </p>
            </div>
          </div>

          {/* Right section for displaying all the lectures of the course */}
          <ul className="w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">
            <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
              <p>Lectures List</p>
              {role === "ADMIN" && (
                <button
                  onClick={() =>
                    navigate("/course/addlecture", {
                      state: courseDetails,
                    })
                  }
                  className="btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                >
                  Add New Lecture
                </button>
              )}
            </li>
            {lectures?.map((element, index) => (
              <li className="space-y-2" key={element._id}>
                <p
                  className="cursor-pointer"
                  onClick={() => setCurrentVideoIndex(index)}
                >
                  <span className="text-yellow-500">
                    Lecture {index + 1} :
                  </span>{" "}
                  {element?.title}
                </p>
                {role === "ADMIN" && (
                  <button
                    onClick={() =>
                      handleLectureDelete(courseDetails?._id, element?._id)
                    }
                    className="btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                  >
                    Delete Lecture
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DisplayLectures;
