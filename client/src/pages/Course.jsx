import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { apiUrl } from "../api";

const Add = styled.section`
  min-height: 80vh;
  background-color: black;
  .title {
    color: white;
    text-align: center;
    font-size: 4rem;
    margin-bottom: 1rem;
    padding-top: 100px;
  }
  .lipg {
    justify-content: space-around;
    display: flex;
  }

  .frm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: azure;
    padding: 6rem 4rem;
    border-radius: 5px;
    gap: 3rem;

  }

  h2 {
    text-align: center;
    font-size: 25px;
  }
  label{
    display: block;
    margin-bottom: 1rem;
  }

  
  span {
    font-size: 20px;
  }

  #pass {
    width: 350px;
    height: 30px;
  }
  

  button {
    border: none;
    width: 350px;
    height: 40px;
    background-color: rgb(0, 113, 243);
    font-size: 13px;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    cursor: pointer;
  }

  .fp {
    text-align: center;
  }

  .da {
    text-align: center;
  }

  a {
    text-decoration: none;
  }
  .card {
    width: 300px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: white;
  }

  .card-content {
    padding: 20px;
  }

  .card h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  .input-group{
    input{
      padding: 1rem 2rem;
      width: 100%;
      font-size: 1.4rem;
    }
    select{
      font-size: 1.4rem;
      padding: 1rem;
    }
  }

  .card p {
    margin: 10px 0;
  }
  .list {
    padding: 0 4rem;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    
    padding-top: 80px;
    gap: 4rem;
  }
  


  .list-content,
  .l2 {
    width:100%;
    height: 60rem;
    padding: 4rem;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow: hidden;
    background-color: azure;

    h2{
      height: 8rem;
      margin-bottom: 4rem;
    }
  }

  .list-content img,
  .l2 img {
    width: 100%;
    height: 80%;
    object-fit: cover;
  }
`;
const Course = ({ deaf }) => {

  const { role } = useAuth();

  const [url, seturl] = useState("");
  const [file, setfile] = useState();
  const [title, setTitle] = useState("")
  const [data, setdata] = useState([]);
  const [audio, setAudio] = useState(false)

  const uploadCourse = () => {
    const formData = new FormData();
    console.log(audio);
    formData.append("audio", audio)
    formData.append("title", title)
    formData.append("url", url);
    formData.append("thumbnail", file);

    axios
      .post(apiUrl + "/uploadCourse", formData)
      .then((response) => {
        window.alert("success");
        getCourse();
      })
      .catch((err) => {
        window.alert("something wrong");
      });
  };


  const getCourse = () => {
    console.log("befor get deaf is", deaf);

    axios
      .get(apiUrl + `/getCourses/${deaf}`)
      .then((response) => {
        console.log(response);
        setdata(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <Add>
      <div className="title">Learn Course</div>
      <div className="lipg">
        {role === "mentor" && (
          <div className="frm">
            <h2>Upload Content</h2>
            <div className="input-group">
              <label htmlFor="title"><span>Title</span></label>
              <input type="text " id="title" placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}

              />

            </div>
            <div className="input-group">

              <label htmlFor="email">
                <span>Upload image :</span>
              </label>

              <input
                type="file"
                placeholder="add thumnail"
                id="file"
                onChange={(e) => {
                  setfile(e.target.files[0]);
                }}
              />
            </div>

            <div className="input-group">

              <label htmlFor="text">
                <span>Upload URL :</span>
              </label>

              <input
                type="text"
                placeholder="Enter url"
                id="text"
                onChange={(e) => seturl(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="audio"><span>Course with Audio</span></label>
              <select name="audio" id="audio" onChange={(e) => setAudio(e.target.value)}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>

            </div>
            <div className="input-group">

              <button onClick={uploadCourse}>SUBMIT</button>
            </div>

          </div>
        )}


      </div>
      <div className="list">
      {data[0] &&
        data.map((item) => (
          <div className="list-content" key={item._id}>
            <a href={item.url} target="blank">
            <h2>{item.title}</h2>
              <img src={apiUrl + "/" + item.file} alt={item.title} />
            {/* Delete button */}
              </a>
            <button
              onClick={() => handleDelete(item._id)}
              style={{
                marginTop: "1rem",
                marginBottom: "3rem",
                padding: "0.5rem 1rem",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              >
              Delete
            </button>
          </div>
        ))}
    </div>
    </Add>
  );
};

export default Course;
