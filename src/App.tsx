import { Button } from './components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Default from '@/assets/default.png';
import { Input } from './components/ui/input';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import { Label } from '@radix-ui/react-label';

type PostsType = {
  post_id: string;
  user_id: string;
  post_context: string;
  post_image: string;
  post_isForSale: string;
  post_location: string;
  post_price: string;
  post_date: string;
  name: string;
  email: string;
};

type CommentsType = {
  comment_id: string;
  user_id: string;
  post_id: string;
  comment_content: string;
  created_at: string;
};
function App() {
  const [showMotorInput, setShowMotorInput] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [post_context, setPost_context] = useState('');
  const [post_image, setPost_image] = useState('');
  const [post_location, setPost_location] = useState('');
  const [post_price, setPost_price] = useState('');

  const [posts, setPosts] = useState<PostsType[]>([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentsType[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [postIndex, setPostIndex] = useState(0);

  const user_id = localStorage.getItem('motor_socmed') as string;

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [postID, setPostID] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const fetchAllPosts = () => {
    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`)
      .then((res) => {
        console.log(res.data);

        setPosts(res.data);
      });
  };

  const handlePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        user_id: localStorage.getItem('motor_socmed'),
        post_context,
        post_image,
        post_isForSale: isChecked === true ? 'True' : 'False',
        post_location,
        post_price,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          setShowMotorInput(false);
          window.location.reload();
        }
      });
  };

  const fetchALlComments = () => {
    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/comment.php`)
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
      });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setPost_image(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  useEffect(() => {
    fetchAllPosts();
    fetchALlComments();
  }, []);

  const handleDeletePost = (post_id: string) => {
    axios
      .delete(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        data: {
          post_id,
        },
      })
      .then((res) => {
        window.location.reload();

        console.log(res.data);
      });
  };

  const handleShowComments = (index: number) => {
    setShowComments(!showComments);
    console.log(index);
    setPostIndex(index);
  };

  const handleShowUpdate = (post_id: string) => {
    setShowUpdateForm(!showUpdateForm);
    setPostID(post_id);

    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        params: {
          post_id: post_id,
        },
      })
      .then((res) => {
        console.log(res.data);

        setPost_context(res.data[0].post_context);
        setPost_image(res.data[0].post_image);
        setIsChecked(res.data[0].post_isForSale === 'True' ? true : false);
        setPost_location(res.data[0].post_location);
        setPost_price(res.data[0].post_price);
      });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .put(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        post_id: postID,
        post_context,
        post_image,
        post_isForSale: isChecked === true ? 'True' : 'False',
        post_location,
        post_price,
      })
      .then((res) => {
        console.log(res.data);
        setShowUpdateForm(false);
        fetchAllPosts();
        // window.location.reload();
      });
  };

  const handleComment = (post_id: number) => {
    axios
      .post(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/comment.php`, {
        user_id: localStorage.getItem('motor_socmed'),
        post_id: post_id,
        comment_content: comment,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <div className="flex justify-center flex-col items-center relative">
      <div className=" bg-slate-50 w-full">
        <Header />

        <div className="mt-[10rem] fixed left-0 p-5 w-[20rem] z-40">
          <Button onClick={() => setShowMotorInput(!showMotorInput)}>
            {showMotorInput ? 'Close' : 'Post in Marketplace'}
          </Button>
        </div>

        {showMotorInput && (
          <div className="fixed bg-white w-full z-90 h-full border-2 flex justify-center bg-opacity-75">
            <div className="flex flex-col items-center justify-center gap-2 my-[2rem] w-[45rem] border-2 min-h-[30rem] h-fit mt-[15rem] bg-white p-4 rounded-md">
              <form onSubmit={handlePost}>
                <div className="flex gap-4">
                  <img
                    className="w-[8rem] h-[8rem] object-cover rounded-full"
                    src={Default}
                    alt="profile"
                  />

                  <div className="w-full">
                    <Textarea
                      onChange={(e) => setPost_context(e.target.value)}
                      required
                      placeholder="Type your message here."
                    />

                    <Input
                      required
                      type="file"
                      accept="image/*"
                      onChange={handleChangeImage}
                      name="post_image"
                      className="my-2 w-[30rem]"
                    />

                    <div className="flex justify-start gap-2 text-start w-[40%] items-center">
                      <Input
                        onChange={handleChange}
                        className="w-[1rem] cursor-pointer"
                        checked={isChecked}
                        type="checkbox"
                      />
                      <Label>Is for sale?</Label>
                    </div>
                    {isChecked && (
                      <>
                        <Input
                          onChange={(e) => setPost_location(e.target.value)}
                          placeholder="Location"
                          className="my-2 w-[30rem]"
                          type="text"
                        />
                        <Input
                          onChange={(e) => setPost_price(e.target.value)}
                          placeholder="Price"
                          className="my-2 w-[30rem]"
                          type="text"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-end gap-4">
                  <Button
                    className="bg-red-500"
                    onClick={() => setShowMotorInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Post</Button>
                </div>
              </form>

              {post_image.length > 0 && (
                <div className="w-full flex justify-center items-center">
                  <img
                    src={post_image}
                    alt="post"
                    className="w-[30rem] h-[30rem] object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {showUpdateForm && (
          <div className="fixed bg-white w-full z-90 h-full border-2 flex justify-center bg-opacity-75">
            <div className="flex flex-col items-center justify-center gap-2 my-[2rem] w-[45rem] border-2 min-h-[30rem] h-fit mt-[15rem] bg-white p-4 rounded-md">
              <form onSubmit={handleUpdate}>
                <div className="flex gap-4">
                  <img
                    className="w-[8rem] h-[8rem] object-cover rounded-full"
                    src={Default}
                    alt="profile"
                  />

                  <div className="w-full">
                    <Textarea
                      defaultValue={post_context}
                      onChange={(e) => setPost_context(e.target.value)}
                      placeholder="Type your message here."
                    />

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleChangeImage}
                      name="post_image"
                      className="my-2 w-[30rem]"
                    />

                    <div className="flex justify-start gap-2 text-start w-[40%] items-center">
                      <Input
                        onChange={handleChange}
                        className="w-[1rem] cursor-pointer"
                        checked={isChecked}
                        type="checkbox"
                      />
                      <Label>Is for sale?</Label>
                    </div>
                    {isChecked && (
                      <>
                        <Input
                          defaultValue={post_location}
                          onChange={(e) => setPost_location(e.target.value)}
                          placeholder="Location"
                          className="my-2 w-[30rem]"
                          type="text"
                        />
                        <Input
                          defaultValue={post_price}
                          onChange={(e) => setPost_price(e.target.value)}
                          placeholder="Price"
                          className="my-2 w-[30rem]"
                          type="text"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-end gap-4">
                  <Button
                    className="bg-red-500"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>

              {post_image.length > 0 && (
                <div className="w-full flex justify-center items-center">
                  <img
                    src={post_image}
                    alt="post"
                    className="w-[30rem] h-[30rem] object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="my-[2rem] flex justify-center flex-col items-center text-center mt-[10rem]">
          <div className="w-[60%] flex flex-col justify-center items-centerflex items-center">
            <div className=" w-[80%]">
              {posts &&
                posts.map((post, index) => {
                  return (
                    <div
                      key={index}
                      className="flex border-2 p-2 flex-col w-full mb-[5rem] text-start rounded-lg bg-white"
                    >
                      {parseInt(user_id) === parseInt(post.user_id) && (
                        <div className="self-end gap-2 flex my-2">
                          <Button
                            onClick={() => handleShowUpdate(post.post_id)}
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => handleDeletePost(post.post_id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}

                      <img
                        src={post!.post_image}
                        alt="no image available"
                        className="w-full h-[30rem] object-cover rounded-lg"
                      />

                      <div className="flex justify-between items-center w-full mt-1">
                        <div className="p-4 max-w-[35rem] break-words">
                          <h1 className="font-bold text-xl">{post.name}</h1>
                          <p className="cursor-pointer break-words">
                            {post.post_context}
                          </p>
                        </div>

                        {post.post_isForSale === 'True' && (
                          <div className="p-4 flex gap-4 w-[10rem] flex-col">
                            <div className="break-words w-full flex flex-col">
                              <p>{post.post_location}</p>
                              <p className="font-bold">{post.post_price}</p>
                            </div>

                            <div>
                              <Button
                                className="z-[-100]"
                                hidden={
                                  parseInt(user_id) === parseInt(post.user_id)
                                    ? true
                                    : false
                                }
                              >
                                Send Message
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 my-2">
                        <Button>1 Like</Button>
                        <Button onClick={() => handleShowComments(index)}>
                          {showComments ? 'Hide Comments' : ` Show Comments`}
                        </Button>
                      </div>

                      {showComments && postIndex === index && (
                        <div>
                          <div className="p-4">
                            {comments &&
                              comments.map((comment, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="flex gap-2 text-2xl"
                                  >
                                    <Link to={`/profile/${comment.user_id}`}>
                                      <img
                                        src={Default}
                                        alt="profile"
                                        className="w-[2rem] h-[2rem] rounded-full"
                                      />
                                    </Link>
                                    <p>{comment.comment_content}</p>
                                  </div>
                                );
                              })}
                          </div>

                          <div className="flex flex-col">
                            <Textarea
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Type your comment here."
                            />
                            <Button
                              onClick={() =>
                                handleComment(parseInt(post.post_id))
                              }
                              disabled={comment.length === 0 ? true : false}
                              className="my-2 self-end"
                            >
                              Submit comment
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
