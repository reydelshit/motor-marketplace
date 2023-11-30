import { Button } from './components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Pro from '@/assets/pro.jpg';
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
  const [showComments, setShowComments] = useState(false);
  const [postIndex, setPostIndex] = useState(0);

  const user_id = localStorage.getItem('motor_socmed') as string;

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
  }, []);

  const handleDeletePost = (post_id: string) => {
    axios
      .delete(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        data: {
          post_id,
        },
      })
      .then((res) => {
        if (res.data.status === 'success') {
          window.location.reload();
        }

        console.log(res.data);
      });
  };

  const handleShowComments = (index: number) => {
    setShowComments(!showComments);
    console.log(index);
    setPostIndex(index);
  };

  return (
    <div className="flex justify-center flex-col items-center relative">
      <div className=" bg-white w-full">
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
                    src={Pro}
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

        <div className="my-[2rem] flex justify-center flex-col items-center text-center mt-[10rem]">
          <div className="w-[60%] flex flex-col justify-center items-centerflex items-center">
            <div className=" w-[80%]">
              {posts &&
                posts.map((post, index) => {
                  return (
                    <div
                      key={index}
                      className="flex border-2 p-2 flex-col w-full mb-[5rem] text-start"
                    >
                      {parseInt(user_id) === parseInt(post.user_id) && (
                        <div className="self-end gap-2 flex my-2">
                          <Button>Update</Button>
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

                      <div className="flex justify-between items-center">
                        <div className="p-4">
                          <p className="cursor-pointer">{post.post_context}</p>
                        </div>

                        {post.post_isForSale === 'True' && (
                          <div className="p-4 flex gap-4 w-[100%]">
                            <div>
                              <p>{post.post_location}</p>
                              <p>{post.post_price}</p>
                            </div>

                            <div>
                              <Button
                                disabled={
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
                          {showComments ? 'Hide Comments' : 'Show Comments'}
                        </Button>
                      </div>

                      {showComments && postIndex === index && (
                        <div>
                          <h1>COMMENTS DIRIA</h1>
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
