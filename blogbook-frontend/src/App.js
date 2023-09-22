import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet
} from "react-router-dom";

import Activity from "./pages/Activity"
import Login from "./pages/Login"
import Post from "./pages/Post"
import Register from "./pages/Register"
import View from "./pages/View"

import BlogBookSidebar from "./components/BlogBookSidebar";
import BlogBookNavBar from "./components/BlogBookNavBar";

import './App.css';

const Layout = ()=>{
  return (
    <>
        <div id="app" style={({ height: "100vh" }, { display: "flex" })}>
          <BlogBookSidebar></BlogBookSidebar>
          <div style={({ width:'100%', alignContent:"center", height: "100vh" })}>
            <BlogBookNavBar></BlogBookNavBar>
            <Outlet></Outlet>
          </div>
        </div>
    </>
  )
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout></Layout>,
      children:[
        {
          path: "/",
          element: <Activity></Activity>
        },
        {
          path: "/activity",
          element: <Activity></Activity>
        },
        {
          path: "/Login",
          element: <Login></Login>
        },
        {
          path: "/Post",
          element: <Post></Post>
        },
        {
          path: "/register",
          element: <Register></Register>
        },
        {
          path: "/View/:post_id",
          element: <View></View>
        }
      ]
    }
  ]
)

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
