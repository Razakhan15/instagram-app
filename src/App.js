import React, { useEffect, useState } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import Post from "./Post";
import { TextField } from "@mui/material";
import { Button } from "@react-md/button";
import { Dialog, DialogHeader } from "@react-md/dialog";
import { useToggle } from "@react-md/utils";
import ImageUpload from "./ImageUpload";

function App() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [visible, enable, disable] = useToggle(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    disable(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <div className="app_header">
        <img
          src="/images/instagram-text.svg"
          alt=""
          className="app_headerImage"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app_loginContainer">
            <Button id="simple-dialog-toggle" onClick={enable}>
              Sign UP
            </Button>
            <Button
              id="simple-dialog-toggle"
              onClick={() => setOpenSignIn(true)}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>

      <Dialog
        className="dialog"
        id="simple-dialog"
        visible={visible}
        onRequestClose={disable}
        aria-labelledby="dialog-title"
      >
        <DialogHeader>
          <img
            className="app_headerImg"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png"
            alt=""
          />
        </DialogHeader>
        <form className="app_signup">
          <TextField
            margin="dense"
            placeholder="username"
            type="text"
            value={username ? username : ""}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            placeholder="email"
            type="email"
            value={email ? email : ""}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            placeholder="password"
            type="password"
            value={password ? password : ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" id="dialog-close" onClick={signUp}>
            signUp
          </Button>
        </form>
      </Dialog>

      <Dialog
        className="dialog"
        id="simple-dialog"
        visible={openSignIn}
        onRequestClose={() => setOpenSignIn(false)}
        aria-labelledby="dialog-title"
      >
        <DialogHeader>
          <img
            className="app_headerImg"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png"
            alt=""
          />
        </DialogHeader>
        <form className="app_signup">
          <TextField
            margin="dense"
            placeholder="email"
            type="email"
            value={email ? email : ""}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            placeholder="password"
            type="password"
            value={password ? password : ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" id="dialog-close" onClick={signIn}>
            signIn
          </Button>
        </form>
      </Dialog>

      <div className="app_posts">
        <div className="app_postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
       
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry! you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
