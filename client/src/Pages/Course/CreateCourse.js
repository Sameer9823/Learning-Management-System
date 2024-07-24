import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { createNewCourse, updateCourse } from "../../Redux/courseSlice";
import { AiOutlineArrowLeft } from "react-icons/ai";

const CreateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // for getting the data from location of previous component
  const initialCourseData = location.state?.initialCourseData || {};

  // for toggling disable of image input box
  const [isDisabled, setIsDisabled] = useState(!initialCourseData?.newCourse);

  // for storing the user input
  const [userInput, setUserInput] = useState({
    title: initialCourseData?.title || "",
    category: initialCourseData?.category || "",
    createdBy: initialCourseData?.createdBy || "",
    description: initialCourseData?.description || "",
    thumbnail: null,
    previewImage: initialCourseData?.thumbnail?.secure_url || "",
  });

  useEffect(() => {
    console.log("Initial course data:", initialCourseData);
  }, [initialCourseData]);

  // function to handle the image upload
  const getImage = (event) => {
    event.preventDefault();
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          thumbnail: uploadedImage,
        });
      });
    }
  };

  // function to handle user input
  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  // function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    let res = undefined;

    if (initialCourseData.newCourse) {
      // for creating a new course
      if (
        !userInput.title ||
        !userInput.category ||
        !userInput.createdBy ||
        !userInput.description ||
        !userInput.thumbnail
      ) {
        toast.error("All fields are mandatory");
        return;
      }

      try {
        res = await dispatch(createNewCourse(userInput));
      } catch (error) {
        console.error("Error creating course:", error);
        toast.error("Failed to create course");
      }
    } else {
      // for updating an existing course
      if (
        !userInput.title ||
        !userInput.category ||
        !userInput.createdBy ||
        !userInput.description
      ) {
        toast.error("All fields are mandatory");
        return;
      }

      const data = { ...userInput, id: initialCourseData._id };

      try {
        res = await dispatch(updateCourse(data));
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Failed to update course");
      }
    }

    if (res?.payload?.success) {
      setUserInput({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail: null,
        previewImage: "",
      });

      setIsDisabled(false);

      navigate("/admin/dashboard");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] h-[450px] my-10 shadow-[0_0_10px_black] relative"
        >
          <Link
            to={"/admin/dashboard"}
            className="absolute top-8 text-2xl link text-accent cursor-pointer"
          >
            <AiOutlineArrowLeft />
          </Link>

          <h1 className="text-center text-2xl font-bold">
            {!initialCourseData.newCourse ? "Update" : "Create new"}{" "}
            <span>Course</span>
          </h1>

          <main className="grid grid-cols-2 gap-x-10">
            <div className="space-y-6">
              <div
                onClick={() =>
                  !initialCourseData.newCourse
                    ? toast.error("Cannot update thumbnail image")
                    : ""
                }
              >
                <label className="cursor-pointer" htmlFor="image_uploads">
                  {userInput.previewImage ? (
                    <img
                      className="w-full h-44 m-auto border"
                      src={userInput.previewImage}
                      alt="preview image"
                    />
                  ) : (
                    <div className="w-full h-44 m-auto flex items-center justify-center border">
                      <h1 className="font-bold text-lg">
                        Upload your course thumbnail
                      </h1>
                    </div>
                  )}
                </label>
                <input
                  onChange={getImage}
                  className="hidden"
                  type="file"
                  id="image_uploads"
                  name="image_uploads"
                  accept=".jpg, .jpeg, .png"
                  disabled={isDisabled}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="title">
                  Course Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter the course title"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.title}
                  onChange={handleUserInput}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="createdBy">
                  Instructor Name
                </label>
                <input
                  required
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Enter the instructor name"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.createdBy}
                  onChange={handleUserInput}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="category">
                  Course Category
                </label>
                <input
                  required
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter the category name"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.category}
                  onChange={handleUserInput}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="description">
                  Course Description
                </label>
                <textarea
                  required
                  name="description"
                  id="description"
                  placeholder="Enter the course description"
                  className="bg-transparent px-2 py-1 border h-24 overflow-y-scroll resize-none"
                  value={userInput.description}
                  onChange={handleUserInput}
                />
              </div>
            </div>
          </main>

          <button
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            {!initialCourseData.newCourse ? "Update Course" : "Create Course"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateCourse;
